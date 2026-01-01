# RGS 1.0 と AAS の正確な計算式

**作成日**: 2026-01-01  
**参照元**: CEO提供の計算式定義書

---

## 【RGS 1.0】Race Grade Score（絶対収益力評価）

### 概要
基準回収率(80%)からの乖離を、データ件数による信頼度で補正した絶対評価スコア。

### 入力変数
- `cnt_win`: 単勝投票件数 (H列)
- `cnt_plc`: 複勝投票件数 (L列)
- `rate_win_ret`: 単勝補正回収率 (Q列)
- `rate_plc_ret`: 複勝補正回収率 (T列)

### 計算ロジック

#### Step 1: 信頼度係数 (Reliability)
```typescript
const reliability = Math.min(1, Math.sqrt((cnt_win + cnt_plc) / 500));
```
**意図**: 件数が500件以上で信頼度MAX(1.0)とする。

#### Step 2: 加重平均乖離 (Weighted Diff)
```typescript
const weightedDiff = ((rate_win_ret * 0.3) + (rate_plc_ret * 0.7)) - 80;
```
**意図**: 複勝重視(7:3)で回収率を計算し、分岐点80を引く。

#### Step 3: 最終RGSスコア
```typescript
const rgsScore = 10 * Math.tanh((weightedDiff * reliability) / 25);
```
**出力**: -10 ～ +10 の範囲に正規化された数値。

---

## 【AAS】Advanced Analysis Score（相対偏差値評価）

### 概要
同一レース内での相対的な強さ（偏差値）を算出し、ベイズ的アプローチで信頼度補正を行う高度分析スコア。

### 入力変数
- `group_id`: レースID (E列) ※グループ化キー
- `cnt_win`, `cnt_plc`: 単勝/複勝件数 (H列, L列)
- `rate_win_hit`, `rate_plc_hit`: 単勝/複勝的中率 (J列, N列)
- `rate_win_ret`, `rate_plc_ret`: 単勝/複勝回収率 (Q列, T列)

### 計算ロジック

#### Step 1: 基礎値 (Raw Values) の算出
各馬について以下を計算する。

```typescript
const N_min = Math.min(cnt_win, cnt_plc);  // 安定件数
const Hit_raw = 0.65 * rate_win_hit + 0.35 * rate_plc_hit;  // 命中強度
const Ret_raw = 0.35 * rate_win_ret + 0.65 * rate_plc_ret;  // 収益強度
```

#### Step 2: グループ統計 (Group Stats) の算出
同一 `group_id` 内の全馬を使って統計をとる。

```typescript
// Hit_raw の統計
const μH = mean(Hit_raw);  // 平均
const σH = stdDev(Hit_raw);  // 標準偏差

// Ret_raw の統計
const μR = mean(Ret_raw);  // 平均
const σR = stdDev(Ret_raw);  // 標準偏差
```

#### Step 3: Zスコア (Standardization) の算出
各馬の偏差値を計算する。

```typescript
const ZH = σH > 0 ? (Hit_raw - μH) / σH : 0;  // 標準偏差0の場合は0
const ZR = σR > 0 ? (Ret_raw - μR) / σR : 0;  // 標準偏差0の場合は0
```

#### Step 4: 信頼度収縮 (Shrinkage)
件数が少ないデータの評価を抑制する係数。

```typescript
const Shr = Math.sqrt(N_min / (N_min + 400));
```

#### Step 5: 最終AASスコア
```typescript
const baseScore = 0.55 * ZH + 0.45 * ZR;
const aasScore = Math.round(12 * Math.tanh(baseScore) * Shr * 10) / 10;
```
**出力**: 小数点第1位まで（約 -12 ～ +12 の範囲）

---

## 重要な違い

| 項目 | RGS 1.0 | AAS |
|------|---------|-----|
| **評価タイプ** | 絶対評価 | 相対評価（レース内偏差値） |
| **基準** | 回収率80%からの乖離 | レース内での相対順位 |
| **出力範囲** | -10 ～ +10 | 約 -12 ～ +12 |
| **グループ化** | 不要 | レースIDでグループ化必須 |
| **信頼度補正** | SQRT(件数/500) | SQRT(N_min/(N_min+400)) |
| **重み配分（回収率）** | 単勝30%、複勝70% | 単勝35%、複勝65% |
| **重み配分（的中率）** | - | 単勝65%、複勝35% |
| **最終重み配分** | - | 命中55%、収益45% |

---

## TypeScript実装例

### RGS 1.0 計算関数
```typescript
interface RGSInput {
  cnt_win: number;
  cnt_plc: number;
  rate_win_ret: number;
  rate_plc_ret: number;
}

function calculateRGS(input: RGSInput): number {
  const { cnt_win, cnt_plc, rate_win_ret, rate_plc_ret } = input;
  
  // Step 1: 信頼度係数
  const reliability = Math.min(1, Math.sqrt((cnt_win + cnt_plc) / 500));
  
  // Step 2: 加重平均乖離
  const weightedDiff = ((rate_win_ret * 0.3) + (rate_plc_ret * 0.7)) - 80;
  
  // Step 3: 最終RGSスコア
  const rgsScore = 10 * Math.tanh((weightedDiff * reliability) / 25);
  
  return rgsScore;
}
```

### AAS 計算関数
```typescript
interface AASInput {
  cnt_win: number;
  cnt_plc: number;
  rate_win_hit: number;
  rate_plc_hit: number;
  rate_win_ret: number;
  rate_plc_ret: number;
}

interface AASGroupData extends AASInput {
  group_id: string;
}

function calculateAAS(horses: AASGroupData[], targetHorse: AASGroupData): number {
  // Step 1: 基礎値の算出
  const N_min = Math.min(targetHorse.cnt_win, targetHorse.cnt_plc);
  const Hit_raw = 0.65 * targetHorse.rate_win_hit + 0.35 * targetHorse.rate_plc_hit;
  const Ret_raw = 0.35 * targetHorse.rate_win_ret + 0.65 * targetHorse.rate_plc_ret;
  
  // Step 2: グループ統計の算出（同一group_id内）
  const groupHorses = horses.filter(h => h.group_id === targetHorse.group_id);
  
  const Hit_values = groupHorses.map(h => 
    0.65 * h.rate_win_hit + 0.35 * h.rate_plc_hit
  );
  const Ret_values = groupHorses.map(h => 
    0.35 * h.rate_win_ret + 0.65 * h.rate_plc_ret
  );
  
  const μH = mean(Hit_values);
  const σH = stdDev(Hit_values);
  const μR = mean(Ret_values);
  const σR = stdDev(Ret_values);
  
  // Step 3: Zスコアの算出
  const ZH = σH > 0 ? (Hit_raw - μH) / σH : 0;
  const ZR = σR > 0 ? (Ret_raw - μR) / σR : 0;
  
  // Step 4: 信頼度収縮
  const Shr = Math.sqrt(N_min / (N_min + 400));
  
  // Step 5: 最終AASスコア
  const baseScore = 0.55 * ZH + 0.45 * ZR;
  const aasScore = Math.round(12 * Math.tanh(baseScore) * Shr * 10) / 10;
  
  return aasScore;
}

// ヘルパー関数
function mean(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stdDev(values: number[]): number {
  const avg = mean(values);
  const squareDiffs = values.map(value => Math.pow(value - avg, 2));
  const variance = mean(squareDiffs);
  return Math.sqrt(variance);
}
```

---

## 計算例

### RGS 1.0 計算例
```typescript
const example1 = {
  cnt_win: 300,
  cnt_plc: 200,
  rate_win_ret: 95,
  rate_plc_ret: 88
};

// Step 1: reliability = MIN(1, SQRT(500/500)) = 1.0
// Step 2: weightedDiff = (95*0.3 + 88*0.7) - 80 = 90.1 - 80 = 10.1
// Step 3: RGS = 10 * TANH(10.1 * 1.0 / 25) = 10 * TANH(0.404) ≈ 3.83

console.log(calculateRGS(example1));  // 出力: 3.83
```

### AAS 計算例
```typescript
const raceHorses: AASGroupData[] = [
  {
    group_id: 'R202401010101',
    cnt_win: 150, cnt_plc: 120,
    rate_win_hit: 35, rate_plc_hit: 55,
    rate_win_ret: 92, rate_plc_ret: 85
  },
  {
    group_id: 'R202401010101',
    cnt_win: 200, cnt_plc: 180,
    rate_win_hit: 28, rate_plc_hit: 48,
    rate_win_ret: 78, rate_plc_ret: 72
  },
  // ... 他の馬
];

const targetHorse = raceHorses[0];
console.log(calculateAAS(raceHorses, targetHorse));  // 出力: AASスコア
```

---

**重要**: この計算式は CEO から提供された正式な定義書に基づいています。実装時は必ずこのドキュメントを参照してください。
