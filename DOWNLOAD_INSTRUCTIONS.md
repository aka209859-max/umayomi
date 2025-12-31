# 🚀 UMAYOMI Phase 4A: ダウンロード完全ガイド

---

## ✅ 最も簡単な方法: PowerShell で一括ダウンロード（推奨）

以下のコマンドを **PowerShell** にコピペして実行してください：

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

Write-Host "`n✅ All files downloaded to E:\JRDB\scripts\`n"
Write-Host "Next steps:"
Write-Host "1. Create PostgreSQL database: psql -U postgres -c 'CREATE DATABASE umayomi ENCODING UTF8;'"
Write-Host "2. Create tables: psql -U postgres -d umayomi -f E:\JRDB\scripts\create_tables.sql"
Write-Host "3. Edit jrdb_db_insert.py and set your PostgreSQL password"
Write-Host "4. Run: python E:\JRDB\scripts\jrdb_db_insert.py"
```

**実行時間**: 約30秒

---

## 📂 個別ファイルダウンロード

以下のリンクを **右クリック → 名前を付けて保存** して、`E:\JRDB\scripts\` に保存してください：

### スクリプトファイル（5ファイル）

1. **sed_structure_analyzer.py** (5.9 KB)  
   https://raw.githubusercontent.com/aka209859-max/umayomi/main/phase4a_scripts/sed_structure_analyzer.py

2. **tyb_structure_analyzer.py** (4.5 KB)  
   https://raw.githubusercontent.com/aka209859-max/umayomi/main/phase4a_scripts/tyb_structure_analyzer.py

3. **rca_structure_analyzer.py** (4.0 KB)  
   https://raw.githubusercontent.com/aka209859-max/umayomi/main/phase4a_scripts/rca_structure_analyzer.py

4. **create_tables.sql** (7.0 KB)  
   https://raw.githubusercontent.com/aka209859-max/umayomi/main/phase4a_scripts/create_tables.sql

5. **jrdb_db_insert.py** (14 KB)  
   https://raw.githubusercontent.com/aka209859-max/umayomi/main/phase4a_scripts/jrdb_db_insert.py

### ドキュメントファイル（3ファイル）

6. **execution_guide.md** (11 KB)  
   https://raw.githubusercontent.com/aka209859-max/umayomi/main/phase4a_scripts/execution_guide.md

7. **data_specification.md** (8.8 KB)  
   https://raw.githubusercontent.com/aka209859-max/umayomi/main/phase4a_scripts/data_specification.md

8. **phase4a_completion_summary.md** (7.7 KB)  
   https://raw.githubusercontent.com/aka209859-max/umayomi/main/phase4a_scripts/phase4a_completion_summary.md

---

## 🔗 GitHub で直接閲覧

すべてのファイルは以下のリポジトリで閲覧できます：

**GitHub リポジトリ**: https://github.com/aka209859-max/umayomi  
**Phase 4A スクリプト**: https://github.com/aka209859-max/umayomi/tree/main/phase4a_scripts

---

## 🚀 クイックスタート（ダウンロード後）

### Step 1: PostgreSQL セットアップ

```bash
psql -U postgres -c "CREATE DATABASE umayomi ENCODING 'UTF8';"
```

### Step 2: テーブル作成

```bash
psql -U postgres -d umayomi -f E:\JRDB\scripts\create_tables.sql
```

### Step 3: データ投入設定

```bash
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

### Step 4: データ投入実行

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

## 🆘 トラブルシューティング

### ダウンロードエラー

```powershell
# PowerShell の実行ポリシーを一時的に変更
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
```

### PostgreSQL 接続エラー

```bash
# PostgreSQL サービスが起動しているか確認
pg_ctl status

# 起動していない場合
pg_ctl start
```

### ファイルが見つからない

```bash
# ディレクトリ構造を確認
tree E:\JRDB\unzipped_weekly\

# 必要なディレクトリ:
# E:\JRDB\unzipped_weekly\sed\
# E:\JRDB\unzipped_weekly\tyb\
```

---

**作成日**: 2025年12月31日  
**プロジェクト**: UMAYOMI - 馬を読む。レースが変わる。  
**Phase**: 4A - PostgreSQL投入システム完全実装
