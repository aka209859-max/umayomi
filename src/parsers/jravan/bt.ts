/**
 * BT Parser - 系統情報 (KT_DATA)
 * 
 * JRA-VAN Data Lab. 仕様書 Ver.4.9.0.1
 * レコード種別: BT
 * レコード長: 6889バイト
 * 
 * 系統情報データ（血統系統の解説情報）
 */

import iconv from 'iconv-lite';

export interface BTRecord {
  recordType: string;           // レコード種別ID "BT"
  dataClass: string;            // データ区分
  dataDate: string;             // データ作成年月日
  breedRegNum: string;          // 繁殖登録番号 (10桁)
  lineageId: string;            // 系統ID (30文字)
  lineageName: string;          // 系統名 (全角18文字)
  lineageDescription: string;   // 系統説明 (テキスト文、6800文字)
}

export class BTParser {
  /**
   * BTファイル (系統情報) をパース
   */
  static parseFile(filePath: string): BTRecord[] {
    const fs = require('fs');
    
    const buffer = fs.readFileSync(filePath);
    const content = iconv.decode(buffer, 'Shift_JIS');
    
    const lines = content.split(/\r?\n/).filter((line: string) => line.length > 0);
    const records: BTRecord[] = [];
    
    for (const line of lines) {
      if (line.substring(0, 2) === 'BT') {
        const record = this.parseLine(line);
        if (record) {
          records.push(record);
        }
      }
    }
    
    return records;
  }
  
  /**
   * 1行をパース
   */
  static parseLine(line: string): BTRecord | null {
    try {
      // レコード長チェック
      if (line.length < 87) {
        return null;
      }
      
      return {
        recordType: line.substring(0, 2),                    // 1-2: レコード種別ID
        dataClass: line.substring(2, 3),                     // 3: データ区分
        dataDate: line.substring(3, 11),                     // 4-11: データ作成年月日
        breedRegNum: line.substring(11, 21).trim(),          // 12-21: 繁殖登録番号
        lineageId: line.substring(21, 51).trim(),            // 22-51: 系統ID (30文字)
        lineageName: line.substring(51, 87).trim(),          // 52-87: 系統名 (全角18文字)
        lineageDescription: line.substring(87).trim()        // 88-6887: 系統説明 (テキスト文)
      };
    } catch (error) {
      console.error('BT parse error:', error);
      return null;
    }
  }
}

/**
 * ヘルパー関数: ファイルからBTレコード読み込み
 */
export function parseBT(content: string): BTRecord[] {
  const lines = content.split('\n');
  const records: BTRecord[] = [];

  for (const line of lines) {
    const record = BTParser.parseLine(line);
    if (record) {
      records.push(record);
    }
  }

  return records;
}
