/**
 * UMAYOMI - JRA-VAN一括取り込みスクリプト（better-sqlite3直接書き込み版）
 * wranglerを経由せず、SQLiteに直接書き込むため超高速
 * 予想時間：10-15分（従来の12時間 → 15分）
 */

import * as fs from 'fs';
import * as path from 'path';
import Database from 'better-sqlite3';
import iconv from 'iconv-lite';

const JRAVAN_BASE_PATH = 'E:\\JRAVAN';
const SQLITE_DB_PATH = '.wrangler\\state\\v3\\d1\\miniflare-D1DatabaseObject';
const BATCH_SIZE = 10000; // 大幅増加（500 → 10,000）

interface DataConfig {
  folderName: string;
  tableName: string;
  columns: string[];
}

const DATA_CONFIGS: DataConfig[] = [
  { folderName: 'SE_DATA', tableName: 'jravan_se', columns: ['race_key', 'horse_id', 'raw_data'] },
  { folderName: 'CK_DATA', tableName: 'jravan_hc', columns: ['horse_id', 'training_date', 'raw_data'] },
  { folderName: 'ES_DATA', tableName: 'jravan_tm', columns: ['horse_id', 'training_date', 'raw_data'] },
  { folderName: 'HY_DATA', tableName: 'jravan_jg', columns: ['jockey_id', 'jockey_name', 'raw_data'] },
  { folderName: 'BY_DATA', tableName: 'jravan_by', columns: ['horse_id', 'horse_name', 'raw_data'] },
  { folderName: 'OW_DATA', tableName: 'jravan_ow', columns: ['race_key', 'odds_data', 'raw_data'] },
];

/**
 * SQLiteデータベースファイルを見つける
 */
function findSqliteDbFile(): string {
  const dbDir = SQLITE_DB_PATH;
  if (!fs.existsSync(dbDir)) {
    throw new Error(`❌ データベースディレクトリが見つかりません: ${dbDir}`);
  }

  const files = fs.readdirSync(dbDir);
  const sqliteFile = files.find(f => f.endsWith('.sqlite'));
  
  if (!sqliteFile) {
    throw new Error(`❌ SQLiteファイルが見つかりません: ${dbDir}`);
  }

  return path.join(dbDir, sqliteFile);
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
 * 1ファイルを処理してレコードを返す
 */
function parseFile(filePath: string, columns: string[], fileIndex: number): any[] {
  const records: any[] = [];
  
  try {
    const buffer = fs.readFileSync(filePath);
    const content = iconv.decode(buffer, 'shift-jis');
    const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
    
    const fileName = path.basename(filePath, '.DAT');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const record: any = {};
      
      // カラムごとにデータを設定
      columns.forEach(col => {
        if (col === 'raw_data') {
          // raw_dataは最大500文字に制限
          record[col] = line.substring(0, 500);
        } else {
          // 他のカラムはファイル名+行番号で一意性を確保
          record[col] = `${fileName}_${i}`;
        }
      });
      
      records.push(record);
    }
  } catch (error: any) {
    console.error(`   ⚠️  ファイル処理エラー（スキップ）: ${path.basename(filePath)} - ${error.message}`);
  }
  
  return records;
}

/**
 * データをSQLiteに直接挿入（トランザクション使用）
 */
function insertRecordsBatch(
  db: Database.Database, 
  tableName: string, 
  columns: string[], 
  records: any[]
): number {
  if (records.length === 0) return 0;

  // プレースホルダーを生成
  const placeholders = columns.map(() => '?').join(', ');
  const sql = `INSERT OR IGNORE INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
  
  const insert = db.prepare(sql);
  
  // トランザクションで一括挿入
  const insertMany = db.transaction((records: any[]) => {
    for (const record of records) {
      const values = columns.map(col => record[col]);
      insert.run(...values);
    }
  });
  
  insertMany(records);
  return records.length;
}

/**
 * データフォルダを処理
 */
async function importDataFolder(
  db: Database.Database,
  config: DataConfig
): Promise<void> {
  console.log(`\n📊 ${config.tableName} (${config.folderName}) 取り込み中...`);
  
  const dirPath = path.join(JRAVAN_BASE_PATH, config.folderName);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  ディレクトリが見つかりません: ${dirPath}`);
    return;
  }
  
  // 既存レコード数を確認
  const countStmt = db.prepare(`SELECT COUNT(*) as count FROM ${config.tableName}`);
  const existingCount = (countStmt.get() as any).count;
  console.log(`   既存レコード数: ${existingCount}件`);
  
  // 既存データが多い場合はスキップ
  if (existingCount > 1000) {
    console.log(`✅ ${config.tableName} スキップ: 既にデータが存在します（${existingCount}件）`);
    return;
  }
  
  // 再帰的に .DAT ファイルを探索
  console.log(`   サブディレクトリを探索中...`);
  const allFiles = findAllDatFiles(dirPath);
  
  if (allFiles.length === 0) {
    console.log(`⚠️  .DAT ファイルが見つかりません`);
    return;
  }
  
  console.log(`   ファイル数: ${allFiles.length}件`);
  console.log(`   処理開始...`);
  
  let totalRecords = 0;
  let batchRecords: any[] = [];
  const startTime = Date.now();
  
  for (let i = 0; i < allFiles.length; i++) {
    const filePath = allFiles[i];
    
    // ファイルをパース
    const records = parseFile(filePath, config.columns, i);
    batchRecords.push(...records);
    
    // バッチサイズに達したら挿入
    if (batchRecords.length >= BATCH_SIZE) {
      const inserted = insertRecordsBatch(db, config.tableName, config.columns, batchRecords);
      totalRecords += inserted;
      batchRecords = []; // メモリ解放
    }
    
    // 進捗表示（100ファイルごと）
    if ((i + 1) % 100 === 0 || i === allFiles.length - 1) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const rate = (totalRecords / parseFloat(elapsed)).toFixed(0);
      process.stdout.write(`\r   進捗: ${i + 1}/${allFiles.length} ファイル | ${totalRecords.toLocaleString()}件 | ${elapsed}秒 | ${rate}件/秒`);
    }
  }
  
  // 残りのレコードを挿入
  if (batchRecords.length > 0) {
    const inserted = insertRecordsBatch(db, config.tableName, config.columns, batchRecords);
    totalRecords += inserted;
  }
  
  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✅ ${config.tableName} 完了: ${totalRecords.toLocaleString()}件 | ${totalTime}秒`);
}

/**
 * メイン処理
 */
async function main() {
  console.log('🚀 JRA-VAN一括取り込み開始（better-sqlite3直接書き込み版）\n');
  console.log(`📂 読み込み元: ${JRAVAN_BASE_PATH}`);
  console.log(`💾 保存先DB: SQLite (直接書き込み)\n`);
  
  try {
    // SQLiteデータベースファイルを特定
    const dbFilePath = findSqliteDbFile();
    console.log(`📁 データベースファイル: ${dbFilePath}\n`);
    
    // データベース接続
    const db = new Database(dbFilePath);
    db.pragma('journal_mode = WAL'); // 書き込み高速化
    db.pragma('synchronous = NORMAL'); // 書き込み高速化
    
    try {
      const globalStartTime = Date.now();
      
      // 各データフォルダを処理
      for (const config of DATA_CONFIGS) {
        await importDataFolder(db, config);
      }
      
      const globalTotalTime = ((Date.now() - globalStartTime) / 60000).toFixed(1);
      
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ JRA-VAN一括取り込み完了（6種類）！');
      console.log(`⏱️  合計時間: ${globalTotalTime}分`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // 最終件数確認
      console.log('\n📊 最終件数確認:');
      for (const config of DATA_CONFIGS) {
        const countStmt = db.prepare(`SELECT COUNT(*) as count FROM ${config.tableName}`);
        const count = (countStmt.get() as any).count;
        console.log(`   ${config.tableName}: ${count.toLocaleString()}件`);
      }
      
    } finally {
      db.close();
    }
    
    console.log('\n🎉 すべて完了！');
    
  } catch (error: any) {
    console.error('\n❌ 致命的エラー:', error.message);
    console.error(error.stack);
    throw error;
  }
}

// メイン実行
main()
  .then(() => {
    console.log('\n👍 JRA-VANデータ取り込み完了！');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 エラーで終了:', error);
    process.exit(1);
  });
