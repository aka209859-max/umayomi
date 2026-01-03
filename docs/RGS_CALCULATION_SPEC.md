# RGS1.0 計算仕様書

## 概要
RGS1.0（Race Grade Score）は、レースの**絶対収益力**を評価する指標。  
範囲：**-10 ～ +10**（高いほど収益性が高い）

---

## 📊 入力データ

| 列 | 項目名 | 説明 |
|---|--------|------|
| H | cnt_win | 単勝件数 |
| L | cnt_plc | 複勝件数 |
| Q | adj_win_ret | 単勝補正回収率（%） |
| T | adj_plc_ret | 複勝補正回収率（%） |

---

## 🧮 計算式（Excel形式）

### Step 1: 件数合計（W列）
```excel
W2 = H2 + L2
```

### Step 2: 係数R（X列）= 信頼度
```excel
X2 = MIN(1, SQRT(W2/500))
```
- サンプル数が500件で信頼度100%
- サンプル数が少ないほど信頼度が低下
- 目的：少数サンプルの過大評価を防ぐ

### Step 3: 加重回収率（Y列）
```excel
Y2 = Q2*$Y$1 + T2*$Z$1
```
- `$Y$1 = 0.3`（単勝の重み）
- `$Z$1 = 0.7`（複勝の重み）
- **複勝を重視**する設計（より安定性を評価）

### Step 4: 乖離（Z列）
```excel
Z2 = Y2 - 80
```
- 基準値：**80%**（一般的な競馬の期待回収率）
- プラス：基準より優秀
- マイナス：基準より劣る

### Step 5: 調整乖離（AA列）
```excel
AA2 = Z2 * X2
```
- 乖離に信頼度を掛けて調整
- サンプル数が少ない場合、スコアが抑制される

### Step 6: 正規化（AB列）
```excel
AB2 = AA2 / 25
```
- 分母25でスケーリング
- TANH関数に適した範囲に正規化

### Step 7: 最終スコア RGS（AC列）
```excel
AC2 = 10 * TANH(AB2)
```
- TANH関数で-10～+10に収束
- 双曲線正接により極端な値を自動抑制

---

## 📈 スコアの解釈

| RGSスコア | 評価 | 意味 |
|----------|------|------|
| +7.0 ～ +10.0 | ★★★★★ | 超優良レース（積極的に狙うべき） |
| +4.0 ～ +6.9 | ★★★★☆ | 優良レース（推奨） |
| +1.0 ～ +3.9 | ★★★☆☆ | やや良好（条件次第） |
| -1.0 ～ +0.9 | ★★☆☆☆ | 平均的 |
| -4.0 ～ -1.1 | ★☆☆☆☆ | やや不良（注意） |
| -10.0 ～ -4.1 | ☆☆☆☆☆ | 不良レース（避けるべき） |

---

## 💻 TypeScript実装

```typescript
/**
 * RGS1.0（Race Grade Score）を計算
 * @param cnt_win - 単勝件数（H列）
 * @param cnt_plc - 複勝件数（L列）
 * @param adj_win_ret - 単勝補正回収率（Q列、%表記）
 * @param adj_plc_ret - 複勝補正回収率（T列、%表記）
 * @param weight_win - 単勝の重み（デフォルト: 0.3）
 * @param weight_plc - 複勝の重み（デフォルト: 0.7）
 * @returns RGS1.0スコア（-10 ～ +10）
 */
function calculateRGS(
  cnt_win: number,
  cnt_plc: number,
  adj_win_ret: number,
  adj_plc_ret: number,
  weight_win: number = 0.3,
  weight_plc: number = 0.7
): number {
  // Step 1: 件数合計
  const total_count = cnt_win + cnt_plc;
  
  // Step 2: 係数R（信頼度）
  const reliability = Math.min(1, Math.sqrt(total_count / 500));
  
  // Step 3: 加重回収率
  const weighted_ret = adj_win_ret * weight_win + adj_plc_ret * weight_plc;
  
  // Step 4: 乖離
  const deviation = weighted_ret - 80;
  
  // Step 5: 調整乖離
  const adj_deviation = deviation * reliability;
  
  // Step 6: 正規化
  const z_norm = adj_deviation / 25;
  
  // Step 7: RGS
  const rgs = 10 * Math.tanh(z_norm);
  
  return Math.round(rgs * 100) / 100;
}

// 使用例
const rgs = calculateRGS(11, 16, 175.1, 66.4);
console.log(`RGS1.0: ${rgs}`); // 1.75
```

---

## 🧪 計算例

### 入力データ
```
cnt_win = 11
cnt_plc = 16
adj_win_ret = 175.1
adj_plc_ret = 66.4
```

### 計算プロセス
```
W = 11 + 16 = 27
X = MIN(1, SQRT(27/500)) = 0.2324
Y = 175.1 * 0.3 + 66.4 * 0.7 = 99.01
Z = 99.01 - 80 = 19.01
AA = 19.01 * 0.2324 = 4.418
AB = 4.418 / 25 = 0.1767
AC = 10 * TANH(0.1767) = 1.75
```

### 結果
```
RGS1.0 = 1.75（★★★☆☆ やや良好）
```

---

## 🔄 補正回収率との関係

RGS1.0は**補正回収率（Q列、T列）** を使用します。  
補正回収率の計算方法については、別ファイル `ADJUSTED_RETURN_RATE_SPEC.md` を参照してください。

---

## 📝 注意事項

1. **サンプル数の重要性**
   - 27件（信頼度23%）→ スコアは抑制される
   - 500件（信頼度100%）→ 真の実力を反映

2. **補正回収率の必須性**
   - 生の回収率ではなく、補正回収率を使用
   - 穴馬の過大評価を防ぐ

3. **基準値80%の意味**
   - JRAの控除率約20%を考慮した現実的な基準
   - 80%を超える = 期待値がプラス

---

## 📚 関連ドキュメント

- `ADJUSTED_RETURN_RATE_SPEC.md` - 補正回収率の計算仕様
- `AAS_CALCULATION_SPEC.md` - AAS（相対評価指標）の計算仕様

---

**最終更新日：** 2026-01-03  
**バージョン：** 1.0  
**作成者：** Enable CEO / AI戦略家
