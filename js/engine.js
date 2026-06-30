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
      var restCycleLen = (plan.mealCycleIds && plan.mealCycleIds.length) ? plan.mealCycleIds.length : 1;
      return {
        workoutId:    'wk_restoration',
        workoutBg:    'bg-restore',
        workoutShort: 'Recovery',
        workoutItems: restWk.items || [],
        weekIndex:    wi,
        blockWeek:    wib,
        mealWeekIndex: wi % restCycleLen,
        dow:          dow,
        mobilityBias: null,
        blockId:      block.id,
        blockName:    block.shortName,
        isDeload:     isDeload,
        isTaper:      isTaper,
        type:         'restoration'
      };
    }

    // First Saturday of month → benchmark 6k TT (non-summer blocks only)
    if (dow === 6 && d.getDate() <= 7 && block.benchmarkSat && !useDeload) {
      var bmWk = WORKOUT_LIBRARY[block.benchmarkSat];
      if (bmWk) {
        var mealCycleLenBm = (plan.mealCycleIds && plan.mealCycleIds.length) ? plan.mealCycleIds.length : 1;
        var baseBm = {
          workoutId:     block.benchmarkSat,
          weekIndex:     wi,
          blockWeek:     wib,
          mealWeekIndex: wi % mealCycleLenBm,
          dow:           dow,
          blockId:       block.id,
          blockName:     block.shortName,
          isDeload:      false,
          isTaper:       isTaper,
          isBenchmark:   true
        };
        return Object.assign({}, baseBm, {
          workoutBg:    bmWk.bgClass,
          workoutShort: bmWk.calShort,
          workoutItems: (bmWk.erg && bmWk.erg.items) ? bmWk.erg.items : [],
          mobilityBias: bmWk.mobilityBias || null,
          type:         'hybrid',
          hybrid:       { erg: bmWk.erg || null, clubLog: bmWk.clubLog || null, run: bmWk.run || null }
        });
      }
    }

    // Pick from pool — recovery, hybrid, lift all go through here
    var pool = (useDeload && tmpl.deloadPool) ? tmpl.deloadPool : tmpl.pool;
    if (!pool || pool.length === 0) return null;

    var workoutId = pool[wib % pool.length];
    var wk = WORKOUT_LIBRARY[workoutId];
    if (!wk) return null;

    var mealCycleLen = (plan.mealCycleIds && plan.mealCycleIds.length) ? plan.mealCycleIds.length : 1;
    var base = {
      workoutId:    workoutId,
      weekIndex:    wi,
      blockWeek:    wib,
      mealWeekIndex: wi % mealCycleLen,
      dow:          dow,
      blockId:      block.id,
      blockName:    block.shortName,
      isDeload:     isDeload,
      isTaper:      isTaper
    };

    // Active recovery day (Wed)
    if (wk.type === 'recovery') {
      return Object.assign({}, base, {
        workoutBg:    wk.bgClass,
        workoutShort: wk.calShort,
        workoutItems: wk.items || [],
        mobilityBias: wk.mobilityBias || null,
        type:         'recovery'
      });
    }

    // Hybrid day (Tue/Thu/Sat) — three-way card: erg + club + run
    if (wk.type === 'hybrid') {
      var mobBias = (tmpl.noMobility || wk.mobilityBias === null) ? null
        : (wk.mobilityBias || tmpl.mobilityBias || null);
      return Object.assign({}, base, {
        workoutBg:    wk.bgClass,
        workoutShort: wk.calShort,
        workoutItems: (wk.erg && wk.erg.items) ? wk.erg.items : [],
        mobilityBias: mobBias,
        type:         'hybrid',
        hybrid:       {
          erg:     wk.erg     || null,
          clubLog: wk.clubLog || null,
          run:     wk.run     || null
        }
      });
    }

    // Lift day (Mon/Fri) — two-way card: primary + travel
    if (wk.type === 'lift') {
      return Object.assign({}, base, {
        workoutBg:    wk.bgClass || 'bg-lift',
        workoutShort: wk.calShort,
        workoutItems: (wk.primary && wk.primary.items) ? wk.primary.items : [],
        mobilityBias: tmpl.mobilityBias || wk.mobilityBias || null,
        logSession:   tmpl.logSession   || wk.logSession   || null,
        type:         'lift',
        lift:         {
          primary: wk.primary || null,
          travel:  wk.travel  || null
        }
      });
    }

    // Generic fallback (future-proofing)
    return Object.assign({}, base, {
      workoutBg:    wk.bgClass,
      workoutShort: wk.calShort,
      workoutItems: wk.items || [],
      mobilityBias: wk.mobilityBias || null,
      type:         wk.type
    });
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
      if (!r.rank || !COOLDOWN_THRESHOLDS[r.rank]) return false; // skip rankless recipes
      if (excl[r.id]) return false;
      var last      = cooldowns[r.id] != null ? cooldowns[r.id] : null;
      if (last === null) return true;
      var threshold = COOLDOWN_THRESHOLDS[r.rank] || 4;
      return (currentWeek - last) >= threshold;
    });
  }

  // 5c — Recipe selection loop
  // extraExcludeIds: session-level exclusions (regenerate cycling, swap)
  function _selectRecipes(settings, currentWeek, pinnedRecipeIds, cooldowns, extraExcludeIds) {
    var pinnedIds  = pinnedRecipeIds || [];
    var pinned     = pinnedIds.map(function(id) { return RECIPE_CATALOG[id]; }).filter(Boolean);
    var selected   = pinned.slice();
    var totalCal   = selected.reduce(function(s, r) { return s + r._totalMacros.calories; }, 0);
    var target     = (settings.dailyCalorieTarget - settings.dailyBaselineCalories) * 5;
    var excludeAll = pinnedIds.concat(extraExcludeIds || []);

    var eligible   = _eligibleRecipes(currentWeek, excludeAll, cooldowns);

    while (selected.length < MINIMUM_RECIPES || totalCal < target) {
      if (eligible.length === 0) break;

      var ingSet = _ingIdSet(selected);
      var next;

      if (selected.length === 0) {
        // Anchor: random pick within the highest available rank tier.
        // Randomising here cascades into different overlap scores for all subsequent picks,
        // giving genuine variety across regenerations without sacrificing rank preference.
        var TIER_ORDER = ['A', 'B', 'C'];
        next = null;
        for (var t = 0; t < TIER_ORDER.length && !next; t++) {
          var tier = eligible.filter(function(r) { return r.rank === TIER_ORDER[t]; });
          if (tier.length > 0) next = tier[Math.floor(Math.random() * tier.length)];
        }
        if (!next) next = eligible[Math.floor(Math.random() * eligible.length)];

      } else if (totalCal >= target) {
        // MODE A: calorie target met, still need minimum recipe count — pick smallest-calorie.
        // Random tiebreaker at the end so equal-calorie candidates rotate.
        next = eligible.slice().sort(function(a, b) {
          var calDiff = a._totalMacros.calories - b._totalMacros.calories;
          if (calDiff !== 0) return calDiff;
          var oDiff = _overlapScore(b, ingSet) - _overlapScore(a, ingSet);
          if (oDiff   !== 0) return oDiff;
          return Math.random() - 0.5;
        })[0];

      } else {
        // MODE B: calorie target not yet met — prefer overlap, then rank, then random.
        var remaining = target - totalCal;
        var byOverlap = eligible.slice().sort(function(a, b) {
          var oDiff = _overlapScore(b, ingSet) - _overlapScore(a, ingSet);
          if (oDiff !== 0) return oDiff;
          var rDiff = (RANK_PRIORITY[a.rank] || 1) - (RANK_PRIORITY[b.rank] || 1);
          if (rDiff !== 0) return rDiff;
          return Math.random() - 0.5;
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
  function generateWeekPlan(plan, date, settings, pinnedRecipeIds, excludeRecipeIds) {
    var d  = new Date(date); d.setHours(12, 0, 0, 0);
    var wi = _weekIndex(plan, d);
    if (wi < 0) return null;

    var cooldowns = storage.readCooldowns();
    var selected  = _selectRecipes(settings, wi, pinnedRecipeIds, cooldowns, excludeRecipeIds || []);
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
        link:     recipe.source || null
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
        // Fallback: title-case the ID so uncatalogued items still appear
        var name     = (ingredient && ingredient.name) ? ingredient.name
          : ing.id.replace(/_/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
        var category = (ingredient && ingredient.category) ? ingredient.category : 'pantry';
        if (!agg[ing.id]) {
          agg[ing.id] = {
            ingredientId: ing.id,
            name:         name,
            category:     category,
            totalGrams:   0,
            qtys:         []
          };
        }
        if (ing.grams != null) agg[ing.id].totalGrams += ing.grams;
        agg[ing.id].qtys.push(ing.qty || (ing.grams != null ? ing.grams + 'g' : ''));
      });
    });

    var checked = weekPlan.checkedItems || [];

    var CATEGORY_ORDER = ['protein', 'produce', 'dairy', 'grains', 'pantry', 'spice', 'condiment', 'frozen'];

    var items = Object.values(agg).map(function(a) {
      // Collapse duplicate qty strings (e.g. two recipes both need "1 medium" → "2× 1 medium").
      // Different qtys are joined with " + " so the shopper sees every call-out.
      var qtyCount = {};
      a.qtys.forEach(function(q) { qtyCount[q] = (qtyCount[q] || 0) + 1; });
      var amountStr = Object.keys(qtyCount).map(function(q) {
        return qtyCount[q] > 1 ? qtyCount[q] + '× ' + q : q;
      }).join(' + ');
      return {
        ingredientId: a.ingredientId,
        name:         a.name,
        category:     a.category,
        amountStr:    amountStr,
        checked:      checked.indexOf(a.ingredientId) >= 0,
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

  // Percentages of MaxHR — C2 / British Rowing consensus, anchored to
  // VT1 (~70% HRmax, Lucía et al. 2000) and VT2 (~87% HRmax).
  var ZONES_PCT_MAX = [
    { label: 'UT2', name: 'Aerobic Base', minPct: 0.60, maxPct: 0.70 },
    { label: 'UT1', name: 'Aerobic',      minPct: 0.70, maxPct: 0.80 },
    { label: 'AT',  name: 'Threshold',    minPct: 0.80, maxPct: 0.87 },
    { label: 'TR',  name: 'Transport',    minPct: 0.87, maxPct: 0.93 },
    { label: 'AN',  name: 'Anaerobic',    minPct: 0.93, maxPct: 1.00 },
  ];

  // Percentages of Heart Rate Reserve (Karvonen formula).
  // %HRR ≈ %VO2R (Swain & Franklin, Med Sci Sports Exerc 2002).
  // ACSM moderate = 40–59% HRR, vigorous = 60–89% HRR.
  var ZONES_HRR = [
    { label: 'UT2', name: 'Aerobic Base', minPct: 0.40, maxPct: 0.60 },
    { label: 'UT1', name: 'Aerobic',      minPct: 0.60, maxPct: 0.70 },
    { label: 'AT',  name: 'Threshold',    minPct: 0.70, maxPct: 0.80 },
    { label: 'TR',  name: 'Transport',    minPct: 0.80, maxPct: 0.90 },
    { label: 'AN',  name: 'Anaerobic',    minPct: 0.90, maxPct: 1.00 },
  ];

  // Tanaka formula: 208 − (0.7 × age). Uses knownMaxHR when valid.
  function getMaxHR(age, knownMaxHR) {
    if (knownMaxHR && knownMaxHR >= 100 && knownMaxHR <= 220) return Math.round(knownMaxHR);
    if (age        && age >= 15          && age        <= 90)  return Math.round(208 - (0.7 * age));
    return null;
  }

  // mode: 'pctMax' (default) | 'hrr'
  // restingHR required for HRR; falls back to pctMax if missing.
  function getZones(age, knownMaxHR, restingHR, mode) {
    var maxHR  = getMaxHR(age, knownMaxHR);
    if (!maxHR) return null;

    var useHRR = mode === 'hrr'
      && restingHR >= 30
      && restingHR < maxHR;
    var zones  = useHRR ? ZONES_HRR : ZONES_PCT_MAX;
    var hrr    = useHRR ? (maxHR - restingHR) : null;

    return zones.map(function(z) {
      var minBPM = useHRR
        ? Math.round(restingHR + z.minPct * hrr)
        : Math.round(maxHR * z.minPct);
      var maxBPM = useHRR
        ? Math.round(restingHR + z.maxPct * hrr)
        : Math.round(maxHR * z.maxPct);
      return {
        label:  z.label,
        name:   z.name,
        minPct: z.minPct,
        maxPct: z.maxPct,
        minBPM: minBPM,
        maxBPM: maxBPM,
        mode:   useHRR ? 'hrr' : 'pctMax',
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
