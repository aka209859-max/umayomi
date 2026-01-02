/**
 * CHA Parser - 調教情報パーサー
 * 
 * CHAファイルには各馬の調教情報が含まれています。
 * - 調教日
 * - 調教コース
 * - 調教タイム
 * - 調教評価
 */

export interface CHARecord {
  race_key: string;          // レースキー
  horse_number: number;      // 馬番
  
  // 調教情報
  training_date: string;     // 調教日 (YYYYMMDD)
  training_course: string;   // 調教コース
  training_time: string;     // 調教タイム
  training_eval: string;     // 調教評価
  
  raw_line: string;
}

export function parseCHA(content: string): CHARecord[] {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const records: CHARecord[] = [];
  
  for (const line of lines) {
    try {
      if (line.length < 20) continue;
      
      const race_key = line.substring(0, 8).trim();
      const horse_number_str = line.substring(8, 10).trim();
      const horse_number = horse_number_str ? parseInt(horse_number_str, 10) : 0;
      
      const training_date = line.substring(12, 20).trim();
      const training_course = line.substring(20, 30).trim();
      const training_time = line.substring(30, 40).trim();
      const training_eval = line.substring(40, 50).trim();
      
      records.push({
        race_key,
        horse_number,
        training_date,
        training_course,
        training_time,
        training_eval,
        raw_line: line
      });
    } catch (error) {
      // Skip invalid lines
    }
  }
  
  return records;
}
