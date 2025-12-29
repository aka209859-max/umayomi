"""
UMAYOMI データベーススキーマ作成スクリプト

全14テーブル (JRDB) を作成します。
"""

import psycopg2
from psycopg2 import sql
import os
from datetime import datetime

# データベース接続設定
DATABASE_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'umayomi_db',
    'user': 'umayomi_user',
    'password': 'umayomi2024'  # 本番環境では環境変数から取得
}


def create_tables():
    """全14テーブルを作成"""
    
    conn = None
    cursor = None
    
    try:
        # データベース接続
        print("=" * 80)
        print("UMAYOMI データベーススキーマ作成")
        print("=" * 80)
        print()
        print(f"📊 接続先: {DATABASE_CONFIG['database']}")
        print()
        
        conn = psycopg2.connect(**DATABASE_CONFIG)
        cursor = conn.cursor()
        
        # Layer 1: レース・成績・馬基本情報
        print("📋 Layer 1: レース・成績・馬基本情報")
        
        # 1. races
        print("   1/14 races テーブル作成中...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS races (
                id SERIAL PRIMARY KEY,
                track_code VARCHAR(2),
                race_num VARCHAR(2),
                day_of_week VARCHAR(2),
                month VARCHAR(2),
                day VARCHAR(2),
                race_id VARCHAR(18) UNIQUE,
                race_date VARCHAR(8),
                race_name VARCHAR(50),
                grade VARCHAR(2),
                distance VARCHAR(4),
                track_type VARCHAR(1),
                track_condition VARCHAR(2),
                weather VARCHAR(1),
                race_class VARCHAR(2),
                age_limit VARCHAR(1),
                weight_type VARCHAR(1),
                prize_1 VARCHAR(8),
                prize_2 VARCHAR(8),
                prize_3 VARCHAR(8),
                prize_4 VARCHAR(8),
                prize_5 VARCHAR(8),
                num_horses VARCHAR(2),
                course VARCHAR(1),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_races_race_id ON races(race_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_races_race_date ON races(race_date)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_races_track_code ON races(track_code)")
        print("      ✅ races テーブル作成完了")
        
        # 2. race_results
        print("   2/14 race_results テーブル作成中...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS race_results (
                id SERIAL PRIMARY KEY,
                race_id VARCHAR(18),
                race_date VARCHAR(8),
                idm VARCHAR(3),
                jockey_index VARCHAR(3),
                info_index VARCHAR(3),
                pace_index VARCHAR(3),
                up_index VARCHAR(3),
                position_index VARCHAR(3),
                pace_change VARCHAR(3),
                prev1_idm VARCHAR(3),
                prev1_jockey VARCHAR(3),
                prev1_info VARCHAR(3),
                prev2_idm VARCHAR(3),
                prev2_jockey VARCHAR(3),
                prev2_info VARCHAR(3),
                prev3_idm VARCHAR(3),
                prev3_jockey VARCHAR(3),
                prev3_info VARCHAR(3),
                prev4_idm VARCHAR(3),
                prev4_jockey VARCHAR(3),
                prev4_info VARCHAR(3),
                prev5_idm VARCHAR(3),
                prev5_jockey VARCHAR(3),
                prev5_info VARCHAR(3),
                finish_position VARCHAR(2),
                popularity VARCHAR(2),
                horse_weight VARCHAR(3),
                horse_weight_diff VARCHAR(3),
                odds VARCHAR(6),
                horse_num VARCHAR(2),
                frame_num VARCHAR(1),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_race_results_race_id ON race_results(race_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_race_results_race_date ON race_results(race_date)")
        print("      ✅ race_results テーブル作成完了")
        
        # 3. horse_records
        print("   3/14 horse_records テーブル作成中...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS horse_records (
                id SERIAL PRIMARY KEY,
                track_code VARCHAR(2),
                race_num VARCHAR(2),
                race_date_short VARCHAR(2),
                race_full_date VARCHAR(8),
                start_time VARCHAR(4),
                distance VARCHAR(3),
                track_type VARCHAR(1),
                course VARCHAR(1),
                grade VARCHAR(2),
                race_class VARCHAR(2),
                age_limit VARCHAR(1),
                weight_type VARCHAR(1),
                horse_id VARCHAR(8),
                horse_name VARCHAR(36),
                distance_aptitude VARCHAR(1),
                sire_name VARCHAR(36),
                dam_name VARCHAR(36),
                trainer_name VARCHAR(12),
                jockey_name VARCHAR(12),
                owner_name VARCHAR(24),
                breeder_name VARCHAR(24),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_horse_records_horse_id ON horse_records(horse_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_horse_records_race_date ON horse_records(race_full_date)")
        print("      ✅ horse_records テーブル作成完了")
        
        print()
        
        # Layer 2: 調教・騎手・馬データ
        print("📋 Layer 2: 調教・騎手・馬データ")
        
        # 4. training_data
        print("   4/14 training_data テーブル作成中...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS training_data (
                id SERIAL PRIMARY KEY,
                track_code VARCHAR(2),
                race_num VARCHAR(2),
                horse_num VARCHAR(2),
                training_date VARCHAR(8),
                training_time VARCHAR(4),
                training_course VARCHAR(2),
                training_type VARCHAR(1),
                training_distance VARCHAR(3),
                time_4f VARCHAR(4),
                time_3f VARCHAR(4),
                time_2f VARCHAR(4),
                time_1f VARCHAR(4),
                finish_index VARCHAR(3),
                evaluation VARCHAR(1),
                trainer_comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_training_data_horse_num ON training_data(horse_num)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_training_data_training_date ON training_data(training_date)")
        print("      ✅ training_data テーブル作成完了")
        
        # 5. jockey_stats
        print("   5/14 jockey_stats テーブル作成中...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS jockey_stats (
                id SERIAL PRIMARY KEY,
                track_code VARCHAR(2),
                race_num VARCHAR(2),
                horse_num VARCHAR(2),
                jockey_code VARCHAR(5),
                jockey_name VARCHAR(12),
                jockey_weight VARCHAR(5),
                jockey_weight_diff VARCHAR(5),
                leading_rate VARCHAR(5),
                track_win_rate VARCHAR(5),
                distance_win_rate VARCHAR(5),
                total_wins VARCHAR(5),
                total_races VARCHAR(5),
                win_rate VARCHAR(5),
                place_rate VARCHAR(5),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_jockey_stats_jockey_code ON jockey_stats(jockey_code)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_jockey_stats_jockey_name ON jockey_stats(jockey_name)")
        print("      ✅ jockey_stats テーブル作成完了")
        
        # 6. horse_master
        print("   6/14 horse_master テーブル作成中...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS horse_master (
                id SERIAL PRIMARY KEY,
                track_code VARCHAR(2),
                race_num VARCHAR(2),
                horse_num VARCHAR(2),
                horse_id VARCHAR(8),
                year_of_birth VARCHAR(4),
                trainer_code VARCHAR(5),
                trainer_name VARCHAR(12),
                owner_code VARCHAR(6),
                owner_name VARCHAR(40),
                breeder_code VARCHAR(6),
                place_of_birth VARCHAR(2),
                auction_price VARCHAR(8),
                import_year VARCHAR(4),
                sire_id VARCHAR(8),
                dam_id VARCHAR(8),
                dam_sire_id VARCHAR(8),
                age VARCHAR(2),
                sex VARCHAR(1),
                coat_color VARCHAR(2),
                mark VARCHAR(30),
                total_prize VARCHAR(8),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_horse_master_horse_id ON horse_master(horse_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_horse_master_trainer_code ON horse_master(trainer_code)")
        print("      ✅ horse_master テーブル作成完了")
        
        # 7. horse_performance
        print("   7/14 horse_performance テーブル作成中...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS horse_performance (
                id SERIAL PRIMARY KEY,
                race_id VARCHAR(18),
                race_date VARCHAR(8),
                horse_id VARCHAR(8),
                horse_name VARCHAR(36),
                turf_short_runs VARCHAR(3),
                turf_short_1st VARCHAR(3),
                turf_short_2nd VARCHAR(3),
                turf_short_3rd VARCHAR(3),
                turf_mile_runs VARCHAR(3),
                turf_mile_1st VARCHAR(3),
                turf_mile_2nd VARCHAR(3),
                turf_mile_3rd VARCHAR(3),
                turf_middle_runs VARCHAR(3),
                turf_middle_1st VARCHAR(3),
                turf_middle_2nd VARCHAR(3),
                turf_middle_3rd VARCHAR(3),
                turf_long_runs VARCHAR(3),
                turf_long_1st VARCHAR(3),
                turf_long_2nd VARCHAR(3),
                turf_long_3rd VARCHAR(3),
                dirt_short_runs VARCHAR(3),
                dirt_short_1st VARCHAR(3),
                dirt_short_2nd VARCHAR(3),
                dirt_short_3rd VARCHAR(3),
                dirt_mile_runs VARCHAR(3),
                dirt_mile_1st VARCHAR(3),
                dirt_mile_2nd VARCHAR(3),
                dirt_mile_3rd VARCHAR(3),
                dirt_middle_runs VARCHAR(3),
                dirt_middle_1st VARCHAR(3),
                dirt_middle_2nd VARCHAR(3),
                dirt_middle_3rd VARCHAR(3),
                dirt_long_runs VARCHAR(3),
                dirt_long_1st VARCHAR(3),
                dirt_long_2nd VARCHAR(3),
                dirt_long_3rd VARCHAR(3),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_horse_performance_horse_id ON horse_performance(horse_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_horse_performance_race_id ON horse_performance(race_id)")
        print("      ✅ horse_performance テーブル作成完了")
        
        # 8. horse_details
        print("   8/14 horse_details テーブル作成中...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS horse_details (
                id SERIAL PRIMARY KEY,
                race_id VARCHAR(18),
                race_date VARCHAR(8),
                horse_id VARCHAR(8),
                horse_name VARCHAR(36),
                prev_race_date VARCHAR(8),
                prev_track VARCHAR(2),
                prev_race_num VARCHAR(2),
                prev_race_name VARCHAR(50),
                prev_num_horses VARCHAR(2),
                prev_frame VARCHAR(1),
                prev_horse_num VARCHAR(2),
                prev_odds VARCHAR(6),
                prev_popularity VARCHAR(2),
                prev_finish VARCHAR(2),
                prev_jockey VARCHAR(12),
                prev_weight VARCHAR(3),
                prev_distance VARCHAR(4),
                prev_track_type VARCHAR(1),
                prev_track_condition VARCHAR(2),
                prev_time VARCHAR(4),
                prev_time_diff VARCHAR(5),
                prev_pass_position VARCHAR(4),
                prev_last_3f VARCHAR(3),
                prev_horse_weight VARCHAR(3),
                prev_weight_diff VARCHAR(3),
                prev_winner VARCHAR(36),
                prev_prize VARCHAR(8),
                pre_horse_weight VARCHAR(3),
                pre_weight_diff VARCHAR(3),
                blinker VARCHAR(1),
                bandage VARCHAR(1),
                transport_area VARCHAR(1),
                trainer_comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_horse_details_horse_id ON horse_details(horse_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_horse_details_race_id ON horse_details(race_id)")
        print("      ✅ horse_details テーブル作成完了")
        
        print()
        
        # Layer 3: オッズ・コメントデータ
        print("📋 Layer 3: オッズ・コメントデータ")
        
        # 9. odds_tansho_fukusho
        print("   9/14 odds_tansho_fukusho テーブル作成中...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS odds_tansho_fukusho (
                id SERIAL PRIMARY KEY,
                race_key VARCHAR(14),
                win_odds TEXT[],
                place_odds TEXT[],
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_odds_tansho_race_key ON odds_tansho_fukusho(race_key)")
        print("      ✅ odds_tansho_fukusho テーブル作成完了")
        
        # 10. odds_umaren
        print("  10/14 odds_umaren テーブル作成中...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS odds_umaren (
                id SERIAL PRIMARY KEY,
                race_key VARCHAR(14),
                umaren_odds TEXT[],
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_odds_umaren_race_key ON odds_umaren(race_key)")
        print("      ✅ odds_umaren テーブル作成完了")
        
        # 11. odds_wide
        print("  11/14 odds_wide テーブル作成中...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS odds_wide (
                id SERIAL PRIMARY KEY,
                race_key VARCHAR(14),
                wide_odds TEXT[],
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_odds_wide_race_key ON odds_wide(race_key)")
        print("      ✅ odds_wide テーブル作成完了")
        
        # 12. odds_sanrenpuku
        print("  12/14 odds_sanrenpuku テーブル作成中...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS odds_sanrenpuku (
                id SERIAL PRIMARY KEY,
                race_key VARCHAR(14),
                sanrenpuku_odds TEXT[],
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_odds_sanrenpuku_race_key ON odds_sanrenpuku(race_key)")
        print("      ✅ odds_sanrenpuku テーブル作成完了")
        
        # 13. trainer_comments
        print("  13/14 trainer_comments テーブル作成中...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS trainer_comments (
                id SERIAL PRIMARY KEY,
                track_code VARCHAR(2),
                race_num VARCHAR(2),
                horse_num VARCHAR(2),
                comment_date VARCHAR(8),
                comment_time VARCHAR(4),
                comment_code VARCHAR(2),
                trainer_comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_trainer_comments_horse_num ON trainer_comments(horse_num)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_trainer_comments_comment_date ON trainer_comments(comment_date)")
        print("      ✅ trainer_comments テーブル作成完了")
        
        # 14. horse_columns
        print("  14/14 horse_columns テーブル作成中...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS horse_columns (
                id SERIAL PRIMARY KEY,
                track_code VARCHAR(2),
                race_num VARCHAR(2),
                race_date VARCHAR(8),
                horse_num VARCHAR(2),
                jockey_code VARCHAR(5),
                jockey_name VARCHAR(12),
                weight VARCHAR(3),
                odds VARCHAR(6),
                popularity VARCHAR(2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_horse_columns_horse_num ON horse_columns(horse_num)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_horse_columns_race_date ON horse_columns(race_date)")
        print("      ✅ horse_columns テーブル作成完了")
        
        # コミット
        conn.commit()
        
        print()
        print("=" * 80)
        print("✅ 全14テーブル作成完了！")
        print("=" * 80)
        print()
        
        # テーブル一覧を表示
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        """)
        tables = cursor.fetchall()
        
        print(f"📋 作成されたテーブル: {len(tables)}個")
        for i, (table_name,) in enumerate(tables, 1):
            print(f"   {i:2d}. {table_name}")
        
        print()
        print("🎯 次のステップ:")
        print("   Day 3: PostgreSQL インポート実装")
        print("   - 1,043日分のデータをバッチインポート")
        print("   - データ整合性チェック")
        print()
    
    except Exception as e:
        print(f"❌ エラー: {e}")
        if conn:
            conn.rollback()
    
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


if __name__ == "__main__":
    create_tables()
