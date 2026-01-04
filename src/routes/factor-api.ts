import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { calculateAdjustedReturnRate } from '../utils/adjusted_return_rate';
import { calculateRGS } from '../utils/rgs10';
import { calculateAAS } from '../utils/aas';

const app = new Hono();

// Enable CORS for API endpoints
app.use('*', cors());

/**
 * ファクター条件の型定義
 */
interface FactorConditions {
  keys: string[];  // 最大6個の集計キー
  dateRange?: {
    from: string;  // YYYY-MM-DD
    to: string;    // YYYY-MM-DD
  };
}

/**
 * ファクター計算結果の型定義
 */
interface FactorCalculationResult {
  id: string;
  keys: string[];
  winCount: number;
  winHitRate: number;
  winReturnRate: number;
  placeCount: number;
  placeHitRate: number;
  placeReturnRate: number;
  adjWinReturnRate: number;
  aasScore: number;
  adjPlaceReturnRate: number;
  rgsScore: number;
}

/**
 * ファクター保存条件の型定義
 */
interface FactorSaveCondition {
  mode: 'aas' | 'rgs' | 'both' | 'either' | 'manual';
  aasThreshold?: number;
  rgsThreshold?: number;
  minRaceCount?: number;
  minHitRate?: number;
}

/**
 * POST /api/factors/calculate
 * ファクター条件から過去データを集計し、RGS1.0/AASを計算
 */
app.post('/calculate', async (c) => {
  try {
    const body = await c.req.json();
    const conditions: FactorConditions = body.conditions;

    if (!conditions || !conditions.keys || conditions.keys.length === 0) {
      return c.json({ error: 'Invalid conditions: keys are required' }, 400);
    }

    // TODO: 実際のデータベースから過去データを集計
    // ここでは仮データを使用（Phase 6-A で実装）
    const mockData = generateMockFactorData(conditions.keys);

    // 補正回収率を計算
    const adjWinRet = calculateAdjustedReturnRate(
      mockData.races.map(r => ({
        odds: r.winOdds,
        payout: r.winPayout,
        raceDate: r.raceDate
      }))
    );

    const adjPlaceRet = calculateAdjustedReturnRate(
      mockData.races.map(r => ({
        odds: r.placeOdds,
        payout: r.placePayout,
        raceDate: r.raceDate
      }))
    );

    // RGS1.0を計算
    const rgsScore = calculateRGS(
      mockData.winCount,
      mockData.placeCount,
      adjWinRet,
      adjPlaceRet
    );

    // AASを計算（グループ全体の統計が必要）
    const aasScore = calculateAAS(
      mockData.winCount,
      mockData.placeCount,
      mockData.winHitRate,
      mockData.placeHitRate,
      adjWinRet,
      adjPlaceRet,
      mockData.groupStats
    );

    // 結果を返す
    const result: FactorCalculationResult = {
      id: generateFactorId(conditions.keys),
      keys: conditions.keys,
      winCount: mockData.winCount,
      winHitRate: mockData.winHitRate,
      winReturnRate: mockData.winReturnRate,
      placeCount: mockData.placeCount,
      placeHitRate: mockData.placeHitRate,
      placeReturnRate: mockData.placeReturnRate,
      adjWinReturnRate: adjWinRet,
      aasScore: aasScore,
      adjPlaceReturnRate: adjPlaceRet,
      rgsScore: rgsScore
    };

    return c.json({
      success: true,
      result: result
    });

  } catch (error) {
    console.error('Error in /api/factors/calculate:', error);
    return c.json({ error: 'Internal server error', message: String(error) }, 500);
  }
});

/**
 * POST /api/factors/save
 * 保存条件に基づいてファクターをDBに保存
 */
app.post('/save', async (c) => {
  try {
    const body = await c.req.json();
    const factorIds: string[] = body.factors || [];
    const saveCondition: FactorSaveCondition = body.saveCondition;

    if (factorIds.length === 0) {
      return c.json({ error: 'No factors specified' }, 400);
    }

    // TODO: 実際のデータベースに保存（Phase 6-A で実装）
    // ここでは仮の保存処理
    const savedResults = factorIds.map(id => ({
      id: id,
      saved: true,
      reason: saveCondition.mode,
      timestamp: new Date().toISOString()
    }));

    return c.json({
      success: true,
      saved: savedResults.length,
      results: savedResults
    });

  } catch (error) {
    console.error('Error in /api/factors/save:', error);
    return c.json({ error: 'Internal server error', message: String(error) }, 500);
  }
});

/**
 * GET /api/factors/saved
 * 保存済みファクター一覧を取得
 */
app.get('/saved', async (c) => {
  try {
    // TODO: 実際のデータベースから取得（Phase 6-A で実装）
    // ここでは仮データを返す
    const mockSavedFactors: FactorCalculationResult[] = [
      {
        id: 'F001',
        keys: ['中山', '芝', '1200m', '3歳', 'えりも町', ''],
        winCount: 11,
        winHitRate: 30.5,
        winReturnRate: 233.6,
        placeCount: 16,
        placeHitRate: 35.2,
        placeReturnRate: 168.8,
        adjWinReturnRate: 175.1,
        aasScore: 3.4,
        adjPlaceReturnRate: 66.4,
        rgsScore: 1.75
      },
      {
        id: 'F002',
        keys: ['東京', '芝', '2000m', '', '新冠町', ''],
        winCount: 25,
        winHitRate: 28.3,
        winReturnRate: 185.2,
        placeCount: 38,
        placeHitRate: 42.1,
        placeReturnRate: 125.3,
        adjWinReturnRate: 138.5,
        aasScore: 2.8,
        adjPlaceReturnRate: 88.2,
        rgsScore: 1.20
      }
    ];

    return c.json({
      success: true,
      factors: mockSavedFactors,
      count: mockSavedFactors.length
    });

  } catch (error) {
    console.error('Error in /api/factors/saved:', error);
    return c.json({ error: 'Internal server error', message: String(error) }, 500);
  }
});

/**
 * ファクターIDを生成（キーから一意のIDを作成）
 */
function generateFactorId(keys: string[]): string {
  const nonEmptyKeys = keys.filter(k => k && k.trim() !== '');
  if (nonEmptyKeys.length === 0) {
    return 'F' + Date.now();
  }
  // キーを結合してハッシュ風のIDを生成
  const keyString = nonEmptyKeys.join('_');
  const hash = Array.from(keyString).reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  return 'F' + Math.abs(hash).toString(36).toUpperCase().substring(0, 8);
}

/**
 * モックデータ生成（実際のDB実装まで使用）
 */
function generateMockFactorData(keys: string[]) {
  // キーの内容に応じて異なるモックデータを生成
  const keyString = keys.join('');
  const seed = keyString.length * 1234;
  
  const winCount = 10 + (seed % 30);
  const placeCount = 15 + (seed % 35);
  const winHitRate = 20 + (seed % 15);
  const placeHitRate = 30 + (seed % 20);
  const winReturnRate = 100 + (seed % 150);
  const placeReturnRate = 80 + (seed % 100);

  // 仮のレースデータ
  const races = Array.from({ length: winCount }, (_, i) => ({
    raceDate: `2024-${String(1 + i % 12).padStart(2, '0')}-15`,
    winOdds: 2.0 + (i * 1.5) % 20,
    winPayout: (i % 3 === 0) ? 10000 : 0,
    placeOdds: 1.5 + (i * 0.8) % 10,
    placePayout: (i % 2 === 0) ? 5000 : 0
  }));

  // グループ統計（AAS計算用）
  const groupStats = {
    hitRateMean: 25.0,
    hitRateStd: 8.0,
    returnRateMean: 85.0,
    returnRateStd: 30.0
  };

  return {
    winCount,
    placeCount,
    winHitRate,
    placeHitRate,
    winReturnRate,
    placeReturnRate,
    races,
    groupStats
  };
}

export default app;
