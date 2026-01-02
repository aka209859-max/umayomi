/**
 * JRA-VAN JG Parser（騎手情報）
 * 
 * ファイル名: JG*.DAT（例: JG250105.DAT）
 * 識別子: JG1
 * 
 * 重要データ: 騎手名、馬ID、オッズ
 * 
 * データ項目:
 * - レース識別情報
 * - 騎手名
 * - 馬ID
 * - オッズ
 */

import iconv from 'iconv-lite';

export interface JGRecord {
  // レース識別情報
  recordId: string;           // JG1
  raceDate: string;           // レース日 YYYYMMDD
  dataDate: string;           // データ作成日 YYYYMMDD
  trackCode: string;          // 場コード（01-10）
  raceNumber: number;         // レース番号（1-12）
  horseNumber: number;        // 馬番（1-18）
  horseId: string;            // 馬ID（10桁）
  
  // 騎手情報
  jockeyName: string;         // 騎手名（Shift-JIS 36バイト）
  odds: number;               // オッズ（5桁）
  
  // 生データ
  rawData: string;
}

/**
 * JG Parser
 * 固定長テキストフォーマット（Shift-JIS）
 * 
 * レコード長: 約80バイト
 * 識別子: JG1（先頭3文字）
 */
export class JGParser {
  /**
   * 固定長文字列抽出
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
   * オッズ抽出（5桁 → 浮動小数）
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
   * 1行パース
   */
  static parseLine(line: string): JGRecord | null {
    // 空行スキップ
    if (!line || line.trim().length === 0) {
      return null;
    }

    // JG1レコードチェック
    const recordId = this.extractField(line, 0, 3);
    if (recordId !== 'JG1') {
      return null;
    }

    // レース識別情報
    const raceDate = this.extractDate(line, 3);        // 位置: 3-10 (8桁)
    const dataDate = this.extractDate(line, 11);       // 位置: 11-18 (8桁)
    const trackCode = this.extractField(line, 19, 2);  // 位置: 19-20 (2桁)
    const raceNumber = this.extractNumber(line, 21, 2); // 位置: 21-22 (2桁)
    const horseNumber = this.extractNumber(line, 25, 2); // 位置: 25-26 (2桁)
    const horseId = this.extractField(line, 27, 10);    // 位置: 27-36 (10桁)

    // 騎手名（位置: 37-72, Shift-JIS 36バイト）
    const jockeyName = this.extractField(line, 37, 36);

    // オッズ（位置: 73-77, 5桁）
    const odds = this.extractOdds(line, 73, 5);

    return {
      recordId,
      raceDate,
      dataDate,
      trackCode,
      raceNumber,
      horseNumber,
      horseId,
      jockeyName,
      odds,
      rawData: line
    };
  }

  /**
   * ファイル全体をパース
   */
  static parseFile(buffer: Buffer): JGRecord[] {
    const content = iconv.decode(buffer, 'Shift_JIS');
    const lines = content.split('\n');
    const records: JGRecord[] = [];

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
 * ヘルパー関数: ファイルからJGレコード読み込み
 */
export function parseJG(content: string): JGRecord[] {
  const lines = content.split('\n');
  const records: JGRecord[] = [];

  for (const line of lines) {
    const record = JGParser.parseLine(line);
    if (record) {
      records.push(record);
    }
  }

  return records;
}
