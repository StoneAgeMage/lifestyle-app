// ============================================================
// DATA-RECIPES — curated protein-dense recipe catalog
// 8-cuisine rotation: Chinese · Greek · Mexican · Thai
//   · Indian · Italian · Spanish · Caribbean
// All dinner recipes scaled to 4 servings.
// calories / proteinG are per serving.
// Daily macro target: ~115g protein, ~2100 cal (0.7g/lb × 165 lb goal)
//   Baseline (oats + snacks + shake): ~35g / 800 cal
//   Lunch + Dinner (2 recipe servings/day avg): ~80g / 1300 cal
//   Dinner: protein nights ~35–42g; veg nights ~13–22g
// ============================================================

const RECIPE_CATALOG = {

  // ============================================================
  // CHINESE WEEK
  // ============================================================

  // ---- Dinner — Protein ----

  sesame_chicken: {
    id: 'sesame_chicken',
    name: 'Sheet Pan Sesame Chicken',
    cuisineId: 'chinese',
    mealTypes: ['dinner'],
    isVeg: false, servings: 4, proteinG: 41, calories: 495, carbsG: 26, fatG: 26,
    prepMins: 10, cookMins: 30,
    source_url: 'https://www.ambitiouskitchen.com/sheet-pan-sesame-chicken/',
    link: 'https://www.ambitiouskitchen.com/sheet-pan-sesame-chicken/',
    desc: 'Sesame-soy glaze, asparagus, bell pepper, cashews. Macros not including rice.',
    protStr: '~41g',
    ingredients: [
      { ingredientId:'chicken_thigh', amount:1.5,  unit:'lb'   },
      { ingredientId:'asparagus',     amount:1,    unit:'bunch'},
      { ingredientId:'bell_pepper',   amount:1,    unit:'whole'},
      { ingredientId:'red_onion',     amount:4,    unit:'whole'},
      { ingredientId:'cashews',       amount:0.4,  unit:'cup'  },
      { ingredientId:'soy_sauce',     amount:3,    unit:'tbsp' },
      { ingredientId:'sesame_oil',    amount:2,    unit:'tbsp' },
      { ingredientId:'rice_vinegar',  amount:2,    unit:'tbsp' },
      { ingredientId:'honey',         amount:3,    unit:'tbsp' },
      { ingredientId:'garlic',        amount:4,    unit:'clove'},
      { ingredientId:'fresh_ginger',  amount:1,    unit:'tbsp' },
      { ingredientId:'brown_rice',    amount:2,    unit:'cup', note:'for serving' }
    ],
    brief_instructions: [
      'Whisk soy sauce, sesame oil, rice vinegar, maple syrup, garlic and ginger into a glaze.',
      'Toss chicken thighs in half the glaze. Arrange on a sheet pan with asparagus and bell pepper.',
      'Scatter cashews over the pan. Roast 400°F for 25–30 min until chicken reaches 165°F.',
      'Drizzle remaining glaze over everything. Serve over brown rice.'
    ]
  },

  soy_glazed_salmon: {
    id: 'soy_glazed_salmon',
    name: 'Sheet Pan Soy-Glazed Salmon',
    cuisineId: 'chinese',
    mealTypes: ['dinner'],
    isVeg: false, servings: 4, proteinG: 45, calories: 650, carbsG: null, fatG: null,
    prepMins: 8, cookMins: 20,
    source_url: 'https://www.ambitiouskitchen.com/sesame-ginger-sweet-teriyaki-salmon-with-garlic-quinoa-stir-fry/',
    link: 'https://www.ambitiouskitchen.com/sesame-ginger-sweet-teriyaki-salmon-with-garlic-quinoa-stir-fry/',
    desc: 'Honey-soy glaze, asparagus, green onion. Fast 20-min weeknight sheet pan.',
    protStr: '~45g',
    ingredients: [
      { ingredientId:'salmon_fillet', amount:2,    unit:'lb'   },
      { ingredientId:'asparagus',     amount:1,    unit:'bunch'},
      { ingredientId:'bell_pepper',   amount:1,    unit:'whole'},
      { ingredientId:'soy_sauce',     amount:4,    unit:'tbsp' },
      { ingredientId:'sesame_oil',    amount:2,    unit:'tbsp' },
      { ingredientId:'honey',         amount:3,    unit:'tbsp' },
      { ingredientId:'rice_vinegar',  amount:1,    unit:'tbsp' },
      { ingredientId:'garlic',        amount:4,    unit:'clove'},
      { ingredientId:'fresh_ginger',  amount:1,    unit:'tbsp' },
      { ingredientId:'green_onion',   amount:4,    unit:'whole'},
      { ingredientId:'brown_rice',    amount:2,    unit:'cup', note:'for serving' }
    ],
    brief_instructions: [
      'Whisk soy sauce, honey, sesame oil, rice vinegar, garlic and ginger into a glaze.',
      'Arrange salmon fillets, asparagus and bell pepper on a sheet pan.',
      'Brush glaze generously over salmon. Roast 400°F for 14–16 min until salmon flakes easily.',
      'Garnish with sliced green onions. Serve over brown rice.'
    ]
  },

  kung_pao_chicken: {
    id: 'kung_pao_chicken',
    name: 'Kung Pao Chicken',
    cuisineId: 'chinese',
    mealTypes: ['dinner'],
    isVeg: false, servings: 4, proteinG: 45, calories: 650, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 20,
    source_url: 'https://www.recipetineats.com/kung-pao-chicken/',
    link: 'https://www.recipetineats.com/kung-pao-chicken/',
    desc: 'Wok-tossed chicken with cashews, bell pepper and a bold sweet-savory-spicy sauce. Classic Chinese takeout at home.',
    protStr: '~45g',
    ingredients: [
      { ingredientId:'chicken_thigh', amount:2,    unit:'lb'   },
      { ingredientId:'cashews',       amount:0.75, unit:'cup'  },
      { ingredientId:'bell_pepper',   amount:2,    unit:'whole'},
      { ingredientId:'green_onion',   amount:4,    unit:'whole'},
      { ingredientId:'garlic',        amount:5,    unit:'clove'},
      { ingredientId:'fresh_ginger',  amount:1,    unit:'tbsp' },
      { ingredientId:'soy_sauce',     amount:4,    unit:'tbsp' },
      { ingredientId:'rice_vinegar',  amount:2,    unit:'tbsp' },
      { ingredientId:'sesame_oil',    amount:3,    unit:'tbsp' },
      { ingredientId:'sugar',         amount:1,    unit:'tbsp' },
      { ingredientId:'sriracha',      amount:1,    unit:'tbsp' },
      { ingredientId:'jasmine_rice',  amount:2,    unit:'cup', note:'for serving' }
    ],
    brief_instructions: [
      'Cut chicken into 1-inch pieces. Mix sauce: soy sauce, rice vinegar, sesame oil, sugar and sriracha.',
      'Stir-fry chicken in hot pan with sesame oil 5–6 min until golden and cooked through. Remove.',
      'Fry garlic, ginger and diced bell pepper in same pan 2 min. Return chicken and pour sauce over.',
      'Toss with cashews and sliced green onions. Serve immediately over jasmine rice.'
    ]
  },

  // ---- Dinner — Veg ----

  tofu_cashew_curry: {
    id: 'tofu_cashew_curry',
    name: 'Tofu Cashew Coconut Curry',
    cuisineId: 'chinese',
    mealTypes: ['dinner'],
    isVeg: true, servings: 4, proteinG: 35, calories: 600, carbsG: null, fatG: null,
    prepMins: 15, cookMins: 30,
    source_url: 'https://minimalistbaker.com/30-minute-coconut-curry/',
    link: 'https://minimalistbaker.com/30-minute-coconut-curry/',
    desc: 'Extra-firm tofu and edamame in a creamy coconut curry with sweet potato, cauliflower and cashews.',
    protStr: '~35g',
    ingredients: [
      { ingredientId:'firm_tofu',        amount:28,  unit:'oz'   },
      { ingredientId:'sweet_potato',     amount:2,   unit:'whole'},
      { ingredientId:'cauliflower',      amount:1,   unit:'whole'},
      { ingredientId:'cashews',          amount:0.5, unit:'cup'  },
      { ingredientId:'edamame_frozen',   amount:1,   unit:'cup'  },
      { ingredientId:'coconut_milk_can', amount:1,   unit:'whole'},
      { ingredientId:'soy_sauce',        amount:3,   unit:'tbsp' },
      { ingredientId:'sesame_oil',       amount:2,   unit:'tbsp' },
      { ingredientId:'garlic',           amount:4,   unit:'clove'},
      { ingredientId:'fresh_ginger',     amount:1,   unit:'tbsp' },
      { ingredientId:'brown_rice',       amount:1.5, unit:'cup', note:'for serving' }
    ],
    brief_instructions: [
      'Press tofu 15 min, cube and pan-fry in sesame oil until golden on all sides. Set aside.',
      'Cube sweet potato and cauliflower. Sauté garlic and ginger in the same pan.',
      'Add coconut milk, soy sauce, sweet potato and cauliflower. Simmer 12 min.',
      'Stir in tofu, edamame and cashews; simmer 5 more min. Serve over brown rice.'
    ]
  },

  egg_fried_rice: {
    id: 'egg_fried_rice',
    name: 'Egg Fried Rice with Edamame',
    cuisineId: 'chinese',
    mealTypes: ['dinner'],
    isVeg: true, servings: 4, proteinG: 35, calories: 600, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 15,
    source_url: 'https://www.recipetineats.com/egg-fried-rice/',
    link: 'https://www.recipetineats.com/egg-fried-rice/',
    desc: 'High-protein egg and tofu fried rice with edamame, bell pepper and sesame-soy sauce.',
    protStr: '~35g',
    ingredients: [
      { ingredientId:'eggs',           amount:10,   unit:'whole'},
      { ingredientId:'firm_tofu',      amount:14,   unit:'oz'   },
      { ingredientId:'brown_rice',     amount:2,    unit:'cup', note:'day-old cooked is best' },
      { ingredientId:'edamame_frozen', amount:2,    unit:'cup'  },
      { ingredientId:'bell_pepper',    amount:1,    unit:'whole'},
      { ingredientId:'green_onion',    amount:4,    unit:'whole'},
      { ingredientId:'garlic',         amount:3,    unit:'clove'},
      { ingredientId:'soy_sauce',      amount:3,    unit:'tbsp' },
      { ingredientId:'sesame_oil',     amount:3,    unit:'tbsp' },
      { ingredientId:'rice_vinegar',   amount:1,    unit:'tbsp' },
      { ingredientId:'sriracha',       amount:1,    unit:'tsp', optional:true }
    ],
    brief_instructions: [
      'Use day-old cooked rice. Press tofu 10 min, cube and pan-fry in 1 tbsp sesame oil until golden. Set aside.',
      'Scramble eggs in the same hot wok with remaining sesame oil; push to the side once just set.',
      'Add garlic, bell pepper and rice; stir-fry 3–4 min until rice is lightly crisped.',
      'Toss in tofu, edamame, soy sauce, rice vinegar and sriracha. Top with green onions.'
    ]
  },

  bok_choy_tofu_stir_fry: {
    id: 'bok_choy_tofu_stir_fry',
    name: 'Bok Choy & Tofu Stir-Fry',
    cuisineId: 'chinese',
    mealTypes: ['dinner'],
    isVeg: true, servings: 4, proteinG: 16, calories: 380, carbsG: null, fatG: null,
    prepMins: 15, cookMins: 20,
    source_url: 'https://minimalistbaker.com/20-minute-tofu-stir-fry/',
    link: 'https://minimalistbaker.com/20-minute-tofu-stir-fry/',
    desc: 'Crispy pan-fried tofu with bok choy and bell pepper in a savory ginger-soy sauce. Ascent shake.',
    protStr: '~16g+shake',
    ingredients: [
      { ingredientId:'firm_tofu',     amount:14,  unit:'oz'   },
      { ingredientId:'bok_choy',      amount:4,   unit:'whole'},
      { ingredientId:'bell_pepper',   amount:1,   unit:'whole'},
      { ingredientId:'garlic',        amount:4,   unit:'clove'},
      { ingredientId:'fresh_ginger',  amount:1,   unit:'tbsp' },
      { ingredientId:'soy_sauce',     amount:3,   unit:'tbsp' },
      { ingredientId:'oyster_sauce',  amount:1,   unit:'tbsp' },
      { ingredientId:'sesame_oil',    amount:2,   unit:'tbsp' },
      { ingredientId:'rice_vinegar',  amount:1,   unit:'tbsp' },
      { ingredientId:'green_onion',   amount:3,   unit:'whole'},
      { ingredientId:'jasmine_rice',  amount:2,   unit:'cup', note:'for serving' }
    ],
    brief_instructions: [
      'Press tofu 15 min, cube and pan-fry in sesame oil until golden on all sides. Set aside.',
      'Whisk sauce: soy sauce, oyster sauce, rice vinegar and a pinch of sugar.',
      'Stir-fry halved bok choy and bell pepper with garlic and ginger 3–4 min until just tender.',
      'Return tofu, pour sauce over, toss 1 min. Serve over jasmine rice topped with green onions.'
    ]
  },


  // ============================================================
  // GREEK WEEK
  // ============================================================

  // ---- Dinner — Protein ----

  moroccan_chicken: {
    id: 'moroccan_chicken',
    name: 'Greek Lemon Herb Chicken',
    cuisineId: 'greek',
    mealTypes: ['dinner'],
    isVeg: false, servings: 4, proteinG: 41, calories: 510, carbsG: null, fatG: null,
    prepMins: 15, cookMins: 35,
    source_url: 'https://www.themediterraneandish.com/greek-sheet-pan-chicken/',
    link: 'https://www.themediterraneandish.com/greek-sheet-pan-chicken/',
    desc: 'Lemon-herb marinated chicken thighs, roasted sweet potato and cauliflower with a feta-yogurt drizzle.',
    protStr: '~41g',
    ingredients: [
      { ingredientId:'chicken_thigh', amount:2,    unit:'lb'   },
      { ingredientId:'sweet_potato',  amount:2,    unit:'whole'},
      { ingredientId:'cauliflower',   amount:1,    unit:'whole'},
      { ingredientId:'olive_oil',     amount:3,    unit:'tbsp' },
      { ingredientId:'lemon',         amount:2,    unit:'whole'},
      { ingredientId:'garlic',        amount:4,    unit:'clove'},
      { ingredientId:'cumin',         amount:1,    unit:'tsp'  },
      { ingredientId:'turmeric',      amount:0.5,  unit:'tsp'  },
      { ingredientId:'dried_oregano', amount:1,    unit:'tsp'  },
      { ingredientId:'cayenne',       amount:0.25, unit:'tsp'  },
      { ingredientId:'feta_cheese',   amount:0.25, unit:'cup', note:'optional topping' },
      { ingredientId:'greek_yogurt',  amount:0.25, unit:'cup', note:'optional drizzle' }
    ],
    brief_instructions: [
      'Mix olive oil, lemon juice, cumin, turmeric, oregano and garlic. Coat chicken thighs; marinate 30 min.',
      'Toss sweet potato and cauliflower chunks with olive oil and season with salt.',
      'Spread vegetables on sheet pan; nestle chicken on top. Roast 400°F for 25–30 min.',
      'Drizzle with feta-yogurt sauce and fresh lemon juice before serving.'
    ]
  },

  herb_baked_salmon: {
    id: 'herb_baked_salmon',
    name: 'Greek Herb-Crusted Salmon',
    cuisineId: 'greek',
    mealTypes: ['dinner'],
    isVeg: false, servings: 4, proteinG: 38, calories: 470, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 20,
    source_url: 'https://www.themediterraneandish.com/easy-greek-salmon/',
    link: 'https://www.themediterraneandish.com/easy-greek-salmon/',
    desc: 'Parsley-dill herb crust on salmon, roasted sweet potato and cherry tomatoes. Classic Greek taverna flavors.',
    protStr: '~38g',
    ingredients: [
      { ingredientId:'salmon_fillet', amount:1.5,  unit:'lb'   },
      { ingredientId:'sweet_potato',  amount:2,    unit:'whole'},
      { ingredientId:'cherry_tomato', amount:1,    unit:'cup'  },
      { ingredientId:'olive_oil',     amount:3,    unit:'tbsp' },
      { ingredientId:'lemon',         amount:2,    unit:'whole'},
      { ingredientId:'garlic',        amount:4,    unit:'clove'},
      { ingredientId:'parsley',       amount:0.25, unit:'cup'  },
      { ingredientId:'dill',          amount:2,    unit:'tbsp' },
      { ingredientId:'dried_oregano', amount:0.5,  unit:'tsp'  },
      { ingredientId:'salt',          amount:0.5,  unit:'tsp'  },
      { ingredientId:'black_pepper',  amount:0.25, unit:'tsp'  }
    ],
    brief_instructions: [
      'Mix minced parsley, dill, oregano, garlic, olive oil, lemon zest and salt into a herb paste.',
      'Press herb paste evenly over salmon fillets on a lined sheet pan.',
      'Arrange sweet potato wedges and cherry tomatoes around salmon; drizzle with olive oil.',
      'Roast 400°F for 18–22 min until salmon flakes. Squeeze fresh lemon over before serving.'
    ]
  },

  greek_turkey_meatballs: {
    id: 'greek_turkey_meatballs',
    name: 'Greek Turkey Meatballs',
    cuisineId: 'greek',
    mealTypes: ['dinner'],
    isVeg: false, servings: 4, proteinG: 38, calories: 490, carbsG: null, fatG: null,
    prepMins: 15, cookMins: 25,
    source_url: 'https://www.ambitiouskitchen.com/greek-turkey-meatballs/',
    link: 'https://www.ambitiouskitchen.com/greek-turkey-meatballs/',
    desc: 'Herb-spiced turkey meatballs simmered in a quick tomato-spinach sauce, finished with feta and lemon.',
    protStr: '~38g',
    ingredients: [
      { ingredientId:'ground_turkey', amount:1.5,  unit:'lb'   },
      { ingredientId:'eggs',          amount:1,    unit:'whole'},
      { ingredientId:'garlic',        amount:5,    unit:'clove'},
      { ingredientId:'dried_oregano', amount:2,    unit:'tsp'  },
      { ingredientId:'lemon',         amount:2,    unit:'whole'},
      { ingredientId:'olive_oil',     amount:2,    unit:'tbsp' },
      { ingredientId:'canned_tomatoes',amount:2,   unit:'whole'},
      { ingredientId:'fresh_spinach', amount:3,    unit:'cup'  },
      { ingredientId:'feta_cheese',   amount:0.25, unit:'cup'  },
      { ingredientId:'brown_rice',    amount:1.5,  unit:'cup', note:'for serving' }
    ],
    brief_instructions: [
      'Combine turkey, egg, 2 minced garlic cloves, oregano, lemon zest, salt. Roll into 16 meatballs.',
      'Brown meatballs in olive oil over medium-high 3–4 min per side until golden. Remove.',
      'Add remaining garlic, canned tomatoes and fresh spinach to the pan; simmer 5 min.',
      'Return meatballs, cover and simmer 12 min. Top with feta and a squeeze of lemon. Serve over brown rice.'
    ]
  },

  // ---- Dinner — Veg ----

  tomato_lentil_soup: {
    id: 'tomato_lentil_soup',
    name: 'Greek Lentil Soup',
    cuisineId: 'greek',
    mealTypes: ['dinner'],
    isVeg: true, servings: 4, proteinG: 12, calories: 350, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 30,
    source_url: 'https://www.themediterraneandish.com/red-lentil-soup-recipe/',
    link: 'https://www.themediterraneandish.com/red-lentil-soup-recipe/',
    desc: 'Red lentils, coconut milk, cumin, turmeric and lemon — a warming Greek-style fakes. Pita on the side. Ascent shake.',
    protStr: '~12g+shake',
    ingredients: [
      { ingredientId:'red_lentils',      amount:1.5, unit:'cup'  },
      { ingredientId:'canned_tomatoes',  amount:2,   unit:'whole'},
      { ingredientId:'coconut_milk_can', amount:1,   unit:'whole'},
      { ingredientId:'onion',            amount:1,   unit:'whole'},
      { ingredientId:'garlic',           amount:4,   unit:'clove'},
      { ingredientId:'cumin',            amount:2,   unit:'tsp'  },
      { ingredientId:'turmeric',         amount:1,   unit:'tsp'  },
      { ingredientId:'olive_oil',        amount:2,   unit:'tbsp' },
      { ingredientId:'lemon',            amount:1,   unit:'whole'},
      { ingredientId:'pita_bread',       amount:4,   unit:'whole', note:'for serving' }
    ],
    brief_instructions: [
      'Sauté diced onion and garlic in olive oil 5 min. Add cumin and turmeric; cook 1 min.',
      'Add rinsed lentils, canned tomatoes and 4 cups water. Bring to boil.',
      'Stir in coconut milk; reduce heat and simmer 20–25 min until lentils are completely soft.',
      'Squeeze in lemon juice, season with salt. Serve with warm pita.'
    ]
  },

  shakshuka_chickpeas: {
    id: 'shakshuka_chickpeas',
    name: 'Shakshuka with Chickpeas',
    cuisineId: 'greek',
    mealTypes: ['dinner'],
    isVeg: true, servings: 4, proteinG: 18, calories: 390, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 25,
    source_url: 'https://www.themediterraneandish.com/shakshuka-recipe/',
    link: 'https://www.themediterraneandish.com/shakshuka-recipe/',
    desc: 'Eggs poached in spiced tomato sauce with chickpeas and bell pepper. Pita on the side. Ascent shake.',
    protStr: '~18g+shake',
    ingredients: [
      { ingredientId:'eggs',             amount:6,    unit:'whole'},
      { ingredientId:'canned_chickpeas', amount:1,    unit:'whole'},
      { ingredientId:'canned_tomatoes',  amount:2,    unit:'whole'},
      { ingredientId:'bell_pepper',      amount:2,    unit:'whole'},
      { ingredientId:'onion',            amount:1,    unit:'whole'},
      { ingredientId:'garlic',           amount:4,    unit:'clove'},
      { ingredientId:'olive_oil',        amount:2,    unit:'tbsp' },
      { ingredientId:'cumin',            amount:1,    unit:'tsp'  },
      { ingredientId:'smoked_paprika',   amount:1,    unit:'tsp'  },
      { ingredientId:'turmeric',         amount:0.5,  unit:'tsp'  },
      { ingredientId:'cayenne',          amount:0.25, unit:'tsp'  },
      { ingredientId:'feta_cheese',      amount:0.25, unit:'cup', note:'optional topping' },
      { ingredientId:'pita_bread',       amount:4,    unit:'whole', note:'for serving' }
    ],
    brief_instructions: [
      'Sauté onion, bell pepper and garlic in olive oil 5 min. Add cumin, paprika, turmeric, cayenne.',
      'Add canned tomatoes and chickpeas; simmer 10 min until sauce thickens.',
      'Make 6 wells in the sauce and crack one egg into each. Cover and cook 6–8 min until whites are set.',
      'Top with crumbled feta and fresh herbs. Serve straight from the pan with warm pita.'
    ]
  },

  spanakopita_bowl: {
    id: 'spanakopita_bowl',
    name: 'Spanakopita Bowl',
    cuisineId: 'greek',
    mealTypes: ['dinner'],
    isVeg: true, servings: 4, proteinG: 17, calories: 390, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 20,
    source_url: 'https://www.themediterraneandish.com/spanakopita-recipe-greek-spinach-pie/',
    link: 'https://www.themediterraneandish.com/spanakopita-recipe-greek-spinach-pie/',
    desc: 'Spinach and chickpeas simmered with lemon and oregano, topped with poached eggs and crumbled feta. Ascent shake.',
    protStr: '~17g+shake',
    ingredients: [
      { ingredientId:'fresh_spinach',    amount:5,    unit:'cup'  },
      { ingredientId:'canned_chickpeas', amount:2,    unit:'whole'},
      { ingredientId:'eggs',             amount:4,    unit:'whole'},
      { ingredientId:'garlic',           amount:4,    unit:'clove'},
      { ingredientId:'olive_oil',        amount:2,    unit:'tbsp' },
      { ingredientId:'lemon',            amount:1,    unit:'whole'},
      { ingredientId:'dried_oregano',    amount:1,    unit:'tsp'  },
      { ingredientId:'feta_cheese',      amount:0.33, unit:'cup'  },
      { ingredientId:'brown_rice',       amount:1.5,  unit:'cup', note:'for serving' }
    ],
    brief_instructions: [
      'Sauté garlic in olive oil 1 min. Add fresh spinach and cook, stirring, until fully wilted.',
      'Stir in chickpeas, lemon juice, oregano and salt. Simmer 5 min.',
      'Make 4 wells in the mixture; crack one egg into each. Cover and cook 5–7 min until whites set.',
      'Top with crumbled feta and a squeeze of lemon. Serve over brown rice.'
    ]
  },


  // ============================================================
  // MEXICAN WEEK
  // ============================================================

  // ---- Dinner — Protein ----

  chipotle_chicken_bowls: {
    id: 'chipotle_chicken_bowls',
    name: 'Chipotle Ground Chicken Bowls',
    cuisineId: 'mexican',
    mealTypes: ['dinner'],
    isVeg: false, servings: 4, proteinG: 36, calories: 490, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 20,
    source_url: 'https://www.ambitiouskitchen.com/better-chipotle-diy-chicken-burrito-bowls/',
    link: 'https://www.ambitiouskitchen.com/better-chipotle-diy-chicken-burrito-bowls/',
    desc: 'Smoky ground chicken, bell pepper, onion. Fast 20-min stovetop rice bowls or tacos.',
    protStr: '~36g',
    ingredients: [
      { ingredientId:'ground_chicken', amount:1.5,  unit:'lb'   },
      { ingredientId:'bell_pepper',    amount:2,    unit:'whole'},
      { ingredientId:'onion',          amount:1,    unit:'whole'},
      { ingredientId:'garlic',         amount:3,    unit:'clove'},
      { ingredientId:'olive_oil',      amount:2,    unit:'tbsp' },
      { ingredientId:'cumin',          amount:2,    unit:'tsp'  },
      { ingredientId:'smoked_paprika', amount:1,    unit:'tsp'  },
      { ingredientId:'coriander',      amount:1,    unit:'tsp'  },
      { ingredientId:'garlic_powder',  amount:0.5,  unit:'tsp'  },
      { ingredientId:'cayenne',        amount:0.25, unit:'tsp'  },
      { ingredientId:'salt',           amount:1,    unit:'tsp'  },
      { ingredientId:'lime',           amount:2,    unit:'whole'},
      { ingredientId:'cilantro',       amount:0.5,  unit:'cup'  },
      { ingredientId:'brown_rice',     amount:1.5,  unit:'cup', note:'for serving' }
    ],
    brief_instructions: [
      'Cook ground chicken in olive oil over medium-high, breaking up finely, for 5–6 min.',
      'Add diced bell pepper and onion; cook 3 min. Add garlic and all spices; cook 1 min.',
      'Splash in 2 tbsp water or lime juice to deglaze. Adjust seasoning with salt.',
      'Build bowls over brown rice with fresh cilantro, lime juice and avocado.'
    ]
  },

  sheet_pan_fajitas: {
    id: 'sheet_pan_fajitas',
    name: 'Sheet Pan Chicken Fajitas',
    cuisineId: 'mexican',
    mealTypes: ['dinner'],
    isVeg: false, servings: 4, proteinG: 35, calories: 480, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 25,
    source_url: 'https://www.ambitiouskitchen.com/fajita-chicken-and-rice/',
    link: 'https://www.ambitiouskitchen.com/fajita-chicken-and-rice/',
    desc: 'Sheet pan chicken fajitas with charred bell pepper and onion. Minimal cleanup, ready in 35 min.',
    protStr: '~35g',
    ingredients: [
      { ingredientId:'chicken_thigh', amount:1.5,  unit:'lb'   },
      { ingredientId:'bell_pepper',   amount:3,    unit:'whole'},
      { ingredientId:'onion',         amount:1,    unit:'whole'},
      { ingredientId:'olive_oil',     amount:2,    unit:'tbsp' },
      { ingredientId:'cumin',         amount:2,    unit:'tsp'  },
      { ingredientId:'smoked_paprika',amount:1,    unit:'tsp'  },
      { ingredientId:'dried_oregano', amount:0.5,  unit:'tsp'  },
      { ingredientId:'garlic_powder', amount:1,    unit:'tsp'  },
      { ingredientId:'cayenne',       amount:0.25, unit:'tsp'  },
      { ingredientId:'lime',          amount:2,    unit:'whole'},
      { ingredientId:'cilantro',      amount:0.25, unit:'cup'  },
      { ingredientId:'corn_tortilla', amount:8,    unit:'whole'}
    ],
    brief_instructions: [
      'Slice chicken into thin strips. Slice bell peppers and onion into thin strips.',
      'Toss everything with olive oil, cumin, smoked paprika, garlic powder, oregano, cayenne and lime juice.',
      'Spread on a large sheet pan in a single layer. Roast 425°F for 20–22 min, stirring once halfway.',
      'Serve in warm corn tortillas with cilantro, avocado and salsa.'
    ]
  },

  // ---- Dinner — Veg ----

  sweet_potato_lentil_stew: {
    id: 'sweet_potato_lentil_stew',
    name: 'Coconut Sweet Potato & Lentil Stew',
    cuisineId: 'mexican',
    mealTypes: ['dinner'],
    isVeg: true, servings: 4, proteinG: 12, calories: 380, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 30,
    source_url: 'https://www.ambitiouskitchen.com/coconut-curried-sweet-potato-and-lentil-stew/',
    link: 'https://www.ambitiouskitchen.com/coconut-curried-sweet-potato-and-lentil-stew/',
    desc: 'Sweet potato, red lentils, coconut milk, cumin and ginger. Ascent shake.',
    protStr: '~12g+shake',
    ingredients: [
      { ingredientId:'sweet_potato',     amount:2,    unit:'whole'},
      { ingredientId:'red_lentils',      amount:1,    unit:'cup'  },
      { ingredientId:'coconut_milk_can', amount:1,    unit:'whole'},
      { ingredientId:'canned_tomatoes',  amount:1,    unit:'whole'},
      { ingredientId:'onion',            amount:1,    unit:'whole'},
      { ingredientId:'garlic',           amount:4,    unit:'clove'},
      { ingredientId:'fresh_ginger',     amount:1,    unit:'tbsp' },
      { ingredientId:'cumin',            amount:1,    unit:'tsp'  },
      { ingredientId:'coriander',        amount:1,    unit:'tsp'  },
      { ingredientId:'turmeric',         amount:0.5,  unit:'tsp'  },
      { ingredientId:'cayenne',          amount:0.25, unit:'tsp'  },
      { ingredientId:'olive_oil',        amount:2,    unit:'tbsp' }
    ],
    brief_instructions: [
      'Sauté diced onion and garlic in olive oil 5 min. Add ginger, cumin, coriander, turmeric, cayenne; cook 1 min.',
      'Add cubed sweet potato, lentils, canned tomatoes and coconut milk. Add 2 cups water.',
      'Bring to boil then simmer 25 min, stirring occasionally, until lentils and potato are tender.',
      'Season with salt and serve with lime wedges and warm tortillas or over brown rice.'
    ]
  },

  black_bean_sweet_potato: {
    id: 'black_bean_sweet_potato',
    name: 'Black Bean & Sweet Potato Bowl',
    cuisineId: 'mexican',
    mealTypes: ['dinner'],
    isVeg: true, servings: 4, proteinG: 14, calories: 430, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 30,
    source_url: 'https://www.ambitiouskitchen.com/southwest-sweet-potato-taco-bowls/',
    link: 'https://www.ambitiouskitchen.com/southwest-sweet-potato-taco-bowls/',
    desc: 'Spiced black beans, roasted sweet potato, lime-cilantro. Corn tortillas or rice. Ascent shake.',
    protStr: '~14g+shake',
    ingredients: [
      { ingredientId:'black_beans_can', amount:2,    unit:'whole'},
      { ingredientId:'sweet_potato',    amount:2,    unit:'whole'},
      { ingredientId:'onion',           amount:1,    unit:'whole'},
      { ingredientId:'garlic',          amount:3,    unit:'clove'},
      { ingredientId:'olive_oil',       amount:2,    unit:'tbsp' },
      { ingredientId:'cumin',           amount:2,    unit:'tsp'  },
      { ingredientId:'coriander',       amount:1,    unit:'tsp'  },
      { ingredientId:'smoked_paprika',  amount:0.5,  unit:'tsp'  },
      { ingredientId:'cayenne',         amount:0.25, unit:'tsp'  },
      { ingredientId:'lime',            amount:2,    unit:'whole'},
      { ingredientId:'cilantro',        amount:0.5,  unit:'cup'  },
      { ingredientId:'corn_tortilla',   amount:8,    unit:'whole', note:'or serve over brown rice' }
    ],
    brief_instructions: [
      'Toss cubed sweet potato with olive oil, cumin and smoked paprika. Roast 400°F for 25 min.',
      'Simmer black beans with garlic, onion, coriander, cayenne and a splash of water for 10 min.',
      'Warm corn tortillas in a dry pan or wrap in damp paper towel and microwave 30 sec.',
      'Build bowls with rice or tortillas, black beans, roasted sweet potato, cilantro and lime.'
    ]
  },

  mexican_black_bean_soup: {
    id: 'mexican_black_bean_soup',
    name: 'Mexican Black Bean Soup',
    cuisineId: 'mexican',
    mealTypes: ['dinner'],
    isVeg: true, servings: 4, proteinG: 14, calories: 370, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 25,
    source_url: 'https://www.ambitiouskitchen.com/quick-easy-black-bean-soup/',
    link: 'https://www.ambitiouskitchen.com/quick-easy-black-bean-soup/',
    desc: 'Smoky, velvety black bean soup with cumin, smoked paprika and lime. 35-min pantry dinner. Ascent shake.',
    protStr: '~14g+shake',
    ingredients: [
      { ingredientId:'black_beans_can', amount:3,    unit:'whole'},
      { ingredientId:'canned_tomatoes', amount:1,    unit:'whole'},
      { ingredientId:'onion',           amount:1,    unit:'whole'},
      { ingredientId:'garlic',          amount:4,    unit:'clove'},
      { ingredientId:'cumin',           amount:2,    unit:'tsp'  },
      { ingredientId:'smoked_paprika',  amount:1,    unit:'tsp'  },
      { ingredientId:'coriander',       amount:0.5,  unit:'tsp'  },
      { ingredientId:'cayenne',         amount:0.25, unit:'tsp'  },
      { ingredientId:'olive_oil',       amount:2,    unit:'tbsp' },
      { ingredientId:'lime',            amount:2,    unit:'whole'},
      { ingredientId:'cilantro',        amount:0.25, unit:'cup'  },
      { ingredientId:'avocado',         amount:2,    unit:'whole', note:'diced, for topping' }
    ],
    brief_instructions: [
      'Sauté diced onion and garlic in olive oil 5 min until soft and golden.',
      'Add cumin, smoked paprika, coriander and cayenne; cook 1 min until fragrant.',
      'Add black beans, canned tomatoes and 2 cups water. Simmer 15–20 min, partially mashing beans.',
      'Squeeze in fresh lime juice and stir in cilantro. Ladle into bowls; top with diced avocado.'
    ]
  },


  // ============================================================
  // THAI WEEK
  // ============================================================

  // ---- Dinner — Protein ----

  thai_basil_chicken: {
    id: 'thai_basil_chicken',
    name: 'Thai Basil Chicken',
    cuisineId: 'thai',
    mealTypes: ['dinner'],
    isVeg: false, servings: 4, proteinG: 38, calories: 510, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 15,
    source_url: 'https://www.recipetineats.com/thai-basil-chicken-stir-fry/',
    link: 'https://www.recipetineats.com/thai-basil-chicken-stir-fry/',
    desc: 'Ground chicken, oyster sauce, fish sauce, Thai basil, chili. Fast 15-min stir-fry over jasmine rice.',
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
    ],
    brief_instructions: [
      'Whisk sauce: fish sauce, oyster sauce, white vinegar and sugar. Set aside.',
      'Fry chopped garlic and Thai chilies in sesame oil 30 sec until fragrant.',
      'Add ground chicken, break up finely and cook 4–5 min over high heat.',
      'Pour sauce over chicken, stir-fry 2 min. Remove from heat, fold in Thai basil. Serve over jasmine rice.'
    ]
  },

  thai_honey_garlic_salmon: {
    id: 'thai_honey_garlic_salmon',
    name: 'Thai Honey Garlic Salmon',
    cuisineId: 'thai',
    mealTypes: ['dinner'],
    isVeg: false, servings: 4, proteinG: 38, calories: 470, carbsG: null, fatG: null,
    prepMins: 8, cookMins: 20,
    source_url: 'https://www.halfbakedharvest.com/honey-garlic-salmon-bowls/',
    link: 'https://www.halfbakedharvest.com/honey-garlic-salmon-bowls/',
    desc: 'Honey-soy-garlic glaze with a Thai chili kick. Sheet pan salmon with broccoli over jasmine rice.',
    protStr: '~38g',
    ingredients: [
      { ingredientId:'salmon_fillet', amount:1.5,  unit:'lb'   },
      { ingredientId:'broccoli',      amount:1,    unit:'whole'},
      { ingredientId:'garlic',        amount:6,    unit:'clove'},
      { ingredientId:'fresh_ginger',  amount:1,    unit:'tbsp' },
      { ingredientId:'soy_sauce',     amount:3,    unit:'tbsp' },
      { ingredientId:'honey',         amount:2,    unit:'tbsp' },
      { ingredientId:'sesame_oil',    amount:1,    unit:'tbsp' },
      { ingredientId:'rice_vinegar',  amount:1,    unit:'tbsp' },
      { ingredientId:'thai_chili',    amount:2,    unit:'whole', optional:true },
      { ingredientId:'jasmine_rice',  amount:2,    unit:'cup', note:'for serving' }
    ],
    brief_instructions: [
      'Whisk soy sauce, honey, sesame oil, rice vinegar, minced garlic and ginger into a glaze.',
      'Arrange salmon fillets and broccoli florets on a sheet pan.',
      'Brush glaze generously over salmon; drizzle remainder on broccoli.',
      'Roast 400°F for 14–16 min until salmon flakes. Serve over jasmine rice.'
    ]
  },

  thai_larb_chicken: {
    id: 'thai_larb_chicken',
    name: 'Thai Larb Chicken',
    cuisineId: 'thai',
    mealTypes: ['dinner'],
    isVeg: false, servings: 4, proteinG: 36, calories: 450, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 15,
    source_url: 'https://www.recipetineats.com/thai-chicken-lettuce-cups-larb-gai-laab-gai/',
    link: 'https://www.recipetineats.com/thai-chicken-lettuce-cups-larb-gai-laab-gai/',
    desc: 'Ground chicken Thai-style salad with lime, fish sauce and fresh herbs. Serve warm over jasmine rice.',
    protStr: '~36g',
    ingredients: [
      { ingredientId:'ground_chicken', amount:1.5, unit:'lb'   },
      { ingredientId:'green_onion',    amount:5,   unit:'whole'},
      { ingredientId:'cilantro',       amount:0.5, unit:'cup'  },
      { ingredientId:'lime',           amount:3,   unit:'whole'},
      { ingredientId:'fish_sauce',     amount:3,   unit:'tbsp' },
      { ingredientId:'sugar',          amount:1,   unit:'tsp'  },
      { ingredientId:'garlic',         amount:3,   unit:'clove'},
      { ingredientId:'fresh_ginger',   amount:1,   unit:'tbsp' },
      { ingredientId:'jasmine_rice',   amount:2,   unit:'cup', note:'for serving' }
    ],
    brief_instructions: [
      'Cook ground chicken in a dry pan over high heat, breaking up finely, until no pink remains.',
      'Remove from heat; toss with fish sauce, lime juice, sugar and minced garlic. Mix well.',
      'Fold in sliced green onions and fresh cilantro. Taste and adjust lime and fish sauce balance.',
      'Serve over steamed jasmine rice with extra lime wedges and fresh cilantro on the side.'
    ]
  },

  // ---- Dinner — Veg ----

  thai_peanut_curry: {
    id: 'thai_peanut_curry',
    name: 'Thai Peanut Cauliflower Chickpea Curry',
    cuisineId: 'thai',
    mealTypes: ['dinner'],
    isVeg: true, servings: 4, proteinG: 15, calories: 490, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 30,
    source_url: 'https://www.ambitiouskitchen.com/thai-peanut-coconut-cauliflower-chickpea-curry/',
    link: 'https://www.ambitiouskitchen.com/thai-peanut-coconut-cauliflower-chickpea-curry/',
    desc: 'Coconut milk, red curry paste, peanut butter, cauliflower, chickpeas. Ascent shake.',
    protStr: '~15g+shake',
    ingredients: [
      { ingredientId:'cauliflower',      amount:1,   unit:'whole'},
      { ingredientId:'canned_chickpeas', amount:2,   unit:'whole'},
      { ingredientId:'coconut_milk_can', amount:2,   unit:'whole'},
      { ingredientId:'red_curry_paste',  amount:3,   unit:'tbsp' },
      { ingredientId:'peanut_butter',    amount:3,   unit:'tbsp' },
      { ingredientId:'soy_sauce',        amount:2,   unit:'tbsp' },
      { ingredientId:'lime',             amount:2,   unit:'whole'},
      { ingredientId:'garlic',           amount:3,   unit:'clove'},
      { ingredientId:'fresh_ginger',     amount:1,   unit:'tbsp' },
      { ingredientId:'brown_rice',       amount:1.5, unit:'cup', note:'for serving' }
    ],
    brief_instructions: [
      'Sauté garlic and ginger in oil 1 min. Add red curry paste and cook 2 min until fragrant.',
      'Pour in coconut milk and stir in peanut butter until smooth. Bring to a gentle simmer.',
      'Add cauliflower florets and chickpeas. Simmer 15–18 min until cauliflower is tender.',
      'Squeeze in lime juice, season with soy sauce. Serve over brown rice.'
    ]
  },

  tofu_pad_thai: {
    id: 'tofu_pad_thai',
    name: 'Tofu Pad Thai',
    cuisineId: 'thai',
    mealTypes: ['dinner'],
    isVeg: true, servings: 4, proteinG: 16, calories: 460, carbsG: null, fatG: null,
    prepMins: 15, cookMins: 20,
    source_url: 'https://minimalistbaker.com/easy-tofu-pad-thai/',
    link: 'https://minimalistbaker.com/easy-tofu-pad-thai/',
    desc: 'Rice noodles, crispy tofu, eggs, peanut sauce, shredded cabbage, cashews. Ascent shake.',
    protStr: '~16g+shake',
    ingredients: [
      { ingredientId:'firm_tofu',        amount:14,   unit:'oz'   },
      { ingredientId:'rice_noodles',     amount:8,    unit:'oz'   },
      { ingredientId:'eggs',             amount:2,    unit:'whole'},
      { ingredientId:'cabbage_shredded', amount:2,    unit:'cup'  },
      { ingredientId:'green_onion',      amount:4,    unit:'whole'},
      { ingredientId:'garlic',           amount:4,    unit:'clove'},
      { ingredientId:'cashews',          amount:0.25, unit:'cup'  },
      { ingredientId:'lime',             amount:2,    unit:'whole'},
      { ingredientId:'fish_sauce',       amount:2,    unit:'tbsp' },
      { ingredientId:'soy_sauce',        amount:2,    unit:'tbsp' },
      { ingredientId:'oyster_sauce',     amount:1,    unit:'tbsp' },
      { ingredientId:'sugar',            amount:1,    unit:'tbsp' },
      { ingredientId:'sesame_oil',       amount:2,    unit:'tbsp' }
    ],
    brief_instructions: [
      'Soak rice noodles in hot water 8 min until pliable; drain and set aside.',
      'Pan-fry cubed tofu in sesame oil until golden. Push to the side; scramble 2 eggs in the same pan.',
      'Add noodles, fish sauce, soy sauce, oyster sauce and sugar. Toss over high heat 2 min.',
      'Serve topped with shredded cabbage, cashews, green onions and fresh lime juice.'
    ]
  },

  thai_coconut_green_curry: {
    id: 'thai_coconut_green_curry',
    name: 'Thai Coconut Curry with Tofu',
    cuisineId: 'thai',
    mealTypes: ['dinner'],
    isVeg: true, servings: 4, proteinG: 14, calories: 490, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 25,
    source_url: 'https://www.ambitiouskitchen.com/green-chicken-curry/',
    link: 'https://www.ambitiouskitchen.com/green-chicken-curry/',
    desc: 'Creamy coconut curry with crispy tofu and cauliflower. Red curry paste, peanut butter and lime. Ascent shake.',
    protStr: '~14g+shake',
    ingredients: [
      { ingredientId:'firm_tofu',        amount:14,  unit:'oz'   },
      { ingredientId:'cauliflower',      amount:1,   unit:'whole'},
      { ingredientId:'coconut_milk_can', amount:2,   unit:'whole'},
      { ingredientId:'red_curry_paste',  amount:3,   unit:'tbsp' },
      { ingredientId:'peanut_butter',    amount:2,   unit:'tbsp' },
      { ingredientId:'soy_sauce',        amount:2,   unit:'tbsp' },
      { ingredientId:'lime',             amount:2,   unit:'whole'},
      { ingredientId:'garlic',           amount:3,   unit:'clove'},
      { ingredientId:'fresh_ginger',     amount:1,   unit:'tbsp' },
      { ingredientId:'jasmine_rice',     amount:2,   unit:'cup', note:'for serving' },
      { ingredientId:'cilantro',         amount:0.25,unit:'cup', note:'garnish' }
    ],
    brief_instructions: [
      'Press and cube tofu; pan-fry in sesame oil until golden. Set aside.',
      'Fry red curry paste in a splash of coconut milk 2 min. Add garlic and ginger; cook 1 min.',
      'Add remaining coconut milk, peanut butter and soy sauce. Bring to simmer; add cauliflower.',
      'Cook 15 min until tender. Stir in tofu and lime juice. Serve over jasmine rice with cilantro.'
    ]
  },


  // ============================================================
  // INDIAN WEEK
  // ============================================================

  // ---- Dinner — Protein ----

  chicken_tikka_masala: {
    id: 'chicken_tikka_masala',
    name: 'Chicken Tikka Masala',
    cuisineId: 'indian',
    mealTypes: ['dinner'],
    isVeg: false, servings: 4, proteinG: 40, calories: 520, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 35,
    source_url: 'https://www.ambitiouskitchen.com/healthy-slow-cooker-chicken-tikka-masala/',
    link: 'https://www.ambitiouskitchen.com/healthy-slow-cooker-chicken-tikka-masala/',
    desc: 'Tender chicken in a rich tomato-coconut sauce spiced with garam masala, cumin and ginger. Serve over brown rice.',
    protStr: '~40g',
    ingredients: [
      { ingredientId:'chicken_thigh',    amount:2,    unit:'lb'   },
      { ingredientId:'canned_tomatoes',  amount:2,    unit:'whole'},
      { ingredientId:'coconut_milk_can', amount:1,    unit:'whole'},
      { ingredientId:'onion',            amount:1,    unit:'whole'},
      { ingredientId:'garlic',           amount:4,    unit:'clove'},
      { ingredientId:'fresh_ginger',     amount:1,    unit:'tbsp' },
      { ingredientId:'olive_oil',        amount:2,    unit:'tbsp' },
      { ingredientId:'garam_masala',     amount:2,    unit:'tsp'  },
      { ingredientId:'cumin',            amount:1,    unit:'tsp'  },
      { ingredientId:'turmeric',         amount:0.5,  unit:'tsp'  },
      { ingredientId:'cayenne',          amount:0.25, unit:'tsp'  },
      { ingredientId:'salt',             amount:1,    unit:'tsp'  },
      { ingredientId:'cilantro',         amount:0.25, unit:'cup', note:'garnish' },
      { ingredientId:'brown_rice',       amount:1.5,  unit:'cup', note:'for serving' }
    ],
    brief_instructions: [
      'Coat chicken with yogurt, garam masala, turmeric, cumin, cayenne and salt. Marinate 15 min.',
      'Sear marinated chicken in olive oil over high heat 4–5 min until lightly charred. Remove.',
      'Sauté onion, garlic, ginger; add garam masala and canned tomatoes. Simmer 10 min.',
      'Stir in coconut milk; return chicken and simmer 15 min. Garnish with cilantro. Serve over brown rice.'
    ]
  },

  tandoori_salmon: {
    id: 'tandoori_salmon',
    name: 'Sheet Pan Tandoori Salmon',
    cuisineId: 'indian',
    mealTypes: ['dinner'],
    isVeg: false, servings: 4, proteinG: 38, calories: 470, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 20,
    source_url: 'https://www.indianhealthyrecipes.com/tandoori-salmon/',
    link: 'https://www.indianhealthyrecipes.com/tandoori-salmon/',
    desc: 'Yogurt-garam masala marinade on salmon, roasted cauliflower and sweet potato, fresh lemon.',
    protStr: '~38g',
    ingredients: [
      { ingredientId:'salmon_fillet',  amount:1.5,  unit:'lb'   },
      { ingredientId:'cauliflower',    amount:1,    unit:'whole'},
      { ingredientId:'sweet_potato',   amount:1,    unit:'whole'},
      { ingredientId:'greek_yogurt',   amount:0.25, unit:'cup'  },
      { ingredientId:'garam_masala',   amount:2,    unit:'tsp'  },
      { ingredientId:'turmeric',       amount:0.5,  unit:'tsp'  },
      { ingredientId:'cumin',          amount:1,    unit:'tsp'  },
      { ingredientId:'coriander',      amount:0.5,  unit:'tsp'  },
      { ingredientId:'cayenne',        amount:0.25, unit:'tsp'  },
      { ingredientId:'garlic',         amount:3,    unit:'clove'},
      { ingredientId:'fresh_ginger',   amount:1,    unit:'tbsp' },
      { ingredientId:'lemon',          amount:2,    unit:'whole'},
      { ingredientId:'olive_oil',      amount:2,    unit:'tbsp' },
      { ingredientId:'brown_rice',     amount:1.5,  unit:'cup', note:'for serving' }
    ],
    brief_instructions: [
      'Whisk greek yogurt, garam masala, turmeric, cumin, coriander, cayenne, garlic, ginger and lemon juice.',
      'Coat salmon fillets in yogurt marinade. Marinate 20 min minimum.',
      'Arrange marinated salmon with cauliflower and sweet potato chunks on a sheet pan with olive oil.',
      'Roast 425°F for 18–20 min until salmon flakes. Squeeze fresh lemon over everything.'
    ]
  },

  saag_paneer: {
    id: 'saag_paneer',
    name: 'Saag Paneer',
    cuisineId: 'indian',
    mealTypes: ['dinner'],
    isVeg: true, servings: 4, proteinG: 22, calories: 400, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 25,
    source_url: 'https://cookieandkate.com/palak-paneer/',
    link: 'https://cookieandkate.com/palak-paneer/',
    desc: 'Golden paneer in a rich spiced spinach and coconut milk curry. High-protein vegetarian night.',
    protStr: '~22g',
    ingredients: [
      { ingredientId:'paneer',           amount:14,   unit:'oz'   },
      { ingredientId:'frozen_spinach',   amount:2,    unit:'cup', note:'thawed and squeezed dry' },
      { ingredientId:'onion',            amount:1,    unit:'whole'},
      { ingredientId:'garlic',           amount:4,    unit:'clove'},
      { ingredientId:'fresh_ginger',     amount:1,    unit:'tbsp' },
      { ingredientId:'olive_oil',        amount:2,    unit:'tbsp' },
      { ingredientId:'garam_masala',     amount:2,    unit:'tsp'  },
      { ingredientId:'cumin',            amount:1,    unit:'tsp'  },
      { ingredientId:'turmeric',         amount:0.5,  unit:'tsp'  },
      { ingredientId:'coriander',        amount:0.5,  unit:'tsp'  },
      { ingredientId:'cayenne',          amount:0.25, unit:'tsp'  },
      { ingredientId:'coconut_milk_can', amount:1,    unit:'whole'},
      { ingredientId:'brown_rice',       amount:1.5,  unit:'cup', note:'for serving' }
    ],
    brief_instructions: [
      'Cube paneer; pan-fry in olive oil until golden on all sides, 4–5 min. Remove and set aside.',
      'Sauté onion, garlic and ginger in the same pan 5 min. Add garam masala, cumin, turmeric, coriander, cayenne.',
      'Add thawed spinach and coconut milk; simmer 10 min until sauce is creamy and fragrant.',
      'Return paneer; simmer 5 min. Season with salt. Serve over brown rice.'
    ]
  },

  // ---- Dinner — Veg ----

  chana_masala: {
    id: 'chana_masala',
    name: 'Chana Masala',
    cuisineId: 'indian',
    mealTypes: ['dinner'],
    isVeg: true, servings: 4, proteinG: 17, calories: 390, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 25,
    source_url: 'https://cookieandkate.com/quick-vegan-chana-masala/',
    link: 'https://cookieandkate.com/quick-vegan-chana-masala/',
    desc: 'Spiced chickpea curry in tomato-onion gravy. Fast stovetop, pantry staples. Ascent shake.',
    protStr: '~17g+shake',
    ingredients: [
      { ingredientId:'canned_chickpeas', amount:2,    unit:'whole'},
      { ingredientId:'canned_tomatoes',  amount:2,    unit:'whole'},
      { ingredientId:'onion',            amount:1,    unit:'whole'},
      { ingredientId:'garlic',           amount:4,    unit:'clove'},
      { ingredientId:'fresh_ginger',     amount:1,    unit:'tbsp' },
      { ingredientId:'olive_oil',        amount:2,    unit:'tbsp' },
      { ingredientId:'garam_masala',     amount:2,    unit:'tsp'  },
      { ingredientId:'cumin',            amount:1,    unit:'tsp'  },
      { ingredientId:'coriander',        amount:1,    unit:'tsp'  },
      { ingredientId:'turmeric',         amount:0.5,  unit:'tsp'  },
      { ingredientId:'cayenne',          amount:0.25, unit:'tsp'  },
      { ingredientId:'salt',             amount:1,    unit:'tsp'  },
      { ingredientId:'lemon',            amount:1,    unit:'whole'},
      { ingredientId:'cilantro',         amount:0.25, unit:'cup'  },
      { ingredientId:'pita_bread',       amount:4,    unit:'whole', note:'for serving' }
    ],
    brief_instructions: [
      'Sauté onion, garlic and ginger in olive oil 5 min. Add garam masala, cumin, coriander, turmeric, cayenne; cook 1 min.',
      'Add canned tomatoes; simmer 8 min until sauce thickens and oil separates.',
      'Add chickpeas; simmer 12 min. Mash a few chickpeas against the pot for creaminess.',
      'Squeeze in lemon juice, stir in cilantro. Serve with warm pita or over brown rice.'
    ]
  },

  dal_tadka: {
    id: 'dal_tadka',
    name: 'Dal Tadka',
    cuisineId: 'indian',
    mealTypes: ['dinner'],
    isVeg: true, servings: 4, proteinG: 16, calories: 360, carbsG: null, fatG: null,
    prepMins: 5, cookMins: 30,
    source_url: 'https://www.ambitiouskitchen.com/dal-recipe/',
    link: 'https://www.ambitiouskitchen.com/dal-recipe/',
    desc: 'Red lentils simmered with garam masala, finished with a cumin-garlic temper. Serve over brown rice. Ascent shake.',
    protStr: '~16g+shake',
    ingredients: [
      { ingredientId:'red_lentils',      amount:1.5,  unit:'cup'  },
      { ingredientId:'canned_tomatoes',  amount:1,    unit:'whole'},
      { ingredientId:'onion',            amount:1,    unit:'whole'},
      { ingredientId:'garlic',           amount:4,    unit:'clove'},
      { ingredientId:'fresh_ginger',     amount:1,    unit:'tbsp' },
      { ingredientId:'olive_oil',        amount:2,    unit:'tbsp' },
      { ingredientId:'garam_masala',     amount:1,    unit:'tsp'  },
      { ingredientId:'cumin',            amount:1,    unit:'tsp'  },
      { ingredientId:'turmeric',         amount:0.5,  unit:'tsp'  },
      { ingredientId:'cayenne',          amount:0.25, unit:'tsp'  },
      { ingredientId:'salt',             amount:1,    unit:'tsp'  },
      { ingredientId:'cilantro',         amount:0.25, unit:'cup'  },
      { ingredientId:'brown_rice',       amount:1.5,  unit:'cup', note:'for serving' }
    ],
    brief_instructions: [
      'Simmer rinsed red lentils in 4 cups water with turmeric and salt 20 min until completely soft.',
      'In a separate pan, fry onion, garlic and ginger in olive oil 5 min until golden.',
      'Add garam masala and cumin; toast 1 min. Add canned tomatoes; simmer 5 min.',
      'Combine tempering with lentils, stir and simmer 5 more min. Garnish with cilantro. Serve over rice.'
    ]
  },

  egg_curry: {
    id: 'egg_curry',
    name: 'Indian Egg Curry',
    cuisineId: 'indian',
    mealTypes: ['dinner'],
    isVeg: true, servings: 4, proteinG: 18, calories: 370, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 25,
    source_url: 'https://www.indianhealthyrecipes.com/punjabi-egg-curry-anda-curry-dhaba-style/',
    link: 'https://www.indianhealthyrecipes.com/punjabi-egg-curry-anda-curry-dhaba-style/',
    desc: 'Hard-boiled eggs in a rich Indian tomato-coconut curry with warm garam masala and fresh ginger.',
    protStr: '~18g',
    ingredients: [
      { ingredientId:'eggs',             amount:8,    unit:'whole'},
      { ingredientId:'canned_tomatoes',  amount:2,    unit:'whole'},
      { ingredientId:'onion',            amount:1,    unit:'whole'},
      { ingredientId:'garlic',           amount:4,    unit:'clove'},
      { ingredientId:'fresh_ginger',     amount:1,    unit:'tbsp' },
      { ingredientId:'olive_oil',        amount:2,    unit:'tbsp' },
      { ingredientId:'garam_masala',     amount:2,    unit:'tsp'  },
      { ingredientId:'cumin',            amount:1,    unit:'tsp'  },
      { ingredientId:'turmeric',         amount:0.5,  unit:'tsp'  },
      { ingredientId:'cayenne',          amount:0.25, unit:'tsp'  },
      { ingredientId:'coconut_milk_can', amount:0.5,  unit:'whole'},
      { ingredientId:'cilantro',         amount:0.25, unit:'cup'  },
      { ingredientId:'brown_rice',       amount:1.5,  unit:'cup', note:'for serving' }
    ],
    brief_instructions: [
      'Hard-boil 8 eggs 10 min; peel and score each with a shallow knife so sauce penetrates.',
      'Sauté onion, garlic and ginger in olive oil until golden. Add garam masala, cumin, turmeric; cook 1 min.',
      'Add canned tomatoes; simmer 10 min until thick. Stir in coconut milk; simmer 5 min.',
      'Add scored eggs; simmer 5 more min. Garnish with cilantro. Serve over brown rice.'
    ]
  },


  // ============================================================
  // ITALIAN WEEK
  // ============================================================

  // ---- Dinner — Protein ----

  chicken_pesto_pasta: {
    id: 'chicken_pesto_pasta',
    name: 'Chicken Pesto Pasta',
    cuisineId: 'italian',
    mealTypes: ['dinner'],
    isVeg: false, servings: 4, proteinG: 38, calories: 520, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 20,
    source_url: 'https://www.ambitiouskitchen.com/chicken-meatball-pesto-orzo/',
    link: 'https://www.ambitiouskitchen.com/chicken-meatball-pesto-orzo/',
    desc: 'Pan-seared chicken tossed with whole wheat pasta, basil pesto, cherry tomatoes and parmesan.',
    protStr: '~38g',
    ingredients: [
      { ingredientId:'chicken_thigh',     amount:1.5,  unit:'lb'   },
      { ingredientId:'whole_wheat_pasta', amount:12,   unit:'oz'   },
      { ingredientId:'cherry_tomato',     amount:1,    unit:'cup'  },
      { ingredientId:'pesto',             amount:0.25, unit:'cup'  },
      { ingredientId:'parmesan',          amount:0.25, unit:'cup'  },
      { ingredientId:'garlic',            amount:3,    unit:'clove'},
      { ingredientId:'olive_oil',         amount:2,    unit:'tbsp' },
      { ingredientId:'lemon',             amount:1,    unit:'whole'},
      { ingredientId:'salt',              amount:0.5,  unit:'tsp'  },
      { ingredientId:'black_pepper',      amount:0.25, unit:'tsp'  },
      { ingredientId:'fresh_basil',       amount:0.25, unit:'cup', note:'garnish' }
    ],
    brief_instructions: [
      'Cook pasta in well-salted water until al dente; reserve ½ cup pasta water before draining.',
      'Season chicken with salt and pepper; pan-sear in olive oil 4–5 min per side. Slice into strips.',
      'Toss drained pasta with pesto, sliced chicken, halved cherry tomatoes and a splash of pasta water.',
      'Top with parmesan and fresh basil. Finish with a squeeze of lemon.'
    ]
  },

  turkey_bolognese: {
    id: 'turkey_bolognese',
    name: 'Turkey Bolognese Pasta',
    cuisineId: 'italian',
    mealTypes: ['dinner'],
    isVeg: false, servings: 4, proteinG: 41, calories: 540, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 30,
    source_url: 'https://www.skinnytaste.com/turkey-bolognese/',
    link: 'https://www.skinnytaste.com/turkey-bolognese/',
    desc: 'Lean ground turkey in a rich Italian tomato sauce, tossed with whole wheat pasta and parmesan.',
    protStr: '~41g',
    ingredients: [
      { ingredientId:'ground_turkey',     amount:1.5,  unit:'lb'   },
      { ingredientId:'whole_wheat_pasta', amount:12,   unit:'oz'   },
      { ingredientId:'canned_tomatoes',   amount:2,    unit:'whole'},
      { ingredientId:'onion',             amount:1,    unit:'whole'},
      { ingredientId:'garlic',            amount:4,    unit:'clove'},
      { ingredientId:'olive_oil',         amount:2,    unit:'tbsp' },
      { ingredientId:'italian_seasoning', amount:2,    unit:'tsp'  },
      { ingredientId:'red_wine_vinegar',  amount:1,    unit:'tbsp' },
      { ingredientId:'red_pepper_flakes', amount:0.25, unit:'tsp'  },
      { ingredientId:'salt',              amount:1,    unit:'tsp'  },
      { ingredientId:'parmesan',          amount:0.25, unit:'cup', note:'for serving' },
      { ingredientId:'fresh_basil',       amount:0.25, unit:'cup', note:'garnish' }
    ],
    brief_instructions: [
      'Cook pasta in salted water until al dente; drain, reserving ½ cup pasta water.',
      'Brown ground turkey in olive oil over medium-high, breaking up finely, 5–6 min.',
      'Add onion, garlic, Italian seasoning; cook 3 min. Add canned tomatoes and red wine vinegar; simmer 15 min.',
      'Toss with pasta, adding pasta water to loosen. Top with parmesan and fresh basil.'
    ]
  },

  italian_baked_salmon: {
    id: 'italian_baked_salmon',
    name: 'Italian Herb Baked Salmon',
    cuisineId: 'italian',
    mealTypes: ['dinner'],
    isVeg: false, servings: 4, proteinG: 38, calories: 490, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 22,
    source_url: 'https://www.recipetineats.com/lemon-garlic-salmon-tray-bake-easy-healthy/',
    link: 'https://www.recipetineats.com/lemon-garlic-salmon-tray-bake-easy-healthy/',
    desc: 'Salmon roasted with burst cherry tomatoes, zucchini and Italian herbs. Finished with fresh basil and parmesan.',
    protStr: '~38g',
    ingredients: [
      { ingredientId:'salmon_fillet',     amount:1.5,  unit:'lb'   },
      { ingredientId:'cherry_tomato',     amount:2,    unit:'cup'  },
      { ingredientId:'zucchini',          amount:2,    unit:'whole'},
      { ingredientId:'garlic',            amount:4,    unit:'clove'},
      { ingredientId:'olive_oil',         amount:3,    unit:'tbsp' },
      { ingredientId:'lemon',             amount:1,    unit:'whole'},
      { ingredientId:'italian_seasoning', amount:2,    unit:'tsp'  },
      { ingredientId:'red_pepper_flakes', amount:0.25, unit:'tsp'  },
      { ingredientId:'parmesan',          amount:0.25, unit:'cup'  },
      { ingredientId:'fresh_basil',       amount:0.25, unit:'cup'  }
    ],
    brief_instructions: [
      'Toss halved cherry tomatoes and sliced zucchini with olive oil, garlic and Italian seasoning.',
      'Spread vegetables on a sheet pan; nestle salmon fillets in the center.',
      'Squeeze lemon over everything; top salmon with red pepper flakes and season with salt.',
      'Roast 400°F for 18–22 min until salmon flakes. Finish with fresh basil and parmesan.'
    ]
  },

  // ---- Dinner — Veg ----

  white_bean_pasta: {
    id: 'white_bean_pasta',
    name: 'White Bean & Tomato Pasta',
    cuisineId: 'italian',
    mealTypes: ['dinner'],
    isVeg: true, servings: 4, proteinG: 20, calories: 440, carbsG: null, fatG: null,
    prepMins: 5, cookMins: 20,
    source_url: 'https://www.budgetbytes.com/tuscan-white-bean-pasta/',
    link: 'https://www.budgetbytes.com/tuscan-white-bean-pasta/',
    desc: 'White beans, burst cherry tomatoes, garlic, lemon and parmesan. Fast 20-min pantry pasta. Ascent shake.',
    protStr: '~20g+shake',
    ingredients: [
      { ingredientId:'white_beans_can',   amount:2,    unit:'whole'},
      { ingredientId:'whole_wheat_pasta', amount:10,   unit:'oz'   },
      { ingredientId:'cherry_tomato',     amount:2,    unit:'cup'  },
      { ingredientId:'garlic',            amount:6,    unit:'clove'},
      { ingredientId:'olive_oil',         amount:3,    unit:'tbsp' },
      { ingredientId:'lemon',             amount:1,    unit:'whole'},
      { ingredientId:'parmesan',          amount:0.25, unit:'cup'  },
      { ingredientId:'fresh_basil',       amount:0.25, unit:'cup'  },
      { ingredientId:'red_pepper_flakes', amount:0.5,  unit:'tsp'  },
      { ingredientId:'salt',              amount:1,    unit:'tsp'  }
    ],
    brief_instructions: [
      'Cook pasta in salted water until al dente; reserve 1 cup pasta water before draining.',
      'Sauté sliced garlic in olive oil 2 min. Add white beans; cook 3 min until lightly crisped.',
      'Add cherry tomatoes and red pepper flakes; cook until tomatoes burst, about 4 min.',
      'Toss with pasta, lemon juice and pasta water to create a glossy sauce. Top with parmesan and basil.'
    ]
  },

  lentil_bolognese: {
    id: 'lentil_bolognese',
    name: 'Lentil Bolognese Pasta',
    cuisineId: 'italian',
    mealTypes: ['dinner'],
    isVeg: true, servings: 4, proteinG: 19, calories: 400, carbsG: null, fatG: null,
    prepMins: 5, cookMins: 30,
    source_url: 'https://minimalistbaker.com/vegan-bolognese-with-mushrooms-red-lentils/',
    link: 'https://minimalistbaker.com/vegan-bolognese-with-mushrooms-red-lentils/',
    desc: 'Red lentils simmered in a rich Italian tomato sauce. Hearty plant-based bolognese. Ascent shake.',
    protStr: '~19g+shake',
    ingredients: [
      { ingredientId:'red_lentils',       amount:1,    unit:'cup'  },
      { ingredientId:'whole_wheat_pasta', amount:10,   unit:'oz'   },
      { ingredientId:'canned_tomatoes',   amount:2,    unit:'whole'},
      { ingredientId:'onion',             amount:1,    unit:'whole'},
      { ingredientId:'garlic',            amount:4,    unit:'clove'},
      { ingredientId:'olive_oil',         amount:2,    unit:'tbsp' },
      { ingredientId:'italian_seasoning', amount:2,    unit:'tsp'  },
      { ingredientId:'red_pepper_flakes', amount:0.25, unit:'tsp'  },
      { ingredientId:'salt',              amount:1,    unit:'tsp'  },
      { ingredientId:'parmesan',          amount:0.25, unit:'cup', note:'for serving' },
      { ingredientId:'fresh_basil',       amount:0.25, unit:'cup', note:'garnish' }
    ],
    brief_instructions: [
      'Cook pasta in salted water until al dente; drain, reserving ½ cup pasta water.',
      'Sauté onion and garlic in olive oil 5 min. Add Italian seasoning and red pepper flakes; cook 1 min.',
      'Add red lentils, canned tomatoes and 1½ cups water; simmer 20 min until lentils are very soft.',
      'Toss with pasta, adding pasta water to loosen. Top with parmesan and fresh basil.'
    ]
  },

  spinach_chickpea_pasta: {
    id: 'spinach_chickpea_pasta',
    name: 'Spinach & Chickpea Pasta',
    cuisineId: 'italian',
    mealTypes: ['dinner'],
    isVeg: true, servings: 4, proteinG: 18, calories: 420, carbsG: null, fatG: null,
    prepMins: 5, cookMins: 20,
    source_url: 'https://cookieandkate.com/tomato-chickpea-pasta-recipe/',
    link: 'https://cookieandkate.com/tomato-chickpea-pasta-recipe/',
    desc: 'Quick pasta with garlic chickpeas, wilted spinach, lemon and parmesan. 20-min weeknight dinner. Ascent shake.',
    protStr: '~18g+shake',
    ingredients: [
      { ingredientId:'whole_wheat_pasta', amount:10,   unit:'oz'   },
      { ingredientId:'canned_chickpeas',  amount:2,    unit:'whole'},
      { ingredientId:'fresh_spinach',     amount:4,    unit:'cup'  },
      { ingredientId:'garlic',            amount:5,    unit:'clove'},
      { ingredientId:'olive_oil',         amount:3,    unit:'tbsp' },
      { ingredientId:'lemon',             amount:1,    unit:'whole'},
      { ingredientId:'parmesan',          amount:0.25, unit:'cup'  },
      { ingredientId:'red_pepper_flakes', amount:0.5,  unit:'tsp'  },
      { ingredientId:'salt',              amount:1,    unit:'tsp'  }
    ],
    brief_instructions: [
      'Cook pasta in well-salted water until al dente; reserve 1 cup pasta water before draining.',
      'Sauté sliced garlic in olive oil over medium heat 2 min. Add chickpeas; cook 3 min.',
      'Add fresh spinach and toss until wilted. Add red pepper flakes and cooked pasta.',
      'Toss with lemon juice and pasta water to make a silky sauce. Top with parmesan.'
    ]
  },


  // ============================================================
  // SPANISH WEEK
  // ============================================================

  // ---- Dinner — Protein ----

  pollo_al_ajillo: {
    id: 'pollo_al_ajillo',
    name: 'Pollo al Ajillo',
    cuisineId: 'spanish',
    mealTypes: ['dinner'],
    isVeg: false, servings: 4, proteinG: 40, calories: 510, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 30,
    source_url: 'https://spainonafork.com/spanish-garlic-chicken-one-of-spains-most-iconic-recipes/',
    link: 'https://spainonafork.com/spanish-garlic-chicken-one-of-spains-most-iconic-recipes/',
    desc: 'Chicken thighs seared then braised in a garlic-sherry tomato sauce. Classic Spanish garlic chicken.',
    protStr: '~40g',
    ingredients: [
      { ingredientId:'chicken_thigh',  amount:2,    unit:'lb'   },
      { ingredientId:'garlic',         amount:10,   unit:'clove'},
      { ingredientId:'olive_oil',      amount:3,    unit:'tbsp' },
      { ingredientId:'smoked_paprika', amount:1,    unit:'tsp'  },
      { ingredientId:'dried_oregano',  amount:0.5,  unit:'tsp'  },
      { ingredientId:'sherry_vinegar', amount:2,    unit:'tbsp' },
      { ingredientId:'canned_tomatoes',amount:1,    unit:'whole'},
      { ingredientId:'parsley',        amount:0.25, unit:'cup'  },
      { ingredientId:'brown_rice',     amount:1.5,  unit:'cup', note:'for serving' }
    ],
    brief_instructions: [
      'Season chicken thighs with smoked paprika, oregano, salt and black pepper.',
      'Sear in olive oil over medium-high 5 min per side until golden. Remove and set aside.',
      'Thinly slice 8 garlic cloves; cook in same pan 2 min. Add sherry vinegar and canned tomatoes.',
      'Return chicken; simmer covered 20 min until sauce thickens. Garnish with parsley. Serve over brown rice.'
    ]
  },

  spanish_baked_salmon: {
    id: 'spanish_baked_salmon',
    name: 'Spanish Paprika Salmon',
    cuisineId: 'spanish',
    mealTypes: ['dinner'],
    isVeg: false, servings: 4, proteinG: 38, calories: 470, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 20,
    source_url: 'https://spainonafork.com/spanish-salmon-a-la-gallega-recipe/',
    link: 'https://spainonafork.com/spanish-salmon-a-la-gallega-recipe/',
    desc: 'Salmon roasted with smoked paprika, sweet peppers and cherry tomatoes. Bright, bold Spanish flavors.',
    protStr: '~38g',
    ingredients: [
      { ingredientId:'salmon_fillet',  amount:1.5,  unit:'lb'   },
      { ingredientId:'bell_pepper',    amount:2,    unit:'whole'},
      { ingredientId:'cherry_tomato',  amount:1,    unit:'cup'  },
      { ingredientId:'garlic',         amount:4,    unit:'clove'},
      { ingredientId:'olive_oil',      amount:3,    unit:'tbsp' },
      { ingredientId:'smoked_paprika', amount:2,    unit:'tsp'  },
      { ingredientId:'cumin',          amount:0.5,  unit:'tsp'  },
      { ingredientId:'dried_oregano',  amount:0.5,  unit:'tsp'  },
      { ingredientId:'lemon',          amount:1,    unit:'whole'},
      { ingredientId:'parsley',        amount:0.25, unit:'cup'  },
      { ingredientId:'brown_rice',     amount:1.5,  unit:'cup', note:'for serving' }
    ],
    brief_instructions: [
      'Whisk olive oil, smoked paprika, cumin, minced garlic and lemon juice into a marinade.',
      'Coat salmon fillets in marinade. Slice bell peppers into thin strips.',
      'Arrange salmon with peppers and cherry tomatoes on a sheet pan.',
      'Roast 400°F for 18–20 min until salmon flakes. Finish with fresh parsley and extra lemon.'
    ]
  },

  albondigas_bowl: {
    id: 'albondigas_bowl',
    name: 'Albóndigas Bowl',
    cuisineId: 'spanish',
    mealTypes: ['dinner'],
    isVeg: false, servings: 4, proteinG: 38, calories: 500, carbsG: null, fatG: null,
    prepMins: 15, cookMins: 25,
    source_url: 'https://www.themediterraneandish.com/albondigas-spanish-meatballs/',
    link: 'https://www.themediterraneandish.com/albondigas-spanish-meatballs/',
    desc: 'Ground turkey meatballs in a smoky smoked-paprika tomato sauce. Spanish albóndigas rice bowl.',
    protStr: '~38g',
    ingredients: [
      { ingredientId:'ground_turkey',  amount:1.5,  unit:'lb'   },
      { ingredientId:'eggs',           amount:1,    unit:'whole'},
      { ingredientId:'garlic',         amount:5,    unit:'clove'},
      { ingredientId:'smoked_paprika', amount:2,    unit:'tsp'  },
      { ingredientId:'dried_oregano',  amount:1,    unit:'tsp'  },
      { ingredientId:'olive_oil',      amount:2,    unit:'tbsp' },
      { ingredientId:'canned_tomatoes',amount:2,    unit:'whole'},
      { ingredientId:'onion',          amount:1,    unit:'whole'},
      { ingredientId:'brown_rice',     amount:1.5,  unit:'cup', note:'for serving' },
      { ingredientId:'parsley',        amount:0.25, unit:'cup'  }
    ],
    brief_instructions: [
      'Mix turkey, 1 egg, 2 minced garlic cloves, 1 tsp smoked paprika, oregano, salt. Roll into 16 meatballs.',
      'Brown meatballs in olive oil over medium-high 3 min per side until golden. Remove.',
      'Sauté diced onion and remaining garlic; add 1 tsp smoked paprika, then canned tomatoes. Simmer 8 min.',
      'Return meatballs; cover and simmer 15 min. Garnish with parsley. Serve over brown rice.'
    ]
  },

  // ---- Dinner — Veg ----

  garbanzos_con_espinacas: {
    id: 'garbanzos_con_espinacas',
    name: 'Garbanzos con Espinacas',
    cuisineId: 'spanish',
    mealTypes: ['dinner'],
    isVeg: true, servings: 4, proteinG: 16, calories: 380, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 20,
    source_url: 'https://spainonafork.com/spanish-spinach-and-chickpeas/',
    link: 'https://spainonafork.com/spanish-spinach-and-chickpeas/',
    desc: 'Spanish chickpeas and spinach in a smoky paprika tomato sauce. A Seville classic. Ascent shake.',
    protStr: '~16g+shake',
    ingredients: [
      { ingredientId:'canned_chickpeas', amount:2,    unit:'whole'},
      { ingredientId:'fresh_spinach',    amount:4,    unit:'cup'  },
      { ingredientId:'garlic',           amount:5,    unit:'clove'},
      { ingredientId:'olive_oil',        amount:3,    unit:'tbsp' },
      { ingredientId:'smoked_paprika',   amount:2,    unit:'tsp'  },
      { ingredientId:'cumin',            amount:1,    unit:'tsp'  },
      { ingredientId:'canned_tomatoes',  amount:1,    unit:'whole'},
      { ingredientId:'sherry_vinegar',   amount:1,    unit:'tbsp' },
      { ingredientId:'lemon',            amount:1,    unit:'whole'},
      { ingredientId:'pita_bread',       amount:4,    unit:'whole', note:'for serving' }
    ],
    brief_instructions: [
      'Toast cumin and smoked paprika in olive oil 30 sec. Add sliced garlic; cook 1 min until golden.',
      'Add drained chickpeas; cook 3 min, tossing occasionally, until slightly crisped.',
      'Add canned tomatoes and sherry vinegar; simmer 10 min until sauce reduces and coats chickpeas.',
      'Fold in fresh spinach until wilted. Finish with lemon juice. Serve with warm pita.'
    ]
  },

  pisto_manchego: {
    id: 'pisto_manchego',
    name: 'Pisto Manchego with Eggs',
    cuisineId: 'spanish',
    mealTypes: ['dinner'],
    isVeg: true, servings: 4, proteinG: 14, calories: 350, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 30,
    source_url: 'https://spainonafork.com/spanish-ratatouille-pisto-manchego-recipe/',
    link: 'https://spainonafork.com/spanish-ratatouille-pisto-manchego-recipe/',
    desc: 'Spanish vegetable stew with zucchini, peppers and eggs baked on top. Smoky paprika and oregano. Ascent shake.',
    protStr: '~14g+shake',
    ingredients: [
      { ingredientId:'zucchini',       amount:2,    unit:'whole'},
      { ingredientId:'bell_pepper',    amount:2,    unit:'whole'},
      { ingredientId:'onion',          amount:1,    unit:'whole'},
      { ingredientId:'canned_tomatoes',amount:2,    unit:'whole'},
      { ingredientId:'garlic',         amount:4,    unit:'clove'},
      { ingredientId:'olive_oil',      amount:3,    unit:'tbsp' },
      { ingredientId:'smoked_paprika', amount:1,    unit:'tsp'  },
      { ingredientId:'dried_oregano',  amount:1,    unit:'tsp'  },
      { ingredientId:'eggs',           amount:4,    unit:'whole'},
      { ingredientId:'brown_rice',     amount:1.5,  unit:'cup', note:'for serving' }
    ],
    brief_instructions: [
      'Dice zucchini, bell pepper and onion. Sauté in olive oil over medium heat 8 min until softened.',
      'Add garlic, smoked paprika and oregano; cook 1 min. Add canned tomatoes; simmer 15 min.',
      'Make 4 wells in the vegetable stew; crack one egg into each. Cover and cook 6–8 min.',
      'Serve over brown rice or with crusty bread. Ascent shake tonight.'
    ]
  },

  spanish_lentil_stew: {
    id: 'spanish_lentil_stew',
    name: 'Spanish Lentil Stew',
    cuisineId: 'spanish',
    mealTypes: ['dinner'],
    isVeg: false, servings: 4, proteinG: 22, calories: 410, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 30,
    source_url: 'https://spainonafork.com/classic-spanish-lentil-stew-recipe/',
    link: 'https://spainonafork.com/classic-spanish-lentil-stew-recipe/',
    desc: 'Red lentils simmered with smoky Spanish chorizo, smoked paprika and a sherry vinegar finish.',
    protStr: '~22g',
    ingredients: [
      { ingredientId:'red_lentils',     amount:1.5,  unit:'cup'  },
      { ingredientId:'spanish_chorizo', amount:4,    unit:'oz'   },
      { ingredientId:'garlic',          amount:4,    unit:'clove'},
      { ingredientId:'onion',           amount:1,    unit:'whole'},
      { ingredientId:'canned_tomatoes', amount:1,    unit:'whole'},
      { ingredientId:'smoked_paprika',  amount:2,    unit:'tsp'  },
      { ingredientId:'cumin',           amount:1,    unit:'tsp'  },
      { ingredientId:'olive_oil',       amount:2,    unit:'tbsp' },
      { ingredientId:'sherry_vinegar',  amount:1,    unit:'tbsp' },
      { ingredientId:'parsley',         amount:0.25, unit:'cup'  }
    ],
    brief_instructions: [
      'Slice chorizo; cook in olive oil 3 min until fat renders. Add diced onion and garlic; cook 4 min.',
      'Add smoked paprika and cumin; cook 1 min. Add red lentils and canned tomatoes.',
      'Add 3 cups water; bring to boil then simmer 20–25 min until lentils are completely soft.',
      'Splash in sherry vinegar; season with salt. Garnish with parsley. Serve as is or over rice.'
    ]
  },


  // ============================================================
  // CARIBBEAN WEEK
  // ============================================================

  // ---- Dinner — Protein ----

  jerk_chicken: {
    id: 'jerk_chicken',
    name: 'Jerk Chicken',
    cuisineId: 'caribbean',
    mealTypes: ['dinner'],
    isVeg: false, servings: 4, proteinG: 40, calories: 510, carbsG: null, fatG: null,
    prepMins: 15, cookMins: 30,
    source_url: 'https://caribbeanpot.com/the-ultimate-oven-jerk-chicken/',
    link: 'https://caribbeanpot.com/the-ultimate-oven-jerk-chicken/',
    desc: 'Boldly spiced jerk chicken with allspice, thyme and scotch bonnet heat. Caribbean barbecue classic.',
    protStr: '~40g',
    ingredients: [
      { ingredientId:'chicken_thigh',  amount:2,    unit:'lb'   },
      { ingredientId:'jerk_seasoning', amount:3,    unit:'tbsp' },
      { ingredientId:'garlic',         amount:4,    unit:'clove'},
      { ingredientId:'fresh_ginger',   amount:1,    unit:'tbsp' },
      { ingredientId:'lime',           amount:2,    unit:'whole'},
      { ingredientId:'allspice',       amount:1,    unit:'tsp'  },
      { ingredientId:'thyme',          amount:4,    unit:'whole', note:'sprigs' },
      { ingredientId:'olive_oil',      amount:2,    unit:'tbsp' },
      { ingredientId:'brown_rice',     amount:1.5,  unit:'cup', note:'for serving' }
    ],
    brief_instructions: [
      'Mix jerk seasoning, minced garlic, ginger, lime juice, ground allspice, thyme and olive oil into a paste.',
      'Score chicken thighs and coat generously in jerk paste. Marinate at least 30 min, or overnight.',
      'Roast at 425°F for 25–30 min until chicken is charred at edges and reads 165°F internal temp.',
      'Rest 5 min. Serve over brown rice with lime wedges.'
    ]
  },

  jerk_salmon: {
    id: 'jerk_salmon',
    name: 'Jerk Salmon',
    cuisineId: 'caribbean',
    mealTypes: ['dinner'],
    isVeg: false, servings: 4, proteinG: 38, calories: 470, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 18,
    source_url: 'https://caribbeanpot.com/incredible-jerk-salmon/',
    link: 'https://caribbeanpot.com/incredible-jerk-salmon/',
    desc: 'Sheet pan jerk-spiced salmon — bold allspice and lime heat, ready in under 30 minutes.',
    protStr: '~38g',
    ingredients: [
      { ingredientId:'salmon_fillet',  amount:1.5,  unit:'lb'   },
      { ingredientId:'jerk_seasoning', amount:2,    unit:'tbsp' },
      { ingredientId:'garlic',         amount:3,    unit:'clove'},
      { ingredientId:'lime',           amount:2,    unit:'whole'},
      { ingredientId:'allspice',       amount:0.5,  unit:'tsp'  },
      { ingredientId:'thyme',          amount:3,    unit:'whole', note:'sprigs' },
      { ingredientId:'olive_oil',      amount:2,    unit:'tbsp' },
      { ingredientId:'brown_rice',     amount:1.5,  unit:'cup', note:'for serving' }
    ],
    brief_instructions: [
      'Whisk jerk seasoning, minced garlic, ground allspice, lime juice and olive oil.',
      'Coat salmon fillets in jerk mixture; let marinate 15–30 min.',
      'Arrange on a lined sheet pan; roast 400°F for 14–18 min until salmon flakes easily.',
      'Serve over brown rice with extra lime wedges and fresh thyme sprigs.'
    ]
  },

  caribbean_brown_stew_chicken: {
    id: 'caribbean_brown_stew_chicken',
    name: 'Caribbean Brown Stew Chicken',
    cuisineId: 'caribbean',
    mealTypes: ['dinner'],
    isVeg: false, servings: 4, proteinG: 38, calories: 500, carbsG: null, fatG: null,
    prepMins: 15, cookMins: 40,
    source_url: 'https://caribbeanpot.com/the-ultimate-jamaican-brown-stew-chicken/',
    link: 'https://caribbeanpot.com/the-ultimate-jamaican-brown-stew-chicken/',
    desc: 'Classic Caribbean brown stew chicken — deeply caramelized, braised with allspice, thyme and soy sauce.',
    protStr: '~38g',
    ingredients: [
      { ingredientId:'chicken_thigh',  amount:2,    unit:'lb'   },
      { ingredientId:'garlic',         amount:4,    unit:'clove'},
      { ingredientId:'onion',          amount:1,    unit:'whole'},
      { ingredientId:'bell_pepper',    amount:1,    unit:'whole'},
      { ingredientId:'canned_tomatoes',amount:1,    unit:'whole'},
      { ingredientId:'allspice',       amount:1,    unit:'tsp'  },
      { ingredientId:'thyme',          amount:4,    unit:'whole', note:'sprigs' },
      { ingredientId:'soy_sauce',      amount:2,    unit:'tbsp' },
      { ingredientId:'olive_oil',      amount:2,    unit:'tbsp' },
      { ingredientId:'brown_rice',     amount:1.5,  unit:'cup', note:'for serving' }
    ],
    brief_instructions: [
      'Season chicken with allspice, minced garlic, soy sauce, thyme, salt. Marinate 15 min.',
      'Brown chicken in oil over medium-high 5–6 min per side until deeply caramelized. Remove.',
      'Sauté onion and bell pepper 3 min. Add canned tomatoes and 1 cup water; stir.',
      'Return chicken; simmer covered 30 min until sauce is thick and chicken is tender. Serve over rice.'
    ]
  },

  // ---- Dinner — Veg ----

  caribbean_kidney_bean_curry: {
    id: 'caribbean_kidney_bean_curry',
    name: 'Caribbean Kidney Bean Curry',
    cuisineId: 'caribbean',
    mealTypes: ['dinner'],
    isVeg: true, servings: 4, proteinG: 16, calories: 410, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 25,
    source_url: 'https://healthiersteps.com/kidney-bean-curry-jamaican-style/',
    link: 'https://healthiersteps.com/kidney-bean-curry-jamaican-style/',
    desc: 'Kidney beans in a creamy coconut milk curry with allspice, thyme and fresh ginger. Ascent shake.',
    protStr: '~16g+shake',
    ingredients: [
      { ingredientId:'kidney_beans_can', amount:2,    unit:'whole'},
      { ingredientId:'coconut_milk_can', amount:1,    unit:'whole'},
      { ingredientId:'onion',            amount:1,    unit:'whole'},
      { ingredientId:'garlic',           amount:4,    unit:'clove'},
      { ingredientId:'fresh_ginger',     amount:1,    unit:'tbsp' },
      { ingredientId:'thyme',            amount:4,    unit:'whole', note:'sprigs' },
      { ingredientId:'allspice',         amount:1,    unit:'tsp'  },
      { ingredientId:'canned_tomatoes',  amount:1,    unit:'whole'},
      { ingredientId:'olive_oil',        amount:2,    unit:'tbsp' },
      { ingredientId:'brown_rice',       amount:1.5,  unit:'cup', note:'for serving' }
    ],
    brief_instructions: [
      'Sauté diced onion, garlic and ginger in olive oil 5 min. Add ground allspice and thyme sprigs.',
      'Add drained kidney beans and canned tomatoes; cook 5 min, stirring.',
      'Pour in coconut milk; simmer 15–20 min until sauce thickens and beans are deeply flavored.',
      'Remove thyme sprigs, season with salt. Serve over brown rice.'
    ]
  },

  black_bean_plantain_bowl: {
    id: 'black_bean_plantain_bowl',
    name: 'Black Bean & Plantain Bowl',
    cuisineId: 'caribbean',
    mealTypes: ['dinner'],
    isVeg: true, servings: 4, proteinG: 13, calories: 430, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 20,
    source_url: 'https://minimalistbaker.com/roasted-plantain-black-bean-vegan-bowl/',
    link: 'https://minimalistbaker.com/roasted-plantain-black-bean-vegan-bowl/',
    desc: 'Sweet fried plantains over spiced black beans and brown rice with cilantro and lime. Ascent shake.',
    protStr: '~13g+shake',
    ingredients: [
      { ingredientId:'black_beans_can', amount:2,    unit:'whole'},
      { ingredientId:'plantains',       amount:2,    unit:'whole', note:'ripe, yellow-black' },
      { ingredientId:'onion',           amount:1,    unit:'whole'},
      { ingredientId:'garlic',          amount:3,    unit:'clove'},
      { ingredientId:'cumin',           amount:1,    unit:'tsp'  },
      { ingredientId:'allspice',        amount:0.5,  unit:'tsp'  },
      { ingredientId:'olive_oil',       amount:3,    unit:'tbsp' },
      { ingredientId:'lime',            amount:2,    unit:'whole'},
      { ingredientId:'cilantro',        amount:0.25, unit:'cup'  },
      { ingredientId:'brown_rice',      amount:1.5,  unit:'cup', note:'for serving' }
    ],
    brief_instructions: [
      'Slice ripe plantains diagonally ½ inch thick. Pan-fry in olive oil 3 min per side until golden.',
      'Sauté diced onion and garlic in oil 4 min. Add cumin and allspice; cook 1 min.',
      'Add black beans with a splash of water; simmer 10 min until flavors meld.',
      'Build bowls: brown rice, spiced black beans, fried plantains, cilantro and fresh lime.'
    ]
  },

  caribbean_pumpkin_curry: {
    id: 'caribbean_pumpkin_curry',
    name: 'Caribbean Pumpkin Curry',
    cuisineId: 'caribbean',
    mealTypes: ['dinner'],
    isVeg: true, servings: 4, proteinG: 14, calories: 450, carbsG: null, fatG: null,
    prepMins: 10, cookMins: 30,
    source_url: 'https://caribbeanpot.com/recipes/coconut-curry-pumpkin-soup/',
    link: 'https://caribbeanpot.com/recipes/coconut-curry-pumpkin-soup/',
    desc: 'Sweet potato and chickpeas in a creamy coconut milk curry with allspice and fresh thyme. Ascent shake.',
    protStr: '~14g+shake',
    ingredients: [
      { ingredientId:'sweet_potato',     amount:2,    unit:'whole'},
      { ingredientId:'canned_chickpeas', amount:2,    unit:'whole'},
      { ingredientId:'coconut_milk_can', amount:1,    unit:'whole'},
      { ingredientId:'onion',            amount:1,    unit:'whole'},
      { ingredientId:'garlic',           amount:4,    unit:'clove'},
      { ingredientId:'fresh_ginger',     amount:1,    unit:'tbsp' },
      { ingredientId:'allspice',         amount:1,    unit:'tsp'  },
      { ingredientId:'thyme',            amount:4,    unit:'whole', note:'sprigs' },
      { ingredientId:'canned_tomatoes',  amount:1,    unit:'whole'},
      { ingredientId:'olive_oil',        amount:2,    unit:'tbsp' },
      { ingredientId:'brown_rice',       amount:1.5,  unit:'cup', note:'for serving' }
    ],
    brief_instructions: [
      'Sauté diced onion, garlic and ginger in olive oil 5 min. Add allspice and thyme; cook 1 min.',
      'Add cubed sweet potato; stir and cook 3 min.',
      'Pour in canned tomatoes and coconut milk; add chickpeas. Bring to simmer.',
      'Cook 20 min until sweet potato is completely tender. Remove thyme; season. Serve over brown rice.'
    ]
  },


};
