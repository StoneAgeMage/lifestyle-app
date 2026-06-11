// ============================================================
// SAUCES — renders the Sauces & Prep tab
// Phase 6: prepSections inlined here; data.js dependency removed.
// Depends on: engine.js (_fmtAmt), CUISINE_CATALOG, RECIPE_CATALOG,
//   INGREDIENT_CATALOG, TRAINING_PLANS, ACTIVE_PLAN_ID
// ============================================================

var _prepSections = [
  {title:'① Brown Rice', items:[
    '2 cups dry → 4–5 cups cooked. Start first — 45 min hands-off.',
    'Portion into 5 lunch containers once cool.',
    'Can swap for jasmine rice on Thai week.'
  ]},
  {title:'② Roasted Veg (2 pans)', items:[
    'Pan 1: sweet potato + broccoli. 400°F, 25 min.',
    'Pan 2: cherry tomatoes + zucchini or bell pepper. 425°F, 20 min.',
    'Season with olive oil + salt only — sauce flavors everything later.'
  ]},
  {title:'③ Overnight Oats (×5)', items:[
    '5 mason jars: ½c rolled oats + 1c soy milk + 1 tbsp chia seeds + 1 tsp honey.',
    'Soy milk base gives ~7g protein per jar plus creaminess without dairy.',
    'Refrigerate unsealed — add fresh toppings each morning (fruit, nut butter, granola, banana, etc.).',
    'Takes 10 min. Do this while the grains cook.'
  ]},
  {title:'④ Trail Mix Batch (weekly)', items:[
    'Ratio: 2 parts pistachios · 1 part almonds or cashews · 1 part pumpkin seeds · 1 part dried cherries or cranberries · ½ part dark chocolate chips (70%+) · ½ part unsweetened coconut flakes.',
    'Serving: 1.5 oz / 42g (~¼ cup heaping). ~200 cal, 6–7g protein.',
    'Weekly batch = 7 servings (~10.5 oz). Store in a jar. Portion into a small bag each morning.',
    'Toast the coconut flakes and pumpkin seeds in a dry pan 3–4 min first for better flavor.'
  ]},
  {title:'⑤ Snack & Evening Prep', items:[
    'Portion edamame: buy frozen steam-in-bag. Microwave a bag each day — no Sunday prep needed.',
    'Roasted chickpeas (optional batch): 1 can drained, toss with olive oil + spice, roast 400°F 25–30 min. Good crunchy desk snack alternative.',
    'Evening dessert: keep a bag of whole-grain granola and soy milk in the pantry. ¼c each, ~150 cal. No prep needed.',
    'String cheese (1–2/day, ~7g protein each) is a convenient backup snack for high-training days.'
  ]},
  {title:'⑥ Sheet Pan Protein', items:[
    'Marinate in week\'s sauce 30 min–overnight.',
    'Roast per recipe. 4 servings: 2 dinners + 2 into lunch bowls.',
    'Can marinate Sunday, roast fresh on a weeknight.'
  ]},
  {title:'⑦ One-Pot Veg Meal', items:[
    'Serves 4: 2 dinners + 2 portions into bowls.',
    'Curries and stews taste better on days 2–3.',
    'Freeze a batch every few weeks to skip this step.'
  ]},
  {title:'⑧ Week\'s Sauce', items:[
    'Double batch (~1 cup): half for bowl drizzle, half as marinade.',
    'Store in a mason jar in fridge. Lasts the full week.',
    'See each week\'s recipe in the Sauces tab.'
  ]}
];

function _sauceIngHtml(ing) {
  var ingredient = INGREDIENT_CATALOG[ing.ingredientId];
  if (!ingredient) return '';
  var amt  = '<strong>' + _fmtAmt(ing.amount) + ' ' + ing.unit + '</strong>';
  var name = ingredient.name + (ing.note ? ', <em>' + ing.note + '</em>' : '');
  return amt + ' ' + name + (ing.optional ? ' <em>(optional)</em>' : '');
}

function renderSauces() {
  var plan = TRAINING_PLANS[ACTIVE_PLAN_ID];

  document.getElementById('allSauces').innerHTML = plan.mealCycleIds.map(function (cuisineId, i) {
    var cuisine = CUISINE_CATALOG[cuisineId];
    if (!cuisine) return '';

    var sauceRecipes = cuisine.recipeIds
      .map(function (id) { return RECIPE_CATALOG[id]; })
      .filter(function (r) {
        return r && (r.mealTypes.indexOf('sauce') >= 0 || r.mealTypes.indexOf('marinade') >= 0);
      });

    if (sauceRecipes.length === 0) return '';

    var cards = sauceRecipes.map(function (r) {
      var ingsHtml = r.ingredients.map(_sauceIngHtml).filter(Boolean).join(' · ');
      var tag = r.tag || (r.mealTypes.indexOf('marinade') >= 0 ? 'Marinade' : 'Dressing');
      return '<div class="sc">' +
        '<div class="sch ' + cuisine.colorClass + '">' +
          '<span class="sct">' + r.name + '</span>' +
          '<span class="scta">' + tag + '</span>' +
        '</div>' +
        '<div class="scb">' +
          '<div class="sci">' + ingsHtml + '</div>' +
          (r.method ? '<div class="scm">' + r.method + '</div>' : '') +
          (r.link ? '<div class="scl"><a href="' + r.link + '" target="_blank" rel="noopener">🔗 Recipe</a></div>' : '') +
        '</div>' +
      '</div>';
    }).join('');

    return '<div class="sh" style="margin-top:6px"><h2>Week ' + (i + 1) + ' — ' + cuisine.name + ' Sauces</h2></div>' +
           '<div class="sg">' + cards + '</div>';
  }).join('');

  document.getElementById('prepGrid').innerHTML = _prepSections.map(function (s) {
    return '<div class="prepc"><h3>' + s.title + '</h3>' +
      s.items.map(function (item) {
        return '<div class="pi"><div class="pd"></div>' + item + '</div>';
      }).join('') +
    '</div>';
  }).join('');
}
