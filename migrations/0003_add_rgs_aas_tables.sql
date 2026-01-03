-- Migration: Add RGS/AAS calculation tables
-- Created: 2026-01-03
-- Purpose: ファクター定義と集計結果の管理

-- ============================================
-- ファクター定義テーブル
-- ============================================
CREATE TABLE IF NOT EXISTS factor_definitions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  data_source TEXT NOT NULL CHECK(data_source IN ('jravan', 'jrdb', 'mixed')),
  
  -- 条件設定（最大30個）
  conditions TEXT NOT NULL, -- JSON形式で保存
  
  -- 集計キー設定（6個）
  aggregation_keys TEXT NOT NULL, -- JSON形式で保存
  -- 例: ["distance_category", "track_condition", "track_code", "race_class", "age", "running_style"]
  
  -- メタデータ
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_factor_definitions_active ON factor_definitions(is_active);
CREATE INDEX IF NOT EXISTS idx_factor_definitions_source ON factor_definitions(data_source);

-- ============================================
-- 集計結果テーブル
-- ============================================
CREATE TABLE IF NOT EXISTS factor_aggregations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  factor_id INTEGER NOT NULL,
  
  -- グループキー（集計軸の組み合わせ）
  group_key TEXT NOT NULL,
  -- 例: "芝短距離_良_東京_オープン_4歳_逃げ"
  
  -- 基本統計量
  cnt_win INTEGER DEFAULT 0,           -- 単勝件数
  cnt_plc INTEGER DEFAULT 0,           -- 複勝件数
  hit_win INTEGER DEFAULT 0,           -- 単勝的中数
  hit_plc INTEGER DEFAULT 0,           -- 複勝的中数
  
  -- 生の回収率
  return_win REAL DEFAULT 0.0,         -- 単勝回収率（%）
  return_plc REAL DEFAULT 0.0,         -- 複勝回収率（%）
  
  -- 的中率
  rate_win_hit REAL DEFAULT 0.0,       -- 単勝的中率（%）
  rate_plc_hit REAL DEFAULT 0.0,       -- 複勝的中率（%）
  
  -- 補正回収率（3つの補正適用後）
  adj_return_win REAL DEFAULT 0.0,     -- 単勝補正回収率（%）
  adj_return_plc REAL DEFAULT 0.0,     -- 複勝補正回収率（%）
  
  -- 評価指標
  rgs_score REAL,                      -- RGS1.0スコア（-10 ~ +10）
  aas_score REAL,                      -- AASスコア（可変）
  
  -- メタデータ
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (factor_id) REFERENCES factor_definitions(id) ON DELETE CASCADE
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_factor_aggregations_factor ON factor_aggregations(factor_id);
CREATE INDEX IF NOT EXISTS idx_factor_aggregations_group ON factor_aggregations(group_key);
CREATE INDEX IF NOT EXISTS idx_factor_aggregations_rgs ON factor_aggregations(rgs_score);
CREATE INDEX IF NOT EXISTS idx_factor_aggregations_aas ON factor_aggregations(aas_score);

-- 複合インデックス（高速検索用）
CREATE INDEX IF NOT EXISTS idx_factor_aggregations_factor_group 
  ON factor_aggregations(factor_id, group_key);

-- ============================================
-- オッズ別補正係数テーブル
-- ============================================
CREATE TABLE IF NOT EXISTS odds_correction_coefficients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bet_type TEXT NOT NULL CHECK(bet_type IN ('win', 'place')),
  odds_min REAL NOT NULL,
  odds_max REAL NOT NULL,
  coefficient REAL NOT NULL,          -- 補正係数（基準回収率80%で計算済み）
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_odds_coefficients_type ON odds_correction_coefficients(bet_type);

-- ============================================
-- 期間別重みテーブル
-- ============================================
CREATE TABLE IF NOT EXISTS year_weights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  year INTEGER NOT NULL UNIQUE,
  weight REAL NOT NULL,               -- 重み（新しいほど大きい）
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_year_weights_year ON year_weights(year);

-- ============================================
-- デフォルトデータ：オッズ別補正係数（単勝）123段階
-- ============================================
INSERT OR IGNORE INTO odds_correction_coefficients 
  (bet_type, odds_min, odds_max, coefficient) 
VALUES
  ('win', 0.0, 1.0, 1.00),
  ('win', 1.0, 1.6, 0.94),
  ('win', 1.6, 1.8, 1.01),
  ('win', 1.8, 2.0, 1.05),
  ('win', 2.0, 2.2, 1.05),
  ('win', 2.2, 2.4, 1.01),
  ('win', 2.4, 2.6, 1.00),
  ('win', 2.6, 2.8, 0.99),
  ('win', 2.8, 3.0, 0.99),
  ('win', 3.0, 3.2, 0.97),
  ('win', 3.2, 3.4, 1.00),
  ('win', 3.4, 3.6, 1.01),
  ('win', 3.6, 3.8, 0.95),
  ('win', 3.8, 4.0, 0.98),
  ('win', 4.0, 4.2, 1.04),
  ('win', 4.2, 4.4, 1.07),
  ('win', 4.4, 4.6, 1.02),
  ('win', 4.6, 4.8, 1.05),
  ('win', 4.8, 5.0, 0.99),
  ('win', 5.0, 5.2, 0.95),
  ('win', 5.2, 5.4, 0.99),
  ('win', 5.4, 5.6, 1.06),
  ('win', 5.6, 5.8, 1.03),
  ('win', 5.8, 6.0, 1.07),
  ('win', 6.0, 6.2, 1.00),
  ('win', 6.2, 6.4, 1.00),
  ('win', 6.4, 6.6, 0.99),
  ('win', 6.6, 6.8, 1.07),
  ('win', 6.8, 7.0, 1.02),
  ('win', 7.0, 7.2, 1.04),
  ('win', 7.2, 7.4, 1.01),
  ('win', 7.4, 7.6, 0.87),
  ('win', 7.6, 7.8, 1.04),
  ('win', 7.8, 8.0, 0.97),
  ('win', 8.0, 8.2, 1.06),
  ('win', 8.2, 8.4, 1.09),
  ('win', 8.4, 8.6, 1.03),
  ('win', 8.6, 8.8, 0.89),
  ('win', 8.8, 9.0, 1.03),
  ('win', 9.0, 9.2, 0.97),
  ('win', 9.2, 9.4, 0.92),
  ('win', 9.4, 9.6, 0.87),
  ('win', 9.6, 9.8, 0.91),
  ('win', 9.8, 10.0, 0.89),
  ('win', 10.0, 10.5, 1.01),
  ('win', 10.5, 11.0, 0.94),
  ('win', 11.0, 11.5, 0.93),
  ('win', 11.5, 12.0, 0.89),
  ('win', 12.0, 12.5, 0.94),
  ('win', 12.5, 13.0, 0.95),
  ('win', 13.0, 13.5, 0.98),
  ('win', 13.5, 14.0, 1.00),
  ('win', 14.0, 14.5, 0.97),
  ('win', 14.5, 15.0, 1.02),
  ('win', 15.0, 15.5, 1.00),
  ('win', 15.5, 16.0, 0.92),
  ('win', 16.0, 16.5, 1.24),
  ('win', 16.5, 17.0, 1.01),
  ('win', 17.0, 17.5, 0.91),
  ('win', 17.5, 18.0, 1.04),
  ('win', 18.0, 18.5, 1.09),
  ('win', 18.5, 19.0, 0.89),
  ('win', 19.0, 19.5, 0.88),
  ('win', 19.5, 20.0, 0.92),
  ('win', 20.0, 21.0, 0.93),
  ('win', 21.0, 22.0, 0.99),
  ('win', 22.0, 23.0, 0.93),
  ('win', 23.0, 24.0, 1.05),
  ('win', 24.0, 25.0, 0.97),
  ('win', 25.0, 26.0, 1.00),
  ('win', 26.0, 27.0, 0.83),
  ('win', 27.0, 28.0, 1.02),
  ('win', 28.0, 29.0, 0.88),
  ('win', 29.0, 30.0, 1.14),
  ('win', 30.0, 31.0, 1.04),
  ('win', 31.0, 32.0, 0.87),
  ('win', 32.0, 33.0, 0.94),
  ('win', 33.0, 34.0, 1.08),
  ('win', 34.0, 35.0, 0.90),
  ('win', 35.0, 36.0, 1.08),
  ('win', 36.0, 37.0, 0.93),
  ('win', 37.0, 38.0, 1.47),
  ('win', 38.0, 39.0, 0.84),
  ('win', 39.0, 40.0, 1.15),
  ('win', 40.0, 41.0, 1.04),
  ('win', 41.0, 42.0, 1.12),
  ('win', 42.0, 43.0, 0.97),
  ('win', 43.0, 44.0, 1.07),
  ('win', 44.0, 45.0, 1.01),
  ('win', 45.0, 46.0, 1.14),
  ('win', 46.0, 47.0, 1.60),
  ('win', 47.0, 48.0, 0.87),
  ('win', 48.0, 49.0, 1.32),
  ('win', 49.0, 50.0, 1.25),
  ('win', 50.0, 55.0, 1.07),
  ('win', 55.0, 60.0, 0.93),
  ('win', 60.0, 65.0, 1.05),
  ('win', 65.0, 70.0, 1.28),
  ('win', 70.0, 75.0, 1.28),
  ('win', 75.0, 80.0, 0.80),
  ('win', 80.0, 85.0, 1.29),
  ('win', 85.0, 90.0, 1.06),
  ('win', 90.0, 95.0, 0.96),
  ('win', 95.0, 100.0, 1.31),
  ('win', 100.0, 110.0, 1.19),
  ('win', 110.0, 120.0, 1.08),
  ('win', 120.0, 130.0, 2.02),
  ('win', 130.0, 140.0, 1.40),
  ('win', 140.0, 150.0, 1.31),
  ('win', 150.0, 160.0, 1.39),
  ('win', 160.0, 170.0, 1.61),
  ('win', 170.0, 180.0, 1.53),
  ('win', 180.0, 190.0, 1.18),
  ('win', 190.0, 200.0, 2.80),
  ('win', 200.0, 220.0, 2.78),
  ('win', 220.0, 240.0, 2.04),
  ('win', 240.0, 260.0, 1.32),
  ('win', 260.0, 280.0, 3.02),
  ('win', 280.0, 300.0, 1.94),
  ('win', 300.0, 350.0, 1.83),
  ('win', 350.0, 400.0, 4.60),
  ('win', 400.0, 999999.9, 2.38);

-- ============================================
-- デフォルトデータ：オッズ別補正係数（複勝）107段階
-- ============================================
INSERT OR IGNORE INTO odds_correction_coefficients 
  (bet_type, odds_min, odds_max, coefficient) 
VALUES
  ('place', 0.0, 1.0, 1.00),
  ('place', 1.0, 1.1, 0.85),
  ('place', 1.1, 1.2, 0.93),
  ('place', 1.2, 1.3, 0.95),
  ('place', 1.3, 1.4, 0.95),
  ('place', 1.4, 1.5, 0.99),
  ('place', 1.5, 1.6, 1.01),
  ('place', 1.6, 1.7, 1.02),
  ('place', 1.7, 1.8, 1.05),
  ('place', 1.8, 1.9, 1.04),
  ('place', 1.9, 2.0, 1.04),
  ('place', 2.0, 2.1, 1.02),
  ('place', 2.1, 2.2, 1.02),
  ('place', 2.2, 2.3, 1.03),
  ('place', 2.3, 2.4, 1.02),
  ('place', 2.4, 2.5, 0.99),
  ('place', 2.5, 2.6, 1.01),
  ('place', 2.6, 2.7, 1.00),
  ('place', 2.7, 2.8, 0.98),
  ('place', 2.8, 2.9, 1.05),
  ('place', 2.9, 3.0, 1.04),
  ('place', 3.0, 3.1, 1.05),
  ('place', 3.1, 3.2, 1.02),
  ('place', 3.2, 3.3, 1.00),
  ('place', 3.3, 3.4, 1.03),
  ('place', 3.4, 3.5, 0.95),
  ('place', 3.5, 3.6, 0.99),
  ('place', 3.6, 3.7, 1.03),
  ('place', 3.7, 3.8, 0.94),
  ('place', 3.8, 3.9, 0.99),
  ('place', 3.9, 4.0, 1.02),
  ('place', 4.0, 4.1, 1.07),
  ('place', 4.1, 4.2, 1.00),
  ('place', 4.2, 4.3, 1.04),
  ('place', 4.3, 4.4, 1.04),
  ('place', 4.4, 4.5, 0.99),
  ('place', 4.5, 4.6, 0.98),
  ('place', 4.6, 4.7, 1.01),
  ('place', 4.7, 4.8, 1.06),
  ('place', 4.8, 4.9, 1.00),
  ('place', 4.9, 5.0, 1.06),
  ('place', 5.0, 5.2, 1.02),
  ('place', 5.2, 5.4, 1.01),
  ('place', 5.4, 5.6, 0.98),
  ('place', 5.6, 5.8, 0.94),
  ('place', 5.8, 6.0, 0.99),
  ('place', 6.0, 6.2, 1.06),
  ('place', 6.2, 6.4, 1.18),
  ('place', 6.4, 6.6, 1.01),
  ('place', 6.6, 6.8, 0.98),
  ('place', 6.8, 7.0, 0.99),
  ('place', 7.0, 7.2, 0.93),
  ('place', 7.2, 7.4, 0.97),
  ('place', 7.4, 7.6, 1.10),
  ('place', 7.6, 7.8, 1.09),
  ('place', 7.8, 8.0, 1.01),
  ('place', 8.0, 8.2, 1.09),
  ('place', 8.2, 8.4, 0.95),
  ('place', 8.4, 8.6, 0.97),
  ('place', 8.6, 8.8, 0.97),
  ('place', 8.8, 9.0, 1.08),
  ('place', 9.0, 9.2, 1.06),
  ('place', 9.2, 9.4, 1.08),
  ('place', 9.4, 9.6, 1.11),
  ('place', 9.6, 9.8, 0.93),
  ('place', 9.8, 10.0, 1.06),
  ('place', 10.0, 10.5, 1.07),
  ('place', 10.5, 11.0, 1.07),
  ('place', 11.0, 11.5, 1.08),
  ('place', 11.5, 12.0, 1.10),
  ('place', 12.0, 12.5, 0.97),
  ('place', 12.5, 13.0, 1.03),
  ('place', 13.0, 13.5, 1.07),
  ('place', 13.5, 14.0, 1.15),
  ('place', 14.0, 14.5, 1.09),
  ('place', 14.5, 15.0, 0.98),
  ('place', 15.0, 15.5, 1.15),
  ('place', 15.5, 16.0, 1.01),
  ('place', 16.0, 16.5, 0.96),
  ('place', 16.5, 17.0, 1.10),
  ('place', 17.0, 17.5, 1.37),
  ('place', 17.5, 18.0, 1.17),
  ('place', 18.0, 18.5, 1.19),
  ('place', 18.5, 19.0, 1.22),
  ('place', 19.0, 19.5, 1.43),
  ('place', 19.5, 20.0, 1.33),
  ('place', 20.0, 21.0, 1.35),
  ('place', 21.0, 22.0, 1.44),
  ('place', 22.0, 23.0, 1.32),
  ('place', 23.0, 24.0, 1.29),
  ('place', 24.0, 25.0, 1.46),
  ('place', 25.0, 26.0, 1.33),
  ('place', 26.0, 27.0, 1.37),
  ('place', 27.0, 28.0, 1.72),
  ('place', 28.0, 29.0, 1.42),
  ('place', 29.0, 30.0, 2.03),
  ('place', 30.0, 32.0, 1.55),
  ('place', 32.0, 34.0, 1.87),
  ('place', 34.0, 36.0, 1.81),
  ('place', 36.0, 38.0, 2.37),
  ('place', 38.0, 40.0, 1.81),
  ('place', 40.0, 45.0, 2.18),
  ('place', 45.0, 50.0, 2.35),
  ('place', 50.0, 55.0, 3.01),
  ('place', 55.0, 60.0, 2.62),
  ('place', 60.0, 70.0, 4.23),
  ('place', 70.0, 999999.9, 5.06);

-- ============================================
-- サンプルデータ：期間別重み（2016-2025）
-- ============================================
INSERT OR IGNORE INTO year_weights (year, weight) VALUES
  (2016, 1.0),
  (2017, 1.2),
  (2018, 2.0),
  (2019, 3.0),
  (2020, 5.0),
  (2021, 6.0),
  (2022, 7.0),
  (2023, 8.0),
  (2024, 9.0),
  (2025, 10.0);

-- ============================================
-- サンプルファクター定義
-- ============================================
INSERT OR IGNORE INTO factor_definitions 
  (name, description, data_source, conditions, aggregation_keys) 
VALUES
  (
    '芝短距離×えりも町',
    '芝短距離（1000-1400m）× 産地えりも町のファクター',
    'jravan',
    '[{"field":"distance","operator":"between","value":[1000,1400]},{"field":"track_type","operator":"eq","value":"芝"},{"field":"breeding_area","operator":"eq","value":"えりも町"}]',
    '["distance_category","breeding_area"]'
  ),
  (
    'JRDBテストファクター',
    'JRDB単独データのテストファクター',
    'jrdb',
    '[{"field":"track_code","operator":"eq","value":"東京"}]',
    '["track_code","distance_category"]'
  ),
  (
    '混合テストファクター',
    'JRA-VAN + JRDB混合データのテストファクター',
    'mixed',
    '[{"field":"distance","operator":"between","value":[1600,2000]}]',
    '["distance_category","track_condition","race_class"]'
  );

-- ============================================
-- サンプル集計結果
-- ============================================
INSERT OR IGNORE INTO factor_aggregations 
  (factor_id, group_key, cnt_win, cnt_plc, hit_win, hit_plc, 
   return_win, return_plc, rate_win_hit, rate_plc_hit,
   adj_return_win, adj_return_plc, rgs_score, aas_score) 
VALUES
  (
    1,
    '芝短距離_えりも町',
    11, 16, 2, 4,
    233.6, 168.8, 18.2, 25.0,
    175.1, 66.4, 1.75, 1.5
  );
