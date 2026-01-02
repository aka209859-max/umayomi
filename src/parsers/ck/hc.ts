/**
 * HC (Horse Competition) Parser - JRA-VAN CK_DATA
 * 出走予定馬の情報
 * 
 * Format: Fixed-length (48 bytes)
 */

export interface HCRecord {
  // レース識別情報
  track_code: string;           // 競馬場コード (1-2)
  race_date: string;            // レース日付 YYMMDD (3-10)
  race_number: string;          // レース番号 (11-12)
  
  // 馬情報
  horse_number: string;         // 馬番 (13-14)
  horse_id: string;             // 血統登録番号 (15-22)
  
  // タイム関連（推定）
  time_1: string;               // タイム1 (23-25)
  time_2: string;               // タイム2 (26-28)
  time_3: string;               // タイム3 (29-31)
  time_4: string;               // タイム4 (32-34)
  time_5: string;               // タイム5 (35-37)
  time_6: string;               // タイム6 (38-40)
  time_7: string;               // タイム7 (41-43)
  time_8: string;               // タイム8 (44-46)
  
  // Raw data
  raw: string;
}

export class HCParser {
  parse(line: string): HCRecord | null {
    if (!line || line.length < 46) {
      return null;
    }

    try {
      // Extract date code (format: YYDDMM + venue/kai code)
      const dateCode = line.substring(2, 10);
      
      return {
        track_code: line.substring(0, 2).trim(),
        race_date: this.parseDate(dateCode),
        race_number: line.substring(10, 12).trim(),
        horse_number: line.substring(12, 14).trim(),
        horse_id: line.substring(14, 22).trim(),
        time_1: line.substring(22, 25).trim(),
        time_2: line.substring(25, 28).trim(),
        time_3: line.substring(28, 31).trim(),
        time_4: line.substring(31, 34).trim(),
        time_5: line.substring(34, 37).trim(),
        time_6: line.substring(37, 40).trim(),
        time_7: line.substring(40, 43).trim(),
        time_8: line.substring(43, 46).trim(),
        raw: line
      };
    } catch (error) {
      console.error('Failed to parse HC line:', error);
      return null;
    }
  }

  parseFile(content: string): HCRecord[] {
    const lines = content.split(/\r?\n/);
    const records: HCRecord[] = [];

    for (const line of lines) {
      if (line.trim()) {
        const record = this.parse(line);
        if (record) {
          records.push(record);
        }
      }
    }

    return records;
  }

  // 日付変換: Use filename date, the field might be race schedule code
  // Filename: HC020250102.DAT → Track 02, Date 2025-01-02
  private parseDate(dateCode: string): string {
    // For now, return the raw code
    // TODO: Map this properly with race schedule
    return dateCode;
  }
  
  // Parse date from filename: HC020250102.DAT → 2025-01-02
  parseFilenameDate(filename: string): string {
    // HC + track(2) + year(3) + month(2) + day(2)
    // HC020250102 → 02 (track) + 025 (year 2025) + 01 + 02
    const match = filename.match(/HC\d{2}(\d{3})(\d{2})(\d{2})/);
    if (match) {
      const year = '20' + match[1].substring(1); // 025 → 2025
      const month = match[2];
      const day = match[3];
      return `${year}-${month}-${day}`;
    }
    return '';
  }

  // 競馬場名取得
  getTrackName(code: string): string {
    const tracks: Record<string, string> = {
      '01': '札幌',
      '02': '函館',
      '03': '福島',
      '04': '新潟',
      '05': '東京',
      '06': '中山',
      '07': '中京',
      '08': '京都',
      '09': '阪神',
      '10': '小倉'
    };
    return tracks[code] || code;
  }

  // レースをグループ化
  groupByRace(records: HCRecord[]): Map<string, HCRecord[]> {
    const raceMap = new Map<string, HCRecord[]>();

    for (const record of records) {
      const key = `${record.track_code}-${record.race_date}-${record.race_number}`;
      
      if (!raceMap.has(key)) {
        raceMap.set(key, []);
      }
      
      raceMap.get(key)!.push(record);
    }

    return raceMap;
  }
}
