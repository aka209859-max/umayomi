/**
 * JRDBパーサーテストスクリプト
 * 
 * uploaded_filesのサンプルデータを使ってパーサーをテストします
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseKYI, groupByRace, getHorseHistory } from '../src/parsers/jrdb/kyi';
import { parseBAC, groupBACByRace } from '../src/parsers/jrdb/bac';
import { parseKAB, groupByDate } from '../src/parsers/jrdb/kab';

// ファイルパス
const UPLOADED_FILES_DIR = '/home/user/uploaded_files';

/**
 * ファイルを読み込む (UTF-8)
 */
function readFile(filepath: string): string {
  try {
    return fs.readFileSync(filepath, 'utf-8');
  } catch (error) {
    console.error('File read error:', filepath, error);
    return '';
  }
}

/**
 * KYIパーサーのテスト
 */
function testKYIParser() {
  console.log('\n=== KYI Parser Test ===\n');
  
  const filepath = path.join(UPLOADED_FILES_DIR, 'KYI250105.txt');
  
  if (!fs.existsSync(filepath)) {
    console.error('KYI250105.txt not found!');
    return;
  }
  
  const content = readFile(filepath);
  const records = parseKYI(content);
  
  console.log(`✅ Parsed ${records.length} horses`);
  
  // 最初の3件を表示
  console.log('\n--- Sample Records (Top 3) ---');
  records.slice(0, 3).forEach((record, index) => {
    console.log(`\nRecord ${index + 1}:`);
    console.log(`  Race Key: ${record.race_key}`);
    console.log(`  Horse ID: ${record.horse_id}`);
    console.log(`  Horse Name: ${record.horse_name}`);
    console.log(`  Sex/Age: ${record.sex}${record.age}`);
    console.log(`  Odds: ${record.odds}`);
    console.log(`  Popularity: ${record.popularity}`);
    console.log(`  Jockey: ${record.jockey_name}`);
    console.log(`  Trainer: ${record.trainer_name}`);
    console.log(`  Weight: ${record.weight}kg`);
    console.log(`  Horse Weight: ${record.horse_weight}kg (${record.horse_weight_diff >= 0 ? '+' : ''}${record.horse_weight_diff})`);
  });
  
  // レース別にグループ化
  const grouped = groupByRace(records);
  console.log(`\n✅ Grouped into ${grouped.size} races`);
  
  // 最初のレースの出走馬を表示
  const firstRace = Array.from(grouped.keys())[0];
  const firstRaceHorses = grouped.get(firstRace);
  console.log(`\n--- Race ${firstRace} (${firstRaceHorses?.length} horses) ---`);
  firstRaceHorses?.forEach((horse, index) => {
    console.log(`  ${index + 1}. ${horse.horse_name} (${horse.sex}${horse.age}) - Jockey: ${horse.jockey_name}`);
  });
  
  return records;
}

/**
 * BACパーサーのテスト
 */
function testBACParser() {
  console.log('\n\n=== BAC Parser Test ===\n');
  
  const filepath = path.join(UPLOADED_FILES_DIR, 'BAC250105.txt');
  
  if (!fs.existsSync(filepath)) {
    console.error('BAC250105.txt not found!');
    return;
  }
  
  const content = readFile(filepath);
  const records = parseBAC(content);
  
  console.log(`✅ Parsed ${records.length} race info records`);
  
  // 最初の3件を表示
  console.log('\n--- Sample Records (Top 3) ---');
  records.slice(0, 3).forEach((record, index) => {
    console.log(`\nRecord ${index + 1}:`);
    console.log(`  Race Key: ${record.race_key}`);
    console.log(`  Horse Number: ${record.horse_number}`);
    console.log(`  Date: ${record.year}/${record.month_day}`);
    console.log(`  Track: ${record.track_code}`);
    console.log(`  Race Number: ${record.race_number}`);
    console.log(`  Prize 1st: ¥${record.prize_1st.toLocaleString()}`);
    console.log(`  Prize 2nd: ¥${record.prize_2nd.toLocaleString()}`);
  });
  
  return records;
}

/**
 * KABパーサーのテスト
 */
function testKABParser() {
  console.log('\n\n=== KAB Parser Test ===\n');
  
  const filepath = path.join(UPLOADED_FILES_DIR, 'KAB250105.txt');
  
  if (!fs.existsSync(filepath)) {
    console.error('KAB250105.txt not found!');
    return;
  }
  
  const content = readFile(filepath);
  const records = parseKAB(content);
  
  console.log(`✅ Parsed ${records.length} race results`);
  
  // 全レコードを表示
  console.log('\n--- All Records ---');
  records.forEach((record, index) => {
    console.log(`\nRecord ${index + 1}:`);
    console.log(`  Race Key: ${record.race_key}`);
    console.log(`  Date: ${record.race_date}`);
    console.log(`  Track: ${record.track_code} (${record.race_name})`);
    console.log(`  Race Number: ${record.race_number}`);
    console.log(`  Distance: ${record.distance}m`);
    console.log(`  Entry Count: ${record.entry_count} horses`);
  });
  
  return records;
}

/**
 * 統合テスト: 馬の過去成績を取得
 */
function testHorseHistory(kyiRecords: any[]) {
  console.log('\n\n=== Horse History Test ===\n');
  
  if (!kyiRecords || kyiRecords.length === 0) {
    console.error('No KYI records available');
    return;
  }
  
  // 最初の馬のIDを取得
  const testHorseId = kyiRecords[0].horse_id;
  const testHorseName = kyiRecords[0].horse_name;
  
  console.log(`Testing with Horse: ${testHorseName} (ID: ${testHorseId})`);
  
  // この馬の全レース履歴を取得
  const history = getHorseHistory(kyiRecords, testHorseId);
  
  console.log(`\n✅ Found ${history.length} races for ${testHorseName}`);
  
  // 履歴を表示
  history.forEach((race, index) => {
    console.log(`\n  Race ${index + 1}:`);
    console.log(`    Date: ${race.race_date}`);
    console.log(`    Track: ${race.track_code}`);
    console.log(`    Distance: ${race.distance}m`);
    console.log(`    Finish: ${race.finish_position || 'N/A'}`);
    console.log(`    Odds: ${race.odds}`);
    console.log(`    Popularity: ${race.popularity}`);
  });
}

/**
 * メイン実行
 */
async function main() {
  console.log('🚀 Starting JRDB Parser Tests...\n');
  console.log('='.repeat(60));
  
  try {
    // KYIテスト
    const kyiRecords = testKYIParser();
    
    // BACテスト
    const bacRecords = testBACParser();
    
    // KABテスト
    const kabRecords = testKABParser();
    
    // 統合テスト
    if (kyiRecords) {
      testHorseHistory(kyiRecords);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('\n✅ All tests completed!\n');
    
    // 統計情報
    console.log('📊 Summary:');
    console.log(`  - KYI Records: ${kyiRecords?.length || 0} horses`);
    console.log(`  - BAC Records: ${bacRecords?.length || 0} race infos`);
    console.log(`  - KAB Records: ${kabRecords?.length || 0} race results`);
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

// 実行
main();
