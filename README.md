# UMAYOMI - 馬を読む。レースが変わる。

## 🎯 プロジェクト概要

**UMAYOMI**は、JRDB + JRA-VANデータを活用した競馬回収率分析システムです。

### 主な機能
- ✅ ファクター作成（3エリアOR構造）
- ✅ 回収率分析（6項目計算）
- ✅ 独自得点計算エンジン
- ✅ 翌日レース予測
- ✅ 出走表表示
- 🚧 JRDBデータ取り込み（実装完了・未実行）
- 🚧 JRA-VANデータ取り込み（実装完了・未実行）

---

## 📊 完了した作業（Phase 1-3完了）

### ✅ Phase 1: JRA-VAN必須パーサー6種実装完了
| # | パーサー | ファイル | レコード数 | 状態 |
|---|---------|---------|----------|------|
| 1 | **SE Parser（成績データ）** | `src/parsers/jravan/se.ts` | 1,295件 | ✅ 完了 |
| 2 | **TM Parser（調教データ）** | `src/parsers/jravan/tm.ts` | 96件 | ✅ 完了 |
| 3 | **JG Parser（騎手情報）** | `src/parsers/jravan/jg.ts` | 450件 | ✅ 完了 |
| 4 | **BY/HY Parser（馬基本情報）** | `src/parsers/jravan/by.ts` | 175件 | ✅ 完了 |
| 5 | **OW Parser（オッズデータ）** | `src/parsers/jravan/ow.ts` | 997件 | ✅ 完了 |
| 6 | **SCHD Parser（開催スケジュール）** | `src/parsers/jravan/schd.ts` | 284件 | ✅ 完了 |

### ✅ Phase 2: データ取り込みスクリプト実装完了
| # | スクリプト | ファイル | 対象 | 状態 |
|---|----------|---------|------|------|
| 1 | **JRDB一括取り込み** | `scripts/import_jrdb_data.ts` | KYI/BAC/KAB/CHA/JOA/SED/TYB | ✅ 完了 |
| 2 | **JRA-VAN一括取り込み** | `scripts/import_jravan_data.ts` | SE/TM/JG/BY/OW/SCHD/HC | ✅ 完了 |

### ✅ Phase 3: マイグレーションSQL作成完了
| # | ファイル | 内容 | 状態 |
|---|---------|------|------|
| 1 | `migrations/0002_create_jrdb_jravan_tables.sql` | JRDB 7テーブル + JRA-VAN 7テーブル | ✅ 完了 |
| 2 | `scripts/run_migrations.ts` | マイグレーション実行スクリプト | ✅ 完了 |

---

## 🚧 未完成の作業

### Phase 4: データ取り込み実行（CEO PC）
- ⏳ JRDBデータ取り込み実行（E:\UMAYOMI\downloads_weekly\）
- ⏳ JRA-VANデータ取り込み実行（E:\JRAVAN\）
- ⏳ データ整合性確認
- ⏳ 回収率分析エンジンテスト

---

## 🛠️ CEO PC での実行手順

### 1. データベース初期化
```bash
# マイグレーション実行（テーブル作成）
npm run db:migrate
```

### 2. データ取り込み実行
```bash
# JRDB + JRA-VAN データ一括取り込み
npm run import:all

# または個別に実行
npm run import:jrdb      # JRDBのみ
npm run import:jravan    # JRA-VANのみ
```

### 3. ローカルサーバー起動
```bash
# サーバー起動（localhost:3000）
npm run dev:local
```

---

## 📂 データ構造

### JRDB データ（E:\UMAYOMI\downloads_weekly\）
- **KYI**: 馬別出走情報
- **BAC**: 馬基本情報
- **KAB**: レース結果サマリー
- **CHA**: 厩舎コメント
- **JOA**: 騎手データ
- **SED**: 成績データ
- **TYB**: 出馬表データ

### JRA-VAN データ（E:\JRAVAN\）
- **SE**: 成績データ
- **TM**: 調教データ
- **JG**: 騎手情報
- **BY/HY**: 馬基本情報
- **OW**: オッズデータ（馬主情報）
- **SCHD**: 開催スケジュール
- **HC**: 出走予定馬

---

## 💾 データベース

**保存先:** `E:\UMAYOMI\umayomi.db`

**テーブル一覧:**
- JRDB: `jrdb_kyi`, `jrdb_bac`, `jrdb_kab`, `jrdb_cha`, `jrdb_joa`, `jrdb_sed`, `jrdb_tyb`
- JRA-VAN: `jravan_se`, `jravan_tm`, `jravan_jg`, `jravan_by`, `jravan_ow`, `jravan_schd`, `jravan_hc`
- システム: `registered_factors`, `tomorrow_races`, `race_predictions`

---

## 🔗 URL

**Sandbox環境:** (ローカルのみ)
- http://localhost:3000 - トップページ
- http://localhost:3000/factor-register - ファクター登録
- http://localhost:3000/race-card - 出走表表示

**GitHub:** https://github.com/aka209859-max/umayomi

---

## 🚀 技術スタック

- **Backend:** Hono + TypeScript + better-sqlite3
- **Frontend:** TailwindCSS + Vanilla JS
- **Database:** SQLite（E:\UMAYOMI\umayomi.db）
- **Data Parser:** iconv-lite（Shift-JIS対応）

---

## 📋 次のステップ

1. **CEO PCでデータ取り込み実行**
   ```bash
   npm run import:all
   ```

2. **データ確認**
   - SQLiteでレコード数確認
   - データ整合性チェック

3. **回収率分析エンジンテスト**
   - 6項目計算動作確認
   - ファクター適用テスト

4. **完全版リリース**
   - 全機能統合テスト
   - パフォーマンス最適化

---

**最終更新日:** 2026-01-02  
**Phase進捗:** Phase 1-3完了（8/13タスク完了）  
**次のマイルストーン:** Phase 4データ取り込み実行
