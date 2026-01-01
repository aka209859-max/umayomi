# UMAYOMI プロジェクト完全サマリ（2026-01-01）

## 📋 プロジェクト概要

**プロジェクト名**: UMAYOMI（競馬予測システム）  
**目標**: 48時間以内に CrossFactor 準拠の RGS/AAS 計算システムを実装  
**現在のフェーズ**: Phase 5-2（RGS/AAS計算エンジン実装中）

---

## 🎯 プロジェクトの目的

### 最終ゴール
1. **JRDB + JRA-VAN データを統合した競馬予測システム**
2. **50種類のファクター構成（3大ファクター構成）**
   - JRDB + JRA-VAN 混合ファクター
   - JRA-VAN のみファクター
   - JRDB のみファクター
3. **CrossFactor 形式の出走表出力**（画像②の形式）
4. **馬の最終得点計算**（例: A馬は390点）

### RGS/AAS システムの目的
- **RGS 1.0**: 絶対収益力評価（基準回収率80%からの乖離を信頼度で補正）
  - 計算式: `10 * TANH((Weighted Diff * Reliability) / 25)`
  - 出力範囲: -10 ～ +10
- **AAS**: 相対偏差値評価（レース内での相対的な強さを偏差値化）
  - 計算式: `ROUND(12 * TANH(0.55*ZH + 0.45*ZR) * Shrinkage, 1)`
  - 出力範囲: 約 -12 ～ +12

**詳細**: `/home/user/webapp/docs/RGS_AAS_CALCULATION_FORMULAS.md` を参照

---

## 📊 データ構造・配置（最新）

### ✅ 完了事項

#### 1. データ移動・統合完了
| 移動元 | 移動先 | サイズ | ファイル数 | 状態 |
|--------|--------|--------|------------|------|
| C:\TFJV | E:\JRAVAN | 5.64GB | 45,339 | ✅ 完了・削除済み |
| C:\JRDB | E:\JRDB | 3.87GB | 21,536 | ✅ 完了・削除予定 |

**Cドライブ解放**: 合計 **9.51GB** 確保

#### 2. 現在のデータ配置
```
E:\JRAVAN\ (5.64GB, 45,339ファイル)
├── HY_DATA/    1.91GB  (6,076ファイル) - 馬履歴
├── SE_DATA/    1.86GB  (6,217ファイル) - レース成績
├── ES_DATA/    0.64GB  (11,484ファイル) - レース詳細
├── CK_DATA/    0.59GB  (17,622ファイル) - 血統データ
├── UM_DATA/    0.48GB  (601ファイル) - 馬マスタ
├── KT_DATA/    0.05GB  (279ファイル) - 騎手データ
├── BY_DATA/    0.02GB  (273ファイル) - 馬場データ
├── DE_DATA/    0.02GB  (382ファイル) - デイリー
├── W5_DATA/    0.01GB  (840ファイル) - 週次データ
├── TM_DATA/    0.01GB  (426ファイル) - タイム
├── JG_DATA/    0.01GB  (206ファイル) - 騎手成績
├── BS_DATA/    0.01GB  (301ファイル) - 馬体重
└── BR_DATA/    0.01GB  (20ファイル) - 馬体重詳細

E:\JRDB\ (4.16GB, 25,648ファイル)
├── unzipped_weekly/
│   ├── sed/    102.29MB  (1,537ファイル) - レース成績
│   └── tyb/    28.31MB   (513ファイル) - 馬体重
└── (その他データ)

C:\JRDB\ (削除予定)
└── 3.87GB, 21,508ファイル（E:\JRDB に統合済み）
```

### JRA-VAN データ形式（サンプル確認済み）
**CK_DATA（血統データ）**: 固定長レコード形式
```
02024120103572019102163056915204171490268139129
02024120103572019105472055415304011380263134129
...
```

---

## 🗄️ データベース設計

### Cloudflare D1 スキーマ

#### `factor_analysis` テーブル（Phase 5-1 完了）
```sql
CREATE TABLE factor_analysis (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  factor_name TEXT NOT NULL,
  factor_type TEXT CHECK(factor_type IN ('jrdb', 'jravan', 'mixed')),
  factor_config TEXT NOT NULL,  -- JSON形式
  total_races INTEGER DEFAULT 0,
  win_rate REAL DEFAULT 0.0,
  place_rate REAL DEFAULT 0.0,
  show_rate REAL DEFAULT 0.0,
  recovery_rate REAL DEFAULT 0.0,
  rgs_score REAL DEFAULT 0.0,
  aas_score REAL DEFAULT 0.0,
  risk_value REAL DEFAULT 0.0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**マイグレーション適用済み**: 
```bash
npx wrangler d1 migrations apply webapp-production --local
```

---

## 🏗️ システムアーキテクチャ

### 技術スタック
- **フロントエンド**: HTML + Tailwind CSS + Chart.js + FontAwesome
- **バックエンド**: Hono (Cloudflare Workers)
- **データベース**: 
  - Cloudflare D1（ファクター分析結果）
  - PostgreSQL（JRDB/JRA-VANデータ） ← **Option A: REST API経由**
- **デプロイ**: Cloudflare Pages

### ディレクトリ構造
```
/home/user/webapp/
├── src/
│   └── index.tsx           # Hono メインアプリ
├── public/
│   └── static/
│       ├── app.js          # フロントエンド JS
│       └── styles.css      # カスタム CSS
├── migrations/
│   ├── 0001_initial_schema.sql
│   └── 0002_create_factor_analysis_table.sql
├── docs/
│   ├── JRAVAN_DATA_STRUCTURE_ANALYSIS.md
│   ├── RGS_AAS_CALCULATION_FORMULAS.md  # ✅ 正しい計算式
│   └── UMAYOMI_PROJECT_SUMMARY.md       # このファイル
├── wrangler.jsonc
├── package.json
├── ecosystem.config.cjs    # PM2設定
└── README.md
```

---

## 📈 Phase 実装ステータス

### ✅ Phase 1-4: 完了
- Phase 1: プロジェクト初期化
- Phase 2: データ移動・整理
- Phase 3: JRA-VANデータ構造分析
- Phase 4: ダッシュボードUI実装（サンプルデータ）

### 🔄 Phase 5: RGS/AAS計算システム（進行中）

#### Phase 5-1: データベーススキーマ設計 ✅
- **完了**: `factor_analysis` テーブル作成
- **マイグレーション適用**: ローカルD1に適用済み

#### Phase 5-2: RGS/AAS計算エンジン（バックエンドAPI）🔄
**現在のタスク**: PostgreSQL REST API接続実装

**実装予定の API エンドポイント**:
```typescript
POST /api/developer/factor/calculate
  - リクエスト: { factor_config, race_conditions }
  - レスポンス: { rgs_score, aas_score, win_rate, recovery_rate }

GET /api/developer/factor/results
  - レスポンス: [ { factor_name, rgs_score, aas_score, ... } ]

GET /api/developer/factor/list
  - レスポンス: [ { id, factor_name, factor_type, ... } ]
```

#### Phase 5-3: 開発者向けUI（/developer） ⏳
- ファクター条件設定フォーム
- 蹄コードの日本語表示
- 計算結果表示

#### Phase 5-4: 蹄コード日本語マッピング ⏳
```typescript
const hoofCodeMap = {
  '00': '不明',
  '01': '重い（固い）',
  '02': '標準',
  '03': '軽い（薄い）',
  // ...
};
```

#### Phase 5-5: 結果可視化（Chart.js） ⏳
- RGSスコアランキング
- 回収率推移グラフ
- ファクター比較チャート

#### Phase 5-6: テスト・デバッグ ⏳

---

## 🚀 次のアクション（Option A 選択）

### **Option A: PostgreSQL REST API 接続**

#### Step 1: PostgreSQL REST APIセットアップ（3-4時間）
1. **Supabase または Neon でデータベース作成**
   - アカウント作成 → プロジェクト作成
   - REST API エンドポイント取得
   - API キー取得

2. **E:\JRDB データを PostgreSQL にインポート**
   - sed/tyb データを PostgreSQL テーブルに変換
   - スキーマ設計（races, horses, results テーブル）

3. **Cloudflare Pages から接続**
   - `.dev.vars` に API キーを保存
   ```env
   POSTGRES_API_URL=https://xxx.supabase.co/rest/v1
   POSTGRES_API_KEY=your-api-key
   ```

#### Step 2: RGS/AAS計算エンジン実装（4-6時間）
1. **Hono バックエンド実装**
   ```typescript
   app.post('/api/developer/factor/calculate', async (c) => {
     // PostgreSQL REST APIからデータ取得
     // RGS/AAS計算
     // factor_analysisテーブルに保存
   });
   ```

2. **PostgreSQL REST API クライアント**
   ```typescript
   const fetchRaceData = async (conditions) => {
     const response = await fetch(POSTGRES_API_URL, {
       headers: { 'apikey': POSTGRES_API_KEY }
     });
     return response.json();
   };
   ```

#### Step 3: 開発者UI実装（2-3時間）
- `/developer` ページ作成
- ファクター条件設定フォーム
- 計算実行ボタン
- 結果表示テーブル

#### Step 4: 結果可視化（2-3時間）
- Chart.js グラフ実装
- ファクターランキング
- バックテスト結果表示

---

## 📝 重要な設定・コマンド

### PM2 サービス起動
```bash
# ポート3000をクリーンアップ
fuser -k 3000/tcp 2>/dev/null || true

# ビルド（初回または変更後）
cd /home/user/webapp && npm run build

# PM2で起動
cd /home/user/webapp && pm2 start ecosystem.config.cjs

# サービス確認
curl http://localhost:3000

# ログ確認（ノンブロッキング）
pm2 logs --nostream
```

### D1 データベース操作
```bash
# ローカルマイグレーション適用
npx wrangler d1 migrations apply webapp-production --local

# ローカルデータベースコンソール
npx wrangler d1 execute webapp-production --local

# ローカルデータベースリセット
rm -rf .wrangler/state/v3/d1 && npm run db:migrate:local
```

### Git操作
```bash
# 初期化
git init
git add .
git commit -m "Initial commit"

# GitHub環境セットアップ（プッシュ前に必須）
# setup_github_environment ツールを呼び出す

# リモート追加・プッシュ
git remote add origin https://github.com/OWNER/repo.git
git push -f origin main
```

---

## 🎯 3大ファクター構成（50種類）

### ファクター分類
1. **JRDB + JRA-VAN 混合ファクター**（20種類予定）
   - IDM + 血統データ
   - 馬体重増減 + 馬場データ
   - 蹄コード + 騎手成績

2. **JRA-VAN のみファクター**（15種類予定）
   - 血統パターン分析
   - 馬場適性
   - 騎手適性

3. **JRDB のみファクター**（15種類予定）
   - IDM単独
   - 馬体重増減単独
   - 蹄コード単独

---

## 📊 現在のKPI（サンプルデータ）

| 指標 | 値 | 先月比 |
|------|-----|--------|
| 回収率 | 128.5% | +8.3% |
| 的中率 | 35.2% | +2.1% |
| ROI | +28.5% | +5.2% |
| 総レース数 | 10,430 | - |

---

## 🔐 セキュリティ・環境変数

### `.dev.vars`（ローカル開発用）
```env
POSTGRES_API_URL=https://xxx.supabase.co/rest/v1
POSTGRES_API_KEY=your-api-key
DATABASE_URL=postgresql://...
```

### `.gitignore`
```
node_modules/
.env
.dev.vars
.wrangler/
*.log
*.backup
```

---

## 📅 タイムライン

| フェーズ | 予定時間 | 状態 |
|----------|----------|------|
| Phase 5-1: スキーマ設計 | 1時間 | ✅ 完了 |
| Phase 5-2: 計算エンジン | 4-6時間 | 🔄 進行中 |
| Phase 5-3: 開発者UI | 2-3時間 | ⏳ 待機中 |
| Phase 5-4: 蹄コードマッピング | 1時間 | ⏳ 待機中 |
| Phase 5-5: 結果可視化 | 2-3時間 | ⏳ 待機中 |
| Phase 5-6: テスト・デバッグ | 2-3時間 | ⏳ 待機中 |
| **合計** | **12-17時間** | **48時間以内に完了** |

---

## 🚨 重要な制約・注意事項

### Cloudflare Pages の制約
- ❌ Node.js の `pg` ライブラリが使えない
- ❌ ファイルシステムへのアクセス不可
- ❌ 長時間実行プロセス不可
- ✅ REST API 経由のデータ取得は可能
- ✅ Cloudflare D1 は完全サポート
- ✅ Edge環境で高速実行

### データ処理の方針
- **Option A（選択済み）**: PostgreSQL REST API経由
- E:\JRDB データは PostgreSQL にインポート
- Cloudflare D1 は計算結果の保存のみ

---

## 📞 CEO への確認事項

### ✅ 決定済み
- [x] **JRA-VAN Market 販売を最優先**（これができないと全て始まらない）
- [x] **ハイブリッド構成**（Windows アプリ + Web ダッシュボード）
- [x] **C# .NET で Windows デスクトップアプリ開発**
- [x] RGS/AAS 計算式の確認完了
- [x] **JRA-VAN 開発者ID取得済み**: SA270590

### ⏳ 確認待ち
- [ ] Visual Studio インストール状況
- [ ] JV-Link SDK のダウンロード・インストール
- [ ] ソフト作者登録の完了状況（作者ID郵送受取）

---

## 🎯 Enable 憲法との整合性

- **10x Mindset**: 50種類のファクター構成で市場を10倍変える
- **Be Resourceful**: PostgreSQL REST API で制約を突破
- **Play to Win**: 48時間以内に実装完了
- **Buy Back Time**: AI（Cloudflare Workers）で計算を自動化

---

**保存日時**: 2026-01-01 19:00  
**次回更新**: Phase 5-2 完了時  
**担当**: Enable CSO（AI戦略責任者）
