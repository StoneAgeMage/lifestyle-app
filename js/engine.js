// ============================================================
// ENGINE — pure computation layer (no DOM, no localStorage)
// Phase 3. All date/workout/meal resolution lives here.
// Depends on: WORKOUT_LIBRARY, TRAINING_PLANS, CUISINE_CATALOG,
//   RECIPE_CATALOG, INGREDIENT_CATALOG (all loaded before this file)
// ============================================================

// Shared utility — formats decimal amounts as fractions for display
function _fmtAmt(n) {
  if (n === Math.round(n)) return String(n);
  var f = { 0.25: '¼', 0.33: '⅓', 0.5: '½', 0.67: '⅔', 0.75: '¾' };
  var whole = Math.floor(n);
  var frac  = Math.round((n - whole) * 100) / 100;
  var fs    = f[frac] !== undefined ? f[frac] : String(frac).slice(1);
  return whole > 0 ? whole + fs : fs;
}

// ---- TrainingEngine ------------------------------------------

const TrainingEngine = (function () {

  // Global week index from plan startDate — still used for mealWeekIndex cycling
  function _getWeekIndex(plan, date) {
    var d = new Date(date); d.setHours(0, 0, 0, 0);
    var s = new Date(plan.startDate); s.setHours(0, 0, 0, 0);
    var ms = d - s;
    if (ms < 0) return -1;
    return Math.floor(ms / (7 * 86400000));
  }

  function isDateInPlan(plan, date) {
    var d     = new Date(date);           d.setHours(0, 0, 0, 0);
    var start = new Date(plan.startDate); start.setHours(0, 0, 0, 0);
    var end   = new Date(plan.endDate);   end.setHours(0, 0, 0, 0);
    return d >= start && d <= end;
  }

  // Returns the TRAINING_BLOCK whose months[] contains date's month.
  // Falls back to Winter if none matches (shouldn't happen).
  function getBlockForDate(date) {
    var m = new Date(date).getMonth();
    for (var i = 0; i < TRAINING_BLOCKS.length; i++) {
      if (TRAINING_BLOCKS[i].months.indexOf(m) >= 0) return TRAINING_BLOCKS[i];
    }
    return TRAINING_BLOCKS[0]; // Winter fallback
  }

  // Weeks elapsed since the Monday on or before the first day of the block's
  // first month. Handles year-boundary blocks (e.g. Winter: Nov–Feb).
  function getWeekIndexInBlock(block, date) {
    var d = new Date(date); d.setHours(0, 0, 0, 0);
    var curMonth = d.getMonth();
    var curYear  = d.getFullYear();
    var firstMonth = block.months[0];

    // If firstMonth is later in the calendar year than curMonth, the block
    // started in the previous year (e.g. Winter block in January).
    var blockStartYear = (firstMonth > curMonth) ? curYear - 1 : curYear;
    var blockStart = new Date(blockStartYear, firstMonth, 1);

    // Monday on or before blockStart
    var bsDow = blockStart.getDay(); // 0=Sun
    var bsBack = (bsDow === 0) ? 6 : (bsDow - 1);
    var firstMonday = new Date(blockStart);
    firstMonday.setDate(firstMonday.getDate() - bsBack);

    // Monday of the current week
    var curDow  = d.getDay();
    var curBack = (curDow === 0) ? 6 : (curDow - 1);
    var curMonday = new Date(d);
    curMonday.setDate(curMonday.getDate() - curBack);

    var diff = curMonday - firstMonday;
    return Math.max(0, Math.floor(diff / (7 * 86400000)));
  }

  // True when date falls within raceGoal.taperWeeks of the end of targetMonth.
  function isTaperWeek(block, date) {
    if (!block.raceGoal || !block.raceGoal.taperWeeks) return false;
    var d = new Date(date); d.setHours(0, 0, 0, 0);
    var year = d.getFullYear();
    var endOfRaceMonth = new Date(year, block.raceGoal.targetMonth + 1, 0);
    var taperStart = new Date(endOfRaceMonth);
    taperStart.setDate(taperStart.getDate() - (block.raceGoal.taperWeeks * 7));
    taperStart.setHours(0, 0, 0, 0);
    return d >= taperStart;
  }

  function getWorkoutForDate(plan, date) {
    var d   = new Date(date); d.setHours(12, 0, 0, 0);
    var wi  = _getWeekIndex(plan, d);
    if (wi < 0) return null;

    var dow   = d.getDay();
    var block = getBlockForDate(d);
    var wib   = getWeekIndexInBlock(block, d);

    var isDeload = (wib % block.deloadCycle === block.deloadCycle - 1);
    var isTaper  = isTaperWeek(block, d);
    var useDeload = isDeload || isTaper;

    var tmpl = block.weekTemplate[dow];
    if (!tmpl) return null;

    // Rest day — no session
    if (tmpl.type === 'rest') return null;

    // Restoration day — fixed session, no pool cycling
    if (tmpl.type === 'restoration') {
      var restWk = WORKOUT_LIBRARY['wk_restoration'] || {};
      return {
        workoutId:    'wk_restoration',
        workoutBg:    'bg-restore',
        workoutShort: 'Restore',
        workoutItems: restWk.items || [],
        weekIndex:     wi,
        blockWeek:     wib,
        peteWeek:      wib,            // backward-compat alias
        mealWeekIndex: wi % plan.mealCycleIds.length,
        dow:           dow,
        mobilityBias:  null,
        blockId:       block.id,
        blockName:     block.shortName,
        isDeload:      isDeload,
        isTaper:       isTaper,
        type:          'restoration'
      };
    }

    // Lift or erg — pick from pool
    var pool = (useDeload && tmpl.deloadPool) ? tmpl.deloadPool : tmpl.pool;
    if (!pool || pool.length === 0) return null;

    var workoutId = pool[wib % pool.length];
    var wk = WORKOUT_LIBRARY[workoutId];
    if (!wk) return null;

    return {
      workoutId:    workoutId,
      workoutBg:    wk.bgClass,
      workoutShort: wk.calShort,
      workoutItems: wk.items,
      weekIndex:    wi,
      blockWeek:    wib,
      peteWeek:     wib,             // backward-compat alias
      mealWeekIndex: wi % plan.mealCycleIds.length,
      dow:          dow,
      mobilityBias: wk.mobilityBias || null,
      blockId:      block.id,
      blockName:    block.shortName,
      isDeload:     isDeload,
      isTaper:      isTaper,
      type:         wk.type
    };
  }

  function getTodayContext(plan, date) {
    var d  = new Date(date); d.setHours(12, 0, 0, 0);
    var wf = getWorkoutForDate(plan, d);
    if (!wf) return null;

    var dowNames  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var cuisineId = plan.mealCycleIds[wf.mealWeekIndex];
    var cuisine   = CUISINE_CATALOG[cuisineId];

    return {
      workout:         wf,
      cuisineId:       cuisineId,
      cuisineName:     cuisine ? cuisine.name : '',
      dowName:         dowNames[wf.dow],
      peteWeekDisplay: wf.blockWeek + 1,                        // backward-compat
      blockDisplay:    wf.blockName + ' Wk ' + (wf.blockWeek + 1)
    };
  }

  // Returns the 5-min post-workout mobility routine for a session's mobilityBias.
  // Requires POST_WORKOUT_ROUTINES (data-mobility.js).
  function getMobilityRoutine(session) {
    if (!session || !session.mobilityBias) return null;
    if (typeof POST_WORKOUT_ROUTINES === 'undefined') return null;
    return POST_WORKOUT_ROUTINES[session.mobilityBias] || null;
  }

  // Returns the 20-min Saturday deep restoration routine.
  // Requires WEEKEND_RESTORATION (data-mobility.js).
  function getRestorationRoutine() {
    if (typeof WEEKEND_RESTORATION === 'undefined') return null;
    return WEEKEND_RESTORATION;
  }

  return {
    getWorkoutForDate,
    getTodayContext,
    isDateInPlan,
    getBlockForDate,
    getWeekIndexInBlock,
    isTaperWeek,
    getMobilityRoutine,
    getRestorationRoutine
  };
})();


// ---- MealEngine ----------------------------------------------

const MealEngine = (function () {

  function buildMealObject(plan, mealWeekIndex) {
    const cuisineId = plan.mealCycleIds[mealWeekIndex];
    const cuisine   = CUISINE_CATALOG[cuisineId];
    if (!cuisine) return null;

    const dinnerIds     = (cuisine.recipeIds || []).filter(id => RECIPE_CATALOG[id] && RECIPE_CATALOG[id].mealTypes.includes('dinner'));
    const dinner1Recipe = dinnerIds.map(id => RECIPE_CATALOG[id]).find(r => !r.isVeg);
    const dinner2Recipe = dinnerIds.map(id => RECIPE_CATALOG[id]).find(r =>  r.isVeg);

    function _fmt(r) {
      if (!r) return null;
      return {
        name: r.name,
        desc: r.desc || '',
        prot: r.protStr || (r.proteinG ? '~' + r.proteinG + 'g' : ''),
        link: r.link,
        veg:  !!r.isVeg
      };
    }

    return {
      cuisine: cuisine.name,
      color:   cuisine.colorClass,
      bowl:    cuisine.bowlName,
      sauce:   cuisine.sauceName,
      dinner1: _fmt(dinner1Recipe),
      dinner2: _fmt(dinner2Recipe),
      flex:    cuisine.flexMeal || null
    };
  }

  function getMealsForDate(plan, date, workoutResult) {
    const d   = new Date(date); d.setHours(12, 0, 0, 0);
    const dow = d.getDay();
    const meal = buildMealObject(plan, workoutResult.mealWeekIndex);
    if (!meal) return [];

    const meals = [];

    if (dow === 0) {
      meals.push({ type:'Today', name:'Overnight Oats', desc:'Or simple eggs — easy meal while prepping.', link:null });
      meals.push({
        type: 'Prep',
        name: meal.cuisine + ' Week Prep',
        desc: 'Make: brown rice, roast veg, ' + meal.sauce +
              (meal.dinner1 ? ', ' + meal.dinner1.name + ' (marinate)' : '') +
              (meal.dinner2 ? ', ' + meal.dinner2.name : '') +
              ', boil 6 eggs, 5 oat jars.',
        link: null
      });
    } else {
      meals.push({ type:'Breakfast', name:'Overnight Oats', desc:'Prep jar + fresh toppings', link:null });
      meals.push({ type:'Lunch', name:meal.bowl, desc:'Prepped grain + roasted veg + protein + ' + meal.sauce, link:null });

      if (dow === 1 || dow === 3) {
        if (meal.dinner2) meals.push({ type:'Dinner', name:meal.dinner2.name, desc:meal.dinner2.desc + ' 🌱 Ascent shake tonight.', link:meal.dinner2.link });
      } else if (dow === 2 || dow === 4 || dow === 6) {
        if (meal.dinner1) meals.push({ type:'Dinner', name:meal.dinner1.name, desc:meal.dinner1.desc, link:meal.dinner1.link });
      } else if (dow === 5) {
        if (meal.flex) meals.push({ type:'Dinner', name:meal.flex.name, desc:meal.flex.desc, link:null });
      }
    }

    return meals;
  }

  function getWeekContext(plan, date) {
    const d  = new Date(date); d.setHours(12, 0, 0, 0);
    const s  = new Date(plan.startDate); s.setHours(0, 0, 0, 0);
    const wi = Math.max(0, Math.floor((d - s) / (7 * 86400000)));
    const mealWeekIndex = wi % plan.mealCycleIds.length;
    const cuisineId     = plan.mealCycleIds[mealWeekIndex];
    const cuisine       = CUISINE_CATALOG[cuisineId];
    return { cuisineId, cuisineName: cuisine ? cuisine.name : '', mealWeekIndex, weekIndex: wi };
  }

  return { getMealsForDate, buildMealObject, getWeekContext };
})();


// ---- PantryEngine --------------------------------------------

const PantryEngine = (function () {

  function resolveIngredient(id) {
    return INGREDIENT_CATALOG[id] || null;
  }

  function isPantryStaple(id) {
    const ing = INGREDIENT_CATALOG[id];
    return ing ? !!ing.isPantryStaple : false;
  }

  function getStaplesForCuisine(cuisineId) {
    const cuisine = CUISINE_CATALOG[cuisineId];
    if (!cuisine) return [];
    return (cuisine.stapleIngredientIds || []).map(id => INGREDIENT_CATALOG[id]).filter(Boolean);
  }

  return { resolveIngredient, isPantryStaple, getStaplesForCuisine };
})();


// ---- ShoppingListEngine --------------------------------------

const ShoppingListEngine = (function () {

  function buildList(weekPlan, settings) {
    if (!weekPlan || !weekPlan.recipeIds || weekPlan.recipeIds.length === 0) return null;

    // Gather recipe IDs: selected dinners + cuisine sauces/marinades + weekly base prep
    var ids = weekPlan.recipeIds.slice();
    var cuisine = CUISINE_CATALOG[weekPlan.cuisineId];
    if (cuisine && cuisine.recipeIds) {
      cuisine.recipeIds.forEach(function (id) {
        var r = RECIPE_CATALOG[id];
        if (r && (r.mealTypes.indexOf('sauce') >= 0 || r.mealTypes.indexOf('marinade') >= 0)) {
          if (ids.indexOf(id) < 0) ids.push(id);
        }
      });
    }
    ids.push('overnight_oats_base', 'trail_mix_batch');

    // Aggregate ingredient amounts — apply portionScales to the 3 selected dinner recipes
    var portionScales = weekPlan.portionScales || [1.25, 1.25, 1.25];
    var agg = {};
    ids.forEach(function (recipeId) {
      var recipe = RECIPE_CATALOG[recipeId];
      if (!recipe) return;
      var recipeIdx = weekPlan.recipeIds.indexOf(recipeId);
      var scale = (recipeIdx >= 0 && portionScales[recipeIdx] != null) ? portionScales[recipeIdx] : 1.0;
      recipe.ingredients.forEach(function (ing) {
        var ingredient = INGREDIENT_CATALOG[ing.ingredientId];
        if (!ingredient) return;
        if (!agg[ing.ingredientId]) {
          agg[ing.ingredientId] = {
            ingredientId:  ing.ingredientId,
            name:          ingredient.name,
            category:      ingredient.category,
            isPantryStaple: !!ingredient.isPantryStaple,
            byUnit: {}
          };
        }
        var u = agg[ing.ingredientId].byUnit;
        u[ing.unit] = (u[ing.unit] || 0) + (ing.amount * scale);
      });
    });

    var checked   = weekPlan.checkedItems   || [];
    var overrides = weekPlan.pantryOverrides || [];

    var CATEGORY_ORDER = ['protein', 'produce', 'dairy', 'grains', 'pantry', 'spice', 'condiment', 'frozen'];

    var items = Object.values(agg).map(function (a) {
      var amountStr = Object.entries(a.byUnit).map(function (p) {
        return _fmtAmt(Math.round(p[1] * 100) / 100) + ' ' + p[0];
      }).join(' + ');
      return {
        ingredientId:   a.ingredientId,
        name:           a.name,
        category:       a.category,
        isPantryStaple: a.isPantryStaple,
        amountStr:      amountStr,
        checked:        checked.indexOf(a.ingredientId) >= 0,
        pantryOverride: overrides.indexOf(a.ingredientId) >= 0,
        // Visibility rule lives here — not in any UI layer
        visible: !a.isPantryStaple || !!(settings && settings.showPantryStaples) || overrides.indexOf(a.ingredientId) >= 0
      };
    });

    items.sort(function (a, b) {
      var ai = CATEGORY_ORDER.indexOf(a.category); if (ai < 0) ai = 99;
      var bi = CATEGORY_ORDER.indexOf(b.category); if (bi < 0) bi = 99;
      return ai !== bi ? ai - bi : a.name.localeCompare(b.name);
    });

    // Group by category
    var groups = [];
    var cur = null;
    items.forEach(function (item) {
      if (item.category !== cur) {
        if (cur !== null) groups[groups.length - 1]; // already pushed
        groups.push({ category: item.category, items: [] });
        cur = item.category;
      }
      groups[groups.length - 1].items.push(item);
    });

    return {
      id:          'sl_' + weekPlan.id,
      weekPlanId:  weekPlan.id,
      generatedAt: new Date().toISOString(),
      groups:      groups
    };
  }

  return { buildList };
})();


// ---- CalorieEngine ------------------------------------------

const CalorieEngine = (function() {

  var MAINTENANCE_CAL = 2400;
  var DEFICIT_CAL     = 2100;

  // Pure computation — no DOM, no storage.
  // currentWeight / goalWeight in the same unit (lb by default).
  // Returns { calories, mode: 'loss'|'maintenance' }.
  // If currentWeight is null (nothing logged yet), defaults to deficit.
  function getDailyTarget(currentWeight, goalWeight) {
    if (currentWeight !== null && currentWeight !== undefined && currentWeight <= goalWeight) {
      return { calories: MAINTENANCE_CAL, mode: 'maintenance' };
    }
    return { calories: DEFICIT_CAL, mode: 'loss' };
  }

  // Convenience wrapper: accepts settings object + raw weight log array,
  // returns a single calorie context object ready for any UI consumer.
  // settings  — from loadSettings() or storage.readSettings()
  // weightLogs — from storage.readLogs().filter(_logType === 'weight')
  function getCalorieContext(settings, weightLogs) {
    var sorted = (weightLogs || []).slice().sort(function(a, b) {
      return (b.date || '').localeCompare(a.date || '');
    });
    var currentWeight = sorted.length > 0 ? parseFloat(sorted[0].weight) : null;
    var goalWeight    = settings.goalWeight  || 165;
    var startWeight   = settings.startWeight || null;
    var target        = getDailyTarget(currentWeight, goalWeight);

    return {
      currentWeight: currentWeight,
      goalWeight:    goalWeight,
      startWeight:   startWeight,
      lbsLost:       (startWeight !== null && currentWeight !== null)
                       ? +(startWeight - currentWeight).toFixed(1) : null,
      lbsToGoal:     currentWeight !== null
                       ? +(currentWeight - goalWeight).toFixed(1) : null,
      calories:      target.calories,
      mode:          target.mode
    };
  }

  return { getDailyTarget, getCalorieContext, MAINTENANCE_CAL, DEFICIT_CAL };
})();


// ---- HREngine -----------------------------------------------

const HREngine = (function() {

  var ZONES = [
    { num: 1, name: 'Recovery',   minPct: 0.50, maxPct: 0.60 },
    { num: 2, name: 'Endurance',  minPct: 0.60, maxPct: 0.70 },
    { num: 3, name: 'Tempo',      minPct: 0.70, maxPct: 0.80 },
    { num: 4, name: 'Threshold',  minPct: 0.80, maxPct: 0.90 },
    { num: 5, name: 'Max Effort', minPct: 0.90, maxPct: 1.00 },
  ];

  // Tanaka formula: 208 − (0.7 × age). Uses knownMaxHR when valid.
  function getMaxHR(age, knownMaxHR) {
    if (knownMaxHR && knownMaxHR >= 100 && knownMaxHR <= 220) return Math.round(knownMaxHR);
    if (age        && age >= 15          && age        <= 90)  return Math.round(208 - (0.7 * age));
    return null;
  }

  function getZones(age, knownMaxHR) {
    var maxHR = getMaxHR(age, knownMaxHR);
    if (!maxHR) return null;
    return ZONES.map(function(z) {
      return {
        num:    z.num,
        name:   z.name,
        minPct: z.minPct,
        maxPct: z.maxPct,
        minBPM: Math.round(maxHR * z.minPct),
        maxBPM: Math.round(maxHR * z.maxPct),
      };
    });
  }

  return { getMaxHR: getMaxHR, getZones: getZones };
})();


// ---- Cross-catalog validation --------------------------------
// Call from the console: validateCatalogs()

function validateCatalogs() {
  const errors = [];

  // Key consistency — catches copy-paste duplicates where .id was updated but the
  // object key wasn't (or vice versa). JS object literals silently overwrite duplicate
  // keys, so this is the only runtime guard against that class of error.
  Object.entries(INGREDIENT_CATALOG).forEach(([key, ing]) => {
    if (ing.id !== key) errors.push('INGREDIENT_CATALOG: key "' + key + '" has mismatched id "' + ing.id + '"');
  });
  Object.entries(RECIPE_CATALOG).forEach(([key, recipe]) => {
    if (recipe.id !== key) errors.push('RECIPE_CATALOG: key "' + key + '" has mismatched id "' + recipe.id + '"');
  });
  Object.entries(WORKOUT_LIBRARY).forEach(([key, wk]) => {
    if (wk.id !== key) errors.push('WORKOUT_LIBRARY: key "' + key + '" has mismatched id "' + wk.id + '"');
  });

  Object.values(RECIPE_CATALOG).forEach(recipe => {
    (recipe.ingredients || []).forEach(ing => {
      if (!INGREDIENT_CATALOG[ing.ingredientId]) {
        errors.push('Recipe "' + recipe.id + '" refs unknown ingredient "' + ing.ingredientId + '"');
      }
    });
  });

  Object.values(CUISINE_CATALOG).forEach(cuisine => {
    (cuisine.recipeIds || []).forEach(id => {
      if (!RECIPE_CATALOG[id]) errors.push('Cuisine "' + cuisine.id + '" refs unknown recipe "' + id + '"');
    });
    (cuisine.stapleIngredientIds || []).forEach(id => {
      if (!INGREDIENT_CATALOG[id]) errors.push('Cuisine "' + cuisine.id + '" refs unknown staple "' + id + '"');
    });
  });

  TRAINING_BLOCKS.forEach(function(block) {
    Object.values(block.weekTemplate).forEach(function(tmpl) {
      [tmpl.pool, tmpl.deloadPool].filter(Boolean).forEach(function(pool) {
        pool.forEach(function(id) {
          if (!WORKOUT_LIBRARY[id]) errors.push('Block "' + block.id + '" refs unknown workout "' + id + '"');
        });
      });
    });
  });

  const valid = errors.length === 0;
  if (!valid) console.error('[engine] validateCatalogs:', errors);
  return { valid, errors };
}
