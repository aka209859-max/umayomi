/**
 * BV Parser - 統合情報パーサー
 */

export interface BVRecord {
  race_key: string;
  data_type: string;
  data_value: string;
  raw_line: string;
}

export function parseBV(content: string): BVRecord[] {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const records: BVRecord[] = [];
  
  for (const line of lines) {
    try {
      const record = parseBVLine(line);
      if (record) records.push(record);
    } catch (error) {
      console.error('BV parse error:', error);
    }
  }
  
  return records;
}

function parseBVLine(line: string): BVRecord | null {
  if (line.length < 20) return null;
  
  const extract = (start: number, end: number): string => line.substring(start, end).trim();
  
  return {
    race_key: extract(0, 8),
    data_type: extract(8, 12),
    data_value: extract(12, 100),
    raw_line: line
  };
}

export function bvToDbRecord(record: BVRecord): any {
  return {
    race_key: record.race_key,
    data_type: record.data_type,
    data_value: record.data_value,
    raw_data: record.raw_line
  };
}
