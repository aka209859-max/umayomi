# AAS（Adaptive Ability Score）計算式 - 完全版公式ドキュメント

**バージョン**: 1.0.0  
**最終更新**: 2026-01-04  
**作成者**: UMAYOMI開発チーム  

---

## 目次

1. [概要](#概要)
2. [入力データ定義](#入力データ定義)
3. [AAS計算式（5ステップ）](#aas計算式5ステップ)
4. [数学関数の定義](#数学関数の定義)
5. [実装例](#実装例)
6. [重要な係数一覧](#重要な係数一覧)
7. [検証用テストケース](#検証用テストケース)
8. [よくある実装ミス](#よくある実装ミス)

---

## 概要

### AAS（Adaptive Ability Score）とは

- **名称**: AAS（Adaptive Ability Score / 適応能力スコア）
- **目的**: レース内での相対的な強さを数値化する偏差値的指標
- **スコア範囲**: -12 ～ +12（実際には -10 ～ +10 の範囲に収まることが多い）
- **評価方式**: 相対評価（グループ内の他の対象と比較）
- **用途**: 競馬の出走馬評価、ファクター（条件）の優劣判定

### 特徴

1. **相対評価**: グループ内での相対的な位置を評価（絶対評価ではない）
2. **Zスコアベース**: 統計的に標準化された評価
3. **信頼度収縮**: データ件数が少ない場合、スコアを抑制
4. **バランス型**: 的中率と回収率の両方を考慮（55:45の重み）

---

## 入力データ定義

### 単一対象（馬またはファクター）の入力データ

| 変数名 | 型 | 説明 | 単位 | 必須 | 例 |
|--------|----|----|------|------|-----|
| `horseId` | string | 対象の識別子 | - | ✅ | "H001" |
| `horseName` | string | 対象の名称 | - | ❌ | "スーパーホース" |
| `cntWin` | integer | 単勝のレース数 | 回 | ✅ | 50 |
| `cntPlace` | integer | 複勝のレース数 | 回 | ✅ | 80 |
| `rateWinHit` | float | 単勝的中率 | % | ✅ | 30.0 |
| `ratePlaceHit` | float | 複勝的中率 | % | ✅ | 50.0 |
| `adjWinRet` | float | **単勝補正回収率** | % | ✅ | 150.0 |
| `adjPlaceRet` | float | **複勝補正回収率** | % | ✅ | 120.0 |

**⚠️ 重要**: 
- **補正回収率**（`adjWinRet`, `adjPlaceRet`）を使用してください
- 生の回収率（`rateWinRet`, `ratePlaceRet`）ではありません

### グループ全体の入力データ

| 変数名 | 型 | 説明 | 必須 |
|--------|----|----|------|
| `raceId` | string | レース（グループ）の識別子 | ✅ |
| `horses` | array | レース内の全対象のデータ配列 | ✅ |

---

## AAS計算式（5ステップ）

### Step 1: 基礎値の算出

```
N_min = MIN(cntWin, cntPlace)

Hit_raw = 0.65 × rateWinHit + 0.35 × ratePlaceHit

Ret_raw = 0.35 × adjWinRet + 0.65 × adjPlaceRet
```

**説明**:
- `N_min`: 安定件数（データの信頼性を評価）
  - 件数が少ないほど信頼度が低い
- `Hit_raw`: 命中強度
  - 単勝65%、複勝35%の重み
  - 単勝をやや重視
- `Ret_raw`: 収益強度
  - 単勝35%、複勝65%の重み
  - 複勝をやや重視
  - **⚠️ 必ず補正回収率（adjWinRet, adjPlaceRet）を使用**

**計算例**:
```
入力: cntWin=250, cntPlace=250, rateWinHit=11.2%, ratePlaceHit=35.6%
      adjWinRet=55.5%, adjPlaceRet=86.6%

N_min = MIN(250, 250) = 250

Hit_raw = 0.65 × 11.2 + 0.35 × 35.6
        = 7.28 + 12.46
        = 19.74%

Ret_raw = 0.35 × 55.5 + 0.65 × 86.6
        = 19.425 + 56.29
        = 75.715%
```

---

### Step 2: グループ統計の算出

レース内の全対象について、`Hit_raw`と`Ret_raw`の統計値を計算します。

```
μH = AVERAGE(Hit_raw_1, Hit_raw_2, ..., Hit_raw_n)
σH = STDEV.P(Hit_raw_1, Hit_raw_2, ..., Hit_raw_n)

μR = AVERAGE(Ret_raw_1, Ret_raw_2, ..., Ret_raw_n)
σR = STDEV.P(Ret_raw_1, Ret_raw_2, ..., Ret_raw_n)
```

**説明**:
- `μH`: 命中強度の平均値
- `σH`: 命中強度の標準偏差（**母集団標準偏差**）
- `μR`: 収益強度の平均値
- `σR`: 収益強度の標準偏差（**母集団標準偏差**）

**⚠️ 重要**: 必ず**母集団標準偏差**（STDEV.P）を使用してください

**計算例**（3頭のレース）:
```
Hit_raw値: [19.74, 18.38, 15.46]

μH = (19.74 + 18.38 + 15.46) / 3 = 17.86%

σH = SQRT(((19.74-17.86)² + (18.38-17.86)² + (15.46-17.86)²) / 3)
   = SQRT((3.5344 + 0.2704 + 5.76) / 3)
   = SQRT(3.188)
   = 1.79%
```

---

### Step 3: Zスコアの算出

```
ZH = (Hit_raw - μH) / σH    ※ σH = 0 の場合は ZH = 0

ZR = (Ret_raw - μR) / σR    ※ σR = 0 の場合は ZR = 0
```

**説明**:
- Zスコアは「平均からの乖離を標準偏差で正規化した値」
- **正の値**: 平均より優秀
- **負の値**: 平均より劣る
- **0**: 平均的

**解釈**:
| Zスコア範囲 | 評価 | パーセンタイル |
|------------|------|---------------|
| +2.0以上 | 極めて優秀 | 上位2.5% |
| +1.0～+2.0 | 優秀 | 上位16% |
| 0～+1.0 | やや優秀 | 上位50% |
| 0～-1.0 | やや劣る | 下位50% |
| -1.0～-2.0 | 劣る | 下位16% |
| -2.0以下 | 極めて劣る | 下位2.5% |

**計算例**:
```
Hit_raw = 19.74%, μH = 17.86%, σH = 1.79%

ZH = (19.74 - 17.86) / 1.79
   = 1.88 / 1.79
   = 1.05
```

---

### Step 4: 信頼度収縮係数の算出

```
Shr = SQRT( N_min / (N_min + 400) )
```

**説明**:
- データ件数が少ない場合、スコアを抑制（過大評価を防ぐ）
- N_min（安定件数）が大きいほど、信頼度が高くなる
- 定数400は経験的に最適化された値

**信頼度の目安**:
| N_min | Shr | 信頼度 | 評価 |
|-------|-----|-------|------|
| 10 | 0.16 | 16% | 極めて低い |
| 50 | 0.33 | 33% | 低い |
| 100 | 0.45 | 45% | やや低い |
| 200 | 0.58 | 58% | 普通 |
| 400 | 0.71 | 71% | やや高い |
| 1000 | 0.85 | 85% | 高い |
| 10000 | 0.98 | 98% | 極めて高い |

**計算例**:
```
N_min = 250

Shr = SQRT(250 / (250 + 400))
    = SQRT(250 / 650)
    = SQRT(0.3846)
    = 0.620
```

---

### Step 5: 最終AASスコアの算出

```
baseCalc = 0.55 × ZH + 0.45 × ZR

aasScore = 12 × TANH(baseCalc) × Shr
```

**説明**:
- `baseCalc`: 的中率Zスコアと回収率Zスコアの加重平均
  - 的中率55%、回収率45%
  - 的中率をやや重視
- `TANH(baseCalc)`: ハイパボリックタンジェント関数で -1 ～ +1 に収束
- `12 × TANH(baseCalc)`: -12 ～ +12 のスケールに拡大
- `× Shr`: 信頼度収縮を適用

**計算例**:
```
ZH = 1.05, ZR = 0.82, Shr = 0.620

baseCalc = 0.55 × 1.05 + 0.45 × 0.82
         = 0.5775 + 0.369
         = 0.9465

TANH(0.9465) = 0.7404

aasScore = 12 × 0.7404 × 0.620
         = 5.5
```

---

## 数学関数の定義

### TANH（ハイパボリックタンジェント）

```
TANH(x) = (e^x - e^(-x)) / (e^x + e^(-x))

または

TANH(x) = (e^(2x) - 1) / (e^(2x) + 1)
```

**特性**:
- **定義域**: 全実数（-∞ ～ +∞）
- **値域**: -1 ～ +1
- TANH(0) = 0
- TANH(∞) = 1
- TANH(-∞) = -1
- TANH(-x) = -TANH(x)（奇関数）

**グラフ特性**:
```
  1.0 |           ___________________
      |       ___/
      |    __/
  0.0 |___/________________________
      |   \__
      |      \___
 -1.0 |          \___________________
      -5   -3   -1    0    1    3    5
```

**プログラミング言語での実装**:
- **Python**: `math.tanh(x)`
- **JavaScript**: `Math.tanh(x)`
- **Excel**: `TANH(x)`
- **Java**: `Math.tanh(x)`
- **C++**: `std::tanh(x)` (cmath)
- **R**: `tanh(x)`

---

### STDEV.P（母集団の標準偏差）

```
STDEV.P(x1, x2, ..., xn) = SQRT( SUM((xi - μ)²) / n )

ここで μ = AVERAGE(x1, x2, ..., xn)
```

**注意**:
- **STDEV.P**: 母集団の標準偏差（n で割る）← **AASで使用**
- **STDEV.S**: 標本の標準偏差（n-1 で割る）← 使用しない

**プログラミング言語での実装**:
- **Python**: `statistics.pstdev(data)`
- **Excel**: `STDEV.P(範囲)`
- **JavaScript**: 手動実装が必要
- **R**: `sd(x) * sqrt((n-1)/n)`

---

## 実装例

### Excel実装式（LET関数版）

```excel
=LET(
    gid, E8,
    
    WinCnt, H8,      PlcCnt, K8,
    WinRate, I8,     PlcRate, L8,
    WinRetAdj, N8,   PlcRetAdj, O8,
    N件, MIN(WinCnt, PlcCnt),
    
    HitRaw, 0.65*WinRate + 0.35*PlcRate,
    RetRaw, 0.35*WinRetAdj + 0.65*PlcRetAdj,
    
    GHit, FILTER(0.65*$I$7:$I$22 + 0.35*$L$7:$L$22, $E$7:$E$22 = gid),
    GRet, FILTER(0.35*$N$7:$N$22 + 0.65*$O$7:$O$22, $E$7:$E$22 = gid),
    
    μH, AVERAGE(GHit),  σH, STDEV.P(GHit),
    μR, AVERAGE(GRet),  σR, STDEV.P(GRet),
    
    ZH, IF(σH=0, 0, (HitRaw-μH)/σH),
    ZR, IF(σR=0, 0, (RetRaw-μR)/σR),
    
    Shr, SQRT( N件 / ( N件 + 400 ) ),
    
    ROUND( 12 * TANH(0.55*ZH + 0.45*ZR) * Shr, 1)
)
```

**セル配置**:
- E列: レースID（gid）
- H列: 単勝件数（cntWin）
- I列: 単勝的中率（rateWinHit）
- K列: 複勝件数（cntPlace）
- L列: 複勝的中率（ratePlaceHit）
- N列: 単勝補正回収率（adjWinRet）← **補正回収率**
- O列: 複勝補正回収率（adjPlaceRet）← **補正回収率**

---

### Python実装例

```python
import math
import statistics

def calculate_aas(race_data):
    """
    AAS（Adaptive Ability Score）を計算
    
    Args:
        race_data: レース内の全馬データのリスト
            各要素は辞書型: {
                'horse_id': str,
                'horse_name': str (optional),
                'cnt_win': int,
                'cnt_place': int,
                'rate_win_hit': float,
                'rate_place_hit': float,
                'adj_win_ret': float,      # 単勝補正回収率
                'adj_place_ret': float     # 複勝補正回収率
            }
    
    Returns:
        各馬のAAS結果のリスト（辞書型）
    """
    
    # Step 1: 基礎値の算出
    horses_with_raw = []
    for horse in race_data:
        n_min = min(horse['cnt_win'], horse['cnt_place'])
        hit_raw = 0.65 * horse['rate_win_hit'] + 0.35 * horse['rate_place_hit']
        # ⚠️ 重要: 補正回収率を使用
        ret_raw = 0.35 * horse['adj_win_ret'] + 0.65 * horse['adj_place_ret']
        
        horses_with_raw.append({
            **horse,
            'n_min': n_min,
            'hit_raw': hit_raw,
            'ret_raw': ret_raw
        })
    
    # Step 2: グループ統計の算出
    hit_values = [h['hit_raw'] for h in horses_with_raw]
    ret_values = [h['ret_raw'] for h in horses_with_raw]
    
    mu_h = statistics.mean(hit_values)
    sigma_h = statistics.pstdev(hit_values)  # 母集団の標準偏差
    mu_r = statistics.mean(ret_values)
    sigma_r = statistics.pstdev(ret_values)
    
    # Step 3-5: 各馬のAASスコアを計算
    results = []
    for horse in horses_with_raw:
        # Step 3: Zスコア
        z_h = (horse['hit_raw'] - mu_h) / sigma_h if sigma_h > 0 else 0
        z_r = (horse['ret_raw'] - mu_r) / sigma_r if sigma_r > 0 else 0
        
        # Step 4: 信頼度収縮
        shrinkage = math.sqrt(horse['n_min'] / (horse['n_min'] + 400))
        
        # Step 5: 最終AASスコア
        base_calc = 0.55 * z_h + 0.45 * z_r
        aas_score = 12 * math.tanh(base_calc) * shrinkage
        
        results.append({
            'horse_id': horse['horse_id'],
            'horse_name': horse.get('horse_name', ''),
            'aas_score': round(aas_score, 1),
            'n_min': horse['n_min'],
            'hit_raw': round(horse['hit_raw'], 2),
            'ret_raw': round(horse['ret_raw'], 2),
            'z_h': round(z_h, 2),
            'z_r': round(z_r, 2),
            'shrinkage': round(shrinkage, 2),
            'base_calc': round(base_calc, 2)
        })
    
    return results
```

---

### JavaScript/TypeScript実装例

```typescript
interface AASHorseInput {
  horseId: string
  horseName?: string
  cntWin: number
  cntPlace: number
  rateWinHit: number
  ratePlaceHit: number
  adjWinRet: number      // 単勝補正回収率
  adjPlaceRet: number    // 複勝補正回収率
}

interface AASRaceInput {
  raceId: string
  horses: AASHorseInput[]
}

interface AASHorseResult {
  horseId: string
  horseName?: string
  aasScore: number
  nMin: number
  hitRaw: number
  retRaw: number
  zH: number
  zR: number
  shrinkage: number
  baseCalc: number
}

function calculateAAS(input: AASRaceInput): AASHorseResult[] {
  const { horses } = input
  
  // Step 1: 基礎値の算出
  const horsesWithRaw = horses.map(horse => ({
    ...horse,
    nMin: Math.min(horse.cntWin, horse.cntPlace),
    hitRaw: 0.65 * horse.rateWinHit + 0.35 * horse.ratePlaceHit,
    // ⚠️ 重要: 補正回収率を使用
    retRaw: 0.35 * horse.adjWinRet + 0.65 * horse.adjPlaceRet
  }))
  
  // Step 2: グループ統計の算出
  const hitValues = horsesWithRaw.map(h => h.hitRaw)
  const retValues = horsesWithRaw.map(h => h.retRaw)
  
  const muH = hitValues.reduce((sum, v) => sum + v, 0) / hitValues.length
  const muR = retValues.reduce((sum, v) => sum + v, 0) / retValues.length
  
  // 母集団標準偏差の計算
  const varH = hitValues.reduce((sum, v) => sum + Math.pow(v - muH, 2), 0) / hitValues.length
  const varR = retValues.reduce((sum, v) => sum + Math.pow(v - muR, 2), 0) / retValues.length
  
  const sigmaH = Math.sqrt(varH)
  const sigmaR = Math.sqrt(varR)
  
  // Step 3-5: 各馬のAASスコアを計算
  return horsesWithRaw.map(horse => {
    // Step 3: Zスコア
    const zH = sigmaH > 0 ? (horse.hitRaw - muH) / sigmaH : 0
    const zR = sigmaR > 0 ? (horse.retRaw - muR) / sigmaR : 0
    
    // Step 4: 信頼度収縮
    const shrinkage = Math.sqrt(horse.nMin / (horse.nMin + 400))
    
    // Step 5: 最終AASスコア
    const baseCalc = 0.55 * zH + 0.45 * zR
    const aasScore = 12 * Math.tanh(baseCalc) * shrinkage
    
    return {
      horseId: horse.horseId,
      horseName: horse.horseName,
      aasScore: Math.round(aasScore * 10) / 10,
      nMin: horse.nMin,
      hitRaw: Math.round(horse.hitRaw * 100) / 100,
      retRaw: Math.round(horse.retRaw * 100) / 100,
      zH: Math.round(zH * 100) / 100,
      zR: Math.round(zR * 100) / 100,
      shrinkage: Math.round(shrinkage * 100) / 100,
      baseCalc: Math.round(baseCalc * 100) / 100
    }
  })
}
```

---

## 重要な係数一覧

| 項目 | 係数 | 説明 | 変更可否 |
|------|------|------|---------|
| **命中強度 - 単勝** | 0.65 | 単勝的中率の重み | ❌ |
| **命中強度 - 複勝** | 0.35 | 複勝的中率の重み | ❌ |
| **収益強度 - 単勝** | 0.35 | 単勝補正回収率の重み | ❌ |
| **収益強度 - 複勝** | 0.65 | 複勝補正回収率の重み | ❌ |
| **Zスコア統合 - 的中率** | 0.55 | 的中率Zスコアの重み | ❌ |
| **Zスコア統合 - 回収率** | 0.45 | 回収率Zスコアの重み | ❌ |
| **信頼度収縮 - 基準件数** | 400 | N_min + 400 の定数 | ❌ |
| **最終スコア - スケール** | 12 | スコアを -12 ～ +12 に拡大 | ❌ |

**⚠️ これらの係数は変更しないでください。実際の競馬データ分析に基づいて最適化された値です。**

---

## 検証用テストケース

### 入力データ（16ファクター）

| No | cntWin | cntPlace | rateWinHit | ratePlaceHit | adjWinRet | adjPlaceRet |
|----|--------|----------|------------|--------------|-----------|-------------|
| 1 | 250 | 250 | 11.2 | 35.6 | 55.5 | 86.6 |
| 2 | 254 | 254 | 12.6 | 29.1 | 93.8 | 80.9 |
| 3 | 241 | 241 | 10.8 | 24.1 | 87.0 | 64.9 |
| 4 | 240 | 240 | 12.9 | 27.9 | 115.8 | 84.5 |
| 5 | 251 | 251 | 4.8 | 19.9 | 53.7 | 72.9 |
| 6 | 260 | 260 | 6.9 | 23.8 | 80.2 | 85.5 |
| 7 | 243 | 243 | 6.6 | 18.5 | 69.8 | 77.4 |
| 8 | 241 | 241 | 7.5 | 18.7 | 96.4 | 76.3 |
| 9 | 222 | 222 | 4.5 | 24.3 | 68.3 | 117.7 |
| 10 | 194 | 194 | 5.7 | 21.6 | 76.5 | 88.5 |
| 11 | 192 | 192 | 8.9 | 22.9 | 130.5 | 112.8 |
| 12 | 187 | 187 | 4.3 | 17.6 | 69.9 | 86.6 |
| 13 | 160 | 160 | 5.0 | 12.5 | 63.4 | 51.9 |
| 14 | 163 | 163 | 3.7 | 8.6 | 56.2 | 40.5 |
| 15 | 141 | 141 | 2.8 | 9.9 | 53.1 | 56.3 |
| 16 | 124 | 124 | 1.6 | 11.3 | 43.6 | 78.8 |

### 期待される出力

| No | AASスコア | 評価 |
|----|----------|------|
| 4 | **+6.2** | ★★★ 圧倒的 |
| 11 | **+5.9** | ★★★ 圧倒的 |
| 2 | **+5.8** | ★★★ 圧倒的 |
| 1 | **+5.5** | ★★★ 圧倒的 |
| 9 | **+3.6** | ★★ 優勢 |
| 3 | **+2.4** | ★ 僅差 |
| 6 | **+2.2** | ★ 僅差 |
| 8 | **+0.9** | ー 混戦 |
| 10 | **+0.8** | ー 混戦 |
| 7 | **-1.3** | ー 混戦 |
| 12 | **-1.6** | ー 混戦 |
| 5 | **-3.3** | ✕ 不利 |
| 16 | **-4.7** | ✕ 不利 |
| 13 | **-5.0** | ✕ 不利 |
| 15 | **-5.4** | ✕ 不利 |
| 14 | **-5.9** | ✕ 不利 |

**グループ統計**:
- μH = 11.60%
- σH = 4.50%
- μR = 77.82%
- σR = 17.68%

**実装が正しければ、上記の結果（±0.1の誤差範囲内）が得られるはずです。**

---

## よくある実装ミス

### ❌ ミス1: 標本標準偏差を使用

```
誤: STDEV.S(...)  または  statistics.stdev(...)
正: STDEV.P(...)  または  statistics.pstdev(...)
```

**影響**: スコアがわずかに異なる（n-1で割るため、値がやや大きくなる）

---

### ❌ ミス2: 生の回収率を使用

```
誤: ret_raw = 0.35 × rateWinRet + 0.65 × ratePlaceRet
正: ret_raw = 0.35 × adjWinRet + 0.65 × adjPlaceRet
```

**影響**: スコアが大幅に異なる（最大±3.0以上の差異）

**⚠️ これが最も重大なミスです！**

---

### ❌ ミス3: 係数の間違い

```
誤: Hit_raw = 0.5 × rateWinHit + 0.5 × ratePlaceHit
正: Hit_raw = 0.65 × rateWinHit + 0.35 × ratePlaceHit
```

**影響**: スコアが異なる

---

### ❌ ミス4: ゼロ除算対策の欠如

```
誤: ZH = (HitRaw - μH) / σH  (σH=0でエラー)
正: ZH = IF(σH=0, 0, (HitRaw - μH) / σH)
```

**影響**: 全員が同じ値の場合にエラー

---

### ❌ ミス5: TANH関数の未実装

```
誤: aasScore = 12 * baseCalc * Shr  (TANH省略)
正: aasScore = 12 * TANH(baseCalc) * Shr
```

**影響**: スコアが-12～+12の範囲を超える可能性

---

### ❌ ミス6: グループ統計の範囲ミス

```
誤: 単一の対象だけで平均・標準偏差を計算
正: レース内の全対象で平均・標準偏差を計算
```

**影響**: スコアが0になる（相対評価できない）

---

## AASスコアの解釈基準

| スコア範囲 | 評価 | 解釈 | アクション |
|-----------|------|------|----------|
| **+6以上** | ★★★ 圧倒的 | グループ内で圧倒的に優秀 | 最優先で選択 |
| **+3～+6** | ★★ 優勢 | 明確に優位性あり | 優先的に選択 |
| **0～+3** | ★ 僅差 | やや有利だが差は小さい | 条件次第で選択 |
| **-3～0** | ー 混戦 | 平均的、決め手に欠ける | 慎重に検討 |
| **-3以下** | ✕ 不利 | 相対的に弱い | 避けるべき |

---

## まとめ

### AAS計算の本質

1. **命中強度と収益強度**: 単勝と複勝の加重平均で基礎値を算出
2. **Zスコア**: グループ内での相対位置を標準偏差で正規化
3. **信頼度収縮**: データ件数が少ない場合の過大評価を防止
4. **TANH関数**: 極端な値を-1～+1に収束させる
5. **最終スコア**: -12～+12のスケールで直感的に評価

### 実装時のチェックリスト

- ✅ 母集団標準偏差（STDEV.P）を使用
- ✅ **補正回収率**（adjWinRet, adjPlaceRet）を使用 ← **最重要**
- ✅ 係数が正確（0.65/0.35, 0.55/0.45, 400, 12）
- ✅ TANH関数を正しく実装
- ✅ ゼロ除算対策を実装
- ✅ グループ全体で統計値を計算
- ✅ テストケースで検証（±0.1の誤差範囲内）

---

## ライセンス

このドキュメントはUMAYOMI開発チームによって作成されました。  
商用・非商用を問わず自由に使用できますが、出典を明記してください。

---

**バージョン履歴**:
- v1.0.0 (2026-01-04): 初版作成、補正回収率の重要性を明記
