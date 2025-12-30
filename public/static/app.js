// UMAYOMI Dashboard JavaScript

// Sample race data
const sampleRaces = [
    { date: '2025-12-29', track: '東京', race: '1R', distance: '1600m', condition: '良', recovery: 145.2, hit: true },
    { date: '2025-12-29', track: '東京', race: '2R', distance: '2000m', condition: '良', recovery: 98.5, hit: false },
    { date: '2025-12-29', track: '中山', race: '1R', distance: '1200m', condition: '稍重', recovery: 132.8, hit: true },
    { date: '2025-12-28', track: '阪神', race: '3R', distance: '1800m', condition: '良', recovery: 156.3, hit: true },
    { date: '2025-12-28', track: '東京', race: '5R', distance: '2400m', condition: '良', recovery: 89.2, hit: false },
    { date: '2025-12-28', track: '中山', race: '7R', distance: '1600m', condition: '良', recovery: 142.1, hit: true },
    { date: '2025-12-27', track: '阪神', race: '2R', distance: '1400m', condition: '重', recovery: 178.5, hit: true },
    { date: '2025-12-27', track: '東京', race: '4R', distance: '1800m', condition: '良', recovery: 95.6, hit: false },
    { date: '2025-12-27', track: '中山', race: '6R', distance: '2000m', condition: '稍重', recovery: 125.3, hit: true },
    { date: '2025-12-26', track: '阪神', race: '8R', distance: '1600m', condition: '良', recovery: 162.7, hit: true },
];

// Populate race table
function populateRaceTable() {
    const tbody = document.getElementById('raceTableBody');
    tbody.innerHTML = '';
    
    sampleRaces.forEach((race, index) => {
        const row = document.createElement('tr');
        row.className = 'border-b border-dark-border data-row transition-smooth cursor-pointer';
        row.style.opacity = '0';
        row.style.animation = `fadeInUp 0.4s ease-out ${index * 0.05}s forwards`;
        
        const hitBadge = race.hit 
            ? '<span class="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs font-medium">的中</span>'
            : '<span class="px-2 py-1 bg-gray-600/20 text-gray-400 rounded text-xs font-medium">不的中</span>';
        
        const recoveryColor = race.recovery >= 100 ? 'text-green-400' : 'text-red-400';
        
        row.innerHTML = `
            <td class="py-4 px-4 text-sm text-gray-300">${race.date}</td>
            <td class="py-4 px-4">
                <span class="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-medium">
                    ${race.track}
                </span>
            </td>
            <td class="py-4 px-4 text-sm font-medium text-white">${race.race}</td>
            <td class="py-4 px-4 text-sm text-gray-300">${race.distance}</td>
            <td class="py-4 px-4">
                <span class="px-2 py-1 bg-slate-600/30 text-gray-300 rounded text-xs">
                    ${race.condition}
                </span>
            </td>
            <td class="py-4 px-4 text-sm font-bold ${recoveryColor}">${race.recovery}%</td>
            <td class="py-4 px-4">${hitBadge}</td>
            <td class="py-4 px-4 text-right">
                <button class="px-3 py-1 glass text-gray-400 rounded text-xs hover:bg-dark-card hover:text-white transition-smooth">
                    <i class="fas fa-eye mr-1"></i>詳細
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Create recovery rate chart
function createRecoveryChart() {
    const ctx = document.getElementById('recoveryChart').getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            datasets: [{
                label: '回収率 (%)',
                data: [125, 118, 132, 145, 128, 135, 142, 138, 148, 152, 146, 158],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#0f172a',
                pointBorderWidth: 2,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: 'rgb(59, 130, 246)',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#f8fafc',
                    bodyColor: '#cbd5e1',
                    borderColor: '#334155',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return '回収率: ' + context.parsed.y + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(51, 65, 85, 0.3)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    populateRaceTable();
    createRecoveryChart();
    
    // Add smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add table row click handlers
    document.querySelectorAll('.data-row').forEach(row => {
        row.addEventListener('click', function() {
            console.log('Row clicked - would navigate to race detail page');
        });
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { populateRaceTable, createRecoveryChart };
}
