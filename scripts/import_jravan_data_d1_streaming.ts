/**
 * UMAYOMI - JRA-VAN一括取り込みスクリプト（Cloudflare D1版）
 * ストリーミング版: ファイルごとにSQLを実行してメモリ不足を回避
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import iconv from 'iconv-lite';

const JRAVAN_BASE_PATH = 'E:\\JRAVAN';
const SQL_OUTPUT_DIR = '.\\sql_import_jravan';
const DB_NAME = 'umayomi-production';
const BATCH_SIZE = 500;
const MAX_RECORDS_PER_RUN = 10000; // メモリ節約: 1万件ごとに実行

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

/**
 * ディレクトリを再帰的に探索して .DAT ファイルを取得
 */
function findAllDatFiles(baseDir: string): string[] {
  const allFiles: string[] = [];
  
  function traverse(dir: string) {
    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        try {
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            traverse(fullPath);
          } else if (item.toUpperCase().endsWith('.DAT')) {
            allFiles.push(fullPath);
          }
        } catch (error: any) {
          // アクセスできないファイルはスキップ
        }
      }
    } catch (error: any) {
      // ディレクトリアクセスエラーはスキップ
    }
  }
  
  traverse(baseDir);
  return allFiles;
}

/**
 * データベースの既存レコード数を取得
 */
function getExistingRecordCount(tableName: string): number {
  try {
    const command = `npx wrangler d1 execute ${DB_NAME} --local --command="SELECT COUNT(*) as count FROM ${tableName};" --json`;
    const output = execSync(command, { 
      encoding: 'utf-8', 
      shell: 'powershell.exe',
      stdio: 'pipe'
    });
    
    const jsonMatch = output.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      if (result && result.length > 0 && result[0].results && result[0].results.length > 0) {
        return result[0].results[0].count || 0;
      }
    }
    return 0;
  } catch (error: any) {
    return 0;
  }
}

/**
 * ファイルをストリーミング処理（メモリ節約版）
 */
async function processFileStreaming(
  filePath: string, 
  tableName: string, 
  columns: string[], 
  fileIndex: number,
  totalRecordsRef: { count: number }
): Promise<number> {
  let records: any[] = [];
  let localCount = 0;
  
  try {
    const buffer = fs.readFileSync(filePath);
    const content = iconv.decode(buffer, 'shift-jis');
    const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
    
    for (const line of lines) {
      const record: any = {};
      const fileName = path.basename(filePath, '.DAT');
      
      columns.forEach(col => {
        if (col === 'raw_data') {
          record[col] = line.substring(0, 500);
        } else {
          record[col] = `${fileName}_${totalRecordsRef.count}`;
        }
      });
      
      records.push(record);
      localCount++;
      totalRecordsRef.count++;
      
      // メモリ節約: 500件ごとにSQL実行
      if (records.length >= BATCH_SIZE) {
        const sql = generateBatchSQL(tableName, records, columns, Math.floor(totalRecordsRef.count / BATCH_SIZE));
        const sqlFilePath = path.join(SQL_OUTPUT_DIR, `${tableName}_temp.sql`);
        
        fs.writeFileSync(sqlFilePath, sql, 'utf-8');
        try {
          executeD1SQL(sqlFilePath);
        } finally {
          if (fs.existsSync(sqlFilePath)) fs.unlinkSync(sqlFilePath);
        }
        
        records = []; // メモリ解放
      }
    }
    
    // 残りのレコードを処理
    if (records.length > 0) {
      const sql = generateBatchSQL(tableName, records, columns, Math.floor(totalRecordsRef.count / BATCH_SIZE));
      const sqlFilePath = path.join(SQL_OUTPUT_DIR, `${tableName}_temp.sql`);
      
      fs.writeFileSync(sqlFilePath, sql, 'utf-8');
      try {
        executeD1SQL(sqlFilePath);
      } finally {
        if (fs.existsSync(sqlFilePath)) fs.unlinkSync(sqlFilePath);
      }
    }
  } catch (error: any) {
    // ファイルエラーは無視
  }
  
  return localCount;
}

async function importDataFolder(folderName: string, tableName: string, columns: string[]) {
  console.log(`\n📊 ${tableName} (${folderName}) 取り込み中...`);
  
  const dirPath = path.join(JRAVAN_BASE_PATH, folderName);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  ディレクトリが見つかりません: ${dirPath}`);
    return;
  }
  
  // 既存レコード数を確認
  const existingCount = getExistingRecordCount(tableName);
  console.log(`   既存レコード数: ${existingCount}件`);
  
  // 再帰的に .DAT ファイルを探索
  console.log(`   サブディレクトリを探索中...`);
  const allFiles = findAllDatFiles(dirPath);
  
  if (allFiles.length === 0) {
    console.log(`⚠️  .DAT ファイルが見つかりません`);
    return;
  }
  
  console.log(`   ファイル数: ${allFiles.length}件`);
  
  // 既存データが多い場合はスキップ
  if (existingCount > 1000) {
    console.log(`✅ ${tableName} スキップ: 既にデータが存在します（${existingCount}件）`);
    return;
  }
  
  console.log(`   ストリーミング処理開始...`);
  
  const totalRecordsRef = { count: 0 };
  
  for (let i = 0; i < allFiles.length; i++) {
    const filePath = allFiles[i];
    
    await processFileStreaming(filePath, tableName, columns, i, totalRecordsRef);
    
    if ((i + 1) % 100 === 0 || i === allFiles.length - 1) {
      process.stdout.write(`\r   進捗: ${i + 1}/${allFiles.length} ファイル (${totalRecordsRef.count}件)`);
    }
  }
  
  console.log(`\n✅ ${tableName} 完了: ${totalRecordsRef.count}件`);
}

async function importJRAVANData() {
  console.log('🚀 JRA-VAN一括取り込み開始（Cloudflare D1版 - ストリーミング処理）\n');
  console.log(`📂 読み込み元: ${JRAVAN_BASE_PATH}`);
  console.log(`💾 保存先DB: ${DB_NAME} (Cloudflare D1 --local)\n`);
  
  if (!fs.existsSync(SQL_OUTPUT_DIR)) {
    fs.mkdirSync(SQL_OUTPUT_DIR, { recursive: true });
  }
  
  try {
    // 主要データフォルダから取り込み（ストリーミング処理）
    await importDataFolder('SE_DATA', 'jravan_se', ['race_key', 'horse_id', 'raw_data']);
    await importDataFolder('CK_DATA', 'jravan_hc', ['horse_id', 'training_date', 'raw_data']);
    await importDataFolder('ES_DATA', 'jravan_tm', ['horse_id', 'training_date', 'raw_data']);
    await importDataFolder('HY_DATA', 'jravan_jg', ['jockey_id', 'jockey_name', 'raw_data']);
    await importDataFolder('BY_DATA', 'jravan_by', ['horse_id', 'horse_name', 'raw_data']);
    await importDataFolder('OW_DATA', 'jravan_ow', ['race_key', 'odds_data', 'raw_data']);
    
    console.log('\n✅ JRA-VAN一括取り込み完了（6種類）！');
    console.log('🎉 すべて完了！');
  } catch (error) {
    console.error('\n❌ 致命的エラー:', error);
    throw error;
  } finally {
    // クリーンアップ
    if (fs.existsSync(SQL_OUTPUT_DIR)) {
      const files = fs.readdirSync(SQL_OUTPUT_DIR);
      for (const file of files) {
        try {
          fs.unlinkSync(path.join(SQL_OUTPUT_DIR, file));
        } catch {}
      }
      try {
        fs.rmdirSync(SQL_OUTPUT_DIR);
      } catch {}
    }
  }
}

// メイン実行
importJRAVANData()
  .then(() => {
    console.log('\n👍 JRA-VANデータ取り込み完了！');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 エラーで終了:', error);
    process.exit(1);
  });
