/**
 * ファクター保存モード
 */
export type FactorSaveMode = 'aas' | 'rgs' | 'both' | 'either' | 'manual';

/**
 * ファクター保存条件
 */
export interface FactorSaveCondition {
  mode: FactorSaveMode;
  aasThreshold?: number;      // AAS閾値（例: +2.0 以上）
  rgsThreshold?: number;      // RGS閾値（例: +1.0 以上）
  minRaceCount?: number;      // 最小レース件数（例: 10件以上）
  minHitRate?: number;        // 最小的中率（例: 20%以上）
}

/**
 * ファクター集計結果（表示用）- 最終確定版
 * 
 * テーブル列構造（全17列）:
 * 0列目: 選択（チェックボックス）
 * 1列目: キー1
 * 2列目: キー2
 * 3列目: キー3
 * 4列目: キー4
 * 5列目: キー5
 * 6列目: キー6
 * 7列目: 単勝件数
 * 8列目: 単勝的中率
 * 9列目: 単勝回収率（生の回収率）
 * 10列目: 複勝件数
 * 11列目: 複勝的中率
 * 12列目: 複勝回収率（生の回収率）
 * 13列目: 単勝補正回収率（補正済み）
 * 14列目: AAS得点
 * 15列目: 複勝補正回収率（補正済み）
 * 16列目: RGS得点
 */
export interface FactorDisplayResult {
  id: string;                    // ファクターID
  keys: string[];                // 集計キー（最大6個、未使用は空文字）
  
  // 7-12列目: 生の集計データ
  winCount: number;              // 7列目: 単勝件数
  winHitRate: number;            // 8列目: 単勝的中率 (%)
  winReturnRate: number;         // 9列目: 単勝回収率 (%) ★生の回収率
  placeCount: number;            // 10列目: 複勝件数
  placeHitRate: number;          // 11列目: 複勝的中率 (%)
  placeReturnRate: number;       // 12列目: 複勝回収率 (%) ★生の回収率
  
  // 13-16列目: 補正済みスコア
  adjWinReturnRate: number;      // 13列目: 単勝補正回収率 (%) ★補正済み
  aasScore: number;              // 14列目: AAS得点 (-12 ～ +12)
  adjPlaceReturnRate: number;    // 15列目: 複勝補正回収率 (%) ★補正済み
  rgsScore: number;              // 16列目: RGS得点 (-10 ～ +10)
  
  // UI状態
  isSelected?: boolean;          // チェックボックス選択状態
  isSaved?: boolean;             // DB保存済みフラグ
  saveReason?: FactorSaveMode;   // 保存理由
}

/**
 * ファクター評価結果（DB保存用）
 */
export interface FactorScore {
  factorId: string;
  factorName: string;
  conditions: Record<string, any>;  // JSONB: ファクター条件
  
  // 集計データ
  cntWin: number;
  cntPlace: number;
  rateWinHit: number;
  ratePlaceHit: number;
  rateWinRet: number;            // 生の単勝回収率
  ratePlaceRet: number;          // 生の複勝回収率
  
  // 補正済みデータ
  adjWinRet: number;             // 単勝補正回収率
  adjPlaceRet: number;           // 複勝補正回収率
  aasScore: number;
  rgsScore: number;
  
  // 保存状態
  isSaved: boolean;
  saveReason?: FactorSaveMode;
  saveCondition?: FactorSaveCondition;
  
  // タイムスタンプ
  createdAt: Date;
  updatedAt: Date;
  calculatedAt?: Date;
}

/**
 * ファクター保存判定関数
 */
export function shouldSaveFactor(
  score: FactorDisplayResult,
  condition: FactorSaveCondition
): boolean {
  const { mode, aasThreshold, rgsThreshold, minRaceCount, minHitRate } = condition;
  
  // 最小レース件数チェック
  if (minRaceCount && Math.min(score.winCount, score.placeCount) < minRaceCount) {
    return false;
  }
  
  // 最小的中率チェック
  if (minHitRate) {
    const avgHitRate = (0.65 * score.winHitRate + 0.35 * score.placeHitRate);
    if (avgHitRate < minHitRate) {
      return false;
    }
  }
  
  // モード別判定
  switch (mode) {
    case 'aas':
      return aasThreshold !== undefined && score.aasScore >= aasThreshold;
    
    case 'rgs':
      return rgsThreshold !== undefined && score.rgsScore >= rgsThreshold;
    
    case 'both':
      return (
        aasThreshold !== undefined &&
        rgsThreshold !== undefined &&
        score.aasScore >= aasThreshold &&
        score.rgsScore >= rgsThreshold
      );
    
    case 'either':
      return (
        (aasThreshold !== undefined && score.aasScore >= aasThreshold) ||
        (rgsThreshold !== undefined && score.rgsScore >= rgsThreshold)
      );
    
    case 'manual':
      return score.isSelected === true;
    
    default:
      return false;
  }
}
