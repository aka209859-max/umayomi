/**
 * JRDB固定長レコードパーサー
 * 
 * 対応フォーマット:
 * - SED: 成績データ（375バイト）
 * - TYB: 出馬表データ（375バイト）
 * - HJC: 払戻金データ（375バイト）
 * - OV: オッズデータ（33,600バイト）※Phase 4で実装
 */

/**
 * 固定長文字列を抽出（Shift-JIS対応）
 */
function extractField(line: string, start: number, length: number): string {
  return line.substring(start, start + length).trim()
}

/**
 * 数値フィールドを抽出
 */
function extractNumber(line: string, start: number, length: number): number {
  const value = extractField(line, start, length)
  return value ? parseFloat(value) : 0
}

/**
 * 日付フィールドを抽出（YYYYMMDDフォーマット）
 */
function extractDate(line: string, start: number): Date {
  const dateStr = extractField(line, start, 8) // YYYYMMDD
  const year = parseInt(dateStr.substring(0, 4))
  const month = parseInt(dateStr.substring(4, 6)) - 1
  const day = parseInt(dateStr.substring(6, 8))
  return new Date(year, month, day)
}

// ===== SED Parser（成績データ） =====

export interface SEDRecord {
  // レース識別情報
  raceKey: string          // 場コード(2) + 年(2) + 月日(4) + レース番号(2) = 10桁
  trackCode: string        // 場コード（01-10）
  raceDate: Date           // レース日付
  raceNumber: number       // レース番号（1-12）
  horseNumber: number      // 馬番（1-18）
  
  // 成績情報
  finishPosition: number   // 着順（1-18, 0=失格/取消）
  popularity: number       // 人気（1-18）
  finishTime: number       // タイム（秒）
  margin: string           // 着差
  
  // オッズ情報
  winOdds: number          // 単勝オッズ
  placeOddsMin: number     // 複勝オッズ（下限）
  placeOddsMax: number     // 複勝オッズ（上限）
  
  // コース情報
  trackCondition: string   // 馬場状態（良/稍重/重/不良）
  weather: string          // 天候
  
  // 馬情報
  horseName: string        // 馬名
  jockeyName: string       // 騎手名
  trainerName: string      // 調教師名
  horseWeight: number      // 馬体重
  horseWeightDiff: number  // 馬体重増減
}

export class SEDParser {
  /**
   * SED固定長レコード（375バイト）をパース
   */
  static parse(line: string): SEDRecord | null {
    if (!line || line.length < 100) return null
    
    try {
      // レース識別情報（0-10）
      const raceKey = extractField(line, 0, 10)
      const trackCode = extractField(line, 0, 2)
      const year = 2000 + parseInt(extractField(line, 2, 2))
      const month = parseInt(extractField(line, 4, 2))
      const day = parseInt(extractField(line, 6, 2))
      const raceNumber = parseInt(extractField(line, 8, 2))
      const horseNumber = parseInt(extractField(line, 10, 2))
      
      // 日付
      const raceDate = new Date(year, month - 1, day)
      
      // レース情報（18-26）
      const fullDateStr = extractField(line, 18, 8) // YYYYMMDD
      
      // 成績情報（推定位置）
      // ※実際の位置はJRDB仕様書で要確認
      let offset = 100 // 馬名などの可変長フィールドの後
      
      // タイム情報（例: "  8.904"）
      const finishTime = extractNumber(line, offset, 7)
      offset += 7
      
      // 着順と人気（例: "  3  3"）
      const finishPosition = extractNumber(line, offset, 3)
      offset += 3
      const popularity = extractNumber(line, offset, 3)
      offset += 3
      
      // 着差（例: " -6"）
      const margin = extractField(line, offset, 3)
      offset += 3
      
      // オッズ情報（推定）
      const winOdds = extractNumber(line, offset, 6)
      offset += 20 // その他情報をスキップ
      
      const placeOddsMin = extractNumber(line, offset, 6)
      offset += 6
      const placeOddsMax = extractNumber(line, offset, 6)
      
      return {
        raceKey,
        trackCode,
        raceDate,
        raceNumber,
        horseNumber,
        finishPosition,
        popularity,
        finishTime,
        margin,
        winOdds,
        placeOddsMin,
        placeOddsMax,
        trackCondition: '',
        weather: '',
        horseName: '',
        jockeyName: '',
        trainerName: '',
        horseWeight: 0,
        horseWeightDiff: 0
      }
    } catch (error) {
      console.error('SED parse error:', error)
      return null
    }
  }
}

// ===== TYB Parser（出馬表データ） =====

export interface TYBRecord {
  // レース識別情報
  raceKey: string          // 10桁のレースキー
  horseNumber: number      // 馬番
  
  // オッズ情報
  winOdds: number          // 単勝オッズ
  placeOddsMin: number     // 複勝オッズ下限
  placeOddsMax: number     // 複勝オッズ上限
  
  // 予想指数
  index1: number           // 指数1（JRDB独自指数）
  index2: number           // 指数2
  index3: number           // 指数3
  index4: number           // 指数4
  index5: number           // 指数5
  indexTotal: number       // 指数合計
  
  // 馬情報
  horseName: string        // 馬名
  bloodCode: string        // 血統コード
  
  // その他
  idmScore: number         // IDM（総合指数）
  jockeyScore: number      // 騎手指数
}

export class TYBParser {
  /**
   * TYB固定長レコード（375バイト）をパース
   */
  static parse(line: string): TYBRecord | null {
    if (!line || line.length < 60) return null
    
    try {
      // レースキー（0-10）
      const raceKey = extractField(line, 0, 10)
      
      // オッズ情報（10-52）
      const winOdds = extractNumber(line, 10, 6)
      const index1 = extractNumber(line, 16, 6)
      const index2 = extractNumber(line, 22, 6)
      const index3 = extractNumber(line, 28, 6)
      const index4 = extractNumber(line, 34, 6)
      const index5 = extractNumber(line, 40, 6)
      const indexTotal = extractNumber(line, 46, 6)
      
      // その他情報（52-63）
      const otherInfo = extractField(line, 52, 11)
      
      // 馬名（63-X、Shift-JIS可変長）
      let offset = 63
      let horseName = ''
      // 馬名の終端を探す（次の固定長フィールドの開始位置まで）
      
      // 血統コード（推定位置）
      offset = 80 // 馬名の後（推定）
      const bloodCode = extractField(line, offset, 7)
      
      // IDM・騎手指数（推定位置）
      offset += 7
      const idmScore = extractNumber(line, offset, 6)
      offset += 6
      const jockeyScore = extractNumber(line, offset, 6)
      
      // 馬番を抽出（レースキーの最後2桁）
      const horseNumber = parseInt(raceKey.substring(8, 10))
      
      return {
        raceKey,
        horseNumber,
        winOdds,
        placeOddsMin: 0, // TYBには含まれない（SEDまたはOVから取得）
        placeOddsMax: 0,
        index1,
        index2,
        index3,
        index4,
        index5,
        indexTotal,
        horseName,
        bloodCode,
        idmScore,
        jockeyScore
      }
    } catch (error) {
      console.error('TYB parse error:', error)
      return null
    }
  }
}

// ===== HJC Parser（払戻金データ） =====

export interface HJCRecord {
  // レース識別情報
  raceKey: string          // 10桁のレースキー
  
  // 単勝・複勝
  winPayback: number       // 単勝払戻金
  placePayback1: number    // 複勝払戻金1位
  placePayback2: number    // 複勝払戻金2位
  placePayback3: number    // 複勝払戻金3位
  
  // 馬連・馬単・ワイド
  quinellaPayback: number  // 馬連払戻金
  exactaPayback: number    // 馬単払戻金
  widePayback1: number     // ワイド払戻金1
  widePayback2: number     // ワイド払戻金2
  widePayback3: number     // ワイド払戻金3
  
  // 三連複・三連単
  trio: number             // 三連複払戻金
  trifecta: number         // 三連単払戻金
}

export class HJCParser {
  /**
   * HJC固定長レコード（375バイト）をパース
   */
  static parse(line: string): HJCRecord | null {
    if (!line || line.length < 100) return null
    
    try {
      // レースキー（0-10）
      const raceKey = extractField(line, 0, 10)
      
      // 払戻金情報（10桁ずつの固定長フィールド）
      let offset = 10
      
      const winPayback = extractNumber(line, offset, 10)
      offset += 10
      
      const placePayback1 = extractNumber(line, offset, 10)
      offset += 10
      
      const placePayback2 = extractNumber(line, offset, 10)
      offset += 10
      
      const placePayback3 = extractNumber(line, offset, 10)
      offset += 10
      
      const quinellaPayback = extractNumber(line, offset, 10)
      offset += 10
      
      const exactaPayback = extractNumber(line, offset, 10)
      offset += 10
      
      const widePayback1 = extractNumber(line, offset, 10)
      offset += 10
      
      const widePayback2 = extractNumber(line, offset, 10)
      offset += 10
      
      const widePayback3 = extractNumber(line, offset, 10)
      offset += 10
      
      const trio = extractNumber(line, offset, 10)
      offset += 10
      
      const trifecta = extractNumber(line, offset, 10)
      
      return {
        raceKey,
        winPayback,
        placePayback1,
        placePayback2,
        placePayback3,
        quinellaPayback,
        exactaPayback,
        widePayback1,
        widePayback2,
        widePayback3,
        trio,
        trifecta
      }
    } catch (error) {
      console.error('HJC parse error:', error)
      return null
    }
  }
}

// ===== OV Parser（オッズデータ）- Phase 4で実装 =====

export interface OVRecord {
  raceKey: string
  oddsData: number[] // 全オッズデータ（数千個）
}

export class OVParser {
  /**
   * OV固定長レコード（33,600バイト）をパース
   * ※Phase 4で実装予定
   */
  static parse(line: string): OVRecord | null {
    // TODO: Phase 4で実装
    return null
  }
}
