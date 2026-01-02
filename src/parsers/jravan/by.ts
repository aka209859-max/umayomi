/**
 * JRA-VAN BY/HY Parser（馬基本情報）
 * 
 * ファイル名: BY*.DAT（例: BY20240.DAT）
 * 識別子: HY1
 * 
 * 重要データ: 馬名、馬ID、コメント
 * 
 * データ項目:
 * - 馬ID
 * - 馬名
 * - コメント
 */

import iconv from 'iconv-lite';

export interface BYRecord {
  // レコード識別
  recordId: string;           // HY1
  raceDate: string;           // レース日 YYYYMMDD
  horseId: string;            // 馬ID（10桁）
  
  // 馬基本情報
  horseName: string;          // 馬名（Shift-JIS 36バイト）
  comment: string;            // コメント（Shift-JIS 80バイト）
  
  // 生データ
  rawData: string;
}

/**
 * BY/HY Parser
 * 固定長テキストフォーマット（Shift-JIS）
 * 
 * レコード長: 約130バイト
 * 識別子: HY1（先頭3文字）
 */
export class BYParser {
  /**
   * 固定長文字列抽出
   */
  private static extractField(line: string, start: number, length: number): string {
    return line.substring(start, start + length).trim();
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
  static parseLine(line: string): BYRecord | null {
    // 空行スキップ
    if (!line || line.trim().length === 0) {
      return null;
    }

    // HY1レコードチェック
    const recordId = this.extractField(line, 0, 3);
    if (recordId !== 'HY1') {
      return null;
    }

    // レース日（位置: 3-10, 8桁）
    const raceDate = this.extractDate(line, 3);

    // 馬ID（位置: 11-20, 10桁）
    const horseId = this.extractField(line, 11, 10);

    // 馬名（位置: 21-56, Shift-JIS 36バイト）
    const horseName = this.extractField(line, 21, 36);

    // コメント（位置: 57-136, Shift-JIS 80バイト）
    const comment = this.extractField(line, 57, 80);

    return {
      recordId,
      raceDate,
      horseId,
      horseName,
      comment,
      rawData: line
    };
  }

  /**
   * ファイル全体をパース
   */
  static parseFile(buffer: Buffer): BYRecord[] {
    const content = iconv.decode(buffer, 'Shift_JIS');
    const lines = content.split('\n');
    const records: BYRecord[] = [];

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
 * ヘルパー関数: ファイルからBYレコード読み込み
 */
export function parseBY(content: string): BYRecord[] {
  const lines = content.split('\n');
  const records: BYRecord[] = [];

  for (const line of lines) {
    const record = BYParser.parseLine(line);
    if (record) {
      records.push(record);
    }
  }

  return records;
}
