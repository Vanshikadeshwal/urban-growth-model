// =============================================
// CHARTS.JS — All Chart.js rendering functions
// =============================================

let projChartInstance = null;
let yieldChartInstance = null;
let currentHorizon = 24;

const CHART_COLORS = ['#378ADD', '#639922', '#BA7517', '#533AB7', '#D85A30'];

// ─────────────────────────────────────────
// PROJECTION CHART — line chart, top 5 zones
// ─────────────────────────────────────────
function renderProjection(months) {
  currentHorizon = months;
  const top5 = sortedZones('gvs').slice(0, 5);

  // Build monthly data points
  const datasets = top5.map((z, i) => {
    const monthlyRate = Math.pow(1 + z.appreciation / 100, 1 / 12) - 1;
    return {
      label: z.name,
      data: Array.from({ length: months }, (_, m) =>
        parseFloat(((Math.pow(1 + monthlyRate, m + 1) - 1) * 100).toFixed(1))
      ),
      borderColor: CHART_COLORS[i],
      backgroundColor: CHART_COLORS[i] + '18',
      borderWidth: 2.5,
      pointRadius: 0,
      tension: 0.4,
      fill: false,
    };
  });

  // X axis labels — sparse
  const tickEvery = Math.ceil(months / 10);
  const labels = Array.from({ length: months }, (_, i) => {
    const mo = i + 1;
    return (mo % tickEvery === 0 || mo === 1 || mo === months) ? mo + ' mo' : '';
  });

  if (projChartInstance) projChartInstance.destroy();
  projChartInstance = new Chart(document.getElementById('projChart'), {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: +${ctx.parsed.y.toFixed(1)}%`
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#9a9a94', font: { size: 11 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 10 },
          grid: { color: 'rgba(0,0,0,0.05)' }
        },
        y: {
          ticks: { color: '#9a9a94', font: { size: 11 }, callback: v => '+' + v.toFixed(0) + '%' },
          grid: { color: 'rgba(0,0,0,0.05)' }
        }
      }
    }
  });

  // Render custom legend
  const legendEl = document.getElementById('proj-legend');
  legendEl.innerHTML = top5.map((z, i) => {
    const proj = projectReturn(z, months);
    return `<span class="legend-item">
      <span class="legend-dot" style="background:${CHART_COLORS[i]};"></span>
      ${z.name} (+${proj}%)
    </span>`;
  }).join('');

  // Render heatmap
  renderHeatmap(months);
}

// ─────────────────────────────────────────
// HEATMAP GRID
// ─────────────────────────────────────────
function renderHeatmap(months) {
  const sorted = sortedZones('gvs');
  const el = document.getElementById('heatmap-grid');
  el.innerHTML = sorted.map(z => {
    const gvs = calcGVS(z);
    const gr = getGrade(gvs);
    const proj = projectReturn(z, months);
    return `<div class="heat-cell" style="background:${gr.heatBg};border-color:${gr.heatBorder};">
      <div class="heat-cell-name">${z.name}</div>
      <div class="heat-cell-proj" style="color:${gr.color};">+${proj}%</div>
      <div class="heat-cell-sub">GVS ${gvs} · ${months}mo</div>
    </div>`;
  }).join('');
}

// ─────────────────────────────────────────
// YIELD vs APPRECIATION SCATTER CHART
// ─────────────────────────────────────────
function renderYieldChart() {
  const data = activeZones.map(z => ({ x: z.appreciation, y: z.yield, label: z.name }));

  // Color by quadrant: high yield + low appreciation = undervalued (orange), high appr = green, else blue
  const avgAppr  = data.reduce((s, d) => s + d.x, 0) / data.length;
  const avgYield = data.reduce((s, d) => s + d.y, 0) / data.length;

  const bgColors = data.map(d => {
    if (d.y > avgYield && d.x < avgAppr) return '#D85A3099'; // Undervalued — high yield, low appr
    if (d.x > avgAppr)                   return '#63992299'; // High growth
    return '#378ADD99';                                       // Monitor
  });

  const borderColors = bgColors.map(c => c.slice(0, 7));

  if (yieldChartInstance) yieldChartInstance.destroy();
  yieldChartInstance = new Chart(document.getElementById('yieldChart'), {
    type: 'bubble',
    data: {
      datasets: [{
        label: 'Zones',
        data: data.map(d => ({ x: d.x, y: d.y, r: 9 })),
        backgroundColor: bgColors,
        borderColor: borderColors,
        borderWidth: 1.5,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => {
              const d = data[ctx.dataIndex];
              return ` ${d.label} — Yield: ${d.y}% | Appreciation: ${d.x}%`;
            }
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Price Appreciation (% YoY)', color: '#9a9a94', font: { size: 12 } },
          ticks: { color: '#9a9a94', font: { size: 11 } },
          grid: { color: 'rgba(0,0,0,0.05)' },
          min: 2, max: 17
        },
        y: {
          title: { display: true, text: 'Rental Yield (%)', color: '#9a9a94', font: { size: 12 } },
          ticks: { color: '#9a9a94', font: { size: 11 } },
          grid: { color: 'rgba(0,0,0,0.05)' },
          min: 2.5, max: 7
        }
      },
      layout: { padding: 10 }
    }
  });
}

// ─────────────────────────────────────────
// SET HORIZON (button handler)
// ─────────────────────────────────────────
function setHorizon(months, btn) {
  document.querySelectorAll('.horizon-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProjection(months);
}
