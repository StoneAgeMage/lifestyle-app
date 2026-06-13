// ============================================================
// CALENDAR — 2-week rolling plan view + day detail modal
// Depends on: engine.js (TrainingEngine, MealEngine),
//   TRAINING_PLANS, ACTIVE_PLAN_ID
// ============================================================

var _PW_DOW    = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var _PW_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function renderPlanWeeks() {
  var el = document.getElementById('plan-weeks');
  if (!el) return;

  var plan     = TRAINING_PLANS[ACTIVE_PLAN_ID];
  var todayD   = new Date(); todayD.setHours(0, 0, 0, 0);

  var weekStart = new Date(todayD);
  weekStart.setDate(todayD.getDate() - todayD.getDay()); // back to Sunday

  var legend = _buildLegend();

  var weeks = ['This Week', 'Next Week'].map(function(label, wi) {
    var ws = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + wi * 7);
    var we = new Date(ws.getFullYear(), ws.getMonth(), ws.getDate() + 6);

    var rangeStr = _PW_MONTHS[ws.getMonth()] + ' ' + ws.getDate() +
                   '–' + _PW_MONTHS[we.getMonth()] + ' ' + we.getDate();

    var dows = _PW_DOW.map(function(d) {
      return '<div class="pw-dow">' + d + '</div>';
    }).join('');

    var days = '';
    for (var i = 0; i < 7; i++) {
      var date    = new Date(ws.getFullYear(), ws.getMonth(), ws.getDate() + i, 12);
      var isToday = date.toDateString() === todayD.toDateString();
      var wf      = TrainingEngine.getWorkoutForDate(plan, date);

      if (!wf) {
        days += '<div class="pw-day pw-noplan"><span class="pw-num pw-num-dim">' + date.getDate() + '</span></div>';
        continue;
      }

      var meals = MealEngine.getMealsForDate(plan, date, wf);
      if (typeof mpLoadWeekPlanForDate === 'function' && typeof mpEnrichMeals === 'function') {
        var wp = mpLoadWeekPlanForDate(date);
        if (wp) meals = mpEnrichMeals(meals, wp, date.getDay());
      }
      var mealRows = ['Breakfast','Lunch','Dinner'].map(function(type) {
        var m = meals.find(function(x) { return x.type === type; });
        if (!m) return '';
        var abbr = type[0]; // B / L / D
        return '<div class="pw-meal"><span class="pw-meal-abbr">' + abbr + '</span>' + m.name + '</div>';
      }).join('');

      days +=
        '<div class="pw-day' + (isToday ? ' pw-today' : '') + '"' +
        ' onclick="openModal(' + date.getFullYear() + ',' + date.getMonth() + ',' + date.getDate() + ')">' +
        '<span class="pw-num">' + date.getDate() + '</span>' +
        '<span class="pw-badge ' + wf.workoutBg + '">' + wf.workoutShort + '</span>' +
        '<div class="pw-meals">' + mealRows + '</div>' +
        '</div>';
    }

    return '<div class="pw-section">' +
      '<div class="pw-label">' + label + '<span class="pw-range">' + rangeStr + '</span></div>' +
      '<div class="pw-grid">' + dows + days + '</div>' +
      '</div>';
  }).join('');

  el.innerHTML = legend + weeks;
}

function _buildLegend() {
  return '<div class="pw-legend">' +
    [['bg-lift','Lift'],['bg-z1','Z1 Easy'],['bg-z2','Z2 Moderate'],
     ['bg-at','Threshold'],['bg-vo2','VO2max'],['bg-spd','Speed'],
     ['bg-restore','Restore']].map(function(x) {
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
    (meal ? ' · ' + meal.cuisine + ' Week · Pete Wk ' + (wf.peteWeek + 1) : '');
  document.getElementById('m-dow').textContent = dowNames[date.getDay()];

  document.getElementById('m-workout').innerHTML = wf.workoutItems.map(function(item) {
    return '<div class="modal-workout">' +
      '<div class="modal-workout-title">' + item.t + '</div>' +
      '<div class="modal-workout-detail">' + item.d + '</div>' +
    '</div>';
  }).join('');

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
