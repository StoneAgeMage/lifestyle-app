// ============================================================
// DATA — all plan constants used across modules
// ============================================================

// Plan starts Sunday July 5, 2026. Week 0 = Jul 5–11.
const PLAN_START_SUN = new Date(2026, 6, 5);

// Pete Plan 3-week endurance rotation (Tuesdays)
const peteTueSessions = [
  {name:"5 × 1500m / 5 min rest", detail:"Total 7.5k. Pace: ~5k PB. All but last rep at target, final rep hard."},
  {name:"4 × 2000m / 5 min rest", detail:"Total 8k. Hardest endurance session. Pace: 5k PB + 0.5 sec."},
  {name:"3k / 2.5k / 2k / 5 min rest", detail:"Total 7.5k. Descending. Pace: 5k PB + 1 sec. Gets more manageable."}
];

// Speed sessions rotate monthly (every 4 weeks) — replaces one Thu steady-state
const speedSessions = [
  {name:"8 × 500m / 3:30 rest", detail:"Total 4k. Pace: 2k PB – 3 sec. Last rep all out."},
  {name:"Speed Pyramid", detail:"250–500–750–1k–750–500–250m. 1:30 rest per 250m. Constant pace up to 1k, then accelerate."},
  {name:"4 × 1000m / 5 min rest", detail:"Total 4k. Pace: 2k PB + 1 sec."}
];

// Strength session definitions
const strengthA = [{t:"Strength A — Posterior Chain + Pull",d:"Ring rows 3×8 · DB RDL 3×10 · Goblet squat 3×12 · Ring push-ups 3×10 · Pallof press 3×10ea · Plank 3×45s"}];
const strengthB = [{t:"Strength B — Hinge + Single Leg",d:"DB bent-over row 3×10 · Ring dips 3×8 · DB reverse lunge 3×10ea · Face pulls 3×15 · Dead bug 3×10 · Side plank 2×30s ea"}];
const strengthC = [{t:"Strength C — Upper Body Focus",d:"Ring push-ups 3×12 · DB single-arm row 3×10ea · Lateral raises 3×15 · DB curls 3×12 · Ring tricep dips 3×8 · Hollow body hold 3×30s · Leg-friendly by design."}];

const sundayItems = [
  {t:"Meal Prep (~2 hrs)",d:"Cook grains, roast veg, make week's sauce, sheet pan protein, one-pot veg, overnight oat jars (soy milk base), trail mix batch, portion snacks."},
  {t:"Easy Erg — 20–25 min",d:"18–20 spm. Rate-capped. Very light pressure. Recovery rowing only."},
  {t:"Stretch & Mobility — 20 min",d:"Hip flexors · thoracic rotation · hamstring stretch · lat/shoulder stretch · foam roll glutes + quads"}
];

const waterPri      = [{t:"Crew Practice (primary)",d:"Counts as Pete Plan distance work. On water = session complete for the day."}];
const ergBackup     = {t:"Backup: Steady-State Erg 8–10k",d:"If crew cancelled: 22–25 spm, easy conversational pace. ≥10 sec/500m slower than interval pace."};
const longWaterPri  = [{t:"Crew Practice — Long Session (primary)",d:"Weekly peak aerobic effort. Counts as hard distance piece. Most important session of the week."}];
const ergLongBackup = {t:"Backup: Steady-State Erg 10–12k",d:"If crew cancelled: longer easy row. No intervals."};

// 4-week meal rotation
const mealWeeks = [
  { cuisine:"Asian", color:"h1",
    dinner1:{name:"Sheet Pan Sesame Chicken",desc:"Sesame-soy sauce, asparagus, bell pepper, cashews. Serve over rice.",link:"https://www.ambitiouskitchen.com/sheet-pan-sesame-chicken/",prot:"~41g"},
    dinner2:{name:"Tofu Cashew Coconut Curry",desc:"Crispy tofu, sweet potato, cauliflower. Ascent shake tonight.",link:"https://www.ambitiouskitchen.com/vegetarian-tofu-cashew-coconut-curry/",prot:"~18g+shake",veg:true},
    bowl:"Soy-Ginger Grain Bowl",
    sauce:"Sesame-Ginger Dressing",
    flex:{name:"Rice Bowl + Fried Eggs",desc:"Leftover grain + veg + 2 eggs + sauce."}
  },
  { cuisine:"Mediterranean", color:"h2",
    dinner1:{name:"Sheet Pan Moroccan Chicken",desc:"Cumin-turmeric-cinnamon spice blend, sweet potato, cauliflower, feta yogurt drizzle.",link:"https://www.ambitiouskitchen.com/sheet-pan-moroccan-chicken/",prot:"~41g"},
    dinner2:{name:"Creamy Tomato Lentil Soup",desc:"Red lentils, coconut milk, cumin, turmeric. Pita on side. Ascent shake.",link:"https://www.ambitiouskitchen.com/coconut-tomato-lentil-soup/",prot:"~12g+shake",veg:true},
    bowl:"Lemon-Herb Grain Bowl",
    sauce:"Lemon-Herb Tahini Dressing",
    flex:{name:"Shakshuka",desc:"Eggs poached in spiced tomato sauce. 20 min, pantry staples."}
  },
  { cuisine:"Mexican", color:"h3",
    dinner1:{name:"Sazon Grilled Chicken Thighs",desc:"Homemade sazon: cumin, coriander, turmeric, garlic, oregano. Bowls or tacos.",link:"https://www.ambitiouskitchen.com/sazon-grilled-chicken-thighs/",prot:"~34g"},
    dinner2:{name:"Coconut Sweet Potato & Lentil Stew",desc:"Sweet potato, lentils, coconut milk, curry + ginger. Ascent shake.",link:"https://www.ambitiouskitchen.com/coconut-curried-sweet-potato-and-lentil-stew/",prot:"~12g+shake",veg:true},
    bowl:"Cumin-Lime Grain Bowl",
    sauce:"Cilantro-Lime Dressing",
    flex:{name:"Black Bean Tacos",desc:"Corn tortillas, beans, avocado, pickled onion, salsa. Zero cooking."}
  },
  { cuisine:"Thai", color:"h4",
    dinner1:{name:"Thai Basil Chicken",desc:"Ground or sliced chicken, oyster sauce, fish sauce, Thai basil, chili, over jasmine rice.",link:"https://www.americastestkitchen.com/recipes/5032-thai-style-chicken-with-basil",prot:"~38g"},
    dinner2:{name:"Thai Peanut Cauliflower Chickpea Curry",desc:"Coconut milk, red curry paste, peanut butter, cauliflower, chickpeas. Ascent shake.",link:"https://www.ambitiouskitchen.com/thai-peanut-coconut-cauliflower-chickpea-curry/",prot:"~15g+shake",veg:true},
    bowl:"Thai Peanut Grain Bowl",
    sauce:"Thai Peanut Dressing",
    flex:{name:"Peanut Noodle Bowl",desc:"Rice noodles + remaining peanut sauce + shredded cabbage + edamame. 10 min."}
  }
];

// ---- Workout tab data ----

const rationale = [
  {day:"Monday",role:"Lift Only — Strength A",why:"Fresh at week start. Heavy posterior chain. No erg — full recovery for Tuesday."},
  {day:"Tuesday",role:"Water / Pete Endurance Erg",why:"Primary: crew practice. Backup: Pete Plan endurance intervals. Hardest aerobic session."},
  {day:"Wednesday",role:"Lift Only — Strength B",why:"Active recovery between aerobic sessions. Strength here doesn't interfere with Thu/Fri."},
  {day:"Thursday",role:"Water / Steady State",why:"Primary: crew practice. Backup: steady-state erg. Once/month: speed session."},
  {day:"Friday",role:"Lift Only — Strength C",why:"Third lift day. Upper body focus, light on legs — Saturday is the long water day."},
  {day:"Saturday",role:"Long Water / Steady Erg",why:"Peak aerobic day. Crew long session = Pete Plan hard distance piece."},
  {day:"Sunday",role:"Easy Erg + Stretch",why:"20–25 min 18–20 spm. Rate-capped recovery. 20 min mobility/stretch follows."}
];

const peteCards = [
  {cls:"end",type:"Endurance · Tue Wk 1",name:"5 × 1500m / 5 min rest",detail:"7.5k total. Pace: ~5k PB. Record avg pace for next cycle."},
  {cls:"end",type:"Endurance · Tue Wk 2",name:"4 × 2000m / 5 min rest",detail:"8k total. Hardest endurance session. Pace: 5k PB + 0.5 sec."},
  {cls:"end",type:"Endurance · Tue Wk 3",name:"3k / 2.5k / 2k / 5 min rest",detail:"7.5k total. Descending. Pace: 5k PB + 1 sec."},
  {cls:"steady",type:"Steady · Thu & Sat",name:"8–12k Easy",detail:"22–25 spm. Conversational. ≥10 sec/500m slower than intervals. Crew practice replaces."},
  {cls:"speed",type:"Monthly Speed Swap",name:"1× per month",detail:"Replace one Thu or Sat steady with: 8×500m, pyramid, or 4×1000m. Rotate monthly."},
  {cls:"steady",type:"Sunday Recovery",name:"20–25 min Very Easy",detail:"18–20 spm. Rate-capped. Recovery rowing only. Follow with 20 min stretch."}
];

const weekDays = [
  [
    {day:"Monday",badge:"Strength A",color:"c-lift",intensity:70,items:strengthA.map(x=>({i:"💪",...x})).concat([{i:"🧘",t:"Cool-down",d:"5 min light stretching.",tag:"5 min"}])},
    {day:"Tuesday",badge:"Pete Endurance",color:"c-end",intensity:85,items:[{i:"⚡",t:"5 × 1500m / 5 min rest",d:"Warm-up 1–2k. All but last rep at target, final rep all-out. Record avg pace."},{i:"🚣",t:"On Water? Better.",d:"Crew practice = done. Skip erg.",tag:"Water = done"}]},
    {day:"Wednesday",badge:"Strength B",color:"c-lift",intensity:65,items:strengthB.map(x=>({i:"💪",...x})).concat([{i:"🧘",t:"Cool-down",d:"5 min hip + shoulder focus.",tag:"5 min"}])},
    {day:"Thursday",badge:"Steady / Water",color:"c-water",intensity:55,items:[{i:"🚣",t:"Crew Practice",d:"Counts as steady-state distance work."},{i:"🚣",t:"Backup: Steady Erg 8–10k",d:"22–25 spm, easy pace.",tag:"Backup"}]},
    {day:"Friday",badge:"Strength C",color:"c-lift",intensity:55,items:strengthC.map(x=>({i:"💪",...x})).concat([{i:"ℹ️",t:"Leg-friendly",d:"Saturday is long water.",tag:"Light legs"}])},
    {day:"Saturday",badge:"Long Water",color:"c-water",intensity:72,items:[{i:"🚣",t:"Crew Practice — Long",d:"Peak aerobic session of the week."},{i:"🚣",t:"Backup: Steady Erg 10–12k",d:"Easy long row if cancelled.",tag:"Backup"}]},
    {day:"Sunday",badge:"Easy Erg + Recovery",color:"c-rest",intensity:20,items:sundayItems.map(x=>({i:x.t.includes("Erg")?"🚣":"🧘",...x}))}
  ],
  [
    {day:"Monday",badge:"Strength A",color:"c-lift",intensity:70,items:strengthA.map(x=>({i:"💪",...x}))},
    {day:"Tuesday",badge:"Pete Endurance",color:"c-end",intensity:88,items:[{i:"⚡",t:"4 × 2000m / 5 min rest",d:"Hardest endurance session. Warm-up 1–2k. Pace: 5k PB + 0.5 sec. Total 8k."},{i:"🚣",t:"On Water? Better.",d:"Crew practice = done.",tag:"Water = done"}]},
    {day:"Wednesday",badge:"Strength B",color:"c-lift",intensity:65,items:strengthB.map(x=>({i:"💪",...x}))},
    {day:"Thursday",badge:"Steady / Water",color:"c-water",intensity:55,items:[{i:"🚣",t:"Crew Practice",d:"Steady aerobic work on water."},{i:"🚣",t:"Backup: Steady Erg 8–10k",d:"Easy pace, 22–25 spm.",tag:"Backup"}]},
    {day:"Friday",badge:"Strength C",color:"c-lift",intensity:55,items:strengthC.map(x=>({i:"💪",...x}))},
    {day:"Saturday",badge:"Long Water",color:"c-water",intensity:72,items:[{i:"🚣",t:"Crew Practice — Long",d:"Full long water session."},{i:"🚣",t:"Backup: Steady Erg 10–12k",d:"Easy erg if cancelled.",tag:"Backup"}]},
    {day:"Sunday",badge:"Easy Erg + Recovery",color:"c-rest",intensity:20,items:sundayItems.map(x=>({i:x.t.includes("Erg")?"🚣":"🧘",...x}))}
  ],
  [
    {day:"Monday",badge:"Strength A",color:"c-lift",intensity:72,items:strengthA.map(x=>({i:"💪",...x}))},
    {day:"Tuesday",badge:"Pete Endurance",color:"c-end",intensity:82,items:[{i:"⚡",t:"3k / 2.5k / 2k / 5 min rest",d:"Descending — gets more manageable. Pace: 5k PB + 1 sec. Warm-up 1–2k. Total 7.5k."},{i:"🚣",t:"On Water? Better.",d:"Crew practice = done.",tag:"Water = done"}]},
    {day:"Wednesday",badge:"Strength B",color:"c-lift",intensity:65,items:strengthB.map(x=>({i:"💪",...x}))},
    {day:"Thursday",badge:"Steady / Water",color:"c-water",intensity:55,items:[{i:"🚣",t:"Crew Practice",d:"Third water day of the week."},{i:"🚣",t:"Backup: Steady Erg 8–10k",d:"Easy. Monthly speed swap option here.",tag:"Backup"}]},
    {day:"Friday",badge:"Strength C",color:"c-lift",intensity:55,items:strengthC.map(x=>({i:"💪",...x}))},
    {day:"Saturday",badge:"Long Water",color:"c-water",intensity:72,items:[{i:"🚣",t:"Crew Practice — Long",d:"Week's peak aerobic effort."},{i:"🚣",t:"Backup: Steady Erg 10–12k",d:"Easy long erg.",tag:"Backup"}]},
    {day:"Sunday",badge:"Easy Erg + Recovery",color:"c-rest",intensity:20,items:sundayItems.map(x=>({i:x.t.includes("Erg")?"🚣":"🧘",...x}))}
  ]
];

// ---- Sauces & Prep data ----

const allSauceData = [
  {heading:"Week 1 — Asian Sauces", headColor:"h1", items:[
    {title:"Sesame-Ginger Dressing",tag:"Grain Bowls",hcls:"h1",ingredients:"<strong>2 tbsp</strong> soy sauce · <strong>1 tbsp</strong> sesame oil · <strong>1 tbsp</strong> rice vinegar · <strong>1 tbsp</strong> olive oil · <strong>1 tsp</strong> fresh ginger, grated · <strong>1 tsp</strong> maple syrup · <strong>1 clove</strong> garlic · <em>Optional: 1 tbsp tahini for creaminess</em>",method:"Whisk all ingredients in a jar or bowl. Shake to combine. Stores 1 week. Makes ~⅓ cup — double batch covers bowls + marinade.",link:"https://www.ambitiouskitchen.com/sesame-ginger-dressing/",lt:"Ambitious Kitchen"},
    {title:"Sesame-Soy Marinade",tag:"Chicken & Salmon",hcls:"h1",ingredients:"<strong>3 tbsp</strong> soy sauce · <strong>1 tbsp</strong> sesame oil · <strong>1 tbsp</strong> rice vinegar · <strong>1 tbsp</strong> maple syrup · <strong>2 cloves</strong> garlic, minced · <strong>1 tsp</strong> fresh ginger · <em>Optional: 1 tsp sriracha</em>",method:"Whisk together. Marinate chicken 1–8 hrs, salmon 15–30 min. Use the same base as the dressing — double the batch and split.",link:null}
  ]},
  {heading:"Week 2 — Mediterranean Sauces", headColor:"h2", items:[
    {title:"Lemon-Herb Tahini",tag:"Grain Bowls",hcls:"h2",ingredients:"<strong>¼ cup</strong> tahini · <strong>3 tbsp</strong> fresh lemon juice · <strong>1 clove</strong> garlic, minced · <strong>2 tbsp</strong> fresh parsley or dill, chopped · <strong>2–4 tbsp</strong> cold water (to thin) · <strong>¼ tsp</strong> salt",method:"Whisk tahini + lemon (it'll seize — keep going). Add garlic, herbs, salt. Thin with water 1 tbsp at a time until pourable. Stores 5–7 days. Makes ~½ cup.",link:"https://plantbasedjess.com/lemon-herb-tahini-dressing/",lt:"Plant Based Jess"},
    {title:"Moroccan Spice Marinade",tag:"Chicken",hcls:"h2",ingredients:"<strong>2 tbsp</strong> olive oil · <strong>1 tbsp</strong> lemon juice · <strong>1 tsp</strong> cumin · <strong>1 tsp</strong> turmeric · <strong>½ tsp</strong> cinnamon · <strong>½ tsp</strong> garlic powder · <strong>¼ tsp</strong> cayenne · <strong>½ tsp</strong> salt",method:"Whisk into a paste. Rub over chicken thighs, marinate 30 min–overnight. Full instructions in Moroccan Chicken recipe.",link:"https://www.ambitiouskitchen.com/sheet-pan-moroccan-chicken/",lt:"See Moroccan Chicken Recipe"}
  ]},
  {heading:"Week 3 — Mexican / Latin Sauces", headColor:"h3", items:[
    {title:"Cilantro-Lime Dressing",tag:"Grain Bowls",hcls:"h3",ingredients:"<strong>1 cup</strong> fresh cilantro, packed · <strong>3 tbsp</strong> olive oil · <strong>3 tbsp</strong> fresh lime juice · <strong>1 clove</strong> garlic · <strong>½ tsp</strong> ground coriander · <strong>1 tsp</strong> maple syrup · <strong>¼ tsp</strong> salt · <em>Optional: ½ jalapeño or ½ avocado for creaminess</em>",method:"Blend or food-process until smooth. Don't over-blend — keep flecks of green. Stores 4–5 days (2 weeks without avocado). Makes ~½ cup.",link:"https://www.ambitiouskitchen.com/cilantro-lime-dressing/",lt:"Ambitious Kitchen"},
    {title:"Sazon Marinade",tag:"Chicken",hcls:"h3",ingredients:"<strong>1 tbsp</strong> olive oil · <strong>1 tsp</strong> cumin · <strong>1 tsp</strong> coriander · <strong>½ tsp</strong> turmeric · <strong>½ tsp</strong> garlic powder · <strong>½ tsp</strong> dried oregano · <strong>¼ tsp</strong> cayenne · <strong>½ tsp</strong> salt",method:"Mix into a paste. Rub over chicken thighs, marinate 30 min–24 hrs. Also works as seasoning for grain bowl black beans.",link:"https://www.ambitiouskitchen.com/sazon-grilled-chicken-thighs/",lt:"Ambitious Kitchen"}
  ]},
  {heading:"Week 4 — Thai Sauces", headColor:"h4", items:[
    {title:"Thai Peanut Dressing",tag:"Grain Bowls",hcls:"h4",ingredients:"<strong>3 tbsp</strong> natural peanut butter · <strong>2 tbsp</strong> soy sauce (or tamari) · <strong>2 tbsp</strong> rice vinegar · <strong>1 tbsp</strong> sesame oil · <strong>1 tbsp</strong> honey or maple syrup · <strong>1 tsp</strong> fresh ginger, grated · <strong>1 clove</strong> garlic, minced · <strong>2–3 tbsp</strong> warm water to thin",method:"Whisk all together or shake in a mason jar. Add water 1 tbsp at a time until pourable. Stores 1 week. Makes ~½ cup. Also works as chicken marinade.",link:"https://www.ambitiouskitchen.com/healthy-thai-peanut-dressing/",lt:"Ambitious Kitchen"},
    {title:"Thai Basil Chicken Sauce",tag:"Chicken Stir-Fry",hcls:"h4",ingredients:"<strong>2 tbsp</strong> fish sauce · <strong>1 tbsp</strong> oyster sauce · <strong>1 tsp</strong> white vinegar · <strong>1 tbsp</strong> sugar · <strong>3–6</strong> Thai chiles, sliced · <strong>3 cloves</strong> garlic, minced",method:"Whisk together before cooking. Add to stir-fried chicken in last 2 min. Stir in fresh basil leaves off heat. Full recipe instructions at link.",link:"https://www.americastestkitchen.com/recipes/5032-thai-style-chicken-with-basil",lt:"America's Test Kitchen"}
  ]}
];

const prepSections = [
  {title:"① Brown Rice",items:["2 cups dry → 4–5 cups cooked. Start first — 45 min hands-off.","Portion into 5 lunch containers once cool.","Can swap for jasmine rice on Thai week."]},
  {title:"② Roasted Veg (2 pans)",items:["Pan 1: sweet potato + broccoli. 400°F, 25 min.","Pan 2: cherry tomatoes + zucchini or bell pepper. 425°F, 20 min.","Season with olive oil + salt only — sauce flavors everything later."]},
  {title:"③ Overnight Oats (×5)",items:["5 mason jars: ½c rolled oats + 1c soy milk + 1 tbsp chia seeds + 1 tsp honey.","Soy milk base gives ~7g protein per jar plus creaminess without dairy.","Refrigerate unsealed — add fresh toppings each morning (fruit, nut butter, granola, banana, etc.).","Takes 10 min. Do this while the grains cook."]},
  {title:"④ Trail Mix Batch (weekly)",items:["Ratio: 2 parts pistachios · 1 part almonds or cashews · 1 part pumpkin seeds · 1 part dried cherries or cranberries · ½ part dark chocolate chips (70%+) · ½ part unsweetened coconut flakes.","Serving: 1.5 oz / 42g (~¼ cup heaping). ~200 cal, 6–7g protein.","Weekly batch = 7 servings (~10.5 oz). Store in a jar. Portion into a small bag each morning.","Toast the coconut flakes and pumpkin seeds in a dry pan 3–4 min first for better flavor."]},
  {title:"⑤ Snack & Evening Prep",items:["Portion edamame: buy frozen steam-in-bag. Microwave a bag each day — no Sunday prep needed.","Roasted chickpeas (optional batch): 1 can drained, toss with olive oil + spice, roast 400°F 25–30 min. Good crunchy desk snack alternative.","Evening dessert: keep a bag of whole-grain granola and soy milk in the pantry. ¼c each, ~150 cal. No prep needed.","String cheese (1–2/day, ~7g protein each) is a convenient backup snack for high-training days."]},
  {title:"⑥ Sheet Pan Protein",items:["Marinate in week's sauce 30 min–overnight.","Roast per recipe. 4 servings: 2 dinners + 2 into lunch bowls.","Can marinate Sunday, roast fresh on a weeknight."]},
  {title:"⑦ One-Pot Veg Meal",items:["Serves 4: 2 dinners + 2 portions into bowls.","Curries and stews taste better on days 2–3.","Freeze a batch every few weeks to skip this step."]},
  {title:"⑧ Week's Sauce",items:["Double batch (~1 cup): half for bowl drizzle, half as marinade.","Store in a mason jar in fridge. Lasts the full week.","See each week's recipe in the Sauces tab."]}
];
