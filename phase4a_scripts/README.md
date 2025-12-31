# UMAYOMI Phase 4A: PostgreSQL投入システム完全実装

## 📦 パッケージ内容

このディレクトリには、UMAYOMI Phase 4A の PostgreSQL 投入システムに必要な全8ファイルが含まれています。

### スクリプトファイル（5ファイル）

1. **sed_structure_analyzer.py** (5.9 KB)
   - SED（成績データ）の構造解析スクリプト
   - 実行: `python sed_structure_analyzer.py`

2. **tyb_structure_analyzer.py** (4.5 KB)
   - TYB（直前情報データ）の構造解析スクリプト
   - 実行: `python tyb_structure_analyzer.py`

3. **rca_structure_analyzer.py** (4.0 KB)
   - RCA（レース情報データ）の構造解析スクリプト
   - 実行: `python rca_structure_analyzer.py`

4. **create_tables.sql** (7.0 KB)
   - PostgreSQL テーブル作成 SQL
   - 実行: `psql -U postgres -d umayomi -f create_tables.sql`

5. **jrdb_db_insert.py** (14 KB)
   - データ投入メインスクリプト
   - 実行: `python jrdb_db_insert.py`

### ドキュメントファイル（3ファイル）

6. **execution_guide.md** (11 KB)
   - 実行手順書（日本語）
   - Phase 4A の完全な実行手順

7. **data_specification.md** (8.8 KB)
   - データ仕様書（日本語）
   - SED/TYB/RCA のフィールド定義

8. **phase4a_completion_summary.md** (7.7 KB)
   - Phase 4A 完了サマリー（日本語）

---

## 🚀 クイックスタート

### Step 1: ファイルをダウンロード

以下の2つの方法から選択してください：

#### **方法A: PowerShell で一括ダウンロード（最速・推奨）**

```powershell
# ディレクトリ作成
New-Item -ItemType Directory -Force -Path "E:\JRDB\scripts"
cd E:\JRDB\scripts

# 全ファイルをダウンロード
$baseUrl = "https://raw.githubusercontent.com/aka209859-max/umayomi/main/phase4a_scripts"
$files = @(
    "sed_structure_analyzer.py",
    "tyb_structure_analyzer.py",
    "rca_structure_analyzer.py",
    "create_tables.sql",
    "jrdb_db_insert.py",
    "execution_guide.md",
    "data_specification.md",
    "phase4a_completion_summary.md"
)

foreach ($file in $files) {
    $url = "$baseUrl/$file"
    Write-Host "Downloading: $file"
    Invoke-WebRequest -Uri $url -OutFile $file
}

Write-Host "✅ All files downloaded to E:\JRDB\scripts\"
```

#### **方法B: 個別ファイルをダウンロード**

以下のリンクを右クリック → 「名前を付けて保存」:

- [sed_structure_analyzer.py](https://raw.githubusercontent.com/aka209859-max/umayomi/main/phase4a_scripts/sed_structure_analyzer.py)
- [tyb_structure_analyzer.py](https://raw.githubusercontent.com/aka209859-max/umayomi/main/phase4a_scripts/tyb_structure_analyzer.py)
- [rca_structure_analyzer.py](https://raw.githubusercontent.com/aka209859-max/umayomi/main/phase4a_scripts/rca_structure_analyzer.py)
- [create_tables.sql](https://raw.githubusercontent.com/aka209859-max/umayomi/main/phase4a_scripts/create_tables.sql)
- [jrdb_db_insert.py](https://raw.githubusercontent.com/aka209859-max/umayomi/main/phase4a_scripts/jrdb_db_insert.py)

### Step 2: PostgreSQL セットアップ

```bash
# PostgreSQL に接続
psql -U postgres

# データベース作成
CREATE DATABASE umayomi ENCODING 'UTF8';

# 終了
\q
```

### Step 3: テーブル作成

```bash
psql -U postgres -d umayomi -f E:\JRDB\scripts\create_tables.sql
```

### Step 4: データ投入設定

```bash
# jrdb_db_insert.py を編集
notepad E:\JRDB\scripts\jrdb_db_insert.py
```

**以下の箇所を変更:**

```python
DB_CONFIG = {
    'host': 'localhost',
    'database': 'umayomi',
    'user': 'postgres',
    'password': 'YOUR_PASSWORD',  # ← 実際のパスワードに変更
    'port': 5432
}
```

### Step 5: データ投入実行

```bash
cd E:\JRDB\scripts
python jrdb_db_insert.py
```

---

## 📊 予想される結果

- **race_results**: 約30万件（SED 成績データ）
- **race_info**: 約10万件（TYB 直前情報）
- **蹄コード設定率**: 約75%
- **処理時間**: 約15-20分

---

## 🔗 リンク

- **GitHub リポジトリ**: https://github.com/aka209859-max/umayomi
- **Phase 4A スクリプト**: https://github.com/aka209859-max/umayomi/tree/main/phase4a_scripts

---

## 🆘 トラブルシューティング

### PostgreSQL 接続エラー

```bash
# PostgreSQL サービスが起動しているか確認
pg_ctl status

# 起動していない場合
pg_ctl start
```

### エンコーディングエラー

全ファイルは `shift_jis` エンコーディングを前提としています。ファイルが正しいエンコーディングであることを確認してください。

### ファイルが見つからない

```bash
# ディレクトリ構造を確認
tree E:\JRDB\unzipped_weekly\

# 必要なディレクトリ:
# E:\JRDB\unzipped_weekly\sed\
# E:\JRDB\unzipped_weekly\tyb\
```

---

## 📝 詳細ドキュメント

詳細な手順については、以下のファイルを参照してください：

- **execution_guide.md**: 完全な実行手順
- **data_specification.md**: データ仕様の詳細
- **phase4a_completion_summary.md**: Phase 4A 完了レポート

---

**作成日**: 2025年12月31日  
**プロジェクト**: UMAYOMI - 馬を読む。レースが変わる。  
**Phase**: 4A - PostgreSQL投入システム完全実装
