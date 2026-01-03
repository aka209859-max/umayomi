import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';

const wranglerDir = path.join(process.cwd(), '.wrangler', 'state', 'v3', 'd1', 'miniflare-D1DatabaseObject');

if (!fs.existsSync(wranglerDir)) {
  console.error(`❌ Wrangler directory not found: ${wranglerDir}`);
  process.exit(1);
}

const files = fs.readdirSync(wranglerDir).filter(f => f.endsWith('.sqlite'));

if (files.length === 0) {
  console.error('❌ No SQLite database found');
  process.exit(1);
}

// 最新のファイルを使用（ファイルサイズでソート）
const filesWithStats = files.map(f => ({
  name: f,
  size: fs.statSync(path.join(wranglerDir, f)).size,
  path: path.join(wranglerDir, f)
}));

filesWithStats.sort((a, b) => b.size - a.size);

const dbPath = filesWithStats[0].path;

console.log(`📂 Database: ${dbPath}\n`);

const db = new Database(dbPath);

// jravan_seの構造確認
console.log('📊 jravan_se テーブル構造:\n');

const tableInfo = db.prepare(`PRAGMA table_info(jravan_se)`).all();

tableInfo.forEach((col: any) => {
  console.log(`   ${col.name}: ${col.type}${col.notnull ? ' NOT NULL' : ''}`);
});

// サンプルデータ取得
console.log('\n📄 サンプルデータ（3件）:\n');

const samples = db.prepare(`
  SELECT * FROM jravan_se 
  LIMIT 3
`).all();

samples.forEach((row: any, i: number) => {
  console.log(`\n--- レコード ${i + 1} ---`);
  Object.entries(row).forEach(([key, value]) => {
    const displayValue = typeof value === 'string' && value.length > 50 
      ? value.substring(0, 50) + '...' 
      : value;
    console.log(`   ${key}: ${displayValue}`);
  });
});

// 統計情報
console.log('\n📈 統計情報:\n');

const stats = db.prepare(`
  SELECT 
    COUNT(*) as total_count,
    COUNT(DISTINCT race_date) as unique_dates,
    COUNT(DISTINCT track_code) as unique_tracks,
    MIN(race_date) as min_date,
    MAX(race_date) as max_date
  FROM jravan_se
`).get() as any;

console.log(`   総レコード数: ${stats.total_count.toLocaleString()}件`);
console.log(`   ユニークな開催日: ${stats.unique_dates.toLocaleString()}日`);
console.log(`   ユニークな競馬場: ${stats.unique_tracks}場`);
console.log(`   期間: ${stats.min_date} ～ ${stats.max_date}`);

db.close();
