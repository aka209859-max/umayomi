/**
 * RGS1.0（Racing Grade Score）計算ロジック
 * レースの絶対収益力を評価する指標（-10 ～ +10）
 */

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
 * RGS1.0スコアの解釈テーブル
 */
const RGS_INTERPRETATION = [
  { min: 7.0, max: 10.0, stars: '★★★★★★', label: '超優良レース' },
  { min: 4.0, max: 6.9, stars: '★★★★★☆', label: '優良レース' },
  { min: 1.0, max: 3.9, stars: '★★★★☆☆', label: 'やや良好' },
  { min: -1.0, max: 0.9, stars: '★★★☆☆☆', label: '平均的' },
  { min: -4.0, max: -1.1, stars: '★★☆☆☆☆', label: 'やや不良' },
  { min: -10.0, max: -4.1, stars: '★☆☆☆☆☆', label: '避けるべき' },
];

/**
 * RGS1.0を計算
 * 
 * 計算式（Excel形式）：
 * W = H + L                             // 総件数
 * X = MIN(1, SQRT(W/500))               // 信頼度
 * Y = Q*0.3 + T*0.7                     // 加重回収率
 * Z = Y - 80                            // 乖離
 * AA = Z * X                            // 調整乖離
 * AB = AA / 25                          // 正規化
 * AC = 10 * TANH(AB)                    // 最終スコア
 * 
 * @param input 入力パラメータ
 * @returns RGS1.0の計算結果
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
  for (const range of RGS_INTERPRETATION) {
    if (score >= range.min && score <= range.max) {
      return `${range.stars} ${range.label}`;
    }
  }
  return '★★★☆☆☆ 平均的';
}

/**
 * テスト用サンプル関数
 */
export function testRGS10() {
  console.log('=== RGS1.0 計算テスト ===\n');
  
  // サンプルデータ（ドキュメントの例）
  const sample: RGS10Input = {
    cntWin: 11,
    cntPlace: 16,
    adjWinRet: 175.1,
    adjPlaceRet: 66.4,
  };
  
  const result = calculateRGS10(sample);
  
  console.log('【入力データ】');
  console.log(`単勝件数（H）：${sample.cntWin}件`);
  console.log(`複勝件数（L）：${sample.cntPlace}件`);
  console.log(`単勝補正回収率（Q）：${sample.adjWinRet}%`);
  console.log(`複勝補正回収率（T）：${sample.adjPlaceRet}%`);
  
  console.log('\n【計算過程】');
  console.log(`総件数（W）：${result.totalCount}件`);
  console.log(`信頼度（X）：${(result.reliability * 100).toFixed(2)}%`);
  console.log(`加重回収率（Y）：${result.weightedReturnRate.toFixed(2)}%`);
  console.log(`乖離（Z）：${result.deviation.toFixed(2)}pt`);
  console.log(`調整乖離（AA）：${result.adjustedDeviation.toFixed(2)}`);
  console.log(`正規化（AB）：${result.normalized.toFixed(4)}`);
  
  console.log('\n【最終結果】');
  console.log(`RGS1.0スコア：${result.rgsScore.toFixed(2)}`);
  console.log(`評価：${result.interpretation}`);
  
  console.log('\n【解釈】');
  if (result.rgsScore >= 4.0) {
    console.log('✅ 優良レース：積極的に狙うべき条件');
  } else if (result.rgsScore >= 1.0) {
    console.log('✅ やや良好：条件次第で狙える');
  } else if (result.rgsScore >= -1.0) {
    console.log('⚠️ 平均的：他の条件と組み合わせて判断');
  } else {
    console.log('❌ 不良レース：避けるべき条件');
  }
  
  // 複数パターンのテスト
  console.log('\n=== 複数パターンテスト ===\n');
  
  const testCases: Array<{ name: string; input: RGS10Input }> = [
    {
      name: '超優良（RGS +8.0）',
      input: { cntWin: 100, cntPlace: 100, adjWinRet: 200, adjPlaceRet: 180 },
    },
    {
      name: '優良（RGS +5.0）',
      input: { cntWin: 50, cntPlace: 50, adjWinRet: 150, adjPlaceRet: 140 },
    },
    {
      name: '平均的（RGS 0.0）',
      input: { cntWin: 30, cntPlace: 30, adjWinRet: 80, adjPlaceRet: 80 },
    },
    {
      name: '不良（RGS -5.0）',
      input: { cntWin: 20, cntPlace: 20, adjWinRet: 40, adjPlaceRet: 50 },
    },
  ];
  
  for (const testCase of testCases) {
    const result = calculateRGS10(testCase.input);
    console.log(`${testCase.name}：RGS ${result.rgsScore.toFixed(2)} ${result.interpretation}`);
  }
}
