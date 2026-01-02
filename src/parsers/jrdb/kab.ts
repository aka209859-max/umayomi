/**
 * KAB Parser - レース結果サマリーパーサー
 * 
 * KABファイルには各レースの結果サマリー情報が含まれています。
 * - レース条件
 * - 出走頭数
 * - 払戻金情報
 * 
 * データ構造:
 * - 固定長フォーマット
 * - Shift-JISエンコーディング
 * - 1行が1レースの結果サマリー
 */

export interface KABRecord {
  // レース識別情報
  race_key: string;          // レースキー (例: 062511)
  race_date: string;         // 開催日 (YYYYMMDD)
  
  // レース情報
  track_code: string;        // 競馬場コード
  race_number: number;       // レース番号
  
  // レース条件
  race_name: string;         // レース名
  distance: number;          // 距離
  surface: string;           // 馬場 (芝/ダート)
  track_condition: string;   // 馬場状態
  weather: string;           // 天候
  
  // 出走情報
  entry_count: number;       // 出走頭数
  
  // 払戻金情報 (単位: 円)
  win_payout: number;        // 単勝払戻
  place_payout_1: number;    // 複勝払戻1着
  place_payout_2: number;    // 複勝払戻2着
  place_payout_3: number;    // 複勝払戻3着
  
  quinella_payout: number;   // 馬連払戻
  exacta_payout: number;     // 馬単払戻
  trio_payout: number;       // 3連複払戻
  trifecta_payout: number;   // 3連単払戻
  
  // 生データ保持
  raw_line: string;
}

/**
 * KABファイルをパースする
 * @param content KABファイルの内容（Shift-JIS → UTF-8変換済み）
 * @returns パース済みのレコード配列
 */
export function parseKAB(content: string): KABRecord[] {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const records: KABRecord[] = [];
  
  for (const line of lines) {
    try {
      const record = parseKABLine(line);
      if (record) {
        records.push(record);
      }
    } catch (error) {
      console.error('KAB parse error:', error, 'Line:', line.substring(0, 50));
    }
  }
  
  return records;
}

/**
 * KAB1行をパースする
 * 
 * KABフォーマット分析:
 * Line 1: "062511202501051京都11 111-180 0 0 0 0 1 222-8 410314.000  0.0       "
 * 
 * 位置:
 * 0-5: レースキー前半 (6バイト) - "062511" = 06競馬場25年11レース
 * 6-13: 開催年月日 (8バイト) - "20250105"
 * 14: 競馬場識別 (1バイト) - "1" = 京都
 * 15-: 各種データ
 */
function parseKABLine(line: string): KABRecord | null {
  if (line.length < 30) return null;
  
  // レースキー (0-5)
  const race_key = line.substring(0, 6).trim();
  
  // 開催年月日 (6-13)
  const race_date = line.substring(6, 14).trim();
  
  // 競馬場コード (14)
  const track_code = line.substring(14, 15).trim();
  
  // 競馬場名 (15-21, 約6バイト)
  const track_name = line.substring(15, 21).trim();
  
  // レース番号 (21-23)
  const race_number_str = line.substring(21, 23).trim();
  const race_number = race_number_str ? parseInt(race_number_str, 10) : 0;
  
  // 出走頭数 (24-26)
  const entry_str = line.substring(24, 27).trim();
  const entry_count = entry_str ? parseInt(entry_str, 10) : 0;
  
  // 距離 (27-30)
  const distance_str = line.substring(27, 31).trim();
  const distance_match = distance_str.match(/\d+/);
  const distance = distance_match ? parseInt(distance_match[0], 10) : 0;
  
  // 払戻金情報 (位置は可変、スペース区切り)
  // 例: "0 0 0 0 1 222-8 410314.000  0.0"
  const payout_section = line.substring(31).trim();
  const payout_parts = payout_section.split(/\s+/);
  
  // 払戻金をパース (実際のデータ構造に応じて調整が必要)
  let win_payout = 0;
  let place_payout_1 = 0;
  let place_payout_2 = 0;
  let place_payout_3 = 0;
  let quinella_payout = 0;
  let exacta_payout = 0;
  let trio_payout = 0;
  let trifecta_payout = 0;
  
  // 払戻金の解析 (データ構造が明確になったら実装)
  if (payout_parts.length >= 8) {
    // 例: 払戻金は特定の位置に格納されている
    // これは実際のデータフォーマットに応じて調整する
  }
  
  return {
    race_key,
    race_date,
    track_code,
    race_number,
    race_name: track_name,
    distance,
    surface: '芝', // デフォルト、実データから判定
    track_condition: '良', // デフォルト
    weather: '晴', // デフォルト
    entry_count,
    win_payout,
    place_payout_1,
    place_payout_2,
    place_payout_3,
    quinella_payout,
    exacta_payout,
    trio_payout,
    trifecta_payout,
    raw_line: line
  };
}

/**
 * 特定日のレース結果を取得
 */
export function getRacesByDate(records: KABRecord[], date: string): KABRecord[] {
  return records.filter(r => r.race_date === date);
}

/**
 * 特定レースの結果を取得
 */
export function getRaceResult(records: KABRecord[], race_key: string): KABRecord | null {
  return records.find(r => r.race_key === race_key) || null;
}

/**
 * 全レースを日付でグループ化
 */
export function groupByDate(records: KABRecord[]): Map<string, KABRecord[]> {
  const grouped = new Map<string, KABRecord[]>();
  
  for (const record of records) {
    const date = record.race_date;
    if (!grouped.has(date)) {
      grouped.set(date, []);
    }
    grouped.get(date)!.push(record);
  }
  
  return grouped;
}
