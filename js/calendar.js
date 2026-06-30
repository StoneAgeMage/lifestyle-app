// ============================================================
// CALENDAR — 2-week rolling plan view + day detail modal
// Depends on: engine.js (TrainingEngine, MealEngine),
//   TRAINING_PLANS, ACTIVE_PLAN_ID
// ============================================================

var _PW_DOW    = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var _PW_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

var _pwOffset = -1; // index of first visible day relative to today (default: today centered)

function pwShift(n) {
  _pwOffset += n;
  renderPlanWeeks();
}

function pwGoToday() {
  _pwOffset = -1;
  renderPlanWeeks();
}

function renderPlanWeeks() {
  var el = document.getElementById('plan-weeks');
  if (!el) return;

  var plan   = TRAINING_PLANS[ACTIVE_PLAN_ID];
  var todayD = new Date(); todayD.setHours(0, 0, 0, 0);

  var loggedDates = new Set(
    storage.readLogs()
      .filter(function(e) { return e._logType === 'erg' || e._logType === 'lift' || e._logType === 'run' || e._logType === 'clubPractice'; })
      .map(function(e) { return e.date; })
  );

  // 3-day window
  var dates = [0, 1, 2].map(function(i) {
    var d = new Date(todayD);
    d.setDate(todayD.getDate() + _pwOffset + i);
    d.setHours(12, 0, 0, 0);
    return d;
  });

  var first = dates[0], last = dates[2];
  var rangeLabel = _PW_MONTHS[first.getMonth()] + ' ' + first.getDate() +
    ' – ' + _PW_MONTHS[last.getMonth()] + ' ' + last.getDate();

  var cards = dates.map(function(date) {
    var isToday  = date.toDateString() === todayD.toDateString();
    var dateKey  = date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');
    var isLogged = loggedDates.has(dateKey);
    var wf       = TrainingEngine.getWorkoutForDate(plan, date);

    var dowHtml = '<div class="pw-3d-dow">' + _PW_DOW[date.getDay()] + '</div>';
    var numHtml = '<div class="pw-3d-num">' + date.getDate() + '</div>';

    if (!wf) {
      return '<div class="pw-3day-card pw-3day-noplan' + (isToday ? ' pw-today' : '') + '">' +
        dowHtml + numHtml +
        '<div class="pw-3d-rest">Rest</div>' +
        '</div>';
    }

    var meals = MealEngine.getMealsForDate(plan, date, wf);
    if (typeof mpLoadWeekPlanForDate === 'function' && typeof mpEnrichMeals === 'function') {
      var wp = mpLoadWeekPlanForDate(date);
      if (wp) meals = mpEnrichMeals(meals, wp, date.getDay());
    }

    var mealRows = ['Breakfast', 'Lunch', 'Dinner'].map(function(type) {
      var m = meals.find(function(x) { return x.type === type; });
      if (!m) return '';
      return '<div class="pw-3d-meal"><span class="pw-3d-meal-abbr">' + type[0] + '</span>' + m.name + '</div>';
    }).join('');

    return '<div class="pw-3day-card' + (isToday ? ' pw-today' : '') + '"' +
      ' onclick="openModal(' + date.getFullYear() + ',' + date.getMonth() + ',' + date.getDate() + ')">' +
      dowHtml + numHtml +
      '<span class="pw-badge pw-3d-badge ' + wf.workoutBg + '">' + wf.workoutShort + '</span>' +
      '<div class="pw-3d-meals">' + mealRows + '</div>' +
      (isLogged ? '<div class="pw-3d-done">&#10003; Done</div>' : '') +
      '</div>';
  }).join('');

  var rangeRow = '<div class="pw-3day-range-row"><span class="pw-3day-range">' + rangeLabel + '</span></div>';

  var wrap = '<div class="pw-3day-wrap">' +
    '<button class="pw-nav-btn" onclick="pwShift(-1)">&#8249;</button>' +
    '<div class="pw-3day-grid">' + cards + '</div>' +
    '<button class="pw-nav-btn" onclick="pwShift(1)">&#8250;</button>' +
    '</div>';

  var footer = '<div class="pw-3day-footer"><button class="pw-today-btn" onclick="pwGoToday()">Today</button></div>';

  el.innerHTML = _buildLegend() + rangeRow + wrap + footer;
}

function _buildLegend() {
  return '<div class="pw-legend">' +
    [['bg-lift','Lift A/B'],['bg-z1','UT2'],['bg-z2','UT1'],
     ['bg-at','AT'],['bg-vo2','TR'],['bg-spd','Speed'],
     ['bg-restore','Recovery']].map(function(x) {
      return '<div class="pw-leg"><span class="pw-leg-dot ' + x[0] + '"></span>' + x[1] + '</div>';
    }).join('') +
    '</div>';
}

// ---- Day detail modal ---------------------------------------

function openModal(y, m, d) {
  var date  = new Date(y, m, d, 12);
  var plan  = TRAINING_PLANS[ACTIVE_PLAN_ID];
  var wf    = TrainingEngine.getWorkoutForDate(plan, date);
  if (!wf) return;

  var meal  = MealEngine.buildMealObject(plan, wf.mealWeekIndex);
  var meals = MealEngine.getMealsForDate(plan, date, wf);
  if (typeof mpLoadWeekPlanForDate === 'function' && typeof mpEnrichMeals === 'function') {
    var wp = mpLoadWeekPlanForDate(date);
    if (wp) meals = mpEnrichMeals(meals, wp, date.getDay());
  }

  var dowNames   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  document.getElementById('m-date').textContent =
    monthNames[m] + ' ' + d + ', ' + y +
    ' · ' + wf.blockName + ' Wk ' + (wf.blockWeek + 1);
  document.getElementById('m-dow').textContent = dowNames[date.getDay()];

  // Build workout section — workoutItems are plain strings in the new format
  var workoutHtml = '';
  if (wf.type === 'hybrid' && wf.hybrid && wf.hybrid.erg) {
    workoutHtml += (wf.hybrid.erg.items || []).map(function(s) {
      return '<div class="db-workout-item">' + s + '</div>';
    }).join('');
  } else if (wf.type === 'lift' && wf.lift && wf.lift.primary) {
    workoutHtml += '<div class="modal-workout-label">Strength</div>';
    workoutHtml += (wf.lift.primary.items || []).map(function(s) {
      return '<div class="db-workout-item">' + s + '</div>';
    }).join('');
  } else {
    workoutHtml = (wf.workoutItems || []).map(function(item) {
      if (typeof item === 'string') return '<div class="db-workout-item">' + item + '</div>';
      return '<div class="modal-workout">' +
        '<div class="modal-workout-title">' + (item.t || '') + '</div>' +
        '<div class="modal-workout-detail">' + (item.d || '') + '</div></div>';
    }).join('');
  }
  document.getElementById('m-workout').innerHTML = workoutHtml;

  document.getElementById('m-meals').innerHTML = meals.map(function(ml) {
    return '<div class="modal-meal">' +
      '<span class="modal-meal-type">' + ml.type + '</span>' +
      '<div>' +
        '<div class="modal-meal-name' + (ml.recipeId ? ' mp-recipe-link' : '') + '"' + (ml.recipeId ? ' onclick="openRecipeModal(\'' + ml.recipeId + '\')"' : '') + '>' + ml.name + '</div>' +
        '<div class="modal-meal-desc">' + ml.desc + '</div>' +
        (ml.link ? '<div class="modal-meal-link"><a href="' + ml.link + '" target="_blank" rel="noopener">🔗 Recipe</a></div>' : '') +
      '</div>' +
    '</div>';
  }).join('');

  document.getElementById('modal').classList.add('open');
}

function closeModal(e) {
  if (e.target === document.getElementById('modal')) closeModalDirect();
}

function closeModalDirect() {
  document.getElementById('modal').classList.remove('open');
}
