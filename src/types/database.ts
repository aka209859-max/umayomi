/**
 * UMAYOMI CrossFactor型システム - データベース型定義
 */

// ============================================================
// 1. 登録済みファクター
// ============================================================
export interface RegisteredFactor {
  id: number
  name: string
  formula: string
  conditions: string  // JSON文字列
  description: string | null
  is_active: number  // 1: 有効, 0: 無効
  created_at: string
  updated_at: string
}

export interface FactorConditions {
  area1: {
    course_type?: string[]      // 例: ["芝", "ダート"]
    distance_min?: number        // 例: 1600
    distance_max?: number        // 例: 1600
    venues?: string[]            // 例: ["東京", "中山"]
  }
  area2: {
    sex?: string[]               // 例: ["牡", "牝"]
    age_min?: number             // 例: 4
    age_max?: number             // 例: 99
    weight_min?: number          // 例: 450
    weight_max?: number          // 例: 550
  }
  area3: {
    grades?: string[]            // 例: ["G1", "G2", "G3"]
    classes?: string[]           // 例: ["OP", "3勝"]
    date_from?: string           // 例: "2020-01-01"
    date_to?: string             // 例: "2024-12-31"
  }
  correction: {
    period: {
      recent_3m?: number         // 例: 1.0
      recent_6m?: number         // 例: 0.8
      recent_1y?: number         // 例: 0.5
    }
    odds: {
      min: number                // 例: 1.0
      max: number                // 例: 20.0
    }
  }
}

// ============================================================
// 2. 翌日の出走表
// ============================================================
export interface TomorrowRace {
  race_date: string              // 例: "20250104"
  venue: string                  // 例: "東京"
  race_number: number            // 例: 10
  horse_number: number           // 例: 3
  horse_id: string               // 例: "2020104567"
  horse_name: string | null      // 例: "ドウデュース"
  jockey_id: string | null       // 例: "01234"
  jockey_name: string | null     // 例: "福永祐一"
  trainer_id: string | null      // 例: "05678"
  trainer_name: string | null    // 例: "友道康夫"
  odds: number | null            // 例: 2.5
  weight: number | null          // 例: 498.0
  age: number | null             // 例: 4
  sex: string | null             // 例: "牡"
  course_type: string | null     // 例: "芝"
  distance: number | null        // 例: 1600
  grade: string | null           // 例: "G3"
  class: string | null           // 例: "OP"
  race_name: string | null       // 例: "ニューイヤーS"
  post_time: string | null       // 例: "15:30"
  imported_at: string
}

// ============================================================
// 3. 予想結果
// ============================================================
export interface RacePrediction {
  race_date: string
  venue: string
  race_number: number
  horse_number: number
  horse_name: string | null
  factor_scores: string          // JSON文字列
  total_score: number
  rank: number | null
  predicted_at: string
}

export interface FactorScore {
  factor_id: number
  factor_name: string
  score: number
  analysis: AnalysisResult
}

export interface AnalysisResult {
  win_count: number              // 単勝的中回数
  place_count: number            // 複勝的中回数
  win_hit_rate: number           // 単勝的中率
  place_hit_rate: number         // 複勝的中率
  win_corrected_recovery: number // 単勝補正回収率
  place_corrected_recovery: number // 複勝補正回収率
  matched_races: number          // 条件に合致したレース数
}

// ============================================================
// 4. 馬の過去成績キャッシュ
// ============================================================
export interface HorseHistoryCache {
  horse_id: string
  horse_name: string | null
  history: string                // JSON文字列
  last_race_date: string | null
  total_races: number | null
  wins: number | null
  places: number | null
  cached_at: string
  updated_at: string
}

export interface HorseHistoryRecord {
  race_date: string              // 例: "20241215"
  venue: string                  // 例: "中山"
  race_number: number            // 例: 11
  course_type: string            // 例: "芝"
  distance: number               // 例: 2500
  grade: string | null           // 例: "G1"
  class: string | null           // 例: "OP"
  finish_position: number        // 例: 1
  horse_number: number           // 例: 3
  odds: number                   // 例: 2.5
  popularity: number             // 例: 1
  margin: number | null          // 例: 0.2
  final_time: string | null      // 例: "2:32.5"
  jockey_id: string | null       // 例: "01234"
  weight: number | null          // 例: 498
}

// ============================================================
// 5. システム設定
// ============================================================
export interface SystemSetting {
  key: string
  value: string                  // JSON文字列
  description: string | null
  updated_at: string
}

// ============================================================
// ユーティリティ型
// ============================================================

// JSONパース済みの型
export interface RegisteredFactorParsed extends Omit<RegisteredFactor, 'conditions'> {
  conditions: FactorConditions
}

export interface RacePredictionParsed extends Omit<RacePrediction, 'factor_scores'> {
  factor_scores: FactorScore[]
}

export interface HorseHistoryCacheParsed extends Omit<HorseHistoryCache, 'history'> {
  history: HorseHistoryRecord[]
}

export interface SystemSettingParsed<T = any> extends Omit<SystemSetting, 'value'> {
  value: T
}

// ============================================================
// データベースクライアント型
// ============================================================
export interface UMAYOMIDatabase {
  // registered_factors
  getFactors(): RegisteredFactor[]
  getActiveFactor(id: number): RegisteredFactor | undefined
  createFactor(factor: Omit<RegisteredFactor, 'id' | 'created_at' | 'updated_at'>): number
  updateFactor(id: number, factor: Partial<RegisteredFactor>): void
  deleteFactor(id: number): void
  
  // tomorrow_races
  getTomorrowRaces(date: string): TomorrowRace[]
  getTomorrowRacesByVenue(date: string, venue: string): TomorrowRace[]
  importTomorrowRaces(races: Omit<TomorrowRace, 'imported_at'>[]): void
  clearTomorrowRaces(date: string): void
  
  // race_predictions
  getPredictions(date: string): RacePrediction[]
  getPredictionsByRace(date: string, venue: string, raceNumber: number): RacePrediction[]
  savePredictions(predictions: Omit<RacePrediction, 'predicted_at'>[]): void
  clearPredictions(date: string): void
  
  // horse_history_cache
  getHorseHistory(horseId: string): HorseHistoryCache | undefined
  saveHorseHistory(cache: Omit<HorseHistoryCache, 'cached_at' | 'updated_at'>): void
  clearExpiredCache(days: number): void
  
  // system_settings
  getSetting(key: string): SystemSetting | undefined
  setSetting(key: string, value: string, description?: string): void
}
