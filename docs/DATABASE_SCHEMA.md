# UMAYOMI データベーススキーマ設計

## 概要
- **データベース**: umayomi_db
- **データソース**: JRDB (2016-2025) + TFJV (2016-2025)
- **テーブル数**: 14テーブル (JRDB) + 将来的にTFJVテーブル追加

---

## Layer 1: レース・成績・馬基本情報

### 1. races (ZED: レース詳細データ)
```sql
CREATE TABLE IF NOT EXISTS races (
    id SERIAL PRIMARY KEY,
    track_code VARCHAR(2),           -- 場コード (01-10)
    race_num VARCHAR(2),              -- レース番号 (01-12)
    day_of_week VARCHAR(2),           -- 曜日
    month VARCHAR(2),                 -- 月
    day VARCHAR(2),                   -- 日
    race_id VARCHAR(18) UNIQUE,       -- レースID (一意)
    race_date VARCHAR(8),             -- 開催年月日 YYYYMMDD
    race_name VARCHAR(50),            -- レース名
    grade VARCHAR(2),                 -- グレード (G1, G2, G3等)
    distance VARCHAR(4),              -- 距離 (1200-3600m)
    track_type VARCHAR(1),            -- コース種別 (1:芝 2:ダート)
    track_condition VARCHAR(2),       -- 馬場状態 (10-40)
    weather VARCHAR(1),               -- 天候 (1-5)
    race_class VARCHAR(2),            -- クラス
    age_limit VARCHAR(1),             -- 年齢制限
    weight_type VARCHAR(1),           -- 負担重量
    prize_1 VARCHAR(8),               -- 1着賞金
    prize_2 VARCHAR(8),               -- 2着賞金
    prize_3 VARCHAR(8),               -- 3着賞金
    prize_4 VARCHAR(8),               -- 4着賞金
    prize_5 VARCHAR(8),               -- 5着賞金
    num_horses VARCHAR(2),            -- 出走頭数
    course VARCHAR(1),                -- コース (1:右 2:左 3:直線)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_races_race_id ON races(race_id);
CREATE INDEX idx_races_race_date ON races(race_date);
CREATE INDEX idx_races_track_code ON races(track_code);
```

**レコード数**: 約1,043日 × 平均10レース = 約10,430レース

---

### 2. race_results (ZKB: 成績指数データ)
```sql
CREATE TABLE IF NOT EXISTS race_results (
    id SERIAL PRIMARY KEY,
    race_id VARCHAR(18),              -- レースID (races.race_id と結合)
    race_date VARCHAR(8),             -- 開催年月日
    idm VARCHAR(3),                   -- 総合指数 IDM
    jockey_index VARCHAR(3),          -- 騎手指数
    info_index VARCHAR(3),            -- 情報指数
    pace_index VARCHAR(3),            -- ペース指数
    up_index VARCHAR(3),              -- 上がり指数
    position_index VARCHAR(3),        -- 位置取り指数
    pace_change VARCHAR(3),           -- ペース変化
    -- 前走情報 (1-5走前)
    prev1_idm VARCHAR(3),
    prev1_jockey VARCHAR(3),
    prev1_info VARCHAR(3),
    prev2_idm VARCHAR(3),
    prev2_jockey VARCHAR(3),
    prev2_info VARCHAR(3),
    prev3_idm VARCHAR(3),
    prev3_jockey VARCHAR(3),
    prev3_info VARCHAR(3),
    prev4_idm VARCHAR(3),
    prev4_jockey VARCHAR(3),
    prev4_info VARCHAR(3),
    prev5_idm VARCHAR(3),
    prev5_jockey VARCHAR(3),
    prev5_info VARCHAR(3),
    -- 着順・人気
    finish_position VARCHAR(2),       -- 着順
    popularity VARCHAR(2),            -- 人気
    horse_weight VARCHAR(3),          -- 馬体重
    horse_weight_diff VARCHAR(3),     -- 馬体重増減
    odds VARCHAR(6),                  -- オッズ
    horse_num VARCHAR(2),             -- 馬番
    frame_num VARCHAR(1),             -- 枠番
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_race_results_race_id ON race_results(race_id);
CREATE INDEX idx_race_results_race_date ON race_results(race_date);
CREATE INDEX idx_race_results_idm ON race_results(CAST(idm AS INTEGER));
```

**レコード数**: 約1,980レコード/日 (2021年6月20日実績)

---

### 3. horse_records (BAC: 馬別成績データ)
```sql
CREATE TABLE IF NOT EXISTS horse_records (
    id SERIAL PRIMARY KEY,
    track_code VARCHAR(2),
    race_num VARCHAR(2),
    race_date_short VARCHAR(2),
    race_full_date VARCHAR(8),
    start_time VARCHAR(4),
    distance VARCHAR(3),
    track_type VARCHAR(1),
    course VARCHAR(1),
    grade VARCHAR(2),
    race_class VARCHAR(2),
    age_limit VARCHAR(1),
    weight_type VARCHAR(1),
    horse_id VARCHAR(8),              -- 馬ID (horse_master と結合)
    horse_name VARCHAR(36),           -- 馬名
    distance_aptitude VARCHAR(1),     -- 距離適性
    sire_name VARCHAR(36),            -- 父馬名
    dam_name VARCHAR(36),             -- 母馬名
    trainer_name VARCHAR(12),         -- 調教師名
    jockey_name VARCHAR(12),          -- 騎手名
    owner_name VARCHAR(24),           -- 馬主名
    breeder_name VARCHAR(24),         -- 生産者名
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_horse_records_horse_id ON horse_records(horse_id);
CREATE INDEX idx_horse_records_race_date ON horse_records(race_full_date);
```

**レコード数**: 約36レース (2021年6月20日実績)

---

## Layer 2: 調教・騎手・馬データ

### 4. training_data (CYB: 調教データ)
```sql
CREATE TABLE IF NOT EXISTS training_data (
    id SERIAL PRIMARY KEY,
    track_code VARCHAR(2),
    race_num VARCHAR(2),
    horse_num VARCHAR(2),
    training_date VARCHAR(8),
    training_time VARCHAR(4),
    training_course VARCHAR(2),
    training_type VARCHAR(1),
    training_distance VARCHAR(3),
    time_4f VARCHAR(4),               -- 4F タイム
    time_3f VARCHAR(4),               -- 3F タイム
    time_2f VARCHAR(4),               -- 2F タイム
    time_1f VARCHAR(4),               -- 1F タイム
    finish_index VARCHAR(3),          -- 終い指数
    evaluation VARCHAR(1),            -- 評価 (A-E)
    trainer_comment TEXT,             -- 調教師コメント
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_training_data_horse_num ON training_data(horse_num);
CREATE INDEX idx_training_data_training_date ON training_data(training_date);
```

**レコード数**: 約501レコード/日

---

### 5. jockey_stats (JOA: 騎手データ)
```sql
CREATE TABLE IF NOT EXISTS jockey_stats (
    id SERIAL PRIMARY KEY,
    track_code VARCHAR(2),
    race_num VARCHAR(2),
    horse_num VARCHAR(2),
    jockey_code VARCHAR(5),
    jockey_name VARCHAR(12),
    jockey_weight VARCHAR(5),
    jockey_weight_diff VARCHAR(5),
    leading_rate VARCHAR(5),          -- 先行率
    track_win_rate VARCHAR(5),        -- 当該コース勝率
    distance_win_rate VARCHAR(5),     -- 距離別勝率
    total_wins VARCHAR(5),            -- 通算勝利数
    total_races VARCHAR(5),           -- 通算出走数
    win_rate VARCHAR(5),              -- 勝率
    place_rate VARCHAR(5),            -- 連対率
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_jockey_stats_jockey_code ON jockey_stats(jockey_code);
CREATE INDEX idx_jockey_stats_jockey_name ON jockey_stats(jockey_name);
```

**レコード数**: 約501レコード/日

---

### 6. horse_master (KKA: 馬基本データ)
```sql
CREATE TABLE IF NOT EXISTS horse_master (
    id SERIAL PRIMARY KEY,
    track_code VARCHAR(2),
    race_num VARCHAR(2),
    horse_num VARCHAR(2),
    horse_id VARCHAR(8) UNIQUE,       -- 馬ID (一意)
    year_of_birth VARCHAR(4),         -- 生年
    trainer_code VARCHAR(5),
    trainer_name VARCHAR(12),
    owner_code VARCHAR(6),
    owner_name VARCHAR(40),
    breeder_code VARCHAR(6),
    place_of_birth VARCHAR(2),        -- 産地
    auction_price VARCHAR(8),         -- セール価格
    import_year VARCHAR(4),
    sire_id VARCHAR(8),               -- 父馬ID
    dam_id VARCHAR(8),                -- 母馬ID
    dam_sire_id VARCHAR(8),           -- 母父馬ID
    age VARCHAR(2),
    sex VARCHAR(1),                   -- 1:牡 2:牝 3:セン
    coat_color VARCHAR(2),            -- 毛色
    mark VARCHAR(30),                 -- 馬印
    total_prize VARCHAR(8),           -- 獲得賞金
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_horse_master_horse_id ON horse_master(horse_id);
CREATE INDEX idx_horse_master_trainer_code ON horse_master(trainer_code);
```

**レコード数**: 約501レコード/日

---

### 7. horse_performance (UKC: 馬成績データ詳細)
```sql
CREATE TABLE IF NOT EXISTS horse_performance (
    id SERIAL PRIMARY KEY,
    race_id VARCHAR(18),
    race_date VARCHAR(8),
    horse_id VARCHAR(8),
    horse_name VARCHAR(36),
    -- 芝成績
    turf_short_runs VARCHAR(3),
    turf_short_1st VARCHAR(3),
    turf_short_2nd VARCHAR(3),
    turf_short_3rd VARCHAR(3),
    turf_mile_runs VARCHAR(3),
    turf_mile_1st VARCHAR(3),
    turf_mile_2nd VARCHAR(3),
    turf_mile_3rd VARCHAR(3),
    turf_middle_runs VARCHAR(3),
    turf_middle_1st VARCHAR(3),
    turf_middle_2nd VARCHAR(3),
    turf_middle_3rd VARCHAR(3),
    turf_long_runs VARCHAR(3),
    turf_long_1st VARCHAR(3),
    turf_long_2nd VARCHAR(3),
    turf_long_3rd VARCHAR(3),
    -- ダート成績
    dirt_short_runs VARCHAR(3),
    dirt_short_1st VARCHAR(3),
    dirt_short_2nd VARCHAR(3),
    dirt_short_3rd VARCHAR(3),
    dirt_mile_runs VARCHAR(3),
    dirt_mile_1st VARCHAR(3),
    dirt_mile_2nd VARCHAR(3),
    dirt_mile_3rd VARCHAR(3),
    dirt_middle_runs VARCHAR(3),
    dirt_middle_1st VARCHAR(3),
    dirt_middle_2nd VARCHAR(3),
    dirt_middle_3rd VARCHAR(3),
    dirt_long_runs VARCHAR(3),
    dirt_long_1st VARCHAR(3),
    dirt_long_2nd VARCHAR(3),
    dirt_long_3rd VARCHAR(3),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_horse_performance_horse_id ON horse_performance(horse_id);
CREATE INDEX idx_horse_performance_race_id ON horse_performance(race_id);
```

**レコード数**: 約501レコード/日

---

### 8. horse_details (KYI: 競走馬詳細データ)
```sql
CREATE TABLE IF NOT EXISTS horse_details (
    id SERIAL PRIMARY KEY,
    race_id VARCHAR(18),
    race_date VARCHAR(8),
    horse_id VARCHAR(8),
    horse_name VARCHAR(36),
    -- 前走情報
    prev_race_date VARCHAR(8),
    prev_track VARCHAR(2),
    prev_race_num VARCHAR(2),
    prev_race_name VARCHAR(50),
    prev_num_horses VARCHAR(2),
    prev_frame VARCHAR(1),
    prev_horse_num VARCHAR(2),
    prev_odds VARCHAR(6),
    prev_popularity VARCHAR(2),
    prev_finish VARCHAR(2),
    prev_jockey VARCHAR(12),
    prev_weight VARCHAR(3),
    prev_distance VARCHAR(4),
    prev_track_type VARCHAR(1),
    prev_track_condition VARCHAR(2),
    prev_time VARCHAR(4),
    prev_time_diff VARCHAR(5),
    prev_pass_position VARCHAR(4),
    prev_last_3f VARCHAR(3),
    prev_horse_weight VARCHAR(3),
    prev_weight_diff VARCHAR(3),
    prev_winner VARCHAR(36),
    prev_prize VARCHAR(8),
    -- レース前情報
    pre_horse_weight VARCHAR(3),
    pre_weight_diff VARCHAR(3),
    blinker VARCHAR(1),
    bandage VARCHAR(1),
    transport_area VARCHAR(1),
    trainer_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_horse_details_horse_id ON horse_details(horse_id);
CREATE INDEX idx_horse_details_race_id ON horse_details(race_id);
```

**レコード数**: 約501レコード/日

---

## Layer 3: オッズ・コメントデータ

### 9. odds_tansho_fukusho (OT: 単勝・複勝オッズ)
```sql
CREATE TABLE IF NOT EXISTS odds_tansho_fukusho (
    id SERIAL PRIMARY KEY,
    race_key VARCHAR(14),
    win_odds TEXT[],                  -- 単勝オッズ配列
    place_odds TEXT[],                -- 複勝オッズ配列
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_odds_tansho_race_key ON odds_tansho_fukusho(race_key);
```

**レコード数**: 約36レコード/日

---

### 10. odds_umaren (OU: 馬連オッズ)
```sql
CREATE TABLE IF NOT EXISTS odds_umaren (
    id SERIAL PRIMARY KEY,
    race_key VARCHAR(14),
    umaren_odds TEXT[],               -- 馬連オッズ配列
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_odds_umaren_race_key ON odds_umaren(race_key);
```

**レコード数**: 約36レコード/日

---

### 11. odds_wide (OW: ワイドオッズ)
```sql
CREATE TABLE IF NOT EXISTS odds_wide (
    id SERIAL PRIMARY KEY,
    race_key VARCHAR(14),
    wide_odds TEXT[],                 -- ワイドオッズ配列
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_odds_wide_race_key ON odds_wide(race_key);
```

**レコード数**: 約36レコード/日

---

### 12. odds_sanrenpuku (OZ: 3連複オッズ)
```sql
CREATE TABLE IF NOT EXISTS odds_sanrenpuku (
    id SERIAL PRIMARY KEY,
    race_key VARCHAR(14),
    sanrenpuku_odds TEXT[],           -- 3連複オッズ配列
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_odds_sanrenpuku_race_key ON odds_sanrenpuku(race_key);
```

**レコード数**: 約36レコード/日

---

### 13. trainer_comments (CHA: 厩舎コメント)
```sql
CREATE TABLE IF NOT EXISTS trainer_comments (
    id SERIAL PRIMARY KEY,
    track_code VARCHAR(2),
    race_num VARCHAR(2),
    horse_num VARCHAR(2),
    comment_date VARCHAR(8),
    comment_time VARCHAR(4),
    comment_code VARCHAR(2),
    trainer_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_trainer_comments_horse_num ON trainer_comments(horse_num);
CREATE INDEX idx_trainer_comments_comment_date ON trainer_comments(comment_date);
```

**レコード数**: 約501レコード/日

---

### 14. horse_columns (KAB: 馬柱データ)
```sql
CREATE TABLE IF NOT EXISTS horse_columns (
    id SERIAL PRIMARY KEY,
    track_code VARCHAR(2),
    race_num VARCHAR(2),
    race_date VARCHAR(8),
    horse_num VARCHAR(2),
    jockey_code VARCHAR(5),
    jockey_name VARCHAR(12),
    weight VARCHAR(3),
    odds VARCHAR(6),
    popularity VARCHAR(2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_horse_columns_horse_num ON horse_columns(horse_num);
CREATE INDEX idx_horse_columns_race_date ON horse_columns(race_date);
```

**レコード数**: 約3レコード/日

---

## データ量推定

### 2016-2025年 (10年分)
- **開催日数**: 1,043日
- **総レコード数**: 約7,590,000レコード
  - Layer 1: 約4,300,000レコード (57%)
  - Layer 2: 約2,610,000レコード (34%)
  - Layer 3: 約680,000レコード (9%)

### テーブル別推定
| テーブル | 1日あたり | 10年間合計 |
|---------|---------|-----------|
| races | 10 | 10,430 |
| race_results | 1,980 | 2,065,140 |
| horse_records | 36 | 37,548 |
| training_data | 501 | 522,543 |
| jockey_stats | 501 | 522,543 |
| horse_master | 501 | 522,543 |
| horse_performance | 501 | 522,543 |
| horse_details | 501 | 522,543 |
| odds_tansho_fukusho | 36 | 37,548 |
| odds_umaren | 36 | 37,548 |
| odds_wide | 36 | 37,548 |
| odds_sanrenpuku | 36 | 37,548 |
| trainer_comments | 501 | 522,543 |
| horse_columns | 3 | 3,129 |
| **合計** | **7,279** | **7,591,997** |

---

## インデックス戦略

### 高速検索用インデックス
1. **race_id**: レース結合の高速化
2. **horse_id**: 馬別データの高速検索
3. **race_date**: 日付範囲検索の高速化
4. **jockey_code**: 騎手別成績の高速検索
5. **trainer_code**: 調教師別成績の高速検索

### 複合インデックス (将来実装)
```sql
CREATE INDEX idx_races_date_track ON races(race_date, track_code);
CREATE INDEX idx_results_race_horse ON race_results(race_id, horse_num);
CREATE INDEX idx_performance_horse_date ON horse_performance(horse_id, race_date);
```

---

## データベース接続設定

### PostgreSQL 設定 (config/database.py)
```python
DATABASE_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'umayomi_db',
    'user': 'umayomi_user',
    'password': 'your_secure_password'
}
```

---

## 次のステップ

### Day 3: PostgreSQL インポート実装
1. ✅ 全14テーブルのCREATE文を実行
2. ⏳ 1,043日分のデータをバッチインポート
3. ⏳ インデックス作成と最適化
4. ⏳ データ整合性チェック

### Day 4-5: SQL生成エンジン
1. ファクター条件 → SQL変換
2. 14テーブル結合クエリ生成
3. 和文条件表示
4. 件数カウント機能

---

**作成日**: 2025-12-29  
**最終更新**: 2025-12-29
