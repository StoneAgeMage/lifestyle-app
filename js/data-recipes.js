// ============================================================
// DATA-RECIPES — recipe catalog for current 4-cuisine rotation
// Phase 2. All ingredientId values must exist in INGREDIENT_CATALOG.
// mealTypes: 'dinner' | 'sauce' | 'marinade' | 'breakfast' | 'snack'
// Amounts use vocabulary: tbsp, tsp, cup, oz, lb, g, whole, clove, bunch
// ============================================================

const RECIPE_CATALOG = {

  // ============================================================
  // ASIAN WEEK
  // ============================================================

  sesame_ginger_dressing: {
    id: 'sesame_ginger_dressing',
    name: 'Sesame-Ginger Dressing',
    cuisineId: 'asian',
    mealTypes: ['sauce'],
    sauceType: 'dressing',
    isVeg: true,
    servings: 4,
    proteinG: null,
    link: 'https://www.ambitiouskitchen.com/sesame-ginger-dressing/',
    tag: 'Grain Bowls',
    method: 'Whisk all ingredients in a jar. Stores 1 week. Double batch covers bowls + marinade.',
    ingredients: [
      { ingredientId:'soy_sauce',    amount:2, unit:'tbsp' },
      { ingredientId:'sesame_oil',   amount:1, unit:'tbsp' },
      { ingredientId:'rice_vinegar', amount:1, unit:'tbsp' },
      { ingredientId:'olive_oil',    amount:1, unit:'tbsp' },
      { ingredientId:'fresh_ginger', amount:1, unit:'tsp'  },
      { ingredientId:'maple_syrup',  amount:1, unit:'tsp'  },
      { ingredientId:'garlic',       amount:1, unit:'clove' },
      { ingredientId:'tahini',       amount:1, unit:'tbsp', optional:true }
    ]
  },

  sesame_soy_marinade: {
    id: 'sesame_soy_marinade',
    name: 'Sesame-Soy Marinade',
    cuisineId: 'asian',
    mealTypes: ['marinade'],
    isVeg: true,
    servings: 4,
    proteinG: null,
    link: null,
    tag: 'Chicken & Salmon',
    method: 'Whisk together. Marinate chicken 1–8 hrs, salmon 15–30 min.',
    ingredients: [
      { ingredientId:'soy_sauce',    amount:3, unit:'tbsp'  },
      { ingredientId:'sesame_oil',   amount:1, unit:'tbsp'  },
      { ingredientId:'rice_vinegar', amount:1, unit:'tbsp'  },
      { ingredientId:'maple_syrup',  amount:1, unit:'tbsp'  },
      { ingredientId:'garlic',       amount:2, unit:'clove' },
      { ingredientId:'fresh_ginger', amount:1, unit:'tsp'   },
      { ingredientId:'sriracha',     amount:1, unit:'tsp',   optional:true }
    ]
  },

  sesame_chicken: {
    id: 'sesame_chicken',
    name: 'Sheet Pan Sesame Chicken',
    cuisineId: 'asian',
    mealTypes: ['dinner'],
    isVeg: false,
    servings: 4,
    proteinG: 41,
    prepMins: 10,
    cookMins: 30,
    link: 'https://www.ambitiouskitchen.com/sheet-pan-sesame-chicken/',
    desc: 'Sesame-soy sauce, asparagus, bell pepper, cashews. Serve over rice.',
    protStr: '~41g',
    ingredients: [
      { ingredientId:'chicken_thigh', amount:2,    unit:'lb'   },
      { ingredientId:'asparagus',     amount:1,    unit:'bunch'},
      { ingredientId:'bell_pepper',   amount:2,    unit:'whole'},
      { ingredientId:'cashews',       amount:0.25, unit:'cup'  },
      { ingredientId:'soy_sauce',     amount:3,    unit:'tbsp' },
      { ingredientId:'sesame_oil',    amount:2,    unit:'tbsp' },
      { ingredientId:'rice_vinegar',  amount:1,    unit:'tbsp' },
      { ingredientId:'maple_syrup',   amount:1,    unit:'tbsp' },
      { ingredientId:'garlic',        amount:3,    unit:'clove'},
      { ingredientId:'fresh_ginger',  amount:1,    unit:'tbsp' },
      { ingredientId:'brown_rice',    amount:1.5,  unit:'cup', note:'for serving' }
    ]
  },

  tofu_cashew_curry: {
    id: 'tofu_cashew_curry',
    name: 'Tofu Cashew Coconut Curry',
    cuisineId: 'asian',
    mealTypes: ['dinner'],
    isVeg: true,
    servings: 4,
    proteinG: 18,
    prepMins: 15,
    cookMins: 30,
    link: 'https://www.ambitiouskitchen.com/vegetarian-tofu-cashew-coconut-curry/',
    desc: 'Crispy tofu, sweet potato, cauliflower. Ascent shake tonight.',
    protStr: '~18g+shake',
    ingredients: [
      { ingredientId:'firm_tofu',       amount:14,  unit:'oz'   },
      { ingredientId:'sweet_potato',    amount:2,   unit:'whole'},
      { ingredientId:'cauliflower',     amount:1,   unit:'whole'},
      { ingredientId:'cashews',         amount:0.5, unit:'cup'  },
      { ingredientId:'coconut_milk_can',amount:2,   unit:'whole'},
      { ingredientId:'soy_sauce',       amount:2,   unit:'tbsp' },
      { ingredientId:'sesame_oil',      amount:1,   unit:'tbsp' },
      { ingredientId:'garlic',          amount:3,   unit:'clove'},
      { ingredientId:'fresh_ginger',    amount:1,   unit:'tbsp' },
      { ingredientId:'brown_rice',      amount:1.5, unit:'cup', note:'for serving' }
    ]
  },

  // ============================================================
  // MEDITERRANEAN WEEK
  // ============================================================

  lemon_herb_tahini: {
    id: 'lemon_herb_tahini',
    name: 'Lemon-Herb Tahini Dressing',
    cuisineId: 'mediterranean',
    mealTypes: ['sauce'],
    sauceType: 'dressing',
    isVeg: true,
    servings: 4,
    proteinG: null,
    link: 'https://plantbasedjess.com/lemon-herb-tahini-dressing/',
    tag: 'Grain Bowls',
    method: 'Whisk tahini + lemon (it\'ll seize — keep going). Thin with cold water 1 tbsp at a time until pourable. Stores 5–7 days.',
    ingredients: [
      { ingredientId:'tahini',   amount:0.25, unit:'cup'  },
      { ingredientId:'lemon',    amount:3,    unit:'tbsp', note:'juice (~1 lemon)' },
      { ingredientId:'garlic',   amount:1,    unit:'clove'},
      { ingredientId:'parsley',  amount:2,    unit:'tbsp' },
      { ingredientId:'salt',     amount:0.25, unit:'tsp'  }
    ]
  },

  moroccan_marinade: {
    id: 'moroccan_marinade',
    name: 'Moroccan Spice Marinade',
    cuisineId: 'mediterranean',
    mealTypes: ['marinade'],
    isVeg: true,
    servings: 4,
    proteinG: null,
    link: 'https://www.ambitiouskitchen.com/sheet-pan-moroccan-chicken/',
    tag: 'Chicken',
    method: 'Whisk into a paste. Rub over chicken thighs, marinate 30 min–overnight.',
    ingredients: [
      { ingredientId:'olive_oil',    amount:2,    unit:'tbsp' },
      { ingredientId:'lemon',        amount:1,    unit:'tbsp', note:'juice' },
      { ingredientId:'cumin',        amount:1,    unit:'tsp'  },
      { ingredientId:'turmeric',     amount:1,    unit:'tsp'  },
      { ingredientId:'cinnamon',     amount:0.5,  unit:'tsp'  },
      { ingredientId:'garlic_powder',amount:0.5,  unit:'tsp'  },
      { ingredientId:'cayenne',      amount:0.25, unit:'tsp'  },
      { ingredientId:'salt',         amount:0.5,  unit:'tsp'  }
    ]
  },

  moroccan_chicken: {
    id: 'moroccan_chicken',
    name: 'Sheet Pan Moroccan Chicken',
    cuisineId: 'mediterranean',
    mealTypes: ['dinner'],
    isVeg: false,
    servings: 4,
    proteinG: 41,
    prepMins: 15,
    cookMins: 35,
    link: 'https://www.ambitiouskitchen.com/sheet-pan-moroccan-chicken/',
    desc: 'Cumin-turmeric-cinnamon spice blend, sweet potato, cauliflower, feta yogurt drizzle.',
    protStr: '~41g',
    ingredients: [
      { ingredientId:'chicken_thigh', amount:2,    unit:'lb'   },
      { ingredientId:'sweet_potato',  amount:2,    unit:'whole'},
      { ingredientId:'cauliflower',   amount:1,    unit:'whole'},
      { ingredientId:'olive_oil',     amount:3,    unit:'tbsp' },
      { ingredientId:'cumin',         amount:1,    unit:'tsp'  },
      { ingredientId:'turmeric',      amount:1,    unit:'tsp'  },
      { ingredientId:'cinnamon',      amount:0.5,  unit:'tsp'  },
      { ingredientId:'cayenne',       amount:0.25, unit:'tsp'  },
      { ingredientId:'garlic',        amount:4,    unit:'clove'},
      { ingredientId:'lemon',         amount:2,    unit:'whole'},
      { ingredientId:'feta_cheese',   amount:0.25, unit:'cup', note:'for serving, optional' },
      { ingredientId:'greek_yogurt',  amount:0.25, unit:'cup', note:'for drizzle, optional' }
    ]
  },

  tomato_lentil_soup: {
    id: 'tomato_lentil_soup',
    name: 'Creamy Tomato Lentil Soup',
    cuisineId: 'mediterranean',
    mealTypes: ['dinner'],
    isVeg: true,
    servings: 4,
    proteinG: 12,
    prepMins: 10,
    cookMins: 30,
    link: 'https://www.ambitiouskitchen.com/coconut-tomato-lentil-soup/',
    desc: 'Red lentils, coconut milk, cumin, turmeric. Pita on side. Ascent shake.',
    protStr: '~12g+shake',
    ingredients: [
      { ingredientId:'red_lentils',     amount:1.5, unit:'cup'  },
      { ingredientId:'canned_tomatoes', amount:2,   unit:'whole'},
      { ingredientId:'coconut_milk_can',amount:1,   unit:'whole'},
      { ingredientId:'onion',           amount:1,   unit:'whole'},
      { ingredientId:'garlic',          amount:4,   unit:'clove'},
      { ingredientId:'cumin',           amount:2,   unit:'tsp'  },
      { ingredientId:'turmeric',        amount:1,   unit:'tsp'  },
      { ingredientId:'olive_oil',       amount:2,   unit:'tbsp' },
      { ingredientId:'pita_bread',      amount:4,   unit:'whole', note:'for serving' }
    ]
  },

  // ============================================================
  // MEXICAN WEEK
  // ============================================================

  cilantro_lime_dressing: {
    id: 'cilantro_lime_dressing',
    name: 'Cilantro-Lime Dressing',
    cuisineId: 'mexican',
    mealTypes: ['sauce'],
    sauceType: 'dressing',
    isVeg: true,
    servings: 4,
    proteinG: null,
    link: 'https://www.ambitiouskitchen.com/cilantro-lime-dressing/',
    tag: 'Grain Bowls',
    method: 'Blend or food-process until smooth. Stores 4–5 days (2 weeks without avocado).',
    ingredients: [
      { ingredientId:'cilantro',    amount:1,    unit:'cup', note:'packed' },
      { ingredientId:'olive_oil',   amount:3,    unit:'tbsp' },
      { ingredientId:'lime',        amount:3,    unit:'tbsp', note:'juice (~2 limes)' },
      { ingredientId:'garlic',      amount:1,    unit:'clove' },
      { ingredientId:'coriander',   amount:0.5,  unit:'tsp'  },
      { ingredientId:'maple_syrup', amount:1,    unit:'tsp'  },
      { ingredientId:'salt',        amount:0.25, unit:'tsp'  },
      { ingredientId:'jalapeno',    amount:0.5,  unit:'whole', optional:true }
    ]
  },

  sazon_marinade: {
    id: 'sazon_marinade',
    name: 'Sazon Marinade',
    cuisineId: 'mexican',
    mealTypes: ['marinade'],
    isVeg: true,
    servings: 4,
    proteinG: null,
    link: 'https://www.ambitiouskitchen.com/sazon-grilled-chicken-thighs/',
    tag: 'Chicken',
    method: 'Mix into a paste. Rub over chicken thighs, marinate 30 min–24 hrs.',
    ingredients: [
      { ingredientId:'olive_oil',    amount:1,    unit:'tbsp' },
      { ingredientId:'cumin',        amount:1,    unit:'tsp'  },
      { ingredientId:'coriander',    amount:1,    unit:'tsp'  },
      { ingredientId:'turmeric',     amount:0.5,  unit:'tsp'  },
      { ingredientId:'garlic_powder',amount:0.5,  unit:'tsp'  },
      { ingredientId:'dried_oregano',amount:0.5,  unit:'tsp'  },
      { ingredientId:'cayenne',      amount:0.25, unit:'tsp'  },
      { ingredientId:'salt',         amount:0.5,  unit:'tsp'  }
    ]
  },

  sazon_chicken: {
    id: 'sazon_chicken',
    name: 'Sazon Grilled Chicken Thighs',
    cuisineId: 'mexican',
    mealTypes: ['dinner'],
    isVeg: false,
    servings: 4,
    proteinG: 34,
    prepMins: 10,
    cookMins: 25,
    link: 'https://www.ambitiouskitchen.com/sazon-grilled-chicken-thighs/',
    desc: 'Homemade sazon: cumin, coriander, turmeric, garlic, oregano. Bowls or tacos.',
    protStr: '~34g',
    ingredients: [
      { ingredientId:'chicken_thigh', amount:2,    unit:'lb'   },
      { ingredientId:'olive_oil',     amount:2,    unit:'tbsp' },
      { ingredientId:'cumin',         amount:2,    unit:'tsp'  },
      { ingredientId:'coriander',     amount:1,    unit:'tsp'  },
      { ingredientId:'turmeric',      amount:0.5,  unit:'tsp'  },
      { ingredientId:'garlic_powder', amount:1,    unit:'tsp'  },
      { ingredientId:'dried_oregano', amount:0.5,  unit:'tsp'  },
      { ingredientId:'cayenne',       amount:0.25, unit:'tsp'  },
      { ingredientId:'salt',          amount:1,    unit:'tsp'  },
      { ingredientId:'brown_rice',    amount:1.5,  unit:'cup', note:'for serving' }
    ]
  },

  sweet_potato_lentil_stew: {
    id: 'sweet_potato_lentil_stew',
    name: 'Coconut Sweet Potato & Lentil Stew',
    cuisineId: 'mexican',
    mealTypes: ['dinner'],
    isVeg: true,
    servings: 4,
    proteinG: 12,
    prepMins: 10,
    cookMins: 30,
    link: 'https://www.ambitiouskitchen.com/coconut-curried-sweet-potato-and-lentil-stew/',
    desc: 'Sweet potato, lentils, coconut milk, curry + ginger. Ascent shake.',
    protStr: '~12g+shake',
    ingredients: [
      { ingredientId:'sweet_potato',    amount:2,    unit:'whole'},
      { ingredientId:'red_lentils',     amount:1,    unit:'cup'  },
      { ingredientId:'coconut_milk_can',amount:1,    unit:'whole'},
      { ingredientId:'canned_tomatoes', amount:1,    unit:'whole'},
      { ingredientId:'onion',           amount:1,    unit:'whole'},
      { ingredientId:'garlic',          amount:4,    unit:'clove'},
      { ingredientId:'fresh_ginger',    amount:1,    unit:'tbsp' },
      { ingredientId:'cumin',           amount:1,    unit:'tsp'  },
      { ingredientId:'coriander',       amount:1,    unit:'tsp'  },
      { ingredientId:'turmeric',        amount:0.5,  unit:'tsp'  },
      { ingredientId:'cayenne',         amount:0.25, unit:'tsp'  },
      { ingredientId:'olive_oil',       amount:2,    unit:'tbsp' }
    ]
  },

  // ============================================================
  // THAI WEEK
  // ============================================================

  thai_peanut_dressing: {
    id: 'thai_peanut_dressing',
    name: 'Thai Peanut Dressing',
    cuisineId: 'thai',
    mealTypes: ['sauce'],
    sauceType: 'dressing',
    isVeg: true,
    servings: 4,
    proteinG: null,
    link: 'https://www.ambitiouskitchen.com/healthy-thai-peanut-dressing/',
    tag: 'Grain Bowls',
    method: 'Whisk all together or shake in a mason jar. Thin with warm water 1 tbsp at a time. Stores 1 week.',
    ingredients: [
      { ingredientId:'peanut_butter', amount:3, unit:'tbsp'  },
      { ingredientId:'soy_sauce',     amount:2, unit:'tbsp'  },
      { ingredientId:'rice_vinegar',  amount:2, unit:'tbsp'  },
      { ingredientId:'sesame_oil',    amount:1, unit:'tbsp'  },
      { ingredientId:'honey',         amount:1, unit:'tbsp'  },
      { ingredientId:'fresh_ginger',  amount:1, unit:'tsp'   },
      { ingredientId:'garlic',        amount:1, unit:'clove' }
    ]
  },

  thai_basil_sauce: {
    id: 'thai_basil_sauce',
    name: 'Thai Basil Chicken Sauce',
    cuisineId: 'thai',
    mealTypes: ['sauce', 'marinade'],
    sauceType: 'stir-fry',
    isVeg: false,
    servings: 4,
    proteinG: null,
    link: 'https://www.americastestkitchen.com/recipes/5032-thai-style-chicken-with-basil',
    tag: 'Chicken Stir-Fry',
    method: 'Whisk before cooking. Add to stir-fried chicken in last 2 min. Stir in fresh basil leaves off heat.',
    ingredients: [
      { ingredientId:'fish_sauce',   amount:2, unit:'tbsp'  },
      { ingredientId:'oyster_sauce', amount:1, unit:'tbsp'  },
      { ingredientId:'white_vinegar',amount:1, unit:'tsp'   },
      { ingredientId:'sugar',        amount:1, unit:'tbsp'  },
      { ingredientId:'thai_chili',   amount:4, unit:'whole' },
      { ingredientId:'garlic',       amount:3, unit:'clove' }
    ]
  },

  thai_basil_chicken: {
    id: 'thai_basil_chicken',
    name: 'Thai Basil Chicken',
    cuisineId: 'thai',
    mealTypes: ['dinner'],
    isVeg: false,
    servings: 4,
    proteinG: 38,
    prepMins: 10,
    cookMins: 15,
    link: 'https://www.americastestkitchen.com/recipes/5032-thai-style-chicken-with-basil',
    desc: 'Ground or sliced chicken, oyster sauce, fish sauce, Thai basil, chili, over jasmine rice.',
    protStr: '~38g',
    ingredients: [
      { ingredientId:'ground_chicken', amount:1.5, unit:'lb'   },
      { ingredientId:'thai_basil',     amount:1,   unit:'bunch'},
      { ingredientId:'thai_chili',     amount:6,   unit:'whole'},
      { ingredientId:'garlic',         amount:6,   unit:'clove'},
      { ingredientId:'fish_sauce',     amount:2,   unit:'tbsp' },
      { ingredientId:'oyster_sauce',   amount:1,   unit:'tbsp' },
      { ingredientId:'white_vinegar',  amount:1,   unit:'tsp'  },
      { ingredientId:'sugar',          amount:1,   unit:'tbsp' },
      { ingredientId:'sesame_oil',     amount:2,   unit:'tbsp' },
      { ingredientId:'jasmine_rice',   amount:2,   unit:'cup', note:'for serving' }
    ]
  },

  thai_peanut_curry: {
    id: 'thai_peanut_curry',
    name: 'Thai Peanut Cauliflower Chickpea Curry',
    cuisineId: 'thai',
    mealTypes: ['dinner'],
    isVeg: true,
    servings: 4,
    proteinG: 15,
    prepMins: 10,
    cookMins: 30,
    link: 'https://www.ambitiouskitchen.com/thai-peanut-coconut-cauliflower-chickpea-curry/',
    desc: 'Coconut milk, red curry paste, peanut butter, cauliflower, chickpeas. Ascent shake.',
    protStr: '~15g+shake',
    ingredients: [
      { ingredientId:'cauliflower',     amount:1,   unit:'whole'},
      { ingredientId:'canned_chickpeas',amount:2,   unit:'whole'},
      { ingredientId:'coconut_milk_can',amount:2,   unit:'whole'},
      { ingredientId:'red_curry_paste', amount:3,   unit:'tbsp' },
      { ingredientId:'peanut_butter',   amount:3,   unit:'tbsp' },
      { ingredientId:'soy_sauce',       amount:2,   unit:'tbsp' },
      { ingredientId:'lime',            amount:2,   unit:'whole'},
      { ingredientId:'garlic',          amount:3,   unit:'clove'},
      { ingredientId:'fresh_ginger',    amount:1,   unit:'tbsp' },
      { ingredientId:'brown_rice',      amount:1.5, unit:'cup', note:'for serving' }
    ]
  },

  // ============================================================
  // BASE WEEKLY PREP (all cuisines)
  // ============================================================

  overnight_oats_base: {
    id: 'overnight_oats_base',
    name: 'Overnight Oats (×5 jars)',
    cuisineId: null,
    mealTypes: ['breakfast'],
    isVeg: true,
    servings: 5,
    proteinG: 10,
    ingredients: [
      { ingredientId:'rolled_oats', amount:2.5, unit:'cup', note:'½ cup per jar' },
      { ingredientId:'soy_milk',    amount:5,   unit:'cup', note:'1 cup per jar'  },
      { ingredientId:'chia_seeds',  amount:5,   unit:'tbsp',note:'1 tbsp per jar' },
      { ingredientId:'honey',       amount:5,   unit:'tsp', note:'1 tsp per jar'  }
    ]
  },

  trail_mix_batch: {
    id: 'trail_mix_batch',
    name: 'Weekly Trail Mix (×7 servings)',
    cuisineId: null,
    mealTypes: ['snack'],
    isVeg: true,
    servings: 7,
    proteinG: 7,
    ingredients: [
      { ingredientId:'pistachios',    amount:2,   unit:'cup', note:'base unit — scale everything proportionally' },
      { ingredientId:'almonds',       amount:1,   unit:'cup' },
      { ingredientId:'pumpkin_seeds', amount:1,   unit:'cup' },
      { ingredientId:'dried_cherries',amount:1,   unit:'cup' },
      { ingredientId:'dark_choc_chips',amount:0.5,unit:'cup' },
      { ingredientId:'coconut_flakes',amount:0.5, unit:'cup' }
    ]
  }
};
