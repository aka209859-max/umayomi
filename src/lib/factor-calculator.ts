/**
 * Factor Calculation Engine
 * ファクター得点計算エンジン
 * 
 * RGS (Race Grade Score): レース適性得点
 * AAS (Ability Assessment Score): 能力評価得点
 * Total Score: 総合得点
 */

export interface FactorConditions {
  race: {
    track?: string;
    distanceMin?: number;
    distanceMax?: number;
    surface?: string;
  };
  factors: Array<{
    factor: string;
    operator: string;
    value: number;
  }>;
}

export interface HorseData {
  horse_number: string;
  horse_id: string;
  // Mock data fields (TODO: Replace with real data from JRDB)
  odds?: number;
  popularity?: number;
  weight?: number;
  horse_weight?: number;
  jockey_win_rate?: number;
  trainer_win_rate?: number;
  recent_form?: number;
  speed_index?: number;
  pace_index?: number;
  position_index?: number;
}

export interface ScoredHorse extends HorseData {
  rgs: number;        // Race Grade Score
  aas: number;        // Ability Assessment Score
  total_score: number; // Total Score
  matched_conditions: number;
  total_conditions: number;
}

export class FactorCalculator {
  /**
   * Apply factor to horses
   * ファクターを馬に適用
   */
  applyFactor(
    horses: HorseData[],
    conditions: FactorConditions,
    raceInfo: { track: string; distance: number; surface: string }
  ): ScoredHorse[] {
    return horses.map(horse => {
      const rgs = this.calculateRGS(horse, conditions, raceInfo);
      const aas = this.calculateAAS(horse, conditions);
      const total_score = (rgs + aas) / 2;
      
      const { matched, total } = this.countMatchedConditions(horse, conditions);
      
      return {
        ...horse,
        rgs,
        aas,
        total_score,
        matched_conditions: matched,
        total_conditions: total
      };
    });
  }

  /**
   * Calculate RGS (Race Grade Score)
   * レース適性得点を計算
   */
  private calculateRGS(
    horse: HorseData,
    conditions: FactorConditions,
    raceInfo: { track: string; distance: number; surface: string }
  ): number {
    let score = 50; // Base score

    // Check race conditions
    const { race } = conditions;

    // Track match
    if (race.track && race.track === raceInfo.track) {
      score += 10;
    }

    // Distance match
    if (race.distanceMin && race.distanceMax) {
      if (raceInfo.distance >= race.distanceMin && raceInfo.distance <= race.distanceMax) {
        score += 15;
      } else {
        score -= 10;
      }
    }

    // Surface match
    if (race.surface && race.surface === raceInfo.surface) {
      score += 10;
    }

    // Clamp score between 0-100
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate AAS (Ability Assessment Score)
   * 能力評価得点を計算
   */
  private calculateAAS(
    horse: HorseData,
    conditions: FactorConditions
  ): number {
    let score = 50; // Base score
    let matchedCount = 0;
    let totalCount = conditions.factors.length;

    if (totalCount === 0) {
      return score;
    }

    for (const condition of conditions.factors) {
      const horseValue = this.getHorseValue(horse, condition.factor);
      
      if (horseValue === null) {
        continue; // Skip if data not available
      }

      const matched = this.checkCondition(horseValue, condition.operator, condition.value);
      
      if (matched) {
        matchedCount++;
      }
    }

    // Calculate score based on match percentage
    const matchPercentage = matchedCount / totalCount;
    score = 50 + (matchPercentage * 50); // 50-100 range

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Get horse value by factor type
   */
  private getHorseValue(horse: HorseData, factor: string): number | null {
    // Generate mock data for demonstration
    // TODO: Replace with real data from JRDB
    
    switch (factor) {
      case 'odds':
        return horse.odds ?? this.generateMockOdds();
      case 'popularity':
        return horse.popularity ?? this.generateMockPopularity();
      case 'weight':
        return horse.weight ?? 55;
      case 'horse_weight':
        return horse.horse_weight ?? this.generateMockHorseWeight();
      case 'jockey_win_rate':
        return horse.jockey_win_rate ?? this.generateMockWinRate();
      case 'trainer_win_rate':
        return horse.trainer_win_rate ?? this.generateMockWinRate();
      case 'recent_form':
        return horse.recent_form ?? this.generateMockForm();
      case 'speed_index':
        return horse.speed_index ?? this.generateMockIndex();
      case 'pace_index':
        return horse.pace_index ?? this.generateMockIndex();
      case 'position_index':
        return horse.position_index ?? this.generateMockIndex();
      default:
        return null;
    }
  }

  /**
   * Check if condition is met
   */
  private checkCondition(value: number, operator: string, target: number): boolean {
    switch (operator) {
      case 'gte': // >=
        return value >= target;
      case 'lte': // <=
        return value <= target;
      case 'eq': // =
        return value === target;
      case 'gt': // >
        return value > target;
      case 'lt': // <
        return value < target;
      default:
        return false;
    }
  }

  /**
   * Count matched conditions
   */
  private countMatchedConditions(
    horse: HorseData,
    conditions: FactorConditions
  ): { matched: number; total: number } {
    let matched = 0;
    const total = conditions.factors.length;

    for (const condition of conditions.factors) {
      const horseValue = this.getHorseValue(horse, condition.factor);
      
      if (horseValue === null) {
        continue;
      }

      if (this.checkCondition(horseValue, condition.operator, condition.value)) {
        matched++;
      }
    }

    return { matched, total };
  }

  // Mock data generators (TODO: Replace with real data)
  private generateMockOdds(): number {
    return Math.random() * 50 + 1; // 1-50倍
  }

  private generateMockPopularity(): number {
    return Math.floor(Math.random() * 18) + 1; // 1-18番人気
  }

  private generateMockHorseWeight(): number {
    return Math.floor(Math.random() * 100) + 400; // 400-500kg
  }

  private generateMockWinRate(): number {
    return Math.random() * 30; // 0-30%
  }

  private generateMockForm(): number {
    return Math.random() * 100; // 0-100点
  }

  private generateMockIndex(): number {
    return Math.random() * 100; // 0-100点
  }
}
