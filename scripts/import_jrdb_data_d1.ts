/**
 * UMAYOMI - JRDB一括取り込みスクリプト（Cloudflare D1版）
 * 
 * CEO PCでの実行を想定（E:\UMAYOMI\downloads_weekly\）
 * 
 * Cloudflare D1対応:
 * - better-sqlite3の代わりにWrangler CLIを使用
 * - バッチSQLファイルを生成して wrangler d1 execute で実行
 * 
 * 対象パーサー（21種類）:
 * - KYI, BAC, KAB, CHA, JOA, SED, TYB (既存7種)
 * - UKC, CYB, ZED, OW, OU, OT, KKA, HJC, SRB, OZ, ZKB, OV, CE, BV (新規14種)
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import iconv from 'iconv-lite';

// パーサーインポート
import { parseKYI } from '../src/parsers/jrdb/kyi';
import { parseBAC } from '../src/parsers/jrdb/bac';
import { parseKAB } from '../src/parsers/jrdb/kab';
import { parseCHA } from '../src/parsers/jrdb/cha';
import { parseJOA } from '../src/parsers/jrdb/joa';
import { parseSED } from '../src/parsers/jrdb/sed';
import { parseTYB } from '../src/parsers/jrdb/tyb';
import { parseUKC } from '../src/parsers/jrdb/ukc';
import { parseCYB } from '../src/parsers/jrdb/cyb';
import { parseZED } from '../src/parsers/jrdb/zed';
import { parseOW } from '../src/parsers/jrdb/ow';
import { parseOU } from '../src/parsers/jrdb/ou';
import { parseOT } from '../src/parsers/jrdb/ot';
import { parseKKA } from '../src/parsers/jrdb/kka';
import { parseHJC } from '../src/parsers/jrdb/hjc';
import { parseSRB } from '../src/parsers/jrdb/srb';
import { parseOZ } from '../src/parsers/jrdb/oz';
import { parseZKB } from '../src/parsers/jrdb/zkb';
import { parseOV } from '../src/parsers/jrdb/ov';
import { parseCE } from '../src/parsers/jrdb/ce';
import { parseBV } from '../src/parsers/jrdb/bv';

// ================================================
// 設定
// ================================================

const JRDB_BASE_PATH = 'E:\\UMAYOMI\\downloads_weekly';
const SQL_OUTPUT_DIR = '.\\sql_import';
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
  filePrefix: string,
  tableName: string,
  parser: (content: string) => any[],
  columns: string[],
  encoding: 'utf-8' | 'shift-jis' = 'shift-jis'
) {
  console.log(`\n📊 ${filePrefix} (${tableName}) 取り込み中...`);
  
  // ファイル検索（downloads_weekly直下から再帰的に検索）
  const allFiles: string[] = [];
  
  function scanDirectory(dir: string) {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        scanDirectory(fullPath);
      } else if (entry.isFile() && entry.name.startsWith(filePrefix) && entry.name.endsWith('.txt')) {
        allFiles.push(fullPath);
      }
    }
  }
  
  scanDirectory(JRDB_BASE_PATH);
  
  if (allFiles.length === 0) {
    console.log(`⚠️  ${filePrefix}ファイルが見つかりません`);
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
      
      const records = parser(content);
      allRecords.push(...records);
      totalRecords += records.length;
      
      if ((i + 1) % 100 === 0 || i === allFiles.length - 1) {
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
  
  console.log(`\n✅ ${filePrefix} 完了: ${totalRecords}件`);
}

// ================================================
// メイン処理
// ================================================

async function importJRDBData() {
  console.log('🚀 JRDB一括取り込み開始（Cloudflare D1版）\n');
  console.log(`📂 読み込み元: ${JRDB_BASE_PATH}`);
  console.log(`💾 保存先DB: ${DB_NAME} (Cloudflare D1 --local)\n`);
  
  // SQL一時ディレクトリ作成
  if (!fs.existsSync(SQL_OUTPUT_DIR)) {
    fs.mkdirSync(SQL_OUTPUT_DIR, { recursive: true });
  }
  
  try {
    // 1. KYI (馬別出走情報)
    await importFileType(
      'KYI',
      'jrdb_kyi',
      parseKYI,
      ['race_key', 'race_date', 'track_code', 'race_number', 'horse_number', 
       'horse_id', 'horse_name', 'sex', 'age', 'jockey_code', 'jockey_name',
       'trainer_code', 'trainer_name', 'weight', 'weight_change', 'odds', 
       'popularity', 'raw_data']
    );
    
    // 2. BAC (馬基本情報)
    await importFileType(
      'BAC',
      'jrdb_bac',
      parseBAC,
      ['horse_id', 'horse_name', 'sex', 'birth_date', 'sire_name', 'dam_name',
       'breeder', 'owner', 'raw_data']
    );
    
    // 3. KAB (レース結果サマリー)
    await importFileType(
      'KAB',
      'jrdb_kab',
      parseKAB,
      ['race_key', 'race_date', 'track_code', 'race_number', 'race_name',
       'grade', 'distance', 'course_type', 'weather', 'track_condition', 'raw_data']
    );
    
    // 4. CHA (厩舎コメント)
    await importFileType(
      'CHA',
      'jrdb_cha',
      parseCHA,
      ['race_key', 'horse_id', 'comment', 'raw_data']
    );
    
    // 5. JOA (騎手データ)
    await importFileType(
      'JOA',
      'jrdb_joa',
      parseJOA,
      ['jockey_code', 'jockey_name', 'affiliation', 'birth_date', 'raw_data']
    );
    
    // 6. SED (成績データ)
    await importFileType(
      'SED',
      'jrdb_sed',
      parseSED,
      ['race_key', 'horse_id', 'finish_position', 'time', 'raw_data']
    );
    
    // 7. TYB (出馬表データ)
    await importFileType(
      'TYB',
      'jrdb_tyb',
      parseTYB,
      ['race_key', 'horse_id', 'horse_name', 'raw_data']
    );
    
    // 8. UKC (調教情報) - 新規
    await importFileType(
      'UKC',
      'jrdb_ukc',
      parseUKC,
      ['race_key', 'horse_id', 'training_date', 'training_type', 'raw_data']
    );
    
    // 9. CYB (血統) - 新規
    await importFileType(
      'CYB',
      'jrdb_cyb',
      parseCYB,
      ['horse_id', 'sire_id', 'dam_id', 'sire_name', 'dam_name', 'raw_data']
    );
    
    // 10. ZED (確定・払戻) - 新規
    await importFileType(
      'ZED',
      'jrdb_zed',
      parseZED,
      ['race_key', 'race_date', 'payoff_data', 'raw_data']
    );
    
    // 11. OW (オッズワイド) - 新規
    await importFileType(
      'OW',
      'jrdb_ow',
      parseOW,
      ['race_key', 'odds_data', 'raw_data']
    );
    
    // 12. OU (オッズ馬連) - 新規
    await importFileType(
      'OU',
      'jrdb_ou',
      parseOU,
      ['race_key', 'odds_data', 'raw_data']
    );
    
    // 13. OT (オッズ馬単) - 新規
    await importFileType(
      'OT',
      'jrdb_ot',
      parseOT,
      ['race_key', 'odds_data', 'raw_data']
    );
    
    // 14. KKA (競走成績) - 新規
    await importFileType(
      'KKA',
      'jrdb_kka',
      parseKKA,
      ['race_key', 'horse_id', 'performance_data', 'raw_data']
    );
    
    // 15. HJC (払戻金) - 新規
    await importFileType(
      'HJC',
      'jrdb_hjc',
      parseHJC,
      ['race_key', 'payoff_type', 'payoff_amount', 'raw_data']
    );
    
    // 16. SRB (成績追加) - 新規
    await importFileType(
      'SRB',
      'jrdb_srb',
      parseSRB,
      ['race_key', 'horse_id', 'additional_data', 'raw_data']
    );
    
    // 17. OZ (馬場) - 新規
    await importFileType(
      'OZ',
      'jrdb_oz',
      parseOZ,
      ['race_date', 'track_code', 'track_data', 'raw_data']
    );
    
    // 18. ZKB (前日売上) - 新規
    await importFileType(
      'ZKB',
      'jrdb_zkb',
      parseZKB,
      ['race_date', 'sales_data', 'raw_data']
    );
    
    // 19. OV (オッズ大容量) - 新規
    await importFileType(
      'OV',
      'jrdb_ov',
      parseOV,
      ['race_key', 'odds_data', 'raw_data']
    );
    
    // 20. CE (CEデータ) - 新規
    await importFileType(
      'CE',
      'jrdb_ce',
      parseCE,
      ['data_key', 'data_value', 'raw_data']
    );
    
    // 21. BV (BVデータ) - 新規
    await importFileType(
      'BV',
      'jrdb_bv',
      parseBV,
      ['data_key', 'data_value', 'raw_data']
    );
    
    console.log('\n✅ JRDB一括取り込み完了（21種類）！');
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

importJRDBData()
  .then(() => {
    console.log('\n🎉 すべて完了！');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 致命的エラー:', error);
    process.exit(1);
  });
