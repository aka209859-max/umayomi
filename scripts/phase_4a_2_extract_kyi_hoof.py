"""
UMAYOMI Phase 4A-2: KYI蹄コード抽出スクリプト

目的: 全1,265件のKYIファイルから蹄コードを抽出
入力: C:\\JRDB\\unzipped\\KYI*.txt
出力: kyi_hoof_data_all.json
"""

import os
import json
import glob
from datetime import datetime


def parse_kyi_hoof_code(file_path):
    """
    KYIファイルから蹄コードを抽出
    
    仕様:
    - エンコーディング: Shift_JIS
    - 固定長: 1024バイト/レコード
    - 蹄コード位置: 164-165バイト目（0起点: 163-164）
    """
    results = []
    
    try:
        with open(file_path, 'r', encoding='shift_jis', errors='ignore') as f:
            for line_num, line in enumerate(f, 1):
                try:
                    # Shift_JISバイト列として処理
                    line_bytes = line.encode('shift_jis')
                    
                    # 最小長チェック
                    if len(line_bytes) < 165:
                        continue
                    
                    # レースキー（1-8バイト目）
                    race_key = line_bytes[0:8].decode('shift_jis', errors='ignore').strip()
                    
                    # 馬番（9-10バイト目）
                    horse_number_str = line_bytes[8:10].decode('shift_jis', errors='ignore').strip()
                    
                    # 蹄コード（164-165バイト目、0起点: 163-164）
                    hoof_code = line_bytes[163:165].decode('shift_jis', errors='ignore').strip()
                    
                    # 空白やNULL値をスキップ
                    if hoof_code and hoof_code != '  ' and race_key:
                        horse_number = int(horse_number_str) if horse_number_str.isdigit() else None
                        
                        results.append({
                            'race_key': race_key,
                            'horse_number': horse_number,
                            'hoof_code': hoof_code,
                            'line_number': line_num
                        })
                        
                except Exception as e:
                    # 個別レコードのエラーは警告のみ
                    continue
                    
    except Exception as e:
        print(f"❌ ファイル読み込みエラー: {file_path}")
        print(f"   {str(e)}")
        return []
    
    return results


def batch_process_kyi(data_dir, output_file):
    """
    全KYIファイルを一括処理
    """
    all_results = []
    file_pattern = os.path.join(data_dir, 'KYI*.txt')
    kyi_files = sorted(glob.glob(file_pattern))
    
    if not kyi_files:
        print(f"❌ KYIファイルが見つかりません: {file_pattern}")
        return []
    
    print(f"✅ KYIファイル数: {len(kyi_files)}")
    print(f"📂 データディレクトリ: {data_dir}")
    print(f"📄 出力ファイル: {output_file}\n")
    
    start_time = datetime.now()
    
    for i, kyi_file in enumerate(kyi_files, 1):
        # ファイル名から日付を抽出（例: KYI140105.txt → 2014-01-05）
        filename = os.path.basename(kyi_file)
        
        try:
            date_str = filename[3:9]  # YYMMDD
            year = int('20' + date_str[0:2])
            month = int(date_str[2:4])
            day = int(date_str[4:6])
            file_date = f"{year:04d}-{month:02d}-{day:02d}"
        except:
            print(f"⚠️  日付解析エラー: {filename}")
            continue
        
        # 進捗表示（50ファイルごと）
        if i % 50 == 0 or i == 1:
            elapsed = (datetime.now() - start_time).total_seconds()
            rate = i / elapsed if elapsed > 0 else 0
            remaining = (len(kyi_files) - i) / rate if rate > 0 else 0
            
            print(f"[{i:4d}/{len(kyi_files)}] {filename} ({file_date})")
            print(f"  → 進捗: {i/len(kyi_files)*100:.1f}% | 速度: {rate:.1f}ファイル/秒 | 残り: {remaining/60:.1f}分")
            print(f"  → 累計レコード数: {len(all_results):,}\n")
        
        # 蹄コード抽出
        records = parse_kyi_hoof_code(kyi_file)
        
        # ファイル日付を追加
        for record in records:
            record['file_date'] = file_date
            record['source_file'] = filename
        
        all_results.extend(records)
    
    # 処理時間
    elapsed_total = (datetime.now() - start_time).total_seconds()
    
    print("\n" + "="*60)
    print("✅ 処理完了！")
    print("="*60)
    print(f"📊 処理ファイル数: {len(kyi_files):,}")
    print(f"📊 抽出レコード数: {len(all_results):,}")
    print(f"⏱️  処理時間: {elapsed_total/60:.1f}分")
    print(f"⚡ 処理速度: {len(kyi_files)/elapsed_total:.1f}ファイル/秒")
    
    if all_results:
        print(f"\n📅 期間:")
        print(f"  - 最古: {min(r['file_date'] for r in all_results)}")
        print(f"  - 最新: {max(r['file_date'] for r in all_results)}")
        
        # 蹄コード分布（上位10）
        from collections import Counter
        hoof_codes = [r['hoof_code'] for r in all_results if r['hoof_code']]
        code_counts = Counter(hoof_codes)
        
        print(f"\n🔢 蹄コード分布（上位10）:")
        for code, count in code_counts.most_common(10):
            percentage = count / len(hoof_codes) * 100 if hoof_codes else 0
            print(f"  - コード {code}: {count:,}件 ({percentage:.2f}%)")
    
    # JSON保存
    print(f"\n💾 保存中: {output_file}")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)
    
    print(f"✅ 保存完了: {output_file} ({os.path.getsize(output_file)/1024/1024:.1f} MB)")
    
    return all_results


if __name__ == '__main__':
    # データディレクトリ（CEOのローカル環境）
    data_dir = r'C:\JRDB\unzipped'
    
    # 出力ファイル
    output_file = 'kyi_hoof_data_all.json'
    
    print("="*60)
    print("UMAYOMI Phase 4A-2: KYI蹄コード抽出")
    print("="*60)
    print()
    
    # 実行
    results = batch_process_kyi(data_dir, output_file)
    
    if results:
        print("\n" + "="*60)
        print("🎉 Phase 4A-2 完了！")
        print("="*60)
        print(f"\n次のステップ:")
        print(f"  1. {output_file} を確認")
        print(f"  2. Phase 4A-3（ZKB蹄データ抽出）を実行")
        print(f"  3. Phase 4A-6（PostgreSQL投入）を実行")
    else:
        print("\n❌ 処理失敗")
