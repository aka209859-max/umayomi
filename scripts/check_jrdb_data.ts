import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';

const wranglerDir = path.join(process.cwd(), '.wrangler', 'state', 'v3', 'd1', 'miniflare-D1DatabaseObject');
const files = fs.readdirSync(wranglerDir).filter(f => f.endsWith('.sqlite'));
const filesWithStats = files.map(f => ({
  name: f,
  size: fs.statSync(path.join(wranglerDir, f)).size,
  path: path.join(wranglerDir, f)
}));
filesWithStats.sort((a, b) => b.size - a.size);
const dbPath = filesWithStats[0].path;

console.log(`📂 Database: ${dbPath}\n`);

const db = new Database(dbPath);

// jrdb_hjc テーブル構造確認
console.log('📊 jrdb_hjc テーブル構造:\n');
const hjcInfo = db.prepare(`PRAGMA table_info(jrdb_hjc)`).all();
hjcInfo.forEach((col: any) => {
  console.log(`   ${col.name}: ${col.type}${col.notnull ? ' NOT NULL' : ''}`);
});

// jrdb_ov テーブル構造確認
console.log('\n📊 jrdb_ov テーブル構造:\n');
const ovInfo = db.prepare(`PRAGMA table_info(jrdb_ov)`).all();
ovInfo.forEach((col: any) => {
  console.log(`   ${col.name}: ${col.type}${col.notnull ? ' NOT NULL' : ''}`);
});

// サンプルデータ取得
console.log('\n📄 jrdb_hjc サンプルデータ（3件）:\n');
const hjcSamples = db.prepare(`SELECT * FROM jrdb_hjc LIMIT 3`).all();
hjcSamples.forEach((row: any, i: number) => {
  console.log(`\n--- レコード ${i + 1} ---`);
  Object.entries(row).forEach(([key, value]) => {
    const displayValue = typeof value === 'string' && value.length > 50 
      ? value.substring(0, 50) + '...' 
      : value;
    console.log(`   ${key}: ${displayValue}`);
  });
});

console.log('\n📄 jrdb_ov サンプルデータ（3件）:\n');
const ovSamples = db.prepare(`SELECT * FROM jrdb_ov LIMIT 3`).all();
ovSamples.forEach((row: any, i: number) => {
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
const hjcStats = db.prepare(`
  SELECT 
    COUNT(*) as total_count,
    COUNT(DISTINCT race_id) as unique_races
  FROM jrdb_hjc
`).get() as any;

console.log(`   jrdb_hjc 総レコード数: ${hjcStats.total_count.toLocaleString()}件`);
console.log(`   jrdb_hjc ユニークレース: ${hjcStats.unique_races.toLocaleString()}件`);

const ovStats = db.prepare(`
  SELECT 
    COUNT(*) as total_count,
    COUNT(DISTINCT race_id) as unique_races
  FROM jrdb_ov
`).get() as any;

console.log(`   jrdb_ov 総レコード数: ${ovStats.total_count.toLocaleString()}件`);
console.log(`   jrdb_ov ユニークレース: ${ovStats.unique_races.toLocaleString()}件`);

db.close();
