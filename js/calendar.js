// ============================================================
// CALENDAR — 2-week rolling plan view + day detail modal
// Depends on: engine.js (TrainingEngine, MealEngine),
//   TRAINING_PLANS, ACTIVE_PLAN_ID
// ============================================================

var _PW_DOW    = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var _PW_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var _PW_ABBR   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

var _pwOffset = 0; // days from today currently viewed (0 = today)

function pwShift(n) {
  _pwOffset += n;
  renderPlanWeeks();
}

function pwGoToday() {
  _pwOffset = 0;
  renderPlanWeeks();
}

function pwJumpTo(offset) {
  _pwOffset = offset;
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

  // Currently viewed date
  var viewDate = new Date(todayD);
  viewDate.setDate(todayD.getDate() + _pwOffset);
  viewDate.setHours(12, 0, 0, 0);

  // ---- Week strip: Mon–Sun of the viewed week ----
  var viewDow = viewDate.getDay();
  var daysToMon = viewDow === 0 ? -6 : 1 - viewDow;
  var weekStart = new Date(viewDate);
  weekStart.setDate(viewDate.getDate() + daysToMon);
  weekStart.setHours(12, 0, 0, 0);

  var stripHtml = '<div class="pw-week-strip">';
  for (var i = 0; i < 7; i++) {
    var sd = new Date(weekStart);
    sd.setDate(weekStart.getDate() + i);
    var sdWf = TrainingEngine.getWorkoutForDate(plan, sd);
    var sdKey = sd.getFullYear() + '-' + String(sd.getMonth() + 1).padStart(2, '0') + '-' + String(sd.getDate()).padStart(2, '0');
    var sdOffset = Math.round((sd - todayD) / 86400000);
    var sdIsActive = sd.toDateString() === viewDate.toDateString();
    var sdIsToday  = sd.toDateString() === todayD.toDateString();
    var sdLogged   = loggedDates.has(sdKey);
    var dotBg      = sdWf ? sdWf.workoutBg : 'bg-restore';
    var cls = 'pw-strip-day' + (sdIsActive ? ' pw-strip-active' : '') + (sdIsToday ? ' pw-strip-today' : '');
    stripHtml +=
      '<div class="' + cls + '" onclick="pwJumpTo(' + sdOffset + ')">' +
        '<div class="pw-strip-abbr">' + _PW_ABBR[sd.getDay()] + '</div>' +
        '<div class="pw-strip-num">' + sd.getDate() + '</div>' +
        (sdLogged
          ? '<div class="pw-strip-check">✓</div>'
          : '<div class="pw-strip-dot ' + dotBg + '"></div>') +
      '</div>';
  }
  stripHtml += '</div>';

  // ---- Single main card ----
  var isToday  = viewDate.toDateString() === todayD.toDateString();
  var dateKey  = viewDate.getFullYear() + '-' +
    String(viewDate.getMonth() + 1).padStart(2, '0') + '-' +
    String(viewDate.getDate()).padStart(2, '0');
  var isLogged = loggedDates.has(dateKey);
  var wf       = TrainingEngine.getWorkoutForDate(plan, viewDate);

  var headerHtml =
    '<div class="pw-1d-dow">' + _PW_DOW[viewDate.getDay()] +
      (isToday ? '<span class="pw-1d-today-tag">Today</span>' : '') +
    '</div>' +
    '<div class="pw-1d-date">' + _PW_MONTHS[viewDate.getMonth()] + ' ' + viewDate.getDate() + '</div>';

  var bodyHtml;
  if (!wf) {
    bodyHtml = '<div class="pw-1d-rest">Rest Day</div>';
  } else {
    var meals = MealEngine.getMealsForDate(plan, viewDate, wf);
    if (typeof mpLoadWeekPlanForDate === 'function' && typeof mpEnrichMeals === 'function') {
      var wp = mpLoadWeekPlanForDate(viewDate);
      if (wp) meals = mpEnrichMeals(meals, wp, viewDate.getDay());
    }
    var mealRows = ['Breakfast','Lunch','Dinner'].map(function(type) {
      var m = meals.find(function(x) { return x.type === type; });
      if (!m) return '';
      return '<div class="pw-1d-meal"><span class="pw-1d-meal-lbl">' + type[0] + '</span>' + m.name + '</div>';
    }).join('');

    bodyHtml =
      '<span class="pw-badge pw-1d-badge ' + wf.workoutBg + '">' + wf.workoutShort + '</span>' +
      '<div class="pw-1d-meals">' + mealRows + '</div>';
  }

  var card =
    '<div class="pw-1day-card' + (isToday ? ' pw-today' : '') + '"' +
    (wf ? ' onclick="openModal(' + viewDate.getFullYear() + ',' + viewDate.getMonth() + ',' + viewDate.getDate() + ')"' : '') + '>' +
    (isLogged ? '<div class="pw-3d-done">&#10003; Done</div>' : '') +
    headerHtml + bodyHtml +
    '</div>';

  var wrap =
    '<div class="pw-1day-wrap">' +
      '<button class="pw-nav-btn" onclick="pwShift(-1)">&#8249;</button>' +
      card +
      '<button class="pw-nav-btn" onclick="pwShift(1)">&#8250;</button>' +
    '</div>';

  var footer = '<div class="pw-3day-footer"><button class="pw-today-btn" onclick="pwGoToday()">Today</button></div>';

  el.innerHTML = _buildLegend() + stripHtml + wrap + footer;
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
