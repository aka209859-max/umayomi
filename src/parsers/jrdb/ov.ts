/**
 * OV Parser - オッズ大容量パーサー
 */

export interface OVRecord {
  race_key: string;
  horse_number: number;
  odds: number;
  vote_count: number;
  raw_line: string;
}

export function parseOV(content: string): OVRecord[] {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const records: OVRecord[] = [];
  
  for (const line of lines) {
    try {
      const record = parseOVLine(line);
      if (record) records.push(record);
    } catch (error) {
      console.error('OV parse error:', error);
    }
  }
  
  return records;
}

function parseOVLine(line: string): OVRecord | null {
  if (line.length < 30) return null;
  
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
    vote_count: parseInt(extract(16, 26), 10),
    raw_line: line
  };
}

export function ovToDbRecord(record: OVRecord): any {
  return {
    race_key: record.race_key,
    horse_number: record.horse_number,
    odds: record.odds,
    vote_count: record.vote_count,
    raw_data: record.raw_line
  };
}
