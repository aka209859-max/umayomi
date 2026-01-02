/**
 * SE Parser テストスクリプト
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { SEParser, SERecord } from './src/parsers/jravan/se';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testSEParser() {
  console.log('🧪 SE Parser Test Start\n');

  // サンプルファイル読み込み
  const samplePath = path.join('/home/user/uploaded_files/SU202559.DAT');
  
  if (!fs.existsSync(samplePath)) {
    console.error('❌ Sample file not found:', samplePath);
    return;
  }

  console.log('📂 Sample file:', samplePath);
  
  const buffer = fs.readFileSync(samplePath);
  console.log('📊 File size:', buffer.length, 'bytes\n');

  // パース実行
  const records = SEParser.parseFile(buffer);
  
  console.log('✅ Parse completed!');
  console.log('📈 Total records:', records.length);
  console.log('');

  // 最初の3件表示
  console.log('📋 First 3 records:\n');
  records.slice(0, 3).forEach((record, index) => {
    console.log(`--- Record ${index + 1} ---`);
    console.log(`識別子: ${record.recordId}`);
    console.log(`レース日: ${record.raceDate}`);
    console.log(`場コード: ${record.trackCode}`);
    console.log(`レース番号: ${record.raceNumber}`);
    console.log(`馬番: ${record.horseNumber}`);
    console.log(`馬ID: ${record.horseId}`);
    console.log(`馬名: ${record.horseName}`);
    console.log(`着順: ${record.finishPosition}`);
    console.log(`人気: ${record.popularity}`);
    console.log(`タイム: ${record.finishTime}秒`);
    console.log(`距離: ${record.distance}m`);
    console.log(`騎手: ${record.jockeyName} (${record.jockeyId})`);
    console.log(`調教師: ${record.trainerName} (${record.trainerId})`);
    console.log(`オッズ: ${record.odds}`);
    console.log(`馬体重: ${record.horseWeight}kg (${record.weightChange >= 0 ? '+' : ''}${record.weightChange}kg)`);
    console.log(`通過: ${record.passing1}-${record.passing2}-${record.passing3}-${record.passing4}`);
    console.log(`賞金: ${record.prize.toLocaleString()}円`);
    console.log('');
  });

  // 統計情報
  console.log('📊 Statistics:');
  console.log(`- レース日範囲: ${records[0]?.raceDate} ~ ${records[records.length - 1]?.raceDate}`);
  console.log(`- 平均タイム: ${(records.reduce((sum, r) => sum + r.finishTime, 0) / records.length).toFixed(2)}秒`);
  console.log(`- 平均馬体重: ${(records.reduce((sum, r) => sum + r.horseWeight, 0) / records.length).toFixed(1)}kg`);
  console.log(`- 1着回数: ${records.filter(r => r.finishPosition === 1).length}`);
  console.log('');

  console.log('✅ SE Parser Test Completed!');
}

testSEParser().catch(console.error);
