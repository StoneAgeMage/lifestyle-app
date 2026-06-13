// ============================================================
// DATA-BLOCKS — 4-block macrocycle periodization
// Time-triggered: block is determined by calendar month.
// Each block defines a 5-day weekly template (Mon–Fri active,
// Sat = Restoration, Sun = Rest) plus session pools that the
// engine cycles through week-by-week within the block.
//
// 48-hr high-intensity guardrail is enforced BY CONSTRUCTION:
//   Tue can be high (48 hrs since Sun rest)
//   Thu can be high (48 hrs since Tue)
//   Fri is ALWAYS low (only 24 hrs since Thu)
//   → no runtime check needed; the pool entries enforce this.
//
// Pool arrays: engine picks pool[weekIndexInBlock % pool.length]
// Deload (every deloadCycle-th week): use deloadPool if defined.
// ============================================================

const TRAINING_BLOCKS = [

  // ============================================================
  // BLOCK 1 — WINTER ENGINE & HEAVY HINGE (Nov – Feb)
  // ============================================================
  {
    id:             'block_winter',
    name:           'Winter Engine & Heavy Hinge',
    shortName:      'Winter',
    months:         [10, 11, 0, 1],   // Nov=10 Dec=11 Jan=0 Feb=1
    colorAccent:    'b-winter',
    srRange:        '18–22',
    intensityLabel: 'Polarized Base · 80% Z1/Z2',
    phaseGoal:      'Aerobic engine + heavy posterior chain. Volume discipline, SR control.',
    deloadCycle:    4,                // every 4th week is a deload
    raceGoal:       null,

    weekTemplate: {
      // Mon — Strength A (heavy hinge + pull)
      1: { type:'lift', pool:['wk_wint_lift_a'], deloadPool:['wk_wint_lift_a_dl'], isHigh:false, logSession:'A' },
      // Tue — LOW aerobic (high intensity reserved for Thu)
      2: { type:'erg',  pool:['wk_wint_z1_45','wk_wint_z2_rate','wk_wint_z1_60','wk_wint_z2_rate'], deloadPool:['wk_wint_z1_30'], isHigh:false },
      // Wed — Strength B (unilateral + stability)
      3: { type:'lift', pool:['wk_wint_lift_b'], deloadPool:['wk_wint_lift_b_dl'], isHigh:false, logSession:'B' },
      // Thu — HIGH: AT intervals or threshold test (48 hrs after Tue)
      4: { type:'erg',  pool:['wk_wint_at_4x10','wk_wint_at_4x10','wk_wint_threshold_20','wk_wint_at_4x10'], deloadPool:['wk_wint_z1_45'], isHigh:true },
      // Fri — LOW: technique or fartlek (24 hrs after Thu — always aerobic)
      5: { type:'erg',  pool:['wk_wint_z1_tech','wk_wint_z1_fartlek','wk_wint_z1_tech','wk_wint_z1_fartlek'], deloadPool:['wk_wint_z1_30'], isHigh:false },
      // Sat — 20-min Deep Restoration
      6: { type:'restoration', pool:null, isHigh:false },
      // Sun — Full Rest
      0: { type:'rest', pool:null, isHigh:false }
    }
  },

  // ============================================================
  // BLOCK 2 — SPRING SPRINT SPEED (Mar – Jun)
  // ============================================================
  {
    id:             'block_spring',
    name:           'Spring Sprint Speed',
    shortName:      'Spring',
    months:         [2, 3, 4, 5],    // Mar=2 Apr=3 May=4 Jun=5
    colorAccent:    'b-spring',
    srRange:        '28–34',
    intensityLabel: 'VO2max Intervals · Race Build · 2-Wk Taper',
    phaseGoal:      'Peak for NW Regionals 1,000m sprint — end of June.',
    deloadCycle:    4,
    raceGoal:       { name:'NW Regionals', dist:'1,000m', targetMonth:5, taperWeeks:2 },

    weekTemplate: {
      // Mon — Strength A (power + explosive pull)
      1: { type:'lift', pool:['wk_spr_lift_a'], deloadPool:['wk_spr_lift_a_dl'], isHigh:false, logSession:'A' },
      // Tue — HIGH: VO2max or speed pieces
      2: { type:'erg',  pool:['wk_spr_vo2_5x4','wk_spr_speed_6x500','wk_spr_vo2_5x4','wk_spr_speed_6x500'], deloadPool:['wk_spr_z2_30'], isHigh:true },
      // Wed — Strength B (unilateral power + ring work)
      3: { type:'lift', pool:['wk_spr_lift_b'], deloadPool:['wk_spr_lift_b_dl'], isHigh:false, logSession:'B' },
      // Thu — HIGH: AT / race-pace (48 hrs after Tue)
      4: { type:'erg',  pool:['wk_spr_at_30','wk_spr_race_pace','wk_spr_at_30','wk_spr_race_pace'], deloadPool:['wk_spr_z2_30'], isHigh:true },
      // Fri — LOW: technical paddle or easy Z2 (24 hrs after Thu)
      5: { type:'erg',  pool:['wk_spr_z1_tech','wk_spr_z2_30','wk_spr_z1_tech','wk_spr_z2_30'], isHigh:false },
      6: { type:'restoration', pool:null, isHigh:false },
      0: { type:'rest', pool:null, isHigh:false }
    }
  },

  // ============================================================
  // BLOCK 3 — SUMMER AEROBIC BRIDGE (Jul – Aug)
  // ============================================================
  {
    id:             'block_summer',
    name:           'Summer Aerobic Bridge',
    shortName:      'Summer',
    months:         [6, 7],           // Jul=6 Aug=7
    colorAccent:    'b-summer',
    srRange:        '20–24',
    intensityLabel: 'Active Recovery · Technical · Cross-Train',
    phaseGoal:      'Aerobic maintenance, technical refinement, unilateral balance correction.',
    deloadCycle:    3,                // 3-week micro-blocks in shorter summer
    raceGoal:       null,

    weekTemplate: {
      1: { type:'lift', pool:['wk_sum_lift_a','wk_sum_lift_b','wk_sum_lift_a'], deloadPool:['wk_sum_lift_a_dl'], isHigh:false, logSession:'A' },
      2: { type:'erg',  pool:['wk_sum_z1_tech','wk_sum_cross','wk_sum_z1_fartlek'], deloadPool:['wk_sum_z1_30'], isHigh:false },
      3: { type:'lift', pool:['wk_sum_lift_b','wk_sum_lift_a','wk_sum_lift_b'], deloadPool:['wk_sum_lift_b_dl'], isHigh:false, logSession:'B' },
      4: { type:'erg',  pool:['wk_sum_z1_45','wk_sum_z2_rate','wk_sum_z1_45'], deloadPool:['wk_sum_z1_30'], isHigh:false },
      5: { type:'erg',  pool:['wk_sum_z1_gamify','wk_sum_cross','wk_sum_z1_gamify'], isHigh:false },
      6: { type:'restoration', pool:null, isHigh:false },
      0: { type:'rest', pool:null, isHigh:false }
    }
  },

  // ============================================================
  // BLOCK 4 — FALL HEAD RACE THRESHOLD (Sep – Oct)
  // ============================================================
  {
    id:             'block_fall',
    name:           'Fall Head Race Threshold',
    shortName:      'Fall',
    months:         [8, 9],           // Sep=8 Oct=9
    colorAccent:    'b-fall',
    srRange:        '24–28',
    intensityLabel: 'FTP Focus · Head Race Build · 2-Wk Taper',
    phaseGoal:      'Peak for home head race 4–5k — end of October.',
    deloadCycle:    4,
    raceGoal:       { name:'Head Race', dist:'~4,500m', targetMonth:9, taperWeeks:2 },

    weekTemplate: {
      1: { type:'lift', pool:['wk_fall_lift_a'], deloadPool:['wk_fall_lift_a_dl'], isHigh:false, logSession:'A' },
      2: { type:'erg',  pool:['wk_fall_at_3x15','wk_fall_rate_surges','wk_fall_at_3x15','wk_fall_rate_surges'], deloadPool:['wk_fall_z1_45'], isHigh:true },
      3: { type:'lift', pool:['wk_fall_lift_b'], deloadPool:['wk_fall_lift_b_dl'], isHigh:false, logSession:'B' },
      4: { type:'erg',  pool:['wk_fall_ftp_30','wk_fall_at_3x15','wk_fall_ftp_30','wk_fall_at_3x15'], deloadPool:['wk_fall_z1_45'], isHigh:true },
      5: { type:'erg',  pool:['wk_fall_z1_tech','wk_fall_z2_40','wk_fall_z1_tech','wk_fall_z2_40'], isHigh:false },
      6: { type:'restoration', pool:null, isHigh:false },
      0: { type:'rest', pool:null, isHigh:false }
    }
  }

];
