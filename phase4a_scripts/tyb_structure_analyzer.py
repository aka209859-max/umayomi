#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TYB（直前情報データ）構造解析スクリプト
UMAYOMI Phase 4A-1: TYB ファイルの正確なフィールド構造を解析

実行方法:
    python tyb_structure_analyzer.py

出力:
    - コンソールに構造解析結果を表示
    - E:\JRDB\tyb_structure_analysis.txt に保存
"""

import os
import sys

def analyze_tyb_structure():
    """TYB ファイルの構造を解析"""
    
    print("=" * 80)
    print("🔍 TYB（直前情報データ）構造解析開始")
    print("=" * 80)
    
    # サンプルファイルパス（CEO環境で実行時に自動検出）
    tyb_base_dir = r"E:\JRDB\unzipped_weekly\tyb"
    
    if not os.path.exists(tyb_base_dir):
        print(f"❌ エラー: {tyb_base_dir} が見つかりません")
        print("💡 このスクリプトは CEO 環境（Windows/E:\JRDB\）で実行してください")
        return
    
    # 最初のTYBファイルを取得
    tyb_files = sorted([f for f in os.listdir(tyb_base_dir) if f.startswith('TYB') and f.endswith('.txt')])
    
    if not tyb_files:
        print(f"❌ エラー: {tyb_base_dir} に TYB*.txt ファイルが見つかりません")
        return
    
    sample_file = os.path.join(tyb_base_dir, tyb_files[0])
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
            
            # オッズ候補（要確認）
            odds_candidate = line[18:25] if len(line) >= 25 else ""
            print(f"オッズ候補 (19-25): '{odds_candidate}'")
            
            # 人気順位候補（要確認）
            popularity_candidate = line[25:27] if len(line) >= 27 else ""
            print(f"人気順位候補 (26-27): '{popularity_candidate}'")
            
            # パドック評価候補（要確認）
            paddock_candidate = line[27:30] if len(line) >= 30 else ""
            print(f"パドック評価候補 (28-30): '{paddock_candidate}'")
        
        # 全体の統計情報
        print()
        print("=" * 80)
        print("📊 全体統計")
        print("=" * 80)
        print(f"✅ 総レコード数: {len(lines):,}")
        
        # 結果をファイルに保存
        output_file = r"E:\JRDB\tyb_structure_analysis.txt"
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write("=" * 80 + "\n")
                f.write("TYB（直前情報データ）構造解析結果\n")
                f.write("=" * 80 + "\n\n")
                f.write(f"サンプルファイル: {sample_file}\n")
                f.write(f"総行数: {len(lines):,}\n")
                f.write(f"1行の長さ: {line_length} バイト\n\n")
            
            print(f"✅ 解析結果を保存: {output_file}")
        except Exception as e:
            print(f"⚠️  警告: 結果保存に失敗: {e}")
        
        print()
        print("=" * 80)
        print("✅ TYB 構造解析完了")
        print("=" * 80)
        
    except Exception as e:
        print(f"❌ エラー: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    analyze_tyb_structure()
