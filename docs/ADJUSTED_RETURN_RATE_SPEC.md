# 補正回収率 計算仕様書

## 概要
補正回収率（Adjusted Return Rate）は、生の回収率から**3つの補正メカニズム**を適用し、より公平で信頼性の高い評価指標に変換したもの。

---

## 🎯 解決する問題

| 問題 | 例 | 影響 |
|------|-----|------|
| **穴馬の過大評価** | 1回の100倍的中で回収率が爆発 | 実力を正しく評価できない |
| **オッズ帯の不公平** | 高オッズ帯は構造的に回収率が低い | 条件間の比較が不可能 |
| **データの陳腐化** | 5年前のデータが現在と同じ重み | 最新トレンドを反映できない |

---

## 🔧 3つの補正メカニズム

### **1. 均等払戻方式（Kelly Criterion的アプローチ）**

#### 問題点
```
通常の計算：全馬券を同額（100円）で購入
→ 穴馬の影響が大きすぎる

例：
- 本命2倍：100円 → 200円（+100円）
- 大穴100倍：100円 → 10,000円（+9,900円）
→ 1回の大穴で回収率が10,000%に！
```

#### 補正方法
```
全馬券を同じ払戻額（10,000円）で購入したと仮定

例：
- 本命2倍：10,000円 ÷ 2倍 = 5,000円分ベット
- 大穴100倍：10,000円 ÷ 100倍 = 100円分ベット
→ オッズが高いほど少額ベット
→ オッズが低いほど多額ベット
```

#### 効果
- 穴馬の影響を自動抑制
- ベテラン馬券師の「本命を厚く買う」戦略を再現
- 実力のある条件を正しく評価

---

### **2. オッズ別配当補正係数（Normalization）**

#### 問題点
```
オッズ帯によって構造的に回収率が異なる：
- 単勝100倍以上：回収率40%（穴馬は当たらない）
- 単勝3倍付近：回収率90%（適正オッズの本命）
- 複勝17倍以上：回収率が急落
→ オッズ帯が違うと比較不可能
```

#### 補正方法
```
補正係数 = 80 ÷ オッズ帯別回収率

例：
- 単勝100倍以上の帯域：
  回収率40% → 係数 = 80/40 = 2.0（倍増補正）
  
- 単勝3倍付近の帯域：
  回収率90% → 係数 = 80/90 = 0.89（抑制補正）
  
- 複勝17倍以上の帯域：
  回収率50% → 係数 = 80/50 = 1.6（増幅補正）
```

#### 効果
- すべてのオッズ帯が**回収率80%**に正規化される
- 低オッズ条件と高オッズ条件を公平に比較可能
- 構造的な不利を自動補正

---

### **3. 期間別重み付け（Time Decay Weighting）**

#### 問題点
```
競馬界は常に変化している：
- 調教技術の進化
- 血統トレンドの変化
- 騎手の世代交代
- 馬場状態の管理手法の変化
→ 5年前のデータは現在と条件が異なる
```

#### 補正方法
```
新しいデータほど重みを大きくする

例：
- 2016年のデータ：重み = 1
- 2017年のデータ：重み = 1.2
- 2018年のデータ：重み = 2
- 2019年のデータ：重み = 3
- 2020年のデータ：重み = 5

年間の重み増加率：約20%
5年間で5倍の重み差
```

#### 効果
- 最新トレンドを重視
- 古い成功体験に依存しない
- 環境変化に自動適応

---

## 📊 補正前後の比較例

### 入力データ（芝短距離×えりも町）
```
単勝件数：11件
複勝件数：16件
生の単勝回収率：233.6%
生の複勝回収率：168.8%
```

### 補正後
```
単勝補正回収率：175.1%（-58.5pt）
複勝補正回収率：66.4%（-102.4pt）
```

### 解釈
```
複勝の補正が激しい（-102.4pt）
→ 大穴複勝が多かった可能性
→ 偶然性が高い成績と判断

単勝の補正は緩やか（-58.5pt）
→ 比較的安定した成績
→ 実力に基づく成績と判断
```

---

## 💻 実装時の注意事項

### **1. オッズ別係数テーブルの作成**
```typescript
// 事前に計算しておくべきテーブル
interface OddsCoefficient {
  odds_min: number;    // オッズ帯の下限
  odds_max: number;    // オッズ帯の上限
  avg_return: number;  // そのオッズ帯の平均回収率
  coefficient: number; // 補正係数 = 80 / avg_return
}

// 例：単勝オッズ別係数
const WIN_ODDS_COEFFICIENTS: OddsCoefficient[] = [
  { odds_min: 1.0, odds_max: 2.0, avg_return: 85, coefficient: 0.94 },
  { odds_min: 2.0, odds_max: 3.0, avg_return: 90, coefficient: 0.89 },
  { odds_min: 3.0, odds_max: 5.0, avg_return: 88, coefficient: 0.91 },
  { odds_min: 5.0, odds_max: 10.0, avg_return: 75, coefficient: 1.07 },
  { odds_min: 10.0, odds_max: 20.0, avg_return: 65, coefficient: 1.23 },
  { odds_min: 20.0, odds_max: 50.0, avg_return: 55, coefficient: 1.45 },
  { odds_min: 50.0, odds_max: 100.0, avg_return: 45, coefficient: 1.78 },
  { odds_min: 100.0, odds_max: 999.0, avg_return: 40, coefficient: 2.00 },
];

// 例：複勝オッズ別係数
const PLACE_ODDS_COEFFICIENTS: OddsCoefficient[] = [
  { odds_min: 1.0, odds_max: 1.5, avg_return: 92, coefficient: 0.87 },
  { odds_min: 1.5, odds_max: 2.0, avg_return: 88, coefficient: 0.91 },
  { odds_min: 2.0, odds_max: 3.0, avg_return: 85, coefficient: 0.94 },
  { odds_min: 3.0, odds_max: 5.0, avg_return: 78, coefficient: 1.03 },
  { odds_min: 5.0, odds_max: 10.0, avg_return: 70, coefficient: 1.14 },
  { odds_min: 10.0, odds_max: 17.0, avg_return: 60, coefficient: 1.33 },
  { odds_min: 17.0, odds_max: 999.0, avg_return: 50, coefficient: 1.60 },
];
```

### **2. 期間別重みテーブルの作成**
```typescript
// 年ごとの重み
interface YearWeight {
  year: number;
  weight: number;
}

// 例：2016年を基準年とした場合
const YEAR_WEIGHTS: YearWeight[] = [
  { year: 2016, weight: 1.0 },
  { year: 2017, weight: 1.2 },
  { year: 2018, weight: 2.0 },
  { year: 2019, weight: 3.0 },
  { year: 2020, weight: 5.0 },
  { year: 2021, weight: 6.0 },
  { year: 2022, weight: 7.0 },
  { year: 2023, weight: 8.0 },
  { year: 2024, weight: 9.0 },
  { year: 2025, weight: 10.0 },
];
```

### **3. 補正回収率の計算ロジック（疑似コード）**
```typescript
function calculateAdjustedReturnRate(
  races: Race[],
  bet_type: 'win' | 'place'
): number {
  let total_weighted_payout = 0;
  let total_weighted_bet = 0;
  
  for (const race of races) {
    // 1. 均等払戻方式：払戻10,000円を基準にベット額を逆算
    const bet_amount = 10000 / race.odds;
    
    // 2. オッズ別係数を取得
    const coefficient = getOddsCoefficient(race.odds, bet_type);
    
    // 3. 期間別重みを取得
    const year_weight = getYearWeight(race.race_date);
    
    // 4. 的中時の払戻額
    const payout = race.is_hit ? bet_amount * race.odds : 0;
    
    // 5. 重み付き集計
    const weight = coefficient * year_weight;
    total_weighted_payout += payout * weight;
    total_weighted_bet += bet_amount * weight;
  }
  
  // 6. 補正回収率
  return (total_weighted_payout / total_weighted_bet) * 100;
}
```

---

## 📝 実装の順序

### **Phase 1: データ収集（実装前の準備）**
1. 過去5年分の全レースデータを集計
2. オッズ帯別の平均回収率を算出
3. オッズ別係数テーブルを作成
4. 期間別重みテーブルを作成

### **Phase 2: 実装**
1. 係数テーブルをDBまたは設定ファイルに保存
2. 補正回収率計算関数を実装
3. 既存の生データに補正回収率カラムを追加
4. バッチ処理で全データの補正回収率を計算

### **Phase 3: 検証**
1. サンプルデータで手動計算と突合
2. 極端な値（RGS +10 や -10）の妥当性確認
3. オッズ帯別の補正効果を可視化

---

## 🚨 重要な注意事項

1. **係数テーブルは定期更新が必要**
   - 年1回程度、全体の回収率分布を再計算
   - 競馬環境の変化に対応

2. **重みテーブルは最新年を最大10に固定**
   - 古い年の重みは相対的に下がる
   - 2026年のデータが入ったら、2016年=0.5に調整

3. **実装時は係数を外部設定化**
   - ハードコードせず、JSON/YAMLで管理
   - A/Bテストで最適な係数を探索可能に

---

## 📚 関連ドキュメント

- `RGS_CALCULATION_SPEC.md` - RGS1.0の計算仕様
- `AAS_CALCULATION_SPEC.md` - AASの計算仕様

---

**最終更新日：** 2026-01-03  
**バージョン：** 1.0  
**作成者：** Enable CEO / AI戦略家
