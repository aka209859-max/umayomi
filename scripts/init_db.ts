/**
 * UMAYOMI CrossFactor型システム - データベース初期化スクリプト
 * 
 * 用途:
 * - SQLiteデータベースの作成
 * - テーブル・インデックスの作成
 * - 初期データ投入
 * 
 * 実行方法:
 * npx tsx scripts/init_db.ts
 */

import Database from 'better-sqlite3'
import { readFileSync } from 'fs'
import path from 'path'

const DB_PATH = process.env.DB_PATH || 'E:\\UMAYOMI\\umayomi.db'
const MIGRATION_FILE = path.join(process.cwd(), 'migrations/0004_create_crossfactor_tables.sql')

async function initDatabase() {
  console.log('🚀 UMAYOMI データベース初期化開始...')
  console.log(`📁 DB Path: ${DB_PATH}`)
  
  try {
    // 1. データベース接続
    console.log('\n1️⃣ データベース接続中...')
    const db = new Database(DB_PATH)
    console.log('✅ 接続成功')
    
    // 2. マイグレーションファイル読み込み
    console.log('\n2️⃣ マイグレーションファイル読み込み中...')
    const sql = readFileSync(MIGRATION_FILE, 'utf-8')
    console.log(`✅ ${MIGRATION_FILE} 読み込み完了`)
    
    // 3. SQLを実行（複数のステートメントを分割実行）
    console.log('\n3️⃣ テーブル作成中...')
    db.exec(sql)
    console.log('✅ 全テーブル作成完了')
    
    // 4. テーブル一覧確認
    console.log('\n4️⃣ 作成されたテーブル一覧:')
    const tables = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `).all() as { name: string }[]
    
    tables.forEach(table => {
      if (!table.name.startsWith('sqlite_')) {
        console.log(`   ✅ ${table.name}`)
      }
    })
    
    // 5. インデックス一覧確認
    console.log('\n5️⃣ 作成されたインデックス一覧:')
    const indexes = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='index' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `).all() as { name: string }[]
    
    indexes.forEach(index => {
      console.log(`   ✅ ${index.name}`)
    })
    
    // 6. トリガー一覧確認
    console.log('\n6️⃣ 作成されたトリガー一覧:')
    const triggers = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='trigger'
      ORDER BY name
    `).all() as { name: string }[]
    
    triggers.forEach(trigger => {
      console.log(`   ✅ ${trigger.name}`)
    })
    
    // 7. 初期データ確認
    console.log('\n7️⃣ 初期データ確認:')
    
    // registered_factors
    const factorCount = db.prepare('SELECT COUNT(*) as count FROM registered_factors').get() as { count: number }
    console.log(`   ✅ registered_factors: ${factorCount.count}件`)
    
    if (factorCount.count > 0) {
      const factors = db.prepare('SELECT id, name FROM registered_factors').all() as { id: number, name: string }[]
      factors.forEach(f => {
        console.log(`      - [${f.id}] ${f.name}`)
      })
    }
    
    // system_settings
    const settingCount = db.prepare('SELECT COUNT(*) as count FROM system_settings').get() as { count: number }
    console.log(`   ✅ system_settings: ${settingCount.count}件`)
    
    if (settingCount.count > 0) {
      const settings = db.prepare('SELECT key, value FROM system_settings').all() as { key: string, value: string }[]
      settings.forEach(s => {
        console.log(`      - ${s.key}: ${s.value}`)
      })
    }
    
    // 8. データベースサイズ確認
    console.log('\n8️⃣ データベース情報:')
    const dbSize = db.prepare('SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()').get() as { size: number }
    console.log(`   📊 サイズ: ${(dbSize.size / 1024).toFixed(2)} KB`)
    
    // 9. 接続終了
    db.close()
    console.log('\n✅ データベース初期化完了！')
    console.log(`\n🎉 ${DB_PATH} が正常に作成されました！`)
    
  } catch (error) {
    console.error('\n❌ エラーが発生しました:')
    console.error(error)
    process.exit(1)
  }
}

// 実行
initDatabase()
