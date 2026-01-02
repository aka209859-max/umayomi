/**
 * ZKB Parser - 前日売上パーサー
 */

export interface ZKBRecord {
  race_key: string;
  total_sales: number;
  win_sales: number;
  place_sales: number;
  quinella_sales: number;
  exacta_sales: number;
  trio_sales: number;
  trifecta_sales: number;
  raw_line: string;
}

export function parseZKB(content: string): ZKBRecord[] {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const records: ZKBRecord[] = [];
  
  for (const line of lines) {
    try {
      const record = parseZKBLine(line);
      if (record) records.push(record);
    } catch (error) {
      console.error('ZKB parse error:', error);
    }
  }
  
  return records;
}

function parseZKBLine(line: string): ZKBRecord | null {
  if (line.length < 80) return null;
  
  const extract = (start: number, end: number): string => line.substring(start, end).trim();
  const extractNumber = (start: number, end: number): number => {
    const value = extract(start, end);
    const num = parseInt(value, 10);
    return isNaN(num) ? 0 : num;
  };
  
  return {
    race_key: extract(0, 8),
    total_sales: extractNumber(8, 18),
    win_sales: extractNumber(18, 28),
    place_sales: extractNumber(28, 38),
    quinella_sales: extractNumber(38, 48),
    exacta_sales: extractNumber(48, 58),
    trio_sales: extractNumber(58, 68),
    trifecta_sales: extractNumber(68, 78),
    raw_line: line
  };
}

export function zkbToDbRecord(record: ZKBRecord): any {
  return {
    race_key: record.race_key,
    total_sales: record.total_sales,
    win_sales: record.win_sales,
    place_sales: record.place_sales,
    quinella_sales: record.quinella_sales,
    exacta_sales: record.exacta_sales,
    trio_sales: record.trio_sales,
    trifecta_sales: record.trifecta_sales,
    raw_data: record.raw_line
  };
}
