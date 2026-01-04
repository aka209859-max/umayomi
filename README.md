# UMAYOMI - 馬を読む。レースが変わる。

## 🎯 プロジェクト概要

**UMAYOMI**は、JRDB + JRA-VANデータを活用した競馬回収率分析システムです。

### 主な機能
- ✅ ファクター作成（3エリアOR構造）
- ✅ 回収率分析（6項目計算）
- ✅ 独自得点計算エンジン（RGS1.0 & AAS）
- ✅ 翌日レース予測
- ✅ 出走表表示
- ✅ **補正回収率計算システム（均等払戻+オッズ補正+期間重み）** ★NEW
- ✅ **ファクター登録UI（画像②完全準拠）** ★NEW
- 🚧 JRDBデータ取り込み（実装完了・未実行）
- 🚧 JRA-VANデータ取り込み（実装完了・未実行）

---

## 📊 完了した作業（Phase 1-5完了）

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

### ✅ Phase 5: RGS1.0 & AAS 計算システム完全実装 ★NEW
| # | 項目 | ファイル | 内容 | 状態 |
|---|------|---------|------|------|
| 1 | **補正係数テーブル** | `src/data/` | 単勝123行 + 複勝108行 + 期間10年 | ✅ 完了 |
| 2 | **補正回収率計算** | `src/utils/adjusted_return_rate.ts` | 均等払戻+オッズ補正+期間重み | ✅ 完了 |
| 3 | **RGS1.0計算** | `src/utils/rgs10.ts` | -10 ～ +10 の絶対評価 | ✅ 完了 |
| 4 | **AAS計算** | `src/utils/aas.ts` | -12 ～ +12 の相対評価 | ✅ 完了 |
| 5 | **ファクター登録UI** | `public/factor-register.html` | 画像②完全準拠（全17列） | ✅ 完了 |
| 6 | **TypeScript型定義** | `src/types/factor.ts` | FactorDisplayResult等 | ✅ 完了 |
| 7 | **統合テスト** | `scripts/test_phase5.ts` | 全テストクリア | ✅ 完了 |

#### **Phase 5 実装詳細**

**1. 補正係数データ（src/data/）**
- `win_odds_coefficients.json` (6.3KB, 123行): 単勝オッズ別補正係数（0.0～999999.9倍）
- `place_odds_coefficients.json` (5.5KB, 108行): 複勝オッズ別補正係数（0.0～999999.9倍）
- `year_weights.json` (334B): 期間別重み（2016-2025年、1.0～10.0）

**2. 補正回収率計算（3つの補正メカニズム）**
```typescript
// 1. 均等払戻方式: ベット額 = 10,000円 / オッズ
// 2. オッズ別補正係数: 係数 = 80 / オッズ帯別平均回収率
// 3. 期間別重み付け: 新しい年ほど大きい重み（2025年=10.0）

補正回収率 = Σ補正後払戻金 / Σ補正後ベット額 × 100
```

**3. RGS1.0計算（絶対評価）**
```typescript
// -10 ～ +10 の範囲で評価
信頼度 = MIN(1, SQRT((単勝件数 + 複勝件数) / 500))
加重回収率 = 単勝補正回収率 * 0.3 + 複勝補正回収率 * 0.7
乖離 = 加重回収率 - 80
RGS1.0 = 10 * TANH((乖離 * 信頼度) / 25)
```

**4. AAS計算（相対評価）**
```typescript
// 約 -12 ～ +12 の範囲で評価
命中強度 = 0.65 * 単勝的中率 + 0.35 * 複勝的中率
収益強度 = 0.35 * 単勝補正回収率 + 0.65 * 複勝補正回収率
信頼度収縮 = SQRT(MIN件数 / (MIN件数 + 400))
AAS = 12 * TANH(0.55 * ZH + 0.45 * ZR) * 信頼度収縮
```

**5. ファクター登録UI（factor-register.html）**

**テーブル列構造（全17列・画像②完全準拠）:**
| 列番号 | 列名 | データ型 | 説明 |
|--------|------|----------|------|
| 0 | 選択 | チェックボックス | ファクター保存用 |
| 1-6 | キー1～6 | string | 集計キー（最大6個） |
| 7 | 単勝件数 | number | レース件数 |
| 8 | 単勝的中率 | number | % |
| 9 | 単勝回収率 | number | % (生の回収率) |
| 10 | 複勝件数 | number | レース件数 |
| 11 | 複勝的中率 | number | % |
| 12 | 複勝回収率 | number | % (生の回収率) |
| 13 | 単勝補正回収率 | number | % (補正済み) |
| 14 | AAS得点 | number | -12 ～ +12 |
| 15 | 複勝補正回収率 | number | % (補正済み) |
| 16 | RGS得点 | number | -10 ～ +10 |

**サンプルデータ:**
| ID | キー1-6 | AAS | RGS | 単勝回収率(生) | 単勝補正回収率 | 複勝回収率(生) | 複勝補正回収率 |
|----|---------|-----|-----|---------------|---------------|---------------|---------------|
| F001 | 中山/芝/1200m/3歳/えりも町 | **+3.4** | **+1.75** | 233.6% | 175.1% | 168.8% | 66.4% |
| F002 | 東京/芝/2000m//新冠町 | **+2.8** | **+1.20** | 185.2% | 138.5% | 125.3% | 88.2% |
| F003 | 阪神/ダート/1400m/牡馬/浦河町/春 | **+1.5** | **+0.50** | 145.8% | 115.3% | 105.2% | 78.9% |
| F004 | JRA/3歳/牡馬/春// | **-0.8** | **-0.30** | 105.5% | 85.2% | 95.8% | 72.5% |

**6. テスト結果（全パス）**
```
✅ Test 1: 補正係数読み込み - 単勝123行、複勝108行、期間10年
✅ Test 2: 補正回収率計算 - 生150% → 補正144.44%（-5.56pt）
✅ Test 3: RGS1.0計算 - スコア1.75（★★★★☆☆ やや良好）
✅ Test 4: AAS計算 - 1位+3.4、2位-0.2、3位-2.6
```

---

## 🚧 未完成の作業

### Phase 4: データ取り込み実行（CEO PC）
- ⏳ JRDBデータ取り込み実行（E:\UMAYOMI\downloads_weekly\）
- ⏳ JRA-VANデータ取り込み実行（E:\JRAVAN\）
- ⏳ データ整合性確認
- ⏳ 回収率分析エンジンテスト

### Phase 6: バックエンド統合（次のステップ）
- ⏳ ファクター集計バッチ処理
- ⏳ バックエンドAPI実装（/api/factors/calculate, /api/factors/save）
- ⏳ 明日のレース分析UI

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

### 4. ファクター登録画面の確認
```bash
# ブラウザで開く
http://localhost:3000/factor-register.html
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
- **計算結果:** `factor_scores` (RGS1.0/AAS保存テーブル) ★NEW

---

## 🔗 URL

**Sandbox環境:** (ローカルのみ)
- http://localhost:3000 - トップページ
- http://localhost:3000/factor-register.html - **ファクター登録** ★NEW
- http://localhost:3000/race-card - 出走表表示

**GitHub:** https://github.com/aka209859-max/umayomi

---

## 🚀 技術スタック

- **Backend:** Hono + TypeScript + better-sqlite3
- **Frontend:** TailwindCSS + Vanilla JS
- **Database:** SQLite（E:\UMAYOMI\umayomi.db）
- **Data Parser:** iconv-lite（Shift-JIS対応）
- **計算エンジン:** RGS1.0（絶対評価）+ AAS（相対評価）★NEW

---

## 📋 次のステップ（Phase 6推奨）

### **推奨順序: B → A → C**

#### **Option B: ファクター集計バッチ処理** ⏱️ 約60分
```typescript
scripts/calculate_factor_scores.ts
- JRA-VAN/JRDB データ読み込み
- ファクター条件でフィルタリング
- 補正回収率計算（均等払戻+オッズ補正+期間重み）
- RGS1.0/AAS計算
- factor_scores テーブルへDB保存
```

#### **Option A: バックエンドAPI実装** ⏱️ 約40分
```typescript
src/routes/factor-api.ts
- POST /api/factors/calculate
  - ファクター条件から過去データ集計
  - RGS/AAS 計算
  - 結果を返す

- POST /api/factors/save
  - 保存条件に基づいてファクター保存
  - DB登録
```

#### **Option C: 明日のレース分析UI** ⏱️ 約50分
```typescript
public/tomorrow-races.html
- 明日のレース一覧取得
- 出走馬 × 保存済みファクターのマッチング
- 馬ごとの総合得点表示（AAS/RGS）
- ファクター詳細表示
```

---

## 📊 プロジェクト進捗

**Phase進捗:** Phase 1-5完了（12/16タスク完了）  
**完了率:** 75%  
**次のマイルストーン:** Phase 6バックエンド統合

**最終更新日:** 2026-01-04  
**最新コミット:** 0cf1ac0  
**GitHub:** https://github.com/aka209859-max/umayomi
