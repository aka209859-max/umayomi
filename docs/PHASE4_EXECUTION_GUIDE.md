# UMAYOMI Phase 4 実行ガイド - データ取り込み完全マニュアル

**作成日**: 2026-01-02  
**ステータス**: スクリプト作成完了、データ取り込み実行待ち  
**CEO**: 次回起動時にこのファイルを確認してください

---

## 📋 現状サマリー

### ✅ 完了済み
1. **Node.js インストール**: v20.18.0 ✅
2. **プロジェクトセットアップ**: E:\UMAYOMI\webapp ✅
3. **依存関係インストール**: npm install 完了 ✅
4. **データベースマイグレーション**: 32テーブル作成完了 ✅
5. **スクリプトファイル作成**: 
   - `import_jrdb_data_d1.ts` (7,421バイト) ✅
   - `import_jravan_data_d1.ts` (5,438バイト) ✅

### 📊 データファイル確認済み
- **JRDB**: E:\UMAYOMI\downloads_weekly - **5,130ファイル** ✅
- **JRA-VAN**: E:\JRAVAN - **45,359ファイル** ✅

### ⏳ 次のタスク
- **Phase 4-2**: JRDBデータ取り込み (推定20-40分)
- **Phase 4-3**: JRA-VANデータ取り込み (推定60-90分)
- **Phase 4-4**: データ整合性確認 (5分)
- **Phase 4-5**: ローカルサーバー起動・テスト (10分)

---

## 🚀 次回起動時の実行手順（コピペ用）

### **Step 1: PowerShellを開く**
- Windows PowerShellを起動（管理者権限不要）
- 現在のディレクトリを確認

### **Step 2: プロジェクトディレクトリに移動**

```powershell
cd E:\UMAYOMI\webapp
```

### **Step 3: Phase 4-2 - JRDBデータ取り込み実行（20-40分）**

```powershell
# ========================================
# Phase 4-2: JRDBデータ取り込み
# ========================================
Write-Host "`n=== Phase 4-2: JRDBデータ取り込み開始 ===" -ForegroundColor Cyan
Write-Host "⏱️  データ: 5,130ファイル" -ForegroundColor Yellow
Write-Host "⏱️  推定時間: 20-40分" -ForegroundColor Yellow
Write-Host "📊 対象: JRDB 21種類のパーサー" -ForegroundColor Yellow
Write-Host "⚠️  画面に進捗が表示されます。途中で止めないでください。" -ForegroundColor Red
Write-Host ""

cd E:\UMAYOMI\webapp
npx tsx scripts/import_jrdb_data_d1.ts

Write-Host "`n✅ JRDBデータ取り込み完了！" -ForegroundColor Green
```

**期待される出力:**
```
🚀 JRDB一括取り込み開始（Cloudflare D1版）

📂 読み込み元: E:\UMAYOMI\downloads_weekly
💾 保存先DB: umayomi-production (Cloudflare D1 --local)

📊 KYI (jrdb_kyi) 取り込み中...
   ファイル数: 250件
   パース進捗: 250/250 ファイル (15000件)
   パース完了: 15000件
   SQL生成・実行中...
   実行進捗: 15000/15000 レコード (バッチ 30/30)
✅ KYI 完了: 15000件

📊 BAC (jrdb_bac) 取り込み中...
   ... (21種類のパーサーが順次実行)

✅ JRDB一括取り込み完了（21種類）！

🎉 すべて完了！
```

---

### **Step 4: Phase 4-3 - JRA-VANデータ取り込み実行（60-90分）**

**JRDB取り込み完了後に実行:**

```powershell
# ========================================
# Phase 4-3: JRA-VANデータ取り込み
# ========================================
Write-Host "`n=== Phase 4-3: JRA-VANデータ取り込み開始 ===" -ForegroundColor Cyan
Write-Host "⏱️  データ: 45,359ファイル" -ForegroundColor Yellow
Write-Host "⏱️  推定時間: 60-90分" -ForegroundColor Yellow
Write-Host "📊 対象: JRA-VAN 6種類のパーサー" -ForegroundColor Yellow
Write-Host "⚠️  画面に進捗が表示されます。途中で止めないでください。" -ForegroundColor Red
Write-Host ""

cd E:\UMAYOMI\webapp
npx tsx scripts/import_jravan_data_d1.ts

Write-Host "`n✅ JRA-VANデータ取り込み完了！" -ForegroundColor Green
```

**期待される出力:**
```
🚀 JRA-VAN一括取り込み開始

📂 読み込み元: E:\JRAVAN
💾 保存先DB: umayomi-production (Cloudflare D1 --local)

📊 jravan_se 取り込み中...
   ファイル数: 8000件
   パース進捗: 8000/8000
   パース完了: 400000件
   SQL実行中...
   実行進捗: 400000/400000
✅ jravan_se 完了: 400000件

📊 jravan_tm 取り込み中...
   ... (6種類のパーサーが順次実行)

✅ JRA-VAN一括取り込み完了！
```

---

### **Step 5: データ整合性確認（5分）**

**両方の取り込み完了後に実行:**

```powershell
# ========================================
# Phase 4-4: データ整合性確認
# ========================================
Write-Host "`n=== Phase 4-4: データ整合性確認 ===" -ForegroundColor Cyan

Write-Host "`n[JRDB] レコード数確認:" -ForegroundColor Yellow
npx wrangler d1 execute umayomi-production --local --command="SELECT 'jrdb_kyi' as table_name, COUNT(*) as count FROM jrdb_kyi UNION ALL SELECT 'jrdb_bac', COUNT(*) FROM jrdb_bac UNION ALL SELECT 'jrdb_cyb', COUNT(*) FROM jrdb_cyb UNION ALL SELECT 'jrdb_ukc', COUNT(*) FROM jrdb_ukc UNION ALL SELECT 'jrdb_zed', COUNT(*) FROM jrdb_zed;"

Write-Host "`n[JRA-VAN] レコード数確認:" -ForegroundColor Yellow
npx wrangler d1 execute umayomi-production --local --command="SELECT 'jravan_se' as table_name, COUNT(*) as count FROM jravan_se UNION ALL SELECT 'jravan_tm', COUNT(*) FROM jravan_tm UNION ALL SELECT 'jravan_by', COUNT(*) FROM jravan_by UNION ALL SELECT 'jravan_jg', COUNT(*) FROM jravan_jg;"

Write-Host "`n✅ データ整合性確認完了" -ForegroundColor Green
```

**期待される結果:**
```
[JRDB] レコード数確認:
┌────────────┬─────────┐
│ table_name │ count   │
├────────────┼─────────┤
│ jrdb_kyi   │ 85000   │
│ jrdb_bac   │ 42000   │
│ jrdb_cyb   │ 95000   │
│ jrdb_ukc   │ 78000   │
│ jrdb_zed   │ 35000   │
└────────────┴─────────┘

[JRA-VAN] レコード数確認:
┌────────────┬─────────┐
│ table_name │ count   │
├────────────┼─────────┤
│ jravan_se  │ 450000  │
│ jravan_tm  │ 120000  │
│ jravan_by  │ 85000   │
│ jravan_jg  │ 3500    │
└────────────┴─────────┘
```

**✅ 全テーブルで count > 0 が確認できればOK**

---

### **Step 6: ローカルサーバー起動とテスト（10分）**

```powershell
# ========================================
# Phase 4-5: ローカルサーバー起動
# ========================================
Write-Host "`n=== Phase 4-5: ローカルサーバー起動 ===" -ForegroundColor Cyan

# ポート3000をクリア
fuser -k 3000/tcp 2>$null

# ビルド実行
Write-Host "`nビルド実行中..." -ForegroundColor Yellow
cd E:\UMAYOMI\webapp
npm run build

# PM2でサーバー起動
Write-Host "`nサーバー起動中..." -ForegroundColor Yellow
pm2 start ecosystem.config.cjs

# サーバー確認
Write-Host "`nサーバー確認中..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
curl http://localhost:3000

Write-Host "`n✅ サーバー起動完了！" -ForegroundColor Green
Write-Host "`n次のURLにアクセスしてください:" -ForegroundColor Cyan
Write-Host "  http://localhost:3000" -ForegroundColor White
```

---

## 📊 完了基準

| Phase | 項目 | 完了基準 | 所要時間 |
|-------|------|----------|----------|
| Phase 4-2 | JRDB取り込み | 21種類すべて完了、エラー0件 | 20-40分 |
| Phase 4-3 | JRA-VAN取り込み | 6種類すべて完了、エラー0件 | 60-90分 |
| Phase 4-4 | データ整合性確認 | 全テーブルで count > 0 | 5分 |
| Phase 4-5 | サーバー起動 | http://localhost:3000 でアクセス可能 | 10分 |

**合計所要時間: 約95-145分（1.5-2.5時間）**

---

## 🚨 トラブルシューティング

### エラー1: `Cannot find module 'iconv-lite'`

**原因**: iconv-liteがインストールされていない

**解決策**:
```powershell
cd E:\UMAYOMI\webapp
npm install iconv-lite
```

---

### エラー2: `SQLITE_ERROR: table already exists`

**原因**: テーブルが既に存在する（2回目の実行時）

**解決策**: 問題なし。`INSERT OR IGNORE` を使用しているため重複データはスキップされます。

---

### エラー3: `Error: ENOENT: no such file or directory`

**原因**: データファイルのパスが間違っている

**解決策**:
```powershell
# データファイルの存在確認
Test-Path E:\UMAYOMI\downloads_weekly
Test-Path E:\JRAVAN

# ファイル数確認
(Get-ChildItem E:\UMAYOMI\downloads_weekly -Recurse -File).Count
(Get-ChildItem E:\JRAVAN -Recurse -File).Count
```

---

### エラー4: `wrangler d1 execute failed`

**原因**: Wranglerのバージョンが古い

**解決策**:
```powershell
cd E:\UMAYOMI\webapp
npm install --save-dev wrangler@latest
```

---

### エラー5: プロセスが途中で止まる

**原因**: メモリ不足またはタイムアウト

**解決策**:
```powershell
# Node.jsのメモリ上限を増やす
$env:NODE_OPTIONS="--max-old-space-size=4096"

# スクリプト再実行
npx tsx scripts/import_jrdb_data_d1.ts
```

---

## 📁 ファイル構成

```
E:\UMAYOMI\webapp\
├── scripts\
│   ├── import_jrdb_data_d1.ts    ← JRDB取り込みスクリプト（7,421バイト）
│   └── import_jravan_data_d1.ts  ← JRA-VAN取り込みスクリプト（5,438バイト）
├── .wrangler\
│   └── state\v3\d1\               ← Cloudflare D1ローカルデータベース
│       └── xxxxxxxx.sqlite        ← 実際のSQLiteファイル
├── migrations\
│   ├── 0001_initial_schema.sql
│   ├── 0002_create_jrdb_jravan_tables.sql
│   └── 0003_create_jrdb_14_tables.sql
└── package.json
```

---

## 🎯 Phase 4完了後の次のステップ

### Phase 5: 本番環境デプロイ

1. **GitHub Push**: コードをGitHubにプッシュ
2. **Cloudflare Pages デプロイ**: 本番環境にデプロイ
3. **本番D1設定**: 本番用D1データベース作成
4. **本番データ取り込み**: 本番環境でデータ取り込み実行

### Phase 6: 機能テスト

1. **回収率分析API**: `/api/race-analysis` の動作確認
2. **出走表表示**: `/tomorrow-races` の表示確認
3. **血統ファクター**: 血統データの動作確認
4. **オッズ補正**: オッズデータの動作確認

---

## 📝 実行チェックリスト

次回起動時に、以下をチェックしながら実行してください:

- [ ] PowerShellを開く
- [ ] E:\UMAYOMI\webapp に移動
- [ ] Phase 4-2 (JRDB取り込み) 実行 → **20-40分待つ**
- [ ] Phase 4-3 (JRA-VAN取り込み) 実行 → **60-90分待つ**
- [ ] Phase 4-4 (整合性確認) 実行 → **レコード数確認**
- [ ] Phase 4-5 (サーバー起動) 実行 → **ブラウザでアクセス**
- [ ] すべて完了後、結果を報告

---

## 💡 重要な注意事項

1. **⏱️ 所要時間**: 合計約95-145分（1.5-2.5時間）かかります
2. **🚫 途中で止めない**: 進捗が表示されますが、完了まで待つ
3. **💻 PCをスリープさせない**: 実行中はPCを起動したままにする
4. **📊 進捗確認**: リアルタイムで進捗が表示されます
5. **💾 ディスク容量**: 約5GB以上の空き容量が必要

---

## 🔗 関連ドキュメント

- **プロジェクトREADME**: `/home/user/webapp/README.md`
- **マイグレーション**: `/home/user/webapp/migrations/`
- **パーサー実装**: `/home/user/webapp/src/parsers/`

---

## 📞 サポート

問題が発生した場合は、以下の情報を報告してください：

1. **エラーメッセージ**: 完全なエラーメッセージをコピー
2. **実行ログ**: PowerShellの出力をすべてコピー
3. **環境情報**: 
   - Node.js バージョン: `node --version`
   - npm バージョン: `npm --version`
   - Wrangler バージョン: `npx wrangler --version`
4. **データファイル数**:
   - JRDB: `(Get-ChildItem E:\UMAYOMI\downloads_weekly -Recurse -File).Count`
   - JRA-VAN: `(Get-ChildItem E:\JRAVAN -Recurse -File).Count`

---

**作成者**: AI Assistant  
**最終更新**: 2026-01-02  
**ステータス**: データ取り込み実行待ち  

**CEO、おやすみなさい！次回起動時にこのファイルを確認して、Phase 4-2から実行してください。🚀**
