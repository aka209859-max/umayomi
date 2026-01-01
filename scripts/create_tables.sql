-- ================================================================
-- UMAYOMI Phase 4A: PostgreSQL テーブル作成 SQL
-- ================================================================
-- 
-- 実行方法:
--   psql -U postgres -d umayomi -f create_tables.sql
-- 
-- または pgAdmin で直接実行
-- ================================================================

-- データベースが存在しない場合は作成
-- CREATE DATABASE umayomi ENCODING 'UTF8';

-- umayomi データベースに接続
\c umayomi;

-- ================================================================
-- 1. race_results テーブル（SED 成績データ）
-- ================================================================
CREATE TABLE IF NOT EXISTS race_results (
    id SERIAL PRIMARY KEY,
    race_key VARCHAR(8) NOT NULL,
    horse_number VARCHAR(2) NOT NULL,
    pedigree_id VARCHAR(10),
    finish_position INTEGER,
    race_time VARCHAR(10),
    last_3f_time VARCHAR(10),
    hoof_code VARCHAR(4),
    idm_score INTEGER,
    pace_score INTEGER,
    agari_score INTEGER,
    position_score INTEGER,
    odds DECIMAL(10,2),
    popularity INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 重複排除用UNIQUE制約
    UNIQUE(race_key, horse_number)
);

-- インデックス作成（検索高速化）
CREATE INDEX IF NOT EXISTS idx_race_results_race_key ON race_results(race_key);
CREATE INDEX IF NOT EXISTS idx_race_results_hoof_code ON race_results(hoof_code);
CREATE INDEX IF NOT EXISTS idx_race_results_pedigree_id ON race_results(pedigree_id);

COMMENT ON TABLE race_results IS 'SED 成績データ（レース結果・蹄コード・指数）';
COMMENT ON COLUMN race_results.race_key IS 'レースキー（8桁）';
COMMENT ON COLUMN race_results.horse_number IS '馬番（2桁）';
COMMENT ON COLUMN race_results.pedigree_id IS '血統登録番号（10桁）';
COMMENT ON COLUMN race_results.finish_position IS '着順';
COMMENT ON COLUMN race_results.race_time IS 'レースタイム';
COMMENT ON COLUMN race_results.last_3f_time IS '上がり3Fタイム';
COMMENT ON COLUMN race_results.hoof_code IS '蹄コード（4文字）';
COMMENT ON COLUMN race_results.idm_score IS 'IDM指数';
COMMENT ON COLUMN race_results.pace_score IS 'ペース指数';
COMMENT ON COLUMN race_results.agari_score IS '上がり指数';
COMMENT ON COLUMN race_results.position_score IS '位置指数';

-- ================================================================
-- 2. race_info テーブル（TYB 直前情報データ）
-- ================================================================
CREATE TABLE IF NOT EXISTS race_info (
    id SERIAL PRIMARY KEY,
    race_key VARCHAR(8) NOT NULL,
    horse_number VARCHAR(2) NOT NULL,
    pedigree_id VARCHAR(10),
    final_odds DECIMAL(10,2),
    final_popularity INTEGER,
    paddock_score INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 重複排除用UNIQUE制約
    UNIQUE(race_key, horse_number)
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_race_info_race_key ON race_info(race_key);
CREATE INDEX IF NOT EXISTS idx_race_info_pedigree_id ON race_info(pedigree_id);

COMMENT ON TABLE race_info IS 'TYB 直前情報データ（オッズ・人気・パドック）';
COMMENT ON COLUMN race_info.race_key IS 'レースキー（8桁）';
COMMENT ON COLUMN race_info.horse_number IS '馬番（2桁）';
COMMENT ON COLUMN race_info.pedigree_id IS '血統登録番号（10桁）';
COMMENT ON COLUMN race_info.final_odds IS '確定オッズ';
COMMENT ON COLUMN race_info.final_popularity IS '確定人気順位';
COMMENT ON COLUMN race_info.paddock_score IS 'パドック評価スコア';

-- ================================================================
-- 3. hoof_data テーブル（蹄コード・指数統合マスター）
-- ================================================================
CREATE TABLE IF NOT EXISTS hoof_data (
    id SERIAL PRIMARY KEY,
    race_key VARCHAR(8) NOT NULL,
    horse_number VARCHAR(2) NOT NULL,
    pedigree_id VARCHAR(10),
    race_date DATE,
    venue_code VARCHAR(2),
    race_number VARCHAR(2),
    
    -- 蹄コード
    hoof_code VARCHAR(4),
    front_left_hoof VARCHAR(1),
    front_right_hoof VARCHAR(1),
    rear_left_hoof VARCHAR(1),
    rear_right_hoof VARCHAR(1),
    
    -- 予測指数（KYI）
    predicted_idm INTEGER,
    predicted_gekiso INTEGER,
    predicted_pace INTEGER,
    predicted_agari INTEGER,
    predicted_ten INTEGER,
    predicted_position INTEGER,
    predicted_training INTEGER,
    predicted_turf INTEGER,
    predicted_rating INTEGER,
    
    -- 実績指数（SED）
    actual_pace INTEGER,
    actual_agari INTEGER,
    actual_position INTEGER,
    
    -- レース結果
    finish_position INTEGER,
    race_time VARCHAR(10),
    last_3f_time VARCHAR(10),
    
    -- オッズ・人気
    odds DECIMAL(10,2),
    popularity INTEGER,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 重複排除用UNIQUE制約
    UNIQUE(race_key, horse_number)
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_hoof_data_race_key ON hoof_data(race_key);
CREATE INDEX IF NOT EXISTS idx_hoof_data_hoof_code ON hoof_data(hoof_code);
CREATE INDEX IF NOT EXISTS idx_hoof_data_pedigree_id ON hoof_data(pedigree_id);
CREATE INDEX IF NOT EXISTS idx_hoof_data_race_date ON hoof_data(race_date);
CREATE INDEX IF NOT EXISTS idx_hoof_data_finish_position ON hoof_data(finish_position);

COMMENT ON TABLE hoof_data IS '蹄コード・指数統合マスター（KYI+SED+TYB）';
COMMENT ON COLUMN hoof_data.race_key IS 'レースキー（8桁）';
COMMENT ON COLUMN hoof_data.horse_number IS '馬番（2桁）';
COMMENT ON COLUMN hoof_data.pedigree_id IS '血統登録番号（10桁）';
COMMENT ON COLUMN hoof_data.race_date IS 'レース日付';
COMMENT ON COLUMN hoof_data.venue_code IS '場コード（01:札幌, 02:函館, ...）';
COMMENT ON COLUMN hoof_data.race_number IS 'レース番号（01-12）';
COMMENT ON COLUMN hoof_data.hoof_code IS '蹄コード（4文字）';
COMMENT ON COLUMN hoof_data.predicted_idm IS '予測IDM指数';
COMMENT ON COLUMN hoof_data.predicted_gekiso IS '予測激走指数';
COMMENT ON COLUMN hoof_data.actual_pace IS '実績ペース指数';
COMMENT ON COLUMN hoof_data.actual_agari IS '実績上がり指数';
COMMENT ON COLUMN hoof_data.finish_position IS '着順';

-- ================================================================
-- 4. テーブル作成完了確認
-- ================================================================
\dt

SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- ================================================================
-- 完了メッセージ
-- ================================================================
\echo '✅ テーブル作成完了'
\echo '📊 作成されたテーブル:'
\echo '  1. race_results (SED 成績データ)'
\echo '  2. race_info (TYB 直前情報)'
\echo '  3. hoof_data (蹄コード・指数統合マスター)'
