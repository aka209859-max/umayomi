/**
 * ZED Parser - 確定・払戻情報パーサー
 * 
 * ZEDファイルにはレース確定後の払戻金額・配当情報が含まれています。
 * 回収率分析の根幹となる最重要データです。
 * 
 * データ構造:
 * - 固定長フォーマット
 * - Shift-JISエンコーディング
 * - 各行が1レースの払戻情報を表す
 */

export interface ZEDRecord {
  // レース識別情報
  race_key: string;          // レースキー (例: 06251101)
  race_date: string;         // 開催日 (YYYYMMDD)
  track_code: string;        // 競馬場コード
  race_number: number;       // レース番号
  
  // 単勝
  win_horse: number;         // 単勝馬番
  win_payout: number;        // 単勝配当
  win_popularity: number;    // 単勝人気
  
  // 複勝
  place_horse_1: number;     // 複勝1着馬番
  place_payout_1: number;    // 複勝1着配当
  place_horse_2: number;     // 複勝2着馬番
  place_payout_2: number;    // 複勝2着配当
  place_horse_3: number;     // 複勝3着馬番
  place_payout_3: number;    // 複勝3着配当
  
  // 枠連
  bracket_quinella_horses: string; // 枠連組合せ (例: 1-3)
  bracket_quinella_payout: number; // 枠連配当
  bracket_quinella_popularity: number; // 枠連人気
  
  // 馬連
  quinella_horses: string;   // 馬連組合せ (例: 01-05)
  quinella_payout: number;   // 馬連配当
  quinella_popularity: number; // 馬連人気
  
  // 馬単
  exacta_horses: string;     // 馬単組合せ (例: 01→05)
  exacta_payout: number;     // 馬単配当
  exacta_popularity: number; // 馬単人気
  
  // ワイド
  wide_horses_1: string;     // ワイド組合せ1
  wide_payout_1: number;     // ワイド配当1
  wide_popularity_1: number; // ワイド人気1
  wide_horses_2: string;     // ワイド組合せ2
  wide_payout_2: number;     // ワイド配当2
  wide_popularity_2: number; // ワイド人気2
  wide_horses_3: string;     // ワイド組合せ3
  wide_payout_3: number;     // ワイド配当3
  wide_popularity_3: number; // ワイド人気3
  
  // 3連複
  trio_horses: string;       // 3連複組合せ (例: 01-05-08)
  trio_payout: number;       // 3連複配当
  trio_popularity: number;   // 3連複人気
  
  // 3連単
  trifecta_horses: string;   // 3連単組合せ (例: 01→05→08)
  trifecta_payout: number;   // 3連単配当
  trifecta_popularity: number; // 3連単人気
  
  // 売上・払戻率
  total_sales: number;       // 総売上
  refund_rate: number;       // 払戻率
  
  // 生データ保持
  raw_line: string;
}

/**
 * ZEDファイルをパースする
 * @param content ZEDファイルの内容（Shift-JIS → UTF-8変換済み）
 * @returns パース済みのレコード配列
 */
export function parseZED(content: string): ZEDRecord[] {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const records: ZEDRecord[] = [];
  
  for (const line of lines) {
    try {
      const record = parseZEDLine(line);
      if (record) {
        records.push(record);
      }
    } catch (error) {
      console.error('ZED parse error:', error, 'Line:', line.substring(0, 50));
    }
  }
  
  return records;
}

/**
 * ZED1行をパースする
 * @param line 1行のデータ
 * @returns パース済みレコード or null
 */
function parseZEDLine(line: string): ZEDRecord | null {
  if (line.length < 300) return null;
  
  // データ抽出ヘルパー関数
  const extract = (start: number, end: number): string => {
    return line.substring(start, end).trim();
  };
  
  const extractNumber = (start: number, end: number): number => {
    const value = extract(start, end);
    const num = parseInt(value, 10);
    return isNaN(num) ? 0 : num;
  };
  
  try {
    const record: ZEDRecord = {
      // レース識別情報 (0-8)
      race_key: extract(0, 8),
      
      // 開催日 (8-16)
      race_date: extract(8, 16),
      
      // 競馬場コード (16-18)
      track_code: extract(16, 18),
      
      // レース番号 (18-20)
      race_number: extractNumber(18, 20),
      
      // 単勝 (20-22: 馬番, 22-28: 配当, 28-30: 人気)
      win_horse: extractNumber(20, 22),
      win_payout: extractNumber(22, 28),
      win_popularity: extractNumber(28, 30),
      
      // 複勝 (30-48)
      place_horse_1: extractNumber(30, 32),
      place_payout_1: extractNumber(32, 38),
      place_horse_2: extractNumber(38, 40),
      place_payout_2: extractNumber(40, 46),
      place_horse_3: extractNumber(46, 48),
      place_payout_3: extractNumber(48, 54),
      
      // 枠連 (54-68)
      bracket_quinella_horses: extract(54, 59),
      bracket_quinella_payout: extractNumber(59, 65),
      bracket_quinella_popularity: extractNumber(65, 68),
      
      // 馬連 (68-82)
      quinella_horses: extract(68, 73),
      quinella_payout: extractNumber(73, 80),
      quinella_popularity: extractNumber(80, 82),
      
      // 馬単 (82-96)
      exacta_horses: extract(82, 87),
      exacta_payout: extractNumber(87, 94),
      exacta_popularity: extractNumber(94, 96),
      
      // ワイド (96-132)
      wide_horses_1: extract(96, 101),
      wide_payout_1: extractNumber(101, 107),
      wide_popularity_1: extractNumber(107, 109),
      wide_horses_2: extract(109, 114),
      wide_payout_2: extractNumber(114, 120),
      wide_popularity_2: extractNumber(120, 122),
      wide_horses_3: extract(122, 127),
      wide_payout_3: extractNumber(127, 133),
      wide_popularity_3: extractNumber(133, 135),
      
      // 3連複 (135-150)
      trio_horses: extract(135, 144),
      trio_payout: extractNumber(144, 151),
      trio_popularity: extractNumber(151, 154),
      
      // 3連単 (154-170)
      trifecta_horses: extract(154, 163),
      trifecta_payout: extractNumber(163, 171),
      trifecta_popularity: extractNumber(171, 174),
      
      // 売上・払戻率 (174-184)
      total_sales: extractNumber(174, 180),
      refund_rate: extractNumber(180, 184),
      
      // 生データ保持
      raw_line: line
    };
    
    return record;
  } catch (error) {
    console.error('ZEDLine parse error:', error);
    return null;
  }
}

/**
 * ZEDレコードをデータベース格納用に変換
 * @param record ZEDレコード
 * @returns DB格納用オブジェクト
 */
export function zedToDbRecord(record: ZEDRecord): any {
  return {
    race_key: record.race_key,
    race_date: record.race_date,
    track_code: record.track_code,
    race_number: record.race_number,
    win_horse: record.win_horse,
    win_payout: record.win_payout,
    win_popularity: record.win_popularity,
    place_horse_1: record.place_horse_1,
    place_payout_1: record.place_payout_1,
    place_horse_2: record.place_horse_2,
    place_payout_2: record.place_payout_2,
    place_horse_3: record.place_horse_3,
    place_payout_3: record.place_payout_3,
    bracket_quinella_horses: record.bracket_quinella_horses,
    bracket_quinella_payout: record.bracket_quinella_payout,
    bracket_quinella_popularity: record.bracket_quinella_popularity,
    quinella_horses: record.quinella_horses,
    quinella_payout: record.quinella_payout,
    quinella_popularity: record.quinella_popularity,
    exacta_horses: record.exacta_horses,
    exacta_payout: record.exacta_payout,
    exacta_popularity: record.exacta_popularity,
    wide_horses_1: record.wide_horses_1,
    wide_payout_1: record.wide_payout_1,
    wide_popularity_1: record.wide_popularity_1,
    wide_horses_2: record.wide_horses_2,
    wide_payout_2: record.wide_payout_2,
    wide_popularity_2: record.wide_popularity_2,
    wide_horses_3: record.wide_horses_3,
    wide_payout_3: record.wide_payout_3,
    wide_popularity_3: record.wide_popularity_3,
    trio_horses: record.trio_horses,
    trio_payout: record.trio_payout,
    trio_popularity: record.trio_popularity,
    trifecta_horses: record.trifecta_horses,
    trifecta_payout: record.trifecta_payout,
    trifecta_popularity: record.trifecta_popularity,
    total_sales: record.total_sales,
    refund_rate: record.refund_rate,
    raw_data: record.raw_line
  };
}
