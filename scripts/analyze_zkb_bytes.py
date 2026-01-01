#!/usr/bin/env python3
"""
ZKB250106.txt のバイト構造を詳細分析
"""

def analyze_zkb_structure(file_path, num_records=5):
    """ZKBファイルの構造を16進ダンプで分析"""
    
    with open(file_path, 'rb') as f:  # バイナリモードで読み込み
        for record_num in range(num_records):
            line_bytes = f.readline()
            
            if not line_bytes:
                break
            
            print(f"\n{'='*80}")
            print(f"📄 レコード {record_num + 1}")
            print(f"{'='*80}")
            print(f"レコード長: {len(line_bytes)} バイト")
            
            # レースキー（0-8バイト）
            race_key = line_bytes[0:8].decode('shift_jis', errors='ignore')
            print(f"\nレースキー（0-8）: {race_key}")
            
            # 馬番（8-10バイト）
            horse_num = line_bytes[8:10].decode('shift_jis', errors='ignore')
            print(f"馬番（8-10）: {horse_num}")
            
            # 280バイト付近を16進ダンプ
            print(f"\n🔍 280バイト付近（270-290バイト）:")
            start = 270
            end = 290
            
            hex_dump = ' '.join(f'{b:02x}' for b in line_bytes[start:end])
            ascii_dump = ''.join(chr(b) if 32 <= b < 127 else '.' for b in line_bytes[start:end])
            sjis_dump = line_bytes[start:end].decode('shift_jis', errors='ignore')
            
            print(f"  HEX : {hex_dump}")
            print(f"  ASCII: {ascii_dump}")
            print(f"  SJIS : {sjis_dump}")
            
            # 蹄コード候補（279-282バイト）
            hoof_candidate = line_bytes[279:282]
            print(f"\n  279-282バイト（蹄鉄候補）:")
            print(f"    HEX: {' '.join(f'{b:02x}' for b in hoof_candidate)}")
            print(f"    SJIS: {hoof_candidate.decode('shift_jis', errors='ignore')}")
            
            # 蹄状態候補（282-285バイト）
            condition_candidate = line_bytes[282:285]
            print(f"\n  282-285バイト（蹄状態候補）:")
            print(f"    HEX: {' '.join(f'{b:02x}' for b in condition_candidate)}")
            print(f"    SJIS: {condition_candidate.decode('shift_jis', errors='ignore')}")
            
            # 全レコードを50バイトずつ表示
            print(f"\n📊 全レコード構造（50バイトずつ）:")
            for i in range(0, min(len(line_bytes), 350), 50):
                chunk = line_bytes[i:i+50]
                hex_str = ' '.join(f'{b:02x}' for b in chunk)
                ascii_str = ''.join(chr(b) if 32 <= b < 127 else '.' for b in chunk)
                print(f"  {i:03d}-{i+50:03d}: {ascii_str}")

if __name__ == "__main__":
    zkb_file = '/home/user/uploaded_files/ZKB250106.txt'
    
    print("="*80)
    print("🔍 ZKB250106.txt バイト構造分析")
    print("="*80)
    
    try:
        analyze_zkb_structure(zkb_file, num_records=3)
    except FileNotFoundError:
        print(f"❌ ファイルが見つかりません: {zkb_file}")
    except Exception as e:
        print(f"❌ エラー: {e}")
        import traceback
        traceback.print_exc()

