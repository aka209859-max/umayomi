import * as fs from 'fs';
import { JGParser } from './src/parsers/jravan/jg';

async function testJGParser() {
  console.log('🧪 JG Parser Test Start\n');
  const samplePath = '/home/user/uploaded_files/JG250105.DAT';
  const buffer = fs.readFileSync(samplePath);
  const records = JGParser.parseFile(buffer);
  
  console.log('✅ Total records:', records.length, '\n');
  records.slice(0, 3).forEach((r, i) => {
    console.log(`--- Record ${i + 1} ---`);
    console.log(`レース日: ${r.raceDate}`);
    console.log(`場コード: ${r.trackCode}, レース: ${r.raceNumber}, 馬番: ${r.horseNumber}`);
    console.log(`馬ID: ${r.horseId}`);
    console.log(`騎手名: ${r.jockeyName}`);
    console.log(`オッズ: ${r.odds}\n`);
  });
  console.log('✅ JG Parser Test Completed!');
}

testJGParser().catch(console.error);
