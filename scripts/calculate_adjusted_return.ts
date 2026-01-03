/**
 * 補正回収率計算スクリプト
 * 
 * 3つの補正メカニズムを実装：
 * 1. 均等払戻方式（Equal Payout Method）
 * 2. オッズ別配当補正係数（Odds Correction Coefficients）
 * 3. 期間別重み付け（Year Weights）
 */

import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';

// ============================================
// 型定義
// ============================================

interface OddsCoefficient {
  bet_type: 'win' | 'place';
  odds_min: number;
  odds_max: number;
  coefficient: number;
}

interface YearWeight {
  year: number;
  weight: number;
}

interface RaceRecord {
  id: number;
  race_date: string;
  odds: number;
  result: number;  // 1=的中, 0=不的中
  payout: number;  // 配当額
  bet_type: 'win' | 'place';
}

// ============================================
// データベース接続
// ============================================

function getDatabase(): Database.Database {
  const wranglerDir = path.join(process.cwd(), '.wrangler', 'state', 'v3', 'd1');
  
  if (!fs.existsSync(wranglerDir)) {
    throw new Error(`Wrangler directory not found: ${wranglerDir}`);
  }
  
  const files = fs.readdirSync(wranglerDir).filter(f => f.endsWith('.sqlite'));
  
  if (files.length === 0) {
    throw new Error('No SQLite database found in .wrangler directory');
  }
  
  const dbPath = path.join(wranglerDir, files[0]);
  console.log(`📂 Database: ${dbPath}`);
  
  return new Database(dbPath);
}

// ============================================
// 補正係数・重みの取得
// ============================================

function getOddsCoefficients(db: Database.Database): Map<string, OddsCoefficient[]> {
  const coefficients = db.prepare(`
    SELECT bet_type, odds_min, odds_max, coefficient
    FROM odds_correction_coefficients
    ORDER BY bet_type, odds_min
  `).all() as OddsCoefficient[];
  
  const map = new Map<string, OddsCoefficient[]>();
  map.set('win', coefficients.filter(c => c.bet_type === 'win'));
  map.set('place', coefficients.filter(c => c.bet_type === 'place'));
  
  console.log(`📊 オッズ補正係数取得: 単勝=${map.get('win')?.length}件, 複勝=${map.get('place')?.length}件`);
  
  return map;
}

function getYearWeights(db: Database.Database): Map<number, number> {
  const weights = db.prepare(`
    SELECT year, weight
    FROM year_weights
    ORDER BY year
  `).all() as YearWeight[];
  
  const map = new Map<number, number>();
  weights.forEach(w => map.set(w.year, w.weight));
  
  console.log(`📅 期間別重み取得: ${weights.length}年分 (${weights[0]?.year}-${weights[weights.length - 1]?.year})`);
  
  return map;
}

// ============================================
// 1. オッズ別補正係数の取得
// ============================================

function getOddsCoefficientForValue(
  odds: number, 
  betType: 'win' | 'place', 
  coefficients: Map<string, OddsCoefficient[]>
): number {
  const list = coefficients.get(betType) || [];
  
  for (const coef of list) {
    if (odds >= coef.odds_min && odds < coef.odds_max) {
      return coef.coefficient;
    }
  }
  
  // デフォルト係数（見つからない場合）
  return 1.0;
}

// ============================================
// 2. 期間別重みの取得
// ============================================

function getYearWeight(raceDate: string, yearWeights: Map<number, number>): number {
  // race_date: "YYYYMMDD" or "YYYY-MM-DD"
  const yearStr = raceDate.substring(0, 4);
  const year = parseInt(yearStr, 10);
  
  return yearWeights.get(year) || 1.0;
}

// ============================================
// 3. 補正回収率計算（コアロジック）
// ============================================

interface BetRecord {
  odds: number;
  result: number;  // 1=的中, 0=不的中
  payout: number;
  year_weight: number;
}

/**
 * 補正回収率計算
 * 
 * @param records - 馬券購入記録
 * @param betType - 馬券種別（'win' or 'place'）
 * @param coefficients - オッズ別補正係数
 * @returns 補正回収率（%）
 */
export function calculateAdjustedReturnRate(
  records: BetRecord[],
  betType: 'win' | 'place',
  coefficients: Map<string, OddsCoefficient[]>
): number {
  if (records.length === 0) return 0;
  
  let totalInvestment = 0;  // 総投資額
  let totalReturn = 0;      // 総払戻額
  
  for (const record of records) {
    // 1. 均等払戻方式: 投資額 = 10,000円 / オッズ
    const investment = 10000 / record.odds;
    
    // 2. オッズ別補正係数を取得
    const coefficient = getOddsCoefficientForValue(record.odds, betType, coefficients);
    
    // 3. 期間別重み適用
    const weight = record.year_weight;
    
    // 4. 的中時の払戻額計算
    const returnAmount = record.result === 1 ? 10000 : 0;
    
    // 5. 補正適用
    totalInvestment += investment * coefficient * weight;
    totalReturn += returnAmount * coefficient * weight;
  }
  
  if (totalInvestment === 0) return 0;
  
  // 回収率 = (総払戻額 / 総投資額) * 100
  const returnRate = (totalReturn / totalInvestment) * 100;
  
  return Math.round(returnRate * 10) / 10;  // 小数第1位まで
}

// ============================================
// サンプルデータでのテスト
// ============================================

function testAdjustedReturnCalculation() {
  console.log('\n🧪 補正回収率計算テスト\n');
  
  const db = getDatabase();
  const oddsCoefficients = getOddsCoefficients(db);
  const yearWeights = getYearWeights(db);
  
  // サンプルデータ: 芝短距離×えりも町
  const sampleRecords: BetRecord[] = [
    // 単勝（11件想定）
    { odds: 5.0, result: 1, payout: 500, year_weight: 10.0 },  // 2025年、的中
    { odds: 10.0, result: 0, payout: 0, year_weight: 10.0 },
    { odds: 3.5, result: 1, payout: 350, year_weight: 9.0 },   // 2024年、的中
    { odds: 8.0, result: 0, payout: 0, year_weight: 9.0 },
    { odds: 15.0, result: 0, payout: 0, year_weight: 8.0 },    // 2023年
    { odds: 6.5, result: 0, payout: 0, year_weight: 8.0 },
    { odds: 12.0, result: 0, payout: 0, year_weight: 7.0 },    // 2022年
    { odds: 4.2, result: 0, payout: 0, year_weight: 7.0 },
    { odds: 20.0, result: 0, payout: 0, year_weight: 6.0 },    // 2021年
    { odds: 7.5, result: 0, payout: 0, year_weight: 6.0 },
    { odds: 9.0, result: 0, payout: 0, year_weight: 5.0 },     // 2020年
  ];
  
  const adjustedReturnWin = calculateAdjustedReturnRate(sampleRecords, 'win', oddsCoefficients);
  
  console.log(`✅ 単勝補正回収率: ${adjustedReturnWin}%`);
  console.log(`   （期待値: 約175% - えりも町サンプル）\n`);
  
  db.close();
}

// ============================================
// メイン実行
// ============================================

// テスト実行（直接実行時）
testAdjustedReturnCalculation();

// ============================================
// エクスポート
// ============================================

export {
  getDatabase,
  getOddsCoefficients,
  getYearWeights,
  getOddsCoefficientForValue,
  getYearWeight,
};
