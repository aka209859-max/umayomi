# 🎯 ZED Field Mapping - Final Specification

## 📋 ZED File Structure (Actual)

**File Type**: 馬別レース成績データ（Horse Race Performance Data）
**Encoding**: Shift-JIS
**Line Length**: ~297 characters (variable due to multibyte chars)
**Format**: Fixed position + Variable text fields

---

## 🗺️ Field Positions (Character-based, after Shift-JIS decode)

### Basic Fields (0-90)
```
[0-2]    場コード       Track Code              例: "06" (東京)
[2-4]    レース番号     Race Number             例: "13"
[4-6]    曜日           Day of Week             例: "58" 
[6-8]    月             Month                   例: "01"
[8-10]   日             Day                     例: "11"
[10-18]  レースID       Race ID                 例: "11109016"
[18-26]  開催年月日     Race Date (YYYYMMDD)   例: "20131222"
[26-76]  レース名+条件  Race Name + Conditions  例: "ブランドアオモリ　　　　　　　　　　12002113011A31023"
[86-88]  クラス         Class                   例: "16"
[88-89]  年齢制限       Age Limit               例: "6"
```

### Horse/Jockey Area (90-200) - Variable positions
```
~[140-160] 馬番・着順など   Horse Number, Finish   
~[160-180] 指数データ       Index Data (-8.9-20.5 etc)
~[180-200] 馬名+馬ID        Horse Name + ID       例: "アポロオオジ003341385"
```

### Numeric Data Area (200-300)
```
[200-220]  タイムデータ1    Time Data 1            例: "     6.2 "
[220-240]  タイムデータ2    Time Data 2            例: " 30.2   7.2"
[240-260]  通過順位         Passing Positions      例: "00060404 -3 -3"
[260-280]  調教師・騎手ID   Trainer/Jockey ID      例: "3018210400484+04112"
[280-300]  その他コード     Other Codes            例: " 75    033334"
```

---

## 💡 Practical Extraction Strategy

**Priority Fields for RGS/AAS Calculation**:
1. ✅ 場コード [0-2]
2. ✅ レース番号 [2-4]
3. ✅ 開催年月日 [18-26]
4. ✅ 馬ID (extracted from [180-200] range)
5. ✅ Numeric scores (from [140-180] range)
6. ✅ Time data (from [200-240] range)

**Optional Fields** (for later enhancement):
- レース名 (needs cleaning/parsing)
- 馬名 (needs extraction from mixed field)
- 騎手名 (visible in early positions, needs parsing)

---

## 🚀 Implementation Plan

### Phase 1: Core Data Extraction (Now)
Extract essential fields for RGS/AAS:
- Track code, race number, date
- Horse ID, numeric indices
- Time and performance data

### Phase 2: Enhanced Parsing (Later)
- Clean race name from mixed field
- Extract horse/jockey names precisely
- Parse all condition codes

---

**Status**: Field mapping complete, ready for parser implementation
**Date**: 2026-01-04
