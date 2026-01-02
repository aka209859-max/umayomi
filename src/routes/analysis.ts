/**
 * Analysis/Backtest Results UI Route
 * 回収率分析・バックテスト結果表示ページ
 * 
 * GET /analysis
 */

import { Hono } from 'hono';

const app = new Hono();

app.get('/analysis', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>回収率分析 - UMAYOMI</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; }
        
        .glass {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(148, 163, 184, 0.1);
        }
        
        .stat-card {
            transition: all 0.3s ease;
        }
        
        .stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
        }
        
        .chart-container {
            position: relative;
            height: 400px;
        }
    </style>
</head>
<body class="bg-gray-900 text-gray-100 min-h-screen">
    
    <!-- Header -->
    <div class="bg-gray-800 border-b border-gray-700">
        <div class="max-w-7xl mx-auto px-6 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <a href="/condition-settings" class="text-gray-400 hover:text-white transition">
                        <i class="fas fa-arrow-left"></i>
                    </a>
                    <div>
                        <h1 class="text-2xl font-bold text-white">回収率分析</h1>
                        <p class="text-sm text-gray-400">バックテスト結果と回収率の詳細分析</p>
                    </div>
                </div>
                <div class="flex space-x-3">
                    <button onclick="runBacktest()" class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition">
                        <i class="fas fa-play mr-2"></i>バックテスト実行
                    </button>
                    <button onclick="saveAsLogic()" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
                        <i class="fas fa-save mr-2"></i>ロジックとして保存
                    </button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-8">
        
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <!-- 回収率 -->
            <div class="glass rounded-xl p-6 stat-card">
                <div class="flex items-center justify-between mb-4">
                    <div class="text-gray-400 text-sm font-medium">回収率</div>
                    <div class="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                        <i class="fas fa-coins text-green-400"></i>
                    </div>
                </div>
                <div id="recovery-rate" class="text-4xl font-bold text-white mb-2">128.5%</div>
                <div class="flex items-center text-sm">
                    <i class="fas fa-arrow-up text-green-400 mr-1"></i>
                    <span class="text-green-400 font-medium">+28.5%</span>
                    <span class="text-gray-500 ml-2">100%基準</span>
                </div>
            </div>
            
            <!-- 的中率 -->
            <div class="glass rounded-xl p-6 stat-card">
                <div class="flex items-center justify-between mb-4">
                    <div class="text-gray-400 text-sm font-medium">的中率</div>
                    <div class="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <i class="fas fa-bullseye text-blue-400"></i>
                    </div>
                </div>
                <div id="hit-rate" class="text-4xl font-bold text-white mb-2">35.2%</div>
                <div class="flex items-center text-sm">
                    <span class="text-gray-400">対象レース:</span>
                    <span id="total-races" class="text-white ml-2 font-medium">1,043</span>
                </div>
            </div>
            
            <!-- ROI -->
            <div class="glass rounded-xl p-6 stat-card">
                <div class="flex items-center justify-between mb-4">
                    <div class="text-gray-400 text-sm font-medium">ROI</div>
                    <div class="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                        <i class="fas fa-chart-line text-purple-400"></i>
                    </div>
                </div>
                <div id="roi" class="text-4xl font-bold text-white mb-2">+28.5%</div>
                <div class="flex items-center text-sm">
                    <span class="text-gray-400">投資収益率</span>
                </div>
            </div>
            
            <!-- 総利益 -->
            <div class="glass rounded-xl p-6 stat-card">
                <div class="flex items-center justify-between mb-4">
                    <div class="text-gray-400 text-sm font-medium">総利益</div>
                    <div class="w-10 h-10 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                        <i class="fas fa-yen-sign text-yellow-400"></i>
                    </div>
                </div>
                <div id="total-profit" class="text-4xl font-bold text-white mb-2">+285,000</div>
                <div class="flex items-center text-sm">
                    <span class="text-gray-400">円</span>
                    <span class="text-green-400 ml-2">(1レース100円購入)</span>
                </div>
            </div>
        </div>
        
        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <!-- 回収率推移グラフ -->
            <div class="glass rounded-xl p-6">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h3 class="text-xl font-bold text-white">回収率推移</h3>
                        <p class="text-sm text-gray-400 mt-1">月別の回収率変動</p>
                    </div>
                    <select id="period-selector" class="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300">
                        <option value="6m">過去6ヶ月</option>
                        <option value="1y" selected>過去1年</option>
                        <option value="all">全期間</option>
                    </select>
                </div>
                <div class="chart-container">
                    <canvas id="recoveryChart"></canvas>
                </div>
            </div>
            
            <!-- 的中率推移グラフ -->
            <div class="glass rounded-xl p-6">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h3 class="text-xl font-bold text-white">的中率推移</h3>
                        <p class="text-sm text-gray-400 mt-1">月別の的中率変動</p>
                    </div>
                </div>
                <div class="chart-container">
                    <canvas id="hitRateChart"></canvas>
                </div>
            </div>
        </div>
        
        <!-- 詳細統計 -->
        <div class="glass rounded-xl p-6 mb-8">
            <h3 class="text-xl font-bold text-white mb-6">
                <i class="fas fa-table text-blue-400 mr-2"></i>
                詳細統計
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- 競馬場別統計 -->
                <div>
                    <h4 class="text-sm font-medium text-gray-400 mb-3">競馬場別回収率</h4>
                    <div class="space-y-2">
                        <div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <span class="text-gray-300">東京</span>
                            <span class="text-green-400 font-medium">145.2%</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <span class="text-gray-300">中山</span>
                            <span class="text-green-400 font-medium">132.8%</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <span class="text-gray-300">阪神</span>
                            <span class="text-green-400 font-medium">128.5%</span>
                        </div>
                    </div>
                </div>
                
                <!-- 距離別統計 -->
                <div>
                    <h4 class="text-sm font-medium text-gray-400 mb-3">距離別回収率</h4>
                    <div class="space-y-2">
                        <div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <span class="text-gray-300">1200m</span>
                            <span class="text-green-400 font-medium">138.2%</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <span class="text-gray-300">1600m</span>
                            <span class="text-green-400 font-medium">125.6%</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <span class="text-gray-300">2000m</span>
                            <span class="text-green-400 font-medium">122.3%</span>
                        </div>
                    </div>
                </div>
                
                <!-- 馬場別統計 -->
                <div>
                    <h4 class="text-sm font-medium text-gray-400 mb-3">馬場別回収率</h4>
                    <div class="space-y-2">
                        <div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <span class="text-gray-300">芝</span>
                            <span class="text-green-400 font-medium">135.4%</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <span class="text-gray-300">ダート</span>
                            <span class="text-green-400 font-medium">118.9%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- レース結果一覧 -->
        <div class="glass rounded-xl p-6">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h3 class="text-xl font-bold text-white">レース結果一覧</h3>
                    <p class="text-sm text-gray-400 mt-1">バックテスト対象レースの詳細</p>
                </div>
                <button onclick="exportResults()" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition">
                    <i class="fas fa-download mr-2"></i>CSVエクスポート
                </button>
            </div>
            
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="border-b border-gray-700">
                            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">日付</th>
                            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">競馬場</th>
                            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">R</th>
                            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">距離</th>
                            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">予想馬</th>
                            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">着順</th>
                            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">オッズ</th>
                            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">結果</th>
                        </tr>
                    </thead>
                    <tbody id="resultsTableBody">
                        <!-- Results will be inserted here -->
                    </tbody>
                </table>
            </div>
            
            <!-- Pagination -->
            <div class="flex items-center justify-between mt-6 pt-6 border-t border-gray-700">
                <div class="text-sm text-gray-400">
                    1-20 / 1,043 レース
                </div>
                <div class="flex space-x-2">
                    <button class="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">1</button>
                    <button class="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition">2</button>
                    <button class="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition">3</button>
                    <button class="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition">...</button>
                    <button class="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition">53</button>
                    <button class="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
        
    </div>
    
    <script>
// Analysis Page JavaScript

// Sample data (will be replaced with real API data)
const sampleResults = [
    { date: '2024-12-29', track: '東京', race: '1R', distance: '1600m', horse: 'エイシンフラッシュ', finish: 1, odds: 3.2, hit: true },
    { date: '2024-12-29', track: '東京', race: '2R', distance: '2000m', horse: 'ディープインパクト', finish: 5, odds: 2.1, hit: false },
    { date: '2024-12-29', track: '中山', race: '1R', distance: '1200m', horse: 'オルフェーヴル', finish: 2, odds: 4.5, hit: true },
    { date: '2024-12-28', track: '阪神', race: '3R', distance: '1800m', horse: 'キタサンブラック', finish: 1, odds: 2.8, hit: true },
    { date: '2024-12-28', track: '東京', race: '5R', distance: '2400m', horse: 'ゴールドシップ', finish: 8, odds: 5.2, hit: false },
];

// Initialize charts
function createRecoveryChart() {
    const ctx = document.getElementById('recoveryChart').getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(34, 197, 94, 0.3)');
    gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            datasets: [{
                label: '回収率 (%)',
                data: [125, 118, 132, 145, 128, 135, 142, 138, 148, 152, 146, 158],
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: 'rgb(34, 197, 94)',
                pointBorderColor: '#111827',
                pointBorderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    titleColor: '#f8fafc',
                    bodyColor: '#cbd5e1',
                    borderColor: '#374151',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 100,
                    grid: { color: 'rgba(55, 65, 81, 0.3)' },
                    ticks: { 
                        color: '#9ca3af',
                        callback: (value) => value + '%'
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#9ca3af' }
                }
            }
        }
    });
}

function createHitRateChart() {
    const ctx = document.getElementById('hitRateChart').getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            datasets: [{
                label: '的中率 (%)',
                data: [32, 28, 35, 38, 33, 36, 39, 34, 40, 42, 38, 41],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#111827',
                pointBorderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    titleColor: '#f8fafc',
                    bodyColor: '#cbd5e1',
                    borderColor: '#374151',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(55, 65, 81, 0.3)' },
                    ticks: { 
                        color: '#9ca3af',
                        callback: (value) => value + '%'
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#9ca3af' }
                }
            }
        }
    });
}

// Populate results table
function populateResultsTable() {
    const tbody = document.getElementById('resultsTableBody');
    tbody.innerHTML = '';
    
    sampleResults.forEach(result => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-700 hover:bg-gray-800 transition cursor-pointer';
        
        const hitBadge = result.hit 
            ? '<span class="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs font-medium">的中</span>'
            : '<span class="px-2 py-1 bg-gray-600/20 text-gray-400 rounded text-xs font-medium">不的中</span>';
        
        row.innerHTML = \`
            <td class="py-3 px-4 text-sm text-gray-300">\${result.date}</td>
            <td class="py-3 px-4"><span class="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-medium">\${result.track}</span></td>
            <td class="py-3 px-4 text-sm text-white font-medium">\${result.race}</td>
            <td class="py-3 px-4 text-sm text-gray-300">\${result.distance}</td>
            <td class="py-3 px-4 text-sm text-white">\${result.horse}</td>
            <td class="py-3 px-4 text-sm font-bold \${result.finish <= 3 ? 'text-green-400' : 'text-gray-400'}">\${result.finish}着</td>
            <td class="py-3 px-4 text-sm text-gray-300">\${result.odds}倍</td>
            <td class="py-3 px-4">\${hitBadge}</td>
        \`;
        
        tbody.appendChild(row);
    });
}

// Run backtest
async function runBacktest() {
    console.log('Running backtest...');
    alert('バックテストを実行中...\\n（過去データを分析します）');
    
    // TODO: Call backtest API
    // const response = await axios.post('/api/backtest', conditions);
}

// Save as logic
function saveAsLogic() {
    window.location.href = '/factor-register';
}

// Export results
function exportResults() {
    console.log('Exporting results...');
    alert('CSV形式でエクスポート中...\\n（実装予定）');
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    createRecoveryChart();
    createHitRateChart();
    populateResultsTable();
});
    </script>
</body>
</html>`);
});

export default app;
