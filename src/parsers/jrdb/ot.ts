/**
 * OT Parser - 3連単オッズパーサー
 */

export interface OTRecord {
  race_key: string;
  horse_combination: string;
  odds: number;
  popularity: number;
  raw_line: string;
}

export function parseOT(content: string): OTRecord[] {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const records: OTRecord[] = [];
  
  for (const line of lines) {
    try {
      const record = parseOTLine(line);
      if (record) records.push(record);
    } catch (error) {
      console.error('OT parse error:', error);
    }
  }
  
  return records;
}

function parseOTLine(line: string): OTRecord | null {
  if (line.length < 50) return null;
  
  const extract = (start: number, end: number): string => line.substring(start, end).trim();
  const extractNumber = (start: number, end: number): number => {
    const value = extract(start, end);
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };
  
  return {
    race_key: extract(0, 8),
    horse_combination: extract(8, 14),
    odds: extractNumber(14, 22) / 10,
    popularity: parseInt(extract(22, 26), 10),
    raw_line: line
  };
}

export function otToDbRecord(record: OTRecord): any {
  return {
    race_key: record.race_key,
    horse_combination: record.horse_combination,
    odds: record.odds,
    popularity: record.popularity,
    raw_data: record.raw_line
  };
}
