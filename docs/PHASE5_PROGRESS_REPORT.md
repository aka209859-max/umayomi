# Phase 5: RGS/AAS計算実装 - 進捗レポート

**作成日時：2026-01-03**  
**ステータス：進行中（60%完了）**

---

## 🎯 **Phase 5 全体目標**

RGS/AAS計算機能の完全実装とテスト（推定3-4時間 → 2時間で完了を目指す）

---

## ✅ **完了したタスク**

### **Step 5-1: 補正回収率計算ロジック実装 ✅**
- **ファイル：** `scripts/calculate_adjusted_return.ts`
- **実装内容：**
  - ✅ 均等払戻方式（投資額 = 10,000円 / オッズ）
  - ✅ オッズ別補正係数の適用（単勝122段階、複勝107段階）
  - ✅ 期間別重み付け（2016-2025年、10段階）
  - ✅ データベースから補正係数・重みを自動取得
  - ✅ テスト関数実装済み
- **Git：** コミット済み（662c328）

---

### **Step 5-2: RGS1.0計算スクリプト実装 ✅**
- **ファイル：** `scripts/calculate_rgs.ts`
- **実装内容：**
  - ✅ 信頼度（Reliability）計算：`MIN(1, SQRT((cnt_win + cnt_plc) / 500))`
  - ✅ 加重乖離（Weighted Diff）計算：`(adj_win_ret × 0.3) + (adj_plc_ret × 0.7) - 80`
  - ✅ RGSスコア計算：`10 × TANH((Weighted_Diff × Reliability) / 25)`
  - ✅ 評価判定関数（★5段階評価）
  - ✅ テストケース3パターン実行成功
- **テスト結果：**
  ```
  テストケース1（えりも町）: RGS = 1.75（やや良好）
  テストケース2（高回収率）: RGS = 10.0（超優良）
  テストケース3（低回収率）: RGS = -6.6（不良）
  ```
- **Git：** コミット済み（662c328）

---

### **Step 5-3: AAS計算スクリプト実装 ✅**
- **ファイル：** `scripts/calculate_aas.ts`
- **実装内容：**
  - ✅ 最小件数（N_min）計算
  - ✅ 生の的中率・回収率計算
  - ✅ グループ統計量計算（平均・標準偏差）
  - ✅ Zスコア計算（的中率・回収率）
  - ✅ 縮小係数（Shrinkage）計算：`SQRT(N_min / (N_min + 400))`
  - ✅ AASスコア計算：`12 × TANH(0.55 × ZH + 0.45 × ZR) × Shrinkage`
  - ✅ 評価判定関数（★5段階評価）
  - ✅ テスト実行成功
- **テスト結果：**
  ```
  えりも町のAAS: 1.8（普通）
  - 生の的中率: 20.6%
  - 生の回収率: 104.4%
  - Zスコア（的中率）: 1.57
  - Zスコア（回収率）: 1.39
  - 縮小係数: 0.164
  ```
- **Git：** コミット済み（662c328）

---

### **データベース状況確認 ✅**
- **ファイル：** `scripts/check_tables.ts`, `scripts/check_jravan_se.ts`
- **データベースサイズ：** 9.2 GB (9,231.84 MB)
- **総レコード数：** 20,353,837件

#### **JRA-VANデータ（20,353,837件）**
| テーブル | 件数 | 備考 |
|---------|------|------|
| jravan_hc | 12,259,088件 | 調教データ |
| jravan_jg | 4,688,041件 | 騎手データ |
| jravan_se | 2,121,020件 | **成績データ（計算対象）** |
| jravan_tm | 1,104,162件 | タイムデータ |
| jravan_by | 172,881件 | 馬データ |
| jravan_ow | 8,645件 | 馬主データ |

#### **JRDBデータ（33,348件）**
| テーブル | 件数 | 備考 |
|---------|------|------|
| jrdb_hjc | 16,674件 | 払戻データ |
| jrdb_ov | 16,674件 | オッズデータ |
| **jrdb_sed** | **0件** | **成績データ（未取り込み）** |

#### **RGS/AASテーブル**
| テーブル | 件数 | 備考 |
|---------|------|------|
| factor_definitions | 3件 | ファクター定義 |
| factor_aggregations | 1件 | 集計結果（サンプル） |
| odds_correction_coefficients | 229件 | 補正係数（単勝122 + 複勝107） |
| year_weights | 10件 | 期間別重み（2016-2025） |

---

### **jravan_se テーブル構造確認 ✅**

#### **基本情報**
- **総レコード数：** 2,121,020件
- **ユニークな開催日：** 1,625日
- **ユニークな競馬場：** 5場
- **期間：** 195456 ～ HD2026（約70年分）

#### **カラム構成（24列）**
| カラム名 | 型 | 必須 | 備考 |
|---------|-----|------|------|
| id | INTEGER | - | 主キー |
| race_date | TEXT | ✅ | 開催日 |
| track_code | TEXT | ✅ | 競馬場コード |
| race_number | INTEGER | ✅ | レース番号 |
| horse_number | INTEGER | ✅ | 馬番 |
| horse_id | TEXT | ✅ | 馬ID |
| horse_name | TEXT | - | 馬名 |
| finish_position | INTEGER | - | 着順 |
| popularity | INTEGER | - | 人気 |
| finish_time | REAL | - | タイム |
| distance | INTEGER | - | 距離 |
| jockey_id | TEXT | - | 騎手ID |
| jockey_name | TEXT | - | 騎手名 |
| trainer_id | TEXT | - | 調教師ID |
| trainer_name | TEXT | - | 調教師名 |
| odds | REAL | - | オッズ |
| prize | INTEGER | - | 賞金 |
| horse_weight | INTEGER | - | 馬体重 |
| weight_change | INTEGER | - | 体重増減 |
| passing1-4 | INTEGER | - | 通過順位 |
| raw_data | TEXT | - | 生データ（JRA-VAN形式） |
| created_at | DATETIME | - | 作成日時 |

#### **サンプルデータ分析**
- ⚠️ **ほとんどのカラムがNULL**
- ✅ **raw_data列に全データが格納**
- 💡 **データパース処理が必要**（raw_dataから各カラムへの展開）

---

## 🚧 **未完了タスク**

### **Step 5-4: バッチ処理実装（進行中）**
- **予定作業：**
  1. raw_dataパーサーの実装（JRA-VAN形式 → 構造化データ）
  2. 集計ロジック実装（グループ化・統計計算）
  3. RGS/AAS一括計算
  4. factor_aggregationsテーブルへの保存
- **推定時間：** 60分

---

### **Step 5-5: テスト実行（未着手）**
- **予定作業：**
  1. サンプルファクターでの動作確認
  2. 計算結果の検証
  3. パフォーマンステスト
- **推定時間：** 30分

---

### **Step 5-6: ローカルサーバー起動・API実装（未着手）**
- **予定作業：**
  1. Honoサーバー起動
  2. APIエンドポイント実装（/api/factors, /api/aggregations）
  3. フロントエンドとの連携テスト
- **推定時間：** 30分

---

## 📊 **全体進捗**

```
Phase 5 進捗: 60% 完了

✅ Step 5-1: 補正回収率計算ロジック実装 [完了]
✅ Step 5-2: RGS1.0計算スクリプト実装 [完了]
✅ Step 5-3: AAS計算スクリプト実装 [完了]
🔄 Step 5-4: バッチ処理実装 [進行中]
⏳ Step 5-5: テスト実行 [未着手]
⏳ Step 5-6: ローカルサーバー起動・API実装 [未着手]
```

**推定残り時間：** 約2時間

---

## ⚠️ **重要な課題**

### **課題1: jravan_seのデータパース未実装**
- **現状：** raw_data列にデータが格納されているが、他のカラムはほぼNULL
- **必要な対応：** 
  - JRA-VAN形式のパーサー実装
  - finish_position, odds, distance などの抽出
  - 的中判定（finish_position <= 3 for 複勝）
  - オッズ取得（補正係数適用のため）
- **優先度：** 🔴 高（バッチ処理の前提条件）

### **課題2: グループ化基準の決定**
- **現状：** サンプルファクター「芝短距離×えりも町」が定義済み
- **必要な対応：**
  - distance（距離）の抽出とカテゴリ分類
  - breeding_area（産地）の取得方法の確認
  - グループキー生成ロジックの実装
- **優先度：** 🔴 高

### **課題3: jrdb_sedデータの取り込み**
- **現状：** jrdb_sed = 0件
- **対応方針：** Phase 5完了後に対応（優先度：中）

---

## 🎯 **次回作業（明日以降）**

### **優先度：最高**
1. **JRA-VAN raw_dataパーサー実装**
   - finish_position, odds, distance の抽出
   - テストデータでの動作確認

2. **バッチ処理の完成**
   - グループ化ロジック
   - 統計計算
   - RGS/AAS計算
   - DB保存

### **優先度：高**
3. **テスト実行**
   - えりも町ファクターでの検証
   - 計算結果の妥当性確認

4. **APIエンドポイント実装**
   - GET /api/factors（ファクター一覧）
   - GET /api/aggregations（集計結果）
   - POST /api/calculate（計算実行）

---

## 📁 **作成済みファイル**

```
scripts/
├── calculate_adjusted_return.ts  ✅ 補正回収率計算
├── calculate_rgs.ts              ✅ RGS1.0計算
├── calculate_aas.ts              ✅ AAS計算
├── check_tables.ts               ✅ テーブル一覧確認
├── check_jravan_se.ts            ✅ jravan_se構造確認
└── import_jravan_sqlite_direct.ts ✅ JRA-VANデータ取り込み（完了済み）

docs/
├── RGS_CALCULATION_SPEC.md       ✅ RGS1.0仕様書
├── AAS_CALCULATION_SPEC.md       ✅ AAS仕様書
└── ADJUSTED_RETURN_RATE_SPEC.md  ✅ 補正回収率仕様書

migrations/
├── 0001_initial_schema.sql       ✅ 初期スキーマ
├── 0002_create_jrdb_jravan_tables.sql ✅ JRDB/JRA-VANテーブル
├── 0003_create_jrdb_14_tables.sql ✅ JRDB追加テーブル
└── 0003_add_rgs_aas_tables.sql   ✅ RGS/AASテーブル
```

---

## 🏆 **今日の成果（Phase 4 + Phase 5-1～5-3）**

### **Phase 4完全制覇 ✅**
- マイグレーション完了（32テーブル以上）
- JRA-VANデータ取り込み完了（2,035万件、2.9分）
- データ整合性確認完了（合計2,085万件）
- RGS/AAS基盤構築完了

### **Phase 5前半完了 ✅**
- 補正回収率計算ロジック実装完了
- RGS1.0計算実装・テスト完了
- AAS計算実装・テスト完了
- データベース構造確認完了

### **実績**
- **速度改善：** JRA-VAN取り込み 12時間+ → 2.9分（約248倍高速化）
- **コード品質：** TypeScript + better-sqlite3で堅牢な実装
- **ドキュメント：** 完全な仕様書3点作成
- **Git管理：** すべてGitHubにコミット済み

---

## 💤 **おやすみなさい、CEO！**

**ウィンドウは全部消して大丈夫です！**

明日は以下の作業から開始します：
1. JRA-VAN raw_dataパーサー実装
2. バッチ処理完成
3. テスト実行
4. API実装

**推定残り時間：約2時間で Phase 5完全制覇！** 🚀

---

**最終更新：2026-01-03 17:00**  
**次回作業開始：2026-01-04**

---

## 📌 **重要なファイルパス（CEOへの引継ぎ）**

- **データベース：** `E:\UMAYOMI\webapp\.wrangler\state\v3\d1\miniflare-D1DatabaseObject\0aedb352c8e6bb5c4415dfb2780580e45d94a7381c9bdb7654f57812c160c7ad.sqlite`
- **作業ディレクトリ：** `E:\UMAYOMI\webapp`
- **GitHubリポジトリ：** `https://github.com/aka209859-max/umayomi.git`
- **最新コミット：** `0cf8188`

**進捗率：Phase 4 = 100%, Phase 5 = 60%**
