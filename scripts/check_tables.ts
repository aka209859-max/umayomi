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

console.log('\n📁 利用可能なデータベースファイル:');
filesWithStats.forEach(f => {
  const sizeMB = (f.size / 1024 / 1024).toFixed(2);
  console.log(`   ${f.name.substring(0, 8)}... (${sizeMB} MB)`);
});

const dbPath = filesWithStats[0].path;  // 最大サイズのファイル

console.log(`📂 Database: ${dbPath}\n`);

const db = new Database(dbPath);

// すべてのテーブル一覧
const tables = db.prepare(`
  SELECT name, type FROM sqlite_master 
  WHERE type='table' 
  ORDER BY name
`).all();

console.log('📊 全テーブル一覧:\n');
tables.forEach((t: any) => {
  const count = db.prepare(`SELECT COUNT(*) as cnt FROM ${t.name}`).get() as any;
  console.log(`   ${t.name}: ${count.cnt.toLocaleString()}件`);
});

db.close();
