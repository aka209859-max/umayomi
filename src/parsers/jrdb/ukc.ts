/**
 * UKC Parser - 調教情報パーサー
 * 
 * UKCファイルには各馬の調教情報（調教時計・コース・追い切りタイム等）が含まれています。
 * 調教評価は回収率分析において重要なファクターです。
 * 
 * データ構造:
 * - 固定長フォーマット
 * - Shift-JISエンコーディング
 * - 各行が1頭の馬の調教情報を表す
 */

export interface UKCRecord {
  // レース識別情報
  race_key: string;          // レースキー
  horse_id: string;          // 血統登録番号
  
  // 馬基本情報
  horse_name: string;        // 馬名
  
  // 調教情報
  training_date: string;     // 調教日 (YYYYMMDD)
  training_course: string;   // 調教コース (坂路/ウッド/芝/ダート等)
  training_type: string;     // 調教タイプ (強/馬なり/併せ等)
  training_time: string | null; // 調教時計 (例: 12.3-11.8-12.5)
  
  // 追い切りタイム
  last_1f: number | null;    // ラスト1F (秒)
  last_2f: number | null;    // ラスト2F (秒)
  last_3f: number | null;    // ラスト3F (秒)
  last_4f: number | null;    // ラスト4F (秒)
  last_5f: number | null;    // ラスト5F (秒)
  
  // 調教評価
  training_evaluation: string; // 調教評価 (A/B/C等)
  training_rank: number | null; // 調教ランク (同厩内順位)
  
  // 追い切り状態
  chasing_method: string;    // 追い切り方法 (単走/併走)
  chasing_position: string;  // 追い切り位置 (内/外)
  
  // 生データ保持
  raw_line: string;
}

/**
 * UKCファイルをパースする
 * @param content UKCファイルの内容（Shift-JIS → UTF-8変換済み）
 * @returns パース済みのレコード配列
 */
export function parseUKC(content: string): UKCRecord[] {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const records: UKCRecord[] = [];
  
  for (const line of lines) {
    try {
      const record = parseUKCLine(line);
      if (record) {
        records.push(record);
      }
    } catch (error) {
      console.error('UKC parse error:', error, 'Line:', line.substring(0, 50));
    }
  }
  
  return records;
}

/**
 * UKC1行をパースする
 * @param line 1行のデータ
 * @returns パース済みレコード or null
 */
function parseUKCLine(line: string): UKCRecord | null {
  if (line.length < 200) return null;
  
  // データ抽出ヘルパー関数
  const extract = (start: number, end: number): string => {
    return line.substring(start, end).trim();
  };
  
  const extractNumber = (start: number, end: number): number | null => {
    const value = extract(start, end);
    const num = parseInt(value, 10);
    return isNaN(num) || num === 0 ? null : num;
  };
  
  const extractFloat = (start: number, end: number): number | null => {
    const value = extract(start, end);
    const num = parseFloat(value);
    return isNaN(num) || num === 0 ? null : num;
  };
  
  try {
    const record: UKCRecord = {
      // レース識別情報 (0-8)
      horse_id: extract(0, 8),
      
      // 馬名 (8-44)
      horse_name: extract(8, 44),
      
      // 調教日 (44-52)
      training_date: extract(44, 52),
      
      // 調教コース (52-62)
      training_course: extract(52, 62),
      
      // 調教タイプ (62-72)
      training_type: extract(62, 72),
      
      // 調教時計 (72-92)
      training_time: extract(72, 92) || null,
      
      // 追い切りタイム (92-102: ラスト5F)
      last_5f: extractFloat(92, 97),
      last_4f: extractFloat(97, 102),
      last_3f: extractFloat(102, 107),
      last_2f: extractFloat(107, 112),
      last_1f: extractFloat(112, 117),
      
      // 調教評価 (117-118)
      training_evaluation: extract(117, 118),
      
      // 調教ランク (118-120)
      training_rank: extractNumber(118, 120),
      
      // 追い切り方法 (120-125)
      chasing_method: extract(120, 125),
      
      // 追い切り位置 (125-130)
      chasing_position: extract(125, 130),
      
      // レースキー (130-138)
      race_key: extract(130, 138),
      
      // 生データ保持
      raw_line: line
    };
    
    return record;
  } catch (error) {
    console.error('UKCLine parse error:', error);
    return null;
  }
}

/**
 * UKCレコードをデータベース格納用に変換
 * @param record UKCレコード
 * @returns DB格納用オブジェクト
 */
export function ukc ToDbRecord(record: UKCRecord): any {
  return {
    horse_id: record.horse_id,
    race_key: record.race_key,
    horse_name: record.horse_name,
    training_date: record.training_date,
    training_course: record.training_course,
    training_type: record.training_type,
    training_time: record.training_time,
    last_5f: record.last_5f,
    last_4f: record.last_4f,
    last_3f: record.last_3f,
    last_2f: record.last_2f,
    last_1f: record.last_1f,
    training_evaluation: record.training_evaluation,
    training_rank: record.training_rank,
    chasing_method: record.chasing_method,
    chasing_position: record.chasing_position,
    raw_data: record.raw_line
  };
}
