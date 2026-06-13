// ============================================================
// LOG — lifting and erg session saving, form management
// History rendering and CSV export moved out in Phase 8.
// ============================================================

// Session exercises are loaded dynamically from WORKOUT_LIBRARY when available,
// falling back to these defaults if the session ID can't be resolved.
const sessionExercises = {
  A: ['DB Romanian Deadlift','DB Pendlay Row','Ring Row (feet elevated)','DB Hip Thrust','Ring Ab Fallout'],
  B: ['Bulgarian Split Squat (DBs)','Single-Leg Romanian Deadlift','Ring Push-up (feet elevated)','Copenhagen Plank','Single-Arm DB Row']
};

const timeBasedEx = new Set(['Copenhagen Plank','Plank','Dead Bug','Side Plank','Hollow Body Hold','Ring Ab Fallout']);

const ergTypeLabels = {
  z1:'Zone 1 Easy', z2:'Zone 2 Moderate', at:'Threshold',
  vo2:'VO2max', spd:'Speed', cross:'Cross-Training', recovery:'Recovery'
};

const ergTypeBg = {
  z1:       'background:linear-gradient(135deg,#1a3a5c,#2a6090)',
  z2:       'background:linear-gradient(135deg,#1a4a6a,#2a80b0)',
  at:       'background:linear-gradient(135deg,#6a3010,#c05a18)',
  vo2:      'background:linear-gradient(135deg,#7a1010,#c02020)',
  spd:      'background:linear-gradient(135deg,#4a1a7a,#8a30c0)',
  cross:    'background:linear-gradient(135deg,#2a6a3a,#4a9a5a)',
  recovery: 'background:linear-gradient(135deg,#5a6070,#8a9bb0)',
  // Legacy keys kept for backward compat with old log entries
  endurance:'background:linear-gradient(135deg,#1a4070,#2a5aaa)',
  speed:    'background:linear-gradient(135deg,#8b2020,#c43030)',
  steady:   'background:linear-gradient(135deg,var(--wm),var(--wl))',
  water:    'background:linear-gradient(135deg,#1a6b8f,#0a4f6e)'
};

// ---- Storage helpers ----

function loadLifts() {
  return storage.readLogs().filter(e => e._logType === 'lift');
}
function saveLifts(d) {
  const others = storage.readLogs().filter(e => e._logType !== 'lift');
  const tagged = d.map(e => Object.assign({}, e, {_logType: 'lift'}));
  storage.writeLogs([...tagged, ...others].sort((a, b) => (b.date || '').localeCompare(a.date || '')));
}
function loadErgs() {
  return storage.readLogs().filter(e => e._logType === 'erg');
}
function saveErgs(d) {
  const others = storage.readLogs().filter(e => e._logType !== 'erg');
  const tagged = d.map(e => Object.assign({}, e, {_logType: 'erg'}));
  storage.writeLogs([...tagged, ...others].sort((a, b) => (b.date || '').localeCompare(a.date || '')));
}

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

// ---- Toast ----

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

// ---- Lift form ----

function _getExercisesForSession(session) {
  // Try to resolve from today's actual workout in WORKOUT_LIBRARY
  if (typeof TRAINING_PLANS !== 'undefined' && typeof TrainingEngine !== 'undefined' && typeof WORKOUT_LIBRARY !== 'undefined') {
    var plan  = TRAINING_PLANS[ACTIVE_PLAN_ID];
    var today = new Date(); today.setHours(12, 0, 0, 0);
    var wf    = TrainingEngine.getWorkoutForDate(plan, today);
    if (wf && wf.type === 'lift') {
      var wkData = WORKOUT_LIBRARY[wf.workoutId];
      if (wkData && wkData.exercises && wkData.exercises.length > 0) return wkData.exercises;
    }
    // If session letter matches a block's logSession, find it
    var blockWks = Object.values(WORKOUT_LIBRARY).filter(function(w) {
      return w.type === 'lift' && w.logSession === session && w.exercises && w.exercises.length > 0;
    });
    if (blockWks.length > 0) return blockWks[0].exercises;
  }
  return sessionExercises[session] || [];
}

function buildExerciseRows() {
  const sessionEl  = document.getElementById('lf-session');
  const container  = document.getElementById('lf-exercises');
  if (!sessionEl || !container) return;
  const session    = sessionEl.value;
  const exercises  = _getExercisesForSession(session);

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

  if (!date) { showToast('Please select a date.'); return; }

  const exercises = _getExercisesForSession(session);
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

  const details = document.getElementById('td-log-lift');
  if (details) details.open = false;

  showToast('Lifting session saved ✓');
}

// ---- Erg form ----

function updateErgFields() {
  const type        = document.getElementById('ef-type');
  const subGroup    = document.getElementById('ef-subtype-group');
  const repsRow     = document.getElementById('ef-reps-row');
  const crossRow    = document.getElementById('ef-cross-row');
  const metricsRow  = document.getElementById('ef-metrics-row');
  const subSel      = document.getElementById('ef-subtype');
  if (!type) return;

  const t = type.value;
  // Show interval sub-selector for interval session types
  const isInterval = (t === 'at' || t === 'vo2' || t === 'spd');
  subGroup.style.display   = isInterval ? '' : 'none';
  repsRow.style.display    = isInterval ? '' : 'none';
  crossRow.style.display   = (t === 'cross') ? '' : 'none';
  metricsRow.style.display = (t === 'cross') ? 'none' : '';

  if (t === 'at') {
    subSel.innerHTML =
      '<option value="4x10">4 × 10 min</option>' +
      '<option value="3x15">3 × 15 min</option>' +
      '<option value="30min">30-Min Steady</option>' +
      '<option value="ftp20">20-Min FTP Test</option>';
  } else if (t === 'vo2') {
    subSel.innerHTML =
      '<option value="5x4">5 × 4 min</option>' +
      '<option value="6x3">6 × 3 min</option>';
  } else if (t === 'spd') {
    subSel.innerHTML =
      '<option value="6x500">6 × 500m</option>' +
      '<option value="4x2min">4 × 2 min Race Pace</option>' +
      '<option value="8x500">8 × 500m</option>';
  }
}

function saveErg() {
  const date = document.getElementById('ef-date').value;
  const type = document.getElementById('ef-type').value;
  if (!date) { showToast('Please select a date.'); return; }

  const subtype  = (['at','vo2','spd','endurance','speed'].includes(type)) ? document.getElementById('ef-subtype').value : '';
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
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });

  const details = document.getElementById('td-log-erg');
  if (details) details.open = false;

  showToast('Rowing session saved ✓');
}

// ---- Init ----

function initLogs() {
  var lfd = document.getElementById('lf-date');
  var efd = document.getElementById('ef-date');
  if (lfd) lfd.value = todayStr();
  if (efd) efd.value = todayStr();
  buildExerciseRows();
  var sessionEl = document.getElementById('lf-session');
  if (sessionEl) sessionEl.addEventListener('change', buildExerciseRows);
  updateErgFields();
}
