// ============================================================
// LOG — lifting log, erg log, dashboard, localStorage persistence
// No external data dependencies
// ============================================================

const LIFT_KEY = 'rowing_lift_log_v1';
const ERG_KEY  = 'rowing_erg_log_v1';

const sessionExercises = {
  A: ['Ring Rows','DB Romanian Deadlift','Goblet Squat','Ring Push-ups','Pallof Press','Plank'],
  B: ['DB Bent-Over Row','Ring Dips','DB Reverse Lunge (ea)','Face Pulls','Dead Bug','Side Plank'],
  C: ['Ring Push-ups','DB Single-Arm Row (ea)','DB Lateral Raises','DB Bicep Curls','Ring Tricep Dips','Hollow Body Hold']
};

const timeBasedEx = new Set(['Plank','Dead Bug','Side Plank','Hollow Body Hold','Ring Push-ups','Ring Dips','Ring Rows','Face Pulls','Pallof Press']);

const ergTypeLabels = {
  endurance:'Pete Endurance', speed:'Pete Speed', steady:'Steady State',
  water:'On Water', recovery:'Recovery Erg', cross:'Cross-Training'
};

const ergTypeBg = {
  endurance:'background:linear-gradient(135deg,#1a4070,#2a5aaa)',
  speed:'background:linear-gradient(135deg,#8b2020,#c43030)',
  steady:'background:linear-gradient(135deg,var(--wm),var(--wl))',
  water:'background:linear-gradient(135deg,#1a6b8f,#0a4f6e)',
  recovery:'background:linear-gradient(135deg,#5a6070,#8a9bb0)',
  cross:'background:linear-gradient(135deg,#2a6a3a,#4a9a5a)'
};

// ---- Storage helpers ----
function loadLifts()  { try { return JSON.parse(localStorage.getItem(LIFT_KEY)) || []; } catch(e) { return []; } }
function saveLifts(d) { localStorage.setItem(LIFT_KEY, JSON.stringify(d)); }
function loadErgs()   { try { return JSON.parse(localStorage.getItem(ERG_KEY))  || []; } catch(e) { return []; } }
function saveErgs(d)  { localStorage.setItem(ERG_KEY, JSON.stringify(d)); }

// ---- Date helpers ----
function todayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

function fmtDate(str) {
  if (!str) return '';
  const [y,m,d] = str.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[parseInt(m)-1] + ' ' + parseInt(d) + ', ' + y;
}

// ---- LIFT LOG ----

function buildExerciseRows() {
  const sessionEl  = document.getElementById('lf-session');
  const container  = document.getElementById('lf-exercises');
  if (!sessionEl || !container) return;
  const session    = sessionEl.value;
  const exercises  = sessionExercises[session] || [];

  let html = `<div class="ex-header">
    <span>Exercise</span><span>Sets</span><span>Reps / Time</span><span>Weight (lb)</span><span>Notes</span>
  </div>`;

  exercises.forEach((ex, i) => {
    const isTimed = timeBasedEx.has(ex);
    html += `<div class="exercise-row">
      <div class="ex-name">${ex}</div>
      <input class="ex-input" type="number" id="ex-sets-${i}" placeholder="3" min="1" max="10">
      <input class="ex-input" type="text"   id="ex-reps-${i}" placeholder="${isTimed ? '45s' : '8'}">
      <input class="ex-input" type="number" id="ex-wt-${i}"   placeholder="${isTimed ? '—' : '40'}" ${isTimed ? 'style="color:var(--txl)"' : ''}>
      <input class="ex-input" type="text"   id="ex-note-${i}" placeholder="—">
    </div>`;
  });

  container.innerHTML = html;
}

function saveLifting() {
  const date    = document.getElementById('lf-date').value;
  const session = document.getElementById('lf-session').value;
  const notes   = document.getElementById('lf-notes').value.trim();

  if (!date) { alert('Please select a date.'); return; }

  const exercises = sessionExercises[session];
  const sets = [];
  exercises.forEach((ex, i) => {
    const s = document.getElementById(`ex-sets-${i}`).value;
    const r = document.getElementById(`ex-reps-${i}`).value;
    const w = document.getElementById(`ex-wt-${i}`).value;
    const n = document.getElementById(`ex-note-${i}`).value;
    if (s || r || w) sets.push({ exercise: ex, sets: s, reps: r, weight: w, note: n });
  });

  const entry = { id: Date.now(), date, session, exercises: sets, notes };
  const data  = loadLifts();
  data.unshift(entry);
  saveLifts(data);

  document.getElementById('lf-notes').value = '';
  exercises.forEach((_, i) => {
    ['sets','reps','wt','note'].forEach(f => {
      const el = document.getElementById(`ex-${f}-${i}`);
      if (el) el.value = '';
    });
  });

  renderLiftHistory();
  renderDashboard();
  showToast('Lifting session saved ✓');
}

function deleteLift(id) {
  if (!confirm('Delete this entry?')) return;
  saveLifts(loadLifts().filter(e => e.id !== id));
  renderLiftHistory();
  renderDashboard();
}

function renderLiftHistory() {
  const data      = loadLifts();
  const container = document.getElementById('lift-history');
  const countEl   = document.getElementById('lift-count');
  countEl.textContent = data.length + ' session' + (data.length !== 1 ? 's' : '') + ' logged';

  if (data.length === 0) {
    container.innerHTML = '<div class="tip"><h4>No sessions yet</h4><p>Fill in the form above and hit Save Session to start tracking.</p></div>';
    return;
  }

  const sessionColors = {
    A:'background:linear-gradient(135deg,#4a3728,var(--oard))',
    B:'background:linear-gradient(135deg,#3a2838,#8b5a7b)',
    C:'background:linear-gradient(135deg,#1a3a5a,#2a6aaa)'
  };

  container.innerHTML = data.slice(0, 30).map(e => `
    <div class="log-entry">
      <div class="le-header">
        <span class="le-date">${fmtDate(e.date)}</span>
        <span class="le-type" style="${sessionColors[e.session]||''}">Strength ${e.session}</span>
        ${e.notes ? `<span class="le-notes">${e.notes}</span>` : ''}
        <button class="le-delete" onclick="deleteLift(${e.id})">✕</button>
      </div>
      <div class="le-exercises">
        ${(e.exercises||[]).map(ex => `
          <div class="le-ex">
            <strong>${ex.exercise}</strong>
            ${ex.sets ? ex.sets+'×' : ''}${ex.reps ? ex.reps : ''}
            ${ex.weight && ex.weight !== 'BW' ? ' @ '+ex.weight+'lb' : ex.weight === 'BW' ? ' BW' : ''}
            ${ex.note ? ' · '+ex.note : ''}
          </div>`).join('')}
      </div>
    </div>`).join('');
}

function exportLifting() {
  const data = loadLifts();
  if (data.length === 0) { alert('No data to export yet.'); return; }
  const rows = [['Date','Session','Exercise','Sets','Reps','Weight (lb)','Note','Session Notes']];
  data.forEach(e => {
    if (!e.exercises || e.exercises.length === 0) {
      rows.push([e.date, 'Strength '+e.session, '', '', '', '', '', e.notes||'']);
    } else {
      e.exercises.forEach(ex => {
        rows.push([e.date, 'Strength '+e.session, ex.exercise, ex.sets||'', ex.reps||'', ex.weight||'', ex.note||'', e.notes||'']);
      });
    }
  });
  downloadCSV(rows, 'lifting_log.csv');
}

function clearLifting() {
  if (!confirm('Delete ALL lifting entries? This cannot be undone.')) return;
  saveLifts([]);
  renderLiftHistory();
  renderDashboard();
}

// ---- ERG LOG ----

function updateErgFields() {
  const type        = document.getElementById('ef-type').value;
  const subGroup    = document.getElementById('ef-subtype-group');
  const repsRow     = document.getElementById('ef-reps-row');
  const crossRow    = document.getElementById('ef-cross-row');
  const metricsRow  = document.getElementById('ef-metrics-row');
  const subSel      = document.getElementById('ef-subtype');

  subGroup.style.display   = (type === 'endurance') ? '' : 'none';
  repsRow.style.display    = (type === 'endurance' || type === 'speed') ? '' : 'none';
  crossRow.style.display   = (type === 'cross') ? '' : 'none';
  metricsRow.style.display = (type === 'cross') ? 'none' : '';

  if (type === 'speed') {
    subGroup.style.display = '';
    subSel.innerHTML = `
      <option value="8x500">8 × 500m</option>
      <option value="pyramid">Speed Pyramid</option>
      <option value="4x1000">4 × 1000m</option>`;
  } else if (type === 'endurance') {
    subSel.innerHTML = `
      <option value="5x1500">5 × 1500m</option>
      <option value="4x2000">4 × 2000m</option>
      <option value="3k-2.5k-2k">3k / 2.5k / 2k</option>`;
  }
}

function saveErg() {
  const date = document.getElementById('ef-date').value;
  const type = document.getElementById('ef-type').value;
  if (!date) { alert('Please select a date.'); return; }

  const subtype  = (['endurance','speed'].includes(type)) ? document.getElementById('ef-subtype').value : '';
  const dist     = document.getElementById('ef-dist').value;
  const time     = document.getElementById('ef-time').value.trim();
  const split    = document.getElementById('ef-split').value.trim();
  const rate     = document.getElementById('ef-rate').value;
  const reps     = document.getElementById('ef-reps').value.trim();
  const target   = document.getElementById('ef-target').value.trim();
  const activity = document.getElementById('ef-activity').value.trim();
  const duration = document.getElementById('ef-duration').value.trim();
  const hr       = document.getElementById('ef-hr').value;
  const notes    = document.getElementById('ef-notes').value.trim();

  const entry = { id: Date.now(), date, type, subtype, dist, time, split, rate, reps, target, activity, duration, hr, notes };
  const data  = loadErgs();
  data.unshift(entry);
  saveErgs(data);

  ['ef-dist','ef-time','ef-split','ef-rate','ef-reps','ef-target','ef-activity','ef-duration','ef-hr','ef-notes']
    .forEach(id => { document.getElementById(id).value = ''; });

  renderErgHistory();
  renderDashboard();
  showToast('Rowing session saved ✓');
}

function deleteErg(id) {
  if (!confirm('Delete this entry?')) return;
  saveErgs(loadErgs().filter(e => e.id !== id));
  renderErgHistory();
  renderDashboard();
}

function renderErgHistory() {
  const data      = loadErgs();
  const container = document.getElementById('erg-history');
  const countEl   = document.getElementById('erg-count');
  countEl.textContent = data.length + ' session' + (data.length !== 1 ? 's' : '') + ' logged';

  if (data.length === 0) {
    container.innerHTML = '<div class="tip"><h4>No sessions yet</h4><p>Fill in the form above and hit Save Session to start tracking.</p></div>';
    return;
  }

  container.innerHTML = data.slice(0, 30).map(e => `
    <div class="log-entry">
      <div class="le-header">
        <span class="le-date">${fmtDate(e.date)}</span>
        <span class="le-type" style="${ergTypeBg[e.type]||''}">${ergTypeLabels[e.type]||e.type}${e.subtype?' · '+e.subtype:''}</span>
        ${e.notes ? `<span class="le-notes">${e.notes}</span>` : ''}
        <button class="le-delete" onclick="deleteErg(${e.id})">✕</button>
      </div>
      <div class="le-metrics">
        ${e.dist     ? `<div class="le-metric"><div class="le-metric-val">${parseInt(e.dist).toLocaleString()}</div><div class="le-metric-lbl">Meters</div></div>` : ''}
        ${e.time     ? `<div class="le-metric"><div class="le-metric-val">${e.time}</div><div class="le-metric-lbl">Time</div></div>` : ''}
        ${e.split    ? `<div class="le-metric"><div class="le-metric-val">${e.split}</div><div class="le-metric-lbl">Avg Split</div></div>` : ''}
        ${e.rate     ? `<div class="le-metric"><div class="le-metric-val">${e.rate}</div><div class="le-metric-lbl">Stroke Rate</div></div>` : ''}
        ${e.target   ? `<div class="le-metric"><div class="le-metric-val">${e.target}</div><div class="le-metric-lbl">Target Split</div></div>` : ''}
        ${e.activity ? `<div class="le-metric"><div class="le-metric-val" style="font-size:14px">${e.activity}</div><div class="le-metric-lbl">Activity</div></div>` : ''}
        ${e.duration ? `<div class="le-metric"><div class="le-metric-val" style="font-size:16px">${e.duration}</div><div class="le-metric-lbl">Duration</div></div>` : ''}
      </div>
      ${e.reps ? `<div style="font-size:11px;color:var(--txl);margin-top:6px;font-weight:300"><strong style="color:var(--txm)">Rep splits:</strong> ${e.reps}</div>` : ''}
    </div>`).join('');
}

function exportErg() {
  const data = loadErgs();
  if (data.length === 0) { alert('No data to export yet.'); return; }
  const rows = [['Date','Type','Subtype','Distance (m)','Time','Avg Split /500m','Stroke Rate','Rep Splits','Target Split','Activity','Duration','HR/Notes','Session Notes']];
  data.forEach(e => {
    rows.push([e.date, ergTypeLabels[e.type]||e.type, e.subtype||'', e.dist||'', e.time||'', e.split||'', e.rate||'', e.reps||'', e.target||'', e.activity||'', e.duration||'', e.hr||'', e.notes||'']);
  });
  downloadCSV(rows, 'erg_rowing_log.csv');
}

function clearErg() {
  if (!confirm('Delete ALL rowing entries? This cannot be undone.')) return;
  saveErgs([]);
  renderErgHistory();
  renderDashboard();
}

// ---- DASHBOARD ----

function splitToSeconds(s) {
  if (!s || !s.includes(':')) return Infinity;
  const parts = s.split(':');
  return parseInt(parts[0]) * 60 + parseFloat(parts[1]);
}

function renderDashboard() {
  const lifts      = loadLifts();
  const ergs       = loadErgs();
  const dashContent = document.getElementById('dash-content');
  const dashEmpty   = document.getElementById('dash-empty');

  if (lifts.length === 0 && ergs.length === 0) {
    dashContent.style.display = 'none';
    dashEmpty.style.display   = '';
    return;
  }
  dashContent.style.display = '';
  dashEmpty.style.display   = 'none';

  const totalErg    = ergs.reduce((s, e) => s + (parseInt(e.dist)||0), 0);
  const liftSessions = lifts.length;
  const ergSessions  = ergs.length;
  const lastLift = lifts[0] ? fmtDate(lifts[0].date) : '—';
  const lastErg  = ergs[0]  ? fmtDate(ergs[0].date)  : '—';

  document.getElementById('dash-stats').innerHTML = `
    <div class="dash-stat"><div class="dash-stat-val">${liftSessions}</div><div class="dash-stat-lbl">Lift Sessions</div></div>
    <div class="dash-stat"><div class="dash-stat-val">${ergSessions}</div><div class="dash-stat-lbl">Erg / Water Sessions</div></div>
    <div class="dash-stat"><div class="dash-stat-val">${(totalErg/1000).toFixed(1)}k</div><div class="dash-stat-lbl">Total Erg Meters</div></div>
    <div class="dash-stat"><div class="dash-stat-val" style="font-size:18px">${lastLift}</div><div class="dash-stat-lbl">Last Lift</div></div>
    <div class="dash-stat"><div class="dash-stat-val" style="font-size:18px">${lastErg}</div><div class="dash-stat-lbl">Last Row</div></div>`;

  // Lifting PRs
  const prMap = {};
  lifts.forEach(e => {
    (e.exercises||[]).forEach(ex => {
      const w = parseFloat(ex.weight);
      if (!isNaN(w) && w > 0) {
        if (!prMap[ex.exercise] || w > prMap[ex.exercise].weight) {
          prMap[ex.exercise] = { weight: w, reps: ex.reps, date: e.date };
        }
      }
    });
  });

  const prKeys = Object.keys(prMap);
  document.getElementById('dash-prs').innerHTML = prKeys.length === 0
    ? '<div class="tip" style="grid-column:1/-1"><h4>No weighted lifts logged yet</h4><p>Log some strength sessions to see personal records.</p></div>'
    : prKeys.sort().map(ex => `
      <div class="pr-card">
        <div class="pr-ex">${ex}</div>
        <div class="pr-val">${prMap[ex].weight} lb</div>
        <div class="pr-sub">${prMap[ex].reps ? prMap[ex].reps + ' reps' : ''}</div>
        <div class="pr-date">${fmtDate(prMap[ex].date)}</div>
      </div>`).join('');

  // Erg PRs
  const ergPR = {};
  ergs.forEach(e => {
    if (!e.split) return;
    const key  = e.type + (e.subtype ? '_' + e.subtype : '');
    const secs = splitToSeconds(e.split);
    if (!ergPR[key] || secs < splitToSeconds(ergPR[key].split)) {
      ergPR[key] = { split: e.split, dist: e.dist, date: e.date, label: (ergTypeLabels[e.type]||e.type) + (e.subtype?' · '+e.subtype:'') };
    }
  });

  const ergPRKeys = Object.keys(ergPR);
  document.getElementById('dash-erg-prs').innerHTML = ergPRKeys.length === 0
    ? '<div class="tip" style="grid-column:1/-1"><h4>No erg splits logged yet</h4><p>Log rowing sessions with split times to see best performances.</p></div>'
    : ergPRKeys.map(k => `
      <div class="pr-card">
        <div class="pr-ex">${ergPR[k].label}</div>
        <div class="pr-val">${ergPR[k].split}</div>
        <div class="pr-sub">/500m · ${ergPR[k].dist ? (parseInt(ergPR[k].dist)/1000).toFixed(1)+'k' : ''}</div>
        <div class="pr-date">Best: ${fmtDate(ergPR[k].date)}</div>
      </div>`).join('');

  // Recent sessions
  const combined = [
    ...lifts.map(e => ({ ...e, _kind: 'lift' })),
    ...ergs.map(e  => ({ ...e, _kind: 'erg'  }))
  ].sort((a,b) => b.date.localeCompare(a.date)).slice(0, 10);

  document.getElementById('dash-recent').innerHTML = combined.length === 0
    ? '<div class="tip"><h4>No sessions yet</h4><p>Log sessions to see recent activity here.</p></div>'
    : combined.map(e => {
      if (e._kind === 'lift') {
        return `<div class="log-entry">
          <div class="le-header">
            <span class="le-date">${fmtDate(e.date)}</span>
            <span class="le-type" style="background:linear-gradient(135deg,#4a3728,var(--oard))">Strength ${e.session}</span>
            <span class="le-notes">${(e.exercises||[]).length} exercises logged</span>
          </div></div>`;
      } else {
        return `<div class="log-entry">
          <div class="le-header">
            <span class="le-date">${fmtDate(e.date)}</span>
            <span class="le-type" style="${ergTypeBg[e.type]||''}">${ergTypeLabels[e.type]||e.type}</span>
            ${e.dist     ? `<span class="le-notes">${parseInt(e.dist).toLocaleString()}m${e.split?' · '+e.split+'/500m':''}</span>` : ''}
            ${e.activity ? `<span class="le-notes">${e.activity}</span>` : ''}
          </div></div>`;
      }
    }).join('');
}

// ---- CSV Download ----
function downloadCSV(rows, filename) {
  const csv = rows.map(r => r.map(cell => {
    const s = String(cell).replace(/"/g, '""');
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s;
  }).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ---- Toast notification ----
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--water);color:#fff;padding:10px 22px;border-radius:30px;font-size:12px;font-weight:500;font-family:DM Sans,sans-serif;box-shadow:0 4px 20px rgba(0,0,0,.25);z-index:9999;transition:opacity .3s';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  setTimeout(() => { t.style.opacity = '0'; }, 2200);
}

// ---- Init ----
function initLogs() {
  document.getElementById('lf-date').value = todayStr();
  document.getElementById('ef-date').value = todayStr();
  buildExerciseRows();
  document.getElementById('lf-session').addEventListener('change', buildExerciseRows);
  updateErgFields();
  renderLiftHistory();
  renderErgHistory();
  renderDashboard();
}
