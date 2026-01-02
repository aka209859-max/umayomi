/**
 * UMAYOMI データベース動作確認テスト
 * 
 * 実行方法:
 * npx tsx scripts/test_db.ts
 */

import { getDatabase, closeDatabase } from '../src/lib/database'
import type { FactorConditions } from '../src/types/database'

async function testDatabase() {
  console.log('🧪 UMAYOMI データベーステスト開始\n')

  try {
    const db = getDatabase()

    // ============================================================
    // Test 1: registered_factors
    // ============================================================
    console.log('📋 Test 1: registered_factors')
    console.log('─'.repeat(50))

    // 全ファクター取得
    const factors = db.getFactors()
    console.log(`✅ 登録済みファクター数: ${factors.length}`)
    factors.forEach(f => {
      console.log(`   - [${f.id}] ${f.name}`)
      console.log(`     Formula: ${f.formula}`)
      console.log(`     Active: ${f.is_active === 1 ? 'YES' : 'NO'}`)
    })

    // 新規ファクター作成テスト
    const testConditions: FactorConditions = {
      area1: {
        course_type: ['芝'],
        distance_min: 2000,
        distance_max: 2400,
        venues: ['東京', '中山', '京都']
      },
      area2: {
        sex: ['牡'],
        age_min: 4,
        age_max: 6
      },
      area3: {
        grades: ['G1'],
        date_from: '2022-01-01',
        date_to: '2024-12-31'
      },
      correction: {
        period: {
          recent_3m: 1.0,
          recent_6m: 0.9,
          recent_1y: 0.7
        },
        odds: {
          min: 1.0,
          max: 15.0
        }
      }
    }

    const newFactorId = db.createFactor({
      name: 'テスト用ファクター',
      formula: 'win_count * 15 + place_count * 8',
      conditions: JSON.stringify(testConditions),
      description: 'テスト用に作成したファクター',
      is_active: 1
    })

    console.log(`✅ 新規ファクター作成成功: ID=${newFactorId}`)

    // 作成したファクターを取得
    const createdFactor = db.getActiveFactor(newFactorId)
    if (createdFactor) {
      console.log(`✅ ファクター取得成功: ${createdFactor.name}`)
      const parsed = JSON.parse(createdFactor.conditions) as FactorConditions
      console.log(`   Conditions: ${JSON.stringify(parsed, null, 2)}`)
    }

    // ファクター更新テスト
    db.updateFactor(newFactorId, {
      description: 'テスト用に作成したファクター（更新後）'
    })
    console.log(`✅ ファクター更新成功: ID=${newFactorId}`)

    // ============================================================
    // Test 2: tomorrow_races
    // ============================================================
    console.log('\n📋 Test 2: tomorrow_races')
    console.log('─'.repeat(50))

    // テスト用出走表データ
    const testRaces = [
      {
        race_date: '20250104',
        venue: '東京',
        race_number: 10,
        horse_number: 1,
        horse_id: '2020104567',
        horse_name: 'テストホース1',
        jockey_id: '01234',
        jockey_name: 'テスト騎手1',
        trainer_id: '05678',
        trainer_name: 'テスト調教師1',
        odds: 3.5,
        weight: 480.0,
        age: 4,
        sex: '牡',
        course_type: '芝',
        distance: 1600,
        grade: 'G3',
        class: 'OP',
        race_name: 'テストステークス',
        post_time: '15:30'
      },
      {
        race_date: '20250104',
        venue: '東京',
        race_number: 10,
        horse_number: 2,
        horse_id: '2021105678',
        horse_name: 'テストホース2',
        jockey_id: '01235',
        jockey_name: 'テスト騎手2',
        trainer_id: '05679',
        trainer_name: 'テスト調教師2',
        odds: 5.2,
        weight: 498.0,
        age: 3,
        sex: '牝',
        course_type: '芝',
        distance: 1600,
        grade: 'G3',
        class: 'OP',
        race_name: 'テストステークス',
        post_time: '15:30'
      }
    ]

    db.importTomorrowRaces(testRaces)
    console.log(`✅ 出走表インポート成功: ${testRaces.length}頭`)

    // 出走表取得
    const importedRaces = db.getTomorrowRaces('20250104')
    console.log(`✅ 出走表取得成功: ${importedRaces.length}頭`)
    importedRaces.forEach(r => {
      console.log(`   - [${r.horse_number}] ${r.horse_name} (${r.odds}倍)`)
    })

    // ============================================================
    // Test 3: race_predictions
    // ============================================================
    console.log('\n📋 Test 3: race_predictions')
    console.log('─'.repeat(50))

    // テスト用予想結果
    const testPredictions = [
      {
        race_date: '20250104',
        venue: '東京',
        race_number: 10,
        horse_number: 1,
        horse_name: 'テストホース1',
        factor_scores: JSON.stringify([
          {
            factor_id: 1,
            factor_name: '芝1600m東京・4歳以上RGS重視',
            score: 892.5,
            analysis: {
              win_count: 18,
              place_count: 56,
              win_hit_rate: 0.142,
              place_hit_rate: 0.441,
              win_corrected_recovery: 0.895,
              place_corrected_recovery: 1.068,
              matched_races: 127
            }
          }
        ]),
        total_score: 892.5,
        rank: 1
      },
      {
        race_date: '20250104',
        venue: '東京',
        race_number: 10,
        horse_number: 2,
        horse_name: 'テストホース2',
        factor_scores: JSON.stringify([
          {
            factor_id: 1,
            factor_name: '芝1600m東京・4歳以上RGS重視',
            score: 654.3,
            analysis: {
              win_count: 12,
              place_count: 43,
              win_hit_rate: 0.108,
              place_hit_rate: 0.387,
              win_corrected_recovery: 0.765,
              place_corrected_recovery: 0.943,
              matched_races: 111
            }
          }
        ]),
        total_score: 654.3,
        rank: 2
      }
    ]

    db.savePredictions(testPredictions)
    console.log(`✅ 予想結果保存成功: ${testPredictions.length}頭`)

    // 予想結果取得
    const predictions = db.getPredictionsByRace('20250104', '東京', 10)
    console.log(`✅ 予想結果取得成功: ${predictions.length}頭`)
    predictions.forEach(p => {
      console.log(`   - [${p.rank}位] ${p.horse_name} (得点: ${p.total_score})`)
    })

    // ============================================================
    // Test 4: horse_history_cache
    // ============================================================
    console.log('\n📋 Test 4: horse_history_cache')
    console.log('─'.repeat(50))

    // テスト用馬の過去成績
    const testHistory = {
      horse_id: '2020104567',
      horse_name: 'テストホース1',
      history: JSON.stringify([
        {
          race_date: '20241215',
          venue: '中山',
          race_number: 11,
          course_type: '芝',
          distance: 2500,
          grade: 'G1',
          class: 'OP',
          finish_position: 1,
          horse_number: 3,
          odds: 2.5,
          popularity: 1,
          margin: 0.2,
          final_time: '2:32.5',
          jockey_id: '01234',
          weight: 498
        },
        {
          race_date: '20241110',
          venue: '京都',
          race_number: 10,
          course_type: '芝',
          distance: 2000,
          grade: 'G2',
          class: 'OP',
          finish_position: 2,
          horse_number: 5,
          odds: 4.3,
          popularity: 2,
          margin: 0.5,
          final_time: '2:01.2',
          jockey_id: '01234',
          weight: 495
        }
      ]),
      last_race_date: '20241215',
      total_races: 12,
      wins: 5,
      places: 9
    }

    db.saveHorseHistory(testHistory)
    console.log(`✅ 馬の過去成績キャッシュ保存成功: ${testHistory.horse_name}`)

    // キャッシュ取得
    const cachedHistory = db.getHorseHistory('2020104567')
    if (cachedHistory) {
      console.log(`✅ キャッシュ取得成功: ${cachedHistory.horse_name}`)
      console.log(`   総出走: ${cachedHistory.total_races}回`)
      console.log(`   勝利: ${cachedHistory.wins}回`)
      console.log(`   複勝: ${cachedHistory.places}回`)
      console.log(`   最終出走: ${cachedHistory.last_race_date}`)
    }

    // ============================================================
    // Test 5: system_settings
    // ============================================================
    console.log('\n📋 Test 5: system_settings')
    console.log('─'.repeat(50))

    // 設定取得
    const jrdbPath = db.getSetting('jrdb_data_path')
    if (jrdbPath) {
      console.log(`✅ 設定取得成功: jrdb_data_path = ${jrdbPath.value}`)
    }

    // 設定更新
    db.setSetting('last_import_date', '"20250104"', '最終データ取り込み日')
    console.log(`✅ 設定更新成功: last_import_date`)

    // ============================================================
    // Test 6: データベース統計
    // ============================================================
    console.log('\n📋 Test 6: データベース統計')
    console.log('─'.repeat(50))

    const stats = db.getStats()
    console.log('✅ テーブル別レコード数:')
    Object.entries(stats).forEach(([table, count]) => {
      console.log(`   - ${table}: ${count}件`)
    })

    // ============================================================
    // クリーンアップ
    // ============================================================
    console.log('\n🧹 テストデータクリーンアップ')
    console.log('─'.repeat(50))

    db.deleteFactor(newFactorId)
    console.log(`✅ テスト用ファクター削除: ID=${newFactorId}`)

    db.clearTomorrowRaces('20250104')
    console.log(`✅ テスト用出走表削除: 20250104`)

    db.clearPredictions('20250104')
    console.log(`✅ テスト用予想結果削除: 20250104`)

    console.log('\n✅ 全テスト完了！')

  } catch (error) {
    console.error('\n❌ テスト失敗:', error)
    process.exit(1)
  } finally {
    closeDatabase()
  }
}

// 実行
testDatabase()
