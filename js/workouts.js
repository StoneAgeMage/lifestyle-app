// ============================================================
// WORKOUTS — renders workout reference section in the Plan tab
// Phase 7: Pete Plan cards and 3-week grids removed.
// ============================================================

var _wkRationale = [
  {day:'Monday',   role:'Lift Only — Strength A',      why:'Fresh at week start. Heavy posterior chain. No erg — full recovery for Tuesday.'},
  {day:'Tuesday',  role:'Water / Pete Endurance Erg',  why:'Primary: crew practice. Backup: Pete Plan endurance intervals. Hardest aerobic session.'},
  {day:'Wednesday',role:'Lift Only — Strength B',      why:'Active recovery between aerobic sessions. Strength here doesn\'t interfere with Thu/Fri.'},
  {day:'Thursday', role:'Water / Steady State',        why:'Primary: crew practice. Backup: steady-state erg. Once/month: speed session.'},
  {day:'Friday',   role:'Lift Only — Strength C',      why:'Third lift day. Upper body focus, light on legs — Saturday is the long water day.'},
  {day:'Saturday', role:'Long Water / Steady Erg',     why:'Peak aerobic day. Crew long session = Pete Plan hard distance piece.'},
  {day:'Sunday',   role:'Easy Erg + Stretch',          why:'20–25 min 18–20 spm. Rate-capped recovery. 20 min mobility/stretch follows.'}
];

function renderWorkouts() {
  var el = document.getElementById('ratGrid');
  if (el) {
    el.innerHTML = _wkRationale.map(function(r) {
      return '<div class="rc"><div class="rc-d">' + r.day + '</div>' +
        '<div class="rc-r">' + r.role + '</div>' +
        '<div class="rc-w">' + r.why + '</div></div>';
    }).join('');
  }

  el = document.getElementById('strengthTips');
  if (el) {
    el.innerHTML = [
      {h:'💪 Strength A (Mon) — Posterior Chain + Pull',
       p:'Ring rows 3×8 · DB RDL 3×10 (40–55 lb) · Goblet squat 3×12 · Ring push-ups 3×10 · Pallof press 3×10ea · Plank 3×45s. ~35 min.'},
      {h:'💪 Strength B (Wed) — Hinge + Single Leg',
       p:'DB bent-over row 3×10 · Ring dips 3×8 · DB reverse lunge 3×10ea · Face pulls 3×15 · Dead bug 3×10 · Side plank 2×30s. ~35 min.'},
      {h:'💪 Strength C (Fri) — Upper Body, Leg-Light',
       p:'Ring push-ups 3×12 · DB single-arm row 3×10ea · Lateral raises 3×15 · Curls 3×12 · Ring tricep dips 3×8 · Hollow body hold 3×30s. ~30 min. Light on legs — Saturday is the long water day.'},
      {h:'🧘 Sunday Recovery Protocol',
       p:'20–25 min erg at 18–20 spm, damper low. Then: hip flexor 90s ea · thoracic rotation 30 reps · hamstring 90s ea · lat/shoulder stretch · foam roll glutes + quads. Total ~45 min.'}
    ].map(function(t) {
      return '<div class="tip"><h4>' + t.h + '</h4><p>' + t.p + '</p></div>';
    }).join('');
  }
}
