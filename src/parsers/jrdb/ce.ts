/**
 * CE Parser - レースコメントパーサー
 */

export interface CERecord {
  race_key: string;
  comment_type: string;
  comment_text: string;
  raw_line: string;
}

export function parseCE(content: string): CERecord[] {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const records: CERecord[] = [];
  
  for (const line of lines) {
    try {
      const record = parseCELine(line);
      if (record) records.push(record);
    } catch (error) {
      console.error('CE parse error:', error);
    }
  }
  
  return records;
}

function parseCELine(line: string): CERecord | null {
  if (line.length < 20) return null;
  
  const extract = (start: number, end: number): string => line.substring(start, end).trim();
  
  return {
    race_key: extract(0, 8),
    comment_type: extract(8, 10),
    comment_text: extract(10, 200),
    raw_line: line
  };
}

export function ceToDbRecord(record: CERecord): any {
  return {
    race_key: record.race_key,
    comment_type: record.comment_type,
    comment_text: record.comment_text,
    raw_data: record.raw_line
  };
}
