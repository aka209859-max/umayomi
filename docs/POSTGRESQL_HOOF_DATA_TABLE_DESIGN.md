# PostgreSQL hoof_data テーブル完全版設計

**作成日**: 2025-12-30  
**目的**: Shift_JIS版JRDBファイルから抽出した蹄データを格納するテーブル

---

## 📊 テーブル設計

### **hoof_data テーブル**

```sql
CREATE TABLE IF NOT EXISTS hoof_data (
    -- 主キー
    id SERIAL PRIMARY KEY,
    
    -- レース識別情報
    race_key VARCHAR(8) NOT NULL,           -- レースキー（例: 06251201）
    race_date DATE NOT NULL,                 -- レース日（例: 2025-01-06）
    venue_code VARCHAR(2) NOT NULL,          -- 場コード（例: 06=中山）
    race_num INTEGER NOT NULL,               -- レース番号（例: 12）
    
    -- 馬識別情報
    horse_num VARCHAR(2) NOT NULL,           -- 馬番（例: 01）
    horse_id VARCHAR(10),                    -- 馬ID（血統登録番号、例: 2210308320）
    horse_name VARCHAR(36),                  -- 馬名（例: ドウデュース）
    
    -- 蹄データ（KYI: 競走馬データ）
    kyi_hoof_code VARCHAR(2),                -- 蹄コード（2桁、例: 7, 11, -1）
    kyi_data_source VARCHAR(20) DEFAULT 'KYI', -- データソース識別
    
    -- 蹄データ（ZKB: 成績拡張データ）
    zkb_hoof_iron_code VARCHAR(3),           -- 蹄鉄コード（3桁、例: 090, 068）
    zkb_hoof_condition_code VARCHAR(3),      -- 蹄状態コード（3桁、例: 007, 010）
    zkb_data_source VARCHAR(20) DEFAULT 'ZKB', -- データソース識別
    
    -- メタデータ
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 複合ユニークキー（race_key + horse_num の組み合わせは一意）
    UNIQUE(race_key, horse_num)
);

-- インデックス作成
CREATE INDEX idx_hoof_data_race_key ON hoof_data(race_key);
CREATE INDEX idx_hoof_data_race_date ON hoof_data(race_date);
CREATE INDEX idx_hoof_data_horse_id ON hoof_data(horse_id);
CREATE INDEX idx_hoof_data_kyi_hoof_code ON hoof_data(kyi_hoof_code);
CREATE INDEX idx_hoof_data_zkb_hoof_iron ON hoof_data(zkb_hoof_iron_code);
CREATE INDEX idx_hoof_data_zkb_hoof_condition ON hoof_data(zkb_hoof_condition_code);
CREATE INDEX idx_hoof_data_created_at ON hoof_data(created_at);

-- コメント追加
COMMENT ON TABLE hoof_data IS 'JRDBデータから抽出した蹄データ（KYI + ZKB）';
COMMENT ON COLUMN hoof_data.race_key IS 'レースキー（場コード2桁 + 開催2桁 + 日2桁 + R2桁）';
COMMENT ON COLUMN hoof_data.kyi_hoof_code IS 'KYIファイルの蹄コード（163-165バイト目、2桁）';
COMMENT ON COLUMN hoof_data.zkb_hoof_iron_code IS 'ZKBファイルの蹄鉄コード（280-282バイト目、3桁）';
COMMENT ON COLUMN hoof_data.zkb_hoof_condition_code IS 'ZKBファイルの蹄状態コード（283-285バイト目、3桁）';
```

---

## 📋 フィールド詳細

### **主キー**
- `id`: 自動連番（SERIAL）

### **レース識別情報**
- `race_key`: 8桁の文字列（例: `06251201` = 中山・2回5日・12R）
  - 内訳: 場コード2桁 + 開催2桁 + 日2桁 + R2桁
- `race_date`: レース開催日（DATE型）
- `venue_code`: 場コード（2桁、例: `06`=中山、`05`=東京）
- `race_num`: レース番号（1-12）

### **馬識別情報**
- `horse_num`: 馬番（2桁、例: `01`, `02`）
- `horse_id`: 血統登録番号（10桁、例: `2210308320`）
- `horse_name`: 馬名（36文字まで、例: `ドウデュース`）

### **蹄データ（KYI）**
- `kyi_hoof_code`: 蹄コード（2桁）
  - 値の範囲: `-1`, `0-12`, `-` (空白)
  - バイト位置: 163-165バイト目（0起点では162-164）
  - 意味: 蹄の状態を示すコード（詳細はJRDBコード表参照）

### **蹄データ（ZKB）**
- `zkb_hoof_iron_code`: 蹄鉄コード（3桁）
  - 値の範囲: `000-999`
  - バイト位置: 280-282バイト目（0起点では279-281）
  - 意味: 蹄鉄の種類を示すコード
  
- `zkb_hoof_condition_code`: 蹄状態コード（3桁）
  - 値の範囲: `000-999`
  - バイト位置: 283-285バイト目（0起点では282-284）
  - 意味: 蹄の状態を示すコード

### **メタデータ**
- `created_at`: レコード作成日時
- `updated_at`: レコード更新日時

---

## 🔍 データ制約

### **ユニークキー**
```sql
UNIQUE(race_key, horse_num)
```
- 同じレースに同じ馬番は存在しない
- 重複データの挿入を防止

### **NOT NULL制約**
- `race_key`: 必須（レース識別に不可欠）
- `race_date`: 必須（日付検索に必要）
- `venue_code`: 必須（場所検索に必要）
- `race_num`: 必須（レース番号検索に必要）
- `horse_num`: 必須（馬識別に不可欠）

### **NULL許容**
- `horse_id`: 任意（データがない場合あり）
- `horse_name`: 任意（データがない場合あり）
- `kyi_hoof_code`: 任意（空白の場合あり）
- `zkb_hoof_iron_code`: 任意（空白の場合あり）
- `zkb_hoof_condition_code`: 任意（空白の場合あり）

---

## 📊 サンプルデータ

```sql
INSERT INTO hoof_data (
    race_key, race_date, venue_code, race_num,
    horse_num, horse_id, horse_name,
    kyi_hoof_code, zkb_hoof_iron_code, zkb_hoof_condition_code
) VALUES
    ('06251201', '2025-01-06', '06', 12, '01', '2210308320', 'ドウデュース', '7', '090', '007'),
    ('06251201', '2025-01-06', '06', 12, '02', '2210375822', 'イクイノックス', '11', '068', '010'),
    ('06251201', '2025-01-06', '06', 12, '03', '2210308320', 'ソダシ', '-1', '000', '000');
```

---

## 🔧 UPSERT（更新または挿入）

```sql
-- 既存データがある場合は更新、ない場合は挿入
INSERT INTO hoof_data (
    race_key, race_date, venue_code, race_num,
    horse_num, horse_id, horse_name,
    kyi_hoof_code, zkb_hoof_iron_code, zkb_hoof_condition_code
) VALUES
    ('06251201', '2025-01-06', '06', 12, '01', '2210308320', 'ドウデュース', '7', '090', '007')
ON CONFLICT (race_key, horse_num)
DO UPDATE SET
    horse_id = EXCLUDED.horse_id,
    horse_name = EXCLUDED.horse_name,
    kyi_hoof_code = EXCLUDED.kyi_hoof_code,
    zkb_hoof_iron_code = EXCLUDED.zkb_hoof_iron_code,
    zkb_hoof_condition_code = EXCLUDED.zkb_hoof_condition_code,
    updated_at = CURRENT_TIMESTAMP;
```

---

## 📈 データ分析クエリ例

### **蹄コード別の集計**
```sql
SELECT 
    kyi_hoof_code,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM hoof_data
WHERE kyi_hoof_code IS NOT NULL
GROUP BY kyi_hoof_code
ORDER BY count DESC;
```

### **蹄鉄コード別の集計**
```sql
SELECT 
    zkb_hoof_iron_code,
    COUNT(*) as count
FROM hoof_data
WHERE zkb_hoof_iron_code IS NOT NULL AND zkb_hoof_iron_code != '000'
GROUP BY zkb_hoof_iron_code
ORDER BY count DESC
LIMIT 20;
```

### **日付別のデータ件数**
```sql
SELECT 
    race_date,
    COUNT(*) as total_horses,
    COUNT(kyi_hoof_code) as kyi_data_count,
    COUNT(zkb_hoof_iron_code) as zkb_data_count
FROM hoof_data
GROUP BY race_date
ORDER BY race_date DESC
LIMIT 30;
```

### **NULL値の確認**
```sql
SELECT 
    COUNT(*) as total,
    COUNT(kyi_hoof_code) as kyi_not_null,
    COUNT(*) - COUNT(kyi_hoof_code) as kyi_null,
    COUNT(zkb_hoof_iron_code) as zkb_iron_not_null,
    COUNT(*) - COUNT(zkb_hoof_iron_code) as zkb_iron_null,
    COUNT(zkb_hoof_condition_code) as zkb_condition_not_null,
    COUNT(*) - COUNT(zkb_hoof_condition_code) as zkb_condition_null
FROM hoof_data;
```

---

## 🎯 パフォーマンス最適化

### **インデックス戦略**
1. `race_key`: レース単位の検索で頻繁に使用
2. `race_date`: 日付範囲検索で使用
3. `horse_id`: 馬の過去データ検索で使用
4. `kyi_hoof_code`: 蹄コード別の分析で使用
5. `zkb_hoof_iron_code`: 蹄鉄コード別の分析で使用
6. `zkb_hoof_condition_code`: 蹄状態コード別の分析で使用

### **パーティショニング（将来の拡張）**
```sql
-- 年月単位でのパーティショニング（データ量が増えた場合）
CREATE TABLE hoof_data_2025_01 PARTITION OF hoof_data
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE hoof_data_2025_02 PARTITION OF hoof_data
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
```

---

## 📋 データ検証ルール

### **必須チェック**
1. ✅ `race_key` が8桁の数値文字列
2. ✅ `race_date` が妥当な日付
3. ✅ `horse_num` が01-18の範囲内
4. ✅ `kyi_hoof_code` が-1, 0-12, `-` のいずれか
5. ✅ `zkb_hoof_iron_code` が000-999の範囲内
6. ✅ `zkb_hoof_condition_code` が000-999の範囲内

### **任意チェック**
1. ⚠️ `horse_id` が10桁の数値文字列（推奨）
2. ⚠️ `horse_name` が日本語文字列（推奨）

---

**UMAYOMI - 馬を読む。レースが変わる。**
