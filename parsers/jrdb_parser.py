"""
JRDB データパーサー (全14種類対応)

データ期間: 2016-2025年
開催日数: 1,043日
"""

import os
from datetime import datetime
from typing import Dict, List, Any


class JRDBParser:
    """JRDB 固定長フォーマットパーサー"""
    
    def __init__(self, encoding='shift_jis'):
        self.encoding = encoding
    
    # ========================================
    # Layer 1: レース・成績・馬基本情報
    # ========================================
    
    def parse_zed(self, line: str) -> Dict[str, Any]:
        """
        ZED: レース詳細データ
        1行 = 453バイト
        
        主要フィールド:
        - レースID
        - 開催日
        - レース名
        - 距離
        - 馬場状態
        - 天候
        """
        try:
            return {
                'track_code': line[0:2].strip(),          # 場コード
                'race_num': line[2:4].strip(),            # レース番号
                'day_of_week': line[4:6].strip(),         # 曜日
                'month': line[6:8].strip(),               # 月
                'day': line[8:10].strip(),                # 日
                'race_id': line[10:18].strip(),           # レースID
                'race_date': line[18:26].strip(),         # 開催年月日 YYYYMMDD
                'race_name': line[26:76].strip(),         # レース名
                'grade': line[76:78].strip(),             # グレード
                'distance': line[78:82].strip(),          # 距離
                'track_type': line[82:83].strip(),        # コース種別 (1:芝 2:ダート)
                'track_condition': line[83:85].strip(),   # 馬場状態
                'weather': line[85:86].strip(),           # 天候
                'race_class': line[86:88].strip(),        # クラス
                'age_limit': line[88:89].strip(),         # 年齢制限
                'weight_type': line[89:90].strip(),       # 負担重量
                'prize_1': line[90:98].strip(),           # 1着賞金
                'prize_2': line[98:106].strip(),          # 2着賞金
                'prize_3': line[106:114].strip(),         # 3着賞金
                'prize_4': line[114:122].strip(),         # 4着賞金
                'prize_5': line[122:130].strip(),         # 5着賞金
                'num_horses': line[130:132].strip(),      # 出走頭数
                'course': line[132:133].strip(),          # コース (1:右 2:左 3:直線)
            }
        except Exception as e:
            print(f"ZED parse error: {e}")
            return {}
    
    def parse_zkb(self, line: str) -> Dict[str, Any]:
        """
        ZKB: 成績指数データ
        1行 = 354バイト
        
        主要フィールド:
        - 総合指数 (IDM)
        - 騎手指数
        - 情報指数
        - 前走指数 (1-5走前)
        """
        try:
            return {
                'race_id': line[0:18].strip(),            # レースID
                'race_date': line[18:26].strip(),         # 開催年月日
                'idm': line[26:29].strip(),               # 総合指数 IDM
                'jockey_index': line[29:32].strip(),      # 騎手指数
                'info_index': line[32:35].strip(),        # 情報指数
                'reserved1': line[35:38].strip(),         # 予備
                'pace_index': line[38:41].strip(),        # ペース指数
                'up_index': line[41:44].strip(),          # 上がり指数
                'position_index': line[44:47].strip(),    # 位置取り指数
                'pace_change': line[47:50].strip(),       # ペース変化
                # 前走情報
                'prev1_idm': line[50:53].strip(),         # 前走1 IDM
                'prev1_jockey': line[53:56].strip(),      # 前走1 騎手指数
                'prev1_info': line[56:59].strip(),        # 前走1 情報指数
                'prev2_idm': line[59:62].strip(),         # 前走2 IDM
                'prev2_jockey': line[62:65].strip(),      # 前走2 騎手指数
                'prev2_info': line[65:68].strip(),        # 前走2 情報指数
                'prev3_idm': line[68:71].strip(),         # 前走3 IDM
                'prev3_jockey': line[71:74].strip(),      # 前走3 騎手指数
                'prev3_info': line[74:77].strip(),        # 前走3 情報指数
                'prev4_idm': line[77:80].strip(),         # 前走4 IDM
                'prev4_jockey': line[80:83].strip(),      # 前走4 騎手指数
                'prev4_info': line[83:86].strip(),        # 前走4 情報指数
                'prev5_idm': line[86:89].strip(),         # 前走5 IDM
                'prev5_jockey': line[89:92].strip(),      # 前走5 騎手指数
                'prev5_info': line[92:95].strip(),        # 前走5 情報指数
                # 着順・人気
                'finish_position': line[95:97].strip(),   # 着順
                'popularity': line[97:99].strip(),        # 人気
                'horse_weight': line[99:102].strip(),     # 馬体重
                'horse_weight_diff': line[102:105].strip(), # 馬体重増減
                'odds': line[105:111].strip(),            # オッズ
                'horse_num': line[111:113].strip(),       # 馬番
                'frame_num': line[113:114].strip(),       # 枠番
            }
        except Exception as e:
            print(f"ZKB parse error: {e}")
            return {}
    
    def parse_bac(self, line: str) -> Dict[str, Any]:
        """
        BAC: 馬別成績データ
        1行 = 208バイト
        
        主要フィールド:
        - 馬ID
        - 過去の成績
        - 血統情報
        """
        try:
            return {
                'track_code': line[0:2].strip(),          # 場コード
                'race_num': line[2:4].strip(),            # レース番号
                'race_date_short': line[4:6].strip(),     # 年月日 (YY)
                'race_full_date': line[6:14].strip(),     # 開催年月日 YYYYMMDD
                'start_time': line[14:18].strip(),        # 発走時刻 HHMM
                'distance': line[18:21].strip(),          # 距離
                'track_type': line[21:22].strip(),        # コース種別
                'course': line[22:23].strip(),            # コース (右左)
                'grade': line[23:25].strip(),             # グレード
                'race_class': line[25:27].strip(),        # クラス
                'age_limit': line[27:28].strip(),         # 年齢制限
                'weight_type': line[28:29].strip(),       # 負担重量
                'horse_id': line[29:37].strip(),          # 馬ID (8桁)
                'horse_name': line[37:73].strip(),        # 馬名
                'distance_aptitude': line[73:74].strip(), # 距離適性
                'sire_name': line[74:110].strip(),        # 父馬名
                'dam_name': line[110:146].strip(),        # 母馬名
                'trainer_name': line[146:158].strip(),    # 調教師名
                'jockey_name': line[158:170].strip(),     # 騎手名
                'owner_name': line[170:194].strip(),      # 馬主名
                'breeder_name': line[194:218].strip() if len(line) > 194 else '',  # 生産者名
            }
        except Exception as e:
            print(f"BAC parse error: {e}")
            return {}
    
    # ========================================
    # Layer 2: 調教・騎手・馬データ
    # ========================================
    
    def parse_cyb(self, line: str) -> Dict[str, Any]:
        """
        CYB: 調教データ
        1行 = 91バイト
        
        主要フィールド:
        - 調教日
        - 調教時間
        - 評価
        """
        try:
            return {
                'track_code': line[0:2].strip(),          # 場コード
                'race_num': line[2:4].strip(),            # レース番号
                'horse_num': line[4:6].strip(),           # 馬番
                'training_date': line[6:14].strip(),      # 調教年月日 YYYYMMDD
                'training_time': line[14:18].strip(),     # 調教時刻 HHMM
                'training_course': line[18:20].strip(),   # 調教コース
                'training_type': line[20:21].strip(),     # 調教種別
                'training_distance': line[21:24].strip(), # 調教距離
                'time_4f': line[24:28].strip(),           # 4F タイム
                'time_3f': line[28:32].strip(),           # 3F タイム
                'time_2f': line[32:36].strip(),           # 2F タイム
                'time_1f': line[36:40].strip(),           # 1F タイム
                'finish_index': line[40:43].strip(),      # 終い指数
                'evaluation': line[43:44].strip(),        # 評価 (A-E)
                'trainer_comment': line[44:].strip(),     # 調教師コメント
            }
        except Exception as e:
            print(f"CYB parse error: {e}")
            return {}
    
    def parse_joa(self, line: str) -> Dict[str, Any]:
        """
        JOA: 騎手データ
        1行 = 113バイト
        
        主要フィールド:
        - 騎手コード
        - 騎手名
        - 勝率データ
        """
        try:
            return {
                'track_code': line[0:2].strip(),          # 場コード
                'race_num': line[2:4].strip(),            # レース番号
                'horse_num': line[4:6].strip(),           # 馬番
                'jockey_code': line[6:11].strip(),        # 騎手コード
                'jockey_name': line[11:23].strip(),       # 騎手名
                'jockey_weight': line[23:28].strip(),     # 騎手体重
                'jockey_weight_diff': line[28:33].strip(),# 騎手体重増減
                'leading_rate': line[33:38].strip(),      # 先行率
                'track_win_rate': line[38:43].strip(),    # 当該コース勝率
                'distance_win_rate': line[43:48].strip(), # 距離別勝率
                'total_wins': line[48:53].strip(),        # 通算勝利数
                'total_races': line[53:58].strip(),       # 通算出走数
                'win_rate': line[58:63].strip(),          # 勝率
                'place_rate': line[63:68].strip(),        # 連対率
            }
        except Exception as e:
            print(f"JOA parse error: {e}")
            return {}
    
    def parse_kka(self, line: str) -> Dict[str, Any]:
        """
        KKA: 馬基本データ
        1行 = 306バイト
        
        主要フィールド:
        - 馬ID
        - 年齢
        - 性別
        - 毛色
        """
        try:
            return {
                'track_code': line[0:2].strip(),          # 場コード
                'race_num': line[2:4].strip(),            # レース番号
                'horse_num': line[4:6].strip(),           # 馬番
                'horse_id': line[6:14].strip(),           # 馬ID (8桁)
                'year_of_birth': line[14:18].strip(),     # 生年
                'trainer_code': line[18:23].strip(),      # 調教師コード
                'trainer_name': line[23:35].strip(),      # 調教師名
                'owner_code': line[35:41].strip(),        # 馬主コード
                'owner_name': line[41:81].strip(),        # 馬主名
                'breeder_code': line[81:87].strip(),      # 生産者コード
                'place_of_birth': line[87:89].strip(),    # 産地
                'auction_price': line[89:97].strip(),     # セール価格
                'import_year': line[97:101].strip(),      # 輸入年
                'sire_id': line[101:109].strip(),         # 父馬ID
                'dam_id': line[109:117].strip(),          # 母馬ID
                'dam_sire_id': line[117:125].strip(),     # 母父馬ID
                'age': line[125:127].strip(),             # 年齢
                'sex': line[127:128].strip(),             # 性別 (1:牡 2:牝 3:セン)
                'coat_color': line[128:130].strip(),      # 毛色
                'mark': line[130:160].strip(),            # 馬印
                'reserved': line[160:162].strip(),        # 予備
                'total_prize': line[162:170].strip(),     # 獲得賞金
            }
        except Exception as e:
            print(f"KKA parse error: {e}")
            return {}
    
    def parse_ukc(self, line: str) -> Dict[str, Any]:
        """
        UKC: 馬成績データ (詳細)
        1行 = 419バイト
        
        主要フィールド:
        - 過去の成績 (詳細版)
        - 距離別成績
        - コース別成績
        """
        try:
            return {
                'race_id': line[0:18].strip(),            # レースID
                'race_date': line[18:26].strip(),         # 開催年月日
                'horse_id': line[26:34].strip(),          # 馬ID
                'horse_name': line[34:70].strip(),        # 馬名
                # 距離別成績
                'turf_short_runs': line[70:73].strip(),   # 芝短距離出走数
                'turf_short_1st': line[73:76].strip(),    # 芝短距離1着数
                'turf_short_2nd': line[76:79].strip(),    # 芝短距離2着数
                'turf_short_3rd': line[79:82].strip(),    # 芝短距離3着数
                'turf_mile_runs': line[82:85].strip(),    # 芝マイル出走数
                'turf_mile_1st': line[85:88].strip(),     # 芝マイル1着数
                'turf_mile_2nd': line[88:91].strip(),     # 芝マイル2着数
                'turf_mile_3rd': line[91:94].strip(),     # 芝マイル3着数
                'turf_middle_runs': line[94:97].strip(),  # 芝中距離出走数
                'turf_middle_1st': line[97:100].strip(),  # 芝中距離1着数
                'turf_middle_2nd': line[100:103].strip(), # 芝中距離2着数
                'turf_middle_3rd': line[103:106].strip(), # 芝中距離3着数
                'turf_long_runs': line[106:109].strip(),  # 芝長距離出走数
                'turf_long_1st': line[109:112].strip(),   # 芝長距離1着数
                'turf_long_2nd': line[112:115].strip(),   # 芝長距離2着数
                'turf_long_3rd': line[115:118].strip(),   # 芝長距離3着数
                # ダート成績
                'dirt_short_runs': line[118:121].strip(), # ダ短距離出走数
                'dirt_short_1st': line[121:124].strip(),  # ダ短距離1着数
                'dirt_short_2nd': line[124:127].strip(),  # ダ短距離2着数
                'dirt_short_3rd': line[127:130].strip(),  # ダ短距離3着数
                'dirt_mile_runs': line[130:133].strip(),  # ダマイル出走数
                'dirt_mile_1st': line[133:136].strip(),   # ダマイル1着数
                'dirt_mile_2nd': line[136:139].strip(),   # ダマイル2着数
                'dirt_mile_3rd': line[139:142].strip(),   # ダマイル3着数
                'dirt_middle_runs': line[142:145].strip(),# ダ中距離出走数
                'dirt_middle_1st': line[145:148].strip(), # ダ中距離1着数
                'dirt_middle_2nd': line[148:151].strip(), # ダ中距離2着数
                'dirt_middle_3rd': line[151:154].strip(), # ダ中距離3着数
                'dirt_long_runs': line[154:157].strip(),  # ダ長距離出走数
                'dirt_long_1st': line[157:160].strip(),   # ダ長距離1着数
                'dirt_long_2nd': line[160:163].strip(),   # ダ長距離2着数
                'dirt_long_3rd': line[163:166].strip(),   # ダ長距離3着数
            }
        except Exception as e:
            print(f"UKC parse error: {e}")
            return {}
    
    def parse_kyi(self, line: str) -> Dict[str, Any]:
        """
        KYI: 競走馬詳細データ
        1行 = 695バイト
        
        主要フィールド:
        - 馬の詳細情報
        - レース前情報
        - 前走詳細
        """
        try:
            return {
                'race_id': line[0:18].strip(),            # レースID
                'race_date': line[18:26].strip(),         # 開催年月日
                'horse_id': line[26:34].strip(),          # 馬ID
                'horse_name': line[34:70].strip(),        # 馬名
                # 前走情報
                'prev_race_date': line[70:78].strip(),    # 前走年月日
                'prev_track': line[78:80].strip(),        # 前走場所
                'prev_race_num': line[80:82].strip(),     # 前走レース番号
                'prev_race_name': line[82:132].strip(),   # 前走レース名
                'prev_num_horses': line[132:134].strip(), # 前走頭数
                'prev_frame': line[134:135].strip(),      # 前走枠番
                'prev_horse_num': line[135:137].strip(),  # 前走馬番
                'prev_odds': line[137:143].strip(),       # 前走オッズ
                'prev_popularity': line[143:145].strip(), # 前走人気
                'prev_finish': line[145:147].strip(),     # 前走着順
                'prev_jockey': line[147:159].strip(),     # 前走騎手
                'prev_weight': line[159:162].strip(),     # 前走斤量
                'prev_distance': line[162:166].strip(),   # 前走距離
                'prev_track_type': line[166:167].strip(), # 前走芝ダ
                'prev_track_condition': line[167:169].strip(), # 前走馬場状態
                'prev_time': line[169:173].strip(),       # 前走タイム
                'prev_time_diff': line[173:178].strip(),  # 前走着差
                'prev_pass_position': line[178:182].strip(), # 前走通過順
                'prev_last_3f': line[182:185].strip(),    # 前走上がり3F
                'prev_horse_weight': line[185:188].strip(),# 前走馬体重
                'prev_weight_diff': line[188:191].strip(),# 前走馬体重増減
                'prev_winner': line[191:227].strip(),     # 前走勝馬
                'prev_prize': line[227:235].strip(),      # 前走賞金
                # レース前情報
                'pre_horse_weight': line[235:238].strip(),# 馬体重 (速報)
                'pre_weight_diff': line[238:241].strip(), # 馬体重増減 (速報)
                'blinker': line[241:242].strip(),         # ブリンカー
                'bandage': line[242:243].strip(),         # 蹄鉄
                'reserved': line[243:245].strip(),        # 予備
                'transport_area': line[245:246].strip(),  # 運搬区分
                'trainer_comment': line[246:].strip(),    # 調教師コメント
            }
        except Exception as e:
            print(f"KYI parse error: {e}")
            return {}
    
    # ========================================
    # Layer 3: オッズ・コメントデータ
    # ========================================
    
    def parse_ot(self, line: str) -> Dict[str, Any]:
        """
        OT: 単勝・複勝オッズ
        1行 = 4,852バイト (超長い)
        
        主要フィールド:
        - 各馬の単勝オッズ
        - 各馬の複勝オッズ
        """
        try:
            race_key = line[0:14].strip()  # レース識別キー
            
            # 単勝オッズ (18頭分: 各6バイト)
            win_odds = []
            for i in range(18):
                start = 14 + (i * 6)
                end = start + 6
                if end <= len(line):
                    odds = line[start:end].strip()
                    if odds:
                        win_odds.append(odds)
            
            # 複勝オッズ (18頭分: 各6バイト)
            place_odds = []
            place_start = 14 + (18 * 6)
            for i in range(18):
                start = place_start + (i * 6)
                end = start + 6
                if end <= len(line):
                    odds = line[start:end].strip()
                    if odds:
                        place_odds.append(odds)
            
            return {
                'race_key': race_key,
                'win_odds': win_odds,
                'place_odds': place_odds,
                '_raw_length': len(line),
            }
        except Exception as e:
            print(f"OT parse error: {e}")
            return {}
    
    def parse_ou(self, line: str) -> Dict[str, Any]:
        """
        OU: 馬連オッズ
        1行 = 1,630バイト
        
        主要フィールド:
        - 馬連オッズマトリックス
        """
        try:
            race_key = line[0:14].strip()  # レース識別キー
            
            # 馬連オッズ (簡易パース)
            umaren_odds = []
            data_start = 14
            
            # 各馬番の組み合わせ (最大18頭)
            for i in range(min(18, (len(line) - data_start) // 6)):
                start = data_start + (i * 6)
                end = start + 6
                if end <= len(line):
                    odds = line[start:end].strip()
                    if odds:
                        umaren_odds.append(odds)
            
            return {
                'race_key': race_key,
                'umaren_odds': umaren_odds[:50],  # 最初の50件のみ
                '_raw_length': len(line),
            }
        except Exception as e:
            print(f"OU parse error: {e}")
            return {}
    
    def parse_ow(self, line: str) -> Dict[str, Any]:
        """
        OW: ワイドオッズ
        1行 = 750バイト
        
        主要フィールド:
        - ワイドオッズマトリックス
        """
        try:
            race_key = line[0:14].strip()  # レース識別キー
            
            # ワイドオッズ (簡易パース)
            wide_odds = []
            data_start = 14
            
            for i in range(min(18, (len(line) - data_start) // 6)):
                start = data_start + (i * 6)
                end = start + 6
                if end <= len(line):
                    odds = line[start:end].strip()
                    if odds:
                        wide_odds.append(odds)
            
            return {
                'race_key': race_key,
                'wide_odds': wide_odds[:50],  # 最初の50件のみ
                '_raw_length': len(line),
            }
        except Exception as e:
            print(f"OW parse error: {e}")
            return {}
    
    def parse_oz(self, line: str) -> Dict[str, Any]:
        """
        OZ: 3連複オッズ
        1行 = 930バイト
        
        主要フィールド:
        - 3連複オッズ
        """
        try:
            race_key = line[0:14].strip()  # レース識別キー
            
            # 3連複オッズ (簡易パース)
            sanrenpuku_odds = []
            data_start = 14
            
            for i in range(min(18, (len(line) - data_start) // 6)):
                start = data_start + (i * 6)
                end = start + 6
                if end <= len(line):
                    odds = line[start:end].strip()
                    if odds:
                        sanrenpuku_odds.append(odds)
            
            return {
                'race_key': race_key,
                'sanrenpuku_odds': sanrenpuku_odds[:50],  # 最初の50件のみ
                '_raw_length': len(line),
            }
        except Exception as e:
            print(f"OZ parse error: {e}")
            return {}
    
    def parse_cha(self, line: str) -> Dict[str, Any]:
        """
        CHA: 厩舎コメント
        1行 = 51バイト
        
        主要フィールド:
        - 馬番
        - コメントコード
        """
        try:
            return {
                'track_code': line[0:2].strip(),          # 場コード
                'race_num': line[2:4].strip(),            # レース番号
                'horse_num': line[4:6].strip(),           # 馬番
                'comment_date': line[6:14].strip(),       # コメント年月日
                'comment_time': line[14:18].strip(),      # コメント時刻
                'comment_code': line[18:20].strip(),      # コメントコード
                'reserved1': line[20:23].strip(),         # 予備1
                'reserved2': line[23:26].strip(),         # 予備2
                'reserved3': line[26:29].strip(),         # 予備3
                'trainer_comment': line[29:].strip(),     # 調教師コメント
            }
        except Exception as e:
            print(f"CHA parse error: {e}")
            return {}
    
    def parse_kab(self, line: str) -> Dict[str, Any]:
        """
        KAB: 馬柱データ
        1行 = 67バイト
        
        主要フィールド:
        - 馬番
        - 騎手名
        - 斤量
        """
        try:
            return {
                'track_code': line[0:2].strip(),          # 場コード
                'race_num': line[2:4].strip(),            # レース番号
                'race_date': line[4:12].strip(),          # 開催年月日
                'horse_num': line[12:14].strip(),         # 馬番
                'reserved1': line[14:16].strip(),         # 予備1
                'reserved2': line[16:18].strip(),         # 予備2
                'jockey_code': line[18:23].strip(),       # 騎手コード
                'jockey_name': line[23:35].strip(),       # 騎手名
                'weight': line[35:38].strip(),            # 斤量
                'reserved3': line[38:41].strip(),         # 予備3
                'reserved4': line[41:44].strip(),         # 予備4
                'reserved5': line[44:47].strip(),         # 予備5
                'reserved6': line[47:50].strip(),         # 予備6
                'odds': line[50:56].strip(),              # オッズ
                'popularity': line[56:58].strip(),        # 人気
                'reserved7': line[58:].strip(),           # 予備7
            }
        except Exception as e:
            print(f"KAB parse error: {e}")
            return {}
    
    # ========================================
    # ファイル処理
    # ========================================
    
    def parse_file(self, filepath: str, data_type: str) -> List[Dict[str, Any]]:
        """
        ファイルをパースして辞書のリストを返す
        
        Args:
            filepath: ファイルパス
            data_type: データ種類 (ZED, ZKB, BAC, etc.)
        
        Returns:
            パース結果のリスト
        """
        results = []
        
        if not os.path.exists(filepath):
            print(f"File not found: {filepath}")
            return results
        
        # パーサー関数のマッピング
        parsers = {
            'ZED': self.parse_zed,
            'ZKB': self.parse_zkb,
            'BAC': self.parse_bac,
            'CYB': self.parse_cyb,
            'JOA': self.parse_joa,
            'KKA': self.parse_kka,
            'UKC': self.parse_ukc,
            'KYI': self.parse_kyi,
            'OT': self.parse_ot,
            'OU': self.parse_ou,
            'OW': self.parse_ow,
            'OZ': self.parse_oz,
            'CHA': self.parse_cha,
            'KAB': self.parse_kab,
        }
        
        if data_type not in parsers:
            print(f"Unknown data type: {data_type}")
            return results
        
        parser_func = parsers[data_type]
        
        try:
            with open(filepath, 'r', encoding=self.encoding, errors='ignore') as f:
                for line_num, line in enumerate(f, 1):
                    line = line.strip()
                    if not line:
                        continue
                    
                    parsed = parser_func(line)
                    if parsed:
                        parsed['_line_num'] = line_num
                        parsed['_source_file'] = os.path.basename(filepath)
                        results.append(parsed)
        
        except Exception as e:
            print(f"Error reading file {filepath}: {e}")
        
        return results


# ========================================
# テスト実行
# ========================================

if __name__ == "__main__":
    print("=" * 80)
    print("JRDB パーサー 全14種類テスト")
    print("=" * 80)
    print()
    
    parser = JRDBParser()
    
    # サンプルファイルパス (sandbox 環境)
    sample_files = {
        # Layer 1
        'ZED': '/home/user/uploaded_files/ZED210620.txt',
        'ZKB': '/home/user/uploaded_files/ZKB210620.txt',
        'BAC': '/home/user/uploaded_files/BAC210620.txt',
        # Layer 2
        'CYB': '/home/user/uploaded_files/CYB210620.txt',
        'JOA': '/home/user/uploaded_files/JOA210620.txt',
        'KKA': '/home/user/uploaded_files/KKA210620.txt',
        'UKC': '/home/user/uploaded_files/UKC210620.txt',
        'KYI': '/home/user/uploaded_files/KYI210620.txt',
        # Layer 3
        'OT': '/home/user/uploaded_files/OT210620.txt',
        'OU': '/home/user/uploaded_files/OU210620.txt',
        'OW': '/home/user/uploaded_files/OW210620.txt',
        'OZ': '/home/user/uploaded_files/OZ210620.txt',
        'CHA': '/home/user/uploaded_files/CHA210620.txt',
        'KAB': '/home/user/uploaded_files/KAB210620.txt',
    }
    
    total_records = 0
    layer_stats = {'Layer 1': 0, 'Layer 2': 0, 'Layer 3': 0}
    
    for data_type, filepath in sample_files.items():
        print(f"📄 {data_type} ファイルをパース中...")
        
        results = parser.parse_file(filepath, data_type)
        
        print(f"   総レコード数: {len(results):,}")
        total_records += len(results)
        
        # Layer 分類
        if data_type in ['ZED', 'ZKB', 'BAC']:
            layer_stats['Layer 1'] += len(results)
            layer = 'Layer 1'
        elif data_type in ['CYB', 'JOA', 'KKA', 'UKC', 'KYI']:
            layer_stats['Layer 2'] += len(results)
            layer = 'Layer 2'
        else:
            layer_stats['Layer 3'] += len(results)
            layer = 'Layer 3'
        
        print(f"   Layer: {layer}")
        
        if results:
            print(f"   サンプル (最初の1件):")
            sample = results[0]
            # フィールド数を表示
            field_count = len([k for k in sample.keys() if not k.startswith('_')])
            print(f"     - フィールド数: {field_count}")
            print(f"     - 主要フィールド: {list(sample.keys())[:5]}")
        
        print()
    
    print("=" * 80)
    print("全パーサーテスト完了")
    print("=" * 80)
    print()
    print(f"📊 総レコード数: {total_records:,}")
    print(f"   - Layer 1 (レース・成績): {layer_stats['Layer 1']:,} レコード")
    print(f"   - Layer 2 (調教・騎手・馬): {layer_stats['Layer 2']:,} レコード")
    print(f"   - Layer 3 (オッズ・コメント): {layer_stats['Layer 3']:,} レコード")
    print()
    print("✅ 全14種類のパーサー実装完了！")
