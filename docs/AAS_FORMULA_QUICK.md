# AAS計算式 - クイックリファレンス（他AI引き継ぎ用）

**最終更新**: 2026-01-04

---

## 📋 このドキュメントについて

このドキュメントは、AAS（Adaptive Ability Score）計算を他のAIに引き継ぐための簡潔なリファレンスです。  
詳細版は `AAS_FORMULA_COMPLETE.md` を参照してください。

---

## 🎯 AASとは

- **スコア範囲**: -12 ～ +12
- **評価方式**: 相対評価（グループ内の他の対象と比較）
- **目的**: 競馬の出走馬やファクターの優劣を数値化

---

## 📊 入力データ

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `cntWin` | 単勝件数 | ✅ |
| `cntPlace` | 複勝件数 | ✅ |
| `rateWinHit` | 単勝的中率（%） | ✅ |
| `ratePlaceHit` | 複勝的中率（%） | ✅ |
| `adjWinRet` | **単勝補正回収率**（%）← **必ず補正版** | ✅ |
| `adjPlaceRet` | **複勝補正回収率**（%）← **必ず補正版** | ✅ |

**⚠️ 最重要**: 生の回収率ではなく、**補正回収率**を使用してください！

---

## 🧮 計算式（5ステップ）

### Step 1: 基礎値

```
N_min = MIN(cntWin, cntPlace)
Hit_raw = 0.65 × rateWinHit + 0.35 × ratePlaceHit
Ret_raw = 0.35 × adjWinRet + 0.65 × adjPlaceRet  ← 補正回収率を使用！
```

### Step 2: グループ統計

```
μH = AVERAGE(Hit_raw_1, ..., Hit_raw_n)
σH = STDEV.P(Hit_raw_1, ..., Hit_raw_n)  ← 母集団標準偏差
μR = AVERAGE(Ret_raw_1, ..., Ret_raw_n)
σR = STDEV.P(Ret_raw_1, ..., Ret_raw_n)  ← 母集団標準偏差
```

### Step 3: Zスコア

```
ZH = (Hit_raw - μH) / σH  ※ σH=0の場合は0
ZR = (Ret_raw - μR) / σR  ※ σR=0の場合は0
```

### Step 4: 信頼度収縮

```
Shr = SQRT( N_min / (N_min + 400) )
```

### Step 5: 最終スコア

```
baseCalc = 0.55 × ZH + 0.45 × ZR
aasScore = 12 × TANH(baseCalc) × Shr
```

---

## 🔢 重要な係数（変更禁止）

| 項目 | 係数 |
|------|------|
| 命中強度: 単勝/複勝 | 0.65 / 0.35 |
| 収益強度: 単勝/複勝 | 0.35 / 0.65 |
| Zスコア統合: 的中/回収 | 0.55 / 0.45 |
| 信頼度収縮: 基準件数 | 400 |
| スケール係数 | 12 |

---

## 💻 Python実装（最小版）

```python
import math
import statistics

def calculate_aas(race_data):
    # Step 1: 基礎値
    horses = []
    for h in race_data:
        horses.append({
            **h,
            'n_min': min(h['cnt_win'], h['cnt_place']),
            'hit_raw': 0.65 * h['rate_win_hit'] + 0.35 * h['rate_place_hit'],
            'ret_raw': 0.35 * h['adj_win_ret'] + 0.65 * h['adj_place_ret']  # ← 補正回収率
        })
    
    # Step 2: グループ統計
    hit_vals = [h['hit_raw'] for h in horses]
    ret_vals = [h['ret_raw'] for h in horses]
    mu_h, sigma_h = statistics.mean(hit_vals), statistics.pstdev(hit_vals)
    mu_r, sigma_r = statistics.mean(ret_vals), statistics.pstdev(ret_vals)
    
    # Step 3-5: 各馬のAAS
    results = []
    for h in horses:
        z_h = (h['hit_raw'] - mu_h) / sigma_h if sigma_h > 0 else 0
        z_r = (h['ret_raw'] - mu_r) / sigma_r if sigma_r > 0 else 0
        shr = math.sqrt(h['n_min'] / (h['n_min'] + 400))
        base = 0.55 * z_h + 0.45 * z_r
        aas = 12 * math.tanh(base) * shr
        results.append({'horse_id': h['horse_id'], 'aas_score': round(aas, 1)})
    
    return results
```

---

## 📝 Excel実装（LET関数）

```excel
=LET(
    N件, MIN(単勝件数, 複勝件数),
    HitRaw, 0.65*単勝的中率 + 0.35*複勝的中率,
    RetRaw, 0.35*単勝補正回収率 + 0.65*複勝補正回収率,
    
    μH, AVERAGE(グループのHitRaw),
    σH, STDEV.P(グループのHitRaw),
    μR, AVERAGE(グループのRetRaw),
    σR, STDEV.P(グループのRetRaw),
    
    ZH, IF(σH=0, 0, (HitRaw-μH)/σH),
    ZR, IF(σR=0, 0, (RetRaw-μR)/σR),
    
    Shr, SQRT(N件/(N件+400)),
    
    ROUND(12 * TANH(0.55*ZH + 0.45*ZR) * Shr, 1)
)
```

---

## ⚠️ よくあるミス（必読）

### 1. 補正回収率を使っていない（最重要！）

```
❌ ret_raw = 0.35 × rateWinRet + 0.65 × ratePlaceRet
✅ ret_raw = 0.35 × adjWinRet + 0.65 × adjPlaceRet
```

### 2. 標本標準偏差を使用

```
❌ STDEV.S(...) または statistics.stdev(...)
✅ STDEV.P(...) または statistics.pstdev(...)
```

### 3. TANH関数の省略

```
❌ aasScore = 12 * baseCalc * Shr
✅ aasScore = 12 * TANH(baseCalc) * Shr
```

---

## 🧪 検証用テストケース

**入力**（3ファクター）:
```
No.1: cntWin=250, cntPlace=250, rateWinHit=11.2, ratePlaceHit=35.6,
      adjWinRet=55.5, adjPlaceRet=86.6

No.2: cntWin=254, cntPlace=254, rateWinHit=12.6, ratePlaceHit=29.1,
      adjWinRet=93.8, adjPlaceRet=80.9

No.3: cntWin=241, cntPlace=241, rateWinHit=10.8, ratePlaceHit=24.1,
      adjWinRet=87.0, adjPlaceRet=64.9
```

**期待される出力**（±0.1の誤差許容）:
```
No.1: AAS = +5.5
No.2: AAS = +5.8
No.3: AAS = +2.4
```

**グループ統計**:
```
μH = 19.74%, σH = 1.79%
μR = 75.72%, σR = 10.25%
```

---

## 🎯 スコア解釈

| スコア | 評価 | 意味 |
|--------|------|------|
| +6以上 | ★★★ | 圧倒的に優秀 |
| +3～+6 | ★★ | 明確に優位 |
| 0～+3 | ★ | やや有利 |
| -3～0 | ー | 平均的 |
| -3以下 | ✕ | 不利 |

---

## 📚 参考資料

- 詳細版: `AAS_FORMULA_COMPLETE.md`
- 実装例: `src/utils/aas.ts`
- テストケース: `scripts/test_phase5.ts`

---

## ✅ 実装チェックリスト

実装したら、以下を確認してください：

- [ ] 母集団標準偏差（STDEV.P）を使用
- [ ] **補正回収率**（adjWinRet, adjPlaceRet）を使用
- [ ] 係数が正確（0.65/0.35, 0.55/0.45, 400, 12）
- [ ] TANH関数を実装
- [ ] ゼロ除算対策を実装
- [ ] テストケースで検証（±0.1の誤差内）

---

**このドキュメントを他のAIに渡せば、AAS計算を正確に実装できます。**
