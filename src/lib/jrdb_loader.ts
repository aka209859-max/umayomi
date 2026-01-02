/**
 * JRDB Data Loader
 * 
 * E:\UMAYOMI\downloads_weeklyからJRDBデータを読み込むユーティリティ
 * 
 * 主な機能:
 * - Shift-JIS → UTF-8変換
 * - ファイル種別の自動判定
 * - 日付範囲指定での一括読み込み
 */

import * as fs from 'fs';
import * as path from 'path';
import iconv from 'iconv-lite';
import { parseKYI, KYIRecord } from '../parsers/jrdb/kyi';
import { parseBAC, BACRecord } from '../parsers/jrdb/bac';
import { parseKAB, KABRecord } from '../parsers/jrdb/kab';

/**
 * JRDBデータのベースパス
 * CEO PCのE:\UMAYOMI\downloads_weekly
 */
const JRDB_BASE_PATH = 'E:\\UMAYOMI\\downloads_weekly';

/**
 * ファイル種別
 */
export type JRDBFileType = 
  | 'KYI' // 馬別出走情報
  | 'BAC' // 馬基本情報
  | 'KAB' // レース結果サマリー
  | 'CHA' // 調教情報
  | 'JOA' // 騎手情報
  | 'SED' // 成績データ
  | 'TYB' // 出走表
  | 'HJC' // 払戻金
  | 'OV';  // その他

/**
 * JRDBファイルパスを構築
 */
export function getJRDBFilePath(fileType: JRDBFileType, date: string): string {
  // 日付フォーマット: YYMMDD (例: 250105 = 2025年01月05日)
  const shortDate = date.substring(2, 8); // YYYYMMDDからYYMMDDへ
  
  // ファイル名: TYPE + YYMMDD.txt (例: KYI250105.txt)
  const filename = `${fileType}${shortDate}.txt`;
  
  // 抽出済みディレクトリを判定
  let extractedDir = '';
  if (['SED', 'SRB'].includes(fileType)) {
    extractedDir = 'sed_extracted';
  } else if (fileType === 'TYB') {
    extractedDir = 'tyb_extracted';
  } else if (fileType === 'HJC') {
    extractedDir = 'hjc_extracted';
  } else if (fileType === 'OV') {
    extractedDir = 'ov_extracted';
  } else {
    // KYI, BAC, KAB等はどこかに配置されている
    // 実際の配置を確認する必要あり
    extractedDir = 'kyi_extracted'; // 仮定
  }
  
  return path.join(JRDB_BASE_PATH, extractedDir, filename);
}

/**
 * Shift-JISファイルを読み込んでUTF-8に変換
 * 
 * @param filepath ファイルパス
 * @returns UTF-8テキスト
 */
export function readShiftJISFile(filepath: string): string {
  try {
    // バイナリで読み込み
    const buffer = fs.readFileSync(filepath);
    
    // Shift-JIS → UTF-8変換
    const content = iconv.decode(buffer, 'shift_jis');
    
    return content;
  } catch (error) {
    // ファイルが存在しない場合は空文字列を返す
    if ((error as any).code === 'ENOENT') {
      return '';
    }
    throw error;
  }
}

/**
 * KYIファイルを読み込む
 */
export function loadKYI(date: string): KYIRecord[] {
  const filepath = getJRDBFilePath('KYI', date);
  
  // まずはShift-JISとして読み込み
  let content = readShiftJISFile(filepath);
  
  // ファイルが見つからない場合、UTF-8として再試行
  if (!content) {
    try {
      content = fs.readFileSync(filepath, 'utf-8');
    } catch (error) {
      console.error(`KYI file not found: ${filepath}`);
      return [];
    }
  }
  
  return parseKYI(content);
}

/**
 * BACファイルを読み込む
 */
export function loadBAC(date: string): BACRecord[] {
  const filepath = getJRDBFilePath('BAC', date);
  
  let content = readShiftJISFile(filepath);
  
  if (!content) {
    try {
      content = fs.readFileSync(filepath, 'utf-8');
    } catch (error) {
      console.error(`BAC file not found: ${filepath}`);
      return [];
    }
  }
  
  return parseBAC(content);
}

/**
 * KABファイルを読み込む
 */
export function loadKAB(date: string): KABRecord[] {
  const filepath = getJRDBFilePath('KAB', date);
  
  let content = readShiftJISFile(filepath);
  
  if (!content) {
    try {
      content = fs.readFileSync(filepath, 'utf-8');
    } catch (error) {
      console.error(`KAB file not found: ${filepath}`);
      return [];
    }
  }
  
  return parseKAB(content);
}

/**
 * 複数日のデータを一括読み込み
 */
export function loadDateRange(
  fileType: JRDBFileType,
  startDate: string,
  endDate: string
): any[] {
  const records: any[] = [];
  
  // 日付範囲を生成
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
    
    try {
      switch (fileType) {
        case 'KYI':
          records.push(...loadKYI(dateStr));
          break;
        case 'BAC':
          records.push(...loadBAC(dateStr));
          break;
        case 'KAB':
          records.push(...loadKAB(dateStr));
          break;
      }
    } catch (error) {
      // エラーは無視して続行
    }
  }
  
  return records;
}

/**
 * 馬IDから全過去レースを取得
 * 
 * E:\UMAYOMI\downloads_weekly\sed_extracted\*から
 * 指定した馬IDの全レース情報を取得します
 */
export function loadHorseHistory(horseId: string): KYIRecord[] {
  const extractedDir = path.join(JRDB_BASE_PATH, 'sed_extracted');
  
  const allRecords: KYIRecord[] = [];
  
  try {
    // sed_extractedディレクトリの全KYIファイルを取得
    const files = fs.readdirSync(extractedDir);
    const kyiFiles = files.filter(f => f.startsWith('KYI') && f.endsWith('.txt'));
    
    // 各ファイルからhorseIdに一致するレコードを抽出
    for (const file of kyiFiles) {
      const filepath = path.join(extractedDir, file);
      
      try {
        const content = readShiftJISFile(filepath);
        if (!content) continue;
        
        const records = parseKYI(content);
        const horseRecords = records.filter(r => r.horse_id === horseId);
        
        allRecords.push(...horseRecords);
      } catch (error) {
        // エラーは無視して続行
      }
    }
  } catch (error) {
    console.error('Error loading horse history:', error);
  }
  
  // 日付降順でソート
  return allRecords.sort((a, b) => b.race_date.localeCompare(a.race_date));
}

/**
 * 利用可能な日付一覧を取得
 */
export function getAvailableDates(fileType: JRDBFileType): string[] {
  const extractedDir = path.join(JRDB_BASE_PATH, 'sed_extracted'); // 仮定
  
  try {
    const files = fs.readdirSync(extractedDir);
    const targetFiles = files.filter(f => f.startsWith(fileType) && f.endsWith('.txt'));
    
    // ファイル名から日付を抽出 (例: KYI250105.txt → 20250105)
    const dates = targetFiles.map(f => {
      const match = f.match(/(\d{6})\.txt$/);
      if (match) {
        const yymmdd = match[1];
        const yy = parseInt(yymmdd.substring(0, 2), 10);
        const year = yy >= 50 ? `19${yy}` : `20${yy}`;
        return `${year}${yymmdd.substring(2)}`;
      }
      return '';
    }).filter(d => d.length > 0);
    
    return dates.sort();
  } catch (error) {
    console.error('Error getting available dates:', error);
    return [];
  }
}
