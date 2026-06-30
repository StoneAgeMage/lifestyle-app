// ============================================================
// DASHBOARD — Today panel: date context, workout, meals,
//   weight, prep countdown, workout completion
// Depends on: engine.js (TrainingEngine, MealEngine),
//   calendar.js (getDayInfo), log.js (loadLifts, loadErgs,
//   fmtDate, todayStr, showToast), settings.js (loadSettings)
// All root IDs prefixed "td-" — no collision with other panels
// ============================================================

function loadWeights() {
  return storage.readLogs().filter(e => e._logType === 'weight');
}
function saveWeights(d) {
  const others = storage.readLogs().filter(e => e._logType !== 'weight');
  const tagged = d.map(e => Object.assign({}, e, {_logType: 'weight'}));
  storage.writeLogs([...tagged, ...others].sort((a, b) => (b.date || '').localeCompare(a.date || '')));
}

function loadCompletions() {
  return storage.readLogs().filter(e => e._logType === 'workoutCompletion');
}
function saveCompletions(d) {
  const others = storage.readLogs().filter(e => e._logType !== 'workoutCompletion');
  const tagged = d.map(e => Object.assign({}, e, {_logType: 'workoutCompletion'}));
  storage.writeLogs([...tagged, ...others].sort((a, b) => (b.date || '').localeCompare(a.date || '')));
}

// ---- Workout Completion -------------------------------------

function markWorkoutComplete() {
  const plan  = TRAINING_PLANS[ACTIVE_PLAN_ID];
  const today = new Date(); today.setHours(12, 0, 0, 0);
  const wf    = TrainingEngine.getWorkoutForDate(plan, today);
  if (!wf) return;

  const dateStr  = todayStr();
  const existing = loadCompletions();
  if (existing.some(function(c) { return c.date === dateStr && c.workoutId === wf.workoutId; })) return;

  existing.unshift({
    id:          Date.now(),
    date:        dateStr,
    workoutId:   wf.workoutId,
    completedAt: new Date().toISOString()
  });
  saveCompletions(existing);
  renderTodayWorkout();
  showToast('Workout marked complete ✓');
}

function unmarkWorkoutComplete() {
  const plan  = TRAINING_PLANS[ACTIVE_PLAN_ID];
  const today = new Date(); today.setHours(12, 0, 0, 0);
  const wf    = TrainingEngine.getWorkoutForDate(plan, today);
  if (!wf) return;

  const dateStr = todayStr();
  const filtered = loadCompletions().filter(function(c) {
    return !(c.date === dateStr && c.workoutId === wf.workoutId);
  });
  saveCompletions(filtered);
  renderTodayWorkout();
  showToast('Completion removed');
}

// ---- Date Context -------------------------------------------

function renderDateContext() {
  const el = document.getElementById('td-date-ctx');
  if (!el) return;

  const plan  = TRAINING_PLANS[ACTIVE_PLAN_ID];
  const today = new Date(); today.setHours(12, 0, 0, 0);
  const ctx   = TrainingEngine.getTodayContext(plan, today);

  const months  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const now     = new Date();
  const dateStr = months[now.getMonth()] + ' ' + now.getDate();

  if (!ctx) {
    el.innerHTML = '';
    return;
  }

  el.innerHTML = '';
}

// ---- Today's Workout ----------------------------------------

// Shared mobility exercise row
function _mobExHtml(ex) {
  var durStr = ex.duration >= 60 ? Math.round(ex.duration / 60) + ' min' : ex.duration + ' sec';
  if (ex.side && ex.side !== 'bilateral') durStr += '/' + ex.side;
  return '<div class="mob-exercise">' +
    '<div class="mob-ex-name"><span class="mob-ex-chip">' + durStr + '</span> ' + ex.name + '</div>' +
    '<div class="mob-ex-cue">' + ex.cue + '</div>' +
    '</div>';
}

// Render a plain-string item list
function _renderItemList(items) {
  if (!items || items.length === 0) return '';
  return items.map(function(item) {
    if (typeof item === 'string') {
      return '<div class="db-workout-item">' + item + '</div>';
    }
    return '<div class="modal-workout">' +
      '<div class="modal-workout-title">' + (item.t || '') + '</div>' +
      '<div class="modal-workout-detail">' + (item.d || '') + '</div>' +
      '</div>';
  }).join('');
}

// UT zone + BPM strip shown under the workout title
function _renderUtStrip(wf) {
  var BG_TO_IDX = { 'bg-z1': 0, 'bg-z2': 1, 'bg-at': 2, 'bg-vo2': 3, 'bg-spd': 4 };
  var idx = BG_TO_IDX[wf.workoutBg];
  if (idx === undefined) return '';
  var LABELS = ['UT2', 'UT1', 'AT', 'TR', 'AN'];
  var s = loadSettings();
  var zones = HREngine.getZones(s.age, s.knownMaxHR, s.restingHR, s.hrMode);
  var z = zones && zones[idx];
  var pctSuffix = z && z.mode === 'hrr' ? '% HRR' : '%';
  var text = z
    ? z.label + ' · ' + Math.round(z.minPct * 100) + '–' + Math.round(z.maxPct * 100) + pctSuffix + ' · ' + z.minBPM + '–' + z.maxBPM + ' bpm'
    : LABELS[idx];
  return '<div class="db-ut-strip">' + text + '</div>';
}

// Post-workout mobility — collapsible section inside the workout card
function _renderMobCard(wf) {
  if (!wf.mobilityBias) return '';
  var mob = TrainingEngine.getMobilityRoutine(wf);
  if (!mob || !mob.exercises) return '';
  return '<div class="mob-section">' +
    '<div class="mob-tile">' +
    '<button class="mob-toggle-btn" onclick="toggleMobility(this)">' +
      '<span>Post-workout mobility · 5 min</span><span class="mob-chevron">▾</span>' +
    '</button>' +
    '<div class="mob-toggle-body">' +
      mob.exercises.map(_mobExHtml).join('') +
    '</div>' +
    '</div>' +
    '</div>';
}

// Hybrid card (Tue/Thu/Sat): three-tab toggle — Erg | Club Practice | Run Fallback
function _renderHybridCard(wf, blockBadge, done) {
  var h   = wf.hybrid || {};
  var erg = h.erg     || {};
  var run = h.run     || {};

  var utStrip = _renderUtStrip(wf);

  var mob = _renderMobCard(wf);

  var ergPanel =
    '<div class="db-opt-panel active" id="db-panel-erg">' +
    '<div class="db-workout-body">' +
    (erg.name ? '<div class="db-opt-name">' + erg.name + '</div>' : '') +
    utStrip +
    _renderItemList(erg.items) +
    mob +
    '</div>' +
    '<div class="td-complete-row">' +
    '<button class="td-complete-btn" onclick="quickLogToday()">Log Erg</button>' +
    '</div></div>';

  var clubPanel =
    '<div class="db-opt-panel" id="db-panel-club">' +
    '<div class="db-workout-body db-club-form">' +
    '<p class="db-club-subtitle">Log your on-water club session</p>' +
    '<div class="db-club-field"><label>Meters Rowed</label>' +
    '<input type="number" id="club-meters" class="lf-input" placeholder="5000" min="0"></div>' +
    '<div class="db-club-field"><label>Effort Rating (1–10)</label>' +
    '<input type="number" id="club-rating" class="lf-input" placeholder="7" min="1" max="10"></div>' +
    '<div class="db-club-field"><label>Notes</label>' +
    '<input type="text" id="club-notes" class="lf-input" placeholder="What did you work on?"></div>' +
    '<button class="log-btn" style="margin-top:10px" onclick="saveClubLog()">Save Club Practice</button>' +
    '</div></div>';

  var runPanel =
    '<div class="db-opt-panel" id="db-panel-run">' +
    '<div class="db-workout-body">' +
    (run.name ? '<div class="db-opt-name">' + run.name + '</div>' : '') +
    utStrip +
    _renderItemList(run.items) +
    mob +
    '</div>' +
    '<div class="db-workout-body db-club-form" style="border-top:1px solid var(--s3)">' +
    '<p class="db-club-subtitle">Log this run</p>' +
    '<div class="db-club-field"><label>Distance</label>' +
    '<input type="text" id="run-dist" class="lf-input" placeholder="3.2 mi"></div>' +
    '<div class="db-club-field"><label>Time</label>' +
    '<input type="text" id="run-time" class="lf-input" placeholder="28:30"></div>' +
    '<div class="db-club-field"><label>Effort (1–10)</label>' +
    '<input type="number" id="run-effort" class="lf-input" placeholder="7" min="1" max="10"></div>' +
    '<div class="db-club-field"><label>Notes</label>' +
    '<input type="text" id="run-notes" class="lf-input" placeholder="How did it feel?"></div>' +
    '<button class="log-btn" style="margin-top:10px" onclick="saveRunLog()">Save Run</button>' +
    '</div></div>';

  var tabs =
    '<div class="db-opt-tabs">' +
    '<button class="db-opt-tab active" onclick="switchWorkoutTab(\'erg\')">Erg</button>' +
    '<button class="db-opt-tab" onclick="switchWorkoutTab(\'club\')">Club Practice</button>' +
    '<button class="db-opt-tab" onclick="switchWorkoutTab(\'run\')">Run</button>' +
    '</div>';

  return '<div class="card db-workout-card" style="margin-bottom:16px">' +
    '<div class="db-workout-header" style="background:var(--water)">' +
    '<span class="db-workout-badge">' + wf.workoutShort + '</span>' + blockBadge +
    (done ? '<span class="td-done-badge">✓ Done</span>' : '') +
    '</div>' +
    tabs + ergPanel + clubPanel + runPanel + '</div>';
}

// Lift card (Mon/Fri): two-tab toggle — Primary | Travel (Zero-Equipment)
function _renderLiftCard(wf, blockBadge, done) {
  var lift    = wf.lift    || {};
  var primary = lift.primary || {};
  var travel  = lift.travel  || {};

  function _exRows(exercises) {
    if (!exercises || exercises.length === 0) return '';
    return exercises.map(function(ex) {
      var setsReps = ex.sets + '×' + (ex.reps === 1 ? '—' : ex.reps);
      var safeN = ex.name.replace(/'/g, "\\'");
      var safeC = (ex.cue || '').replace(/'/g, "\\'");
      return '<div class="db-lift-ex">' +
        '<span class="db-ex-name db-ex-gif-btn" onclick="showExGif(\'' + safeN + '\',\'' + safeC + '\')">' + ex.name + '</span>' +
        '<span class="db-ex-sets">' + setsReps + '</span></div>' +
        (ex.cue ? '<div class="db-ex-cue">' + ex.cue + '</div>' : '');
    }).join('');
  }

  var liftMob = _renderMobCard(wf);

  var primaryPanel =
    '<div class="db-opt-panel active" id="db-panel-primary">' +
    '<div class="db-workout-body">' + _exRows(primary.exercises) + liftMob + '</div></div>';

  var travelPanel =
    '<div class="db-opt-panel" id="db-panel-travel">' +
    '<div class="db-workout-body">' +
    _exRows(travel.exercises) + liftMob + '</div></div>';

  var tabs =
    '<div class="db-opt-tabs">' +
    '<button class="db-opt-tab active" onclick="switchWorkoutTab(\'primary\')">' + (primary.label || 'Primary') + '</button>' +
    '<button class="db-opt-tab" onclick="switchWorkoutTab(\'travel\')">' + (travel.label || 'Bodyweight') + '</button>' +
    '</div>';

  var logBtns =
    '<div class="td-complete-row">' +
    '<button class="td-complete-btn" onclick="quickLogToday()">Log Lifts</button>' +
    '</div>';

  return '<div class="card db-workout-card" style="margin-bottom:16px">' +
    '<div class="db-workout-header" style="background:var(--water)">' +
    '<span class="db-workout-badge">' + wf.workoutShort + '</span>' + blockBadge +
    (done ? '<span class="td-done-badge">✓ Done</span>' : '') +
    '</div>' +
    tabs + primaryPanel + travelPanel +
    logBtns + '</div>';
}

function renderTodayWorkout() {
  const el = document.getElementById('td-workout');
  if (!el) return;

  const plan  = TRAINING_PLANS[ACTIVE_PLAN_ID];
  const today = new Date(); today.setHours(12, 0, 0, 0);
  const wf    = TrainingEngine.getWorkoutForDate(plan, today);

  if (!wf) {
    el.innerHTML =
      '<div class="card db-workout-card" style="margin-bottom:16px">' +
      '<div class="db-workout-header" style="background:var(--water)"><span class="db-workout-badge">Rest Day</span></div>' +
      '<div class="db-workout-body"><div class="tip" style="margin:0"><h4>Rest Day</h4>' +
      '<p>Active rest. Sleep, walk, eat well — recovery is where adaptation happens.</p></div></div></div>';
    return;
  }

  const done = loadCompletions().some(function(c) { return c.date === todayStr() && c.workoutId === wf.workoutId; });

  var _now     = new Date();
  var _dows    = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var _months  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var _dateStr = _dows[_now.getDay()] + ' ' + _months[_now.getMonth()] + ' ' + _now.getDate();
  var _blkStr  = wf.blockName
    ? wf.blockName + ' Wk ' + (wf.blockWeek + 1) + (wf.isDeload ? ' · Deload' : wf.isTaper ? ' · Taper' : '')
    : '';
  var blockBadge = '<span class="td-block-badge">' + _dateStr + (_blkStr ? ' · ' + _blkStr : '') + '</span>';

  if (wf.type === 'hybrid') { el.innerHTML = _renderHybridCard(wf, blockBadge, done); return; }
  if (wf.type === 'lift')   { el.innerHTML = _renderLiftCard(wf, blockBadge, done);   return; }

  // Restoration: mobility IS the workout, rendered inline
  var restoreBody = '';
  if (wf.type === 'restoration') {
    var restore = TrainingEngine.getRestorationRoutine();
    if (restore && restore.exercises) {
      restoreBody = '<div class="mob-inline-section">' +
        '<div class="mob-card-title">20-Min Deep Restoration</div>' +
        restore.exercises.map(_mobExHtml).join('') + '</div>';
    }
  }

  el.innerHTML =
    '<div class="card db-workout-card" style="margin-bottom:16px">' +
    '<div class="db-workout-header" style="background:var(--water)">' +
    '<span class="db-workout-badge">' + wf.workoutShort + '</span>' + blockBadge +
    (done ? '<span class="td-done-badge">✓ Done</span>' : '') +
    '</div>' +
    '<div class="db-workout-body">' +
    _renderItemList(wf.workoutItems) +
    restoreBody +
    '</div></div>';
}

function toggleMobility(btn) {
  var body    = btn.nextElementSibling;
  var chevron = btn.querySelector('.mob-chevron');
  var opening = body.style.display === 'none' || body.style.display === '';
  body.style.display    = opening ? 'block' : 'none';
  chevron.textContent   = opening ? '▴' : '▾';
}

// Tab switcher for hybrid and lift cards
function switchWorkoutTab(tab) {
  var allTabs   = document.querySelectorAll('.db-opt-tab');
  var allPanels = document.querySelectorAll('.db-opt-panel');
  allTabs.forEach(function(t) {
    var matches = (t.getAttribute('onclick') || '').indexOf("'" + tab + "'") >= 0;
    t.classList.toggle('active', matches);
  });
  allPanels.forEach(function(p) {
    p.classList.toggle('active', p.id === 'db-panel-' + tab);
  });
}

// Club practice log save
function saveClubLog() {
  var metersEl = document.getElementById('club-meters');
  var ratingEl = document.getElementById('club-rating');
  var notesEl  = document.getElementById('club-notes');
  var meters   = metersEl  ? (parseInt(metersEl.value)  || 0) : 0;
  var rating   = ratingEl  ? (parseInt(ratingEl.value)  || 0) : 0;
  var notes    = notesEl   ? (notesEl.value.trim() || '') : '';

  if (!meters && !notes) { showToast('Enter at least meters or notes'); return; }

  var logs = storage.readLogs();
  logs.unshift({ id: Date.now(), date: todayStr(), meters: meters, rating: rating, notes: notes, _logType: 'clubPractice' });
  storage.writeLogs(logs.sort(function(a, b) { return (b.date || '').localeCompare(a.date || ''); }));
  markWorkoutComplete();
  showToast('Club practice saved ✓');
}

// Run fallback log save
function saveRunLog() {
  var dist   = (document.getElementById('run-dist')   || {}).value || '';
  var time   = (document.getElementById('run-time')   || {}).value || '';
  var effort = (document.getElementById('run-effort') || {}).value || '';
  var notes  = (document.getElementById('run-notes')  || {}).value || '';

  if (!dist && !time && !notes) { showToast('Enter at least distance or time'); return; }

  var logs = storage.readLogs();
  logs.unshift({ id: Date.now(), date: todayStr(), dist: dist, time: time, effort: effort, notes: notes, _logType: 'run' });
  storage.writeLogs(logs.sort(function(a, b) { return (b.date || '').localeCompare(a.date || ''); }));
  ['run-dist','run-time','run-effort','run-notes'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.value = '';
  });
  markWorkoutComplete();
  showToast('Run saved ✓');
}

// ---- Meal Plan Nudge ----------------------------------------

function renderMealNudge() {
  var el = document.getElementById('td-meal-nudge');
  if (!el) return;

  if (typeof mpLoadWeekPlanForDate !== 'function') { el.innerHTML = ''; return; }

  var thisWeekMissing = !mpLoadWeekPlanForDate(new Date());
  var nextDate = new Date(); nextDate.setDate(nextDate.getDate() + 7);
  var nextWeekMissing = !mpLoadWeekPlanForDate(nextDate);

  if (!thisWeekMissing && !nextWeekMissing) { el.innerHTML = ''; return; }

  var msg, weekOffset;
  if (thisWeekMissing) {
    msg = 'No meal plan for this week';
    weekOffset = 0;
  } else {
    msg = 'No meal plan for next week';
    weekOffset = 1;
  }

  el.innerHTML =
    '<div class="td-nudge" onclick="switchToFuelTab(' + weekOffset + ')">' +
    '<span class="td-nudge-icon">⚠</span>' +
    '<span class="td-nudge-text">' + msg + '</span>' +
    '<span class="td-nudge-cta">Plan now →</span>' +
    '</div>';
}

// ---- Today's Meals ------------------------------------------

function renderTodayMeals() {
  const el = document.getElementById('td-meals');
  if (!el) return;

  const plan  = TRAINING_PLANS[ACTIVE_PLAN_ID];
  const today = new Date(); today.setHours(12, 0, 0, 0);
  const wf    = TrainingEngine.getWorkoutForDate(plan, today);

  if (!wf) {
    el.innerHTML =
      '<div class="card">' +
      '<div class="td-section-title">Today\'s Meals</div>' +
      '<div class="tip" style="margin:0"><p>Rest day — eat well, sleep well.</p></div>' +
      '</div>';
    return;
  }

  var meals = MealEngine.getMealsForDate(plan, today, wf);

  if (typeof mpEnrichMeals === 'function' && typeof mpLoadWeekPlanForDate === 'function') {
    var weekPlan = mpLoadWeekPlanForDate(today);
    if (weekPlan && weekPlan.recipeIds && weekPlan.recipeIds.length > 0) {
      meals = mpEnrichMeals(meals, weekPlan, today.getDay());
    }
  }

  el.innerHTML =
    '<div class="card">' +
    '<div class="td-section-title">Today\'s Meals</div>' +
    (meals.length === 0
      ? '<div class="tip" style="margin:0"><p>No meal plan set. <a href="#" onclick="switchToFuelTab(0);return false">Set it in Fuel →</a></p></div>'
      : meals.map(function(m) {
          return '<div class="modal-meal">' +
            '<span class="modal-meal-type">' + m.type + '</span>' +
            '<div>' +
            '<div class="modal-meal-name' + (m.recipeId ? ' mp-recipe-link' : '') + '"' + (m.recipeId ? ' onclick="openRecipeModal(\'' + m.recipeId + '\')"' : '') + '>' + m.name + '</div>' +
            '<div class="modal-meal-desc">' + m.desc + '</div>' +
            (m.link ? '<div class="modal-meal-link"><a href="' + m.link + '" target="_blank" rel="noopener">🔗 Recipe</a></div>' : '') +
            '</div></div>';
        }).join('')
    ) +
    '</div>';
}

// ---- Weight Summary -----------------------------------------

function renderWeightSummary() {
  const el = document.getElementById('td-weight');
  if (!el) return;

  const s       = loadSettings();
  const unit    = s.weightUnit;
  const goal    = s.goalWeight;
  const weights = loadWeights().sort(function(a, b) { return b.date.localeCompare(a.date); });
  const latest  = weights[0];
  const current = latest ? parseFloat(latest.weight) : null;
  const diff    = current !== null ? +(current - goal).toFixed(1) : null;
  const diffStr  = diff !== null ? (diff > 0 ? '+' + diff : String(diff)) + ' ' + unit : '—';
  const diffColor = diff !== null && diff <= 0 ? 'var(--grn)' : 'var(--acc)';

  el.innerHTML =
    '<div class="card">' +
    '<div class="td-section-title">Weight</div>' +
    '<div class="db-weight-row">' +
    '<div class="db-weight-stat"><div class="db-weight-val">' + (current !== null ? current + ' ' + unit : '—') + '</div><div class="db-weight-lbl">Current</div></div>' +
    '<div class="db-weight-stat"><div class="db-weight-val">' + goal + ' ' + unit + '</div><div class="db-weight-lbl">Goal</div></div>' +
    '<div class="db-weight-stat"><div class="db-weight-val" style="color:' + diffColor + '">' + diffStr + '</div><div class="db-weight-lbl">To Goal</div></div>' +
    '</div>' +
    (latest
      ? '<div style="font-family:\'DM Mono\',monospace;font-size:9px;color:var(--txl);margin-top:6px">Last logged: ' + fmtDate(latest.date) + '</div>'
      : '<div style="font-family:\'DM Mono\',monospace;font-size:9px;color:var(--txl);margin-top:6px">No weight logged yet</div>'
    ) +
    '<div class="db-weight-form">' +
    '<input type="number" id="td-weight-input" class="lf-input" placeholder="Log weight (' + unit + ')" step="0.1" min="50" max="500" style="flex:1;min-width:0">' +
    '<button class="log-btn" onclick="logWeight()">Log</button>' +
    '</div>' +
    '</div>';
}

function logWeight() {
  const input = document.getElementById('td-weight-input');
  const val   = parseFloat(input.value);
  if (!input.value || isNaN(val) || val < 50 || val > 500) {
    showToast('Enter a valid weight (lb)');
    return;
  }
  const data = loadWeights();
  data.unshift({ id: Date.now(), date: todayStr(), weight: val });
  saveWeights(data);
  input.value = '';
  renderWeightSummary();
  showToast('Weight logged ✓');
}


// ---- Quick Log Shortcut ------------------------------------

function quickLogToday() {
  var plan  = TRAINING_PLANS[ACTIVE_PLAN_ID];
  var today = new Date(); today.setHours(12, 0, 0, 0);
  var wf    = TrainingEngine.getWorkoutForDate(plan, today);
  if (!wf) return;

  var detailsId, formSetup;

  if (wf.type === 'lift') {
    detailsId = 'td-log-lift';
    formSetup = function() {
      var sessionEl = document.getElementById('lf-session');
      if (sessionEl && wf.logSession) {
        sessionEl.value = wf.logSession;
        if (typeof buildExerciseRows === 'function') buildExerciseRows();
      }
    };
  } else {
    detailsId = 'td-log-erg';
    formSetup = function() {
      var typeEl = document.getElementById('ef-type');
      if (typeEl) {
        var bgToType = {
          'bg-z1': 'z1', 'bg-z2': 'z2', 'bg-at': 'at',
          'bg-vo2': 'vo2', 'bg-spd': 'spd', 'bg-restore': 'recovery'
        };
        typeEl.value = bgToType[wf.workoutBg] || 'z1';
        if (typeof updateErgFields === 'function') updateErgFields();
      }
    };
  }

  var details = document.getElementById(detailsId);
  if (details) {
    details.open = true;
    formSetup();
    details.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ---- Init ---------------------------------------------------

function initToday() {
  renderDateContext();
  renderMealNudge();
  renderTodayWorkout();
  renderTodayMeals();
}
