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

  function _getWeekIndex(plan, date) {
    const d = new Date(date); d.setHours(0, 0, 0, 0);
    const s = new Date(plan.startDate); s.setHours(0, 0, 0, 0);
    const ms = d - s;
    if (ms < 0) return -1;
    return Math.floor(ms / (7 * 86400000));
  }

  function isDateInPlan(plan, date) {
    const d     = new Date(date);          d.setHours(0, 0, 0, 0);
    const start = new Date(plan.startDate); start.setHours(0, 0, 0, 0);
    const end   = new Date(plan.endDate);   end.setHours(0, 0, 0, 0);
    return d >= start && d <= end;
  }

  function getWorkoutForDate(plan, date) {
    const d  = new Date(date); d.setHours(12, 0, 0, 0);
    const wi = _getWeekIndex(plan, d);
    if (wi < 0) return null;

    const dow         = d.getDay();
    const peteWk      = wi % plan.tuesdayCycle.ergCycleIds.length;
    const isSpeedWeek = (wi % plan.thursdayRule.speedEveryNWeeks === 0);

    let workoutId, workoutBg, workoutShort, workoutItems;

    if (plan.fixedByDow[dow] !== undefined) {
      workoutId = plan.fixedByDow[dow];
      const wk  = WORKOUT_LIBRARY[workoutId];
      workoutItems = wk.items;
      workoutBg    = wk.bgClass;
      workoutShort = wk.calShort;

    } else if (dow === plan.tuesdayCycle.dow) {
      workoutId     = plan.tuesdayCycle.ergCycleIds[peteWk];
      const ergWk   = WORKOUT_LIBRARY[workoutId];
      const waterWk = WORKOUT_LIBRARY[plan.tuesdayCycle.primaryWorkoutId];
      workoutItems  = [
        ...waterWk.items,
        { t: 'Backup: ' + ergWk.name, d: ergWk.items[0].d + ' (if crew cancelled)' }
      ];
      workoutBg    = 'bg-end';
      workoutShort = 'Endurance / Water';

    } else if (dow === plan.thursdayRule.dow) {
      if (isSpeedWeek) {
        const speedIdx = Math.floor(wi / plan.thursdayRule.speedEveryNWeeks) % plan.thursdayRule.speedCycleIds.length;
        workoutId      = plan.thursdayRule.speedCycleIds[speedIdx];
        const speedWk  = WORKOUT_LIBRARY[workoutId];
        const waterWk  = WORKOUT_LIBRARY[plan.tuesdayCycle.primaryWorkoutId];
        workoutItems   = [
          ...waterWk.items,
          { t: 'Backup: ⚡ Monthly Speed — ' + speedWk.name, d: speedWk.items[0].d }
        ];
        workoutBg    = 'bg-speed';
        workoutShort = 'Speed / Water';
      } else {
        workoutId    = plan.thursdayRule.defaultWorkoutId;
        const wk     = WORKOUT_LIBRARY[workoutId];
        workoutItems = wk.items;
        workoutBg    = wk.bgClass;
        workoutShort = wk.calShort;
      }

    } else if (dow === 6) {
      workoutId    = plan.saturdayWorkoutId;
      const wk     = WORKOUT_LIBRARY[workoutId];
      workoutItems = wk.items;
      workoutBg    = wk.bgClass;
      workoutShort = wk.calShort;
    }

    if (!workoutId) return null;

    return {
      workoutId,
      workoutBg,
      workoutShort,
      workoutItems,
      weekIndex:     wi,
      peteWeek:      peteWk,
      mealWeekIndex: wi % plan.mealCycleIds.length,
      dow,
      isSpeedWeek
    };
  }

  function getTodayContext(plan, date) {
    const d  = new Date(date); d.setHours(12, 0, 0, 0);
    const wf = getWorkoutForDate(plan, d);
    if (!wf) return null;

    const dowNames  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const cuisineId = plan.mealCycleIds[wf.mealWeekIndex];
    const cuisine   = CUISINE_CATALOG[cuisineId];

    return {
      workout:         wf,
      cuisineId,
      cuisineName:     cuisine ? cuisine.name : '',
      dowName:         dowNames[wf.dow],
      peteWeekDisplay: wf.peteWeek + 1
    };
  }

  return { getWorkoutForDate, getTodayContext, isDateInPlan };
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

    // Aggregate ingredient amounts
    var agg = {};
    ids.forEach(function (recipeId) {
      var recipe = RECIPE_CATALOG[recipeId];
      if (!recipe) return;
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
        u[ing.unit] = (u[ing.unit] || 0) + ing.amount;
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

  Object.values(TRAINING_PLANS).forEach(plan => {
    const ids = [
      ...Object.values(plan.fixedByDow || {}),
      ...(plan.tuesdayCycle ? [plan.tuesdayCycle.primaryWorkoutId, ...plan.tuesdayCycle.ergCycleIds] : []),
      ...(plan.thursdayRule ? [plan.thursdayRule.defaultWorkoutId, ...plan.thursdayRule.speedCycleIds] : []),
      plan.saturdayWorkoutId
    ].filter(Boolean);
    ids.forEach(id => {
      if (!WORKOUT_LIBRARY[id]) errors.push('Plan "' + plan.id + '" refs unknown workout "' + id + '"');
    });
  });

  const valid = errors.length === 0;
  if (!valid) console.error('[engine] validateCatalogs:', errors);
  return { valid, errors };
}
