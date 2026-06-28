// ============================================================
// PROGRESS — workout consistency and performance metrics
// Weight tracking has moved to vitals.js / Vitals tab.
// Depends on: log.js (fmtDate), storage.js
// ============================================================

// ---- Session frequency chart (SVG bars) ---------------------

function _svgSessionChart(allLogs) {
  var NUM_WEEKS = 10;
  var W = 460, H = 110;
  var PL = 8, PR = 8, PT = 14, PB = 20;
  var IW = W - PL - PR, IH = H - PT - PB;

  var now = new Date(); now.setHours(0, 0, 0, 0);
  var thisSunday = new Date(now); thisSunday.setDate(now.getDate() - now.getDay());

  var weeks = [];
  for (var i = NUM_WEEKS - 1; i >= 0; i--) {
    var ws = new Date(thisSunday); ws.setDate(thisSunday.getDate() - i * 7);
    var we = new Date(ws); we.setDate(ws.getDate() + 6);
    var wsStr = ws.toISOString().slice(0, 10);
    var weStr = we.toISOString().slice(0, 10);
    var liftCount = allLogs.filter(function(e) { return e._logType === 'lift' && e.date >= wsStr && e.date <= weStr; }).length;
    var ergCount  = allLogs.filter(function(e) { return e._logType === 'erg'  && e.date >= wsStr && e.date <= weStr; }).length;
    var runCount  = allLogs.filter(function(e) { return e._logType === 'run'  && e.date >= wsStr && e.date <= weStr; }).length;
    weeks.push({ label: (ws.getMonth() + 1) + '/' + ws.getDate(), lift: liftCount, erg: ergCount, run: runCount });
  }

  var maxTotal = Math.max.apply(null, weeks.map(function(w) { return w.lift + w.erg + w.run; })) || 1;
  var barSlot  = IW / NUM_WEEKS;
  var barW     = barSlot * 0.68;

  if (weeks.every(function(w) { return w.lift + w.erg + w.run === 0; })) {
    return '<div style="text-align:center;padding:24px 0;font-size:12px;color:#6b7a8d">No sessions logged yet — frequency chart will appear here.</div>';
  }

  var bars = weeks.map(function(wk, i) {
    var x      = PL + i * barSlot + (barSlot - barW) / 2;
    var total  = wk.lift + wk.erg + wk.run;
    var liftH  = (wk.lift / maxTotal) * IH;
    var ergH   = (wk.erg  / maxTotal) * IH;
    var runH   = (wk.run  / maxTotal) * IH;
    var liftY  = PT + IH - liftH;
    var ergY   = liftY - ergH;
    var runY   = ergY - runH;

    return [
      wk.run  > 0 ? '<rect x="' + x.toFixed(1) + '" y="' + runY.toFixed(1)  + '" width="' + barW.toFixed(1) + '" height="' + runH.toFixed(1)  + '" fill="#2a9a5a" rx="3"/>' : '',
      wk.erg  > 0 ? '<rect x="' + x.toFixed(1) + '" y="' + ergY.toFixed(1)  + '" width="' + barW.toFixed(1) + '" height="' + ergH.toFixed(1)  + '" fill="#1a8fbe" rx="3"/>' : '',
      wk.lift > 0 ? '<rect x="' + x.toFixed(1) + '" y="' + liftY.toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + liftH.toFixed(1) + '" fill="#c8864a" rx="3"/>' : '',
      total   > 0 ? '<text x="' + (x + barW / 2).toFixed(1) + '" y="' + (Math.min(liftY, ergY, runY) - 3).toFixed(1) + '" font-size="8.5" fill="#3d4a5c" text-anchor="middle" font-weight="600">' + total + '</text>' : '',
      '<text x="' + (x + barW / 2).toFixed(1) + '" y="' + (PT + IH + 13) + '" font-size="7.5" fill="#6b7a8d" text-anchor="middle">' + wk.label + '</text>'
    ].join('');
  }).join('');

  return [
    '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;display:block">',
    bars,
    '</svg>'
  ].join('');
}

// ---- 6k TT split trend chart --------------------------------

function _parseSplitSecs(s) {
  if (!s) return null;
  var parts = String(s).trim().split(':');
  if (parts.length === 2) return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
  return null;
}

function _fmtSplit(sec) {
  var m = Math.floor(sec / 60);
  var s = Math.floor(sec % 60);
  return m + ':' + (s < 10 ? '0' : '') + s;
}

// Paul's Law exponent for rowing pace prediction across distances
function _predictSplit(s6kSec, targetDist) {
  var T6k = s6kSec * 12; // 6000m / 500m = 12 splits
  var targetTime = T6k * Math.pow(targetDist / 6000, 1.07);
  return targetTime / (targetDist / 500);
}

function _svgSplitChart(ttLogs) {
  var W = 460, H = 190;
  var PL = 38, PR = 12, PT = 14, PB = 28;
  var IW = W - PL - PR, IH = H - PT - PB;

  var sorted = ttLogs.slice().sort(function(a, b) { return a.date.localeCompare(b.date); });
  var points = [];
  sorted.forEach(function(e) {
    var s6 = _parseSplitSecs(e.split);
    if (!s6 || s6 <= 0) return;
    points.push({
      date: e.date,
      s6k: s6,
      s5k: _predictSplit(s6, 5000),
      s2k: _predictSplit(s6, 2000),
      s1k: _predictSplit(s6, 1000)
    });
  });

  if (points.length === 0) {
    return '<div style="text-align:center;padding:28px 0;font-size:12px;color:var(--txl)">No 6k time trials logged yet — complete a first-Saturday TT to start tracking.</div>';
  }

  // Y range across all four lines, with padding
  var allVals = [];
  points.forEach(function(p) { allVals.push(p.s6k, p.s5k, p.s2k, p.s1k); });
  var dataMin = Math.min.apply(null, allVals);
  var dataMax = Math.max.apply(null, allVals);
  var pad = Math.max((dataMax - dataMin) * 0.15, 4);
  var yMin = dataMin - pad;
  var yMax = dataMax + pad;

  // Lower sec/500m = faster = higher on chart
  function yPos(v) { return PT + ((v - yMin) / (yMax - yMin)) * IH; }
  function xPos(i) {
    return points.length === 1 ? PL + IW / 2 : PL + (i / (points.length - 1)) * IW;
  }

  // Y-axis ticks at round 5-sec intervals
  var range = yMax - yMin;
  var interval = range <= 25 ? 5 : range <= 50 ? 10 : 15;
  var tickStart = Math.ceil(yMin / interval) * interval;
  var gridLines = [];
  for (var tick = tickStart; tick <= yMax; tick += interval) {
    var gy = yPos(tick);
    gridLines.push(
      '<line x1="' + PL + '" y1="' + gy.toFixed(1) + '" x2="' + (PL + IW) + '" y2="' + gy.toFixed(1) + '" stroke="#e8edf2" stroke-width="1"/>',
      '<text x="' + (PL - 5) + '" y="' + (gy + 3).toFixed(1) + '" font-size="8" fill="#9aabb8" text-anchor="end">' + _fmtSplit(tick) + '</text>'
    );
  }

  // Line + dots builder
  function series(key, color) {
    var path = points.map(function(p, i) {
      return (i === 0 ? 'M' : 'L') + xPos(i).toFixed(1) + ',' + yPos(p[key]).toFixed(1);
    }).join(' ');
    var dotsHtml = points.map(function(p, i) {
      return '<circle cx="' + xPos(i).toFixed(1) + '" cy="' + yPos(p[key]).toFixed(1) + '" r="3.5" fill="' + color + '" stroke="white" stroke-width="1.5"/>';
    }).join('');
    return '<path d="' + path + '" stroke="' + color + '" stroke-width="2" fill="none" stroke-linejoin="round" stroke-linecap="round"/>' + dotsHtml;
  }

  // X-axis date labels
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var xLabels = points.map(function(p, i) {
    var parts = p.date.split('-');
    var label = months[parseInt(parts[1]) - 1] + ' ' + parseInt(parts[2]);
    return '<text x="' + xPos(i).toFixed(1) + '" y="' + (PT + IH + 18) + '" font-size="8" fill="#6b7a8d" text-anchor="middle">' + label + '</text>';
  }).join('');

  // Border rect
  var border = '<rect x="' + PL + '" y="' + PT + '" width="' + IW + '" height="' + IH + '" fill="none" stroke="#e8edf2" stroke-width="1"/>';

  return [
    '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;display:block">',
    gridLines.join(''),
    border,
    series('s6k', '#1a8fbe'),
    series('s5k', '#2a9a5a'),
    series('s2k', '#c8864a'),
    series('s1k', '#c43030'),
    xLabels,
    '</svg>'
  ].join('');
}

// ---- Lift PR cards ------------------------------------------

function _renderPRSection(liftLogs) {
  var prs = {};
  liftLogs.forEach(function(entry) {
    (entry.exercises || []).forEach(function(ex) {
      var w = parseFloat(ex.weight);
      if (isNaN(w) || w <= 0) return;
      if (!prs[ex.exercise] || w > prs[ex.exercise].weight) {
        prs[ex.exercise] = { weight: w, reps: ex.reps, date: entry.date };
      }
    });
  });

  var keys = Object.keys(prs).sort();
  if (keys.length === 0) {
    return '<div class="tip" style="margin-top:4px"><h4>No lift PRs yet</h4><p>Log a strength session to see personal records here.</p></div>';
  }

  return '<div class="g3" style="margin-top:8px">' +
    keys.map(function(ex) {
      var pr = prs[ex];
      return '<div class="pr-card">' +
        '<div class="pr-ex">' + ex + '</div>' +
        '<div class="pr-val">' + pr.weight + ' lb</div>' +
        (pr.reps ? '<div class="pr-sub">' + pr.reps + ' reps</div>' : '') +
        '<div class="pr-date">' + fmtDate(pr.date) + '</div>' +
        '</div>';
    }).join('') +
    '</div>';
}

// ---- Summary strip (workout metrics only) -------------------

function _renderSummaryStrip(allLogs) {
  var liftCount = allLogs.filter(function(e) { return e._logType === 'lift'; }).length;
  var ergCount  = allLogs.filter(function(e) { return e._logType === 'erg';  }).length;
  var runCount  = allLogs.filter(function(e) { return e._logType === 'run';  }).length;

  var totalMeters = 0;
  allLogs.filter(function(e) { return e._logType === 'erg'; }).forEach(function(e) {
    totalMeters += parseFloat(e.distance) || 0;
  });
  var totalKm = totalMeters >= 1000 ? (totalMeters / 1000).toFixed(0) + 'k' : (totalMeters > 0 ? totalMeters + '' : '—');

  var now = new Date(); now.setHours(0, 0, 0, 0);
  var sunStr = new Date(now); sunStr.setDate(now.getDate() - now.getDay());
  var wsStr  = sunStr.toISOString().slice(0, 10);
  var thisWeek = allLogs.filter(function(e) {
    return (e._logType === 'lift' || e._logType === 'erg' || e._logType === 'run') && e.date >= wsStr;
  }).length;

  return '<div class="g2" style="margin-bottom:20px">' +
    '<div class="dash-stat"><div class="dash-stat-val">' + liftCount + '</div><div class="dash-stat-lbl">Lifts Logged</div></div>' +
    '<div class="dash-stat"><div class="dash-stat-val">' + ergCount  + '</div><div class="dash-stat-lbl">Erg Sessions</div></div>' +
    '<div class="dash-stat"><div class="dash-stat-val">' + runCount  + '</div><div class="dash-stat-lbl">Runs Logged</div></div>' +
    '<div class="dash-stat"><div class="dash-stat-val">' + totalKm   + '</div><div class="dash-stat-lbl">Meters Rowed</div></div>' +
    '<div class="dash-stat"><div class="dash-stat-val">' + thisWeek  + '</div><div class="dash-stat-lbl">Sessions This Week</div></div>' +
    '</div>';
}

// ---- Main entry point ---------------------------------------

function renderProgress() {
  var el = document.getElementById('prg-content');
  if (!el) return;

  var allLogs  = storage.readLogs();
  var liftLogs = allLogs.filter(function(e) { return e._logType === 'lift'; });
  var ttLogs   = allLogs.filter(function(e) { return e._logType === 'erg' && e.type === 'tt'; });

  el.innerHTML =
    _renderSummaryStrip(allLogs) +

    '<div class="sh"><h2>Training Frequency</h2><p>Sessions logged per week (last 10 weeks). <span style="color:#c8864a;font-weight:600">■</span> Lift &nbsp;<span style="color:#1a8fbe;font-weight:600">■</span> Erg &nbsp;<span style="color:#2a9a5a;font-weight:600">■</span> Run</p></div>' +
    '<div class="card" style="padding:14px 16px;margin-bottom:22px">' +
      _svgSessionChart(allLogs) +
    '</div>' +

    '<div class="sh"><h2>6k Time Trial — Pace Trend</h2>' +
      '<p>Actual 6k pace + estimated equivalents via Paul\'s Law (×1.07 exponent). ' +
      '<span style="color:#1a8fbe;font-weight:600">■</span> 6k &nbsp;' +
      '<span style="color:#2a9a5a;font-weight:600">■</span> 5k est. &nbsp;' +
      '<span style="color:#c8864a;font-weight:600">■</span> 2k est. &nbsp;' +
      '<span style="color:#c43030;font-weight:600">■</span> 1k est.</p>' +
    '</div>' +
    '<div class="card" style="padding:14px 16px;margin-bottom:22px">' +
      _svgSplitChart(ttLogs) +
    '</div>' +

    '<div class="sh"><h2>Lifting Records</h2><p>Heaviest weight logged per exercise.</p></div>' +
    _renderPRSection(liftLogs);
}
