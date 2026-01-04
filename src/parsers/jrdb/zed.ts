/**
 * JRDB ZED Parser - Core Fields Extraction
 * 
 * 馬別レース成績データパーサー
 * Horse Race Performance Data Parser
 */

export interface ZEDRecord {
  // Basic identifiers
  track_code: string;           // 場コード [0-2]
  race_number: string;          // レース番号 [2-4]
  day_of_week: string;          // 曜日 [4-6]
  month: string;                // 月 [6-8]
  day: string;                  // 日 [8-10]
  race_id: string;              // レースID [10-18]
  race_date: string;            // 開催年月日 [18-26]
  
  // Race info
  race_name_raw: string;        // レース名+条件 [26-76]
  race_class: string;           // クラス [86-88]
  age_limit: string;            // 年齢制限 [88-89]
  
  // Horse/Performance data (extracted from variable positions)
  horse_data_raw: string;       // 馬データ [140-200]
  numeric_data_raw: string;     // 数値データ [200-300]
  
  // Extracted fields (from raw data)
  horse_id: string;             // 馬ID (extracted)
  horse_name: string;           // 馬名 (extracted)
  
  // Full raw data for future parsing
  raw_data: string;
}

export class ZEDParser {
  /**
   * Parse one line of ZED file (Shift-JIS decoded)
   */
  static parseLine(line: string): ZEDRecord | null {
    try {
      // Minimum length check
      if (line.length < 200) {
        return null;
      }

      // Basic fields (fixed positions)
      const track_code = line.substring(0, 2).trim();
      const race_number = line.substring(2, 4).trim();
      const day_of_week = line.substring(4, 6).trim();
      const month = line.substring(6, 8).trim();
      const day = line.substring(8, 10).trim();
      const race_id = line.substring(10, 18).trim();
      const race_date = line.substring(18, 26).trim();
      const race_name_raw = line.substring(26, 76).trim();
      const race_class = line.substring(86, 88).trim();
      const age_limit = line.substring(88, 89).trim();

      // Variable position data
      const horse_data_raw = line.length > 200 ? line.substring(140, 200).trim() : '';
      const numeric_data_raw = line.length > 300 ? line.substring(200, 300).trim() : '';

      // Extract horse ID and name from horse_data_raw
      // Format: "馬名+馬ID" e.g. "アポロオオジ003341385"
      let horse_id = '';
      let horse_name = '';
      
      // Horse ID is typically 9-10 digits at the end
      const idMatch = horse_data_raw.match(/(\d{9,10})$/);
      if (idMatch) {
        horse_id = idMatch[1];
        // Horse name is everything before the ID
        horse_name = horse_data_raw.substring(0, horse_data_raw.length - horse_id.length).trim();
      }

      return {
        track_code,
        race_number,
        day_of_week,
        month,
        day,
        race_id,
        race_date,
        race_name_raw,
        race_class,
        age_limit,
        horse_data_raw,
        numeric_data_raw,
        horse_id,
        horse_name,
        raw_data: line,
      };
    } catch (error) {
      console.error('Parse error:', error);
      return null;
    }
  }

  /**
   * Parse entire ZED file buffer (Shift-JIS encoded)
   */
  static parseFile(buffer: Buffer): ZEDRecord[] {
    const iconv = require('iconv-lite');
    
    try {
      const decoded = iconv.decode(buffer, 'shift_jis');
      const lines = decoded.split(/\r?\n/).filter(l => l.trim().length > 0);
      
      const records: ZEDRecord[] = [];
      for (const line of lines) {
        const record = this.parseLine(line);
        if (record) {
          records.push(record);
        }
      }
      
      return records;
    } catch (error) {
      console.error('File parse error:', error);
      return [];
    }
  }
}
