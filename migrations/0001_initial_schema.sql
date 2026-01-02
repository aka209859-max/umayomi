-- UMAYOMI Database Schema
-- Phase 4 完成版

-- ファクター登録テーブル
CREATE TABLE IF NOT EXISTS registered_factors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  conditions TEXT NOT NULL,  -- JSON形式で条件を保存
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 翌日レーステーブル
CREATE TABLE IF NOT EXISTS tomorrow_races (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  track_code TEXT NOT NULL,
  race_date TEXT NOT NULL,
  race_number TEXT NOT NULL,
  horse_number TEXT NOT NULL,
  horse_id TEXT NOT NULL,
  raw_data TEXT,  -- HC Parserの生データ保存
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(track_code, race_date, race_number, horse_number)
);

-- レース予測結果テーブル
CREATE TABLE IF NOT EXISTS race_predictions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_key TEXT NOT NULL,  -- track-date-race形式
  horse_number TEXT NOT NULL,
  horse_id TEXT NOT NULL,
  factor_id INTEGER NOT NULL,
  rgs REAL,  -- Race Grade Score
  aas REAL,  -- Ability Assessment Score
  total_score REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (factor_id) REFERENCES registered_factors(id),
  UNIQUE(race_key, horse_number, factor_id)
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_registered_factors_created_at ON registered_factors(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tomorrow_races_race_key ON tomorrow_races(track_code, race_date, race_number);
CREATE INDEX IF NOT EXISTS idx_tomorrow_races_horse_id ON tomorrow_races(horse_id);
CREATE INDEX IF NOT EXISTS idx_race_predictions_race_key ON race_predictions(race_key);
CREATE INDEX IF NOT EXISTS idx_race_predictions_factor_id ON race_predictions(factor_id);
