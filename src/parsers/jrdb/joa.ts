/**
 * JOA Parser - 騎手情報パーサー  
 * 
 * JOAファイルには各騎手の情報が含まれています。
 * - 騎手ごとの成績
 * - 勝率、連対率
 */

export interface JOARecord {
  race_key: string;
  horse_number: number;
  horse_id: string;
  horse_name: string;
  
  // 騎手指数系
  jockey_expectation: number;  // 騎手期待値
  jockey_score: number;         // 騎手スコア
  
  raw_line: string;
}

export function parseJOA(content: string): JOARecord[] {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const records: JOARecord[] = [];
  
  for (const line of lines) {
    try {
      if (line.length < 50) continue;
      
      const race_key = line.substring(0, 8).trim();
      const horse_number_str = line.substring(8, 10).trim();
      const horse_number = horse_number_str ? parseInt(horse_number_str, 10) : 0;
      
      const horse_id = line.substring(10, 18).trim();
      const horse_name = line.substring(18, 54).trim();
      
      // 騎手期待値 (位置: 55-59)
      const jockey_exp_str = line.substring(54, 59).trim();
      const jockey_expectation = jockey_exp_str ? parseFloat(jockey_exp_str) : 0;
      
      // 騎手スコア (位置: 60-64)
      const jockey_score_str = line.substring(59, 64).trim();
      const jockey_score = jockey_score_str ? parseFloat(jockey_score_str) : 0;
      
      records.push({
        race_key,
        horse_number,
        horse_id,
        horse_name,
        jockey_expectation,
        jockey_score,
        raw_line: line
      });
    } catch (error) {
      // Skip invalid lines
    }
  }
  
  return records;
}
