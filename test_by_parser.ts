import * as fs from 'fs';
import { BYParser } from './src/parsers/jravan/by';

async function testBYParser() {
  console.log('🧪 BY/HY Parser Test Start\n');
  const buffer = fs.readFileSync('/home/user/uploaded_files/BY20240.DAT');
  const records = BYParser.parseFile(buffer);
  
  console.log('✅ Total records:', records.length, '\n');
  records.slice(0, 3).forEach((r, i) => {
    console.log(`--- Record ${i + 1} ---`);
    console.log(`レース日: ${r.raceDate}`);
    console.log(`馬ID: ${r.horseId}`);
    console.log(`馬名: ${r.horseName}`);
    console.log(`コメント: ${r.comment}\n`);
  });
  console.log('✅ BY/HY Parser Test Completed!');
}

testBYParser().catch(console.error);
