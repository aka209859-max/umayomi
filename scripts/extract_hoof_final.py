#!/usr/bin/env python3
"""
JRDB蹄データ最終抽出（エンコーディング修正版）
"""
import json

def parse_kyi_hoof_final(file_path):
    """KYIファイルから蹄データを抽出（確定版）"""
    results = []
    
    with open(file_path, 'r', encoding='shift_jis', errors='ignore') as f:
        for line_num, line in enumerate(f, 1):
            if len(line) < 165:
                continue
            
            race_key = line[0:8].strip()
            horse_num_str = line[8:10].strip()
            horse_num = int(horse_num_str) if horse_num_str.isdigit() else None
            
            # 蹄コード抽出（163-165バイト）
            hoof_code = line[163:165].strip()
            
            if hoof_code:  # 空でない場合のみ追加
                results.append({
                    'race_key': race_key,
                    'horse_num': horse_num,
                    'hoof_code': hoof_code,
                    'record_date': '2025-01-06',
                    'data_source': 'KYI'
                })
    
    return results

def parse_zkb_hoof_utf8(file_path):
    """ZKBファイルをUTF-8で再解析"""
    results = []
    
    # UTF-8で試す
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            for line_num, line in enumerate(f, 1):
                if len(line) < 100:
                    continue
                
                race_key = line[0:8].strip()
                horse_num_str = line[8:10].strip()
                horse_num = int(horse_num_str) if horse_num_str.isdigit() else None
                
                # 280バイト付近を探索
                # 実際のバイト位置が不明なため、パターンマッチで探す
                # 今回はKYIデータに集中
                
                results.append({
                    'race_key': race_key,
                    'horse_num': horse_num,
                    'note': 'ZKBは仕様書確認が必要',
                    'data_source': 'ZKB'
                })
    except Exception as e:
        print(f"⚠️ UTF-8での読み込み失敗: {e}")
    
    return results

if __name__ == "__main__":
    # KYIファイル最終抽出
    kyi_file = '/home/user/uploaded_files/KYI250106.txt'
    
    print("="*80)
    print("✅ KYI250106.txt 最終蹄データ抽出")
    print("="*80)
    
    kyi_results = parse_kyi_hoof_final(kyi_file)
    
    print(f"\n✅ 総件数: {len(kyi_results)} 件")
    print(f"\n📊 サンプルデータ（最初の20件）:")
    print(f"{'No':<5} {'レースキー':<12} {'馬番':<5} {'蹄コード':<10}")
    print("-"*40)
    
    for i, result in enumerate(kyi_results[:20], 1):
        print(f"{i:<5} {result['race_key']:<12} {result['horse_num']:<5} {result['hoof_code']:<10}")
    
    # JSON出力（PostgreSQL投入用）
    with open('/home/user/webapp/data/kyi_hoof_data.json', 'w', encoding='utf-8') as f:
        json.dump(kyi_results, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ データ出力完了: /home/user/webapp/data/kyi_hoof_data.json")
    print(f"   総件数: {len(kyi_results)} 件")

