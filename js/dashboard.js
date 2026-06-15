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
    el.innerHTML = '<div class="td-ctx"><span>' + dateStr + '</span></div>';
    return;
  }

  el.innerHTML =
    '<div class="td-ctx">' +
    '<span>' + ctx.dowName + ', ' + dateStr + '</span>' +
    '<span class="td-ctx-sep">·</span>' +
    '<span>' + ctx.blockDisplay + '</span>' +
    '</div>';
}

// ---- Today's Workout ----------------------------------------

function renderTodayWorkout() {
  const el = document.getElementById('td-workout');
  if (!el) return;

  const plan  = TRAINING_PLANS[ACTIVE_PLAN_ID];
  const today = new Date(); today.setHours(12, 0, 0, 0);
  const wf    = TrainingEngine.getWorkoutForDate(plan, today);

  if (!wf) {
    el.innerHTML =
      '<div class="card db-workout-card" style="margin-bottom:16px">' +
      '<div class="db-workout-header bg-rest"><span class="db-workout-badge">Rest Day</span></div>' +
      '<div class="db-workout-body"><div class="tip" style="margin:0"><h4>Rest Day</h4><p>Sundays are full rest. Sleep, walk, eat well. Recovery is where the adaptation happens.</p></div></div>' +
      '</div>';
    return;
  }

  const done = loadCompletions().some(function(c) { return c.date === todayStr() && c.workoutId === wf.workoutId; });

  // Mobility card — post-workout 5-min or restoration card
  var mobilityHtml = '';
  if (wf.type === 'restoration') {
    var restore = TrainingEngine.getRestorationRoutine();
    if (restore) {
      mobilityHtml = '<div class="mob-card">' +
        '<div class="mob-card-title">20-Min Deep Restoration</div>' +
        restore.exercises.map(function(ex) {
          var durStr = ex.duration >= 60 ? Math.round(ex.duration / 60) + ' min' : ex.duration + ' sec';
          if (ex.side && ex.side !== 'bilateral') durStr += ' · ' + ex.side;
          return '<div class="mob-exercise">' +
            '<div class="mob-ex-dur">' + durStr + '</div>' +
            '<div><div class="mob-ex-name">' + ex.name + '</div>' +
            '<div class="mob-ex-cue">' + ex.cue + '</div></div>' +
            '</div>';
        }).join('') +
        '</div>';
    }
  } else if (wf.mobilityBias) {
    var mob = TrainingEngine.getMobilityRoutine(wf);
    if (mob) {
      mobilityHtml = '<div class="mob-card">' +
        '<div class="mob-card-title">Post-Workout · 5 Min Mobility</div>' +
        mob.exercises.map(function(ex) {
          var durStr = ex.duration >= 60 ? Math.round(ex.duration / 60) + ' min' : ex.duration + ' sec';
          if (ex.side && ex.side !== 'bilateral') durStr += ' · ' + ex.side;
          return '<div class="mob-exercise">' +
            '<div class="mob-ex-dur">' + durStr + '</div>' +
            '<div><div class="mob-ex-name">' + ex.name + '</div>' +
            '<div class="mob-ex-cue">' + ex.cue + '</div></div>' +
            '</div>';
        }).join('') +
        '</div>';
    }
  }

  var blockBadge = wf.blockName ? '<span class="td-block-badge">' + wf.blockName + (wf.isDeload ? ' · Deload' : wf.isTaper ? ' · Taper' : '') + '</span>' : '';

  el.innerHTML =
    '<div class="card db-workout-card" style="margin-bottom:16px">' +
    '<div class="db-workout-header ' + wf.workoutBg + '">' +
    '<span class="db-workout-badge">' + wf.workoutShort + '</span>' +
    blockBadge +
    (done ? '<span class="td-done-badge">✓ Done</span>' : '') +
    '</div>' +
    '<div class="db-workout-body">' +
    wf.workoutItems.map(function(item) {
      return '<div class="modal-workout">' +
        '<div class="modal-workout-title">' + item.t + '</div>' +
        '<div class="modal-workout-detail">' + item.d + '</div>' +
        '</div>';
    }).join('') +
    mobilityHtml +
    '</div>' +
    '<div class="td-complete-row">' +
      (done
        ? '<button class="td-done-text" onclick="unmarkWorkoutComplete()">✓ Done</button>'
        : '<button class="td-complete-btn" onclick="markWorkoutComplete()">Mark Complete</button>'
      ) +
      (wf.type !== 'restoration' ? '<button class="td-log-btn" onclick="quickLogToday()">Log Session →</button>' : '') +
    '</div>' +
    '</div>';
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

  if (wf.workoutBg === 'bg-lift') {
    detailsId = 'td-log-lift';
    formSetup = function() {
      var sessionEl = document.getElementById('lf-session');
      if (sessionEl && wf.type === 'lift') {
        // Use logSession from the workout definition if available
        var wkData = WORKOUT_LIBRARY[wf.workoutId];
        if (wkData && wkData.logSession) sessionEl.value = wkData.logSession;
        else { var sessionMap = {1:'A', 3:'B'}; if (sessionMap[wf.dow]) sessionEl.value = sessionMap[wf.dow]; }
        if (typeof buildExerciseRows === 'function') buildExerciseRows();
      }
    };
  } else {
    detailsId = 'td-log-erg';
    formSetup = function() {
      var typeEl = document.getElementById('ef-type');
      if (typeEl) {
        // Map new block-era bg classes → erg log type values
        var bgToType = {
          'bg-z1':'z1', 'bg-z2':'z2', 'bg-at':'at',
          'bg-vo2':'vo2', 'bg-spd':'spd',
          'bg-end':'endurance', 'bg-speed':'speed', 'bg-rest':'recovery'
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
