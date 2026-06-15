// ============================================================
// DATA-RECIPES — locked full-batch recipe catalog
//
// _ingredients  locked at Phase 1 (gram-standardized from source URL)
// _totalMacros  locked at Phase 2 (USDA FoodData Central)
// lastUsedWeek  runtime only — updated by engine on plan confirm
//
// Serving division formula (computed in engine.js):
//   N = Math.round(calories / 650)
//   N = Math.min(Math.max(N, 1), 5)
//   if (calories / N < 400) N = Math.max(N - 1, 1)
//
// Rank / cooldown: A = 2wk, B = 4wk, C = 10wk
//
//============================================================

const RECIPE_CATALOG = {

  // ----------------------------------------------------------------
  // R1 — Sheet Pan Sesame Chicken
  // ----------------------------------------------------------------
  sesame_chicken: {
    id:           'sesame_chicken',
    name:         'Sheet Pan Sesame Chicken',
    rank:         'A',
    source_url:   'https://www.ambitiouskitchen.com/sheet-pan-sesame-chicken/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'chicken_thigh_boneless_skinless', grams: 680, qty: '1½ lbs'           },
      { id: 'asparagus_raw',                   grams: 500, qty: '1 large bunch'     },
      { id: 'red_bell_pepper',                 grams: 120, qty: '1 medium'          },
      { id: 'red_onion',                       grams: 160, qty: '1 medium'          },
      { id: 'cashews_raw',                     grams: 65,  qty: '½ cup'             },
      { id: 'soy_sauce_low_sodium',            grams: 60,  qty: '¼ cup'             },
      { id: 'honey',                           grams: 63,  qty: '3 tbsp'            },
      { id: 'rice_vinegar',                    grams: 30,  qty: '2 tbsp'            },
      { id: 'sesame_oil_toasted',              grams: 27,  qty: '2 tbsp'            },
      { id: 'olive_oil_extra_virgin',          grams: 14,  qty: '1 tbsp'            },
      { id: 'sambal_oelek',                    grams: 30,  qty: '2 tbsp'            },
      { id: 'ginger_fresh',                    grams: 8,   qty: '1 tbsp grated'     },
      { id: 'garlic',                          grams: 6,   qty: '2 cloves'          },
      { id: 'scallions',                       grams: 20,  qty: '2 whole'           },
      { id: 'sesame_seeds_toasted',            grams: 9,   qty: '1 tbsp'            },
      { id: 'cilantro',                        grams: 4,   qty: 'small handful'     },
      { id: 'fresh_basil',                     grams: 3,   qty: 'small handful'     },
      { id: 'fresh_mint',                      grams: 3,   qty: 'small handful'     },
    ],
    _totalMacros: { calories: 2314, proteinG: 155.3, fatG: 126.3, carbsG: 136.3, sodiumMg: 3268 },
  },

  // ----------------------------------------------------------------
  // R2 — Sesame Ginger Teriyaki Salmon
  // ----------------------------------------------------------------
  sesame_ginger_teriyaki_salmon: {
    id:           'sesame_ginger_teriyaki_salmon',
    name:         'Sesame Ginger Sweet Teriyaki Salmon with Garlic Quinoa',
    rank:         'B',
    source_url:   'https://www.ambitiouskitchen.com/sesame-ginger-sweet-teriyaki-salmon-with-garlic-quinoa-stir-fry/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'salmon_atlantic_farmed',  grams: 454, qty: '1 lb'            },
      { id: 'teriyaki_sauce',          grams: 250, qty: '1 cup'           },
      { id: 'quinoa_dry',              grams: 128, qty: '¾ cup'           },
      { id: 'sugar_snap_peas',         grams: 218, qty: '1½ cups'         },
      { id: 'red_bell_pepper',         grams: 120, qty: '1 medium'        },
      { id: 'yellow_bell_pepper',      grams: 120, qty: '1 medium'        },
      { id: 'olive_oil_extra_virgin',  grams: 68,  qty: '¼ cup + 1 tbsp' },
      { id: 'dark_brown_sugar',        grams: 38,  qty: '3 tbsp'          },
      { id: 'honey',                   grams: 42,  qty: '2 tbsp'          },
      { id: 'garlic',                  grams: 24,  qty: '8 cloves'        },
      { id: 'ginger_fresh',            grams: 6,   qty: '2 tsp grated'    },
      { id: 'garlic_salt',             grams: 3,   qty: '½ tsp'           },
      { id: 'sesame_seeds',            grams: 9,   qty: '1 tbsp'          },
      { id: 'cilantro',                grams: 10,  qty: '¼ cup'           },
      { id: 'red_pepper_flakes',       grams: 1,   qty: '¼ tsp'           },
    ],
    _totalMacros: { calories: 2030, proteinG: 125.2, fatG: 96.3, carbsG: 168.9, sodiumMg: 2269 },
  },

  // ----------------------------------------------------------------
  // R3 — 20-Minute Tofu Stir-Fry
  // ----------------------------------------------------------------
  tofu_stir_fry: {
    id:           'tofu_stir_fry',
    name:         '20-Minute Tofu Stir-Fry',
    rank:         'C',
    source_url:   'https://minimalistbaker.com/20-minute-tofu-stir-fry/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'brown_rice_cooked',    grams: 585, qty: '3 cups cooked'          },
      { id: 'firm_tofu_extra',      grams: 250, qty: '1 cup, crumbled or cubed'},
      { id: 'peanut_butter',        grams: 32,  qty: '2 tbsp'                 },
      { id: 'coconut_aminos',       grams: 60,  qty: '4 tbsp'                 },
      { id: 'sesame_oil',           grams: 18,  qty: '4 tsp'                  },
      { id: 'maple_syrup',          grams: 20,  qty: '1 tbsp'                 },
      { id: 'lime_juice',           grams: 15,  qty: '1 tbsp'                 },
      { id: 'chili_garlic_sauce',   grams: 15,  qty: '3 tsp'                  },
      { id: 'shiitake_mushrooms',   grams: 70,  qty: '1 cup chopped'          },
      { id: 'red_cabbage',          grams: 90,  qty: '1 cup shredded'         },
      { id: 'red_bell_pepper',      grams: 80,  qty: '1 cup sliced'           },
      { id: 'garlic',               grams: 6,   qty: '2 cloves'               },
      { id: 'green_onion',          grams: 25,  qty: '¼ cup sliced'           },
      { id: 'ginger_fresh',         grams: 8,   qty: '1 tbsp minced'          },
      { id: 'cilantro',             grams: 10,  qty: 'small handful'          },
    ],
    _totalMacros: { calories: 1488, proteinG: 58.7, fatG: 55.8, carbsG: 197.9, sodiumMg: 3793 },
  },

  // ----------------------------------------------------------------
  // R4 — Greek Sheet Pan Chicken
  // ----------------------------------------------------------------
  greek_sheet_pan_chicken: {
    id:           'greek_sheet_pan_chicken',
    name:         'Greek Sheet Pan Chicken',
    rank:         'B',
    source_url:   'https://www.themediterraneandish.com/greek-sheet-pan-chicken/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'chicken_thigh_boneless_skinless', grams: 880, qty: '6–8 thighs (~2 lbs)' },
      { id: 'olive_oil_extra_virgin',          grams: 162, qty: '¾ cup'               },
      { id: 'lemon_juice',                     grams: 60,  qty: '¼ cup'               },
      { id: 'feta_cheese',                     grams: 113, qty: '4 oz'                },
      { id: 'red_onion',                       grams: 200, qty: '1 large'             },
      { id: 'zucchini',                        grams: 200, qty: '1 medium'            },
      { id: 'orange_bell_pepper',              grams: 170, qty: '1 large'             },
      { id: 'tomato',                          grams: 150, qty: '1 large'             },
      { id: 'kalamata_olives_pitted',          grams: 60,  qty: '¼ cup'              },
      { id: 'castelvetrano_olives_pitted',     grams: 60,  qty: '¼ cup'              },
      { id: 'garlic',                          grams: 5,   qty: '1 large clove'       },
      { id: 'dried_oregano',                   grams: 2,   qty: '1–2 tsp'            },
      { id: 'fresh_parsley',                   grams: 15,  qty: '¼ cup chopped'       },
    ],
    _totalMacros: { calories: 3285, proteinG: 191.8, fatG: 245.2, carbsG: 60.6, sodiumMg: 3930 },
  },

  // ----------------------------------------------------------------
  // R6 — Chipotle DIY Chicken Burrito Bowls
  // ----------------------------------------------------------------
  chipotle_chicken_bowls: {
    id:           'chipotle_chicken_bowls',
    name:         'Chipotle DIY Chicken Burrito Bowls',
    rank:         'A',
    source_url:   'https://www.ambitiouskitchen.com/better-chipotle-diy-chicken-burrito-bowls/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'chicken_thigh_boneless_skinless', grams: 454, qty: '1 lb'          },
      { id: 'brown_rice_dry',                  grams: 185, qty: '1 cup dry'     },
      { id: 'black_beans_canned_drained',      grams: 240, qty: '1 can (15 oz)' },
      { id: 'salsa_chunky',                    grams: 240, qty: '1 cup'         },
      { id: 'frozen_corn',                     grams: 150, qty: '1 cup'         },
      { id: 'red_onion',                       grams: 100, qty: '1 small'       },
      { id: 'cheddar_cheese_shredded',         grams: 56,  qty: '½ cup'         },
      { id: 'coconut_oil',                     grams: 9,   qty: '2 tsp'         },
      { id: 'lime_juice',                      grams: 60,  qty: '2 small limes' },
      { id: 'cilantro',                        grams: 10,  qty: '¼ cup chopped' },
      { id: 'chipotle_chili_powder',           grams: 2,   qty: '½ tsp'         },
    ],
    _totalMacros: { calories: 2269, proteinG: 143.5, fatG: 74.5, carbsG: 264.6, sodiumMg: 2311 },
  },

  // ----------------------------------------------------------------
  // R7 — Fajita Chicken and Rice
  // ----------------------------------------------------------------
  fajita_chicken_rice: {
    id:           'fajita_chicken_rice',
    name:         'Fajita Chicken and Rice',
    rank:         'A',
    source_url:   'https://www.ambitiouskitchen.com/fajita-chicken-and-rice/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'chicken_thigh_boneless_skinless', grams: 680, qty: '1½ lbs'         },
      { id: 'jasmine_rice_dry',                grams: 185, qty: '1 cup dry'       },
      { id: 'black_beans_canned_drained',      grams: 240, qty: '1 can (15 oz)'   },
      { id: 'chicken_broth_low_sodium',        grams: 414, qty: '1¾ cups'         },
      { id: 'frozen_corn',                     grams: 110, qty: '¾ cup'           },
      { id: 'mexican_cheese_blend',            grams: 85,  qty: '¾ cup shredded'  },
      { id: 'red_bell_pepper',                 grams: 120, qty: '1 medium'        },
      { id: 'orange_bell_pepper',              grams: 120, qty: '1 medium'        },
      { id: 'green_bell_pepper',               grams: 120, qty: '1 medium'        },
      { id: 'yellow_onion',                    grams: 200, qty: '1 large'         },
      { id: 'olive_oil_extra_virgin',          grams: 40,  qty: '3 tbsp'          },
      { id: 'garlic',                          grams: 9,   qty: '3 cloves'        },
      { id: 'fresh_turmeric',                  grams: 16,  qty: '1–2 tbsp grated' },
      { id: 'cilantro',                        grams: 13,  qty: '⅓ cup chopped'   },
      { id: 'scallions',                       grams: 20,  qty: '2 whole'         },
      { id: 'ground_cumin',                    grams: 4,   qty: '1½ tsp'          },
      { id: 'ground_coriander',                grams: 4,   qty: '1½ tsp'          },
      { id: 'chili_powder',                    grams: 4,   qty: '1½ tsp'          },
      { id: 'paprika',                         grams: 3,   qty: '1 tsp'           },
      { id: 'dried_oregano',                   grams: 3,   qty: '1 tsp'           },
      { id: 'garlic_powder',                   grams: 2,   qty: '½ tsp'           },
      { id: 'cayenne_pepper',                  grams: 1,   qty: '¼ tsp'           },
      { id: 'lime',                            grams: 25,  qty: '1 lime'          },
    ],
    _totalMacros: { calories: 3067, proteinG: 192.6, fatG: 125.9, carbsG: 282.5, sodiumMg: 3551 },
  },

  // ----------------------------------------------------------------
  // R8 — Honey Garlic Salmon Bowls  (batch 3610 kcal → 5 servings, capped)
  // ----------------------------------------------------------------
  honey_garlic_salmon_bowls: {
    id:           'honey_garlic_salmon_bowls',
    name:         'Honey Garlic Salmon Bowls',
    rank:         'B',
    source_url:   'https://www.halfbakedharvest.com/honey-garlic-salmon-bowls/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'salmon_atlantic_farmed',  grams: 680, qty: '4 × 6 oz fillets'  },
      { id: 'brown_rice_dry',          grams: 185, qty: '1 cup dry'          },
      { id: 'broccoli_florets',        grams: 270, qty: '3 cups'             },
      { id: 'mayo',                    grams: 115, qty: '½ cup'              },
      { id: 'olive_oil_extra_virgin',  grams: 54,  qty: '4 tbsp'             },
      { id: 'tamari',                  grams: 80,  qty: '⅓ cup'              },
      { id: 'honey',                   grams: 77,  qty: '3 tbsp + 2 tsp'     },
      { id: 'chili_paste',             grams: 60,  qty: '4 tbsp'             },
      { id: 'gochujang',               grams: 30,  qty: '2 tbsp'             },
      { id: 'garlic',                  grams: 18,  qty: '6 cloves'           },
      { id: 'sesame_oil_toasted',      grams: 14,  qty: '1 tbsp'             },
      { id: 'green_onions',            grams: 15,  qty: '2 tbsp chopped'     },
      { id: 'ground_ginger',           grams: 3,   qty: '1½ tsp'             },
      { id: 'chipotle_powder',         grams: 3,   qty: '1 tsp'              },
      { id: 'sesame_seeds_toasted',    grams: 9,   qty: '1 tbsp'             },
    ],
    _totalMacros: { calories: 3610, proteinG: 163.3, fatG: 236.2, carbsG: 201.1, sodiumMg: 3016 },
  },

  // ----------------------------------------------------------------
  // R9 — Thai Chicken Larb (Laab Gai)
  // ----------------------------------------------------------------
  thai_larb_chicken: {
    id:           'thai_larb_chicken',
    name:         'Thai Chicken Larb (Laab Gai)',
    rank:         'A',
    source_url:   'https://www.recipetineats.com/thai-chicken-lettuce-cups-larb-gai-laab-gai/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'ground_chicken',   grams: 500, qty: '1 lb'                       },
      { id: 'peanut_oil',       grams: 27,  qty: '2 tbsp'                     },
      { id: 'lime_juice',       grams: 37,  qty: '2½ tbsp'                    },
      { id: 'fish_sauce',       grams: 30,  qty: '2 tbsp'                     },
      { id: 'red_onion',        grams: 100, qty: '½ whole'                    },
      { id: 'ginger_fresh',     grams: 8,   qty: '1 tbsp grated'              },
      { id: 'garlic',           grams: 8,   qty: '2 large cloves'             },
      { id: 'lemongrass',       grams: 20,  qty: '1 stalk'                    },
      { id: 'thai_chillies',    grams: 10,  qty: '2 whole, deseeded'          },
      { id: 'brown_sugar',      grams: 8,   qty: '2 tsp'                      },
      { id: 'cilantro',         grams: 10,  qty: '⅓ cup'                      },
      { id: 'mint_leaves',      grams: 10,  qty: '⅓ cup'                      },
      { id: 'cornstarch',       grams: 5,   qty: '2 tsp'                      },
      { id: 'lettuce_leaves',   grams: 96,  qty: '6–8 small leaves'           },
      { id: 'peanuts_raw',      grams: 45,  qty: '3 tbsp, crushed'            },
    ],
    _totalMacros: { calories: 1068, proteinG: 84.6, fatG: 62.8, carbsG: 40.0, sodiumMg: 2880 },
  },

  // ----------------------------------------------------------------
  // R10 — Green Chicken Curry
  // ----------------------------------------------------------------
  green_chicken_curry: {
    id:           'green_chicken_curry',
    name:         'Green Chicken Curry',
    rank:         'A',
    source_url:   'https://www.ambitiouskitchen.com/green-chicken-curry/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'chicken_breast_boneless_skinless', grams: 454, qty: '1 lb'           },
      { id: 'brown_rice_dry',                   grams: 185, qty: '1 cup dry'       },
      { id: 'coconut_milk_full_fat',            grams: 425, qty: '1 can (15 oz)'   },
      { id: 'sweet_potato',                     grams: 200, qty: '1 small–medium'  },
      { id: 'red_bell_pepper',                  grams: 170, qty: '1 large'         },
      { id: 'coconut_oil',                      grams: 28,  qty: '2 tbsp'          },
      { id: 'chicken_broth_low_sodium',         grams: 120, qty: '½ cup'           },
      { id: 'frozen_peas',                      grams: 110, qty: '¾ cup'           },
      { id: 'lemongrass',                       grams: 40,  qty: '2 stalks'        },
      { id: 'scallions',                        grams: 40,  qty: '4 whole'         },
      { id: 'green_curry_paste',                grams: 30,  qty: '2 tbsp'          },
      { id: 'lime_juice',                       grams: 30,  qty: '1 lime'          },
      { id: 'soy_sauce_low_sodium',             grams: 15,  qty: '1 tbsp'          },
      { id: 'fish_sauce',                       grams: 15,  qty: '1 tbsp'          },
      { id: 'garlic',                           grams: 9,   qty: '3 cloves'        },
      { id: 'ginger_fresh',                     grams: 8,   qty: '1 tbsp grated'   },
      { id: 'fresh_turmeric',                   grams: 8,   qty: '1 tbsp grated'   },
      { id: 'cilantro',                         grams: 5,   qty: 'small handful'   },
      { id: 'fresh_basil',                      grams: 5,   qty: 'small handful'   },
      { id: 'fresh_mint',                       grams: 3,   qty: 'small handful'   },
      { id: 'thai_basil',                       grams: 2,   qty: 'small handful'   },
    ],
    _totalMacros: { calories: 2663, proteinG: 140.2, fatG: 134.7, carbsG: 240.8, sodiumMg: 4549 },
  },

  // ----------------------------------------------------------------
  // R11 — Slow Cooker Chicken Tikka Masala
  // ----------------------------------------------------------------
  chicken_tikka_masala: {
    id:           'chicken_tikka_masala',
    name:         'Slow Cooker Chicken Tikka Masala',
    rank:         'A',
    source_url:   'https://www.ambitiouskitchen.com/healthy-slow-cooker-chicken-tikka-masala/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'chicken_breast_boneless_skinless', grams: 680, qty: '1½ lbs'       },
      { id: 'brown_rice_dry',                   grams: 185, qty: '1 cup dry'     },
      { id: 'crushed_tomatoes_canned',          grams: 794, qty: '1 can (28 oz)' },
      { id: 'light_coconut_milk',               grams: 240, qty: '1 cup'         },
      { id: 'yellow_onion',                     grams: 200, qty: '1 large'       },
      { id: 'jalapeno',                         grams: 45,  qty: '1 whole'       },
      { id: 'lemon_juice',                      grams: 30,  qty: '2 tbsp'        },
      { id: 'garlic',                           grams: 9,   qty: '3 cloves'      },
      { id: 'ginger_fresh',                     grams: 8,   qty: '1 tbsp grated' },
      { id: 'olive_oil_extra_virgin',           grams: 7,   qty: '½ tbsp'        },
      { id: 'garam_masala',                     grams: 8,   qty: '1 tbsp'        },
      { id: 'paprika',                          grams: 3,   qty: '1 tsp'         },
      { id: 'ground_turmeric',                  grams: 1.5, qty: '½ tsp'         },
      { id: 'curry_powder',                     grams: 2,   qty: '½ tsp'         },
      { id: 'cayenne_pepper',                   grams: 1.5, qty: '½ tsp'         },
      { id: 'frozen_peas',                      grams: 145, qty: '1 cup'         },
      { id: 'cilantro',                         grams: 10,  qty: 'small handful' },
    ],
    _totalMacros: { calories: 2109, proteinG: 187.2, fatG: 48.4, carbsG: 238.5, sodiumMg: 1998 },
  },

  // ----------------------------------------------------------------
  // R12 — Tandoori Salmon
  // ----------------------------------------------------------------
  tandoori_salmon: {
    id:           'tandoori_salmon',
    name:         'Tandoori Salmon',
    rank:         'B',
    source_url:   'https://www.indianhealthyrecipes.com/tandoori-salmon/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'salmon_atlantic_farmed',    grams: 550, qty: '1.2 lbs'   },
      { id: 'brown_rice_dry',            grams: 185, qty: '1 cup dry'  },
      { id: 'olive_oil',                 grams: 14,  qty: '1 tbsp'     },
      { id: 'lemon_juice',               grams: 15,  qty: '1 tbsp'     },
      { id: 'kashmiri_chilli_powder',    grams: 8,   qty: '1 tbsp'     },
      { id: 'kasuri_methi',              grams: 5,   qty: '1 tbsp'     },
      { id: 'garam_masala',              grams: 3,   qty: '1 tsp'      },
      { id: 'coriander_powder',          grams: 3,   qty: '1 tsp'      },
      { id: 'cumin_powder',              grams: 2,   qty: '½–1 tsp'    },
      { id: 'garlic_powder',             grams: 2,   qty: '½ tsp'      },
      { id: 'ground_ginger',             grams: 1,   qty: '¼ tsp'      },
      { id: 'ground_turmeric',           grams: 0.5, qty: '⅛ tsp'      },
      { id: 'chaat_masala',              grams: 2,   qty: '¾ tsp'      },
      { id: 'fennel_powder',             grams: 1.5, qty: '½ tsp'      },
    ],
    _totalMacros: { calories: 1977, proteinG: 127.7, fatG: 93.3, carbsG: 153.0, sodiumMg: 1008 },
  },

  // ----------------------------------------------------------------
  // R13 — Dal Tadka
  // ----------------------------------------------------------------
  dal_tadka: {
    id:           'dal_tadka',
    name:         'Dal Tadka',
    rank:         'B',
    source_url:   'https://www.ambitiouskitchen.com/dal-recipe/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'quinoa_dry',                grams: 170, qty: '1 cup dry'       },
      { id: 'crushed_tomatoes_canned',   grams: 425, qty: '1 can (15 oz)'   },
      { id: 'reduced_fat_coconut_milk',  grams: 385, qty: '1 can (13.5 oz)' },
      { id: 'vegetable_broth',           grams: 480, qty: '2 cups'          },
      { id: 'red_lentils_dry',           grams: 192, qty: '1 cup'           },
      { id: 'yellow_onion',              grams: 200, qty: '1 large'         },
      { id: 'olive_oil_extra_virgin',    grams: 40,  qty: '3 tbsp'          },
      { id: 'baby_spinach',              grams: 60,  qty: '2 cups'          },
      { id: 'ginger_fresh',              grams: 20,  qty: '2-inch knob'     },
      { id: 'garlic',                    grams: 15,  qty: '5 cloves'        },
      { id: 'lemon_juice',               grams: 15,  qty: '1 tbsp'          },
      { id: 'tomato_paste',              grams: 5,   qty: '1 tsp'           },
      { id: 'ground_cumin',              grams: 4,   qty: '1½ tsp'          },
      { id: 'ground_coriander',          grams: 2.5, qty: '1 tsp'           },
      { id: 'ground_turmeric',           grams: 1.5, qty: '½ tsp'           },
      { id: 'cayenne_pepper',            grams: 1,   qty: '½ tsp'           },
    ],
    _totalMacros: { calories: 2368, proteinG: 93.3, fatG: 83.6, carbsG: 316.4, sodiumMg: 2911 },
  },

  // ----------------------------------------------------------------
  // R14 — Turkey Bolognese
  // ----------------------------------------------------------------
  turkey_bolognese: {
    id:           'turkey_bolognese',
    name:         'Turkey Bolognese',
    rank:         'A',
    source_url:   'https://www.skinnytaste.com/turkey-bolognese/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'ground_turkey_93_lean',     grams: 454, qty: '1 lb'         },
      { id: 'mezze_rigatoni_dry',        grams: 283, qty: '10 oz'        },
      { id: 'chicken_bone_broth',        grams: 590, qty: '2½ cups'      },
      { id: 'crushed_tomatoes_canned',   grams: 360, qty: '1½ cups'      },
      { id: 'yellow_onion',              grams: 100, qty: '½ whole'      },
      { id: 'carrot_raw',                grams: 90,  qty: '1 medium'     },
      { id: 'celery_raw',                grams: 60,  qty: '1 rib'        },
      { id: 'parmesan_cheese_grated',    grams: 25,  qty: '¼ cup'        },
      { id: 'tomato_paste',              grams: 30,  qty: '2 tbsp'       },
      { id: 'olive_oil_extra_virgin',    grams: 7,   qty: '½ tbsp'       },
      { id: 'garlic',                    grams: 3,   qty: '1 clove'      },
      { id: 'calabrian_chili_paste',     grams: 5,   qty: '1 tsp'        },
      { id: 'fresh_basil',               grams: 5,   qty: 'small handful'},
      { id: 'ricotta_cheese',            grams: 120, qty: '½ cup'        },
    ],
    _totalMacros: { calories: 2254, proteinG: 160.1, fatG: 57.7, carbsG: 266.1, sodiumMg: 4331 },
  },

  // ----------------------------------------------------------------
  // R15 — Lemon Garlic Salmon Tray Bake
  // ----------------------------------------------------------------
  lemon_garlic_salmon_tray_bake: {
    id:           'lemon_garlic_salmon_tray_bake',
    name:         'Lemon Garlic Salmon Tray Bake',
    rank:         'B',
    source_url:   'https://www.recipetineats.com/lemon-garlic-salmon-tray-bake-easy-healthy/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'salmon_atlantic_farmed', grams: 720,  qty: '4 × 6 oz fillets'    },
      { id: 'asparagus_raw',          grams: 1080, qty: '3 bunches'            },
      { id: 'grape_tomatoes',         grams: 200,  qty: '7 oz'                 },
      { id: 'olive_oil_extra_virgin', grams: 36,   qty: '2 tbsp + 2 tsp'       },
      { id: 'lemon_juice',            grams: 15,   qty: '1 tbsp'               },
      { id: 'garlic',                 grams: 10,   qty: '2 cloves'             },
      { id: 'dijon_mustard',          grams: 5,    qty: '1 tsp'                },
      { id: 'parmesan_grated',        grams: 12,   qty: 'small handful grated' },
      { id: 'lemon_zest',             grams: 2,    qty: '1 tsp'                },
      { id: 'fresh_parsley',          grams: 10,   qty: 'small handful'        },
    ],
    _totalMacros: { calories: 2209, proteinG: 167.8, fatG: 135.3, carbsG: 72.2, sodiumMg: 1817 },
  },

  // ----------------------------------------------------------------
  // R16 — Tomato Chickpea Pasta with Goat Cheese
  // ----------------------------------------------------------------
  tomato_chickpea_pasta: {
    id:           'tomato_chickpea_pasta',
    name:         'Tomato Chickpea Pasta with Goat Cheese',
    rank:         'C',
    source_url:   'https://cookieandkate.com/tomato-chickpea-pasta-recipe/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'pasta_short_cut_dry',    grams: 224,  qty: '8 oz'                     },
      { id: 'goat_cheese',            grams: 142,  qty: '5 oz'                     },
      { id: 'chickpeas_cooked',       grams: 250,  qty: '1 can (15 oz), drained'   },
      { id: 'cherry_tomatoes',        grams: 680,  qty: '4 cups (2 pints)'         },
      { id: 'olive_oil_extra_virgin', grams: 73,   qty: '⅓ cup'                    },
      { id: 'garlic',                 grams: 20,   qty: '4 cloves'                 },
      { id: 'kalamata_olives',        grams: 65,   qty: '½ cup, chopped'           },
      { id: 'fresh_basil',            grams: 10,   qty: '⅓ cup sliced'             },
      { id: 'red_pepper_flakes',      grams: 0.5,  qty: 'pinch'                    },
    ],
    _totalMacros: { calories: 2617, proteinG: 88.9, fatG: 125.0, carbsG: 283.5, sodiumMg: 2006 },
  },

  // ----------------------------------------------------------------
  // R17 — Spanish Salmon a la Gallega
  // ----------------------------------------------------------------
  spanish_salmon_gallega: {
    id:           'spanish_salmon_gallega',
    name:         'Spanish Salmon a la Gallega',
    rank:         'B',
    source_url:   'https://spainonafork.com/spanish-salmon-a-la-gallega-recipe/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'salmon_atlantic_farmed', grams: 400,  qty: '14 oz'              },
      { id: 'potato_raw',             grams: 300,  qty: '2 medium'           },
      { id: 'olive_oil_extra_virgin', grams: 27,   qty: '2 tbsp'             },
      { id: 'garlic',                 grams: 20,   qty: '4 cloves'           },
      { id: 'white_wine',             grams: 80,   qty: '⅓ cup'              },
      { id: 'smoked_paprika',         grams: 2.5,  qty: '1 tsp'              },
      { id: 'fresh_parsley',          grams: 10,   qty: '1 handful chopped'  },
    ],
    _totalMacros: { calories: 1377, proteinG: 88.7, fatG: 78.1, carbsG: 61.2, sodiumMg: 523 },
  },

  // ----------------------------------------------------------------
  // R20 — Classic Lentil Burgers  (double-patty per serving; 5 buns)
  // ----------------------------------------------------------------
  lentil_burgers: {
    id:           'lentil_burgers',
    name:         'Classic Lentil Burgers',
    rank:         'B',
    source_url:   'https://www.makingthymeforhealth.com/classic-lentil-burgers/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'dkb_21wg_hamburger_buns', grams: 320,  qty: '5 buns',       note: '@ 64g each — DKB 21 Whole Grain' },
      { id: 'green_lentils_cooked',    grams: 600,  qty: '2½ cups'      },
      { id: 'walnuts_raw',             grams: 60,   qty: '½ cup'        },
      { id: 'sunflower_seeds_raw',     grams: 70,   qty: '½ cup'        },
      { id: 'breadcrumbs_dry_plain',   grams: 100,  qty: '1 cup'        },
      { id: 'olive_oil_extra_virgin',  grams: 40,   qty: '3 tbsp'       },
      { id: 'chickpea_flour',          grams: 65,   qty: '½ cup'        },
      { id: 'eggs_whole_raw',          grams: 100,  qty: '2 large'      },
      { id: 'onion_yellow',            grams: 160,  qty: '1 cup diced'  },
      { id: 'carrots_raw',             grams: 130,  qty: '1 cup diced'  },
      { id: 'tomato_paste_no_salt',    grams: 30,   qty: '2 tbsp'       },
      { id: 'worcestershire_sauce',    grams: 30,   qty: '2 tbsp'       },
      { id: 'garlic',                  grams: 15,   qty: '3 cloves'     },
      { id: 'dried_thyme',             grams: 1,    qty: '1 tbsp'       },
      { id: 'dried_oregano',           grams: 1,    qty: '1 tbsp'       },
    ],
    _totalMacros: { calories: 3844, proteinG: 161.4, fatG: 150.3, carbsG: 467.6, sodiumMg: 4940 },
  },

  // ----------------------------------------------------------------
  // R21 — Chicken Lentil Soup
  // ----------------------------------------------------------------
  chicken_lentil_soup: {
    id:           'chicken_lentil_soup',
    name:         'Chicken Lentil Soup',
    rank:         'A',
    source_url:   'https://thealmondeater.com/chicken-lentil-soup/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'chicken_breast_boneless',  grams: 681,  qty: '1.5 lbs'                        },
      { id: 'green_lentils_dry',        grams: 300,  qty: '1½ cups'                        },
      { id: 'tomatoes_diced_canned',    grams: 397,  qty: '1 can (14 oz) fire-roasted'     },
      { id: 'spinach_raw',              grams: 142,  qty: '5 oz'                           },
      { id: 'carrots_raw',              grams: 183,  qty: '3 medium'                       },
      { id: 'onion_yellow',             grams: 110,  qty: '1 whole'                        },
      { id: 'celery_raw',               grams: 80,   qty: '2 ribs'                         },
      { id: 'garlic',                   grams: 20,   qty: '4 cloves'                       },
      { id: 'olive_oil_extra_virgin',   grams: 14,   qty: '1 tbsp'                         },
      { id: 'chicken_broth_low_sodium', grams: 1440, qty: '6 cups'                         },
      { id: 'smoked_paprika',           grams: 3,    qty: '1 tsp'                          },
      { id: 'ground_cumin',             grams: 1.5,  qty: '½ tsp'                          },
    ],
    _totalMacros: { calories: 2436, proteinG: 292.7, fatG: 32.7, carbsG: 250.8, sodiumMg: 7063 },
  },

  // ----------------------------------------------------------------
  // R22 — Dak Galbi (Spicy Korean Stir-fried Chicken)
  // ----------------------------------------------------------------
  dak_galbi: {
    id:           'dak_galbi',
    name:         'Dak Galbi (Spicy Korean Stir-fried Chicken)',
    rank:         'B',
    source_url:   'https://www.koreanbapsang.com/dak-galbi/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'chicken_thigh_boneless', grams: 454, qty: '1 lb'                         },
      { id: 'rice_cakes_tteok',       grams: 227, qty: '8 oz',  note: 'Han Asia label: 237 kcal/100g, 5g P, 1g F, 52g C, 20mg Na' },
      { id: 'sweet_potato_raw',       grams: 170, qty: '1 small (~6 oz)'              },
      { id: 'green_cabbage_raw',      grams: 227, qty: '8 oz'                         },
      { id: 'sesame_oil',             grams: 13,  qty: '1 tbsp'                       },
      { id: 'gochujang',              grams: 30,  qty: '2 tbsp'                       },
      { id: 'soy_sauce',              grams: 30,  qty: '2 tbsp'                       },
      { id: 'gochugaru',              grams: 14,  qty: '2 tbsp'                       },
      { id: 'rice_wine_sake',         grams: 30,  qty: '2 tbsp'                       },
      { id: 'sugar',                  grams: 12,  qty: '1 tbsp'                       },
      { id: 'garlic',                 grams: 15,  qty: '1 tbsp minced'                },
      { id: 'corn_syrup_light',       grams: 7,   qty: '½ tbsp'                       },
      { id: 'scallions',              grams: 30,  qty: '2 whole'                      },
      { id: 'ginger_fresh',           grams: 5,   qty: '1 tsp grated'                 },
      { id: 'perilla_leaves',         grams: 12,  qty: '6–8 leaves (kkaennip)'        },
      { id: 'korean_curry_powder',    grams: 3,   qty: '1 tsp'                        },
      { id: 'mozzarella_shredded',    grams: 57,  qty: '½ cup, optional'              },
      { id: 'sesame_seeds',           grams: 3,   qty: '1 tsp'                        },
    ],
    _totalMacros: { calories: 1804, proteinG: 109.6, fatG: 55.3, carbsG: 212.3, sodiumMg: 2817 },
  },

  // ----------------------------------------------------------------
  // R23 — Thai Chilli Basil Chicken  (+ 0.5 cup dry brown rice serving base)
  // ----------------------------------------------------------------
  thai_basil_chicken: {
    id:           'thai_basil_chicken',
    name:         'Thai Chilli Basil Chicken',
    rank:         'A',
    source_url:   'https://www.recipetineats.com/thai-basil-chicken-stir-fry/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'chicken_thigh_boneless', grams: 225, qty: '7 oz'                },
      { id: 'brown_rice_dry',         grams: 93,  qty: '½ cup dry'           },
      { id: 'peanut_oil',             grams: 21,  qty: '1½ tbsp'             },
      { id: 'oyster_sauce',           grams: 10,  qty: '2 tsp'               },
      { id: 'soy_sauce_light',        grams: 5,   qty: '1 tsp'               },
      { id: 'soy_sauce_dark',         grams: 5,   qty: '1 tsp'               },
      { id: 'thai_basil_fresh',       grams: 25,  qty: '1 cup loosely packed'},
      { id: 'garlic',                 grams: 12,  qty: '2 large cloves'      },
      { id: 'sugar',                  grams: 4,   qty: '1 tsp'               },
      { id: 'green_onion',            grams: 15,  qty: '1 whole'             },
      { id: 'bird_eye_chilli_fresh',  grams: 10,  qty: '1 chilli'            },
    ],
    _totalMacros: { calories: 920, proteinG: 51.8, fatG: 40.8, carbsG: 83.7, sodiumMg: 978 },
  },

  // ----------------------------------------------------------------
  // R24 — Korean Inspired Ground Turkey Bowls  (+ 1 cup dry brown rice serving base)
  // ----------------------------------------------------------------
  korean_turkey_bowls: {
    id:           'korean_turkey_bowls',
    name:         'Korean Inspired Ground Turkey Bowls',
    rank:         'A',
    source_url:   'https://beginwithbalance.com/korean-inspired-ground-turkey-bowls/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'ground_turkey_lean',   grams: 454, qty: '1 lb'              },
      { id: 'brown_rice_dry',       grams: 185, qty: '1 cup dry'         },
      { id: 'honey',                grams: 63,  qty: '3 tbsp'            },
      { id: 'soy_sauce_low_sodium', grams: 60,  qty: '¼ cup'             },
      { id: 'carrots_raw',          grams: 110, qty: '1 cup shredded'    },
      { id: 'red_onion',            grams: 100, qty: '1 cup sliced'      },
      { id: 'green_onions',         grams: 80,  qty: '1 bunch'           },
      { id: 'cucumber_raw',         grams: 120, qty: '1 cup sliced'      },
      { id: 'sesame_oil',           grams: 9,   qty: '2 tsp'             },
      { id: 'garlic',               grams: 10,  qty: '2 tsp minced'      },
      { id: 'ginger_fresh',         grams: 10,  qty: '2 tsp minced'      },
      { id: 'rice_wine_vinegar',    grams: 95,  qty: '⅓ cup + 1 tbsp'   },
      { id: 'sriracha',             grams: 10,  qty: '1–2 tsp'           },
      { id: 'sugar',                grams: 12,  qty: '1 tbsp'            },
      { id: 'cilantro',             grams: 10,  qty: 'small handful'     },
      { id: 'sesame_seeds',         grams: 5,   qty: '1 tsp'             },
      { id: 'red_pepper_flakes',    grams: 1,   qty: 'pinch'             },
    ],
    _totalMacros: { calories: 1826, proteinG: 108.9, fatG: 54.0, carbsG: 233.1, sodiumMg: 3567 },
  },

  // ----------------------------------------------------------------
  // R25 — Korean Braised Tofu (Dubu Jorim)  [standalone — no rice base]
  // ----------------------------------------------------------------
  korean_braised_tofu: {
    id:           'korean_braised_tofu',
    name:         'Korean Braised Tofu (Dubu Jorim)',
    rank:         'A',
    source_url:   'https://cjeatsrecipes.com/korean-braised-tofu/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'firm_tofu',       grams: 397, qty: '1 package (14 oz)' },
      { id: 'peanut_oil',      grams: 27,  qty: '2 tbsp'            },
      { id: 'sesame_oil',      grams: 13,  qty: '1 tbsp'            },
      { id: 'soy_sauce_light', grams: 60,  qty: '¼ cup'             },
      { id: 'sesame_seeds',    grams: 5,   qty: '½ tbsp'            },
      { id: 'gochugaru',       grams: 7,   qty: '1 tbsp'            },
      { id: 'sugar',           grams: 6,   qty: '½ tbsp'            },
      { id: 'garlic',          grams: 10,  qty: '2 cloves'          },
      { id: 'scallion',        grams: 15,  qty: '1 whole'           },
    ],
    _totalMacros: { calories: 1057, proteinG: 78.0, fatG: 76.6, carbsG: 30.8, sodiumMg: 3420 },
  },

  // ----------------------------------------------------------------
  // R26 — Slow Cooker Salsa Verde Chicken Chickpea Chili
  // ----------------------------------------------------------------
  salsa_verde_chicken_chili: {
    id:           'salsa_verde_chicken_chili',
    name:         'Slow Cooker Salsa Verde Chicken Chickpea Chili',
    rank:         'B',
    source_url:   'https://www.ambitiouskitchen.com/slow-cooker-salsa-verde-chicken-chickpea-chili/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'chicken_thigh_boneless',   grams: 908, qty: '2 lbs'                   },
      { id: 'salsa_verde',              grams: 680, qty: '24 oz (2 jars)'          },
      { id: 'chickpeas_cooked',         grams: 250, qty: '1 can (15 oz), drained'  },
      { id: 'quinoa_dry',               grams: 85,  qty: '½ cup'                   },
      { id: 'frozen_corn',              grams: 154, qty: '1 cup'                   },
      { id: 'onion_yellow',             grams: 110, qty: '1 whole'                 },
      { id: 'garlic',                   grams: 10,  qty: '2 cloves'                },
      { id: 'jalapeno_fresh',           grams: 25,  qty: '½ jalapeño'              },
      { id: 'lime_juice',               grams: 25,  qty: '1 small lime'            },
      { id: 'chicken_broth_low_sodium', grams: 590, qty: '2½ cups'                 },
      { id: 'ground_cumin',             grams: 4,   qty: '2 tsp'                   },
      { id: 'dried_oregano',            grams: 2,   qty: '2 tsp'                   },
    ],
    _totalMacros: { calories: 2653, proteinG: 240.4, fatG: 91.9, carbsG: 214.9, sodiumMg: 8701 },
  },

  // ----------------------------------------------------------------
  // R27 — 30-Minute Spiced Mediterranean Chicken Bowls
  // ----------------------------------------------------------------
  mediterranean_chicken_bowls: {
    id:           'mediterranean_chicken_bowls',
    name:         '30-Minute Spiced Mediterranean Chicken Bowls',
    rank:         'B',
    source_url:   'https://www.ambitiouskitchen.com/spiced-mediterranean-chicken-bowls/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'ground_chicken',          grams: 454,  qty: '1 lb'                  },
      { id: 'brown_rice_dry',          grams: 185,  qty: '1 cup dry'             },
      { id: 'whole_wheat_pita',        grams: 256,  qty: '4 pitas'               },
      { id: 'feta_cheese',             grams: 114,  qty: '4 oz, crumbled'        },
      { id: 'olive_oil_extra_virgin',  grams: 34,   qty: '2 tbsp'                },
      { id: 'chickpeas_cooked',        grams: 164,  qty: '1 cup, drained'        },
      { id: 'cucumber_persian',        grams: 360,  qty: '4 Persian cucumbers'   },
      { id: 'red_bell_pepper_roasted', grams: 85,   qty: '3 oz jarred'           },
      { id: 'onion_yellow',            grams: 55,   qty: '½ medium'              },
      { id: 'garlic',                  grams: 8,    qty: '2 cloves'              },
      { id: 'lemon_juice',             grams: 8,    qty: '½ tbsp'                },
      { id: 'garlic_powder',           grams: 2.5,  qty: '1 tsp'                 },
      { id: 'ground_cumin',            grams: 2.5,  qty: '1 tsp'                 },
      { id: 'dried_oregano',           grams: 1,    qty: '1 tsp'                 },
      { id: 'paprika',                 grams: 2.5,  qty: '1 tsp'                 },
      { id: 'ground_turmeric',         grams: 2.5,  qty: '1 tsp'                 },
      { id: 'dried_thyme',             grams: 0.5,  qty: '½ tsp'                 },
      { id: 'fresh_mint',              grams: 5,    qty: 'small handful'         },
      { id: 'fresh_parsley',           grams: 5,    qty: 'small handful'         },
    ],
    _totalMacros: { calories: 2987, proteinG: 152.2, fatG: 108.7, carbsG: 358.6, sodiumMg: 4469 },
  },

  // ----------------------------------------------------------------
  // R28 — Southwest Chicken Skillet
  // ----------------------------------------------------------------
  southwest_chicken_skillet: {
    id:           'southwest_chicken_skillet',
    name:         'Southwest Chicken Skillet',
    rank:         'A',
    source_url:   'https://www.budgetbytes.com/southwest-chicken-skillet/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'white_rice_dry',           grams: 185, qty: '1 cup dry'             },
      { id: 'chicken_breast_cooked',    grams: 280, qty: '1½–2 cups shredded'   },
      { id: 'black_beans_canned',       grams: 240, qty: '1 can (15 oz), drained'},
      { id: 'cheddar_cheese_shredded',  grams: 113, qty: '1 cup shredded'        },
      { id: 'salsa_tomato',             grams: 240, qty: '1 cup'                 },
      { id: 'green_onions',             grams: 45,  qty: '2–3 whole'             },
      { id: 'chili_powder',             grams: 8,   qty: '1 tbsp'                },
      { id: 'chicken_broth_low_sodium', grams: 414, qty: '1¾ cups'              },
    ],
    _totalMacros: { calories: 2087, proteinG: 167.4, fatG: 52.2, carbsG: 229.4, sodiumMg: 3528 },
  },

  // ----------------------------------------------------------------
  // R29 — Marry Me Chicken Pasta
  // ----------------------------------------------------------------
  marry_me_chicken_pasta: {
    id:           'marry_me_chicken_pasta',
    name:         'Marry Me Chicken Pasta',
    rank:         'A',
    source_url:   'https://www.budgetbytes.com/marry-me-chicken-pasta/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'pasta_penne_dry',          grams: 227, qty: '8 oz'                   },
      { id: 'chicken_breast_raw',       grams: 453, qty: '1 lb, cubed'            },
      { id: 'heavy_cream',              grams: 113, qty: '½ cup'                  },
      { id: 'olive_oil_extra_virgin',   grams: 27,  qty: '2 tbsp'                 },
      { id: 'sundried_tomatoes',        grams: 90,  qty: '½ cup, packed in oil'   },
      { id: 'parmesan_grated',          grams: 40,  qty: '½ cup grated'           },
      { id: 'onion_yellow',             grams: 155, qty: '½ small'                },
      { id: 'tomato_paste_no_salt',     grams: 30,  qty: '2 tbsp'                 },
      { id: 'garlic',                   grams: 20,  qty: '4 cloves'               },
      { id: 'spinach_frozen',           grams: 80,  qty: '⅓ cup frozen'           },
      { id: 'chicken_broth_low_sodium', grams: 590, qty: '2½ cups'               },
      { id: 'italian_seasoning',        grams: 3.5, qty: '1½ tsp'                 },
      { id: 'fresh_basil',              grams: 5,   qty: 'small handful, optional'},
    ],
    _totalMacros: { calories: 2601, proteinG: 186.9, fatG: 92.3, carbsG: 260.5, sodiumMg: 5003 },
  },

  // ----------------------------------------------------------------
  // R30 — Cheesy Chicken Vegetable Rice Casserole
  // ----------------------------------------------------------------
  cheesy_chicken_rice_casserole: {
    id:           'cheesy_chicken_rice_casserole',
    name:         'Cheesy Chicken Vegetable Rice Casserole',
    rank:         'B',
    source_url:   'https://www.budgetbytes.com/cheesy-chicken-vegetable-rice-casserole/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'white_rice_long_grain_dry',  grams: 315,  qty: '1½ cups'           },
      { id: 'chicken_breast_raw',         grams: 311,  qty: '11 oz, cubed'      },
      { id: 'cheddar_cheese',             grams: 226,  qty: '8 oz, shredded'    },
      { id: 'frozen_broccoli',            grams: 226,  qty: '½ lb (2 cups)'     },
      { id: 'whole_milk',                 grams: 244,  qty: '1 cup'             },
      { id: 'yellow_onion',               grams: 270,  qty: '1 whole (2 cups)'  },
      { id: 'carrots_raw',                grams: 230,  qty: '3 medium (2 cups)' },
      { id: 'butter_unsalted',            grams: 42,   qty: '3 tbsp'            },
      { id: 'all_purpose_flour',          grams: 30,   qty: '3 tbsp'            },
      { id: 'olive_oil_extra_virgin',     grams: 14,   qty: '1 tbsp'            },
      { id: 'chicken_broth_low_sodium',   grams: 236,  qty: '1 cup'             },
      { id: 'smoked_paprika',             grams: 1.25, qty: '½ tsp'             },
      { id: 'garlic_powder',              grams: 1.25, qty: '½ tsp'             },
      { id: 'onion_powder',               grams: 1.25, qty: '½ tsp'             },
    ],
    _totalMacros: { calories: 3366, proteinG: 175.7, fatG: 142.8, carbsG: 350.1, sodiumMg: 6113 },
  },

  // ----------------------------------------------------------------
  // R31 — Lentil Loaf
  // ----------------------------------------------------------------
  lentil_loaf: {
    id:           'lentil_loaf',
    name:         'Lentil Loaf',
    rank:         'B',
    source_url:   'https://www.budgetbytes.com/lentil-loaf/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'lentils_cooked',         grams: 594, qty: '3 cups'                  },
      { id: 'mushrooms_white_raw',    grams: 454, qty: '16 oz'                   },
      { id: 'ketchup',                grams: 150, qty: '½ cup + 2 tbsp (glaze + loaf)' },
      { id: 'carrots_raw',            grams: 180, qty: '2 large'                 },
      { id: 'walnuts',                grams: 58,  qty: '½ cup, processed'        },
      { id: 'ground_flaxseed',        grams: 18,  qty: '2 tbsp'                  },
      { id: 'olive_oil_extra_virgin', grams: 14,  qty: '1 tbsp'                  },
      { id: 'soy_sauce',              grams: 30,  qty: '2 tbsp (1 loaf + 1 glaze)'},
      { id: 'breadcrumbs_dry_plain',  grams: 27,  qty: '¼ cup'                   },
      { id: 'garlic',                 grams: 20,  qty: '4 cloves'                },
      { id: 'sundried_tomatoes',      grams: 22,  qty: '2 tbsp in oil'           },
      { id: 'onion_yellow',           grams: 55,  qty: '½ medium'                },
      { id: 'brown_sugar',            grams: 12,  qty: '1 tbsp'                  },
      { id: 'dijon_mustard',          grams: 5,   qty: '1 tsp'                   },
      { id: 'fresh_parsley',          grams: 10,  qty: '2 tbsp minced'           },
    ],
    _totalMacros: { calories: 1963, proteinG: 93.8, fatG: 67.9, carbsG: 260.8, sodiumMg: 7102 },
  },

  // ----------------------------------------------------------------
  // R32 — Southwest Lentils and Rice Skillet
  // ----------------------------------------------------------------
  southwest_lentil_rice_skillet: {
    id:           'southwest_lentil_rice_skillet',
    name:         'Southwest Lentils and Rice Skillet',
    rank:         'A',
    source_url:   'https://www.budgetbytes.com/southwest-lentils-and-rice-skillet/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'white_rice_long_grain_dry',  grams: 139, qty: '¾ cup'                   },
      { id: 'black_beans_canned_drained', grams: 245, qty: '1 can (15 oz), drained'  },
      { id: 'canned_diced_tomatoes',      grams: 411, qty: '1 can (14.5 oz)'         },
      { id: 'lentils_dry',                grams: 95,  qty: '½ cup'                   },
      { id: 'frozen_corn',                grams: 154, qty: '1 cup'                   },
      { id: 'cheddar_cheese',             grams: 57,  qty: '½ cup shredded'          },
      { id: 'red_onion',                  grams: 85,  qty: '1 small'                 },
      { id: 'olive_oil_extra_virgin',     grams: 14,  qty: '1 tbsp'                  },
      { id: 'garlic',                     grams: 10,  qty: '2 cloves'                },
      { id: 'vegetable_broth',            grams: 472, qty: '2 cups'                  },
      { id: 'ground_cumin',               grams: 4,   qty: '1½ tsp'                  },
      { id: 'chili_powder',               grams: 3,   qty: '1 tsp'                   },
      { id: 'adobo_seasoning',            grams: 3,   qty: '1 tsp'                   },
      { id: 'dried_oregano',              grams: 0.5, qty: '½ tsp'                   },
      { id: 'green_onions',               grams: 15,  qty: '2 whole'                 },
    ],
    _totalMacros: { calories: 1774, proteinG: 75.2, fatG: 41.4, carbsG: 288.2, sodiumMg: 4397 },
  },

  // ----------------------------------------------------------------
  // R33 — Spanish Chickpeas and Rice
  // ----------------------------------------------------------------
  spanish_chickpeas_rice: {
    id:           'spanish_chickpeas_rice',
    name:         'Spanish Chickpeas and Rice',
    rank:         'B',
    source_url:   'https://www.budgetbytes.com/spanish-chickpeas-and-rice/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'white_rice_long_grain_dry', grams: 185, qty: '1 cup'                                                     },
      { id: 'chickpeas_canned_drained',  grams: 245, qty: '1 can (15 oz), drained'                                    },
      { id: 'artichoke_hearts_canned',   grams: 250, qty: '1 can (15 oz)', note: 'USDA SR 169311 proxy — cooked globe artichoke w/ salt' },
      { id: 'canned_diced_tomatoes',     grams: 425, qty: '1 can (15 oz)'                                             },
      { id: 'olive_oil_extra_virgin',    grams: 28,  qty: '2 tbsp'                                                    },
      { id: 'yellow_onion',              grams: 110, qty: '1 whole'                                                   },
      { id: 'garlic',                    grams: 10,  qty: '2 cloves'                                                  },
      { id: 'smoked_paprika',            grams: 3.5, qty: '½ tbsp'                                                    },
      { id: 'ground_cumin',              grams: 2.5, qty: '1 tsp'                                                     },
      { id: 'dried_oregano',             grams: 0.5, qty: '½ tsp'                                                     },
      { id: 'cayenne_pepper',            grams: 0.75,qty: '¼ tsp'                                                     },
      { id: 'vegetable_broth',           grams: 354, qty: '1½ cups'                                                   },
      { id: 'fresh_parsley',             grams: 15,  qty: '¼ bunch'                                                   },
      { id: 'lemon',                     grams: 25,  qty: '1 whole (juice + wedges)'                                  },
    ],
    _totalMacros: { calories: 1531, proteinG: 44.1, fatG: 38.8, carbsG: 258.2, sodiumMg: 3805 },
  },

  // ----------------------------------------------------------------
  // R34 — Thai Coconut Chicken Red Curry  (batch 3992 kcal → 5 servings, capped)
  // ----------------------------------------------------------------
  thai_coconut_red_curry: {
    id:           'thai_coconut_red_curry',
    name:         'Thai Coconut Chicken Red Curry',
    rank:         'A',
    source_url:   'https://www.mealprepmanual.com/thai-coconut-chicken-red-curry/',
    lastUsedWeek: null,
    _ingredients: [
      { id: 'chicken_thigh_boneless_skinless_raw', grams: 1135, qty: '2½ lbs'                                                              },
      { id: 'white_rice_cooked',                   grams: 675,  qty: '4½ cups cooked'                                                      },
      { id: 'light_coconut_milk_canned',           grams: 400,  qty: '1 can (13.5 oz)',  note: 'Thai Kitchen label: 120 kcal/cup, 1g P, 11g F, 8g C, 30mg Na' },
      { id: 'russet_potatoes_raw',                 grams: 400,  qty: '2 medium'                                                            },
      { id: 'red_thai_curry_paste',                grams: 60,   qty: '¼ cup',            note: 'Thai Kitchen label: 25 kcal/tbsp, 0g P, 1g F, 4g C, 230mg Na' },
      { id: 'carrots_raw',                         grams: 200,  qty: '3 medium'                                                            },
      { id: 'green_bell_pepper',                   grams: 150,  qty: '1 medium'                                                            },
      { id: 'green_onions',                        grams: 100,  qty: '1 bunch'                                                             },
      { id: 'peanut_butter',                       grams: 32,   qty: '2 tbsp'                                                              },
      { id: 'oil',                                 grams: 23,   qty: '1½ tbsp'                                                             },
      { id: 'lime_juice',                          grams: 23,   qty: '1½ tbsp'                                                             },
      { id: 'dry_roasted_peanuts',                 grams: 25,   qty: '2 tbsp'                                                              },
      { id: 'brown_sugar',                         grams: 14,   qty: '1 tbsp'                                                              },
      { id: 'garlic',                              grams: 15,   qty: '1 tbsp minced'                                                       },
      { id: 'ginger_fresh',                        grams: 15,   qty: '1 tbsp minced'                                                       },
      { id: 'cornstarch',                          grams: 6,    qty: '1 tbsp'                                                              },
      { id: 'ground_cumin',                        grams: 8,    qty: '1 tbsp'                                                              },
      { id: 'chicken_broth_low_sodium',            grams: 360,  qty: '1½ cups'                                                             },
      { id: 'cilantro',                            grams: 10,   qty: 'small handful, optional'                                             },
    ],
    _totalMacros: { calories: 3992, proteinG: 275.5, fatG: 173.3, carbsG: 348.2, sodiumMg: 3954 },
  },

};

// Lock _ingredients and _totalMacros on every recipe
Object.values(RECIPE_CATALOG).forEach(recipe => {
  Object.freeze(recipe._ingredients);
  Object.freeze(recipe._totalMacros);
});
