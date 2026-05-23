// ============================================================
// WORKOUTS — renders the Workouts tab
// Depends on: data.js (rationale, peteCards, weekDays)
// ============================================================

function renderWorkouts() {
  document.getElementById('ratGrid').innerHTML = rationale.map(r =>
    `<div class="rc"><div class="rc-d">${r.day}</div><div class="rc-r">${r.role}</div><div class="rc-w">${r.why}</div></div>`
  ).join('');

  document.getElementById('peteGrid').innerHTML = peteCards.map(p =>
    `<div class="pc ${p.cls}"><div class="pct">${p.type}</div><div class="pcn">${p.name}</div><div class="pcd">${p.detail}</div></div>`
  ).join('');

  weekDays.forEach((wk, i) => {
    document.getElementById(`g-${i+1}`).innerHTML = wk.map(d => `
      <div class="dc">
        <div class="dh ${d.color}"><span class="dn">${d.day}</span><span class="db">${d.badge}</span></div>
        <div class="dbody">
          ${d.items.map(item => `
            <div class="wi">
              <div class="wii">${item.i}</div>
              <div>
                <div class="wit">${item.t}</div>
                <div class="wid">${item.d}</div>
                ${item.tag ? `<span class="wtag">${item.tag}</span>` : ''}
              </div>
            </div>`).join('')}
          <div class="ir">
            <span class="il">Intensity</span>
            <div class="ib"><div class="if" style="width:${d.intensity}%;background:${
              d.intensity > 80
                ? 'linear-gradient(90deg,var(--acc),var(--accs))'
                : d.intensity > 50
                  ? 'linear-gradient(90deg,var(--water),var(--wl))'
                  : 'linear-gradient(90deg,var(--grn),#6abf89)'
            }"></div></div>
            <span class="in">${d.intensity}%</span>
          </div>
        </div>
      </div>`).join('');
  });

  document.getElementById('strengthTips').innerHTML = [
    {h:"💪 Strength A (Mon) — Posterior Chain + Pull",p:"Ring rows 3×8 · DB RDL 3×10 (40–55 lb) · Goblet squat 3×12 · Ring push-ups 3×10 · Pallof press 3×10ea · Plank 3×45s. ~35 min."},
    {h:"💪 Strength B (Wed) — Hinge + Single Leg",p:"DB bent-over row 3×10 · Ring dips 3×8 · DB reverse lunge 3×10ea · Face pulls 3×15 · Dead bug 3×10 · Side plank 2×30s. ~35 min."},
    {h:"💪 Strength C (Fri) — Upper Body, Leg-Light",p:"Ring push-ups 3×12 · DB single-arm row 3×10ea · Lateral raises 3×15 · Curls 3×12 · Ring tricep dips 3×8 · Hollow body hold 3×30s. ~30 min. Light on legs — Saturday is the long water day."},
    {h:"🧘 Sunday Recovery Protocol",p:"20–25 min erg at 18–20 spm, damper low. Then: hip flexor 90s ea · thoracic rotation 30 reps · hamstring 90s ea · lat/shoulder stretch · foam roll glutes + quads. Total ~45 min."}
  ].map(t => `<div class="tip"><h4>${t.h}</h4><p>${t.p}</p></div>`).join('');
}
