/**
 * UMAYOMI - JRDB一括取り込みスクリプト
 * 
 * CEO PCでの実行を想定（E:\UMAYOMI\downloads_weekly\）
 * 
 * 対象パーサー:
 * - KYI (馬別出走情報)
 * - BAC (馬基本情報)
 * - KAB (レース結果サマリー)
 * - CHA (厩舎コメント)
 * - JOA (騎手データ)
 * - SED (成績データ)
 * - TYB (出馬表データ)
 */

import * as fs from 'fs';
import * as path from 'path';
import Database from 'better-sqlite3';
import { parseKYI } from '../src/parsers/jrdb/kyi';
import { parseBAC } from '../src/parsers/jrdb/bac';
import { parseKAB } from '../src/parsers/jrdb/kab';
import { parseCHA } from '../src/parsers/jrdb/cha';
import { parseJOA } from '../src/parsers/jrdb/joa';
import { parseSED } from '../src/parsers/jrdb/sed';
import { parseTYB } from '../src/parsers/jrdb/tyb';

// ================================================
// 設定
// ================================================

const JRDB_BASE_PATH = 'E:\\UMAYOMI\\downloads_weekly';
const DB_PATH = 'E:\\UMAYOMI\\umayomi.db';

// ファイルタイプとディレクトリのマッピング
const FILE_TYPE_DIRS = {
  KYI: 'kyi_extracted',
  BAC: 'bac_extracted',
  KAB: 'kab_extracted',
  CHA: 'cha_extracted',
  JOA: 'joa_extracted',
  SED: 'sed_extracted',
  TYB: 'tyb_extracted'
};

// ================================================
// メイン処理
// ================================================

async function importJRDBData() {
  console.log('🚀 JRDB一括取り込み開始\n');
  console.log(`📂 読み込み元: ${JRDB_BASE_PATH}`);
  console.log(`💾 保存先DB: ${DB_PATH}\n`);

  // データベース接続
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');

  try {
    // 1. KYI (馬別出走情報)
    await importKYI(db);
    
    // 2. BAC (馬基本情報)
    await importBAC(db);
    
    // 3. KAB (レース結果サマリー)
    await importKAB(db);
    
    // 4. CHA (厩舎コメント)
    await importCHA(db);
    
    // 5. JOA (騎手データ)
    await importJOA(db);
    
    // 6. SED (成績データ)
    await importSED(db);
    
    // 7. TYB (出馬表データ)
    await importTYB(db);

    console.log('\n✅ JRDB一括取り込み完了！');
  } catch (error) {
    console.error('❌ エラー発生:', error);
    throw error;
  } finally {
    db.close();
  }
}

// ================================================
// KYI取り込み
// ================================================

async function importKYI(db: Database.Database) {
  console.log('📊 KYI (馬別出走情報) 取り込み中...');
  
  const dirPath = path.join(JRDB_BASE_PATH, FILE_TYPE_DIRS.KYI);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  ディレクトリが見つかりません: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath).filter(f => f.startsWith('KYI') && f.endsWith('.txt'));
  console.log(`   ファイル数: ${files.length}件`);

  const stmt = db.prepare(`
    INSERT INTO jrdb_kyi (
      race_key, race_date, track_code, race_number, horse_number, 
      horse_id, horse_name, sex, age, jockey_code, jockey_name,
      trainer_code, trainer_name, weight, weight_change, odds, 
      popularity, raw_data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let totalCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const records = parseKYI(content);
    
    for (const record of records) {
      stmt.run(
        record.raceKey || '',
        record.raceDate || '',
        record.trackCode || '',
        record.raceNumber || 0,
        record.horseNumber || 0,
        record.horseId || '',
        record.horseName || '',
        record.sex || '',
        record.age || 0,
        record.jockeyCode || '',
        record.jockeyName || '',
        record.trainerCode || '',
        record.trainerName || '',
        record.weight || 0,
        record.weightChange || 0,
        record.odds || 0,
        record.popularity || 0,
        record.rawData || ''
      );
      totalCount++;
    }
  }

  console.log(`   ✅ 取り込み完了: ${totalCount}件\n`);
}

// ================================================
// BAC取り込み
// ================================================

async function importBAC(db: Database.Database) {
  console.log('📊 BAC (馬基本情報) 取り込み中...');
  
  const dirPath = path.join(JRDB_BASE_PATH, FILE_TYPE_DIRS.BAC);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  ディレクトリが見つかりません: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath).filter(f => f.startsWith('BAC') && f.endsWith('.txt'));
  console.log(`   ファイル数: ${files.length}件`);

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO jrdb_bac (
      horse_id, horse_name, sex, birth_date, sire_name, dam_name,
      breeder, owner, raw_data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let totalCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const records = parseBAC(content);
    
    for (const record of records) {
      stmt.run(
        record.horseId || '',
        record.horseName || '',
        record.sex || '',
        record.birthDate || '',
        record.sireName || '',
        record.damName || '',
        record.breeder || '',
        record.owner || '',
        record.rawData || ''
      );
      totalCount++;
    }
  }

  console.log(`   ✅ 取り込み完了: ${totalCount}件\n`);
}

// ================================================
// KAB取り込み
// ================================================

async function importKAB(db: Database.Database) {
  console.log('📊 KAB (レース結果サマリー) 取り込み中...');
  
  const dirPath = path.join(JRDB_BASE_PATH, FILE_TYPE_DIRS.KAB);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  ディレクトリが見つかりません: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath).filter(f => f.startsWith('KAB') && f.endsWith('.txt'));
  console.log(`   ファイル数: ${files.length}件`);

  const stmt = db.prepare(`
    INSERT INTO jrdb_kab (
      race_key, race_date, track_code, race_number, race_name,
      grade, distance, course_type, weather, track_condition, raw_data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let totalCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const records = parseKAB(content);
    
    for (const record of records) {
      stmt.run(
        record.raceKey || '',
        record.raceDate || '',
        record.trackCode || '',
        record.raceNumber || 0,
        record.raceName || '',
        record.grade || '',
        record.distance || 0,
        record.courseType || '',
        record.weather || '',
        record.trackCondition || '',
        record.rawData || ''
      );
      totalCount++;
    }
  }

  console.log(`   ✅ 取り込み完了: ${totalCount}件\n`);
}

// ================================================
// CHA取り込み
// ================================================

async function importCHA(db: Database.Database) {
  console.log('📊 CHA (厩舎コメント) 取り込み中...');
  
  const dirPath = path.join(JRDB_BASE_PATH, FILE_TYPE_DIRS.CHA);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  ディレクトリが見つかりません: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath).filter(f => f.startsWith('CHA') && f.endsWith('.txt'));
  console.log(`   ファイル数: ${files.length}件`);

  const stmt = db.prepare(`
    INSERT INTO jrdb_cha (
      race_key, horse_id, comment, raw_data
    ) VALUES (?, ?, ?, ?)
  `);

  let totalCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const records = parseCHA(content);
    
    for (const record of records) {
      stmt.run(
        record.raceKey || '',
        record.horseId || '',
        record.comment || '',
        record.rawData || ''
      );
      totalCount++;
    }
  }

  console.log(`   ✅ 取り込み完了: ${totalCount}件\n`);
}

// ================================================
// JOA取り込み
// ================================================

async function importJOA(db: Database.Database) {
  console.log('📊 JOA (騎手データ) 取り込み中...');
  
  const dirPath = path.join(JRDB_BASE_PATH, FILE_TYPE_DIRS.JOA);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  ディレクトリが見つかりません: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath).filter(f => f.startsWith('JOA') && f.endsWith('.txt'));
  console.log(`   ファイル数: ${files.length}件`);

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO jrdb_joa (
      jockey_code, jockey_name, affiliation, birth_date, raw_data
    ) VALUES (?, ?, ?, ?, ?)
  `);

  let totalCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const records = parseJOA(content);
    
    for (const record of records) {
      stmt.run(
        record.jockeyCode || '',
        record.jockeyName || '',
        record.affiliation || '',
        record.birthDate || '',
        record.rawData || ''
      );
      totalCount++;
    }
  }

  console.log(`   ✅ 取り込み完了: ${totalCount}件\n`);
}

// ================================================
// SED取り込み
// ================================================

async function importSED(db: Database.Database) {
  console.log('📊 SED (成績データ) 取り込み中...');
  
  const dirPath = path.join(JRDB_BASE_PATH, FILE_TYPE_DIRS.SED);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  ディレクトリが見つかりません: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath).filter(f => f.startsWith('SED') && f.endsWith('.txt'));
  console.log(`   ファイル数: ${files.length}件`);

  const stmt = db.prepare(`
    INSERT INTO jrdb_sed (
      race_key, race_date, track_code, race_number, horse_number,
      finish_position, finish_time, raw_data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let totalCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const records = parseSED(content);
    
    for (const record of records) {
      stmt.run(
        record.raceKey || '',
        record.raceDate || '',
        record.trackCode || '',
        record.raceNumber || 0,
        record.horseNumber || 0,
        record.finishPosition || 0,
        record.finishTime || 0,
        record.rawData || ''
      );
      totalCount++;
    }
  }

  console.log(`   ✅ 取り込み完了: ${totalCount}件\n`);
}

// ================================================
// TYB取り込み
// ================================================

async function importTYB(db: Database.Database) {
  console.log('📊 TYB (出馬表データ) 取り込み中...');
  
  const dirPath = path.join(JRDB_BASE_PATH, FILE_TYPE_DIRS.TYB);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  ディレクトリが見つかりません: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath).filter(f => f.startsWith('TYB') && f.endsWith('.txt'));
  console.log(`   ファイル数: ${files.length}件`);

  const stmt = db.prepare(`
    INSERT INTO jrdb_tyb (
      race_key, race_date, track_code, race_number, horse_number,
      horse_id, raw_data
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  let totalCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const records = parseTYB(content);
    
    for (const record of records) {
      stmt.run(
        record.raceKey || '',
        record.raceDate || '',
        record.trackCode || '',
        record.raceNumber || 0,
        record.horseNumber || 0,
        record.horseId || '',
        record.rawData || ''
      );
      totalCount++;
    }
  }

  console.log(`   ✅ 取り込み完了: ${totalCount}件\n`);
}

// ================================================
// 実行
// ================================================

if (require.main === module) {
  importJRDBData().catch(console.error);
}
