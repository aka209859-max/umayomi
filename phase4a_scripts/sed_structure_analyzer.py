#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SED（成績データ）構造解析スクリプト
UMAYOMI Phase 4A-1: SED ファイルの正確なフィールド構造を解析

実行方法:
    python sed_structure_analyzer.py

出力:
    - コンソールに構造解析結果を表示
    - E:\JRDB\sed_structure_analysis.txt に保存
"""

import os
import sys

def analyze_sed_structure():
    """SED ファイルの構造を解析"""
    
    print("=" * 80)
    print("🔍 SED（成績データ）構造解析開始")
    print("=" * 80)
    
    # サンプルファイルパス（CEO環境で実行時に自動検出）
    sed_base_dir = r"E:\JRDB\unzipped_weekly\sed"
    
    if not os.path.exists(sed_base_dir):
        print(f"❌ エラー: {sed_base_dir} が見つかりません")
        print("💡 このスクリプトは CEO 環境（Windows/E:\JRDB\）で実行してください")
        return
    
    # 最初のSEDファイルを取得
    sed_files = sorted([f for f in os.listdir(sed_base_dir) if f.startswith('SED') and f.endswith('.txt')])
    
    if not sed_files:
        print(f"❌ エラー: {sed_base_dir} に SED*.txt ファイルが見つかりません")
        return
    
    sample_file = os.path.join(sed_base_dir, sed_files[0])
    print(f"📄 サンプルファイル: {sample_file}")
    
    # ファイルを読み込み
    try:
        with open(sample_file, 'r', encoding='shift_jis', errors='ignore') as f:
            lines = f.readlines()
        
        print(f"✅ 総行数: {len(lines):,}")
        
        if len(lines) == 0:
            print("❌ エラー: ファイルが空です")
            return
        
        # 最初の行を解析
        first_line = lines[0]
        line_length = len(first_line.rstrip('\n\r'))
        
        print(f"✅ 1行の長さ: {line_length} バイト")
        print()
        
        # 重要フィールドの抽出
        print("=" * 80)
        print("📊 重要フィールドの抽出（最初の3行）")
        print("=" * 80)
        
        for i, line in enumerate(lines[:3], 1):
            print(f"\n--- レコード {i} ---")
            line = line.rstrip('\n\r')
            
            # レースキー（1-8バイト）
            race_key = line[0:8] if len(line) >= 8 else ""
            print(f"レースキー (1-8): '{race_key}'")
            
            # 馬番（9-10バイト）
            horse_num = line[8:10] if len(line) >= 10 else ""
            print(f"馬番 (9-10): '{horse_num}'")
            
            # 血統登録番号（11-18バイト）
            pedigree_id = line[10:18] if len(line) >= 18 else ""
            print(f"血統登録番号 (11-18): '{pedigree_id}'")
            
            # 着順（75-76バイト）※要確認
            finish_pos = line[74:76] if len(line) >= 76 else ""
            print(f"着順候補 (75-76): '{finish_pos}'")
            
            # タイム（要確認）
            # 通常は 77-80 あたり
            time_candidate = line[76:80] if len(line) >= 80 else ""
            print(f"タイム候補 (77-80): '{time_candidate}'")
            
            # 蹄コード（267-270バイト）
            if len(line) >= 270:
                hoof_code = line[266:270]
                print(f"🐴 蹄コード (267-270): '{hoof_code}'")
            else:
                print(f"⚠️  蹄コード: ファイル長不足（{len(line)} バイト）")
            
            # IDM（予測指数）候補位置
            # KYI では 55-59 だが、SED では異なる可能性
            if len(line) >= 59:
                idm_candidate = line[54:59]
                print(f"IDM候補 (55-59): '{idm_candidate}'")
        
        # 全体の統計情報
        print()
        print("=" * 80)
        print("📊 全体統計")
        print("=" * 80)
        
        # 蹄コードの統計
        hoof_codes = []
        for line in lines:
            line = line.rstrip('\n\r')
            if len(line) >= 270:
                hoof_code = line[266:270]
                if hoof_code.strip():  # 空白以外
                    hoof_codes.append(hoof_code)
        
        print(f"✅ 蹄コード設定済み: {len(hoof_codes):,} / {len(lines):,} ({len(hoof_codes)/len(lines)*100:.1f}%)")
        
        # 蹄コードの頻度トップ10
        from collections import Counter
        hoof_counter = Counter(hoof_codes)
        print()
        print("🐴 蹄コード頻度トップ10:")
        for code, count in hoof_counter.most_common(10):
            print(f"  '{code}': {count:,}回")
        
        # 結果をファイルに保存
        output_file = r"E:\JRDB\sed_structure_analysis.txt"
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write("=" * 80 + "\n")
                f.write("SED（成績データ）構造解析結果\n")
                f.write("=" * 80 + "\n\n")
                f.write(f"サンプルファイル: {sample_file}\n")
                f.write(f"総行数: {len(lines):,}\n")
                f.write(f"1行の長さ: {line_length} バイト\n\n")
                f.write(f"蹄コード設定済み: {len(hoof_codes):,} / {len(lines):,} ({len(hoof_codes)/len(lines)*100:.1f}%)\n\n")
                f.write("蹄コード頻度トップ10:\n")
                for code, count in hoof_counter.most_common(10):
                    f.write(f"  '{code}': {count:,}回\n")
            
            print()
            print(f"✅ 解析結果を保存: {output_file}")
        except Exception as e:
            print(f"⚠️  警告: 結果保存に失敗: {e}")
        
        print()
        print("=" * 80)
        print("✅ SED 構造解析完了")
        print("=" * 80)
        
    except Exception as e:
        print(f"❌ エラー: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    analyze_sed_structure()
