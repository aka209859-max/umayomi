/**
 * Race Card Route
 * 出走表表示ページ
 * 
 * GET /race-card - 出走表UI
 * GET /api/race-card - 出走馬詳細取得
 */

import { Hono } from 'hono';
import { HCParser, type HCRecord } from '../parsers/ck/hc';
import { FactorCalculator, type HorseData, type FactorConditions } from '../lib/factor-calculator';
import { globalState } from '../lib/shared-state';

const app = new Hono();

// 出走表UI
app.get('/race-card', (c) => {
  const track = c.req.query('track') || '';
  const date = c.req.query('date') || '';
  const raceNum = c.req.query('race') || '';
  
  return c.html(`<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>出走表 - UMAYOMI</title>
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
        
        .horse-row {
            transition: all 0.2s ease;
        }
        
        .horse-row:hover {
            background: rgba(59, 130, 246, 0.1);
            transform: translateX(4px);
        }
        
        .horse-number {
            min-width: 48px;
            height: 48px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 1.25rem;
        }
        
        .rank-1 { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; }
        .rank-2 { background: linear-gradient(135deg, #d1d5db, #9ca3af); color: #000; }
        .rank-3 { background: linear-gradient(135deg, #ea580c, #dc2626); color: #fff; }
        .rank-other { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
        
        .score-badge {
            display: inline-block;
            padding: 0.5rem 1rem;
            border-radius: 9999px;
            font-weight: 700;
            font-size: 1.125rem;
        }
        
        .score-high { background: linear-gradient(135deg, #10b981, #059669); }
        .score-medium { background: linear-gradient(135deg, #3b82f6, #2563eb); }
        .score-low { background: rgba(75, 85, 99, 0.5); }
        
        @media (max-width: 768px) {
            .desktop-only { display: none; }
        }
    </style>
</head>
<body class="bg-gray-900 text-gray-100 min-h-screen">
    
    <!-- Header -->
    <div class="bg-gray-800 border-b border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <a href="/tomorrow-races" class="text-gray-400 hover:text-white transition">
                        <i class="fas fa-arrow-left"></i>
                    </a>
                    <div>
                        <h1 class="text-xl sm:text-2xl font-bold text-white" id="raceTitle">出走表</h1>
                        <p class="text-xs sm:text-sm text-gray-400" id="raceInfo">読み込み中...</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2 sm:space-x-4">
                    <select id="factorSelect" class="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm">
                        <option value="">ファクター選択</option>
                    </select>
                    <button onclick="applyFactor()" 
                            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition text-sm">
                        <i class="fas fa-calculator mr-2"></i>適用
                    </button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        <!-- Sort & Filter -->
        <div class="glass rounded-xl p-4 mb-6">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div class="flex items-center space-x-4">
                    <button onclick="sortBy('number')" 
                            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition">
                        <i class="fas fa-sort-numeric-down mr-2"></i>馬番順
                    </button>
                    <button onclick="sortBy('score')" 
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition">
                        <i class="fas fa-sort-amount-down mr-2"></i>得点順
                    </button>
                </div>
                <div class="text-sm text-gray-400">
                    全 <span id="totalHorses" class="text-white font-bold">0</span> 頭
                </div>
            </div>
        </div>
        
        <!-- Horse List -->
        <div class="space-y-3" id="horseList">
            <!-- 出走馬がここに表示される -->
        </div>
        
        <!-- Empty State -->
        <div id="emptyState" class="glass rounded-xl p-12 text-center">
            <i class="fas fa-spinner fa-spin text-4xl text-gray-600 mb-4"></i>
            <p class="text-gray-400">読み込み中...</p>
        </div>
        
    </div>
    
    <!-- Horse Detail Modal -->
    <div id="horseModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50 p-4">
        <div class="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-white" id="modalHorseName">馬情報</h3>
                <button onclick="closeModal()" class="text-gray-400 hover:text-white transition">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <div id="modalContent">
                <!-- 馬情報がここに表示される -->
            </div>
        </div>
    </div>
    
    <script>
// URL parameters
const urlParams = new URLSearchParams(window.location.search);
const trackCode = urlParams.get('track') || '';
const raceDate = urlParams.get('date') || '';
const raceNumber = urlParams.get('race') || '';

let allHorses = [];
let currentSort = 'number';
let appliedFactor = null;

// Track names
const trackNames = {
    '01': '札幌', '02': '函館', '03': '福島', '04': '新潟',
    '05': '東京', '06': '中山', '07': '中京', '08': '京都',
    '09': '阪神', '10': '小倉'
};

// Load race data
async function loadRaceCard() {
    try {
        const response = await axios.get(\`/api/race-card?track=\${trackCode}&date=\${raceDate}&race=\${raceNumber}\`);
        const data = response.data;
        
        if (!data || !data.horses) {
            throw new Error('レースデータが見つかりません');
        }
        
        allHorses = data.horses;
        
        // Update header
        const trackName = trackNames[trackCode] || trackCode;
        document.getElementById('raceTitle').textContent = \`\${trackName} \${raceNumber}R\`;
        document.getElementById('raceInfo').textContent = \`\${raceDate} • \${allHorses.length}頭立\`;
        document.getElementById('totalHorses').textContent = allHorses.length;
        
        // Render horses
        renderHorses(allHorses);
        
        // Load factors
        await loadFactors();
        
        document.getElementById('emptyState').classList.add('hidden');
    } catch (error) {
        console.error('Failed to load race card:', error);
        document.getElementById('emptyState').innerHTML = \`
            <i class="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
            <p class="text-gray-400 mb-4">レースデータの読み込みに失敗しました</p>
            <a href="/tomorrow-races" class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                レース一覧に戻る
            </a>
        \`;
    }
}

// Render horses
function renderHorses(horses) {
    const container = document.getElementById('horseList');
    
    // Sort horses
    const sortedHorses = [...horses].sort((a, b) => {
        if (currentSort === 'number') {
            return parseInt(a.horse_number) - parseInt(b.horse_number);
        } else if (currentSort === 'score') {
            return (b.score || 0) - (a.score || 0);
        }
        return 0;
    });
    
    container.innerHTML = sortedHorses.map((horse, index) => {
        const horseNum = parseInt(horse.horse_number);
        const rank = currentSort === 'score' ? index + 1 : null;
        const score = horse.score || null;
        
        let rankClass = 'rank-other';
        if (rank === 1) rankClass = 'rank-1';
        else if (rank === 2) rankClass = 'rank-2';
        else if (rank === 3) rankClass = 'rank-3';
        
        let scoreClass = 'score-low';
        let scoreDisplay = 'N/A';
        if (score !== null) {
            scoreDisplay = score.toFixed(1);
            if (score >= 80) scoreClass = 'score-high';
            else if (score >= 60) scoreClass = 'score-medium';
        }
        
        return \`
            <div class="glass rounded-xl p-4 sm:p-6 horse-row cursor-pointer" onclick="showHorseDetail(\${index})">
                <div class="flex items-center gap-4">
                    <!-- Horse Number -->
                    <div class="horse-number \${currentSort === 'score' && rank <= 3 ? rankClass : 'rank-other'}">
                        \${horseNum}
                    </div>
                    
                    <!-- Horse Info -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-2">
                            <h3 class="text-lg font-bold text-white truncate">馬ID: \${horse.horse_id}</h3>
                            \${rank && rank <= 3 ? \`
                                <span class="flex-shrink-0 px-2 py-1 bg-yellow-600 text-white rounded text-xs font-bold">
                                    TOP \${rank}
                                </span>
                            \` : ''}
                        </div>
                        
                        <div class="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-400">
                            <span><i class="fas fa-hashtag mr-1"></i>馬番: \${horseNum}</span>
                            <span class="desktop-only">•</span>
                            <span><i class="fas fa-dna mr-1"></i>ID: \${horse.horse_id}</span>
                        </div>
                    </div>
                    
                    <!-- Score -->
                    \${score !== null ? \`
                        <div class="flex-shrink-0">
                            <div class="score-badge \${scoreClass}">
                                \${scoreDisplay}
                            </div>
                        </div>
                    \` : ''}
                    
                    <!-- Arrow -->
                    <div class="flex-shrink-0 text-gray-500">
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </div>
            </div>
        \`;
    }).join('');
}

// Sort horses
function sortBy(type) {
    currentSort = type;
    renderHorses(allHorses);
}

// Show horse detail
function showHorseDetail(index) {
    const horses = [...allHorses].sort((a, b) => {
        if (currentSort === 'number') {
            return parseInt(a.horse_number) - parseInt(b.horse_number);
        } else if (currentSort === 'score') {
            return (b.score || 0) - (a.score || 0);
        }
        return 0;
    });
    
    const horse = horses[index];
    
    document.getElementById('modalHorseName').textContent = \`馬番 \${horse.horse_number}\`;
    document.getElementById('modalContent').innerHTML = \`
        <div class="space-y-4">
            <div>
                <h4 class="font-semibold text-gray-300 mb-2">基本情報</h4>
                <div class="bg-gray-900 rounded-lg p-4 space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-400">馬番:</span>
                        <span class="text-white font-semibold">\${horse.horse_number}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">血統登録番号:</span>
                        <span class="text-white font-semibold">\${horse.horse_id}</span>
                    </div>
                </div>
            </div>
            
            \${horse.score !== null && horse.score !== undefined ? \`
            <div>
                <h4 class="font-semibold text-gray-300 mb-2">ファクター得点</h4>
                <div class="bg-gray-900 rounded-lg p-4 space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-400">総合得点:</span>
                        <span class="text-2xl font-bold text-white">\${horse.score.toFixed(1)} 点</span>
                    </div>
                    <div class="border-t border-gray-800 pt-3 space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-400">RGS (レース適性):</span>
                            <span class="text-blue-400 font-semibold">\${horse.rgs?.toFixed(1) || 'N/A'}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">AAS (能力評価):</span>
                            <span class="text-green-400 font-semibold">\${horse.aas?.toFixed(1) || 'N/A'}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">条件一致:</span>
                            <span class="text-purple-400 font-semibold">
                                \${horse.matched_conditions || 0} / \${horse.total_conditions || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            \` : ''}
            
            <div>
                <h4 class="font-semibold text-gray-300 mb-2">Raw Data</h4>
                <div class="bg-gray-900 rounded-lg p-4">
                    <pre class="text-xs text-gray-400 overflow-x-auto">\${JSON.stringify(horse, null, 2)}</pre>
                </div>
            </div>
        </div>
    \`;
    
    document.getElementById('horseModal').classList.remove('hidden');
    document.getElementById('horseModal').classList.add('flex');
}

// Close modal
function closeModal() {
    document.getElementById('horseModal').classList.add('hidden');
    document.getElementById('horseModal').classList.remove('flex');
}

// Load factors
async function loadFactors() {
    try {
        const response = await axios.get('/api/race-card/factors');
        const factors = response.data;
        
        const select = document.getElementById('factorSelect');
        select.innerHTML = '<option value="">ファクター選択</option>' + 
            factors.map(f => \`<option value="\${f.id}">\${f.name}</option>\`).join('');
    } catch (error) {
        console.error('Failed to load factors:', error);
    }
}

// Apply factor
async function applyFactor() {
    const factorId = document.getElementById('factorSelect').value;
    
    if (!factorId) {
        alert('ファクターを選択してください');
        return;
    }
    
    try {
        // Show loading
        const emptyState = document.getElementById('emptyState');
        emptyState.classList.remove('hidden');
        emptyState.innerHTML = \`
            <i class="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
            <p class="text-gray-400">ファクターを適用中...</p>
        \`;
        document.getElementById('horseList').classList.add('hidden');
        
        // Apply factor
        const response = await axios.post('/api/race-card/apply-factor', {
            factorId: parseInt(factorId),
            horses: allHorses,
            raceInfo: {
                track: trackCode,
                distance: 1800, // TODO: Get from race data
                surface: '芝'   // TODO: Get from race data
            }
        });
        
        const data = response.data;
        allHorses = data.horses.map(h => ({
            ...h,
            score: h.total_score,
            rgs: h.rgs,
            aas: h.aas,
            matched_conditions: h.matched_conditions,
            total_conditions: h.total_conditions
        }));
        
        // Hide loading, show horses
        emptyState.classList.add('hidden');
        document.getElementById('horseList').classList.remove('hidden');
        
        // Sort by score and render
        currentSort = 'score';
        renderHorses(allHorses);
        
        // Show success message
        const factorName = data.factor.name;
        alert(\`ファクター「\${factorName}」を適用しました！\\n\\n得点順に並び替えました。\`);
    } catch (error) {
        console.error('Failed to apply factor:', error);
        alert('ファクターの適用に失敗しました: ' + error.message);
        
        // Reset view
        document.getElementById('emptyState').classList.add('hidden');
        document.getElementById('horseList').classList.remove('hidden');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadRaceCard();
});
    </script>
</body>
</html>`);
});

// API: 出走馬詳細取得
app.get('/api/race-card', async (c) => {
  try {
    const track = c.req.query('track') || '';
    const date = c.req.query('date') || '';
    const raceNum = c.req.query('race') || '';
    
    // Find race in tomorrow races
    // Note: This is a simplified version - in production, use shared state or D1
    const key = `${track}-${date}-${raceNum}`;
    
    // For now, return mock data since we don't have shared state
    // TODO: Implement proper state sharing or D1 storage
    
    return c.json({
      track,
      date,
      raceNumber: raceNum,
      horses: [
        { horse_number: '01', horse_id: '01910696' },
        { horse_number: '02', horse_id: '02210009' },
        { horse_number: '03', horse_id: '02210058' },
        { horse_number: '04', horse_id: '02210142' },
        { horse_number: '05', horse_id: '02210363' },
        { horse_number: '06', horse_id: '02210413' },
        { horse_number: '07', horse_id: '02210544' },
        { horse_number: '08', horse_id: '02210550' },
        { horse_number: '09', horse_id: '02210617' },
        { horse_number: '10', horse_id: '02210643' },
        { horse_number: '11', horse_id: '02210734' },
        { horse_number: '12', horse_id: '01910669' },
      ]
    });
  } catch (error) {
    console.error('Failed to get race card:', error);
    return c.json({ error: 'Failed to get race card' }, 500);
  }
});

// API: ファクター適用
app.post('/api/race-card/apply-factor', async (c) => {
  try {
    const { factorId, horses, raceInfo } = await c.req.json();
    
    if (!factorId || !horses || !raceInfo) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Find factor from global state
    const factor = globalState.getFactor(parseInt(factorId));
    
    if (!factor) {
      return c.json({ error: 'Factor not found' }, 404);
    }
    
    // Parse conditions
    const conditions: FactorConditions = JSON.parse(factor.conditions);
    
    // Apply factor
    const calculator = new FactorCalculator();
    const scoredHorses = calculator.applyFactor(
      horses as HorseData[],
      conditions,
      raceInfo
    );
    
    return c.json({
      horses: scoredHorses,
      factor: {
        id: factor.id,
        name: factor.name,
        description: factor.description
      }
    });
  } catch (error) {
    console.error('Failed to apply factor:', error);
    return c.json({ error: 'Failed to apply factor: ' + error.message }, 500);
  }
});

// API: 登録済みファクター一覧取得（shared with factor-register）
app.get('/api/race-card/factors', async (c) => {
  try {
    return c.json(globalState.getAllFactors());
  } catch (error) {
    console.error('Failed to get factors:', error);
    return c.json({ error: 'Failed to get factors' }, 500);
  }
});

export default app;
