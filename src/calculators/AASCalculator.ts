/**
 * AAS Calculator (Advanced Analysis Score)
 * 相対偏差値評価
 * 
 * 入力:
 * - group_id: レースID（E列）
 * - cnt_win: 単勝投票件数（H列）
 * - cnt_plc: 複勝投票件数（L列）
 * - rate_win_hit: 単勝的中率（J列）
 * - rate_plc_hit: 複勝的中率（N列）
 * - rate_win_ret: 単勝回収率（Q列）
 * - rate_plc_ret: 複勝回収率（T列）
 * 
 * 出力: -12 ~ +12 の範囲（小数点1桁）
 */

export interface AASInput {
  group_id: string;     // レースID
  cnt_win: number;      // 単勝投票件数
  cnt_plc: number;      // 複勝投票件数
  rate_win_hit: number; // 単勝的中率
  rate_plc_hit: number; // 複勝的中率
  rate_win_ret: number; // 単勝回収率
  rate_plc_ret: number; // 複勝回収率
}

export interface AASResult {
  score: number;        // AASスコア (-12 ~ +12, 小数点1桁)
  grade: string;        // 評価 (S+/S/A/B/C/D)
  hitRaw: number;       // 基礎的中率
  retRaw: number;       // 基礎回収率
  shrinkage: number;    // 信頼度収縮
}

export class AASCalculator {
  /**
   * AAS スコアを計算（複数馬のグループデータが必要）
   */
  static calculate(inputs: AASInput[]): Map<string, AASResult> {
    const results = new Map<string, AASResult>();

    // グループIDごとに処理
    const groups = this.groupByRaceId(inputs);

    for (const [groupId, horses] of groups.entries()) {
      // Step1: 基礎値 (Raw Values) を計算
      const rawValues = horses.map(horse => ({
        horse,
        nMin: Math.min(horse.cnt_win, horse.cnt_plc),
        hitRaw: 0.65 * horse.rate_win_hit + 0.35 * horse.rate_plc_hit,
        retRaw: 0.35 * horse.rate_win_ret + 0.65 * horse.rate_plc_ret
      }));

      // Step2: グループ統計 (Group Stats)
      const hitRawValues = rawValues.map(v => v.hitRaw);
      const retRawValues = rawValues.map(v => v.retRaw);

      const muH = this.mean(hitRawValues);
      const sigmaH = this.stdDev(hitRawValues, muH);
      const muR = this.mean(retRawValues);
      const sigmaR = this.stdDev(retRawValues, muR);

      // Step3-5: 各馬のAASスコアを計算
      for (const { horse, nMin, hitRaw, retRaw } of rawValues) {
        // Step3: Zスコア (Standardization)
        const zH = sigmaH > 0 ? (hitRaw - muH) / sigmaH : 0;
        const zR = sigmaR > 0 ? (retRaw - muR) / sigmaR : 0;

        // Step4: 信頼度収縮 (Shrinkage)
        const shr = Math.sqrt(nMin / (nMin + 400));

        // Step5: 最終AASスコア
        const base = 0.55 * zH + 0.45 * zR;
        const aasScore = Math.round(12 * Math.tanh(base) * shr * 10) / 10;

        // グレード評価
        const grade = this.getGrade(aasScore);

        // 結果を保存（ユニークキー: groupId + 馬番など、ここでは仮にインデックス使用）
        const key = `${groupId}_${horse.cnt_win}_${horse.cnt_plc}`;
        results.set(key, {
          score: aasScore,
          grade,
          hitRaw: Math.round(hitRaw * 100) / 100,
          retRaw: Math.round(retRaw * 100) / 100,
          shrinkage: Math.round(shr * 1000) / 1000
        });
      }
    }

    return results;
  }

  /**
   * レースIDでグループ化
   */
  private static groupByRaceId(inputs: AASInput[]): Map<string, AASInput[]> {
    const groups = new Map<string, AASInput[]>();

    for (const input of inputs) {
      const existing = groups.get(input.group_id) || [];
      existing.push(input);
      groups.set(input.group_id, existing);
    }

    return groups;
  }

  /**
   * 平均値を計算
   */
  private static mean(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * 標準偏差を計算
   */
  private static stdDev(values: number[], mean: number): number {
    if (values.length <= 1) return 0;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  /**
   * AASスコアからグレードを取得
   */
  private static getGrade(score: number): string {
    if (score >= 8) return 'S+';      // 最高評価
    if (score >= 5) return 'S';       // 極めて優秀
    if (score >= 2) return 'A';       // 優秀
    if (score >= -1) return 'B';      // 良好
    if (score >= -4) return 'C';      // 平均
    return 'D';                       // 要改善
  }

  /**
   * グレードの説明を取得
   */
  static getGradeDescription(grade: string): string {
    const descriptions: Record<string, string> = {
      'S+': '最高評価 - レース内で圧倒的な優位性',
      'S': '極めて優秀 - レース内で明確な優位性',
      'A': '優秀 - レース内で有力候補',
      'B': '良好 - レース内で競争力あり',
      'C': '平均 - レース内で標準的な位置',
      'D': '要改善 - レース内で劣勢'
    };
    return descriptions[grade] || '不明';
  }
}
