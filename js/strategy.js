// ============================================================
// STRATEGY — renders the Strategy tab
// No external data dependencies beyond inline arrays below
// ============================================================

function renderStrategy() {
  const principles = [
    {i:"🏗️",t:"Clean Separation",d:"Lift and row on different days. Zero overlap. Willpower saved for training itself."},
    {i:"🚣",t:"Water Days Count",d:"3 crew practices cover Pete Plan distance work. Tuesday endurance session is your one hard erg. Optimal masters load."},
    {i:"🔁",t:"Dual Cycle Design",d:"3-week Pete Plan + 4-week meal rotation never perfectly align — every week feels slightly different with identical routine."},
    {i:"💪",t:"3× Lifting Works",d:"Mon (posterior chain) + Wed (hinge) + Fri (upper, leg-light). 48 hrs between. Masters athletes build muscle well at 3×/wk."},
    {i:"🍂",t:"Post-October Transition",d:"When the water season ends (~October), Tu/Th/Sat shift to erg, running, or tennis — same days, same structure. Pete Plan endurance intervals stay on Tuesday. Running or tennis on Thu/Sat as cross-training. Lifting schedule doesn't change."},
    {i:"😴",t:"Sunday Is Infrastructure",d:"Meal prep + easy erg + stretch is recovery infrastructure. Skipping it costs you the whole week, not just Sunday."},
    {i:"📊",t:"Track Erg Splits",d:"Log Tuesday's session pace after every workout. Watching your 500m split drop beats any scale number."},
    {i:"⚡",t:"Minimum Viable Week",d:"1 strength session + Tuesday erg + Saturday water + Sunday prep = still moving forward. No restarts."},
    {i:"🥗",t:"Sauce Changes Everything",d:"Identical prep routine, different sauce = different meal. Brain perceives variety; hands do the same Sunday routine."}
  ];

  document.getElementById('prinGrid').innerHTML = principles.map(p =>
    `<div class="prc"><div class="prci">${p.i}</div><div class="prct">${p.t}</div><div class="prcd">${p.d}</div></div>`
  ).join('');

  document.getElementById('weightProg').innerHTML = [
    {l:"Start — post June comp",v:188,n:"Habit-building phase"},
    {l:"End of July",v:184,n:"Phase 1 done"},
    {l:"End of September",v:176,n:"Phase 2 done"},
    {l:"End of November",v:170,n:"Phase 3 done"},
    {l:"End of December",v:165,n:"Goal 🎯"}
  ].map(p => `
    <div class="prow">
      <div class="plr">
        <span class="pn">${p.l} — <span style="font-weight:300;color:var(--txl)">${p.n}</span></span>
        <span class="pns">${p.v} lbs</span>
      </div>
      <div class="ptrack"><div class="pfill" style="width:${((188-p.v)/(188-165))*100}%;background:${
        p.v === 165
          ? 'linear-gradient(90deg,var(--grn),#6abf89)'
          : 'linear-gradient(90deg,var(--wm),var(--wl))'
      }"></div></div>
    </div>`).join('');

  document.getElementById('phases').innerHTML = [
    {n:"Phase 1: Foundation (Weeks 1–4, July)",d:"Pete Plan conservative pacing. Lock in Sunday prep habit. Eat at maintenance. Get the routine first.",p:100},
    {n:"Phase 2: Build (Weeks 5–14, Aug–Sep)",d:"Add ~500 cal/day deficit. Push Tuesday final reps harder each cycle. Strength weights go up.",p:100},
    {n:"Phase 3: Develop (Weeks 15–20, Oct–Nov)",d:"Strength progressive overload. Erg splits dropping consistently. Weight approaching 172–175.",p:75},
    {n:"Phase 4: Peak (Weeks 21–26, Dec)",d:"Final push to 165. Maintain training, keep protein high. Reduce volume slightly if recovery suffers.",p:50}
  ].map(p => `
    <div class="prow">
      <div class="plr"><span class="pn" style="font-weight:600">${p.n}</span></div>
      <div style="font-size:11px;color:var(--txl);margin-bottom:5px;font-weight:300">${p.d}</div>
      <div class="ptrack"><div class="pfill" style="width:${p.p}%"></div></div>
    </div>`).join('');
}
