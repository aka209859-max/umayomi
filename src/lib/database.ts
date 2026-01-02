/**
 * UMAYOMI CrossFactor型システム - データベースクライアント
 * 
 * SQLiteデータベースへのアクセスを提供
 */

import Database from 'better-sqlite3'
import type {
  RegisteredFactor,
  TomorrowRace,
  RacePrediction,
  HorseHistoryCache,
  SystemSetting,
  UMAYOMIDatabase
} from '../types/database'

export class UMAYOMIDatabaseClient implements UMAYOMIDatabase {
  private db: Database.Database

  constructor(dbPath: string) {
    this.db = new Database(dbPath)
    // WALモード（並行アクセス高速化）
    this.db.pragma('journal_mode = WAL')
  }

  // ============================================================
  // registered_factors
  // ============================================================

  getFactors(): RegisteredFactor[] {
    return this.db.prepare(`
      SELECT * FROM registered_factors
      ORDER BY created_at DESC
    `).all() as RegisteredFactor[]
  }

  getActiveFactor(id: number): RegisteredFactor | undefined {
    return this.db.prepare(`
      SELECT * FROM registered_factors
      WHERE id = ? AND is_active = 1
    `).get(id) as RegisteredFactor | undefined
  }

  createFactor(factor: Omit<RegisteredFactor, 'id' | 'created_at' | 'updated_at'>): number {
    const result = this.db.prepare(`
      INSERT INTO registered_factors (name, formula, conditions, description, is_active)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      factor.name,
      factor.formula,
      factor.conditions,
      factor.description || null,
      factor.is_active ?? 1
    )
    return result.lastInsertRowid as number
  }

  updateFactor(id: number, factor: Partial<RegisteredFactor>): void {
    const fields: string[] = []
    const values: any[] = []

    if (factor.name !== undefined) {
      fields.push('name = ?')
      values.push(factor.name)
    }
    if (factor.formula !== undefined) {
      fields.push('formula = ?')
      values.push(factor.formula)
    }
    if (factor.conditions !== undefined) {
      fields.push('conditions = ?')
      values.push(factor.conditions)
    }
    if (factor.description !== undefined) {
      fields.push('description = ?')
      values.push(factor.description)
    }
    if (factor.is_active !== undefined) {
      fields.push('is_active = ?')
      values.push(factor.is_active)
    }

    if (fields.length > 0) {
      values.push(id)
      this.db.prepare(`
        UPDATE registered_factors
        SET ${fields.join(', ')}
        WHERE id = ?
      `).run(...values)
    }
  }

  deleteFactor(id: number): void {
    this.db.prepare('DELETE FROM registered_factors WHERE id = ?').run(id)
  }

  // ============================================================
  // tomorrow_races
  // ============================================================

  getTomorrowRaces(date: string): TomorrowRace[] {
    return this.db.prepare(`
      SELECT * FROM tomorrow_races
      WHERE race_date = ?
      ORDER BY venue, race_number, horse_number
    `).all(date) as TomorrowRace[]
  }

  getTomorrowRacesByVenue(date: string, venue: string): TomorrowRace[] {
    return this.db.prepare(`
      SELECT * FROM tomorrow_races
      WHERE race_date = ? AND venue = ?
      ORDER BY race_number, horse_number
    `).all(date, venue) as TomorrowRace[]
  }

  importTomorrowRaces(races: Omit<TomorrowRace, 'imported_at'>[]): void {
    const insert = this.db.prepare(`
      INSERT OR REPLACE INTO tomorrow_races (
        race_date, venue, race_number, horse_number,
        horse_id, horse_name, jockey_id, jockey_name,
        trainer_id, trainer_name, odds, weight, age, sex,
        course_type, distance, grade, class, race_name, post_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const insertMany = this.db.transaction((races: Omit<TomorrowRace, 'imported_at'>[]) => {
      for (const race of races) {
        insert.run(
          race.race_date, race.venue, race.race_number, race.horse_number,
          race.horse_id, race.horse_name, race.jockey_id, race.jockey_name,
          race.trainer_id, race.trainer_name, race.odds, race.weight,
          race.age, race.sex, race.course_type, race.distance,
          race.grade, race.class, race.race_name, race.post_time
        )
      }
    })

    insertMany(races)
  }

  clearTomorrowRaces(date: string): void {
    this.db.prepare('DELETE FROM tomorrow_races WHERE race_date = ?').run(date)
  }

  // ============================================================
  // race_predictions
  // ============================================================

  getPredictions(date: string): RacePrediction[] {
    return this.db.prepare(`
      SELECT * FROM race_predictions
      WHERE race_date = ?
      ORDER BY venue, race_number, rank
    `).all(date) as RacePrediction[]
  }

  getPredictionsByRace(date: string, venue: string, raceNumber: number): RacePrediction[] {
    return this.db.prepare(`
      SELECT * FROM race_predictions
      WHERE race_date = ? AND venue = ? AND race_number = ?
      ORDER BY rank
    `).all(date, venue, raceNumber) as RacePrediction[]
  }

  savePredictions(predictions: Omit<RacePrediction, 'predicted_at'>[]): void {
    const insert = this.db.prepare(`
      INSERT OR REPLACE INTO race_predictions (
        race_date, venue, race_number, horse_number,
        horse_name, factor_scores, total_score, rank
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const insertMany = this.db.transaction((predictions: Omit<RacePrediction, 'predicted_at'>[]) => {
      for (const pred of predictions) {
        insert.run(
          pred.race_date, pred.venue, pred.race_number, pred.horse_number,
          pred.horse_name, pred.factor_scores, pred.total_score, pred.rank
        )
      }
    })

    insertMany(predictions)
  }

  clearPredictions(date: string): void {
    this.db.prepare('DELETE FROM race_predictions WHERE race_date = ?').run(date)
  }

  // ============================================================
  // horse_history_cache
  // ============================================================

  getHorseHistory(horseId: string): HorseHistoryCache | undefined {
    return this.db.prepare(`
      SELECT * FROM horse_history_cache
      WHERE horse_id = ?
    `).get(horseId) as HorseHistoryCache | undefined
  }

  saveHorseHistory(cache: Omit<HorseHistoryCache, 'cached_at' | 'updated_at'>): void {
    this.db.prepare(`
      INSERT OR REPLACE INTO horse_history_cache (
        horse_id, horse_name, history, last_race_date,
        total_races, wins, places
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      cache.horse_id,
      cache.horse_name,
      cache.history,
      cache.last_race_date,
      cache.total_races,
      cache.wins,
      cache.places
    )
  }

  clearExpiredCache(days: number): void {
    this.db.prepare(`
      DELETE FROM horse_history_cache
      WHERE datetime(updated_at) < datetime('now', '-' || ? || ' days')
    `).run(days)
  }

  // ============================================================
  // system_settings
  // ============================================================

  getSetting(key: string): SystemSetting | undefined {
    return this.db.prepare(`
      SELECT * FROM system_settings WHERE key = ?
    `).get(key) as SystemSetting | undefined
  }

  setSetting(key: string, value: string, description?: string): void {
    this.db.prepare(`
      INSERT OR REPLACE INTO system_settings (key, value, description)
      VALUES (?, ?, ?)
    `).run(key, value, description || null)
  }

  // ============================================================
  // ユーティリティ
  // ============================================================

  close(): void {
    this.db.close()
  }

  /**
   * データベースの統計情報を取得
   */
  getStats() {
    const tables = [
      'registered_factors',
      'tomorrow_races',
      'race_predictions',
      'horse_history_cache',
      'system_settings'
    ]

    const stats: Record<string, number> = {}

    for (const table of tables) {
      const result = this.db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get() as { count: number }
      stats[table] = result.count
    }

    return stats
  }

  /**
   * データベースのバキューム（最適化）
   */
  vacuum(): void {
    this.db.prepare('VACUUM').run()
  }
}

// シングルトンインスタンス
let instance: UMAYOMIDatabaseClient | null = null

export function getDatabase(dbPath?: string): UMAYOMIDatabaseClient {
  if (!instance) {
    const path = dbPath || process.env.DB_PATH || 'E:\\UMAYOMI\\umayomi.db'
    instance = new UMAYOMIDatabaseClient(path)
  }
  return instance
}

export function closeDatabase(): void {
  if (instance) {
    instance.close()
    instance = null
  }
}
