// ============================================================
// MEAL PLANNER
// Week-aware: toggle between This Week and Next Week.
// Plans stored as array keyed by weekStart date string (Sunday).
// Exposes: mpLoadWeekPlanForDate, mpEnrichMeals,
//   renderMealPlannerHome, initMealPlanner,
//   mpSwitchWeek (called by dashboard nudge)
// ============================================================

// ---- State --------------------------------------------------

var _draftRecipeIds  = [];
var _mpWeekOffset    = 0;   // 0 = this week, 1 = next week

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

function _mpPlanId(weekStart) {
  return 'wp_' + weekStart;
}

// ---- Storage helpers ----------------------------------------

function mpLoadCurrentWeekPlan() {
  return mpLoadWeekPlanForDate(new Date());
}

function mpLoadWeekPlanForDate(date) {
  var weekStart = _mpWeekStart(date);
  var id = _mpPlanId(weekStart);
  return (storage.readWeekPlans() || []).find(function (p) { return p.id === id; }) || null;
}

function _mpLoadViewingPlan() {
  var weekStart = _mpViewingWeekStart();
  var id = _mpPlanId(weekStart);
  return (storage.readWeekPlans() || []).find(function (p) { return p.id === id; }) || null;
}

function _mpSavePlan(plan) {
  var plans = (storage.readWeekPlans() || []).filter(function (p) { return p.id !== plan.id; });
  plans.unshift(plan);
  storage.writeWeekPlans(plans);
}

// ---- Meal enrichment (used by dashboard + calendar) ---------

function mpEnrichMeals(meals, weekPlan, dow) {
  if (!weekPlan || !weekPlan.recipeIds || weekPlan.recipeIds.length === 0) return meals;
  var recipes = weekPlan.recipeIds
    .map(function (id) { return RECIPE_CATALOG[id]; })
    .filter(function (r) { return r && r.mealTypes && r.mealTypes.indexOf('dinner') >= 0; });
  if (recipes.length < 3) return meals;

  // Perfect 12-serving stagger: 3 recipes × 4 servings each
  // 6 dinners (Mon–Sat) + 6 lunches (Mon–Sat) = 12 total
  // No recipe repeats for both lunch and dinner on the same day
  // Verified: R0×4, R1×4, R2×4 — no same-day conflicts
  // R0: Mon-D Tue-L Thu-D Fri-L | R1: Mon-L Wed-D Thu-L Sat-D | R2: Tue-D Wed-L Fri-D Sat-L
  var DINNER_IDX = { 1:0, 2:2, 3:1, 4:0, 5:2, 6:1 };
  var LUNCH_IDX  = { 1:1, 2:0, 3:2, 4:1, 5:0, 6:2 };

  var dinnerRecipe = recipes[DINNER_IDX[dow]] || null;
  var lunchIdx     = LUNCH_IDX[dow];
  var lunchRecipe  = (lunchIdx !== undefined) ? (recipes[lunchIdx] || null) : null;

  return meals.map(function (m) {
    if (m.type === 'Dinner' && dinnerRecipe) {
      return { type: m.type, name: dinnerRecipe.name, desc: dinnerRecipe.desc || m.desc, link: dinnerRecipe.link || m.link, recipeId: dinnerRecipe.id };
    }
    if (m.type === 'Lunch') {
      if (lunchRecipe) {
        return { type: m.type, name: lunchRecipe.name, desc: 'Lunch prep — batch-cooked at Sunday prep', link: lunchRecipe.link || m.link, recipeId: lunchRecipe.id };
      }
      return null; // Sat/Sun lunch — intentional flex day, drop from output
    }
    return m;
  }).filter(Boolean);
}

// ---- Week label helper --------------------------------------

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
  _mpWeekOffset   = offset;
  _draftRecipeIds = [];
  renderMealPlannerHome();
}

// ---- Sunday prep timeline -----------------------------------

function _renderPrepTimeline(plan) {
  if (!plan) return '';
  var recipes = (plan.recipeIds || [])
    .map(function(id) { return RECIPE_CATALOG[id]; })
    .filter(function(r) { return r && r.mealTypes && r.mealTypes.indexOf('dinner') >= 0; })
    .slice(0, 3);
  if (recipes.length === 0) return '';

  var sauceName = 'sauce';

  function _t(mins) {
    var totalMins = 9 * 60 + mins;
    var h = Math.floor(totalMins / 60);
    var m = totalMins % 60;
    var ampm = h >= 12 ? ' PM' : ' AM';
    if (h > 12) h -= 12;
    return h + ':' + (m < 10 ? '0' + m : m) + ampm;
  }

  var steps = [];
  var t = 0;

  steps.push({ time: _t(t), dur: '5 min',
    desc: 'Station: preheat oven 400°F, lay out sheet pans, 12 labelled containers (Mon–Sat × Lunch + Dinner), sauce jar.' });
  t += 5;

  steps.push({ time: _t(t), dur: '5 min',
    desc: 'Grain base: rinse 3 cups brown rice + 6 cups water. Bring to boil then simmer covered 35 min.' });
  t += 5;

  steps.push({ time: _t(t), dur: '5 min',
    desc: 'Make ' + sauceName + ': whisk all ingredients in a jar, seal and refrigerate.' });
  t += 5;

  steps.push({ time: _t(t), dur: '15 min',
    desc: 'Wash and chop all produce for ' + recipes.map(function(r) { return r.name; }).join(', ') + '. Group each recipe\'s ingredients separately.' });
  t += 15;

  // Prep / marinate phase — sequential hands-on work per recipe
  recipes.forEach(function(r) {
    var prepMins = r.prepMins || 10;
    var step = (r.brief_instructions && r.brief_instructions[0]) || 'Prep and season ' + r.name + '.';
    steps.push({ time: _t(t), dur: prepMins + ' min', desc: r.name + ': ' + step });
    t += prepMins;
  });

  // Cook phase — all 3 recipes start roughly simultaneously (oven + stovetop overlap)
  var cookStart = t;
  var maxCook   = 0;
  recipes.forEach(function(r, i) {
    var cookMins = r.cookMins || 25;
    var step = (r.brief_instructions && r.brief_instructions[2]) || 'Cook ' + r.name + ' per recipe.';
    steps.push({ time: _t(cookStart + i * 2), dur: cookMins + ' min', desc: r.name + ': ' + step });
    if (cookMins > maxCook) maxCook = cookMins;
  });
  t = cookStart + maxCook + (recipes.length - 1) * 2;

  steps.push({ time: _t(t), dur: '10 min',
    desc: '7 overnight oat jars: ½ cup oats + 1 cup oat milk + 1 tbsp chia + 1 tsp honey each. Refrigerate.' });
  t += 10;

  steps.push({ time: _t(t), dur: '10 min',
    desc: 'Portion all 3 recipes into labelled Mon–Sat containers. Refrigerate proteins and grains separately.' });
  t += 10;

  steps.push({ time: _t(t), dur: '',
    desc: 'Done — ~' + t + ' min total. Week is loaded.' });

  return '<div class="mp-timeline">' +
    '<div class="mp-tl-header">Sunday Prep · ~' + t + ' min</div>' +
    steps.map(function(s) {
      return '<div class="mp-tl-step">' +
        '<div class="mp-tl-time">' + s.time + '</div>' +
        '<div class="mp-tl-dur">' + (s.dur || '') + '</div>' +
        '<div class="mp-tl-desc">' + s.desc + '</div>' +
      '</div>';
    }).join('') +
  '</div>';
}

// ---- Macro summary box --------------------------------------
// Baseline: Overnight Oats (~320 kcal, 15g) + Snacks (~280 kcal, 10g) + Shake (~200 kcal, 10g)
var _MP_BASELINE_CAL  = 800;
var _MP_BASELINE_PROT = 35;

function _renderMacroSummary(plan) {
  if (!plan || !plan.recipeIds || plan.recipeIds.length < 3) return '';

  var scales  = plan.portionScales || [1.25, 1.25, 1.25];
  var recipes = plan.recipeIds
    .map(function(id) { return RECIPE_CATALOG[id]; })
    .filter(function(r) { return r && r.calories != null && r.proteinG != null; });

  if (recipes.length < 3) return '';

  var avgCal  = ((recipes[0].calories  * (scales[0] || 1.25)) + (recipes[1].calories  * (scales[1] || 1.25)) + (recipes[2].calories  * (scales[2] || 1.25))) / 3;
  var avgProt = ((recipes[0].proteinG * (scales[0] || 1.25)) + (recipes[1].proteinG * (scales[1] || 1.25)) + (recipes[2].proteinG * (scales[2] || 1.25))) / 3;
  var dailyCal  = Math.round(avgCal * 2 + _MP_BASELINE_CAL);
  var dailyProt = Math.round(avgProt * 2 + _MP_BASELINE_PROT);

  // Compare against calorie target from engine
  var weights   = typeof loadWeights === 'function' ? loadWeights() : [];
  var s         = loadSettings();
  var latest    = weights.sort(function(a, b) { return b.date.localeCompare(a.date); })[0];
  var current   = latest ? parseFloat(latest.weight) : null;
  var calTarget = CalorieEngine.getDailyTarget(current, s.goalWeight || 165);
  var targetCal = calTarget.calories;
  var protTarget = Math.round((s.goalWeight || 165) * 0.7);

  var calDiff     = dailyCal - targetCal;
  var calDiffStr  = (calDiff >= 0 ? '+' : '') + calDiff;
  var absDiff     = Math.abs(calDiff);
  var calDiffColor = absDiff <= 100 ? 'var(--grn)' : absDiff <= 200 ? 'var(--txl)' : 'var(--acc)';
  var protDiff     = dailyProt - protTarget;
  var protDiffStr  = (protDiff >= 0 ? '+' : '') + protDiff + 'g';
  var protDiffColor = protDiff >= 0 ? 'var(--grn)' : 'var(--acc)';

  return '<div class="mp-macro-summary">' +
    '<div class="mp-macro-sum-title">Weekly Average · Daily Totals</div>' +
    '<div class="mp-macro-sum-row">' +
      '<div class="mp-macro-sum-stat">' +
        '<div class="mp-macro-sum-val">' + dailyCal + '</div>' +
        '<div class="mp-macro-sum-lbl">kcal / day</div>' +
        '<div class="mp-macro-sum-vs" style="color:' + calDiffColor + '">' + calDiffStr + ' vs ' + targetCal + ' target</div>' +
      '</div>' +
      '<div class="mp-macro-sum-stat">' +
        '<div class="mp-macro-sum-val">' + dailyProt + 'g</div>' +
        '<div class="mp-macro-sum-lbl">protein / day</div>' +
        '<div class="mp-macro-sum-vs" style="color:' + protDiffColor + '">' + protDiffStr + ' vs ' + protTarget + 'g target</div>' +
      '</div>' +
    '</div>' +
    '<div class="mp-macro-sum-note">Meals only · includes ' + _MP_BASELINE_CAL + ' kcal / ' + _MP_BASELINE_PROT + 'g baseline (oats + snacks + shake)</div>' +
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

  if (!plan) {
    el.innerHTML =
      _mpWeekToggle() +
      '<div class="mp-section">' +
        '<div class="mp-week-hdr">' +
          '<span class="mp-week-date">' + (isNextWeek ? 'NEXT WEEK · ' : 'THIS WEEK · ') + weekLabel + '</span>' +
        '</div>' +
        '<div class="mp-cta">' +
          '<p class="mp-cta-text">No meal plan set.</p>' +
          '<button class="log-btn" style="margin-top:12px;width:100%" onclick="renderCuisineSelector()">Plan This Week →</button>' +
        '</div>' +
      '</div>';
    return;
  }

  var dinnerRecipes = (plan.recipeIds || []).map(function (id, i) { var r = RECIPE_CATALOG[id]; return r ? { recipe: r, idx: i } : null; }).filter(Boolean);

  var settings = loadSettings();
  var list  = ShoppingListEngine.buildList(plan, settings);
  var total = 0, done = 0;
  if (list) {
    list.groups.forEach(function (g) {
      g.items.forEach(function (item) {
        if (item.visible) { total++; if (item.checked) done++; }
      });
    });
  }
  var progressLabel = total === 0 ? '' :
    done === total ? '✓ Shopping done' :
    done + ' / ' + total + ' items checked — tap to open list';

  el.innerHTML =
    _mpWeekToggle() +
    '<div class="mp-section">' +
      '<div class="mp-plan-card">' +
        '<div class="mp-plan-hdr">' +
          '<div>' +
            '<div class="mp-plan-week">' + (isNextWeek ? 'NEXT WEEK · ' : 'THIS WEEK · ') + weekLabel + '</div>' +
          '</div>' +
          '<div class="mp-plan-actions">' +
            '<button class="mp-action-btn" onclick="renderCuisineSelector()">Edit</button>' +
            '<button class="mp-action-btn" onclick="renderShoppingList()">List</button>' +
          '</div>' +
        '</div>' +
        '<div class="mp-plan-body">' +
          dinnerRecipes.map(function (item) {
            var r = item.recipe, idx = item.idx;
            var scale = (plan.portionScales && plan.portionScales[idx] != null) ? plan.portionScales[idx] : 1.25;
            return '<div class="mp-dinner">' +
              '<span class="mp-dinner-type">' + (r.isVeg ? 'VEG' : 'PROTEIN') + '</span>' +
              '<div class="mp-dinner-info">' +
                '<div class="mp-dinner-name mp-recipe-link" onclick="openRecipeModal(\'' + r.id + '\')">' + r.name + (r.isVeg ? '<span class="vd" style="margin-left:4px"></span>' : '') + '</div>' +
                '<div class="mp-dinner-meta">' + (r.protStr || '~' + r.proteinG + 'g') + ' · Serves ' + r.servings + '</div>' +
              '</div>' +
              '<select class="mp-portion-select" onchange="mpSetPortionScale(' + idx + ',parseFloat(this.value))">' +
                '<option value="1.0"' + (scale === 1.0 ? ' selected' : '') + '>Standard (1.0×)</option>' +
                '<option value="1.25"' + (scale === 1.25 ? ' selected' : '') + '>Athlete (1.25×)</option>' +
                '<option value="1.5"' + (scale === 1.5 ? ' selected' : '') + '>Heavy (1.5×)</option>' +
              '</select>' +
            '</div>';
          }).join('') +
          (progressLabel ? '<div class="mp-list-progress" onclick="renderShoppingList()">' + progressLabel + '</div>' : '') +
        '</div>' +
      '</div>' +
      _renderMacroSummary(plan) +
      _renderPrepTimeline(plan) +
    '</div>';
}

// ---- Cuisine selector (stub) --------------------------------
// TODO: Phase 5 — replace with new rank/overlap-driven recipe selection UI

function renderCuisineSelector() {
  var el = document.getElementById('meal-planner-view');
  if (!el) return;
  var isNextWeek = _mpWeekOffset === 1;
  el.innerHTML =
    _mpWeekToggle() +
    '<div class="mp-section">' +
      '<div class="mp-nav">' +
        '<button class="mp-back" onclick="renderMealPlannerHome()">← Back</button>' +
        '<span class="mp-nav-title">' + (isNextWeek ? 'Next Week' : 'This Week') + ' · Plan</span>' +
      '</div>' +
      '<div class="mp-cta">' +
        '<p class="mp-cta-text">Recipe selection coming in Phase 5.</p>' +
      '</div>' +
    '</div>';
}

// TODO: Phase 5 — renderRecipeSelector replaced by new selection UI
function renderRecipeSelector() { renderMealPlannerHome(); }

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
  list.groups.forEach(function (g) {
    g.items.forEach(function (item) { if (item.visible) { total++; if (item.checked) done++; } });
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

  list.groups.forEach(function (g) {
    var visItems      = g.items.filter(function (i) { return i.visible; });
    var hiddenStaples = g.items.filter(function (i) { return !i.visible; });
    if (visItems.length === 0 && hiddenStaples.length === 0) return;

    html += '<div class="mp-group"><div class="mp-group-title">' + g.category.toUpperCase() + '</div>';
    visItems.forEach(function (item) {
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
        hiddenStaples.map(function (item) {
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

// TODO: Phase 5 — mpSelectCuisine removed with cuisine system
function mpSelectCuisine() { renderMealPlannerHome(); }

function mpToggleRecipe(id) {
  var idx = _draftRecipeIds.indexOf(id);
  if (idx >= 0) {
    _draftRecipeIds.splice(idx, 1);
  } else if (_draftRecipeIds.length < 3) {
    _draftRecipeIds.push(id);
  }
  renderRecipeSelector();
}

function mpConfirmPlan() {
  // TODO: Phase 5 — plan confirmation rebuilt with new selection engine
  if (_draftRecipeIds.length !== 3) return;
  var weekStart   = _mpViewingWeekStart();
  var existing    = _mpLoadViewingPlan() || {};
  var sameRecipes = existing.recipeIds && existing.recipeIds.join(',') === _draftRecipeIds.join(',');
  _mpSavePlan({
    id:              _mpPlanId(weekStart),
    weekStart:       weekStart,
    recipeIds:       _draftRecipeIds.slice(),
    portionScales:   sameRecipes && existing.portionScales ? existing.portionScales.slice() : [1.25, 1.25, 1.25],
    checkedItems:    existing.checkedItems    || [],
    pantryOverrides: existing.pantryOverrides || []
  });
  _draftRecipeIds = [];
  renderMealPlannerHome();
  if (typeof renderTodayMeals  === 'function') renderTodayMeals();
  if (typeof renderPlanWeeks   === 'function') renderPlanWeeks();
  if (typeof renderMealNudge   === 'function') renderMealNudge();
}

function mpToggleShoppingItem(ingredientId) {
  var plan = _mpLoadViewingPlan();
  if (!plan) return;
  var arr = plan.checkedItems || [];
  var idx = arr.indexOf(ingredientId);
  if (idx >= 0) arr.splice(idx, 1); else arr.push(ingredientId);
  plan.checkedItems = arr;
  _mpSavePlan(plan);
  renderShoppingList();
}

function mpTogglePantryOverride(ingredientId) {
  var plan = _mpLoadViewingPlan();
  if (!plan) return;
  var arr = plan.pantryOverrides || [];
  var idx = arr.indexOf(ingredientId);
  if (idx >= 0) arr.splice(idx, 1); else arr.push(ingredientId);
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

function mpSetPortionScale(recipeIdx, scale) {
  var plan = _mpLoadViewingPlan();
  if (!plan) return;
  var scales = plan.portionScales ? plan.portionScales.slice() : [1.25, 1.25, 1.25];
  scales[recipeIdx] = scale;
  plan.portionScales = scales;
  _mpSavePlan(plan);
  renderMealPlannerHome();
}

// ---- Entry point --------------------------------------------

function initMealPlanner() {
  _mpWeekOffset = 0;
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
  var tm        = recipe._totalMacros || {};
  var macroStr  = '';
  if (tm.calories)  macroStr  = tm.calories + ' cal (full batch)';
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
