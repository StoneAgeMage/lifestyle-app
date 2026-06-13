// ============================================================
// DATA-WORKOUTS — block-aware session library
// Equipment: Dumbbells ≤70 lb · Pull-up bar · Gymnastics rings
//
// bgClass quick-reference:
//   bg-z1      = Zone 1 easy aerobic    (light blue)
//   bg-z2      = Zone 2 moderate aerobic (medium blue)
//   bg-at      = Anaerobic threshold     (orange)
//   bg-vo2     = VO2max intervals        (red)
//   bg-spd     = Speed / sprint pieces   (purple)
//   bg-lift    = Strength session        (gold)
//   bg-restore = Restoration day        (teal)
//
// mobilityBias → key into POST_WORKOUT_ROUTINES:
//   'row' | 'leg' | 'upper'
// ============================================================

const WORKOUT_LIBRARY = {

  // ==========================================================
  // WINTER BLOCK — Erg Sessions
  // ==========================================================

  wk_wint_z1_45: {
    id: 'wk_wint_z1_45', name: '45-Min Steady State',
    type: 'erg', ergType: 'z1', bgClass: 'bg-z1', calShort: 'Z1 · 45′',
    mobilityBias: 'row',
    items: [
      { t: '45-Min Continuous Row', d: 'SR 18–20 · HR cap 140 bpm. Breathe through your nose — if you can\'t, you\'re too hard. Rhythm over resistance.' },
      { t: 'Optional Rate Play', d: 'Every 10 min: 10 strokes at SR +2, settle back. Stay aerobic the whole piece.' },
      { t: 'Catch Cue', d: 'Focus on body angle — lean to the catch before the hands arrive. Blade enters silent.' }
    ]
  },

  wk_wint_z1_60: {
    id: 'wk_wint_z1_60', name: '60-Min Long Steady State',
    type: 'erg', ergType: 'z1', bgClass: 'bg-z1', calShort: 'Z1 · 60′',
    mobilityBias: 'row',
    items: [
      { t: '60-Min Continuous Row', d: 'SR 18–20 · HR 125–138 bpm. The long aerobic investment. Effort is "I could hold this forever".' },
      { t: 'Mental Anchor', d: 'Split the 60 min into three 20-min focus blocks: catch, drive, finish. One cue per block.' },
      { t: 'Fueling Note', d: 'Have water + a small snack ready. Eat oats 60–90 min before.' }
    ]
  },

  wk_wint_z2_rate: {
    id: 'wk_wint_z2_rate', name: 'Rate Ladder — Z2',
    type: 'erg', ergType: 'z2', bgClass: 'bg-z2', calShort: 'Z2 Rate',
    mobilityBias: 'row',
    items: [
      { t: 'Warm-up 5 min', d: 'Easy SR 18.' },
      { t: 'Rate Ladder × 3', d: '5 min @ SR 18 → 5 min @ SR 20 → 5 min @ SR 22 → back to 18. Total: 45 min. Constant feel — let the rating do the work, don\'t change pressure.' },
      { t: 'Goal', d: 'Same split across all rates. Any drift means you\'re applying more pressure at higher rates. Fix that.' },
      { t: 'Cool-down 5 min', d: 'Light paddle SR 16.' }
    ]
  },

  wk_wint_z1_30: {
    id: 'wk_wint_z1_30', name: 'Easy 30-Min Flush',
    type: 'erg', ergType: 'z1', bgClass: 'bg-z1', calShort: 'Z1 · 30′',
    mobilityBias: 'row',
    items: [
      { t: '30-Min Easy Row (Deload)', d: 'SR 18 · HR <130. Pure aerobic flush. This is a recovery session — do not compete with yourself.' }
    ]
  },

  wk_wint_at_4x10: {
    id: 'wk_wint_at_4x10', name: '4 × 10-Min AT Intervals',
    type: 'erg', ergType: 'at', bgClass: 'bg-at', calShort: 'AT 4×10′',
    mobilityBias: 'row',
    items: [
      { t: 'Warm-up 10 min', d: 'Build from SR 18 to SR 22. Last 2 min at target rate.' },
      { t: '4 × 10 min — Anaerobic Threshold', d: 'SR 22–24 · HR 155–165 bpm. 3 min rest between. "Comfortably hard" — short sentences only.' },
      { t: 'Execution', d: 'Hold the same split across all 4 reps. Reps 3–4 should feel like work. If rep 1 felt like work, you went too hard.' },
      { t: 'Cool-down 5 min', d: 'SR 16, complete flush.' }
    ]
  },

  wk_wint_threshold_20: {
    id: 'wk_wint_threshold_20', name: '20-Min Threshold Test',
    type: 'erg', ergType: 'at', bgClass: 'bg-at', calShort: 'FTP Test',
    mobilityBias: 'row',
    items: [
      { t: 'Warm-up 15 min', d: 'Build to SR 22. 3 × 1-min pickups with 2-min rest.' },
      { t: '20-Min Max Effort', d: 'SR 24 · All-out sustainable effort. This is your FTP benchmark — every 4 weeks, track your split improvement here.' },
      { t: 'Execution', d: 'Go out slightly conservative first 5 min. Build through the middle. Empty the tank in the last 2 min.' },
      { t: 'Log It', d: 'Average split → your AT split. Target this split in your intervals throughout the block.' }
    ]
  },

  wk_wint_z1_tech: {
    id: 'wk_wint_z1_tech', name: 'Technical Paddle',
    type: 'erg', ergType: 'z1', bgClass: 'bg-z1', calShort: 'Z1 Tech',
    mobilityBias: 'row',
    items: [
      { t: '40-Min Z1 Technical Focus', d: 'SR 18–20 · HR <135. Pick one technical element per 10-min block and drill it obsessively.' },
      { t: 'Block 1 — Catch', d: '10 min. Pause drill: hesitate at the catch. Feel blade enter before legs drive. No splash.' },
      { t: 'Block 2 — Drive Sequencing', d: '10 min. Legs → back → arms, in that strict order. Resist the urge to pull early.' },
      { t: 'Block 3 — Finish', d: '10 min. Controlled extraction. Hands away fast and flat before the body rocks over.' },
      { t: 'Block 4 — Free Row', d: '10 min. Integrate all 3. Don\'t think — just feel.' }
    ]
  },

  wk_wint_z1_fartlek: {
    id: 'wk_wint_z1_fartlek', name: 'Aerobic Fartlek',
    type: 'erg', ergType: 'z1', bgClass: 'bg-z1', calShort: 'Z1 Fartlek',
    mobilityBias: 'row',
    items: [
      { t: '40-Min Aerobic Fartlek', d: 'SR 18–22 · Stay in Z1 the entire time. The only variable is rate.' },
      { t: 'Structure', d: '5-min easy @ SR 18 → 3-min push @ SR 22 → back to SR 18. Repeat for 40 min. Judge pace only by feel and HR, not by split.' },
      { t: 'Purpose', d: 'Build the aerobic bandwidth — the ability to absorb rate surges without going anaerobic. Direct head race carryover.' }
    ]
  },


  // ==========================================================
  // WINTER BLOCK — Strength Sessions
  // ==========================================================

  wk_wint_lift_a: {
    id: 'wk_wint_lift_a', name: 'Winter Strength A — Heavy Hinge + Pull',
    type: 'lift', bgClass: 'bg-lift', calShort: 'Lift A',
    mobilityBias: 'leg', logSession: 'A',
    exercises: ['DB Romanian Deadlift', 'DB Pendlay Row', 'Ring Row (feet elevated)', 'DB Hip Thrust', 'Ring Ab Fallout'],
    items: [
      { t: 'DB Romanian Deadlift', d: '4 × 6 · 55–70 lb · Hip hinge, soft knee, DBs skim shins · 3 min rest · Add 2.5–5 lb when you own all 6 reps' },
      { t: 'DB Pendlay Row', d: '4 × 8 · 45–55 lb · Dead-stop each rep from floor, chest parallel · Scapular retraction at top · 2 min rest' },
      { t: 'Ring Row (feet elevated)', d: '3 × 10 · Rings low (harder) or high (easier) · Full extension start, chest to rings · 90 sec rest' },
      { t: 'DB Hip Thrust', d: '3 × 12 · 40–50 lb · 2-sec hold at lockout · Posterior pelvic tilt — ribs down · 90 sec rest' },
      { t: 'Ring Ab Fallout', d: '3 × 8 · Rings at hip height · Full extension, hollow body throughout · Slow 3-sec return · 60 sec rest' }
    ]
  },

  wk_wint_lift_a_dl: {
    id: 'wk_wint_lift_a_dl', name: 'Winter Strength A — Deload',
    type: 'lift', bgClass: 'bg-lift', calShort: 'Lift A ↓',
    mobilityBias: 'leg', logSession: 'A',
    exercises: ['DB Romanian Deadlift', 'DB Pendlay Row', 'Ring Row (feet elevated)', 'DB Hip Thrust', 'Ring Ab Fallout'],
    items: [
      { t: 'Deload Week', d: 'Drop all loads by 40%. Keep movement quality perfect. 3 sets max per exercise. Nervous system recovers — next week you\'ll feel the adaptation.' },
      { t: 'DB Romanian Deadlift', d: '3 × 8 · ~35–40 lb · Perfect hinge, no rushing' },
      { t: 'DB Pendlay Row', d: '3 × 8 · ~25–30 lb · Focus on scapular control' },
      { t: 'Ring Row + Hip Thrust + Ab Fallout', d: '3 × 10 each · Bodyweight / light · Move well, breathe well' }
    ]
  },

  wk_wint_lift_b: {
    id: 'wk_wint_lift_b', name: 'Winter Strength B — Unilateral + Stability',
    type: 'lift', bgClass: 'bg-lift', calShort: 'Lift B',
    mobilityBias: 'leg', logSession: 'B',
    exercises: ['Bulgarian Split Squat (DBs)', 'Single-Leg Romanian Deadlift', 'Ring Push-up (feet elevated)', 'Copenhagen Plank', 'Single-Arm DB Row'],
    items: [
      { t: 'Bulgarian Split Squat (DBs)', d: '4 × 8 / side · 30–40 lb · Rear foot on bench · Vertical shin · 3 min rest · The great asymmetry revealer' },
      { t: 'Single-Leg Romanian Deadlift', d: '3 × 10 / side · 25–35 lb · Hinge until torso parallel · Hip stays square · 2 min rest' },
      { t: 'Ring Push-up (feet elevated)', d: '3 × 10 · Rings allow natural wrist rotation — protect elbows and shoulders · Full ROM, chest to rings' },
      { t: 'Copenhagen Plank', d: '3 × 20 sec / side · Top foot on bench · Hip adductor + lateral stability · Critical for single-blade rowing balance' },
      { t: 'Single-Arm DB Row', d: '4 × 10 / side · 40–50 lb · Brace core against rotation · Elbow drives past hip · 2 min rest' }
    ]
  },

  wk_wint_lift_b_dl: {
    id: 'wk_wint_lift_b_dl', name: 'Winter Strength B — Deload',
    type: 'lift', bgClass: 'bg-lift', calShort: 'Lift B ↓',
    mobilityBias: 'leg', logSession: 'B',
    exercises: ['Bulgarian Split Squat (DBs)', 'Single-Leg Romanian Deadlift', 'Ring Push-up (feet elevated)', 'Copenhagen Plank', 'Single-Arm DB Row'],
    items: [
      { t: 'Deload Week', d: '40% load reduction, 3 sets, prioritize movement quality over stimulus. Both legs, both sides.' }
    ]
  },


  // ==========================================================
  // SPRING BLOCK — Erg Sessions
  // ==========================================================

  wk_spr_vo2_5x4: {
    id: 'wk_spr_vo2_5x4', name: '5 × 4-Min VO2max',
    type: 'erg', ergType: 'vo2', bgClass: 'bg-vo2', calShort: 'VO2 5×4′',
    mobilityBias: 'row',
    items: [
      { t: 'Warm-up 12 min', d: 'Build from SR 20 → 28. 3 × 20-stroke pickups with 1-min rest.' },
      { t: '5 × 4 min / 3 min rest', d: 'SR 30–32 · All-out sustainable · HR 90–95% max. Each interval should feel like you\'re on the edge of not completing it.' },
      { t: 'Execution', d: 'Rate matters more than split. High rate, full compression, strong drive. Blade entry and extraction must be clean under fatigue.' },
      { t: 'Cool-down 10 min', d: 'Easy SR 16.' }
    ]
  },

  wk_spr_speed_6x500: {
    id: 'wk_spr_speed_6x500', name: '6 × 500m Speed Pieces',
    type: 'erg', ergType: 'spd', bgClass: 'bg-spd', calShort: 'Speed 6×500',
    mobilityBias: 'row',
    items: [
      { t: 'Warm-up 12 min', d: 'Easy build. 4 × 10-stroke starts with full recovery.' },
      { t: '6 × 500m / 4 min rest', d: 'SR 32–34 · Race-pace feel. Each rep: 3-stroke power start → settle into race rhythm at SR 32.' },
      { t: 'Goal', d: 'Consistent 500m splits. The 5th and 6th should match the 1st and 2nd. If they slow dramatically, you went out too hard.' },
      { t: 'Cool-down 10 min', d: 'Easy paddle.' }
    ]
  },

  wk_spr_at_30: {
    id: 'wk_spr_at_30', name: '30-Min AT Steady',
    type: 'erg', ergType: 'at', bgClass: 'bg-at', calShort: 'AT · 30′',
    mobilityBias: 'row',
    items: [
      { t: 'Warm-up 10 min', d: 'Build to SR 26.' },
      { t: '30-Min Threshold', d: 'SR 26–28 · HR AT range (~155–165). Comfortably hard. This is head race pace — own it.' },
      { t: 'Split discipline', d: 'Set a target split from your 20-min FTP test (add ~3–5 sec for 30 min). Hold it.' },
      { t: 'Cool-down 5 min', d: 'SR 16.' }
    ]
  },

  wk_spr_race_pace: {
    id: 'wk_spr_race_pace', name: 'Race-Pace Simulation',
    type: 'erg', ergType: 'spd', bgClass: 'bg-spd', calShort: 'Race Pace',
    mobilityBias: 'row',
    items: [
      { t: 'Warm-up 15 min', d: 'Full race warm-up protocol. 4 × 20-stroke pieces at race rate.' },
      { t: '4 × 2-min / 4-min rest', d: 'SR 32–34 · Full race-pace effort. 1,000m sprint simulation — go out hard and hold it.' },
      { t: 'Focus', d: 'Work on the race-shape: aggressive start, settle, hold through 750m, build for the finish. NW Regionals is a 1,000m — the whole thing is a sprint.' },
      { t: 'Cool-down 10 min', d: 'Flush thoroughly. HR should be under 130 before you stop.' }
    ]
  },

  wk_spr_z2_30: {
    id: 'wk_spr_z2_30', name: 'Easy Z2 / Deload',
    type: 'erg', ergType: 'z2', bgClass: 'bg-z2', calShort: 'Z2 · 30′',
    mobilityBias: 'row',
    items: [
      { t: '30-Min Aerobic Z2', d: 'SR 20–22 · HR 140–150. Pre-race taper or deload week. Maintain feel without creating fatigue.' }
    ]
  },

  wk_spr_z1_tech: {
    id: 'wk_spr_z1_tech', name: 'Technical Warm-down',
    type: 'erg', ergType: 'z1', bgClass: 'bg-z1', calShort: 'Z1 Tech',
    mobilityBias: 'row',
    items: [
      { t: '30-Min Z1 Technical Row', d: 'SR 18–20 · HR <135. After 2 high-intensity days this week, Friday is pure aerobic maintenance. Fix technique while fresh.' }
    ]
  },


  // ==========================================================
  // SPRING BLOCK — Strength Sessions
  // ==========================================================

  wk_spr_lift_a: {
    id: 'wk_spr_lift_a', name: 'Spring Strength A — Power + Explosive Pull',
    type: 'lift', bgClass: 'bg-lift', calShort: 'Power A',
    mobilityBias: 'leg', logSession: 'A',
    exercises: ['DB Jump Squat', 'Weighted Pull-up', 'DB Clean + Press', 'Ring Dip', 'DB Bent Row (heavy)'],
    items: [
      { t: 'DB Jump Squat', d: '4 × 5 · 20–25 lb · Sub-max jump, land quietly and reset · 3 min rest · Power development for race-start explosiveness' },
      { t: 'Weighted Pull-up', d: '4 × 5 · +10–20 lb belt or DB between feet · Full ROM · 3 min rest · Posterior chain upper-body anchor' },
      { t: 'DB Clean + Press', d: '4 × 5 / side · 30–35 lb · Hip hinge → shrug → catch → press in one fluid chain · 2 min rest' },
      { t: 'Ring Dip', d: '3 × 8 · Full ring dip, complete lockout · Rings turned out at bottom for shoulder safety · 90 sec rest' },
      { t: 'DB Bent Row (heavy)', d: '4 × 6 · 55–65 lb · Double overhand, chest parallel, dead-stop · 2 min rest' }
    ]
  },

  wk_spr_lift_a_dl: {
    id: 'wk_spr_lift_a_dl', name: 'Spring Strength A — Deload',
    type: 'lift', bgClass: 'bg-lift', calShort: 'Power A ↓',
    mobilityBias: 'leg', logSession: 'A',
    exercises: ['DB Jump Squat', 'Weighted Pull-up', 'DB Clean + Press', 'Ring Dip', 'DB Bent Row (heavy)'],
    items: [
      { t: 'Deload / Pre-Race Taper', d: 'Reduce loads 40%, cut to 3 sets. Maintain neural patterns — don\'t create new soreness. Race prep priority over training stimulus.' }
    ]
  },

  wk_spr_lift_b: {
    id: 'wk_spr_lift_b', name: 'Spring Strength B — Unilateral Power + Rings',
    type: 'lift', bgClass: 'bg-lift', calShort: 'Power B',
    mobilityBias: 'upper', logSession: 'B',
    exercises: ['Single-Leg Box Jump', 'Bulgarian Split Squat (DBs)', 'Single-Arm DB Row (explosive)', 'Ring Push-up', 'Hanging Leg Raise'],
    items: [
      { t: 'Single-Leg Box Jump', d: '3 × 4 / side · Step-up style → explosive jump off one leg onto box or step · Land controlled · 3 min rest' },
      { t: 'Bulgarian Split Squat (DBs)', d: '4 × 6 / side · 40–50 lb · Heavier than winter — power-strength continuum · 3 min rest' },
      { t: 'Single-Arm DB Row (explosive)', d: '4 × 8 / side · 50–55 lb · Pull explosively, controlled lowering · 2 min rest' },
      { t: 'Ring Push-up', d: '3 × 12 · Rings at floor height, feet on ground · Rings turned out at bottom · Scapular stability + natural rotation' },
      { t: 'Hanging Leg Raise', d: '3 × 10 · From pull-up bar · Legs straight if possible, tuck if not · Posterior pelvic tilt — don\'t swing' }
    ]
  },

  wk_spr_lift_b_dl: {
    id: 'wk_spr_lift_b_dl', name: 'Spring Strength B — Deload',
    type: 'lift', bgClass: 'bg-lift', calShort: 'Power B ↓',
    mobilityBias: 'upper', logSession: 'B',
    exercises: ['Single-Leg Box Jump', 'Bulgarian Split Squat (DBs)', 'Single-Arm DB Row (explosive)', 'Ring Push-up', 'Hanging Leg Raise'],
    items: [
      { t: 'Deload / Pre-Race Taper', d: '3 sets, 40% load reduction. 3–5 days before race: skip explosive work (jumps). Do controlled versions only.' }
    ]
  },


  // ==========================================================
  // SUMMER BLOCK — Erg Sessions
  // ==========================================================

  wk_sum_z1_tech: {
    id: 'wk_sum_z1_tech', name: 'Technical Z1 Focus',
    type: 'erg', ergType: 'z1', bgClass: 'bg-z1', calShort: 'Z1 Tech',
    mobilityBias: 'row',
    items: [
      { t: '40-Min Z1 Technical', d: 'SR 20–22 · HR <135. Post-race recovery phase. Technique gamification: pick one flaw and engineer a fix.' },
      { t: 'Ideas', d: 'Pause drills · 20-stroke blindfold (eyes closed) · Legs-only + arms-only alternating · Half-slide work · All at SR 20, no pressure.' }
    ]
  },

  wk_sum_cross: {
    id: 'wk_sum_cross', name: 'Cross-Training Session',
    type: 'erg', ergType: 'cross', bgClass: 'bg-z1', calShort: 'X-Train',
    mobilityBias: 'row',
    items: [
      { t: 'Cross-Training Day', d: '30–45 min of any aerobic activity that isn\'t rowing. Run · cycle · swim · stand-up paddle · tennis. Keep HR under 150.' },
      { t: 'Purpose', d: 'Active recovery that removes erg-specific CNS load while maintaining aerobic maintenance.' }
    ]
  },

  wk_sum_z1_fartlek: {
    id: 'wk_sum_z1_fartlek', name: 'Summer Aerobic Fartlek',
    type: 'erg', ergType: 'z1', bgClass: 'bg-z1', calShort: 'Fartlek',
    mobilityBias: 'row',
    items: [
      { t: '40-Min Z1 Fartlek', d: 'SR 20–24 · HR cap 145. Unstructured rate play: surge to SR 24 whenever it feels right, settle back. No schedule. Just feel.' }
    ]
  },

  wk_sum_z1_45: {
    id: 'wk_sum_z1_45', name: '45-Min Easy Aerobic',
    type: 'erg', ergType: 'z1', bgClass: 'bg-z1', calShort: 'Z1 · 45′',
    mobilityBias: 'row',
    items: [
      { t: '45-Min Easy Row', d: 'SR 20 · HR <140. Summer maintenance volume. Don\'t race yourself. Restore the aerobic base between race seasons.' }
    ]
  },

  wk_sum_z2_rate: {
    id: 'wk_sum_z2_rate', name: 'Z2 Rate Progression',
    type: 'erg', ergType: 'z2', bgClass: 'bg-z2', calShort: 'Z2 Rate',
    mobilityBias: 'row',
    items: [
      { t: '40-Min Z2 Rate Progression', d: 'Build: 10 min @ SR 20 → 10 min @ SR 22 → 10 min @ SR 24 → 10 min free row. HR 140–150. First autumn threshold work starting here.' }
    ]
  },

  wk_sum_z1_gamify: {
    id: 'wk_sum_z1_gamify', name: 'Technical Gamification',
    type: 'erg', ergType: 'z1', bgClass: 'bg-z1', calShort: 'Gamify',
    mobilityBias: 'row',
    items: [
      { t: '35-Min Technical Games', d: 'Pick 2 of these: (1) Eyes-closed 100-stroke test · (2) "Quiet blade" — zero splash for 5 min · (3) Legs-only 5 min into arms-only 5 min · (4) Hit exact split without looking for 20 strokes.' },
      { t: 'SR target', d: 'SR 20–22. All Z1. The gamification IS the intensity.' }
    ]
  },

  wk_sum_z1_30: {
    id: 'wk_sum_z1_30', name: 'Easy 30-Min Recovery',
    type: 'erg', ergType: 'z1', bgClass: 'bg-z1', calShort: 'Z1 · 30′',
    mobilityBias: 'row',
    items: [
      { t: '30-Min Easy Deload Row', d: 'SR 18–20 · HR <130. Summer deload. Breathe through your nose the whole time. You should feel like you\'re on vacation.' }
    ]
  },


  // ==========================================================
  // SUMMER BLOCK — Strength Sessions
  // ==========================================================

  wk_sum_lift_a: {
    id: 'wk_sum_lift_a', name: 'Summer Strength A — Unilateral Balance',
    type: 'lift', bgClass: 'bg-lift', calShort: 'Unilateral A',
    mobilityBias: 'leg', logSession: 'A',
    exercises: ['Single-Leg RDL', 'Pistol Squat Progression', 'Ring Row', 'Side-Lying Clamshell', 'Single-Arm DB Press'],
    items: [
      { t: 'Single-Leg RDL', d: '3 × 12 / side · 20–30 lb · Slow and controlled. Summer is for correcting left-right imbalances.' },
      { t: 'Pistol Squat Progression', d: '3 × 5 / side · Assisted (ring hold) → unassisted → weighted. Own it before going heavier.' },
      { t: 'Ring Row', d: '4 × 12 · Full extension, control the return · Adjust foot position to vary difficulty · Pulling volume maintenance.' },
      { t: 'Side-Lying Clamshell', d: '3 × 15 / side · Bodyweight only · Hip external rotator — critical for single-blade rowing balance · 45 sec rest' },
      { t: 'Single-Arm DB Press', d: '3 × 10 / side · 25–35 lb · Overhead press standing, core braced · 90 sec rest' }
    ]
  },

  wk_sum_lift_a_dl: {
    id: 'wk_sum_lift_a_dl', name: 'Summer Strength A — Deload',
    type: 'lift', bgClass: 'bg-lift', calShort: 'Uni A ↓',
    mobilityBias: 'leg', logSession: 'A',
    exercises: ['Single-Leg RDL', 'Pistol Squat Progression', 'Ring Row', 'Side-Lying Clamshell', 'Single-Arm DB Press'],
    items: [
      { t: 'Deload Week', d: 'Body weight or very light loads. Focus entirely on movement quality, range of motion, and balance. No DOMS this week.' }
    ]
  },

  wk_sum_lift_b: {
    id: 'wk_sum_lift_b', name: 'Summer Strength B — Mobility-Strength',
    type: 'lift', bgClass: 'bg-lift', calShort: 'Mobility B',
    mobilityBias: 'upper', logSession: 'B',
    exercises: ['Goblet Squat (deep range)', 'Ring Face Pull', 'DB Lateral Lunge', 'Dead Bug', 'Ring Bicep Curl'],
    items: [
      { t: 'Goblet Squat (deep range)', d: '3 × 12 · 30–35 lb · Elbows inside knees, chest tall, deepest range possible · 90 sec rest · Summer is for building catch depth.' },
      { t: 'Ring Face Pull', d: '3 × 15 · Rings at face height · Pull to ears, externally rotate at end position · Shoulder health — ring rotation protects the elbow' },
      { t: 'DB Lateral Lunge', d: '3 × 10 / side · 20–25 lb · Lateral hip hinge — frontal plane mobility · 90 sec rest' },
      { t: 'Dead Bug', d: '3 × 10 / side · Slow and controlled · Opposite arm-leg extension, lower back pressed to floor throughout' },
      { t: 'Ring Bicep Curl', d: '3 × 12 · Supinated grip, curl to face · Rings allow natural wrist rotation · Elbow longevity' }
    ]
  },

  wk_sum_lift_b_dl: {
    id: 'wk_sum_lift_b_dl', name: 'Summer Strength B — Deload',
    type: 'lift', bgClass: 'bg-lift', calShort: 'Mobility B ↓',
    mobilityBias: 'upper', logSession: 'B',
    exercises: ['Goblet Squat (deep range)', 'Ring Face Pull', 'DB Lateral Lunge', 'Dead Bug', 'Ring Bicep Curl'],
    items: [
      { t: 'Deload Week', d: 'Light loads, full ROM, 3 sets. This session is more stretch than strength. Take your time.' }
    ]
  },


  // ==========================================================
  // FALL BLOCK — Erg Sessions
  // ==========================================================

  wk_fall_at_3x15: {
    id: 'wk_fall_at_3x15', name: '3 × 15-Min Threshold',
    type: 'erg', ergType: 'at', bgClass: 'bg-at', calShort: 'AT 3×15′',
    mobilityBias: 'row',
    items: [
      { t: 'Warm-up 10 min', d: 'Build to SR 24. 2 × 30-stroke steady-state pickups.' },
      { t: '3 × 15 min / 5 min rest', d: 'SR 24–26 · HR 155–165 · "Comfortably hard". This is your head race pace. 3 reps at 15 min = 45 min of threshold work.' },
      { t: 'Goal', d: 'All 3 reps at the same split. Track the split from your FTP test and target it here.' },
      { t: 'Cool-down 5 min', d: 'SR 16.' }
    ]
  },

  wk_fall_rate_surges: {
    id: 'wk_fall_rate_surges', name: 'Head Race Rate Surges',
    type: 'erg', ergType: 'at', bgClass: 'bg-at', calShort: 'Rate Surges',
    mobilityBias: 'row',
    items: [
      { t: 'Warm-up 10 min', d: 'Build to SR 24.' },
      { t: '40-Min Race Simulation', d: 'Base pace SR 24 / 5-min blocks. Every 8 min: surge to SR 28 for 2 min, then settle back to SR 24. Repeat 5×.' },
      { t: 'Purpose', d: 'Head races (4–5k) require mid-race surges to pass crews. This trains that exact capability.' },
      { t: 'Cool-down 5 min', d: 'SR 16.' }
    ]
  },

  wk_fall_ftp_30: {
    id: 'wk_fall_ftp_30', name: '30-Min FTP Benchmark',
    type: 'erg', ergType: 'at', bgClass: 'bg-at', calShort: 'FTP 30′',
    mobilityBias: 'row',
    items: [
      { t: 'Warm-up 12 min', d: 'Build from SR 20 to SR 26. 3 × 30-stroke pickups at FTP rate.' },
      { t: '30-Min Sustained Threshold', d: 'SR 26 · Hold your FTP split from the 20-min test. This is harder — head race training.' },
      { t: 'Pacing', d: '5-min blocks. First block: 3–5 sec slower than target. Settle in at target by min 10. Last 5 min: empty the tank.' }
    ]
  },

  wk_fall_z1_45: {
    id: 'wk_fall_z1_45', name: 'Aerobic Maintenance / Deload',
    type: 'erg', ergType: 'z1', bgClass: 'bg-z1', calShort: 'Z1 · 45′',
    mobilityBias: 'row',
    items: [
      { t: '45-Min Easy Row', d: 'SR 20–22 · HR <140. Deload week. Flush high-intensity residue from the week. Protect the adaptation.' }
    ]
  },

  wk_fall_z1_tech: {
    id: 'wk_fall_z1_tech', name: 'Technical Paddle',
    type: 'erg', ergType: 'z1', bgClass: 'bg-z1', calShort: 'Z1 Tech',
    mobilityBias: 'row',
    items: [
      { t: '35-Min Z1 Technical Row', d: 'SR 20–22 · HR <135. Post high-intensity days, Friday is aerobic maintenance only. Work on technical consistency at head race rate (SR 24).' }
    ]
  },

  wk_fall_z2_40: {
    id: 'wk_fall_z2_40', name: 'Z2 Aerobic Run-Through',
    type: 'erg', ergType: 'z2', bgClass: 'bg-z2', calShort: 'Z2 · 40′',
    mobilityBias: 'row',
    items: [
      { t: '40-Min Z2 Row', d: 'SR 22–24 · HR 140–150. Bridges Z1 maintenance into the threshold work done Mon/Thu. Feel the race pace but at conversational intensity.' }
    ]
  },


  // ==========================================================
  // FALL BLOCK — Strength Sessions
  // ==========================================================

  wk_fall_lift_a: {
    id: 'wk_fall_lift_a', name: 'Fall Strength A — Functional Power',
    type: 'lift', bgClass: 'bg-lift', calShort: 'Lift A',
    mobilityBias: 'leg', logSession: 'A',
    exercises: ['DB Trap-Style Deadlift', 'Ring Row (explosive)', 'DB Step-up', 'Ring Dip', 'Plank + Shoulder Tap'],
    items: [
      { t: 'DB Trap-Style Deadlift', d: '4 × 8 · 65–70 lb (DBs at sides, neutral grip) · Hip hinge, stand tall and squeeze glutes · 3 min rest · Head race strength baseline' },
      { t: 'Ring Row (explosive)', d: '4 × 10 · Pull explosively to chest, slow 3-sec lowering · Trains the powerful early drive phase sequencing' },
      { t: 'DB Step-up', d: '3 × 10 / side · 35–45 lb · Step to full hip extension at top · 2 min rest · Unilateral power for walk-on race starts' },
      { t: 'Ring Dip', d: '3 × 10 · Full range, lock out at top · Ring-out at bottom for shoulder health · 90 sec rest' },
      { t: 'Plank + Shoulder Tap', d: '3 × 10 / side · Anti-rotation core stability · Move hips as little as possible · 60 sec rest' }
    ]
  },

  wk_fall_lift_a_dl: {
    id: 'wk_fall_lift_a_dl', name: 'Fall Strength A — Deload',
    type: 'lift', bgClass: 'bg-lift', calShort: 'Lift A ↓',
    mobilityBias: 'leg', logSession: 'A',
    exercises: ['DB Trap-Style Deadlift', 'Ring Row (explosive)', 'DB Step-up', 'Ring Dip', 'Plank + Shoulder Tap'],
    items: [
      { t: 'Deload / Pre-Race Taper', d: '3 sets · 40% loads · Perfect form · Do not create DOMS within 10 days of the head race.' }
    ]
  },

  wk_fall_lift_b: {
    id: 'wk_fall_lift_b', name: 'Fall Strength B — Posterior Chain + Shoulder',
    type: 'lift', bgClass: 'bg-lift', calShort: 'Lift B',
    mobilityBias: 'upper', logSession: 'B',
    exercises: ['DB Hip Thrust', 'Weighted Pull-up', 'Single-Leg DB Squat', 'Ring Push-up', 'DB External Rotation'],
    items: [
      { t: 'DB Hip Thrust', d: '4 × 12 · 50 lb · 2-sec hold at lockout · The most underrated rowing exercise. Glute power = drive phase power.' },
      { t: 'Weighted Pull-up', d: '4 × max reps · +10 lb · Track reps each week. If you add 1 rep/week, you will PR your 500m split.' },
      { t: 'Single-Leg DB Squat', d: '3 × 8 / side · 20–25 lb · Stand on one leg, lower to 90° · Balance + unilateral strength · 2 min rest' },
      { t: 'Ring Push-up', d: '3 × 12 · Standard ring push-up, rings at floor · Rotate rings outward at lockout for serratus activation' },
      { t: 'DB External Rotation', d: '3 × 15 / side · 10–12 lb · Elbow at 90°, rotate forearm away from body · Shoulder longevity for the whole season' }
    ]
  },

  wk_fall_lift_b_dl: {
    id: 'wk_fall_lift_b_dl', name: 'Fall Strength B — Deload',
    type: 'lift', bgClass: 'bg-lift', calShort: 'Lift B ↓',
    mobilityBias: 'upper', logSession: 'B',
    exercises: ['DB Hip Thrust', 'Weighted Pull-up', 'Single-Leg DB Squat', 'Ring Push-up', 'DB External Rotation'],
    items: [
      { t: 'Deload / Pre-Race Taper', d: '3 sets · 40% loads · No heavy pull-ups or dips within 10 days of race.' }
    ]
  },


  // ==========================================================
  // SPECIAL — Restoration Day (all blocks, every Saturday)
  // ==========================================================

  wk_restoration: {
    id: 'wk_restoration', name: 'Saturday Deep Restoration',
    type: 'restoration', bgClass: 'bg-restore', calShort: 'Restore',
    mobilityBias: 'row',
    items: [
      { t: '20-Min Deep Restoration', d: '2-minute static holds per exercise. Flows from hips → spine → shoulders.' },
      { t: 'Sequence', d: 'Ring Squat · Weighted Butterfly · Frog Pose · Pigeon (L+R) · Thoracic Extension · Half-Kneeling Hip Flexor (L+R) · Lat Overhead Stretch (L+R) · Child\'s Pose Side Bend' },
      { t: 'Notes', d: 'Catch-angle mobility takes months of consistent 2-min holds to change. Every Saturday. No exceptions.' }
    ]
  }

};
