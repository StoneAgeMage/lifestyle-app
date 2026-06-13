// ============================================================
// VITALS — Body weight tracking + calorie/macro targets
// Depends on: engine.js (CalorieEngine), settings.js,
//   dashboard.js (loadWeights, saveWeights),
//   log.js (fmtDate, todayStr, showToast)
// ============================================================

// ---- Weight trend chart (shared with vitals) ----------------

function _svgWeightChart(weightLogs, goalWeight) {
  var W = 460, H = 140;
  var PL = 36, PR = 56, PT = 14, PB = 22;
  var IW = W - PL - PR, IH = H - PT - PB;

  var pts = weightLogs.slice()
    .sort(function(a, b) { return a.date.localeCompare(b.date); })
    .slice(-24)
    .map(function(p) { return { date: p.date, w: parseFloat(p.weight) }; })
    .filter(function(p) { return !isNaN(p.w); });

  if (pts.length === 0) {
    return '<div style="text-align:center;padding:24px 0;font-size:12px;color:var(--txl)">No weight logged yet — use the form below to log your first entry.</div>';
  }

  var weights = pts.map(function(p) { return p.w; });
  var minVal  = Math.min(goalWeight - 3, Math.min.apply(null, weights)) - 1;
  var maxVal  = Math.max.apply(null, weights) + 2;
  var range   = maxVal - minVal || 1;

  function cx(i) {
    return PL + (pts.length < 2 ? IW / 2 : (i / (pts.length - 1)) * IW);
  }
  function cy(v) { return PT + IH - ((v - minVal) / range) * IH; }

  var linePath = pts.map(function(p, i) {
    return (i === 0 ? 'M' : 'L') + cx(i).toFixed(1) + ',' + cy(p.w).toFixed(1);
  }).join(' ');

  var gy = cy(goalWeight).toFixed(1);

  var dots = pts.map(function(p, i) {
    var last = i === pts.length - 1;
    return '<circle cx="' + cx(i).toFixed(1) + '" cy="' + cy(p.w).toFixed(1) + '"' +
      ' r="' + (last ? 4.5 : 2.5) + '"' +
      ' fill="' + (last ? '#0a4f6e' : '#1a8fbe') + '"' +
      (last ? ' stroke="#fff" stroke-width="1.5"' : '') + '/>';
  }).join('');

  var lastW = weights[weights.length - 1];
  var lastX = cx(pts.length - 1).toFixed(1);
  var lastLabelY = (cy(lastW) - 8).toFixed(1);

  var yLabels =
    '<text x="' + (PL - 4) + '" y="' + (cy(maxVal) + 3).toFixed(1) + '" font-size="8.5" fill="#6b7a8d" text-anchor="end">' + Math.round(maxVal) + '</text>' +
    '<text x="' + (PL - 4) + '" y="' + (parseFloat(gy) + 3).toFixed(1) + '" font-size="8.5" fill="#2d8a5e" text-anchor="end">' + goalWeight + '</text>';

  return [
    '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;display:block">',
    '<rect x="' + PL + '" y="' + gy + '" width="' + IW + '" height="' + (PT + IH - parseFloat(gy)).toFixed(1) + '" fill="#2d8a5e" opacity="0.07" rx="2"/>',
    '<line x1="' + PL + '" y1="' + gy + '" x2="' + (PL + IW) + '" y2="' + gy + '" stroke="#2d8a5e" stroke-width="1.5" stroke-dasharray="5,4"/>',
    '<text x="' + (PL + IW + 5) + '" y="' + (parseFloat(gy) - 3) + '" font-size="8" fill="#2d8a5e" font-weight="600">' + goalWeight + ' lb</text>',
    '<text x="' + (PL + IW + 5) + '" y="' + (parseFloat(gy) + 8) + '" font-size="7.5" fill="#2d8a5e">goal</text>',
    '<path d="' + linePath + '" fill="none" stroke="#1a8fbe" stroke-width="2.5" stroke-linejoin="round"/>',
    dots,
    '<text x="' + lastX + '" y="' + lastLabelY + '" font-size="10" fill="#0a4f6e" text-anchor="middle" font-weight="700">' + lastW + '</text>',
    yLabels,
    '</svg>'
  ].join('');
}

// ---- Vitals tab render --------------------------------------

function renderVitals() {
  var el = document.getElementById('panel-settings');
  if (!el) return;

  var s       = loadSettings();
  var unit    = s.weightUnit || 'lb';
  var goal    = s.goalWeight || 165;
  var weights = loadWeights().sort(function(a, b) { return b.date.localeCompare(a.date); });
  var latest  = weights[0];
  var current = latest ? parseFloat(latest.weight) : null;
  var diff    = current !== null ? +(current - goal).toFixed(1) : null;
  var diffStr  = diff !== null ? (diff > 0 ? '+' + diff : String(diff)) + ' ' + unit : '—';
  var diffColor = diff !== null && diff <= 0 ? 'var(--grn)' : 'var(--acc)';

  // Calorie target from engine — auto-calculated, not user-editable
  var calCtx   = CalorieEngine.getDailyTarget(current, goal);
  var dailyCal = calCtx.calories;
  var isLoss   = calCtx.mode === 'loss';
  var modeLabel = isLoss ? 'Weight Loss' : 'Maintenance';

  // Macro split: 0.7g protein per lb goal, 28% fat, remainder carbs
  var proteinG = Math.round(goal * 0.7);
  var fatG     = Math.round(dailyCal * 0.28 / 9);
  var protCal  = proteinG * 4;
  var fatCal   = fatG * 9;
  var carbCal  = dailyCal - protCal - fatCal;
  var carbG    = Math.round(carbCal / 4);

  var recent = weights.slice(0, 8);

  el.innerHTML =
    '<div class="sh"><h2>Vitals</h2><p>Track your weight and set body composition goals.</p></div>' +

    // ── Body Weight card ──
    '<div class="card" style="max-width:560px;margin-bottom:16px">' +
    '<div class="log-form-title">Body Weight</div>' +
    '<div class="db-weight-row">' +
      '<div class="db-weight-stat">' +
        '<div class="db-weight-val">' + (current !== null ? current + ' ' + unit : '—') + '</div>' +
        '<div class="db-weight-lbl">Current</div>' +
      '</div>' +
      '<div class="db-weight-stat">' +
        '<div class="db-weight-val">' + goal + ' ' + unit + '</div>' +
        '<div class="db-weight-lbl">Goal</div>' +
      '</div>' +
      '<div class="db-weight-stat">' +
        '<div class="db-weight-val" style="color:' + diffColor + '">' + diffStr + '</div>' +
        '<div class="db-weight-lbl">To Goal</div>' +
      '</div>' +
    '</div>' +
    '<div style="margin-top:14px">' + _svgWeightChart(weights, goal) + '</div>' +
    '<div class="db-weight-form" style="margin-top:12px">' +
      '<input type="number" id="vt-weight-input" class="lf-input" placeholder="Log weight (' + unit + ')" step="0.1" min="50" max="500" style="flex:1;min-width:0">' +
      '<button class="log-btn" onclick="logVitalWeight()">Log</button>' +
    '</div>' +
    (recent.length > 0
      ? '<div class="vt-history">' +
        recent.map(function(w) {
          return '<div class="vt-history-row">' +
            '<span class="vt-history-date">' + fmtDate(w.date) + '</span>' +
            '<span class="vt-history-val">' + w.weight + ' ' + unit + '</span>' +
          '</div>';
        }).join('') +
        '</div>'
      : ''
    ) +
    '</div>' +

    // ── Calorie & Macro Targets card ──
    '<div class="card" style="max-width:560px">' +
    '<div class="log-form-title">Calorie &amp; Macro Targets</div>' +

    '<div class="vt-cal-display">' +
      '<span class="vt-cal-val">' + dailyCal.toLocaleString() + '</span>' +
      '<span class="vt-cal-mode">' + modeLabel + '</span>' +
    '</div>' +

    '<div class="lf-row" style="margin-bottom:8px">' +
      '<div class="lf-group">' +
        '<label class="lf-label">Goal Weight</label>' +
        '<input type="number" id="vt-goal-weight" class="lf-input" value="' + goal + '" min="50" max="500" step="0.1" style="max-width:130px">' +
      '</div>' +
      '<div class="lf-group">' +
        '<label class="lf-label">Weight Unit</label>' +
        '<div class="st-radio-group">' +
          '<label class="st-radio"><input type="radio" name="vt-unit" value="lb"' + (unit === 'lb' ? ' checked' : '') + '><span>lb</span></label>' +
          '<label class="st-radio"><input type="radio" name="vt-unit" value="kg"' + (unit === 'kg' ? ' checked' : '') + '><span>kg</span></label>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<button class="log-btn" style="margin-bottom:14px" onclick="saveVitalsTargets()">Save Goals</button>' +

    '<div class="vt-macros">' +
      _vtMacro(proteinG + 'g', 'Protein', protCal, dailyCal) +
      _vtMacro(carbG + 'g', 'Carbs', carbCal, dailyCal) +
      _vtMacro(fatG + 'g', 'Fat', fatCal, dailyCal) +
    '</div>' +
    '<div class="vt-helper">Core meal plan provides ~2,100 kcal and ~125g protein. Use daily snacks to bridge any gaps to your current targets.</div>' +
    '</div>' +

    // ── Heart Rate Zones card ──
    '<div class="card" style="max-width:560px;margin-top:16px">' +
    '<div class="log-form-title">Heart Rate Zones</div>' +
    '<div class="lf-row" style="margin-bottom:12px">' +
      '<div class="lf-group">' +
        '<label class="lf-label">Age</label>' +
        '<input type="number" id="vt-hr-age" class="lf-input" value="' + (s.age || '') + '" min="15" max="90" placeholder="e.g. 45" style="max-width:100px" oninput="updateHRZones()">' +
      '</div>' +
      '<div class="lf-group">' +
        '<label class="lf-label">Known Max HR <span style="color:var(--txl);font-weight:400">(optional)</span></label>' +
        '<input type="number" id="vt-hr-max" class="lf-input" value="' + (s.knownMaxHR || '') + '" min="100" max="220" placeholder="e.g. 178" style="max-width:100px" oninput="updateHRZones()">' +
      '</div>' +
    '</div>' +
    '<div id="vt-hr-zones">' + _buildHRZonesHTML(s.age, s.knownMaxHR) + '</div>' +
    '</div>';
}

function _vtMacro(val, label, cal, totalCal) {
  var pct = Math.round(cal / totalCal * 100);
  return '<div class="vt-macro">' +
    '<div class="vt-macro-val">' + val + '</div>' +
    '<div class="vt-macro-lbl">' + label + '</div>' +
    '<div class="vt-macro-sub">' + cal + ' kcal · ' + pct + '%</div>' +
  '</div>';
}

function logVitalWeight() {
  var input = document.getElementById('vt-weight-input');
  if (!input) return;
  var val = parseFloat(input.value);
  if (!input.value || isNaN(val) || val < 50 || val > 500) {
    showToast('Enter a valid weight');
    return;
  }
  var data = loadWeights();
  data.unshift({ id: Date.now(), date: todayStr(), weight: val });
  saveWeights(data);
  input.value = '';
  renderVitals();
  showToast('Weight logged ✓');
}

function saveVitalsTargets() {
  var goalEl = document.getElementById('vt-goal-weight');
  var unitEl = document.querySelector('input[name="vt-unit"]:checked');
  if (!goalEl) return;

  var goalWeight = parseFloat(goalEl.value);
  var weightUnit = unitEl ? unitEl.value : 'lb';

  if (isNaN(goalWeight) || goalWeight < 50 || goalWeight > 500) {
    showToast('Enter a valid goal weight (50–500)');
    return;
  }

  var s = loadSettings();
  saveSettings(Object.assign({}, s, { goalWeight: goalWeight, weightUnit: weightUnit }));
  renderVitals();
  showToast('Goals saved ✓');
}

function initVitals() {
  renderVitals();
}

// ---- HR Zone helpers ----------------------------------------

var _HR_ZONE_COLORS = ['#1a8fbe', '#3aab78', '#d4a817', '#e07838', '#d63845'];

function _buildHRZonesHTML(age, knownMaxHR) {
  var zones = HREngine.getZones(age, knownMaxHR);
  if (!zones) {
    return '<div class="vt-hr-empty">Enter your age above to calculate your training zones.</div>';
  }
  var maxHR  = HREngine.getMaxHR(age, knownMaxHR);
  var source = knownMaxHR
    ? 'Using known max HR: ' + maxHR + ' bpm'
    : 'Estimated max HR: ' + maxHR + ' bpm (Tanaka formula)';
  return '<div class="vt-hr-source">' + source + '</div>' +
    '<div class="vt-hr-list">' +
    zones.map(function(z) {
      var c = _HR_ZONE_COLORS[z.num - 1];
      return '<div class="vt-hr-row">' +
        '<div class="vt-hr-badge" style="background:' + c + '22;color:' + c + '">Z' + z.num + '</div>' +
        '<div class="vt-hr-name">' + z.name + '</div>' +
        '<div class="vt-hr-pct">' + Math.round(z.minPct * 100) + '–' + Math.round(z.maxPct * 100) + '%</div>' +
        '<div class="vt-hr-bpm">' + z.minBPM + '–' + z.maxBPM + ' bpm</div>' +
      '</div>';
    }).join('') +
    '</div>';
}

function updateHRZones() {
  var ageEl   = document.getElementById('vt-hr-age');
  var maxEl   = document.getElementById('vt-hr-max');
  var zonesEl = document.getElementById('vt-hr-zones');
  if (!zonesEl) return;

  var age        = ageEl && ageEl.value    ? parseInt(ageEl.value, 10)    : null;
  var knownMaxHR = maxEl && maxEl.value    ? parseInt(maxEl.value, 10)    : null;
  if (age !== null        && isNaN(age))        age        = null;
  if (knownMaxHR !== null && isNaN(knownMaxHR)) knownMaxHR = null;

  var s = loadSettings();
  saveSettings(Object.assign({}, s, { age: age, knownMaxHR: knownMaxHR }));
  zonesEl.innerHTML = _buildHRZonesHTML(age, knownMaxHR);
}
