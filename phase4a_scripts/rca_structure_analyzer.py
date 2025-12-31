#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
RCA（レース結果CSV）構造解析スクリプト
UMAYOMI Phase 4A-1: RCA ファイルの正確なフィールド構造を解析

実行方法:
    python rca_structure_analyzer.py

出力:
    - コンソールに構造解析結果を表示
    - E:\JRDB\rca_structure_analysis.txt に保存
"""

import os
import csv

def analyze_rca_structure():
    """RCA ファイルの構造を解析"""
    
    print("=" * 80)
    print("🔍 RCA（レース結果CSV）構造解析開始")
    print("=" * 80)
    
    # サンプルファイルパス（CEO環境で実行時に自動検出）
    rca_base_dir = r"E:\JRDB\unzipped_weekly\sed"  # RCAファイルはsedフォルダ内
    
    if not os.path.exists(rca_base_dir):
        print(f"❌ エラー: {rca_base_dir} が見つかりません")
        print("💡 このスクリプトは CEO 環境（Windows/E:\JRDB\）で実行してください")
        return
    
    # 最初のRCAファイルを取得
    rca_files = sorted([f for f in os.listdir(rca_base_dir) if f.startswith('RCA') and f.endswith('.csv')])
    
    if not rca_files:
        print(f"❌ エラー: {rca_base_dir} に RCA*.csv ファイルが見つかりません")
        return
    
    sample_file = os.path.join(rca_base_dir, rca_files[0])
    print(f"📄 サンプルファイル: {sample_file}")
    
    # ファイルを読み込み
    try:
        with open(sample_file, 'r', encoding='shift_jis', errors='ignore') as f:
            csv_reader = csv.reader(f)
            rows = list(csv_reader)
        
        print(f"✅ 総行数: {len(rows):,}")
        
        if len(rows) == 0:
            print("❌ エラー: ファイルが空です")
            return
        
        # ヘッダー行の確認
        if len(rows) > 0:
            header = rows[0]
            print(f"✅ カラム数: {len(header)}")
            print()
            
            print("=" * 80)
            print("📊 ヘッダー行（カラム名）")
            print("=" * 80)
            for i, col in enumerate(header, 1):
                print(f"{i:2d}. '{col}'")
        
        # データ行のサンプル
        print()
        print("=" * 80)
        print("📊 データ行サンプル（最初の3行）")
        print("=" * 80)
        
        for i, row in enumerate(rows[1:4], 1):
            print(f"\n--- レコード {i} ---")
            for j, val in enumerate(row, 1):
                if j <= 10:  # 最初の10カラムのみ表示
                    col_name = header[j-1] if j <= len(header) else f"Col{j}"
                    print(f"{col_name}: '{val}'")
        
        # 全体の統計情報
        print()
        print("=" * 80)
        print("📊 全体統計")
        print("=" * 80)
        print(f"✅ 総レコード数（ヘッダー除く）: {len(rows)-1:,}")
        
        # 結果をファイルに保存
        output_file = r"E:\JRDB\rca_structure_analysis.txt"
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write("=" * 80 + "\n")
                f.write("RCA（レース結果CSV）構造解析結果\n")
                f.write("=" * 80 + "\n\n")
                f.write(f"サンプルファイル: {sample_file}\n")
                f.write(f"総行数: {len(rows):,}\n")
                f.write(f"カラム数: {len(header)}\n\n")
                f.write("ヘッダー行:\n")
                for i, col in enumerate(header, 1):
                    f.write(f"{i:2d}. '{col}'\n")
            
            print(f"✅ 解析結果を保存: {output_file}")
        except Exception as e:
            print(f"⚠️  警告: 結果保存に失敗: {e}")
        
        print()
        print("=" * 80)
        print("✅ RCA 構造解析完了")
        print("=" * 80)
        
    except Exception as e:
        print(f"❌ エラー: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    analyze_rca_structure()
