-- Phase 3: JRDB Data Tables for Cloudflare D1
-- ハイブリッド方式：軽量データのみD1に保存、大容量データはE:ドライブに保持

-- ======================
-- 1. レースマスター（約10,430レース、約1MB）
-- ======================
CREATE TABLE IF NOT EXISTS races (
  race_id TEXT PRIMARY KEY,           -- レースID (例: 202501010101)
  race_date TEXT NOT NULL,            -- 開催日 (YYYY-MM-DD)
  track_code TEXT NOT NULL,           -- 競馬場コード (01:札幌, 02:函館, ... 10:小倉)
  track_name TEXT NOT NULL,           -- 競馬場名 (東京, 中山, 阪神, ...)
  race_num INTEGER NOT NULL,          -- レース番号 (1-12)
  distance INTEGER NOT NULL,          -- 距離 (メートル)
  track_type TEXT,                    -- コース種別 (芝, ダート, 障害)
  direction TEXT,                     -- 回り (右, 左, 直線)
  condition TEXT,                     -- 馬場状態 (良, 稍重, 重, 不良)
  weather TEXT,                       -- 天候 (晴, 曇, 雨, 雪, 小雨, 小雪)
  grade TEXT,                         -- グレード (G1, G2, G3, OP, 1600万, ...)
  race_name TEXT,                     -- レース名
  prize_money INTEGER,                -- 1着賞金 (万円)
  total_horses INTEGER,               -- 出走頭数
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_races_date ON races(race_date);
CREATE INDEX IF NOT EXISTS idx_races_track ON races(track_code, race_date);
CREATE INDEX IF NOT EXISTS idx_races_grade ON races(grade);

-- ======================
-- 2. 馬マスター（上位1,000頭、約500KB）
-- ======================
CREATE TABLE IF NOT EXISTS horses (
  horse_id TEXT PRIMARY KEY,          -- 馬ID (血統登録番号)
  horse_name TEXT NOT NULL,           -- 馬名
  sex TEXT,                           -- 性別 (牡, 牝, セ)
  birth_year INTEGER,                 -- 生年 (西暦)
  sire_name TEXT,                     -- 父馬名
  dam_name TEXT,                      -- 母馬名
  trainer_name TEXT,                  -- 調教師名
  owner_name TEXT,                    -- 馬主名
  total_races INTEGER DEFAULT 0,     -- 総出走回数
  total_wins INTEGER DEFAULT 0,       -- 総勝利数
  win_rate REAL DEFAULT 0.0,          -- 勝率 (%)
  place_rate REAL DEFAULT 0.0,        -- 連対率 (%)
  show_rate REAL DEFAULT 0.0,         -- 複勝率 (%)
  total_prize INTEGER DEFAULT 0,      -- 獲得賞金 (万円)
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_horses_name ON horses(horse_name);
CREATE INDEX IF NOT EXISTS idx_horses_trainer ON horses(trainer_name);
CREATE INDEX IF NOT EXISTS idx_horses_win_rate ON horses(win_rate DESC);

-- ======================
-- 3. 騎手マスター（上位200人、約100KB）
-- ======================
CREATE TABLE IF NOT EXISTS jockeys (
  jockey_id TEXT PRIMARY KEY,         -- 騎手ID
  jockey_name TEXT NOT NULL,          -- 騎手名
  total_races INTEGER DEFAULT 0,     -- 総騎乗回数
  total_wins INTEGER DEFAULT 0,       -- 総勝利数
  win_rate REAL DEFAULT 0.0,          -- 勝率 (%)
  place_rate REAL DEFAULT 0.0,        -- 連対率 (%)
  show_rate REAL DEFAULT 0.0,         -- 複勝率 (%)
  total_prize INTEGER DEFAULT 0,      -- 獲得賞金 (万円)
  weight_class TEXT,                  -- 階級 (見習, 一般, 上級)
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_jockeys_name ON jockeys(jockey_name);
CREATE INDEX IF NOT EXISTS idx_jockeys_win_rate ON jockeys(win_rate DESC);

-- ======================
-- 4. 出走結果（直近10,000レース分、約10MB）
-- ======================
CREATE TABLE IF NOT EXISTS race_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_id TEXT NOT NULL,              -- レースID
  horse_id TEXT NOT NULL,             -- 馬ID
  jockey_id TEXT,                     -- 騎手ID
  horse_num INTEGER NOT NULL,         -- 馬番
  frame_num INTEGER,                  -- 枠番
  finish_position INTEGER,            -- 着順 (1-18, 0:失格・中止)
  finish_time_seconds REAL,           -- 走破タイム (秒)
  weight INTEGER,                     -- 馬体重 (kg)
  weight_diff INTEGER,                -- 馬体重増減 (kg)
  jockey_weight REAL,                 -- 斤量 (kg)
  odds_win REAL,                      -- 単勝オッズ
  odds_place REAL,                    -- 複勝オッズ
  popularity INTEGER,                 -- 人気
  margin TEXT,                        -- 着差
  pace TEXT,                          -- ペース (逃, 先, 差, 追)
  corner_positions TEXT,              -- コーナー通過順位 (例: 1-1-1-1)
  last_3f_time REAL,                  -- 上がり3F (秒)
  
  -- ファクター計算用
  cnt_win INTEGER DEFAULT 0,          -- 単勝投票件数
  cnt_plc INTEGER DEFAULT 0,          -- 複勝投票件数
  rate_win_hit REAL DEFAULT 0.0,      -- 単勝的中率
  rate_plc_hit REAL DEFAULT 0.0,      -- 複勝的中率
  rate_win_ret REAL DEFAULT 0.0,      -- 単勝回収率
  rate_plc_ret REAL DEFAULT 0.0,      -- 複勝回収率
  rgs_score REAL,                     -- RGSスコア
  aas_score REAL,                     -- AASスコア
  
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (race_id) REFERENCES races(race_id),
  FOREIGN KEY (horse_id) REFERENCES horses(horse_id),
  FOREIGN KEY (jockey_id) REFERENCES jockeys(jockey_id)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_race_results_race ON race_results(race_id);
CREATE INDEX IF NOT EXISTS idx_race_results_horse ON race_results(horse_id);
CREATE INDEX IF NOT EXISTS idx_race_results_jockey ON race_results(jockey_id);
CREATE INDEX IF NOT EXISTS idx_race_results_finish ON race_results(finish_position);
CREATE INDEX IF NOT EXISTS idx_race_results_rgs ON race_results(rgs_score DESC);
CREATE INDEX IF NOT EXISTS idx_race_results_aas ON race_results(aas_score DESC);

-- ======================
-- 5. ファクター分析結果（予想結果保存用）
-- ======================
CREATE TABLE IF NOT EXISTS factor_predictions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_id TEXT NOT NULL,              -- レースID
  horse_id TEXT NOT NULL,             -- 馬ID
  prediction_rank INTEGER NOT NULL,   -- 予想順位
  final_score REAL NOT NULL,          -- 最終スコア
  rgs_score REAL,                     -- RGSスコア
  aas_score REAL,                     -- AASスコア
  factor_weights TEXT,                -- ファクターウェイト (JSON)
  actual_rank INTEGER,                -- 実際の着順（結果確定後）
  hit_flag BOOLEAN DEFAULT 0,         -- 的中フラグ
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (race_id) REFERENCES races(race_id),
  FOREIGN KEY (horse_id) REFERENCES horses(horse_id)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_predictions_race ON factor_predictions(race_id);
CREATE INDEX IF NOT EXISTS idx_predictions_hit ON factor_predictions(hit_flag, created_at);

-- ======================
-- 6. データインポートログ
-- ======================
CREATE TABLE IF NOT EXISTS import_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  import_type TEXT NOT NULL,          -- インポート種別 (races, horses, jockeys, results)
  file_name TEXT NOT NULL,            -- ファイル名
  total_records INTEGER DEFAULT 0,   -- 総レコード数
  success_records INTEGER DEFAULT 0, -- 成功レコード数
  error_records INTEGER DEFAULT 0,   -- エラーレコード数
  error_message TEXT,                -- エラーメッセージ
  import_status TEXT DEFAULT 'pending', -- ステータス (pending, success, error)
  started_at TEXT DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_import_logs_type ON import_logs(import_type, started_at);
CREATE INDEX IF NOT EXISTS idx_import_logs_status ON import_logs(import_status);

-- ======================
-- データ統計ビュー
-- ======================
CREATE VIEW IF NOT EXISTS v_race_statistics AS
SELECT 
  DATE(race_date) as race_date,
  track_name,
  COUNT(*) as total_races,
  AVG(total_horses) as avg_horses,
  SUM(CASE WHEN grade IN ('G1', 'G2', 'G3') THEN 1 ELSE 0 END) as graded_races
FROM races
GROUP BY DATE(race_date), track_name
ORDER BY race_date DESC;

CREATE VIEW IF NOT EXISTS v_horse_performance AS
SELECT 
  h.horse_id,
  h.horse_name,
  h.total_races,
  h.total_wins,
  h.win_rate,
  COUNT(rr.id) as recent_races,
  AVG(rr.rgs_score) as avg_rgs,
  AVG(rr.aas_score) as avg_aas,
  AVG(rr.finish_position) as avg_finish
FROM horses h
LEFT JOIN race_results rr ON h.horse_id = rr.horse_id
GROUP BY h.horse_id, h.horse_name, h.total_races, h.total_wins, h.win_rate;

CREATE VIEW IF NOT EXISTS v_jockey_performance AS
SELECT 
  j.jockey_id,
  j.jockey_name,
  j.total_races,
  j.total_wins,
  j.win_rate,
  COUNT(rr.id) as recent_races,
  AVG(CASE WHEN rr.finish_position <= 3 THEN 1.0 ELSE 0.0 END) as recent_show_rate,
  AVG(rr.odds_win) as avg_odds
FROM jockeys j
LEFT JOIN race_results rr ON j.jockey_id = rr.jockey_id
GROUP BY j.jockey_id, j.jockey_name, j.total_races, j.total_wins, j.win_rate;
