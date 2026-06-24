# V2 Refactor Roadmap

Six phases. Each phase ends with a fully working app. Stop between any two phases safely.

---

## Status

| Phase | Name | Type | User-visible | Status |
|---|---|---|---|---|
| 1 | Storage Layer | Infrastructure | No | ✅ Complete |
| 2 | Static Data Restructure | Infrastructure | No | ✅ Complete |
| 3 | Engine Layer | Infrastructure | No | ✅ Complete |
| 4 | Today Screen | UI Redesign | **Yes** | ✅ Complete |
| 5 | Meal Planning V2 | Feature | **Yes** | 🔄 In progress (engine complete, UI pending) |
| 6 | Training Plan V2 | Feature | **Yes** | ⬜ Not started |

---

## Phase 1 — Storage Layer

**Goal:** All localStorage access flows through a single module. V1 logs migrate to a unified V2 format.

### Files

| File | Action |
|---|---|
| `js/storage.js` | **Create** |
| `js/log.js` | Modify — replace direct localStorage calls with storage.js |
| `js/dashboard.js` | Modify — `loadWeights`/`saveWeights` → storage.js |
| `js/settings.js` | Modify — replace direct localStorage calls with storage.js |
| `js/app.js` | Modify — call `storage.migrate()` first in init sequence |
| `index.html` | Modify — add storage.js as first script tag |

### Active API scope

Only two pairs are active in Phase 1. The rest are stubbed — do not call them from existing code until the relevant phase lands.

| API pair | Active in |
|---|---|
| `readLogs` / `writeLogs` | Phase 1 ✅ |
| `readSettings` / `writeSettings` | Phase 1 ✅ |
| `readWeekPlans` / `writeWeekPlans` | Phase 5 |
| `readShoppingLists` / `writeShoppingLists` | Phase 5 |
| `readCustomWorkouts` / `writeCustomWorkouts` | Phase 6 |
| `readCustomRecipes` / `writeCustomRecipes` | Phase 5 |

Also exposed: `storage.LOG_TYPES`, `storage.isValidLogEntry(entry)`, `storage.migrate()`

### `_logType` naming decision

The domain discriminator field is `_logType` (not `type`). This is intentional: erg entries already carry `type: 'endurance'|'speed'|...` for their session classification, and renaming that field in Phase 1 would require touching all render logic in `log.js`.

**Plan:** Phase 3 (engine refactor) normalizes this — `_logType` → `type`, erg session type → `ergType`. The engine layer will be the canonical consumer of both fields, so the rename happens once when the render code is already being replaced.

Until Phase 3 lands, `_logType` is the source of truth. Don't add code that reads both `type` and `_logType` as an alias.

### Migration internals

Three distinct responsibilities:

| Function | Responsibility |
|---|---|
| `_migrateLogsV1toV2()` | Read V1 keys, tag with `_logType`, write V2, remove V1 |
| `_migrateSettingsV1toV2()` | Copy settings V1 → V2, add `settingsVersion: 2`, remove V1 |
| `_verifyMigrationIntegrity(merged, expected)` | Count check + per-entry shape validation |

`migrate()` is the single entrypoint that calls all three. Each sub-function is independently idempotent.

### V2 Log Entry Schema (as stored)

```json
{
  "_logType": "lift | erg | weight",
  "id": 1234567890,
  "date": "2026-07-08",

  // lift-only fields
  "session": "A",
  "exercises": [{"exercise": "Ring Rows", "sets": "3", "reps": "10", "weight": "BW"}],
  "notes": "",

  // erg-only fields (note: type = session kind, not domain kind)
  "type": "endurance | speed | steady | water | recovery | cross",
  "subtype": "4x2000",
  "dist": "8000",
  "time": "34:20",
  "split": "2:08",

  // weight-only fields
  "weight": 181.5
}
```

### V2 Settings Schema

```json
{
  "goalWeight": 165,
  "weightUnit": "lb",
  "mealPrepDay": 0,
  "settingsVersion": 2
}
```

`settingsVersion` allows future `_migrateSettingsV2toV3()` to guard on this field.

### Testing Checkpoint

- [ ] All existing lift/erg/weight entries still visible after migration
- [ ] New entries save and persist across refresh
- [ ] `rowing_logs_v2` exists in DevTools → Application → Local Storage
- [ ] V1 keys (`rowing_lift_log_v1`, `rowing_erg_log_v1`, `rowing_weight_log_v1`) are gone
- [ ] `rowing_settings_v2` has `settingsVersion: 2`
- [ ] `rowing_settings_v1` is gone
- [ ] No console errors on load
- [ ] Console: `storage.isValidLogEntry({_logType:'lift', id:1, date:'2026-07-08'})` → `true`
- [ ] Console: `storage.isValidLogEntry({id:1, date:'bad'})` → `false`

### Risk

Highest data-loss risk in the entire refactor. **Before starting: export a CSV backup from the existing app.** The count-verification step + per-entry shape check in `_verifyMigrationIntegrity` are the guards. If either fails, V1 keys are preserved and an error is logged.

---

## Phase 2 — Static Data Restructure

**Goal:** All static content lives in structured, normalized files. `data.js` begins retirement.

### Files

| File | Action |
|---|---|
| `js/data-ingredients.js` | **Create** — normalized ingredient catalog (~80–100 items) |
| `js/data-recipes.js` | **Create** — all recipes with `ingredientId` references |
| `js/data-cuisines.js` | **Create** — 7 cuisine definitions with `stapleIngredientIds` |
| `js/data-workouts.js` | **Create** — workout library extracted from `data.js` |
| `js/data-training-plans.js` | **Create** — current Pete Plan as TrainingPlan entity |
| `js/data.js` | Modify — add deprecation comment; keep all existing constants |
| `index.html` | Modify — add 5 new script tags |

### Load Order (new data files)

```html
<script src="js/storage.js"></script>         <!-- Phase 1 -->
<script src="js/data-ingredients.js"></script> <!-- new: first, others reference it -->
<script src="js/data-recipes.js"></script>     <!-- new -->
<script src="js/data-cuisines.js"></script>    <!-- new -->
<script src="js/data-workouts.js"></script>    <!-- new -->
<script src="js/data-training-plans.js"></script> <!-- new -->
<script src="js/data.js"></script>             <!-- still here, deprecated -->
<!-- ... rest of existing scripts unchanged ... -->
```

### Ingredient Schema

```json
{
  "id": "soy_sauce",
  "name": "Soy Sauce",
  "category": "pantry",
  "shelfLife": "pantry",
  "isPantryStaple": true,
  "stapleFor": ["asian", "korean", "japanese"]
}
```

Categories (drives shopping list grouping): `protein`, `produce`, `dairy`, `grains`, `pantry`, `frozen`, `spice`, `condiment`

Shelf life tiers: `pantry` (months), `fridge-staple` (weeks), `weekly-fresh` (buy every week)

**Rule:** Author `data-ingredients.js` completely before writing any recipes. Every ingredient in every recipe must reference an ID that exists in the catalog.

### Recipe Schema

```json
{
  "id": "sesame_chicken_sheet_pan",
  "name": "Sheet Pan Sesame Chicken",
  "cuisineId": "asian",
  "mealTypes": ["dinner"],
  "proteinG": 41,
  "ingredients": [
    { "ingredientId": "chicken_thigh", "amount": 3, "unit": "lb" },
    { "ingredientId": "soy_sauce",     "amount": 3, "unit": "tbsp" },
    { "ingredientId": "sesame_oil",    "amount": 2, "unit": "tbsp" }
  ],
  "prepMins": 15,
  "cookMins": 30
}
```

### TrainingPlan Schema

```json
{
  "id": "tp_pete_masters_2026",
  "name": "Pete Plan — Masters Rowing 2026",
  "startDate": "2026-07-05",
  "endDate": "2026-12-31",
  "fixedSchedule": {
    "0": "wk_recovery_row",
    "5": "wk_cross_train"
  },
  "cyclicSchedule": {
    "cycleLengthWeeks": 3,
    "cycleStart": "2026-07-05",
    "byWeekAndDay": {
      "0": { "1": "wk_pete_t1", "2": "wk_strength_a", "3": "wk_pete_t2", "4": "wk_speed" },
      "1": { "1": "wk_pete_t1", "2": "wk_strength_b", "3": "wk_pete_t2", "4": "wk_speed" },
      "2": { "1": "wk_pete_t1", "2": "wk_strength_c", "3": "wk_pete_t2", "4": "wk_speed" }
    }
  }
}
```

### Testing Checkpoint

- [ ] App loads without console errors
- [ ] All existing tabs render correctly — meals, calendar, workouts unchanged
- [ ] `WORKOUT_LIBRARY` accessible in console
- [ ] Every recipe's `ingredientId` values exist in `INGREDIENT_CATALOG` (verify in console)
- [ ] `TRAINING_PLANS['tp_pete_masters_2026']` returns the plan object

### Note
- Schemas are provisional until first engine integration pass (Phase 3–5). Minor adjustments allowed without re-architecting prior phases.

---

## Phase 3 — Engine Layer

**Goal:** All business logic lives in `engine.js`. Render functions receive objects, they don't compute them.

### Files

| File | Action |
|---|---|
| `js/engine.js` | **Create** |
| `js/calendar.js` | Modify — `getDayInfo()` becomes thin wrapper calling engine |
| `js/dashboard.js` | Modify — render functions call engine, not inline logic |
| `js/meals.js` | Modify — meal rotation reads from engine |
| `index.html` | Modify — add engine.js after data files, before UI files |

### engine.js — Four Function Groups

**TrainingEngine**
```
TrainingEngine.getWorkoutForDate(plan, date)   → Workout | null
TrainingEngine.getTodayContext(plan, date)      → {workout, dow, cuisineWeek, peteWeek, cycleWeek}
TrainingEngine.isDateInPlan(plan, date)         → boolean
```

**MealEngine**
```
MealEngine.getMealsForDate(weekPlan, date)      → [{type, name, desc, link}]
MealEngine.getWeekContext(weekPlan)             → {cuisine, weekNumber, recipeCount}
MealEngine.getCurrentWeekPlan(weekPlans, date) → WeekPlan | null
```

**PantryEngine**
```
PantryEngine.resolveIngredient(id)             → Ingredient
PantryEngine.isPantryStaple(id)                → boolean
PantryEngine.getStaplesForCuisine(cuisineId)   → [Ingredient]
```

**ShoppingListEngine**
```
ShoppingListEngine.buildList(weekPlan, settings) → ShoppingList
  — aggregates ingredients from weekPlan.recipeIds
  — consolidates amounts within identical units
  — applies isPantryStaple filter based on settings.showPantryStaples
  — groups by ingredient category
  — returns { id, weekPlanId, generatedAt, groups: [{category, items}] }
```

### Rule: Engine Functions Are Pure

No DOM access. No localStorage access. Inputs come in as arguments. Output is a plain object. Engine calls storage (read-only) or receives pre-loaded data as arguments — never both.

### Design Guards

**1. `CUISINE_ROTATION` is advisory input only**

`CUISINE_ROTATION` in `data-cuisines.js` tells the engine the intended order. The engine owns all time-based resolution: week-index calculation, cycle alignment, start-date offsets. `CUISINE_ROTATION` is passed in as an argument — never read directly inside logic that computes "what week is it today."

If any code outside the engine reads `CUISINE_ROTATION[someIndex]` to determine the active cuisine, that's a bug — move the logic to `TrainingEngine`.

**2. Training plan schema DSL scope**

`TRAINING_PLANS` encodes schedule structure: which days, which cycles, which IDs. It is intentionally *not* a general-purpose scheduling DSL. The engine implements the resolution; the data describes the intent.

Watchpoint: if the plan schema starts containing conditional expressions, date arithmetic, or branching logic, the engine is becoming a parser of a mini DSL. That's a complexity trap. Keep the schema declarative and flat; push any branching into named engine functions instead.

**3. Cross-catalog validation (new task for this phase)**

Phase 1 introduced `storage.isValidLogEntry()` for log integrity. Phase 3 must introduce `validateCatalogs()` for referential integrity across the static data layer:

```
validateCatalogs()
  for each recipe in RECIPE_CATALOG:
    for each ingredient reference:
      assert ingredientId exists in INGREDIENT_CATALOG
  for each cuisine in CUISINE_CATALOG:
    for each recipeId in cuisine.recipeIds:
      assert recipeId exists in RECIPE_CATALOG
    for each stapleIngredientId:
      assert id exists in INGREDIENT_CATALOG
  for each plan in TRAINING_PLANS:
    for each workoutId referenced:
      assert workoutId exists in WORKOUT_LIBRARY
  returns { valid: boolean, errors: [string] }
```

Run once at startup in development (not production). Expose on `engine.validateCatalogs()` so it can be called from the console.

### Implementation Notes

- `TrainingEngine._getDayInfoShape(plan, date)` returns the exact same field shape as the pre-Phase-3 `getDayInfo()`, so all callers (calendar.js modal, dashboard.js render functions) continue to work with zero changes.
- `calendar.js` `getDayInfo()` is now a one-line wrapper; `getWeekIndex()` removed (logic lives in engine as `_getWeekIndex`).
- `meals.js` `renderMeals()` now reads from `CUISINE_CATALOG` + `RECIPE_CATALOG` via `MealEngine.buildMealObject()`. `mealWeeks` from `data.js` is no longer referenced by meals.js.
- `data-workouts.js` entries for fixed-schedule days now carry `bgClass` and `calShort` (display metadata the engine reads directly).
- `data-cuisines.js` now carries `flexMeal` per cuisine.
- `data-recipes.js` dinner entries now carry `desc` and `protStr` for display.
- `ShoppingListEngine.buildList()` is stubbed — returns null until Phase 5. Signature is final: `buildList(weekPlan, settings)`.
- `validateCatalogs()` checks: cuisine→recipe, recipe→ingredient, plan→workout (referential integrity) + key-consistency (`.id` matches object key) for INGREDIENT_CATALOG, RECIPE_CATALOG, WORKOUT_LIBRARY.
- **Phase 6 cleanup target:** retire `TrainingEngine._getDayInfoShape()`. Once Phase 4/5 complete the `dashboard.js` rewrite, `calendar.js` can be updated to call `getWorkoutForDate()` + `getTodayContext()` directly and the legacy compat wrapper removed.

### Testing Checkpoint

- [ ] Calendar renders correctly for all months. Click any day — modal shows correct workout and meals
- [ ] Meals tab rotation grid renders correctly (4 weeks, all dinners/flex/lunch visible)
- [ ] In console: `TrainingEngine.getWorkoutForDate(TRAINING_PLANS['tp_pete_masters_2026'], new Date(2026, 9, 6))` returns Tuesday Pete Plan workout
- [ ] In console: same call for a Sunday returns recovery workout (`wk_recovery_sunday`)
- [ ] In console: `validateCatalogs()` returns `{ valid: true, errors: [] }`
- [ ] In console: `MealEngine.buildMealObject(TRAINING_PLANS['tp_pete_masters_2026'], 0).cuisine` returns `'Asian'`

---

## Phase 4 — Today Screen

**Goal:** Remove the "TRAIN. EAT. RACE." header. App opens to a data-driven Today view.

### Files

| File | Action |
|---|---|
| `index.html` | Modify — remove `.hdr` block; add `.app-bar`; rename Dashboard→Today tab; add Stats tab; move Training Records to `panel-stats` |
| `css/styles.css` | Modify — remove header styles; add app-bar and completion state styles |
| `js/dashboard.js` | Modify — add `markWorkoutComplete()`, completion state display, handle missing week plan |
| `js/log.js` | Modify — `renderDashboard()` → `renderStats()`, targeting `panel-stats` |
| `js/app.js` | Modify — update default panel; add `renderStats()` call on stats tab |

### App Bar

```
┌────────────────────────────────────────────────┐
│  Masters Rowing                    ⚙ Settings  │
└────────────────────────────────────────────────┘
```

No hardcoded stats. Settings access surfaced here.

### Today Panel Content

```
Date Context       — Wednesday, July 8 · Asian Week · Pete Wk 1
Today's Training   — workout card + [Mark Complete] button
Today's Meals      — breakfast / lunch / dinner rows
Weight             — current / goal / delta + log form
Next Meal Prep     — countdown card
```

Quick Stats moves to the new **Stats** tab alongside existing PRs and recent sessions.

### Workout Completion Log Entry

```json
{
  "type": "workoutCompletion",
  "id": 1234567890,
  "date": "2026-07-08",
  "workoutId": "wk_strength_a",
  "completedAt": "2026-07-08T06:45:00"
}
```

### Testing Checkpoint

- [ ] App opens to Today panel. Static header is gone
- [ ] Date context line shows correct day / week info
- [ ] [Mark Complete] saves a completion entry. Refresh — button shows completed state
- [ ] Stats tab shows PRs, erg records, recent sessions intact
- [ ] Settings reachable from app bar
- [ ] Settings changes (weight unit, prep day) update Today panel

---

## Phase 5 — Meal Planning V2

**Goal:** Dynamic weekly meal planning driven by the recipe catalog. The engine selects recipes based on rank, cooldowns, and ingredient overlap; the UI shows a recipe card set, a 5-day assignment grid, and a shopping list.

> **Note:** The original cuisine-selector approach (cuisine grid → recipe picker) was replaced during implementation with the Umami + Cronometer recipe catalog approach. `MealEngine.generateWeekPlan()` in `engine.js` is complete. This phase covers the Fuel tab UI rewrite only. See `RECIPE_REFACTOR.md` for full engine and data schema documentation.

### Files

| File | Action |
|---|---|
| `js/meal-planner.js` | Rewrite — replace cuisine-era rendering with recipe-catalog-based planner |
| `js/settings.js` | Modify — add `dailyCalorieTarget` and `dailyBaselineCalories` editable fields |
| `index.html` | Modify — update Fuel panel HTML for new planner shell |
| `css/styles.css` | Modify — recipe cards, assignment grid, overflow shelf styles |

### meal-planner.js API

```
renderMealPlannerHome(weekPlan)    — recipe cards + 5-day grid, or "Generate" prompt if no plan
renderRecipeCards(weekPlan)        — one card per selected recipe (name, batch cal, N, cal/serving, Pin, Swap)
renderAssignmentGrid(weekPlan)     — Mon–Fri columns × Lunch/Dinner rows; no recipe appears twice in one column
renderOverflowShelf(weekPlan)      — servings beyond 10 weekday slots ("X extra serving(s) · ~Y cal each")
generateAndShowWeekPlan()          — calls MealEngine.generateWeekPlan(), renders result
confirmWeekPlan(weekPlan)          — locks plan, updates cooldowns in localStorage
renderShoppingList(weekPlan)       — ingredient aggregate across all recipes, grouped by category
```

### User Flow

```
Fuel Tab
 └── No plan → [Generate Week Plan] button
 └── Plan generated → Recipe Card Set + 5-Day Assignment Grid
      └── [Pin] lock a recipe into next regeneration
      └── [Swap] replace one recipe while keeping others
      └── [↺ Regenerate] — new selection respecting pins and cooldowns
      └── [Confirm Plan ✓] → Shopping List view
           └── Ingredient aggregate grouped by category
           └── [Hide pantry items] toggle
```

### Testing Checkpoint

- [ ] Fuel tab: no plan → "Generate Week Plan" button shown, no errors
- [ ] Generate plan → recipe cards and 5-day grid render correctly
- [ ] Pin a recipe → Regenerate preserves the pinned recipe
- [ ] 5-day grid shows correct assignments — no column has the same recipe twice
- [ ] Overflow shelf shows correct serving counts and calories
- [ ] Confirm plan updates cooldowns in localStorage; Regenerate does not
- [ ] Shopping list renders ingredient aggregate grouped by category
- [ ] Hide pantry items toggle works
- [ ] Plan tab (calendar): meal cells show assigned recipes on correct days
- [ ] Calorie target and baseline settings persist across sessions

---

## Phase 6 — Training Plan V2

**Goal:** Remove all hardcoded date logic from calendar.js. The calendar is fully engine-driven. `data.js` deleted.

### Files

| File | Action |
|---|---|
| `js/calendar.js` | Modify — fully engine-driven; remove July/Dec hard bounds; `getDayInfo()` deleted |
| `js/workouts.js` | Modify — reads from `data-workouts.js` library |
| `js/app.js` | Modify — `activePlan` resolved from settings, not hardcoded |
| `js/data.js` | **Delete** |
| `index.html` | Modify — remove `data.js` script tag; add backup buttons to Settings panel |
| `css/styles.css` | Modify — minor: backup button styles |

### Additional Work

**Export / Import Backup** (Settings tab)

```
storage.exportAll()    → JSON blob of all V2 keys → triggers file download
storage.importAll(json) → restores from blob, verifies version, writes all keys
```

**Service Worker Cache Audit**

Update `service-worker.js` cache list to include all new JS files added in Phases 1–5. Bump cache version string to force refresh.

**CSV Export**

Verify `exportLifting()` and `exportErg()` in `log.js` still work correctly reading from `rowing_logs_v2`.

### Pre-deletion Checklist

Before deleting `data.js`:
- [ ] `grep -r "getDayInfo" js/` returns no results
- [ ] All constants previously in `data.js` are now unused (grep each one)
- [ ] App loads and all tabs render with `data.js` script tag commented out

### Testing Checkpoint

- [ ] Calendar navigates past December 2026 without errors
- [ ] January 2027 cells render (empty workout, no crash)
- [ ] `data.js` removed — no console errors
- [ ] Export backup: JSON file downloads with all entries
- [ ] Clear all data in DevTools. Import backup. All data restored
- [ ] Offline mode (DevTools → Network → Offline): app loads fully

---

## Deferred (Post-Phase 6)

These are structurally supported after Phase 6 but not in scope:

- Weight trend chart
- Ingredient overlap auto-suggest
- Multiple training plans / plan switching
- Race goal scheduling
- IndexedDB migration
- AI coaching summaries
- Streak tracking
