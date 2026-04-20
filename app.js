// =============================================
// APP.JS — UI rendering, tabs, data ingest
// =============================================

// ─────────────────────────────────────────
// TAB NAVIGATION
// ─────────────────────────────────────────
const TAB_TITLES = {
  zones:      { title: 'Zone Rankings',  sub: 'Growth Velocity Score across NCR micro-markets' },
  signals:    { title: 'Signal Matrix',  sub: 'Multi-source data stream analysis' },
  projection: { title: 'Projections',    sub: '24–60 month price appreciation forecast' },
  analysis:   { title: 'Trend Analysis', sub: 'Undervaluation detection & correlation modelling' },
  ingest:     { title: 'Data Ingest',    sub: 'Add zones or municipal declarations to the model' },
};

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    const tab = item.dataset.tab;
    switchTab(tab);
    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      document.getElementById('sidebar').classList.remove('open');
    }
  });
});

function switchTab(tab) {
  // Update nav
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector(`.nav-item[data-tab="${tab}"]`).classList.add('active');

  // Update panels
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + tab).classList.add('active');

  // Update header
  const info = TAB_TITLES[tab];
  document.getElementById('page-title').textContent = info.title;
  document.querySelector('.page-subtitle').textContent = info.sub;

  // Lazy render charts only when tab opens
  if (tab === 'projection') renderProjection(currentHorizon);
  if (tab === 'analysis')   { renderYieldChart(); renderRecalcZones(); }
  if (tab === 'signals')    renderSignals();
  if (tab === 'ingest')     renderIngestTable();
}

// ─────────────────────────────────────────
// RENDER: Zone Rankings
// ─────────────────────────────────────────
function renderZones(sortKey = 'gvs') {
  const sorted = sortedZones(sortKey);
  const el = document.getElementById('zone-list');
  el.innerHTML = sorted.map((z, i) => {
    const gvs = calcGVS(z);
    const gr  = getGrade(gvs);
    return `<div class="zone-row">
      <div class="zone-rank">${i + 1}</div>
      <div class="zone-name">${z.name}</div>
      <div class="gvs-bar-wrap">
        <div class="gvs-bar" style="width:${gvs}%;background:${gr.barColor};"></div>
      </div>
      <div class="gvs-score" style="color:${gr.barColor};">${gvs}</div>
      <span class="badge ${gr.cls}">${gr.label}</span>
      <div class="zone-meta">${z.yield}% yield</div>
    </div>`;
  }).join('');
}

function sortZones(key) { renderZones(key); }

// ─────────────────────────────────────────
// RENDER: Signal Matrix
// ─────────────────────────────────────────
function renderSignals() {
  const top8 = sortedZones('gvs').slice(0, 8);
  const tbody = document.getElementById('signal-table-body');

  tbody.innerHTML = top8.map(z => {
    const gvs = calcGVS(z);
    const gr  = getGrade(gvs);
    const horizon = gvs >= 75 ? '24–36 mo' : gvs >= 65 ? '36–48 mo' : '48–60 mo';

    const bar = (val, color) => `
      <div style="display:flex;align-items:center;gap:6px;">
        <div class="mini-bar-wrap"><div class="mini-bar" style="width:${val}%;background:${color};"></div></div>
        <span style="font-size:11px;color:#9a9a94;">${val}</span>
      </div>`;

    return `<tr>
      <td style="font-weight:600;">${z.name}</td>
      <td>${bar(z.muni,    '#378ADD')}</td>
      <td>${bar(z.listing, '#BA7517')}</td>
      <td>${bar(z.pricing, '#639922')}</td>
      <td>${bar(z.rental,  '#533AB7')}</td>
      <td><span class="badge ${gr.cls}">${gvs}</span></td>
      <td style="font-size:12px;color:#5a5a56;">${horizon}</td>
    </tr>`;
  }).join('');

  // Tender list
  const tl = document.getElementById('tender-list');
  tl.innerHTML = activeTenders.map(t => {
    const sc = t.status === 'Awarded' || t.status === 'Completed'
      ? 'badge-green' : t.status === 'Ongoing' ? 'badge-blue' : 'badge-amber';
    const ic = t.impact === 'High' ? 'badge-red' : t.impact === 'Medium' ? 'badge-amber' : 'badge-purple';
    return `<div class="tender-row">
      <div class="tender-zone">${t.zone}</div>
      <div class="tender-type">${t.type}</div>
      <span class="badge ${sc}">${t.status}</span>
      <span class="badge ${ic}">${t.impact} impact</span>
    </div>`;
  }).join('');
}

// ─────────────────────────────────────────
// RENDER: Recalculated Zones (Trend Analysis)
// ─────────────────────────────────────────
function renderRecalcZones() {
  const sorted = sortedZones('gvs').slice(0, 6);
  const el = document.getElementById('recalc-zones');
  el.innerHTML = `<div style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#9a9a94;margin-bottom:8px;">Top zones with adjusted weights</div>` +
    sorted.map((z, i) => {
      const gvs = calcGVS(z);
      const gr  = getGrade(gvs);
      return `<div class="zone-row">
        <div class="zone-rank">${i + 1}</div>
        <div class="zone-name">${z.name}</div>
        <div class="gvs-bar-wrap">
          <div class="gvs-bar" style="width:${gvs}%;background:${gr.barColor};"></div>
        </div>
        <div class="gvs-score" style="color:${gr.barColor};">${gvs}</div>
        <span class="badge ${gr.cls}">${gr.label}</span>
      </div>`;
    }).join('');
}

// ─────────────────────────────────────────
// RENDER: Ingest table preview
// ─────────────────────────────────────────
function renderIngestTable() {
  const tbody = document.getElementById('ingest-table-body');
  tbody.innerHTML = activeZones.map((z, idx) => {
    const gvs = calcGVS(z);
    const gr  = getGrade(gvs);
    return `<tr>
      <td style="font-weight:600;">${z.name}</td>
      <td>${z.muni}</td>
      <td>${z.listing}</td>
      <td>${z.pricing}</td>
      <td>${z.rental}</td>
      <td>${z.yield}%</td>
      <td>${z.appreciation}%</td>
      <td><span class="badge ${gr.cls}">${gvs}</span></td>
      <td><button onclick="deleteZone(${idx})" style="background:none;border:none;color:#A32D2D;cursor:pointer;font-size:13px;font-weight:600;">✕</button></td>
    </tr>`;
  }).join('');
}

// ─────────────────────────────────────────
// DATA INGEST: Add a new zone
// ─────────────────────────────────────────
function ingestZone() {
  const name    = document.getElementById('i-name').value.trim();
  const muni    = parseInt(document.getElementById('i-muni').value);
  const listing = parseInt(document.getElementById('i-listing').value);
  const pricing = parseInt(document.getElementById('i-pricing').value);
  const rental  = parseInt(document.getElementById('i-rental').value);
  const yld     = parseFloat(document.getElementById('i-yield').value);
  const appr    = parseFloat(document.getElementById('i-appr').value);
  const msg     = document.getElementById('ingest-msg');

  if (!name || isNaN(muni) || isNaN(listing) || isNaN(pricing) || isNaN(rental) || isNaN(yld) || isNaN(appr)) {
    showMsg(msg, 'error', '⚠ Please fill in all fields correctly.');
    return;
  }

  const newZone = { name, muni, listing, pricing, rental, yield: yld, appreciation: appr };
  activeZones.push(newZone);

  // Clear form
  ['i-name','i-muni','i-listing','i-pricing','i-rental','i-yield','i-appr'].forEach(id => {
    document.getElementById(id).value = '';
  });

  renderZones();
  renderIngestTable();
  updateTopMetrics();
  showMsg(msg, 'success', `✓ "${name}" added — GVS: ${calcGVS(newZone)}`);
}

// ─────────────────────────────────────────
// DATA INGEST: Add a tender
// ─────────────────────────────────────────
function ingestTender() {
  const zone   = document.getElementById('t-zone').value.trim();
  const type   = document.getElementById('t-type').value.trim();
  const status = document.getElementById('t-status').value;
  const impact = document.getElementById('t-impact').value;
  const msg    = document.getElementById('tender-msg');

  if (!zone || !type) {
    showMsg(msg, 'error', '⚠ Zone name and declaration type are required.');
    return;
  }

  activeTenders.push({ zone, type, status, impact });
  document.getElementById('t-zone').value = '';
  document.getElementById('t-type').value = '';

  document.getElementById('m-tenders').textContent = activeTenders.length;
  showMsg(msg, 'success', `✓ Declaration for "${zone}" added.`);
}

// ─────────────────────────────────────────
// DELETE zone from ingest table
// ─────────────────────────────────────────
function deleteZone(idx) {
  activeZones.splice(idx, 1);
  renderZones();
  renderIngestTable();
  updateTopMetrics();
}

// ─────────────────────────────────────────
// UPDATE metric cards
// ─────────────────────────────────────────
function updateTopMetrics() {
  const m = computeMetrics();
  document.getElementById('m-zones').textContent      = activeZones.length;
  document.getElementById('m-highgrowth').textContent = m.highGrowth;
  document.getElementById('m-velocity').textContent   = '+' + m.avgAppr + '%';
}

// ─────────────────────────────────────────
// HELPER: show message
// ─────────────────────────────────────────
function showMsg(el, type, text) {
  el.textContent = text;
  el.className = 'ingest-msg ' + type;
  setTimeout(() => { el.className = 'ingest-msg hidden'; }, 3500);
}

// ─────────────────────────────────────────
// INIT — render default view
// ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderZones();
});
