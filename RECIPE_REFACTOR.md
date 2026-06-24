# Recipe System — Reference & Status

---

## Current Status — as of 2026-06-24

| Phase | Description | Status |
|---|---|---|
| Phase 0 | Preparation — clean recipe list, assign ranks | ✅ Complete |
| Phase 1 | Ingredient data — Umami exports | ✅ Complete (via sync tool) |
| Phase 2 | Macro data — Cronometer exports | ✅ Complete (via sync tool) |
| Phase 3 | Rebuild `data-recipes.js` | ✅ Complete (via sync tool) |
| Phase 4 | Remove cuisine system | ✅ Complete |
| Phase 5a | User settings (calorie targets) | ✅ Complete |
| Phase 5b–5g | Engine rewrite (selection, serving division, cooldowns) | ✅ Complete |
| Phase 6 | Meal Planner UI rewrite | 🔲 Not started |
| Phase 7 | Cleanup & final validation | 🔲 Not started |

---

## How the Recipe System Works

### The Two-Tool Workflow

All recipe and macro data flows from two external apps into the codebase via `tools/recipe-sync.js`. No manual gram calculations, no USDA API calls at build time.

```
Umami (recipe manager)         → .txt exports  → tools/exports/umami/
Cronometer (nutrition tracker) → .csv export   → tools/exports/cronometer/
                                                        ↓
                                               node tools/recipe-sync.js
                                                        ↓
                               js/data-recipes.js   (full replace)
                               js/data-ingredients.js (full replace)
```

**Umami** is the source of truth for recipe names, ingredients, servings, rank, and source URL. Each recipe is saved as a full recipe entry in Umami. The script reads the exported `.txt` files.

**Cronometer** is the source of truth for macros. Each recipe is logged in the Cronometer diary as exactly `1.00 full recipe`. The script reads the exported `.csv` file and matches rows to Umami recipes by name.

---

## Recipe Data Schema

This is the actual schema written by `recipe-sync.js`. There are no gram weights — quantities are stored as human-readable strings exactly as written in the source recipe.

```js
'recipe_slug': {
  name:     'Recipe Display Name',        // from Umami
  servings: 4,                            // from Umami (for reference only)
  rank:     'A',                          // from Umami Notes: "Rank: A"
  source:   'https://...',               // from Umami Notes: "Source: https://..."

  _ingredients: [
    { id: 'chicken thighs, bone-in', qty: '2 lbs'  },
    { id: 'coconut milk',            qty: '1 can'   },
    { id: 'garlic',                  qty: '4 cloves' },
    // ... all ingredients as-written in Umami
  ],

  _totalMacros: {
    calories:  2450,   // full-batch totals from Cronometer — locked
    proteinG:  148,
    fatG:      112,
    carbsG:     96,
    sodiumMg: 2100,
  },
}
```

**Key schema decisions:**
- `_ingredients[].id` is the ingredient name as written in Umami, lowercased. This feeds ingredient overlap scoring and shopping list display.
- `_ingredients[].qty` is the human-readable quantity from Umami (e.g., `'1½ lbs'`, `'3 tbsp'`). This is what the shopping list shows.
- `_totalMacros` represents the **entire recipe batch**, not one serving. Serving division is computed at runtime by the engine.
- The recipe slug (object key) is auto-generated from the recipe name: lowercase, spaces → underscores, non-alphanumeric stripped. Slugs that start with a digit are always **quoted** in the output file (e.g., `'20minute_tofu_stirfry'`) to avoid a browser syntax error.
- There is no `id` field on the recipe object itself. Recipe identity is the object key.
- There is no `lastUsedWeek` on the recipe object. Cooldown state lives in `localStorage` under `rowing_cooldowns_v2`, keyed by recipe slug.

---

## Adding or Updating a Recipe

### Step 1 — Save the recipe in Umami

Add the recipe to Umami as a normal entry. In the **Notes** section, add these two lines at the very top:

```
Rank: A
Source: https://your-recipe-url.com/recipe-name
```

Valid ranks: `A`, `B`, or `C` (see Rank Definitions below). The source URL is stored as metadata in `data-recipes.js`.

### Step 2 — Log the recipe in Cronometer

Open Cronometer → Diary → Add Food. Search for the recipe by its exact Umami name. If it doesn't exist as a custom food yet, create it by logging all ingredients.

Log **exactly `1.00 full recipe`** — the Amount field must contain the text "full recipe" for the sync script to pick it up.

Export the diary as a CSV: Settings → Export Data → CSV (daily nutrient export, not the food export). Drop the file in `tools/exports/cronometer/`.

### Step 3 — Export from Umami

Export the recipe as a `.txt` file from Umami. Drop it in `tools/exports/umami/`.

Rename duplicate files with numeric suffixes if needed (e.g. `recipe_name (1).txt`) — the script reads all `.txt` files in the folder.

### Step 4 — Run the sync

```bash
node tools/recipe-sync.js
```

The script will:
- Read all `.txt` files from `tools/exports/umami/`
- Read all `.csv` files from `tools/exports/cronometer/`
- Match each Umami recipe to a Cronometer row by name
- Warn (but not fail) if no Cronometer match is found — recipe will be written with zero macros
- Completely replace the contents of `js/data-recipes.js` and `js/data-ingredients.js`
- Print a summary of what was written

### Step 5 — Bump and deploy

Increment `CACHE_NAME` in `service-worker.js` before committing. Without this, browsers serve the old cached files and won't see the updated catalog.

```js
const CACHE_NAME = 'rowing-v32';  // increment from current
```

Commit `js/data-recipes.js`, `js/data-ingredients.js`, and `service-worker.js` together.

---

## Removing a Recipe

Delete the recipe from Umami (or move it out of the exports folder) and re-run the sync. The sync does a full replace, so the recipe will simply not appear in the new output.

Stored cooldowns in `localStorage` for the removed recipe are harmless — they reference a key that no longer exists in the catalog and are silently ignored by the engine.

---

## Cronometer Name-Matching

The sync script matches Cronometer rows to Umami recipes using a three-tier fuzzy match:

1. Exact string match
2. Case-insensitive match
3. Normalized match (lowercase, strip non-alphanumeric, collapse spaces)

If no match is found, the recipe is written with `_totalMacros: { calories: 0, ... }` and a `// TODO` comment. The script prints a warning and lists all Cronometer names to help diagnose the mismatch.

**Common causes of match failure:**
- Trailing punctuation or special characters in the Cronometer food name
- A space/hyphen difference (`Tikka Masala` vs `Tikka-Masala`)
- The Cronometer food was logged under a different name than the Umami recipe title

Fix: rename the Cronometer custom food to exactly match the Umami recipe name, re-export, and re-run sync.

---

## Recipe Selection Engine

### Eligibility (Rank + Cooldown)

Each recipe has a rank that sets how long it must rest between appearances:

| Rank | Cooldown | Target frequency |
|---|---|---|
| A | 2 weeks | Weekly staples — high protein, quick, reliable |
| B | 4 weeks | Good rotation recipes, seen monthly |
| C | 10 weeks | Occasional variety, niche ingredients |

A recipe on cooldown is never selected regardless of ingredient overlap. Cooldowns are stored in `localStorage`, set when the user confirms a week plan, and read by the engine on each generation.

### Selection (Ingredient Overlap)

Among eligible recipes, selection is driven by raw ingredient overlap with the already-selected set. The first pick is the highest-rank eligible recipe (randomized within the tier for variety). Each subsequent pick maximizes the count of ingredient IDs shared with the current selected set — this surfaces real shopping and prep efficiency.

### Calorie Targeting

The user sets:
- `dailyCalorieTarget` — total daily calories (default: 2100)
- `dailyBaselineCalories` — calories already covered by breakfast, shakes, snacks (default: 800)

The engine selects recipes until:
- Total full-batch calories ≥ `(dailyCalorieTarget − dailyBaselineCalories) × 5`
- At least 3 recipes are selected (minimum for daily variety)

### Serving Division

Each recipe's full batch is divided into N weekday portions:

```
targetServingCalories = (dailyCalorieTarget − dailyBaselineCalories) / 2
N = round(batch.calories / targetServingCalories)
N = clamp(N, 1, 5)
if (batch.calories / N < 400): N = max(N − 1, 1)
```

N is stored on the week plan object in `localStorage` as `weekPlan.servingCounts[recipeSlug]`. Recipe objects are never mutated at runtime.

---

## Implementation Notes

### What Changed from the Original Plan

The original RECIPE_REFACTOR.md described a USDA FoodData Central API workflow for computing macros: fetch each ingredient by name, look up USDA nutrient values per 100g, multiply by grams, sum. This approach was replaced before implementation with the Cronometer workflow:

- **Cronometer is more accurate** — it uses the same food database as a real nutrition tracker and handles branded/packaged items the USDA API doesn't cover well.
- **No gram standardization needed** — ingredient quantities are stored as human-readable strings from Umami instead of grams. This is sufficient for shopping lists and has no effect on the macro computation (Cronometer handles that internally).
- **Easier to update** — re-logging a tweaked recipe in Cronometer and re-running the sync is faster than manually recalculating macros.

### Dual Plan ID System (Phase 6 attention)

Old `meal-planner.js` stores plans with date-based IDs (`wp_YYYY-MM-DD`). `MealEngine.generateWeekPlan()` stores plans with index-based IDs (`week_plan_N`). Both coexist in `localStorage` under `rowing_week_plans_v2`.

- `mpLoadWeekPlanForDate()` finds plans by date-based ID → finds old plans only
- `MealEngine.getStoredWeekPlanForDate()` finds plans by week index → finds new plans only
- `getMealsForDate()` uses the new system; the Plan tab calendar shows new plan meals correctly
- `mpEnrichMeals()` uses the old system; no-ops silently on new plans (new recipes have no `mealTypes` field)

**Phase 6 action:** Rewrite `renderMealPlannerHome()` to read new-schema plans. Deprecate the date-keyed plan lookup path.

### Legacy Rendering Code (Phase 6 will replace)

| Function | Old fields used | Behavior with new schema |
|---|---|---|
| `renderMealPlannerHome()` | `r.protStr`, `r.servings`, `r.isVeg`, `plan.portionScales` | Degraded output — PROTEIN label and missing meta |
| `_renderMacroSummary()` | `r.calories`, `r.proteinG` (flat fields) | Returns empty string |
| `_renderPrepTimeline()` | `r.brief_instructions`, `r.prepMins`, `r.cookMins` | Fallback text; generic descriptions |

### Shopping List: Multi-Recipe Ingredients

`ShoppingListEngine.buildList()` aggregates by ingredient ID across all selected recipes:
- Ingredient used in **one recipe only**: shows `ing.qty` (e.g., `'4 × 6 oz fillets'`)
- Ingredient used in **multiple recipes**: sums the raw qty strings if numeric, else lists them separately

The gram-based aggregation from the original spec was dropped when gram weights were removed from the schema. Phase 6 should improve multi-recipe display with smarter quantity merging.

### Vestigial Fields (Phase 7)

- **`mealCycleIds` in training plans** — retained for `mealWeekIndex` math in `getWeekContext()`. Can be removed in Phase 7 once `getWeekContext()` is updated or dropped.
- **`mpEnrichMeals()` / `mpLoadWeekPlanForDate()`** — used only by `calendar.js` and `dashboard.js` for the old meal display. Remove after Phase 6 makes `getMealsForDate()` the sole source.

---

## Phase 6 — Meal Planner UI Rewrite

The Fuel tab (`meal-planner.js`) still uses old cuisine-era rendering code. Phase 6 replaces it with a new view built around the new plan schema.

#### What to build

1. **Recipe Card Set** — one card per selected recipe showing name, total batch calories, servings count N, calories per serving, a Pin button (locks the recipe into the next regeneration), and a Swap button (replaces only that recipe).
2. **5-Day Assignment Grid** — Mon–Fri columns, Lunch/Dinner rows. Each cell shows the assigned recipe. No recipe appears twice in the same column.
3. **Overflow shelf** — servings beyond the 10 weekday slots, shown as "X extra serving(s) · ~Y cal each" framed as weekend meals.
4. **Regenerate button** — reruns selection respecting pins and cooldowns. Does NOT update cooldowns.
5. **Confirm Plan button** — locks the selection, updates cooldowns in `localStorage`, moves to shopping list view.
6. **Shopping list** — ingredient aggregate across all selected recipes, with pantry-staple suppression.
7. **Settings** — expose `dailyCalorieTarget` and `dailyBaselineCalories` as editable fields in the Vitals/Settings tab.

#### Exit criteria

- Weekly plan view renders for a generated plan with no console errors
- Pin + Regenerate produces a plan that preserves the pinned recipe
- Daily grid shows correct assignments; no column contains the same recipe twice
- Overflow shelf shows correct counts
- Shopping list correctly aggregates all ingredients
- Confirming a plan updates cooldowns; regenerating does not
- Calorie target and baseline settings persist across sessions

---

## Phase 7 — Cleanup

1. Remove all dead cuisine-era code (stubs from Phase 4).
2. Grep and remove any remaining references to: `cuisine`, `CUISINE_CATALOG`, `cuisineId`, `mealCycleIds`, `colorClass`.
3. Remove `mpEnrichMeals()` and `mpLoadWeekPlanForDate()` after Phase 6.
4. Run `validateCatalogs()` in the browser console — zero errors required.
5. Final end-to-end test: app loads → plan generated → shopping list produced → daily assignments shown → plan confirmed → cooldowns updated → next week's plan generates correctly.

---

## Reference: Rank Definitions

| Rank | Meaning | Target frequency | Cooldown |
|---|---|---|---|
| A | Staple — happy to eat most weeks | Every 2–3 weeks | 2 weeks |
| B | Rotation — enjoy but want less often | Every 5–6 weeks | 4 weeks |
| C | Occasional — infrequent or niche | Every 10–12 weeks | 10 weeks |

Ranks can be changed in Umami at any time. The change takes effect on the next sync run.

---

## Reference: Key Constraints

| Constraint | Value | Configurable? |
|---|---|---|
| Daily calorie target | 2100 (default) | Yes — user setting |
| Daily baseline calories | 800 (default) | Yes — user setting |
| Minimum serving size | 400 cal | No — hardcoded floor |
| Minimum recipes per week | 3 | No — engine constant |
| Max weekday servings per recipe | 5 | No — hardcoded cap |
| Same recipe twice in one day | Not allowed | No |
| Rank A cooldown | 2 weeks | Tunable in engine constants |
| Rank B cooldown | 4 weeks | Tunable in engine constants |
| Rank C cooldown | 10 weeks | Tunable in engine constants |

---

## Reference: File Map

| File | Role |
|---|---|
| `tools/recipe-sync.js` | Build tool — reads Umami + Cronometer exports, writes data files |
| `tools/exports/umami/` | Drop Umami `.txt` exports here before running sync |
| `tools/exports/cronometer/` | Drop Cronometer `.csv` exports here before running sync |
| `js/data-recipes.js` | Generated by sync — do not hand-edit |
| `js/data-ingredients.js` | Generated by sync (ingredient section) — do not hand-edit |
| `js/engine.js` | `MealEngine` — selection, serving division, cooldown tracking |
| `js/meal-planner.js` | Fuel tab UI — pending Phase 6 rewrite |
| `js/calendar.js` | Plan tab — uses `getMealsForDate()` for meal display |
