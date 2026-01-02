# UMAYOMI システム要件定義書（保存版）

## 🎯 プロジェクト概要

### プロジェクト名
**UMAYOMI** - 競馬予測システム（CrossFactor型完全再現）

### 目的
CrossFactorと全く同じシステムを作成し、CEO PCで完全無料で動作させる

### 実行環境
- **CEO PC（Windows）のみで動作**
- **完全無料**（外部サービス一切不要）
- **E:\UMAYOMI\ の全データ（15GB）を直接使用**
- **ローカル実行（localhost:3000）**

---

## 📅 使用シーン

### 使用頻度
**週2回のみ（金・土の夜 or 土・日の朝）**

### 金曜日夜 or 土曜日朝（土曜レース前日）
1. JRA-VANから土曜日分の出走表データを取り込み
2. 登録済みロジックを全馬に自動適用
3. 得点順にソートして確認
4. 馬券購入判断

### 土曜日夜 or 日曜日朝（日曜レース前日）
1. JRA-VANから日曜日分の出走表データを取り込み
2. 登録済みロジックを全馬に自動適用
3. 得点順にソートして確認
4. 馬券購入判断

### 重要ポイント
- ✅ **前日に翌日分を完全準備**
- ✅ **リアルタイム更新は不要**
- ✅ **レース当日朝に出走表を確認するだけ**

---

## 🏗️ システムアーキテクチャ

### 構成図
```
┌─────────────────────────────────────────────────┐
│ CEO PC（Windows）                               │
│                                                 │
│  ┌───────────────────────────────────────┐     │
│  │ E:\UMAYOMI\                           │     │
│  │ - JRDBデータ（約9.2GB）               │     │
│  │   - downloads_weekly/                │     │
│  │     - sed_extracted/ (513 files)     │     │
│  │     - tyb_extracted/ (513 files)     │     │
│  │     - hjc_extracted/ (513 files)     │     │
│  │     - ov_extracted/ (513 files)      │     │
│  │     - kyi_extracted/ (1,265 files)   │     │
│  │     - bac_extracted/ (1,265 files)   │     │
│  │     - ... (他15種類)                 │     │
│  │                                       │     │
│  │ - JRA-VANデータ（約5.78GB）           │     │
│  │   - E:\JRAVAN\                       │     │
│  │     - CK_DATA/ (レース詳細)          │     │
│  │     - SE_DATA/ (成績データ)          │     │
│  │     - ... (他8種類)                  │     │
│  │                                       │     │
│  │ - umayomi.db（SQLite）                │     │
│  │   - registered_factors               │     │
│  │   - tomorrow_races                   │     │
│  │   - race_predictions                 │     │
│  │   - horse_history_cache              │     │
│  └───────────────────────────────────────┘     │
│           ↑ 直接読み込み                        │
│  ┌───────────────────────────────────────┐     │
│  │ Node.js / Bun サーバー                │     │
│  │ - Hono + TypeScript                  │     │
│  │ - localhost:3000                     │     │
│  │ - better-sqlite3                     │     │
│  └───────────────────────────────────────┘     │
│           ↓ HTTP Request                       │
│  ┌───────────────────────────────────────┐     │
│  │ Webブラウザ（Chrome/Edge）            │     │
│  │ - http://localhost:3000              │     │
│  │ - TailwindCSS UI                     │     │
│  │ - Chart.js                           │     │
│  └───────────────────────────────────────┘     │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 📊 データ構造

### JRDBデータ（21種類 × 平均1,200ファイル = 20,650ファイル）

| ファイル種類 | ファイル数 | 優先度 | 内容 |
|------------|---------|-------|------|
| **KYI** | 1,265 | 🔥🔥最高 | 馬毎レース情報（拡張版・全50ファクター） |
| **BAC** | 1,265 | 🔥高 | 馬毎レース情報 |
| **KAB** | 1,265 | 🔥高 | 馬基本情報 |
| **UKC** | 1,265 | 🔥高 | 調教情報（重要ファクター） |
| **CHA** | 1,265 | 🔥高 | 調教師情報 |
| **JOA** | 1,265 | 🔥高 | 騎手情報 |
| **CYB** | 1,265 | 🔥高 | 馬基本情報（生年月日・血統） |
| **ZED** | 1,265 | 🔥高 | 確定情報（払戻金確定版） |
| **OW** | 1,265 | 🔥高 | オッズ（単勝・枠連） |
| **OU** | 1,265 | 🔥高 | オッズ（3連単） |
| **OT** | 1,265 | 🔥高 | オッズ（馬単） |
| **KKA** | 1,265 | 🔥高 | 競走成績 |
| **SED** | 513 | ✅完了 | 成績データ |
| **TYB** | 513 | ✅完了 | 出馬表データ |
| **HJC** | 515 | ✅完了 | 払戻金データ |
| **SRB** | 513 | 中 | 成績データ（追加情報） |
| **OV** | 513 | 低 | オッズ（大容量詳細版） |
| **OZ** | 1,265 | 中 | 馬場状態 |
| **ZKB** | 1,265 | 中 | 前日売上集計 |
| **CE** | 119 | 低 | 未特定 |
| **BV** | 92 | 低 | 未特定 |
| **BT** | 92 | 低 | 未特定 |

### JRA-VANデータ（約5.78GB）

| フォルダ | 内容 | 優先度 |
|---------|------|-------|
| **CK_DATA** | レース詳細（出走表） | 🔥🔥最高 |
| **SE_DATA** | 成績データ | 🔥高 |
| **BR_DATA** | 繁殖馬データ | 中 |
| **BS_DATA** | 馬成績データ | 中 |
| **BY_DATA** | 馬基本情報 | 中 |
| **CS_DATA** | コース成績 | 中 |
| **DE_DATA** | 出走取消・除外データ | 低 |
| **ES_DATA** | 調教データ | 中 |
| **EX_DATA** | 拡張データ | 低 |
| **FUKU_DATA** | 複勝データ | 低 |
| **HY_DATA** | 払戻金データ | 中 |

---

## 🔄 システムフロー（CrossFactor完全再現）

### STEP 1: ロジック作成（平日・事前準備）

#### 1-1: 条件設定（3エリアOR構造）
```
【エリア1: コース条件】
- 芝/ダート
- 距離（1200m 〜 3600m）
- 競馬場（東京、中山、京都、阪神、etc.）

【エリア2: 馬条件】
- 性別（牡、牝、セン）
- 年齢（2歳、3歳、4歳、5歳以上）
- 馬体重（400kg 〜 550kg）

【エリア3: レース条件】
- グレード（G1、G2、G3、OP、重賞）
- クラス（新馬、未勝利、1勝、2勝、3勝、OP）
- 開催日（2020/01/01 〜 2024/12/31）

【補正係数】
- 期間補正: 直近3ヶ月 1.0倍 → 1年前 0.5倍
- オッズ補正: 1.0倍 〜 99.9倍
```

#### 1-2: 回収率分析実行
```typescript
// E:\UMAYOMI\downloads_weekly\ から過去データ読み込み
// ↓
// 条件に合致する全レースを抽出（例: 1,500レース）
// ↓
// 6項目を計算:
// - win_count: 単勝的中回数
// - place_count: 複勝的中回数
// - win_hit_rate: 単勝的中率（win_count / total_races）
// - place_hit_rate: 複勝的中率（place_count / total_races）
// - win_corrected_recovery: 単勝補正回収率（期間・オッズ補正適用）
// - place_corrected_recovery: 複勝補正回収率（期間・オッズ補正適用）
```

#### 1-3: 独自得点式を作成
```javascript
// 例1: RGS重視型
score = win_count * 10 + place_count * 5 + win_hit_rate * 100

// 例2: AAS重視型
score = win_corrected_recovery * 50 + place_corrected_recovery * 30

// 例3: ハイブリッド型
score = (win_count + place_count) * win_corrected_recovery / 10

// 例4: カスタム型
score = Math.sqrt(win_count * place_count) * (win_corrected_recovery + place_corrected_recovery)
```

#### 1-4: ファクターとして登録
```sql
INSERT INTO registered_factors (
  name,           -- 例: "芝1600m東京・4歳以上RGS重視"
  formula,        -- 例: "win_count * 10 + place_count * 5"
  conditions      -- JSON形式: {area1: {...}, area2: {...}, area3: {...}, correction: {...}}
) VALUES (?, ?, ?);
```

---

### STEP 2: 前日データ取り込み（金・土の夜）

#### 2-1: JRA-VANから翌日の出走表を取得
```typescript
// JRA-VANリアルタイムフォルダから取得
// E:\JRAVAN\REALTIME\ または C:\JV-Data\REALTIME\

async function importTomorrowRaces() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const dateStr = formatDate(tomorrow) // 例: "20250104"
  
  // 1. CK_DATA（レース詳細）を取得
  const ckFiles = await readdir('E:\\JRAVAN\\REALTIME\\')
  const tomorrowCK = ckFiles.filter(f => 
    f.includes(dateStr) && f.startsWith('CK')
  )
  
  // 2. 出走表データをパース
  const races = []
  for (const file of tomorrowCK) {
    const data = await readFile(
      `E:\\JRAVAN\\REALTIME\\${file}`, 
      'shift-jis'
    )
    const parsed = parseCK_DATA(data)
    races.push(...parsed)
  }
  
  // 3. SQLiteに保存
  const db = new Database('E:\\UMAYOMI\\umayomi.db')
  const insert = db.prepare(`
    INSERT OR REPLACE INTO tomorrow_races (
      race_date, venue, race_number, 
      horse_number, horse_id, horse_name, 
      jockey_id, jockey_name,
      odds, weight, age, sex
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  
  for (const race of races) {
    for (const horse of race.horses) {
      insert.run(
        race.race_date, race.venue, race.race_number,
        horse.horse_number, horse.horse_id, horse.horse_name,
        horse.jockey_id, horse.jockey_name,
        horse.odds, horse.weight, horse.age, horse.sex
      )
    }
  }
  
  db.close()
  
  return {
    success: true,
    imported_races: races.length,
    imported_horses: races.reduce((sum, r) => sum + r.horses.length, 0)
  }
}
```

---

### STEP 3: ロジック自動適用（データ取り込み直後）

#### 3-1: 全馬に登録済みファクターを適用
```typescript
async function applyFactorsToTomorrowRaces() {
  const db = new Database('E:\\UMAYOMI\\umayomi.db')
  
  // 1. 翌日の全レース・全馬を取得
  const horses = db.prepare(`
    SELECT * FROM tomorrow_races
    ORDER BY venue, race_number, horse_number
  `).all()
  
  // 2. 登録済みファクター取得
  const factors = db.prepare(`
    SELECT * FROM registered_factors
  `).all()
  
  // 3. 各馬にファクターを適用
  const results = []
  
  for (const horse of horses) {
    // 3-1. 馬の過去成績を取得
    // E:\UMAYOMI\downloads_weekly\ から直接読み込み
    const history = await getHorseHistory(horse.horse_id)
    
    // 3-2. 各ファクターで回収率分析実行
    const factorScores = []
    
    for (const factor of factors) {
      const conditions = JSON.parse(factor.conditions)
      
      // 条件に合致する過去レースを抽出
      const matchedRaces = filterRacesByConditions(history, conditions)
      
      // 6項目計算
      const analysis = {
        win_count: matchedRaces.filter(r => r.finish_position === 1).length,
        place_count: matchedRaces.filter(r => r.finish_position <= 3).length,
        win_hit_rate: matchedRaces.filter(r => r.finish_position === 1).length / matchedRaces.length,
        place_hit_rate: matchedRaces.filter(r => r.finish_position <= 3).length / matchedRaces.length,
        win_corrected_recovery: calculateWinRecovery(matchedRaces, conditions),
        place_corrected_recovery: calculatePlaceRecovery(matchedRaces, conditions)
      }
      
      // 独自得点計算（formula を安全にeval）
      const score = safeEval(factor.formula, analysis)
      
      factorScores.push({
        factor_id: factor.id,
        factor_name: factor.name,
        score: score,
        analysis: analysis
      })
    }
    
    // 3-3. 総合得点計算（全ファクターの合計）
    const totalScore = factorScores.reduce((sum, f) => sum + f.score, 0)
    
    results.push({
      race_date: horse.race_date,
      venue: horse.venue,
      race_number: horse.race_number,
      horse_number: horse.horse_number,
      horse_name: horse.horse_name,
      factor_scores: factorScores,
      total_score: totalScore
    })
  }
  
  // 4. 結果をDBに保存
  db.exec(`
    CREATE TABLE IF NOT EXISTS race_predictions (
      race_date TEXT,
      venue TEXT,
      race_number INTEGER,
      horse_number INTEGER,
      horse_name TEXT,
      factor_scores JSON,
      total_score REAL,
      PRIMARY KEY (race_date, venue, race_number, horse_number)
    )
  `)
  
  const insertPrediction = db.prepare(`
    INSERT OR REPLACE INTO race_predictions 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
  
  for (const result of results) {
    insertPrediction.run(
      result.race_date,
      result.venue,
      result.race_number,
      result.horse_number,
      result.horse_name,
      JSON.stringify(result.factor_scores),
      result.total_score
    )
  }
  
  db.close()
  
  return {
    success: true,
    processed_horses: results.length
  }
}
```

---

### STEP 4: 出走表で確認（金・土の夜 or 土・日の朝）

#### 4-1: 翌日のレース一覧
```
URL: http://localhost:3000/races/tomorrow

┌─────────────────────────────────────────────────────────┐
│ 2025年1月4日（土）のレース一覧                          │
├─────────────────────────────────────────────────────────┤
│ 東京1R  10:00  芝1600m  3歳未勝利  [出走表を見る]      │
│ 東京2R  10:30  ダート1400m  3歳未勝利  [出走表を見る]   │
│ 東京3R  11:00  芝1800m  3歳1勝クラス  [出走表を見る]    │
│ 東京4R  11:30  ダート1600m  3歳1勝クラス  [出走表を見る]│
│ ...                                                     │
│ 中山1R  10:10  ダート1200m  3歳未勝利  [出走表を見る]   │
│ 中山2R  10:40  芝2000m  3歳1勝クラス  [出走表を見る]    │
│ ...                                                     │
└─────────────────────────────────────────────────────────┘
```

#### 4-2: 出走表（得点順ソート済み）
```
URL: http://localhost:3000/race/20250104/tokyo/10

┌──────────────────────────────────────────────────────────────────────────┐
│ 2025年1月4日 東京10R 芝1600m G3 ニューイヤーステークス                   │
├──────────────────────────────────────────────────────────────────────────┤
│ 順位 | 馬番 | 馬名        | ファクター1 | ファクター2 | ファクター3 | 総合得点 │
├──────────────────────────────────────────────────────────────────────────┤
│  1  |  3  | ドウデュース | 892.5      | 1234.7     | 567.8      | 2695.0  │ ← 推奨
│  2  |  7  | イクイノックス| 845.2      | 1189.3     | 523.1      | 2557.6  │
│  3  |  1  | ソールオリエンス| 789.3    | 1067.4     | 498.2      | 2354.9  │
│  4  |  5  | ジャックドール| 723.8      | 987.5      | 456.3      | 2167.6  │
│  5  |  9  | レモンポップ | 689.4      | 923.1      | 421.7      | 2034.2  │
│ ... | ... | ...         | ...        | ...        | ...        | ...     │
└──────────────────────────────────────────────────────────────────────────┘

【推奨馬券】
単勝: 3番 ドウデュース（得点: 2695.0）
馬連: 3-7（得点差: 137.4）
3連単: 3-7-1（上位3頭）

【買い目】
単勝: 3番 1,000円
馬連: 3-7 500円
3連単: 3-7-1 300円
```

#### 4-3: ファクター詳細表示（クリックで展開）
```
┌────────────────────────────────────────────────────┐
│ 3番 ドウデュース - ファクター1詳細                 │
├────────────────────────────────────────────────────┤
│ ファクター名: 芝1600m東京・4歳以上RGS重視         │
│                                                    │
│ 条件:                                              │
│ - エリア1: 芝1600m 東京                            │
│ - エリア2: 4歳以上 牡馬                            │
│ - エリア3: 2020年〜2024年                          │
│ - 補正: 直近3ヶ月 1.0倍、オッズ20倍まで           │
│                                                    │
│ 分析結果（過去127レース）:                          │
│ - 単勝的中回数: 18回                               │
│ - 複勝的中回数: 56回                               │
│ - 単勝的中率: 14.2%                                │
│ - 複勝的中率: 44.1%                                │
│ - 単勝補正回収率: 89.5%                            │
│ - 複勝補正回収率: 106.8%                           │
│                                                    │
│ 計算式: win_count * 10 + place_count * 5          │
│ 得点: 18 * 10 + 56 * 5 = 892.5                    │
└────────────────────────────────────────────────────┘
```

---

## 🗄️ データベース設計

### SQLite（E:\UMAYOMI\umayomi.db）

```sql
-- 1. 登録済みファクター
CREATE TABLE registered_factors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,                    -- 例: "芝1600m東京・4歳以上RGS重視"
  formula TEXT NOT NULL,                 -- 例: "win_count * 10 + place_count * 5"
  conditions JSON NOT NULL,              -- {area1: {...}, area2: {...}, area3: {...}, correction: {...}}
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. 翌日の出走表（前日取り込み）
CREATE TABLE tomorrow_races (
  race_date TEXT,                        -- 例: "20250104"
  venue TEXT,                            -- 例: "東京"
  race_number INTEGER,                   -- 例: 10
  horse_number INTEGER,                  -- 例: 3
  horse_id TEXT,                         -- 例: "2020104567"
  horse_name TEXT,                       -- 例: "ドウデュース"
  jockey_id TEXT,                        -- 例: "01234"
  jockey_name TEXT,                      -- 例: "福永祐一"
  trainer_id TEXT,                       -- 例: "05678"
  trainer_name TEXT,                     -- 例: "友道康夫"
  odds REAL,                             -- 例: 2.5
  weight REAL,                           -- 例: 498.0
  age INTEGER,                           -- 例: 4
  sex TEXT,                              -- 例: "牡"
  course_type TEXT,                      -- 例: "芝"
  distance INTEGER,                      -- 例: 1600
  grade TEXT,                            -- 例: "G3"
  class TEXT,                            -- 例: "OP"
  PRIMARY KEY (race_date, venue, race_number, horse_number)
);

-- 3. 予想結果（ファクター適用後）
CREATE TABLE race_predictions (
  race_date TEXT,
  venue TEXT,
  race_number INTEGER,
  horse_number INTEGER,
  horse_name TEXT,
  factor_scores JSON,                    -- [{factor_id, factor_name, score, analysis}, ...]
  total_score REAL,                      -- 全ファクターの合計得点
  rank INTEGER,                          -- 得点順位
  PRIMARY KEY (race_date, venue, race_number, horse_number)
);

-- 4. 馬の過去成績キャッシュ
CREATE TABLE horse_history_cache (
  horse_id TEXT PRIMARY KEY,
  horse_name TEXT,
  history JSON,                          -- [{race_date, venue, finish_position, odds, ...}, ...]
  last_race_date TEXT,
  total_races INTEGER,
  wins INTEGER,
  places INTEGER,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. 設定・メタデータ
CREATE TABLE system_settings (
  key TEXT PRIMARY KEY,
  value JSON,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX idx_tomorrow_races_date ON tomorrow_races(race_date);
CREATE INDEX idx_tomorrow_races_venue ON tomorrow_races(venue);
CREATE INDEX idx_predictions_date ON race_predictions(race_date);
CREATE INDEX idx_predictions_score ON race_predictions(total_score DESC);
CREATE INDEX idx_horse_history_name ON horse_history_cache(horse_name);
```

---

## 🔧 技術スタック

### バックエンド
- **Node.js** または **Bun**（高速実行環境）
- **Hono**（軽量Webフレームワーク）
- **TypeScript**（型安全）
- **better-sqlite3**（SQLite高速アクセス）

### フロントエンド
- **TailwindCSS**（スタイリング）
- **Chart.js**（グラフ表示）
- **Vanilla JavaScript**（シンプルに）

### データ処理
- **固定長レコードパーサー**（JRDB/JRA-VANフォーマット）
- **Shift-JIS エンコーディング対応**
- **ストリーム処理**（大容量ファイル対応）

---

## 📦 主要機能一覧

### 1. ロジック作成機能
- [ ] 条件設定UI（3エリアOR構造）
- [ ] 回収率分析実行
- [ ] 6項目計算（win_count, place_count, win_hit_rate, place_hit_rate, win_corrected_recovery, place_corrected_recovery）
- [ ] 独自得点式入力
- [ ] ファクター登録・編集・削除
- [ ] ファクター一覧表示

### 2. データ取り込み機能
- [ ] JRA-VANリアルタイムフォルダ監視
- [ ] 翌日出走表データ自動取得
- [ ] CK_DATAパーサー
- [ ] SQLiteへの保存
- [ ] 取り込み進捗表示

### 3. ファクター適用機能
- [ ] 馬の過去成績取得（E:\UMAYOMI\downloads_weekly\）
- [ ] 条件フィルタリング
- [ ] 6項目分析実行
- [ ] 独自得点計算（安全なeval）
- [ ] 全馬への一括適用
- [ ] 進捗表示

### 4. 出走表表示機能
- [ ] 翌日のレース一覧
- [ ] 出走表（得点順ソート）
- [ ] ファクター詳細表示
- [ ] 推奨馬券表示
- [ ] グラフ表示（得点分布）

### 5. JRDBパーサー（21種類）
- [x] SEDParser（成績データ）
- [x] TYBParser（出馬表データ）
- [x] HJCParser（払戻金データ）
- [ ] KYIParser（馬毎レース情報・拡張版）
- [ ] BACParser（馬毎レース情報）
- [ ] KABParser（馬基本情報）
- [ ] UKCParser（調教情報）
- [ ] CHAParser（調教師情報）
- [ ] JOAParser（騎手情報）
- [ ] CYBParser（馬基本情報）
- [ ] ZEDParser（確定情報）
- [ ] OWParser（オッズ・単勝枠連）
- [ ] OUParser（オッズ・3連単）
- [ ] OTParser（オッズ・馬単）
- [ ] KKAParser（競走成績）
- [ ] SRBParser（成績データ追加）
- [ ] OVParser（オッズ詳細）
- [ ] OZParser（馬場状態）
- [ ] ZKBParser（前日売上）
- [ ] CEParser（未特定）
- [ ] BVParser（未特定）
- [ ] BTParser（未特定）

### 6. JRA-VANパーサー（10種類）
- [ ] CK_DATAParser（レース詳細）
- [ ] SE_DATAParser（成績データ）
- [ ] BR_DATAParser（繁殖馬）
- [ ] BS_DATAParser（馬成績）
- [ ] BY_DATAParser（馬基本情報）
- [ ] CS_DATAParser（コース成績）
- [ ] DE_DATAParser（出走取消）
- [ ] ES_DATAParser（調教データ）
- [ ] EX_DATAParser（拡張データ）
- [ ] FUKU_DATAParser（複勝データ）
- [ ] HY_DATAParser（払戻金）

---

## ⏱️ 実装タイムライン

### Phase 0-3-2: 完了（6時間）
- [x] 戦略整理
- [x] RGS/AAS計算エンジン実装
- [x] API Routes実装
- [x] D1テーブル設計
- [x] JRDBパーサー（SED/TYB/HJC）実装

### Phase 3-3: データベース設計（0.5時間）
- [ ] SQLiteテーブル作成
- [ ] インデックス設定
- [ ] 初期データ投入

### Phase 3-4: JRA-VANデータ取り込み（4時間）
- [ ] CK_DATAパーサー実装
- [ ] リアルタイムフォルダ監視
- [ ] 出走表データ保存
- [ ] エラーハンドリング

### Phase 3-5: ファクター適用エンジン（6時間）
- [ ] 馬の過去成績取得
- [ ] 条件フィルタリング
- [ ] 6項目分析
- [ ] 独自得点計算
- [ ] 全馬一括適用

### Phase 4: UI実装（8時間）
- [ ] ロジック作成UI（3時間）
- [ ] データ取り込みUI（1時間）
- [ ] 出走表UI（4時間）

### Phase 5: テスト・完成（2時間）
- [ ] 統合テスト
- [ ] パフォーマンステスト
- [ ] バグ修正

**合計: 26.5時間**

---

## 🎯 重要な設計原則

### 1. CrossFactor完全準拠
- ✅ 3エリアOR構造の条件設定
- ✅ 補正係数（期間・オッズ）
- ✅ 6項目分析結果
- ✅ 独自得点計算
- ✅ ファクター登録
- ✅ 出走表への得点表示

### 2. CEO PC完結
- ✅ 外部サービス一切不要
- ✅ E:\UMAYOMI\ の全データを直接使用
- ✅ localhost:3000 で実行
- ✅ 完全無料

### 3. 週2回の使用に最適化
- ✅ 前日に翌日分を完全準備
- ✅ リアルタイム更新不要
- ✅ 高速な一括処理

### 4. パフォーマンス重視
- ✅ SQLiteキャッシュ活用
- ✅ ストリーム処理
- ✅ 並列処理

---

## 📝 メモ・注意事項

### データパス
```
E:\UMAYOMI\downloads_weekly\
├── sed_extracted\  (513 files)
├── tyb_extracted\  (513 files)
├── hjc_extracted\  (513 files)
├── ov_extracted\   (513 files)
├── kyi_extracted\  (1,265 files)
├── bac_extracted\  (1,265 files)
└── ... (他15種類)

E:\JRAVAN\
├── CK_DATA\
├── SE_DATA\
└── ... (他9種類)

E:\JRAVAN\REALTIME\  ← JRA-VANリアルタイムデータ
└── CK20250104.txt   ← 翌日の出走表
```

### エンコーディング
- JRDBデータ: **Shift-JIS**
- JRA-VANデータ: **Shift-JIS**
- DB内部: **UTF-8**

### 処理時間目安
- ファクター1つ適用（1頭）: 約0.5秒
- 全馬（180頭）× 3ファクター: 約270秒（4.5分）
- レース一覧読み込み: 約1秒

---

## 🚀 起動方法

### 初回セットアップ
```bash
cd /home/user/webapp
npm install
```

### サーバー起動
```bash
npm run dev
# または
bun run dev
```

### アクセス
```
http://localhost:3000
```

### 停止
```
Ctrl + C
```

---

## 📚 参考資料

### 既存成果物
- `/home/user/webapp/src/parsers/JRDBParser.ts` - JRDBパーサー（SED/TYB/HJC）
- `/home/user/webapp/src/calculators/RGSCalculator.ts` - RGS計算エンジン
- `/home/user/webapp/src/calculators/AASCalculator.ts` - AAS計算エンジン
- `/home/user/webapp/migrations/0003_create_jrdb_tables.sql` - D1テーブル設計

### 外部ドキュメント
- JRDBフォーマット仕様書
- JRA-VANデータ仕様書
- CrossFactor操作マニュアル（参考）

---

**この要件定義書を常に参照して実装を進めること。**
