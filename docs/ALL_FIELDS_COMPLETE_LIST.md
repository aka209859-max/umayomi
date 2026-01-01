# JRDB 全14種類 完全フィールドリスト

## 📊 概要

- **総ファイル数**: 14種類
- **総レコード数**: 7,279 レコード/日
- **総フィールド数**: 232 フィールド
- **分析可能な軸**: 800–1,000項目（派生フィールド含む）

---

## 📄 Layer 1: レース基本情報（4種類）

### 1. ZED（レース詳細）- 25フィールド

| No | フィールド名 | 説明 |
|----|------------|------|
| 1 | track_code | 場コード（01=札幌, 02=函館, 03=福島, 04=新潟, 05=東京, 06=中山, 07=中京, 08=京都, 09=阪神, 10=小倉） |
| 2 | race_num | レース番号（01-12） |
| 3 | day_of_week | 曜日コード |
| 4 | month | 月 |
| 5 | day | 日 |
| 6 | race_id | レースID（8桁） |
| 7 | race_date | レース日付（YYYYMMDD） |
| 8 | race_name | レース名 |
| 9 | grade | グレード（G1/G2/G3/OP） |
| 10 | distance | 距離（メートル） |
| 11 | track_type | コース種別（1=芝, 2=ダート, 3=障害） |
| 12 | track_condition | 馬場状態（1=良, 2=稍重, 3=重, 4=不良） |
| 13 | weather | 天候（1=晴, 2=曇, 3=雨, 4=雪） |
| 14 | race_class | レースクラス |
| 15 | age_limit | 年齢制限 |
| 16 | weight_type | 負担重量タイプ |
| 17 | prize_1 | 1着賞金 |
| 18 | prize_2 | 2着賞金 |
| 19 | prize_3 | 3着賞金 |
| 20 | prize_4 | 4着賞金 |
| 21 | prize_5 | 5着賞金 |
| 22 | num_horses | 出走頭数 |
| 23 | course | コース |
| 24 | _line_num | 行番号 |
| 25 | _source_file | 元ファイル名 |

---

### 2. ZKB（成績指数）- 34フィールド

| No | フィールド名 | 説明 |
|----|------------|------|
| 1 | race_id | レースID |
| 2 | race_date | レース日付 |
| 3 | idm | IDM（総合指数） |
| 4 | jockey_index | 騎手指数 |
| 5 | info_index | 情報指数 |
| 6 | reserved1 | 予約1 |
| 7 | pace_index | ペース指数 |
| 8 | up_index | 上がり3F指数 |
| 9 | position_index | 位置取り指数 |
| 10 | pace_change | ペース変化 |
| 11 | prev1_idm | 前走IDM |
| 12 | prev1_jockey | 前走騎手指数 |
| 13 | prev1_info | 前走情報指数 |
| 14 | prev2_idm | 2走前IDM |
| 15 | prev2_jockey | 2走前騎手指数 |
| 16 | prev2_info | 2走前情報指数 |
| 17 | prev3_idm | 3走前IDM |
| 18 | prev3_jockey | 3走前騎手指数 |
| 19 | prev3_info | 3走前情報指数 |
| 20 | prev4_idm | 4走前IDM |
| 21 | prev4_jockey | 4走前騎手指数 |
| 22 | prev4_info | 4走前情報指数 |
| 23 | prev5_idm | 5走前IDM |
| 24 | prev5_jockey | 5走前騎手指数 |
| 25 | prev5_info | 5走前情報指数 |
| 26 | finish_position | 着順 |
| 27 | popularity | 人気 |
| 28 | horse_weight | 馬体重 |
| 29 | horse_weight_diff | 馬体重増減 |
| 30 | odds | オッズ |
| 31 | horse_num | 馬番 |
| 32 | frame_num | 枠番 |
| 33 | _line_num | 行番号 |
| 34 | _source_file | 元ファイル名 |

---

### 3. BAC（馬別成績）- 23フィールド

| No | フィールド名 | 説明 |
|----|------------|------|
| 1 | track_code | 場コード |
| 2 | race_num | レース番号 |
| 3 | race_date_short | レース日付（短縮） |
| 4 | race_full_date | レース日付（完全） |
| 5 | start_time | 発走時刻 |
| 6 | distance | 距離 |
| 7 | track_type | コース種別 |
| 8 | course | コース |
| 9 | grade | グレード |
| 10 | race_class | レースクラス |
| 11 | age_limit | 年齢制限 |
| 12 | weight_type | 負担重量タイプ |
| 13 | horse_id | 馬ID |
| 14 | horse_name | 馬名 |
| 15 | distance_aptitude | 距離適性 |
| 16 | sire_name | 父馬名 |
| 17 | dam_name | 母馬名 |
| 18 | trainer_name | 調教師名 |
| 19 | jockey_name | 騎手名 |
| 20 | owner_name | 馬主名 |
| 21 | breeder_name | 生産者名 |
| 22 | _line_num | 行番号 |
| 23 | _source_file | 元ファイル名 |

---

### 4. CHA（馬別コメント）- 12フィールド

| No | フィールド名 | 説明 |
|----|------------|------|
| 1 | track_code | 場コード |
| 2 | race_num | レース番号 |
| 3 | horse_num | 馬番 |
| 4 | comment_date | コメント日付 |
| 5 | comment_time | コメント時刻 |
| 6 | comment_code | コメントコード |
| 7 | reserved1 | 予約1 |
| 8 | reserved2 | 予約2 |
| 9 | reserved3 | 予約3 |
| 10 | trainer_comment | 調教師コメント |
| 11 | _line_num | 行番号 |
| 12 | _source_file | 元ファイル名 |

---

## 📄 Layer 2: 指数・分析系（5種類）

### 5. CYB（調教情報）- 17フィールド

| No | フィールド名 | 説明 |
|----|------------|------|
| 1 | track_code | 場コード |
| 2 | race_num | レース番号 |
| 3 | horse_num | 馬番 |
| 4 | training_date | 調教日 |
| 5 | training_time | 調教時刻 |
| 6 | training_course | 調教コース |
| 7 | training_type | 調教タイプ |
| 8 | training_distance | 調教距離 |
| 9 | time_4f | 4F通過タイム |
| 10 | time_3f | 3F通過タイム |
| 11 | time_2f | 2F通過タイム |
| 12 | time_1f | 1F通過タイム |
| 13 | finish_index | 仕上がり指数 |
| 14 | evaluation | 評価 |
| 15 | trainer_comment | 調教師コメント |
| 16 | _line_num | 行番号 |
| 17 | _source_file | 元ファイル名 |

---

### 6. JOA（騎手情報）- 16フィールド

| No | フィールド名 | 説明 |
|----|------------|------|
| 1 | track_code | 場コード |
| 2 | race_num | レース番号 |
| 3 | horse_num | 馬番 |
| 4 | jockey_code | 騎手コード |
| 5 | jockey_name | 騎手名 |
| 6 | jockey_weight | 騎手体重 |
| 7 | jockey_weight_diff | 騎手体重増減 |
| 8 | leading_rate | 先行率 |
| 9 | track_win_rate | コース別勝率 |
| 10 | distance_win_rate | 距離別勝率 |
| 11 | total_wins | 総勝利数 |
| 12 | total_races | 総レース数 |
| 13 | win_rate | 勝率 |
| 14 | place_rate | 連対率 |
| 15 | _line_num | 行番号 |
| 16 | _source_file | 元ファイル名 |

---

### 7. KKA（馬基本情報）- 24フィールド

| No | フィールド名 | 説明 |
|----|------------|------|
| 1 | track_code | 場コード |
| 2 | race_num | レース番号 |
| 3 | horse_num | 馬番 |
| 4 | horse_id | 馬ID |
| 5 | year_of_birth | 生年 |
| 6 | trainer_code | 調教師コード |
| 7 | trainer_name | 調教師名 |
| 8 | owner_code | 馬主コード |
| 9 | owner_name | 馬主名 |
| 10 | breeder_code | 生産者コード |
| 11 | place_of_birth | 産地 |
| 12 | auction_price | セリ価格 |
| 13 | import_year | 輸入年 |
| 14 | sire_id | 父馬ID |
| 15 | dam_id | 母馬ID |
| 16 | dam_sire_id | 母父馬ID |
| 17 | age | 年齢 |
| 18 | sex | 性別 |
| 19 | coat_color | 毛色 |
| 20 | mark | 印 |
| 21 | reserved | 予約 |
| 22 | total_prize | 総獲得賞金 |
| 23 | _line_num | 行番号 |
| 24 | _source_file | 元ファイル名 |

---

### 8. KYI（基準指数）- 36フィールド

| No | フィールド名 | 説明 |
|----|------------|------|
| 1 | race_id | レースID |
| 2 | race_date | レース日付 |
| 3 | horse_id | 馬ID |
| 4 | horse_name | 馬名 |
| 5 | prev_race_date | 前走日付 |
| 6 | prev_track | 前走場 |
| 7 | prev_race_num | 前走レース番号 |
| 8 | prev_race_name | 前走レース名 |
| 9 | prev_num_horses | 前走出走頭数 |
| 10 | prev_frame | 前走枠番 |
| 11 | prev_horse_num | 前走馬番 |
| 12 | prev_odds | 前走オッズ |
| 13 | prev_popularity | 前走人気 |
| 14 | prev_finish | 前走着順 |
| 15 | prev_jockey | 前走騎手 |
| 16 | prev_weight | 前走負担重量 |
| 17 | prev_distance | 前走距離 |
| 18 | prev_track_type | 前走コース種別 |
| 19 | prev_track_condition | 前走馬場状態 |
| 20 | prev_time | 前走タイム |
| 21 | prev_time_diff | 前走着差 |
| 22 | prev_pass_position | 前走通過順位 |
| 23 | prev_last_3f | 前走上がり3F |
| 24 | prev_horse_weight | 前走馬体重 |
| 25 | prev_weight_diff | 前走馬体重増減 |
| 26 | prev_winner | 前走勝ち馬 |
| 27 | prev_prize | 前走獲得賞金 |
| 28 | pre_horse_weight | 馬体重 |
| 29 | pre_weight_diff | 馬体重増減 |
| 30 | blinker | ブリンカー |
| 31 | bandage | バンテージ |
| 32 | reserved | 予約 |
| 33 | transport_area | 輸送区分 |
| 34 | trainer_comment | 調教師コメント |
| 35 | _line_num | 行番号 |
| 36 | _source_file | 元ファイル名 |

---

### 9. UKC（馬券評価）- 38フィールド

| No | フィールド名 | 説明 |
|----|------------|------|
| 1 | race_id | レースID |
| 2 | race_date | レース日付 |
| 3 | horse_id | 馬ID |
| 4 | horse_name | 馬名 |
| 5 | turf_short_runs | 芝短距離レース数 |
| 6 | turf_short_1st | 芝短距離1着回数 |
| 7 | turf_short_2nd | 芝短距離2着回数 |
| 8 | turf_short_3rd | 芝短距離3着回数 |
| 9 | turf_mile_runs | 芝マイルレース数 |
| 10 | turf_mile_1st | 芝マイル1着回数 |
| 11 | turf_mile_2nd | 芝マイル2着回数 |
| 12 | turf_mile_3rd | 芝マイル3着回数 |
| 13 | turf_middle_runs | 芝中距離レース数 |
| 14 | turf_middle_1st | 芝中距離1着回数 |
| 15 | turf_middle_2nd | 芝中距離2着回数 |
| 16 | turf_middle_3rd | 芝中距離3着回数 |
| 17 | turf_long_runs | 芝長距離レース数 |
| 18 | turf_long_1st | 芝長距離1着回数 |
| 19 | turf_long_2nd | 芝長距離2着回数 |
| 20 | turf_long_3rd | 芝長距離3着回数 |
| 21 | dirt_short_runs | ダート短距離レース数 |
| 22 | dirt_short_1st | ダート短距離1着回数 |
| 23 | dirt_short_2nd | ダート短距離2着回数 |
| 24 | dirt_short_3rd | ダート短距離3着回数 |
| 25 | dirt_mile_runs | ダートマイルレース数 |
| 26 | dirt_mile_1st | ダートマイル1着回数 |
| 27 | dirt_mile_2nd | ダートマイル2着回数 |
| 28 | dirt_mile_3rd | ダートマイル3着回数 |
| 29 | dirt_middle_runs | ダート中距離レース数 |
| 30 | dirt_middle_1st | ダート中距離1着回数 |
| 31 | dirt_middle_2nd | ダート中距離2着回数 |
| 32 | dirt_middle_3rd | ダート中距離3着回数 |
| 33 | dirt_long_runs | ダート長距離レース数 |
| 34 | dirt_long_1st | ダート長距離1着回数 |
| 35 | dirt_long_2nd | ダート長距離2着回数 |
| 36 | dirt_long_3rd | ダート長距離3着回数 |
| 37 | _line_num | 行番号 |
| 38 | _source_file | 元ファイル名 |

---

## 📄 Layer 3: オッズ・補助情報（5種類）

### 10. OT（単勝・複勝払戻）- 3フィールド

| No | フィールド名 | 説明 |
|----|------------|------|
| 1 | race_key | レースキー |
| 2 | win_odds | 単勝オッズ |
| 3 | place_odds | 複勝オッズ |

---

### 11. OU（馬単払戻）- 2フィールド

| No | フィールド名 | 説明 |
|----|------------|------|
| 1 | race_key | レースキー |
| 2 | umaren_odds | 馬単オッズ |

---

### 12. OW（ワイド払戻）- 2フィールド

| No | フィールド名 | 説明 |
|----|------------|------|
| 1 | race_key | レースキー |
| 2 | wide_odds | ワイドオッズ |

---

### 13. OZ（三連複払戻）- 2フィールド

| No | フィールド名 | 説明 |
|----|------------|------|
| 1 | race_key | レースキー |
| 2 | sanrenpuku_odds | 三連複オッズ |

---

### 14. KAB（開催場情報）- 18フィールド

| No | フィールド名 | 説明 |
|----|------------|------|
| 1 | track_code | 場コード |
| 2 | race_num | レース番号 |
| 3 | race_date | レース日付 |
| 4 | horse_num | 馬番 |
| 5-18 | reserved | 予約フィールド |

---

## 📊 合計フィールド数

```
ZED: 25 + ZKB: 34 + BAC: 23 + CHA: 12 + 
CYB: 17 + JOA: 16 + KAB: 18 + KKA: 24 + 
KYI: 36 + UKC: 38 + OT: 3 + OU: 2 + OW: 2 + OZ: 2
= 252フィールド
```

---

## ⚠️ **重要な発見**

### **蹄データ（HOB）は存在しない**
- JRDBの標準14種類には **蹄コード（HOB）は含まれていません**
- 蹄データが必要な場合は、別途データソースを検討する必要があります

### **高度な分析項目**
以下のデータも含まれていません：
- パドック評価（PAD）
- 馬体情報（BAT）
- ラップタイム詳細（RAP/LAP）
- コーナー通過順（CRN）

---

## ✅ **結論**

**JRDB 全14種類で分析可能な項目:**
- **基本フィールド**: 252項目
- **派生フィールド**: 条件別集計、指数ランキング、過去比較等で 800–1,000項目に拡張可能

**UMAYOMIで実装可能な分析:**
1. ✅ クロスファクター分析（3層OR条件検索）
2. ✅ 回収率・的中率計算
3. ✅ 指数ベース分析（IDM、騎手指数、情報指数等）
4. ✅ 血統分析（父母名、繁殖成績）
5. ✅ 調教分析（タイム、評価、コメント）
6. ✅ 騎手分析（勝率、連対率、場・距離別成績）
7. ✅ コース・距離・馬場別分析
8. ✅ オッズ・人気分析
9. ✅ 前走比較分析（5走前まで）
10. ✅ 馬体重推移分析

---

**UMAYOMI - 馬を読む。レースが変わる。** 🏇
