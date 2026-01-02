/**
 * JRA-VAN SE Parser（成績データ）
 * 
 * ファイル名: SU*.DAT（例: SU202559.DAT）
 * 識別子: SE7
 * 
 * 最重要データ: 過去レース成績、回収率分析の基礎
 * 
 * データ項目:
 * - レース識別情報（場コード、レース日付、レース番号）
 * - 馬番、着順、人気
 * - タイム、距離、馬体重
 * - 騎手、調教師、馬名
 * - オッズ、賞金
 */

import iconv from 'iconv-lite';

export interface SERecord {
  // レース識別情報
  recordId: string;           // SE7
  raceDate: string;           // YYYYMMDD
  trackCode: string;          // 場コード（01-10）
  raceNumber: number;         // レース番号（1-12）
  
  // 馬基本情報
  horseNumber: number;        // 馬番（1-18）
  horseId: string;            // 馬ID（10桁）
  horseName: string;          // 馬名
  
  // 成績情報
  finishPosition: number;     // 着順（1-18, 0=失格/取消）
  popularity: number;         // 人気（1-18）
  finishTime: number;         // タイム（秒）
  
  // レース条件
  distance: number;           // 距離（m）
  courseType: string;         // コース種別（芝/ダート）
  grade: string;              // グレード（G1/G2/G3/OP/etc）
  
  // 騎手・調教師
  jockeyId: string;           // 騎手ID（5桁）
  jockeyName: string;         // 騎手名
  trainerId: string;          // 調教師ID（5桁）
  trainerName: string;        // 調教師名
  
  // オッズ・賞金
  odds: number;               // 単勝オッズ
  prize: number;              // 賞金（円）
  
  // 馬体重
  horseWeight: number;        // 馬体重（kg）
  weightChange: number;       // 馬体重増減（kg）
  
  // 通過順位
  passing1: number;           // 1コーナー通過順位
  passing2: number;           // 2コーナー通過順位
  passing3: number;           // 3コーナー通過順位
  passing4: number;           // 4コーナー通過順位
  
  // 生データ
  rawData: string;            // 元データ（デバッグ用）
}

/**
 * SE Parser
 * 固定長テキストフォーマット（Shift-JIS）
 * 
 * レコード長: 可変（約600バイト）
 * 識別子: SE7（先頭3文字）
 */
export class SEParser {
  /**
   * 固定長文字列抽出（Shift-JIS対応）
   */
  private static extractField(line: string, start: number, length: number): string {
    return line.substring(start, start + length).trim();
  }

  /**
   * 固定長数値抽出
   */
  private static extractNumber(line: string, start: number, length: number): number {
    const str = this.extractField(line, start, length);
    const num = parseInt(str, 10);
    return isNaN(num) ? 0 : num;
  }

  /**
   * 日付抽出（YYYYMMDD → Date）
   */
  private static extractDate(line: string, start: number): string {
    const dateStr = this.extractField(line, start, 8);
    if (dateStr.length !== 8) return '';
    
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    
    return `${year}-${month}-${day}`;
  }

  /**
   * タイム抽出（MMSSSS → 秒）
   */
  private static extractTime(line: string, start: number, length: number): number {
    const timeStr = this.extractField(line, start, length);
    if (!timeStr || timeStr.length < 4) return 0;
    
    const minutes = parseInt(timeStr.substring(0, 2), 10) || 0;
    const seconds = parseInt(timeStr.substring(2, 4), 10) || 0;
    const decimal = timeStr.length > 4 ? parseInt(timeStr.substring(4), 10) || 0 : 0;
    
    return minutes * 60 + seconds + decimal / 10;
  }

  /**
   * オッズ抽出（整数部3桁 + 小数部1桁 → 浮動小数）
   */
  private static extractOdds(line: string, start: number, length: number): number {
    const oddsStr = this.extractField(line, start, length);
    if (!oddsStr || oddsStr.length < 3) return 0;
    
    const intPart = parseInt(oddsStr.substring(0, 3), 10) || 0;
    const decPart = oddsStr.length > 3 ? parseInt(oddsStr.substring(3), 10) || 0 : 0;
    const divisor = Math.pow(10, Math.min(oddsStr.length - 3, 2));
    
    return intPart + decPart / divisor;
  }

  /**
   * 1行パース（Shift-JIS → UTF-8変換済みを想定）
   */
  static parseLine(line: string): SERecord | null {
    // 空行スキップ
    if (!line || line.trim().length === 0) {
      return null;
    }

    // SE7レコードチェック
    const recordId = this.extractField(line, 0, 3);
    if (recordId !== 'SE7') {
      return null;
    }

    // レース識別情報（SE7の後）
    const raceDate = this.extractDate(line, 3);        // 位置: 3-10 (8桁) YYYYMMDD
    const resultDate = this.extractDate(line, 11);     // 位置: 11-18 (8桁) 成績確定日
    const trackCode = this.extractField(line, 19, 2);  // 位置: 19-20 (2桁)
    const raceNumber = this.extractNumber(line, 25, 2); // 位置: 25-26 (2桁)
    
    // 馬番（位置: 27-29）
    const horseNumber = this.extractNumber(line, 27, 3);
    
    // 馬ID（位置: 30-39）
    const horseId = this.extractField(line, 30, 10);
    
    // 馬名（位置: 40-75, Shift-JIS 36バイト）
    const horseName = this.extractField(line, 40, 36);
    
    // 距離（位置: 76-79）
    const distance = this.extractNumber(line, 76, 4);
    
    // 着順（位置: 80-81）
    const finishPosition = this.extractNumber(line, 80, 2);
    
    // 人気（位置: 82-83）
    const popularity = this.extractNumber(line, 82, 2);
    
    // 騎手ID（位置: 88-92）
    const jockeyId = this.extractField(line, 88, 5);
    
    // 騎手名（位置: 93-104, Shift-JIS 12バイト）
    const jockeyName = this.extractField(line, 93, 12);
    
    // 単勝オッズ（位置: 105-109, 整数部3桁+小数部2桁）
    const odds = this.extractOdds(line, 105, 5);
    
    // 調教師ID（位置: 110-114）
    const trainerId = this.extractField(line, 110, 5);
    
    // 調教師名（位置: 115-154, Shift-JIS 40バイト）
    const trainerName = this.extractField(line, 115, 40);
    
    // 馬体重（位置: 270-272）
    const horseWeight = this.extractNumber(line, 270, 3);
    
    // 馬体重増減（位置: 273-276, 符号付き）
    const weightChangeStr = this.extractField(line, 273, 4);
    const weightChange = weightChangeStr ? parseInt(weightChangeStr, 10) || 0 : 0;
    
    // タイム（位置: 286-292, MMSSSS形式）
    const finishTime = this.extractTime(line, 286, 7);
    
    // 通過順位（位置: 302-317, 各4桁×4）
    const passing1 = this.extractNumber(line, 302, 4);
    const passing2 = this.extractNumber(line, 306, 4);
    const passing3 = this.extractNumber(line, 310, 4);
    const passing4 = this.extractNumber(line, 314, 4);
    
    // 賞金（位置: 340-355, 16桁, 円単位）
    const prize = this.extractNumber(line, 340, 16);
    
    // コース種別・グレードは後続バイトから抽出（暫定で空文字列）
    const courseType = '';
    const grade = '';

    return {
      recordId,
      raceDate,
      trackCode,
      raceNumber,
      horseNumber,
      horseId,
      horseName,
      finishPosition,
      popularity,
      finishTime,
      distance,
      courseType,
      grade,
      jockeyId,
      jockeyName,
      trainerId,
      trainerName,
      odds,
      prize,
      horseWeight,
      weightChange,
      passing1,
      passing2,
      passing3,
      passing4,
      rawData: line
    };
  }

  /**
   * ファイル全体をパース
   */
  static parseFile(buffer: Buffer): SERecord[] {
    const content = iconv.decode(buffer, 'Shift_JIS');
    const lines = content.split('\n');
    const records: SERecord[] = [];

    for (const line of lines) {
      const record = this.parseLine(line);
      if (record) {
        records.push(record);
      }
    }

    return records;
  }
}

/**
 * ヘルパー関数: ファイルからSEレコード読み込み
 */
export function parseSE(content: string): SERecord[] {
  const lines = content.split('\n');
  const records: SERecord[] = [];

  for (const line of lines) {
    const record = SEParser.parseLine(line);
    if (record) {
      records.push(record);
    }
  }

  return records;
}
