/**
 * 補正回収率計算ロジック
 * CrossFactor補正回収率の完全実装
 */

import { getOddsCoefficient, getYearWeight } from './coefficients';

/**
 * レース結果の型定義
 */
export interface RaceResult {
  odds: number;           // オッズ
  payout: number;         // 実配当（的中時のみ、不的中は0）
  isHit: boolean;         // 的中フラグ
  raceDate: string;       // レース日付（YYYYMMDD形式）
}

/**
 * 補正回収率の計算パラメータ
 */
export interface AdjustedReturnRateParams {
  results: RaceResult[];  // レース結果の配列
  betType: 'win' | 'place'; // 単勝 or 複勝
  targetPayout?: number;  // 目標払戻額（デフォルト10,000円）
}

/**
 * 補正回収率の計算結果
 */
export interface AdjustedReturnRateResult {
  adjustedReturnRate: number;  // 補正回収率（%）
  totalWeightedPayout: number; // 重み付き総払戻額
  totalWeightedBet: number;    // 重み付き総ベット額
  raceCount: number;           // レース数
  hitCount: number;            // 的中数
  rawReturnRate: number;       // 生の回収率（%）
}

/**
 * 補正回収率を計算
 * 
 * 計算式：
 * 補正回収率 = (Σt Σi (実配当i × 補正係数k × 的中フラグi × 重み係数t) / 
 *              Σt Σi (目標払戻額 / オッズi × 重み係数t)) × 100
 * 
 * 3つの補正メカニズム：
 * 1. 均等払戻方式：ベット額 = 目標払戻額 / オッズ
 * 2. オッズ別補正係数：補正係数 = 80 / そのオッズ帯の平均回収率
 * 3. 期間別重み付け：新しい年ほど大きい重み
 * 
 * @param params 計算パラメータ
 * @returns 補正回収率の計算結果
 */
export function calculateAdjustedReturnRate(
  params: AdjustedReturnRateParams
): AdjustedReturnRateResult {
  const { results, betType, targetPayout = 10000 } = params;
  
  let totalWeightedPayout = 0;
  let totalWeightedBet = 0;
  let hitCount = 0;
  let rawTotalPayout = 0;
  let rawTotalBet = 0;
  
  for (const race of results) {
    // 1. 均等払戻方式：払戻10,000円を基準にベット額を逆算
    const betAmount = targetPayout / race.odds;
    
    // 2. オッズ別係数を取得
    const coefficient = getOddsCoefficient(race.odds, betType);
    
    // 3. 期間別重みを取得
    const yearWeight = getYearWeight(race.raceDate);
    
    // 4. 的中時の払戻額
    const payout = race.isHit ? race.payout : 0;
    
    // 5. 重み付き集計
    const weight = coefficient * yearWeight;
    totalWeightedPayout += payout * weight;
    totalWeightedBet += betAmount * weight;
    
    // 6. 的中数カウント
    if (race.isHit) {
      hitCount++;
    }
    
    // 7. 生の回収率計算用
    rawTotalPayout += payout;
    rawTotalBet += betAmount;
  }
  
  // 6. 補正回収率
  const adjustedReturnRate = totalWeightedBet > 0 
    ? (totalWeightedPayout / totalWeightedBet) * 100 
    : 0;
  
  // 7. 生の回収率
  const rawReturnRate = rawTotalBet > 0 
    ? (rawTotalPayout / rawTotalBet) * 100 
    : 0;
  
  return {
    adjustedReturnRate: Math.round(adjustedReturnRate * 100) / 100, // 小数点2桁
    totalWeightedPayout,
    totalWeightedBet,
    raceCount: results.length,
    hitCount,
    rawReturnRate: Math.round(rawReturnRate * 100) / 100, // 小数点2桁
  };
}

/**
 * テスト用サンプル関数
 */
export function testAdjustedReturnRate() {
  console.log('=== 補正回収率テスト ===\n');
  
  // サンプルデータ：2020年と2019年のレース結果
  const sampleResults: RaceResult[] = [
    // 2020年（重み5）：オッズ10倍、1勝9敗
    { odds: 10.0, payout: 10000, isHit: true, raceDate: '20200101' },
    { odds: 10.0, payout: 0, isHit: false, raceDate: '20200115' },
    { odds: 10.0, payout: 0, isHit: false, raceDate: '20200201' },
    { odds: 10.0, payout: 0, isHit: false, raceDate: '20200215' },
    { odds: 10.0, payout: 0, isHit: false, raceDate: '20200301' },
    { odds: 10.0, payout: 0, isHit: false, raceDate: '20200315' },
    { odds: 10.0, payout: 0, isHit: false, raceDate: '20200401' },
    { odds: 10.0, payout: 0, isHit: false, raceDate: '20200415' },
    { odds: 10.0, payout: 0, isHit: false, raceDate: '20200501' },
    { odds: 10.0, payout: 0, isHit: false, raceDate: '20200515' },
    
    // 2019年（重み4）：オッズ10倍、2勝8敗
    { odds: 10.0, payout: 10000, isHit: true, raceDate: '20190101' },
    { odds: 10.0, payout: 10000, isHit: true, raceDate: '20190115' },
    { odds: 10.0, payout: 0, isHit: false, raceDate: '20190201' },
    { odds: 10.0, payout: 0, isHit: false, raceDate: '20190215' },
    { odds: 10.0, payout: 0, isHit: false, raceDate: '20190301' },
    { odds: 10.0, payout: 0, isHit: false, raceDate: '20190315' },
    { odds: 10.0, payout: 0, isHit: false, raceDate: '20190401' },
    { odds: 10.0, payout: 0, isHit: false, raceDate: '20190415' },
    { odds: 10.0, payout: 0, isHit: false, raceDate: '20190501' },
    { odds: 10.0, payout: 0, isHit: false, raceDate: '20190515' },
  ];
  
  // 単勝の補正回収率を計算
  const result = calculateAdjustedReturnRate({
    results: sampleResults,
    betType: 'win',
    targetPayout: 10000,
  });
  
  console.log('【入力データ】');
  console.log(`レース数：${result.raceCount}件`);
  console.log(`的中数：${result.hitCount}件`);
  console.log(`的中率：${((result.hitCount / result.raceCount) * 100).toFixed(1)}%`);
  
  console.log('\n【計算結果】');
  console.log(`生の回収率：${result.rawReturnRate.toFixed(2)}%`);
  console.log(`補正回収率：${result.adjustedReturnRate.toFixed(2)}%`);
  console.log(`重み付き総払戻額：¥${result.totalWeightedPayout.toLocaleString()}`);
  console.log(`重み付き総ベット額：¥${result.totalWeightedBet.toLocaleString()}`);
  
  console.log('\n【解釈】');
  const diff = result.adjustedReturnRate - result.rawReturnRate;
  console.log(`補正による変化：${diff > 0 ? '+' : ''}${diff.toFixed(2)}pt`);
  
  if (result.adjustedReturnRate >= 80) {
    console.log('✅ 補正回収率80%以上：プラスの可能性あり');
  } else {
    console.log('⚠️ 補正回収率80%未満：見直しが必要');
  }
}
