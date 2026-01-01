# UMAYOMI Phase 4A: JRDBデータ統合実装プロンプト

## 🎯 実装目的
競馬予測システム「UMAYOMI」のデータ基盤を構築する。CEOのローカル環境に既に存在するJRDBデータ（18,974ファイル、3.87GB、2014-2025年）をPostgreSQLへ投入し、ファクター作成システムの材料庫を完成させる。

---

## 📂 データの場所（完全特定済み）

### データパス
```
C:\JRDB\unzipped\
```

### ファイル構成
- **KYI*.txt**: 1,265ファイル（馬データ、蹄コード 164-165バイト目）
- **ZKB*.txt**: 1,265ファイル（成績拡張、蹄鉄 280-282バイト目、蹄状態 283-285バイト目）
- **CYB*.txt**: 1,265ファイル（調教データ）
- **ZED*.txt**: 1,265ファイル（レース基本情報）
- **BAC*.txt**: 1,265ファイル（馬基本情報）
- **CHA*.txt**: 1,265ファイル（調教師データ）
- **JOA*.txt**: 1,265ファイル（騎手データ）
- **KAB*.txt**: 1,265ファイル（開催場情報）
- **KKA*.txt**: 1,265ファイル（馬基本情報）
- **UKC*.txt**: 1,265ファイル（馬成績）
- **OT1*.txt / OT2*.txt**: 1,265ファイル（単勝オッズ）
- **OU1*.txt / OU2*.txt**: 1,265ファイル（複勝オッズ）
- **OW1*.txt / OW2*.txt**: 1,265ファイル（ワイドオッズ）
- **OZ1*.txt / OZ2*.txt**: 1,265ファイル（馬連オッズ）

**合計**: 18,974ファイル（3.87GB）  
**期間**: 2014-01-05 ～ 2025-08-24（11年8ヶ月）

### ファイル名規則
```
形式: [TYPE][YYMMDD].txt

例:
- KYI140105.txt → 2014年01月05日のKYIデータ
- ZKB250824.txt → 2025年08月24日のZKBデータ

YY: 年（西暦下2桁）
MM: 月（01-12）
DD: 日（01-31）
```

### エンコーディング
- **Shift_JIS（CP932）**
- 固定長フォーマット
- 行末: CR+LF（2バイト）

---

## 📋 実装タスク

### Phase 4A-1: データパス検証とファイルリスト作成 ✅

**状態**: 完了（PowerShell調査済み）

**結果**:
- ✅ C:\JRDB\unzipped\ にデータ存在確認
- ✅ 18,974ファイル確認
- ✅ KYI蹄コード抽出検証（164-165バイト目）
- ✅ 最古ファイル: BAC140105.txt (2014-01-05)
- ✅ 最新ファイル: ZKB250824.txt (2025-08-24)

---

### Phase 4A-2: KYI蹄コード抽出スクリプト作成

**目的**: 全1,265件のKYIファイルから蹄コードを抽出

**入力**:
```
C:\JRDB\unzipped\KYI*.txt（1,265ファイル）
```

**処理**:
```python
import os
import json
from datetime import datetime

def parse_kyi_hoof_code(file_path):
    """
    KYIファイルから蹄コードを抽出
    
    仕様:
    - エンコーディング: Shift_JIS
    - 固定長: 1024バイト/レコード
    - 蹄コード位置: 164-165バイト目（0起点: 163-164）
    """
    results = []
    
    with open(file_path, 'r', encoding='shift_jis', errors='ignore') as f:
        for line_num, line in enumerate(f, 1):
            try:
                # Shift_JISバイト列として処理
                line_bytes = line.encode('shift_jis')
                
                # レースキー（1-8バイト目）
                race_key = line_bytes[0:8].decode('shift_jis').strip()
                
                # 馬番（9-10バイト目）
                horse_number = line_bytes[8:10].decode('shift_jis').strip()
                
                # 蹄コード（164-165バイト目、0起点: 163-164）
                hoof_code = line_bytes[163:165].decode('shift_jis').strip()
                
                # 空白やNULL値をスキップ
                if hoof_code and hoof_code != '  ':
                    results.append({
                        'race_key': race_key,
                        'horse_number': int(horse_number) if horse_number.isdigit() else None,
                        'hoof_code': hoof_code,
                        'line_number': line_num
                    })
                    
            except Exception as e:
                print(f"警告: {file_path} 行{line_num}: {str(e)}")
                continue
    
    return results

def batch_process_kyi(data_dir, output_file):
    """
    全KYIファイルを一括処理
    """
    import glob
    
    all_results = []
    file_pattern = os.path.join(data_dir, 'KYI*.txt')
    kyi_files = sorted(glob.glob(file_pattern))
    
    print(f"KYIファイル数: {len(kyi_files)}")
    
    for i, kyi_file in enumerate(kyi_files, 1):
        # ファイル名から日付を抽出（例: KYI140105.txt → 2014-01-05）
        filename = os.path.basename(kyi_file)
        date_str = filename[3:9]  # YYMMDD
        year = int('20' + date_str[0:2])
        month = int(date_str[2:4])
        day = int(date_str[4:6])
        file_date = f"{year:04d}-{month:02d}-{day:02d}"
        
        print(f"[{i}/{len(kyi_files)}] 処理中: {filename} ({file_date})")
        
        # 蹄コード抽出
        records = parse_kyi_hoof_code(kyi_file)
        
        # ファイル日付を追加
        for record in records:
            record['file_date'] = file_date
            record['source_file'] = filename
        
        all_results.extend(records)
        
        # 進捗表示（100ファイルごと）
        if i % 100 == 0:
            print(f"  → 進捗: {i}/{len(kyi_files)} ({i/len(kyi_files)*100:.1f}%)")
            print(f"  → 累計レコード数: {len(all_results):,}")
    
    # JSON保存
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ 完了: {len(all_results):,}件のレコードを {output_file} に保存")
    
    # サマリー
    print("\n📊 サマリー:")
    print(f"  - 処理ファイル数: {len(kyi_files)}")
    print(f"  - 抽出レコード数: {len(all_results):,}")
    print(f"  - 期間: {min(r['file_date'] for r in all_results)} ～ {max(r['file_date'] for r in all_results)}")
    
    return all_results

# 実行
if __name__ == '__main__':
    data_dir = r'C:\JRDB\unzipped'
    output_file = 'kyi_hoof_data_all.json'
    
    results = batch_process_kyi(data_dir, output_file)
```

**出力**:
```json
[
  {
    "race_key": "06140105",
    "horse_number": 1,
    "hoof_code": "18",
    "line_number": 1,
    "file_date": "2014-01-05",
    "source_file": "KYI140105.txt"
  },
  ...
]
```

**想定レコード数**: 約400,000～500,000件（1,265ファイル × 平均350レコード/ファイル）

---

### Phase 4A-3: ZKB蹄データ抽出スクリプト作成

**目的**: 全1,265件のZKBファイルから蹄鉄・蹄状態コードを抽出

**入力**:
```
C:\JRDB\unzipped\ZKB*.txt（1,265ファイル）
```

**処理**:
```python
def parse_zkb_hoof_data(file_path):
    """
    ZKBファイルから蹄鉄・蹄状態コードを抽出
    
    仕様:
    - エンコーディング: Shift_JIS
    - 固定長: 304バイト/レコード
    - 蹄鉄コード: 280-282バイト目（0起点: 279-281）
    - 蹄状態コード: 283-285バイト目（0起点: 282-284）
    """
    results = []
    
    with open(file_path, 'r', encoding='shift_jis', errors='ignore') as f:
        for line_num, line in enumerate(f, 1):
            try:
                line_bytes = line.encode('shift_jis')
                
                # レースキー（1-8バイト目）
                race_key = line_bytes[0:8].decode('shift_jis').strip()
                
                # 馬番（9-10バイト目）
                horse_number = line_bytes[8:10].decode('shift_jis').strip()
                
                # 蹄鉄コード（280-282バイト目、0起点: 279-281）
                hoof_iron_code = line_bytes[279:282].decode('shift_jis').strip()
                
                # 蹄状態コード（283-285バイト目、0起点: 282-284）
                hoof_condition_code = line_bytes[282:285].decode('shift_jis').strip()
                
                # 空白やNULL値をスキップ
                if hoof_iron_code or hoof_condition_code:
                    results.append({
                        'race_key': race_key,
                        'horse_number': int(horse_number) if horse_number.isdigit() else None,
                        'hoof_iron_code': hoof_iron_code if hoof_iron_code else None,
                        'hoof_condition_code': hoof_condition_code if hoof_condition_code else None,
                        'line_number': line_num
                    })
                    
            except Exception as e:
                print(f"警告: {file_path} 行{line_num}: {str(e)}")
                continue
    
    return results

def batch_process_zkb(data_dir, output_file):
    """
    全ZKBファイルを一括処理
    """
    import glob
    
    all_results = []
    file_pattern = os.path.join(data_dir, 'ZKB*.txt')
    zkb_files = sorted(glob.glob(file_pattern))
    
    print(f"ZKBファイル数: {len(zkb_files)}")
    
    for i, zkb_file in enumerate(zkb_files, 1):
        # ファイル名から日付を抽出
        filename = os.path.basename(zkb_file)
        date_str = filename[3:9]
        year = int('20' + date_str[0:2])
        month = int(date_str[2:4])
        day = int(date_str[4:6])
        file_date = f"{year:04d}-{month:02d}-{day:02d}"
        
        print(f"[{i}/{len(zkb_files)}] 処理中: {filename} ({file_date})")
        
        records = parse_zkb_hoof_data(zkb_file)
        
        for record in records:
            record['file_date'] = file_date
            record['source_file'] = filename
        
        all_results.extend(records)
        
        if i % 100 == 0:
            print(f"  → 進捗: {i}/{len(zkb_files)} ({i/len(zkb_files)*100:.1f}%)")
            print(f"  → 累計レコード数: {len(all_results):,}")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ 完了: {len(all_results):,}件のレコードを {output_file} に保存")
    
    print("\n📊 サマリー:")
    print(f"  - 処理ファイル数: {len(zkb_files)}")
    print(f"  - 抽出レコード数: {len(all_results):,}")
    print(f"  - 期間: {min(r['file_date'] for r in all_results)} ～ {max(r['file_date'] for r in all_results)}")
    
    return all_results

# 実行
if __name__ == '__main__':
    data_dir = r'C:\JRDB\unzipped'
    output_file = 'zkb_hoof_data_all.json'
    
    results = batch_process_zkb(data_dir, output_file)
```

**想定レコード数**: 約400,000～500,000件

---

### Phase 4A-4: 全14種類ファイルのパーサー作成

**優先度**: 中（Phase 5で実装）

**対象ファイル**:
1. KYI（馬データ）← Phase 4A-2で実装
2. ZKB（成績拡張）← Phase 4A-3で実装
3. CYB（調教データ）
4. ZED（レース基本情報）
5. BAC（馬基本情報）
6. CHA（調教師データ）
7. JOA（騎手データ）
8. KAB（開催場情報）
9. KKA（馬基本情報）
10. UKC（馬成績）
11. OT（単勝オッズ）
12. OU（複勝オッズ）
13. OW（ワイドオッズ）
14. OZ（馬連オッズ）

---

### Phase 4A-5: PostgreSQL全テーブル設計

**hoof_data テーブル（既に設計済み）**:
```sql
CREATE TABLE hoof_data (
    id SERIAL PRIMARY KEY,
    race_key VARCHAR(16) NOT NULL,
    horse_number INTEGER NOT NULL,
    kyi_hoof_code VARCHAR(2),
    zkb_hoof_iron_code VARCHAR(3),
    zkb_hoof_condition_code VARCHAR(3),
    data_source VARCHAR(10) NOT NULL,
    file_date DATE NOT NULL,
    source_file VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_hoof_data UNIQUE (race_key, horse_number, file_date)
);

CREATE INDEX idx_hoof_data_race_key ON hoof_data(race_key);
CREATE INDEX idx_hoof_data_file_date ON hoof_data(file_date);
```

**他のテーブル**（Phase 5で設計）:
- kyi_data（252フィールド）
- zkb_data
- cyb_data
- zed_data
- bac_data
- cha_data
- joa_data
- kab_data
- kka_data
- ukc_data
- odds_data（OT/OU/OW/OZ統合）

---

### Phase 4A-6: バッチ投入スクリプト作成

**目的**: JSON → PostgreSQL 一括投入

```python
import pandas as pd
from sqlalchemy import create_engine
import json

def import_hoof_data_to_postgres(kyi_json, zkb_json, db_url):
    """
    KYI + ZKB の蹄データをPostgreSQLに投入
    """
    # JSONを読み込み
    with open(kyi_json, 'r', encoding='utf-8') as f:
        kyi_data = json.load(f)
    
    with open(zkb_json, 'r', encoding='utf-8') as f:
        zkb_data = json.load(f)
    
    print(f"KYIレコード数: {len(kyi_data):,}")
    print(f"ZKBレコード数: {len(zkb_data):,}")
    
    # DataFrameに変換
    df_kyi = pd.DataFrame(kyi_data)
    df_zkb = pd.DataFrame(zkb_data)
    
    # KYI: data_source追加
    df_kyi['data_source'] = 'KYI'
    df_kyi = df_kyi.rename(columns={'hoof_code': 'kyi_hoof_code'})
    
    # ZKB: data_source追加
    df_zkb['data_source'] = 'ZKB'
    
    # マージ（FULL OUTER JOIN）
    df_merged = pd.merge(
        df_kyi[['race_key', 'horse_number', 'kyi_hoof_code', 'file_date', 'source_file']],
        df_zkb[['race_key', 'horse_number', 'hoof_iron_code', 'hoof_condition_code']],
        on=['race_key', 'horse_number'],
        how='outer'
    )
    
    # data_source決定（両方ある場合は'BOTH'）
    df_merged['data_source'] = 'BOTH'
    df_merged.loc[df_merged['kyi_hoof_code'].isna(), 'data_source'] = 'ZKB'
    df_merged.loc[df_merged['hoof_iron_code'].isna(), 'data_source'] = 'KYI'
    
    print(f"\nマージ後レコード数: {len(df_merged):,}")
    print(f"KYIのみ: {len(df_merged[df_merged['data_source']=='KYI']):,}")
    print(f"ZKBのみ: {len(df_merged[df_merged['data_source']=='ZKB']):,}")
    print(f"両方: {len(df_merged[df_merged['data_source']=='BOTH']):,}")
    
    # PostgreSQLに投入
    engine = create_engine(db_url)
    
    print("\nPostgreSQLに投入中...")
    df_merged.to_sql('hoof_data', engine, if_exists='append', index=False, method='multi', chunksize=10000)
    
    print("✅ 完了！")
    
    # 検証クエリ
    print("\n📊 データ検証:")
    with engine.connect() as conn:
        result = conn.execute("""
            SELECT 
                COUNT(*) as total_records,
                COUNT(DISTINCT race_key) as total_races,
                COUNT(DISTINCT file_date) as total_days,
                MIN(file_date) as earliest_date,
                MAX(file_date) as latest_date
            FROM hoof_data
        """)
        row = result.fetchone()
        print(f"  - 総レコード数: {row[0]:,}")
        print(f"  - レース数: {row[1]:,}")
        print(f"  - 日数: {row[2]:,}")
        print(f"  - 期間: {row[3]} ～ {row[4]}")

# 実行
if __name__ == '__main__':
    kyi_json = 'kyi_hoof_data_all.json'
    zkb_json = 'zkb_hoof_data_all.json'
    db_url = 'postgresql://user:password@localhost:5432/umayomi'
    
    import_hoof_data_to_postgres(kyi_json, zkb_json, db_url)
```

---

### Phase 4A-7: データ検証とレポート作成

**検証SQL**:
```sql
-- 基本統計
SELECT 
    COUNT(*) as total_records,
    COUNT(DISTINCT race_key) as total_races,
    COUNT(DISTINCT file_date) as total_days,
    MIN(file_date) as earliest_date,
    MAX(file_date) as latest_date,
    COUNT(kyi_hoof_code) as kyi_records,
    COUNT(zkb_hoof_iron_code) as zkb_records
FROM hoof_data;

-- 蹄コード分布（KYI）
SELECT 
    kyi_hoof_code,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM hoof_data
WHERE kyi_hoof_code IS NOT NULL
GROUP BY kyi_hoof_code
ORDER BY count DESC
LIMIT 20;

-- 年度別レコード数
SELECT 
    EXTRACT(YEAR FROM file_date) as year,
    COUNT(*) as record_count,
    COUNT(DISTINCT race_key) as race_count
FROM hoof_data
GROUP BY EXTRACT(YEAR FROM file_date)
ORDER BY year;

-- NULL値分析
SELECT 
    'kyi_hoof_code' as field,
    COUNT(*) - COUNT(kyi_hoof_code) as null_count,
    ROUND((COUNT(*) - COUNT(kyi_hoof_code)) * 100.0 / COUNT(*), 2) as null_rate
FROM hoof_data
UNION ALL
SELECT 
    'zkb_hoof_iron_code' as field,
    COUNT(*) - COUNT(zkb_hoof_iron_code) as null_count,
    ROUND((COUNT(*) - COUNT(zkb_hoof_iron_code)) * 100.0 / COUNT(*), 2) as null_rate
FROM hoof_data;
```

---

## 📊 予想される成果物

### データ量
- **総レコード数**: 約400,000～500,000件
- **期間**: 2014-01-05 ～ 2025-08-24（11年8ヶ月）
- **レース数**: 約50,000レース
- **日数**: 約1,265日

### ファイル
1. `kyi_hoof_data_all.json` - KYI蹄コード（約450,000レコード）
2. `zkb_hoof_data_all.json` - ZKB蹄データ（約450,000レコード）
3. PostgreSQL `hoof_data` テーブル（約500,000レコード）

---

## ⏱️ 予想所要時間

| タスク | 所要時間 | 担当 |
|--------|---------|------|
| Phase 4A-2: KYI蹄コード抽出 | 15-20分 | Python |
| Phase 4A-3: ZKB蹄データ抽出 | 15-20分 | Python |
| Phase 4A-6: PostgreSQL投入 | 10-15分 | Python |
| Phase 4A-7: データ検証 | 5分 | SQL |
| **合計** | **45-60分** | - |

---

## 🎯 次のステップ（Phase 5）

**Phase 5: 全14種類ファイルの完全取り込み**

1. 残り12種類のファイルパーサー作成
2. 252フィールドの完全PostgreSQL格納
3. データ関連付け（レースキーでJOIN）
4. ファクター作成UI実装準備

---

**UMAYOMI - 馬を読む。レースが変わる。**

このプロンプトを使用して、Phase 4A（JRDBデータ統合実装）を実行してください。

---

**実行環境**:
- Windows 11 (CEOのローカル環境)
- Python 3.x
- PostgreSQL 13+
- pandas, SQLAlchemy

**データソース**:
- `C:\JRDB\unzipped\`
- 18,974ファイル
- 3.87 GB
- Shift_JIS エンコーディング

**目標**:
- 蹄データ（KYI + ZKB）を PostgreSQL に完全格納
- 約500,000レコード
- 11年8ヶ月のデータ
