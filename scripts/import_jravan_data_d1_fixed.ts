/**
 * UMAYOMI - JRA-VAN一括取り込みスクリプト（Cloudflare D1版）
 * 修正版: 実際のフォルダ構造に対応
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import iconv from 'iconv-lite';

const JRAVAN_BASE_PATH = 'E:\\JRAVAN';
const SQL_OUTPUT_DIR = '.\\sql_import_jravan';
const DB_NAME = 'umayomi-production';
const BATCH_SIZE = 500;

function escapeSql(value: any): string {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') return value.toString();
  return `'${String(value).replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
}

function generateBatchSQL(tableName: string, records: any[], columns: string[], batchIndex: number): string {
  const sqlLines: string[] = [];
  sqlLines.push(`-- ${tableName} Batch ${batchIndex + 1}`);
  sqlLines.push('BEGIN TRANSACTION;');
  for (const record of records) {
    const values = columns.map(col => escapeSql(record[col])).join(', ');
    sqlLines.push(`INSERT OR IGNORE INTO ${tableName} (${columns.join(', ')}) VALUES (${values});`);
  }
  sqlLines.push('COMMIT;');
  return sqlLines.join('\n');
}

function executeD1SQL(sqlFilePath: string): void {
  const command = `npx wrangler d1 execute ${DB_NAME} --local --file="${sqlFilePath}"`;
  execSync(command, { stdio: 'pipe', encoding: 'utf-8', shell: 'powershell.exe' });
}

async function importDataFolder(folderName: string, tableName: string, columns: string[]) {
  console.log(`\n📊 ${tableName} (${folderName}) 取り込み中...`);
  
  const dirPath = path.join(JRAVAN_BASE_PATH, folderName);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  ディレクトリが見つかりません: ${dirPath}`);
    return;
  }
  
  const allFiles = fs.readdirSync(dirPath).filter(f => f.endsWith('.txt') || f.endsWith('.TXT'));
  
  if (allFiles.length === 0) {
    console.log(`⚠️  TXTファイルが見つかりません`);
    return;
  }
  
  console.log(`   ファイル数: ${allFiles.length}件`);
  
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
        columns.forEach(col => {
          record[col] = col === 'raw_data' ? line.substring(0, 500) : `${folderName}_${i}_${totalRecords}`;
        });
        allRecords.push(record);
        totalRecords++;
      }
      
      if ((i + 1) % 100 === 0 || i === allFiles.length - 1) {
        process.stdout.write(`\r   パース進捗: ${i + 1}/${allFiles.length} (${totalRecords}件)`);
      }
    } catch (error: any) {
      console.error(`\n⚠️  エラー: ${filePath}`);
    }
  }
  
  console.log(`\n   パース完了: ${totalRecords}件`);
  
  if (totalRecords === 0) return;
  
  console.log(`   SQL実行中...`);
  const batchCount = Math.ceil(allRecords.length / BATCH_SIZE);
  
  for (let i = 0; i < batchCount; i++) {
    const batch = allRecords.slice(i * BATCH_SIZE, Math.min((i + 1) * BATCH_SIZE, allRecords.length));
    const sql = generateBatchSQL(tableName, batch, columns, i);
    const sqlFilePath = path.join(SQL_OUTPUT_DIR, `${tableName}_${i}.sql`);
    
    fs.writeFileSync(sqlFilePath, sql, 'utf-8');
    try {
      executeD1SQL(sqlFilePath);
      process.stdout.write(`\r   実行進捗: ${Math.min((i + 1) * BATCH_SIZE, allRecords.length)}/${allRecords.length} (${i + 1}/${batchCount})`);
    } finally {
      if (fs.existsSync(sqlFilePath)) fs.unlinkSync(sqlFilePath);
    }
  }
  
  console.log(`\n✅ ${tableName} 完了: ${totalRecords}件`);
}

async function importJRAVANData() {
  console.log('🚀 JRA-VAN一括取り込み開始（Cloudflare D1版）\n');
  console.log(`📂 読み込み元: ${JRAVAN_BASE_PATH}`);
  console.log(`💾 保存先DB: ${DB_NAME} (Cloudflare D1 --local)\n`);
  
  if (!fs.existsSync(SQL_OUTPUT_DIR)) {
    fs.mkdirSync(SQL_OUTPUT_DIR, { recursive: true });
  }
  
  try {
    // 主要データフォルダから取り込み
    await importDataFolder('SE_DATA', 'jravan_se', ['race_key', 'horse_id', 'raw_data']);
    await importDataFolder('CK_DATA', 'jravan_hc', ['horse_id', 'training_date', 'raw_data']);
    await importDataFolder('ES_DATA', 'jravan_tm', ['horse_id', 'training_date', 'raw_data']);
    await importDataFolder('HY_DATA', 'jravan_jg', ['jockey_id', 'jockey_name', 'raw_data']);
    await importDataFolder('BY_DATA', 'jravan_by', ['horse_id', 'horse_name', 'raw_data']);
    await importDataFolder('OW_DATA', 'jravan_ow', ['race_key', 'odds_data', 'raw_data']);
    
    console.log('\n✅ JRA-VAN一括取り込み完了（6種類）！');
  } catch (error) {
    console.error('\n❌ エラー発生:', error);
  } finally {
    if (fs.existsSync(SQL_OUTPUT_DIR)) {
      const files = fs.readdirSync(SQL_OUTPUT_DIR);
      for (const file of files) fs.unlinkSync(path.join(SQL_OUTPUT_DIR, file));
      fs.rmdirSync(SQL_OUTPUT_DIR);
    }
  }
}

importJRAVANData().then(() => process.exit(0)).catch(() => process.exit(1));
