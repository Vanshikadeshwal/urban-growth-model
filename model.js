// =============================================
// MODEL.JS — Growth Velocity Score Engine
// This is the core analytical model.
// =============================================

// Default weights (must sum to 1.0)
let MODEL_WEIGHTS = {
  muni:    0.35,   // Municipal Declarations
  pricing: 0.25,   // Pricing Velocity
  listing: 0.20,   // Listing Density
  rental:  0.20,   // Rental Absorption
};

// Active dataset
let activeZones   = ZONES_DATA.map(z => ({ ...z }));
let activeTenders = TENDERS_DATA.map(t => ({ ...t }));

// ─────────────────────────────────────────
// CORE: Calculate Growth Velocity Score
// ─────────────────────────────────────────
function calcGVS(zone, weights = MODEL_WEIGHTS) {
  const score =
    zone.muni    * weights.muni +
    zone.pricing * weights.pricing +
    zone.listing * weights.listing +
    zone.rental  * weights.rental;
  return Math.round(score);
}

// ─────────────────────────────────────────
// GRADE: Classify zone by GVS
// ─────────────────────────────────────────
function getGrade(gvs) {
  if (gvs >= 80) return { label: 'Prime',    cls: 'badge-green',  color: '#3B6D11', barColor: '#639922', heatBg: '#EAF3DE', heatBorder: '#C0DD97' };
  if (gvs >= 70) return { label: 'Emerging', cls: 'badge-blue',   color: '#185FA5', barColor: '#378ADD', heatBg: '#E6F1FB', heatBorder: '#B5D4F4' };
  if (gvs >= 60) return { label: 'Moderate', cls: 'badge-amber',  color: '#854F0B', barColor: '#BA7517', heatBg: '#FAEEDA', heatBorder: '#FAC775' };
  return             { label: 'Watch',    cls: 'badge-red',    color: '#A32D2D', barColor: '#E24B4A', heatBg: '#FCEBEB', heatBorder: '#F7C1C1' };
}

// ─────────────────────────────────────────
// PROJECTION: Compound appreciation over N months
// ─────────────────────────────────────────
function projectReturn(zone, months) {
  const annualRate = zone.appreciation / 100;
  const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
  const total = (Math.pow(1 + monthlyRate, months) - 1) * 100;
  return parseFloat(total.toFixed(1));
}

// ─────────────────────────────────────────
// SORT zones by given key
// ─────────────────────────────────────────
function sortedZones(key = 'gvs') {
  return [...activeZones].sort((a, b) => {
    if (key === 'gvs')          return calcGVS(b) - calcGVS(a);
    if (key === 'yield')        return b.yield - a.yield;
    if (key === 'appreciation') return b.appreciation - a.appreciation;
    if (key === 'listing')      return b.listing - a.listing;
    return 0;
  });
}

// ─────────────────────────────────────────
// STATS: Compute summary metrics
// ─────────────────────────────────────────
function computeMetrics() {
  const highGrowth = activeZones.filter(z => calcGVS(z) >= 75).length;
  const avgAppr = (activeZones.reduce((s, z) => s + z.appreciation, 0) / activeZones.length).toFixed(1);
  const avgYield = (activeZones.reduce((s, z) => s + z.yield, 0) / activeZones.length).toFixed(1);
  const avgGVS   = Math.round(activeZones.reduce((s, z) => s + calcGVS(z), 0) / activeZones.length);
  return { highGrowth, avgAppr, avgYield, avgGVS };
}

// ─────────────────────────────────────────
// WEIGHTS: Update from sliders and re-render
// ─────────────────────────────────────────
function updateWeights() {
  const mw = parseInt(document.getElementById('w-muni').value);
  const pw = parseInt(document.getElementById('w-price').value);
  const lw = parseInt(document.getElementById('w-listing').value);
  const rw = parseInt(document.getElementById('w-rental').value);
  const total = mw + pw + lw + rw;

  document.getElementById('v-muni').textContent    = mw + '%';
  document.getElementById('v-price').textContent   = pw + '%';
  document.getElementById('v-listing').textContent = lw + '%';
  document.getElementById('v-rental').textContent  = rw + '%';
  document.getElementById('weight-total').textContent = total + '%';

  const warning = document.getElementById('weight-warning');
  const totalEl = document.getElementById('weight-total');

  if (total !== 100) {
    warning.classList.remove('hidden');
    totalEl.style.color = '#A32D2D';
    return;
  }

  warning.classList.add('hidden');
  totalEl.style.color = '#3B6D11';

  MODEL_WEIGHTS = { muni: mw/100, pricing: pw/100, listing: lw/100, rental: rw/100 };
  renderRecalcZones();
}

// ─────────────────────────────────────────
// CITY SWITCH
// ─────────────────────────────────────────
function switchCity(cityKey) {
  const city = CITY_DATA[cityKey];
  if (!city) return;
  activeZones   = city.zones.map(z => ({ ...z }));
  activeTenders = city.tenders.map(t => ({ ...t }));

  document.getElementById('m-zones').textContent     = city.metrics.zones;
  document.getElementById('m-highgrowth').textContent= city.metrics.highGrowth;
  document.getElementById('m-velocity').textContent  = city.metrics.velocity;
  document.getElementById('m-tenders').textContent   = city.metrics.tenders;
  document.getElementById('m-gap').textContent       = city.metrics.gap;
  document.querySelector('.data-source-badge').textContent = city.label;

  renderZones();
  renderSignals();
  renderIngestTable();

  // Re-render active chart panels
  if (document.getElementById('panel-projection').classList.contains('active')) renderProjection(currentHorizon);
  if (document.getElementById('panel-analysis').classList.contains('active'))   { renderYieldChart(); renderRecalcZones(); }
}
