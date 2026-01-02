# 🚀 UMAYOMI - CEO クイックスタートガイド

**最終更新**: 2026-01-02  
**状態**: データ取り込み準備完了  
**次のステップ**: データ取り込み実行（合計60-120分）

---

## ✅ 現在の状況サマリー

### **完了済み**
- ✅ Node.js インストール完了 (v20.18.0)
- ✅ プロジェクトセットアップ完了 (E:\UMAYOMI\webapp)
- ✅ データベースマイグレーション完了 (32テーブル作成済み)
- ✅ 修正版スクリプト作成完了 (`import_jrdb_data_d1_fixed.ts`、`import_jravan_data_d1_fixed.ts`)
- ✅ `jrdb_sed`テーブルの`horse_id`カラム追加完了

### **データファイル確認済み**
- 📂 **JRDB**: 5,130ファイル (E:\UMAYOMI\downloads_weekly)
  - 展開済み: sed_extracted (513件)、tyb_extracted、hjc_extracted、ov_extracted
- 📂 **JRA-VAN**: 45,359ファイル (E:\JRAVAN)
  - 最大データ: CK_DATA (17,634件)、ES_DATA (11,488件)、SE_DATA (6,217件)

---

## 🎯 次にやること（コピペで実行可能）

### **📋 実行前チェックリスト**

```powershell
# 1. 作業ディレクトリに移動
cd E:\UMAYOMI\webapp

# 2. 最新コードを取得
git pull origin main

# 3. 修正版スクリプトの存在確認
Test-Path .\scripts\import_jrdb_data_d1_fixed.ts
Test-Path .\scripts\import_jravan_data_d1_fixed.ts
# 両方とも True が表示されることを確認
```

**期待される結果**:
```
True
True
```

---

### **Step 1: データベース再マイグレーション（5分）**

**理由**: `jrdb_sed`テーブルに`horse_id`カラムを追加するため、マイグレーションを再実行します。

```powershell
cd E:\UMAYOMI\webapp

# ローカルD1データベースをリセット
Remove-Item -Recurse -Force .\.wrangler\state\v3\d1 -ErrorAction SilentlyContinue

# マイグレーション実行
Write-Host "`n=== マイグレーション実行開始 ===" -ForegroundColor Cyan

npx wrangler d1 execute umayomi-production --local --file=.\migrations\0001_initial_schema.sql
npx wrangler d1 execute umayomi-production --local --file=.\migrations\0002_create_jrdb_jravan_tables.sql
npx wrangler d1 execute umayomi-production --local --file=.\migrations\0003_create_jrdb_14_tables.sql

# テーブル確認
npx wrangler d1 execute umayomi-production --local --command="SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"

Write-Host "`n✅ マイグレーション完了！" -ForegroundColor Green
```

**期待される結果**: 32個のテーブル名が表示される

---

### **Step 2: JRDBデータ取り込み（20-40分）**

**対象**: 4種類のextractedフォルダ（sed_extracted、tyb_extracted、hjc_extracted、ov_extracted）

```powershell
cd E:\UMAYOMI\webapp

Write-Host "`n=== Phase 4-2: JRDBデータ取り込み開始 ===" -ForegroundColor Cyan
Write-Host "所要時間: 20-40分" -ForegroundColor Yellow
Write-Host "対象: 4種類のパーサー（SED、TYB、HJC、OV）" -ForegroundColor Yellow
Write-Host ""

# データ取り込み実行
npx tsx scripts/import_jrdb_data_d1_fixed.ts

Write-Host "`n✅ JRDBデータ取り込み完了！" -ForegroundColor Green
```

**進捗表示の例**:
```
📊 sed_extracted (jrdb_sed) 取り込み中...
   ファイル数: 513件
   パース進捗: 513/513 ファイル (231,892件)
   パース完了: 231,892件
   SQL実行中...
   実行進捗: 231,892/231,892 レコード (バッチ 464/464)
✅ sed_extracted 完了: 231,892件
```

**⚠️ 注意事項**:
- 途中で止めないでください
- 進捗はリアルタイムに表示されます
- エラーが出た場合は、すぐに報告してください

---

### **Step 3: JRA-VANデータ取り込み（40-80分）**

**対象**: 6種類のフォルダ（SE_DATA、CK_DATA、ES_DATA、HY_DATA、BY_DATA、OW_DATA）

```powershell
cd E:\UMAYOMI\webapp

Write-Host "`n=== Phase 4-3: JRA-VANデータ取り込み開始 ===" -ForegroundColor Cyan
Write-Host "所要時間: 40-80分" -ForegroundColor Yellow
Write-Host "対象: 6種類のパーサー" -ForegroundColor Yellow
Write-Host ""

# データ取り込み実行
npx tsx scripts/import_jravan_data_d1_fixed.ts

Write-Host "`n✅ JRA-VANデータ取り込み完了！" -ForegroundColor Green
```

**進捗表示の例**:
```
📊 jravan_se (SE_DATA) 取り込み中...
   ファイル数: 6217件
   パース進捗: 6217/6217 (1,234,567件)
   パース完了: 1,234,567件
   SQL実行中...
   実行進捗: 1,234,567/1,234,567 (2470/2470)
✅ jravan_se 完了: 1,234,567件
```

---

### **Step 4: データ整合性確認（5分）**

```powershell
cd E:\UMAYOMI\webapp

Write-Host "`n=== Step 5: データ整合性確認 ===" -ForegroundColor Cyan

# JRDB レコード数確認
Write-Host "`n[JRDB] レコード数確認:" -ForegroundColor Yellow
npx wrangler d1 execute umayomi-production --local --command="SELECT 'jrdb_sed' as table_name, COUNT(*) as count FROM jrdb_sed UNION ALL SELECT 'jrdb_tyb', COUNT(*) FROM jrdb_tyb UNION ALL SELECT 'jrdb_hjc', COUNT(*) FROM jrdb_hjc UNION ALL SELECT 'jrdb_ov', COUNT(*) FROM jrdb_ov;"

# JRA-VAN レコード数確認
Write-Host "`n[JRA-VAN] レコード数確認:" -ForegroundColor Yellow
npx wrangler d1 execute umayomi-production --local --command="SELECT 'jravan_se' as table_name, COUNT(*) as count FROM jravan_se UNION ALL SELECT 'jravan_hc', COUNT(*) FROM jravan_hc UNION ALL SELECT 'jravan_tm', COUNT(*) FROM jravan_tm UNION ALL SELECT 'jravan_jg', COUNT(*) FROM jravan_jg UNION ALL SELECT 'jravan_by', COUNT(*) FROM jravan_by UNION ALL SELECT 'jravan_ow', COUNT(*) FROM jravan_ow;"

Write-Host "`n✅ データ整合性確認完了！" -ForegroundColor Green
```

**期待される結果**:
```
[JRDB] レコード数確認:
jrdb_sed   | 231,892
jrdb_tyb   | 150,000
jrdb_hjc   | 50,000
jrdb_ov    | 80,000

[JRA-VAN] レコード数確認:
jravan_se  | 1,234,567
jravan_hc  | 500,000
jravan_tm  | 300,000
jravan_jg  | 200,000
jravan_by  | 100,000
jravan_ow  | 50,000
```

**✅ 成功条件**: すべてのテーブルのレコード数が0より大きいこと

---

## ⏱️ 実行スケジュール

| ステップ | 作業内容 | 所要時間 |
|---------|---------|---------|
| Step 1 | データベース再マイグレーション | 5分 |
| Step 2 | JRDBデータ取り込み | 20-40分 |
| Step 3 | JRA-VANデータ取り込み | 40-80分 |
| Step 4 | データ整合性確認 | 5分 |
| **合計** | | **約70-130分（1-2時間）** |

---

## 🔧 トラブルシューティング

### **問題1: "Module not found" エラー**

**症状**:
```
ERR_MODULE_NOT_FOUND: Cannot find module 'E:\UMAYOMI\webapp\scripts\import_jrdb_data_d1_fixed.ts'
```

**解決策**:
```powershell
cd E:\UMAYOMI\webapp
git pull origin main
Test-Path .\scripts\import_jrdb_data_d1_fixed.ts
# True が表示されることを確認
```

---

### **問題2: "no such table" エラー**

**症状**:
```
SQLITE_ERROR: no such table: jrdb_sed
```

**解決策**:
```powershell
# Step 1のマイグレーションを再実行
cd E:\UMAYOMI\webapp
Remove-Item -Recurse -Force .\.wrangler\state\v3\d1 -ErrorAction SilentlyContinue
npx wrangler d1 execute umayomi-production --local --file=.\migrations\0001_initial_schema.sql
npx wrangler d1 execute umayomi-production --local --file=.\migrations\0002_create_jrdb_jravan_tables.sql
npx wrangler d1 execute umayomi-production --local --file=.\migrations\0003_create_jrdb_14_tables.sql
```

---

### **問題3: "table has no column named horse_id" エラー**

**症状**:
```
SQLITE_ERROR: table jrdb_sed has no column named horse_id
```

**解決策**:
```powershell
# 最新コードを取得して再実行
cd E:\UMAYOMI\webapp
git pull origin main
# Step 1からやり直す
```

---

### **問題4: パース中にエラーが出る**

**症状**:
```
⚠️ ファイルパースエラー: E:\UMAYOMI\downloads_weekly\sed_extracted\SED160109.txt
```

**解決策**:
- **エラーは無視して続行**: スクリプトはエラーファイルをスキップして次に進みます
- **最後まで実行**: 大半のファイルは正常にパースされます

---

## 📊 次のステップ（Phase 4完了後）

### **Phase 5: ローカルサーバー起動とAPI確認**

```powershell
cd E:\UMAYOMI\webapp

# ビルド
npm run build

# ローカル開発サーバー起動
npm run dev:local
```

ブラウザで確認:
- http://localhost:3000
- http://localhost:3000/api/races
- http://localhost:3000/api/horses

---

## 📝 実行チェックリスト

実行が完了したら、以下をチェック：

- [ ] Step 1: マイグレーション完了（32テーブル表示）
- [ ] Step 2: JRDBデータ取り込み完了（4種類）
- [ ] Step 3: JRA-VANデータ取り込み完了（6種類）
- [ ] Step 4: データ整合性確認完了（すべて0より大きい）

**すべて✅なら、Phase 4完了！次はPhase 5へ進みます。**

---

## 💬 報告用テンプレート

実行結果を報告する際は、以下の形式でお願いします：

```
【実行報告】
- Step 1: マイグレーション → ✅完了 / ❌失敗
- Step 2: JRDBデータ取り込み → ✅完了 / ❌失敗
  - jrdb_sed: XX,XXX件
  - jrdb_tyb: XX,XXX件
  - jrdb_hjc: XX,XXX件
  - jrdb_ov: XX,XXX件
- Step 3: JRA-VANデータ取り込み → ✅完了 / ❌失敗
  - jravan_se: XX,XXX件
  - jravan_hc: XX,XXX件
  - jravan_tm: XX,XXX件
  - jravan_jg: XX,XXX件
  - jravan_by: XX,XXX件
  - jravan_ow: XX,XXX件
- Step 4: データ整合性確認 → ✅完了 / ❌失敗

【エラー（あれば）】
- エラー内容をコピペ

【次のステップ】
- Phase 5: ローカルサーバー起動へ進む / トラブル解決が必要
```

---

## 🎉 成功の目安

すべてのステップが完了すると、以下の状態になります：

1. ✅ 32個のテーブルが作成済み
2. ✅ JRDBデータが4種類取り込まれている
3. ✅ JRA-VANデータが6種類取り込まれている
4. ✅ すべてのテーブルにレコードが存在する
5. ✅ エラーなくデータ取り込みが完了

**この状態になったら、データ取り込みフェーズは完了です！🚀**

---

**CEO、準備は整いました。上記の手順を順番に実行してください！💪**
