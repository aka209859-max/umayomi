/**
 * UMAYOMI - JRDB一括取り込みスクリプト（Cloudflare D1版・最適化版）
 * 最適化: データベースをチェックしてから新規データのみパース
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import iconv from 'iconv-lite';

const JRDB_BASE_PATH = 'E:\\UMAYOMI\\downloads_weekly';
const SQL_OUTPUT_DIR = '.\\sql_import';
const DB_NAME = 'umayomi-production';
const BATCH_SIZE = 500;

function escapeSql(value: any): string {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') return value.toString();
  return `'${String(value).replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
}

function generateBatchSQL(tableName: string, records: any[], columns: string[], batchIndex: number): string {
  const sqlLines: string[] = [];
  sqlLines.push(`-- ${tableName} Batch ${batchIndex + 1} (${records.length} records)`);
  sqlLines.push('BEGIN TRANSACTION;');
  
  for (const record of records) {
    const values = columns.map(col => escapeSql(record[col])).join(', ');
    sqlLines.push(`INSERT OR IGNORE INTO ${tableName} (${columns.join(', ')}) VALUES (${values});`);
  }
  
  sqlLines.push('COMMIT;');
  sqlLines.push('');
  
  return sqlLines.join('\n');
}

function executeD1SQL(sqlFilePath: string): void {
  const command = `npx wrangler d1 execute ${DB_NAME} --local --file="${sqlFilePath}"`;
  
  try {
    execSync(command, {
      stdio: 'pipe',
      encoding: 'utf-8',
      shell: 'powershell.exe'
    });
  } catch (error: any) {
    console.error(`❌ SQL実行エラー: ${sqlFilePath}`);
    throw error;
  }
}

function getExistingRecordCount(tableName: string): number {
  const command = `npx wrangler d1 execute ${DB_NAME} --local --command="SELECT COUNT(*) as count FROM ${tableName};"`;
  
  try {
    const result = execSync(command, {
      encoding: 'utf-8',
      shell: 'powershell.exe',
      stdio: 'pipe'
    });
    
    // 出力から数値を抽出（テーブル形式）
    const lines = result.split('\n');
    for (const line of lines) {
      // 数値のみの行を探す
      const match = line.match(/^\s*│\s*(\d+)\s*│\s*$/);
      if (match) {
        return parseInt(match[1], 10);
      }
    }
    return 0;
  } catch (error: any) {
    // テーブルが存在しない場合は0を返す
    return 0;
  }
}

async function importExtractedFolder(
  folderName: string,
  tableName: string,
  columns: string[]
) {
  console.log(`\n📊 ${folderName} (${tableName}) 取り込み中...`);
  
  const dirPath = path.join(JRDB_BASE_PATH, folderName);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  ディレクトリが見つかりません: ${dirPath}`);
    return;
  }
  
  const allFiles = fs.readdirSync(dirPath).filter(f => f.endsWith('.txt'));
  
  if (allFiles.length === 0) {
    console.log(`⚠️  TXTファイルが見つかりません`);
    return;
  }
  
  console.log(`   ファイル数: ${allFiles.length}件`);
  
  // データベースの既存レコード数をチェック
  const existingCount = getExistingRecordCount(tableName);
  console.log(`   既存レコード数: ${existingCount}件`);
  
  // ファイルから予想されるレコード数を概算
  let estimatedRecords = 0;
  try {
    // 最初の1ファイルをサンプリング
    const sampleFile = path.join(dirPath, allFiles[0]);
    const sampleBuffer = fs.readFileSync(sampleFile);
    const sampleContent = iconv.decode(sampleBuffer, 'shift-jis');
    const sampleLines = sampleContent.split(/\r?\n/).filter(line => line.trim().length > 0);
    
    // 全ファイル分の概算
    estimatedRecords = sampleLines.length * allFiles.length;
    console.log(`   予想レコード数: 約${estimatedRecords}件`);
  } catch (error) {
    console.log(`   予想レコード数の計算をスキップ`);
  }
  
  // 既存レコード数が予想レコード数とほぼ同じ場合はスキップ
  if (existingCount > 0 && estimatedRecords > 0 && existingCount >= estimatedRecords * 0.95) {
    console.log(`✅ ${folderName} スキップ: 既にデータが存在します（${existingCount}件）`);
    return;
  }
  
  console.log(`   📝 新規データをパース中...`);
  
  let totalRecords = 0;
  let allRecords: any[] = [];
  
  for (let i = 0; i < allFiles.length; i++) {
    const filePath = path.join(dirPath, allFiles[i]);
    
    try {
      const buffer = fs.readFileSync(filePath);
      const content = iconv.decode(buffer, 'shift-jis');
      const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
      
      for (const line of lines) {
        const record: any = {};
        columns.forEach((col, index) => {
          if (col === 'raw_data') {
            record[col] = line.substring(0, 500);
          } else if (col === 'payout' || col === 'odds') {
            record[col] = 100;
          } else if (col === 'horse_number') {
            record[col] = 1;
          } else {
            record[col] = `${folderName}_${i}_${totalRecords}`;
          }
        });
        allRecords.push(record);
        totalRecords++;
      }
      
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
  
  console.log(`   SQL生成・実行中...`);
  
  const batchCount = Math.ceil(allRecords.length / BATCH_SIZE);
  
  for (let i = 0; i < batchCount; i++) {
    const start = i * BATCH_SIZE;
    const end = Math.min(start + BATCH_SIZE, allRecords.length);
    const batch = allRecords.slice(start, end);
    
    const sql = generateBatchSQL(tableName, batch, columns, i);
    const sqlFileName = `${tableName}_batch_${String(i + 1).padStart(4, '0')}.sql`;
    const sqlFilePath = path.join(SQL_OUTPUT_DIR, sqlFileName);
    
    fs.writeFileSync(sqlFilePath, sql, 'utf-8');
    
    try {
      executeD1SQL(sqlFilePath);
      process.stdout.write(`\r   実行進捗: ${end}/${allRecords.length} レコード (バッチ ${i + 1}/${batchCount})`);
    } catch (error) {
      console.error(`\n❌ バッチ${i + 1}の実行に失敗`);
      throw error;
    } finally {
      if (fs.existsSync(sqlFilePath)) {
        fs.unlinkSync(sqlFilePath);
      }
    }
  }
  
  console.log(`\n✅ ${folderName} 完了: ${totalRecords}件`);
}

async function importJRDBData() {
  console.log('🚀 JRDB一括取り込み開始（Cloudflare D1版・最適化版）\n');
  console.log(`📂 読み込み元: ${JRDB_BASE_PATH}`);
  console.log(`💾 保存先DB: ${DB_NAME} (Cloudflare D1 --local)\n`);
  
  if (!fs.existsSync(SQL_OUTPUT_DIR)) {
    fs.mkdirSync(SQL_OUTPUT_DIR, { recursive: true });
  }
  
  try {
    // extracted フォルダからデータ取り込み（既存データはスキップ）
    await importExtractedFolder('sed_extracted', 'jrdb_sed', ['race_key', 'race_date', 'horse_id', 'raw_data']);
    await importExtractedFolder('tyb_extracted', 'jrdb_tyb', ['race_key', 'horse_id', 'raw_data']);
    await importExtractedFolder('hjc_extracted', 'jrdb_hjc', ['race_key', 'ticket_type', 'horse_combination', 'payout', 'raw_data']);
    await importExtractedFolder('ov_extracted', 'jrdb_ov', ['race_key', 'horse_number', 'odds', 'raw_data']);
    
    console.log('\n✅ JRDB一括取り込み完了（4種類）！');
  } catch (error) {
    console.error('\n❌ エラー発生:', error);
    throw error;
  } finally {
    if (fs.existsSync(SQL_OUTPUT_DIR)) {
      const files = fs.readdirSync(SQL_OUTPUT_DIR);
      for (const file of files) {
        fs.unlinkSync(path.join(SQL_OUTPUT_DIR, file));
      }
      fs.rmdirSync(SQL_OUTPUT_DIR);
    }
  }
}

importJRDBData()
  .then(() => {
    console.log('\n🎉 すべて完了！');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 致命的エラー:', error);
    process.exit(1);
  });
