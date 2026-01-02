/**
 * Tomorrow Races Route
 * 翌日レース情報の取得・表示
 * 
 * GET /tomorrow-races - 翌日レース一覧UI
 * POST /api/tomorrow-races/upload - CK_DATAファイルアップロード
 * GET /api/tomorrow-races - 登録済みレース一覧取得
 */

import { Hono } from 'hono';
import { HCParser, type HCRecord } from '../parsers/ck/hc';

const app = new Hono();

// In-memory storage (TODO: Replace with D1)
let tomorrowRaces: Map<string, HCRecord[]> = new Map();
let uploadedDate: string = '';

// 翌日レースUI
app.get('/tomorrow-races', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>翌日レース - UMAYOMI</title>
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
        
        .race-card {
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .race-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
        }
        
        .upload-zone {
            border: 2px dashed #475569;
            transition: all 0.3s;
        }
        
        .upload-zone:hover {
            border-color: #3b82f6;
            background: rgba(59, 130, 246, 0.05);
        }
        
        .upload-zone.dragover {
            border-color: #10b981;
            background: rgba(16, 185, 129, 0.1);
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
                        <h1 class="text-2xl font-bold text-white">翌日レース</h1>
                        <p class="text-sm text-gray-400">JRA-VAN CK_DATAから出走表を読み込み</p>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <div id="uploadedInfo" class="text-sm text-gray-400 hidden">
                        <i class="fas fa-calendar-check text-green-400 mr-2"></i>
                        <span id="uploadedDateText"></span>
                    </div>
                    <button onclick="document.getElementById('fileInput').click()" 
                            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
                        <i class="fas fa-upload mr-2"></i>CK_DATA読み込み
                    </button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-8">
        
        <!-- Upload Zone -->
        <div id="uploadZone" class="upload-zone glass rounded-xl p-12 mb-8 text-center">
            <i class="fas fa-cloud-upload-alt text-6xl text-gray-600 mb-4"></i>
            <h3 class="text-xl font-semibold text-white mb-2">CK_DATAファイルをアップロード</h3>
            <p class="text-gray-400 mb-4">ファイルをドラッグ&ドロップ または クリックして選択</p>
            <input type="file" id="fileInput" class="hidden" accept=".DAT,.dat,.txt" onchange="handleFileSelect(event)">
            <p class="text-xs text-gray-500">例: HC020250102.DAT</p>
        </div>
        
        <!-- Race List -->
        <div id="raceListContainer" class="hidden">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-white">
                    <i class="fas fa-list text-blue-400 mr-2"></i>
                    レース一覧
                </h2>
                <div class="text-sm text-gray-400">
                    全 <span id="totalRaces" class="text-white font-bold">0</span> レース
                </div>
            </div>
            
            <div id="raceList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- レースカードがここに表示される -->
            </div>
        </div>
        
        <!-- Empty State -->
        <div id="emptyState" class="text-center py-12">
            <i class="fas fa-inbox text-6xl text-gray-700 mb-4"></i>
            <p class="text-gray-500 mb-4">CK_DATAファイルをアップロードしてください</p>
            <p class="text-sm text-gray-600">金曜/土曜の夜にJRA-VANからダウンロードしたファイル</p>
        </div>
        
    </div>
    
    <script>
let allRaces = [];

// File drop handling
const uploadZone = document.getElementById('uploadZone');

uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

uploadZone.addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

// File select handling
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        handleFile(file);
    }
}

// Upload file
async function handleFile(file) {
    try {
        console.log('Uploading file:', file.name);
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            const content = e.target.result;
            
            await axios.post('/api/tomorrow-races/upload', {
                filename: file.name,
                content: content
            });
            
            alert(\`\${file.name} を読み込みました！\`);
            
            // Reload races
            await loadRaces();
        };
        
        reader.readAsText(file, 'Shift-JIS');
    } catch (error) {
        console.error('Failed to upload file:', error);
        alert('ファイルのアップロードに失敗しました: ' + error.message);
    }
}

// Load races
async function loadRaces() {
    try {
        const response = await axios.get('/api/tomorrow-races');
        const data = response.data;
        
        allRaces = data.races || [];
        const uploadedDate = data.uploadedDate || '';
        
        if (allRaces.length > 0) {
            document.getElementById('emptyState').classList.add('hidden');
            document.getElementById('raceListContainer').classList.remove('hidden');
            document.getElementById('uploadedInfo').classList.remove('hidden');
            document.getElementById('uploadedDateText').textContent = uploadedDate;
            
            renderRaces(allRaces);
        } else {
            document.getElementById('emptyState').classList.remove('hidden');
            document.getElementById('raceListContainer').classList.add('hidden');
            document.getElementById('uploadedInfo').classList.add('hidden');
        }
    } catch (error) {
        console.error('Failed to load races:', error);
    }
}

// Render races
function renderRaces(races) {
    const container = document.getElementById('raceList');
    const totalRaces = document.getElementById('totalRaces');
    
    totalRaces.textContent = races.length;
    
    container.innerHTML = races.map((race, index) => \`
        <div class="glass rounded-xl p-6 race-card" onclick="viewRaceDetail(\${index})">
            <div class="flex items-start justify-between mb-4">
                <div>
                    <h3 class="text-lg font-bold text-white mb-1">\${race.trackName}</h3>
                    <p class="text-sm text-gray-400">\${race.date}</p>
                </div>
                <div class="text-right">
                    <div class="text-2xl font-bold text-blue-400">R\${race.raceNumber}</div>
                </div>
            </div>
            
            <div class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-400">出走頭数</span>
                    <span class="font-semibold text-white">\${race.horseCount}頭</span>
                </div>
            </div>
            
            <div class="mt-4 pt-4 border-t border-gray-700">
                <button class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
                        onclick="event.stopPropagation(); viewRaceDetail(\${index})">
                    <i class="fas fa-eye mr-2"></i>出走表を見る
                </button>
            </div>
        </div>
    \`).join('');
}

// View race detail
function viewRaceDetail(index) {
    const race = allRaces[index];
    window.location.href = \`/race-card?track=\${race.trackCode}&date=\${race.date}&race=\${race.raceNumber}\`;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadRaces();
});
    </script>
</body>
</html>`);
});

// API: CK_DATAアップロード
app.post('/api/tomorrow-races/upload', async (c) => {
  try {
    const { filename, content } = await c.req.json();
    
    if (!filename || !content) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Parse HC file
    const parser = new HCParser();
    const records = parser.parseFile(content);
    
    if (records.length === 0) {
      return c.json({ error: 'No records found in file' }, 400);
    }
    
    // Group by race
    const raceMap = parser.groupByRace(records);
    
    // Store in memory
    tomorrowRaces = raceMap;
    uploadedDate = parser.parseFilenameDate(filename);
    
    return c.json({ 
      message: 'File uploaded successfully',
      totalRecords: records.length,
      totalRaces: raceMap.size,
      uploadedDate
    });
  } catch (error) {
    console.error('Failed to upload CK_DATA:', error);
    return c.json({ error: 'Failed to upload file' }, 500);
  }
});

// API: レース一覧取得
app.get('/api/tomorrow-races', async (c) => {
  try {
    const races = [];
    const parser = new HCParser();
    
    for (const [key, horses] of tomorrowRaces) {
      const firstHorse = horses[0];
      races.push({
        trackCode: firstHorse.track_code,
        trackName: parser.getTrackName(firstHorse.track_code),
        date: uploadedDate || firstHorse.race_date,
        raceNumber: firstHorse.race_number,
        horseCount: horses.length,
        horses: horses.map(h => ({
          horseNumber: h.horse_number,
          horseId: h.horse_id
        }))
      });
    }
    
    // Sort by race number
    races.sort((a, b) => parseInt(a.raceNumber) - parseInt(b.raceNumber));
    
    return c.json({
      races,
      uploadedDate
    });
  } catch (error) {
    console.error('Failed to get tomorrow races:', error);
    return c.json({ error: 'Failed to get races' }, 500);
  }
});

export default app;
