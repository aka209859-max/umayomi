-- ================================================
-- UMAYOMI データベース マイグレーション
-- Phase 3-1: JRDB + JRA-VAN テーブル作成
-- ================================================

-- ================================================
-- JRDB テーブル (7種類)
-- ================================================

-- 1. JRDB KYI (馬別出走情報)
CREATE TABLE IF NOT EXISTS jrdb_kyi (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_key TEXT NOT NULL,
  race_date TEXT NOT NULL,
  track_code TEXT NOT NULL,
  race_number INTEGER NOT NULL,
  horse_number INTEGER NOT NULL,
  horse_id TEXT NOT NULL,
  horse_name TEXT,
  sex TEXT,
  age INTEGER,
  jockey_code TEXT,
  jockey_name TEXT,
  trainer_code TEXT,
  trainer_name TEXT,
  weight INTEGER,
  weight_change INTEGER,
  odds REAL,
  popularity INTEGER,
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jrdb_kyi_race ON jrdb_kyi(race_date, track_code, race_number);
CREATE INDEX IF NOT EXISTS idx_jrdb_kyi_horse ON jrdb_kyi(horse_id);

-- 2. JRDB BAC (馬基本情報)
CREATE TABLE IF NOT EXISTS jrdb_bac (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  horse_id TEXT NOT NULL UNIQUE,
  horse_name TEXT,
  sex TEXT,
  birth_date TEXT,
  sire_name TEXT,
  dam_name TEXT,
  breeder TEXT,
  owner TEXT,
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jrdb_bac_horse ON jrdb_bac(horse_id);

-- 3. JRDB KAB (レース結果サマリー)
CREATE TABLE IF NOT EXISTS jrdb_kab (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_key TEXT NOT NULL,
  race_date TEXT NOT NULL,
  track_code TEXT NOT NULL,
  race_number INTEGER NOT NULL,
  race_name TEXT,
  grade TEXT,
  distance INTEGER,
  course_type TEXT,
  weather TEXT,
  track_condition TEXT,
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jrdb_kab_race ON jrdb_kab(race_date, track_code, race_number);

-- 4. JRDB CHA (厩舎コメント)
CREATE TABLE IF NOT EXISTS jrdb_cha (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_key TEXT NOT NULL,
  horse_id TEXT NOT NULL,
  comment TEXT,
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jrdb_cha_horse ON jrdb_cha(horse_id);

-- 5. JRDB JOA (騎手データ)
CREATE TABLE IF NOT EXISTS jrdb_joa (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  jockey_code TEXT NOT NULL,
  jockey_name TEXT,
  affiliation TEXT,
  birth_date TEXT,
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jrdb_joa_jockey ON jrdb_joa(jockey_code);

-- 6. JRDB SED (成績データ - 既存のSEDParserを使用)
CREATE TABLE IF NOT EXISTS jrdb_sed (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_key TEXT NOT NULL,
  race_date TEXT NOT NULL,
  track_code TEXT NOT NULL,
  race_number INTEGER NOT NULL,
  horse_number INTEGER NOT NULL,
  horse_id TEXT,
  finish_position INTEGER,
  finish_time REAL,
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jrdb_sed_race ON jrdb_sed(race_date, track_code, race_number);
CREATE INDEX IF NOT EXISTS idx_jrdb_sed_horse ON jrdb_sed(horse_id);

-- 7. JRDB TYB (出馬表データ)
CREATE TABLE IF NOT EXISTS jrdb_tyb (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_key TEXT NOT NULL,
  race_date TEXT NOT NULL,
  track_code TEXT NOT NULL,
  race_number INTEGER NOT NULL,
  horse_number INTEGER NOT NULL,
  horse_id TEXT NOT NULL,
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jrdb_tyb_race ON jrdb_tyb(race_date, track_code, race_number);

-- ================================================
-- JRA-VAN テーブル (6種類 + HC)
-- ================================================

-- 1. JRA-VAN SE (成績データ)
CREATE TABLE IF NOT EXISTS jravan_se (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_date TEXT NOT NULL,
  track_code TEXT NOT NULL,
  race_number INTEGER NOT NULL,
  horse_number INTEGER NOT NULL,
  horse_id TEXT NOT NULL,
  horse_name TEXT,
  finish_position INTEGER,
  popularity INTEGER,
  finish_time REAL,
  distance INTEGER,
  jockey_id TEXT,
  jockey_name TEXT,
  trainer_id TEXT,
  trainer_name TEXT,
  odds REAL,
  prize INTEGER,
  horse_weight INTEGER,
  weight_change INTEGER,
  passing1 INTEGER,
  passing2 INTEGER,
  passing3 INTEGER,
  passing4 INTEGER,
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jravan_se_race ON jravan_se(race_date, track_code, race_number);
CREATE INDEX IF NOT EXISTS idx_jravan_se_horse ON jravan_se(horse_id);

-- 2. JRA-VAN TM (調教データ)
CREATE TABLE IF NOT EXISTS jravan_tm (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_date TEXT NOT NULL,
  data_date TEXT NOT NULL,
  track_code TEXT NOT NULL,
  race_number INTEGER NOT NULL,
  horse_number INTEGER NOT NULL,
  training_count INTEGER,
  training_data TEXT, -- JSON形式
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jravan_tm_race ON jravan_tm(race_date, track_code, race_number);

-- 3. JRA-VAN JG (騎手情報)
CREATE TABLE IF NOT EXISTS jravan_jg (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_date TEXT NOT NULL,
  data_date TEXT NOT NULL,
  track_code TEXT NOT NULL,
  race_number INTEGER NOT NULL,
  horse_number INTEGER NOT NULL,
  horse_id TEXT NOT NULL,
  jockey_name TEXT,
  odds REAL,
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jravan_jg_race ON jravan_jg(race_date, track_code, race_number);

-- 4. JRA-VAN BY/HY (馬基本情報)
CREATE TABLE IF NOT EXISTS jravan_by (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_date TEXT NOT NULL,
  horse_id TEXT NOT NULL,
  horse_name TEXT,
  comment TEXT,
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jravan_by_horse ON jravan_by(horse_id);

-- 5. JRA-VAN OW (オッズデータ - 馬主情報)
CREATE TABLE IF NOT EXISTS jravan_ow (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  registration_date TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  owner_name TEXT,
  owner_name_kana TEXT,
  owner_name_eng TEXT,
  colors TEXT,
  registration_year INTEGER,
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jravan_ow_owner ON jravan_ow(owner_id);

-- 6. JRA-VAN SCHD (開催スケジュール)
CREATE TABLE IF NOT EXISTS jravan_schd (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data_date TEXT NOT NULL,
  race_date TEXT NOT NULL,
  track_code TEXT NOT NULL,
  race_number INTEGER NOT NULL,
  race_name TEXT,
  race_name_short TEXT,
  grade TEXT,
  distance INTEGER,
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jravan_schd_race ON jravan_schd(race_date, track_code, race_number);

-- 7. JRA-VAN HC (出走予定馬 - 既に実装済み)
CREATE TABLE IF NOT EXISTS jravan_hc (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_date TEXT NOT NULL,
  track_code TEXT NOT NULL,
  race_number INTEGER NOT NULL,
  horse_number INTEGER NOT NULL,
  horse_id TEXT NOT NULL,
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jravan_hc_race ON jravan_hc(race_date, track_code, race_number);
