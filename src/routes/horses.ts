/**
 * 馬の過去成績API
 * 
 * GET /api/horses/:horse_id/history?limit=10
 * 
 * 指定した馬の過去レース情報を取得します
 */

import { Hono } from 'hono';
import { loadHorseHistory } from '../lib/jrdb_loader';
import { KYIRecord } from '../parsers/jrdb/kyi';

const app = new Hono();

/**
 * 馬の過去成績を取得
 * 
 * GET /api/horses/:horse_id/history?limit=10
 * 
 * Response:
 * {
 *   horse_id: string,
 *   horse_name: string,
 *   total_races: number,
 *   wins: number,
 *   places: number,
 *   recent_races: [...]
 * }
 */
app.get('/api/horses/:horse_id/history', async (c) => {
  const horseId = c.req.param('horse_id');
  const limit = parseInt(c.req.query('limit') || '10', 10);
  
  try {
    // JRDBデータから馬の全過去レースを取得
    const allRaces = loadHorseHistory(horseId);
    
    if (allRaces.length === 0) {
      return c.json({
        error: 'Horse not found',
        horse_id: horseId
      }, 404);
    }
    
    // 最新のレースから馬名を取得
    const horseName = allRaces[0].horse_name;
    
    // 統計情報を計算
    const totalRaces = allRaces.length;
    const wins = allRaces.filter(r => r.finish_position === 1).length;
    const places = allRaces.filter(r => r.finish_position !== null && r.finish_position <= 3).length;
    
    // 最新limit件のレースを取得
    const recentRaces = allRaces.slice(0, limit).map(race => ({
      race_date: race.race_date,
      race_key: race.race_key,
      track_code: race.track_code,
      distance: race.distance,
      surface: race.surface,
      track_condition: race.track_condition,
      finish_position: race.finish_position,
      race_time: race.race_time,
      margin: race.margin,
      odds: race.odds,
      popularity: race.popularity,
      jockey_name: race.jockey_name,
      weight: race.weight,
      horse_weight: race.horse_weight,
      horse_weight_diff: race.horse_weight_diff,
      final_3f: race.final_3f,
      passing_order: race.passing_order,
      // 指数データ
      id_m: race.id_m,
      jockey_index: race.jockey_index,
      info_index: race.info_index
    }));
    
    return c.json({
      horse_id: horseId,
      horse_name: horseName,
      total_races: totalRaces,
      wins,
      places,
      win_rate: totalRaces > 0 ? (wins / totalRaces * 100).toFixed(1) : '0.0',
      place_rate: totalRaces > 0 ? (places / totalRaces * 100).toFixed(1) : '0.0',
      recent_races: recentRaces
    });
    
  } catch (error) {
    console.error('Error loading horse history:', error);
    return c.json({
      error: 'Internal server error',
      message: (error as Error).message
    }, 500);
  }
});

/**
 * 馬の基本情報を取得
 * 
 * GET /api/horses/:horse_id
 */
app.get('/api/horses/:horse_id', async (c) => {
  const horseId = c.req.param('horse_id');
  
  try {
    const allRaces = loadHorseHistory(horseId);
    
    if (allRaces.length === 0) {
      return c.json({
        error: 'Horse not found',
        horse_id: horseId
      }, 404);
    }
    
    const latestRace = allRaces[0];
    
    return c.json({
      horse_id: horseId,
      horse_name: latestRace.horse_name,
      age: latestRace.age,
      sex: latestRace.sex,
      trainer_name: latestRace.trainer_name,
      trainer_code: latestRace.trainer_code,
      owner_name: latestRace.owner_name,
      total_races: allRaces.length,
      latest_race_date: latestRace.race_date
    });
    
  } catch (error) {
    console.error('Error loading horse info:', error);
    return c.json({
      error: 'Internal server error',
      message: (error as Error).message
    }, 500);
  }
});

/**
 * 馬の検索
 * 
 * GET /api/horses/search?q=馬名&limit=20
 */
app.get('/api/horses/search', async (c) => {
  const query = c.req.query('q') || '';
  const limit = parseInt(c.req.query('limit') || '20', 10);
  
  if (!query) {
    return c.json({
      error: 'Query parameter required',
      message: 'Please provide "q" parameter'
    }, 400);
  }
  
  // TODO: 全馬のインデックスから検索
  // 今は簡易的にエラーを返す
  return c.json({
    error: 'Not implemented yet',
    message: 'Horse search will be implemented after database setup'
  }, 501);
});

export default app;
