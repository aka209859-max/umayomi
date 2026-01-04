/**
 * AAS（Advanced Analysis Score）計算ロジック
 * レース内での相対的な強さ（偏差値）を評価する指標（約 -12 ～ +12）
 */

/**
 * AASの入力パラメータ（単一馬）
 */
export interface AASHorseInput {
  horseId: string;          // 馬ID
  horseName?: string;       // 馬名（オプション）
  cntWin: number;           // 単勝件数
  cntPlace: number;         // 複勝件数
  rateWinHit: number;       // 単勝的中率（%）
  ratePlaceHit: number;     // 複勝的中率（%）
  rateWinRet: number;       // 単勝補正回収率（%）
  ratePlaceRet: number;     // 複勝補正回収率（%）
}

/**
 * AASの計算パラメータ（レース単位）
 */
export interface AASRaceInput {
  raceId: string;           // レースID
  horses: AASHorseInput[];  // レース内の全馬
}

/**
 * AASの計算結果（単一馬）
 */
export interface AASHorseResult {
  horseId: string;
  horseName?: string;
  aasScore: number;         // AASスコア（約 -12 ～ +12）
  nMin: number;             // 安定件数
  hitRaw: number;           // 命中強度
  retRaw: number;           // 収益強度
  zH: number;               // 的中率のZスコア
  zR: number;               // 回収率のZスコア
  shrinkage: number;        // 信頼度収縮係数
  baseCalc: number;         // ベース計算値
}

/**
 * AASの母集団統計
 */
interface AASGroupStats {
  muH: number;    // Hit_raw の平均
  sigmaH: number; // Hit_raw の標準偏差
  muR: number;    // Ret_raw の平均
  sigmaR: number; // Ret_raw の標準偏差
}

/**
 * AASを計算（レース単位）
 * 
 * 計算ロジック：
 * Step 1: 基礎値の算出
 *   N_min = MIN(cnt_win, cnt_plc)
 *   Hit_raw = 0.65 * rate_win_hit + 0.35 * rate_plc_hit
 *   Ret_raw = 0.35 * rate_win_ret + 0.65 * rate_plc_ret
 * 
 * Step 2: グループ統計の算出
 *   μH, σH: Hit_raw の平均と標準偏差
 *   μR, σR: Ret_raw の平均と標準偏差
 * 
 * Step 3: Zスコアの算出
 *   ZH = (Hit_raw - μH) / σH
 *   ZR = (Ret_raw - μR) / σR
 * 
 * Step 4: 信頼度収縮
 *   Shr = SQRT(N_min / (N_min + 400))
 * 
 * Step 5: 最終AASスコア
 *   ベース計算 = 0.55 * ZH + 0.45 * ZR
 *   最終式 = 12 * TANH(ベース計算) * Shr
 * 
 * @param input レース入力パラメータ
 * @returns 各馬のAAS計算結果
 */
export function calculateAAS(input: AASRaceInput): AASHorseResult[] {
  const { horses } = input;
  
  // Step 1: 基礎値の算出
  const horsesWithRaw = horses.map(horse => ({
    ...horse,
    nMin: Math.min(horse.cntWin, horse.cntPlace),
    hitRaw: 0.65 * horse.rateWinHit + 0.35 * horse.ratePlaceHit,
    retRaw: 0.35 * horse.rateWinRet + 0.65 * horse.ratePlaceRet,
  }));
  
  // Step 2: グループ統計の算出
  const stats = calculateGroupStats(horsesWithRaw);
  
  // Step 3-5: 各馬のAASスコアを計算
  const results: AASHorseResult[] = horsesWithRaw.map(horse => {
    // Step 3: Zスコア
    const zH = stats.sigmaH > 0 ? (horse.hitRaw - stats.muH) / stats.sigmaH : 0;
    const zR = stats.sigmaR > 0 ? (horse.retRaw - stats.muR) / stats.sigmaR : 0;
    
    // Step 4: 信頼度収縮
    const shrinkage = Math.sqrt(horse.nMin / (horse.nMin + 400));
    
    // Step 5: 最終AASスコア
    const baseCalc = 0.55 * zH + 0.45 * zR;
    const aasScore = 12 * Math.tanh(baseCalc) * shrinkage;
    
    return {
      horseId: horse.horseId,
      horseName: horse.horseName,
      aasScore: Math.round(aasScore * 10) / 10, // 小数点1桁
      nMin: horse.nMin,
      hitRaw: Math.round(horse.hitRaw * 100) / 100,
      retRaw: Math.round(horse.retRaw * 100) / 100,
      zH: Math.round(zH * 100) / 100,
      zR: Math.round(zR * 100) / 100,
      shrinkage: Math.round(shrinkage * 100) / 100,
      baseCalc: Math.round(baseCalc * 100) / 100,
    };
  });
  
  return results;
}

/**
 * グループ統計を計算
 */
function calculateGroupStats(
  horses: Array<{ hitRaw: number; retRaw: number }>
): AASGroupStats {
  const n = horses.length;
  
  if (n === 0) {
    return { muH: 0, sigmaH: 0, muR: 0, sigmaR: 0 };
  }
  
  // 平均を計算
  const muH = horses.reduce((sum, h) => sum + h.hitRaw, 0) / n;
  const muR = horses.reduce((sum, h) => sum + h.retRaw, 0) / n;
  
  // 標準偏差を計算
  if (n === 1) {
    return { muH, sigmaH: 0, muR, sigmaR: 0 };
  }
  
  const varianceH = horses.reduce((sum, h) => sum + Math.pow(h.hitRaw - muH, 2), 0) / n;
  const varianceR = horses.reduce((sum, h) => sum + Math.pow(h.retRaw - muR, 2), 0) / n;
  
  const sigmaH = Math.sqrt(varianceH);
  const sigmaR = Math.sqrt(varianceR);
  
  return { muH, sigmaH, muR, sigmaR };
}

/**
 * テスト用サンプル関数
 */
export function testAAS() {
  console.log('=== AAS 計算テスト ===\n');
  
  // サンプルデータ：1レース3頭立て
  const sampleRace: AASRaceInput = {
    raceId: 'R202401010101',
    horses: [
      {
        horseId: 'H001',
        horseName: 'スーパーホース',
        cntWin: 50,
        cntPlace: 80,
        rateWinHit: 30.0,
        ratePlaceHit: 50.0,
        rateWinRet: 150.0,
        ratePlaceRet: 120.0,
      },
      {
        horseId: 'H002',
        horseName: 'ミドルホース',
        cntWin: 40,
        cntPlace: 60,
        rateWinHit: 20.0,
        ratePlaceHit: 35.0,
        rateWinRet: 100.0,
        ratePlaceRet: 90.0,
      },
      {
        horseId: 'H003',
        horseName: 'ウィークホース',
        cntWin: 30,
        cntPlace: 40,
        rateWinHit: 10.0,
        ratePlaceHit: 20.0,
        rateWinRet: 60.0,
        ratePlaceRet: 70.0,
      },
    ],
  };
  
  const results = calculateAAS(sampleRace);
  
  console.log(`レースID: ${sampleRace.raceId}`);
  console.log(`出走頭数: ${sampleRace.horses.length}頭\n`);
  
  console.log('【計算結果】\n');
  
  // AASスコアでソート（降順）
  const sortedResults = [...results].sort((a, b) => b.aasScore - a.aasScore);
  
  for (let i = 0; i < sortedResults.length; i++) {
    const horse = sortedResults[i];
    console.log(`${i + 1}位: ${horse.horseName || horse.horseId}`);
    console.log(`  AASスコア: ${horse.aasScore.toFixed(1)}`);
    console.log(`  安定件数: ${horse.nMin}件`);
    console.log(`  命中強度: ${horse.hitRaw.toFixed(2)}`);
    console.log(`  収益強度: ${horse.retRaw.toFixed(2)}`);
    console.log(`  的中率Zスコア: ${horse.zH.toFixed(2)}`);
    console.log(`  回収率Zスコア: ${horse.zR.toFixed(2)}`);
    console.log(`  信頼度収縮: ${horse.shrinkage.toFixed(2)}`);
    console.log('');
  }
  
  console.log('【解釈】');
  const winner = sortedResults[0];
  if (winner.aasScore >= 6.0) {
    console.log('✅ 1位の馬は圧倒的な強さ（AAS +6.0以上）');
  } else if (winner.aasScore >= 3.0) {
    console.log('✅ 1位の馬は優勢（AAS +3.0以上）');
  } else if (winner.aasScore >= 0) {
    console.log('⚠️ 僅差のレース（AAS差が小さい）');
  } else {
    console.log('⚠️ 混戦模様（全馬がマイナスAAS）');
  }
}
