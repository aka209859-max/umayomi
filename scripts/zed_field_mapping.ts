/**
 * ZED Field Mapping - Reverse Engineering
 * 
 * 実際のデータから各フィールドの位置を特定
 */
import * as fs from 'fs';
import iconv from 'iconv-lite';

const SAMPLE_FILE = '/tmp/zed_sample.txt';

console.log('🔍 ZED Field Mapping Analysis\n');

const buffer = fs.readFileSync(SAMPLE_FILE);
const decoded = iconv.decode(buffer, 'shift_jis');
const lines = decoded.split('\r\n').filter(l => l.trim().length > 0);

console.log(`Total lines: ${lines.length}\n`);

// 複数行を比較して一貫性のあるフィールドを特定
const sampleLines = lines.slice(0, 5);

console.log('='.repeat(100));
console.log('FIELD MAPPING (based on actual data)');
console.log('='.repeat(100) + '\n');

// 基本情報（固定位置）
console.log('📍 Basic Info Fields:\n');
sampleLines.forEach((line, idx) => {
  console.log(`Line ${idx + 1}:`);
  console.log(`  [0-2]    場コード:     "${line.substring(0, 2)}"`);
  console.log(`  [2-4]    レース番号:   "${line.substring(2, 4)}"`);
  console.log(`  [4-6]    曜日:         "${line.substring(4, 6)}"`);
  console.log(`  [6-8]    月:           "${line.substring(6, 8)}"`);
  console.log(`  [8-10]   日:           "${line.substring(8, 10)}"`);
  console.log(`  [10-18]  レースID:     "${line.substring(10, 18)}"`);
  console.log(`  [18-26]  開催年月日:   "${line.substring(18, 26)}"`);
  console.log(`  [26-76]  レース名:     "${line.substring(26, 76).trim()}"`);
  console.log('');
});

// レース名の後のフィールド（位置76以降）
console.log('\n📍 After Race Name (76+):\n');
sampleLines.forEach((line, idx) => {
  console.log(`Line ${idx + 1}:`);
  console.log(`  [76-78]   グレード?:    "${line.substring(76, 78).trim()}"`);
  console.log(`  [78-82]   距離?:        "${line.substring(78, 82).trim()}"`);
  console.log(`  [82-83]   コース種別?:  "${line.substring(82, 83).trim()}"`);
  console.log(`  [83-85]   馬場状態?:    "${line.substring(83, 85).trim()}"`);
  console.log(`  [85-86]   天候?:        "${line.substring(85, 86).trim()}"`);
  console.log(`  [86-88]   クラス?:      "${line.substring(86, 88).trim()}"`);
  console.log(`  [88-89]   年齢制限?:    "${line.substring(88, 89).trim()}"`);
  console.log(`  [89-90]   負担重量?:    "${line.substring(89, 90).trim()}"`);
  console.log('');
});

// 馬番周辺（推測）
console.log('\n📍 Horse/Jockey Area (140-200):\n');
sampleLines.forEach((line, idx) => {
  console.log(`Line ${idx + 1}:`);
  console.log(`  [140-160]: "${line.substring(140, 160).trim()}"`);
  console.log(`  [160-180]: "${line.substring(160, 180).trim()}"`);
  console.log(`  [180-200]: "${line.substring(180, 200).trim()}"`);
  console.log('');
});

// 数値データエリア（200-300）
console.log('\n📍 Numeric Data Area (200-300):\n');
sampleLines.forEach((line, idx) => {
  console.log(`Line ${idx + 1}:`);
  console.log(`  [200-220]: "${line.substring(200, 220)}"`);
  console.log(`  [220-240]: "${line.substring(220, 240)}"`);
  console.log(`  [240-260]: "${line.substring(240, 260)}"`);
  console.log(`  [260-280]: "${line.substring(260, 280)}"`);
  console.log(`  [280-300]: "${line.substring(280, 300)}"`);
  console.log('');
});

// オッズ・着順エリア（300-350）
console.log('\n📍 Odds/Finish Area (300-350):\n');
sampleLines.forEach((line, idx) => {
  console.log(`Line ${idx + 1}:`);
  console.log(`  [300-320]: "${line.substring(300, 320)}"`);
  console.log(`  [320-340]: "${line.substring(320, 340)}"`);
  console.log(`  [340-360]: "${line.substring(340, 360)}"`);
  console.log('');
});

// 末尾エリア（360-end）
console.log('\n📍 Tail Area (360+):\n');
sampleLines.forEach((line, idx) => {
  console.log(`Line ${idx + 1} (length: ${line.length}):`);
  if (line.length > 360) {
    console.log(`  [360-end]: "${line.substring(360)}"`);
  }
  console.log('');
});

console.log('\n' + '='.repeat(100));
console.log('Analysis Complete');
console.log('='.repeat(100));
