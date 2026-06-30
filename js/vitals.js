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

  var dailyCal = s.dailyCalorieTarget    || 2100;
  var baseline = s.dailyBaselineCalories || 800;
  var pctP     = s.macroPctProtein || 22;
  var pctF     = s.macroPctFat     || 28;
  var pctC     = Math.max(0, 100 - pctP - pctF);

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
    '<div style="border-top:1px solid var(--bdr);margin-top:14px;padding-top:14px">' +
    '<div class="lf-row" style="margin-bottom:0">' +
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
    '</div>' +
    '</div>' +

    // ── Calorie & Macro Targets card ──
    '<div class="card" style="max-width:560px">' +
    '<div class="log-form-title">Calorie &amp; Macro Targets</div>' +

    '<div class="lf-row" style="margin-bottom:6px">' +
      '<div class="lf-group">' +
        '<label class="lf-label">Daily Calorie Target</label>' +
        '<input type="number" id="vt-cal-target" class="lf-input" value="' + dailyCal + '" min="1000" max="6000" step="50" style="max-width:130px" oninput="vtLiveMacros()">' +
      '</div>' +
      '<div class="lf-group">' +
        '<label class="lf-label">Baseline <span style="color:var(--txl);font-weight:400">(breakfast + snacks)</span></label>' +
        '<input type="number" id="vt-cal-baseline" class="lf-input" value="' + baseline + '" min="0" max="3000" step="50" style="max-width:130px" oninput="vtLiveMacros()">' +
      '</div>' +
    '</div>' +
    '<div id="vt-cal-note" class="vt-helper" style="margin-bottom:18px">' + _vtCalNote(dailyCal, baseline) + '</div>' +

    '<div class="vt-sl-section-label">Macro Split</div>' +
    _vtSliderRow('p', 'Protein', pctP) +
    _vtSliderRow('f', 'Fat', pctF) +
    _vtCarbsRow(pctC) +
    '<div id="vt-macro-detail">' + _vtMacroDetail(dailyCal, pctP, pctF) + '</div>' +

    '<button class="log-btn" style="margin-top:16px" onclick="saveVitalsTargets()">Save Targets</button>' +
    '</div>' +

    // ── Heart Rate Zones card ──
    (function() {
      var hrMode = s.hrMode || 'pctMax';
      return '<div class="card" style="max-width:560px;margin-top:16px">' +
      '<div class="log-form-title">Training Intensity Zones</div>' +

      '<div class="lf-row" style="margin-bottom:14px">' +
        '<div class="lf-group">' +
          '<label class="lf-label">Calculation Method</label>' +
          '<div class="st-radio-group">' +
            '<label class="st-radio"><input type="radio" name="vt-hr-mode" value="pctMax"' + (hrMode !== 'hrr' ? ' checked' : '') + ' onchange="updateHRZones()"><span>% Max HR</span></label>' +
            '<label class="st-radio"><input type="radio" name="vt-hr-mode" value="hrr"'    + (hrMode === 'hrr' ? ' checked' : '') + ' onchange="updateHRZones()"><span>Heart Rate Reserve (HRR)</span></label>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="lf-row" style="margin-bottom:12px">' +
        '<div class="lf-group">' +
          '<label class="lf-label">Age</label>' +
          '<input type="number" id="vt-hr-age" class="lf-input" value="' + (s.age || '') + '" min="15" max="90" placeholder="e.g. 55" style="max-width:100px" oninput="updateHRZones()">' +
        '</div>' +
        '<div class="lf-group">' +
          '<label class="lf-label">Known Max HR <span style="color:var(--txl);font-weight:400">(optional)</span></label>' +
          '<input type="number" id="vt-hr-max" class="lf-input" value="' + (s.knownMaxHR || '') + '" min="100" max="220" placeholder="e.g. 178" style="max-width:100px" oninput="updateHRZones()">' +
        '</div>' +
        '<div class="lf-group" id="vt-rhr-row" style="display:' + (hrMode === 'hrr' ? '' : 'none') + '">' +
          '<label class="lf-label">Resting HR <span style="color:var(--txl);font-weight:400">(for HRR)</span></label>' +
          '<input type="number" id="vt-hr-resting" class="lf-input" value="' + (s.restingHR || '') + '" min="30" max="100" placeholder="e.g. 55" style="max-width:100px" oninput="updateHRZones()">' +
        '</div>' +
      '</div>' +

      '<div id="vt-hr-zones">' + _buildHRZonesHTML(s.age, s.knownMaxHR, s.restingHR, hrMode) + '</div>' +
      '</div>';
    })();
}

// ---- Macro UI helpers ---------------------------------------

function _vtCalNote(cal, baseline) {
  var recipeCal  = Math.max(0, cal - baseline);
  var weekCal    = recipeCal * 5;
  return 'Recipes cover <strong>' + recipeCal.toLocaleString() + ' kcal/day</strong> (' +
    cal.toLocaleString() + ' − ' + baseline.toLocaleString() + ' baseline) → ' +
    '<strong>' + weekCal.toLocaleString() + ' kcal/week</strong> across Mon–Fri.';
}

function _vtSliderRow(key, label, pct) {
  return '<div class="vt-sl-row">' +
    '<div class="vt-sl-header">' +
      '<span class="vt-sl-name">' + label + '</span>' +
      '<span class="vt-sl-pct" id="vt-pct-' + key + '">' + pct + '%</span>' +
    '</div>' +
    '<input type="range" class="vt-range" id="vt-sl-' + key + '" min="10" max="70" step="1" value="' + pct + '" oninput="vtLiveMacros()">' +
  '</div>';
}

function _vtCarbsRow(pct) {
  return '<div class="vt-sl-row vt-carbs-row">' +
    '<div class="vt-sl-header">' +
      '<span class="vt-sl-name">Carbs <span style="color:var(--txl);font-size:10px;font-weight:400">(auto)</span></span>' +
      '<span class="vt-sl-pct" id="vt-pct-c">' + pct + '%</span>' +
    '</div>' +
    '<div class="vt-carbs-track">' +
      '<div class="vt-carbs-fill" id="vt-carbs-fill" style="width:' + pct + '%"></div>' +
    '</div>' +
  '</div>';
}

function _vtMacroDetail(cal, pctP, pctF) {
  var pctC = Math.max(0, 100 - pctP - pctF);
  var gP   = Math.round(cal * pctP / 100 / 4);
  var gF   = Math.round(cal * pctF / 100 / 9);
  var gC   = Math.round(cal * pctC / 100 / 4);
  var kcalP = gP * 4;
  var kcalF = Math.round(gF * 9);
  var kcalC = gC * 4;
  return '<div class="vt-macro-detail-row">' +
    '<div class="vt-macro-detail-cell">' +
      '<div class="vt-macro-detail-g" style="color:#e85d26" id="vt-g-p">' + gP + 'g</div>' +
      '<div class="vt-macro-detail-lbl">Protein</div>' +
      '<div class="vt-macro-detail-kcal" id="vt-kcal-p">' + kcalP + ' kcal</div>' +
    '</div>' +
    '<div class="vt-macro-detail-cell">' +
      '<div class="vt-macro-detail-g" style="color:#c8864a" id="vt-g-f">' + gF + 'g</div>' +
      '<div class="vt-macro-detail-lbl">Fat</div>' +
      '<div class="vt-macro-detail-kcal" id="vt-kcal-f">' + kcalF + ' kcal</div>' +
    '</div>' +
    '<div class="vt-macro-detail-cell">' +
      '<div class="vt-macro-detail-g" style="color:#1a8fbe" id="vt-g-c">' + gC + 'g</div>' +
      '<div class="vt-macro-detail-lbl">Carbs</div>' +
      '<div class="vt-macro-detail-kcal" id="vt-kcal-c">' + kcalC + ' kcal</div>' +
    '</div>' +
  '</div>';
}

// ---- Live update on slider / calorie input change -----------

function vtLiveMacros() {
  var calEl  = document.getElementById('vt-cal-target');
  var baseEl = document.getElementById('vt-cal-baseline');
  var slP    = document.getElementById('vt-sl-p');
  var slF    = document.getElementById('vt-sl-f');
  if (!slP || !slF) return;

  var cal  = parseInt(calEl ? calEl.value : 2100, 10) || 2100;
  var base = parseInt(baseEl ? baseEl.value : 800, 10);
  var pP   = parseInt(slP.value, 10);
  var pF   = parseInt(slF.value, 10);

  // Clamp so carbs never drop below 10%
  if (pP + pF > 90) {
    if (document.activeElement === slP) {
      pP = 90 - pF;
      slP.value = pP;
    } else {
      pF = 90 - pP;
      slF.value = pF;
    }
  }
  var pC = 100 - pP - pF;

  // Update percentage labels
  var pctPEl = document.getElementById('vt-pct-p');
  var pctFEl = document.getElementById('vt-pct-f');
  var pctCEl = document.getElementById('vt-pct-c');
  if (pctPEl) pctPEl.textContent = pP + '%';
  if (pctFEl) pctFEl.textContent = pF + '%';
  if (pctCEl) pctCEl.textContent = pC + '%';

  // Update carbs fill bar
  var fillEl = document.getElementById('vt-carbs-fill');
  if (fillEl) fillEl.style.width = pC + '%';

  // Update gram / kcal cells
  var gP = Math.round(cal * pP / 100 / 4);
  var gF = Math.round(cal * pF / 100 / 9);
  var gC = Math.round(cal * pC / 100 / 4);

  var gPEl    = document.getElementById('vt-g-p');
  var gFEl    = document.getElementById('vt-g-f');
  var gCEl    = document.getElementById('vt-g-c');
  var kcalPEl = document.getElementById('vt-kcal-p');
  var kcalFEl = document.getElementById('vt-kcal-f');
  var kcalCEl = document.getElementById('vt-kcal-c');
  if (gPEl) gPEl.textContent    = gP + 'g';
  if (gFEl) gFEl.textContent    = gF + 'g';
  if (gCEl) gCEl.textContent    = gC + 'g';
  if (kcalPEl) kcalPEl.textContent = (gP * 4) + ' kcal';
  if (kcalFEl) kcalFEl.textContent = Math.round(gF * 9) + ' kcal';
  if (kcalCEl) kcalCEl.textContent = (gC * 4) + ' kcal';

  // Update calorie note
  var noteEl = document.getElementById('vt-cal-note');
  if (noteEl && !isNaN(base)) noteEl.innerHTML = _vtCalNote(cal, base);
}

// ---- Save / Log actions -------------------------------------

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
  var goalEl   = document.getElementById('vt-goal-weight');
  var unitEl   = document.querySelector('input[name="vt-unit"]:checked');
  var calEl    = document.getElementById('vt-cal-target');
  var baseEl   = document.getElementById('vt-cal-baseline');
  var slP      = document.getElementById('vt-sl-p');
  var slF      = document.getElementById('vt-sl-f');

  var goalWeight = goalEl  ? parseFloat(goalEl.value)          : null;
  var weightUnit = unitEl  ? unitEl.value                      : 'lb';
  var calTarget  = calEl   ? parseInt(calEl.value,  10)        : null;
  var calBase    = baseEl  ? parseInt(baseEl.value, 10)        : null;
  var pctP       = slP     ? parseInt(slP.value, 10)           : null;
  var pctF       = slF     ? parseInt(slF.value, 10)           : null;

  if (goalEl && (isNaN(goalWeight) || goalWeight < 50 || goalWeight > 500)) {
    showToast('Enter a valid goal weight (50–500)');
    return;
  }

  var s = loadSettings();
  saveSettings(Object.assign({}, s, {
    goalWeight:             goalWeight  !== null && !isNaN(goalWeight)  ? goalWeight  : s.goalWeight,
    weightUnit:             weightUnit,
    dailyCalorieTarget:     calTarget   !== null && calTarget   > 0     ? calTarget   : s.dailyCalorieTarget,
    dailyBaselineCalories:  calBase     !== null && !isNaN(calBase)     ? calBase     : s.dailyBaselineCalories,
    macroPctProtein:        pctP        !== null && !isNaN(pctP)        ? pctP        : s.macroPctProtein,
    macroPctFat:            pctF        !== null && !isNaN(pctF)        ? pctF        : s.macroPctFat,
  }));
  renderVitals();
  showToast('Targets saved ✓');
}

function initVitals() {
  renderVitals();
}

// ---- HR Zone helpers ----------------------------------------

var _HR_ZONE_COLORS = ['#1a8fbe', '#3aab78', '#d4a817', '#e07838', '#d63845'];

function _buildHRZonesHTML(age, knownMaxHR, restingHR, mode) {
  var useHRR = mode === 'hrr' && restingHR >= 30;
  var zones  = HREngine.getZones(age, knownMaxHR, restingHR, mode);
  if (!zones) {
    return '<div class="vt-hr-empty">Enter your age above to calculate your training zones.</div>';
  }
  var maxHR = HREngine.getMaxHR(age, knownMaxHR);
  var source;
  if (useHRR) {
    var hrr = maxHR - restingHR;
    var maxSrc = knownMaxHR ? maxHR + ' bpm (measured)' : maxHR + ' bpm (Tanaka estimate)';
    source = 'Max HR: ' + maxSrc + ' · Resting HR: ' + restingHR + ' bpm · HRR: ' + hrr + ' bpm';
  } else {
    source = knownMaxHR
      ? 'Using known max HR: ' + maxHR + ' bpm'
      : 'Estimated max HR: ' + maxHR + ' bpm (Tanaka formula)';
  }
  var pctLabel = useHRR ? '% HRR' : '% MHR';
  return '<div class="vt-hr-source">' + source + '</div>' +
    '<div class="vt-hr-list">' +
    zones.map(function(z, i) {
      var c = _HR_ZONE_COLORS[i];
      return '<div class="vt-hr-row">' +
        '<div class="vt-hr-badge" style="background:' + c + '22;color:' + c + '">' + z.label + '</div>' +
        '<div class="vt-hr-name">' + z.name + '</div>' +
        '<div class="vt-hr-pct">' + Math.round(z.minPct * 100) + '–' + Math.round(z.maxPct * 100) + ' ' + pctLabel + '</div>' +
        '<div class="vt-hr-bpm">' + z.minBPM + '–' + z.maxBPM + ' bpm</div>' +
      '</div>';
    }).join('') +
    '</div>';
}

function updateHRZones() {
  var ageEl   = document.getElementById('vt-hr-age');
  var maxEl   = document.getElementById('vt-hr-max');
  var rhrEl   = document.getElementById('vt-hr-resting');
  var modeEl  = document.querySelector('input[name="vt-hr-mode"]:checked');
  var zonesEl = document.getElementById('vt-hr-zones');
  var rhrRow  = document.getElementById('vt-rhr-row');
  if (!zonesEl) return;

  var age        = ageEl && ageEl.value ? parseInt(ageEl.value, 10) : null;
  var knownMaxHR = maxEl && maxEl.value ? parseInt(maxEl.value, 10) : null;
  var restingHR  = rhrEl && rhrEl.value ? parseInt(rhrEl.value, 10) : null;
  var mode       = modeEl ? modeEl.value : 'pctMax';

  if (age        !== null && isNaN(age))        age        = null;
  if (knownMaxHR !== null && isNaN(knownMaxHR)) knownMaxHR = null;
  if (restingHR  !== null && isNaN(restingHR))  restingHR  = null;

  if (rhrRow) rhrRow.style.display = mode === 'hrr' ? '' : 'none';

  var s = loadSettings();
  saveSettings(Object.assign({}, s, { age: age, knownMaxHR: knownMaxHR, restingHR: restingHR, hrMode: mode }));
  zonesEl.innerHTML = _buildHRZonesHTML(age, knownMaxHR, restingHR, mode);
}
