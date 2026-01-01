#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Shift_JIS版JRDBファイルパーサー（蹄データ抽出）

目的: KYI/ZKBファイルから蹄データを正確に抽出
エンコーディング: Shift_JIS（必須）
バイト位置ベース: 固定長レコードの高速パース
"""

import sys
import json
from datetime import datetime
from typing import List, Dict, Optional


class JRDBHoofParser:
    """JRDB蹄データパーサー（Shift_JIS版）"""
    
    def __init__(self):
        self.encoding = 'shift_jis'
        
    def parse_kyi_file(self, filepath: str) -> List[Dict]:
        """
        KYIファイルから蹄コードを抽出
        
        Args:
            filepath: KYIファイルのパス
            
        Returns:
            蹄データのリスト
        """
        results = []
        
        with open(filepath, 'rb') as f:
            for line_num, line_bytes in enumerate(f, 1):
                try:
                    # レコード長確認
                    if len(line_bytes) < 165:
                        print(f"⚠️ 行{line_num}: レコード長不足 ({len(line_bytes)} bytes)")
                        continue
                    
                    # レースキー: 0-7バイト目（8桁）
                    race_key = line_bytes[0:8].decode(self.encoding).strip()
                    
                    # 馬番: 8-9バイト目（2桁）
                    horse_num = line_bytes[8:10].decode(self.encoding).strip()
                    
                    # 蹄コード: 163-164バイト目（2桁、0起点では162-164）
                    # JRDB公式仕様: 163-165バイト目（1起点）
                    hoof_code = line_bytes[162:165].decode(self.encoding).strip()
                    
                    # レース日を抽出（race_keyから）
                    # race_key = PPYYMMDD (PP=場コード, YY=開催, MM=月日の一部, DD=日)
                    # 実際のフォーマット: 場コード(2) + 開催(2) + 日(2) + R(2)
                    # 例: 06251201 = 中山(06) + 2回5日(25) + 12(日?) + 01R
                    
                    # ここでは簡易的に現在日付を使用（後で修正）
                    race_date = datetime.now().strftime('%Y-%m-%d')
                    
                    # 場コード
                    venue_code = race_key[0:2]
                    
                    # レース番号
                    race_num = int(race_key[6:8]) if race_key[6:8].isdigit() else 0
                    
                    results.append({
                        'race_key': race_key,
                        'race_date': race_date,
                        'venue_code': venue_code,
                        'race_num': race_num,
                        'horse_num': horse_num,
                        'hoof_code': hoof_code if hoof_code else None,
                        'data_source': 'KYI'
                    })
                    
                except Exception as e:
                    print(f"❌ 行{line_num}でエラー: {e}")
                    continue
        
        return results
    
    def parse_zkb_file(self, filepath: str) -> List[Dict]:
        """
        ZKBファイルから蹄鉄・蹄状態コードを抽出
        
        Args:
            filepath: ZKBファイルのパス
            
        Returns:
            蹄データのリスト
        """
        results = []
        
        with open(filepath, 'rb') as f:
            for line_num, line_bytes in enumerate(f, 1):
                try:
                    # レコード長確認
                    if len(line_bytes) < 286:
                        print(f"⚠️ 行{line_num}: レコード長不足 ({len(line_bytes)} bytes)")
                        continue
                    
                    # レースキー: 0-7バイト目（8桁）
                    race_key = line_bytes[0:8].decode(self.encoding).strip()
                    
                    # 馬番: 8-9バイト目（2桁）
                    horse_num = line_bytes[8:10].decode(self.encoding).strip()
                    
                    # 蹄鉄コード: 280-282バイト目（3桁、0起点では279-281）
                    hoof_iron_code = line_bytes[279:282].decode(self.encoding).strip()
                    
                    # 蹄状態コード: 283-285バイト目（3桁、0起点では282-285）
                    hoof_condition_code = line_bytes[282:285].decode(self.encoding).strip()
                    
                    # レース日を抽出（race_keyから、簡易的に現在日付）
                    race_date = datetime.now().strftime('%Y-%m-%d')
                    
                    # 場コード
                    venue_code = race_key[0:2]
                    
                    # レース番号
                    race_num = int(race_key[6:8]) if race_key[6:8].isdigit() else 0
                    
                    results.append({
                        'race_key': race_key,
                        'race_date': race_date,
                        'venue_code': venue_code,
                        'race_num': race_num,
                        'horse_num': horse_num,
                        'hoof_iron_code': hoof_iron_code if hoof_iron_code else None,
                        'hoof_condition_code': hoof_condition_code if hoof_condition_code else None,
                        'data_source': 'ZKB'
                    })
                    
                except Exception as e:
                    print(f"❌ 行{line_num}でエラー: {e}")
                    continue
        
        return results
    
    def merge_hoof_data(self, kyi_data: List[Dict], zkb_data: List[Dict]) -> List[Dict]:
        """
        KYIとZKBのデータをマージ
        
        Args:
            kyi_data: KYIファイルから抽出したデータ
            zkb_data: ZKBファイルから抽出したデータ
            
        Returns:
            マージ後のデータ
        """
        # race_key + horse_num をキーにしてマージ
        merged = {}
        
        # KYIデータを格納
        for item in kyi_data:
            key = (item['race_key'], item['horse_num'])
            merged[key] = item.copy()
        
        # ZKBデータをマージ
        for item in zkb_data:
            key = (item['race_key'], item['horse_num'])
            if key in merged:
                merged[key]['hoof_iron_code'] = item['hoof_iron_code']
                merged[key]['hoof_condition_code'] = item['hoof_condition_code']
                merged[key]['data_source'] = 'KYI+ZKB'
            else:
                # ZKBのみのデータ
                merged[key] = item.copy()
        
        return list(merged.values())
    
    def validate_data(self, data: List[Dict]) -> Dict:
        """
        データ検証
        
        Args:
            data: 蹄データのリスト
            
        Returns:
            検証結果
        """
        total = len(data)
        
        # NULL値のカウント
        kyi_null = sum(1 for item in data if item.get('hoof_code') is None)
        zkb_iron_null = sum(1 for item in data if item.get('hoof_iron_code') is None)
        zkb_condition_null = sum(1 for item in data if item.get('hoof_condition_code') is None)
        
        # 蹄コードの分布
        from collections import Counter
        hoof_code_dist = Counter(item.get('hoof_code') for item in data if item.get('hoof_code'))
        hoof_iron_dist = Counter(item.get('hoof_iron_code') for item in data if item.get('hoof_iron_code'))
        hoof_condition_dist = Counter(item.get('hoof_condition_code') for item in data if item.get('hoof_condition_code'))
        
        return {
            'total': total,
            'kyi_data_count': total - kyi_null,
            'kyi_null_count': kyi_null,
            'zkb_iron_data_count': total - zkb_iron_null,
            'zkb_iron_null_count': zkb_iron_null,
            'zkb_condition_data_count': total - zkb_condition_null,
            'zkb_condition_null_count': zkb_condition_null,
            'hoof_code_distribution': dict(hoof_code_dist.most_common(20)),
            'hoof_iron_distribution': dict(hoof_iron_dist.most_common(20)),
            'hoof_condition_distribution': dict(hoof_condition_dist.most_common(20))
        }


def main():
    """メイン処理"""
    parser = JRDBHoofParser()
    
    # ファイルパス（環境変数または引数から取得）
    kyi_file = sys.argv[1] if len(sys.argv) > 1 else '/home/user/uploaded_files/KYI250106.txt'
    zkb_file = sys.argv[2] if len(sys.argv) > 2 else '/home/user/uploaded_files/ZKB250106.txt'
    
    print("=" * 100)
    print("JRDB蹄データ抽出（Shift_JIS版）")
    print("=" * 100)
    
    # KYIファイルパース
    print(f"\n【KYIファイル解析】: {kyi_file}")
    kyi_data = parser.parse_kyi_file(kyi_file)
    print(f"✅ {len(kyi_data)} 件のデータを抽出")
    
    # ZKBファイルパース
    print(f"\n【ZKBファイル解析】: {zkb_file}")
    zkb_data = parser.parse_zkb_file(zkb_file)
    print(f"✅ {len(zkb_data)} 件のデータを抽出")
    
    # データマージ
    print(f"\n【データマージ】")
    merged_data = parser.merge_hoof_data(kyi_data, zkb_data)
    print(f"✅ {len(merged_data)} 件の統合データ")
    
    # データ検証
    print(f"\n【データ検証】")
    validation = parser.validate_data(merged_data)
    print(f"総件数: {validation['total']}")
    print(f"KYIデータ: {validation['kyi_data_count']} 件（NULL: {validation['kyi_null_count']}件）")
    print(f"ZKB蹄鉄: {validation['zkb_iron_data_count']} 件（NULL: {validation['zkb_iron_null_count']}件）")
    print(f"ZKB蹄状態: {validation['zkb_condition_data_count']} 件（NULL: {validation['zkb_condition_null_count']}件）")
    
    # JSON出力
    output_file = '/home/user/webapp/data/hoof_data_complete.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(merged_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ データ保存完了: {output_file}")
    
    # 検証結果をJSON出力
    validation_file = '/home/user/webapp/data/hoof_data_validation.json'
    with open(validation_file, 'w', encoding='utf-8') as f:
        json.dump(validation, f, ensure_ascii=False, indent=2)
    
    print(f"✅ 検証結果保存完了: {validation_file}")
    
    print("\n" + "=" * 100)
    print("✅ 蹄データ抽出完了")
    print("=" * 100)


if __name__ == '__main__':
    main()
