// ============================================================
// DATA-TRAINING-PLANS — active plan entity
// The plan provides startDate (for global week index / meal cycling)
// and mealCycleIds. Workout scheduling is owned by TRAINING_BLOCKS
// in data-blocks.js; the engine resolves all sessions from there.
// ============================================================

const TRAINING_PLANS = {

  tp_masters_2026: {
    id:        'tp_masters_2026',
    name:      'Masters Rowing — Block Macrocycle 2026',
    startDate: '2026-01-05',   // First Monday of 2026 — anchor for meal week index
    endDate:   '2026-12-31',

    // mealCycleIds retained for week-index math; cuisine system removed in Phase 4
    mealCycleIds: ['chinese', 'greek', 'mexican', 'thai', 'indian', 'italian', 'spanish', 'caribbean']
  }

};

// Default active plan — consumed by app.js
const ACTIVE_PLAN_ID = 'tp_masters_2026';
