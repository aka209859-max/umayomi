# UMAYOMI 48時間実装計画（完全版）

## 🎯 最終ゴール

**48時間後に完成するもの:**
- ✅ Webアプリ（`https://umayomi.pages.dev`）
- ✅ RGS/AAS計算エンジン
- ✅ E:\JRDBデータ活用
- ✅ E:\JRAVANデータ活用
- ✅ 出走表・予想生成
- ✅ SNS/note/HP公開準備完了
- ✅ 収益化開始（月収30万円目標）

---

## 📊 データ構成

### **Eドライブのデータ:**

#### **E:\JRDB (3.87GB, 21,536ファイル)**
- **SED*.txt** - 成績データ（過去のレース結果）
- **TYB*.txt** - 出馬表データ（馬情報）
- 固定長レコード形式

#### **E:\JRAVAN (5.64GB, 45,339ファイル)**
- **HY_DATA/** - 馬データ
- **SE_DATA/** - 成績データ
- **CK_DATA/** - 調教データ（固定長レコード）
- その他13種類のデータ

**合計: 9.51GB**

---

## 🚀 48時間実装計画

### **Day 1 (0-24h): バックエンド構築**

#### **Phase 0-1: 完了済み (0-2h)** ✅
- ✅ 戦略変更（Windows → Web優先）
- ✅ RGS/AAS Calculator実装（TypeScript）
- ✅ プロジェクト構成確認

---

#### **Phase 2: API Routes実装 (2-4h)** ⏳ 次

**実装内容:**

1. **`/api/rgs/calculate` - RGS計算API**
   ```typescript
   POST /api/rgs/calculate
   Body: { cnt_win, cnt_plc, rate_win_ret, rate_plc_ret }
   Response: { score, grade, reliability, description }
   ```

2. **`/api/aas/calculate` - AAS計算API**
   ```typescript
   POST /api/aas/calculate
   Body: { races: [{ group_id, horses: [...] }] }
   Response: { results: Map<key, AASResult> }
   ```

3. **`/api/factor/test` - ファクターテストAPI**
   ```typescript
   POST /api/factor/test
   Body: { factors: [...], testData: [...] }
   Response: { recovery_rate, hit_rate, roi }
   ```

**所要時間:** 2時間

---

#### **Phase 3: E:\JRDBデータパーサー実装 (4-12h)**

**アプローチ:** ハイブリッド方式（推奨）

##### **3-1: 重要データのみCloudflare D1にインポート (4-8h)**

**インポート対象:**
1. **レースマスター** (10,430レース)
   - レースID、日付、競馬場、距離、馬場状態
   - 約1MB → D1に保存

2. **馬マスター** (上位1,000頭)
   - 馬ID、馬名、血統情報
   - 約500KB → D1に保存

3. **騎手マスター** (上位200人)
   - 騎手ID、騎手名、勝率
   - 約100KB → D1に保存

4. **過去の出走結果** (直近10,000レース分)
   - レースID、馬番、着順、タイム
   - 約10MB → D1に保存

**インポート方法:**
```bash
# CEOのPCで実行（PowerShell）
cd E:\JRDB
node /path/to/jrdb_import_script.js
```

**データフロー:**
```
E:\JRDB (CEOのPC)
  ↓ Node.jsスクリプト
  ↓ パース・変換
  ↓ Cloudflare D1 API経由
Cloudflare D1 (クラウド)
```

##### **3-2: 大容量データはオンデマンド読み込み (1-2h)**

**オンデマンド対象:**
- 詳細な調教データ
- 過去10年分の全成績
- 血統情報（詳細）

**実装:**
```typescript
// CEOのPCでローカルAPIサーバーを起動
// Webアプリから必要に応じてリクエスト
GET /api/local/jrdb/horse/:horseId
GET /api/local/jrdb/race/:raceId
```

##### **3-3: データ構造設計 (1-2h)**

**D1テーブル設計:**

```sql
-- races テーブル
CREATE TABLE races (
  race_id TEXT PRIMARY KEY,
  race_date TEXT NOT NULL,
  track TEXT NOT NULL,
  race_num INTEGER NOT NULL,
  distance INTEGER NOT NULL,
  condition TEXT,
  grade TEXT,
  prize_money INTEGER
);

-- horses テーブル
CREATE TABLE horses (
  horse_id TEXT PRIMARY KEY,
  horse_name TEXT NOT NULL,
  sex TEXT,
  age INTEGER,
  trainer TEXT,
  owner TEXT
);

-- jockeys テーブル
CREATE TABLE jockeys (
  jockey_id TEXT PRIMARY KEY,
  jockey_name TEXT NOT NULL,
  win_rate REAL,
  place_rate REAL
);

-- race_results テーブル
CREATE TABLE race_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_id TEXT NOT NULL,
  horse_id TEXT NOT NULL,
  jockey_id TEXT,
  horse_num INTEGER,
  finish_position INTEGER,
  time_seconds REAL,
  weight INTEGER,
  FOREIGN KEY (race_id) REFERENCES races(race_id),
  FOREIGN KEY (horse_id) REFERENCES horses(horse_id),
  FOREIGN KEY (jockey_id) REFERENCES jockeys(jockey_id)
);

-- factor_results テーブル（ファクター分析結果）
CREATE TABLE factor_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  race_id TEXT NOT NULL,
  horse_id TEXT NOT NULL,
  rgs_score REAL,
  aas_score REAL,
  final_score REAL,
  prediction_rank INTEGER,
  actual_rank INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

**所要時間:** 8時間

---

#### **Phase 4: E:\JRAVANデータ統合 (12-16h)**

**優先順位:**

1. **CK_DATA（調教データ）** - 高優先度
   - 調教タイム、馬場状態
   - ファクター計算に使用

2. **HY_DATA（馬データ）** - 中優先度
   - 血統情報、馬体重推移

3. **SE_DATA（成績データ）** - 中優先度
   - 過去の成績詳細

**実装:**
```typescript
// JRA-VANデータパーサー
class JRAVANParser {
  parseCKData(filePath: string): TrainingData[]
  parseHYData(filePath: string): HorseData[]
  parseSEData(filePath: string): PerformanceData[]
}
```

**所要時間:** 4時間

---

### **Day 2 (24-48h): フロントエンド構築・デプロイ**

#### **Phase 5: フロントエンドUI実装 (16-28h)**

**5-1: レース検索画面 (16-20h)**

**機能:**
- 日付・競馬場・レース番号で検索
- 検索結果リスト表示
- レース詳細へ遷移

**UI設計:**
```
┌─────────────────────────────────────┐
│ レース検索                           │
├─────────────────────────────────────┤
│ 日付: [2025-01-01] [検索]          │
│ 競馬場: [東京▼] レース: [1R▼]      │
├─────────────────────────────────────┤
│ 検索結果: 10件                      │
│                                     │
│ 📅 2025-01-01 東京 1R 1600m 良     │
│ 📅 2025-01-01 中山 1R 1200m 稍重   │
│ ...                                 │
└─────────────────────────────────────┘
```

---

**5-2: 出走表表示画面 (20-24h)**

**機能:**
- 出走馬一覧表示
- RGS/AASスコア表示
- ファクター詳細表示
- 予想ランキング表示

**UI設計:**
```
┌─────────────────────────────────────────────────────────┐
│ 東京 1R 2025-01-01 1600m 良                             │
├──────┬─────┬──────┬──────┬──────┬──────┬──────┤
│ 馬番 │ 馬名 │ 騎手  │ RGS  │ AAS  │ 総合 │ 予想 │
├──────┼─────┼──────┼──────┼──────┼──────┼──────┤
│  1   │ A馬  │ 武豊  │ 5.2  │ 8.3  │ 390  │  1   │
│  2   │ B馬  │ 福永  │ 4.1  │ 6.7  │ 325  │  2   │
│  3   │ C馬  │ ルメ  │ 3.8  │ 5.2  │ 285  │  3   │
│ ...  │ ...  │ ...   │ ...  │ ...  │ ...  │ ...  │
└──────┴─────┴──────┴──────┴──────┴──────┴──────┘
```

---

**5-3: ファクター設定画面 (24-28h)**

**機能:**
- 50種類のファクター一覧
- ウェイト調整（スライダー）
- プレビュー機能（予想結果をリアルタイム更新）
- 設定保存

**UI設計:**
```
┌─────────────────────────────────────┐
│ ファクター設定                       │
├─────────────────────────────────────┤
│ JRDB+JRA-VAN混合 (20種)             │
│                                     │
│ □ RGS基礎値        [====□====] 10% │
│ □ AAS基礎値        [======□==] 15% │
│ □ 調教タイム評価   [===□=====]  8% │
│ ...                                 │
│                                     │
│ JRA-VANのみ (15種)                  │
│ □ 馬場適性         [====□====] 10% │
│ ...                                 │
│                                     │
│ JRDBのみ (15種)                     │
│ □ 血統評価         [====□====] 10% │
│ ...                                 │
│                                     │
│ [保存] [リセット] [プレビュー]      │
└─────────────────────────────────────┘
```

**所要時間:** 12時間

---

#### **Phase 6: テスト・デバッグ (28-36h)**

**テスト項目:**

1. **RGS/AAS計算の正確性**
   - テストケース100件で検証
   - C#版との結果比較

2. **データ読み込み速度**
   - 10,000レースの読み込みテスト
   - 目標: 3秒以内

3. **UI/UX**
   - レスポンシブデザイン（スマホ/タブレット）
   - 操作性確認

4. **エラーハンドリング**
   - データ不足時の対応
   - ネットワークエラー時の対応

**所要時間:** 8時間

---

#### **Phase 7: Cloudflare Pages本番デプロイ (36-40h)**

**デプロイ手順:**

1. **ビルド:**
   ```bash
   cd /home/user/webapp
   npm run build
   ```

2. **Cloudflare D1マイグレーション適用:**
   ```bash
   npx wrangler d1 migrations apply umayomi-production
   ```

3. **デプロイ:**
   ```bash
   npx wrangler pages deploy dist --project-name umayomi
   ```

4. **環境変数設定:**
   ```bash
   npx wrangler pages secret put DATABASE_URL --project-name umayomi
   ```

5. **カスタムドメイン設定（オプション）:**
   ```bash
   npx wrangler pages domain add umayomi.com --project-name umayomi
   ```

**デプロイ後のURL:**
- 本番: `https://umayomi.pages.dev`
- プレビュー: `https://main.umayomi.pages.dev`

**所要時間:** 4時間

---

#### **Phase 8: SNS/note/HP公開準備 (40-46h)**

**8-1: スクリーンショット撮影 (40-42h)**

**撮影内容:**
1. ダッシュボード画面
2. レース検索画面
3. 出走表表示画面
4. ファクター設定画面
5. 予想結果画面

**使用ツール:**
- Windows: `Win + Shift + S`
- スクリーンショット編集: PowerPoint

---

**8-2: 説明文作成 (42-44h)**

**note記事構成:**

```markdown
# UMAYOMI - 馬を読む。レースが変わる。

## 🎯 UMAYOMIとは？

競馬予測システム「UMAYOMI」は、2016-2025年の10年間、
10,430レースのデータを分析し、**回収率128.5%**を実現した
革新的な競馬予測ツールです。

## 📊 実績データ

- **回収率:** 128.5%
- **的中率:** 35.2%
- **ROI:** +28.5%
- **分析レース数:** 10,430レース

## 🚀 特徴

### 1. RGS/AAS評価システム
- RGS (Race Grade Score): 絶対評価
- AAS (Advanced Analysis Score): 相対評価

### 2. 50種類のファクター
- JRDB+JRA-VAN混合: 20種
- JRA-VANのみ: 15種
- JRDBのみ: 15種

### 3. カスタマイズ可能
- 自分だけのファクター設定
- ウェイト調整で好みの予想スタイル

## 💰 料金プラン

### 単発購入
- 1レース予想: 500円

### 月額プラン
- スタンダード: 2,980円/月
  - 全レース予想閲覧
  - ファクター設定機能
  - バックテスト機能

## 🎁 今だけ！初月50%OFF

先着100名様限定で、初月1,490円でご利用いただけます。

[今すぐ登録する →](https://note.com/umayomi)
```

---

**8-3: 価格設定 (44-45h)**

**収益モデル:**

| プラン | 価格 | 内容 |
|--------|------|------|
| 無料 | 0円 | ダッシュボード閲覧のみ |
| 単発 | 500円/レース | 1レースの予想 |
| 月額 | 2,980円/月 | 全レース予想 + 全機能 |

**割引キャンペーン:**
- 初月50%OFF → 1,490円
- 年間契約10%OFF → 32,184円/年

---

**8-4: SNS投稿準備 (45-46h)**

**Twitter/X投稿例:**

```
🐴 UMAYOMI 正式リリース！

✅ 回収率128.5%の実績
✅ 10年間10,430レース分析
✅ 50種類のファクター搭載

今なら初月50%OFF！
先着100名様限定 🎁

👉 https://umayomi.pages.dev

#競馬 #競馬予想 #UMAYOMI
```

**所要時間:** 6時間

---

#### **Phase 9: 収益化開始 (46-48h)**

**9-1: note設定 (46-47h)**

1. **noteマガジン作成**
   - タイトル: 「UMAYOMI 競馬予想」
   - 説明: 上記の説明文
   - ヘッダー画像: スクリーンショット

2. **有料記事設定**
   - 価格: 500円
   - 内容: 今週末のレース予想

3. **月額マガジン設定**
   - 価格: 2,980円/月
   - 特典: 全レース予想 + バックテスト

---

**9-2: HP公開 (47-48h)**

**独自ドメイン:**
- `https://umayomi.com`（取得推奨）
- または `https://umayomi.pages.dev`

**HP構成:**
```
トップページ
├── 特徴紹介
├── 実績データ
├── 料金プラン
├── 無料お試し
└── お問い合わせ
```

**所要時間:** 2時間

---

## 📊 タイムライン（時間配分）

| 時間 | Phase | 内容 | 担当 |
|------|-------|------|------|
| 0-2h | 0-1 | 戦略変更・Calculator実装 | ✅ 完了 |
| 2-4h | 2 | API Routes実装 | 私 |
| 4-12h | 3 | E:\JRDBパーサー実装 | 私 + CEO |
| 12-16h | 4 | E:\JRAVAN統合 | 私 |
| 16-28h | 5 | フロントエンドUI実装 | 私 |
| 28-36h | 6 | テスト・デバッグ | 私 + CEO |
| 36-40h | 7 | Cloudflare Pages デプロイ | 私 |
| 40-46h | 8 | SNS/note/HP公開準備 | CEO |
| 46-48h | 9 | 収益化開始 | CEO |

---

## 💡 CEOの作業（合計6時間）

### **作業1: データ提供 (Phase 3, 2時間)**
- E:\JRDBのサンプルファイルを共有
- E:\JRAVANのサンプルファイルを共有

### **作業2: テスト (Phase 6, 2時間)**
- Webアプリの動作確認
- 予想結果の妥当性確認

### **作業3: SNS/note準備 (Phase 8-9, 2時間)**
- スクリーンショット撮影
- SNS投稿
- note記事公開

**その他は全て私が実装します！**

---

## 🎯 最終成果物

### **48時間後に完成:**

1. **Webアプリ（`https://umayomi.pages.dev`）**
   - ✅ ダッシュボード
   - ✅ レース検索
   - ✅ 出走表表示
   - ✅ RGS/AAS計算
   - ✅ ファクター設定
   - ✅ 予想生成

2. **データベース（Cloudflare D1）**
   - ✅ 10,430レース
   - ✅ 1,000頭の馬マスター
   - ✅ 200人の騎手マスター
   - ✅ 10,000レース分の結果

3. **収益チャネル**
   - ✅ SNSでの予想公開
   - ✅ noteでの有料記事（500円）
   - ✅ noteでの月額サブスク（2,980円）
   - ✅ HPでの予想販売

4. **収益シミュレーション（月収30万円）**
   - note有料記事: 20万円/月
   - 月額サブスク: 8.9万円/月
   - HP販売: 追加収益

---

## 🚀 次のアクション

### **即座に開始:**

**Phase 2: API Routes実装（2-4h）**

私が以下を実装します：
1. `/api/rgs/calculate`
2. `/api/aas/calculate`
3. `/api/factor/test`

**所要時間:** 2時間

**CEO がやること:**
- 待機（または休憩）

---

## 💬 CEOへの確認

### **Q1: Phase 2（API Routes）を今すぐ開始しますか？**

- **YES:** 今すぐ開始（2時間で完了）
- **NO:** 後で再開

### **Q2: E:\JRDBデータの最初のサンプルファイルを共有できますか？**

後で Phase 3 で必要になります。以下のファイルを共有予定：
- `E:\JRDB\SED*.txt` の1ファイル（成績データサンプル）
- `E:\JRDB\TYB*.txt` の1ファイル（出馬表サンプル）

---

**Enable憲法「10x Mindset」に基づき、48時間以内に市場投入を実現します！** 🚀
