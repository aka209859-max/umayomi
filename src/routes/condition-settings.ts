/**
 * Condition Settings UI Route
 * ファクター条件設定ページ
 * 
 * GET /condition-settings
 */

import { Hono } from 'hono';

const app = new Hono();

app.get('/condition-settings', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Condition設定 - UMAYOMI</title>
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
        
        .condition-card {
            transition: all 0.3s ease;
        }
        
        .condition-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
        }
        
        .factor-input {
            background: rgba(15, 23, 42, 0.5);
            border: 1px solid #334155;
            color: #e2e8f0;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            transition: all 0.2s;
        }
        
        .factor-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
                        <h1 class="text-2xl font-bold text-white">Condition設定</h1>
                        <p class="text-sm text-gray-400">ファクターの条件を設定して回収率を分析</p>
                    </div>
                </div>
                <button onclick="saveConditions()" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
                    <i class="fas fa-save mr-2"></i>保存して分析
                </button>
            </div>
        </div>
    </div>
    
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-8">
        
        <!-- レース条件設定 -->
        <div class="glass rounded-xl p-6 mb-6 condition-card">
            <h2 class="text-xl font-bold text-white mb-4">
                <i class="fas fa-sliders-h text-blue-400 mr-2"></i>
                レース条件
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- 競馬場 -->
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">競馬場</label>
                    <select id="track" class="factor-input w-full">
                        <option value="">全て</option>
                        <option value="01">札幌</option>
                        <option value="02">函館</option>
                        <option value="03">福島</option>
                        <option value="04">新潟</option>
                        <option value="05">東京</option>
                        <option value="06">中山</option>
                        <option value="07">中京</option>
                        <option value="08">京都</option>
                        <option value="09">阪神</option>
                        <option value="10">小倉</option>
                    </select>
                </div>
                
                <!-- 距離 -->
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">距離（m）</label>
                    <div class="flex space-x-2">
                        <input type="number" id="distanceMin" placeholder="最小" class="factor-input w-full" value="1000">
                        <span class="text-gray-400 self-center">〜</span>
                        <input type="number" id="distanceMax" placeholder="最大" class="factor-input w-full" value="3600">
                    </div>
                </div>
                
                <!-- 馬場 -->
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">馬場</label>
                    <select id="surface" class="factor-input w-full">
                        <option value="">全て</option>
                        <option value="芝">芝</option>
                        <option value="ダート">ダート</option>
                        <option value="障害">障害</option>
                    </select>
                </div>
            </div>
        </div>
        
        <!-- ファクター条件設定 -->
        <div class="glass rounded-xl p-6 mb-6 condition-card">
            <h2 class="text-xl font-bold text-white mb-4">
                <i class="fas fa-chart-line text-green-400 mr-2"></i>
                ファクター条件
            </h2>
            
            <div id="factorConditions" class="space-y-4">
                <!-- Factor条件がここに追加される -->
            </div>
            
            <button onclick="addFactorCondition()" class="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition">
                <i class="fas fa-plus mr-2"></i>条件を追加
            </button>
        </div>
        
        <!-- プレビュー -->
        <div class="glass rounded-xl p-6 condition-card">
            <h2 class="text-xl font-bold text-white mb-4">
                <i class="fas fa-eye text-purple-400 mr-2"></i>
                条件プレビュー
            </h2>
            
            <div id="conditionPreview" class="bg-gray-800 rounded-lg p-4 font-mono text-sm text-gray-300">
                <div class="text-gray-500">条件を設定してください...</div>
            </div>
            
            <div class="mt-4 flex space-x-4">
                <button onclick="testConditions()" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition">
                    <i class="fas fa-flask mr-2"></i>テスト実行
                </button>
                <button onclick="clearConditions()" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition">
                    <i class="fas fa-trash mr-2"></i>クリア
                </button>
            </div>
        </div>
        
    </div>
    
    <script>
// Condition設定のJavaScript
let factorConditions = [];

// ファクター種別の定義
const factorTypes = [
    { value: 'odds', label: 'オッズ', unit: '倍' },
    { value: 'popularity', label: '人気', unit: '番' },
    { value: 'weight', label: '斤量', unit: 'kg' },
    { value: 'horse_weight', label: '馬体重', unit: 'kg' },
    { value: 'jockey_win_rate', label: '騎手勝率', unit: '%' },
    { value: 'trainer_win_rate', label: '調教師勝率', unit: '%' },
    { value: 'recent_form', label: '近走成績', unit: '点' },
    { value: 'speed_index', label: 'スピード指数', unit: '点' },
    { value: 'pace_index', label: 'ペース指数', unit: '点' },
    { value: 'position_index', label: '位置取り指数', unit: '点' }
];

// 比較演算子
const operators = [
    { value: 'gte', label: '以上 (≥)' },
    { value: 'lte', label: '以下 (≤)' },
    { value: 'eq', label: '等しい (=)' },
    { value: 'gt', label: 'より大きい (>)' },
    { value: 'lt', label: 'より小さい (<)' }
];

// ファクター条件を追加
function addFactorCondition() {
    const id = Date.now();
    const condition = {
        id,
        factor: 'odds',
        operator: 'lte',
        value: 10
    };
    
    factorConditions.push(condition);
    renderFactorConditions();
    updatePreview();
}

// ファクター条件を削除
function removeFactorCondition(id) {
    factorConditions = factorConditions.filter(c => c.id !== id);
    renderFactorConditions();
    updatePreview();
}

// ファクター条件を更新
function updateFactorCondition(id, field, value) {
    const condition = factorConditions.find(c => c.id === id);
    if (condition) {
        condition[field] = value;
        updatePreview();
    }
}

// ファクター条件を描画
function renderFactorConditions() {
    const container = document.getElementById('factorConditions');
    
    if (factorConditions.length === 0) {
        container.innerHTML = \`
            <div class="text-center text-gray-500 py-8">
                <i class="fas fa-info-circle text-4xl mb-2"></i>
                <p>「条件を追加」ボタンでファクター条件を設定してください</p>
            </div>
        \`;
        return;
    }
    
    container.innerHTML = factorConditions.map(condition => {
        const factor = factorTypes.find(f => f.value === condition.factor);
        
        return \`
            <div class="flex items-center space-x-4 bg-gray-800 rounded-lg p-4">
                <div class="flex-1">
                    <select class="factor-input w-full" 
                            onchange="updateFactorCondition(\${condition.id}, 'factor', this.value)">
                        \${factorTypes.map(f => 
                            \`<option value="\${f.value}" \${f.value === condition.factor ? 'selected' : ''}>\${f.label}</option>\`
                        ).join('')}
                    </select>
                </div>
                
                <div class="flex-1">
                    <select class="factor-input w-full"
                            onchange="updateFactorCondition(\${condition.id}, 'operator', this.value)">
                        \${operators.map(op => 
                            \`<option value="\${op.value}" \${op.value === condition.operator ? 'selected' : ''}>\${op.label}</option>\`
                        ).join('')}
                    </select>
                </div>
                
                <div class="flex-1">
                    <div class="relative">
                        <input type="number" 
                               class="factor-input w-full pr-12" 
                               value="\${condition.value}"
                               onchange="updateFactorCondition(\${condition.id}, 'value', parseFloat(this.value))">
                        <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            \${factor.unit}
                        </span>
                    </div>
                </div>
                
                <button onclick="removeFactorCondition(\${condition.id})" 
                        class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        \`;
    }).join('');
}

// プレビューを更新
function updatePreview() {
    const track = document.getElementById('track').value;
    const distanceMin = document.getElementById('distanceMin').value;
    const distanceMax = document.getElementById('distanceMax').value;
    const surface = document.getElementById('surface').value;
    
    const conditions = {
        race: {
            track: track || '全て',
            distance: \`\${distanceMin}m 〜 \${distanceMax}m\`,
            surface: surface || '全て'
        },
        factors: factorConditions.map(c => {
            const factor = factorTypes.find(f => f.value === c.factor);
            const operator = operators.find(op => op.value === c.operator);
            return \`\${factor.label} \${operator.label} \${c.value}\${factor.unit}\`;
        })
    };
    
    const preview = document.getElementById('conditionPreview');
    preview.innerHTML = \`
        <div class="space-y-2">
            <div><strong class="text-blue-400">レース条件:</strong></div>
            <div class="pl-4">
                <div>競馬場: \${conditions.race.track}</div>
                <div>距離: \${conditions.race.distance}</div>
                <div>馬場: \${conditions.race.surface}</div>
            </div>
            
            <div class="mt-4"><strong class="text-green-400">ファクター条件:</strong></div>
            <div class="pl-4">
                \${conditions.factors.length > 0 
                    ? conditions.factors.map(f => \`<div>・\${f}</div>\`).join('')
                    : '<div class="text-gray-500">条件未設定</div>'}
            </div>
        </div>
    \`;
}

// 条件を保存
async function saveConditions() {
    const conditions = {
        race: {
            track: document.getElementById('track').value,
            distanceMin: parseInt(document.getElementById('distanceMin').value),
            distanceMax: parseInt(document.getElementById('distanceMax').value),
            surface: document.getElementById('surface').value
        },
        factors: factorConditions
    };
    
    console.log('Saving conditions:', conditions);
    
    // sessionStorageに保存
    sessionStorage.setItem('pendingConditions', JSON.stringify(conditions));
    
    // ファクター登録ページへ遷移
    window.location.href = '/factor-register';
}

// テスト実行
async function testConditions() {
    console.log('Testing conditions...');
    alert('テスト実行中...\\n（実装予定）');
}

// クリア
function clearConditions() {
    if (confirm('全ての条件をクリアしますか？')) {
        factorConditions = [];
        document.getElementById('track').value = '';
        document.getElementById('distanceMin').value = '1000';
        document.getElementById('distanceMax').value = '3600';
        document.getElementById('surface').value = '';
        renderFactorConditions();
        updatePreview();
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    renderFactorConditions();
    updatePreview();
    
    // 入力フィールドの変更を監視
    ['track', 'distanceMin', 'distanceMax', 'surface'].forEach(id => {
        document.getElementById(id).addEventListener('change', updatePreview);
    });
});
    </script>
</body>
</html>`);
});

export default app;
