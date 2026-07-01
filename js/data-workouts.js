'use strict';

// Static club practice log config — same for all hybrid days
var CLUB_LOG_CONFIG = {
  type: 'club',
  label: 'Log Team Practice on the Water',
  subtitle: 'Quick capture for your club session',
  fields: [
    { id: 'club_meters', label: 'Meters Rowed (estimated)', type: 'number', placeholder: '5000' },
    { id: 'club_rating', label: 'Effort Rating (1–10)', type: 'number', placeholder: '7', min: 1, max: 10 },
    { id: 'club_notes', label: 'Notes', type: 'text', placeholder: 'What did you work on?' }
  ]
};

var WORKOUT_LIBRARY = {

  // ═══════════════════════════════════════════════════════════════════
  // WINTER ENGINE — Dec-Feb  |  Aerobic base, long steady state, UT2
  // ═══════════════════════════════════════════════════════════════════

  // ── Tuesday (4 variants) — UT2 aerobic base
  hyb_wint_tue_A: {
    id: 'hyb_wint_tue_A', type: 'hybrid', bgClass: 'bg-z1',
    calShort: 'UT2 Steady', mobilityBias: 'row',
    erg: {
      name: '60-Min Steady State UT2',
      items: ['10 min easy paddle, build to UT2 by min 5', '45 min continuous at UT2 (SR 18-20)', '5 min cool-down paddle']
    },
    run: {
      name: '50-Min Easy Base Run', bgClass: 'bg-z1',
      items: ['5 min walk warm-up', '40 min easy UT2 run (conversational pace)', '5 min walk cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_wint_tue_B: {
    id: 'hyb_wint_tue_B', type: 'hybrid', bgClass: 'bg-z1',
    calShort: 'UT2 Pyramids', mobilityBias: 'row',
    erg: {
      name: '4×15-Min Pyramid Intervals',
      items: ['10 min easy warm-up', '4×15 min @ UT2 border (SR 20), 3 min rest between', '5 min cool-down']
    },
    run: {
      name: '55-Min Easy Fartlek Run', bgClass: 'bg-z1',
      items: ['10 min easy run', '35 min easy with 6× 30-sec light surges', '10 min cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_wint_tue_C: {
    id: 'hyb_wint_tue_C', type: 'hybrid', bgClass: 'bg-z1',
    calShort: 'UT2 Cruise', mobilityBias: 'row',
    erg: {
      name: '75-Min Continuous Cruise',
      items: ['10 min easy paddle (HR < 60% max)', '60 min at UT2 ceiling (SR 18, eyes on split)', '5 min paddle out']
    },
    run: {
      name: '60-Min Easy Long Run', bgClass: 'bg-z1',
      items: ['60 min easy conversational run at UT2', 'Focus on nose-breathing throughout']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_wint_tue_D: {
    id: 'hyb_wint_tue_D', type: 'hybrid', bgClass: 'bg-z1',
    calShort: 'UT2 Blocks', mobilityBias: 'row',
    erg: {
      name: '3×20-Min UT2 Blocks',
      items: ['10 min warm-up', '3×20 min @ UT2 (SR 20), 2 min easy between', '5 min cool-down']
    },
    run: {
      name: '45-Min Base Run + Drills', bgClass: 'bg-z1',
      items: ['5 min walk', '30 min easy UT2 run', '10 min running drills (high knees, A-skips, strides)']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  // ── Thursday (4 variants) — UT1 moderate
  hyb_wint_thu_A: {
    id: 'hyb_wint_thu_A', type: 'hybrid', bgClass: 'bg-z2',
    calShort: 'UT1 Intervals', mobilityBias: 'row',
    erg: {
      name: '6×8-Min UT1 Intervals',
      items: ['10 min easy warm-up', '6×8 min @ UT1 (SR 22), 2 min rest between', '5 min cool-down paddle']
    },
    run: {
      name: '50-Min Moderate Run', bgClass: 'bg-z2',
      items: ['10 min easy run', '30 min UT1 moderate (slightly elevated HR)', '10 min easy cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_wint_thu_B: {
    id: 'hyb_wint_thu_B', type: 'hybrid', bgClass: 'bg-z2',
    calShort: 'UT1 Ladder', mobilityBias: 'row',
    erg: {
      name: '2-3-4-3-2-Min Ladder',
      items: ['10 min easy warm-up', 'Ladder: 2-3-4-3-2 min @ UT1, 90s rest between', 'Repeat ladder once', '10 min cool-down']
    },
    run: {
      name: '45-Min Negative-Split Run', bgClass: 'bg-z2',
      items: ['22 min easy UT2 run', '23 min moderate UT1(last 5 min progressive build)']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_wint_thu_C: {
    id: 'hyb_wint_thu_C', type: 'hybrid', bgClass: 'bg-z2',
    calShort: 'UT1 Sustained', mobilityBias: 'row',
    erg: {
      name: '3×12-Min UT1 Sustained',
      items: ['10 min easy warm-up', '3×12 min @ UT1 (SR 22), 3 min rest between', '8 min cool-down paddle']
    },
    run: {
      name: '55-Min Trail/Road Run', bgClass: 'bg-z2',
      items: ['10 min walk/easy jog', '40 min moderate UT1 run', '5 min easy cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_wint_thu_D: {
    id: 'hyb_wint_thu_D', type: 'hybrid', bgClass: 'bg-z2',
    calShort: 'UT1 Blocks', mobilityBias: 'row',
    erg: {
      name: '2×20-Min UT1 Blocks',
      items: ['10 min easy warm-up', '2×20 min @ UT1 ceiling (SR 22), 5 min rest between', '5 min cool-down']
    },
    run: {
      name: '50-Min Tempo Build Run', bgClass: 'bg-z2',
      items: ['10 min easy', '30 min UT1 run (building last 10 min toward AT)', '10 min easy cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  // ── Monthly benchmark (all blocks) — first Saturday of each non-summer month
  hyb_6k_tt: {
    id: 'hyb_6k_tt', type: 'hybrid', bgClass: 'bg-at',
    calShort: '6k Time Trial', mobilityBias: 'row',
    erg: {
      name: '6,000m Time Trial',
      items: [
        '15 min warm-up — easy paddle + 4×20-stroke builds, building to AT effort',
        '6,000m maximal sustained effort — aim for even or negative split',
        'Log your average split per 500m — this is your benchmark number',
        '10 min easy cool-down paddle'
      ]
    },
    run: {
      name: '45-Min Easy Run (substitute)', bgClass: 'bg-z1',
      items: ['45 min easy UT2 run if no erg access — note in log']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  // ── Saturday (4 variants) — UT2 long volume, no post-workout mobility
  hyb_wint_sat_A: {
    id: 'hyb_wint_sat_A', type: 'hybrid', bgClass: 'bg-z1',
    calShort: 'Long Row', mobilityBias: 'row',
    erg: {
      name: '90-Min Long Steady Row',
      items: ['10 min easy paddle', '75 min continuous at UT2 (SR 18)', '5 min easy paddle out']
    },
    run: {
      name: '70-Min Long Easy Run', bgClass: 'bg-z1',
      items: ['70 min easy UT2 long run', 'Focus on time on feet, not pace']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_wint_sat_B: {
    id: 'hyb_wint_sat_B', type: 'hybrid', bgClass: 'bg-z1',
    calShort: 'Long Intervals', mobilityBias: 'row',
    erg: {
      name: '4×18-Min Long Intervals',
      items: ['10 min warm-up', '4×18 min @ UT2 (SR 20), 3 min easy between', '5 min cool-down']
    },
    run: {
      name: '75-Min Easy Run', bgClass: 'bg-z1',
      items: ['5 min walk', '65 min UT2 easy run', '5 min walk cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_wint_sat_C: {
    id: 'hyb_wint_sat_C', type: 'hybrid', bgClass: 'bg-z1',
    calShort: '10k Moderate', mobilityBias: 'row',
    erg: {
      name: '10,000m Moderate Time Trial',
      items: ['10 min easy paddle', '10,000m @ controlled UT1 (not race pace)', '5 min cool-down']
    },
    run: {
      name: '60-Min Progressive Long Run', bgClass: 'bg-z1',
      items: ['20 min UT2 easy', '30 min UT1 moderate', '10 min UT2 easy cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_wint_sat_D: {
    id: 'hyb_wint_sat_D', type: 'hybrid', bgClass: 'bg-z2',
    calShort: 'Volume Row', mobilityBias: 'row',
    erg: {
      name: '5×12-Min Volume Session',
      items: ['10 min warm-up', '5×12 min @ UT1/UT2 border (SR 20), 2 min easy between', '5 min cool-down']
    },
    run: {
      name: '65-Min Easy + Strides', bgClass: 'bg-z1',
      items: ['55 min easy UT2 run', '6×20-sec strides (full walk recovery between)', '5 min easy cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  // ── Winter Lift A — Mon (primary: DB + rings + pull-up bar; travel: floor + wall only)
  lift_wint_A: {
    id: 'lift_wint_A', type: 'lift', bgClass: 'bg-lift',
    calShort: 'Lift A', mobilityBias: 'leg', logSession: 'A',
    primary: {
      label: 'Primary',
      exercises: [
        { name: 'Goblet Squat', sets: 3, reps: 10, cue: 'Chest tall, knees track toes' },
        { name: 'Ring Row', sets: 3, reps: 8, cue: 'Straight body, pull chest to rings' },
        { name: 'Single-Leg RDL (DB)', sets: 3, reps: 10, cue: 'Hinge from hip, soft knee on standing leg' },
        { name: 'Ring Push-Up', sets: 3, reps: 12, cue: 'Elbows 45°, rings rotate inward at top' },
        { name: 'Ab Wheel Rollout', sets: 2, reps: 8, cue: 'Brace hard, roll until hips sag, return with lats' },
        { name: 'Hollow Body Hold', sets: 2, reps: 1, cue: '20s hold, lower back pressed to floor' }
      ],
      items: ['Goblet Squat 3×10', 'Ring Row 3×8', 'SL RDL 3×10/leg', 'Ring Push-Up 3×12', 'Ab Wheel Rollout 2×8', 'Hollow Body Hold 2×20s']
    },
    travel: {
      label: 'Bodyweight',
      exercises: [
        { name: 'Bodyweight Squat', sets: 3, reps: 15, cue: 'Full depth, 2s pause at bottom' },
        { name: 'Prone Superman Hold', sets: 3, reps: 10, cue: 'Lift arms + legs simultaneously, 3s hold' },
        { name: 'Single-Leg RDL (Bodyweight)', sets: 3, reps: 10, cue: 'Reach fingertips toward floor, balance focus' },
        { name: 'Wall Push-Up / Floor Push-Up', sets: 3, reps: 15, cue: 'Chest to wall or floor, elbows 45°' },
        { name: 'Plank Shoulder Tap', sets: 2, reps: 10, cue: '10 taps/side, minimize hip sway' },
        { name: 'Hollow Body Hold', sets: 2, reps: 1, cue: '20s hold' }
      ],
      items: ['BW Squat 3×15', 'Prone Superman 3×10', 'SL RDL BW 3×10/leg', 'Push-Up (wall/floor) 3×15', 'Plank Shoulder Tap 2×10/side', 'Hollow Body Hold 2×20s']
    }
  },

  lift_wint_A_dl: {
    id: 'lift_wint_A_dl', type: 'lift', bgClass: 'bg-lift',
    calShort: 'Lift A (DL)', mobilityBias: 'leg', logSession: 'A',
    primary: {
      label: 'Primary — Deload',
      exercises: [
        { name: 'Goblet Squat', sets: 2, reps: 10, cue: 'Light load, quality reps' },
        { name: 'Ring Row', sets: 2, reps: 8, cue: 'Controlled tempo' },
        { name: 'Single-Leg RDL (DB)', sets: 2, reps: 8, cue: 'Light weight, balance focus' },
        { name: 'Ring Push-Up', sets: 2, reps: 10, cue: 'Full range, no rush' },
        { name: 'Hollow Body Hold', sets: 2, reps: 1, cue: '15s hold' }
      ],
      items: ['Goblet Squat 2×10 (light)', 'Ring Row 2×8', 'SL RDL 2×8/leg', 'Ring Push-Up 2×10', 'Hollow Body Hold 2×15s']
    },
    travel: {
      label: 'Bodyweight Deload',
      exercises: [
        { name: 'Bodyweight Squat', sets: 2, reps: 12, cue: 'Easy pace, quality movement' },
        { name: 'Prone Superman Hold', sets: 2, reps: 8, cue: '2s hold' },
        { name: 'Floor Push-Up', sets: 2, reps: 10, cue: 'Full range' },
        { name: 'Hollow Body Hold', sets: 2, reps: 1, cue: '15s hold' }
      ],
      items: ['BW Squat 2×12', 'Prone Superman 2×8', 'Push-Up 2×10', 'Hollow Body Hold 2×15s']
    }
  },

  // ── Winter Lift B — Fri
  lift_wint_B: {
    id: 'lift_wint_B', type: 'lift', bgClass: 'bg-lift',
    calShort: 'Lift B', mobilityBias: 'upper', logSession: 'B',
    primary: {
      label: 'Primary',
      exercises: [
        { name: 'DB Romanian Deadlift', sets: 3, reps: 8, cue: 'Neutral spine, feel hamstring load' },
        { name: 'Ring Dip', sets: 3, reps: 8, cue: 'Elbows back, chest slight forward lean' },
        { name: 'DB Single-Arm Row', sets: 3, reps: 10, cue: 'Row elbow past rib, hold 1s at top' },
        { name: 'DB Lateral Raise', sets: 2, reps: 12, cue: 'Lead with elbows, control the descent' },
        { name: 'Copenhagen Plank', sets: 2, reps: 1, cue: '20s/side, hips level' },
        { name: 'Dead Bug', sets: 2, reps: 8, cue: '8 reps/side, exhale on extension' }
      ],
      items: ['DB RDL 3×8', 'Ring Dip 3×8', 'DB Single-Arm Row 3×10/arm', 'DB Lateral Raise 2×12', 'Copenhagen Plank 2×20s/side', 'Dead Bug 2×8/side']
    },
    travel: {
      label: 'Bodyweight',
      exercises: [
        { name: 'Single-Leg Glute Bridge', sets: 3, reps: 12, cue: 'Drive through heel, 1s squeeze at top' },
        { name: 'Prone I/Y/T Raises', sets: 3, reps: 10, cue: '10 reps each letter; scapular retraction focus' },
        { name: 'Scapular Wall Slide', sets: 3, reps: 15, cue: 'Back flat to wall, thumbs up, slide slowly' },
        { name: 'Floor Push-Up', sets: 3, reps: 12, cue: 'Full lockout at top, 2s hold' },
        { name: 'Side-Lying Hip Raise', sets: 2, reps: 15, cue: '15/side, top hip stacked' },
        { name: 'Dead Bug', sets: 2, reps: 8, cue: 'Lower back pinned to floor throughout' }
      ],
      items: ['SL Glute Bridge 3×12/leg', 'Prone I/Y/T Raises 3×10 each', 'Scapular Wall Slide 3×15', 'Floor Push-Up 3×12', 'Side-Lying Hip Raise 2×15/side', 'Dead Bug 2×8/side']
    }
  },

  lift_wint_B_dl: {
    id: 'lift_wint_B_dl', type: 'lift', bgClass: 'bg-lift',
    calShort: 'Lift B (DL)', mobilityBias: 'upper', logSession: 'B',
    primary: {
      label: 'Primary — Deload',
      exercises: [
        { name: 'DB Romanian Deadlift', sets: 2, reps: 8, cue: 'Light load' },
        { name: 'Ring Dip', sets: 2, reps: 6, cue: 'Bodyweight only' },
        { name: 'DB Single-Arm Row', sets: 2, reps: 8, cue: 'Light weight' },
        { name: 'Dead Bug', sets: 2, reps: 6, cue: '6/side' }
      ],
      items: ['DB RDL 2×8 (light)', 'Ring Dip 2×6 (BW)', 'DB Row 2×8/arm', 'Dead Bug 2×6/side']
    },
    travel: {
      label: 'Bodyweight Deload',
      exercises: [
        { name: 'Single-Leg Glute Bridge', sets: 2, reps: 10, cue: 'Quality reps' },
        { name: 'Prone I/Y/T Raises', sets: 2, reps: 8, cue: '8 reps each letter' },
        { name: 'Floor Push-Up', sets: 2, reps: 10, cue: 'Full range' },
        { name: 'Dead Bug', sets: 2, reps: 6, cue: '6/side' }
      ],
      items: ['SL Glute Bridge 2×10/leg', 'Prone I/Y/T 2×8 each', 'Push-Up 2×10', 'Dead Bug 2×6/side']
    }
  },

  // ═══════════════════════════════════════════════════════════════════
  // SPRING SPRINT — Mar-May  |  AT threshold, speed development
  // ═══════════════════════════════════════════════════════════════════

  // ── Tuesday (4 variants) — AT threshold
  hyb_spr_tue_A: {
    id: 'hyb_spr_tue_A', type: 'hybrid', bgClass: 'bg-at',
    calShort: 'AT Intervals', mobilityBias: 'row',
    erg: {
      name: '5×6-Min AT Intervals',
      items: ['10 min warm-up (easy + 4 power strokes)', '5×6 min @ AT (SR 24-26), 2 min rest between', '10 min cool-down']
    },
    run: {
      name: '45-Min Tempo Run', bgClass: 'bg-at',
      items: ['10 min easy warm-up', '25 min tempo run (AT zone, comfortably hard)', '10 min easy cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_spr_tue_B: {
    id: 'hyb_spr_tue_B', type: 'hybrid', bgClass: 'bg-at',
    calShort: 'AT Cruise', mobilityBias: 'row',
    erg: {
      name: '3×10-Min AT Cruise',
      items: ['12 min warm-up', '3×10 min @ AT (SR 26), 3 min rest between', '8 min cool-down']
    },
    run: {
      name: '40-Min Cruise Intervals', bgClass: 'bg-at',
      items: ['10 min easy', '3×8 min @ AT, 2 min easy between', '10 min cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_spr_tue_C: {
    id: 'hyb_spr_tue_C', type: 'hybrid', bgClass: 'bg-at',
    calShort: 'AT Over-Under', mobilityBias: 'row',
    erg: {
      name: 'Over-Under AT Workout',
      items: ['10 min warm-up', '4× (3 min over AT / 3 min under AT), 3 min rest between sets', '10 min cool-down']
    },
    run: {
      name: '45-Min Over-Under Run', bgClass: 'bg-at',
      items: ['10 min easy', '4× (2.5 min hard / 2.5 min easy)', '10 min easy cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_spr_tue_D: {
    id: 'hyb_spr_tue_D', type: 'hybrid', bgClass: 'bg-at',
    calShort: 'AT Long Blocks', mobilityBias: 'row',
    erg: {
      name: '2×15-Min AT Long Blocks',
      items: ['15 min warm-up (with build)', '2×15 min @ AT (SR 26), 5 min rest between', '10 min cool-down']
    },
    run: {
      name: '50-Min Steady Tempo', bgClass: 'bg-at',
      items: ['10 min easy', '30 min steady AT tempo', '10 min easy cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  // ── Thursday (5 variants) — TR/VO2max speed
  hyb_spr_thu_A: {
    id: 'hyb_spr_thu_A', type: 'hybrid', bgClass: 'bg-vo2',
    calShort: 'VO2 Shorts', mobilityBias: 'row',
    erg: {
      name: '8×3-Min VO2max Shorts',
      items: ['15 min warm-up', '8×3 min @ VO2max (SR 28+), 3 min rest between', '10 min cool-down']
    },
    run: {
      name: '40-Min VO2 Run', bgClass: 'bg-vo2',
      items: ['10 min easy', '6×3 min hard / 3 min easy', '10 min cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_spr_thu_B: {
    id: 'hyb_spr_thu_B', type: 'hybrid', bgClass: 'bg-vo2',
    calShort: 'VO2 5-Min', mobilityBias: 'row',
    erg: {
      name: '5×5-Min VO2max Intervals',
      items: ['15 min warm-up', '5×5 min @ VO2max (SR 28-30), 5 min rest between', '10 min cool-down']
    },
    run: {
      name: '45-Min VO2 Cruise', bgClass: 'bg-vo2',
      items: ['10 min easy warm-up', '5×4 min hard / 3 min easy', '10 min cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_spr_thu_C: {
    id: 'hyb_spr_thu_C', type: 'hybrid', bgClass: 'bg-spd',
    calShort: 'Speed Pieces', mobilityBias: 'row',
    erg: {
      name: 'Sprint Power Development',
      items: ['15 min warm-up', '10×1 min sprint / 2 min rest (SR 30+, max effort)', '10 min cool-down']
    },
    run: {
      name: 'Speed Strides + Hills', bgClass: 'bg-spd',
      items: ['10 min easy jog', '8× hill sprint (30s up, walk down)', '10 min easy cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_spr_thu_D: {
    id: 'hyb_spr_thu_D', type: 'hybrid', bgClass: 'bg-vo2',
    calShort: 'VO2 Pyramid', mobilityBias: 'row',
    erg: {
      name: '2-3-5-3-2-Min VO2 Pyramid',
      items: ['15 min warm-up', 'Pyramid: 2-3-5-3-2 min @ VO2max, equal rest between', '10 min cool-down']
    },
    run: {
      name: '45-Min VO2 Pyramid Run', bgClass: 'bg-vo2',
      items: ['10 min easy', 'Pyramid: 2-4-6-4-2 min hard / equal recovery', '10 min cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_spr_thu_E: {
    id: 'hyb_spr_thu_E', type: 'hybrid', bgClass: 'bg-spd',
    calShort: '2k Pace Work', mobilityBias: 'row',
    erg: {
      name: '2k Race Pace Pieces',
      items: ['15 min warm-up with build', '4×500m @ 2k race pace (SR 30+), 4 min rest between', '10 min cool-down']
    },
    run: {
      name: '40-Min Speed Run', bgClass: 'bg-spd',
      items: ['10 min easy', '6×200m fast / 200m jog recovery', '10 min easy cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  // ── Saturday (4 variants) — race simulation, no mobility
  hyb_spr_sat_A: {
    id: 'hyb_spr_sat_A', type: 'hybrid', bgClass: 'bg-at',
    calShort: '6k Sim', mobilityBias: 'row',
    erg: {
      name: '6,000m Race Simulation',
      items: ['15 min warm-up', '6,000m @ race target pace (SR 26-28)', '10 min cool-down']
    },
    run: {
      name: '50-Min AT Progression Run', bgClass: 'bg-at',
      items: ['15 min easy', '25 min AT tempo (building effort)', '10 min easy cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_spr_sat_B: {
    id: 'hyb_spr_sat_B', type: 'hybrid', bgClass: 'bg-at',
    calShort: 'Race-Pace 4×', mobilityBias: 'row',
    erg: {
      name: '4×2k Race-Pace Pieces',
      items: ['15 min warm-up', '4×2,000m @ 2k race pace (SR 28-30), 5 min rest between', '10 min cool-down']
    },
    run: {
      name: '55-Min Race Sim Run', bgClass: 'bg-at',
      items: ['10 min easy', '2×20 min @ hard AT, 5 min easy between', '10 min cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_spr_sat_C: {
    id: 'hyb_spr_sat_C', type: 'hybrid', bgClass: 'bg-vo2',
    calShort: 'Sprint Ladder', mobilityBias: 'row',
    erg: {
      name: '1k Sprint Ladder',
      items: ['15 min warm-up', '500m-1k-1.5k-1k-500m @ race pace, 3-4 min rest between', '10 min cool-down']
    },
    run: {
      name: '45-Min Run Race Sim', bgClass: 'bg-vo2',
      items: ['10 min easy', '5k at 5k race pace effort', '10 min cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_spr_sat_D: {
    id: 'hyb_spr_sat_D', type: 'hybrid', bgClass: 'bg-at',
    calShort: '30-Min Max', mobilityBias: 'row',
    erg: {
      name: '30-Min Sustained Max Effort',
      items: ['15 min warm-up', '30 min max sustainable effort (AT+ ceiling)', '10 min cool-down']
    },
    run: {
      name: '50-Min Hard Effort Run', bgClass: 'bg-at',
      items: ['10 min easy', '30 min hard sustained effort (AT)', '10 min easy cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  // ── Spring Lift A
  lift_spr_A: {
    id: 'lift_spr_A', type: 'lift', bgClass: 'bg-lift',
    calShort: 'Lift A', mobilityBias: 'leg', logSession: 'A',
    primary: {
      label: 'Primary',
      exercises: [
        { name: 'DB Goblet Jump Squat', sets: 3, reps: 8, cue: 'Land soft, full depth before each jump' },
        { name: 'Pull-Up (weighted if able)', sets: 3, reps: 6, cue: 'Dead hang start, chin over bar' },
        { name: 'DB Split Squat', sets: 3, reps: 10, cue: '10/leg, front knee tracks over toes' },
        { name: 'Ring Push-Up + Ring Dip', sets: 3, reps: 8, cue: '8 push-ups + 4 dips = 1 set' },
        { name: 'KB Swing', sets: 3, reps: 15, cue: 'Hip hinge power, not a squat' },
        { name: 'Ab Wheel Rollout', sets: 2, reps: 8, cue: 'Explosive block — brace hard before each rep' }
      ],
      items: ['DB Jump Squat 3×8', 'Pull-Up 3×6', 'DB Split Squat 3×10/leg', 'Ring Push-Up+Dip 3×8+4', 'KB Swing 3×15', 'Ab Wheel Rollout 2×8']
    },
    travel: {
      label: 'Bodyweight',
      exercises: [
        { name: 'Jump Squat', sets: 3, reps: 10, cue: 'Full depth, explosive push through floor' },
        { name: 'Prone Y-Raise', sets: 3, reps: 12, cue: 'Thumbs up, squeeze shoulder blades together' },
        { name: 'Lateral Lunge', sets: 3, reps: 10, cue: '10/side, sit into hip not knee' },
        { name: 'Plyometric Push-Up', sets: 3, reps: 8, cue: 'Hands leave floor at top, land soft' },
        { name: 'Single-Leg Glute Bridge', sets: 3, reps: 12, cue: '12/leg, full hip extension at top' },
        { name: 'Hollow Rock', sets: 2, reps: 1, cue: '20s controlled rocking' }
      ],
      items: ['Jump Squat 3×10', 'Prone Y-Raise 3×12', 'Lateral Lunge 3×10/side', 'Plyo Push-Up 3×8', 'SL Glute Bridge 3×12/leg', 'Hollow Rock 2×20s']
    }
  },

  lift_spr_A_dl: {
    id: 'lift_spr_A_dl', type: 'lift', bgClass: 'bg-lift',
    calShort: 'Lift A (DL)', mobilityBias: 'leg', logSession: 'A',
    primary: {
      label: 'Primary — Deload',
      exercises: [
        { name: 'Goblet Squat', sets: 2, reps: 10, cue: 'No jump today, quality reps' },
        { name: 'Ring Row', sets: 2, reps: 8, cue: 'Bodyweight, controlled' },
        { name: 'DB Split Squat', sets: 2, reps: 8, cue: 'Light load' },
        { name: 'Ring Push-Up', sets: 2, reps: 10, cue: 'Full range' }
      ],
      items: ['Goblet Squat 2×10', 'Ring Row 2×8', 'Split Squat 2×8/leg', 'Ring Push-Up 2×10']
    },
    travel: {
      label: 'Bodyweight Deload',
      exercises: [
        { name: 'Bodyweight Squat', sets: 2, reps: 12, cue: 'Easy depth, quality' },
        { name: 'Prone Y-Raise', sets: 2, reps: 10, cue: '2s hold at top' },
        { name: 'Floor Push-Up', sets: 2, reps: 10, cue: 'Full range' }
      ],
      items: ['BW Squat 2×12', 'Prone Y-Raise 2×10', 'Push-Up 2×10']
    }
  },

  // ── Spring Lift B
  lift_spr_B: {
    id: 'lift_spr_B', type: 'lift', bgClass: 'bg-lift',
    calShort: 'Lift B', mobilityBias: 'upper', logSession: 'B',
    primary: {
      label: 'Primary',
      exercises: [
        { name: 'DB Single-Leg Deadlift', sets: 3, reps: 8, cue: '8/leg, reach DB toward opposite foot' },
        { name: 'Ring Dip + Negative', sets: 3, reps: 8, cue: '8 dips + 3s negative on last rep' },
        { name: 'DB Bent-Over Row', sets: 3, reps: 10, cue: 'Chest parallel to floor, row elbows to ceiling' },
        { name: 'DB External Rotation', sets: 2, reps: 15, cue: '15/arm, elbow pinned to side, thumb up finish' },
        { name: 'Side Plank + Hip Dip', sets: 2, reps: 8, cue: '8 dips/side, hips travel full range' },
        { name: 'Bird-Dog', sets: 2, reps: 10, cue: '10/side, pause 2s at extension' }
      ],
      items: ['DB SL Deadlift 3×8/leg', 'Ring Dip+Neg 3×8', 'DB Bent-Over Row 3×10', 'DB Ext Rotation 2×15/arm', 'Side Plank Hip Dip 2×8/side', 'Bird-Dog 2×10/side']
    },
    travel: {
      label: 'Bodyweight',
      exercises: [
        { name: 'Single-Leg Glute Bridge', sets: 3, reps: 15, cue: '15/leg, drive heel through floor' },
        { name: 'Push-Up to Side Plank', sets: 3, reps: 8, cue: '8/side: push up, rotate to plank, return' },
        { name: 'Prone Superman Alternating', sets: 3, reps: 10, cue: '10/side, opposite arm+leg lift' },
        { name: 'Scapular Wall Slide', sets: 3, reps: 15, cue: 'Arms in goalpost, slide overhead on wall' },
        { name: 'Side Plank Hip Dip', sets: 2, reps: 10, cue: '10/side, hips travel full range' },
        { name: 'Bird-Dog', sets: 2, reps: 10, cue: '10/side, slow and controlled' }
      ],
      items: ['SL Glute Bridge 3×15/leg', 'Push-Up to Side Plank 3×8/side', 'Superman Alt 3×10/side', 'Scapular Wall Slide 3×15', 'Side Plank Hip Dip 2×10/side', 'Bird-Dog 2×10/side']
    }
  },

  lift_spr_B_dl: {
    id: 'lift_spr_B_dl', type: 'lift', bgClass: 'bg-lift',
    calShort: 'Lift B (DL)', mobilityBias: 'upper', logSession: 'B',
    primary: {
      label: 'Primary — Deload',
      exercises: [
        { name: 'DB RDL', sets: 2, reps: 8, cue: 'Light load' },
        { name: 'Ring Dip', sets: 2, reps: 6, cue: 'Bodyweight only' },
        { name: 'DB Row', sets: 2, reps: 8, cue: 'Light weight' },
        { name: 'Bird-Dog', sets: 2, reps: 8, cue: '8/side' }
      ],
      items: ['DB RDL 2×8', 'Ring Dip 2×6', 'DB Row 2×8/arm', 'Bird-Dog 2×8/side']
    },
    travel: {
      label: 'Bodyweight Deload',
      exercises: [
        { name: 'Single-Leg Glute Bridge', sets: 2, reps: 10, cue: 'Easy' },
        { name: 'Prone Superman Alternating', sets: 2, reps: 8, cue: '8/side' },
        { name: 'Floor Push-Up', sets: 2, reps: 10, cue: 'Full range' },
        { name: 'Bird-Dog', sets: 2, reps: 8, cue: '8/side' }
      ],
      items: ['SL Glute Bridge 2×10/leg', 'Superman Alt 2×8/side', 'Push-Up 2×10', 'Bird-Dog 2×8/side']
    }
  },

  // ═══════════════════════════════════════════════════════════════════
  // SUMMER BRIDGE — Jun-Aug  |  Aerobic retention, reduced intensity
  // ═══════════════════════════════════════════════════════════════════

  // ── Tuesday (3 variants)
  hyb_sum_tue_A: {
    id: 'hyb_sum_tue_A', type: 'hybrid', bgClass: 'bg-z2',
    calShort: 'Bridge Row', mobilityBias: 'row',
    erg: {
      name: '50-Min Bridge Steady State',
      items: ['10 min easy warm-up', '35 min at UT1/UT2 (SR 20-22)', '5 min cool-down']
    },
    run: {
      name: '45-Min Moderate Run', bgClass: 'bg-z2',
      items: ['10 min easy', '30 min UT1 moderate run', '5 min walk cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_sum_tue_B: {
    id: 'hyb_sum_tue_B', type: 'hybrid', bgClass: 'bg-z1',
    calShort: 'Easy Row', mobilityBias: 'row',
    erg: {
      name: '60-Min Easy UT2 Aerobic',
      items: ['10 min easy paddle', '45 min at UT2 (SR 18, focus on technique)', '5 min cool-down']
    },
    run: {
      name: '50-Min Easy Base Run', bgClass: 'bg-z1',
      items: ['50 min easy UT2 run', 'Focus on breathing and relaxed form']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_sum_tue_C: {
    id: 'hyb_sum_tue_C', type: 'hybrid', bgClass: 'bg-at',
    calShort: 'AT Touch', mobilityBias: 'row',
    erg: {
      name: '4×5-Min AT Touch Intervals',
      items: ['15 min warm-up', '4×5 min @ AT (SR 26), 3 min rest between', '10 min cool-down']
    },
    run: {
      name: '40-Min Tempo Touch', bgClass: 'bg-at',
      items: ['10 min easy', '3×6 min tempo / 3 min easy', '10 min cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  // ── Thursday (3 variants)
  hyb_sum_thu_A: {
    id: 'hyb_sum_thu_A', type: 'hybrid', bgClass: 'bg-z2',
    calShort: 'UT1 Refresh', mobilityBias: 'row',
    erg: {
      name: '4×10-Min UT1 Refresh',
      items: ['10 min easy warm-up', '4×10 min @ UT1 (SR 22), 3 min rest between', '8 min cool-down']
    },
    run: {
      name: '45-Min UT1 Refresh Run', bgClass: 'bg-z2',
      items: ['10 min easy', '30 min UT1 run (comfortable effort)', '5 min cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_sum_thu_B: {
    id: 'hyb_sum_thu_B', type: 'hybrid', bgClass: 'bg-vo2',
    calShort: 'VO2 Maintain', mobilityBias: 'row',
    erg: {
      name: '6×3-Min VO2 Maintenance',
      items: ['15 min warm-up', '6×3 min @ VO2max (SR 28-30), 3 min rest between', '10 min cool-down']
    },
    run: {
      name: '40-Min VO2 Maintenance Run', bgClass: 'bg-vo2',
      items: ['10 min easy', '5×3 min hard / 3 min easy', '10 min cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_sum_thu_C: {
    id: 'hyb_sum_thu_C', type: 'hybrid', bgClass: 'bg-at',
    calShort: 'AT Sustain', mobilityBias: 'row',
    erg: {
      name: '2×15-Min AT Sustained',
      items: ['15 min warm-up', '2×15 min @ AT (SR 24-26), 5 min rest between', '10 min cool-down']
    },
    run: {
      name: '45-Min Tempo Sustain', bgClass: 'bg-at',
      items: ['10 min easy', '25 min AT tempo', '10 min easy cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  // ── Saturday (3 variants) — no mobility
  hyb_sum_sat_A: {
    id: 'hyb_sum_sat_A', type: 'hybrid', bgClass: 'bg-z1',
    calShort: 'Long Bridge Row', mobilityBias: 'row',
    erg: {
      name: '75-Min Long Bridge Row',
      items: ['10 min easy paddle', '60 min at UT2 (SR 18-20)', '5 min cool-down']
    },
    run: {
      name: '60-Min Easy Long Run', bgClass: 'bg-z1',
      items: ['60 min easy UT2 run']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_sum_sat_B: {
    id: 'hyb_sum_sat_B', type: 'hybrid', bgClass: 'bg-z2',
    calShort: 'Mixed Effort', mobilityBias: 'row',
    erg: {
      name: '3×15-Min Mixed Effort',
      items: ['10 min warm-up', '2×15 min @ UT1, 1×15 min @ AT (5 min rest between)', '8 min cool-down']
    },
    run: {
      name: '55-Min Build Run', bgClass: 'bg-z2',
      items: ['20 min UT2 easy', '25 min UT1 moderate', '10 min UT2 easy cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_sum_sat_C: {
    id: 'hyb_sum_sat_C', type: 'hybrid', bgClass: 'bg-at',
    calShort: 'AT Long', mobilityBias: 'row',
    erg: {
      name: '6k Time Trial Practice',
      items: ['15 min warm-up', '6,000m @ moderate AT effort (not maximal)', '10 min cool-down']
    },
    run: {
      name: '45-Min AT Long Run', bgClass: 'bg-at',
      items: ['10 min easy', '28 min AT tempo run', '7 min easy cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  // ── Summer Lift A
  lift_sum_A: {
    id: 'lift_sum_A', type: 'lift', bgClass: 'bg-lift',
    calShort: 'Lift A', mobilityBias: 'leg', logSession: 'A',
    primary: {
      label: 'Primary',
      exercises: [
        { name: 'DB Goblet Squat', sets: 2, reps: 12, cue: 'Full depth, controlled descent' },
        { name: 'Ring Row', sets: 3, reps: 10, cue: 'Bodyweight, focus on scapular retraction' },
        { name: 'DB Box Step-Up', sets: 2, reps: 12, cue: '12/leg, drive through heel' },
        { name: 'Ring Push-Up', sets: 2, reps: 15, cue: 'Full range, rings rotate inward at top' },
        { name: 'Ab Wheel Rollout', sets: 2, reps: 8, cue: 'Full extension if able, pause, return with lats' },
        { name: 'Dead Bug', sets: 2, reps: 8, cue: '8/side, lower back pinned to floor' }
      ],
      items: ['Goblet Squat 2×12', 'Ring Row 3×10', 'DB Step-Up 2×12/leg', 'Ring Push-Up 2×15', 'Ab Wheel Rollout 2×8', 'Dead Bug 2×8/side']
    },
    travel: {
      label: 'Bodyweight',
      exercises: [
        { name: 'Wall Sit', sets: 2, reps: 1, cue: '45s hold, thighs parallel to floor' },
        { name: 'Prone Y-Raise', sets: 3, reps: 12, cue: 'Thumbs up, hold 2s at top' },
        { name: 'Reverse Lunge', sets: 2, reps: 12, cue: '12/leg, soft landing' },
        { name: 'Floor Push-Up', sets: 2, reps: 15, cue: 'Full lockout each rep' },
        { name: 'Plank', sets: 2, reps: 1, cue: '40s hold, neutral spine' },
        { name: 'Dead Bug', sets: 2, reps: 8, cue: '8/side' }
      ],
      items: ['Wall Sit 2×45s', 'Prone Y-Raise 3×12', 'Reverse Lunge 2×12/leg', 'Push-Up 2×15', 'Plank 2×40s', 'Dead Bug 2×8/side']
    }
  },

  lift_sum_A_dl: {
    id: 'lift_sum_A_dl', type: 'lift', bgClass: 'bg-lift',
    calShort: 'Lift A (DL)', mobilityBias: 'leg', logSession: 'A',
    primary: {
      label: 'Primary — Deload',
      exercises: [
        { name: 'DB Goblet Squat', sets: 2, reps: 10, cue: 'Light load' },
        { name: 'Ring Row', sets: 2, reps: 8, cue: 'Controlled' },
        { name: 'Ring Push-Up', sets: 2, reps: 10, cue: 'Full range' },
        { name: 'Dead Bug', sets: 2, reps: 6, cue: '6/side' }
      ],
      items: ['Goblet Squat 2×10', 'Ring Row 2×8', 'Ring Push-Up 2×10', 'Dead Bug 2×6/side']
    },
    travel: {
      label: 'Bodyweight Deload',
      exercises: [
        { name: 'Wall Sit', sets: 2, reps: 1, cue: '30s hold' },
        { name: 'Floor Push-Up', sets: 2, reps: 10, cue: 'Easy' },
        { name: 'Dead Bug', sets: 2, reps: 6, cue: '6/side' }
      ],
      items: ['Wall Sit 2×30s', 'Push-Up 2×10', 'Dead Bug 2×6/side']
    }
  },

  // ── Summer Lift B
  lift_sum_B: {
    id: 'lift_sum_B', type: 'lift', bgClass: 'bg-lift',
    calShort: 'Lift B', mobilityBias: 'upper', logSession: 'B',
    primary: {
      label: 'Primary',
      exercises: [
        { name: 'DB Romanian Deadlift', sets: 2, reps: 10, cue: 'Moderate weight, perfect hinge' },
        { name: 'Ring Dip', sets: 2, reps: 10, cue: 'Full depth, chest forward' },
        { name: 'DB Lateral Raise', sets: 2, reps: 12, cue: 'Lead elbows, control descent' },
        { name: 'DB Bicep Curl', sets: 2, reps: 12, cue: 'Supinate at top, slow lower' },
        { name: 'Copenhagen Plank', sets: 2, reps: 1, cue: '20s/side, hips level' },
        { name: 'Hollow Body Hold', sets: 2, reps: 1, cue: '25s hold' }
      ],
      items: ['DB RDL 2×10', 'Ring Dip 2×10', 'DB Lateral Raise 2×12', 'DB Bicep Curl 2×12', 'Copenhagen Plank 2×20s/side', 'Hollow Body Hold 2×25s']
    },
    travel: {
      label: 'Bodyweight',
      exercises: [
        { name: 'Single-Leg Glute Bridge', sets: 2, reps: 15, cue: '15/leg, max hip extension' },
        { name: 'Decline Push-Up (feet on wall)', sets: 2, reps: 12, cue: 'Hands on floor, feet 18in up wall' },
        { name: 'Scapular Wall Slide', sets: 3, reps: 15, cue: 'Forearms on wall, slide overhead' },
        { name: 'Side-Lying Hip Abduction', sets: 2, reps: 15, cue: '15/side, toes slightly down' },
        { name: 'Wall Plank', sets: 2, reps: 1, cue: '30s, hands on wall at shoulder height' },
        { name: 'Hollow Body Hold', sets: 2, reps: 1, cue: '25s hold' }
      ],
      items: ['SL Glute Bridge 2×15/leg', 'Decline Push-Up 2×12', 'Scapular Wall Slide 3×15', 'Side-Lying Hip Abd 2×15/side', 'Wall Plank 2×30s', 'Hollow Body Hold 2×25s']
    }
  },

  lift_sum_B_dl: {
    id: 'lift_sum_B_dl', type: 'lift', bgClass: 'bg-lift',
    calShort: 'Lift B (DL)', mobilityBias: 'upper', logSession: 'B',
    primary: {
      label: 'Primary — Deload',
      exercises: [
        { name: 'DB Romanian Deadlift', sets: 2, reps: 8, cue: 'Light' },
        { name: 'Ring Dip', sets: 2, reps: 6, cue: 'BW only' },
        { name: 'DB Lateral Raise', sets: 2, reps: 10, cue: 'Very light' },
        { name: 'Hollow Body Hold', sets: 2, reps: 1, cue: '20s' }
      ],
      items: ['DB RDL 2×8', 'Ring Dip 2×6', 'Lateral Raise 2×10', 'Hollow Body 2×20s']
    },
    travel: {
      label: 'Bodyweight Deload',
      exercises: [
        { name: 'Single-Leg Glute Bridge', sets: 2, reps: 10, cue: '10/leg' },
        { name: 'Floor Push-Up', sets: 2, reps: 10, cue: 'Easy' },
        { name: 'Hollow Body Hold', sets: 2, reps: 1, cue: '20s' }
      ],
      items: ['SL Glute Bridge 2×10/leg', 'Push-Up 2×10', 'Hollow Body 2×20s']
    }
  },

  // ═══════════════════════════════════════════════════════════════════
  // FALL HEAD RACE — Sep-Nov  |  Head race volume, sustained AT
  // ═══════════════════════════════════════════════════════════════════

  // ── Tuesday (4 variants) — AT sustained
  hyb_fall_tue_A: {
    id: 'hyb_fall_tue_A', type: 'hybrid', bgClass: 'bg-at',
    calShort: 'Head Race AT', mobilityBias: 'row',
    erg: {
      name: '4×8-Min Race-Specific AT',
      items: ['15 min warm-up', '4×8 min @ AT (SR 24-26), 3 min rest between', '10 min cool-down']
    },
    run: {
      name: '45-Min AT Tempo', bgClass: 'bg-at',
      items: ['10 min easy', '25 min AT tempo (head race pace feel)', '10 min cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_fall_tue_B: {
    id: 'hyb_fall_tue_B', type: 'hybrid', bgClass: 'bg-at',
    calShort: 'Fall Volume AT', mobilityBias: 'row',
    erg: {
      name: '3×12-Min AT Volume',
      items: ['15 min warm-up', '3×12 min @ AT (SR 24-26), 4 min rest between', '10 min cool-down']
    },
    run: {
      name: '50-Min AT Volume Run', bgClass: 'bg-at',
      items: ['10 min easy', '3×10 min @ AT, 3 min easy between', '10 min cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_fall_tue_C: {
    id: 'hyb_fall_tue_C', type: 'hybrid', bgClass: 'bg-at',
    calShort: 'AT Cruise Pace', mobilityBias: 'row',
    erg: {
      name: '5×5-Min AT Cruise Pace',
      items: ['15 min warm-up', '5×5 min @ AT (SR 26), 2 min rest between', '10 min cool-down']
    },
    run: {
      name: '45-Min Cruise Run', bgClass: 'bg-at',
      items: ['10 min easy', '4×6 min hard / 2 min easy', '10 min cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_fall_tue_D: {
    id: 'hyb_fall_tue_D', type: 'hybrid', bgClass: 'bg-at',
    calShort: 'AT Long Blocks', mobilityBias: 'row',
    erg: {
      name: '2×18-Min AT Long Blocks',
      items: ['15 min warm-up', '2×18 min @ AT (SR 26), 6 min rest between', '10 min cool-down']
    },
    run: {
      name: '55-Min AT Long Run', bgClass: 'bg-at',
      items: ['10 min easy', '35 min AT tempo run', '10 min cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  // ── Thursday (4 variants) — UT1 volume for head race base
  hyb_fall_thu_A: {
    id: 'hyb_fall_thu_A', type: 'hybrid', bgClass: 'bg-z2',
    calShort: 'UT1 Head Race', mobilityBias: 'row',
    erg: {
      name: '5×8-Min UT1 Head Race Prep',
      items: ['10 min warm-up', '5×8 min @ UT1 (SR 22), 3 min rest between', '10 min cool-down']
    },
    run: {
      name: '50-Min UT1 Run', bgClass: 'bg-z2',
      items: ['10 min easy', '35 min UT1 sustained run', '5 min easy cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_fall_thu_B: {
    id: 'hyb_fall_thu_B', type: 'hybrid', bgClass: 'bg-z2',
    calShort: 'UT1 Volume', mobilityBias: 'row',
    erg: {
      name: '3×15-Min UT1 Volume',
      items: ['10 min warm-up', '3×15 min @ UT1 (SR 22), 4 min rest between', '8 min cool-down']
    },
    run: {
      name: '55-Min UT1 Volume Run', bgClass: 'bg-z2',
      items: ['10 min easy', '40 min UT1 volume run', '5 min easy cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_fall_thu_C: {
    id: 'hyb_fall_thu_C', type: 'hybrid', bgClass: 'bg-z2',
    calShort: 'UT1 Ladder', mobilityBias: 'row',
    erg: {
      name: '4-6-8-6-4-Min UT1 Ladder',
      items: ['10 min warm-up', '4-6-8-6-4 min @ UT1 (SR 22), 2 min rest between', '8 min cool-down']
    },
    run: {
      name: '45-Min UT1 Ladder Run', bgClass: 'bg-z2',
      items: ['5 min easy', '8-12-16-12-8 min alternating UT1/UT2 effort', '5 min cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_fall_thu_D: {
    id: 'hyb_fall_thu_D', type: 'hybrid', bgClass: 'bg-z2',
    calShort: 'UT1 Long Blocks', mobilityBias: 'row',
    erg: {
      name: '2×20-Min UT1 Long Blocks',
      items: ['10 min warm-up', '2×20 min @ UT1 (SR 22), 5 min rest between', '5 min cool-down']
    },
    run: {
      name: '60-Min UT1 Long Blocks', bgClass: 'bg-z2',
      items: ['10 min easy', '2×22 min UT1/ 5 min easy between', '5 min cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  // ── Saturday (5 variants) — head race simulation, no mobility
  hyb_fall_sat_A: {
    id: 'hyb_fall_sat_A', type: 'hybrid', bgClass: 'bg-at',
    calShort: 'Head Race Sim', mobilityBias: 'row',
    erg: {
      name: '5km Head Race Simulation',
      items: ['15 min warm-up', '5,000m @ head race pace (SR 26-28)', '10 min cool-down']
    },
    run: {
      name: '45-Min Head Race Run Sim', bgClass: 'bg-at',
      items: ['10 min easy', '25 min AT hard (race simulation)', '10 min cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_fall_sat_B: {
    id: 'hyb_fall_sat_B', type: 'hybrid', bgClass: 'bg-at',
    calShort: '2× Head Race', mobilityBias: 'row',
    erg: {
      name: '2×4km Race Pace',
      items: ['15 min warm-up', '2×4,000m @ race pace (SR 26-28), 6 min rest between', '10 min cool-down']
    },
    run: {
      name: '55-Min Race Pace Run', bgClass: 'bg-at',
      items: ['10 min easy', '2×18 min hard AT / 5 min easy between', '10 min cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_fall_sat_C: {
    id: 'hyb_fall_sat_C', type: 'hybrid', bgClass: 'bg-z2',
    calShort: 'Long Volume', mobilityBias: 'row',
    erg: {
      name: '90-Min Long Erg Volume',
      items: ['10 min warm-up', '75 min at UT1 (SR 20-22)', '5 min cool-down']
    },
    run: {
      name: '70-Min Long Run', bgClass: 'bg-z2',
      items: ['10 min easy', '55 min UT1 long run', '5 min easy cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_fall_sat_D: {
    id: 'hyb_fall_sat_D', type: 'hybrid', bgClass: 'bg-at',
    calShort: 'AT Tech Pieces', mobilityBias: 'row',
    erg: {
      name: '3×3k AT Technical Pieces',
      items: ['15 min warm-up', '3×3,000m @ AT (SR 26), 5 min rest between', '10 min cool-down']
    },
    run: {
      name: '50-Min AT Tempo', bgClass: 'bg-at',
      items: ['10 min easy', '30 min AT tempo', '10 min cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  hyb_fall_sat_E: {
    id: 'hyb_fall_sat_E', type: 'hybrid', bgClass: 'bg-at',
    calShort: 'Pre-Race Tune', mobilityBias: 'row',
    erg: {
      name: 'Pre-Race Tune-Up',
      items: ['15 min easy warm-up', '3×1,500m @ race pace + 5s (SR 28), 4 min rest between', '10 min cool-down']
    },
    run: {
      name: '35-Min Pre-Race Run', bgClass: 'bg-at',
      items: ['10 min easy', '3×5 min race pace / 3 min easy', '10 min cool-down']
    },
    clubLog: CLUB_LOG_CONFIG
  },

  // ── Fall Lift A
  lift_fall_A: {
    id: 'lift_fall_A', type: 'lift', bgClass: 'bg-lift',
    calShort: 'Lift A', mobilityBias: 'leg', logSession: 'A',
    primary: {
      label: 'Primary',
      exercises: [
        { name: 'DB Goblet Squat', sets: 3, reps: 8, cue: 'Loaded, controlled tempo 3-1-1' },
        { name: 'Pull-Up or Ring Row', sets: 3, reps: 8, cue: 'Full hang to chin over bar' },
        { name: 'Single-Leg RDL (DB)', sets: 3, reps: 8, cue: '8/leg, slow eccentric' },
        { name: 'Ring Push-Up', sets: 3, reps: 10, cue: 'Rings rotate inward, full range' },
        { name: 'KB Swing', sets: 3, reps: 12, cue: 'Hip drive only, arms are ropes' },
        { name: 'Ab Wheel Rollout', sets: 2, reps: 8, cue: 'Crisp reps — stop before hips sag' }
      ],
      items: ['Goblet Squat 3×8', 'Pull-Up/Ring Row 3×8', 'SL RDL 3×8/leg', 'Ring Push-Up 3×10', 'KB Swing 3×12', 'Ab Wheel Rollout 2×8']
    },
    travel: {
      label: 'Bodyweight',
      exercises: [
        { name: 'Jump Squat', sets: 3, reps: 8, cue: 'Land soft, immediate descent' },
        { name: 'Prone I/Y/T Raises', sets: 3, reps: 10, cue: '10 reps each letter' },
        { name: 'Single-Leg RDL (Bodyweight)', sets: 3, reps: 8, cue: '8/leg, reach forward' },
        { name: 'Floor Push-Up', sets: 3, reps: 12, cue: 'Slow 3s descent' },
        { name: 'Hollow Body Hold', sets: 2, reps: 1, cue: '20s hold' },
        { name: 'Plank Shoulder Tap', sets: 2, reps: 10, cue: '10/side, stable hips' }
      ],
      items: ['Jump Squat 3×8', 'Prone I/Y/T 3×10 each', 'SL RDL BW 3×8/leg', 'Push-Up 3×12', 'Hollow Body 2×20s', 'Plank Shoulder Tap 2×10/side']
    }
  },

  lift_fall_A_dl: {
    id: 'lift_fall_A_dl', type: 'lift', bgClass: 'bg-lift',
    calShort: 'Lift A (DL)', mobilityBias: 'leg', logSession: 'A',
    primary: {
      label: 'Primary — Deload',
      exercises: [
        { name: 'Goblet Squat', sets: 2, reps: 8, cue: 'Light load' },
        { name: 'Ring Row', sets: 2, reps: 8, cue: 'BW, easy' },
        { name: 'Ring Push-Up', sets: 2, reps: 8, cue: 'Full range' },
        { name: 'Hollow Body Hold', sets: 2, reps: 1, cue: '15s' }
      ],
      items: ['Goblet Squat 2×8', 'Ring Row 2×8', 'Ring Push-Up 2×8', 'Hollow Body 2×15s']
    },
    travel: {
      label: 'Bodyweight Deload',
      exercises: [
        { name: 'BW Squat', sets: 2, reps: 10, cue: 'Easy' },
        { name: 'Prone Y-Raise', sets: 2, reps: 8, cue: 'Hold 2s' },
        { name: 'Floor Push-Up', sets: 2, reps: 10, cue: 'Easy' }
      ],
      items: ['BW Squat 2×10', 'Prone Y-Raise 2×8', 'Push-Up 2×10']
    }
  },

  // ── Fall Lift B
  lift_fall_B: {
    id: 'lift_fall_B', type: 'lift', bgClass: 'bg-lift',
    calShort: 'Lift B', mobilityBias: 'upper', logSession: 'B',
    primary: {
      label: 'Primary',
      exercises: [
        { name: 'DB Romanian Deadlift', sets: 3, reps: 8, cue: 'Loaded, neutral spine' },
        { name: 'Ring Dip', sets: 3, reps: 8, cue: 'Full depth, forward lean' },
        { name: 'DB Single-Arm Row', sets: 3, reps: 8, cue: '8/arm, hold 1s at top' },
        { name: 'DB External Rotation', sets: 2, reps: 12, cue: '12/arm, rotator cuff health priority' },
        { name: 'Copenhagen Plank', sets: 2, reps: 1, cue: '20s/side' },
        { name: 'Bird-Dog', sets: 2, reps: 10, cue: '10/side, spine neutral' }
      ],
      items: ['DB RDL 3×8', 'Ring Dip 3×8', 'DB Single-Arm Row 3×8/arm', 'DB Ext Rotation 2×12/arm', 'Copenhagen Plank 2×20s/side', 'Bird-Dog 2×10/side']
    },
    travel: {
      label: 'Bodyweight',
      exercises: [
        { name: 'Single-Leg Glute Bridge', sets: 3, reps: 12, cue: '12/leg, full hip extension' },
        { name: 'Scapular Wall Slide', sets: 3, reps: 15, cue: 'Elbows on wall, slide overhead' },
        { name: 'Floor Push-Up', sets: 3, reps: 12, cue: '3s descent' },
        { name: 'Prone Superman Alternating', sets: 3, reps: 10, cue: '10/side, 2s hold' },
        { name: 'Side Plank', sets: 2, reps: 1, cue: '25s/side, hips stacked' },
        { name: 'Bird-Dog', sets: 2, reps: 10, cue: '10/side' }
      ],
      items: ['SL Glute Bridge 3×12/leg', 'Scapular Wall Slide 3×15', 'Push-Up 3×12', 'Superman Alt 3×10/side', 'Side Plank 2×25s/side', 'Bird-Dog 2×10/side']
    }
  },

  lift_fall_B_dl: {
    id: 'lift_fall_B_dl', type: 'lift', bgClass: 'bg-lift',
    calShort: 'Lift B (DL)', mobilityBias: 'upper', logSession: 'B',
    primary: {
      label: 'Primary — Deload',
      exercises: [
        { name: 'DB RDL', sets: 2, reps: 8, cue: 'Light' },
        { name: 'Ring Dip', sets: 2, reps: 6, cue: 'BW' },
        { name: 'DB Row', sets: 2, reps: 8, cue: 'Light' },
        { name: 'Bird-Dog', sets: 2, reps: 8, cue: '8/side' }
      ],
      items: ['DB RDL 2×8', 'Ring Dip 2×6', 'DB Row 2×8/arm', 'Bird-Dog 2×8/side']
    },
    travel: {
      label: 'Bodyweight Deload',
      exercises: [
        { name: 'Single-Leg Glute Bridge', sets: 2, reps: 10, cue: '10/leg' },
        { name: 'Scapular Wall Slide', sets: 2, reps: 12, cue: 'Easy' },
        { name: 'Floor Push-Up', sets: 2, reps: 10, cue: 'Full range' },
        { name: 'Bird-Dog', sets: 2, reps: 8, cue: '8/side' }
      ],
      items: ['SL Glute Bridge 2×10/leg', 'Scapular Wall Slide 2×12', 'Push-Up 2×10', 'Bird-Dog 2×8/side']
    }
  },

  // ═══════════════════════════════════════════════════════════════════
  // SPECIAL SESSIONS
  // ═══════════════════════════════════════════════════════════════════

  wk_active_recovery: {
    id: 'wk_active_recovery', type: 'recovery', bgClass: 'bg-restore',
    calShort: 'Recovery', mobilityBias: 'recovery',
    items: [
      '20-30 min easy walk or light cycling',
      '10-15 min foam rolling (quads, hamstrings, thoracic spine)',
      '5 min box breathing (4-count in / 4 hold / 4 out)'
    ]
  },

  wk_restoration: {
    id: 'wk_restoration', type: 'restoration', bgClass: 'bg-restore',
    calShort: 'Recovery', mobilityBias: null,
    items: [
      '20-min deep restoration flow',
      'Hips → Spine → Shoulders sequence',
      'Guided breathing throughout'
    ]
  }

};
