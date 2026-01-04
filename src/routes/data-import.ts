import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Context } from 'hono'

const app = new Hono()

// Enable CORS
app.use('/*', cors())

// In-memory job storage (production should use Redis/DB)
const jobs = new Map<string, ImportJob>()

interface ImportJob {
  jobId: string
  status: 'running' | 'completed' | 'error'
  dataSource: string
  startDate: string
  endDate: string
  dataPath: string
  totalFiles: number
  processedFiles: number
  totalRecords: number
  lastFile?: string
  lastRecords?: number
  speed: number
  startTime: number
  duration?: number
  averageSpeed?: number
  error?: string
}

// Start import job
app.post('/start', async (c: Context) => {
  const body = await c.req.json()
  const { dataSource, startDate, endDate, dataPath } = body

  // Validation
  if (!dataSource || !startDate || !endDate || !dataPath) {
    return c.json({ error: 'パラメータ不足: dataSource, startDate, endDate, dataPath が必要です' }, 400)
  }

  // Generate job ID
  const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(7)}`

  // Create job
  const job: ImportJob = {
    jobId,
    status: 'running',
    dataSource,
    startDate,
    endDate,
    dataPath,
    totalFiles: 0,
    processedFiles: 0,
    totalRecords: 0,
    speed: 0,
    startTime: Date.now()
  }

  jobs.set(jobId, job)

  // Start background processing
  processImport(job).catch(error => {
    job.status = 'error'
    job.error = error.message
  })

  return c.json({ jobId, status: 'started' })
})

// Get import progress
app.get('/progress/:jobId', (c: Context) => {
  const jobId = c.req.param('jobId')
  const job = jobs.get(jobId)

  if (!job) {
    return c.json({ error: 'ジョブが見つかりません' }, 404)
  }

  return c.json(job)
})

// List all jobs
app.get('/jobs', (c: Context) => {
  const allJobs = Array.from(jobs.values()).sort((a, b) => b.startTime - a.startTime)
  return c.json({ jobs: allJobs })
})

// Background processing function
async function processImport(job: ImportJob) {
  try {
    // Import appropriate module based on data source
    if (job.dataSource.startsWith('jrdb_')) {
      await processJRDB(job)
    } else if (job.dataSource.startsWith('jravan_')) {
      await processJRAVAN(job)
    } else {
      throw new Error(`未対応のデータソース: ${job.dataSource}`)
    }

    job.status = 'completed'
    job.duration = (Date.now() - job.startTime) / 1000
    job.averageSpeed = job.duration > 0 ? Math.round(job.totalRecords / job.duration) : 0
  } catch (error: any) {
    job.status = 'error'
    job.error = error.message
  }
}

async function processJRDB(job: ImportJob) {
  const fs = await import('fs')
  const path = await import('path')
  const glob = await import('glob')

  // Extract file pattern from dataPath
  // E.g., "E:\UMAYOMI\jrdb_data\PACI*\ZED*.txt" -> need to handle Windows paths
  const pattern = job.dataPath.replace(/\\/g, '/')

  // Get list of files
  const files = glob.sync(pattern).sort()

  if (files.length === 0) {
    throw new Error(`ファイルが見つかりません: ${job.dataPath}`)
  }

  // Filter files by date range
  const filteredFiles = filterFilesByDateRange(files, job.startDate, job.endDate, job.dataSource)

  job.totalFiles = filteredFiles.length

  console.log(`📂 対象ファイル: ${filteredFiles.length}件`)
  console.log(`📅 期間: ${job.startDate} ～ ${job.endDate}`)

  // Import parser
  const { parseZEDFile } = await import('../parsers/jrdb/zed')
  const Database = (await import('better-sqlite3')).default

  // Database connection
  const DB_PATH = path.join(
    process.cwd(),
    '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/0aedb352c8e6bb5c4415dfb2780580e45d94a7381c9bdb7654f57812c160c7ad.sqlite'
  )

  const db = new Database(DB_PATH)
  db.pragma('journal_mode = WAL')
  db.pragma('synchronous = NORMAL')

  // Process each file
  for (const file of filteredFiles) {
    try {
      let records: any[] = []
      let inserted = 0

      // Parse based on data source type
      if (job.dataSource === 'jrdb_zed') {
        records = parseZEDFile(file)
        inserted = insertZEDRecords(db, records)
      } else {
        // TODO: Add other JRDB parsers
        console.log(`⚠️ パーサー未実装: ${job.dataSource}`)
        continue
      }

      job.processedFiles++
      job.totalRecords += inserted
      job.lastFile = path.basename(file)
      job.lastRecords = inserted

      // Calculate speed
      const elapsed = (Date.now() - job.startTime) / 1000
      job.speed = elapsed > 0 ? Math.round(job.totalRecords / elapsed) : 0

      console.log(`✅ ${job.lastFile}: ${inserted} records`)

      // Small delay to allow UI updates
      await new Promise(resolve => setTimeout(resolve, 10))
    } catch (error: any) {
      console.error(`❌ ${path.basename(file)}: ${error.message}`)
    }
  }

  db.close()
}

function insertZEDRecords(db: any, records: any[]): number {
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
          record.trackCode,
          record.raceNum,
          record.dayOfWeek,
          record.month,
          record.day,
          record.raceId,
          record.raceDate,
          record.raceName,
          record.grade,
          record.distance,
          record.trackType,
          record.trackCondition,
          record.weather,
          record.raceClass,
          record.ageLimit,
          record.weightType,
          record.prize1,
          record.prize2,
          record.prize3,
          record.prize4,
          record.prize5,
          record.numHorses,
          record.course,
          record.rawData
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

async function processJRAVAN(job: ImportJob) {
  // TODO: Implement JRA-VAN import logic
  throw new Error('JRA-VAN インポートは未実装です')
}

function filterFilesByDateRange(
  files: string[],
  startDate: string,
  endDate: string,
  dataSource: string
): string[] {
  const start = new Date(startDate)
  const end = new Date(endDate)

  return files.filter(file => {
    const fileName = file.split(/[\\/]/).pop()!

    // Extract date from filename based on data source
    let fileDate: Date | null = null

    if (dataSource === 'jrdb_zed') {
      // ZED250105.txt -> 2025-01-05
      const match = fileName.match(/ZED(\d{2})(\d{2})(\d{2})\.txt/i)
      if (match) {
        const year = 2000 + parseInt(match[1])
        const month = parseInt(match[2])
        const day = parseInt(match[3])
        fileDate = new Date(year, month - 1, day)
      }
    }
    // TODO: Add other file format patterns

    if (!fileDate) return false

    return fileDate >= start && fileDate <= end
  })
}

export default app
