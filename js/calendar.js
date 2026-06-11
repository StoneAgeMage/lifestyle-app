// ============================================================
// CALENDAR — month view, day modal, workout+meal logic
// Phase 6: fully engine-driven — getDayInfo() removed,
// hard date bounds removed; floor clamps to plan start.
// Depends on: engine.js (TrainingEngine, MealEngine),
//   TRAINING_PLANS, ACTIVE_PLAN_ID
// ============================================================

var currentYear = 2026, currentMonth = 5; // initialized to plan start (June)

function renderCalendar() {
  var monthNames  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var dowLabels   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var plan        = TRAINING_PLANS[ACTIVE_PLAN_ID];

  document.getElementById('cal-title').textContent = monthNames[currentMonth] + ' ' + currentYear;

  var firstDay    = new Date(currentYear, currentMonth, 1).getDay();
  var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  var html = dowLabels.map(function(d) { return '<div class="cal-dow">' + d + '</div>'; }).join('');
  for (var i = 0; i < firstDay; i++) html += '<div class="cal-day empty"></div>';

  for (var d = 1; d <= daysInMonth; d++) {
    var date = new Date(currentYear, currentMonth, d, 12);
    var wf   = TrainingEngine.getWorkoutForDate(plan, date);

    if (!wf) {
      html += '<div class="cal-day empty" style="background:rgba(255,255,255,0.4)">' +
        '<div class="cal-num" style="color:var(--txl)">' + d + '</div></div>';
      continue;
    }

    var meal        = MealEngine.buildMealObject(plan, wf.mealWeekIndex);
    var meals       = MealEngine.getMealsForDate(plan, date, wf);
    var dinnerItem  = meals.find(function(m) { return m.type === 'Dinner' || m.type === 'Prep'; });
    var cuisineLabel = meal
      ? '<span style="font-size:9px;font-weight:500;color:var(--oard);display:block;margin-top:1px">' + meal.cuisine + '</span>'
      : '';
    var dinnerLabel = dinnerItem
      ? '<div class="cal-meal-name">' + dinnerItem.name + '</div>'
      : '';

    html += '<div class="cal-day" onclick="openModal(' + currentYear + ',' + currentMonth + ',' + d + ')">' +
      '<div class="cal-num">' + d + '</div>' +
      '<span class="cal-workout ' + wf.workoutBg + '">' + wf.workoutShort + '</span>' +
      cuisineLabel +
      dinnerLabel +
    '</div>';
  }

  document.getElementById('cal-grid').innerHTML = html;
}

function changeMonth(dir) {
  currentMonth += dir;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  if (currentMonth < 0)  { currentMonth = 11; currentYear--; }
  // Floor: don't navigate before plan start
  var start = new Date(TRAINING_PLANS[ACTIVE_PLAN_ID].startDate);
  if (currentYear < start.getFullYear() ||
     (currentYear === start.getFullYear() && currentMonth < start.getMonth())) {
    currentYear  = start.getFullYear();
    currentMonth = start.getMonth();
  }
  renderCalendar();
}

function openModal(y, m, d) {
  var date  = new Date(y, m, d, 12);
  var plan  = TRAINING_PLANS[ACTIVE_PLAN_ID];
  var wf    = TrainingEngine.getWorkoutForDate(plan, date);
  if (!wf) return;

  var meal  = MealEngine.buildMealObject(plan, wf.mealWeekIndex);
  var meals = MealEngine.getMealsForDate(plan, date, wf);

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
        '<div class="modal-meal-name">' + ml.name + '</div>' +
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
