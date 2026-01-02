/**
 * JRA-VAN OW Parser（オッズデータ）
 * 
 * ファイル名: TFJ_OW*.DAT（例: TFJ_OW0.DAT）
 * 識別子: BN1
 * 
 * 重要データ: 馬主情報、オッズ関連データ
 * 
 * データ項目:
 * - 馬主ID
 * - 馬主名
 * - 登録年
 */

import iconv from 'iconv-lite';

export interface OWRecord {
  // レコード識別
  recordId: string;           // BN1 or BN2
  registrationDate: string;   // 登録日 YYYYMMDD
  ownerId: string;            // 馬主ID（6桁）
  
  // 馬主情報
  ownerName: string;          // 馬主名（Shift-JIS 36バイト）
  ownerNameKana: string;      // 馬主名カナ（Shift-JIS 36バイト）
  ownerNameEng: string;       // 馬主名英語（100バイト）
  
  // 服色情報
  colors: string;             // 服色（Shift-JIS 80バイト）
  
  // 登録年
  registrationYear: number;   // YYYY
  
  // 生データ
  rawData: string;
}

/**
 * OW Parser
 * 固定長テキストフォーマット（Shift-JIS）
 * 
 * レコード長: 約450バイト
 * 識別子: BN1/BN2（先頭3文字）
 */
export class OWParser {
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
  static parseLine(line: string): OWRecord | null {
    // 空行スキップ
    if (!line || line.trim().length === 0) {
      return null;
    }

    // BN1/BN2レコードチェック
    const recordId = this.extractField(line, 0, 3);
    if (recordId !== 'BN1' && recordId !== 'BN2') {
      return null;
    }

    // 登録日（位置: 3-10, 8桁）
    const registrationDate = this.extractDate(line, 3);

    // 馬主ID（位置: 11-16, 6桁）
    const ownerId = this.extractField(line, 11, 6);

    // 馬主名（位置: 17-52, Shift-JIS 36バイト）
    const ownerName = this.extractField(line, 17, 36);

    // 馬主名カナ（位置: 53-88, Shift-JIS 36バイト）
    const ownerNameKana = this.extractField(line, 53, 36);

    // 馬主名英語（位置: 89-188, 100バイト）
    const ownerNameEng = this.extractField(line, 89, 100);

    // 服色（位置: 189-268, Shift-JIS 80バイト）
    const colors = this.extractField(line, 189, 80);

    // 登録年（位置: 269-272, 4桁）
    const registrationYear = this.extractNumber(line, 269, 4);

    return {
      recordId,
      registrationDate,
      ownerId,
      ownerName,
      ownerNameKana,
      ownerNameEng,
      colors,
      registrationYear,
      rawData: line
    };
  }

  /**
   * ファイル全体をパース
   */
  static parseFile(buffer: Buffer): OWRecord[] {
    const content = iconv.decode(buffer, 'Shift_JIS');
    const lines = content.split('\n');
    const records: OWRecord[] = [];

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
 * ヘルパー関数: ファイルからOWレコード読み込み
 */
export function parseOW(content: string): OWRecord[] {
  const lines = content.split('\n');
  const records: OWRecord[] = [];

  for (const line of lines) {
    const record = OWParser.parseLine(line);
    if (record) {
      records.push(record);
    }
  }

  return records;
}
