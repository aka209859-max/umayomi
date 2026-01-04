import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// Enable CORS
app.use('*', cors());

/**
 * 明日のレース情報型定義
 */
interface TomorrowRace {
  raceId: string;
  raceDate: string;
  raceName: string;
  venue: string;
  raceNumber: number;
  distance: string;
  surface: string;
  horses: HorseWithScore[];
}

/**
 * 出走馬情報（スコア付き）
 */
interface HorseWithScore {
  horseNumber: number;
  horseName: string;
  jockeyName: string;
  trainerName: string;
  
  // スコア
  totalAasScore: number;
  totalRgsScore: number;
  matchedFactorCount: number;
  
  // 該当ファクター詳細
  matchedFactors: {
    factorId: string;
    factorName: string;
    keys: string[];
    aasScore: number;
    rgsScore: number;
  }[];
}

/**
 * GET /api/races/tomorrow
 * 明日のレース一覧を取得し、保存済みファクターとマッチング
 */
app.get('/tomorrow', async (c) => {
  try {
    // TODO: 実際のデータベースから明日のレースを取得
    // ここでは仮データを使用（Phase 6-A で実装済みのDB関数を使用予定）
    const tomorrowRaces = await getMockTomorrowRaces();
    
    return c.json({
      success: true,
      date: getTomorrowDate(),
      races: tomorrowRaces,
      count: tomorrowRaces.length
    });
    
  } catch (error) {
    console.error('Error in /api/races/tomorrow:', error);
    return c.json({ error: 'Internal server error', message: String(error) }, 500);
  }
});

/**
 * GET /api/races/tomorrow/:raceId
 * 特定レースの詳細情報を取得
 */
app.get('/tomorrow/:raceId', async (c) => {
  try {
    const raceId = c.req.param('raceId');
    
    // TODO: 実際のデータベースから取得
    const race = await getMockRaceDetail(raceId);
    
    if (!race) {
      return c.json({ error: 'Race not found' }, 404);
    }
    
    return c.json({
      success: true,
      race: race
    });
    
  } catch (error) {
    console.error('Error in /api/races/tomorrow/:raceId:', error);
    return c.json({ error: 'Internal server error', message: String(error) }, 500);
  }
});

/**
 * 明日の日付を取得（YYYY-MM-DD形式）
 */
function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

/**
 * モックデータ: 明日のレース一覧
 */
async function getMockTomorrowRaces(): Promise<TomorrowRace[]> {
  return [
    {
      raceId: 'R202501050101',
      raceDate: getTomorrowDate(),
      raceName: '中山1R',
      venue: '中山',
      raceNumber: 1,
      distance: '1200m',
      surface: '芝',
      horses: [
        {
          horseNumber: 1,
          horseName: 'ディープインパクト',
          jockeyName: '武豊',
          trainerName: '藤沢和雄',
          totalAasScore: 5.2,
          totalRgsScore: 2.45,
          matchedFactorCount: 2,
          matchedFactors: [
            {
              factorId: 'F001',
              factorName: '中山 芝 1200m 3歳 えりも町',
              keys: ['中山', '芝', '1200m', '3歳', 'えりも町', ''],
              aasScore: 3.4,
              rgsScore: 1.75
            },
            {
              factorId: 'F002',
              factorName: '武豊騎手',
              keys: ['武豊', '', '', '', '', ''],
              aasScore: 1.8,
              rgsScore: 0.70
            }
          ]
        },
        {
          horseNumber: 2,
          horseName: 'オルフェーヴル',
          jockeyName: '池添謙一',
          trainerName: '池江泰寿',
          totalAasScore: 2.8,
          totalRgsScore: 1.20,
          matchedFactorCount: 1,
          matchedFactors: [
            {
              factorId: 'F002',
              factorName: '東京 芝 2000m 新冠町',
              keys: ['東京', '芝', '2000m', '', '新冠町', ''],
              aasScore: 2.8,
              rgsScore: 1.20
            }
          ]
        },
        {
          horseNumber: 3,
          horseName: 'キタサンブラック',
          jockeyName: '浜中俊',
          trainerName: '清水久詞',
          totalAasScore: -0.5,
          totalRgsScore: -0.15,
          matchedFactorCount: 0,
          matchedFactors: []
        }
      ]
    },
    {
      raceId: 'R202501050102',
      raceDate: getTomorrowDate(),
      raceName: '中山2R',
      venue: '中山',
      raceNumber: 2,
      distance: '1800m',
      surface: '芝',
      horses: [
        {
          horseNumber: 1,
          horseName: 'ジェンティルドンナ',
          jockeyName: '戸崎圭太',
          trainerName: '石坂正',
          totalAasScore: 1.5,
          totalRgsScore: 0.50,
          matchedFactorCount: 1,
          matchedFactors: [
            {
              factorId: 'F003',
              factorName: '阪神 ダート 1400m 牡馬 浦河町 春',
              keys: ['阪神', 'ダート', '1400m', '牡馬', '浦河町', '春'],
              aasScore: 1.5,
              rgsScore: 0.50
            }
          ]
        }
      ]
    }
  ];
}

/**
 * モックデータ: レース詳細
 */
async function getMockRaceDetail(raceId: string): Promise<TomorrowRace | null> {
  const races = await getMockTomorrowRaces();
  return races.find(r => r.raceId === raceId) || null;
}

export default app;
