/**
 * JRA-VAN SCHD Parser（開催スケジュール）
 * 
 * ファイル名: SCHD*.DAT（例: SCHD2025.DAT, SCHD2026.DAT）
 * 識別子: YS3/YS1
 * 
 * 重要データ: レース名、開催日、グレード、距離
 * 
 * データ項目:
 * - レース識別情報
 * - レース名
 * - グレード
 * - 距離
 */

import iconv from 'iconv-lite';

export interface SCHDRecord {
  // レコード識別
  recordId: string;           // YS3 or YS1
  dataDate: string;           // データ作成日 YYYYMMDD
  raceDate: string;           // レース日 YYYYMMDD
  trackCode: string;          // 場コード（01-10）
  raceNumber: number;         // レース番号（1-12）
  
  // レース情報
  raceName: string;           // レース名（Shift-JIS 90バイト）
  raceNameShort: string;      // レース名略称（Shift-JIS 30バイト）
  grade: string;              // グレード（3桁）
  distance: number;           // 距離（m）
  
  // 生データ
  rawData: string;
}

/**
 * SCHD Parser
 * 固定長テキストフォーマット（Shift-JIS）
 * 
 * レコード長: 可変
 * 識別子: YS3/YS1（先頭3文字）
 */
export class SCHDParser {
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
   * 1行パース
   */
  static parseLine(line: string): SCHDRecord | null {
    // 空行スキップ
    if (!line || line.trim().length === 0) {
      return null;
    }

    // YS3/YS1レコードチェック
    const recordId = this.extractField(line, 0, 3);
    if (recordId !== 'YS3' && recordId !== 'YS1') {
      return null;
    }

    // データ作成日（位置: 3-10, 8桁）
    const dataDate = this.extractDate(line, 3);

    // レース日（位置: 11-18, 8桁）
    const raceDate = this.extractDate(line, 11);

    // 場コード（位置: 19-20, 2桁）
    const trackCode = this.extractField(line, 19, 2);

    // レース番号（位置: 21-22, 2桁）
    const raceNumber = this.extractNumber(line, 21, 2);

    // グレード（位置: 23-25, 3桁）
    const grade = this.extractField(line, 23, 3);

    // 距離（位置: 26-28, 3桁）
    const distance = this.extractNumber(line, 26, 3) * 100; // 百の位→メートル

    // レース名（位置: 29-118, Shift-JIS 90バイト）
    const raceName = this.extractField(line, 29, 90);

    // レース名略称（位置: 119-148, Shift-JIS 30バイト）
    const raceNameShort = this.extractField(line, 119, 30);

    return {
      recordId,
      dataDate,
      raceDate,
      trackCode,
      raceNumber,
      raceName,
      raceNameShort,
      grade,
      distance,
      rawData: line
    };
  }

  /**
   * ファイル全体をパース
   */
  static parseFile(buffer: Buffer): SCHDRecord[] {
    const content = iconv.decode(buffer, 'Shift_JIS');
    const lines = content.split('\n');
    const records: SCHDRecord[] = [];

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
 * ヘルパー関数: ファイルからSCHDレコード読み込み
 */
export function parseSCHD(content: string): SCHDRecord[] {
  const lines = content.split('\n');
  const records: SCHDRecord[] = [];

  for (const line of lines) {
    const record = SCHDParser.parseLine(line);
    if (record) {
      records.push(record);
    }
  }

  return records;
}
