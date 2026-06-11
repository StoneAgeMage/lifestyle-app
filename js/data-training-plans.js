// ============================================================
// DATA-TRAINING-PLANS — training plan entities
// Phase 2. Used by Phase 3 engine to resolve workouts by date.
// All workoutIds must exist in WORKOUT_LIBRARY.
//
// DESIGN SCOPE GUARD: This file encodes schedule structure —
// which days, which cycles, which IDs. It does NOT encode
// resolution logic (how to compute week index, how to pick
// from a cycle). That belongs in the engine. If you find
// yourself adding conditional expressions or date math here,
// stop and move it to engine.js instead.
// ============================================================

const TRAINING_PLANS = {

  tp_pete_masters_2026: {
    id: 'tp_pete_masters_2026',
    name: 'Pete Plan — Masters Rowing 2026',
    startDate: '2026-06-07',   // Sunday
    endDate:   '2026-12-31',

    // Days with a fixed workout regardless of week number.
    // Key = day-of-week (0=Sun, 1=Mon, ... 6=Sat)
    fixedByDow: {
      1: 'wk_strength_a',     // Monday
      3: 'wk_strength_b',     // Wednesday
      5: 'wk_strength_c',     // Friday
      0: 'wk_recovery_sunday' // Sunday
    },

    // Tuesday: cycles through 3 Pete Plan endurance sessions.
    // Engine resolves: PETE_TUE_CYCLE[weekIndex % 3]
    // Also adds water primary as the preferred option.
    tuesdayCycle: {
      dow: 2,
      primaryWorkoutId: 'wk_water_tuesday',
      ergCycleIds: ['wk_pete_t1', 'wk_pete_t2', 'wk_pete_t3']
    },

    // Thursday: water/steady by default.
    // Every 4 weeks (weekIndex % 4 === 0): monthly speed session.
    // Speed session cycles: SPEED_MONTH_CYCLE[Math.floor(weekIndex/4) % 3]
    thursdayRule: {
      dow: 4,
      defaultWorkoutId: 'wk_water_thursday',
      speedEveryNWeeks: 4,
      speedCycleIds: ['wk_speed_500', 'wk_speed_pyramid', 'wk_speed_1000']
    },

    // Saturday: long water / steady erg
    saturdayWorkoutId: 'wk_water_saturday',

    // Meal rotation: 4-week cycle parallel to training plan
    mealCycleIds: ['asian', 'mediterranean', 'mexican', 'thai']
  }

};

// Default active plan — consumed by app.js → engine in Phase 3
const ACTIVE_PLAN_ID = 'tp_pete_masters_2026';
