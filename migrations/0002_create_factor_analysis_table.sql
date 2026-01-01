-- ファクター分析結果テーブル
CREATE TABLE IF NOT EXISTS factor_analysis (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  factor_name TEXT NOT NULL,
  factor_conditions TEXT NOT NULL, -- JSON形式で条件を保存
  
  -- 基本統計
  total_races INTEGER NOT NULL DEFAULT 0,
  win_count INTEGER NOT NULL DEFAULT 0,
  place_count INTEGER NOT NULL DEFAULT 0,
  show_count INTEGER NOT NULL DEFAULT 0,
  
  -- 勝率・連対率・複勝率
  win_rate REAL NOT NULL DEFAULT 0.0,
  place_rate REAL NOT NULL DEFAULT 0.0,
  show_rate REAL NOT NULL DEFAULT 0.0,
  
  -- 回収率
  win_roi REAL NOT NULL DEFAULT 0.0,
  place_roi REAL NOT NULL DEFAULT 0.0,
  
  -- RGS1.0 スコア（絶対収益力評価）
  rgs_score REAL NOT NULL DEFAULT 0.0,
  
  -- AAS スコア（相対偏差値評価）
  aas_score REAL NOT NULL DEFAULT 0.0,
  
  -- グループID（AAS計算用）
  group_id TEXT,
  
  -- メタデータ
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 登録済みファクターテーブル（公開用）
CREATE TABLE IF NOT EXISTS registered_factors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  factor_name TEXT NOT NULL UNIQUE,
  factor_description TEXT,
  factor_conditions TEXT NOT NULL, -- JSON形式
  
  -- 評価スコア
  rgs_score REAL NOT NULL DEFAULT 0.0,
  aas_score REAL NOT NULL DEFAULT 0.0,
  
  -- 統計情報
  total_races INTEGER NOT NULL DEFAULT 0,
  win_rate REAL NOT NULL DEFAULT 0.0,
  place_rate REAL NOT NULL DEFAULT 0.0,
  win_roi REAL NOT NULL DEFAULT 0.0,
  place_roi REAL NOT NULL DEFAULT 0.0,
  
  -- 公開設定
  is_public BOOLEAN DEFAULT 0,
  
  -- メタデータ
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_factor_analysis_factor_name ON factor_analysis(factor_name);
CREATE INDEX IF NOT EXISTS idx_factor_analysis_rgs_score ON factor_analysis(rgs_score DESC);
CREATE INDEX IF NOT EXISTS idx_factor_analysis_aas_score ON factor_analysis(aas_score DESC);
CREATE INDEX IF NOT EXISTS idx_registered_factors_is_public ON registered_factors(is_public);
CREATE INDEX IF NOT EXISTS idx_registered_factors_rgs_score ON registered_factors(rgs_score DESC);
