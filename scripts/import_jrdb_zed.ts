/**
 * JRDB ZED ファイル取り込みスクリプト（レース詳細データ）
 * 
 * ZED: レース詳細データ（レース情報、距離、馬場状態など）
 * 注意: 既存のjrdb_zedテーブルは払戻データ用です。
 * このスクリプトは jrdb_zed_race テーブルに格納します。
 * 
 * 1行 = 453バイト固定長
 * エンコーディング: Shift-JIS
 * 
 * データソース: E:\UMAYOMI\jrdb_data\PACI*\ZED*.txt
 * 対象期間: 2014-2025年
 * 推定ファイル数: 1,265ファイル
 */

import * as fs from 'fs';
import * as path from 'path';
import iconv from 'iconv-lite';
import Database from 'better-sqlite3';

// データベースパス
const DB_PATH = path.join(
  process.env.HOME || '/home/user',
  'webapp/.wrangler/state/v3/d1/miniflare-D1DatabaseObject',
  '0aedb352c8e6bb5c4415dfb2780580e45d94a7381c9bdb7654f57812c160c7ad.sqlite'
);

// データディレクトリパス（sandboxでは /home/user/uploaded_files を使用）
const DATA_DIR = path.join(process.env.HOME || '/home/user', 'uploaded_files');

interface ZEDRecord {
  // レース識別情報
  track_code: string;           // 場コード (2桁)
  race_num: string;             // レース番号 (2桁)
  day_of_week: string;          // 曜日 (2桁)
  month: string;                // 月 (2桁)
  day: string;                  // 日 (2桁)
  race_id: string;              // レースID (8桁)
  race_date: string;            // 開催年月日 YYYYMMDD
  
  // レース情報
  race_name: string;            // レース名 (50文字)
  grade: string;                // グレード
  distance: number;             // 距離
  track_type: string;           // コース種別 (1:芝 2:ダート)
  track_condition: string;      // 馬場状態
  weather: string;              // 天候
  race_class: string;           // クラス
  age_limit: string;            // 年齢制限
  weight_type: string;          // 負担重量
  
  // 賞金情報
  prize_1: number;              // 1着賞金
  prize_2: number;              // 2着賞金
  prize_3: number;              // 3着賞金
  prize_4: number;              // 4着賞金
  prize_5: number;              // 5着賞金
  
  num_horses: number;           // 出走頭数
  course: string;               // コース (1:右 2:左 3:直線)
  
  // 元データ
  raw_data: string;             // 生データ（全453バイト）
}

/**
 * ZED 1行をパース
 */
function parseZEDLine(line: string): ZEDRecord | null {
  try {
    // 453バイトチェック
    if (line.length < 453) {
      return null;
    }

    return {
      track_code: line.substring(0, 2).trim(),
      race_num: line.substring(2, 4).trim(),
      day_of_week: line.substring(4, 6).trim(),
      month: line.substring(6, 8).trim(),
      day: line.substring(8, 10).trim(),
      race_id: line.substring(10, 18).trim(),
      race_date: line.substring(18, 26).trim(),
      race_name: line.substring(26, 76).trim(),
      grade: line.substring(76, 78).trim(),
      distance: parseInt(line.substring(78, 82).trim()) || 0,
      track_type: line.substring(82, 83).trim(),
      track_condition: line.substring(83, 85).trim(),
      weather: line.substring(85, 86).trim(),
      race_class: line.substring(86, 88).trim(),
      age_limit: line.substring(88, 89).trim(),
      weight_type: line.substring(89, 90).trim(),
      prize_1: parseInt(line.substring(90, 98).trim()) || 0,
      prize_2: parseInt(line.substring(98, 106).trim()) || 0,
      prize_3: parseInt(line.substring(106, 114).trim()) || 0,
      prize_4: parseInt(line.substring(114, 122).trim()) || 0,
      prize_5: parseInt(line.substring(122, 130).trim()) || 0,
      num_horses: parseInt(line.substring(130, 132).trim()) || 0,
      course: line.substring(132, 133).trim(),
      raw_data: line,
    };
  } catch (error) {
    console.error('❌ Parse error:', error);
    return null;
  }
}

/**
 * ZEDファイルをパース
 */
function parseZEDFile(filePath: string): ZEDRecord[] {
  try {
    // Shift-JISで読み込み
    const buffer = fs.readFileSync(filePath);
    const content = iconv.decode(buffer, 'shift_jis');
    
    const lines = content.split('\n');
    const records: ZEDRecord[] = [];
    
    for (const line of lines) {
      if (line.trim().length === 0) continue;
      
      const record = parseZEDLine(line);
      if (record) {
        records.push(record);
      }
    }
    
    return records;
  } catch (error) {
    console.error(`❌ Error parsing ${filePath}:`, error);
    return [];
  }
}

/**
 * データベースにレコード挿入
 */
function insertRecords(db: Database.Database, records: ZEDRecord[]): number {
  if (records.length === 0) return 0;

  const insert = db.prepare(`
    INSERT OR IGNORE INTO jrdb_zed_race (
      track_code, race_num, day_of_week, month, day,
      race_id, race_date, race_name, grade, distance,
      track_type, track_condition, weather, race_class,
      age_limit, weight_type, prize_1, prize_2, prize_3,
      prize_4, prize_5, num_horses, course, raw_data
    ) VALUES (
      @track_code, @race_num, @day_of_week, @month, @day,
      @race_id, @race_date, @race_name, @grade, @distance,
      @track_type, @track_condition, @weather, @race_class,
      @age_limit, @weight_type, @prize_1, @prize_2, @prize_3,
      @prize_4, @prize_5, @num_horses, @course, @raw_data
    )
  `);

  const insertMany = db.transaction((records: ZEDRecord[]) => {
    for (const record of records) {
      insert.run(record);
    }
  });

  try {
    insertMany(records);
    return records.length;
  } catch (error) {
    console.error('❌ Insert error:', error);
    return 0;
  }
}

/**
 * メイン処理
 */
async function main() {
  console.log('🚀 JRDB ZED Data Import Start\n');
  console.log('📂 Database:', DB_PATH);
  console.log('📂 Data directory:', DATA_DIR, '\n');

  // データベース接続
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');

  // テーブルが存在しなければ作成
  console.log('📋 Creating table jrdb_zed_race if not exists...');
  db.exec(`
    CREATE TABLE IF NOT EXISTS jrdb_zed_race (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      track_code TEXT,
      race_num TEXT,
      day_of_week TEXT,
      month TEXT,
      day TEXT,
      race_id TEXT,
      race_date TEXT NOT NULL,
      race_name TEXT,
      grade TEXT,
      distance INTEGER,
      track_type TEXT,
      track_condition TEXT,
      weather TEXT,
      race_class TEXT,
      age_limit TEXT,
      weight_type TEXT,
      prize_1 INTEGER,
      prize_2 INTEGER,
      prize_3 INTEGER,
      prize_4 INTEGER,
      prize_5 INTEGER,
      num_horses INTEGER,
      course TEXT,
      raw_data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(race_id, race_date)
    );
    
    CREATE INDEX IF NOT EXISTS idx_jrdb_zed_race_date ON jrdb_zed_race(race_date);
    CREATE INDEX IF NOT EXISTS idx_jrdb_zed_race_id ON jrdb_zed_race(race_id);
  `);
  console.log('✅ Table created successfully\n');

  // ZEDファイルを検索
  const zedFiles = fs.readdirSync(DATA_DIR)
    .filter(f => f.startsWith('ZED') && f.endsWith('.txt'))
    .sort();

  console.log(`📊 Found ${zedFiles.length} ZED files\n`);

  if (zedFiles.length === 0) {
    console.log('⚠️ No ZED files found in:', DATA_DIR);
    console.log('📝 Please copy ZED files to this directory first!');
    db.close();
    return;
  }

  let totalRecords = 0;
  let totalFiles = 0;
  const startTime = Date.now();

  // 各ファイルを処理
  for (const fileName of zedFiles) {
    const filePath = path.join(DATA_DIR, fileName);
    console.log(`📄 Processing: ${fileName}`);

    const records = parseZEDFile(filePath);
    const inserted = insertRecords(db, records);

    totalRecords += inserted;
    totalFiles++;

    console.log(`   ✅ Inserted ${inserted} records`);
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // 結果表示
  console.log('\n' + '='.repeat(50));
  console.log('✅ Import Complete!');
  console.log('='.repeat(50));
  console.log(`📊 Total files: ${totalFiles}`);
  console.log(`📊 Total records: ${totalRecords.toLocaleString()}`);
  console.log(`⏱️  Duration: ${duration}s`);
  console.log(`⚡ Speed: ${Math.round(totalRecords / parseFloat(duration))} records/sec`);
  console.log('');

  // 最終確認
  const count = db.prepare('SELECT COUNT(*) as count FROM jrdb_zed_race').get() as { count: number };
  console.log(`🗄️  Database total: ${count.count.toLocaleString()} records`);

  db.close();
}

// 実行
main().catch(console.error);
