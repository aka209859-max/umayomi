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
  avg_return REAL NOT NULL,           -- そのオッズ帯の平均回収率（%）
  coefficient REAL NOT NULL,          -- 補正係数 = 80 / avg_return
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
-- サンプルデータ：オッズ別補正係数（単勝）
-- ============================================
INSERT OR IGNORE INTO odds_correction_coefficients 
  (bet_type, odds_min, odds_max, avg_return, coefficient) 
VALUES
  ('win', 1.0, 2.0, 85.0, 0.94),
  ('win', 2.0, 3.0, 90.0, 0.89),
  ('win', 3.0, 5.0, 88.0, 0.91),
  ('win', 5.0, 10.0, 75.0, 1.07),
  ('win', 10.0, 20.0, 65.0, 1.23),
  ('win', 20.0, 50.0, 55.0, 1.45),
  ('win', 50.0, 100.0, 45.0, 1.78),
  ('win', 100.0, 9999.0, 40.0, 2.00);

-- ============================================
-- サンプルデータ：オッズ別補正係数（複勝）
-- ============================================
INSERT OR IGNORE INTO odds_correction_coefficients 
  (bet_type, odds_min, odds_max, avg_return, coefficient) 
VALUES
  ('place', 1.0, 1.5, 92.0, 0.87),
  ('place', 1.5, 2.0, 88.0, 0.91),
  ('place', 2.0, 3.0, 85.0, 0.94),
  ('place', 3.0, 5.0, 78.0, 1.03),
  ('place', 5.0, 10.0, 70.0, 1.14),
  ('place', 10.0, 17.0, 60.0, 1.33),
  ('place', 17.0, 9999.0, 50.0, 1.60);

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
