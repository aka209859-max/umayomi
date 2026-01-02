/**
 * JRA-VAN TM Parser（調教データ）
 * 
 * ファイル名: TM*.DAT（例: TM250101.DAT）
 * 識別子: TM7
 * 
 * 重要データ: 調教タイム、調教コース
 * 
 * データ項目:
 * - レース識別情報
 * - 調教日・調教タイム
 * - 調教コース情報
 */

import iconv from 'iconv-lite';

export interface TMRecord {
  // レース識別情報
  recordId: string;           // TM7
  raceDate: string;           // レース日 YYYYMMDD
  dataDate: string;           // データ作成日 YYYYMMDD
  trackCode: string;          // 場コード（01-10）
  raceNumber: number;         // レース番号（1-12）
  horseNumber: number;        // 馬番（1-18）
  
  // 調教データ（最大14回分）
  trainingData: TrainingItem[];
  
  // 生データ
  rawData: string;
}

export interface TrainingItem {
  trainingNumber: number;     // 調教回数（1-14）
  trainingTime: number;       // 調教タイム（ミリ秒）
}

/**
 * TM Parser
 * 固定長テキストフォーマット（ASCII）
 * 
 * レコード長: 可変（調教回数により変動）
 * 識別子: TM7（先頭3文字）
 */
export class TMParser {
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
   * 調教タイム抽出（4桁 → ミリ秒）
   */
  private static extractTrainingTime(line: string, start: number): number {
    const timeStr = this.extractField(line, start, 4);
    if (!timeStr || timeStr.length < 4) return 0;
    
    const seconds = parseInt(timeStr.substring(0, 2), 10) || 0;
    const centiseconds = parseInt(timeStr.substring(2, 4), 10) || 0;
    
    return seconds * 1000 + centiseconds * 10;
  }

  /**
   * 1行パース
   */
  static parseLine(line: string): TMRecord | null {
    // 空行スキップ
    if (!line || line.trim().length === 0) {
      return null;
    }

    // TM7レコードチェック
    const recordId = this.extractField(line, 0, 3);
    if (recordId !== 'TM7') {
      return null;
    }

    // レース識別情報
    const raceDate = this.extractDate(line, 3);        // 位置: 3-10 (8桁)
    const dataDate = this.extractDate(line, 11);       // 位置: 11-18 (8桁)
    const trackCode = this.extractField(line, 19, 2);  // 位置: 19-20 (2桁)
    const raceNumber = this.extractNumber(line, 21, 2); // 位置: 21-22 (2桁)
    const horseNumber = this.extractNumber(line, 25, 2); // 位置: 25-26 (2桁)

    // 調教データ抽出（位置: 27以降、7桁×最大14回）
    const trainingData: TrainingItem[] = [];
    let pos = 27;
    
    for (let i = 1; i <= 14; i++) {
      if (pos + 7 > line.length) break;
      
      const trainingNumberStr = this.extractField(line, pos, 2);
      const trainingTime = this.extractTrainingTime(line, pos + 2);
      
      if (trainingNumberStr && trainingTime > 0) {
        trainingData.push({
          trainingNumber: parseInt(trainingNumberStr, 10) || 0,
          trainingTime
        });
      }
      
      pos += 7;
    }

    return {
      recordId,
      raceDate,
      dataDate,
      trackCode,
      raceNumber,
      horseNumber,
      trainingData,
      rawData: line
    };
  }

  /**
   * ファイル全体をパース
   */
  static parseFile(buffer: Buffer): TMRecord[] {
    const content = iconv.decode(buffer, 'Shift_JIS');
    const lines = content.split('\n');
    const records: TMRecord[] = [];

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
 * ヘルパー関数: ファイルからTMレコード読み込み
 */
export function parseTM(content: string): TMRecord[] {
  const lines = content.split('\n');
  const records: TMRecord[] = [];

  for (const line of lines) {
    const record = TMParser.parseLine(line);
    if (record) {
      records.push(record);
    }
  }

  return records;
}
