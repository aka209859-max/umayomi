/**
 * BR Parser - 生産者マスタ (BR_DATA)
 * 
 * JRA-VAN Data Lab. 仕様書 Ver.4.9.0.1
 * レコード種別: BR
 * レコード長: 545バイト
 * 
 * 生産者データ（生産者の基本情報と成績）
 */

import iconv from 'iconv-lite';

export interface BRRecord {
  recordType: string;           // レコード種別ID "BR"
  dataClass: string;            // データ区分
  dataDate: string;             // データ作成年月日
  breederCode: string;          // 生産者コード (8桁)
  breederName: string;          // 生産者名(法人格有) (全角36文字 or 半角72文字)
  breederNameNoEntity: string;  // 生産者名(法人格無) (全角36文字 or 半角72文字)
  breederNameKana: string;      // 生産者名半角カナ (半角72文字)
  breederNameEng: string;       // 生産者名欧字 (全角84文字 or 半角168文字)
  address: string;              // 生産者住所自治省名 (全角10文字)
  currentYearStats: YearStats;  // 本年成績情報
  totalStats: YearStats;        // 累計成績情報
}

export interface YearStats {
  year: string;                 // 設定年
  prizeMoney: string;           // 本賞金合計 (単位:百円)
  additionalPrize: string;      // 付加賞金合計 (単位:百円)
  winCounts: string[];          // 着回数 (1着～5着、着外)
}

export class BRParser {
  /**
   * BRファイル (生産者マスタ) をパース
   */
  static parseFile(filePath: string): BRRecord[] {
    const fs = require('fs');
    
    const buffer = fs.readFileSync(filePath);
    const content = iconv.decode(buffer, 'Shift_JIS');
    
    const lines = content.split(/\r?\n/).filter((line: string) => line.length > 0);
    const records: BRRecord[] = [];
    
    for (const line of lines) {
      if (line.substring(0, 2) === 'BR') {
        const record = this.parseLine(line);
        if (record) {
          records.push(record);
        }
      }
    }
    
    return records;
  }
  
  /**
   * 年度別成績情報をパース
   */
  private static parseYearStats(line: string, startPos: number): YearStats {
    const year = line.substring(startPos, startPos + 4);
    const prizeMoney = line.substring(startPos + 4, startPos + 14).trim();
    const additionalPrize = line.substring(startPos + 14, startPos + 24).trim();
    
    // 着回数 (1着～5着、着外の6項目)
    const winCounts: string[] = [];
    for (let i = 0; i < 6; i++) {
      const pos = startPos + 24 + (i * 6);
      winCounts.push(line.substring(pos, pos + 6).trim());
    }
    
    return {
      year,
      prizeMoney,
      additionalPrize,
      winCounts
    };
  }
  
  /**
   * 1行をパース
   */
  static parseLine(line: string): BRRecord | null {
    try {
      // レコード長チェック
      if (line.length < 542) {
        return null;
      }
      
      // 本年・累計成績情報 (各60バイト × 2)
      const currentYearStats = this.parseYearStats(line, 423);
      const totalStats = this.parseYearStats(line, 483);
      
      return {
        recordType: line.substring(0, 2),                    // 1-2: レコード種別ID
        dataClass: line.substring(2, 3),                     // 3: データ区分
        dataDate: line.substring(3, 11),                     // 4-11: データ作成年月日
        breederCode: line.substring(11, 19).trim(),          // 12-19: 生産者コード
        breederName: line.substring(19, 91).trim(),          // 20-91: 生産者名(法人格有)
        breederNameNoEntity: line.substring(91, 163).trim(), // 92-163: 生産者名(法人格無)
        breederNameKana: line.substring(163, 235).trim(),    // 164-235: 生産者名半角カナ
        breederNameEng: line.substring(235, 403).trim(),     // 236-403: 生産者名欧字
        address: line.substring(403, 423).trim(),            // 404-423: 住所自治省名
        currentYearStats: currentYearStats,                  // 424-483: 本年成績
        totalStats: totalStats                               // 484-543: 累計成績
      };
    } catch (error) {
      console.error('BR parse error:', error);
      return null;
    }
  }
}

/**
 * ヘルパー関数: ファイルからBRレコード読み込み
 */
export function parseBR(content: string): BRRecord[] {
  const lines = content.split('\n');
  const records: BRRecord[] = [];

  for (const line of lines) {
    const record = BRParser.parseLine(line);
    if (record) {
      records.push(record);
    }
  }

  return records;
}
