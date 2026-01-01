#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
JRDB データ投入メインスクリプト
UMAYOMI Phase 4A-3: SED/TYB データを PostgreSQL へ投入

実行方法:
    python jrdb_db_insert.py

前提条件:
    1. PostgreSQL がインストール済み
    2. データベース 'umayomi' が作成済み
    3. create_tables.sql を実行済み
    4. psycopg2 がインストール済み（pip install psycopg2-binary）

出力:
    - E:\JRDB\db_insert.log にログを出力
    - 進捗状況をコンソールに表示
"""

import os
import sys
import logging
from datetime import datetime
from typing import List, Dict, Optional
import psycopg2
from psycopg2.extras import execute_values
from collections import Counter

# ================================================================
# 設定
# ================================================================

# PostgreSQL 接続設定
DB_CONFIG = {
    'host': 'localhost',
    'database': 'umayomi',
    'user': 'postgres',
    'password': 'YOUR_PASSWORD',  # ← CEO実行時に変更
    'port': 5432
}

# データディレクトリ
SED_DIR = r"E:\JRDB\unzipped_weekly\sed"
TYB_DIR = r"E:\JRDB\unzipped_weekly\tyb"

# ログファイル
LOG_FILE = r"E:\JRDB\db_insert.log"

# ================================================================
# ログ設定
# ================================================================

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler(LOG_FILE, encoding='utf-8'),
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

# ================================================================
# SED データ解析関数
# ================================================================

def parse_sed_line(line: str) -> Optional[Dict]:
    """SED 行を解析して辞書を返す"""
    try:
        line = line.rstrip('\n\r')
        
        if len(line) < 270:
            return None
        
        # レースキー（1-8バイト）
        race_key = line[0:8].strip()
        
        # 馬番（9-10バイト）
        horse_number = line[8:10].strip()
        
        # 血統登録番号（11-18バイト）
        pedigree_id = line[10:18].strip()
        
        # 着順（75-76バイト）※要確認
        finish_position_str = line[74:76].strip()
        finish_position = int(finish_position_str) if finish_position_str.isdigit() else None
        
        # タイム（77-80バイト）※要確認
        race_time = line[76:80].strip()
        
        # 上がり3Fタイム（要確認）
        last_3f_time = line[80:84].strip() if len(line) >= 84 else ""
        
        # 蹄コード（267-270バイト）
        hoof_code = line[266:270].strip()
        
        # IDM候補（55-59バイト）
        idm_str = line[54:59].strip()
        idm_score = int(idm_str) if idm_str.isdigit() else None
        
        # ペース指数候補（要確認）
        pace_str = line[59:64].strip() if len(line) >= 64 else ""
        pace_score = int(pace_str) if pace_str.isdigit() else None
        
        # 上がり指数候補（要確認）
        agari_str = line[64:69].strip() if len(line) >= 69 else ""
        agari_score = int(agari_str) if agari_str.isdigit() else None
        
        return {
            'race_key': race_key,
            'horse_number': horse_number,
            'pedigree_id': pedigree_id,
            'finish_position': finish_position,
            'race_time': race_time if race_time else None,
            'last_3f_time': last_3f_time if last_3f_time else None,
            'hoof_code': hoof_code if hoof_code else None,
            'idm_score': idm_score,
            'pace_score': pace_score,
            'agari_score': agari_score,
        }
    
    except Exception as e:
        logger.error(f"SED 行解析エラー: {e} | Line: {line[:50]}")
        return None

# ================================================================
# TYB データ解析関数
# ================================================================

def parse_tyb_line(line: str) -> Optional[Dict]:
    """TYB 行を解析して辞書を返す"""
    try:
        line = line.rstrip('\n\r')
        
        if len(line) < 30:
            return None
        
        # レースキー（1-8バイト）
        race_key = line[0:8].strip()
        
        # 馬番（9-10バイト）
        horse_number = line[8:10].strip()
        
        # 血統登録番号（11-18バイト）
        pedigree_id = line[10:18].strip()
        
        # オッズ候補（19-25バイト）※要確認
        odds_str = line[18:25].strip()
        try:
            final_odds = float(odds_str) if odds_str else None
        except ValueError:
            final_odds = None
        
        # 人気順位候補（26-27バイト）※要確認
        popularity_str = line[25:27].strip()
        final_popularity = int(popularity_str) if popularity_str.isdigit() else None
        
        # パドック評価候補（28-30バイト）※要確認
        paddock_str = line[27:30].strip()
        paddock_score = int(paddock_str) if paddock_str.isdigit() else None
        
        return {
            'race_key': race_key,
            'horse_number': horse_number,
            'pedigree_id': pedigree_id,
            'final_odds': final_odds,
            'final_popularity': final_popularity,
            'paddock_score': paddock_score,
        }
    
    except Exception as e:
        logger.error(f"TYB 行解析エラー: {e} | Line: {line[:50]}")
        return None

# ================================================================
# データ投入関数
# ================================================================

def insert_sed_data(conn, sed_dir: str) -> int:
    """SED データを race_results テーブルへ投入"""
    logger.info("=" * 80)
    logger.info("📊 SED データ投入開始")
    logger.info("=" * 80)
    
    sed_files = sorted([f for f in os.listdir(sed_dir) if f.startswith('SED') and f.endswith('.txt')])
    
    if not sed_files:
        logger.warning(f"⚠️  SED ファイルが見つかりません: {sed_dir}")
        return 0
    
    logger.info(f"✅ SED ファイル数: {len(sed_files):,}")
    
    total_inserted = 0
    total_errors = 0
    hoof_codes = []
    
    cursor = conn.cursor()
    
    for i, sed_file in enumerate(sed_files, 1):
        file_path = os.path.join(sed_dir, sed_file)
        
        try:
            with open(file_path, 'r', encoding='shift_jis', errors='ignore') as f:
                lines = f.readlines()
            
            # データ解析
            records = []
            for line in lines:
                data = parse_sed_line(line)
                if data:
                    records.append(data)
                    if data['hoof_code']:
                        hoof_codes.append(data['hoof_code'])
            
            # バッチ投入
            if records:
                insert_query = """
                    INSERT INTO race_results 
                    (race_key, horse_number, pedigree_id, finish_position, 
                     race_time, last_3f_time, hoof_code, idm_score, 
                     pace_score, agari_score)
                    VALUES %s
                    ON CONFLICT (race_key, horse_number) DO NOTHING
                """
                
                values = [
                    (
                        r['race_key'], r['horse_number'], r['pedigree_id'],
                        r['finish_position'], r['race_time'], r['last_3f_time'],
                        r['hoof_code'], r['idm_score'], r['pace_score'], r['agari_score']
                    )
                    for r in records
                ]
                
                execute_values(cursor, insert_query, values)
                conn.commit()
                
                total_inserted += len(records)
            
            # 進捗表示（10ファイルごと）
            if i % 10 == 0 or i == len(sed_files):
                logger.info(f"進捗: {i:,} / {len(sed_files):,} ファイル処理完了 | 投入: {total_inserted:,} 件")
        
        except Exception as e:
            logger.error(f"❌ エラー: {sed_file} | {e}")
            total_errors += 1
            conn.rollback()
    
    cursor.close()
    
    # 統計情報
    logger.info("=" * 80)
    logger.info(f"✅ SED データ投入完了")
    logger.info(f"📊 投入件数: {total_inserted:,}")
    logger.info(f"📊 エラー件数: {total_errors:,}")
    logger.info(f"🐴 蹄コード設定済み: {len(hoof_codes):,}")
    
    # 蹄コード頻度トップ10
    hoof_counter = Counter(hoof_codes)
    logger.info("🐴 蹄コード頻度トップ10:")
    for code, count in hoof_counter.most_common(10):
        logger.info(f"  '{code}': {count:,}回")
    
    logger.info("=" * 80)
    
    return total_inserted

def insert_tyb_data(conn, tyb_dir: str) -> int:
    """TYB データを race_info テーブルへ投入"""
    logger.info("=" * 80)
    logger.info("📊 TYB データ投入開始")
    logger.info("=" * 80)
    
    tyb_files = sorted([f for f in os.listdir(tyb_dir) if f.startswith('TYB') and f.endswith('.txt')])
    
    if not tyb_files:
        logger.warning(f"⚠️  TYB ファイルが見つかりません: {tyb_dir}")
        return 0
    
    logger.info(f"✅ TYB ファイル数: {len(tyb_files):,}")
    
    total_inserted = 0
    total_errors = 0
    
    cursor = conn.cursor()
    
    for i, tyb_file in enumerate(tyb_files, 1):
        file_path = os.path.join(tyb_dir, tyb_file)
        
        try:
            with open(file_path, 'r', encoding='shift_jis', errors='ignore') as f:
                lines = f.readlines()
            
            # データ解析
            records = []
            for line in lines:
                data = parse_tyb_line(line)
                if data:
                    records.append(data)
            
            # バッチ投入
            if records:
                insert_query = """
                    INSERT INTO race_info 
                    (race_key, horse_number, pedigree_id, final_odds, 
                     final_popularity, paddock_score)
                    VALUES %s
                    ON CONFLICT (race_key, horse_number) DO NOTHING
                """
                
                values = [
                    (
                        r['race_key'], r['horse_number'], r['pedigree_id'],
                        r['final_odds'], r['final_popularity'], r['paddock_score']
                    )
                    for r in records
                ]
                
                execute_values(cursor, insert_query, values)
                conn.commit()
                
                total_inserted += len(records)
            
            # 進捗表示（10ファイルごと）
            if i % 10 == 0 or i == len(tyb_files):
                logger.info(f"進捗: {i:,} / {len(tyb_files):,} ファイル処理完了 | 投入: {total_inserted:,} 件")
        
        except Exception as e:
            logger.error(f"❌ エラー: {tyb_file} | {e}")
            total_errors += 1
            conn.rollback()
    
    cursor.close()
    
    logger.info("=" * 80)
    logger.info(f"✅ TYB データ投入完了")
    logger.info(f"📊 投入件数: {total_inserted:,}")
    logger.info(f"📊 エラー件数: {total_errors:,}")
    logger.info("=" * 80)
    
    return total_inserted

# ================================================================
# メイン処理
# ================================================================

def main():
    """メイン処理"""
    start_time = datetime.now()
    
    logger.info("=" * 80)
    logger.info("🚀 UMAYOMI Phase 4A: PostgreSQL データ投入開始")
    logger.info("=" * 80)
    logger.info(f"開始時刻: {start_time.strftime('%Y-%m-%d %H:%M:%S')}")
    logger.info(f"SED ディレクトリ: {SED_DIR}")
    logger.info(f"TYB ディレクトリ: {TYB_DIR}")
    logger.info(f"ログファイル: {LOG_FILE}")
    logger.info("=" * 80)
    
    # ディレクトリ存在確認
    if not os.path.exists(SED_DIR):
        logger.error(f"❌ エラー: {SED_DIR} が見つかりません")
        sys.exit(1)
    
    if not os.path.exists(TYB_DIR):
        logger.error(f"❌ エラー: {TYB_DIR} が見つかりません")
        sys.exit(1)
    
    # PostgreSQL 接続
    try:
        logger.info("📡 PostgreSQL 接続中...")
        conn = psycopg2.connect(**DB_CONFIG)
        logger.info("✅ PostgreSQL 接続成功")
    except Exception as e:
        logger.error(f"❌ PostgreSQL 接続エラー: {e}")
        logger.error("💡 DB_CONFIG を確認してください")
        sys.exit(1)
    
    try:
        # SED データ投入
        sed_count = insert_sed_data(conn, SED_DIR)
        
        # TYB データ投入
        tyb_count = insert_tyb_data(conn, TYB_DIR)
        
        # 完了
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        logger.info("=" * 80)
        logger.info("🎉 PostgreSQL データ投入完了")
        logger.info("=" * 80)
        logger.info(f"終了時刻: {end_time.strftime('%Y-%m-%d %H:%M:%S')}")
        logger.info(f"処理時間: {duration:.1f}秒")
        logger.info(f"SED 投入件数: {sed_count:,}")
        logger.info(f"TYB 投入件数: {tyb_count:,}")
        logger.info(f"合計投入件数: {sed_count + tyb_count:,}")
        logger.info("=" * 80)
    
    finally:
        conn.close()
        logger.info("✅ PostgreSQL 接続終了")

if __name__ == "__main__":
    main()
