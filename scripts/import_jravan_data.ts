/**
 * UMAYOMI - JRA-VAN一括取り込みスクリプト
 * 
 * CEO PCでの実行を想定（E:\JRAVAN\）
 * 
 * 対象パーサー:
 * - SE (成績データ)
 * - TM (調教データ)
 * - JG (騎手情報)
 * - BY/HY (馬基本情報)
 * - OW (オッズデータ - 馬主情報)
 * - SCHD (開催スケジュール)
 * - HC (出走予定馬 - 既存)
 */

import * as fs from 'fs';
import * as path from 'path';
import Database from 'better-sqlite3';
import { SEParser } from '../src/parsers/jravan/se';
import { TMParser } from '../src/parsers/jravan/tm';
import { JGParser } from '../src/parsers/jravan/jg';
import { BYParser } from '../src/parsers/jravan/by';
import { OWParser } from '../src/parsers/jravan/ow';
import { SCHDParser } from '../src/parsers/jravan/schd';
import { HCParser } from '../src/parsers/ck/hc';

// ================================================
// 設定
// ================================================

const JRAVAN_BASE_PATH = 'E:\\JRAVAN';
const DB_PATH = 'E:\\UMAYOMI\\umayomi.db';

// ファイルタイプとディレクトリのマッピング
const FILE_TYPE_DIRS = {
  SE: 'SE_DATA',
  TM: 'TM_DATA',
  JG: 'JG_DATA',
  BY: 'BY_DATA',
  OW: 'OW_DATA',
  SCHD: '', // ルート直下
  HC: 'CK_DATA'
};

// ================================================
// メイン処理
// ================================================

async function importJRAVANData() {
  console.log('🚀 JRA-VAN一括取り込み開始\n');
  console.log(`📂 読み込み元: ${JRAVAN_BASE_PATH}`);
  console.log(`💾 保存先DB: ${DB_PATH}\n`);

  // データベース接続
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');

  try {
    // 1. SE (成績データ)
    await importSE(db);
    
    // 2. TM (調教データ)
    await importTM(db);
    
    // 3. JG (騎手情報)
    await importJG(db);
    
    // 4. BY/HY (馬基本情報)
    await importBY(db);
    
    // 5. OW (オッズデータ - 馬主情報)
    await importOW(db);
    
    // 6. SCHD (開催スケジュール)
    await importSCHD(db);
    
    // 7. HC (出走予定馬)
    await importHC(db);

    console.log('\n✅ JRA-VAN一括取り込み完了！');
  } catch (error) {
    console.error('❌ エラー発生:', error);
    throw error;
  } finally {
    db.close();
  }
}

// ================================================
// SE取り込み
// ================================================

async function importSE(db: Database.Database) {
  console.log('📊 SE (成績データ) 取り込み中...');
  
  const dirPath = path.join(JRAVAN_BASE_PATH, FILE_TYPE_DIRS.SE);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  ディレクトリが見つかりません: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath).filter(f => f.startsWith('SU') && f.endsWith('.DAT'));
  console.log(`   ファイル数: ${files.length}件`);

  const stmt = db.prepare(`
    INSERT INTO jravan_se (
      race_date, track_code, race_number, horse_number, horse_id,
      horse_name, finish_position, popularity, finish_time, distance,
      jockey_id, jockey_name, trainer_id, trainer_name, odds, prize,
      horse_weight, weight_change, passing1, passing2, passing3, passing4,
      raw_data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let totalCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const buffer = fs.readFileSync(filePath);
    const records = SEParser.parseFile(buffer);
    
    for (const record of records) {
      stmt.run(
        record.raceDate || '',
        record.trackCode || '',
        record.raceNumber || 0,
        record.horseNumber || 0,
        record.horseId || '',
        record.horseName || '',
        record.finishPosition || 0,
        record.popularity || 0,
        record.finishTime || 0,
        record.distance || 0,
        record.jockeyId || '',
        record.jockeyName || '',
        record.trainerId || '',
        record.trainerName || '',
        record.odds || 0,
        record.prize || 0,
        record.horseWeight || 0,
        record.weightChange || 0,
        record.passing1 || 0,
        record.passing2 || 0,
        record.passing3 || 0,
        record.passing4 || 0,
        record.rawData || ''
      );
      totalCount++;
    }
  }

  console.log(`   ✅ 取り込み完了: ${totalCount}件\n`);
}

// ================================================
// TM取り込み
// ================================================

async function importTM(db: Database.Database) {
  console.log('📊 TM (調教データ) 取り込み中...');
  
  const dirPath = path.join(JRAVAN_BASE_PATH, FILE_TYPE_DIRS.TM);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  ディレクトリが見つかりません: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath).filter(f => f.startsWith('TM') && f.endsWith('.DAT'));
  console.log(`   ファイル数: ${files.length}件`);

  const stmt = db.prepare(`
    INSERT INTO jravan_tm (
      race_date, data_date, track_code, race_number, horse_number,
      training_count, training_data, raw_data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let totalCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const buffer = fs.readFileSync(filePath);
    const records = TMParser.parseFile(buffer);
    
    for (const record of records) {
      stmt.run(
        record.raceDate || '',
        record.dataDate || '',
        record.trackCode || '',
        record.raceNumber || 0,
        record.horseNumber || 0,
        record.trainingData.length,
        JSON.stringify(record.trainingData),
        record.rawData || ''
      );
      totalCount++;
    }
  }

  console.log(`   ✅ 取り込み完了: ${totalCount}件\n`);
}

// ================================================
// JG取り込み
// ================================================

async function importJG(db: Database.Database) {
  console.log('📊 JG (騎手情報) 取り込み中...');
  
  const dirPath = path.join(JRAVAN_BASE_PATH, FILE_TYPE_DIRS.JG);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  ディレクトリが見つかりません: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath).filter(f => f.startsWith('JG') && f.endsWith('.DAT'));
  console.log(`   ファイル数: ${files.length}件`);

  const stmt = db.prepare(`
    INSERT INTO jravan_jg (
      race_date, data_date, track_code, race_number, horse_number,
      horse_id, jockey_name, odds, raw_data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let totalCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const buffer = fs.readFileSync(filePath);
    const records = JGParser.parseFile(buffer);
    
    for (const record of records) {
      stmt.run(
        record.raceDate || '',
        record.dataDate || '',
        record.trackCode || '',
        record.raceNumber || 0,
        record.horseNumber || 0,
        record.horseId || '',
        record.jockeyName || '',
        record.odds || 0,
        record.rawData || ''
      );
      totalCount++;
    }
  }

  console.log(`   ✅ 取り込み完了: ${totalCount}件\n`);
}

// ================================================
// BY取り込み
// ================================================

async function importBY(db: Database.Database) {
  console.log('📊 BY/HY (馬基本情報) 取り込み中...');
  
  const dirPath = path.join(JRAVAN_BASE_PATH, FILE_TYPE_DIRS.BY);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  ディレクトリが見つかりません: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath).filter(f => f.startsWith('BY') && f.endsWith('.DAT'));
  console.log(`   ファイル数: ${files.length}件`);

  const stmt = db.prepare(`
    INSERT INTO jravan_by (
      race_date, horse_id, horse_name, comment, raw_data
    ) VALUES (?, ?, ?, ?, ?)
  `);

  let totalCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const buffer = fs.readFileSync(filePath);
    const records = BYParser.parseFile(buffer);
    
    for (const record of records) {
      stmt.run(
        record.raceDate || '',
        record.horseId || '',
        record.horseName || '',
        record.comment || '',
        record.rawData || ''
      );
      totalCount++;
    }
  }

  console.log(`   ✅ 取り込み完了: ${totalCount}件\n`);
}

// ================================================
// OW取り込み
// ================================================

async function importOW(db: Database.Database) {
  console.log('📊 OW (オッズデータ - 馬主情報) 取り込み中...');
  
  const dirPath = path.join(JRAVAN_BASE_PATH, FILE_TYPE_DIRS.OW);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  ディレクトリが見つかりません: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath).filter(f => f.startsWith('TFJ_OW') && f.endsWith('.DAT'));
  console.log(`   ファイル数: ${files.length}件`);

  const stmt = db.prepare(`
    INSERT INTO jravan_ow (
      registration_date, owner_id, owner_name, owner_name_kana,
      owner_name_eng, colors, registration_year, raw_data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let totalCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const buffer = fs.readFileSync(filePath);
    const records = OWParser.parseFile(buffer);
    
    for (const record of records) {
      stmt.run(
        record.registrationDate || '',
        record.ownerId || '',
        record.ownerName || '',
        record.ownerNameKana || '',
        record.ownerNameEng || '',
        record.colors || '',
        record.registrationYear || 0,
        record.rawData || ''
      );
      totalCount++;
    }
  }

  console.log(`   ✅ 取り込み完了: ${totalCount}件\n`);
}

// ================================================
// SCHD取り込み
// ================================================

async function importSCHD(db: Database.Database) {
  console.log('📊 SCHD (開催スケジュール) 取り込み中...');
  
  const dirPath = JRAVAN_BASE_PATH; // ルート直下
  
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  ディレクトリが見つかりません: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath).filter(f => f.startsWith('SCHD') && f.endsWith('.DAT'));
  console.log(`   ファイル数: ${files.length}件`);

  const stmt = db.prepare(`
    INSERT INTO jravan_schd (
      data_date, race_date, track_code, race_number, race_name,
      race_name_short, grade, distance, raw_data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let totalCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const buffer = fs.readFileSync(filePath);
    const records = SCHDParser.parseFile(buffer);
    
    for (const record of records) {
      stmt.run(
        record.dataDate || '',
        record.raceDate || '',
        record.trackCode || '',
        record.raceNumber || 0,
        record.raceName || '',
        record.raceNameShort || '',
        record.grade || '',
        record.distance || 0,
        record.rawData || ''
      );
      totalCount++;
    }
  }

  console.log(`   ✅ 取り込み完了: ${totalCount}件\n`);
}

// ================================================
// HC取り込み
// ================================================

async function importHC(db: Database.Database) {
  console.log('📊 HC (出走予定馬) 取り込み中...');
  
  const dirPath = path.join(JRAVAN_BASE_PATH, FILE_TYPE_DIRS.HC);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  ディレクトリが見つかりません: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath).filter(f => f.startsWith('HC') && f.endsWith('.DAT'));
  console.log(`   ファイル数: ${files.length}件`);

  const stmt = db.prepare(`
    INSERT INTO jravan_hc (
      race_date, track_code, race_number, horse_number, horse_id, raw_data
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  let totalCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const buffer = fs.readFileSync(filePath);
    const records = HCParser.parseFile(buffer);
    
    for (const record of records) {
      stmt.run(
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
  importJRAVANData().catch(console.error);
}
