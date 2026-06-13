// ============================================================
// DATA-MOBILITY — post-workout and weekend restoration routines
//
// POST_WORKOUT_ROUTINES: context-aware 5-min sequences injected
//   immediately after every session while muscles are warm.
//   Contexts: 'row' | 'leg' | 'upper'
//
// WEEKEND_RESTORATION: standalone 20-min deep static routine
//   loaded on Saturdays. 2-minute holds per piece.
//
// Each exercise: { name, duration (sec), side, cue }
// ============================================================

const POST_WORKOUT_ROUTINES = {

  // ---- After any rowing session --------------------------------
  // Targets: lat tightness, hip flexors from sustained drive position,
  //   hamstrings (compressed at catch), thoracic rotation.
  row: {
    id:       'mob_post_row',
    name:     'Post-Row 5-Min Flush',
    context:  'row',
    total:    300,
    exercises: [
      {
        name:     'Ring Lat Stretch',
        duration: 60,
        side:     'each (30s)',
        cue:      'Grip ring at shoulder height, hinge at hip, sit back. Feel the lat open from armpit to hip. Breathe into the stretch.'
      },
      {
        name:     "World's Greatest Stretch",
        duration: 60,
        side:     'each (30s)',
        cue:      'Step into deep lunge, same-side elbow to floor, then rotate and reach skyward. Hit hip flexor, thoracic, and groin in one move.'
      },
      {
        name:     'Half-Kneeling Hip Flexor Reach',
        duration: 60,
        side:     'each (30s)',
        cue:      'Back knee down, squeeze glute on that side. Reach same-side arm overhead and lean slightly opposite. Drives hip flexor length.'
      },
      {
        name:     'Seated Hamstring Reach',
        duration: 60,
        side:     'bilateral',
        cue:      'Sit tall, legs extended. Hinge forward from hips — not spine. Reach for feet. Hold at first resistance. Breathing elongates.'
      },
      {
        name:     'Doorframe / Ring Chest Opener',
        duration: 60,
        side:     'bilateral',
        cue:      'Grab rings or doorframe, lean forward into gentle pec stretch. Squeeze shoulder blades together. Counter the catch-position hunch.'
      }
    ]
  },

  // ---- After leg-dominant lifting (Mon / heavy hinge focus) ----
  // Targets: hip flexors, quads, glutes — all compressed during
  //   sustained desk sitting + heavy hinge loading.
  leg: {
    id:       'mob_post_leg',
    name:     'Post-Lift 5-Min Hip & Quad Flush',
    context:  'leg',
    total:    300,
    exercises: [
      {
        name:     'Couch Stretch',
        duration: 120,
        side:     'each (60s)',
        cue:      'Rear foot on wall, front shin vertical. Squeeze rear glute to tilt pelvis back. This one should be uncomfortable — that\'s the hip flexor loosening.'
      },
      {
        name:     'Standing Quad Stretch',
        duration: 40,
        side:     'each (20s)',
        cue:      'Hold ankle behind you, stand tall, squeeze glute. Keep knee pointing straight down. Add a slight forward lean for rectus femoris.'
      },
      {
        name:     'Quick Pigeon (Supported)',
        duration: 80,
        side:     'each (40s)',
        cue:      'Front shin roughly parallel to hips. Support on forearms if needed. Focus on external rotators — opposite to tight hip flexors.'
      },
      {
        name:     'Hip Circle + Hip Flexor Drive',
        duration: 60,
        side:     'each (30s)',
        cue:      'Stand on one leg. Drive opposite knee high in a controlled circle, 5 forward + 5 backward. Warms hip capsule and primes walk-away mobility.'
      }
    ]
  },

  // ---- After upper-body lifting (Wed / ring work + rows) -------
  // Targets: shoulder capsule, lats, thoracic, wrists (ring loading).
  upper: {
    id:       'mob_post_upper',
    name:     'Post-Lift 5-Min Shoulder & Thoracic Flush',
    context:  'upper',
    total:    300,
    exercises: [
      {
        name:     'Ring Lat Stretch',
        duration: 60,
        side:     'each (30s)',
        cue:      'Same as post-row. After ring pulling work the lat is loaded — flush it now while warm. Sit back into a deep hinge.'
      },
      {
        name:     'Thread-the-Needle',
        duration: 60,
        side:     'each (30s)',
        cue:      'On all-fours, reach one arm under the body, shoulder to floor. Gently rotate thoracic. No lower back — isolate the upper spine.'
      },
      {
        name:     'Doorframe Pec Stretch',
        duration: 60,
        side:     'bilateral',
        cue:      'Arms at 90°, lean through doorframe or hold rings. 3 positions: low / mid / high to hit all pec fibres. Breathe out the tension.'
      },
      {
        name:     'Wrist Flexor + Extensor Stretch',
        duration: 60,
        side:     'each (30s)',
        cue:      'Forearm extended, gently pull fingers back (flexor) then fold them forward (extensor). Ring work loads wrists — this is critical for longevity.'
      },
      {
        name:     "Child's Pose + Lat Reach",
        duration: 60,
        side:     'each (30s)',
        cue:      'Kneel, sit back toward heels, extend arms long. Walk hands slightly right, then left. Feel the lat and serratus open. Breathe slow.'
      }
    ]
  }

};


// ============================================================
// WEEKEND RESTORATION — 20-Min Deep Static Session
// Loaded on Saturdays. 2-minute holds per exercise.
// Sequence flows logically: open hips → spine → shoulders.
// ============================================================

const WEEKEND_RESTORATION = {
  id:        'mob_weekend_restore',
  name:      '20-Min Deep Restoration',
  subtitle:  '2-minute holds · full-body reset · do this every Saturday',
  total:     1200,
  holdSecs:  120,

  exercises: [
    {
      name:     'Ring-Assisted Deep Squat',
      duration: 120,
      side:     'bilateral',
      cue:      'Hold rings at hip height, lower into deepest comfortable squat. Use rings to keep chest tall. Builds the catch-angle mobility every session tries to use.',
      target:   'ankles · hip capsule · thoracic'
    },
    {
      name:     'Weighted Butterfly',
      duration: 120,
      side:     'bilateral',
      cue:      'Sit tall, soles together, hold one DB (15–25 lb) on inner thighs. Breathe into the inner groin. Never force — let the weight do the work.',
      target:   'adductors · inner groin'
    },
    {
      name:     'Frog Pose',
      duration: 120,
      side:     'bilateral',
      cue:      'On all-fours, widen knees until you feel inner groin load. Hips back toward heels. Floor forearms if comfortable. Desk-job hip opener.',
      target:   'hip flexors · groin · adductors'
    },
    {
      name:     'Pigeon Pose — Left',
      duration: 120,
      side:     'left',
      cue:      'Left shin parallel or angled, right leg extended behind. Sink into forearms or rest forehead on hands. Breathe slowly — external rotator release takes time.',
      target:   'glute · piriformis · hip capsule'
    },
    {
      name:     'Pigeon Pose — Right',
      duration: 120,
      side:     'right',
      cue:      'Mirror of left side. Notice asymmetry — one side is tighter. Don\'t rush the tighter side. Note which side for the coach log.',
      target:   'glute · piriformis · hip capsule'
    },
    {
      name:     'Thoracic Extension over Roll',
      duration: 120,
      side:     'bilateral',
      cue:      'Place a rolled towel or firm pillow across mid-back (T5–T9). Arms crossed or hands behind head. Gently extend over the roll. Counter 8 hours of flexion.',
      target:   'thoracic spine · costovertebral joints'
    },
    {
      name:     'Half-Kneeling Hip Flexor (Deep)',
      duration: 120,
      side:     'each (60s)',
      cue:      'Back knee on floor, front shin vertical. Posteriorly tilt pelvis (tuck tailbone). Squeeze rear glute hard. Add arm reach overhead for psoas bias. This is THE desk-job antidote.',
      target:   'psoas · iliacus · rectus femoris'
    },
    {
      name:     'Overhead Lat Stretch (Ring)',
      duration: 120,
      side:     'each (60s)',
      cue:      'Grip ring overhead, step sideways to increase stretch angle. Tilt torso away from ring arm. Feel from armpit to hip crest. Critical for catch body length.',
      target:   'lat · teres major · serratus'
    },
    {
      name:     "Child's Pose with Side Bend",
      duration: 120,
      side:     'each (60s)',
      cue:      'Extended arms, walk hands right to open left side, breathe 60s. Then left. Spinal elongation + QL release. End every restoration session here — integrates everything.',
      target:   'QL · intercostals · thoracolumbar fascia'
    }
  ]
};
