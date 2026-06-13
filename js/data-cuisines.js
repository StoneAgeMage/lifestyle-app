// ============================================================
// DATA-CUISINES — cuisine definitions
// 8-cuisine rotation: Chinese · Greek · Mexican · Thai
//   · Indian · Italian · Spanish · Caribbean
// ============================================================

const CUISINE_CATALOG = {

  chinese: {
    id: 'chinese',
    name: 'Chinese',
    colorClass: 'h1',
    recipeIds: [
      'sesame_chicken',
      'soy_glazed_salmon',
      'kung_pao_chicken',
      'tofu_cashew_curry',
      'egg_fried_rice',
      'bok_choy_tofu_stir_fry',
      'sesame_ginger_dressing',
      'sesame_soy_marinade'
    ],
    stapleIngredientIds: [
      'soy_sauce', 'sesame_oil', 'rice_vinegar', 'oyster_sauce',
      'garlic', 'fresh_ginger', 'brown_rice', 'coconut_milk_can'
    ],
    bowlName: 'Soy-Ginger Grain Bowl',
    sauceName: 'Sesame-Ginger Dressing',
    sauceId: 'sesame_ginger_dressing',
    flexMeal: { name: 'Rice Bowl + Fried Eggs', desc: 'Leftover grain + veg + 2 eggs + sesame-soy sauce.' }
  },

  greek: {
    id: 'greek',
    name: 'Greek',
    colorClass: 'h2',
    recipeIds: [
      'moroccan_chicken',
      'herb_baked_salmon',
      'greek_turkey_meatballs',
      'tomato_lentil_soup',
      'shakshuka_chickpeas',
      'spanakopita_bowl',
      'lemon_herb_tahini',
      'moroccan_marinade'
    ],
    stapleIngredientIds: [
      'olive_oil', 'garlic', 'dried_oregano', 'cumin',
      'lemon', 'tahini', 'feta_cheese', 'canned_tomatoes'
    ],
    bowlName: 'Lemon-Herb Grain Bowl',
    sauceName: 'Lemon-Herb Tahini Dressing',
    sauceId: 'lemon_herb_tahini',
    flexMeal: { name: 'Shakshuka', desc: 'Eggs poached in spiced tomato sauce. 20 min, pantry staples.' }
  },

  mexican: {
    id: 'mexican',
    name: 'Mexican',
    colorClass: 'h3',
    recipeIds: [
      'sazon_chicken',
      'chipotle_chicken_bowls',
      'sheet_pan_fajitas',
      'sweet_potato_lentil_stew',
      'black_bean_sweet_potato',
      'mexican_black_bean_soup',
      'cilantro_lime_dressing',
      'sazon_marinade'
    ],
    stapleIngredientIds: [
      'olive_oil', 'garlic', 'cumin', 'coriander', 'smoked_paprika',
      'dried_oregano', 'lime', 'cilantro'
    ],
    bowlName: 'Cumin-Lime Grain Bowl',
    sauceName: 'Cilantro-Lime Dressing',
    sauceId: 'cilantro_lime_dressing',
    flexMeal: { name: 'Black Bean Tacos', desc: 'Corn tortillas, beans, avocado, pickled onion, salsa. Zero cooking.' }
  },

  thai: {
    id: 'thai',
    name: 'Thai',
    colorClass: 'h4',
    recipeIds: [
      'thai_basil_chicken',
      'thai_honey_garlic_salmon',
      'thai_larb_chicken',
      'thai_peanut_curry',
      'tofu_pad_thai',
      'thai_coconut_green_curry',
      'thai_peanut_dressing',
      'thai_basil_sauce'
    ],
    stapleIngredientIds: [
      'fish_sauce', 'oyster_sauce', 'soy_sauce', 'sesame_oil',
      'peanut_butter', 'red_curry_paste', 'coconut_milk_can',
      'rice_vinegar', 'jasmine_rice'
    ],
    bowlName: 'Thai Peanut Grain Bowl',
    sauceName: 'Thai Peanut Dressing',
    sauceId: 'thai_peanut_dressing',
    flexMeal: { name: 'Peanut Noodle Bowl', desc: 'Rice noodles + remaining peanut sauce + shredded cabbage + edamame. 10 min.' }
  },

  indian: {
    id: 'indian',
    name: 'Indian',
    colorClass: 'h5',
    recipeIds: [
      'chicken_tikka_masala',
      'tandoori_salmon',
      'saag_paneer',
      'chana_masala',
      'dal_tadka',
      'egg_curry',
      'mango_lime_dressing',
      'indian_spice_marinade'
    ],
    stapleIngredientIds: [
      'olive_oil', 'garlic', 'fresh_ginger', 'garam_masala',
      'cumin', 'turmeric', 'coriander', 'canned_tomatoes',
      'coconut_milk_can', 'brown_rice'
    ],
    bowlName: 'Garam Spice Grain Bowl',
    sauceName: 'Mango-Lime Dressing',
    sauceId: 'mango_lime_dressing',
    flexMeal: { name: 'Egg Bhurji', desc: 'Scrambled eggs with onion, tomato, garam masala. 10 min, pantry staples.' }
  },

  italian: {
    id: 'italian',
    name: 'Italian',
    colorClass: 'h6',
    recipeIds: [
      'chicken_pesto_pasta',
      'turkey_bolognese',
      'italian_baked_salmon',
      'white_bean_pasta',
      'lentil_bolognese',
      'spinach_chickpea_pasta',
      'lemon_basil_vinaigrette',
      'italian_herb_marinade'
    ],
    stapleIngredientIds: [
      'olive_oil', 'garlic', 'canned_tomatoes', 'red_wine_vinegar',
      'italian_seasoning', 'red_pepper_flakes', 'parmesan',
      'whole_wheat_pasta', 'lemon'
    ],
    bowlName: 'Basil Parmesan Grain Bowl',
    sauceName: 'Lemon-Basil Vinaigrette',
    sauceId: 'lemon_basil_vinaigrette',
    flexMeal: { name: 'Pasta Aglio e Olio', desc: 'Pasta, olive oil, garlic, red pepper, parmesan. 15 min, pure pantry.' }
  },

  spanish: {
    id: 'spanish',
    name: 'Spanish',
    colorClass: 'h7',
    recipeIds: [
      'pollo_al_ajillo',
      'spanish_baked_salmon',
      'albondigas_bowl',
      'garbanzos_con_espinacas',
      'pisto_manchego',
      'spanish_lentil_stew',
      'mojo_verde_dressing',
      'smoked_paprika_marinade'
    ],
    stapleIngredientIds: [
      'olive_oil', 'garlic', 'smoked_paprika', 'cumin',
      'dried_oregano', 'sherry_vinegar', 'canned_tomatoes', 'brown_rice'
    ],
    bowlName: 'Smoked Paprika Grain Bowl',
    sauceName: 'Mojo Verde Dressing',
    sauceId: 'mojo_verde_dressing',
    flexMeal: { name: 'Pan con Tomate', desc: 'Toast rubbed with garlic and grated tomato, drizzled with olive oil. Zero cooking.' }
  },

  caribbean: {
    id: 'caribbean',
    name: 'Caribbean',
    colorClass: 'h8',
    recipeIds: [
      'jerk_chicken',
      'jerk_salmon',
      'caribbean_brown_stew_chicken',
      'caribbean_kidney_bean_curry',
      'black_bean_plantain_bowl',
      'caribbean_pumpkin_curry',
      'jerk_dressing',
      'coconut_lime_marinade'
    ],
    stapleIngredientIds: [
      'olive_oil', 'garlic', 'allspice', 'thyme',
      'jerk_seasoning', 'coconut_milk_can', 'brown_rice',
      'lime', 'fresh_ginger'
    ],
    bowlName: 'Coconut-Lime Grain Bowl',
    sauceName: 'Jerk-Lime Dressing',
    sauceId: 'jerk_dressing',
    flexMeal: { name: 'Rice & Peas Bowl', desc: 'Leftover rice + canned kidney beans + coconut milk + allspice. 10 min stovetop.' }
  }

};

// Backward compat: saved plans may still have old cuisine IDs
CUISINE_CATALOG['asian']          = CUISINE_CATALOG['chinese'];
CUISINE_CATALOG['mediterranean']  = CUISINE_CATALOG['greek'];

// Advisory input to the engine — do NOT use this directly for date resolution.
const CUISINE_ROTATION = ['chinese', 'greek', 'mexican', 'thai', 'indian', 'italian', 'spanish', 'caribbean'];
