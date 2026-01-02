# 📋 UMAYOMI - やるべきこと（優先順位順）

**最終更新**: 2026-01-02  
**現在のステータス**: データ取り込み準備完了  
**次のアクション**: CEO PC でデータ取り込み実行

---

## 🎯 **優先順位順：やるべきこと**

### **🔴 Priority 1: データ取り込み実行（CEO PCで実行）**

**なぜ？**: すべての準備が整い、データベースのテーブル定義も修正済み。今すぐデータ取り込みを開始できる状態。

**どうする？**:
1. PowerShellを開く
2. `cd E:\UMAYOMI\webapp`
3. 以下のステップを順番に実行：

#### **Step 1: 最新コードを取得（1分）**
```powershell
git pull origin main
Test-Path .\scripts\import_jrdb_data_d1_fixed.ts
Test-Path .\scripts\import_jravan_data_d1_fixed.ts
```
✅ 期待される結果: 両方とも `True`

#### **Step 2: データベース再マイグレーション（5分）**
```powershell
Remove-Item -Recurse -Force .\.wrangler\state\v3\d1 -ErrorAction SilentlyContinue
npx wrangler d1 execute umayomi-production --local --file=.\migrations\0001_initial_schema.sql
npx wrangler d1 execute umayomi-production --local --file=.\migrations\0002_create_jrdb_jravan_tables.sql
npx wrangler d1 execute umayomi-production --local --file=.\migrations\0003_create_jrdb_14_tables.sql
```
✅ 期待される結果: 32個のテーブル名が表示される

#### **Step 3: JRDBデータ取り込み（20-40分）**
```powershell
npx tsx scripts/import_jrdb_data_d1_fixed.ts
```
✅ 期待される結果: 4種類のデータが取り込まれる（sed_extracted、tyb_extracted、hjc_extracted、ov_extracted）

#### **Step 4: JRA-VANデータ取り込み（40-80分）**
```powershell
npx tsx scripts/import_jravan_data_d1_fixed.ts
```
✅ 期待される結果: 6種類のデータが取り込まれる（SE_DATA、CK_DATA、ES_DATA、HY_DATA、BY_DATA、OW_DATA）

#### **Step 5: データ整合性確認（5分）**
```powershell
npx wrangler d1 execute umayomi-production --local --command="SELECT 'jrdb_sed' as table_name, COUNT(*) as count FROM jrdb_sed UNION ALL SELECT 'jrdb_tyb', COUNT(*) FROM jrdb_tyb UNION ALL SELECT 'jrdb_hjc', COUNT(*) FROM jrdb_hjc UNION ALL SELECT 'jrdb_ov', COUNT(*) FROM jrdb_ov;"

npx wrangler d1 execute umayomi-production --local --command="SELECT 'jravan_se' as table_name, COUNT(*) as count FROM jravan_se UNION ALL SELECT 'jravan_hc', COUNT(*) FROM jravan_hc UNION ALL SELECT 'jravan_tm', COUNT(*) FROM jravan_tm UNION ALL SELECT 'jravan_jg', COUNT(*) FROM jravan_jg UNION ALL SELECT 'jravan_by', COUNT(*) FROM jravan_by UNION ALL SELECT 'jravan_ow', COUNT(*) FROM jravan_ow;"
```
✅ 期待される結果: すべてのテーブルのレコード数が0より大きい

**⏱️ 合計所要時間**: 約70-130分（1-2時間）

**📝 完了基準**:
- すべてのステップが✅完了
- すべてのテーブルにレコードが存在する
- エラーなくデータ取り込みが完了

---

### **🟡 Priority 2: ローカル開発サーバー起動とAPI確認（Phase 5）**

**なぜ？**: データ取り込みが完了したら、ローカルでAPIが正常に動作するか確認する必要がある。

**どうする？**:
```powershell
cd E:\UMAYOMI\webapp
npm run build
npm run dev:local
```

ブラウザで確認:
- http://localhost:3000
- http://localhost:3000/api/races
- http://localhost:3000/api/horses

**📝 完了基準**:
- ローカルサーバーが正常に起動
- APIエンドポイントがデータを返す
- エラーなく動作する

---

### **🟡 Priority 3: Cloudflare Pagesへのデプロイ（Phase 6）**

**なぜ？**: ローカルで正常動作を確認したら、本番環境（Cloudflare Pages）へデプロイする。

**どうする？**:
1. Cloudflare API Keyの設定確認
2. 本番データベース（D1）のマイグレーション実行
3. デプロイコマンド実行

```powershell
# 本番データベースのマイグレーション
npx wrangler d1 execute umayomi-production --file=.\migrations\0001_initial_schema.sql
npx wrangler d1 execute umayomi-production --file=.\migrations\0002_create_jrdb_jravan_tables.sql
npx wrangler d1 execute umayomi-production --file=.\migrations\0003_create_jrdb_14_tables.sql

# デプロイ
npm run deploy
```

**📝 完了基準**:
- Cloudflare Pagesにデプロイ成功
- 本番URLでアクセス可能
- 本番APIが正常動作

---

### **🟢 Priority 4: 本番データの取り込み（Phase 7）**

**なぜ？**: 本番環境にもデータを取り込む必要がある。

**どうする？**:
- 本番用のデータ取り込みスクリプトを作成
- Cloudflare Workers経由でデータ取り込み
- または、D1 ImportツールでCSV/SQLファイルをインポート

**📝 完了基準**:
- 本番データベースにデータが取り込まれている
- 本番APIがデータを返す

---

### **🟢 Priority 5: 回収率分析API実装（Phase 8）**

**なぜ？**: UMAYOMIの核心機能。データが揃ったら、分析ロジックを実装する。

**どうする？**:
- 回収率分析アルゴリズムの実装
- APIエンドポイントの作成
- フロントエンドでの表示

**📝 完了基準**:
- 回収率分析APIが正常動作
- フロントエンドで分析結果が表示される
- テストケースが通る

---

## 📊 **全体スケジュール**

| Phase | 作業内容 | 所要時間 | 状態 |
|-------|---------|---------|-----|
| Phase 4 | データ取り込み | 1-2時間 | ⏳ 準備完了 |
| Phase 5 | ローカル開発サーバー | 30分 | 🔜 次のステップ |
| Phase 6 | Cloudflare Pagesデプロイ | 1時間 | 🔜 準備中 |
| Phase 7 | 本番データ取り込み | 2-4時間 | 🔜 準備中 |
| Phase 8 | 回収率分析API実装 | 4-8時間 | 🔜 準備中 |

---

## ✅ **完了済みタスク**

- ✅ Node.js インストール完了
- ✅ プロジェクトセットアップ完了
- ✅ データベースマイグレーション完了（32テーブル）
- ✅ 修正版スクリプト作成完了
- ✅ `jrdb_sed`テーブルの`horse_id`カラム追加完了
- ✅ GitHubへのプッシュ完了
- ✅ CEOクイックスタートガイド作成完了

---

## 🎯 **今すぐやること**

**CEO、今すぐ以下を実行してください：**

1. PowerShellを開く
2. `cd E:\UMAYOMI\webapp`
3. `git pull origin main`
4. **Priority 1のStep 1から順番に実行**

**詳細手順**: `docs/CEO_QUICK_START.md` を参照

---

## 💬 **報告用テンプレート**

実行結果を報告する際は、以下の形式でお願いします：

```
【実行報告】
- Step 1: 最新コード取得 → ✅完了 / ❌失敗
- Step 2: マイグレーション → ✅完了 / ❌失敗
- Step 3: JRDBデータ取り込み → ✅完了 / ❌失敗
  - jrdb_sed: XX,XXX件
  - jrdb_tyb: XX,XXX件
  - jrdb_hjc: XX,XXX件
  - jrdb_ov: XX,XXX件
- Step 4: JRA-VANデータ取り込み → ✅完了 / ❌失敗
  - jravan_se: XX,XXX件
  - jravan_hc: XX,XXX件
  - jravan_tm: XX,XXX件
  - jravan_jg: XX,XXX件
  - jravan_by: XX,XXX件
  - jravan_ow: XX,XXX件
- Step 5: データ整合性確認 → ✅完了 / ❌失敗

【エラー（あれば）】
- エラー内容をコピペ

【次のステップ】
- Phase 5へ進む / トラブル解決が必要
```

---

## 🔧 **トラブルシューティング**

問題が発生した場合は、`docs/CEO_QUICK_START.md` のトラブルシューティングセクションを参照してください。

---

**CEO、準備は整いました。今すぐPriority 1を実行してください！💪🚀**
