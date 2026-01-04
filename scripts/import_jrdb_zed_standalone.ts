#!/usr/bin/env tsx

/**
 * JRDB ZED Standalone Import Script
 * 
 * This script imports JRDB ZED files with date range filtering.
 * Run directly from Windows PowerShell or command line.
 * 
 * Usage:
 *   npx tsx scripts/import_jrdb_zed_standalone.ts <data_path> <start_date> <end_date>
 * 
 * Example:
 *   npx tsx scripts/import_jrdb_zed_standalone.ts "E:\test_zed\ZED*.txt" 2014-01-01 2025-08-24
 */

import * as fs from 'fs'
import * as path from 'path'
import * as glob from 'glob'
import Database from 'better-sqlite3'
import iconv from 'iconv-lite'
import { ZEDParser } from '../src/parsers/jrdb/zed'

// Helper function to parse ZED file
function parseZEDFile(filePath: string): any[] {
  const buffer = fs.readFileSync(filePath)
  
  try {
    // Decode Shift-JIS to UTF-8
    const decoded = iconv.decode(buffer, 'shift_jis')
    const lines = decoded.split(/\r?\n/).filter(l => l.trim().length > 0)
    
    const records: any[] = []
    for (const line of lines) {
      const record = ZEDParser.parseLine(line)
      if (record) {
        records.push(record)
      }
    }
    
    return records
  } catch (error: any) {
    console.error(`Parse error: ${error.message}`)
    return []
  }
}

// Database path
const DB_PATH = path.join(
  process.cwd(),
  '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/0aedb352c8e6bb5c4415dfb2780580e45d94a7381c9bdb7654f57812c160c7ad.sqlite'
)

interface ImportStats {
  totalFiles: number
  processedFiles: number
  totalRecords: number
  skippedFiles: number
  errorFiles: number
  startTime: number
  endTime?: number
}

function parseArgs() {
  const args = process.argv.slice(2)
  
  if (args.length < 3) {
    console.error('❌ Usage: npx tsx scripts/import_jrdb_zed_standalone.ts <data_path> <start_date> <end_date>')
    console.error('')
    console.error('Example:')
    console.error('  npx tsx scripts/import_jrdb_zed_standalone.ts "E:\\test_zed\\ZED*.txt" 2014-01-01 2025-08-24')
    console.error('')
    console.error('Arguments:')
    console.error('  data_path   : File pattern (e.g., E:\\test_zed\\ZED*.txt)')
    console.error('  start_date  : Start date (YYYY-MM-DD)')
    console.error('  end_date    : End date (YYYY-MM-DD)')
    process.exit(1)
  }
  
  const dataPath = args[0]
  const startDate = args[1]
  const endDate = args[2]
  
  // Validate dates
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
    console.error('❌ Invalid date format. Use YYYY-MM-DD (e.g., 2024-01-01)')
    process.exit(1)
  }
  
  return { dataPath, startDate, endDate }
}

function filterFilesByDateRange(files: string[], startDate: string, endDate: string): string[] {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  return files.filter(file => {
    const fileName = path.basename(file)
    
    // Extract date from filename: ZED250105.txt -> 2025-01-05
    const match = fileName.match(/ZED(\d{2})(\d{2})(\d{2})\.txt/i)
    if (!match) return false
    
    const year = 2000 + parseInt(match[1])
    const month = parseInt(match[2])
    const day = parseInt(match[3])
    const fileDate = new Date(year, month - 1, day)
    
    return fileDate >= start && fileDate <= end
  })
}

function createTable(db: Database.Database) {
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
    )
  `)
  
  db.exec(`CREATE INDEX IF NOT EXISTS idx_jrdb_zed_race_date ON jrdb_zed_race(race_date)`)
  db.exec(`CREATE INDEX IF NOT EXISTS idx_jrdb_zed_race_id ON jrdb_zed_race(race_id)`)
  
  console.log('✅ Table created: jrdb_zed_race')
}

function insertRecords(db: Database.Database, records: any[]): number {
  if (records.length === 0) return 0
  
  try {
    const insertStmt = db.prepare(`
      INSERT OR IGNORE INTO jrdb_zed_race (
        track_code, race_num, day_of_week, month, day, race_id, race_date,
        race_name, grade, distance, track_type, track_condition, weather,
        race_class, age_limit, weight_type, prize_1, prize_2, prize_3,
        prize_4, prize_5, num_horses, course, raw_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    const insertMany = db.transaction((records: any[]) => {
      for (const record of records) {
        insertStmt.run(
          record.track_code || '',
          record.race_number || '',
          record.day_of_week || '',
          record.month || '',
          record.day || '',
          record.race_id || '',
          record.race_date || '',
          record.race_name_raw || '',
          '', // grade
          0,  // distance
          '', // track_type
          '', // track_condition
          '', // weather
          record.race_class || '',
          record.age_limit || '',
          '', // weight_type
          0,  // prize_1
          0,  // prize_2
          0,  // prize_3
          0,  // prize_4
          0,  // prize_5
          0,  // num_horses
          '', // course
          record.raw_data || ''
        )
      }
    })
    
    insertMany(records)
    return records.length
  } catch (error: any) {
    console.error(`❌ Insert error: ${error.message}`)
    return 0
  }
}

function printProgress(stats: ImportStats, currentFile?: string) {
  const elapsed = (Date.now() - stats.startTime) / 1000
  const speed = elapsed > 0 ? Math.round(stats.totalRecords / elapsed) : 0
  const percent = stats.totalFiles > 0 ? ((stats.processedFiles / stats.totalFiles) * 100).toFixed(1) : '0.0'
  
  process.stdout.write('\r\x1b[K') // Clear line
  process.stdout.write(
    `📊 進捗: ${stats.processedFiles}/${stats.totalFiles} (${percent}%) | ` +
    `レコード: ${stats.totalRecords.toLocaleString()} | ` +
    `速度: ${speed.toLocaleString()} rec/s | ` +
    `経過: ${elapsed.toFixed(1)}s`
  )
  
  if (currentFile) {
    process.stdout.write(` | 処理中: ${currentFile}`)
  }
}

async function main() {
  console.log('🚀 JRDB ZED Standalone Import Script\n')
  
  // Parse arguments
  const { dataPath, startDate, endDate } = parseArgs()
  
  console.log('📋 設定:')
  console.log(`  データパス: ${dataPath}`)
  console.log(`  期間: ${startDate} ～ ${endDate}`)
  console.log(`  データベース: ${DB_PATH}\n`)
  
  // Get file list
  console.log('📂 ファイル検索中...')
  const allFiles = glob.sync(dataPath.replace(/\\/g, '/')).sort()
  
  if (allFiles.length === 0) {
    console.error(`❌ ファイルが見つかりません: ${dataPath}`)
    process.exit(1)
  }
  
  console.log(`✅ 全ファイル: ${allFiles.length}件`)
  
  // Filter by date range
  const files = filterFilesByDateRange(allFiles, startDate, endDate)
  console.log(`✅ 対象ファイル: ${files.length}件\n`)
  
  if (files.length === 0) {
    console.error(`❌ 指定期間のファイルが見つかりません`)
    process.exit(1)
  }
  
  // Open database
  const db = new Database(DB_PATH)
  db.pragma('journal_mode = WAL')
  db.pragma('synchronous = NORMAL')
  
  // Create table
  createTable(db)
  
  // Import statistics
  const stats: ImportStats = {
    totalFiles: files.length,
    processedFiles: 0,
    totalRecords: 0,
    skippedFiles: 0,
    errorFiles: 0,
    startTime: Date.now()
  }
  
  console.log('📥 取り込み開始...\n')
  
  // Process each file
  for (const file of files) {
    const fileName = path.basename(file)
    printProgress(stats, fileName)
    
    try {
      const records = parseZEDFile(file)
      const inserted = insertRecords(db, records)
      
      stats.processedFiles++
      stats.totalRecords += inserted
      
      if (inserted === 0 && records.length > 0) {
        stats.skippedFiles++
      }
    } catch (error: any) {
      stats.errorFiles++
      console.error(`\n❌ ${fileName}: ${error.message}`)
    }
  }
  
  stats.endTime = Date.now()
  const duration = (stats.endTime - stats.startTime) / 1000
  const averageSpeed = duration > 0 ? Math.round(stats.totalRecords / duration) : 0
  
  // Final progress
  printProgress(stats)
  console.log('\n')
  
  // Get total count
  const totalCount = db.prepare('SELECT COUNT(*) as count FROM jrdb_zed_race').get() as { count: number }
  
  console.log('\n✅ 取り込み完了！\n')
  console.log('📊 結果:')
  console.log(`  処理ファイル: ${stats.processedFiles}/${stats.totalFiles}`)
  console.log(`  取り込みレコード: ${stats.totalRecords.toLocaleString()}件`)
  console.log(`  スキップ: ${stats.skippedFiles}件（重複）`)
  console.log(`  エラー: ${stats.errorFiles}件`)
  console.log(`  処理時間: ${duration.toFixed(2)}秒`)
  console.log(`  平均速度: ${averageSpeed.toLocaleString()} records/sec`)
  console.log(`  DB総レコード数: ${totalCount.count.toLocaleString()}件`)
  
  db.close()
  
  console.log('\n🎉 完了！')
}

main().catch(error => {
  console.error(`\n❌ Fatal error: ${error.message}`)
  console.error(error.stack)
  process.exit(1)
})
