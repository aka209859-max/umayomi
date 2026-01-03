# AAS 計算仕様書

## 概要
AAS（Advanced Analysis Score）は、**同一グループ内での相対的な強さ**を評価する指標。  
範囲：**可変**（±15程度、サンプル数とZスコアに依存）

---

## 🎯 RGS1.0との違い

| 項目 | RGS1.0 | AAS |
|------|--------|-----|
| **評価対象** | レースの絶対収益性 | 条件内での相対的強さ |
| **範囲** | -10 ～ +10（固定） | 可変（±15程度） |
| **比較可能性** | 全グループ横断比較可能 | 同一グループ内のみ比較可能 |
| **重視要素** | 回収率（80%基準） | 的中率+回収率のバランス |
| **計算方法** | 絶対値評価（TANH正規化） | Zスコア（偏差値）評価 |
| **用途** | 「稼げるレース」発見 | 「条件内で強い馬」発見 |

---

## 📊 入力データ

| 列 | 項目名 | 説明 |
|---|--------|------|
| E | group_id | グループID（相対評価の範囲を区切るための識別子） |
| H | cnt_win | 単勝件数 |
| L | cnt_plc | 複勝件数 |
| J | rate_win_hit | 単勝的中率（%） |
| N | rate_plc_hit | 複勝的中率（%） |
| Q | adj_win_ret | 単勝補正回収率（%） |
| T | adj_plc_ret | 複勝補正回収率（%） |

**注意：** AASは**補正回収率（Q, T列）** を使用します（RGS1.0と同じ）

---

## 🧮 計算式（Excel LET関数形式）

### 完全なExcel数式（2行目の例）
```excel
=LET(
    gid, E2,
    
    WinCnt, H2,      PlcCnt, L2,
    WinRate, J2,     PlcRate, N2,
    WinRet, Q2,      PlcRet, T2,
    N件, MIN(WinCnt, PlcCnt),
    
    HitRaw, 0.65*WinRate + 0.35*PlcRate,
    RetRaw, 0.35*WinRet  + 0.65*PlcRet,
    
    GHit, FILTER(0.65*$J$2:$J$1465 + 0.35*$N$2:$N$1465, $E$2:$E$1465 = gid),
    GRet, FILTER(0.35*$Q$2:$Q$1465 + 0.65*$T$2:$T$1465, $E$2:$E$1465 = gid),
    
    μH, AVERAGE(GHit),  σH, STDEV.P(GHit),
    μR, AVERAGE(GRet),  σR, STDEV.P(GRet),
    
    ZH, IF(σH=0,0,(HitRaw-μH)/σH),
    ZR, IF(σR=0,0,(RetRaw-μR)/σR),
    
    Shr, SQRT( N件 / ( N件 + 400 ) ),
    
    ROUND( 12 * TANH(0.55*ZH + 0.45*ZR) * Shr, 1)
)
```

---

## 📖 ステップバイステップ解説

### **Step 1: 基本情報の取得**
```excel
gid = E2              // グループID
WinCnt = H2           // 単勝件数
PlcCnt = L2           // 複勝件数
WinRate = J2          // 単勝的中率
PlcRate = N2          // 複勝的中率
WinRet = Q2           // 単勝補正回収率
PlcRet = T2           // 複勝補正回収率
N件 = MIN(WinCnt, PlcCnt)  // 最小件数
```

---

### **Step 2: Raw Values（生の指標値）**
```excel
HitRaw = 0.65 * WinRate + 0.35 * PlcRate
RetRaw = 0.35 * WinRet  + 0.65 * PlcRet
```

**重み配分：**
- **的中率（HitRaw）**: 単勝65% + 複勝35%
  - 単勝的中の価値を高く評価
- **回収率（RetRaw）**: 単勝35% + 複勝65%
  - 複勝回収率の安定性を重視

**なぜRGS1.0と逆？**
- RGS1.0：回収率重視（単勝30%、複勝70%）
- AAS：的中率と回収率のバランス重視

---

### **Step 3: グループ内データの抽出**
```excel
GHit = FILTER(0.65*$J$2:$J$1465 + 0.35*$N$2:$N$1465, $E$2:$E$1465 = gid)
GRet = FILTER(0.35*$Q$2:$Q$1465 + 0.65*$T$2:$T$1465, $E$2:$E$1465 = gid)
```

**意味：**
- 全行（2～1465行）から、**同じgroup_id**のデータのみを抽出
- GHit：そのグループ内の全HitRaw値の配列
- GRet：そのグループ内の全RetRaw値の配列

**例：**
```
group_id = 1 のデータが10件ある場合：
GHit = [12.5, 15.3, 8.7, ..., 18.2]（10個の値）
GRet = [85.3, 92.1, 78.5, ..., 105.7]（10個の値）
```

---

### **Step 4: グループ内統計量の計算**
```excel
μH = AVERAGE(GHit)    // 的中率の平均
σH = STDEV.P(GHit)    // 的中率の母集団標準偏差
μR = AVERAGE(GRet)    // 回収率の平均
σR = STDEV.P(GRet)    // 回収率の母集団標準偏差
```

**STDEV.P vs STDEV.S：**
- **STDEV.P**：母集団標準偏差（全データがある前提）
- STDEV.S：標本標準偏差（サンプル推定）
- ここでは**STDEV.P**を使用（グループ内の全データを持っている）

---

### **Step 5: Zスコアの計算**
```excel
ZH = IF(σH=0, 0, (HitRaw - μH) / σH)
ZR = IF(σR=0, 0, (RetRaw - μR) / σR)
```

**Zスコアとは：**
- **偏差値の元になる値**
- 平均からの乖離を標準偏差で割った値
- ZH = 1.0 → 平均より標準偏差1個分高い（偏差値60相当）
- ZH = 0.0 → 平均と同じ（偏差値50）
- ZH = -1.0 → 平均より標準偏差1個分低い（偏差値40相当）

**ゼロ除算対策：**
- σH = 0（全員同じ的中率）→ ZH = 0（差がないので評価なし）
- σR = 0（全員同じ回収率）→ ZR = 0（差がないので評価なし）

---

### **Step 6: Shrinkage（縮小係数）**
```excel
Shr = SQRT( N件 / ( N件 + 400 ) )
```

**目的：** サンプル数が少ない場合にスコアを抑制

**例：**
```
N件 = 10:   Shr = SQRT(10/410) = 0.156（約16%）
N件 = 50:   Shr = SQRT(50/450) = 0.333（約33%）
N件 = 100:  Shr = SQRT(100/500) = 0.447（約45%）
N件 = 400:  Shr = SQRT(400/800) = 0.707（約71%）
N件 = 1000: Shr = SQRT(1000/1400) = 0.845（約85%）
```

**なぜ400？**
- 統計的に信頼できるサンプル数の目安
- 400件で約71%の信頼度

---

### **Step 7: 最終スコア AAS**
```excel
AAS = ROUND( 12 * TANH(0.55*ZH + 0.45*ZR) * Shr, 1)
```

**計算の流れ：**
1. **Zスコアの加重平均**: `0.55*ZH + 0.45*ZR`
   - 的中率55%、回収率45%の重み
2. **TANH正規化**: `-1 ～ +1` に収束
3. **スケーリング**: `×12` で ±12 程度の範囲に
4. **Shrinkage適用**: `×Shr` でサンプル数調整
5. **丸め**: 小数点第1位に四捨五入

**なぜ12？**
- RGS1.0は10でスケーリング（-10～+10）
- AASは12でスケーリング（より広い範囲で評価）
- 実際の範囲はShrinkageにより ±6～±12 程度

---

## 📊 計算例

### **入力データ（グループID=1、芝短距離×えりも町）**
```
E2: group_id = 1
H2: cnt_win = 11
L2: cnt_plc = 16
J2: rate_win_hit = 18.2
N2: rate_plc_hit = 25.0
Q2: adj_win_ret = 175.1
T2: adj_plc_ret = 66.4
```

### **仮定：グループ1の統計量**
```
グループ1の全データ（仮定）：
μH（的中率平均）= 15.0
σH（的中率標準偏差）= 5.0
μR（回収率平均）= 85.0
σR（回収率標準偏差）= 20.0
```

---

### **Step 1: 基本情報**
```
N件 = MIN(11, 16) = 11
```

### **Step 2: Raw Values**
```
HitRaw = 0.65 * 18.2 + 0.35 * 25.0
       = 11.83 + 8.75
       = 20.58

RetRaw = 0.35 * 175.1 + 0.65 * 66.4
       = 61.285 + 43.16
       = 104.445
```

### **Step 3 & 4: グループ統計量（仮定値を使用）**
```
μH = 15.0,  σH = 5.0
μR = 85.0,  σR = 20.0
```

### **Step 5: Zスコア**
```
ZH = (20.58 - 15.0) / 5.0 = 1.116
ZR = (104.445 - 85.0) / 20.0 = 0.972
```

**解釈：**
- ZH = 1.116 → 的中率がグループ平均より標準偏差1.1個分高い（偏差値61相当）
- ZR = 0.972 → 回収率がグループ平均より標準偏差1.0個分高い（偏差値60相当）

### **Step 6: Shrinkage**
```
Shr = SQRT(11 / (11 + 400))
    = SQRT(11 / 411)
    = SQRT(0.02676)
    = 0.1636（約16%）
```

### **Step 7: 最終スコア**
```
base = 0.55 * 1.116 + 0.45 * 0.972
     = 0.6138 + 0.4374
     = 1.0512

AAS = ROUND(12 * TANH(1.0512) * 0.1636, 1)
    = ROUND(12 * 0.7778 * 0.1636, 1)
    = ROUND(1.527, 1)
    = 1.5
```

---

## 💻 TypeScript実装

```typescript
/**
 * AAS（Advanced Analysis Score）を計算
 * @param group_id - グループID（E列）
 * @param cnt_win - 単勝件数（H列）
 * @param cnt_plc - 複勝件数（L列）
 * @param rate_win_hit - 単勝的中率（J列、%表記）
 * @param rate_plc_hit - 複勝的中率（N列、%表記）
 * @param adj_win_ret - 単勝補正回収率（Q列、%表記）
 * @param adj_plc_ret - 複勝補正回収率（T列、%表記）
 * @param all_records - 同じグループの全レコード（グループ統計量計算用）
 * @returns AAS（小数点第1位）
 */
function calculateAAS(
  group_id: string | number,
  cnt_win: number,
  cnt_plc: number,
  rate_win_hit: number,
  rate_plc_hit: number,
  adj_win_ret: number,
  adj_plc_ret: number,
  all_records: Record[]
): number {
  // Step 1: 最小件数
  const n_min = Math.min(cnt_win, cnt_plc);
  
  // Step 2: Raw Values
  const hit_raw = 0.65 * rate_win_hit + 0.35 * rate_plc_hit;
  const ret_raw = 0.35 * adj_win_ret + 0.65 * adj_plc_ret;
  
  // Step 3: グループ内データの抽出
  const group_records = all_records.filter(r => r.group_id === group_id);
  
  const group_hit_values = group_records.map(r => 
    0.65 * r.rate_win_hit + 0.35 * r.rate_plc_hit
  );
  const group_ret_values = group_records.map(r => 
    0.35 * r.adj_win_ret + 0.65 * r.adj_plc_ret
  );
  
  // Step 4: グループ統計量
  const mu_h = average(group_hit_values);
  const sigma_h = stdevP(group_hit_values);
  const mu_r = average(group_ret_values);
  const sigma_r = stdevP(group_ret_values);
  
  // Step 5: Zスコア
  const zh = sigma_h === 0 ? 0 : (hit_raw - mu_h) / sigma_h;
  const zr = sigma_r === 0 ? 0 : (ret_raw - mu_r) / sigma_r;
  
  // Step 6: Shrinkage
  const shr = Math.sqrt(n_min / (n_min + 400));
  
  // Step 7: 最終スコア
  const base = 0.55 * zh + 0.45 * zr;
  const aas = 12 * Math.tanh(base) * shr;
  
  return Math.round(aas * 10) / 10;
}

// ヘルパー関数
function average(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function stdevP(arr: number[]): number {
  const avg = average(arr);
  const variance = arr.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

interface Record {
  group_id: string | number;
  rate_win_hit: number;
  rate_plc_hit: number;
  adj_win_ret: number;
  adj_plc_ret: number;
}
```

---

## 🎯 AASの解釈

### **スコアの意味**

| AASスコア | 評価 | 意味 |
|----------|------|------|
| +8.0 ～ +12.0 | ★★★★★ | グループ内で圧倒的に強い |
| +4.0 ～ +7.9 | ★★★★☆ | グループ内で優秀 |
| +1.0 ～ +3.9 | ★★★☆☆ | グループ内でやや良好 |
| -1.0 ～ +0.9 | ★★☆☆☆ | グループ内で平均的 |
| -4.0 ～ -1.1 | ★☆☆☆☆ | グループ内でやや不良 |
| -12.0 ～ -4.1 | ☆☆☆☆☆ | グループ内で弱い |

**重要：** AASは**グループ内の相対評価**なので、異なるグループ間では直接比較できません。

---

## 💡 RGS1.0とAASの組み合わせ戦略

### **4つのパターン**

| RGS | AAS | 解釈 | アクション |
|-----|-----|------|----------|
| **高** | **高** | 絶対的に稼げる & グループ内で強い | ✅ **最優先で狙うべき** |
| **高** | **低** | 絶対的に稼げるがグループ内では弱い | ⚠️ 条件次第で検討 |
| **低** | **高** | 絶対的には稼げないがグループ内で強い | 🔍 上級者向け（穴狙い） |
| **低** | **低** | 絶対的に稼げない & グループ内でも弱い | ❌ **避けるべき** |

---

## 🚨 実装時の注意事項

### **1. グループ統計量は事前計算推奨**
```typescript
// ❌ 非効率：毎回全データをスキャン
for (const record of records) {
  const aas = calculateAAS(record, records); // 全データを毎回フィルタ
}

// ✅ 効率的：グループごとに統計量を事前計算
const groupStats = calculateGroupStats(records);
for (const record of records) {
  const aas = calculateAASFast(record, groupStats[record.group_id]);
}
```

### **2. STDEV.P（母集団標準偏差）を使用**
```typescript
// ✅ 正しい：母集団標準偏差
function stdevP(arr: number[]): number {
  const avg = average(arr);
  const variance = arr.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

// ❌ 間違い：標本標準偏差（STDEV.S）
function stdevS(arr: number[]): number {
  const variance = arr.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / (arr.length - 1);
  return Math.sqrt(variance);
}
```

### **3. グループが1件のみの場合**
```typescript
// グループ内が1件のみ → σH = 0, σR = 0
// → ZH = 0, ZR = 0
// → AAS = 0
// これは仕様として正しい（比較対象がないため評価不能）
```

---

## 📚 関連ドキュメント

- `RGS_CALCULATION_SPEC.md` - RGS1.0の計算仕様
- `ADJUSTED_RETURN_RATE_SPEC.md` - 補正回収率の計算仕様

---

**最終更新日：** 2026-01-03  
**バージョン：** 1.0  
**作成者：** Enable CEO / AI戦略家
