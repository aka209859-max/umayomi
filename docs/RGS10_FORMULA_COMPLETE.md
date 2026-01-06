# RGS1.0計算式 - 完全版ドキュメント

**最終更新**: 2026-01-04  
**バージョン**: RGS1.0  
**作成者**: UMAYOMI開発チーム

---

## 📋 このドキュメントについて

このドキュメントは、**RGS1.0（Racing Grade Score）** の完全な計算式と実装方法を定義します。  
RGS1.0は、競馬のファクター（条件組み合わせ）の**絶対的な収益力**を評価する指標です。

### 関連ドキュメント
- **AAS（Adaptive Ability Score）**: 相対評価スコア（-12 ～ +12）
- **RGS1.0**: 絶対評価スコア（-10 ～ +10）← **このドキュメント**

---

## 🎯 RGS1.0とは

### 概要
- **名称**: Racing Grade Score 1.0
- **目的**: ファクターの**絶対的な収益力**を評価
- **スコア範囲**: -10.0 ～ +10.0
- **評価方式**: 絶対評価（固定基準80%との乖離を評価）
- **適用対象**: レースファクター、競走馬、騎手、調教師など

### AASとの違い

| 項目 | RGS1.0 | AAS |
|------|---------|-----|
| 評価方式 | **絶対評価** | 相対評価 |
| 基準 | 固定（80%回収率） | グループ内の平均 |
| スコア範囲 | -10 ～ +10 | -12 ～ +12 |
| 目的 | 収益力の絶対値 | グループ内での優劣 |
| 用途 | 単独ファクターの評価 | 複数ファクターの順位付け |

### 使い分け
- **RGS1.0を使う場合**: 「このファクターは儲かるのか？」を判断
- **AASを使う場合**: 「どのファクターが一番優秀か？」を判断

---

## 📊 入力データ

### 必須パラメータ

| 変数名 | Excel列 | 説明 | 単位 | 必須 |
|--------|---------|------|------|------|
| `cntWin` | H列 | 単勝件数 | 件 | ✅ |
| `cntPlace` | L列 | 複勝件数 | 件 | ✅ |
| `adjWinRet` | Q列 | **単勝補正回収率** | % | ✅ |
| `adjPlaceRet` | T列 | **複勝補正回収率** | % | ✅ |

### オプションパラメータ

| 変数名 | デフォルト値 | 説明 |
|--------|--------------|------|
| `weightWin` | 0.3 | 単勝の重み |
| `weightPlace` | 0.7 | 複勝の重み |

### ⚠️ 最重要：補正回収率を使用

**絶対に生の回収率を使わないでください！**

```
❌ 間違い: rateWinRet, ratePlaceRet（生の回収率）
✅ 正解: adjWinRet, adjPlaceRet（補正回収率）
```

**理由**:
- 生の回収率にはオッズの偏り（人気偏重）が含まれる
- 補正回収率は期間重み付け + オッズ補正済み
- 差異は最大で ±50pt 以上になる場合がある

---

## 🧮 計算式（7ステップ）

### Step 1: 総件数（W）

```
W = H + L
W = cntWin + cntPlace
```

**意味**: 単勝と複勝の合計件数（サンプルサイズ）

**例**:
```
cntWin = 11件
cntPlace = 16件
→ W = 27件
```

---

### Step 2: 信頼度（X）

```
X = MIN(1, SQRT(W / 500))
```

**意味**: サンプル数による信頼度補正（0 ～ 1）

**仕組み**:
- W = 500件で信頼度100%（X = 1.0）
- W = 125件で信頼度50%（X = 0.5）
- W < 500件では√比例で減衰

**例**:
```
W = 27件
→ X = SQRT(27 / 500) = SQRT(0.054) = 0.2324
→ 信頼度 23.24%
```

**信頼度テーブル**:

| 総件数 | 信頼度 | 解釈 |
|--------|--------|------|
| 500件以上 | 100% | 十分な信頼性 |
| 200件 | 63.2% | やや信頼できる |
| 100件 | 44.7% | 参考程度 |
| 50件 | 31.6% | 信頼性低い |
| 25件 | 22.4% | ほぼ参考外 |

---

### Step 3: 加重回収率（Y）

```
Y = Q × 0.3 + T × 0.7
Y = adjWinRet × weightWin + adjPlaceRet × weightPlace
```

**意味**: 単勝と複勝の加重平均回収率

**係数の根拠**:
- 単勝: 0.3（リスク高い、払戻し大）
- 複勝: 0.7（リスク低い、安定性高い）
- 複勝を重視する保守的な評価

**例**:
```
adjWinRet = 175.1%
adjPlaceRet = 66.4%
→ Y = 175.1 × 0.3 + 66.4 × 0.7
→ Y = 52.53 + 46.48 = 99.01%
```

---

### Step 4: 乖離（Z）

```
Z = Y - 80
```

**意味**: 基準回収率（80%）からの乖離

**基準80%の根拠**:
- 馬券の控除率（JRA）: 約20-25%
- 実質的な期待回収率: 75-80%
- 80%を上回れば「儲かる」、下回れば「損する」

**例**:
```
Y = 99.01%
→ Z = 99.01 - 80 = 19.01pt
```

**乖離の解釈**:

| 乖離（Z） | 回収率 | 評価 |
|-----------|--------|------|
| +30pt以上 | 110%以上 | 超優良 |
| +20～+30pt | 100～110% | 優良 |
| +10～+20pt | 90～100% | やや良好 |
| 0～+10pt | 80～90% | 平均的 |
| -10～0pt | 70～80% | やや不良 |
| -10pt以下 | 70%以下 | 避けるべき |

---

### Step 5: 調整乖離（AA）

```
AA = Z × X
```

**意味**: 信頼度で補正した乖離

**仕組み**:
- サンプル数が少ないと乖離が割り引かれる
- サンプル数が十分なら乖離がそのまま反映される

**例**:
```
Z = 19.01pt
X = 0.2324
→ AA = 19.01 × 0.2324 = 4.42
```

**調整の効果**:

| ケース | W | X | Z | AA | 解釈 |
|--------|---|---|---|----|----|
| 大量データ | 500件 | 1.0 | +20pt | +20.0 | 乖離そのまま |
| 中量データ | 100件 | 0.45 | +20pt | +9.0 | 乖離が半減 |
| 少量データ | 25件 | 0.22 | +20pt | +4.4 | 乖離が1/5 |

---

### Step 6: 正規化（AB）

```
AB = AA / 25
```

**意味**: TANH関数の入力用に正規化

**係数25の根拠**:
- 調整乖離 ±25 で TANH の入力 ±1.0 になる
- TANH(1.0) ≈ 0.76、TANH(-1.0) ≈ -0.76
- ±25 を超える場合は飽和（最大値に近づく）

**例**:
```
AA = 4.42
→ AB = 4.42 / 25 = 0.1768
```

**正規化テーブル**:

| AA | AB | TANH(AB) |
|----|-------|----------|
| +50 | +2.0 | +0.964 |
| +25 | +1.0 | +0.762 |
| +12.5 | +0.5 | +0.462 |
| 0 | 0.0 | 0.000 |
| -12.5 | -0.5 | -0.462 |
| -25 | -1.0 | -0.762 |
| -50 | -2.0 | -0.964 |

---

### Step 7: 最終スコア（AC）

```
AC = 10 × TANH(AB)
RGS1.0 = 10 × TANH(normalized)
```

**意味**: -10 ～ +10 の範囲にスケーリング

**TANH関数の特性**:
- 入力が0付近: ほぼ線形（1:1で変化）
- 入力が±1を超える: 飽和（最大値に近づく）
- 範囲: -1 ～ +1

**例**:
```
AB = 0.1768
→ TANH(0.1768) = 0.1749
→ AC = 10 × 0.1749 = 1.749
→ RGS1.0 = 1.75（小数点2桁）
```

---

## 📈 スコア解釈

### スコア区分

| RGS1.0 | 星評価 | ラベル | 意味 | 戦略 |
|--------|--------|--------|------|------|
| +7.0 ～ +10.0 | ★★★★★★ | 超優良レース | 圧倒的に儲かる | 全力投資 |
| +4.0 ～ +6.9 | ★★★★★☆ | 優良レース | 明確に儲かる | 積極的に狙う |
| +1.0 ～ +3.9 | ★★★★☆☆ | やや良好 | 少し儲かる | 条件次第で狙う |
| -1.0 ～ +0.9 | ★★★☆☆☆ | 平均的 | トントン | 他条件と組み合わせ |
| -4.0 ～ -1.1 | ★★☆☆☆☆ | やや不良 | 少し損する | 慎重に |
| -10.0 ～ -4.1 | ★☆☆☆☆☆ | 避けるべき | 大きく損する | 避ける |

### 実務的な目安

| RGS1.0 | 加重回収率（目安） | 評価 | 戦略 |
|--------|-------------------|------|------|
| +8.0 | 150%以上 | 🔥 超優良 | 見つけたら全力 |
| +5.0 | 120-150% | ✅ 優良 | 積極的に狙う |
| +2.0 | 95-120% | 👍 やや良好 | 条件次第で |
| 0.0 | 80% | ⚠️ 平均的 | 慎重に |
| -3.0 | 60-80% | ❌ 不良 | 避けるべき |
| -6.0 | 50%以下 | 🚫 超不良 | 絶対避ける |

---

## 💻 実装例

### TypeScript実装

```typescript
/**
 * RGS1.0の入力パラメータ
 */
export interface RGS10Input {
  cntWin: number;         // H列：単勝件数
  cntPlace: number;       // L列：複勝件数
  adjWinRet: number;      // Q列：単勝補正回収率（%）
  adjPlaceRet: number;    // T列：複勝補正回収率（%）
  weightWin?: number;     // 単勝の重み（デフォルト0.3）
  weightPlace?: number;   // 複勝の重み（デフォルト0.7）
}

/**
 * RGS1.0の計算結果
 */
export interface RGS10Result {
  rgsScore: number;              // RGS1.0スコア（-10 ～ +10）
  totalCount: number;            // 総件数（W = H + L）
  reliability: number;           // 信頼度（0 ～ 1）
  weightedReturnRate: number;    // 加重回収率（Y = Q*0.3 + T*0.7）
  deviation: number;             // 乖離（Z = Y - 80）
  adjustedDeviation: number;     // 調整乖離（AA = Z * X）
  normalized: number;            // 正規化（AB = AA / 25）
  interpretation: string;        // 解釈（例：★★★★☆ やや良好）
}

/**
 * RGS1.0を計算
 */
export function calculateRGS10(input: RGS10Input): RGS10Result {
  const {
    cntWin,
    cntPlace,
    adjWinRet,
    adjPlaceRet,
    weightWin = 0.3,
    weightPlace = 0.7,
  } = input;
  
  // Step 1: 総件数（W = H + L）
  const totalCount = cntWin + cntPlace;
  
  // Step 2: 信頼度（X = MIN(1, SQRT(W/500))）
  const reliability = Math.min(1, Math.sqrt(totalCount / 500));
  
  // Step 3: 加重回収率（Y = Q*0.3 + T*0.7）
  const weightedReturnRate = adjWinRet * weightWin + adjPlaceRet * weightPlace;
  
  // Step 4: 乖離（Z = Y - 80）
  const deviation = weightedReturnRate - 80;
  
  // Step 5: 調整乖離（AA = Z * X）
  const adjustedDeviation = deviation * reliability;
  
  // Step 6: 正規化（AB = AA / 25）
  const normalized = adjustedDeviation / 25;
  
  // Step 7: 最終スコア（AC = 10 * TANH(AB)）
  const rgsScore = 10 * Math.tanh(normalized);
  
  // Step 8: 解釈
  const interpretation = getRGSInterpretation(rgsScore);
  
  return {
    rgsScore: Math.round(rgsScore * 100) / 100, // 小数点2桁
    totalCount,
    reliability: Math.round(reliability * 10000) / 10000, // 小数点4桁
    weightedReturnRate: Math.round(weightedReturnRate * 100) / 100,
    deviation: Math.round(deviation * 100) / 100,
    adjustedDeviation: Math.round(adjustedDeviation * 100) / 100,
    normalized: Math.round(normalized * 10000) / 10000,
    interpretation,
  };
}

/**
 * RGSスコアから解釈を取得
 */
function getRGSInterpretation(score: number): string {
  if (score >= 7.0) return '★★★★★★ 超優良レース';
  if (score >= 4.0) return '★★★★★☆ 優良レース';
  if (score >= 1.0) return '★★★★☆☆ やや良好';
  if (score >= -1.0) return '★★★☆☆☆ 平均的';
  if (score >= -4.0) return '★★☆☆☆☆ やや不良';
  return '★☆☆☆☆☆ 避けるべき';
}
```

---

### Python実装

```python
import math

def calculate_rgs10(cnt_win, cnt_place, adj_win_ret, adj_place_ret,
                    weight_win=0.3, weight_place=0.7):
    """
    RGS1.0を計算
    
    Args:
        cnt_win: 単勝件数
        cnt_place: 複勝件数
        adj_win_ret: 単勝補正回収率（%）
        adj_place_ret: 複勝補正回収率（%）
        weight_win: 単勝の重み（デフォルト0.3）
        weight_place: 複勝の重み（デフォルト0.7）
    
    Returns:
        dict: RGS1.0の計算結果
    """
    # Step 1: 総件数
    total_count = cnt_win + cnt_place
    
    # Step 2: 信頼度
    reliability = min(1, math.sqrt(total_count / 500))
    
    # Step 3: 加重回収率
    weighted_return_rate = adj_win_ret * weight_win + adj_place_ret * weight_place
    
    # Step 4: 乖離
    deviation = weighted_return_rate - 80
    
    # Step 5: 調整乖離
    adjusted_deviation = deviation * reliability
    
    # Step 6: 正規化
    normalized = adjusted_deviation / 25
    
    # Step 7: 最終スコア
    rgs_score = 10 * math.tanh(normalized)
    
    # Step 8: 解釈
    if rgs_score >= 7.0:
        interpretation = '★★★★★★ 超優良レース'
    elif rgs_score >= 4.0:
        interpretation = '★★★★★☆ 優良レース'
    elif rgs_score >= 1.0:
        interpretation = '★★★★☆☆ やや良好'
    elif rgs_score >= -1.0:
        interpretation = '★★★☆☆☆ 平均的'
    elif rgs_score >= -4.0:
        interpretation = '★★☆☆☆☆ やや不良'
    else:
        interpretation = '★☆☆☆☆☆ 避けるべき'
    
    return {
        'rgs_score': round(rgs_score, 2),
        'total_count': total_count,
        'reliability': round(reliability, 4),
        'weighted_return_rate': round(weighted_return_rate, 2),
        'deviation': round(deviation, 2),
        'adjusted_deviation': round(adjusted_deviation, 2),
        'normalized': round(normalized, 4),
        'interpretation': interpretation
    }

# テスト実行
if __name__ == '__main__':
    result = calculate_rgs10(
        cnt_win=11,
        cnt_place=16,
        adj_win_ret=175.1,
        adj_place_ret=66.4
    )
    
    print(f"RGS1.0スコア: {result['rgs_score']}")
    print(f"評価: {result['interpretation']}")
```

---

### Excel実装（単一セル式）

```excel
=LET(
    H, 単勝件数セル,
    L, 複勝件数セル,
    Q, 単勝補正回収率セル,
    T, 複勝補正回収率セル,
    
    W, H + L,
    X, MIN(1, SQRT(W/500)),
    Y, Q*0.3 + T*0.7,
    Z, Y - 80,
    AA, Z * X,
    AB, AA / 25,
    AC, 10 * TANH(AB),
    
    ROUND(AC, 2)
)
```

### Excel実装（分割セル式）

| 列 | セル名 | 式 | 説明 |
|----|--------|----|----|
| W | 総件数 | `=H2+L2` | 単勝+複勝 |
| X | 信頼度 | `=MIN(1,SQRT(W2/500))` | √補正 |
| Y | 加重回収率 | `=Q2*0.3+T2*0.7` | 単3:複7 |
| Z | 乖離 | `=Y2-80` | 基準80%との差 |
| AA | 調整乖離 | `=Z2*X2` | 信頼度補正 |
| AB | 正規化 | `=AA2/25` | TANH入力 |
| AC | RGS1.0 | `=10*TANH(AB2)` | 最終スコア |

---

## 🧪 検証用テストケース

### テストケース1: 優良ファクター（ドキュメント例）

**入力**:
```
cntWin = 11件
cntPlace = 16件
adjWinRet = 175.1%
adjPlaceRet = 66.4%
```

**計算過程**:
```
W = 11 + 16 = 27件
X = MIN(1, SQRT(27/500)) = 0.2324 (23.24%)
Y = 175.1×0.3 + 66.4×0.7 = 52.53 + 46.48 = 99.01%
Z = 99.01 - 80 = 19.01pt
AA = 19.01 × 0.2324 = 4.42
AB = 4.42 / 25 = 0.1768
TANH(0.1768) = 0.1749
AC = 10 × 0.1749 = 1.749
```

**期待される出力**:
```
RGS1.0 = 1.75 (±0.02の誤差許容)
評価: ★★★★☆☆ やや良好
```

---

### テストケース2: 超優良ファクター

**入力**:
```
cntWin = 100件
cntPlace = 100件
adjWinRet = 200.0%
adjPlaceRet = 180.0%
```

**期待される出力**:
```
W = 200件
X = 0.6325 (63.25%)
Y = 200×0.3 + 180×0.7 = 186.0%
Z = 186 - 80 = 106pt
AA = 106 × 0.6325 = 67.04
AB = 67.04 / 25 = 2.68
TANH(2.68) = 0.9914
RGS1.0 = 9.91 ≈ 9.91

評価: ★★★★★★ 超優良レース
```

---

### テストケース3: 平均的ファクター

**入力**:
```
cntWin = 30件
cntPlace = 30件
adjWinRet = 80.0%
adjPlaceRet = 80.0%
```

**期待される出力**:
```
W = 60件
X = 0.3464 (34.64%)
Y = 80×0.3 + 80×0.7 = 80.0%
Z = 80 - 80 = 0pt
AA = 0 × 0.3464 = 0
AB = 0 / 25 = 0
TANH(0) = 0
RGS1.0 = 0.00

評価: ★★★☆☆☆ 平均的
```

---

### テストケース4: 不良ファクター

**入力**:
```
cntWin = 20件
cntPlace = 20件
adjWinRet = 40.0%
adjPlaceRet = 50.0%
```

**期待される出力**:
```
W = 40件
X = 0.2828 (28.28%)
Y = 40×0.3 + 50×0.7 = 47.0%
Z = 47 - 80 = -33pt
AA = -33 × 0.2828 = -9.33
AB = -9.33 / 25 = -0.373
TANH(-0.373) = -0.356
RGS1.0 = -3.56 ≈ -3.56

評価: ★★☆☆☆☆ やや不良
```

---

### テストケース5: データ不足ファクター

**入力**:
```
cntWin = 5件
cntPlace = 5件
adjWinRet = 200.0%
adjPlaceRet = 150.0%
```

**期待される出力**:
```
W = 10件
X = 0.1414 (14.14%)
Y = 200×0.3 + 150×0.7 = 165.0%
Z = 165 - 80 = 85pt
AA = 85 × 0.1414 = 12.02
AB = 12.02 / 25 = 0.481
TANH(0.481) = 0.448
RGS1.0 = 4.48 ≈ 4.48

評価: ★★★★★☆ 優良レース（ただし信頼度低い）
```

**注意**: 高スコアだが信頼度14%なので参考程度

---

## ⚠️ よくある間違いと対策

### 1. 補正回収率を使っていない（最重要！）

```
❌ 間違い: rateWinRet, ratePlaceRet（生の回収率）
✅ 正解: adjWinRet, adjPlaceRet（補正回収率）
```

**影響**: スコアが ±2～3ポイント変わる可能性

---

### 2. 信頼度の計算ミス

```
❌ 間違い: SQRT(W) / 500
✅ 正解: SQRT(W / 500)
```

---

### 3. 加重回収率の係数ミス

```
❌ 間違い: adjWinRet×0.5 + adjPlaceRet×0.5
✅ 正解: adjWinRet×0.3 + adjPlaceRet×0.7
```

---

### 4. 基準回収率の誤り

```
❌ 間違い: deviation = weightedReturnRate - 100
✅ 正解: deviation = weightedReturnRate - 80
```

---

### 5. 正規化係数の誤り

```
❌ 間違い: normalized = adjustedDeviation / 10
✅ 正解: normalized = adjustedDeviation / 25
```

---

### 6. TANH関数の省略

```
❌ 間違い: rgsScore = 10 * normalized
✅ 正解: rgsScore = 10 * TANH(normalized)
```

---

### 7. 小数点の丸め忘れ

```
❌ 間違い: rgsScore = 1.7492938475
✅ 正解: rgsScore = 1.75（小数点2桁）
```

---

## 📐 数学的背景

### TANH関数の特性

TANH（双曲線正接）は以下の特性を持つ:

```
TANH(x) = (e^x - e^(-x)) / (e^x + e^(-x))
```

**特性**:
- 範囲: -1 ～ +1
- 原点対称: TANH(-x) = -TANH(x)
- 0付近で線形: TANH(x) ≈ x（|x| < 0.5）
- 飽和特性: |x| > 2 で ±1 に近づく

**RGS1.0での役割**:
- 極端な値を抑制（外れ値の影響を軽減）
- -10 ～ +10 の範囲に収める
- 0付近では線形性を保つ

---

### 信頼度の√補正の根拠

```
X = MIN(1, SQRT(W / 500))
```

**統計学的根拠**:
- サンプル数Nの標準誤差は 1/√N に比例
- 信頼度は √N に比例
- 500件で100%の信頼度とする基準設定

**実用的効果**:
- 少量データのスコアを割り引く
- 大量データのスコアを信頼する
- 極端なスコアの過大評価を防ぐ

---

### 基準80%の設定根拠

**JRAの控除率**:
- 単勝: 20.0%
- 複勝: 22.5%
- 馬連: 22.5%
- 馬単: 25.0%

**実質的な期待回収率**:
- 単勝: 80.0%
- 複勝: 77.5%
- 加重平均（0.3:0.7）: 約78.5%

**基準として80%を採用**:
- キリの良い数値
- 実質的な期待値に近い
- 80%を上回れば「儲かる」と判断可能

---

## 🎓 高度な活用法

### 1. AASとRGS1.0の組み合わせ

**推奨戦略**:
```
総合評価 = (AAS × 0.4) + (RGS1.0 × 0.6)
```

**解釈**:
- AAS: グループ内での相対的な優位性
- RGS1.0: 絶対的な収益力
- 両方が高い: 最優良ファクター
- AAS高、RGS低: グループ内では優秀だが収益力は普通
- AAS低、RGS高: グループ内では劣るが収益力は高い

---

### 2. 信頼度による戦略調整

```
if (reliability < 0.3):
    # 信頼度低い → 参考程度
    strategy = "慎重に様子見"
elif (reliability < 0.6):
    # 信頼度中程度 → 条件次第
    strategy = "他条件と組み合わせ"
else:
    # 信頼度高い → 積極的
    strategy = "RGSスコアに従う"
```

---

### 3. 動的な重み調整

**状況に応じて単勝/複勝の重みを変更**:

```python
# 高配当狙いモード（単勝重視）
result_aggressive = calculate_rgs10(
    cnt_win=100,
    cnt_place=100,
    adj_win_ret=200,
    adj_place_ret=150,
    weight_win=0.5,  # 単勝の重みを上げる
    weight_place=0.5
)

# 安定志向モード（複勝重視）
result_conservative = calculate_rgs10(
    cnt_win=100,
    cnt_place=100,
    adj_win_ret=200,
    adj_place_ret=150,
    weight_win=0.2,  # 複勝の重みを上げる
    weight_place=0.8
)
```

---

## 🔍 実データでの検証方法

### Step 1: データ準備

```sql
SELECT
    factor_id,
    SUM(CASE WHEN bet_type='win' THEN 1 ELSE 0 END) as cnt_win,
    SUM(CASE WHEN bet_type='place' THEN 1 ELSE 0 END) as cnt_place,
    AVG(CASE WHEN bet_type='win' THEN adj_return_rate END) as adj_win_ret,
    AVG(CASE WHEN bet_type='place' THEN adj_return_rate END) as adj_place_ret
FROM factor_scores
GROUP BY factor_id
```

---

### Step 2: RGS計算

```python
for row in data:
    result = calculate_rgs10(
        cnt_win=row['cnt_win'],
        cnt_place=row['cnt_place'],
        adj_win_ret=row['adj_win_ret'],
        adj_place_ret=row['adj_place_ret']
    )
    print(f"Factor {row['factor_id']}: RGS={result['rgs_score']} {result['interpretation']}")
```

---

### Step 3: バックテスト

```python
# RGS +4.0以上のファクターでバックテスト
good_factors = [f for f in factors if f['rgs_score'] >= 4.0]

total_bets = 0
total_return = 0

for factor in good_factors:
    for race in factor['past_races']:
        total_bets += 100  # 100円ずつ購入
        total_return += race['payout']

final_return_rate = (total_return / total_bets) * 100
print(f"実回収率: {final_return_rate:.2f}%")
print(f"期待値との差: {final_return_rate - 80:.2f}pt")
```

---

## ✅ 実装チェックリスト

実装したら、以下を確認してください：

- [ ] **補正回収率**（adjWinRet, adjPlaceRet）を使用
- [ ] 総件数 = cntWin + cntPlace
- [ ] 信頼度 = MIN(1, SQRT(総件数 / 500))
- [ ] 加重回収率 = adjWinRet×0.3 + adjPlaceRet×0.7
- [ ] 乖離 = 加重回収率 - 80
- [ ] 調整乖離 = 乖離 × 信頼度
- [ ] 正規化 = 調整乖離 / 25
- [ ] 最終スコア = 10 × TANH(正規化)
- [ ] 小数点2桁で丸める
- [ ] テストケースで検証（±0.02の誤差内）

---

## 📚 参考資料

- 実装コード: `src/utils/rgs10.ts`
- テストケース: `scripts/test_phase5.ts`
- AAS計算式: `docs/AAS_FORMULA_COMPLETE.md`
- Phase 5ドキュメント: `docs/PHASE5_補正回収率とファクタースコア計算.md`

---

## 📞 質問・フィードバック

このドキュメントで不明な点があれば、以下を確認してください：

1. **テストケースで検証**: まず5つのテストケースで実装を確認
2. **よくある間違い**: 7つのよくある間違いをチェック
3. **Excel式で試算**: LET関数式をExcelで試してみる

---

**このドキュメントを他のAIに渡せば、RGS1.0計算を正確に実装できます。**
