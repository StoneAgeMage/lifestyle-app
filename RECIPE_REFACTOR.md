# Recipe System Refactor — Plan & Reference

---

## Current Status — as of 2026-06-14

| Phase | Description | Status |
|---|---|---|
| Phase 0 | Preparation (human) | ✅ Complete |
| Phase 1 | Ingredient fetch & standardization | ✅ Complete |
| Phase 2 | USDA macro calculation | ✅ Complete |
| Phase 3 | Rewrite `data-recipes.js` | ✅ Complete |
| Phase 4 | Remove cuisine system | ✅ Complete |
| Phase 5a | User settings (calorie targets) | ✅ Complete |
| Phase 5b–5g | Engine rewrite (selection, serving division, cooldowns) | ✅ Complete |
| Phase 6 | Rewrite Meal Planner UI | 🔲 Not started |
| Phase 7 | Cleanup & final validation | 🔲 Not started |

---

## Implementation Notes & Decisions

These are deviations from the original spec, decisions made during implementation, and issues to be aware of in future phases.

### Schema Changes from Original Spec

**`qty` field added to `_ingredients`.**
Original spec showed `{ id, grams, note }`. During Phase 1, a `qty` field was added for human-readable shopping quantities (e.g., `'1½ lbs'`, `'3 tbsp'`). The `note` field is now reserved exclusively for branded macro data or USDA proxy clarifications. The `qty` field is what the shopping list displays.

**ALL ingredients must be in `_ingredients` — no omissions.**
An early draft omitted spices, garnishes, and optional items from several recipes. This was corrected: every ingredient that enters the recipe must appear in `_ingredients`, including optional items, garnishes, and serving components. Pantry suppression is a display filter only (visibility flag on shopping list items) — it does not remove ingredients from the aggregate.

**`lastUsedWeek` in `data-recipes.js` is always `null` and is never mutated.**
The spec describes `lastUsedWeek` as a recipe field "updated at runtime." Since `_ingredients` and `_totalMacros` are frozen via `Object.freeze()`, and to keep the data file purely static, all cooldown state is stored in `localStorage` under the key `rowing_cooldowns_v2` (accessed via `storage.readCooldowns()` / `storage.writeCooldowns()`). The `lastUsedWeek: null` field in the data file is a schema placeholder only. At runtime, `storage.readCooldowns()[recipeId]` is the authoritative source for each recipe's last-used week.

**`recipe.weeklyServings` not set on recipe objects.**
Phase 5d spec says `recipe.weeklyServings = N`. Since we chose not to mutate recipe objects at runtime, serving counts are stored on the week plan object in localStorage as `weekPlan.servingCounts` (a `{ recipeId: N }` map). This is cleaner and keeps recipe objects read-only.

---

### Dual Plan ID System in Storage (Phase 6 attention required)

The old `meal-planner.js` stores plans with **date-based IDs** (`wp_YYYY-MM-DD`, keyed to Sunday of the plan week). `MealEngine.generateWeekPlan()` stores plans with **index-based IDs** (`week_plan_N`, where N is the global week index from plan start date). Both schemas coexist in the same `PLANS_KEY` (`rowing_week_plans_v2`) in localStorage.

Currently:
- `mpLoadWeekPlanForDate()` and `_mpLoadViewingPlan()` find plans by date-based ID → find old plans only
- `MealEngine.getStoredWeekPlanForDate()` finds plans by week index → finds new plans only
- `getMealsForDate()` uses the new system; calendar and modal show new plan meals correctly
- `mpEnrichMeals()` uses the old system; silently returns meals unchanged when applied to new plans (new recipes lack `r.mealTypes`, so the recipe filter returns empty → no override)

**Phase 6 action:** `renderMealPlannerHome()` must be rewritten to use the new plan schema. `mpLoadWeekPlanForDate()` and `_mpLoadViewingPlan()` should be deprecated (or updated to find plans by week index). Old date-keyed plans in storage should be ignored or migrated.

---

### Legacy Rendering Code Still Active (Phase 6 will replace)

The following functions in `meal-planner.js` reference old schema fields. They produce degraded or empty output when given a new plan object, but do not crash.

| Function | Old fields used | Behavior with new schema |
|---|---|---|
| `renderMealPlannerHome()` | `r.protStr`, `r.servings`, `r.isVeg`, `r.proteinG`, `plan.portionScales` | Shows PROTEIN label and missing meta; portion scale select shows but has no effect |
| `_renderMacroSummary()` | `r.calories`, `r.proteinG` (flat fields) | Returns empty string (filters `r.calories != null` → false for new recipes) |
| `_renderPrepTimeline()` | `r.brief_instructions`, `r.prepMins`, `r.cookMins` | Fallback text used; timeline renders with generic descriptions |

All three are replaced wholesale in Phase 6.

---

### Shopping List: Multi-Recipe Ingredient Display

`ShoppingListEngine.buildList()` was updated to use `_ingredients` and aggregate by grams. Display logic:
- Ingredient used in **one recipe only**: shows `ing.qty` (human-readable, e.g., `'4 × 6 oz fillets'`)
- Ingredient used in **multiple recipes**: shows total grams (e.g., `'30g'`)

The gram display for multi-recipe shared ingredients (garlic, olive oil, etc.) is not user-friendly. Phase 6 should add unit conversion for common shared ingredients (grams → tsp/tbsp/cups/oz/lbs based on ingredient category).

---

### Vestigial Fields to Remove in Phase 7

- **`mealCycleIds` in training plans** — kept for `mealWeekIndex` math in `getWeekContext()`. `mealWeekIndex` is only used by `buildMealObject()` (a stub returning null). The entire field can be removed in Phase 7 once `getWeekContext()` is updated.
- **`mpEnrichMeals()` and `mpLoadWeekPlanForDate()`** — used only by calendar.js and dashboard. After Phase 6 rewrites `getMealsForDate()` as the sole meal data source, these can be removed.
- **`CalorieEngine.DEFICIT_CAL` / `MAINTENANCE_CAL`** — hardcoded at 2100/2400. Currently independent of `settings.dailyCalorieTarget`. Phase 7 should wire `getDailyTarget()` to read from settings.
- **`renderCuisineSelector()` stub** — currently labeled "Recipe selection coming in Phase 5." Should be renamed `renderWeekPlanSelector()` or similar in Phase 6 and the "Phase 5" text updated.

---

### Overnight Oats / Trail Mix Removed from Shopping List

The old `ShoppingListEngine.buildList()` hardcoded `overnight_oats_base` and `trail_mix_batch` as additional recipe IDs to include in the shopping aggregate. These were removed in the Phase 5 rewrite. If these (or any fixed weekly staples like breakfast prep) need to be on the shopping list, Phase 6 should add a configurable "always-include" list in settings rather than hardcoding recipe IDs.

---

## Overview

This document defines the complete plan for refactoring the recipe and meal planning system in the lifestyle app. The goal is to move from a cuisine-based weekly rotation to a rank-weighted, ingredient-overlap-driven weekly meal selection system backed by verified, immutable recipe data sourced directly from recipe URLs and the USDA FoodData Central database.

Everything in `data-recipes.js` is considered unreliable and will be rewritten from scratch. `data-cuisines.js` will be deleted. The meal planning engine and UI will be rebuilt around the new model.

---

## Core Design Decisions

### 1. Cuisine Labels Removed
The concept of "cuisine weeks" (Chinese week, Greek week, etc.) is eliminated entirely. `data-cuisines.js` and all references to `CUISINE_CATALOG` and `CUISINE_ROTATION` are deleted. Recipes are no longer grouped by cuisine.

### 2. Full-Batch Recipe Model
Each recipe in the data file represents the **entire batch** as written on the source page — all ingredients at full quantity. Macros are stored as totals for that full batch. There is no fixed serving count in the data file. The app dynamically divides each recipe's full batch into however many portions are needed to hit the weekly calorie target.

### 3. Immutable Source Data
Each recipe has two locked data sections set at entry time and never edited thereafter:
- `_ingredients` — the ingredient list with gram-standardized quantities, sourced directly from the recipe URL
- `_totalMacros` — calories, protein, carbs, fat, and sodium for the full batch, calculated via USDA FoodData Central

If the source URL ever changes, both locked sections must be fully re-derived. Changing one without the other is not permitted.

### 4. USDA Macros Are a One-Time Build Step
The USDA FoodData Central API is queried once per recipe at entry time. Macro values are calculated by summing each ingredient's USDA nutrient values scaled to its gram quantity, then stored as locked fields. The app does not call USDA at runtime.

### 5. Two-Layer Recipe Rotation
Weekly recipe selection uses two independent layers:

**Layer 1 — Eligibility (Rank + Cooldown)**
Each recipe has a rank (A, B, or C) and a cooldown that determines the minimum number of weeks before it can appear again:
- **Rank A** — staple recipes, seen frequently. Cooldown: ~2 weeks.
- **Rank B** — rotation recipes, seen occasionally. Cooldown: ~4–5 weeks.
- **Rank C** — infrequent recipes, seen rarely. Cooldown: ~10 weeks.

A recipe that is on cooldown is not eligible for selection regardless of how well its ingredients overlap.

**Layer 2 — Selection (Ingredient Overlap)**
Among eligible recipes, selection is driven by raw ingredient overlap with the already-selected set. No ingredients are excluded or down-weighted. An ingredient shared between two recipes (whether garlic, soy sauce, or coconut milk) represents a real shopping and prep efficiency, regardless of how common it is. Greater overlap = higher priority for selection.

Cooldown is the tiebreaker when two eligible recipes have identical overlap scores.

### 6. Weekly Calorie Targeting
The user provides two settings:
- **Daily calorie target** (e.g., 2100 cal)
- **Daily baseline** — calories already covered by breakfast, shakes, and snacks (e.g., 800 cal)

The app calculates:
```
weekly_lunch_dinner_target = (daily_calorie_target - daily_baseline) × 5
```

Recipes are selected until the sum of their full-batch calories meets or exceeds this weekly target. If adding the next recipe would significantly overshoot (e.g., more than one full day's worth over the target), it is still added. Overage is assumed to be consumed on weekends or by others — daily division handles staying on target during the weekday.

### 7. Serving Division
Once the weekly recipe set is selected, each recipe's full batch is divided independently into N portions:

- Target per serving: approximately `(daily_calorie_target - daily_baseline) / 2` (two recipe meals per day)
- Hard minimum: **400 calories per serving** (below this a serving is too small to be satisfying)
- N is chosen as the integer that brings each serving closest to the target while staying above the minimum
- Total servings across all recipes should cover at least 10 meal slots (2/day × 5 days); overage goes to weekends
- No recipe is assigned to both lunch and dinner on the same day

### 8. Shopping List
The weekly shopping list is derived by combining and summing ingredient quantities across all selected recipes. An optional user-defined **always-stocked pantry list** allows specific ingredients to be suppressed from the shopping output (they still count toward overlap scoring — this is a display-only filter).

---

## New Recipe Data Schema

```js
recipe_id: {

  // --- EDITABLE FIELDS ---
  // These can be updated at any time without re-deriving locked data,
  // EXCEPT source_url: changing source_url requires re-running both
  // the ingredient fetch and the USDA macro calculation.

  id:         'recipe_id',
  name:       'Human-readable recipe name (from source page)',
  rank:       'A',   // 'A' | 'B' | 'C'
  source_url: 'https://...',
  lastUsedWeek: null,   // updated at runtime; null = never used

  // --- LOCKED: INGREDIENT SOURCE DATA ---
  // Set once from the source URL fetch. Do not edit.
  // All quantities are in grams. Original source description
  // is preserved in the 'note' field for reference.
  // Re-derive only if source_url changes.

  _ingredients: [
    { id: 'chicken_thigh',  grams: 680,  note: '1.5 lbs' },
    { id: 'asparagus',      grams: 340,  note: '1 bunch — confirmed 340g' },
    { id: 'soy_sauce',      grams: 51,   note: '3 tbsp' },
    // ...
  ],

  // --- LOCKED: USDA-COMPUTED TOTAL BATCH MACROS ---
  // Calculated from _ingredients via USDA FoodData Central.
  // Represents the FULL recipe batch, not a single serving.
  // Re-derive only if _ingredients changes.

  _totalMacros: {
    calories:  1980,
    proteinG:  164,
    carbsG:    104,
    fatG:      104,
    sodiumMg:  2400
  }

}
```

---

## Files Affected

| File | Action | Notes |
|---|---|---|
| `js/data-recipes.js` | **Complete rewrite** | New schema, locked fields, all 19 kept + replacement recipes |
| `js/data-cuisines.js` | **Deleted** | All cuisine definitions removed |
| `js/engine.js` | **Major rewrite** | New selection algorithm, serving division, calorie targeting |
| `js/meal-planner.js` | **Major UI rewrite** | No cuisine tiles; new weekly recipe card view |
| `js/calendar.js` | **Cleanup** | Remove cuisine references |
| `js/sauces.js` | **Review** | Cuisine-tied sauces/marinades may be removed or decoupled |
| `js/data-ingredients.js` | **Additions** | New ingredient entries as new recipes introduce them |

---

## Recipe Catalog at Refactor Start

### Recipes to Keep (19 total)

| Rank | Recipe ID | Source |
|---|---|---|
| A | sesame_chicken | ambitiouskitchen.com |
| A | chipotle_chicken_bowls | ambitiouskitchen.com |
| A | sheet_pan_fajitas | ambitiouskitchen.com |
| A | thai_larb_chicken | recipetineats.com |
| A | thai_coconut_green_curry | ambitiouskitchen.com |
| A | turkey_bolognese | skinnytaste.com |
| B | soy_glazed_salmon | ambitiouskitchen.com |
| B | moroccan_chicken | themediterraneandish.com |
| B | spanakopita_bowl | themediterraneandish.com |
| B | thai_honey_garlic_salmon | halfbakedharvest.com |
| B | chicken_tikka_masala | ambitiouskitchen.com |
| B | tandoori_salmon | indianhealthyrecipes.com |
| B | dal_tadka | ambitiouskitchen.com |
| B | italian_baked_salmon | recipetineats.com |
| B | spanish_baked_salmon | spainonafork.com |
| B | garbanzos_con_espinacas | spainonafork.com |
| C | bok_choy_tofu_stir_fry | minimalistbaker.com |
| C | spinach_chickpea_pasta | cookieandkate.com |
| C | spanish_lentil_stew | spainonafork.com |

### Replacement Recipe URLs (to be assigned ranks after review)
These will be confirmed and cleaned by the user before Phase 1 begins. All URLs present in the cleaned Recipes.xlsx are considered valid entry candidates.

---

## Phases

---

### Phase 0 — Preparation (Human Only)
**No code or file changes.**

#### Steps
1. Open `Recipes.xlsx` and delete every row whose URL is known bad, mismatched, or is not a full recipe (e.g., the sesame-ginger dressing entry).
2. For replacement recipe rows, confirm the URL actually loads a recipe page with a visible ingredient list.
3. For each replacement recipe row, assign a provisional rank (A/B/C) based on your interest level and how frequently you want to see it.
4. Save the cleaned file. The final file is the authoritative input for Phase 1 — every URL remaining will be fetched.

#### Human Intervention
- All of this phase is human-driven.

#### Testing / Exit Criteria
- Every URL remaining in the file opens a valid recipe page with an ingredient list visible on the page.
- No dressing, sauce, or non-meal URLs remain.
- Every row has a rank.

---

### Phase 1 — Ingredient Fetch & Standardization (Claude + Human)
**No code changes to the app. Working only in a staging area / notes.**

This phase processes each recipe URL one at a time — KEEP recipes first, then replacements. For each recipe:

#### Steps per Recipe
1. **Fetch the source URL.** Extract:
   - Recipe name (as written on the page)
   - Full ingredient list with quantities exactly as written
   - Note the stated yield/serving count (for reference only — not stored)
2. **Standardize quantities to grams.** Convert all volumetric and count-based measurements:
   - Weight-based units (lb, oz, g) → convert directly to grams
   - Volume-based units (cup, tbsp, tsp) → use standard density conversions per ingredient
   - Count-based with known weight (e.g., "1 large egg ≈ 50g", "1 clove garlic ≈ 5g") → apply standard reference weights
3. **Flag ambiguous quantities.** Any ingredient where the gram equivalent cannot be reliably determined gets a `flagged: true` marker and is presented to the human for resolution before proceeding. Examples:
   - "1 bunch asparagus" (bunches vary 200–400g)
   - "handful of spinach"
   - "to taste" (omit from macro calculation; note the omission)
   - "1 can coconut milk" without a stated size
4. **Human reviews all flagged items** and provides a gram value or confirms a standard assumption.
5. Once all quantities are resolved, the ingredient list is considered locked for this recipe.

#### Human Intervention Points
- Review all flagged ingredient quantities before the recipe proceeds to Phase 2.
- Spot-check a sample of the fetched ingredient lists against the source page to confirm accuracy.
- If a fetch fails (site blocks, dynamic content): decide whether to manually transcribe the ingredient list or replace the URL.
- If the fetched recipe name differs significantly from the recipe ID (e.g., `moroccan_chicken` fetches as a Greek sheet-pan chicken): confirm the new name and flag that the recipe ID may need updating.

#### Testing / Exit Criteria
- Every recipe in the catalog has a complete ingredient list with all quantities in grams.
- No `flagged` markers remain unresolved.
- A spot-check of at least 5 recipes confirms the fetched data matches the source page.

---

### Phase 2 — USDA Macro Calculation (Claude + Human)
**No code changes to the app. Working only in a staging area / notes.**

This phase uses the locked ingredient lists from Phase 1 to calculate total batch macros for each recipe.

#### Steps per Recipe
1. For each ingredient in `_ingredients`, query the USDA FoodData Central API using the ingredient name.
2. Select the most appropriate USDA food match (Foundation Foods or SR Legacy preferred over branded items).
3. Calculate nutrient contribution: `(grams / 100) × USDA_value_per_100g` for each of: calories, protein, carbs, fat, sodium.
4. Sum contributions across all ingredients → total batch macros.
5. **Flag for human review** if:
   - No USDA match is found for an ingredient
   - Multiple plausible USDA matches exist with significantly different macro profiles
   - A computed total looks implausible (e.g., a chicken dish computing under 20g total protein)
6. Human resolves flagged items (picks the correct USDA match or provides a manual value).
7. Once all macros are confirmed, `_totalMacros` is considered locked for this recipe.

#### Human Intervention Points
- Review all flagged USDA match ambiguities.
- Where a recipe has published macros from a high-reliability source (noted in Recipes.xlsx as HIGH reliability), cross-check computed values against published values. Significant divergence (>15%) should be investigated — either the USDA match is wrong or the source macros were per a different serving count.
- Spot-check at least one recipe per source website against published nutrition if available.

#### Testing / Exit Criteria
- Every recipe has a complete `_totalMacros` object with no `flagged` markers.
- Cross-check spot-checks show no unexplained major divergences.
- All computed per-serving estimates (totalMacros ÷ expected number of divisions) are in a realistic range (roughly 350–900 cal per serving for dinner-sized portions).

---

### Phase 3 — Rewrite data-recipes.js (Claude)
**First code change to the app.**

#### Steps
1. Create the new `data-recipes.js` from scratch using the locked data from Phases 1 and 2.
2. Write each recipe using the new schema (see Data Schema section above).
3. Apply Object.freeze() to `_ingredients` and `_totalMacros` on each recipe object at the bottom of the file to enforce immutability at runtime.
4. Add `lastUsedWeek: null` to each recipe (updated at runtime by the engine).
5. Remove all old fields that no longer apply: `cuisineId`, `servings`, `mealTypes`, `protStr`, `brief_instructions`, `desc` (brief instructions are now on the source page; the URL is the reference).
6. Update `data-ingredients.js` with any new ingredient IDs introduced by replacement recipes.

#### Human Intervention Points
- Review the completed file for any recipe where the name, rank, or ID looks wrong.
- Confirm recipe IDs for any KEEP recipes whose fetched name differed from the old ID (e.g., `moroccan_chicken` → `greek_sheet_pan_chicken`).

#### Testing / Exit Criteria
- The file loads without JavaScript errors.
- All `_ingredients` and `_totalMacros` objects are frozen (verify with `Object.isFrozen()`).
- Recipe count matches expected total.
- Every `source_url` is a valid, loadable URL.
- Every recipe ID referenced in `lastUsedWeek` tracking is present in the catalog.

---

### Phase 4 — Remove data-cuisines.js and Clean References (Claude)

#### Steps
1. Delete `js/data-cuisines.js`.
2. Remove all references to `CUISINE_CATALOG`, `CUISINE_ROTATION`, `cuisineId`, `cuisineName`, and `colorClass` from:
   - `js/engine.js`
   - `js/meal-planner.js`
   - `js/calendar.js`
   - `js/sauces.js`
3. Remove backward-compatibility aliases (`asian`, `mediterranean`) that existed in `data-cuisines.js`.
4. Stub out or remove any functions that depended entirely on the cuisine model (e.g., `getStaplesForCuisine`, `renderRecipeSelector(cuisineId)`).

#### Human Intervention Points
- None expected, but review the diff before testing to confirm nothing unrelated was removed.

#### Testing / Exit Criteria
- App loads without console errors.
- No references to `CUISINE_CATALOG` or `cuisineId` remain in any `.js` file (grep check).
- Any stubs introduced in this phase are clearly marked `// TODO: Phase 5` so they are not forgotten.

---

### Phase 5 — Rewrite engine.js Selection Algorithm (Claude)

This is the core algorithmic phase. The meal planning engine is rewritten to support the new model.

#### Steps

**5a — User Settings**
Add two user-configurable values to the settings schema:
- `dailyCalorieTarget` (default: 2100)
- `dailyBaselineCalories` (default: 800)

Derived at runtime:
```
weeklyTarget = (dailyCalorieTarget - dailyBaselineCalories) × 5
targetServingCalories = (dailyCalorieTarget - dailyBaselineCalories) / 2
```

**5b — Cooldown Tracking**
Each recipe has `lastUsedWeek`. The engine tracks `currentWeek` (an incrementing integer).

Cooldown thresholds:
```
Rank A: eligible if (currentWeek - lastUsedWeek) >= 2
Rank B: eligible if (currentWeek - lastUsedWeek) >= 4
Rank C: eligible if (currentWeek - lastUsedWeek) >= 10
null lastUsedWeek: always eligible
```

**5c — Recipe Selection Loop**

The loop must satisfy two independent exit conditions simultaneously:
- `totalBatchCalories >= weeklyTarget`
- `selectedRecipes.length >= MINIMUM_RECIPES` (hardcoded: 3)

The minimum of 3 recipes is required to keep each recipe's serving count ≤ 5 days, which guarantees the no-same-day constraint in 5e is always satisfiable. It also prevents a 2-recipe overshoot from producing a bloated grocery haul.

Pinned recipes (user-locked from a previous plan) are pre-loaded into `selectedRecipes` before the loop starts and their calories are pre-added to `totalBatchCalories`. The loop fills only the remaining slots.

```
MINIMUM_RECIPES = 3

eligibleRecipes = all recipes where cooldown threshold is met,
                  excluding already-selected and pinned recipes
selectedRecipes = [...pinnedRecipes]
totalBatchCalories = sum of pinned recipe calories

while selectedRecipes.length < MINIMUM_RECIPES
   OR totalBatchCalories < weeklyTarget:

  // Score all candidates by ingredient overlap with current selected set
  for each candidate in eligibleRecipes:
    candidate.overlapScore = count of ingredient IDs shared with
                             any recipe in selectedRecipes

  // MODE A: calorie target already met, still need recipes to reach minimum.
  // Prefer the smallest-calorie candidate to minimise additional overshoot.
  // Use overlapScore as secondary sort, lastUsedWeek as tertiary.
  if totalBatchCalories >= weeklyTarget:
    sort eligible by (calories ASC, overlapScore DESC, lastUsedWeek ASC)

  // MODE B: calorie target not yet met. Check for disproportionate overshoot
  // before committing to the top-overlap candidate.
  else:
    remaining = weeklyTarget - totalBatchCalories
    topCandidate = eligible sorted by (overlapScore DESC, rank priority,
                                       lastUsedWeek ASC)[0]

    if topCandidate.calories > remaining * 2:
      // Top candidate would more than double the remaining deficit.
      // Look for a closer-fitting candidate with at least half the
      // overlap score of the top candidate.
      threshold = topCandidate.overlapScore / 2
      betterFit = eligible where overlapScore >= threshold,
                  sorted by |calories - remaining| ASC
      if betterFit exists: use betterFit as next
      else: use topCandidate (no better option; accept the overshoot)
    else:
      use topCandidate as next

  // If selectedRecipes is currently empty (no pinned recipes),
  // the first pick is the anchor: highest-rank eligible recipe,
  // lastUsedWeek as tiebreaker. Overlap score is 0 for all at this point.
  if selectedRecipes is empty:
    next = highest-rank eligible; lastUsedWeek as tiebreaker

  add next to selectedRecipes
  remove next from eligibleRecipes
  totalBatchCalories += next._totalMacros.calories
```

**5d — Serving Division**
For each selected recipe, find N (number of weekday portions):
```
targetServingCalories = (dailyCalorieTarget - dailyBaselineCalories) / 2

N = round(recipe._totalMacros.calories / targetServingCalories)
N = max(N, 1)                 // always at least 1 serving
N = min(N, 5)                 // hard cap: no recipe gets more than 5 weekday
                               // servings (one per day), which guarantees
                               // the no-same-day constraint is satisfiable

servingCalories = recipe._totalMacros.calories / N
if servingCalories < 400:
  N = N - 1                   // bump down if serving too small; min floor = 1
  // if N hits 1 and serving is still < 400 cal, the recipe itself is
  // under 400 calories total — flag this as a data issue; should not
  // occur with full-batch totals for real dinner-sized recipes

recipe.weeklyServings = N
// Any portion of the full batch beyond N weekday servings is
// automatically overflow (weekend shelf)
```

**5e — Daily Assignment**
Assign the `weeklyServings` of each recipe across the 5-day week (10 total weekday slots, 2 per day — lunch and dinner):
- No recipe appears in both the lunch and dinner slot on the same day
- Servings are distributed as evenly across days as the counts allow
- Because each recipe is capped at 5 servings (5d), and there are at least 3 recipes (5c), no recipe needs to occupy more than one slot per day — the constraint is always satisfiable
- Overflow servings (those beyond weekday slots) are collected into the weekend shelf list: `{ recipeId, count, calsEach }`

**5f — Update Cooldowns**
After a week's plan is confirmed, set `lastUsedWeek = currentWeek` for each selected recipe.

**5g — Validation**
Update the engine's integrity check to validate the new schema instead of the old cuisine schema.

#### Human Intervention Points
- Review the first 2–3 algorithmically generated weekly plans and confirm the selections make sense (right rank weighting, reasonable ingredient overlap, sensible serving division).
- Tune cooldown thresholds if the rotation feels too repetitive or too sparse.
- Tune serving size minimums if 400 cal feels wrong after seeing real meal sizes.

#### Testing / Exit Criteria
- Engine generates a valid weekly plan without errors.
- Selected recipes are always from the eligible pool (cooldown test: manually set `lastUsedWeek` to a recent week and verify excluded from selection).
- Every generated plan contains exactly 3 or more recipes (minimum enforced).
- No single recipe is assigned more than 5 weekday servings (cap enforced).
- Every individual serving is ≥ 400 cal.
- Total weekday servings ≥ 10.
- No recipe appears in both the lunch and dinner slot on the same day.
- After plan confirmation, `lastUsedWeek` is updated on all selected recipes; regeneration does not update it.
- Overshoot guard test: seed a scenario where the calorie target is 200 cal from being met and the only eligible recipe is 3,000 cal. Verify the engine accepts it (no better option) but does not then loop again to add a 4th recipe.
- Pinning test: pre-pin 2 recipes and verify the loop adds exactly 1 more and does not replace the pinned recipes.
- Run 10 simulated consecutive weeks and verify all three rank tiers appear in expected proportions (A frequently, B occasionally, C rarely).

---

### Phase 6 — Rewrite Meal Planner UI (Claude)

#### Steps
1. Remove the cuisine tile grid view entirely.
2. Remove the per-cuisine recipe picker (the flow that was: pick cuisine → pick 3 dinners).
3. Build a new **Recipe Card Set** view showing the selected recipes for the week:
   - One card per selected recipe showing: name, total batch calories, serving count (N), and calories per serving
   - A **Pin button** on each card. Pinned cards display a visual locked state and are excluded from the next regeneration's selection pool — only their unoccupied calorie deficit and remaining minimum-recipe slots are recalculated
   - A **Swap button** on each card (functionally equivalent to pinning all other cards and triggering a single-slot regenerate)
   - Shared ingredient count between the week's recipes (e.g., "8 shared ingredients across this week")
4. Build a **5-Day Grid** view beneath the card set:
   - 5 columns (Mon–Fri), 2 rows (Lunch / Dinner)
   - Each cell shows the recipe assigned to that slot
   - No cell in the same column contains the same recipe
5. Build a **Weekend Shelf / Overflow panel** alongside or below the grid:
   - Lists any servings beyond the 10 weekday slots
   - Format: "[Recipe Name] — N extra serving(s) · ~X cal each"
   - Framed positively as "weekend meals / extras" not as error or waste
6. Add UI for the two new user settings (daily calorie target, daily baseline calories) in the Settings tab.
7. Add a **Regenerate Week** button:
   - Reruns the selection loop respecting pinned recipes and current cooldowns
   - Unpinned selected recipes are returned to the eligible pool for the reroll
   - Cooldowns are NOT updated on regeneration — only on plan confirmation
8. Add a **Confirm Plan** button:
   - Locks the week's selection
   - Updates `lastUsedWeek` on all selected recipes
   - Moves the app to the shopping list view
9. Update the **Shopping List** view to aggregate and sum ingredient quantities across all selected recipes for the week.
10. Add optional **Pantry List** UI in settings: user marks ingredients they always keep stocked; these are hidden from the shopping list output (they still count toward overlap scoring).

#### Human Intervention Points
- Review the UI after initial build — specifically the card set layout, the grid layout, and the overflow shelf — and give feedback on information density before polish begins.
- Confirm the Regenerate / Pin / Swap flow feels intuitive after a live test.

#### Testing / Exit Criteria
- Weekly plan view renders correctly for a generated plan.
- Pinning a recipe and regenerating produces a new plan that preserves the pinned recipe and recalculates the rest.
- Swap replaces only the target recipe and leaves others unchanged.
- Daily grid shows correct meal assignments; no column contains the same recipe twice.
- Overflow shelf shows correct counts and calorie estimates for any servings beyond 10.
- Shopping list correctly aggregates and sums all ingredients across the week's recipes.
- Pantry list suppression correctly hides stocked items from shopping output.
- Calorie target and baseline settings persist across sessions.
- Confirming a plan updates `lastUsedWeek` on selected recipes; regenerating does not.

---

### Phase 7 — Cleanup & Final Validation (Claude + Human)

#### Steps
1. Remove all dead code left over from the cuisine system (any remaining stubs from Phase 4).
2. Remove `sauces.js` cuisine-tied entries or decouple them from the cuisine model.
3. Run the engine integrity validator and confirm zero errors.
4. Do a full grep for any remaining references to deleted concepts: `cuisine`, `CUISINE_CATALOG`, `cuisineId`, `mealCycleIds`, `colorClass`.
5. Update any in-app documentation or help text that references "cuisine weeks."

#### Human Intervention Points
- Final sign-off review of the full app experience end-to-end.
- Confirm the first real week's plan looks correct, sensible, and appealing before declaring the refactor complete.

#### Testing / Exit Criteria
- Zero console errors on app load.
- Zero references to deleted cuisine concepts in any `.js` file.
- Engine integrity validator passes cleanly.
- A complete end-to-end flow works: app loads → weekly plan generated → shopping list produced → daily assignments shown → plan confirmed → cooldowns updated → next week's plan generated correctly.

---

## Reference: Ingredient Quantity Conversion Standards

Standard reference weights to use when converting non-weight quantities during Phase 1:

| Unit / Description | Grams |
|---|---|
| 1 tbsp liquid (water-density) | 15g |
| 1 tbsp oil | 14g |
| 1 tsp | 5g |
| 1 cup cooked rice | 186g |
| 1 cup dry rice | 185g |
| 1 cup all-purpose flour | 120g |
| 1 cup coconut milk (canned) | 240g |
| 1 can coconut milk (13.5 oz) | 383g |
| 1 can diced tomatoes (14.5 oz) | 411g |
| 1 large egg | 50g |
| 1 clove garlic | 5g |
| 1 bunch asparagus | 340g (flag if context unclear) |
| 1 bunch spinach / kale | 280g (flag if context unclear) |
| 1 medium onion | 110g |
| 1 large onion | 150g |
| 1 medium bell pepper | 120g |
| 1 lemon (juice) | 30g juice |
| 1 lime (juice) | 25g juice |
| 1 lb | 454g |
| 1 oz | 28g |

Any quantity not covered by this table should be flagged for human confirmation.

---

## Reference: Rank Definitions

| Rank | Meaning | Target Frequency | Cooldown |
|---|---|---|---|
| A | Staple — a recipe you are happy to eat most weeks | Every 2–3 weeks | 2 weeks |
| B | Rotation — a recipe you enjoy but want less often | Every 5–6 weeks | 4 weeks |
| C | Occasional — infrequent, may be replaced if a better recipe is found | Every 10–12 weeks | 10 weeks |

Ranks can be changed at any time in `data-recipes.js` without re-deriving any locked data.

---

## Reference: Key Constraints Summary

| Constraint | Value | Configurable? |
|---|---|---|
| Daily calorie target | 2100 (default) | Yes — user setting |
| Daily baseline calories | 800 (default) | Yes — user setting |
| Minimum serving size | 400 cal | No — hardcoded floor |
| Target weekday servings | 10 (2/day × 5 days) | No |
| Same recipe twice in one day | Not allowed | No |
| Rank A cooldown | 2 weeks | Tunable in engine |
| Rank B cooldown | 4 weeks | Tunable in engine |
| Rank C cooldown | 10 weeks | Tunable in engine |
