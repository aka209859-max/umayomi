/**
 * UMAYOMI - JRA-VAN一括取り込みスクリプト（Cloudflare D1版）
 * 修正版: サブディレクトリを再帰的に探索して .DAT ファイルを取り込む
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

/**
 * ディレクトリを再帰的に探索して .DAT ファイルを取得
 * (.IDX ファイルはスキップ)
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
            traverse(fullPath);  // 再帰的に探索
          } else if (item.toUpperCase().endsWith('.DAT')) {
            allFiles.push(fullPath);  // .DAT ファイルのみ
          }
        } catch (error: any) {
          // アクセスできないファイルはスキップ
        }
      }
    } catch (error: any) {
      console.log(`⚠️  ディレクトリアクセスエラー: ${dir}`);
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
  
  // ファイル数から予想レコード数を推定
  const estimatedRecords = allFiles.length * 100; // 1ファイルあたり約100レコードと仮定
  console.log(`   予想レコード数: 約${estimatedRecords}件`);
  
  // 既存データが十分にある場合はスキップ
  if (existingCount > 0 && existingCount >= estimatedRecords * 0.8) {
    console.log(`✅ ${tableName} スキップ: 既にデータが存在します（${existingCount}件）`);
    return;
  }
  
  console.log(`   新規データをパース中...`);
  
  let totalRecords = 0;
  let allRecords: any[] = [];
  
  for (let i = 0; i < allFiles.length; i++) {
    const filePath = allFiles[i];
    try {
      const buffer = fs.readFileSync(filePath);
      const content = iconv.decode(buffer, 'shift-jis');
      const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
      
      for (const line of lines) {
        const record: any = {};
        columns.forEach(col => {
          if (col === 'raw_data') {
            record[col] = line.substring(0, 500);
          } else {
            // ファイル名とインデックスを使って一意のIDを生成
            const fileName = path.basename(filePath, '.DAT');
            record[col] = `${fileName}_${totalRecords}`;
          }
        });
        allRecords.push(record);
        totalRecords++;
      }
      
      if ((i + 1) % 100 === 0 || i === allFiles.length - 1) {
        process.stdout.write(`\r   パース進捗: ${i + 1}/${allFiles.length} ファイル (${totalRecords}件)`);
      }
    } catch (error: any) {
      // エラーは無視して次のファイルへ
    }
  }
  
  console.log(`\n   パース完了: ${totalRecords}件`);
  
  if (totalRecords === 0) return;
  
  console.log(`   SQL生成・実行中...`);
  const batchCount = Math.ceil(allRecords.length / BATCH_SIZE);
  
  for (let i = 0; i < batchCount; i++) {
    const batch = allRecords.slice(i * BATCH_SIZE, Math.min((i + 1) * BATCH_SIZE, allRecords.length));
    const sql = generateBatchSQL(tableName, batch, columns, i);
    const sqlFilePath = path.join(SQL_OUTPUT_DIR, `${tableName}_batch_${String(i + 1).padStart(4, '0')}.sql`);
    
    fs.writeFileSync(sqlFilePath, sql, 'utf-8');
    try {
      executeD1SQL(sqlFilePath);
      process.stdout.write(`\r   実行進捗: ${Math.min((i + 1) * BATCH_SIZE, allRecords.length)}/${allRecords.length} レコード (バッチ ${i + 1}/${batchCount})`);
    } catch (error: any) {
      console.error(`\n❌ SQL実行エラー: ${sqlFilePath}`);
      console.error(`   エラー詳細: ${error.message}`);
      throw error;
    } finally {
      if (fs.existsSync(sqlFilePath)) fs.unlinkSync(sqlFilePath);
    }
  }
  
  console.log(`\n✅ ${tableName} 完了: ${totalRecords}件`);
}

async function importJRAVANData() {
  console.log('🚀 JRA-VAN一括取り込み開始（Cloudflare D1版 - 再帰探索対応）\n');
  console.log(`📂 読み込み元: ${JRAVAN_BASE_PATH}`);
  console.log(`💾 保存先DB: ${DB_NAME} (Cloudflare D1 --local)\n`);
  
  if (!fs.existsSync(SQL_OUTPUT_DIR)) {
    fs.mkdirSync(SQL_OUTPUT_DIR, { recursive: true });
  }
  
  try {
    // 主要データフォルダから取り込み（サブディレクトリを再帰探索）
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
