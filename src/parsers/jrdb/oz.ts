/**
 * OZ Parser - 馬場状態パーサー
 */

export interface OZRecord {
  race_key: string;
  track_condition: string;
  turf_condition: string;
  dirt_condition: string;
  weather: string;
  raw_line: string;
}

export function parseOZ(content: string): OZRecord[] {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const records: OZRecord[] = [];
  
  for (const line of lines) {
    try {
      const record = parseOZLine(line);
      if (record) records.push(record);
    } catch (error) {
      console.error('OZ parse error:', error);
    }
  }
  
  return records;
}

function parseOZLine(line: string): OZRecord | null {
  if (line.length < 30) return null;
  
  const extract = (start: number, end: number): string => line.substring(start, end).trim();
  
  return {
    race_key: extract(0, 8),
    track_condition: extract(8, 10),
    turf_condition: extract(10, 11),
    dirt_condition: extract(11, 12),
    weather: extract(12, 14),
    raw_line: line
  };
}

export function ozToDbRecord(record: OZRecord): any {
  return {
    race_key: record.race_key,
    track_condition: record.track_condition,
    turf_condition: record.turf_condition,
    dirt_condition: record.dirt_condition,
    weather: record.weather,
    raw_data: record.raw_line
  };
}
