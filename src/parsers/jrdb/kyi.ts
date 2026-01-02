/**
 * KYI Parser - 馬別出走情報パーサー
 * 
 * KYIファイルには各レースの出走馬の詳細情報が含まれています。
 * これはJRDBデータの中で最も重要なファイルの1つです。
 * 
 * データ構造:
 * - 固定長フォーマット（各行約1000バイト）
 * - Shift-JISエンコーディング
 * - 各行が1頭の馬の出走情報を表す
 */

export interface KYIRecord {
  // レース識別情報
  race_key: string;          // レースキー (例: 06251101)
  horse_id: string;          // 馬ID (血統登録番号)
  
  // 馬基本情報
  horse_name: string;        // 馬名
  age: number;               // 馬齢
  sex: string;               // 性別 (牡/牝/騙)
  
  // レース情報
  race_date: string;         // 開催日 (YYYYMMDD)
  track_code: string;        // 競馬場コード
  race_number: number;       // レース番号
  distance: number;          // 距離 (メートル)
  surface: string;           // 馬場 (芝/ダート)
  track_condition: string;   // 馬場状態 (良/稍重/重/不良)
  
  // 成績情報
  finish_position: number | null;  // 着順
  odds: number;              // 単勝オッズ
  popularity: number;        // 人気順位
  
  // タイム情報
  race_time: string | null;  // 走破タイム
  margin: string | null;     // 着差
  passing_order: string;     // 通過順位
  final_3f: number | null;   // 上がり3F
  
  // 負担重量
  weight: number;            // 斤量
  weight_diff: number;       // 斤量差
  
  // 馬体重
  horse_weight: number | null;     // 馬体重
  horse_weight_diff: number | null; // 馬体重増減
  
  // 騎手・調教師
  jockey_code: string;       // 騎手コード
  jockey_name: string;       // 騎手名
  trainer_code: string;      // 調教師コード
  trainer_name: string;      // 調教師名
  
  // オーナー
  owner_name: string;        // 馬主名
  
  // 過去走データ
  previous_races: {
    date: string;
    track: string;
    distance: number;
    finish: number;
  }[];
  
  // 指数系データ (後で活用)
  id_m: number | null;       // IDM (総合指数)
  jockey_index: number | null; // 騎手指数
  info_index: number | null;   // 情報指数
  
  // 生データ保持
  raw_line: string;
}

/**
 * KYIファイルをパースする
 * @param content KYIファイルの内容（Shift-JIS → UTF-8変換済み）
 * @returns パース済みのレコード配列
 */
export function parseKYI(content: string): KYIRecord[] {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const records: KYIRecord[] = [];
  
  for (const line of lines) {
    try {
      const record = parseKYILine(line);
      if (record) {
        records.push(record);
      }
    } catch (error) {
      console.error('KYI parse error:', error, 'Line:', line.substring(0, 50));
    }
  }
  
  return records;
}

/**
 * KYI1行をパースする
 */
function parseKYILine(line: string): KYIRecord | null {
  if (line.length < 100) return null;
  
  // レースキー (位置: 1-8)
  const race_key = line.substring(0, 8).trim();
  
  // 馬番 (位置: 9-10)
  const horse_number = line.substring(8, 10).trim();
  
  // 馬ID (位置: 11-18)
  const horse_id = line.substring(10, 18).trim();
  
  // 馬名 (位置: 19-54, 36バイト)
  const horse_name = line.substring(18, 54).trim();
  
  // IDM (位置: 55-59, 5バイト) - 小数点付き
  const idm_str = line.substring(54, 59).trim();
  const id_m = idm_str ? parseFloat(idm_str) : null;
  
  // 騎手指数 (位置: 60-64)
  const jockey_index_str = line.substring(59, 64).trim();
  const jockey_index = jockey_index_str ? parseFloat(jockey_index_str) : null;
  
  // 情報指数 (位置: 65-69)
  const info_index_str = line.substring(64, 69).trim();
  const info_index = info_index_str ? parseFloat(info_index_str) : null;
  
  // オッズ (位置: 85-91, 7バイト)
  const odds_str = line.substring(84, 91).trim();
  const odds = odds_str ? parseFloat(odds_str) : 0;
  
  // 人気順 (位置: 100-102)
  const popularity_str = line.substring(99, 102).trim();
  const popularity = popularity_str ? parseInt(popularity_str, 10) : 0;
  
  // 着順 (位置: 104-105)
  const finish_str = line.substring(103, 105).trim();
  const finish_position = finish_str ? parseInt(finish_str, 10) : null;
  
  // 競馬場コード (位置: 158-160)
  const track_code = line.substring(157, 160).trim();
  
  // レース番号 (位置: 161-162)
  const race_number_str = line.substring(160, 162).trim();
  const race_number = race_number_str ? parseInt(race_number_str, 10) : 0;
  
  // 距離 (位置: 245-248)
  const distance_str = line.substring(244, 248).trim();
  const distance = distance_str ? parseInt(distance_str, 10) : 0;
  
  // 馬場 (位置: 249) 1=芝, 2=ダート
  const surface_code = line.substring(248, 249).trim();
  const surface = surface_code === '1' ? '芝' : surface_code === '2' ? 'ダート' : '障害';
  
  // 騎手名 (位置: 283-294, 12バイト)
  const jockey_name = line.substring(282, 294).trim();
  
  // 騎手コード (位置: 295-299)
  const jockey_code = line.substring(294, 299).trim();
  
  // 調教師名 (位置: 300-311, 12バイト)
  const trainer_name = line.substring(299, 311).trim();
  
  // 調教師コード (位置: 312-316)
  const trainer_code = line.substring(311, 316).trim();
  
  // 馬主名 (位置: 317-356, 40バイト)
  const owner_name = line.substring(316, 356).trim();
  
  // 馬体重 (位置: 531-533)
  const horse_weight_str = line.substring(530, 533).trim();
  const horse_weight = horse_weight_str ? parseInt(horse_weight_str, 10) : null;
  
  // 馬体重増減 (位置: 534-536)
  const horse_weight_diff_str = line.substring(533, 536).trim();
  const horse_weight_diff = horse_weight_diff_str ? parseInt(horse_weight_diff_str, 10) : null;
  
  // 開催年月日 (位置: 639-646, YYYYMMDD)
  const race_date = line.substring(638, 646).trim();
  
  // 斤量 (位置: 703-705, 3バイト) - 例: 570 = 57.0kg
  const weight_str = line.substring(702, 705).trim();
  const weight = weight_str ? parseInt(weight_str, 10) / 10 : 0;
  
  // 性別年齢 (位置: 706-707) - 例: "牡3"
  const sex_age = line.substring(705, 707).trim();
  const sex = sex_age.charAt(0);
  const age = sex_age.charAt(1) ? parseInt(sex_age.charAt(1), 10) : 0;
  
  // 過去走データを解析 (位置: 357-638, 複数のレース情報)
  const previous_races = parsePreviousRaces(line.substring(356, 638));
  
  return {
    race_key,
    horse_id,
    horse_name,
    age,
    sex,
    race_date,
    track_code,
    race_number,
    distance,
    surface,
    track_condition: '良', // デフォルト
    finish_position,
    odds,
    popularity,
    race_time: null,
    margin: null,
    passing_order: '',
    final_3f: null,
    weight,
    weight_diff: 0,
    horse_weight,
    horse_weight_diff,
    jockey_code,
    jockey_name,
    trainer_code,
    trainer_name,
    owner_name,
    previous_races,
    id_m,
    jockey_index,
    info_index,
    raw_line: line
  };
}

/**
 * 過去走データをパースする
 * 過去5走分のデータが含まれている可能性がある
 */
function parsePreviousRaces(previous_section: string): any[] {
  const races = [];
  
  // 過去走データは複雑なので、後で詳細実装
  // 今は空配列を返す
  return races;
}

/**
 * KYIファイルからレース別にグループ化
 */
export function groupByRace(records: KYIRecord[]): Map<string, KYIRecord[]> {
  const grouped = new Map<string, KYIRecord[]>();
  
  for (const record of records) {
    const key = record.race_key;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(record);
  }
  
  return grouped;
}

/**
 * 特定の馬IDの全レース情報を取得
 */
export function getHorseHistory(records: KYIRecord[], horse_id: string): KYIRecord[] {
  return records
    .filter(r => r.horse_id === horse_id)
    .sort((a, b) => b.race_date.localeCompare(a.race_date)); // 新しい順
}
