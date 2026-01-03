/**
 * RGS1.0計算スクリプト
 * 
 * RGS = 10 × TANH((Weighted_Diff × Reliability) / 25)
 * 
 * 計算ステップ：
 * 1. Reliability（信頼度）= MIN(1, SQRT((cnt_win + cnt_plc) / 500))
 * 2. Weighted_Diff（加重乖離）= (adj_win_ret × 0.3) + (adj_plc_ret × 0.7) - 80
 * 3. RGS = 10 × TANH((Weighted_Diff × Reliability) / 25)
 */

// ============================================
// RGS1.0計算関数
// ============================================

export interface RGSInput {
  cnt_win: number;          // 単勝件数
  cnt_plc: number;          // 複勝件数
  adj_win_ret: number;      // 単勝補正回収率（%）
  adj_plc_ret: number;      // 複勝補正回収率（%）
}

export interface RGSResult {
  rgs_score: number;        // RGSスコア（-10 ~ +10）
  reliability: number;      // 信頼度（0 ~ 1）
  weighted_diff: number;    // 加重乖離
  evaluation: string;       // 評価（超優良/優良/良好/やや良好/普通/やや不良/不良/超不良）
}

/**
 * RGS1.0計算
 */
export function calculateRGS(input: RGSInput): RGSResult {
  const { cnt_win, cnt_plc, adj_win_ret, adj_plc_ret } = input;
  
  // Step 1: 信頼度（Reliability）
  const totalCount = cnt_win + cnt_plc;
  const reliability = Math.min(1, Math.sqrt(totalCount / 500));
  
  // Step 2: 加重乖離（Weighted Diff）
  const weightedDiff = (adj_win_ret * 0.3) + (adj_plc_ret * 0.7) - 80;
  
  // Step 3: RGSスコア計算
  const rgsScore = 10 * Math.tanh((weightedDiff * reliability) / 25);
  
  // 評価判定
  const evaluation = getRGSEvaluation(rgsScore);
  
  return {
    rgs_score: Math.round(rgsScore * 100) / 100,  // 小数第2位まで
    reliability: Math.round(reliability * 1000) / 1000,  // 小数第3位まで
    weighted_diff: Math.round(weightedDiff * 10) / 10,
    evaluation,
  };
}

/**
 * RGSスコアの評価判定
 */
function getRGSEvaluation(rgsScore: number): string {
  if (rgsScore >= 7.5) return '★★★★★ 超優良';
  if (rgsScore >= 5.0) return '★★★★☆ 優良';
  if (rgsScore >= 2.5) return '★★★☆☆ 良好';
  if (rgsScore >= 0.0) return '★★☆☆☆ やや良好';
  if (rgsScore >= -2.5) return '★☆☆☆☆ 普通';
  if (rgsScore >= -5.0) return '☆☆☆☆☆ やや不良';
  if (rgsScore >= -7.5) return '✕ 不良';
  return '✕✕ 超不良';
}

// ============================================
// テスト実行
// ============================================

function testRGSCalculation() {
  console.log('\n🧪 RGS1.0計算テスト\n');
  
  // テストケース1: えりも町サンプル（元のデータ）
  console.log('📊 テストケース1: 芝短距離×えりも町');
  const test1 = calculateRGS({
    cnt_win: 11,
    cnt_plc: 16,
    adj_win_ret: 175.1,
    adj_plc_ret: 66.4,
  });
  
  console.log(`   単勝件数: 11件`);
  console.log(`   複勝件数: 16件`);
  console.log(`   単勝補正回収率: 175.1%`);
  console.log(`   複勝補正回収率: 66.4%`);
  console.log(`   ───────────────────────`);
  console.log(`   信頼度: ${test1.reliability} (${Math.round(test1.reliability * 100)}%)`);
  console.log(`   加重乖離: ${test1.weighted_diff}`);
  console.log(`   RGSスコア: ${test1.rgs_score}`);
  console.log(`   評価: ${test1.evaluation}\n`);
  
  // テストケース2: 高サンプル・高回収率
  console.log('📊 テストケース2: 高サンプル・高回収率');
  const test2 = calculateRGS({
    cnt_win: 500,
    cnt_plc: 800,
    adj_win_ret: 250.0,
    adj_plc_ret: 180.0,
  });
  
  console.log(`   単勝件数: 500件`);
  console.log(`   複勝件数: 800件`);
  console.log(`   単勝補正回収率: 250.0%`);
  console.log(`   複勝補正回収率: 180.0%`);
  console.log(`   ───────────────────────`);
  console.log(`   信頼度: ${test2.reliability} (${Math.round(test2.reliability * 100)}%)`);
  console.log(`   加重乖離: ${test2.weighted_diff}`);
  console.log(`   RGSスコア: ${test2.rgs_score}`);
  console.log(`   評価: ${test2.evaluation}\n`);
  
  // テストケース3: 低回収率
  console.log('📊 テストケース3: 低回収率');
  const test3 = calculateRGS({
    cnt_win: 100,
    cnt_plc: 150,
    adj_win_ret: 45.0,
    adj_plc_ret: 55.0,
  });
  
  console.log(`   単勝件数: 100件`);
  console.log(`   複勝件数: 150件`);
  console.log(`   単勝補正回収率: 45.0%`);
  console.log(`   複勝補正回収率: 55.0%`);
  console.log(`   ───────────────────────`);
  console.log(`   信頼度: ${test3.reliability} (${Math.round(test3.reliability * 100)}%)`);
  console.log(`   加重乖離: ${test3.weighted_diff}`);
  console.log(`   RGSスコア: ${test3.rgs_score}`);
  console.log(`   評価: ${test3.evaluation}\n`);
}

// ============================================
// メイン実行
// ============================================

// テスト実行（直接実行時）
testRGSCalculation();
