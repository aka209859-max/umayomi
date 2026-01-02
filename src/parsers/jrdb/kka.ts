/**
 * KKA Parser - 競走成績パーサー
 */

export interface KKARecord {
  horse_id: string;
  race_date: string;
  track_code: string;
  race_number: number;
  finish_position: number;
  horse_number: number;
  odds: number;
  popularity: number;
  time: string;
  margin: string;
  jockey_name: string;
  weight: number;
  horse_weight: number;
  raw_line: string;
}

export function parseKKA(content: string): KKARecord[] {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const records: KKARecord[] = [];
  
  for (const line of lines) {
    try {
      const record = parseKKALine(line);
      if (record) records.push(record);
    } catch (error) {
      console.error('KKA parse error:', error);
    }
  }
  
  return records;
}

function parseKKALine(line: string): KKARecord | null {
  if (line.length < 100) return null;
  
  const extract = (start: number, end: number): string => line.substring(start, end).trim();
  const extractNumber = (start: number, end: number): number => {
    const value = extract(start, end);
    const num = parseInt(value, 10);
    return isNaN(num) ? 0 : num;
  };
  
  return {
    horse_id: extract(0, 10),
    race_date: extract(10, 18),
    track_code: extract(18, 20),
    race_number: extractNumber(20, 22),
    finish_position: extractNumber(22, 24),
    horse_number: extractNumber(24, 26),
    odds: parseFloat(extract(26, 32)) / 10,
    popularity: extractNumber(32, 34),
    time: extract(34, 41),
    margin: extract(41, 46),
    jockey_name: extract(46, 58),
    weight: extractNumber(58, 61),
    horse_weight: extractNumber(61, 64),
    raw_line: line
  };
}

export function kkaToDbRecord(record: KKARecord): any {
  return {
    horse_id: record.horse_id,
    race_date: record.race_date,
    track_code: record.track_code,
    race_number: record.race_number,
    finish_position: record.finish_position,
    horse_number: record.horse_number,
    odds: record.odds,
    popularity: record.popularity,
    time: record.time,
    margin: record.margin,
    jockey_name: record.jockey_name,
    weight: record.weight,
    horse_weight: record.horse_weight,
    raw_data: record.raw_line
  };
}
