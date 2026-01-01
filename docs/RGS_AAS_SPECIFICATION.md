# RGS1.0 と AAS の計算仕様書

**作成日**: 2025-01-01  
**プロジェクト**: UMAYOMI - 馬を読む。レースが変わる。

---

## 📋 目次

1. [概要](#概要)
2. [RGS1.0 (Race Grade Score)](#rgs10-race-grade-score)
3. [AAS (Advanced Analysis Score)](#aas-advanced-analysis-score)
4. [実装方針](#実装方針)
5. [PostgreSQL での実装例](#postgresql-での実装例)

---

## 概要

### 2つの評価指標

UMAYOMI では、以下の2つの異なる評価指標を使用します：

1. **RGS1.0 (Race Grade Score)**: 絶対収益力評価
   - 基準回収率(80%)からの乖離を評価
   - データ件数による信頼度で補正
   - **出力範囲**: -10 ～ +10

2. **AAS (Advanced Analysis Score)**: 相対偏差値評価
   - 同一レース内での相対的な強さ（偏差値）を算出
   - ベイズ的アプローチで信頼度補正
   - **出力範囲**: 約 -12 ～ +12

**重要**: これらは計算ロジックが全く異なるため、必ず区別して処理すること。

---

## RGS1.0 (Race Grade Score)

### 概要
基準回収率(80%)からの乖離を、データ件数による信頼度で補正した絶対評価スコア。

### 1. 入力変数 (Inputs)

| 変数名 | 説明 | 元の列 |
|--------|------|--------|
| `cnt_win` | 単勝投票件数 | H列 |
| `cnt_plc` | 複勝投票件数 | L列 |
| `rate_win_ret` | 単勝補正回収率 | Q列 |
| `rate_plc_ret` | 複勝補正回収率 | T列 |

### 2. 計算ロジック (Logic)

#### Step 1: 信頼度係数 (Reliability)
```
Reliability = MIN(1, SQRT((cnt_win + cnt_plc) / 500))
```
- **意図**: 件数が500件以上で信頼度MAX(1.0)とする。

#### Step 2: 加重平均乖離 (Weighted Diff)
```
Weighted_Diff = ((rate_win_ret * 0.3) + (rate_plc_ret * 0.7)) - 80
```
- **意図**: 複勝重視(7:3)で回収率を計算し、分岐点80を引く。

#### Step 3: 最終RGSスコア
```
RGS = 10 * TANH((Weighted_Diff * Reliability) / 25)
```
- **出力**: -10 ～ +10 の範囲に正規化された数値。

### 3. 数式まとめ

```python
# Python での実装例
import math

def calculate_rgs(cnt_win, cnt_plc, rate_win_ret, rate_plc_ret):
    # Step 1: 信頼度係数
    reliability = min(1.0, math.sqrt((cnt_win + cnt_plc) / 500))
    
    # Step 2: 加重平均乖離
    weighted_diff = ((rate_win_ret * 0.3) + (rate_plc_ret * 0.7)) - 80
    
    # Step 3: 最終RGSスコア
    rgs = 10 * math.tanh((weighted_diff * reliability) / 25)
    
    return round(rgs, 2)
```

---

## AAS (Advanced Analysis Score)

### 概要
同一レース内での相対的な強さ（偏差値）を算出し、ベイズ的アプローチで信頼度補正を行う高度分析スコア。

### 1. 入力変数 (Inputs)

| 変数名 | 説明 | 元の列 |
|--------|------|--------|
| `group_id` | レースID (グループ化キー) | E列 |
| `cnt_win` | 単勝件数 | H列 |
| `cnt_plc` | 複勝件数 | L列 |
| `rate_win_hit` | 単勝的中率 | J列 |
| `rate_plc_hit` | 複勝的中率 | N列 |
| `rate_win_ret` | 単勝回収率 | Q列 |
| `rate_plc_ret` | 複勝回収率 | T列 |

### 2. 計算ロジック (Logic)

#### Step 1: 基礎値 (Raw Values) の算出
各馬について以下を計算する。

```
N_min = MIN(cnt_win, cnt_plc)                             # 安定件数
Hit_raw = 0.65 * rate_win_hit + 0.35 * rate_plc_hit      # 命中強度
Ret_raw = 0.35 * rate_win_ret + 0.65 * rate_plc_ret      # 収益強度
```

#### Step 2: グループ統計 (Group Stats) の算出
同一 `group_id` 内の全馬を使って統計をとる。

```
μH, σH: Hit_raw の平均と標準偏差
μR, σR: Ret_raw の平均と標準偏差
```

#### Step 3: Zスコア (Standardization) の算出
各馬の偏差値を計算する。

```
ZH = (Hit_raw - μH) / σH    # 標準偏差0の場合は0
ZR = (Ret_raw - μR) / σR    # 標準偏差0の場合は0
```

#### Step 4: 信頼度収縮 (Shrinkage)
件数が少ないデータの評価を抑制する係数。

```
Shr = SQRT(N_min / (N_min + 400))
```

#### Step 5: 最終AASスコア

```
ベース計算 = 0.55 * ZH + 0.45 * ZR
最終式 = ROUND(12 * TANH(ベース計算) * Shr, 1)
```

### 3. 数式まとめ

```python
# Python での実装例
import math
import pandas as pd

def calculate_aas(df):
    """
    df: pandas DataFrame with columns:
        - group_id (レースID)
        - cnt_win, cnt_plc, rate_win_hit, rate_plc_hit, rate_win_ret, rate_plc_ret
    """
    # Step 1: 基礎値の算出
    df['N_min'] = df[['cnt_win', 'cnt_plc']].min(axis=1)
    df['Hit_raw'] = 0.65 * df['rate_win_hit'] + 0.35 * df['rate_plc_hit']
    df['Ret_raw'] = 0.35 * df['rate_win_ret'] + 0.65 * df['rate_plc_ret']
    
    # Step 2: グループ統計
    grouped = df.groupby('group_id')
    df['μH'] = grouped['Hit_raw'].transform('mean')
    df['σH'] = grouped['Hit_raw'].transform('std').fillna(0)
    df['μR'] = grouped['Ret_raw'].transform('mean')
    df['σR'] = grouped['Ret_raw'].transform('std').fillna(0)
    
    # Step 3: Zスコア
    df['ZH'] = ((df['Hit_raw'] - df['μH']) / df['σH']).fillna(0)
    df['ZR'] = ((df['Ret_raw'] - df['μR']) / df['σR']).fillna(0)
    
    # Step 4: 信頼度収縮
    df['Shr'] = (df['N_min'] / (df['N_min'] + 400)) ** 0.5
    
    # Step 5: 最終AASスコア
    df['base_calc'] = 0.55 * df['ZH'] + 0.45 * df['ZR']
    df['AAS'] = (12 * df['base_calc'].apply(math.tanh) * df['Shr']).round(1)
    
    return df[['group_id', 'AAS']]
```

---

## 実装方針

### Phase 5: RGS/AAS 計算システムの実装

#### 実装目標
1. PostgreSQL に RGS/AAS 計算用のテーブルを追加
2. ファクター選択 UI を実装
3. RGS/AAS を自動計算して表示

#### データベース設計

```sql
-- ファクター評価結果テーブル
CREATE TABLE factor_analysis (
    id SERIAL PRIMARY KEY,
    factor_id VARCHAR(50) NOT NULL,
    factor_name VARCHAR(200) NOT NULL,
    
    -- ファクター条件（JSON形式）
    conditions JSONB,
    
    -- 集計データ
    cnt_win INTEGER,           -- 単勝投票件数
    cnt_plc INTEGER,           -- 複勝投票件数
    rate_win_hit DECIMAL(5,2), -- 単勝的中率
    rate_plc_hit DECIMAL(5,2), -- 複勝的中率
    rate_win_ret DECIMAL(5,2), -- 単勝補正回収率
    rate_plc_ret DECIMAL(5,2), -- 複勝補正回収率
    
    -- 計算結果
    rgs_score DECIMAL(5,2),    -- RGS1.0 スコア
    aas_score DECIMAL(5,2),    -- AAS スコア
    
    -- メタデータ
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_factor_analysis_factor_id ON factor_analysis(factor_id);
CREATE INDEX idx_factor_analysis_rgs_score ON factor_analysis(rgs_score);
CREATE INDEX idx_factor_analysis_aas_score ON factor_analysis(aas_score);
```

---

## PostgreSQL での実装例

### RGS1.0 の計算

```sql
-- RGS1.0 を計算する関数
CREATE OR REPLACE FUNCTION calculate_rgs(
    cnt_win INTEGER,
    cnt_plc INTEGER,
    rate_win_ret DECIMAL,
    rate_plc_ret DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
    reliability DECIMAL;
    weighted_diff DECIMAL;
    rgs DECIMAL;
BEGIN
    -- Step 1: 信頼度係数
    reliability := LEAST(1.0, SQRT((cnt_win + cnt_plc)::DECIMAL / 500.0));
    
    -- Step 2: 加重平均乖離
    weighted_diff := ((rate_win_ret * 0.3) + (rate_plc_ret * 0.7)) - 80;
    
    -- Step 3: 最終RGSスコア
    rgs := 10.0 * TANH((weighted_diff * reliability) / 25.0);
    
    RETURN ROUND(rgs, 2);
END;
$$ LANGUAGE plpgsql;
```

### AAS の計算（簡易版）

```sql
-- AAS を計算する関数（レース内での相対評価）
-- 実際の実装では、GROUP BY を使った統計計算が必要

CREATE OR REPLACE FUNCTION calculate_aas_base(
    cnt_win INTEGER,
    cnt_plc INTEGER,
    rate_win_hit DECIMAL,
    rate_plc_hit DECIMAL,
    rate_win_ret DECIMAL,
    rate_plc_ret DECIMAL,
    zh DECIMAL,  -- Zスコア（別途計算が必要）
    zr DECIMAL   -- Zスコア（別途計算が必要）
) RETURNS DECIMAL AS $$
DECLARE
    n_min INTEGER;
    shr DECIMAL;
    base_calc DECIMAL;
    aas DECIMAL;
BEGIN
    -- Step 1: 安定件数
    n_min := LEAST(cnt_win, cnt_plc);
    
    -- Step 4: 信頼度収縮
    shr := SQRT(n_min::DECIMAL / (n_min + 400.0));
    
    -- Step 5: 最終AASスコア
    base_calc := 0.55 * zh + 0.45 * zr;
    aas := 12.0 * TANH(base_calc) * shr;
    
    RETURN ROUND(aas, 1);
END;
$$ LANGUAGE plpgsql;
```

---

## まとめ

### RGS1.0 と AAS の違い

| 項目 | RGS1.0 | AAS |
|------|--------|-----|
| **評価方法** | 絶対評価（基準回収率80%との乖離） | 相対評価（レース内での偏差値） |
| **出力範囲** | -10 ～ +10 | 約 -12 ～ +12 |
| **信頼度補正** | √(件数/500) | √(件数/(件数+400)) |
| **重視する指標** | 複勝回収率 70% + 単勝回収率 30% | 的中率 55% + 回収率 45% |
| **適用場面** | 単独ファクターの収益力評価 | レース内での相対的な強さ評価 |

### 次のステップ

**Phase 5: RGS/AAS 計算システムの実装**
1. PostgreSQL に RGS/AAS 計算関数を追加
2. ファクター選択 UI を実装（Hono + TailwindCSS）
3. RGS/AAS 自動計算機能を実装
4. 結果の可視化（グラフ、表、ランキング）

---

**ドキュメント作成日**: 2025-01-01  
**最終更新日**: 2025-01-01  
**バージョン**: 1.0.0  
**作成者**: Enable CEO + Claude Code Agent  
**プロジェクト**: UMAYOMI - 馬を読む。レースが変わる。
