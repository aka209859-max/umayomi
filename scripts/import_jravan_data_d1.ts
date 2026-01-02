/**
 * UMAYOMI - JRA-VAN一括取り込みスクリプト（Cloudflare D1版）
 * 
 * CEO PCでの実行を想定（E:\JRAVAN\）
 * 
 * Cloudflare D1対応:
 * - better-sqlite3の代わりにWrangler CLIを使用
 * - バッチSQLファイルを生成して wrangler d1 execute で実行
 * 
 * 対象パーサー（11種類）:
 * - SE, TM, JG, BY, OW, SCHD (既存6種)
 * - SK, HN, BT, BR, HS (新規5種)
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import iconv from 'iconv-lite';

// パーサーインポート
import { SEParser } from '../src/parsers/jravan/se';
import { TMParser } from '../src/parsers/jravan/tm';
import { JGParser } from '../src/parsers/jravan/jg';
import { BYParser } from '../src/parsers/jravan/by';
import { OWParser } from '../src/parsers/jravan/ow';
import { SCHDParser } from '../src/parsers/jravan/schd';
import { SKParser } from '../src/parsers/jravan/sk';
import { HNParser } from '../src/parsers/jravan/hn';
import { BTParser } from '../src/parsers/jravan/bt';
import { BRParser } from '../src/parsers/jravan/br';
import { HSParser } from '../src/parsers/jravan/hs';

// ================================================
// 設定
// ================================================

const JRAVAN_BASE_PATH = 'E:\\JRAVAN';
const SQL_OUTPUT_DIR = '.\\sql_import_jravan';
const DB_NAME = 'umayomi-production';
const BATCH_SIZE = 500; // 1バッチあたりのINSERT数

// ================================================
// SQLエスケープ関数
// ================================================

function escapeSql(value: any): string {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  // 文字列のシングルクォートをエスケープ
  return `'${String(value).replace(/'/g, "''")}'`;
}

// ================================================
// バッチSQLファイル生成
// ================================================

function generateBatchSQL(
  tableName: string,
  records: any[],
  columns: string[],
  batchIndex: number
): string {
  const sqlLines: string[] = [];
  
  sqlLines.push(`-- ${tableName} Batch ${batchIndex + 1} (${records.length} records)`);
  sqlLines.push('BEGIN TRANSACTION;');
  
  for (const record of records) {
    const values = columns.map(col => escapeSql(record[col])).join(', ');
    sqlLines.push(`INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values});`);
  }
  
  sqlLines.push('COMMIT;');
  sqlLines.push('');
  
  return sqlLines.join('\n');
}

// ================================================
// Wrangler D1実行関数
// ================================================

function executeD1SQL(sqlFilePath: string): void {
  const command = `npx wrangler d1 execute ${DB_NAME} --local --file="${sqlFilePath}"`;
  
  try {
    execSync(command, {
      stdio: 'inherit',
      encoding: 'utf-8',
      shell: 'powershell.exe'
    });
  } catch (error: any) {
    console.error(`❌ SQL実行エラー: ${sqlFilePath}`);
    throw error;
  }
}

// ================================================
// データ取り込みメイン関数
// ================================================

async function importFileType(
  filePattern: string | RegExp,
  tableName: string,
  parser: any,
  columns: string[],
  subdirectory: string = '',
  encoding: 'utf-8' | 'shift-jis' = 'shift-jis'
) {
  console.log(`\n📊 ${tableName} 取り込み中...`);
  
  const searchPath = subdirectory 
    ? path.join(JRAVAN_BASE_PATH, subdirectory)
    : JRAVAN_BASE_PATH;
  
  if (!fs.existsSync(searchPath)) {
    console.log(`⚠️  ディレクトリが見つかりません: ${searchPath}`);
    return;
  }
  
  // ファイル検索
  const allFiles: string[] = [];
  
  function scanDirectory(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        scanDirectory(fullPath);
      } else if (entry.isFile()) {
        const matches = typeof filePattern === 'string'
          ? entry.name.includes(filePattern)
          : filePattern.test(entry.name);
        
        if (matches) {
          allFiles.push(fullPath);
        }
      }
    }
  }
  
  scanDirectory(searchPath);
  
  if (allFiles.length === 0) {
    console.log(`⚠️  対象ファイルが見つかりません`);
    return;
  }
  
  console.log(`   ファイル数: ${allFiles.length}件`);
  
  let totalRecords = 0;
  let allRecords: any[] = [];
  
  // 全ファイルをパース
  for (let i = 0; i < allFiles.length; i++) {
    const filePath = allFiles[i];
    
    try {
      let content: string;
      
      if (encoding === 'shift-jis') {
        const buffer = fs.readFileSync(filePath);
        content = iconv.decode(buffer, 'shift-jis');
      } else {
        content = fs.readFileSync(filePath, 'utf-8');
      }
      
      const parserInstance = new parser();
      const records = parserInstance.parse(content);
      allRecords.push(...records);
      totalRecords += records.length;
      
      if ((i + 1) % 50 === 0 || i === allFiles.length - 1) {
        process.stdout.write(`\r   パース進捗: ${i + 1}/${allFiles.length} ファイル (${totalRecords}件)`);
      }
    } catch (error: any) {
      console.error(`\n⚠️  ファイルパースエラー: ${filePath}`, error.message);
    }
  }
  
  console.log(`\n   パース完了: ${totalRecords}件`);
  
  if (totalRecords === 0) {
    console.log(`⚠️  取り込むレコードがありません`);
    return;
  }
  
  // バッチSQL生成とD1実行
  console.log(`   SQL生成・実行中...`);
  
  const batchCount = Math.ceil(allRecords.length / BATCH_SIZE);
  
  for (let i = 0; i < batchCount; i++) {
    const start = i * BATCH_SIZE;
    const end = Math.min(start + BATCH_SIZE, allRecords.length);
    const batch = allRecords.slice(start, end);
    
    const sql = generateBatchSQL(tableName, batch, columns, i);
    const sqlFileName = `${tableName}_batch_${String(i + 1).padStart(4, '0')}.sql`;
    const sqlFilePath = path.join(SQL_OUTPUT_DIR, sqlFileName);
    
    // SQL一時ファイル作成
    fs.writeFileSync(sqlFilePath, sql, 'utf-8');
    
    // Wrangler D1実行
    try {
      executeD1SQL(sqlFilePath);
      process.stdout.write(`\r   実行進捗: ${end}/${allRecords.length} レコード (バッチ ${i + 1}/${batchCount})`);
    } catch (error) {
      console.error(`\n❌ バッチ${i + 1}の実行に失敗`);
      throw error;
    } finally {
      // 一時SQLファイル削除
      fs.unlinkSync(sqlFilePath);
    }
  }
  
  console.log(`\n✅ ${tableName} 完了: ${totalRecords}件`);
}

// ================================================
// メイン処理
// ================================================

async function importJRAVANData() {
  console.log('🚀 JRA-VAN一括取り込み開始（Cloudflare D1版）\n');
  console.log(`📂 読み込み元: ${JRAVAN_BASE_PATH}`);
  console.log(`💾 保存先DB: ${DB_NAME} (Cloudflare D1 --local)\n`);
  
  // SQL一時ディレクトリ作成
  if (!fs.existsSync(SQL_OUTPUT_DIR)) {
    fs.mkdirSync(SQL_OUTPUT_DIR, { recursive: true });
  }
  
  try {
    // 1. SE (成績データ)
    await importFileType(
      /SE\d{8}\.txt/,
      'jravan_se',
      SEParser,
      ['race_key', 'race_date', 'track_code', 'race_number', 'horse_number',
       'horse_id', 'finish_position', 'time', 'margin', 'jockey_id', 'raw_data'],
      'SE_DATA'
    );
    
    // 2. TM (調教データ)
    await importFileType(
      /TM\d{8}\.txt/,
      'jravan_tm',
      TMParser,
      ['horse_id', 'training_date', 'training_course', 'training_time',
       'training_type', 'raw_data'],
      'ES_DATA'
    );
    
    // 3. JG (騎手情報)
    await importFileType(
      /JG\d{8}\.txt/,
      'jravan_jg',
      JGParser,
      ['jockey_id', 'jockey_name', 'affiliation', 'birth_date', 'raw_data'],
      'HY_DATA'
    );
    
    // 4. BY (馬基本情報)
    await importFileType(
      /BY\d{8}\.txt/,
      'jravan_by',
      BYParser,
      ['horse_id', 'horse_name', 'birth_date', 'sex', 'sire_id', 'dam_id', 'raw_data'],
      'BY_DATA'
    );
    
    // 5. OW (オッズ・ワイド)
    await importFileType(
      /OW\d{8}\.txt/,
      'jravan_ow',
      OWParser,
      ['race_key', 'odds_data', 'raw_data'],
      'OW_DATA'
    );
    
    // 6. SCHD (開催スケジュール)
    await importFileType(
      /SCHD\d{8}\.txt/,
      'jravan_schd',
      SCHDParser,
      ['schedule_date', 'track_code', 'race_count', 'raw_data'],
      'SE_DATA'
    );
    
    // 7. SK (競走馬基本情報) - 新規
    await importFileType(
      /SK\d{8}\.txt/,
      'jravan_sk',
      SKParser,
      ['horse_id', 'registration_number', 'horse_name', 'raw_data'],
      'UM_DATA'
    );
    
    // 8. HN (馬名データ) - 新規
    await importFileType(
      /HN\d{8}\.txt/,
      'jravan_hn',
      HNParser,
      ['horse_id', 'horse_name', 'english_name', 'raw_data'],
      'UM_DATA'
    );
    
    // 9. BT (血統データ) - 新規
    await importFileType(
      /BT\d{8}\.txt/,
      'jravan_bt',
      BTParser,
      ['horse_id', 'sire_id', 'dam_id', 'sire_name', 'dam_name', 'raw_data'],
      'KT_DATA'
    );
    
    // 10. BR (繁殖情報) - 新規
    await importFileType(
      /BR\d{8}\.txt/,
      'jravan_br',
      BRParser,
      ['horse_id', 'breeder', 'breeding_farm', 'raw_data'],
      'BR_DATA'
    );
    
    // 11. HS (競走馬成績) - 新規
    await importFileType(
      /HS\d{8}\.txt/,
      'jravan_hs',
      HSParser,
      ['horse_id', 'total_races', 'total_wins', 'total_earnings', 'raw_data'],
      'BS_DATA'
    );
    
    console.log('\n✅ JRA-VAN一括取り込み完了（11種類）！');
  } catch (error) {
    console.error('\n❌ エラー発生:', error);
    throw error;
  } finally {
    // SQL一時ディレクトリ削除
    if (fs.existsSync(SQL_OUTPUT_DIR)) {
      const files = fs.readdirSync(SQL_OUTPUT_DIR);
      for (const file of files) {
        fs.unlinkSync(path.join(SQL_OUTPUT_DIR, file));
      }
      fs.rmdirSync(SQL_OUTPUT_DIR);
    }
  }
}

// ================================================
// 実行
// ================================================

importJRAVANData()
  .then(() => {
    console.log('\n🎉 すべて完了！');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 致命的エラー:', error);
    process.exit(1);
  });
