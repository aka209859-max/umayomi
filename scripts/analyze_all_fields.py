#!/usr/bin/env python3
"""
JRDB 全14種類のデータファイルから全フィールドを抽出・分析
"""

import sys
sys.path.append('/home/user/webapp')

from parsers.jrdb_parser import JRDBParser

def analyze_file_structure(file_path, data_type):
    """ファイル構造を詳細分析"""
    parser = JRDBParser()
    
    print(f"\n{'='*80}")
    print(f"📄 {data_type} - {file_path}")
    print(f"{'='*80}")
    
    try:
        records = parser.parse_file(file_path, data_type)
        
        if not records:
            print("❌ レコードなし")
            return
        
        # 最初のレコードを詳細分析
        first_record = records[0]
        
        print(f"\n✅ 総レコード数: {len(records):,}")
        print(f"✅ フィールド数: {len(first_record)}")
        
        # 生データの長さ分析
        with open(file_path, 'r', encoding='shift_jis', errors='ignore') as f:
            first_line = f.readline().rstrip('\n')
            print(f"✅ 1行の文字数: {len(first_line)}")
        
        print(f"\n📊 全フィールド一覧:")
        print(f"{'No':<5} {'フィールド名':<40} {'サンプル値':<40}")
        print(f"{'-'*85}")
        
        for i, (key, value) in enumerate(first_record.items(), 1):
            # 値を文字列に変換（最大40文字）
            if isinstance(value, (list, dict)):
                value_str = str(value)[:40] + "..." if len(str(value)) > 40 else str(value)
            else:
                value_str = str(value)[:40] if value else ""
            
            print(f"{i:<5} {key:<40} {value_str:<40}")
        
        print(f"\n{'='*80}\n")
        
        return {
            'data_type': data_type,
            'record_count': len(records),
            'field_count': len(first_record),
            'fields': list(first_record.keys())
        }
        
    except Exception as e:
        print(f"❌ エラー: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    # 全14種類のファイルを分析
    files = [
        ('/home/user/uploaded_files/ZED250106.txt', 'ZED'),
        ('/home/user/uploaded_files/ZKB250106.txt', 'ZKB'),
        ('/home/user/uploaded_files/BAC250106.txt', 'BAC'),
        ('/home/user/uploaded_files/CHA250106.txt', 'CHA'),
        ('/home/user/uploaded_files/CYB250106.txt', 'CYB'),
        ('/home/user/uploaded_files/JOA250106.txt', 'JOA'),
        ('/home/user/uploaded_files/KAB250106.txt', 'KAB'),
        ('/home/user/uploaded_files/KKA250106.txt', 'KKA'),
        ('/home/user/uploaded_files/KYI250106.txt', 'KYI'),
        ('/home/user/uploaded_files/UKC250106.txt', 'UKC'),
        ('/home/user/uploaded_files/OT250106.txt', 'OT'),
        ('/home/user/uploaded_files/OU250106.txt', 'OU'),
        ('/home/user/uploaded_files/OW250106.txt', 'OW'),
        ('/home/user/uploaded_files/OZ250106.txt', 'OZ'),
    ]
    
    print("\n" + "="*80)
    print("🔍 JRDB 全14種類 完全フィールド分析")
    print("="*80)
    
    all_results = []
    for file_path, data_type in files:
        result = analyze_file_structure(file_path, data_type)
        if result:
            all_results.append(result)
    
    # サマリー表示
    print("\n" + "="*80)
    print("📊 全体サマリー")
    print("="*80)
    
    total_records = 0
    total_fields = 0
    
    for result in all_results:
        total_records += result['record_count']
        total_fields += result['field_count']
        print(f"{result['data_type']:<10} レコード: {result['record_count']:>6,}  フィールド: {result['field_count']:>3}")
    
    print(f"\n{'合計':<10} レコード: {total_records:>6,}  フィールド: {total_fields:>3}")
    print("="*80)
