/**
 * CYB Parser - 血統情報パーサー
 * 
 * CYBファイルには各馬の血統情報（父・母・母父等）が含まれています。
 * 血統ファクターは回収率分析において極めて重要です。
 * 
 * データ構造:
 * - 固定長フォーマット
 * - Shift-JISエンコーディング
 * - 各行が1頭の馬の血統情報を表す
 */

export interface CYBRecord {
  // レース識別情報
  race_key: string;          // レースキー
  horse_id: string;          // 血統登録番号
  
  // 馬基本情報
  horse_name: string;        // 馬名
  
  // 血統情報
  sire_id: string;           // 父馬ID
  sire_name: string;         // 父馬名
  dam_id: string;            // 母馬ID
  dam_name: string;          // 母馬名
  damsire_id: string;        // 母父ID
  damsire_name: string;      // 母父名
  
  // 父系統
  sire_line: string;         // 父系統 (サンデーサイレンス系等)
  
  // 母父系統
  damsire_line: string;      // 母父系統
  
  // 血統評価
  pedigree_evaluation: string; // 血統評価 (A/B/C等)
  turf_aptitude: string;     // 芝適性
  dirt_aptitude: string;     // ダート適性
  distance_aptitude: string; // 距離適性
  
  // 生産者情報
  breeder_name: string;      // 生産者名
  breeder_location: string;  // 生産地
  
  // 生データ保持
  raw_line: string;
}

/**
 * CYBファイルをパースする
 * @param content CYBファイルの内容（Shift-JIS → UTF-8変換済み）
 * @returns パース済みのレコード配列
 */
export function parseCYB(content: string): CYBRecord[] {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const records: CYBRecord[] = [];
  
  for (const line of lines) {
    try {
      const record = parseCYBLine(line);
      if (record) {
        records.push(record);
      }
    } catch (error) {
      console.error('CYB parse error:', error, 'Line:', line.substring(0, 50));
    }
  }
  
  return records;
}

/**
 * CYB1行をパースする
 * @param line 1行のデータ
 * @returns パース済みレコード or null
 */
function parseCYBLine(line: string): CYBRecord | null {
  if (line.length < 200) return null;
  
  // データ抽出ヘルパー関数
  const extract = (start: number, end: number): string => {
    return line.substring(start, end).trim();
  };
  
  try {
    const record: CYBRecord = {
      // レース識別情報 (0-8)
      race_key: extract(0, 8),
      
      // 血統登録番号 (8-18)
      horse_id: extract(8, 18),
      
      // 馬名 (18-54)
      horse_name: extract(18, 54),
      
      // 父馬ID (54-64)
      sire_id: extract(54, 64),
      
      // 父馬名 (64-100)
      sire_name: extract(64, 100),
      
      // 母馬ID (100-110)
      dam_id: extract(100, 110),
      
      // 母馬名 (110-146)
      dam_name: extract(110, 146),
      
      // 母父ID (146-156)
      damsire_id: extract(146, 156),
      
      // 母父名 (156-192)
      damsire_name: extract(156, 192),
      
      // 父系統 (192-222)
      sire_line: extract(192, 222),
      
      // 母父系統 (222-252)
      damsire_line: extract(222, 252),
      
      // 血統評価 (252-253)
      pedigree_evaluation: extract(252, 253),
      
      // 芝適性 (253-254)
      turf_aptitude: extract(253, 254),
      
      // ダート適性 (254-255)
      dirt_aptitude: extract(254, 255),
      
      // 距離適性 (255-256)
      distance_aptitude: extract(255, 256),
      
      // 生産者名 (256-296)
      breeder_name: extract(256, 296),
      
      // 生産地 (296-316)
      breeder_location: extract(296, 316),
      
      // 生データ保持
      raw_line: line
    };
    
    return record;
  } catch (error) {
    console.error('CYBLine parse error:', error);
    return null;
  }
}

/**
 * CYBレコードをデータベース格納用に変換
 * @param record CYBレコード
 * @returns DB格納用オブジェクト
 */
export function cybToDbRecord(record: CYBRecord): any {
  return {
    race_key: record.race_key,
    horse_id: record.horse_id,
    horse_name: record.horse_name,
    sire_id: record.sire_id,
    sire_name: record.sire_name,
    dam_id: record.dam_id,
    dam_name: record.dam_name,
    damsire_id: record.damsire_id,
    damsire_name: record.damsire_name,
    sire_line: record.sire_line,
    damsire_line: record.damsire_line,
    pedigree_evaluation: record.pedigree_evaluation,
    turf_aptitude: record.turf_aptitude,
    dirt_aptitude: record.dirt_aptitude,
    distance_aptitude: record.distance_aptitude,
    breeder_name: record.breeder_name,
    breeder_location: record.breeder_location,
    raw_data: record.raw_line
  };
}
