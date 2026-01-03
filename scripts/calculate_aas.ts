/**
 * AAS計算スクリプト
 * 
 * AAS = ROUND(12 × TANH(0.55 × ZH + 0.45 × ZR) × Shrinkage, 1)
 * 
 * 計算ステップ：
 * 1. N_min = MIN(cnt_win, cnt_plc)
 * 2. HitRaw = 0.65 × rate_win_hit + 0.35 × rate_plc_hit
 * 3. RetRaw = 0.35 × adj_win_ret + 0.65 × adj_plc_ret
 * 4. グループ内統計量（μH, σH, μR, σR）を計算
 * 5. ZH = (HitRaw - μH) / σH（Zスコア：的中率）
 * 6. ZR = (RetRaw - μR) / σR（Zスコア：回収率）
 * 7. Shrinkage = SQRT(N_min / (N_min + 400))
 * 8. AAS = ROUND(12 × TANH(0.55 × ZH + 0.45 × ZR) × Shrinkage, 1)
 */

// ============================================
// AAS計算関数
// ============================================

export interface AASInput {
  cnt_win: number;          // 単勝件数
  cnt_plc: number;          // 複勝件数
  rate_win_hit: number;     // 単勝的中率（%）
  rate_plc_hit: number;     // 複勝的中率（%）
  adj_win_ret: number;      // 単勝補正回収率（%）
  adj_plc_ret: number;      // 複勝補正回収率（%）
}

export interface GroupStats {
  mean_hit: number;         // グループ内平均的中率
  std_hit: number;          // グループ内標準偏差（的中率）
  mean_ret: number;         // グループ内平均回収率
  std_ret: number;          // グループ内標準偏差（回収率）
}

export interface AASResult {
  aas_score: number;        // AASスコア
  hit_raw: number;          // 生の的中率
  ret_raw: number;          // 生の回収率
  z_hit: number;            // Zスコア（的中率）
  z_ret: number;            // Zスコア（回収率）
  shrinkage: number;        // 縮小係数
  evaluation: string;       // 評価
}

/**
 * AAS計算（単一レコード）
 */
export function calculateAAS(
  input: AASInput,
  groupStats: GroupStats
): AASResult {
  const { cnt_win, cnt_plc, rate_win_hit, rate_plc_hit, adj_win_ret, adj_plc_ret } = input;
  
  // Step 1: 最小件数
  const nMin = Math.min(cnt_win, cnt_plc);
  
  // Step 2: 生の的中率
  const hitRaw = 0.65 * rate_win_hit + 0.35 * rate_plc_hit;
  
  // Step 3: 生の回収率
  const retRaw = 0.35 * adj_win_ret + 0.65 * adj_plc_ret;
  
  // Step 4: Zスコア計算
  const zHit = groupStats.std_hit > 0 
    ? (hitRaw - groupStats.mean_hit) / groupStats.std_hit 
    : 0;
  
  const zRet = groupStats.std_ret > 0 
    ? (retRaw - groupStats.mean_ret) / groupStats.std_ret 
    : 0;
  
  // Step 5: 縮小係数（Shrinkage）
  const shrinkage = Math.sqrt(nMin / (nMin + 400));
  
  // Step 6: 基本スコア
  const baseScore = 0.55 * zHit + 0.45 * zRet;
  
  // Step 7: AASスコア
  const aasScore = 12 * Math.tanh(baseScore) * shrinkage;
  
  // 評価判定
  const evaluation = getAASEvaluation(aasScore);
  
  return {
    aas_score: Math.round(aasScore * 10) / 10,  // 小数第1位まで
    hit_raw: Math.round(hitRaw * 10) / 10,
    ret_raw: Math.round(retRaw * 10) / 10,
    z_hit: Math.round(zHit * 100) / 100,
    z_ret: Math.round(zRet * 100) / 100,
    shrinkage: Math.round(shrinkage * 1000) / 1000,
    evaluation,
  };
}

/**
 * AASスコアの評価判定
 */
function getAASEvaluation(aasScore: number): string {
  if (aasScore >= 8.0) return '★★★★★ 極めて優秀';
  if (aasScore >= 5.0) return '★★★★☆ 優秀';
  if (aasScore >= 2.0) return '★★★☆☆ 良好';
  if (aasScore >= -2.0) return '★★☆☆☆ 普通';
  if (aasScore >= -5.0) return '★☆☆☆☆ やや劣る';
  if (aasScore >= -8.0) return '☆☆☆☆☆ 劣る';
  return '✕ 極めて劣る';
}

/**
 * グループ統計量の計算
 */
export function calculateGroupStats(records: AASInput[]): GroupStats {
  if (records.length === 0) {
    return {
      mean_hit: 0,
      std_hit: 0,
      mean_ret: 0,
      std_ret: 0,
    };
  }
  
  // 各レコードのHitRaw, RetRawを計算
  const hitRawList = records.map(r => 0.65 * r.rate_win_hit + 0.35 * r.rate_plc_hit);
  const retRawList = records.map(r => 0.35 * r.adj_win_ret + 0.65 * r.adj_plc_ret);
  
  // 平均
  const meanHit = hitRawList.reduce((sum, v) => sum + v, 0) / hitRawList.length;
  const meanRet = retRawList.reduce((sum, v) => sum + v, 0) / retRawList.length;
  
  // 標準偏差（母集団標準偏差）
  const varianceHit = hitRawList.reduce((sum, v) => sum + Math.pow(v - meanHit, 2), 0) / hitRawList.length;
  const varianceRet = retRawList.reduce((sum, v) => sum + Math.pow(v - meanRet, 2), 0) / retRawList.length;
  
  const stdHit = Math.sqrt(varianceHit);
  const stdRet = Math.sqrt(varianceRet);
  
  return {
    mean_hit: Math.round(meanHit * 100) / 100,
    std_hit: Math.round(stdHit * 100) / 100,
    mean_ret: Math.round(meanRet * 100) / 100,
    std_ret: Math.round(stdRet * 100) / 100,
  };
}

// ============================================
// テスト実行
// ============================================

function testAASCalculation() {
  console.log('\n🧪 AAS計算テスト\n');
  
  // サンプルグループデータ（芝短距離×産地グループ）
  const groupData: AASInput[] = [
    // えりも町
    {
      cnt_win: 11,
      cnt_plc: 16,
      rate_win_hit: 18.2,
      rate_plc_hit: 25.0,
      adj_win_ret: 175.1,
      adj_plc_ret: 66.4,
    },
    // 他の産地1
    {
      cnt_win: 50,
      cnt_plc: 80,
      rate_win_hit: 10.0,
      rate_plc_hit: 20.0,
      adj_win_ret: 75.0,
      adj_plc_ret: 85.0,
    },
    // 他の産地2
    {
      cnt_win: 30,
      cnt_plc: 45,
      rate_win_hit: 8.0,
      rate_plc_hit: 18.0,
      adj_win_ret: 65.0,
      adj_plc_ret: 78.0,
    },
    // 他の産地3
    {
      cnt_win: 20,
      cnt_plc: 35,
      rate_win_hit: 12.0,
      rate_plc_hit: 22.0,
      adj_win_ret: 90.0,
      adj_plc_ret: 95.0,
    },
  ];
  
  // グループ統計量計算
  const groupStats = calculateGroupStats(groupData);
  
  console.log('📊 グループ統計量:');
  console.log(`   平均的中率: ${groupStats.mean_hit}%`);
  console.log(`   標準偏差（的中率）: ${groupStats.std_hit}%`);
  console.log(`   平均回収率: ${groupStats.mean_ret}%`);
  console.log(`   標準偏差（回収率）: ${groupStats.std_ret}%\n`);
  
  // えりも町のAAS計算
  console.log('📊 えりも町のAAS計算:');
  const aasResult = calculateAAS(groupData[0], groupStats);
  
  console.log(`   単勝件数: ${groupData[0].cnt_win}件`);
  console.log(`   複勝件数: ${groupData[0].cnt_plc}件`);
  console.log(`   単勝的中率: ${groupData[0].rate_win_hit}%`);
  console.log(`   複勝的中率: ${groupData[0].rate_plc_hit}%`);
  console.log(`   単勝補正回収率: ${groupData[0].adj_win_ret}%`);
  console.log(`   複勝補正回収率: ${groupData[0].adj_plc_ret}%`);
  console.log(`   ───────────────────────`);
  console.log(`   生の的中率: ${aasResult.hit_raw}%`);
  console.log(`   生の回収率: ${aasResult.ret_raw}%`);
  console.log(`   Zスコア（的中率）: ${aasResult.z_hit}`);
  console.log(`   Zスコア（回収率）: ${aasResult.z_ret}`);
  console.log(`   縮小係数: ${aasResult.shrinkage}`);
  console.log(`   AASスコア: ${aasResult.aas_score}`);
  console.log(`   評価: ${aasResult.evaluation}\n`);
}

// ============================================
// メイン実行
// ============================================

// テスト実行（直接実行時）
testAASCalculation();
