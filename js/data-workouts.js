// ============================================================
// DATA-WORKOUTS — structured workout library
// Phase 2. Defines WORKOUT_LIBRARY keyed by workout ID.
// data.js globals (strengthA/B/C etc.) remain active for backward
// compatibility until Phase 3 migrates calendar.js to use this.
// type: 'lift' | 'erg' | 'water' | 'recovery' | 'rest'
// ============================================================

const WORKOUT_LIBRARY = {

  // ---- Strength sessions ---------------------------------------

  wk_strength_a: {
    id: 'wk_strength_a',
    name: 'Strength A — Posterior Chain + Pull',
    type: 'lift',
    sessionKey: 'A',
    bgClass: 'bg-lift',
    calShort: 'Strength A',
    durationMins: 35,
    items: [
      { t:'Strength A — Posterior Chain + Pull', d:'Ring rows 3×8 · DB RDL 3×10 · Goblet squat 3×12 · Ring push-ups 3×10 · Pallof press 3×10ea · Plank 3×45s' }
    ]
  },

  wk_strength_b: {
    id: 'wk_strength_b',
    name: 'Strength B — Hinge + Single Leg',
    type: 'lift',
    sessionKey: 'B',
    bgClass: 'bg-lift',
    calShort: 'Strength B',
    durationMins: 35,
    items: [
      { t:'Strength B — Hinge + Single Leg', d:'DB bent-over row 3×10 · Ring dips 3×8 · DB reverse lunge 3×10ea · Face pulls 3×15 · Dead bug 3×10 · Side plank 2×30s ea' }
    ]
  },

  wk_strength_c: {
    id: 'wk_strength_c',
    name: 'Strength C — Upper Body Focus',
    type: 'lift',
    sessionKey: 'C',
    bgClass: 'bg-lift',
    calShort: 'Strength C',
    durationMins: 30,
    items: [
      { t:'Strength C — Upper Body Focus', d:'Ring push-ups 3×12 · DB single-arm row 3×10ea · Lateral raises 3×15 · DB curls 3×12 · Ring tricep dips 3×8 · Hollow body hold 3×30s · Leg-friendly by design.' }
    ]
  },

  // ---- Pete Plan endurance sessions (3-week cycle) -------------

  wk_pete_t1: {
    id: 'wk_pete_t1',
    name: '5 × 1500m / 5 min rest',
    type: 'erg',
    ergSubtype: 'endurance',
    ergSession: '5x1500',
    distanceM: 7500,
    items: [
      { t:'5 × 1500m / 5 min rest', d:'Total 7.5k. Pace: ~5k PB. All but last rep at target, final rep hard.' }
    ]
  },

  wk_pete_t2: {
    id: 'wk_pete_t2',
    name: '4 × 2000m / 5 min rest',
    type: 'erg',
    ergSubtype: 'endurance',
    ergSession: '4x2000',
    distanceM: 8000,
    items: [
      { t:'4 × 2000m / 5 min rest', d:'Total 8k. Hardest endurance session. Pace: 5k PB + 0.5 sec.' }
    ]
  },

  wk_pete_t3: {
    id: 'wk_pete_t3',
    name: '3k / 2.5k / 2k / 5 min rest',
    type: 'erg',
    ergSubtype: 'endurance',
    ergSession: '3k-2.5k-2k',
    distanceM: 7500,
    items: [
      { t:'3k / 2.5k / 2k / 5 min rest', d:'Total 7.5k. Descending. Pace: 5k PB + 1 sec. Gets more manageable.' }
    ]
  },

  // ---- Speed sessions (monthly rotation) ----------------------

  wk_speed_500: {
    id: 'wk_speed_500',
    name: '8 × 500m / 3:30 rest',
    type: 'erg',
    ergSubtype: 'speed',
    ergSession: '8x500',
    distanceM: 4000,
    items: [
      { t:'8 × 500m / 3:30 rest', d:'Total 4k. Pace: 2k PB – 3 sec. Last rep all out.' }
    ]
  },

  wk_speed_pyramid: {
    id: 'wk_speed_pyramid',
    name: 'Speed Pyramid',
    type: 'erg',
    ergSubtype: 'speed',
    ergSession: 'pyramid',
    distanceM: 4000,
    items: [
      { t:'Speed Pyramid', d:'250–500–750–1k–750–500–250m. 1:30 rest per 250m. Constant pace up to 1k, then accelerate.' }
    ]
  },

  wk_speed_1000: {
    id: 'wk_speed_1000',
    name: '4 × 1000m / 5 min rest',
    type: 'erg',
    ergSubtype: 'speed',
    ergSession: '4x1000',
    distanceM: 4000,
    items: [
      { t:'4 × 1000m / 5 min rest', d:'Total 4k. Pace: 2k PB + 1 sec.' }
    ]
  },

  // ---- Water sessions ------------------------------------------

  wk_water_tuesday: {
    id: 'wk_water_tuesday',
    name: 'Crew Practice / Pete Endurance Backup',
    type: 'water',
    items: [
      { t:'Crew Practice (primary)', d:'Counts as Pete Plan distance work. On water = session complete for the day.' }
    ]
  },

  wk_water_thursday: {
    id: 'wk_water_thursday',
    name: 'Crew Practice / Steady Erg',
    type: 'water',
    bgClass: 'bg-water',
    calShort: 'Steady / Water',
    items: [
      { t:'Crew Practice (primary)', d:'Counts as steady-state distance work.' },
      { t:'Backup: Steady-State Erg 8–10k', d:'If crew cancelled: 22–25 spm, easy conversational pace. ≥10 sec/500m slower than interval pace.' }
    ]
  },

  wk_water_saturday: {
    id: 'wk_water_saturday',
    name: 'Long Crew Practice / Steady Erg',
    type: 'water',
    bgClass: 'bg-water',
    calShort: 'Long Water / Steady',
    items: [
      { t:'Crew Practice — Long Session (primary)', d:'Weekly peak aerobic effort. Counts as hard distance piece. Most important session of the week.' },
      { t:'Backup: Steady-State Erg 10–12k', d:'If crew cancelled: longer easy row. No intervals.' }
    ]
  },

  wk_water_thursday_speed: {
    id: 'wk_water_thursday_speed',
    name: 'Crew Practice / Monthly Speed Session',
    type: 'water',
    items: [
      { t:'Crew Practice (primary)', d:'On water = done for the day.' }
    ]
    // speedWorkoutId is resolved dynamically by engine using Math.floor(wi/4) % 3
  },

  // ---- Sunday recovery -----------------------------------------

  wk_recovery_sunday: {
    id: 'wk_recovery_sunday',
    name: 'Easy Erg + Meal Prep',
    type: 'recovery',
    bgClass: 'bg-rest',
    calShort: 'Prep + Easy Erg',
    items: [
      { t:'Meal Prep (~2 hrs)', d:'Cook grains, roast veg, make week\'s sauce, sheet pan protein, one-pot veg, overnight oat jars (soy milk base), trail mix batch, portion snacks.' },
      { t:'Easy Erg — 20–25 min', d:'18–20 spm. Rate-capped. Very light pressure. Recovery rowing only.' },
      { t:'Stretch & Mobility — 20 min', d:'Hip flexors · thoracic rotation · hamstring stretch · lat/shoulder stretch · foam roll glutes + quads' }
    ]
  }
};

// Ordered arrays used by the engine for cycle resolution
const PETE_TUE_CYCLE    = ['wk_pete_t1', 'wk_pete_t2', 'wk_pete_t3'];
const SPEED_MONTH_CYCLE = ['wk_speed_500', 'wk_speed_pyramid', 'wk_speed_1000'];
