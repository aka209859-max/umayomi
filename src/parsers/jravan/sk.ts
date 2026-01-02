/**
 * SK Parser - 産駒マスタ (UM_DATA)
 * 
 * JRA-VAN Data Lab. 仕様書 Ver.4.9.0.1
 * レコード種別: SK
 * レコード長: 208バイト
 * 
 * 産駒データ (馬名未決定の登録馬データ)
 */

export interface SKRecord {
  recordType: string;           // レコード種別ID "SK"
  dataClass: string;            // データ区分
  dataDate: string;             // データ作成年月日
  bloodCode: string;            // 血統登録番号 (10桁)
  birthDate: string;            // 生年月日 (YYYYMMDD)
  sexCode: string;              // 性別コード
  breedCode: string;            // 品種コード
  hairCode: string;             // 毛色コード
  importClass: string;          // 産駒持込区分
  importYear: string;           // 輸入年
  breederCode: string;          // 生産者コード
  productionArea: string;       // 産地名
  pedigree: string[];           // 3代血統 繁殖登録番号 (14頭分)
}

export class SKParser {
  /**
   * SKファイル (産駒マスタ) をパース
   */
  static parseFile(filePath: string): SKRecord[] {
    const fs = require('fs');
    const iconv = require('iconv-lite');
    
    const buffer = fs.readFileSync(filePath);
    const content = iconv.decode(buffer, 'Shift_JIS');
    
    const lines = content.split(/\r?\n/).filter((line: string) => line.length > 0);
    const records: SKRecord[] = [];
    
    for (const line of lines) {
      if (line.substring(0, 2) === 'SK') {
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
  static parseLine(line: string): SKRecord | null {
    try {
      // レコード長チェック
      if (line.length < 206) {
        return null;
      }
      
      // 3代血統 (14頭分: 父･母･父父･父母･母父･母母･父父父･父父母･父母父･父母母･母父父･母父母･母母父･母母母)
      const pedigree: string[] = [];
      for (let i = 0; i < 14; i++) {
        const start = 67 + (i * 10);
        pedigree.push(line.substring(start, start + 10).trim());
      }
      
      return {
        recordType: line.substring(0, 2),                    // 1-2: レコード種別ID
        dataClass: line.substring(2, 3),                     // 3: データ区分
        dataDate: line.substring(3, 11),                     // 4-11: データ作成年月日
        bloodCode: line.substring(11, 21).trim(),            // 12-21: 血統登録番号
        birthDate: line.substring(21, 29),                   // 22-29: 生年月日
        sexCode: line.substring(29, 30),                     // 30: 性別コード
        breedCode: line.substring(30, 31),                   // 31: 品種コード
        hairCode: line.substring(31, 33),                    // 32-33: 毛色コード
        importClass: line.substring(33, 34),                 // 34: 産駒持込区分
        importYear: line.substring(34, 38),                  // 35-38: 輸入年
        breederCode: line.substring(38, 46).trim(),          // 39-46: 生産者コード
        productionArea: line.substring(46, 66).trim(),       // 47-66: 産地名 (全角10文字)
        pedigree: pedigree                                   // 67-206: 3代血統 (14頭分)
      };
    } catch (error) {
      console.error('SK parse error:', error);
      return null;
    }
  }
}
