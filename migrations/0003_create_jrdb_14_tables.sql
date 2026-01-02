-- ================================================
-- JRDB 新規14テーブル追加マイグレーション
-- Phase 3-3: UKC, CYB, ZED, OW, OU, OT, KKA, HJC, SRB, OZ, ZKB, OV, CE, BV
-- ================================================

-- 1. UKC: 調教情報
CREATE TABLE IF NOT EXISTS jrdb_ukc (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  horse_id TEXT NOT NULL,
  race_key TEXT NOT NULL,
  horse_name TEXT,
  training_date TEXT,
  training_course TEXT,
  training_type TEXT,
  training_time TEXT,
  last_5f REAL,
  last_4f REAL,
  last_3f REAL,
  last_2f REAL,
  last_1f REAL,
  training_evaluation TEXT,
  training_rank INTEGER,
  chasing_method TEXT,
  chasing_position TEXT,
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jrdb_ukc_race ON jrdb_ukc(race_key);
CREATE INDEX IF NOT EXISTS idx_jrdb_ukc_horse ON jrdb_ukc(horse_id);

-- 2. CYB: 血統情報
CREATE TABLE IF NOT EXISTS jrdb_cyb (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_key TEXT NOT NULL,
  horse_id TEXT NOT NULL,
  horse_name TEXT,
  sire_id TEXT,
  sire_name TEXT,
  dam_id TEXT,
  dam_name TEXT,
  damsire_id TEXT,
  damsire_name TEXT,
  sire_line TEXT,
  damsire_line TEXT,
  pedigree_evaluation TEXT,
  turf_aptitude TEXT,
  dirt_aptitude TEXT,
  distance_aptitude TEXT,
  breeder_name TEXT,
  breeder_location TEXT,
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jrdb_cyb_race ON jrdb_cyb(race_key);
CREATE INDEX IF NOT EXISTS idx_jrdb_cyb_horse ON jrdb_cyb(horse_id);

-- 3. ZED: 確定・払戻
CREATE TABLE IF NOT EXISTS jrdb_zed (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_key TEXT NOT NULL UNIQUE,
  race_date TEXT NOT NULL,
  track_code TEXT,
  race_number INTEGER,
  win_horse INTEGER,
  win_payout INTEGER,
  win_popularity INTEGER,
  place_horse_1 INTEGER,
  place_payout_1 INTEGER,
  place_horse_2 INTEGER,
  place_payout_2 INTEGER,
  place_horse_3 INTEGER,
  place_payout_3 INTEGER,
  bracket_quinella_horses TEXT,
  bracket_quinella_payout INTEGER,
  bracket_quinella_popularity INTEGER,
  quinella_horses TEXT,
  quinella_payout INTEGER,
  quinella_popularity INTEGER,
  exacta_horses TEXT,
  exacta_payout INTEGER,
  exacta_popularity INTEGER,
  wide_horses_1 TEXT,
  wide_payout_1 INTEGER,
  wide_popularity_1 INTEGER,
  wide_horses_2 TEXT,
  wide_payout_2 INTEGER,
  wide_popularity_2 INTEGER,
  wide_horses_3 TEXT,
  wide_payout_3 INTEGER,
  wide_popularity_3 INTEGER,
  trio_horses TEXT,
  trio_payout INTEGER,
  trio_popularity INTEGER,
  trifecta_horses TEXT,
  trifecta_payout INTEGER,
  trifecta_popularity INTEGER,
  total_sales INTEGER,
  refund_rate INTEGER,
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jrdb_zed_race ON jrdb_zed(race_date, track_code, race_number);

-- 4. OW: 単勝オッズ
CREATE TABLE IF NOT EXISTS jrdb_ow (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_key TEXT NOT NULL,
  horse_number INTEGER NOT NULL,
  odds REAL NOT NULL,
  popularity INTEGER,
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jrdb_ow_race ON jrdb_ow(race_key);

-- 5. OU: 馬連オッズ
CREATE TABLE IF NOT EXISTS jrdb_ou (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_key TEXT NOT NULL,
  horse_combination TEXT NOT NULL,
  odds REAL NOT NULL,
  popularity INTEGER,
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jrdb_ou_race ON jrdb_ou(race_key);

-- 6. OT: 3連単オッズ
CREATE TABLE IF NOT EXISTS jrdb_ot (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_key TEXT NOT NULL,
  horse_combination TEXT NOT NULL,
  odds REAL NOT NULL,
  popularity INTEGER,
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jrdb_ot_race ON jrdb_ot(race_key);

-- 7. KKA: 競走成績
CREATE TABLE IF NOT EXISTS jrdb_kka (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  horse_id TEXT NOT NULL,
  race_date TEXT NOT NULL,
  track_code TEXT,
  race_number INTEGER,
  finish_position INTEGER,
  horse_number INTEGER,
  odds REAL,
  popularity INTEGER,
  time TEXT,
  margin TEXT,
  jockey_name TEXT,
  weight INTEGER,
  horse_weight INTEGER,
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jrdb_kka_horse ON jrdb_kka(horse_id);
CREATE INDEX IF NOT EXISTS idx_jrdb_kka_race ON jrdb_kka(race_date, track_code, race_number);

-- 8. HJC: 払戻金
CREATE TABLE IF NOT EXISTS jrdb_hjc (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_key TEXT NOT NULL,
  ticket_type TEXT NOT NULL,
  horse_combination TEXT NOT NULL,
  payout INTEGER NOT NULL,
  popularity INTEGER,
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jrdb_hjc_race ON jrdb_hjc(race_key);

-- 9. SRB: 成績追加
CREATE TABLE IF NOT EXISTS jrdb_srb (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  horse_id TEXT NOT NULL,
  race_date TEXT NOT NULL,
  track_code TEXT,
  race_number INTEGER,
  additional_info TEXT,
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jrdb_srb_horse ON jrdb_srb(horse_id);

-- 10. OZ: 馬場状態
CREATE TABLE IF NOT EXISTS jrdb_oz (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_key TEXT NOT NULL UNIQUE,
  track_condition TEXT,
  turf_condition TEXT,
  dirt_condition TEXT,
  weather TEXT,
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jrdb_oz_race ON jrdb_oz(race_key);

-- 11. ZKB: 前日売上
CREATE TABLE IF NOT EXISTS jrdb_zkb (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_key TEXT NOT NULL UNIQUE,
  total_sales INTEGER,
  win_sales INTEGER,
  place_sales INTEGER,
  quinella_sales INTEGER,
  exacta_sales INTEGER,
  trio_sales INTEGER,
  trifecta_sales INTEGER,
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jrdb_zkb_race ON jrdb_zkb(race_key);

-- 12. OV: オッズ大容量
CREATE TABLE IF NOT EXISTS jrdb_ov (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_key TEXT NOT NULL,
  horse_number INTEGER NOT NULL,
  odds REAL NOT NULL,
  vote_count INTEGER,
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jrdb_ov_race ON jrdb_ov(race_key);

-- 13. CE: レースコメント
CREATE TABLE IF NOT EXISTS jrdb_ce (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_key TEXT NOT NULL,
  comment_type TEXT,
  comment_text TEXT,
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jrdb_ce_race ON jrdb_ce(race_key);

-- 14. BV: 統合情報
CREATE TABLE IF NOT EXISTS jrdb_bv (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_key TEXT NOT NULL,
  data_type TEXT,
  data_value TEXT,
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jrdb_bv_race ON jrdb_bv(race_key);
