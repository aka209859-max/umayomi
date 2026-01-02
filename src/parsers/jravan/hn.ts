/**
 * HN Parser - 繁殖馬マスタ (UM_DATA)
 * 
 * JRA-VAN Data Lab. 仕様書 Ver.4.9.0.1
 * レコード種別: HN
 * レコード長: 251バイト
 * 
 * 繁殖馬データ (種牡馬・繁殖牝馬の基本情報)
 */

import iconv from 'iconv-lite';

export interface HNRecord {
  recordType: string;           // レコード種別ID "HN"
  dataClass: string;            // データ区分
  dataDate: string;             // データ作成年月日
  breedRegNum: string;          // 繁殖登録番号 (10桁)
  bloodCode: string;            // 血統登録番号 (10桁)
  horseName: string;            // 馬名 (全角18文字 or 半角36文字)
  horseNameKana: string;        // 馬名半角カナ (半角40文字)
  horseNameEng: string;         // 馬名欧字 (全角40文字 or 半角80文字)
  birthYear: string;            // 生年 (西暦4桁)
  sexCode: string;              // 性別コード
  breedCode: string;            // 品種コード
  hairCode: string;             // 毛色コード
  importClass: string;          // 繁殖馬持込区分
  importYear: string;           // 輸入年
  productionArea: string;       // 産地名 (全角10文字)
  fatherBreedRegNum: string;    // 父馬繁殖登録番号
  motherBreedRegNum: string;    // 母馬繁殖登録番号
}

export class HNParser {
  /**
   * HNファイル (繁殖馬マスタ) をパース
   */
  static parseFile(filePath: string): HNRecord[] {
    const fs = require('fs');
    
    const buffer = fs.readFileSync(filePath);
    const content = iconv.decode(buffer, 'Shift_JIS');
    
    const lines = content.split(/\r?\n/).filter((line: string) => line.length > 0);
    const records: HNRecord[] = [];
    
    for (const line of lines) {
      if (line.substring(0, 2) === 'HN') {
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
  static parseLine(line: string): HNRecord | null {
    try {
      // レコード長チェック
      if (line.length < 248) {
        return null;
      }
      
      return {
        recordType: line.substring(0, 2),                    // 1-2: レコード種別ID
        dataClass: line.substring(2, 3),                     // 3: データ区分
        dataDate: line.substring(3, 11),                     // 4-11: データ作成年月日
        breedRegNum: line.substring(11, 21).trim(),          // 12-21: 繁殖登録番号
        bloodCode: line.substring(29, 39).trim(),            // 30-39: 血統登録番号
        horseName: line.substring(40, 76).trim(),            // 41-76: 馬名 (Shift-JIS 36バイト)
        horseNameKana: line.substring(76, 116).trim(),       // 77-116: 馬名半角カナ (40文字)
        horseNameEng: line.substring(116, 196).trim(),       // 117-196: 馬名欧字 (80文字)
        birthYear: line.substring(196, 200),                 // 197-200: 生年
        sexCode: line.substring(200, 201),                   // 201: 性別コード
        breedCode: line.substring(201, 202),                 // 202: 品種コード
        hairCode: line.substring(202, 204),                  // 203-204: 毛色コード
        importClass: line.substring(204, 205),               // 205: 繁殖馬持込区分
        importYear: line.substring(205, 209),                // 206-209: 輸入年
        productionArea: line.substring(209, 229).trim(),     // 210-229: 産地名 (全角10文字)
        fatherBreedRegNum: line.substring(229, 239).trim(),  // 230-239: 父馬繁殖登録番号
        motherBreedRegNum: line.substring(239, 249).trim()   // 240-249: 母馬繁殖登録番号
      };
    } catch (error) {
      console.error('HN parse error:', error);
      return null;
    }
  }
}

/**
 * ヘルパー関数: ファイルからHNレコード読み込み
 */
export function parseHN(content: string): HNRecord[] {
  const lines = content.split('\n');
  const records: HNRecord[] = [];

  for (const line of lines) {
    const record = HNParser.parseLine(line);
    if (record) {
      records.push(record);
    }
  }

  return records;
}
