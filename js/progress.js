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
    weeks.push({ label: (ws.getMonth() + 1) + '/' + ws.getDate(), lift: liftCount, erg: ergCount });
  }

  var maxTotal = Math.max.apply(null, weeks.map(function(w) { return w.lift + w.erg; })) || 1;
  var barSlot  = IW / NUM_WEEKS;
  var barW     = barSlot * 0.68;

  if (weeks.every(function(w) { return w.lift + w.erg === 0; })) {
    return '<div style="text-align:center;padding:24px 0;font-size:12px;color:#6b7a8d">No sessions logged yet — frequency chart will appear here.</div>';
  }

  var bars = weeks.map(function(wk, i) {
    var x      = PL + i * barSlot + (barSlot - barW) / 2;
    var total  = wk.lift + wk.erg;
    var liftH  = (wk.lift / maxTotal) * IH;
    var ergH   = (wk.erg  / maxTotal) * IH;
    var liftY  = PT + IH - liftH;
    var ergY   = liftY - ergH;

    return [
      wk.erg  > 0 ? '<rect x="' + x.toFixed(1) + '" y="' + ergY.toFixed(1)  + '" width="' + barW.toFixed(1) + '" height="' + ergH.toFixed(1)  + '" fill="#1a8fbe" rx="3"/>' : '',
      wk.lift > 0 ? '<rect x="' + x.toFixed(1) + '" y="' + liftY.toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + liftH.toFixed(1) + '" fill="#c8864a" rx="3"/>' : '',
      total   > 0 ? '<text x="' + (x + barW / 2).toFixed(1) + '" y="' + (Math.min(liftY, ergY) - 3).toFixed(1) + '" font-size="8.5" fill="#3d4a5c" text-anchor="middle" font-weight="600">' + total + '</text>' : '',
      '<text x="' + (x + barW / 2).toFixed(1) + '" y="' + (PT + IH + 13) + '" font-size="7.5" fill="#6b7a8d" text-anchor="middle">' + wk.label + '</text>'
    ].join('');
  }).join('');

  return [
    '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;display:block">',
    bars,
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

  var totalMeters = 0;
  allLogs.filter(function(e) { return e._logType === 'erg'; }).forEach(function(e) {
    totalMeters += parseFloat(e.distance) || 0;
  });
  var totalKm = totalMeters >= 1000 ? (totalMeters / 1000).toFixed(0) + 'k' : (totalMeters > 0 ? totalMeters + '' : '—');

  var now = new Date(); now.setHours(0, 0, 0, 0);
  var sunStr = new Date(now); sunStr.setDate(now.getDate() - now.getDay());
  var wsStr  = sunStr.toISOString().slice(0, 10);
  var thisWeek = allLogs.filter(function(e) {
    return (e._logType === 'lift' || e._logType === 'erg') && e.date >= wsStr;
  }).length;

  return '<div class="g2" style="margin-bottom:20px">' +
    '<div class="dash-stat"><div class="dash-stat-val">' + liftCount + '</div><div class="dash-stat-lbl">Lifts Logged</div></div>' +
    '<div class="dash-stat"><div class="dash-stat-val">' + ergCount  + '</div><div class="dash-stat-lbl">Erg Sessions</div></div>' +
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

  el.innerHTML =
    _renderSummaryStrip(allLogs) +

    '<div class="sh"><h2>Training Frequency</h2><p>Sessions logged per week (last 10 weeks). <span style="color:#c8864a;font-weight:600">■</span> Lift &nbsp;<span style="color:#1a8fbe;font-weight:600">■</span> Erg</p></div>' +
    '<div class="card" style="padding:14px 16px;margin-bottom:22px">' +
      _svgSessionChart(allLogs) +
    '</div>' +

    '<div class="sh"><h2>Lifting Records</h2><p>Heaviest weight logged per exercise.</p></div>' +
    _renderPRSection(liftLogs);
}
