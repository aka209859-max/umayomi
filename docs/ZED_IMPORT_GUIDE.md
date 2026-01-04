# 📥 JRDB ZED データ取り込みガイド

## 🎯 概要

このドキュメントは、JRDB ZEDファイル（馬別レース成績データ）を期間指定で取り込む方法を説明します。

---

## 🚀 簡単実行（推奨）

### **方法1: PowerShellスクリプト（Windows）**

```powershell
# 1. プロジェクトディレクトリに移動
cd E:\path\to\webapp

# 2. スクリプト実行
.\scripts\import_zed.ps1
```

**自動的に実行される処理:**
- ファイル存在チェック
- 期間: 2014-01-01 ～ 2025-08-24
- 進捗表示
- 完了レポート

---

### **方法2: npmコマンド**

```bash
# 全期間取り込み（2014-2025）
npm run import:zed:all

# 2024年のみ
npm run import:zed:2024

# 2025年のみ
npm run import:zed:2025

# カスタム期間
npx tsx scripts/import_jrdb_zed_standalone.ts "E:\test_zed\ZED*.txt" 2024-01-01 2024-12-31
```

---

## 📋 事前準備

### **Step 1: ZEDファイルを準備**

```powershell
# ファイルをコピー
Copy-Item E:\UMAYOMI\jrdb_data\PACI*\ZED*.txt E:\test_zed\ -Force

# ファイル数確認
(Get-ChildItem E:\test_zed\ZED*.txt).Count
```

**推奨構造:**
```
E:\test_zed\
  ├─ ZED140105.txt
  ├─ ZED140106.txt
  ├─ ZED140111.txt
  └─ ... (1,264 files)
```

---

### **Step 2: データベース確認**

```bash
# プロジェクトディレクトリに移動
cd /home/user/webapp

# データベースパスを確認
ls -lh .wrangler/state/v3/d1/miniflare-D1DatabaseObject/*.sqlite
```

**自動作成される内容:**
- テーブル: `jrdb_zed_race`
- インデックス: `race_date`, `race_id`
- UNIQUE制約: `(race_id, race_date)`

---

## 🔧 詳細設定

### **カスタマイズ方法**

#### **1. PowerShellスクリプトをカスタマイズ**

`scripts/import_zed.ps1` を編集：

```powershell
# データパス変更
$DataPath = "D:\your\custom\path\ZED*.txt"

# 期間変更
$StartDate = "2023-01-01"
$EndDate = "2023-12-31"
```

#### **2. コマンドライン引数で実行**

```bash
# 構文
npx tsx scripts/import_jrdb_zed_standalone.ts <data_path> <start_date> <end_date>

# 例: 2024年のみ
npx tsx scripts/import_jrdb_zed_standalone.ts \
  "E:\UMAYOMI\jrdb_data\PACI*\ZED*.txt" \
  2024-01-01 \
  2024-12-31

# 例: 特定月のみ
npx tsx scripts/import_jrdb_zed_standalone.ts \
  "E:\test_zed\ZED*.txt" \
  2025-01-01 \
  2025-01-31
```

---

## 📊 実行結果の見方

### **進捗表示**

```
📊 進捗: 512/1264 (40.5%) | レコード: 102,458 | 速度: 15,234 rec/s | 経過: 6.7s | 処理中: ZED240615.txt
```

**項目説明:**
- `512/1264`: 処理済みファイル / 全ファイル
- `40.5%`: 進捗率
- `102,458`: 取り込み済みレコード数
- `15,234 rec/s`: 処理速度（records/秒）
- `6.7s`: 経過時間
- `ZED240615.txt`: 現在処理中のファイル

### **完了レポート**

```
✅ 取り込み完了！

📊 結果:
  処理ファイル: 1,264/1,264
  取り込みレコード: 2,012,458件
  スキップ: 0件（重複）
  エラー: 0件
  処理時間: 132.45秒
  平均速度: 15,191 records/sec
  DB総レコード数: 2,012,458件

🎉 完了！
```

---

## ⚠️ よくある問題と解決策

### **問題1: ファイルが見つからない**

```
❌ ファイルが見つかりません: E:\test_zed\ZED*.txt
```

**解決策:**
```powershell
# 1. ファイルの存在確認
Get-ChildItem E:\test_zed\ZED*.txt

# 2. パスが正しいか確認
# Windowsの場合: E:\test_zed\ZED*.txt
# Sandboxの場合: /home/user/uploaded_files/ZED*.txt

# 3. ファイルをコピー
Copy-Item E:\UMAYOMI\jrdb_data\PACI*\ZED*.txt E:\test_zed\ -Force
```

### **問題2: 日付形式エラー**

```
❌ Invalid date format. Use YYYY-MM-DD (e.g., 2024-01-01)
```

**解決策:**
```bash
# ❌ 間違った形式
2024/01/01
2024-1-1
20240101

# ✅ 正しい形式
2024-01-01
2025-08-24
```

### **問題3: データベースエラー**

```
❌ SQLite database error
```

**解決策:**
```bash
# データベースを再作成
rm -rf .wrangler/state/v3/d1/

# 再実行
npm run import:zed:all
```

### **問題4: メモリ不足**

```
❌ JavaScript heap out of memory
```

**解決策:**
```bash
# Node.jsのメモリを増やして実行
NODE_OPTIONS="--max-old-space-size=4096" npm run import:zed:all

# または小分けで実行
npm run import:zed:2024  # 2024年のみ
npm run import:zed:2025  # 2025年のみ
```

---

## 📈 パフォーマンス情報

### **推定処理時間**

| ファイル数 | データ量 | レコード数 | 処理時間 | 平均速度 |
|-----------|---------|-----------|---------|---------|
| 10 | 5MB | 1.5万件 | 1秒 | 15,000 rec/s |
| 100 | 50MB | 15万件 | 10秒 | 15,000 rec/s |
| 1,264 | 620MB | 200万件 | 2-3分 | 15,000 rec/s |

**システム要件:**
- RAM: 最低2GB、推奨4GB
- CPU: マルチコアCPU推奨
- Disk: 1GB以上の空き容量

### **最適化のヒント**

1. **SSDを使用**
   - HDDよりもSSDの方が10倍以上高速

2. **ファイルをローカルに配置**
   - ネットワークドライブではなくローカルディスク推奨

3. **他のアプリケーションを終了**
   - メモリとCPUリソースを確保

4. **小分けで実行**
   - メモリ不足の場合は年単位で分割

---

## 🔍 データ確認方法

### **取り込み後の確認**

```bash
# レコード数確認
npx tsx -e "
import Database from 'better-sqlite3';
import * as path from 'path';

const DB_PATH = path.join(process.cwd(), '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/0aedb352c8e6bb5c4415dfb2780580e45d94a7381c9bdb7654f57812c160c7ad.sqlite');
const db = new Database(DB_PATH);

const count = db.prepare('SELECT COUNT(*) as count FROM jrdb_zed_race').get();
console.log('Total records:', count.count);

const sample = db.prepare('SELECT * FROM jrdb_zed_race LIMIT 5').all();
console.log('Sample data:');
console.table(sample);

db.close();
"
```

### **期間別レコード数確認**

```sql
SELECT 
  substr(race_date, 1, 4) as year,
  COUNT(*) as count
FROM jrdb_zed_race
GROUP BY year
ORDER BY year;
```

---

## 📝 ログとデバッグ

### **詳細ログを有効化**

```bash
# デバッグモードで実行
DEBUG=* npm run import:zed:all

# ログファイルに出力
npm run import:zed:all > import.log 2>&1
```

### **エラー時の対応**

1. **エラーメッセージを確認**
   - スクリプトは自動的にエラーファイル名を表示

2. **問題ファイルをスキップ**
   - スクリプトは自動的にスキップして続行

3. **再実行**
   - UNIQUE制約により重複は自動スキップ
   - 何度でも安全に再実行可能

---

## 🚀 次のステップ

### **1. データの検証**

```bash
# データ整合性チェック
npm run db:test
```

### **2. RGS/AAS計算の実行**

```bash
# Phase 5のバッチ処理を実行
npm run calculate:rgs
npm run calculate:aas
```

### **3. 他のデータソース取り込み**

```bash
# JRDB KKA（確定着順）
npm run import:kka:all

# JRDB SED（成績データ）
npm run import:sed:all
```

---

## 💡 Tips & Best Practices

### **定期的な増分更新**

```bash
# 毎週日曜に最新データを取り込み
# 前週分のみを指定すると高速

# 例: 2025年8月の最新週のみ
npx tsx scripts/import_jrdb_zed_standalone.ts \
  "E:\test_zed\ZED*.txt" \
  2025-08-20 \
  2025-08-24
```

### **バックアップ**

```bash
# データベースをバックアップ
cp .wrangler/state/v3/d1/miniflare-D1DatabaseObject/*.sqlite \
   backups/db_backup_$(date +%Y%m%d).sqlite
```

---

## 📞 サポート

問題が解決しない場合:

1. GitHubリポジトリのIssueを確認
2. 新しいIssueを作成して質問
3. ログファイルを添付

---

**Last Updated:** 2025-01-04
**Version:** 1.0.0
