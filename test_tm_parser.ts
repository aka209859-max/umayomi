/**
 * TM Parser テストスクリプト
 */

import * as fs from 'fs';
import { TMParser } from './src/parsers/jravan/tm';

async function testTMParser() {
  console.log('🧪 TM Parser Test Start\n');

  const samplePath = '/home/user/uploaded_files/TM250101.DAT';
  
  if (!fs.existsSync(samplePath)) {
    console.error('❌ Sample file not found:', samplePath);
    return;
  }

  console.log('📂 Sample file:', samplePath);
  
  const buffer = fs.readFileSync(samplePath);
  console.log('📊 File size:', buffer.length, 'bytes\n');

  // パース実行
  const records = TMParser.parseFile(buffer);
  
  console.log('✅ Parse completed!');
  console.log('📈 Total records:', records.length);
  console.log('');

  // 最初の3件表示
  console.log('📋 First 3 records:\n');
  records.slice(0, 3).forEach((record, index) => {
    console.log(`--- Record ${index + 1} ---`);
    console.log(`識別子: ${record.recordId}`);
    console.log(`レース日: ${record.raceDate}`);
    console.log(`データ作成日: ${record.dataDate}`);
    console.log(`場コード: ${record.trackCode}`);
    console.log(`レース番号: ${record.raceNumber}`);
    console.log(`馬番: ${record.horseNumber}`);
    console.log(`調教回数: ${record.trainingData.length}`);
    console.log(`調教データ:`);
    record.trainingData.forEach(t => {
      console.log(`  - 第${t.trainingNumber}回: ${(t.trainingTime / 1000).toFixed(2)}秒`);
    });
    console.log('');
  });

  // 統計情報
  console.log('📊 Statistics:');
  const avgTrainingCount = records.reduce((sum, r) => sum + r.trainingData.length, 0) / records.length;
  console.log(`- 平均調教回数: ${avgTrainingCount.toFixed(1)}回`);
  console.log(`- レース日範囲: ${records[0]?.raceDate} ~ ${records[records.length - 1]?.raceDate}`);
  console.log('');

  console.log('✅ TM Parser Test Completed!');
}

testTMParser().catch(console.error);
