'use strict';

// ============================================================
// DATA-BLOCKS — 4-block macrocycle periodization
// Weekly structure (all blocks):
//   0 Sun  = 20-min Deep Restoration
//   1 Mon  = Lift A  (primary DB+rings | travel zero-equip)
//   2 Tue  = THREE-WAY HYBRID: Erg | Club Log | Run Fallback
//   3 Wed  = Active Recovery
//   4 Thu  = THREE-WAY HYBRID: Erg | Club Log | Run Fallback
//   5 Fri  = Lift B  (primary DB+rings | travel zero-equip)
//   6 Sat  = THREE-WAY HYBRID: Erg | Club Log | Run Fallback
//             (no post-workout mobility card)
// ============================================================

var TRAINING_BLOCKS = [
  {
    id: 'winter',
    name: 'Winter Engine',
    shortName: 'WINT',
    months: [11, 12, 1],          // Nov, Dec, Jan
    colorAccent: '#4a9eff',
    srRange: '18-22',
    intensityLabel: 'UT2 / UT1',
    phaseGoal: 'Build aerobic base, long steady state, establish pulling strength',
    deloadCycle: 4,               // deload every 4th week
    raceGoal: null,
    weekTemplate: {
      0: { type: 'restoration', pool: ['wk_restoration'] },
      1: {
        type: 'lift', logSession: 'A', mobilityBias: 'leg',
        pool: ['lift_wint_A'],
        deloadPool: ['lift_wint_A_dl']
      },
      2: {
        type: 'hybrid', mobilityBias: 'row',
        pool: ['hyb_wint_tue_A', 'hyb_wint_tue_B', 'hyb_wint_tue_C', 'hyb_wint_tue_D'],
        deloadPool: ['hyb_wint_tue_A']
      },
      3: { type: 'recovery', pool: ['wk_active_recovery'] },
      4: {
        type: 'hybrid', mobilityBias: 'row',
        pool: ['hyb_wint_thu_A', 'hyb_wint_thu_B', 'hyb_wint_thu_C', 'hyb_wint_thu_D'],
        deloadPool: ['hyb_wint_thu_A']
      },
      5: {
        type: 'lift', logSession: 'B', mobilityBias: 'upper',
        pool: ['lift_wint_B'],
        deloadPool: ['lift_wint_B_dl']
      },
      6: {
        type: 'hybrid', mobilityBias: null, noMobility: true,
        pool: ['hyb_wint_sat_A', 'hyb_wint_sat_B', 'hyb_wint_sat_C', 'hyb_wint_sat_D'],
        deloadPool: ['hyb_wint_sat_A']
      }
    }
  },

  {
    id: 'spring',
    name: 'Spring Sprint',
    shortName: 'SPR',
    months: [2, 3, 4],            // Feb, Mar, Apr
    colorAccent: '#f5a623',
    srRange: '24-30',
    intensityLabel: 'AT / VO2 / Speed',
    phaseGoal: 'Develop AT threshold, VO2max ceiling, sprint power for indoor race season',
    deloadCycle: 4,
    raceGoal: {
      targetDistance: 2000,
      taperWeeks: 1,
      targetMonth: 3
    },
    weekTemplate: {
      0: { type: 'restoration', pool: ['wk_restoration'] },
      1: {
        type: 'lift', logSession: 'A', mobilityBias: 'leg',
        pool: ['lift_spr_A'],
        deloadPool: ['lift_spr_A_dl']
      },
      2: {
        type: 'hybrid', mobilityBias: 'row',
        pool: ['hyb_spr_tue_A', 'hyb_spr_tue_B', 'hyb_spr_tue_C', 'hyb_spr_tue_D'],
        deloadPool: ['hyb_spr_tue_A']
      },
      3: { type: 'recovery', pool: ['wk_active_recovery'] },
      4: {
        type: 'hybrid', mobilityBias: 'row',
        pool: ['hyb_spr_thu_A', 'hyb_spr_thu_B', 'hyb_spr_thu_C', 'hyb_spr_thu_D', 'hyb_spr_thu_E'],
        deloadPool: ['hyb_spr_thu_A']
      },
      5: {
        type: 'lift', logSession: 'B', mobilityBias: 'upper',
        pool: ['lift_spr_B'],
        deloadPool: ['lift_spr_B_dl']
      },
      6: {
        type: 'hybrid', mobilityBias: null, noMobility: true,
        pool: ['hyb_spr_sat_A', 'hyb_spr_sat_B', 'hyb_spr_sat_C', 'hyb_spr_sat_D'],
        deloadPool: ['hyb_spr_sat_A']
      }
    }
  },

  {
    id: 'summer',
    name: 'Summer Bridge',
    shortName: 'SUM',
    months: [5, 6, 7],            // May, Jun, Jul
    colorAccent: '#7ed321',
    srRange: '18-26',
    intensityLabel: 'UT2 / AT bridge',
    phaseGoal: 'Retain aerobic and strength gains, reduce total load, prep for fall volume',
    deloadCycle: 3,               // shorter deload cycle in bridge block
    raceGoal: null,
    weekTemplate: {
      0: { type: 'restoration', pool: ['wk_restoration'] },
      1: {
        type: 'lift', logSession: 'A', mobilityBias: 'leg',
        pool: ['lift_sum_A'],
        deloadPool: ['lift_sum_A_dl']
      },
      2: {
        type: 'hybrid', mobilityBias: 'row',
        pool: ['hyb_sum_tue_A', 'hyb_sum_tue_B', 'hyb_sum_tue_C'],
        deloadPool: ['hyb_sum_tue_B']
      },
      3: { type: 'recovery', pool: ['wk_active_recovery'] },
      4: {
        type: 'hybrid', mobilityBias: 'row',
        pool: ['hyb_sum_thu_A', 'hyb_sum_thu_B', 'hyb_sum_thu_C'],
        deloadPool: ['hyb_sum_thu_A']
      },
      5: {
        type: 'lift', logSession: 'B', mobilityBias: 'upper',
        pool: ['lift_sum_B'],
        deloadPool: ['lift_sum_B_dl']
      },
      6: {
        type: 'hybrid', mobilityBias: null, noMobility: true,
        pool: ['hyb_sum_sat_A', 'hyb_sum_sat_B', 'hyb_sum_sat_C'],
        deloadPool: ['hyb_sum_sat_A']
      }
    }
  },

  {
    id: 'fall',
    name: 'Fall Head Race',
    shortName: 'FALL',
    months: [8, 9, 10],           // Aug, Sep, Oct
    colorAccent: '#d0021b',
    srRange: '22-28',
    intensityLabel: 'UT1 / AT sustained',
    phaseGoal: 'Build head race volume, sustained AT, race simulations, peak for fall regattas',
    deloadCycle: 4,
    raceGoal: {
      targetDistance: 5000,
      taperWeeks: 2,
      targetMonth: 9
    },
    weekTemplate: {
      0: { type: 'restoration', pool: ['wk_restoration'] },
      1: {
        type: 'lift', logSession: 'A', mobilityBias: 'leg',
        pool: ['lift_fall_A'],
        deloadPool: ['lift_fall_A_dl']
      },
      2: {
        type: 'hybrid', mobilityBias: 'row',
        pool: ['hyb_fall_tue_A', 'hyb_fall_tue_B', 'hyb_fall_tue_C', 'hyb_fall_tue_D'],
        deloadPool: ['hyb_fall_tue_A']
      },
      3: { type: 'recovery', pool: ['wk_active_recovery'] },
      4: {
        type: 'hybrid', mobilityBias: 'row',
        pool: ['hyb_fall_thu_A', 'hyb_fall_thu_B', 'hyb_fall_thu_C', 'hyb_fall_thu_D'],
        deloadPool: ['hyb_fall_thu_A']
      },
      5: {
        type: 'lift', logSession: 'B', mobilityBias: 'upper',
        pool: ['lift_fall_B'],
        deloadPool: ['lift_fall_B_dl']
      },
      6: {
        type: 'hybrid', mobilityBias: null, noMobility: true,
        pool: ['hyb_fall_sat_A', 'hyb_fall_sat_B', 'hyb_fall_sat_C', 'hyb_fall_sat_D', 'hyb_fall_sat_E'],
        deloadPool: ['hyb_fall_sat_A']
      }
    }
  }
];
