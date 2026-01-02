/**
 * SRB Parser - 成績追加パーサー
 */

export interface SRBRecord {
  horse_id: string;
  race_date: string;
  track_code: string;
  race_number: number;
  additional_info: string;
  raw_line: string;
}

export function parseSRB(content: string): SRBRecord[] {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const records: SRBRecord[] = [];
  
  for (const line of lines) {
    try {
      const record = parseSRBLine(line);
      if (record) records.push(record);
    } catch (error) {
      console.error('SRB parse error:', error);
    }
  }
  
  return records;
}

function parseSRBLine(line: string): SRBRecord | null {
  if (line.length < 50) return null;
  
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
    additional_info: extract(22, 100),
    raw_line: line
  };
}

export function srbToDbRecord(record: SRBRecord): any {
  return {
    horse_id: record.horse_id,
    race_date: record.race_date,
    track_code: record.track_code,
    race_number: record.race_number,
    additional_info: record.additional_info,
    raw_data: record.raw_line
  };
}
