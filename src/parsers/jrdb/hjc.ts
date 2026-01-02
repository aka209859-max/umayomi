/**
 * HJC Parser - 払戻金パーサー
 */

export interface HJCRecord {
  race_key: string;
  ticket_type: string;
  horse_combination: string;
  payout: number;
  popularity: number;
  raw_line: string;
}

export function parseHJC(content: string): HJCRecord[] {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const records: HJCRecord[] = [];
  
  for (const line of lines) {
    try {
      const record = parseHJCLine(line);
      if (record) records.push(record);
    } catch (error) {
      console.error('HJC parse error:', error);
    }
  }
  
  return records;
}

function parseHJCLine(line: string): HJCRecord | null {
  if (line.length < 50) return null;
  
  const extract = (start: number, end: number): string => line.substring(start, end).trim();
  const extractNumber = (start: number, end: number): number => {
    const value = extract(start, end);
    const num = parseInt(value, 10);
    return isNaN(num) ? 0 : num;
  };
  
  return {
    race_key: extract(0, 8),
    ticket_type: extract(8, 10),
    horse_combination: extract(10, 16),
    payout: extractNumber(16, 23),
    popularity: extractNumber(23, 25),
    raw_line: line
  };
}

export function hjcToDbRecord(record: HJCRecord): any {
  return {
    race_key: record.race_key,
    ticket_type: record.ticket_type,
    horse_combination: record.horse_combination,
    payout: record.payout,
    popularity: record.popularity,
    raw_data: record.raw_line
  };
}
