"""
UMAYOMI データ設定ファイル

年が変わったら START_YEAR と END_YEAR を更新してください
"""

# ============================================
# データ期間設定 (ここを変更)
# ============================================
DATA_START_YEAR = 2016
DATA_END_YEAR = 2025

# ============================================
# データパス設定
# ============================================
import os

# 自動生成されるデータパス
DATA_PERIOD = f"{DATA_START_YEAR}-{DATA_END_YEAR}"

# JRDB データパス
JRDB_DATA_PATH = f"E:/UMAYOMI/jrdb_data_{DATA_PERIOD}"

# TFJV データパス
TFJV_DATA_PATH = f"E:/UMAYOMI/tfjv_data_{DATA_PERIOD}"

# ============================================
# データベース設定
# ============================================
DB_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "database": "umayomi_db",
    "user": "umayomi_user",
    "password": ""  # PostgreSQL のパスワードを設定
}

# ============================================
# データ統計情報
# ============================================
def get_data_info():
    """データ期間の情報を取得"""
    return {
        "start_year": DATA_START_YEAR,
        "end_year": DATA_END_YEAR,
        "period": DATA_PERIOD,
        "total_years": DATA_END_YEAR - DATA_START_YEAR + 1,
        "jrdb_path": JRDB_DATA_PATH,
        "tfjv_path": TFJV_DATA_PATH
    }

# ============================================
# パス検証
# ============================================
def validate_paths():
    """データパスが存在するか確認"""
    errors = []
    
    if not os.path.exists(JRDB_DATA_PATH):
        errors.append(f"JRDB データが見つかりません: {JRDB_DATA_PATH}")
    
    if not os.path.exists(TFJV_DATA_PATH):
        errors.append(f"TFJV データが見つかりません: {TFJV_DATA_PATH}")
    
    if errors:
        print("⚠️ データパスエラー:")
        for error in errors:
            print(f"  - {error}")
        return False
    
    print("✅ データパス検証成功:")
    print(f"  - JRDB: {JRDB_DATA_PATH}")
    print(f"  - TFJV: {TFJV_DATA_PATH}")
    return True

# ============================================
# 使用例
# ============================================
if __name__ == "__main__":
    print("=" * 50)
    print("UMAYOMI データ設定")
    print("=" * 50)
    print()
    
    info = get_data_info()
    print(f"データ期間: {info['start_year']} - {info['end_year']} ({info['total_years']}年分)")
    print(f"JRDB パス: {info['jrdb_path']}")
    print(f"TFJV パス: {info['tfjv_path']}")
    print()
    
    print("パス検証中...")
    validate_paths()
