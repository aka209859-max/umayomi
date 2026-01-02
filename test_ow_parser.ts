import * as fs from 'fs';
import { OWParser } from './src/parsers/jravan/ow';

async function testOWParser() {
  console.log('🧪 OW Parser Test Start\n');
  const buffer = fs.readFileSync('/home/user/uploaded_files/TFJ_OW0.DAT');
  const records = OWParser.parseFile(buffer);
  
  console.log('✅ Total records:', records.length, '\n');
  records.slice(0, 3).forEach((r, i) => {
    console.log(`--- Record ${i + 1} ---`);
    console.log(`登録日: ${r.registrationDate}`);
    console.log(`馬主ID: ${r.ownerId}`);
    console.log(`馬主名: ${r.ownerName}`);
    console.log(`馬主名カナ: ${r.ownerNameKana}`);
    console.log(`英語名: ${r.ownerNameEng}`);
    console.log(`登録年: ${r.registrationYear}\n`);
  });
  console.log('✅ OW Parser Test Completed!');
}

testOWParser().catch(console.error);
