/**
 * OW Parser - 単勝オッズパーサー
 * 
 * OWファイルには単勝オッズが含まれています。
 * オッズ補正回収率の計算に必須のデータです。
 */

export interface OWRecord {
  race_key: string;
  horse_number: number;
  odds: number;
  popularity: number;
  raw_line: string;
}

export function parseOW(content: string): OWRecord[] {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const records: OWRecord[] = [];
  
  for (const line of lines) {
    try {
      const record = parseOWLine(line);
      if (record) records.push(record);
    } catch (error) {
      console.error('OW parse error:', error);
    }
  }
  
  return records;
}

function parseOWLine(line: string): OWRecord | null {
  if (line.length < 50) return null;
  
  const extract = (start: number, end: number): string => line.substring(start, end).trim();
  const extractNumber = (start: number, end: number): number => {
    const value = extract(start, end);
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };
  
  return {
    race_key: extract(0, 8),
    horse_number: parseInt(extract(8, 10), 10),
    odds: extractNumber(10, 16) / 10,
    popularity: parseInt(extract(16, 18), 10),
    raw_line: line
  };
}

export function owToDbRecord(record: OWRecord): any {
  return {
    race_key: record.race_key,
    horse_number: record.horse_number,
    odds: record.odds,
    popularity: record.popularity,
    raw_data: record.raw_line
  };
}
