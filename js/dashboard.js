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
    '<span>' + ctx.cuisineName + ' Week</span>' +
    '<span class="td-ctx-sep">·</span>' +
    '<span>Pete Wk ' + ctx.peteWeekDisplay + '</span>' +
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
      '<div class="db-workout-body"><div class="tip" style="margin:0"><h4>Plan begins June 7, 2026</h4><p>No workout scheduled for today. Come back on June 7.</p></div></div>' +
      '</div>';
    return;
  }

  const done = loadCompletions().some(function(c) { return c.date === todayStr() && c.workoutId === wf.workoutId; });

  el.innerHTML =
    '<div class="card db-workout-card" style="margin-bottom:16px">' +
    '<div class="db-workout-header ' + wf.workoutBg + '">' +
    '<span class="db-workout-badge">' + wf.workoutShort + '</span>' +
    (done ? '<span class="td-done-badge">✓ Done</span>' : '') +
    '</div>' +
    '<div class="db-workout-body">' +
    wf.workoutItems.map(function(item) {
      return '<div class="modal-workout">' +
        '<div class="modal-workout-title">' + item.t + '</div>' +
        '<div class="modal-workout-detail">' + item.d + '</div>' +
        '</div>';
    }).join('') +
    '</div>' +
    '<div class="td-complete-row">' +
      (done
        ? '<span class="td-done-text">✓ Done</span>'
        : '<button class="td-complete-btn" onclick="markWorkoutComplete()">Mark Complete</button>'
      ) +
      '<button class="td-log-btn" onclick="quickLogToday()">Log Session →</button>' +
    '</div>' +
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
      '<div class="tip" style="margin:0"><h4>No meal plan set for this week</h4><p>Meal plan begins June 7, 2026.</p></div>' +
      '</div>';
    return;
  }

  var meals = MealEngine.getMealsForDate(plan, today, wf);

  // Enrich dinner names from the user's weekly plan selection when available
  if (typeof mpEnrichMeals === 'function' && typeof mpLoadCurrentWeekPlan === 'function') {
    var weekPlan = mpLoadCurrentWeekPlan();
    if (weekPlan && weekPlan.recipeIds && weekPlan.recipeIds.length > 0) {
      meals = mpEnrichMeals(meals, weekPlan, today.getDay());
    }
  }

  el.innerHTML =
    '<div class="card">' +
    '<div class="td-section-title">Today\'s Meals</div>' +
    (meals.length === 0
      ? '<div class="tip" style="margin:0"><p>No meal plan set for this week.</p></div>'
      : meals.map(function(m) {
          return '<div class="modal-meal">' +
            '<span class="modal-meal-type">' + m.type + '</span>' +
            '<div>' +
            '<div class="modal-meal-name">' + m.name + '</div>' +
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

// ---- Meal Prep Countdown ------------------------------------

function renderMealPrepCountdown() {
  const el = document.getElementById('td-prep');
  if (!el) return;

  const prepDay  = loadSettings().mealPrepDay;
  const now      = new Date(); now.setHours(0, 0, 0, 0);
  const dow      = now.getDay();
  const daysLeft = dow === prepDay ? 0 : (prepDay - dow + 7) % 7;
  const dayName  = DOW_NAMES[prepDay];

  const label = daysLeft === 0 ? 'Today' : daysLeft === 1 ? '1 day' : daysLeft + ' days';
  const sub   = daysLeft === 0
    ? dayName + ' — meal prep day! ~2 hrs. See Fuel tab.'
    : daysLeft === 1
      ? 'Tomorrow (' + dayName + ') — pick up groceries today.'
      : 'Until ' + dayName + ' meal prep.';

  el.innerHTML =
    '<div class="card">' +
    '<div class="td-section-title">Next Meal Prep</div>' +
    '<div class="dash-stat-val" style="font-size:36px;line-height:1;margin-bottom:4px">' + label + '</div>' +
    '<div class="dash-stat-lbl" style="text-align:left;letter-spacing:.5px">' + sub + '</div>' +
    '</div>';
}

// ---- Quick Log Shortcut ------------------------------------

function quickLogToday() {
  var plan  = TRAINING_PLANS[ACTIVE_PLAN_ID];
  var today = new Date(); today.setHours(12, 0, 0, 0);
  var wf    = TrainingEngine.getWorkoutForDate(plan, today);
  if (!wf) return;

  var progressBtn = document.getElementById('tab-progress');
  if (progressBtn) showPanel('progress', progressBtn);

  if (wf.workoutBg === 'bg-lift') {
    var liftTab = document.getElementById('pg-tab-lift');
    if (liftTab) showCycle(2, liftTab);
    var sessionEl = document.getElementById('lf-session');
    if (sessionEl) {
      var sessionMap = {1:'A', 3:'B', 5:'C'};
      var val = sessionMap[wf.dow];
      if (val) {
        sessionEl.value = val;
        if (typeof buildExerciseRows === 'function') buildExerciseRows();
      }
    }
  } else {
    var ergTab = document.getElementById('pg-tab-erg');
    if (ergTab) showCycle(3, ergTab);
    var typeEl = document.getElementById('ef-type');
    if (typeEl) {
      if      (wf.workoutBg === 'bg-end')   typeEl.value = 'endurance';
      else if (wf.workoutBg === 'bg-speed') typeEl.value = 'speed';
      else if (wf.workoutBg === 'bg-rest')  typeEl.value = 'recovery';
      else                                  typeEl.value = 'water';
      if (typeof updateErgFields === 'function') updateErgFields();
    }
  }
  window.scrollTo(0, 0);
}

// ---- Init ---------------------------------------------------

function initToday() {
  renderDateContext();
  renderTodayWorkout();
  renderTodayMeals();
  renderWeightSummary();
  renderMealPrepCountdown();
}
