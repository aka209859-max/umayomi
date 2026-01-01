# 🚀 UMAYOMI Phase 4A: PostgreSQL投入 実行手順書

---

## 📋 目次

1. [事前準備](#事前準備)
2. [Step 1: データ構造解析](#step-1-データ構造解析)
3. [Step 2: PostgreSQL テーブル作成](#step-2-postgresql-テーブル作成)
4. [Step 3: データ投入実行](#step-3-データ投入実行)
5. [Step 4: 結果確認](#step-4-結果確認)
6. [トラブルシューティング](#トラブルシューティング)

---

## 事前準備

### ✅ 必要なソフトウェア

1. **PostgreSQL 14以降**
   - ダウンロード: https://www.postgresql.org/download/windows/
   - インストール時に設定したパスワードをメモしてください

2. **Python 3.8以降**
   - 確認: `python --version`

3. **psycopg2 ライブラリ**
   ```powershell
   pip install psycopg2-binary
   ```

### ✅ データ配置確認

以下のディレクトリにデータが配置されていることを確認：

```
E:\JRDB\unzipped_weekly\
├── sed\          (1,537ファイル)
│   ├── SED160109.txt
│   ├── RCA160109.csv
│   └── ...
└── tyb\          (513ファイル)
    ├── TYB160109.txt
    └── ...
```

確認コマンド:
```powershell
Get-ChildItem "E:\JRDB\unzipped_weekly\sed" -Filter "SED*.txt" | Measure-Object | Select-Object Count
Get-ChildItem "E:\JRDB\unzipped_weekly\tyb" -Filter "TYB*.txt" | Measure-Object | Select-Object Count
```

### ✅ スクリプトダウンロード

以下のスクリプトを `E:\JRDB\scripts\` に配置：

1. `sed_structure_analyzer.py` - SED構造解析
2. `tyb_structure_analyzer.py` - TYB構造解析
3. `rca_structure_analyzer.py` - RCA構造解析
4. `create_tables.sql` - テーブル作成SQL
5. `jrdb_db_insert.py` - データ投入スクリプト

配置コマンド:
```powershell
New-Item -ItemType Directory -Force -Path "E:\JRDB\scripts"
# 各スクリプトを E:\JRDB\scripts\ にコピー
```

---

## Step 1: データ構造解析

### 1-1. SED 構造解析

```powershell
cd E:\JRDB\scripts
python sed_structure_analyzer.py
```

**期待される出力**:
```
================================================================================
🔍 SED（成績データ）構造解析開始
================================================================================
📄 サンプルファイル: E:\JRDB\unzipped_weekly\sed\SED160109.txt
✅ 総行数: 200
✅ 1行の長さ: 750 バイト

================================================================================
📊 重要フィールドの抽出（最初の3行）
================================================================================

--- レコード 1 ---
レースキー (1-8): '16010101'
馬番 (9-10): '01'
血統登録番号 (11-18): '12345678'
🐴 蹄コード (267-270): '南田'

...

✅ 蹄コード設定済み: 150 / 200 (75.0%)
🐴 蹄コード頻度トップ10:
  '南田': 20回
  '伊藤': 15回
  ...

✅ 解析結果を保存: E:\JRDB\sed_structure_analysis.txt
✅ SED 構造解析完了
```

### 1-2. TYB 構造解析

```powershell
python tyb_structure_analyzer.py
```

### 1-3. RCA 構造解析（オプション）

```powershell
python rca_structure_analyzer.py
```

---

## Step 2: PostgreSQL テーブル作成

### 2-1. PostgreSQL 起動確認

```powershell
# Windows サービス確認
Get-Service -Name postgresql*

# 起動していない場合
Start-Service -Name "postgresql-x64-14"  # バージョンに応じて変更
```

### 2-2. データベース作成

```powershell
# psql で接続（パスワード入力）
psql -U postgres
```

```sql
-- データベース作成
CREATE DATABASE umayomi ENCODING 'UTF8';

-- 確認
\l

-- 終了
\q
```

### 2-3. テーブル作成

```powershell
# SQL ファイルを実行
psql -U postgres -d umayomi -f E:\JRDB\scripts\create_tables.sql
```

**期待される出力**:
```
CREATE TABLE
CREATE INDEX
CREATE TABLE
CREATE INDEX
CREATE TABLE
CREATE INDEX

✅ テーブル作成完了
📊 作成されたテーブル:
  1. race_results (SED 成績データ)
  2. race_info (TYB 直前情報)
  3. hoof_data (蹄コード・指数統合マスター)
```

### 2-4. テーブル確認

```powershell
psql -U postgres -d umayomi
```

```sql
-- テーブル一覧
\dt

-- テーブル構造確認
\d race_results
\d race_info
\d hoof_data

-- 終了
\q
```

---

## Step 3: データ投入実行

### 3-1. 接続設定の編集

`E:\JRDB\scripts\jrdb_db_insert.py` を編集：

```python
# PostgreSQL 接続設定
DB_CONFIG = {
    'host': 'localhost',
    'database': 'umayomi',
    'user': 'postgres',
    'password': 'YOUR_PASSWORD',  # ← あなたのパスワードに変更
    'port': 5432
}
```

### 3-2. データ投入実行

```powershell
cd E:\JRDB\scripts
python jrdb_db_insert.py
```

**期待される出力**:
```
================================================================================
🚀 UMAYOMI Phase 4A: PostgreSQL データ投入開始
================================================================================
開始時刻: 2025-12-31 20:00:00
SED ディレクトリ: E:\JRDB\unzipped_weekly\sed
TYB ディレクトリ: E:\JRDB\unzipped_weekly\tyb
ログファイル: E:\JRDB\db_insert.log
================================================================================
📡 PostgreSQL 接続中...
✅ PostgreSQL 接続成功
================================================================================
📊 SED データ投入開始
================================================================================
✅ SED ファイル数: 1,537
進捗: 10 / 1,537 ファイル処理完了 | 投入: 2,000 件
進捗: 20 / 1,537 ファイル処理完了 | 投入: 4,000 件
...
進捗: 1,537 / 1,537 ファイル処理完了 | 投入: 307,400 件
================================================================================
✅ SED データ投入完了
📊 投入件数: 307,400
📊 エラー件数: 0
🐴 蹄コード設定済み: 230,550
🐴 蹄コード頻度トップ10:
  '南田': 5,000回
  '伊藤': 4,500回
  ...
================================================================================
📊 TYB データ投入開始
================================================================================
✅ TYB ファイル数: 513
進捗: 10 / 513 ファイル処理完了 | 投入: 2,000 件
...
進捗: 513 / 513 ファイル処理完了 | 投入: 102,600 件
================================================================================
✅ TYB データ投入完了
📊 投入件数: 102,600
📊 エラー件数: 0
================================================================================
🎉 PostgreSQL データ投入完了
================================================================================
終了時刻: 2025-12-31 20:15:00
処理時間: 900.0秒
SED 投入件数: 307,400
TYB 投入件数: 102,600
合計投入件数: 410,000
================================================================================
✅ PostgreSQL 接続終了
```

### 3-3. ログ確認

```powershell
# ログファイルを確認
Get-Content "E:\JRDB\db_insert.log" -Tail 50
```

---

## Step 4: 結果確認

### 4-1. レコード数確認

```powershell
psql -U postgres -d umayomi
```

```sql
-- 各テーブルのレコード数
SELECT 'race_results' AS table_name, COUNT(*) AS count FROM race_results
UNION ALL
SELECT 'race_info', COUNT(*) FROM race_info
UNION ALL
SELECT 'hoof_data', COUNT(*) FROM hoof_data;

-- 蹄コード統計
SELECT 
    hoof_code,
    COUNT(*) AS count
FROM race_results
WHERE hoof_code IS NOT NULL
GROUP BY hoof_code
ORDER BY count DESC
LIMIT 10;

-- 期間確認
SELECT 
    MIN(race_key) AS min_race_key,
    MAX(race_key) AS max_race_key
FROM race_results;
```

### 4-2. サンプルデータ確認

```sql
-- SED データサンプル
SELECT * FROM race_results LIMIT 10;

-- TYB データサンプル
SELECT * FROM race_info LIMIT 10;

-- 蹄コードが設定されているレコード
SELECT * FROM race_results WHERE hoof_code IS NOT NULL LIMIT 10;
```

---

## トラブルシューティング

### ❌ エラー: PostgreSQL 接続エラー

**原因**: パスワード間違い、PostgreSQL 未起動

**解決策**:
```powershell
# サービス確認
Get-Service -Name postgresql*

# 起動
Start-Service -Name "postgresql-x64-14"

# パスワード確認
psql -U postgres -d postgres
```

### ❌ エラー: ディレクトリが見つかりません

**原因**: データ配置パスが間違っている

**解決策**:
```powershell
# 実際のパスを確認
Get-ChildItem "E:\JRDB\unzipped_weekly"

# スクリプト内のパスを修正
# SED_DIR = r"実際のパス\sed"
# TYB_DIR = r"実際のパス\tyb"
```

### ❌ エラー: psycopg2 が見つかりません

**原因**: psycopg2 未インストール

**解決策**:
```powershell
pip install psycopg2-binary
```

### ❌ エラー: テーブルが存在しません

**原因**: create_tables.sql 未実行

**解決策**:
```powershell
psql -U postgres -d umayomi -f E:\JRDB\scripts\create_tables.sql
```

### ❌ エラー: 文字化け

**原因**: エンコーディング設定ミス

**解決策**:
- スクリプト内で `encoding='shift_jis'` を確認
- データベースエンコーディングが UTF8 であることを確認

---

## 📊 完了チェックリスト

- [ ] PostgreSQL インストール済み
- [ ] データベース `umayomi` 作成済み
- [ ] テーブル 3つ作成済み（race_results, race_info, hoof_data）
- [ ] SED データ投入完了（約30万件）
- [ ] TYB データ投入完了（約10万件）
- [ ] ログファイル確認済み
- [ ] レコード数確認済み
- [ ] 蹄コード統計確認済み

---

## 🎯 次のステップ

Phase 4A 完了後、以下を実行：

1. **Phase 4B: KYI データ統合**
   - KYI250601.txt から予測指数を抽出
   - `hoof_data` テーブルへ統合

2. **Phase 5: ファクター作成システム**
   - 蹄コード × 着順の相関分析
   - 激走指数 × 蹄コードの重回帰分析

3. **Phase 6: 予測モデル構築**
   - LightGBM による勝率予測モデル
   - 蹄コードファクターの重要度評価

---

**Enable Mindset**: データ投入完了。次は分析フェーズへ突入！
