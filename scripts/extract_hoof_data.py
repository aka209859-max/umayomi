#!/usr/bin/env python3
"""
JRDB蹄データ抽出スクリプト
KYI250106.txt（競走馬データ）から蹄コードを抽出
"""

def parse_kyi_hoof_data(file_path):
    """
    KYIファイルから蹄データを抽出
    
    仕様:
    - レコード長: 1024 byte
    - 文字コード: Shift_JIS
    - 蹄コード位置: 164-165バイト（0始まり: 163-165）
    """
    results = []
    
    with open(file_path, 'r', encoding='shift_jis', errors='ignore') as f:
        for line_num, line in enumerate(f, 1):
            if len(line) < 165:
                continue
            
            # レースキー抽出（0-8バイト）
            race_key = line[0:8].strip()
            
            # 馬番抽出（8-10バイト）
            horse_num_str = line[8:10].strip()
            horse_num = int(horse_num_str) if horse_num_str.isdigit() else None
            
            # 蹄コード抽出（163-165バイト、0始まり）
            hoof_code = line[163:165].strip()
            
            results.append({
                'line_num': line_num,
                'race_key': race_key,
                'horse_num': horse_num,
                'hoof_code': hoof_code,
                'hoof_code_raw': repr(line[163:165]),
                'data_source': 'KYI'
            })
    
    return results

def parse_zkb_hoof_data(file_path):
    """
    ZKBファイルから蹄鉄・蹄状態データを抽出
    
    仕様:
    - レコード長: 304 byte
    - 文字コード: Shift_JIS
    - 蹄鉄コード位置: 280-282バイト（0始まり: 279-282）
    - 蹄状態コード位置: 283-285バイト（0始まり: 282-285）
    """
    results = []
    
    with open(file_path, 'r', encoding='shift_jis', errors='ignore') as f:
        for line_num, line in enumerate(f, 1):
            if len(line) < 285:
                continue
            
            # レースキー抽出（0-8バイト）
            race_key = line[0:8].strip()
            
            # 馬番抽出（8-10バイト）
            horse_num_str = line[8:10].strip()
            horse_num = int(horse_num_str) if horse_num_str.isdigit() else None
            
            # 蹄鉄コード抽出（279-282バイト、0始まり）
            hoof_iron = line[279:282].strip()
            
            # 蹄状態コード抽出（282-285バイト、0始まり）
            hoof_condition = line[282:285].strip()
            
            results.append({
                'line_num': line_num,
                'race_key': race_key,
                'horse_num': horse_num,
                'hoof_iron_code': hoof_iron,
                'hoof_condition_code': hoof_condition,
                'hoof_iron_raw': repr(line[279:282]),
                'hoof_condition_raw': repr(line[282:285]),
                'data_source': 'ZKB'
            })
    
    return results

if __name__ == "__main__":
    import sys
    
    # KYIファイル処理
    kyi_file = '/home/user/uploaded_files/KYI250106.txt'
    print("="*80)
    print("🔍 KYI250106.txt から蹄データ抽出")
    print("="*80)
    
    try:
        kyi_results = parse_kyi_hoof_data(kyi_file)
        print(f"\n✅ 総抽出件数: {len(kyi_results)} 件")
        
        # 最初の10件を表示
        print("\n📊 サンプルデータ（最初の10件）:")
        print(f"{'No':<5} {'レースキー':<12} {'馬番':<5} {'蹄コード':<10} {'生データ':<15}")
        print("-"*60)
        
        for i, result in enumerate(kyi_results[:10], 1):
            print(f"{i:<5} {result['race_key']:<12} {result['horse_num']:<5} {result['hoof_code']:<10} {result['hoof_code_raw']:<15}")
        
        # 統計情報
        print("\n📈 蹄コード分布:")
        hoof_codes = [r['hoof_code'] for r in kyi_results if r['hoof_code']]
        from collections import Counter
        code_dist = Counter(hoof_codes)
        
        for code, count in code_dist.most_common(10):
            print(f"  {code}: {count}件")
        
        # 空データ確認
        empty_count = sum(1 for r in kyi_results if not r['hoof_code'])
        print(f"\n⚠️ 空データ: {empty_count}件 ({empty_count/len(kyi_results)*100:.1f}%)")
        
    except FileNotFoundError:
        print(f"❌ ファイルが見つかりません: {kyi_file}")
    except Exception as e:
        print(f"❌ エラー: {e}")
        import traceback
        traceback.print_exc()
    
    # ZKBファイル処理
    zkb_file = '/home/user/uploaded_files/ZKB250106.txt'
    print("\n" + "="*80)
    print("🔍 ZKB250106.txt から蹄データ抽出")
    print("="*80)
    
    try:
        zkb_results = parse_zkb_hoof_data(zkb_file)
        print(f"\n✅ 総抽出件数: {len(zkb_results)} 件")
        
        # 最初の10件を表示
        print("\n📊 サンプルデータ（最初の10件）:")
        print(f"{'No':<5} {'レースキー':<12} {'馬番':<5} {'蹄鉄':<8} {'蹄状態':<8}")
        print("-"*50)
        
        for i, result in enumerate(zkb_results[:10], 1):
            print(f"{i:<5} {result['race_key']:<12} {result['horse_num']:<5} {result['hoof_iron_code']:<8} {result['hoof_condition_code']:<8}")
        
        # 統計情報
        print("\n📈 蹄鉄コード分布:")
        iron_codes = [r['hoof_iron_code'] for r in zkb_results if r['hoof_iron_code']]
        iron_dist = Counter(iron_codes)
        
        for code, count in iron_dist.most_common(10):
            print(f"  {code}: {count}件")
        
        print("\n📈 蹄状態コード分布:")
        condition_codes = [r['hoof_condition_code'] for r in zkb_results if r['hoof_condition_code']]
        condition_dist = Counter(condition_codes)
        
        for code, count in condition_dist.most_common(10):
            print(f"  {code}: {count}件")
        
    except FileNotFoundError:
        print(f"❌ ファイルが見つかりません: {zkb_file}")
    except Exception as e:
        print(f"❌ エラー: {e}")
        import traceback
        traceback.print_exc()

