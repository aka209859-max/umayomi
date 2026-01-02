import * as fs from 'fs';
import { SCHDParser } from './src/parsers/jravan/schd';

async function testSCHDParser() {
  console.log('🧪 SCHD Parser Test Start\n');
  const buffer = fs.readFileSync('/home/user/uploaded_files/SCHD2025.DAT');
  const records = SCHDParser.parseFile(buffer);
  
  console.log('✅ Total records:', records.length, '\n');
  records.slice(0, 3).forEach((r, i) => {
    console.log(`--- Record ${i + 1} ---`);
    console.log(`レース日: ${r.raceDate}`);
    console.log(`場コード: ${r.trackCode}, レース番号: ${r.raceNumber}`);
    console.log(`グレード: ${r.grade}`);
    console.log(`距離: ${r.distance}m`);
    console.log(`レース名: ${r.raceName}`);
    console.log(`略称: ${r.raceNameShort}\n`);
  });
  console.log('✅ SCHD Parser Test Completed!');
}

testSCHDParser().catch(console.error);
