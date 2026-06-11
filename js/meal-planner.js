// ============================================================
// MEAL PLANNER — Phase 5
// Dynamic weekly meal planning: cuisine selection, recipe
// picker, shopping list with pantry toggle.
// Depends on: engine.js (ShoppingListEngine, MealEngine),
//   CUISINE_CATALOG, RECIPE_CATALOG, INGREDIENT_CATALOG,
//   TRAINING_PLANS, ACTIVE_PLAN_ID, storage, loadSettings
// Populates: #meal-planner-view in panel-meals
// Exposes globals: mpLoadCurrentWeekPlan, mpEnrichMeals,
//   renderMealPlannerHome, renderCuisineSelector,
//   renderRecipeSelector, renderShoppingList, initMealPlanner
// ============================================================

// ---- State --------------------------------------------------

var _draftCuisineId = null;
var _draftRecipeIds = [];

// ---- Week plan storage helpers ------------------------------

function _mpWeekStart(date) {
  var d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay()); // back to Sunday
  return d.toISOString().slice(0, 10);
}

function _mpPlanId(weekStart) {
  return 'wp_' + weekStart;
}

function mpLoadCurrentWeekPlan() {
  var weekStart = _mpWeekStart(new Date());
  var id = _mpPlanId(weekStart);
  return (storage.readWeekPlans() || []).find(function (p) { return p.id === id; }) || null;
}

function _mpSavePlan(plan) {
  var plans = (storage.readWeekPlans() || []).filter(function (p) { return p.id !== plan.id; });
  plans.unshift(plan);
  storage.writeWeekPlans(plans);
}

// ---- Meal enrichment for dashboard.js -----------------------

// Given the week plan's selected recipes, return the dinner
// recipe for today's DOW (protein days or veg days).
function mpEnrichMeals(meals, weekPlan, dow) {
  if (!weekPlan || !weekPlan.recipeIds || weekPlan.recipeIds.length === 0) return meals;

  var recipes = weekPlan.recipeIds.map(function (id) { return RECIPE_CATALOG[id]; }).filter(Boolean);
  var isVegDay  = (dow === 1 || dow === 3); // Mon, Wed
  var isProtDay = (dow === 2 || dow === 4 || dow === 6); // Tue, Thu, Sat

  var target = null;
  if (isVegDay)  target = recipes.find(function (r) { return r.isVeg; });
  if (isProtDay) target = recipes.find(function (r) { return !r.isVeg; });

  if (!target) return meals;

  return meals.map(function (m) {
    if (m.type === 'Dinner') {
      return { type: m.type, name: target.name, desc: target.desc || m.desc, link: target.link || m.link };
    }
    return m;
  });
}

// ---- Shared format helper -----------------------------------

function _mpFmtWeek(weekStart) {
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var d = new Date(weekStart + 'T12:00:00');
  return months[d.getMonth()] + ' ' + d.getDate();
}

// ---- Views --------------------------------------------------

function renderMealPlannerHome() {
  var el = document.getElementById('meal-planner-view');
  if (!el) return;

  var weekStart = _mpWeekStart(new Date());
  var plan      = mpLoadCurrentWeekPlan();
  var weekLabel = _mpFmtWeek(weekStart);

  if (!plan) {
    // Suggest the cuisine from the rotation
    var tPlan = TRAINING_PLANS[ACTIVE_PLAN_ID];
    var today = new Date(); today.setHours(12, 0, 0, 0);
    var s = new Date(tPlan.startDate); s.setHours(0, 0, 0, 0);
    var wi = Math.max(0, Math.floor((today - s) / (7 * 86400000)));
    var sugId      = tPlan.mealCycleIds[wi % tPlan.mealCycleIds.length];
    var sugCuisine = CUISINE_CATALOG[sugId];

    el.innerHTML =
      '<div class="mp-section">' +
        '<div class="mp-week-hdr">' +
          '<span class="mp-week-date">WEEK OF ' + weekLabel + '</span>' +
        '</div>' +
        '<div class="mp-cta">' +
          '<p class="mp-cta-text">No meal plan set for this week.</p>' +
          (sugCuisine ? '<p class="mp-cta-sub">Rotation suggests: <strong>' + sugCuisine.name + ' Week</strong></p>' : '') +
          '<button class="log-btn" style="margin-top:12px;width:100%" onclick="renderCuisineSelector()">Plan This Week →</button>' +
        '</div>' +
      '</div>';
    return;
  }

  var cuisine      = CUISINE_CATALOG[plan.cuisineId];
  var colorClass   = cuisine ? cuisine.colorClass : 'h1';
  var dinnerRecipes = (plan.recipeIds || []).map(function (id) { return RECIPE_CATALOG[id]; }).filter(Boolean);

  // Shopping progress
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
    '<div class="mp-section">' +
      '<div class="mp-plan-card">' +
        '<div class="mp-plan-hdr ' + colorClass + '">' +
          '<div>' +
            '<div class="mp-plan-week">WEEK OF ' + weekLabel + '</div>' +
            '<div class="mp-plan-cuisine">' + (cuisine ? cuisine.name : '') + ' Week</div>' +
          '</div>' +
          '<div class="mp-plan-actions">' +
            '<button class="mp-action-btn" onclick="renderCuisineSelector()">Edit</button>' +
            '<button class="mp-action-btn" onclick="renderShoppingList()">List</button>' +
          '</div>' +
        '</div>' +
        '<div class="mp-plan-body">' +
          dinnerRecipes.map(function (r) {
            return '<div class="mp-dinner">' +
              '<span class="mp-dinner-type">' + (r.isVeg ? 'Veg ×2' : 'Protein ×2') + '</span>' +
              '<div class="mp-dinner-info">' +
                '<div class="mp-dinner-name">' + r.name + (r.isVeg ? '<span class="vd" style="margin-left:4px"></span>' : '') + '</div>' +
                '<div class="mp-dinner-meta">' + (r.protStr || '~' + r.proteinG + 'g') + ' · Serves ' + r.servings + '</div>' +
              '</div>' +
            '</div>';
          }).join('') +
          (progressLabel ? '<div class="mp-list-progress" onclick="renderShoppingList()">' + progressLabel + '</div>' : '') +
        '</div>' +
      '</div>' +
    '</div>';
}

function renderCuisineSelector() {
  var el = document.getElementById('meal-planner-view');
  if (!el) return;

  _draftRecipeIds = []; // reset recipe draft on cuisine re-select

  var plan = TRAINING_PLANS[ACTIVE_PLAN_ID];
  var currentPlan  = mpLoadCurrentWeekPlan();
  var currentCuisineId = currentPlan ? currentPlan.cuisineId : null;

  el.innerHTML =
    '<div class="mp-section">' +
      '<div class="mp-nav">' +
        '<button class="mp-back" onclick="renderMealPlannerHome()">← Back</button>' +
        '<span class="mp-nav-title">Select Cuisine</span>' +
      '</div>' +
      '<div class="mp-cuisine-grid">' +
        plan.mealCycleIds.map(function (cuisineId, i) {
          var cuisine  = CUISINE_CATALOG[cuisineId];
          if (!cuisine) return '';
          var isCurrent = cuisineId === currentCuisineId;
          return '<div class="mp-cuisine-tile ' + cuisine.colorClass + (isCurrent ? ' active' : '') + '" onclick="mpSelectCuisine(\'' + cuisineId + '\')">' +
            '<div class="mp-cuisine-name">' + cuisine.name + '</div>' +
            '<div class="mp-cuisine-sub">Week ' + (i + 1) + (isCurrent ? ' · current' : '') + '</div>' +
          '</div>';
        }).join('') +
      '</div>' +
    '</div>';
}

function renderRecipeSelector(cuisineId) {
  var el = document.getElementById('meal-planner-view');
  if (!el) return;

  var cuisine = CUISINE_CATALOG[cuisineId];
  if (!cuisine) { renderMealPlannerHome(); return; }

  _draftCuisineId = cuisineId;

  var dinnerRecipes = cuisine.recipeIds
    .map(function (id) { return RECIPE_CATALOG[id]; })
    .filter(function (r) { return r && r.mealTypes.indexOf('dinner') >= 0; });

  // Pre-select all if drafts not initialized for this cuisine
  if (_draftRecipeIds.length === 0) {
    _draftRecipeIds = dinnerRecipes.map(function (r) { return r.id; });
  }

  el.innerHTML =
    '<div class="mp-section">' +
      '<div class="mp-nav">' +
        '<button class="mp-back" onclick="renderCuisineSelector()">← Cuisines</button>' +
        '<span class="mp-nav-title">' + cuisine.name + ' — Dinners</span>' +
      '</div>' +
      '<div class="mp-recipes">' +
        dinnerRecipes.map(function (r) {
          var sel = _draftRecipeIds.indexOf(r.id) >= 0;
          return '<div class="mp-recipe' + (sel ? ' selected' : '') + '" onclick="mpToggleRecipe(\'' + r.id + '\')">' +
            '<div class="mp-recipe-check">' + (sel ? '✓' : '') + '</div>' +
            '<div class="mp-recipe-info">' +
              '<div class="mp-recipe-name">' + r.name + (r.isVeg ? '<span class="vd" style="margin-left:5px"></span>' : '') + '</div>' +
              '<div class="mp-recipe-meta">' + (r.protStr || '~' + r.proteinG + 'g') + ' · Serves ' + r.servings + ' · ' + ((r.prepMins || 0) + (r.cookMins || 0)) + ' min</div>' +
              '<div class="mp-recipe-desc">' + (r.desc || '') + '</div>' +
            '</div>' +
          '</div>';
        }).join('') +
      '</div>' +
      '<button class="log-btn" style="width:100%" onclick="mpConfirmPlan()">Confirm Plan →</button>' +
    '</div>';
}

function renderShoppingList() {
  var el = document.getElementById('meal-planner-view');
  if (!el) return;

  var plan = mpLoadCurrentWeekPlan();
  if (!plan) { renderMealPlannerHome(); return; }

  var settings  = loadSettings();
  var list      = ShoppingListEngine.buildList(plan, settings);
  if (!list)    { renderMealPlannerHome(); return; }

  var showPantry = !!settings.showPantryStaples;  // UI uses this only for toggle button label

  var total = 0, done = 0;
  list.groups.forEach(function (g) {
    g.items.forEach(function (item) {
      if (item.visible) { total++; if (item.checked) done++; }
    });
  });

  var html =
    '<div class="mp-section">' +
      '<div class="mp-nav">' +
        '<button class="mp-back" onclick="renderMealPlannerHome()">← Plan</button>' +
        '<span class="mp-nav-title">Shopping List</span>' +
        '<button class="mp-pantry-toggle" onclick="mpTogglePantryView()">' + (showPantry ? 'Hide pantry' : 'Show pantry') + '</button>' +
      '</div>' +
      '<div class="mp-sl-progress">' + done + ' / ' + total + ' items checked</div>';

  list.groups.forEach(function (g) {
    var visItems     = g.items.filter(function (i) { return i.visible; });
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
            '+ ' + item.name +
          '</button>';
        }).join('') +
      '</div>';
    }

    html += '</div>';
  });

  html += '</div>';
  el.innerHTML = html;
}

// ---- Action handlers ----------------------------------------

function mpSelectCuisine(cuisineId) {
  _draftCuisineId = cuisineId;
  _draftRecipeIds = [];
  renderRecipeSelector(cuisineId);
}

function mpToggleRecipe(id) {
  var idx = _draftRecipeIds.indexOf(id);
  if (idx >= 0) _draftRecipeIds.splice(idx, 1);
  else          _draftRecipeIds.push(id);
  renderRecipeSelector(_draftCuisineId);
}

function mpConfirmPlan() {
  if (!_draftCuisineId || _draftRecipeIds.length === 0) return;
  var weekStart = _mpWeekStart(new Date());
  var existing  = mpLoadCurrentWeekPlan() || {};
  _mpSavePlan({
    id:             _mpPlanId(weekStart),
    weekStart:      weekStart,
    cuisineId:      _draftCuisineId,
    recipeIds:      _draftRecipeIds.slice(),
    checkedItems:   existing.checkedItems   || [],
    pantryOverrides: existing.pantryOverrides || []
  });
  _draftCuisineId = null;
  _draftRecipeIds = [];
  renderMealPlannerHome();
}

function mpToggleShoppingItem(ingredientId) {
  var plan = mpLoadCurrentWeekPlan();
  if (!plan) return;
  var arr = plan.checkedItems || [];
  var idx = arr.indexOf(ingredientId);
  if (idx >= 0) arr.splice(idx, 1); else arr.push(ingredientId);
  plan.checkedItems = arr;
  _mpSavePlan(plan);
  renderShoppingList();
}

function mpTogglePantryOverride(ingredientId) {
  var plan = mpLoadCurrentWeekPlan();
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

// ---- Entry point --------------------------------------------

function initMealPlanner() {
  renderMealPlannerHome();
}
