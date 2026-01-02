-- ============================================================
-- UMAYOMI CrossFactor型システム - SQLiteテーブル定義
-- ============================================================
-- 作成日: 2025-01-02
-- 目的: ロジック作成・保存・前日データ取り込み・ファクター適用
-- ============================================================

-- ============================================================
-- 1. 登録済みファクター
-- ============================================================
-- 平日に作成したロジック（条件設定 + 独自得点式）を保存
-- ============================================================
CREATE TABLE IF NOT EXISTS registered_factors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,                        -- ファクター名（例: "芝1600m東京・4歳以上RGS重視"）
  formula TEXT NOT NULL,                     -- 独自得点計算式（例: "win_count * 10 + place_count * 5"）
  conditions TEXT NOT NULL,                  -- JSON形式の条件設定
  description TEXT,                          -- ファクターの説明
  is_active INTEGER DEFAULT 1,               -- 有効/無効フラグ（1: 有効, 0: 無効）
  created_at TEXT DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT DEFAULT (datetime('now', 'localtime'))
);

-- conditions JSONの構造例:
-- {
--   "area1": {
--     "course_type": ["芝", "ダート"],
--     "distance_min": 1600,
--     "distance_max": 1600,
--     "venues": ["東京", "中山"]
--   },
--   "area2": {
--     "sex": ["牡", "牝"],
--     "age_min": 4,
--     "age_max": 99,
--     "weight_min": 450,
--     "weight_max": 550
--   },
--   "area3": {
--     "grades": ["G1", "G2", "G3"],
--     "classes": ["OP", "3勝"],
--     "date_from": "2020-01-01",
--     "date_to": "2024-12-31"
--   },
--   "correction": {
--     "period": {
--       "recent_3m": 1.0,
--       "recent_6m": 0.8,
--       "recent_1y": 0.5
--     },
--     "odds": {
--       "min": 1.0,
--       "max": 20.0
--     }
--   }
-- }

-- ============================================================
-- 2. 翌日の出走表（前日取り込み）
-- ============================================================
-- 金・土の夜にJRA-VANから取り込んだ翌日分のレースデータ
-- ============================================================
CREATE TABLE IF NOT EXISTS tomorrow_races (
  race_date TEXT NOT NULL,                   -- レース日（例: "20250104"）
  venue TEXT NOT NULL,                       -- 競馬場（例: "東京"）
  race_number INTEGER NOT NULL,              -- レース番号（例: 10）
  horse_number INTEGER NOT NULL,             -- 馬番（例: 3）
  horse_id TEXT NOT NULL,                    -- 馬ID（例: "2020104567"）
  horse_name TEXT,                           -- 馬名（例: "ドウデュース"）
  jockey_id TEXT,                            -- 騎手ID（例: "01234"）
  jockey_name TEXT,                          -- 騎手名（例: "福永祐一"）
  trainer_id TEXT,                           -- 調教師ID（例: "05678"）
  trainer_name TEXT,                         -- 調教師名（例: "友道康夫"）
  odds REAL,                                 -- オッズ（例: 2.5）
  weight REAL,                               -- 馬体重（例: 498.0）
  age INTEGER,                               -- 年齢（例: 4）
  sex TEXT,                                  -- 性別（例: "牡"）
  course_type TEXT,                          -- コース種別（例: "芝"）
  distance INTEGER,                          -- 距離（例: 1600）
  grade TEXT,                                -- グレード（例: "G3"）
  class TEXT,                                -- クラス（例: "OP"）
  race_name TEXT,                            -- レース名（例: "ニューイヤーS"）
  post_time TEXT,                            -- 発走時刻（例: "15:30"）
  imported_at TEXT DEFAULT (datetime('now', 'localtime')),
  PRIMARY KEY (race_date, venue, race_number, horse_number)
);

-- ============================================================
-- 3. 予想結果（ファクター適用後）
-- ============================================================
-- tomorrow_racesに対して登録済みファクターを適用した結果
-- ============================================================
CREATE TABLE IF NOT EXISTS race_predictions (
  race_date TEXT NOT NULL,
  venue TEXT NOT NULL,
  race_number INTEGER NOT NULL,
  horse_number INTEGER NOT NULL,
  horse_name TEXT,
  factor_scores TEXT,                        -- JSON形式: [{factor_id, factor_name, score, analysis}, ...]
  total_score REAL,                          -- 全ファクターの合計得点
  rank INTEGER,                              -- 得点順位（1位、2位、3位...）
  predicted_at TEXT DEFAULT (datetime('now', 'localtime')),
  PRIMARY KEY (race_date, venue, race_number, horse_number)
);

-- factor_scores JSONの構造例:
-- [
--   {
--     "factor_id": 1,
--     "factor_name": "芝1600m東京・4歳以上RGS重視",
--     "score": 892.5,
--     "analysis": {
--       "win_count": 18,
--       "place_count": 56,
--       "win_hit_rate": 0.142,
--       "place_hit_rate": 0.441,
--       "win_corrected_recovery": 0.895,
--       "place_corrected_recovery": 1.068,
--       "matched_races": 127
--     }
--   },
--   {
--     "factor_id": 2,
--     "factor_name": "重賞AAS重視",
--     "score": 1234.7,
--     "analysis": { ... }
--   }
-- ]

-- ============================================================
-- 4. 馬の過去成績キャッシュ
-- ============================================================
-- E:\UMAYOMI\downloads_weekly\ から読み込んだ馬の過去成績
-- 毎回ファイルから読むのは遅いのでキャッシュする
-- ============================================================
CREATE TABLE IF NOT EXISTS horse_history_cache (
  horse_id TEXT PRIMARY KEY,
  horse_name TEXT,
  history TEXT,                              -- JSON形式: [{race_date, venue, finish_position, odds, ...}, ...]
  last_race_date TEXT,                       -- 最終出走日
  total_races INTEGER,                       -- 総出走回数
  wins INTEGER,                              -- 勝利数
  places INTEGER,                            -- 複勝回数（3着以内）
  cached_at TEXT DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT DEFAULT (datetime('now', 'localtime'))
);

-- history JSONの構造例:
-- [
--   {
--     "race_date": "20241215",
--     "venue": "中山",
--     "race_number": 11,
--     "course_type": "芝",
--     "distance": 2500,
--     "grade": "G1",
--     "class": "OP",
--     "finish_position": 1,
--     "horse_number": 3,
--     "odds": 2.5,
--     "popularity": 1,
--     "margin": 0.2,
--     "final_time": "2:32.5",
--     "jockey_id": "01234",
--     "weight": 498
--   },
--   ...
-- ]

-- ============================================================
-- 5. システム設定
-- ============================================================
-- アプリケーション設定を保存
-- ============================================================
CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value TEXT,                                -- JSON形式
  description TEXT,
  updated_at TEXT DEFAULT (datetime('now', 'localtime'))
);

-- ============================================================
-- インデックス作成
-- ============================================================

-- registered_factors のインデックス
CREATE INDEX IF NOT EXISTS idx_factors_active ON registered_factors(is_active);
CREATE INDEX IF NOT EXISTS idx_factors_created ON registered_factors(created_at DESC);

-- tomorrow_races のインデックス
CREATE INDEX IF NOT EXISTS idx_tomorrow_date ON tomorrow_races(race_date);
CREATE INDEX IF NOT EXISTS idx_tomorrow_venue ON tomorrow_races(venue);
CREATE INDEX IF NOT EXISTS idx_tomorrow_date_venue ON tomorrow_races(race_date, venue);
CREATE INDEX IF NOT EXISTS idx_tomorrow_horse_id ON tomorrow_races(horse_id);

-- race_predictions のインデックス
CREATE INDEX IF NOT EXISTS idx_predictions_date ON race_predictions(race_date);
CREATE INDEX IF NOT EXISTS idx_predictions_venue ON race_predictions(venue);
CREATE INDEX IF NOT EXISTS idx_predictions_date_venue ON race_predictions(race_date, venue);
CREATE INDEX IF NOT EXISTS idx_predictions_score ON race_predictions(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_rank ON race_predictions(rank);

-- horse_history_cache のインデックス
CREATE INDEX IF NOT EXISTS idx_horse_name ON horse_history_cache(horse_name);
CREATE INDEX IF NOT EXISTS idx_horse_last_race ON horse_history_cache(last_race_date DESC);
CREATE INDEX IF NOT EXISTS idx_horse_updated ON horse_history_cache(updated_at DESC);

-- ============================================================
-- トリガー（updated_at自動更新）
-- ============================================================

-- registered_factors のupdated_at更新トリガー
CREATE TRIGGER IF NOT EXISTS update_factors_timestamp
AFTER UPDATE ON registered_factors
FOR EACH ROW
BEGIN
  UPDATE registered_factors 
  SET updated_at = datetime('now', 'localtime')
  WHERE id = NEW.id;
END;

-- horse_history_cache のupdated_at更新トリガー
CREATE TRIGGER IF NOT EXISTS update_horse_cache_timestamp
AFTER UPDATE ON horse_history_cache
FOR EACH ROW
BEGIN
  UPDATE horse_history_cache 
  SET updated_at = datetime('now', 'localtime')
  WHERE horse_id = NEW.horse_id;
END;

-- system_settings のupdated_at更新トリガー
CREATE TRIGGER IF NOT EXISTS update_settings_timestamp
AFTER UPDATE ON system_settings
FOR EACH ROW
BEGIN
  UPDATE system_settings 
  SET updated_at = datetime('now', 'localtime')
  WHERE key = NEW.key;
END;

-- ============================================================
-- 初期データ投入
-- ============================================================

-- システム設定の初期値
INSERT OR IGNORE INTO system_settings (key, value, description) VALUES
  ('jrdb_data_path', '"E:\\UMAYOMI\\downloads_weekly"', 'JRDBデータのベースパス'),
  ('jravan_data_path', '"E:\\JRAVAN"', 'JRA-VANデータのベースパス'),
  ('jravan_realtime_path', '"E:\\JRAVAN\\REALTIME"', 'JRA-VANリアルタイムフォルダパス'),
  ('last_import_date', 'null', '最終データ取り込み日'),
  ('auto_apply_factors', 'true', 'データ取り込み後に自動的にファクター適用する'),
  ('cache_expiry_days', '7', '馬の過去成績キャッシュの有効期限（日数）');

-- ============================================================
-- 動作確認用のサンプルデータ
-- ============================================================

-- サンプルファクター1: RGS重視型
INSERT OR IGNORE INTO registered_factors (id, name, formula, conditions, description) VALUES
  (1, '芝1600m東京・4歳以上RGS重視', 'win_count * 10 + place_count * 5', 
   '{"area1":{"course_type":["芝"],"distance_min":1600,"distance_max":1600,"venues":["東京"]},"area2":{"sex":["牡","牝"],"age_min":4,"age_max":99},"area3":{"date_from":"2020-01-01","date_to":"2024-12-31"},"correction":{"period":{"recent_3m":1.0,"recent_6m":0.8,"recent_1y":0.5},"odds":{"min":1.0,"max":20.0}}}',
   'RGS重視型（単勝的中重視）');

-- サンプルファクター2: AAS重視型
INSERT OR IGNORE INTO registered_factors (id, name, formula, conditions, description) VALUES
  (2, '重賞AAS重視', 'win_corrected_recovery * 50 + place_corrected_recovery * 30', 
   '{"area1":{"course_type":["芝","ダート"],"distance_min":1200,"distance_max":3600},"area2":{},"area3":{"grades":["G1","G2","G3"],"date_from":"2020-01-01","date_to":"2024-12-31"},"correction":{"period":{"recent_3m":1.0,"recent_1y":0.7},"odds":{"min":1.0,"max":99.9}}}',
   'AAS重視型（回収率重視）');

-- サンプルファクター3: ハイブリッド型
INSERT OR IGNORE INTO registered_factors (id, name, formula, conditions, description) VALUES
  (3, 'ハイブリッド型', '(win_count + place_count) * win_corrected_recovery / 10', 
   '{"area1":{"course_type":["芝"],"distance_min":1400,"distance_max":2000},"area2":{"age_min":3,"age_max":5},"area3":{"classes":["OP","3勝","2勝"],"date_from":"2021-01-01","date_to":"2024-12-31"},"correction":{"period":{"recent_6m":1.0,"recent_1y":0.6},"odds":{"min":1.0,"max":30.0}}}',
   'RGSとAASのバランス型');

-- ============================================================
-- マイグレーション完了
-- ============================================================
