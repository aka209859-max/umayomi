/**
 * Factor Scores Batch Calculation Script
 * ファクタースコア一括計算スクリプト
 * 
 * Usage:
 *   npm run calculate:factors
 * 
 * このスクリプトは CEO PC のローカル環境で実行します
 * - JRA-VAN/JRDB データから過去データを集計
 * - RGS1.0/AAS を計算
 * - factor_scores テーブルに保存
 */

import Database from 'better-sqlite3';
import { calculateAdjustedReturnRate } from '../src/utils/adjusted_return_rate';
import { calculateRGS } from '../src/utils/rgs10';
import { calculateAAS } from '../src/utils/aas';
import type { FactorDisplayResult } from '../src/types/factor';

// データベースパス（CEO PC）
const DB_PATH = process.env.DB_PATH || 'E:\\UMAYOMI\\umayomi.db';

/**
 * ファクター定義（サンプル）
 * 実際には登録済みファクターをDBから取得
 */
interface FactorDefinition {
  id: string;
  keys: string[];
  name: string;
}

/**
 * レースデータ型定義
 */
interface RaceData {
  raceDate: string;
  winOdds: number;
  winPayout: number;
  placeOdds: number;
  placePayout: number;
}

/**
 * メイン処理
 */
async function main() {
  console.log('🚀 Factor Scores Batch Calculation Start');
  console.log('📂 Database:', DB_PATH);
  
  // データベース接続
  const db = new Database(DB_PATH);
  
  try {
    // マイグレーション実行
    console.log('\n📊 Running migrations...');
    await runMigrations(db);
    
    // ファクター定義を取得（サンプル）
    const factors = getSampleFactors();
    console.log(`\n✅ Found ${factors.length} factors to calculate`);
    
    // 各ファクターを計算
    for (let i = 0; i < factors.length; i++) {
      const factor = factors[i];
      console.log(`\n[${i + 1}/${factors.length}] Processing: ${factor.name}`);
      
      try {
        // 過去データを集計
        const raceData = await aggregateRaceData(db, factor.keys);
        console.log(`  - Found ${raceData.races.length} races`);
        
        // RGS/AAS を計算
        const result = await calculateFactorScore(factor, raceData);
        console.log(`  - AAS: ${result.aasScore.toFixed(2)}, RGS: ${result.rgsScore.toFixed(2)}`);
        
        // DBに保存
        await saveFactorScore(db, result);
        console.log(`  ✅ Saved to database`);
        
      } catch (error) {
        console.error(`  ❌ Error:`, error);
      }
    }
    
    console.log('\n🎉 Batch calculation completed!');
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

/**
 * マイグレーション実行
 */
async function runMigrations(db: Database.Database) {
  const fs = require('fs');
  const path = require('path');
  
  const migrationFile = path.join(__dirname, '../migrations/0004_create_factor_scores_tables.sql');
  
  if (fs.existsSync(migrationFile)) {
    const sql = fs.readFileSync(migrationFile, 'utf-8');
    db.exec(sql);
    console.log('  ✅ Migration 0004 applied');
  }
}

/**
 * サンプルファクター定義
 */
function getSampleFactors(): FactorDefinition[] {
  return [
    {
      id: 'F001',
      keys: ['中山', '芝', '1200m', '3歳', 'えりも町', ''],
      name: '中山 芝 1200m 3歳 えりも町'
    },
    {
      id: 'F002',
      keys: ['東京', '芝', '2000m', '', '新冠町', ''],
      name: '東京 芝 2000m 新冠町'
    },
    {
      id: 'F003',
      keys: ['阪神', 'ダート', '1400m', '牡馬', '浦河町', '春'],
      name: '阪神 ダート 1400m 牡馬 浦河町 春'
    }
  ];
}

/**
 * 過去データを集計
 */
async function aggregateRaceData(db: Database.Database, keys: string[]): Promise<{
  races: RaceData[];
  winCount: number;
  placeCount: number;
  winHitRate: number;
  placeHitRate: number;
  winReturnRate: number;
  placeReturnRate: number;
  groupStats: any;
}> {
  // TODO: JRA-VAN jravan_se テーブルから実データを取得
  // ここでは仮データを生成
  
  const winCount = 10 + Math.floor(Math.random() * 30);
  const placeCount = 15 + Math.floor(Math.random() * 35);
  
  const races: RaceData[] = Array.from({ length: winCount }, (_, i) => ({
    raceDate: `2024-${String(1 + i % 12).padStart(2, '0')}-15`,
    winOdds: 2.0 + (i * 1.5) % 20,
    winPayout: (i % 3 === 0) ? 10000 : 0,
    placeOdds: 1.5 + (i * 0.8) % 10,
    placePayout: (i % 2 === 0) ? 5000 : 0
  }));
  
  // 的中率・回収率を計算
  const winHits = races.filter(r => r.winPayout > 0).length;
  const placeHits = races.filter(r => r.placePayout > 0).length;
  
  const winHitRate = (winHits / winCount) * 100;
  const placeHitRate = (placeHits / placeCount) * 100;
  
  const totalBet = 10000;
  const winReturnRate = (races.reduce((sum, r) => sum + r.winPayout, 0) / (winCount * totalBet)) * 100;
  const placeReturnRate = (races.reduce((sum, r) => sum + r.placePayout, 0) / (placeCount * totalBet)) * 100;
  
  // グループ統計（AAS計算用）
  const groupStats = {
    hitRateMean: 25.0,
    hitRateStd: 8.0,
    returnRateMean: 85.0,
    returnRateStd: 30.0
  };
  
  return {
    races,
    winCount,
    placeCount,
    winHitRate,
    placeHitRate,
    winReturnRate,
    placeReturnRate,
    groupStats
  };
}

/**
 * ファクタースコアを計算
 */
async function calculateFactorScore(
  factor: FactorDefinition,
  raceData: ReturnType<typeof aggregateRaceData> extends Promise<infer T> ? T : never
): Promise<FactorDisplayResult> {
  // 補正回収率を計算
  const adjWinRet = calculateAdjustedReturnRate(
    raceData.races.map(r => ({
      odds: r.winOdds,
      payout: r.winPayout,
      raceDate: r.raceDate
    }))
  );
  
  const adjPlaceRet = calculateAdjustedReturnRate(
    raceData.races.map(r => ({
      odds: r.placeOdds,
      payout: r.placePayout,
      raceDate: r.raceDate
    }))
  );
  
  // RGS1.0を計算
  const rgsScore = calculateRGS(
    raceData.winCount,
    raceData.placeCount,
    adjWinRet,
    adjPlaceRet
  );
  
  // AASを計算
  const aasScore = calculateAAS(
    raceData.winCount,
    raceData.placeCount,
    raceData.winHitRate,
    raceData.placeHitRate,
    adjWinRet,
    adjPlaceRet,
    raceData.groupStats
  );
  
  return {
    id: factor.id,
    keys: factor.keys,
    winCount: raceData.winCount,
    winHitRate: raceData.winHitRate,
    winReturnRate: raceData.winReturnRate,
    placeCount: raceData.placeCount,
    placeHitRate: raceData.placeHitRate,
    placeReturnRate: raceData.placeReturnRate,
    adjWinReturnRate: adjWinRet,
    aasScore: aasScore,
    adjPlaceReturnRate: adjPlaceRet,
    rgsScore: rgsScore
  };
}

/**
 * ファクタースコアをDBに保存
 */
async function saveFactorScore(db: Database.Database, result: FactorDisplayResult) {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO factor_scores (
      factor_id, factor_name, keys,
      win_count, place_count,
      win_hit_rate, place_hit_rate,
      win_return_rate, place_return_rate,
      adj_win_return_rate, adj_place_return_rate,
      aas_score, rgs_score,
      is_saved, calculated_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, datetime('now'), datetime('now'))
  `);
  
  stmt.run(
    result.id,
    result.keys.filter(k => k).join(' × '),
    JSON.stringify(result.keys),
    result.winCount,
    result.placeCount,
    result.winHitRate,
    result.placeHitRate,
    result.winReturnRate,
    result.placeReturnRate,
    result.adjWinReturnRate,
    result.adjPlaceReturnRate,
    result.aasScore,
    result.rgsScore
  );
}

// スクリプト実行
if (require.main === module) {
  main().catch(console.error);
}

export { main as calculateAllFactorScores };
