// ============================================================
// fetch-exercise-gifs.js
// Downloads exercise GIFs from ExerciseDB (oss.exercisedb.dev)
// Strategy: search per exercise (47 calls) instead of full catalog.
//
// Usage: node tools/fetch-exercise-gifs.js
// Requires: Node 18+ (native fetch)
//
// Outputs:
//   assets/exercises/*.gif       — downloaded GIF files
//   tools/exercise-mapping.json  — name → file mapping for the app
// ============================================================

const fs    = require('fs');
const path  = require('path');
const https = require('https');

// ---- Exercises to source GIFs for ----
const EXERCISE_LIST = [
  // Lower body
  'Bodyweight Squat',
  'Goblet Squat',
  'DB Goblet Squat',
  'DB Goblet Jump Squat',
  'Jump Squat',
  'DB Split Squat',
  'Reverse Lunge',
  'Lateral Lunge',
  'DB Box Step-Up',
  'DB Romanian Deadlift',
  'DB Single-Leg Deadlift',
  'Single-Leg RDL',
  'Single-Leg Glute Bridge',
  'KB Swing',
  'Wall Sit',
  // Upper body push
  'Floor Push-Up',
  'Decline Push-Up',
  'Plyometric Push-Up',
  'Push-Up to Side Plank',
  'Wall Push-Up',
  'Ring Push-Up',
  'Ring Dip',
  'Pull-Up',
  // Upper body pull / row
  'Ring Row',
  'DB Single-Arm Row',
  'DB Bent-Over Row',
  'DB Lateral Raise',
  'DB Bicep Curl',
  'DB External Rotation',
  // Shoulder / scapular
  'Prone Y-Raise',
  'Prone I/Y/T Raises',
  'Prone Superman Hold',
  'Scapular Wall Slide',
  'Wall Plank',
  // Core
  'Plank',
  'Side Plank',
  'Plank Shoulder Tap',
  'Dead Bug',
  'Bird-Dog',
  'Hollow Body Hold',
  'Hollow Rock',
  'Pallof Press',
  'Copenhagen Plank',
  // Hip / glute accessory
  'Side-Lying Hip Abduction',
  'Side-Lying Hip Raise',
];

// Search terms to send to the API — simplified for better matching
const SEARCH_TERMS = {
  'Bodyweight Squat':        'bodyweight squat',
  'Goblet Squat':            'goblet squat',
  'DB Goblet Squat':         'dumbbell goblet squat',
  'DB Goblet Jump Squat':    'jump squat dumbbell',
  'Jump Squat':              'jump squat',
  'DB Split Squat':          'dumbbell split squat',
  'Reverse Lunge':           'reverse lunge',
  'Lateral Lunge':           'lateral lunge',
  'DB Box Step-Up':          'dumbbell step up',
  'DB Romanian Deadlift':    'dumbbell romanian deadlift',
  'DB Single-Leg Deadlift':  'dumbbell single leg deadlift',
  'Single-Leg RDL':          'single leg romanian deadlift',
  'Single-Leg Glute Bridge': 'single leg glute bridge',
  'KB Swing':                'kettlebell swing',
  'Wall Sit':                'wall sit',
  'Floor Push-Up':           'push up',
  'Decline Push-Up':         'decline push up',
  'Plyometric Push-Up':      'plyometric push up',
  'Push-Up to Side Plank':   'push up side plank',
  'Wall Push-Up':            'wall push up',
  'Ring Push-Up':            'push up',
  'Ring Dip':                'dip',
  'Pull-Up':                 'pull up',
  'Ring Row':                'inverted row',
  'DB Single-Arm Row':       'dumbbell single arm row',
  'DB Bent-Over Row':        'dumbbell bent over row',
  'DB Lateral Raise':        'dumbbell lateral raise',
  'DB Bicep Curl':           'dumbbell bicep curl',
  'DB External Rotation':    'dumbbell external rotation',
  'Prone Y-Raise':           'prone y raise',
  'Prone I/Y/T Raises':      'prone raise',
  'Prone Superman Hold':     'superman',
  'Scapular Wall Slide':     'wall slide',
  'Wall Plank':              'plank',
  'Plank':                   'plank',
  'Side Plank':              'side plank',
  'Plank Shoulder Tap':      'plank shoulder tap',
  'Dead Bug':                'dead bug',
  'Bird-Dog':                'bird dog',
  'Hollow Body Hold':        'hollow body',
  'Hollow Rock':             'hollow rock',
  'Pallof Press':            'pallof press',
  'Copenhagen Plank':        'copenhagen plank',
  'Side-Lying Hip Abduction':'side lying hip abduction',
  'Side-Lying Hip Raise':    'side lying hip raise',
};

// ---- Helpers ----

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function normalize(name) {
  return name.toLowerCase()
    .replace(/\b(db|dumbbell)\b/g, 'dumbbell')
    .replace(/\b(kb|kettlebell)\b/g, 'kettlebell')
    .replace(/\brdl\b/g, 'romanian deadlift')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function matchScore(apiName, ourName) {
  const apiWords = new Set(normalize(apiName).split(' ').filter(w => w.length > 2));
  const ourWords = normalize(ourName).split(' ').filter(w => w.length > 2);
  if (!ourWords.length) return 0;
  return ourWords.filter(w => apiWords.has(w)).length / ourWords.length;
}

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function searchExercise(term, retries = 3) {
  const url = `https://oss.exercisedb.dev/api/v1/exercises?name=${encodeURIComponent(term)}&limit=15`;
  for (let i = 1; i <= retries; i++) {
    const res  = await fetch(url);
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (_) {
      if (i < retries) { await sleep(3000); }
      else throw new Error('Non-JSON response after ' + retries + ' attempts');
    }
  }
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      try { fs.unlinkSync(dest); } catch (_) {}
      reject(err);
    });
  });
}

// ---- Main ----

async function main() {
  const outDir     = path.join(__dirname, '..', 'assets', 'exercises');
  const mappingOut = path.join(__dirname, 'exercise-mapping.json');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Load existing mapping if present (for reruns)
  let mapping = {};
  if (fs.existsSync(mappingOut)) {
    mapping = JSON.parse(fs.readFileSync(mappingOut, 'utf8'));
  }

  const unmatched = [];

  for (const ourName of EXERCISE_LIST) {
    const slug    = toSlug(ourName);
    const gifPath = path.join(outDir, slug + '.gif');

    // Skip already downloaded
    if (fs.existsSync(gifPath) && mapping[ourName]?.matched) {
      console.log(`  ⏭  ${ourName} — already done`);
      continue;
    }

    const term = SEARCH_TERMS[ourName] || ourName.toLowerCase();
    let json;
    try {
      json = await searchExercise(term);
    } catch (e) {
      console.log(`  ✗ SEARCH ERR: ${ourName} — ${e.message}`);
      unmatched.push(ourName);
      mapping[ourName] = { matched: false, slug, error: e.message };
      await sleep(1000);
      continue;
    }

    const results = json.data || [];
    if (!results.length) {
      console.log(`  ✗ NO RESULTS: ${ourName} (searched: "${term}")`);
      unmatched.push(ourName);
      mapping[ourName] = { matched: false, slug };
      await sleep(500);
      continue;
    }

    // Pick best match from results
    let best = results[0], bestScore = 0;
    for (const ex of results) {
      const s = matchScore(ex.name, ourName);
      if (s > bestScore) { bestScore = s; best = ex; }
    }

    // Download GIF
    try {
      await downloadFile(best.gifUrl, gifPath);
      const kb = Math.round(fs.statSync(gifPath).size / 1024);
      console.log(`  ✓ ${ourName}`);
      console.log(`      → "${best.name}"  (${(bestScore * 100).toFixed(0)}% match, ${kb}KB)`);
      mapping[ourName] = {
        matched:       true,
        slug,
        file:          `assets/exercises/${slug}.gif`,
        apiName:       best.name,
        exerciseId:    best.exerciseId,
        score:         Math.round(bestScore * 100),
        targetMuscles: best.targetMuscles,
        bodyParts:     best.bodyParts,
        instructions:  best.instructions,
      };
    } catch (e) {
      console.log(`  ✗ DOWNLOAD ERR: ${ourName} — ${e.message}`);
      unmatched.push(ourName);
      mapping[ourName] = { matched: false, slug, error: e.message };
    }

    // Save mapping after each exercise (safe restart if interrupted)
    fs.writeFileSync(mappingOut, JSON.stringify(mapping, null, 2));
    await sleep(300);
  }

  const matchedCount = EXERCISE_LIST.filter(n => mapping[n]?.matched).length;
  console.log('\n' + '='.repeat(60));
  console.log(`Matched:   ${matchedCount} / ${EXERCISE_LIST.length}`);
  console.log(`Unmatched: ${unmatched.length}`);
  if (unmatched.length) {
    console.log('\nNeeds manual GIF:');
    unmatched.forEach(n => console.log('  - ' + n));
  }
  console.log(`\nMapping → tools/exercise-mapping.json`);
  console.log(`GIFs    → assets/exercises/`);
}

main().catch(err => { console.error(err); process.exit(1); });
