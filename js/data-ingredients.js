// ============================================================
// DATA-INGREDIENTS — normalized ingredient catalog
// Phase 2. All recipe ingredient references must use IDs here.
// Unit vocabulary: tbsp, tsp, cup, oz, lb, g, whole, clove, bunch
// Categories: protein, produce, dairy, grains, pantry, frozen, spice, condiment
// Shelf life: pantry (months), fridge-staple (weeks), weekly-fresh (days)
// ============================================================

const INGREDIENT_CATALOG = {

  // ---- Proteins ------------------------------------------------
  chicken_thigh:    { id:'chicken_thigh',    name:'Chicken Thighs',           category:'protein',   shelfLife:'weekly-fresh',  isPantryStaple:false },
  ground_chicken:   { id:'ground_chicken',   name:'Ground Chicken',           category:'protein',   shelfLife:'weekly-fresh',  isPantryStaple:false },
  ground_turkey:    { id:'ground_turkey',    name:'Ground Turkey',            category:'protein',   shelfLife:'weekly-fresh',  isPantryStaple:false },
  salmon_fillet:    { id:'salmon_fillet',    name:'Salmon Fillet',            category:'protein',   shelfLife:'weekly-fresh',  isPantryStaple:false },
  firm_tofu:        { id:'firm_tofu',        name:'Firm Tofu',                category:'protein',   shelfLife:'fridge-staple', isPantryStaple:false },
  paneer:           { id:'paneer',           name:'Paneer',                   category:'protein',   shelfLife:'fridge-staple', isPantryStaple:false },
  eggs:             { id:'eggs',             name:'Eggs',                     category:'protein',   shelfLife:'fridge-staple', isPantryStaple:true  },
  canned_chickpeas: { id:'canned_chickpeas', name:'Chickpeas (canned)',       category:'protein',   shelfLife:'pantry',        isPantryStaple:false },
  red_lentils:      { id:'red_lentils',      name:'Red Lentils (dried)',      category:'protein',   shelfLife:'pantry',        isPantryStaple:false },
  black_beans_can:  { id:'black_beans_can',  name:'Black Beans (canned)',     category:'protein',   shelfLife:'pantry',        isPantryStaple:false },
  white_beans_can:  { id:'white_beans_can',  name:'White Beans (canned)',     category:'protein',   shelfLife:'pantry',        isPantryStaple:false },
  edamame_frozen:   { id:'edamame_frozen',   name:'Edamame (frozen)',         category:'frozen',    shelfLife:'pantry',        isPantryStaple:true  },
  frozen_spinach:   { id:'frozen_spinach',   name:'Frozen Spinach',           category:'frozen',    shelfLife:'pantry',        isPantryStaple:false },
  string_cheese:    { id:'string_cheese',    name:'String Cheese',            category:'dairy',     shelfLife:'fridge-staple', isPantryStaple:false },

  // ---- Produce -------------------------------------------------
  garlic:           { id:'garlic',           name:'Garlic',                   category:'produce',   shelfLife:'fridge-staple', isPantryStaple:true  },
  fresh_ginger:     { id:'fresh_ginger',     name:'Fresh Ginger',             category:'produce',   shelfLife:'fridge-staple', isPantryStaple:false },
  onion:            { id:'onion',            name:'Yellow Onion',             category:'produce',   shelfLife:'fridge-staple', isPantryStaple:true  },
  green_onion:      { id:'green_onion',      name:'Green Onions',             category:'produce',   shelfLife:'weekly-fresh',  isPantryStaple:false },
  bell_pepper:      { id:'bell_pepper',      name:'Bell Pepper',              category:'produce',   shelfLife:'weekly-fresh',  isPantryStaple:false },
  asparagus:        { id:'asparagus',        name:'Asparagus',                category:'produce',   shelfLife:'weekly-fresh',  isPantryStaple:false },
  sweet_potato:     { id:'sweet_potato',     name:'Sweet Potato',             category:'produce',   shelfLife:'fridge-staple', isPantryStaple:false },
  cauliflower:      { id:'cauliflower',      name:'Cauliflower',              category:'produce',   shelfLife:'weekly-fresh',  isPantryStaple:false },
  broccoli:         { id:'broccoli',         name:'Broccoli',                 category:'produce',   shelfLife:'weekly-fresh',  isPantryStaple:false },
  cherry_tomato:    { id:'cherry_tomato',    name:'Cherry Tomatoes',          category:'produce',   shelfLife:'weekly-fresh',  isPantryStaple:false },
  zucchini:         { id:'zucchini',         name:'Zucchini',                 category:'produce',   shelfLife:'weekly-fresh',  isPantryStaple:false },
  cilantro:         { id:'cilantro',         name:'Cilantro',                 category:'produce',   shelfLife:'weekly-fresh',  isPantryStaple:false },
  parsley:          { id:'parsley',          name:'Fresh Parsley',            category:'produce',   shelfLife:'weekly-fresh',  isPantryStaple:false },
  dill:             { id:'dill',             name:'Fresh Dill',               category:'produce',   shelfLife:'weekly-fresh',  isPantryStaple:false },
  thai_basil:       { id:'thai_basil',       name:'Thai Basil',               category:'produce',   shelfLife:'weekly-fresh',  isPantryStaple:false },
  thai_chili:       { id:'thai_chili',       name:'Thai Chiles',              category:'produce',   shelfLife:'fridge-staple', isPantryStaple:false },
  jalapeno:         { id:'jalapeno',         name:'Jalapeño',                 category:'produce',   shelfLife:'fridge-staple', isPantryStaple:false },
  lemon:            { id:'lemon',            name:'Lemon',                    category:'produce',   shelfLife:'fridge-staple', isPantryStaple:false },
  lime:             { id:'lime',             name:'Lime',                     category:'produce',   shelfLife:'fridge-staple', isPantryStaple:false },
  fresh_basil:      { id:'fresh_basil',      name:'Fresh Basil',              category:'produce',   shelfLife:'weekly-fresh',  isPantryStaple:false },
  avocado:          { id:'avocado',          name:'Avocado',                  category:'produce',   shelfLife:'weekly-fresh',  isPantryStaple:false },
  cabbage_shredded: { id:'cabbage_shredded', name:'Shredded Cabbage',         category:'produce',   shelfLife:'fridge-staple', isPantryStaple:false },

  // ---- Grains --------------------------------------------------
  brown_rice:          { id:'brown_rice',          name:'Brown Rice',              category:'grains',    shelfLife:'pantry',        isPantryStaple:true  },
  jasmine_rice:        { id:'jasmine_rice',         name:'Jasmine Rice',            category:'grains',    shelfLife:'pantry',        isPantryStaple:false },
  rolled_oats:         { id:'rolled_oats',          name:'Rolled Oats',             category:'grains',    shelfLife:'pantry',        isPantryStaple:true  },
  chia_seeds:          { id:'chia_seeds',           name:'Chia Seeds',              category:'grains',    shelfLife:'pantry',        isPantryStaple:true  },
  rice_noodles:        { id:'rice_noodles',         name:'Rice Noodles',            category:'grains',    shelfLife:'pantry',        isPantryStaple:false },
  whole_wheat_pasta:   { id:'whole_wheat_pasta',    name:'Whole Wheat Pasta (penne/rigatoni)', category:'grains', shelfLife:'pantry', isPantryStaple:false },
  pita_bread:          { id:'pita_bread',           name:'Pita Bread',              category:'grains',    shelfLife:'fridge-staple', isPantryStaple:false },
  corn_tortilla:       { id:'corn_tortilla',        name:'Corn Tortillas',          category:'grains',    shelfLife:'fridge-staple', isPantryStaple:false },
  granola:             { id:'granola',              name:'Whole-Grain Granola',     category:'grains',    shelfLife:'pantry',        isPantryStaple:true  },

  // ---- Dairy / Alt-Dairy ---------------------------------------
  soy_milk:         { id:'soy_milk',         name:'Soy Milk',                 category:'dairy',     shelfLife:'fridge-staple', isPantryStaple:true  },
  feta_cheese:      { id:'feta_cheese',      name:'Feta Cheese',              category:'dairy',     shelfLife:'fridge-staple', isPantryStaple:false },
  greek_yogurt:     { id:'greek_yogurt',     name:'Greek Yogurt',             category:'dairy',     shelfLife:'fridge-staple', isPantryStaple:false },
  parmesan:         { id:'parmesan',         name:'Parmesan (grated)',        category:'dairy',     shelfLife:'fridge-staple', isPantryStaple:false },

  // ---- Oils & Vinegars -----------------------------------------
  olive_oil:        { id:'olive_oil',        name:'Olive Oil',                category:'pantry',    shelfLife:'pantry',        isPantryStaple:true  },
  sesame_oil:       { id:'sesame_oil',       name:'Sesame Oil',               category:'pantry',    shelfLife:'pantry',        isPantryStaple:true,  stapleFor:['asian','korean','japanese','thai'] },
  rice_vinegar:     { id:'rice_vinegar',     name:'Rice Vinegar',             category:'pantry',    shelfLife:'pantry',        isPantryStaple:true,  stapleFor:['asian','korean','japanese','thai'] },
  white_vinegar:    { id:'white_vinegar',    name:'White Vinegar',            category:'pantry',    shelfLife:'pantry',        isPantryStaple:true  },
  red_wine_vinegar: { id:'red_wine_vinegar', name:'Red Wine Vinegar',         category:'pantry',    shelfLife:'pantry',        isPantryStaple:false, stapleFor:['italian','mediterranean'] },

  // ---- Condiments ----------------------------------------------
  soy_sauce:        { id:'soy_sauce',        name:'Soy Sauce',                category:'condiment', shelfLife:'pantry',        isPantryStaple:true,  stapleFor:['asian','korean','japanese','thai'] },
  fish_sauce:       { id:'fish_sauce',       name:'Fish Sauce',               category:'condiment', shelfLife:'pantry',        isPantryStaple:false, stapleFor:['thai','vietnamese'] },
  oyster_sauce:     { id:'oyster_sauce',     name:'Oyster Sauce',             category:'condiment', shelfLife:'pantry',        isPantryStaple:false, stapleFor:['thai','asian'] },
  tahini:           { id:'tahini',           name:'Tahini',                   category:'condiment', shelfLife:'pantry',        isPantryStaple:false, stapleFor:['mediterranean'] },
  peanut_butter:    { id:'peanut_butter',    name:'Natural Peanut Butter',    category:'condiment', shelfLife:'pantry',        isPantryStaple:true,  stapleFor:['thai'] },
  red_curry_paste:  { id:'red_curry_paste',  name:'Red Curry Paste',          category:'condiment', shelfLife:'fridge-staple', isPantryStaple:false, stapleFor:['thai'] },
  mango_chutney:    { id:'mango_chutney',    name:'Mango Chutney',            category:'condiment', shelfLife:'fridge-staple', isPantryStaple:false, stapleFor:['indian'] },
  pesto:            { id:'pesto',            name:'Basil Pesto (jarred)',     category:'condiment', shelfLife:'fridge-staple', isPantryStaple:false, stapleFor:['italian'] },
  coconut_milk_can: { id:'coconut_milk_can', name:'Coconut Milk (canned)',    category:'pantry',    shelfLife:'pantry',        isPantryStaple:false, stapleFor:['asian','thai','mexican','indian'] },
  canned_tomatoes:  { id:'canned_tomatoes',  name:'Canned Diced Tomatoes',    category:'pantry',    shelfLife:'pantry',        isPantryStaple:true  },
  maple_syrup:      { id:'maple_syrup',      name:'Maple Syrup',              category:'condiment', shelfLife:'pantry',        isPantryStaple:true  },
  honey:            { id:'honey',            name:'Honey',                    category:'condiment', shelfLife:'pantry',        isPantryStaple:true  },
  sriracha:         { id:'sriracha',         name:'Sriracha',                 category:'condiment', shelfLife:'fridge-staple', isPantryStaple:false },
  pickled_onion:    { id:'pickled_onion',    name:'Pickled Onion',            category:'condiment', shelfLife:'fridge-staple', isPantryStaple:false },
  salsa:            { id:'salsa',            name:'Salsa',                    category:'condiment', shelfLife:'fridge-staple', isPantryStaple:false },

  // ---- Spices --------------------------------------------------
  cumin:              { id:'cumin',              name:'Cumin (ground)',         category:'spice', shelfLife:'pantry', isPantryStaple:true,  stapleFor:['mediterranean','mexican','indian'] },
  turmeric:           { id:'turmeric',           name:'Turmeric (ground)',      category:'spice', shelfLife:'pantry', isPantryStaple:true,  stapleFor:['mediterranean','mexican','indian','asian'] },
  cinnamon:           { id:'cinnamon',           name:'Cinnamon (ground)',      category:'spice', shelfLife:'pantry', isPantryStaple:true,  stapleFor:['mediterranean'] },
  coriander:          { id:'coriander',          name:'Coriander (ground)',     category:'spice', shelfLife:'pantry', isPantryStaple:true,  stapleFor:['mexican','indian','mediterranean'] },
  garam_masala:       { id:'garam_masala',       name:'Garam Masala',           category:'spice', shelfLife:'pantry', isPantryStaple:false, stapleFor:['indian'] },
  cayenne:            { id:'cayenne',            name:'Cayenne',                category:'spice', shelfLife:'pantry', isPantryStaple:true  },
  garlic_powder:      { id:'garlic_powder',      name:'Garlic Powder',          category:'spice', shelfLife:'pantry', isPantryStaple:true  },
  dried_oregano:      { id:'dried_oregano',      name:'Dried Oregano',          category:'spice', shelfLife:'pantry', isPantryStaple:true  },
  smoked_paprika:     { id:'smoked_paprika',     name:'Smoked Paprika',         category:'spice', shelfLife:'pantry', isPantryStaple:true  },
  italian_seasoning:  { id:'italian_seasoning',  name:'Italian Seasoning',      category:'spice', shelfLife:'pantry', isPantryStaple:false, stapleFor:['italian'] },
  red_pepper_flakes:  { id:'red_pepper_flakes',  name:'Red Pepper Flakes',      category:'spice', shelfLife:'pantry', isPantryStaple:true,  stapleFor:['italian','mediterranean'] },
  sugar:              { id:'sugar',              name:'Sugar',                  category:'spice', shelfLife:'pantry', isPantryStaple:true  },
  salt:               { id:'salt',               name:'Salt',                   category:'spice', shelfLife:'pantry', isPantryStaple:true  },
  black_pepper:       { id:'black_pepper',       name:'Black Pepper',           category:'spice', shelfLife:'pantry', isPantryStaple:true  },

  // ---- Nuts & Snacks -------------------------------------------
  cashews:          { id:'cashews',          name:'Cashews',                  category:'pantry',    shelfLife:'pantry',        isPantryStaple:false },
  pistachios:       { id:'pistachios',       name:'Pistachios (shelled)',     category:'pantry',    shelfLife:'pantry',        isPantryStaple:true  },
  almonds:          { id:'almonds',          name:'Almonds',                  category:'pantry',    shelfLife:'pantry',        isPantryStaple:true  },
  pumpkin_seeds:    { id:'pumpkin_seeds',    name:'Pumpkin Seeds (pepitas)',  category:'pantry',    shelfLife:'pantry',        isPantryStaple:true  },
  dried_cherries:   { id:'dried_cherries',   name:'Dried Cherries',           category:'pantry',    shelfLife:'pantry',        isPantryStaple:true  },
  dark_choc_chips:  { id:'dark_choc_chips',  name:'Dark Chocolate Chips',     category:'pantry',    shelfLife:'pantry',        isPantryStaple:true  },
  coconut_flakes:   { id:'coconut_flakes',   name:'Coconut Flakes (unswtd)',  category:'pantry',    shelfLife:'pantry',        isPantryStaple:true  },

  // ---- Chinese additions ---------------------------------------
  bok_choy:         { id:'bok_choy',         name:'Bok Choy',                 category:'produce',   shelfLife:'weekly-fresh',  isPantryStaple:false },

  // ---- Greek additions -----------------------------------------
  fresh_spinach:    { id:'fresh_spinach',    name:'Fresh Spinach',            category:'produce',   shelfLife:'weekly-fresh',  isPantryStaple:false },
  kalamata_olives:  { id:'kalamata_olives',  name:'Kalamata Olives',          category:'condiment', shelfLife:'fridge-staple', isPantryStaple:false, stapleFor:['greek'] },

  // ---- Spanish additions ---------------------------------------
  sherry_vinegar:   { id:'sherry_vinegar',   name:'Sherry Vinegar',           category:'pantry',    shelfLife:'pantry',        isPantryStaple:false, stapleFor:['spanish'] },
  spanish_chorizo:  { id:'spanish_chorizo',  name:'Spanish Chorizo (cured)',  category:'protein',   shelfLife:'fridge-staple', isPantryStaple:false },

  // ---- Caribbean additions -------------------------------------
  jerk_seasoning:   { id:'jerk_seasoning',   name:'Jerk Seasoning (blend)',   category:'spice',     shelfLife:'pantry',        isPantryStaple:false, stapleFor:['caribbean'] },
  plantains:        { id:'plantains',        name:'Plantains',                category:'produce',   shelfLife:'weekly-fresh',  isPantryStaple:false },
  allspice:         { id:'allspice',         name:'Allspice (ground)',        category:'spice',     shelfLife:'pantry',        isPantryStaple:false, stapleFor:['caribbean'] },
  kidney_beans_can: { id:'kidney_beans_can', name:'Kidney Beans (canned)',    category:'protein',   shelfLife:'pantry',        isPantryStaple:false },
  thyme:            { id:'thyme',            name:'Fresh Thyme',              category:'produce',   shelfLife:'weekly-fresh',  isPantryStaple:false }
};
