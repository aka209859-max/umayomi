import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { RGSCalculator, type RGSInput } from '../calculators/RGSCalculator'
import { AASCalculator, type AASInput } from '../calculators/AASCalculator'

const api = new Hono()

// Enable CORS for API routes
api.use('/*', cors())

/**
 * RGS計算API
 * POST /api/rgs/calculate
 */
api.post('/rgs/calculate', async (c) => {
  try {
    const body = await c.req.json<RGSInput>()

    // バリデーション
    if (typeof body.cnt_win !== 'number' || body.cnt_win < 0) {
      return c.json({ error: 'cnt_win must be a positive number' }, 400)
    }
    if (typeof body.cnt_plc !== 'number' || body.cnt_plc < 0) {
      return c.json({ error: 'cnt_plc must be a positive number' }, 400)
    }
    if (typeof body.rate_win_ret !== 'number') {
      return c.json({ error: 'rate_win_ret must be a number' }, 400)
    }
    if (typeof body.rate_plc_ret !== 'number') {
      return c.json({ error: 'rate_plc_ret must be a number' }, 400)
    }

    // RGS計算
    const result = RGSCalculator.calculate(body)

    return c.json({
      success: true,
      data: {
        score: result.score,
        grade: result.grade,
        reliability: result.reliability,
        weightedDiff: result.weightedDiff,
        description: RGSCalculator.getGradeDescription(result.grade)
      }
    })
  } catch (error) {
    console.error('RGS calculation error:', error)
    return c.json({ 
      success: false, 
      error: 'RGS calculation failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

/**
 * AAS計算API
 * POST /api/aas/calculate
 */
api.post('/aas/calculate', async (c) => {
  try {
    const body = await c.req.json<{ horses: AASInput[] }>()

    // バリデーション
    if (!Array.isArray(body.horses) || body.horses.length === 0) {
      return c.json({ error: 'horses must be a non-empty array' }, 400)
    }

    // 各馬のバリデーション
    for (const horse of body.horses) {
      if (!horse.group_id || typeof horse.group_id !== 'string') {
        return c.json({ error: 'group_id is required and must be a string' }, 400)
      }
      if (typeof horse.cnt_win !== 'number' || horse.cnt_win < 0) {
        return c.json({ error: 'cnt_win must be a positive number' }, 400)
      }
      if (typeof horse.cnt_plc !== 'number' || horse.cnt_plc < 0) {
        return c.json({ error: 'cnt_plc must be a positive number' }, 400)
      }
      if (typeof horse.rate_win_hit !== 'number') {
        return c.json({ error: 'rate_win_hit must be a number' }, 400)
      }
      if (typeof horse.rate_plc_hit !== 'number') {
        return c.json({ error: 'rate_plc_hit must be a number' }, 400)
      }
      if (typeof horse.rate_win_ret !== 'number') {
        return c.json({ error: 'rate_win_ret must be a number' }, 400)
      }
      if (typeof horse.rate_plc_ret !== 'number') {
        return c.json({ error: 'rate_plc_ret must be a number' }, 400)
      }
    }

    // AAS計算
    const resultsMap = AASCalculator.calculate(body.horses)

    // Map を配列に変換
    const results = Array.from(resultsMap.entries()).map(([key, value]) => ({
      key,
      score: value.score,
      grade: value.grade,
      hitRaw: value.hitRaw,
      retRaw: value.retRaw,
      shrinkage: value.shrinkage,
      description: AASCalculator.getGradeDescription(value.grade)
    }))

    return c.json({
      success: true,
      data: {
        count: results.length,
        results
      }
    })
  } catch (error) {
    console.error('AAS calculation error:', error)
    return c.json({ 
      success: false, 
      error: 'AAS calculation failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

/**
 * ファクターテストAPI
 * POST /api/factor/test
 */
api.post('/factor/test', async (c) => {
  try {
    const body = await c.req.json<{
      factors: {
        name: string
        weight: number
      }[]
      testData: {
        race_id: string
        horse_id: string
        actual_rank: number
        rgs_score: number
        aas_score: number
      }[]
    }>()

    // バリデーション
    if (!Array.isArray(body.factors) || body.factors.length === 0) {
      return c.json({ error: 'factors must be a non-empty array' }, 400)
    }
    if (!Array.isArray(body.testData) || body.testData.length === 0) {
      return c.json({ error: 'testData must be a non-empty array' }, 400)
    }

    // ウェイトの合計が100%であることを確認
    const totalWeight = body.factors.reduce((sum, f) => sum + f.weight, 0)
    if (Math.abs(totalWeight - 100) > 0.01) {
      return c.json({ error: 'Total weight must be 100%' }, 400)
    }

    // ファクタースコア計算
    const predictions = body.testData.map(data => {
      // ここでは簡単な例として RGS と AAS のみ使用
      const rgsWeight = body.factors.find(f => f.name === 'RGS基礎値')?.weight || 0
      const aasWeight = body.factors.find(f => f.name === 'AAS基礎値')?.weight || 0
      
      const factorScore = 
        (data.rgs_score * rgsWeight / 100) + 
        (data.aas_score * aasWeight / 100)

      return {
        ...data,
        factor_score: factorScore
      }
    })

    // レースごとにグループ化して予想順位を計算
    const raceGroups = new Map<string, typeof predictions>()
    for (const pred of predictions) {
      const group = raceGroups.get(pred.race_id) || []
      group.push(pred)
      raceGroups.set(pred.race_id, group)
    }

    // 各レースでスコア順にソートして予想順位を付与
    const predictionsWithRank = []
    for (const [raceId, horses] of raceGroups.entries()) {
      const sorted = horses.sort((a, b) => b.factor_score - a.factor_score)
      sorted.forEach((horse, index) => {
        predictionsWithRank.push({
          ...horse,
          predicted_rank: index + 1
        })
      })
    }

    // パフォーマンス指標を計算
    let totalHits = 0
    let totalReturn = 0
    let totalBets = predictions.length

    for (const pred of predictionsWithRank) {
      // 的中判定（予想1位が実際に1-3位に入った場合）
      if (pred.predicted_rank === 1 && pred.actual_rank <= 3) {
        totalHits++
        // 簡易的な回収率計算（実際にはオッズが必要）
        totalReturn += 100 * (4 - pred.actual_rank) // 1位=300、2位=200、3位=100
      }
    }

    const hitRate = (totalHits / totalBets) * 100
    const recoveryRate = (totalReturn / (totalBets * 100)) * 100
    const roi = recoveryRate - 100

    return c.json({
      success: true,
      data: {
        performance: {
          hit_rate: Math.round(hitRate * 10) / 10,
          recovery_rate: Math.round(recoveryRate * 10) / 10,
          roi: Math.round(roi * 10) / 10,
          total_bets: totalBets,
          total_hits: totalHits,
          total_return: totalReturn
        },
        predictions: predictionsWithRank.slice(0, 10) // 最初の10件のみ返す
      }
    })
  } catch (error) {
    console.error('Factor test error:', error)
    return c.json({ 
      success: false, 
      error: 'Factor test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

/**
 * ヘルスチェックAPI
 * GET /api/health
 */
api.get('/health', (c) => {
  return c.json({
    success: true,
    message: 'UMAYOMI API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  })
})

export default api
