/**
 * ZEDファイルフォーマット分析スクリプト
 */
import * as fs from 'fs';
import iconv from 'iconv-lite';

const ZED_FILE = '/home/user/uploaded_files/ZED250105.txt';

console.log('🔍 ZED File Format Analysis\n');
console.log('File:', ZED_FILE, '\n');

// ファイル読み込み
const buffer = fs.readFileSync(ZED_FILE);
const content = iconv.decode(buffer, 'shift_jis');
const lines = content.split('\n').filter(l => l.trim().length > 0);

console.log('📊 Basic Info:');
console.log('Total lines:', lines.length);
console.log('First line length:', lines[0].length, 'characters');
console.log('');

// 最初の5行の長さを確認
console.log('📏 Line lengths:');
for (let i = 0; i < Math.min(10, lines.length); i++) {
  console.log(`Line ${i+1}: ${lines[i].length} chars`);
}
console.log('');

// 最初の行を詳細分析
const line = lines[0];

console.log('📝 First line (first 200 characters):\n');
console.log(line.substring(0, 200));
console.log('\n' + '='.repeat(80) + '\n');

// Position-by-position analysis
console.log('📍 Position-by-position analysis (0-150):\n');

const printSection = (start: number, end: number, label: string) => {
  console.log(`\n${label} [${start}-${end}]:`);
  const section = line.substring(start, end);
  console.log(`  Raw: "${section}"`);
  console.log(`  Trimmed: "${section.trim()}"`);
  console.log(`  Length: ${section.length} chars`);
};

// 既知のフィールド位置（Pythonパーサーベース）
printSection(0, 2, '場コード');
printSection(2, 4, 'レース番号');
printSection(4, 6, '曜日');
printSection(6, 8, '月');
printSection(8, 10, '日');
printSection(10, 18, 'レースID');
printSection(18, 26, '開催年月日');
printSection(26, 76, 'レース名');
printSection(76, 78, 'グレード');
printSection(78, 82, '距離');
printSection(82, 83, 'コース種別');
printSection(83, 85, '馬場状態');
printSection(85, 86, '天候');
printSection(86, 88, 'クラス');
printSection(88, 89, '年齢制限');
printSection(89, 90, '負担重量');

// 賞金フィールド
console.log('\n💰 Prize fields:');
printSection(90, 98, '1着賞金');
printSection(98, 106, '2着賞金');
printSection(106, 114, '3着賞金');
printSection(114, 122, '4着賞金');
printSection(122, 130, '5着賞金');

printSection(130, 132, '出走頭数');
printSection(132, 133, 'コース');

// 残りのフィールド（推測）
console.log('\n🔍 Additional fields (guessing):');
printSection(133, 150, '不明フィールド1');
printSection(150, 200, '不明フィールド2');
printSection(200, 250, '不明フィールド3');
printSection(250, 300, '不明フィールド4');
printSection(300, 350, '不明フィールド5');
printSection(350, 400, '不明フィールド6');
printSection(400, 450, '不明フィールド7');
printSection(450, 500, '不明フィールド8');
printSection(500, line.length, '不明フィールド9');

// 複数行比較
console.log('\n\n📋 Multiple lines comparison (first 100 chars):\n');
for (let i = 0; i < Math.min(5, lines.length); i++) {
  console.log(`Line ${i+1}:`, lines[i].substring(0, 100));
}
