// ============================================================
// DATA-CUISINES — cuisine definitions
// Phase 2. The 4 active cuisines have full recipe mappings.
// Korean, Japanese, Vietnamese, Indian added in Phase 5.
// ============================================================

const CUISINE_CATALOG = {

  asian: {
    id: 'asian',
    name: 'Asian',
    colorClass: 'h1',
    recipeIds: [
      'sesame_chicken',
      'tofu_cashew_curry',
      'sesame_ginger_dressing',
      'sesame_soy_marinade'
    ],
    stapleIngredientIds: [
      'soy_sauce', 'sesame_oil', 'rice_vinegar', 'garlic',
      'fresh_ginger', 'brown_rice', 'coconut_milk_can'
    ],
    bowlName: 'Soy-Ginger Grain Bowl',
    sauceName: 'Sesame-Ginger Dressing',
    sauceId: 'sesame_ginger_dressing',
    flexMeal: { name: 'Rice Bowl + Fried Eggs', desc: 'Leftover grain + veg + 2 eggs + sauce.' }
  },

  mediterranean: {
    id: 'mediterranean',
    name: 'Mediterranean',
    colorClass: 'h2',
    recipeIds: [
      'moroccan_chicken',
      'tomato_lentil_soup',
      'lemon_herb_tahini',
      'moroccan_marinade'
    ],
    stapleIngredientIds: [
      'olive_oil', 'garlic', 'cumin', 'turmeric', 'cinnamon',
      'lemon', 'tahini', 'canned_tomatoes'
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
      'sweet_potato_lentil_stew',
      'cilantro_lime_dressing',
      'sazon_marinade'
    ],
    stapleIngredientIds: [
      'olive_oil', 'garlic', 'cumin', 'coriander', 'turmeric',
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
      'thai_peanut_curry',
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
  }

  // Phase 5: korean, japanese, vietnamese, indian
};

// Advisory input to the engine — do NOT use this directly for date resolution.
// The engine owns week-index calculation and cycle alignment. This array tells
// the engine the intended order; the engine is the single source of truth for
// which cuisine is active on any given date.
const CUISINE_ROTATION = ['asian', 'mediterranean', 'mexican', 'thai'];
