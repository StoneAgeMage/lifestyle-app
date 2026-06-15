// ============================================================
// ENGINE — pure computation layer (no DOM, no localStorage)
// Phase 3. All date/workout/meal resolution lives here.
// Depends on: WORKOUT_LIBRARY, TRAINING_PLANS,
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

    return {
      workout:         wf,
      dowName:         dowNames[wf.dow],
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

  // --- Constants (5b) ---
  var COOLDOWN_THRESHOLDS = { A: 2, B: 4,  C: 10 };
  var RANK_PRIORITY       = { A: 0, B: 1,  C: 2  };
  var MIN_SERVING_CAL     = 400;
  var MAX_SERVINGS        = 5;
  var MINIMUM_RECIPES     = 3;

  // --- Private helpers ---

  function _weekIndex(plan, date) {
    if (!plan || !plan.startDate) return -1;
    var d  = new Date(date); d.setHours(0, 0, 0, 0);
    var s  = new Date(plan.startDate); s.setHours(0, 0, 0, 0);
    var ms = d - s;
    if (ms < 0 || isNaN(ms)) return -1;
    return Math.floor(ms / (7 * 86400000));
  }

  function _ingIdSet(recipes) {
    var set = {};
    recipes.forEach(function(r) {
      r._ingredients.forEach(function(ing) { set[ing.id] = true; });
    });
    return set;
  }

  function _overlapScore(recipe, ingSet) {
    var n = 0;
    recipe._ingredients.forEach(function(ing) { if (ingSet[ing.id]) n++; });
    return n;
  }

  // 5b — Eligibility filter (cooldown check)
  function _eligibleRecipes(currentWeek, excludeIds, cooldowns) {
    var excl = {};
    (excludeIds || []).forEach(function(id) { excl[id] = true; });
    return Object.values(RECIPE_CATALOG).filter(function(r) {
      if (excl[r.id]) return false;
      var last      = cooldowns[r.id] != null ? cooldowns[r.id] : null;
      if (last === null) return true;
      var threshold = COOLDOWN_THRESHOLDS[r.rank] || 4;
      return (currentWeek - last) >= threshold;
    });
  }

  // 5c — Recipe selection loop
  function _selectRecipes(settings, currentWeek, pinnedRecipeIds, cooldowns) {
    var pinnedIds = pinnedRecipeIds || [];
    var pinned    = pinnedIds.map(function(id) { return RECIPE_CATALOG[id]; }).filter(Boolean);
    var selected  = pinned.slice();
    var totalCal  = selected.reduce(function(s, r) { return s + r._totalMacros.calories; }, 0);
    var target    = (settings.dailyCalorieTarget - settings.dailyBaselineCalories) * 5;

    var eligible  = _eligibleRecipes(currentWeek, selected.map(function(r) { return r.id; }), cooldowns);

    while (selected.length < MINIMUM_RECIPES || totalCal < target) {
      if (eligible.length === 0) break;

      var ingSet = _ingIdSet(selected);
      var next;

      if (selected.length === 0) {
        // Anchor: highest rank, oldest last-used as tiebreaker
        next = eligible.slice().sort(function(a, b) {
          var rDiff = (RANK_PRIORITY[a.rank] || 1) - (RANK_PRIORITY[b.rank] || 1);
          if (rDiff !== 0) return rDiff;
          var la = cooldowns[a.id] != null ? cooldowns[a.id] : -1;
          var lb = cooldowns[b.id] != null ? cooldowns[b.id] : -1;
          return la - lb;
        })[0];

      } else if (totalCal >= target) {
        // MODE A: calorie target met, still need recipes — pick smallest-calorie
        next = eligible.slice().sort(function(a, b) {
          var calDiff = a._totalMacros.calories - b._totalMacros.calories;
          if (calDiff !== 0) return calDiff;
          var oDiff   = _overlapScore(b, ingSet) - _overlapScore(a, ingSet);
          if (oDiff   !== 0) return oDiff;
          var la = cooldowns[a.id] != null ? cooldowns[a.id] : -1;
          var lb = cooldowns[b.id] != null ? cooldowns[b.id] : -1;
          return la - lb;
        })[0];

      } else {
        // MODE B: calorie target not yet met — prefer overlap, then rank
        var remaining = target - totalCal;
        var byOverlap = eligible.slice().sort(function(a, b) {
          var oDiff = _overlapScore(b, ingSet) - _overlapScore(a, ingSet);
          if (oDiff !== 0) return oDiff;
          var rDiff = (RANK_PRIORITY[a.rank] || 1) - (RANK_PRIORITY[b.rank] || 1);
          if (rDiff !== 0) return rDiff;
          var la = cooldowns[a.id] != null ? cooldowns[a.id] : -1;
          var lb = cooldowns[b.id] != null ? cooldowns[b.id] : -1;
          return la - lb;
        });
        var top = byOverlap[0];

        if (top._totalMacros.calories > remaining * 2) {
          // Overshoot guard: look for closer-fitting candidate with ≥ half the top's overlap score
          var halfScore  = _overlapScore(top, ingSet) / 2;
          var betterFits = byOverlap.filter(function(r) {
            return _overlapScore(r, ingSet) >= halfScore;
          }).sort(function(a, b) {
            return Math.abs(a._totalMacros.calories - remaining)
                 - Math.abs(b._totalMacros.calories - remaining);
          });
          next = betterFits.length > 0 ? betterFits[0] : top;
        } else {
          next = top;
        }
      }

      selected.push(next);
      eligible  = eligible.filter(function(r) { return r.id !== next.id; });
      totalCal += next._totalMacros.calories;
    }

    return selected;
  }

  // 5d — Serving division
  function _computeServings(recipe, settings) {
    var targetPerServing = (settings.dailyCalorieTarget - settings.dailyBaselineCalories) / 2;
    var N = Math.round(recipe._totalMacros.calories / targetPerServing);
    N = Math.max(N, 1);
    N = Math.min(N, MAX_SERVINGS);
    if (recipe._totalMacros.calories / N < MIN_SERVING_CAL && N > 1) N--;
    return N;
  }

  // 5e — Daily assignment (Mon–Fri, 2 slots/day; no recipe in both slots same day)
  function _assignDailyMeals(recipesWithServings) {
    var pool = recipesWithServings.map(function(r) {
      return { recipeId: r.recipeId, remaining: r.servings };
    });

    var assignment = {};
    for (var day = 1; day <= 5; day++) assignment[day] = { lunch: null, dinner: null };

    for (var day = 1; day <= 5; day++) {
      pool.sort(function(a, b) { return b.remaining - a.remaining; });

      var lunchId = null;
      for (var j = 0; j < pool.length; j++) {
        if (pool[j].remaining > 0) {
          lunchId = pool[j].recipeId;
          pool[j].remaining--;
          break;
        }
      }
      assignment[day].lunch = lunchId;

      pool.sort(function(a, b) { return b.remaining - a.remaining; });

      for (var k = 0; k < pool.length; k++) {
        if (pool[k].remaining > 0 && pool[k].recipeId !== lunchId) {
          assignment[day].dinner = pool[k].recipeId;
          pool[k].remaining--;
          break;
        }
      }
    }

    var overflow = pool.filter(function(p) { return p.remaining > 0; });
    return { dailyAssignment: assignment, weekendOverflow: overflow };
  }

  // --- Public functions ---

  // 5b/5c/5d/5e — Generate and store a week plan
  function generateWeekPlan(plan, date, settings, pinnedRecipeIds) {
    var d  = new Date(date); d.setHours(12, 0, 0, 0);
    var wi = _weekIndex(plan, d);
    if (wi < 0) return null;

    var cooldowns = storage.readCooldowns();
    var selected  = _selectRecipes(settings, wi, pinnedRecipeIds, cooldowns);
    if (selected.length === 0) return null;

    var servingCounts = {};
    selected.forEach(function(r) { servingCounts[r.id] = _computeServings(r, settings); });

    var result = _assignDailyMeals(selected.map(function(r) {
      return { recipeId: r.id, servings: servingCounts[r.id] };
    }));

    var weekendOverflow = result.weekendOverflow.map(function(o) {
      var recipe = RECIPE_CATALOG[o.recipeId];
      var n      = servingCounts[o.recipeId] || 1;
      return {
        recipeId: o.recipeId,
        count:    o.remaining,
        calsEach: recipe ? Math.round(recipe._totalMacros.calories / n) : 0
      };
    });

    var weekPlan = {
      id:              'week_plan_' + wi,
      weekIndex:       wi,
      recipeIds:       selected.map(function(r) { return r.id; }),
      pinnedRecipeIds: (pinnedRecipeIds || []).slice(),
      servingCounts:   servingCounts,
      dailyAssignment: result.dailyAssignment,
      weekendOverflow: weekendOverflow,
      confirmed:       false,
      generatedAt:     new Date().toISOString()
    };

    var plans = storage.readWeekPlans();
    var idx   = -1;
    for (var i = 0; i < plans.length; i++) {
      if (plans[i].weekIndex === wi) { idx = i; break; }
    }
    if (idx >= 0) { plans[idx] = weekPlan; } else { plans.push(weekPlan); }
    storage.writeWeekPlans(plans);

    return weekPlan;
  }

  function getStoredWeekPlanForDate(plan, date) {
    var wi    = _weekIndex(plan, new Date(date));
    var plans = storage.readWeekPlans();
    for (var i = 0; i < plans.length; i++) {
      if (plans[i].weekIndex === wi) return plans[i];
    }
    return null;
  }

  // 5f — Confirm plan: lock cooldowns, mark confirmed
  function confirmWeekPlan(weekPlanId) {
    var plans = storage.readWeekPlans();
    var wp    = null;
    for (var i = 0; i < plans.length; i++) {
      if (plans[i].id === weekPlanId) { wp = plans[i]; break; }
    }
    if (!wp)          return false;
    if (wp.confirmed) return true; // idempotent

    var cooldowns = storage.readCooldowns();
    wp.recipeIds.forEach(function(id) { cooldowns[id] = wp.weekIndex; });
    storage.writeCooldowns(cooldowns);

    wp.confirmed = true;
    storage.writeWeekPlans(plans);
    return true;
  }

  function buildMealObject(plan, mealWeekIndex) {
    return null; // legacy stub — daily assignment drives meal display
  }

  function getMealsForDate(plan, date, workoutResult) {
    var d   = new Date(date); d.setHours(12, 0, 0, 0);
    var dow = d.getDay(); // 0=Sun 1=Mon … 5=Fri 6=Sat
    if (dow < 1 || dow > 5) return [];

    var wp = getStoredWeekPlanForDate(plan, d);
    if (!wp || !wp.dailyAssignment) return [];

    var daySlots = wp.dailyAssignment[dow];
    if (!daySlots) return [];

    var meals = [];
    ['lunch', 'dinner'].forEach(function(slot) {
      var id = daySlots[slot];
      if (!id) return;
      var recipe   = RECIPE_CATALOG[id];
      if (!recipe) return;
      var n        = wp.servingCounts[id] || 1;
      var calsEach = Math.round(recipe._totalMacros.calories / n);
      var protEach = Math.round(recipe._totalMacros.proteinG  / n);
      meals.push({
        type:     slot.charAt(0).toUpperCase() + slot.slice(1),
        recipeId: id,
        name:     recipe.name,
        desc:     calsEach + ' kcal · ' + protEach + 'g protein',
        link:     recipe.source_url || null
      });
    });

    return meals;
  }

  function getWeekContext(plan, date) {
    var d  = new Date(date); d.setHours(12, 0, 0, 0);
    var wi = Math.max(0, _weekIndex(plan, d));
    var mealWeekIndex = plan.mealCycleIds ? wi % plan.mealCycleIds.length : 0;
    return { mealWeekIndex: mealWeekIndex, weekIndex: wi };
  }

  return {
    generateWeekPlan,
    getStoredWeekPlanForDate,
    confirmWeekPlan,
    buildMealObject,
    getMealsForDate,
    getWeekContext
  };
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

  return { resolveIngredient, isPantryStaple };
})();


// ---- ShoppingListEngine --------------------------------------

const ShoppingListEngine = (function () {

  function buildList(weekPlan, settings) {
    if (!weekPlan || !weekPlan.recipeIds || weekPlan.recipeIds.length === 0) return null;

    // Aggregate ingredient grams across all selected recipes (full batch per recipe)
    var agg = {};
    weekPlan.recipeIds.forEach(function(recipeId) {
      var recipe = RECIPE_CATALOG[recipeId];
      if (!recipe) return;
      recipe._ingredients.forEach(function(ing) {
        var ingredient = INGREDIENT_CATALOG[ing.id];
        if (!ingredient) return;
        if (!agg[ing.id]) {
          agg[ing.id] = {
            ingredientId:   ing.id,
            name:           ingredient.name,
            category:       ingredient.category,
            isPantryStaple: !!ingredient.isPantryStaple,
            totalGrams:     0,
            qtys:           []
          };
        }
        agg[ing.id].totalGrams += ing.grams;
        agg[ing.id].qtys.push(ing.qty || (ing.grams + 'g'));
      });
    });

    var checked   = weekPlan.checkedItems   || [];
    var overrides = weekPlan.pantryOverrides || [];

    var CATEGORY_ORDER = ['protein', 'produce', 'dairy', 'grains', 'pantry', 'spice', 'condiment', 'frozen'];

    var items = Object.values(agg).map(function(a) {
      // Single-recipe ingredient: show its human-readable qty. Multi-recipe: sum in grams.
      var amountStr = a.qtys.length === 1
        ? a.qtys[0]
        : Math.round(a.totalGrams) + 'g';
      return {
        ingredientId:   a.ingredientId,
        name:           a.name,
        category:       a.category,
        isPantryStaple: a.isPantryStaple,
        amountStr:      amountStr,
        checked:        checked.indexOf(a.ingredientId) >= 0,
        pantryOverride: overrides.indexOf(a.ingredientId) >= 0,
        visible:        !a.isPantryStaple || !!(settings && settings.showPantryStaples) || overrides.indexOf(a.ingredientId) >= 0
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
    // Rank must be A, B, or C
    if (!['A','B','C'].includes(recipe.rank)) {
      errors.push('Recipe "' + recipe.id + '" has invalid rank "' + recipe.rank + '"');
    }
    // _totalMacros must have calories
    if (!recipe._totalMacros || typeof recipe._totalMacros.calories !== 'number') {
      errors.push('Recipe "' + recipe.id + '" missing valid _totalMacros.calories');
    }
    // All _ingredients must reference known ingredient IDs
    (recipe._ingredients || []).forEach(ing => {
      if (!INGREDIENT_CATALOG[ing.id]) {
        errors.push('Recipe "' + recipe.id + '" refs unknown ingredient "' + ing.id + '"');
      }
    });
  });

  // Cooldown keys must all be known recipe IDs
  Object.keys(storage.readCooldowns()).forEach(id => {
    if (!RECIPE_CATALOG[id]) {
      errors.push('Cooldown entry for unknown recipe "' + id + '"');
    }
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
