/**
 * RGS 1.0 Calculator (Race Grade Score)
 * 絶対収益力評価
 * 
 * 入力:
 * - cnt_win: 単勝投票件数（H列）
 * - cnt_plc: 複勝投票件数（L列）
 * - rate_win_ret: 単勝補正回収率（Q列）
 * - rate_plc_ret: 複勝補正回収率（T列）
 * 
 * 出力: -10 ~ +10 の範囲
 */

export interface RGSInput {
  cnt_win: number;      // 単勝投票件数
  cnt_plc: number;      // 複勝投票件数
  rate_win_ret: number; // 単勝回収率
  rate_plc_ret: number; // 複勝回収率
}

export interface RGSResult {
  score: number;        // RGSスコア (-10 ~ +10)
  grade: string;        // 評価 (S/A/B/C/D)
  reliability: number;  // 信頼度 (0 ~ 1)
  weightedDiff: number; // 加重平均乖離
}

export class RGSCalculator {
  /**
   * RGS 1.0 スコアを計算
   */
  static calculate(input: RGSInput): RGSResult {
    // Step 1: 信頼度係数 (Reliability)
    // MIN(1, SQRT((cnt_win + cnt_plc) / 500))
    const totalCount = input.cnt_win + input.cnt_plc;
    const reliability = Math.min(1, Math.sqrt(totalCount / 500));

    // Step 2: 加重平均乖離 (Weighted Diff)
    // (rate_win_ret * 0.3) + (rate_plc_ret * 0.7) - 80
    const weightedDiff = 
      (input.rate_win_ret * 0.3) + 
      (input.rate_plc_ret * 0.7) - 
      80;

    // Step 3: 最終RGSスコア
    // 10 * TANH((Weighted Diff * Reliability) / 25)
    const rgsScore = 10 * Math.tanh((weightedDiff * reliability) / 25);

    // Step 4: グレード評価
    const grade = this.getGrade(rgsScore);

    return {
      score: Math.round(rgsScore * 100) / 100, // 小数点2桁
      grade,
      reliability: Math.round(reliability * 1000) / 1000, // 小数点3桁
      weightedDiff: Math.round(weightedDiff * 100) / 100
    };
  }

  /**
   * RGSスコアからグレードを取得
   */
  private static getGrade(score: number): string {
    if (score >= 7) return 'S';       // 極めて優秀
    if (score >= 4) return 'A';       // 優秀
    if (score >= 1) return 'B';       // 良好
    if (score >= -3) return 'C';      // 平均
    return 'D';                       // 要改善
  }

  /**
   * グレードの説明を取得
   */
  static getGradeDescription(grade: string): string {
    const descriptions: Record<string, string> = {
      'S': '極めて優秀 - 高い収益性が期待できる',
      'A': '優秀 - 安定した収益が見込める',
      'B': '良好 - プラス収益の可能性が高い',
      'C': '平均 - 標準的なパフォーマンス',
      'D': '要改善 - 収益性が低い可能性がある'
    };
    return descriptions[grade] || '不明';
  }
}
