/**
 * Factor Registration UI Route
 * ファクター登録ページ - ロジックを名前付きで保存・管理
 * 
 * GET /factor-register - 登録フォームと一覧表示
 * POST /api/factors - ファクター保存
 * GET /api/factors - ファクター一覧取得
 * PUT /api/factors/:id - ファクター更新
 * DELETE /api/factors/:id - ファクター削除
 */

import { Hono } from 'hono';
import { globalState } from '../lib/shared-state';

const app = new Hono();

// ファクター登録UI
app.get('/factor-register', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ファクター登録 - UMAYOMI</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; }
        
        .glass {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(148, 163, 184, 0.1);
        }
        
        .factor-card {
            transition: all 0.3s ease;
        }
        
        .factor-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
        }
        
        .input-field {
            background: rgba(15, 23, 42, 0.5);
            border: 1px solid #334155;
            color: #e2e8f0;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            transition: all 0.2s;
        }
        
        .input-field:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
        }
    </style>
</head>
<body class="bg-gray-900 text-gray-100 min-h-screen">
    
    <!-- Header -->
    <div class="bg-gray-800 border-b border-gray-700">
        <div class="max-w-7xl mx-auto px-6 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <a href="/" class="text-gray-400 hover:text-white transition">
                        <i class="fas fa-arrow-left"></i>
                    </a>
                    <div>
                        <h1 class="text-2xl font-bold text-white">ファクター登録</h1>
                        <p class="text-sm text-gray-400">独自のロジックを作成・管理</p>
                    </div>
                </div>
                <a href="/condition-settings" class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition">
                    <i class="fas fa-sliders-h mr-2"></i>新規作成
                </a>
            </div>
        </div>
    </div>
    
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-8">
        
        <!-- 登録フォーム -->
        <div class="glass rounded-xl p-6 mb-8 factor-card" id="registerForm">
            <h2 class="text-xl font-bold text-white mb-4">
                <i class="fas fa-plus-circle text-green-400 mr-2"></i>
                新しいロジックを登録
            </h2>
            
            <div class="space-y-4">
                <!-- ロジック名 -->
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                        ロジック名 <span class="text-red-400">*</span>
                    </label>
                    <input type="text" 
                           id="factorName" 
                           placeholder="例: 東京芝1800m逃げ馬狙い"
                           class="input-field w-full"
                           maxlength="100">
                    <p class="text-xs text-gray-500 mt-1">簡潔で分かりやすい名前を付けてください</p>
                </div>
                
                <!-- ロジック説明 -->
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                        ロジック説明 <span class="text-red-400">*</span>
                    </label>
                    <textarea id="factorDescription" 
                              placeholder="例: 東京競馬場の芝1800mで、逃げ脚質の馬を狙うロジック。オッズは10倍以下、騎手勝率15%以上を条件とする。"
                              class="input-field w-full"
                              rows="3"
                              maxlength="500"></textarea>
                    <p class="text-xs text-gray-500 mt-1">このロジックの狙いや特徴を説明してください</p>
                </div>
                
                <!-- 条件サマリー -->
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                        設定されている条件
                    </label>
                    <div id="conditionSummary" class="bg-gray-800 rounded-lg p-4 text-sm">
                        <div class="text-gray-500 text-center py-4">
                            <i class="fas fa-info-circle text-2xl mb-2"></i>
                            <p>「新規作成」ボタンから条件を設定してください</p>
                        </div>
                    </div>
                </div>
                
                <!-- 保存ボタン -->
                <div class="flex space-x-4">
                    <button onclick="saveFactor()" 
                            class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                            id="saveButton"
                            disabled>
                        <i class="fas fa-save mr-2"></i>ロジックを保存
                    </button>
                    <button onclick="clearForm()" 
                            class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition">
                        <i class="fas fa-redo mr-2"></i>リセット
                    </button>
                </div>
            </div>
        </div>
        
        <!-- 登録済みロジック一覧 -->
        <div class="glass rounded-xl p-6 factor-card">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-white">
                    <i class="fas fa-list text-blue-400 mr-2"></i>
                    登録済みロジック
                </h2>
                <div class="text-sm text-gray-400">
                    全 <span id="totalFactors" class="text-white font-bold">0</span> 件
                </div>
            </div>
            
            <!-- 検索・フィルター -->
            <div class="mb-4">
                <div class="relative">
                    <input type="text" 
                           id="searchQuery"
                           placeholder="ロジック名で検索..."
                           class="input-field w-full pl-10"
                           onkeyup="filterFactors()">
                    <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                </div>
            </div>
            
            <!-- ロジック一覧テーブル -->
            <div class="overflow-x-auto">
                <table class="w-full" id="factorsTable">
                    <thead>
                        <tr class="border-b border-gray-700">
                            <th class="text-left py-3 px-4 font-semibold text-gray-300">ロジック名</th>
                            <th class="text-left py-3 px-4 font-semibold text-gray-300">説明</th>
                            <th class="text-left py-3 px-4 font-semibold text-gray-300">作成日時</th>
                            <th class="text-left py-3 px-4 font-semibold text-gray-300">条件数</th>
                            <th class="text-right py-3 px-4 font-semibold text-gray-300">操作</th>
                        </tr>
                    </thead>
                    <tbody id="factorsTableBody">
                        <!-- ロジックがここに表示される -->
                    </tbody>
                </table>
            </div>
            
            <!-- 空状態 -->
            <div id="emptyState" class="text-center py-12 hidden">
                <i class="fas fa-folder-open text-6xl text-gray-700 mb-4"></i>
                <p class="text-gray-500 mb-4">登録されているロジックがありません</p>
                <a href="/condition-settings" class="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition">
                    <i class="fas fa-plus mr-2"></i>最初のロジックを作成
                </a>
            </div>
        </div>
        
    </div>
    
    <!-- 詳細モーダル -->
    <div id="detailModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
        <div class="bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-white">ロジック詳細</h3>
                <button onclick="closeDetailModal()" class="text-gray-400 hover:text-white transition">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <div id="detailContent">
                <!-- 詳細内容がここに表示される -->
            </div>
        </div>
    </div>
    
    <script>
// グローバル変数
let allFactors = [];
let currentConditions = null;

// ページ読み込み時
document.addEventListener('DOMContentLoaded', async function() {
    // 保存された条件を取得（sessionStorage から）
    const savedConditions = sessionStorage.getItem('pendingConditions');
    if (savedConditions) {
        currentConditions = JSON.parse(savedConditions);
        displayConditionSummary(currentConditions);
        document.getElementById('saveButton').disabled = false;
    }
    
    // 登録済みファクターを読み込み
    await loadFactors();
});

// 条件サマリーを表示
function displayConditionSummary(conditions) {
    const summary = document.getElementById('conditionSummary');
    
    const raceConditions = [];
    if (conditions.race.track) raceConditions.push(\`競馬場: \${getTrackName(conditions.race.track)}\`);
    if (conditions.race.distanceMin && conditions.race.distanceMax) {
        raceConditions.push(\`距離: \${conditions.race.distanceMin}m 〜 \${conditions.race.distanceMax}m\`);
    }
    if (conditions.race.surface) raceConditions.push(\`馬場: \${conditions.race.surface}\`);
    
    const factorConditions = conditions.factors.map(f => {
        const factorName = getFactorName(f.factor);
        const operatorSymbol = getOperatorSymbol(f.operator);
        return \`\${factorName} \${operatorSymbol} \${f.value}\`;
    });
    
    summary.innerHTML = \`
        <div class="space-y-3">
            <div>
                <strong class="text-blue-400">レース条件:</strong>
                <div class="mt-1 space-y-1">
                    \${raceConditions.length > 0 
                        ? raceConditions.map(c => \`<div class="text-gray-300">・\${c}</div>\`).join('')
                        : '<div class="text-gray-500">全てのレース</div>'}
                </div>
            </div>
            
            <div>
                <strong class="text-green-400">ファクター条件:</strong>
                <div class="mt-1 space-y-1">
                    \${factorConditions.length > 0
                        ? factorConditions.map(c => \`<div class="text-gray-300">・\${c}</div>\`).join('')
                        : '<div class="text-gray-500">条件未設定</div>'}
                </div>
            </div>
            
            <div class="pt-2 border-t border-gray-700">
                <span class="badge bg-purple-600 text-white">
                    条件数: \${raceConditions.length + factorConditions.length}
                </span>
            </div>
        </div>
    \`;
}

// 登録済みファクターを読み込み
async function loadFactors() {
    try {
        const response = await axios.get('/api/factors');
        allFactors = response.data;
        renderFactorsTable(allFactors);
    } catch (error) {
        console.error('Failed to load factors:', error);
        allFactors = [];
        renderFactorsTable([]);
    }
}

// ファクターテーブルを描画
function renderFactorsTable(factors) {
    const tbody = document.getElementById('factorsTableBody');
    const emptyState = document.getElementById('emptyState');
    const totalFactors = document.getElementById('totalFactors');
    
    totalFactors.textContent = factors.length;
    
    if (factors.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    tbody.innerHTML = factors.map(factor => {
        const conditions = JSON.parse(factor.conditions);
        const conditionCount = (conditions.factors?.length || 0) + 
                              (conditions.race?.track ? 1 : 0) + 
                              (conditions.race?.surface ? 1 : 0) + 
                              (conditions.race?.distanceMin ? 1 : 0);
        
        return \`
            <tr class="border-b border-gray-700 hover:bg-gray-800 transition">
                <td class="py-3 px-4">
                    <div class="font-medium text-white">\${escapeHtml(factor.name)}</div>
                </td>
                <td class="py-3 px-4">
                    <div class="text-sm text-gray-400 max-w-xs truncate">
                        \${escapeHtml(factor.description)}
                    </div>
                </td>
                <td class="py-3 px-4">
                    <div class="text-sm text-gray-400">
                        \${new Date(factor.created_at).toLocaleString('ja-JP')}
                    </div>
                </td>
                <td class="py-3 px-4">
                    <span class="badge bg-blue-600 text-white">
                        \${conditionCount} 条件
                    </span>
                </td>
                <td class="py-3 px-4 text-right">
                    <div class="flex justify-end space-x-2">
                        <button onclick="viewFactorDetail(\${factor.id})" 
                                class="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition"
                                title="詳細を見る">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="runBacktest(\${factor.id})" 
                                class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition"
                                title="バックテスト">
                            <i class="fas fa-chart-line"></i>
                        </button>
                        <button onclick="editFactor(\${factor.id})" 
                                class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition"
                                title="編集">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteFactor(\${factor.id})" 
                                class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition"
                                title="削除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        \`;
    }).join('');
}

// ファクター検索
function filterFactors() {
    const query = document.getElementById('searchQuery').value.toLowerCase();
    const filtered = allFactors.filter(f => 
        f.name.toLowerCase().includes(query) || 
        f.description.toLowerCase().includes(query)
    );
    renderFactorsTable(filtered);
}

// ファクターを保存
async function saveFactor() {
    const name = document.getElementById('factorName').value.trim();
    const description = document.getElementById('factorDescription').value.trim();
    
    if (!name) {
        alert('ロジック名を入力してください');
        return;
    }
    
    if (!description) {
        alert('ロジック説明を入力してください');
        return;
    }
    
    if (!currentConditions) {
        alert('条件を設定してください');
        return;
    }
    
    try {
        await axios.post('/api/factors', {
            name,
            description,
            conditions: currentConditions
        });
        
        alert('ロジックを保存しました！');
        
        // フォームをクリア
        clearForm();
        
        // 一覧を再読み込み
        await loadFactors();
        
    } catch (error) {
        console.error('Failed to save factor:', error);
        alert('保存に失敗しました: ' + error.message);
    }
}

// フォームをクリア
function clearForm() {
    document.getElementById('factorName').value = '';
    document.getElementById('factorDescription').value = '';
    sessionStorage.removeItem('pendingConditions');
    currentConditions = null;
    document.getElementById('conditionSummary').innerHTML = \`
        <div class="text-gray-500 text-center py-4">
            <i class="fas fa-info-circle text-2xl mb-2"></i>
            <p>「新規作成」ボタンから条件を設定してください</p>
        </div>
    \`;
    document.getElementById('saveButton').disabled = true;
}

// ファクター詳細を表示
function viewFactorDetail(id) {
    const factor = allFactors.find(f => f.id === id);
    if (!factor) return;
    
    const conditions = JSON.parse(factor.conditions);
    
    const detailContent = document.getElementById('detailContent');
    detailContent.innerHTML = \`
        <div class="space-y-4">
            <div>
                <h4 class="font-semibold text-gray-300 mb-1">ロジック名</h4>
                <p class="text-white text-lg">\${escapeHtml(factor.name)}</p>
            </div>
            
            <div>
                <h4 class="font-semibold text-gray-300 mb-1">説明</h4>
                <p class="text-gray-400">\${escapeHtml(factor.description)}</p>
            </div>
            
            <div>
                <h4 class="font-semibold text-gray-300 mb-2">レース条件</h4>
                <div class="bg-gray-900 rounded-lg p-3 space-y-1 text-sm">
                    <div>競馬場: \${conditions.race.track ? getTrackName(conditions.race.track) : '全て'}</div>
                    <div>距離: \${conditions.race.distanceMin || 1000}m 〜 \${conditions.race.distanceMax || 3600}m</div>
                    <div>馬場: \${conditions.race.surface || '全て'}</div>
                </div>
            </div>
            
            <div>
                <h4 class="font-semibold text-gray-300 mb-2">ファクター条件</h4>
                <div class="bg-gray-900 rounded-lg p-3 space-y-1 text-sm">
                    \${conditions.factors.length > 0
                        ? conditions.factors.map(f => \`
                            <div>・\${getFactorName(f.factor)} \${getOperatorSymbol(f.operator)} \${f.value}</div>
                        \`).join('')
                        : '<div class="text-gray-500">条件未設定</div>'}
                </div>
            </div>
            
            <div class="pt-4 border-t border-gray-700">
                <div class="text-sm text-gray-400">
                    作成日時: \${new Date(factor.created_at).toLocaleString('ja-JP')}
                </div>
            </div>
        </div>
    \`;
    
    document.getElementById('detailModal').classList.remove('hidden');
    document.getElementById('detailModal').classList.add('flex');
}

// モーダルを閉じる
function closeDetailModal() {
    document.getElementById('detailModal').classList.add('hidden');
    document.getElementById('detailModal').classList.remove('flex');
}

// バックテスト実行
function runBacktest(id) {
    // TODO: バックテストページへ遷移
    window.location.href = \`/analysis?factorId=\${id}\`;
}

// ファクター編集
function editFactor(id) {
    const factor = allFactors.find(f => f.id === id);
    if (!factor) return;
    
    // 条件をsessionStorageに保存
    sessionStorage.setItem('pendingConditions', factor.conditions);
    sessionStorage.setItem('editingFactorId', id);
    
    // Condition設定ページへ遷移
    window.location.href = '/condition-settings';
}

// ファクター削除
async function deleteFactor(id) {
    const factor = allFactors.find(f => f.id === id);
    if (!factor) return;
    
    if (!confirm(\`「\${factor.name}」を削除しますか？\\nこの操作は取り消せません。\`)) {
        return;
    }
    
    try {
        await axios.delete(\`/api/factors/\${id}\`);
        alert('削除しました');
        await loadFactors();
    } catch (error) {
        console.error('Failed to delete factor:', error);
        alert('削除に失敗しました: ' + error.message);
    }
}

// ヘルパー関数
function getTrackName(code) {
    const tracks = {
        '01': '札幌', '02': '函館', '03': '福島', '04': '新潟',
        '05': '東京', '06': '中山', '07': '中京', '08': '京都',
        '09': '阪神', '10': '小倉'
    };
    return tracks[code] || code;
}

function getFactorName(factor) {
    const factors = {
        odds: 'オッズ',
        popularity: '人気',
        weight: '斤量',
        horse_weight: '馬体重',
        jockey_win_rate: '騎手勝率',
        trainer_win_rate: '調教師勝率',
        recent_form: '近走成績',
        speed_index: 'スピード指数',
        pace_index: 'ペース指数',
        position_index: '位置取り指数'
    };
    return factors[factor] || factor;
}

function getOperatorSymbol(operator) {
    const operators = {
        gte: '以上 (≥)',
        lte: '以下 (≤)',
        eq: '等しい (=)',
        gt: 'より大きい (>)',
        lt: 'より小さい (<)'
    };
    return operators[operator] || operator;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
    </script>
</body>
</html>`);
});

// API: ファクター一覧取得
app.get('/api/factors', async (c) => {
  try {
    return c.json(globalState.getAllFactors());
  } catch (error) {
    console.error('Failed to get factors:', error);
    return c.json({ error: 'Failed to get factors' }, 500);
  }
});

// API: ファクター保存
app.post('/api/factors', async (c) => {
  try {
    const { name, description, conditions } = await c.req.json();
    
    if (!name || !description || !conditions) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    const newFactor = {
      id: Date.now(),
      name,
      description,
      conditions: JSON.stringify(conditions),
      created_at: new Date().toISOString()
    };
    
    globalState.addFactor(newFactor);
    
    return c.json({ 
      id: newFactor.id,
      message: 'Factor saved successfully' 
    });
  } catch (error) {
    console.error('Failed to save factor:', error);
    return c.json({ error: 'Failed to save factor' }, 500);
  }
});

// API: ファクター削除
app.delete('/api/factors/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    globalState.deleteFactor(id);
    
    return c.json({ message: 'Factor deleted successfully' });
  } catch (error) {
    console.error('Failed to delete factor:', error);
    return c.json({ error: 'Failed to delete factor' }, 500);
  }
});

// API: ファクター更新
app.put('/api/factors/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const { name, description, conditions } = await c.req.json();
    
    globalState.updateFactor(id, {
      name,
      description,
      conditions: JSON.stringify(conditions)
    });
    
    return c.json({ message: 'Factor updated successfully' });
  } catch (error) {
    console.error('Failed to update factor:', error);
    return c.json({ error: 'Failed to update factor' }, 500);
  }
});

export default app;
