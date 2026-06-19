# Adding New Recipes

This guide covers every step required to add a recipe to the meal planner catalog, from sourcing the recipe through to deployment.

---

## Overview of the data model

Two files hold all recipe and ingredient data:

| File | Purpose |
|------|---------|
| `js/data-ingredients.js` | Defines every ingredient by ID — name, category, pantry-staple flag |
| `js/data-recipes.js` | Defines every recipe — ingredients (gram weights), full-batch macros, rank |

The meal planner engine reads both files at runtime. Shopping lists, macro calculations, and ingredient overlap scoring all rely on every `_ingredients[].id` having a matching entry in `INGREDIENT_CATALOG`. Missing IDs are silently skipped.

---

## Step 1 — Choose the recipe and assign a rank

Pick a recipe with a public source URL. Assign a **rank** based on how often you want it to appear in rotation:

| Rank | Cooldown | Use for |
|------|----------|---------|
| A | 2 weeks | Go-to weekly staples — quick, reliable, high-protein |
| B | 4 weeks | Good recipes you want every month |
| C | 10 weeks | Occasional variety — more effort or niche ingredients |

---

## Step 2 — List all ingredients with gram weights

Open the source URL and record every ingredient. For each one you need:

- **A stable ID** — lowercase snake_case, e.g. `chicken_thigh_boneless_skinless`
- **Gram weight** — the exact amount used in the full batch
- **Human-readable qty** — what you'd write on a shopping list, e.g. `1½ lbs`

**Tips for gram weights:**

- Use the weight listed in the recipe if available (metric).
- For volume measures, use standard conversions:
  - 1 cup water/broth ≈ 240 g
  - 1 cup all-purpose flour ≈ 120 g
  - 1 tbsp oil ≈ 14 g
  - 1 tbsp soy sauce ≈ 16 g
  - 1 tsp salt ≈ 6 g
  - 1 tsp ground spice ≈ 2–3 g
- A kitchen scale during a test cook gives the most accurate numbers.
- Minor imprecision in spice weights (~1–2 g) has negligible macro impact.

---

## Step 3 — Add new ingredient IDs to `data-ingredients.js`

For every ingredient ID that does **not** already exist in `INGREDIENT_CATALOG`, add a new entry.

**Check for existing IDs first** — many common ingredients are already there. Search the file for your ingredient before creating a new ID. Prefer reusing an existing entry over creating a near-duplicate.

### Entry format

```js
your_ingredient_id: {
  id:             'your_ingredient_id',
  name:           'Display Name for Shopping List',
  category:       'protein',   // see categories below
  shelfLife:      'weekly-fresh',
  isPantryStaple: false,
},
```

### Categories

| Category | Examples |
|----------|---------|
| `protein` | Chicken, fish, tofu, eggs, canned beans, lentils |
| `produce` | Vegetables, fresh herbs, citrus, fresh ginger |
| `dairy` | Cheese, milk, cream, butter, yogurt |
| `grains` | Rice, pasta, quinoa, bread, oats, flour |
| `pantry` | Oils, canned tomatoes, broth, nuts, sugars, coconut milk |
| `condiment` | Soy sauce, curry paste, pesto, salsa, mayo, mustard |
| `spice` | Dried herbs, ground spices, salt, cornstarch, sesame seeds |
| `frozen` | Frozen corn, peas, broccoli, spinach |

### Shelf life

| Value | Meaning |
|-------|---------|
| `weekly-fresh` | Buy the week you cook — fresh produce, fresh herbs |
| `fridge-staple` | Lasts 1–3 weeks in the fridge — cheese, ginger, opened condiments |
| `pantry` | Months — dried goods, canned items, oils, spices |

### `isPantryStaple`

Set to `true` for items most people have on hand at all times (salt, olive oil, garlic, common spices). These are hidden by default on the shopping list — the user can tap **Show pantry** to reveal them, or use the **+ Add** button per item if they actually need it.

---

## Step 4 — Calculate `_totalMacros` using USDA FoodData Central

`_totalMacros` represents the **full-batch macro totals** for the recipe (all servings combined). These values are **locked** once set — never edit them after the recipe goes live.

### API details

- **Base URL:** `https://api.nal.usda.gov/fdc/v1/foods/search`
- **API key:** `sfbbmG9P60pUHcEdEJenbEOs3j5dqAeuu9TulPSk`
- **Rate limit:** 3,600 requests/hour
- **Preferred data types (in priority order):** Foundation → SR Legacy → Branded

### Lookup process (per ingredient)

1. Search for the ingredient by name:
   ```
   https://api.nal.usda.gov/fdc/v1/foods/search?query=chicken+thigh+raw&dataType=Foundation,SR%20Legacy&pageSize=5&api_key=sfbbmG9P60pUHcEdEJenbEOs3j5dqAeuu9TulPSk
   ```

2. From the results, pick the **Foundation** or **SR Legacy** entry that best matches the ingredient (prefer raw/uncooked for proteins and produce; prefer the most generic entry for spices and pantry items).

3. Nutrients are listed per 100 g. Scale to your gram weight:
   ```
   ingredient_calories = (nutrient_per_100g / 100) × grams
   ```

4. The nutrients to extract:
   - **Energy** → `calories` (kcal)
   - **Protein** → `proteinG` (g)
   - **Total lipid (fat)** → `fatG` (g)
   - **Carbohydrate, by difference** → `carbsG` (g)
   - **Sodium** → `sodiumMg` (mg)

5. Sum across all ingredients to get the full-batch totals.

### Example calculation for one ingredient

Chicken thighs, boneless skinless, raw — USDA SR Legacy:
- Energy: 177 kcal / 100 g
- Protein: 19.7 g / 100 g
- Fat: 10.5 g / 100 g
- Carbs: 0 g / 100 g
- Sodium: 82 mg / 100 g

For 680 g (1½ lbs):
```
calories = 177 / 100 × 680 = 1203.6 kcal
proteinG = 19.7 / 100 × 680 = 134.0 g
fatG     = 10.5 / 100 × 680 =  71.4 g
carbsG   =    0 / 100 × 680 =   0.0 g
sodiumMg =   82 / 100 × 680 = 557.6 mg
```

Repeat for every ingredient, sum the columns, round to one decimal place.

### Shortcut — use the USDA spreadsheet approach

1. Create a simple spreadsheet with columns: `ingredient`, `grams`, `kcal/100g`, `P/100g`, `F/100g`, `C/100g`, `Na/100g`
2. Add formula columns that multiply each nutrient by `grams/100`
3. Sum each nutrient column for the batch total
4. Round to one decimal place

---

## Step 5 — Add the recipe to `data-recipes.js`

Choose a unique camelCase or snake_case key for the recipe. Add a new entry to `RECIPE_CATALOG`:

```js
// R## — Your Recipe Name
// ----------------------------------------------------------------
your_recipe_key: {
  id:           'your_recipe_key',
  name:         'Your Recipe Display Name',
  rank:         'A',                    // A, B, or C — see Step 1
  source_url:   'https://...',          // canonical source URL
  lastUsedWeek: null,                   // always null in data file — runtime only
  _ingredients: [
    { id: 'chicken_thigh_boneless_skinless', grams: 680, qty: '1½ lbs'    },
    { id: 'jasmine_rice_dry',                grams: 185, qty: '1 cup dry'  },
    { id: 'olive_oil_extra_virgin',          grams:  40, qty: '3 tbsp'     },
    // ... all other ingredients
  ],
  _totalMacros: {
    calories:  2314,    // full batch — locked, never edit after going live
    proteinG:  155.3,
    fatG:      126.3,
    carbsG:    136.3,
    sodiumMg: 3268,
  },
},
```

**Rules:**
- `lastUsedWeek` must always be `null` in the data file. Cooldown state is stored separately in `localStorage` by the engine.
- `_totalMacros` values are **locked after first use** — they affect calorie targeting, serving division, and cooldown decisions. Changing them retroactively corrupts historical plans.
- Every `id` in `_ingredients` must exist in `INGREDIENT_CATALOG` (Step 3). Missing IDs are silently dropped from the shopping list.
- Include **all** ingredients — including spices and pantry staples. Pantry staples are hidden on the shopping list by default, but are needed for the ingredient overlap scoring that groups similar recipes together.

---

## Step 6 — Validate in the browser console

Open the app in a browser, open DevTools (F12) → Console, and run:

```js
validateCatalogs()
```

This checks:
- Every recipe has a valid `rank` (A/B/C)
- Every recipe has `_totalMacros.calories` as a number
- Every `_ingredients[].id` exists in `INGREDIENT_CATALOG`
- Every cooldown key in `localStorage` maps to a real recipe

Fix any warnings before proceeding. A recipe with invalid ingredient IDs will show an incomplete shopping list.

---

## Step 7 — Bump the service worker version

Open `service-worker.js` and increment `CACHE_NAME`:

```js
// Before
const CACHE_NAME = 'rowing-v26';

// After
const CACHE_NAME = 'rowing-v27';
```

This forces browsers to fetch the updated data files on next load. Without this bump, users may see the old recipe catalog from cache.

---

## Step 8 — Test end-to-end

1. Open the app → Fuel tab → **Plan This Week →** → **Generate Week ▶**
2. Verify the new recipe appears in the rotation (may take a few presses of **↺ Regenerate** depending on rank and cooldowns)
3. Tap the recipe name to open the recipe modal — verify ingredients display correctly
4. Tap **Confirm Plan ✓** — verify the shopping list shows all expected ingredients

---

## Quick checklist

```
[ ] Recipe has a source URL and all ingredients listed
[ ] All ingredient gram weights recorded
[ ] New ingredient IDs added to INGREDIENT_CATALOG in data-ingredients.js
[ ] _totalMacros calculated from USDA FoodData Central (full batch)
[ ] Recipe entry added to RECIPE_CATALOG in data-recipes.js
[ ] lastUsedWeek: null in data file
[ ] validateCatalogs() passes in browser console
[ ] service-worker.js CACHE_NAME incremented
[ ] Tested end-to-end in browser
```
