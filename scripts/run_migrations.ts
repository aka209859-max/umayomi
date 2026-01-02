/**
 * UMAYOMI - マイグレーション実行スクリプト
 * 
 * CEO PCでの実行を想定
 * E:\UMAYOMI\umayomi.db に対してマイグレーションを実行
 */

import * as fs from 'fs';
import * as path from 'path';
import Database from 'better-sqlite3';

// ================================================
// 設定
// ================================================

const DB_PATH = 'E:\\UMAYOMI\\umayomi.db';
const MIGRATIONS_DIR = path.join(__dirname, '../migrations');

// ================================================
// メイン処理
// ================================================

async function runMigrations() {
  console.log('🚀 マイグレーション実行開始\n');
  console.log(`💾 データベース: ${DB_PATH}`);
  console.log(`📂 マイグレーションディレクトリ: ${MIGRATIONS_DIR}\n`);

  // データベース接続
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');

  try {
    // マイグレーションファイル一覧取得
    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log(`📋 マイグレーションファイル数: ${files.length}件\n`);

    for (const file of files) {
      console.log(`🔄 実行中: ${file}`);
      
      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filePath, 'utf-8');
      
      // SQLを実行
      db.exec(sql);
      
      console.log(`   ✅ 完了\n`);
    }

    // テーブル一覧表示
    const tables = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `).all();

    console.log('📊 作成済みテーブル:');
    tables.forEach((table: any) => {
      console.log(`   - ${table.name}`);
    });

    console.log('\n✅ マイグレーション実行完了！');
  } catch (error) {
    console.error('❌ エラー発生:', error);
    throw error;
  } finally {
    db.close();
  }
}

// ================================================
// 実行
// ================================================

if (require.main === module) {
  runMigrations().catch(console.error);
}
