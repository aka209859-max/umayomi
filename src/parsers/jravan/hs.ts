/**
 * HS Parser - 競走馬市場取引価格 (BS_DATA)
 * 
 * JRA-VAN Data Lab. 仕様書 Ver.4.9.0.1
 * レコード種別: HS
 * レコード長: 200バイト
 * 
 * 競走馬市場取引価格データ（セリ市場での取引情報）
 */

import iconv from 'iconv-lite';

export interface HSRecord {
  recordType: string;           // レコード種別ID "HS"
  dataClass: string;            // データ区分
  dataDate: string;             // データ作成年月日
  bloodCode: string;            // 血統登録番号 (10桁)
  fatherBreedRegNum: string;    // 父馬 繁殖登録番号 (10桁)
  motherBreedRegNum: string;    // 母馬 繁殖登録番号 (10桁)
  birthYear: string;            // 生年 (西暦4桁)
  marketCode: string;           // 主催者・市場コード (6桁)
  organizerName: string;        // 主催者名称 (全角20文字)
  marketName: string;           // 市場の名称 (全角40文字)
  marketStartDate: string;      // 市場の開催期間(開始日) (YYYYMMDD)
  marketEndDate: string;        // 市場の開催期間(終了日) (YYYYMMDD)
  horseAge: string;             // 取引時の競走馬の年齢
  tradePrice: string;           // 取引価格 (単位:円)
}

export class HSParser {
  /**
   * HSファイル (競走馬市場取引価格) をパース
   */
  static parseFile(filePath: string): HSRecord[] {
    const fs = require('fs');
    
    const buffer = fs.readFileSync(filePath);
    const content = iconv.decode(buffer, 'Shift_JIS');
    
    const lines = content.split(/\r?\n/).filter((line: string) => line.length > 0);
    const records: HSRecord[] = [];
    
    for (const line of lines) {
      if (line.substring(0, 2) === 'HS') {
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
  static parseLine(line: string): HSRecord | null {
    try {
      // レコード長チェック
      if (line.length < 197) {
        return null;
      }
      
      return {
        recordType: line.substring(0, 2),                    // 1-2: レコード種別ID
        dataClass: line.substring(2, 3),                     // 3: データ区分
        dataDate: line.substring(3, 11),                     // 4-11: データ作成年月日
        bloodCode: line.substring(11, 21).trim(),            // 12-21: 血統登録番号
        fatherBreedRegNum: line.substring(21, 31).trim(),    // 22-31: 父馬 繁殖登録番号
        motherBreedRegNum: line.substring(31, 41).trim(),    // 32-41: 母馬 繁殖登録番号
        birthYear: line.substring(41, 45),                   // 42-45: 生年
        marketCode: line.substring(45, 51).trim(),           // 46-51: 主催者・市場コード
        organizerName: line.substring(51, 91).trim(),        // 52-91: 主催者名称 (全角20文字)
        marketName: line.substring(91, 171).trim(),          // 92-171: 市場の名称 (全角40文字)
        marketStartDate: line.substring(171, 179),           // 172-179: 開催期間(開始日)
        marketEndDate: line.substring(179, 187),             // 180-187: 開催期間(終了日)
        horseAge: line.substring(187, 188),                  // 188: 取引時の競走馬の年齢
        tradePrice: line.substring(188, 198).trim()          // 189-198: 取引価格 (単位:円)
      };
    } catch (error) {
      console.error('HS parse error:', error);
      return null;
    }
  }
}

/**
 * ヘルパー関数: ファイルからHSレコード読み込み
 */
export function parseHS(content: string): HSRecord[] {
  const lines = content.split('\n');
  const records: HSRecord[] = [];

  for (const line of lines) {
    const record = HSParser.parseLine(line);
    if (record) {
      records.push(record);
    }
  }

  return records;
}
