/**
 * OU Parser - 馬連オッズパーサー
 */

export interface OURecord {
  race_key: string;
  horse_combination: string;
  odds: number;
  popularity: number;
  raw_line: string;
}

export function parseOU(content: string): OURecord[] {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const records: OURecord[] = [];
  
  for (const line of lines) {
    try {
      const record = parseOULine(line);
      if (record) records.push(record);
    } catch (error) {
      console.error('OU parse error:', error);
    }
  }
  
  return records;
}

function parseOULine(line: string): OURecord | null {
  if (line.length < 50) return null;
  
  const extract = (start: number, end: number): string => line.substring(start, end).trim();
  const extractNumber = (start: number, end: number): number => {
    const value = extract(start, end);
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };
  
  return {
    race_key: extract(0, 8),
    horse_combination: extract(8, 13),
    odds: extractNumber(13, 20) / 10,
    popularity: parseInt(extract(20, 23), 10),
    raw_line: line
  };
}

export function ouToDbRecord(record: OURecord): any {
  return {
    race_key: record.race_key,
    horse_combination: record.horse_combination,
    odds: record.odds,
    popularity: record.popularity,
    raw_data: record.raw_line
  };
}
