# Adding New Recipes

Recipes flow into the app through a two-tool pipeline: **Umami** (recipe manager) supplies ingredients and metadata; **Cronometer** (nutrition tracker) supplies full-batch macros. A build script merges the exports and regenerates the data files. No manual gram calculations, no API calls.

---

## Overview

Two generated files hold all recipe and ingredient data. Do not hand-edit them — they are overwritten on every sync run.

| File | Purpose |
|------|---------|
| `js/data-recipes.js` | Generated — full recipe catalog with ingredients and macros |
| `js/data-ingredients.js` | Generated — ingredient list used for shopping and overlap scoring |

Source files live here:

| Folder | What goes in it |
|--------|----------------|
| `tools/exports/umami/` | One `.txt` export per recipe from Umami |
| `tools/exports/cronometer/` | The Cronometer diary CSV export |

---

## Rank

Assign a rank before you start — it determines how often the recipe appears:

| Rank | Cooldown | Use for |
|------|----------|---------|
| A | 2 weeks | Go-to weekly staples — quick, reliable, high-protein |
| B | 4 weeks | Good recipes you want monthly |
| C | 10 weeks | Occasional variety — more effort or niche ingredients |

---

## Step 1 — Save the recipe in Umami

Add the recipe to Umami as a normal entry. In the **Notes** section, put these two lines at the very top:

```
Rank: A
Source: https://your-recipe-url.com
```

Enter all ingredients with their quantities exactly as you'd write them on a shopping list (`2 lbs`, `1 can`, `4 cloves`). Umami is the source of truth for ingredient names and quantities.

---

## Step 2 — Log the recipe in Cronometer

Open Cronometer → Diary → Add Food. Find or create the recipe as a custom food using the exact same name as in Umami.

Log it as **`1.00 full recipe`** — the Amount field must contain the text "full recipe" for the sync script to match it.

Export the diary as a CSV: Settings → Export Data → Servings CSV (the "servings" export, not the "daily nutrients" export). Drop the file in `tools/exports/cronometer/`.

---

## Step 3 — Export from Umami

Export the recipe as a `.txt` file from Umami. Drop it in `tools/exports/umami/`.

If you already have a file with the same name in the folder, rename the new one with a numeric suffix (e.g. `recipe_name (1).txt`). The script reads all `.txt` files in the folder.

---

## Step 4 — Run the sync

```bash
node tools/recipe-sync.js
```

The script:
- Reads all `.txt` files from `tools/exports/umami/`
- Reads all `.csv` files from `tools/exports/cronometer/`
- Matches each Umami recipe to a Cronometer row by name (three-tier fuzzy match)
- Warns if no Cronometer match is found — recipe will be written with zero macros and a `// TODO` comment
- Completely replaces `js/data-recipes.js` and `js/data-ingredients.js`
- Prints a summary of what was written

If a recipe shows zero macros, the name in Cronometer likely doesn't match Umami. Rename the Cronometer custom food to exactly match the Umami title, re-export, and re-run.

---

## Step 5 — Bump the service worker and deploy

Open `service-worker.js` and increment `CACHE_NAME`:

```js
const CACHE_NAME = 'rowing-v32';  // increment from current value
```

Without this, browsers serve the old cached `data-recipes.js` and won't see the new recipe.

Commit `js/data-recipes.js`, `js/data-ingredients.js`, and `service-worker.js` together.

---

## Removing a recipe

Delete the recipe from Umami (or move the `.txt` file out of `tools/exports/umami/`) and re-run the sync. The sync does a full replace, so the recipe will simply not appear in the new output. Stored cooldowns in `localStorage` for the removed recipe are harmless — they reference a key that no longer exists and are silently ignored.

---

## What the generated schema looks like

```js
'your_recipe_slug': {
  name:     'Your Recipe Display Name',  // from Umami
  servings: 4,                           // from Umami (for reference)
  rank:     'A',                         // from Umami Notes: "Rank: A"
  source:   'https://...',              // from Umami Notes: "Source: ..."

  _ingredients: [
    { id: 'chicken thighs, bone-in', qty: '2 lbs'   },
    { id: 'coconut milk',            qty: '1 can'    },
    { id: 'garlic',                  qty: '4 cloves' },
  ],

  _totalMacros: {
    calories:  2450,   // full-batch totals from Cronometer
    proteinG:  148,
    fatG:      112,
    carbsG:    96,
    sodiumMg: 2100,
  },
}
```

Key schema notes:
- `_ingredients[].id` is the ingredient name from Umami, lowercased. This is used for shopping list display and ingredient overlap scoring.
- `_ingredients[].qty` is the human-readable quantity string from Umami (e.g., `'1½ lbs'`).
- `_totalMacros` is the **entire batch**, not one serving. The engine divides by serving count at runtime.
- The recipe slug (object key) is auto-generated from the name. Slugs that start with a digit are always quoted in the output (e.g., `'20minute_tofu_stirfry'`) — this is handled automatically by the sync script.
- There is no `id` field on the recipe object. Recipe identity is the object key.

---

## Quick checklist

```
[ ] Recipe saved in Umami with Rank and Source in Notes
[ ] Recipe logged in Cronometer as "1.00 full recipe"
[ ] Cronometer diary exported as servings CSV → tools/exports/cronometer/
[ ] Umami recipe exported as .txt → tools/exports/umami/
[ ] node tools/recipe-sync.js — no zero-macro warnings
[ ] service-worker.js CACHE_NAME incremented
[ ] js/data-recipes.js + js/data-ingredients.js + service-worker.js committed together
```
