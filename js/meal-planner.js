// ============================================================
// MEAL PLANNER — Phase 6 rewrite
// Week-aware: toggle between This Week and Next Week.
// Uses MealEngine.generateWeekPlan / confirmWeekPlan.
// Exposes: mpLoadWeekPlanForDate, mpEnrichMeals,
//   renderMealPlannerHome, initMealPlanner, mpSwitchWeek
// ============================================================

// ---- State --------------------------------------------------

var _mpWeekOffset          = 0;   // 0 = this week, 1 = next week
var _mpDraftPinnedIds      = [];  // session-only pin state for current draft
var _mpSessionExcludedIds  = [];  // recipes excluded from the current regen cycle

// ---- Week helpers -------------------------------------------

function _mpWeekStart(date) {
  var d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay()); // back to Sunday
  return d.toISOString().slice(0, 10);
}

function _mpViewingWeekStart() {
  var d = new Date();
  d.setDate(d.getDate() + _mpWeekOffset * 7);
  return _mpWeekStart(d);
}

function _mpViewingDate() {
  var d = new Date();
  if (_mpWeekOffset) d.setDate(d.getDate() + _mpWeekOffset * 7);
  return d;
}

function _mpPlanId(weekStart) {
  return 'wp_' + weekStart; // old date-keyed plan ID format (kept for compat)
}

function _mpFmtWeek(weekStart) {
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var d = new Date(weekStart + 'T12:00:00');
  return months[d.getMonth()] + ' ' + d.getDate();
}

// ---- Week toggle header -------------------------------------

function _mpWeekToggle() {
  return '<div class="mp-week-toggle">' +
    '<button class="mp-wk-btn' + (_mpWeekOffset === 0 ? ' active' : '') + '" onclick="mpSwitchWeek(0)">This Week</button>' +
    '<button class="mp-wk-btn' + (_mpWeekOffset === 1 ? ' active' : '') + '" onclick="mpSwitchWeek(1)">Next Week</button>' +
  '</div>';
}

function mpSwitchWeek(offset) {
  _mpWeekOffset         = offset;
  _mpDraftPinnedIds     = [];
  _mpSessionExcludedIds = [];
  renderMealPlannerHome();
}

// ---- Training plan access -----------------------------------

function _mpTrainPlan() {
  return (typeof TRAINING_PLANS !== 'undefined' && typeof ACTIVE_PLAN_ID !== 'undefined')
    ? TRAINING_PLANS[ACTIVE_PLAN_ID] : null;
}

// ---- Storage helpers ----------------------------------------

// Primary loader: prefers new index-keyed plan, falls back to old date-keyed plan.
function mpLoadWeekPlanForDate(date) {
  var tp = _mpTrainPlan();
  if (tp) {
    var np = MealEngine.getStoredWeekPlanForDate(tp, date);
    if (np) return np;
  }
  var weekStart = _mpWeekStart(date);
  var id = _mpPlanId(weekStart);
  return (storage.readWeekPlans() || []).find(function(p) { return p.id === id; }) || null;
}

function mpLoadCurrentWeekPlan() {
  return mpLoadWeekPlanForDate(new Date());
}

function _mpLoadViewingPlan() {
  return mpLoadWeekPlanForDate(_mpViewingDate());
}

// Save any plan object back to storage (works for both ID formats).
function _mpSavePlan(plan) {
  var plans = (storage.readWeekPlans() || []).filter(function(p) { return p.id !== plan.id; });
  plans.unshift(plan);
  storage.writeWeekPlans(plans);
}

// ---- Meal enrichment (calendar / dashboard compat) ----------
// Returns meals unchanged for new-schema recipes (no r.mealTypes).

function mpEnrichMeals(meals, weekPlan, dow) {
  if (!weekPlan || !weekPlan.recipeIds || weekPlan.recipeIds.length === 0) return meals;
  var recipes = weekPlan.recipeIds
    .map(function(id) { return RECIPE_CATALOG[id]; })
    .filter(function(r) { return r && r.mealTypes && r.mealTypes.indexOf('dinner') >= 0; });
  if (recipes.length < 3) return meals; // new-schema recipes have no mealTypes → no-op

  var DINNER_IDX = { 1:0, 2:2, 3:1, 4:0, 5:2, 6:1 };
  var LUNCH_IDX  = { 1:1, 2:0, 3:2, 4:1, 5:0, 6:2 };

  var dinnerRecipe = recipes[DINNER_IDX[dow]] || null;
  var lunchIdx     = LUNCH_IDX[dow];
  var lunchRecipe  = (lunchIdx !== undefined) ? (recipes[lunchIdx] || null) : null;

  return meals.map(function(m) {
    if (m.type === 'Dinner' && dinnerRecipe) {
      return { type: m.type, name: dinnerRecipe.name, desc: dinnerRecipe.desc || m.desc, link: dinnerRecipe.link || m.link, recipeId: dinnerRecipe.id };
    }
    if (m.type === 'Lunch' && lunchRecipe) {
      return { type: m.type, name: lunchRecipe.name, desc: 'Lunch prep — batch-cooked at Sunday prep', link: lunchRecipe.link || m.link, recipeId: lunchRecipe.id };
    }
    return m;
  }).filter(Boolean);
}

// ---- Plan review sub-renderers ------------------------------

// Color classes indexed by recipe position in the week plan.
var _MP_RECIPE_COLORS = ['mp-rc-clr-0', 'mp-rc-clr-1', 'mp-rc-clr-2', 'mp-rc-clr-3', 'mp-rc-clr-4'];

function _mpColorMap(weekPlan) {
  var map = {};
  (weekPlan.recipeIds || []).forEach(function(id, i) {
    map[id] = _MP_RECIPE_COLORS[i % _MP_RECIPE_COLORS.length];
  });
  return map;
}

function _renderRecipeCards(weekPlan, settings) {
  var targetPerServing = Math.round(
    (settings.dailyCalorieTarget - settings.dailyBaselineCalories) / 2
  );
  var colorMap = _mpColorMap(weekPlan);

  return (weekPlan.recipeIds || []).map(function(id) {
    var recipe = RECIPE_CATALOG[id];
    if (!recipe) return '';
    var n        = (weekPlan.servingCounts && weekPlan.servingCounts[id]) || 1;
    var tm       = recipe._totalMacros;
    var calBatch = tm.calories;
    var calEach  = Math.round(calBatch / n);
    var protEach = Math.round(tm.proteinG / n);
    var fatEach  = Math.round(tm.fatG    / n);
    var carbEach = Math.round(tm.carbsG  / n);
    var isPinned = _mpDraftPinnedIds.indexOf(id) >= 0;

    return '<div class="mp-plan-rc' + (isPinned ? ' pinned' : '') + '">' +
      '<div class="mp-plan-rc-top">' +
        '<span class="mp-rank-badge mp-rank-' + recipe.rank.toLowerCase() + '">' + recipe.rank + '</span>' +
        '<div class="mp-plan-rc-name mp-recipe-link" onclick="openRecipeModal(\'' + id + '\')">' + recipe.name + '</div>' +
        '<div class="mp-plan-rc-btns">' +
          '<button class="mp-pin-btn' + (isPinned ? ' active' : '') + '" onclick="mpPinToggle(\'' + id + '\')">' +
            (isPinned ? '● Pinned' : '○ Pin') +
          '</button>' +
          '<button class="mp-swap-btn" onclick="mpSwapRecipe(\'' + id + '\')">⇄ Swap</button>' +
        '</div>' +
      '</div>' +
      '<div class="mp-plan-rc-meta">' +
        calBatch.toLocaleString() + ' kcal batch · ' + n + ' serving' + (n !== 1 ? 's' : '') +
      '</div>' +
      '<div class="mp-plan-rc-macros">' +
        '<span class="mp-rm-cal">' + calEach + ' kcal</span>' +
        '<span class="mp-rm-sep">·</span>' +
        '<span class="mp-rm-p">' + protEach + 'g P</span>' +
        '<span class="mp-rm-sep">·</span>' +
        '<span class="mp-rm-f">' + fatEach + 'g F</span>' +
        '<span class="mp-rm-sep">·</span>' +
        '<span class="mp-rm-c">' + carbEach + 'g C</span>' +
        '<span class="mp-rm-note">per serving</span>' +
      '</div>' +
    '</div>';
  }).join('');
}

function _renderDayGrid(weekPlan) {
  var colorMap   = _mpColorMap(weekPlan);
  var assignment = weekPlan.dailyAssignment || {};
  var servings   = weekPlan.servingCounts   || {};
  var DOW_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

  function cell(recipeId) {
    if (!recipeId) return '<div class="mp-dg-cell mp-dg-empty">—</div>';
    var recipe = RECIPE_CATALOG[recipeId];
    var n      = servings[recipeId] || 1;
    var cal    = recipe ? Math.round(recipe._totalMacros.calories / n) : 0;
    var label  = recipe ? recipe.name.split(' ')[0] : '?';
    var title  = recipe ? recipe.name + ' (~' + cal + ' kcal)' : recipeId;
    return '<div class="mp-dg-cell ' + (colorMap[recipeId] || 'mp-rc-clr-0') + '" title="' + title + '">' + label + '</div>';
  }

  var html = '<div class="mp-day-grid">';
  // Header row: label column + day headers
  html += '<div class="mp-dg-lbl"></div>';
  DOW_LABELS.forEach(function(d) { html += '<div class="mp-dg-day-hdr">' + d + '</div>'; });
  // Lunch row
  html += '<div class="mp-dg-lbl">L</div>';
  for (var day = 1; day <= 5; day++) {
    html += cell(((assignment[day] || {}).lunch) || null);
  }
  // Dinner row
  html += '<div class="mp-dg-lbl">D</div>';
  for (var day = 1; day <= 5; day++) {
    html += cell(((assignment[day] || {}).dinner) || null);
  }
  html += '</div>';
  return html;
}

function _renderWeekendShelf(weekPlan) {
  var overflow = weekPlan.weekendOverflow || [];
  if (overflow.length === 0) return '';
  return '<div class="mp-overflow">' +
    '<div class="mp-overflow-title">Weekend · Extra Servings</div>' +
    overflow.map(function(o) {
      var recipe = RECIPE_CATALOG[o.recipeId];
      var name   = recipe ? recipe.name : o.recipeId;
      return '<div class="mp-overflow-item">' +
        name + ' — ' + o.count + ' extra serving' + (o.count !== 1 ? 's' : '') +
        ' · ~' + o.calsEach + ' kcal each' +
      '</div>';
    }).join('') +
  '</div>';
}

function _weekdayMacros(weekPlan) {
  var assignment = weekPlan.dailyAssignment || {};
  var servings   = weekPlan.servingCounts   || {};
  var totals     = { cal: 0, prot: 0, fat: 0, carb: 0 };
  for (var day = 1; day <= 5; day++) {
    var slots = assignment[day] || {};
    ['lunch', 'dinner'].forEach(function(slot) {
      var id = slots[slot];
      if (!id) return;
      var recipe = RECIPE_CATALOG[id];
      if (!recipe) return;
      var n = servings[id] || 1;
      totals.cal  += recipe._totalMacros.calories / n;
      totals.prot += recipe._totalMacros.proteinG / n;
      totals.fat  += recipe._totalMacros.fatG     / n;
      totals.carb += recipe._totalMacros.carbsG   / n;
    });
  }
  return {
    avgCal:  Math.round(totals.cal  / 5),
    avgProt: Math.round(totals.prot / 5),
    avgFat:  Math.round(totals.fat  / 5),
    avgCarb: Math.round(totals.carb / 5)
  };
}

function _renderMacroStats(weekPlan, settings) {
  var avg           = _weekdayMacros(weekPlan);
  var totalDailyCal = avg.avgCal + (settings.dailyBaselineCalories || 800);
  var calTarget     = settings.dailyCalorieTarget || 2100;
  var calDiff       = totalDailyCal - calTarget;
  var calDiffStr    = (calDiff >= 0 ? '+' : '') + calDiff;
  var calColor      = Math.abs(calDiff) <= 100 ? 'var(--grn)' : Math.abs(calDiff) <= 200 ? 'var(--txl)' : 'var(--acc)';
  var protTarget    = Math.round((settings.goalWeight || 165) * 0.7);
  var protDiff      = avg.avgProt - protTarget;
  var protDiffStr   = (protDiff >= 0 ? '+' : '') + protDiff + 'g';
  var protColor     = protDiff >= 0 ? 'var(--grn)' : 'var(--acc)';

  return '<div class="mp-macro-summary">' +
    '<div class="mp-macro-sum-title">Weekday Average · Recipe Meals (L+D)</div>' +
    '<div class="mp-macro-sum-row">' +
      '<div class="mp-macro-sum-stat">' +
        '<div class="mp-macro-sum-val">' + totalDailyCal + '</div>' +
        '<div class="mp-macro-sum-lbl">kcal / day</div>' +
        '<div class="mp-macro-sum-vs" style="color:' + calColor + '">' + calDiffStr + ' vs ' + calTarget + ' target</div>' +
      '</div>' +
      '<div class="mp-macro-sum-stat">' +
        '<div class="mp-macro-sum-val">' + avg.avgProt + 'g</div>' +
        '<div class="mp-macro-sum-lbl">protein / day</div>' +
        '<div class="mp-macro-sum-vs" style="color:' + protColor + '">' + protDiffStr + ' vs ' + protTarget + 'g target</div>' +
      '</div>' +
    '</div>' +
    '<div class="mp-macro-sum-row" style="margin-top:6px">' +
      '<div class="mp-macro-sum-stat">' +
        '<div class="mp-macro-sum-val">' + avg.avgFat + 'g</div>' +
        '<div class="mp-macro-sum-lbl">fat / day</div>' +
      '</div>' +
      '<div class="mp-macro-sum-stat">' +
        '<div class="mp-macro-sum-val">' + avg.avgCarb + 'g</div>' +
        '<div class="mp-macro-sum-lbl">carbs / day</div>' +
      '</div>' +
    '</div>' +
    '<div class="mp-macro-sum-note">' +
      'Recipe meals only · + ' + (settings.dailyBaselineCalories || 800) + ' kcal baseline (oats + snacks)' +
    '</div>' +
  '</div>';
}

function _renderDayMacros(weekPlan, settings) {
  var assignment = weekPlan.dailyAssignment || {};
  var servings   = weekPlan.servingCounts   || {};
  var protTarget = Math.round((settings.goalWeight || 165) * 0.7);
  var DOW_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

  var days = [];
  for (var d = 1; d <= 5; d++) {
    var slots = assignment[d] || {};
    var cal = 0, prot = 0, fat = 0, carb = 0;
    ['lunch', 'dinner'].forEach(function(slot) {
      var id = slots[slot];
      if (!id) return;
      var recipe = RECIPE_CATALOG[id];
      if (!recipe) return;
      var n = servings[id] || 1;
      cal  += Math.round(recipe._totalMacros.calories / n);
      prot += Math.round(recipe._totalMacros.proteinG / n);
      fat  += Math.round(recipe._totalMacros.fatG     / n);
      carb += Math.round(recipe._totalMacros.carbsG   / n);
    });
    days.push({ label: DOW_LABELS[d - 1], cal: cal, prot: prot, fat: fat, carb: carb });
  }

  // Flag days where recipe-meal protein is among the lowest (within 5g of minimum)
  var minProt = Math.min.apply(null, days.map(function(d) { return d.prot; }));

  function row(lbl, vals, cls, suffix, flagFn) {
    var cells = vals.map(function(v, i) {
      var flag = flagFn && flagFn(v, i);
      return '<div class="mp-dm-val' + (flag ? ' mp-dm-low' : '') + '">' + v + (suffix || '') + (flag ? '<span class="mp-dm-shake">↑shake</span>' : '') + '</div>';
    }).join('');
    return '<div class="mp-dm-lbl ' + (cls || '') + '">' + lbl + '</div>' + cells;
  }

  return '<div class="mp-day-macros">' +
    '<div class="mp-day-macros-title">Daily Totals · Recipe Meals (L+D)</div>' +
    '<div class="mp-dm-grid">' +
      '<div class="mp-dm-hdr-lbl"></div>' +
      days.map(function(d) { return '<div class="mp-dm-hdr">' + d.label + '</div>'; }).join('') +
      row('kcal', days.map(function(d) { return d.cal; }),  'mp-dm-cal')  +
      row('P',    days.map(function(d) { return d.prot; }), 'mp-dm-p', 'g', function(v) { return v <= minProt + 5; }) +
      row('F',    days.map(function(d) { return d.fat; }),  'mp-dm-f', 'g') +
      row('C',    days.map(function(d) { return d.carb; }), 'mp-dm-c', 'g') +
    '</div>' +
    '<div class="mp-dm-note">↑ Lower protein days · consider a shake · target ' + protTarget + 'g total/day</div>' +
  '</div>';
}

function _renderWeekPlanReview(weekPlan, settings) {
  var confirmLabel = weekPlan.confirmed ? 'Re-confirm Plan ✓' : 'Confirm Plan ✓';
  var pinHint = _mpDraftPinnedIds.length > 0
    ? '<p class="mp-cta-sub" style="margin:0 0 10px">' + _mpDraftPinnedIds.length + ' recipe' + (_mpDraftPinnedIds.length !== 1 ? 's' : '') + ' pinned — Regenerate will keep ' + (_mpDraftPinnedIds.length !== 1 ? 'them' : 'it') + ' and swap the rest.</p>'
    : '';

  return '<div class="mp-plan-review">' +
    '<div class="rm-section-title">Recipe Selection</div>' +
    '<div class="mp-plan-recipes">' + _renderRecipeCards(weekPlan, settings) + '</div>' +
    '<div class="rm-section-title" style="margin-top:16px">Week Schedule</div>' +
    _renderDayGrid(weekPlan) +
    _renderDayMacros(weekPlan, settings) +
    _renderWeekendShelf(weekPlan) +
    _renderMacroStats(weekPlan, settings) +
    '<div class="mp-review-actions">' +
      pinHint +
      '<div class="mp-review-btn-row">' +
        '<button class="mp-regen-btn" onclick="mpRegenerateWeek()">↺ Regenerate</button>' +
        '<button class="mp-confirm-btn" onclick="mpConfirmNewPlan(\'' + weekPlan.id + '\')">' + confirmLabel + '</button>' +
      '</div>' +
    '</div>' +
  '</div>';
}

// ---- Home view ----------------------------------------------

function renderMealPlannerHome() {
  var el = document.getElementById('meal-planner-view');
  if (!el) return;

  var weekStart  = _mpViewingWeekStart();
  var weekLabel  = _mpFmtWeek(weekStart);
  var plan       = _mpLoadViewingPlan();
  var isNextWeek = _mpWeekOffset === 1;
  var settings   = loadSettings();

  if (!plan) {
    el.innerHTML =
      _mpWeekToggle() +
      '<div class="mp-section">' +
        '<div class="mp-week-hdr">' +
          '<span class="mp-week-date">' + (isNextWeek ? 'NEXT WEEK · ' : 'THIS WEEK · ') + weekLabel + '</span>' +
        '</div>' +
        '<div class="mp-cta">' +
          '<p class="mp-cta-text">No meal plan for this week.</p>' +
          '<p class="mp-cta-sub">Target: ' + ((settings.dailyCalorieTarget - settings.dailyBaselineCalories) * 5).toLocaleString() + ' kcal/week from recipe meals.</p>' +
          '<button class="log-btn" style="margin-top:14px;width:100%" onclick="renderWeekPlanBuilder()">Plan This Week →</button>' +
        '</div>' +
      '</div>';
    return;
  }

  // Compute shopping progress
  var list  = ShoppingListEngine.buildList(plan, settings);
  var total = 0, done = 0;
  if (list) {
    list.groups.forEach(function(g) {
      g.items.forEach(function(item) { if (item.visible) { total++; if (item.checked) done++; } });
    });
  }
  var progressLabel = total === 0 ? '' :
    done === total ? '✓ Shopping done' :
    done + ' / ' + total + ' items — tap to shop';

  var statusBadge = plan.confirmed
    ? '<span class="mp-plan-confirmed-badge">Confirmed</span>'
    : '<span class="mp-plan-draft-badge">Draft</span>';

  var servings = plan.servingCounts || {};
  var colorMap = _mpColorMap(plan);

  el.innerHTML =
    _mpWeekToggle() +
    '<div class="mp-section">' +
      '<div class="mp-plan-card">' +
        '<div class="mp-plan-hdr" style="background:var(--water)">' +
          '<div>' +
            '<div class="mp-plan-week">' + (isNextWeek ? 'NEXT WEEK · ' : 'THIS WEEK · ') + weekLabel + '</div>' +
            '<div class="mp-plan-cuisine">' + plan.recipeIds.length + ' Recipes · This Week</div>' +
          '</div>' +
          '<div class="mp-plan-actions">' +
            statusBadge +
            '<button class="mp-action-btn" onclick="renderWeekPlanBuilder()">Edit</button>' +
            '<button class="mp-action-btn" onclick="renderShoppingList()">List</button>' +
          '</div>' +
        '</div>' +
        '<div class="mp-plan-body">' +
          (plan.recipeIds || []).map(function(id) {
            var recipe = RECIPE_CATALOG[id];
            if (!recipe) return '';
            var n       = servings[id] || 1;
            var calEach = Math.round(recipe._totalMacros.calories / n);
            return '<div class="mp-dinner">' +
              '<span class="mp-rank-badge mp-rank-' + recipe.rank.toLowerCase() + '">' + recipe.rank + '</span>' +
              '<div class="mp-dinner-info">' +
                '<div class="mp-dinner-name mp-recipe-link" onclick="openRecipeModal(\'' + id + '\')">' + recipe.name + '</div>' +
                '<div class="mp-dinner-meta">' + n + ' serving' + (n !== 1 ? 's' : '') + ' · ~' + calEach + ' kcal each</div>' +
              '</div>' +
            '</div>';
          }).join('') +
          (progressLabel ? '<div class="mp-list-progress" onclick="renderShoppingList()">' + progressLabel + '</div>' : '') +
        '</div>' +
      '</div>' +
      _renderMacroStats(plan, settings) +
    '</div>';
}

// ---- Week plan builder (replaces renderCuisineSelector) -----

function renderWeekPlanBuilder() {
  _mpDraftPinnedIds     = [];
  _mpSessionExcludedIds = [];
  _mpRefreshBuilder();
}

function _mpRefreshBuilder() {
  var el = document.getElementById('meal-planner-view');
  if (!el) return;

  var isNextWeek = _mpWeekOffset === 1;
  var weekLabel  = _mpFmtWeek(_mpViewingWeekStart());
  var plan       = _mpLoadViewingPlan();
  var settings   = loadSettings();

  var nav =
    '<div class="mp-nav">' +
      '<button class="mp-back" onclick="renderMealPlannerHome()">← Back</button>' +
      '<span class="mp-nav-title">' + (isNextWeek ? 'Next Week' : 'This Week') + ' · ' + weekLabel + '</span>' +
    '</div>';

  if (plan) {
    el.innerHTML =
      _mpWeekToggle() +
      '<div class="mp-section">' +
        nav +
        _renderWeekPlanReview(plan, settings) +
      '</div>';
  } else {
    var weeklyTarget = (settings.dailyCalorieTarget - settings.dailyBaselineCalories) * 5;
    el.innerHTML =
      _mpWeekToggle() +
      '<div class="mp-section">' +
        nav +
        '<div class="mp-cta">' +
          '<p class="mp-cta-text">The engine will select recipes based on your calorie target, rank preferences (A → B → C), and ingredient overlap to minimise your shopping run.</p>' +
          '<p class="mp-cta-sub" style="margin-top:6px">Target: ' + weeklyTarget.toLocaleString() + ' kcal/week from recipe meals (' + settings.dailyCalorieTarget + ' − ' + settings.dailyBaselineCalories + ' baseline × 5 days)</p>' +
          '<button class="log-btn" style="margin-top:14px;width:100%" onclick="mpGenerateWeek()">Generate Week ▶</button>' +
        '</div>' +
      '</div>';
  }
}

// ---- Shopping list ------------------------------------------

function renderShoppingList() {
  var el = document.getElementById('meal-planner-view');
  if (!el) return;

  var plan = _mpLoadViewingPlan();
  if (!plan) { renderMealPlannerHome(); return; }

  var settings   = loadSettings();
  var list       = ShoppingListEngine.buildList(plan, settings);
  if (!list)     { renderMealPlannerHome(); return; }

  var showPantry = !!settings.showPantryStaples;
  var total = 0, done = 0;
  list.groups.forEach(function(g) {
    g.items.forEach(function(item) { if (item.visible) { total++; if (item.checked) done++; } });
  });

  var isNextWeek = _mpWeekOffset === 1;
  var html =
    _mpWeekToggle() +
    '<div class="mp-section">' +
      '<div class="mp-nav">' +
        '<button class="mp-back" onclick="renderMealPlannerHome()">← Plan</button>' +
        '<span class="mp-nav-title">' + (isNextWeek ? 'Next Week · ' : '') + 'Shopping List</span>' +
        '<button class="mp-pantry-toggle" onclick="mpTogglePantryView()">' + (showPantry ? 'Hide pantry' : 'Show pantry') + '</button>' +
      '</div>' +
      '<div class="mp-sl-progress">' + done + ' / ' + total + ' items checked</div>';

  list.groups.forEach(function(g) {
    var visItems      = g.items.filter(function(i) { return i.visible; });
    var hiddenStaples = g.items.filter(function(i) { return !i.visible; });
    if (visItems.length === 0 && hiddenStaples.length === 0) return;

    html += '<div class="mp-group"><div class="mp-group-title">' + g.category.toUpperCase() + '</div>';
    visItems.forEach(function(item) {
      var cls = 'mp-item' + (item.checked ? ' checked' : '') + (item.isPantryStaple ? ' staple' : '');
      html +=
        '<div class="' + cls + '" onclick="mpToggleShoppingItem(\'' + item.ingredientId + '\')">' +
          '<div class="mp-item-check">' + (item.checked ? '✓' : '') + '</div>' +
          '<div class="mp-item-main">' +
            '<span class="mp-item-name">' + item.name + '</span>' +
            (item.isPantryStaple ? '<span class="mp-pantry-badge">pantry</span>' : '') +
          '</div>' +
          '<div class="mp-item-amt">' + item.amountStr + '</div>' +
        '</div>';
    });
    if (hiddenStaples.length > 0) {
      html += '<div class="mp-hidden-staples">' +
        hiddenStaples.map(function(item) {
          return '<button class="mp-need-this" onclick="event.stopPropagation();mpTogglePantryOverride(\'' + item.ingredientId + '\')">' +
            '+ ' + item.name + '</button>';
        }).join('') +
      '</div>';
    }
    html += '</div>';
  });

  html += '</div>';
  el.innerHTML = html;
}

// ---- Action handlers ----------------------------------------

function mpGenerateWeek() {
  var tp       = _mpTrainPlan();
  var settings = loadSettings();
  if (!tp) { showToast('No active training plan'); return; }
  _mpDraftPinnedIds     = [];
  _mpSessionExcludedIds = [];
  var plan = MealEngine.generateWeekPlan(tp, _mpViewingDate(), settings, [], []);
  if (!plan) { showToast('No eligible recipes — all may be on cooldown'); return; }
  _mpRefreshBuilder();
}

function mpRegenerateWeek() {
  var tp       = _mpTrainPlan();
  var settings = loadSettings();
  if (!tp) return;

  // Accumulate unpinned recipes from the current plan into the session exclusion list
  // so each press of Regenerate cycles forward through the catalog.
  var currentPlan = _mpLoadViewingPlan();
  if (currentPlan) {
    (currentPlan.recipeIds || []).forEach(function(id) {
      if (_mpDraftPinnedIds.indexOf(id) < 0 && _mpSessionExcludedIds.indexOf(id) < 0) {
        _mpSessionExcludedIds.push(id);
      }
    });
  }

  var plan = MealEngine.generateWeekPlan(
    tp, _mpViewingDate(), settings,
    _mpDraftPinnedIds.slice(),
    _mpSessionExcludedIds.slice()
  );

  if (!plan) {
    // Exclusion pool exhausted — wrap around and try once more with a clean slate.
    _mpSessionExcludedIds = [];
    plan = MealEngine.generateWeekPlan(tp, _mpViewingDate(), settings, _mpDraftPinnedIds.slice(), []);
  }

  if (!plan) { showToast('No eligible recipes — try unpinning some'); return; }
  _mpRefreshBuilder();
}

function mpPinToggle(recipeId) {
  var idx = _mpDraftPinnedIds.indexOf(recipeId);
  if (idx >= 0) { _mpDraftPinnedIds.splice(idx, 1); } else { _mpDraftPinnedIds.push(recipeId); }
  _mpRefreshBuilder();
}

function mpSwapRecipe(recipeId) {
  var plan = _mpLoadViewingPlan();
  if (!plan) return;
  // Pin everything except the swapped recipe; exclude it so the engine can't re-pick it.
  _mpDraftPinnedIds = (plan.recipeIds || []).filter(function(id) { return id !== recipeId; });
  if (_mpSessionExcludedIds.indexOf(recipeId) < 0) _mpSessionExcludedIds.push(recipeId);
  mpRegenerateWeek();
}

function mpConfirmNewPlan(weekPlanId) {
  var ok = MealEngine.confirmWeekPlan(weekPlanId);
  if (!ok) { showToast('Could not confirm plan'); return; }
  _mpDraftPinnedIds     = [];
  _mpSessionExcludedIds = [];
  showToast('Plan confirmed ✓');
  renderMealPlannerHome();
  if (typeof renderTodayMeals === 'function') renderTodayMeals();
  if (typeof renderPlanWeeks  === 'function') renderPlanWeeks();
  if (typeof renderMealNudge  === 'function') renderMealNudge();
}

function mpToggleShoppingItem(ingredientId) {
  var plan = _mpLoadViewingPlan();
  if (!plan) return;
  var arr = plan.checkedItems || [];
  var idx = arr.indexOf(ingredientId);
  if (idx >= 0) { arr.splice(idx, 1); } else { arr.push(ingredientId); }
  plan.checkedItems = arr;
  _mpSavePlan(plan);
  renderShoppingList();
}

function mpTogglePantryOverride(ingredientId) {
  var plan = _mpLoadViewingPlan();
  if (!plan) return;
  var arr = plan.pantryOverrides || [];
  var idx = arr.indexOf(ingredientId);
  if (idx >= 0) { arr.splice(idx, 1); } else { arr.push(ingredientId); }
  plan.pantryOverrides = arr;
  _mpSavePlan(plan);
  renderShoppingList();
}

function mpTogglePantryView() {
  var s = loadSettings();
  s.showPantryStaples = !s.showPantryStaples;
  saveSettings(s);
  renderShoppingList();
}

// ---- Entry point --------------------------------------------

function initMealPlanner() {
  _mpWeekOffset         = 0;
  _mpDraftPinnedIds     = [];
  _mpSessionExcludedIds = [];
  renderMealPlannerHome();
}

// ---- Recipe modal -------------------------------------------

function openRecipeModal(recipeId) {
  var recipe = RECIPE_CATALOG[recipeId];
  if (!recipe) return;
  var overlay = document.getElementById('recipe-modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'recipe-modal-overlay';
    overlay.className = 'rm-overlay';
    overlay.addEventListener('click', function(e) { if (e.target === overlay) closeRecipeModal(); });
    document.body.appendChild(overlay);
  }
  var ingredientHtml = (recipe._ingredients || []).map(function(ing) {
    var ingData = INGREDIENT_CATALOG[ing.id];
    var ingName = ingData ? ingData.name : ing.id;
    var amt     = ing.qty || (ing.grams + 'g');
    return '<li class="rm-ing-item">' + amt + ' ' + ingName + '</li>';
  }).join('');
  var tm       = recipe._totalMacros || {};
  var macroStr = '';
  if (tm.calories)  macroStr  = tm.calories.toLocaleString() + ' cal (full batch)';
  if (tm.proteinG)  macroStr += (macroStr ? ' · ' : '') + tm.proteinG + 'g protein';
  var sourceBtn = recipe.source_url
    ? '<a href="' + recipe.source_url + '" target="_blank" rel="noopener" class="rm-source-btn">View Full Recipe Online →</a>'
    : '';
  overlay.innerHTML =
    '<div class="rm-modal">' +
      '<button class="rm-close" onclick="closeRecipeModal()">✕</button>' +
      '<div class="rm-header">' +
        '<div class="rm-name">' + recipe.name + '</div>' +
        (macroStr ? '<div class="rm-macros">' + macroStr + '</div>' : '') +
      '</div>' +
      '<div class="rm-body">' +
        '<div class="rm-section-title">Ingredients</div>' +
        '<ul class="rm-ingredients">' + ingredientHtml + '</ul>' +
        sourceBtn +
      '</div>' +
    '</div>';
  overlay.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeRecipeModal() {
  var overlay = document.getElementById('recipe-modal-overlay');
  if (overlay) overlay.classList.remove('visible');
  document.body.style.overflow = '';
}
