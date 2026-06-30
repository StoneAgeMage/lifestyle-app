// exercises.js — Exercise GIF modal
// Shows a GIF + cue when user taps an exercise name in the lift card.
// GIFs live in assets/exercises/{slug}.gif (downloaded offline).
// Depends on: nothing (pure DOM).

var _EX_HAS_GIF = {
  'db-bent-over-row': 1,
  'db-bicep-curl': 1,
  'db-box-step-up': 1,
  'db-external-rotation': 1,
  'db-goblet-squat': 1,
  'db-lateral-raise': 1,
  'db-romanian-deadlift': 1,
  'db-single-leg-deadlift': 1,
  'db-split-squat': 1,
  'dead-bug': 1,
  'decline-push-up': 1,
  'floor-push-up': 1,
  'goblet-squat': 1,
  'jump-squat': 1,
  'lateral-lunge': 1,
  'pallof-press': 1,
  'plank': 1,
  'prone-superman-hold': 1,
  'push-up-to-side-plank': 1,
  'ring-dip': 1,
  'ring-push-up': 1,
  'ring-row': 1,
  'side-plank': 1,
  'side-lying-hip-abduction': 1,
  'single-leg-glute-bridge': 1,
};

// Handles "(DB)", "(Bodyweight)", "(weighted if able)" etc.
// Also handles slash compounds like "Wall Push-Up / Floor Push-Up".
function _exToSlug(name) {
  var s = name
    .replace(/\s*\([^)]*\)/g, '')   // strip parentheticals
    .split('/')[0]                    // take first of slash compounds
    .trim()
    .replace(/\bDB\b/gi,  'dumbbell')
    .replace(/\bKB\b/gi,  'kettlebell')
    .replace(/\bRDL\b/gi, 'romanian-deadlift');
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Fallback slug for names that map to a close-enough GIF
var _EX_ALIAS = {
  'single-leg-rdl':            'db-single-leg-deadlift',
  'single-leg-romanian-deadlift': 'db-single-leg-deadlift',
  'wall-push-up':              'floor-push-up',
  'ring-push-up-ring-dip':     'ring-push-up',
  'pull-up':                   null,  // no GIF yet
  'pull-up-weighted-if-able':  null,
  'kb-swing':                  null,
  'bodyweight-squat':          'db-goblet-squat',  // best visual substitute
  'reverse-lunge':             'lateral-lunge',
  'wall-sit':                  'single-leg-glute-bridge',
  'hollow-body-hold':          'dead-bug',
  'plank-shoulder-tap':        'plank',
  'prone-y-raise':             'prone-superman-hold',
  'prone-i-y-t-raises':        'prone-superman-hold',
  'scapular-wall-slide':       'prone-superman-hold',
  'bird-dog':                  'dead-bug',
  'hollow-rock':               'dead-bug',
  'copenhagen-plank':          'side-plank',
  'db-single-arm-row':         'db-bent-over-row',
  'side-lying-hip-raise':      'side-lying-hip-abduction',
};

function _resolveGifSlug(name) {
  var slug = _exToSlug(name);
  if (_EX_HAS_GIF[slug]) return slug;
  var alias = _EX_ALIAS[slug];
  if (alias && _EX_HAS_GIF[alias]) return alias;
  return null;
}

function showExGif(name, cue) {
  var overlay = document.getElementById('ex-modal');
  if (!overlay) return;

  var slug    = _resolveGifSlug(name);
  var gifPath = slug ? 'assets/exercises/' + slug + '.gif' : null;

  document.getElementById('ex-modal-name').textContent = name;
  document.getElementById('ex-modal-cue').textContent  = cue || '';

  var gifEl   = document.getElementById('ex-modal-gif');
  var noGifEl = document.getElementById('ex-modal-no-gif');

  if (gifPath) {
    gifEl.src         = gifPath;
    gifEl.style.display    = 'block';
    noGifEl.style.display  = 'none';
  } else {
    gifEl.src         = '';
    gifEl.style.display    = 'none';
    noGifEl.style.display  = 'flex';
  }

  overlay.classList.add('ex-modal-open');
}

function closeExGif(evt) {
  if (evt && evt.target !== evt.currentTarget) return;
  _closeExGif();
}

function _closeExGif() {
  var overlay = document.getElementById('ex-modal');
  if (!overlay) return;
  overlay.classList.remove('ex-modal-open');
  // Stop GIF playback by clearing src after transition
  setTimeout(function() {
    var gifEl = document.getElementById('ex-modal-gif');
    if (gifEl) gifEl.src = '';
  }, 250);
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') _closeExGif();
});
