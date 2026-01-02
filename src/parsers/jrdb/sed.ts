/**
 * SED Parser - 成績データパーサー
 * 
 * SEDファイルには各レースの詳細成績が含まれています。
 * - レース条件
 * - 各馬の詳細成績
 * - タイム、着差など
 */

export interface SEDRecord {
  race_key: string;
  horse_number: number;
  horse_id: string;
  horse_name: string;
  
  // レース情報
  race_date: string;
  distance: number;
  surface: string;
  
  // 成績情報
  finish_position: number | null;
  race_time: string;
  margin: string;
  
  // オッズ情報
  odds: number;
  popularity: number;
  
  // 騎手・調教師
  jockey_name: string;
  trainer_name: string;
  
  // 馬体重
  horse_weight: number | null;
  horse_weight_diff: number | null;
  
  raw_line: string;
}

export function parseSED(content: string): SEDRecord[] {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const records: SEDRecord[] = [];
  
  for (const line of lines) {
    try {
      if (line.length < 100) continue;
      
      const race_key = line.substring(0, 8).trim();
      const horse_number_str = line.substring(8, 10).trim();
      const horse_number = horse_number_str ? parseInt(horse_number_str, 10) : 0;
      
      const horse_id = line.substring(10, 18).trim();
      const race_date = line.substring(18, 26).trim();
      const horse_name = line.substring(26, 62).trim();
      
      // レース条件 (位置: 62-74)
      const race_condition = line.substring(62, 74).trim();
      const distance_str = race_condition.substring(0, 4);
      const distance = distance_str ? parseInt(distance_str, 10) : 0;
      
      // 着順 (位置: 160-162)
      const finish_str = line.substring(160, 162).trim();
      const finish_position = finish_str ? parseInt(finish_str, 10) : null;
      
      // オッズ (位置: 200-210)
      const odds_str = line.substring(200, 210).trim();
      const odds = odds_str ? parseFloat(odds_str) : 0;
      
      // 人気 (位置: 210-213)
      const popularity_str = line.substring(210, 213).trim();
      const popularity = popularity_str ? parseInt(popularity_str, 10) : 0;
      
      // 騎手名 (位置: 350-362)
      const jockey_name = line.substring(350, 362).trim();
      
      // 調教師名 (位置: 380-392)
      const trainer_name = line.substring(380, 392).trim();
      
      // 馬体重 (位置: 450-453)
      const horse_weight_str = line.substring(450, 453).trim();
      const horse_weight = horse_weight_str ? parseInt(horse_weight_str, 10) : null;
      
      records.push({
        race_key,
        horse_number,
        horse_id,
        horse_name,
        race_date,
        distance,
        surface: '芝', // デフォルト
        finish_position,
        race_time: '',
        margin: '',
        odds,
        popularity,
        jockey_name,
        trainer_name,
        horse_weight,
        horse_weight_diff: null,
        raw_line: line
      });
    } catch (error) {
      // Skip invalid lines
    }
  }
  
  return records;
}
