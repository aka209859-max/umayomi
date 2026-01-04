-- Migration: Factor Scores テーブル作成
-- Purpose: ファクター集計結果とRGS1.0/AASスコアを保存
-- Created: 2026-01-04

-- ===============================================
-- factor_scores テーブル
-- ファクター集計結果の保存
-- ===============================================

CREATE TABLE IF NOT EXISTS factor_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  factor_id TEXT UNIQUE NOT NULL,          -- ファクターID（一意）
  factor_name TEXT NOT NULL,               -- ファクター名（表示用）
  keys TEXT NOT NULL,                      -- 集計キー（JSON: ["中山", "芝", "1200m", ...]）
  
  -- 集計データ
  win_count INTEGER NOT NULL DEFAULT 0,
  place_count INTEGER NOT NULL DEFAULT 0,
  win_hit_rate REAL NOT NULL DEFAULT 0.0,
  place_hit_rate REAL NOT NULL DEFAULT 0.0,
  win_return_rate REAL NOT NULL DEFAULT 0.0,     -- 生の回収率
  place_return_rate REAL NOT NULL DEFAULT 0.0,   -- 生の回収率
  
  -- 補正済みデータ
  adj_win_return_rate REAL NOT NULL DEFAULT 0.0,   -- 単勝補正回収率
  adj_place_return_rate REAL NOT NULL DEFAULT 0.0, -- 複勝補正回収率
  aas_score REAL NOT NULL DEFAULT 0.0,             -- AAS得点（-12 ～ +12）
  rgs_score REAL NOT NULL DEFAULT 0.0,             -- RGS得点（-10 ～ +10）
  
  -- 保存状態
  is_saved INTEGER DEFAULT 0,              -- 0: 未保存, 1: 保存済み
  save_reason TEXT,                        -- 保存理由（aas/rgs/both/either/manual）
  save_condition TEXT,                     -- 保存条件（JSON）
  
  -- タイムスタンプ
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  calculated_at TEXT                       -- 最終計算日時
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_factor_scores_factor_id ON factor_scores(factor_id);
CREATE INDEX IF NOT EXISTS idx_factor_scores_is_saved ON factor_scores(is_saved);
CREATE INDEX IF NOT EXISTS idx_factor_scores_aas ON factor_scores(aas_score DESC);
CREATE INDEX IF NOT EXISTS idx_factor_scores_rgs ON factor_scores(rgs_score DESC);
CREATE INDEX IF NOT EXISTS idx_factor_scores_save_reason ON factor_scores(save_reason);

-- ===============================================
-- factor_save_settings テーブル
-- ファクター保存条件の管理
-- ===============================================

CREATE TABLE IF NOT EXISTS factor_save_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  setting_name TEXT NOT NULL,              -- 設定名
  save_mode TEXT NOT NULL,                 -- 保存モード（aas/rgs/both/either/manual）
  aas_threshold REAL,                      -- AAS閾値
  rgs_threshold REAL,                      -- RGS閾値
  min_race_count INTEGER,                  -- 最小レース件数
  min_hit_rate REAL,                       -- 最小的中率
  is_active INTEGER DEFAULT 1,             -- アクティブフラグ
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- デフォルト設定を挿入
INSERT OR IGNORE INTO factor_save_settings (id, setting_name, save_mode, aas_threshold, rgs_threshold, min_race_count, min_hit_rate)
VALUES 
  (1, 'デフォルト設定（両方必須）', 'both', 2.0, 1.0, 10, 20.0),
  (2, 'AAS重視', 'aas', 2.0, NULL, 10, 20.0),
  (3, 'RGS重視', 'rgs', NULL, 1.0, 10, 20.0),
  (4, 'どちらか（OR）', 'either', 2.0, 1.0, 10, 20.0);

-- ===============================================
-- saved_factors テーブル
-- 保存済みファクターのリスト（factor_scoresへの参照）
-- ===============================================

CREATE TABLE IF NOT EXISTS saved_factors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  factor_id TEXT NOT NULL,                 -- factor_scores.factor_id への参照
  saved_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  save_reason TEXT,                        -- 保存理由
  notes TEXT,                              -- メモ
  
  FOREIGN KEY (factor_id) REFERENCES factor_scores(factor_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_saved_factors_factor_id ON saved_factors(factor_id);
CREATE INDEX IF NOT EXISTS idx_saved_factors_saved_at ON saved_factors(saved_at DESC);
