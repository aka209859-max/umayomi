/**
 * TYB Parser - 出走表パーサー
 * 
 * TYBファイルには出走表情報が含まれています。
 * - 予想オッズ
 * - 各種指数
 */

export interface TYBRecord {
  race_key: string;
  horse_number: number;
  
  // 予想情報
  estimated_odds: number;
  estimated_popularity: number;
  
  // 指数情報
  speed_index: number;
  pace_index: number;
  late_index: number;
  position_index: number;
  
  // 騎手情報
  jockey_name: string;
  jockey_weight: number;
  
  // 馬情報
  horse_age: number;
  horse_sex: string;
  
  raw_line: string;
}

export function parseTYB(content: string): TYBRecord[] {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const records: TYBRecord[] = [];
  
  for (const line of lines) {
    try {
      if (line.length < 50) continue;
      
      const race_key = line.substring(0, 8).trim();
      const horse_number_str = line.substring(8, 10).trim();
      const horse_number = horse_number_str ? parseInt(horse_number_str, 10) : 0;
      
      // 予想オッズ (位置: 11-15)
      const odds_str = line.substring(10, 15).trim();
      const estimated_odds = odds_str ? parseFloat(odds_str) : 0;
      
      // スピード指数 (位置: 16-20)
      const speed_str = line.substring(15, 20).trim();
      const speed_index = speed_str ? parseFloat(speed_str) : 0;
      
      // ペース指数 (位置: 21-25)
      const pace_str = line.substring(20, 25).trim();
      const pace_index = pace_str ? parseFloat(pace_str) : 0;
      
      // 上がり指数 (位置: 26-30)
      const late_str = line.substring(25, 30).trim();
      const late_index = late_str ? parseFloat(late_str) : 0;
      
      // 位置指数 (位置: 31-35)
      const position_str = line.substring(30, 35).trim();
      const position_index = position_str ? parseFloat(position_str) : 0;
      
      // 騎手名 (位置: 50-62)
      const jockey_name = line.substring(50, 62).trim();
      
      // 斤量 (位置: 62-66)
      const weight_str = line.substring(62, 66).trim();
      const jockey_weight = weight_str ? parseInt(weight_str, 10) / 10 : 0;
      
      // 性齢 (位置: 66-69)
      const sex_age = line.substring(66, 69).trim();
      const horse_sex = sex_age.charAt(0);
      const horse_age = sex_age.charAt(1) ? parseInt(sex_age.charAt(1), 10) : 0;
      
      records.push({
        race_key,
        horse_number,
        estimated_odds,
        estimated_popularity: 0,
        speed_index,
        pace_index,
        late_index,
        position_index,
        jockey_name,
        jockey_weight,
        horse_age,
        horse_sex,
        raw_line: line
      });
    } catch (error) {
      // Skip invalid lines
    }
  }
  
  return records;
}
