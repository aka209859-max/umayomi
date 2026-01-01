#!/usr/bin/env tsx

/**
 * JRDB Parser テストスクリプト
 * 
 * 実行: npx tsx scripts/test_jrdb_parsers.ts
 */

import { readFileSync } from 'fs'
import { SEDParser, TYBParser, HJCParser } from '../src/parsers/JRDBParser'

// ===== テストデータ読み込み =====

console.log('🔍 JRDB Parser テスト開始\n')

const testDir = '/home/user/uploaded_files'

// ===== SED Parser テスト =====

console.log('📊 SED Parser（成績データ）テスト')
console.log('=' .repeat(60))

const sedData = readFileSync(`${testDir}/SED160109.txt`, 'utf-8')
const sedLines = sedData.split('\n').filter(line => line.length > 100)

console.log(`総行数: ${sedLines.length}行`)
console.log(`\n最初の3行をパース:\n`)

for (let i = 0; i < Math.min(3, sedLines.length); i++) {
  const line = sedLines[i]
  console.log(`--- 行 ${i + 1} ---`)
  console.log(`生データ（最初の50文字）: ${line.substring(0, 50)}`)
  
  const record = SEDParser.parse(line)
  if (record) {
    console.log('パース結果:')
    console.log(`  レースキー: ${record.raceKey}`)
    console.log(`  場コード: ${record.trackCode}`)
    console.log(`  レース日付: ${record.raceDate.toLocaleDateString('ja-JP')}`)
    console.log(`  レース番号: ${record.raceNumber}`)
    console.log(`  馬番: ${record.horseNumber}`)
    console.log(`  着順: ${record.finishPosition}位`)
    console.log(`  人気: ${record.popularity}番人気`)
    console.log(`  タイム: ${record.finishTime}秒`)
    console.log(`  着差: ${record.margin}`)
    console.log(`  単勝オッズ: ${record.winOdds}`)
  } else {
    console.log('  ❌ パース失敗')
  }
  console.log()
}

// ===== TYB Parser テスト =====

console.log('\n📊 TYB Parser（出馬表データ）テスト')
console.log('='.repeat(60))

const tybData = readFileSync(`${testDir}/TYB160109.txt`, 'utf-8')
const tybLines = tybData.split('\n').filter(line => line.length > 60)

console.log(`総行数: ${tybLines.length}行`)
console.log(`\n最初の3行をパース:\n`)

for (let i = 0; i < Math.min(3, tybLines.length); i++) {
  const line = tybLines[i]
  console.log(`--- 行 ${i + 1} ---`)
  console.log(`生データ（最初の50文字）: ${line.substring(0, 50)}`)
  
  const record = TYBParser.parse(line)
  if (record) {
    console.log('パース結果:')
    console.log(`  レースキー: ${record.raceKey}`)
    console.log(`  馬番: ${record.horseNumber}`)
    console.log(`  単勝オッズ: ${record.winOdds}`)
    console.log(`  指数1: ${record.index1}`)
    console.log(`  指数2: ${record.index2}`)
    console.log(`  指数3: ${record.index3}`)
    console.log(`  指数4: ${record.index4}`)
    console.log(`  指数5: ${record.index5}`)
    console.log(`  指数合計: ${record.indexTotal}`)
    console.log(`  血統コード: ${record.bloodCode}`)
    console.log(`  IDM: ${record.idmScore}`)
    console.log(`  騎手指数: ${record.jockeyScore}`)
  } else {
    console.log('  ❌ パース失敗')
  }
  console.log()
}

// ===== HJC Parser テスト =====

console.log('\n📊 HJC Parser（払戻金データ）テスト')
console.log('='.repeat(60))

const hjcData = readFileSync(`${testDir}/HJC160109.txt`, 'utf-8')
const hjcLines = hjcData.split('\n').filter(line => line.length > 100)

console.log(`総行数: ${hjcLines.length}行`)
console.log(`\n最初の3行をパース:\n`)

for (let i = 0; i < Math.min(3, hjcLines.length); i++) {
  const line = hjcLines[i]
  console.log(`--- 行 ${i + 1} ---`)
  console.log(`生データ（最初の50文字）: ${line.substring(0, 50)}`)
  
  const record = HJCParser.parse(line)
  if (record) {
    console.log('パース結果:')
    console.log(`  レースキー: ${record.raceKey}`)
    console.log(`  単勝払戻: ${record.winPayback}円`)
    console.log(`  複勝払戻1: ${record.placePayback1}円`)
    console.log(`  複勝払戻2: ${record.placePayback2}円`)
    console.log(`  複勝払戻3: ${record.placePayback3}円`)
    console.log(`  馬連払戻: ${record.quinellaPayback}円`)
    console.log(`  馬単払戻: ${record.exactaPayback}円`)
    console.log(`  ワイド1: ${record.widePayback1}円`)
    console.log(`  ワイド2: ${record.widePayback2}円`)
    console.log(`  ワイド3: ${record.widePayback3}円`)
    console.log(`  三連複: ${record.trio}円`)
    console.log(`  三連単: ${record.trifecta}円`)
  } else {
    console.log('  ❌ パース失敗')
  }
  console.log()
}

// ===== サマリー =====

console.log('\n📈 テストサマリー')
console.log('='.repeat(60))

const sedSuccess = sedLines.filter(line => SEDParser.parse(line) !== null).length
const tybSuccess = tybLines.filter(line => TYBParser.parse(line) !== null).length
const hjcSuccess = hjcLines.filter(line => HJCParser.parse(line) !== null).length

console.log(`SED: ${sedSuccess}/${sedLines.length}行 パース成功 (${(sedSuccess/sedLines.length*100).toFixed(1)}%)`)
console.log(`TYB: ${tybSuccess}/${tybLines.length}行 パース成功 (${(tybSuccess/tybLines.length*100).toFixed(1)}%)`)
console.log(`HJC: ${hjcSuccess}/${hjcLines.length}行 パース成功 (${(hjcSuccess/hjcLines.length*100).toFixed(1)}%)`)

console.log('\n✅ テスト完了\n')
