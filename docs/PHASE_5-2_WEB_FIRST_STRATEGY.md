# UMAYOMI Phase 5-2: Webアプリ優先戦略

## 📋 戦略変更の決定

**決定事項:** Option B（Webアプリ優先） → 後からJRA-VAN Market

**理由:**
- ✅ 48時間以内に完成・収益化開始
- ✅ 即座に市場検証可能（仮説を確信に変える）
- ✅ SNS/note/HPで拡散・ユーザー獲得
- ✅ 低リスク（Web技術のみ、C#/COM不要）
- ✅ Enable憲法「10x Mindset」「Play to Win」に合致

---

## ✅ Phase 0-1: 完了事項

### **RGS/AAS計算エンジン（TypeScript版）**

#### **ファイル構成:**
```
/home/user/webapp/src/calculators/
├── RGSCalculator.ts  (2,176 bytes) - RGS 1.0 絶対評価
└── AASCalculator.ts  (4,251 bytes) - AAS 相対評価
```

#### **RGS 1.0 Calculator:**
- **入力:** cnt_win, cnt_plc, rate_win_ret, rate_plc_ret
- **出力:** -10 ~ +10 のスコア
- **計算式:**
  1. Reliability = min(1, sqrt((cnt_win + cnt_plc) / 500))
  2. WeightedDiff = (rate_win_ret * 0.3) + (rate_plc_ret * 0.7) - 80
  3. RGS = 10 * tanh((WeightedDiff * Reliability) / 25)

#### **AAS Calculator:**
- **入力:** group_id, cnt_win, cnt_plc, rate_win_hit, rate_plc_hit, rate_win_ret, rate_plc_ret
- **出力:** -12 ~ +12 のスコア（小数点1桁）
- **計算式:**
  1. Hit_raw = 0.65 * rate_win_hit + 0.35 * rate_plc_hit
  2. Ret_raw = 0.35 * rate_win_ret + 0.65 * rate_plc_ret
  3. ZH, ZR = Zスコア（レース内標準化）
  4. Shr = sqrt(N_min / (N_min + 400))
  5. AAS = round(12 * tanh(0.55*ZH + 0.45*ZR) * Shr * 10) / 10

---

## 🚀 次のステップ：Phase 2

### **実装内容: API Routes**

#### **1. `/api/rgs/calculate` エンドポイント:**
- **メソッド:** POST
- **リクエストボディ:**
  ```json
  {
    "cnt_win": 300,
    "cnt_plc": 250,
    "rate_win_ret": 95,
    "rate_plc_ret": 88
  }
  ```
- **レスポンス:**
  ```json
  {
    "score": 3.83,
    "grade": "B",
    "reliability": 1.0,
    "weightedDiff": 10.1,
    "description": "良好 - プラス収益の可能性が高い"
  }
  ```

#### **2. `/api/aas/calculate` エンドポイント:**
- **メソッド:** POST
- **リクエストボディ:**
  ```json
  {
    "races": [
      {
        "group_id": "202412010101",
        "horses": [
          {
            "cnt_win": 300,
            "cnt_plc": 250,
            "rate_win_hit": 35,
            "rate_plc_hit": 55,
            "rate_win_ret": 95,
            "rate_plc_ret": 88
          }
        ]
      }
    ]
  }
  ```

---

## 📊 48時間実装計画（修正版）

| Phase | 内容 | 時間 | 状態 |
|-------|------|------|------|
| Phase 0 | 現状整理・方針転換 | 0-0.5h | ✅ 完了 |
| Phase 1 | RGS/AAS Calculator実装 | 0.5-2h | ✅ 完了 |
| Phase 2 | API Routes実装 | 2-4h | ⏳ 次 |
| Phase 3 | E:\JRDBパーサー実装 | 4-10h | ⏳ 待機 |
| Phase 4 | フロントエンドUI実装 | 10-20h | ⏳ 待機 |
| Phase 5 | テスト・デバッグ | 20-28h | ⏳ 待機 |
| Phase 6 | Cloudflare Pages デプロイ | 28-32h | ⏳ 待機 |
| Phase 7 | SNS/note/HP公開準備 | 32-40h | ⏳ 待機 |
| Phase 8 | 収益化開始 | 40-48h | ⏳ 待機 |

---

## 💡 CEOへの確認事項

### **Q1: Phase 2（API Routes実装）を今すぐ開始しますか？**

- **YES:** 私がAPI Routesを実装します（20分）
- **NO:** 一旦休憩・後で再開

### **Q2: E:\JRDBデータの扱いについて**

**Option A:** E:\JRDBデータをCloudflare D1にインポート（推奨）
- メリット: Webアプリから直接アクセス可能
- デメリット: インポート時間（2-4時間）

**Option B:** E:\JRDBデータをローカルで処理 → 結果のみD1に保存
- メリット: インポート時間短縮
- デメリット: データ更新の手間

---

## 🎯 最終ゴール（48時間後）

### **完成するもの:**

1. **Webアプリ（Cloudflare Pages）**
   - URL: `https://umayomi.pages.dev`
   - 機能:
     - ✅ ダッシュボード（KPI表示）
     - ✅ RGS/AAS計算機
     - ✅ レース検索
     - ✅ 出走表表示
     - ✅ ファクター設定
     - ✅ 予想生成

2. **収益チャネル:**
   - ✅ SNSでの予想公開（無料 → フォロワー獲得）
   - ✅ noteでの予想販売（有料記事 500円/回）
   - ✅ noteでの月額サブスク（2,980円/月）
   - ✅ HPでの予想販売

3. **収益シミュレーション（月収30万円）:**
   - note有料記事: 500円 × 8回/月 × 50人 = 20万円
   - 月額サブスク: 2,980円 × 30人 = 8.9万円
   - HP販売: 追加収益

---

## 📞 次のアクション

CEOの指示をお待ちしています：

1. **Phase 2 開始:** API Routes実装（20分）
2. **E:\JRDBデータの方針確認:** Option A or B
3. **休憩:** 後で再開

---

**Enable憲法「10x Mindset」に基づき、48時間以内に市場投入を目指します！** 🚀
