/**
 * BAC Parser - 馬基本情報パーサー
 * 
 * BACファイルには各レースに出走する馬の基本情報が含まれています。
 * - 血統情報 (父、母、母父)
 * - 生産者情報
 * - 馬主情報
 * - 調教師情報
 * 
 * データ構造:
 * - 固定長フォーマット
 * - Shift-JISエンコーディング
 */

export interface BACRecord {
  // レース識別情報
  race_key: string;          // レースキー (例: 06251101)
  horse_number: number;      // 馬番
  
  // 開催情報
  year: string;              // 開催年 (YYYY)
  month_day: string;         // 開催月日 (MMDD)
  track_code: string;        // 競馬場コード (01-10)
  race_number: number;       // レース番号
  
  // 予想情報  
  estimated_time: string;    // 予想タイム
  grade: string;             // グレード
  
  // 賞金情報
  prize_1st: number;         // 1着賞金 (万円)
  prize_2nd: number;         // 2着賞金 (万円)
  prize_3rd: number;         // 3着賞金 (万円)
  prize_4th: number;         // 4着賞金 (万円)
  prize_5th: number;         // 5着賞金 (万円)
  
  // レース条件
  race_condition: string;    // レース条件 (馬齢、クラスなど)
  
  // 生データ保持
  raw_line: string;
}

/**
 * BACファイルをパースする
 * @param content BACファイルの内容（Shift-JIS → UTF-8変換済み）
 * @returns パース済みのレコード配列
 */
export function parseBAC(content: string): BACRecord[] {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const records: BACRecord[] = [];
  
  for (const line of lines) {
    try {
      const record = parseBACLine(line);
      if (record) {
        records.push(record);
      }
    } catch (error) {
      console.error('BAC parse error:', error, 'Line:', line.substring(0, 50));
    }
  }
  
  return records;
}

/**
 * BAC1行をパースする
 * 
 * フォーマット（位置は0始まり）:
 * 0-7: レースキー (8バイト) - 例: "06251101"
 * 8-9: 馬番 (2バイト)
 * 10-17: 開催年月日 (8バイト) - YYYYMMDD
 * 18-19: 競馬場コード (2バイト)
 * 20-21: レース番号 (2バイト)
 * ...
 */
function parseBACLine(line: string): BACRecord | null {
  if (line.length < 50) return null;
  
  // レースキー (0-7)
  const race_key = line.substring(0, 8).trim();
  
  // 馬番 (8-9)
  const horse_number_str = line.substring(8, 10).trim();
  const horse_number = horse_number_str ? parseInt(horse_number_str, 10) : 0;
  
  // 開催年月日 (10-17) YYYYMMDD
  const date_str = line.substring(10, 18).trim();
  const year = date_str.substring(0, 4);
  const month_day = date_str.substring(4, 8);
  
  // 競馬場コード (18-19)
  const track_code = line.substring(18, 20).trim();
  
  // レース番号 (20-21)
  const race_number_str = line.substring(20, 22).trim();
  const race_number = race_number_str ? parseInt(race_number_str, 10) : 0;
  
  // 予想タイム (22-25) - 4バイト
  const estimated_time = line.substring(22, 26).trim();
  
  // グレード (26-27)
  const grade = line.substring(26, 28).trim();
  
  // 賞金情報 (40-79, 各8バイト × 5)
  const prize_1st_str = line.substring(40, 48).trim();
  const prize_2nd_str = line.substring(48, 56).trim();
  const prize_3rd_str = line.substring(56, 64).trim();
  const prize_4th_str = line.substring(64, 72).trim();
  const prize_5th_str = line.substring(72, 80).trim();
  
  const prize_1st = prize_1st_str ? parseInt(prize_1st_str, 10) : 0;
  const prize_2nd = prize_2nd_str ? parseInt(prize_2nd_str, 10) : 0;
  const prize_3rd = prize_3rd_str ? parseInt(prize_3rd_str, 10) : 0;
  const prize_4th = prize_4th_str ? parseInt(prize_4th_str, 10) : 0;
  const prize_5th = prize_5th_str ? parseInt(prize_5th_str, 10) : 0;
  
  // レース条件 (後半部分に含まれる)
  const race_condition = line.length > 100 ? line.substring(100, 120).trim() : '';
  
  return {
    race_key,
    horse_number,
    year,
    month_day,
    track_code,
    race_number,
    estimated_time,
    grade,
    prize_1st,
    prize_2nd,
    prize_3rd,
    prize_4th,
    prize_5th,
    race_condition,
    raw_line: line
  };
}

/**
 * BACレコードをレース別にグループ化
 */
export function groupBACByRace(records: BACRecord[]): Map<string, BACRecord[]> {
  const grouped = new Map<string, BACRecord[]>();
  
  for (const record of records) {
    const key = record.race_key;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(record);
  }
  
  return grouped;
}

/**
 * 特定レースのBAC情報を取得
 */
export function getRaceBAC(records: BACRecord[], race_key: string): BACRecord[] {
  return records.filter(r => r.race_key === race_key);
}
