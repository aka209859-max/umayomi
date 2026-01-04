/**
 * 補正係数ユーティリティ
 * オッズ別補正係数と期間別重みを提供
 */

import winCoefficients from '../data/win_odds_coefficients.json';
import placeCoefficients from '../data/place_odds_coefficients.json';
import yearWeights from '../data/year_weights.json';

/**
 * オッズ係数の型定義
 */
export interface OddsCoefficient {
  from: number;
  to: number;
  coefficient: number;
}

/**
 * 期間重みの型定義
 */
export interface YearWeight {
  year: number;
  weight: number;
}

/**
 * 単勝オッズ別補正係数テーブル
 */
export const WIN_ODDS_COEFFICIENTS: OddsCoefficient[] = winCoefficients;

/**
 * 複勝オッズ別補正係数テーブル
 */
export const PLACE_ODDS_COEFFICIENTS: OddsCoefficient[] = placeCoefficients;

/**
 * 期間別重みテーブル（2016-2025）
 */
export const YEAR_WEIGHTS: YearWeight[] = yearWeights;

/**
 * オッズから補正係数を取得
 * @param odds オッズ
 * @param betType 'win' | 'place'
 * @returns 補正係数（該当なしの場合は1.0）
 */
export function getOddsCoefficient(odds: number, betType: 'win' | 'place'): number {
  const coefficients = betType === 'win' ? WIN_ODDS_COEFFICIENTS : PLACE_ODDS_COEFFICIENTS;
  
  for (const coef of coefficients) {
    if (odds >= coef.from && odds < coef.to) {
      return coef.coefficient;
    }
  }
  
  // 該当なしの場合はデフォルト1.0
  return 1.0;
}

/**
 * レース日付から期間別重みを取得
 * @param raceDate レース日付（YYYYMMDD形式またはYYYY-MM-DD形式）
 * @returns 重み（該当なしの場合は1.0）
 */
export function getYearWeight(raceDate: string): number {
  // YYYYMMDD形式の場合はYYYY部分を抽出
  let year: number;
  
  if (raceDate.includes('-')) {
    // YYYY-MM-DD形式
    year = parseInt(raceDate.substring(0, 4));
  } else {
    // YYYYMMDD形式
    year = parseInt(raceDate.substring(0, 4));
  }
  
  // 期間別重みテーブルから検索
  const weightEntry = YEAR_WEIGHTS.find(w => w.year === year);
  
  if (weightEntry) {
    return weightEntry.weight;
  }
  
  // 該当なしの場合
  // 2016年より前 → 重み1.0
  // 2025年より後 → 最大重み10.0
  if (year < 2016) {
    return 1.0;
  } else if (year > 2025) {
    return 10.0;
  }
  
  return 1.0;
}

/**
 * テスト用サンプル関数
 */
export function testCoefficients() {
  console.log('=== 補正係数テスト ===');
  
  // 単勝オッズテスト
  console.log('\n【単勝オッズ別補正係数】');
  const winOdds = [1.5, 3.0, 10.0, 50.0, 200.0];
  for (const odds of winOdds) {
    const coef = getOddsCoefficient(odds, 'win');
    console.log(`オッズ ${odds.toFixed(1)}倍 → 係数 ${coef.toFixed(2)}`);
  }
  
  // 複勝オッズテスト
  console.log('\n【複勝オッズ別補正係数】');
  const placeOdds = [1.2, 2.0, 5.0, 15.0, 70.0];
  for (const odds of placeOdds) {
    const coef = getOddsCoefficient(odds, 'place');
    console.log(`オッズ ${odds.toFixed(1)}倍 → 係数 ${coef.toFixed(2)}`);
  }
  
  // 期間別重みテスト
  console.log('\n【期間別重み】');
  const dates = ['20160101', '20180615', '20200401', '20240101', '20250630'];
  for (const date of dates) {
    const weight = getYearWeight(date);
    const year = date.substring(0, 4);
    console.log(`${year}年 → 重み ${weight}`);
  }
}
