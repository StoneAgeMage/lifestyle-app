// ============================================================
// SAUCES — renders the Sauces & Prep tab
// Depends on: data.js (allSauceData, prepSections)
// ============================================================

function renderSauces() {
  document.getElementById('allSauces').innerHTML = allSauceData.map(group => `
    <div class="sh" style="margin-top:6px"><h2>${group.heading}</h2></div>
    <div class="sg">
      ${group.items.map(s => `
        <div class="sc">
          <div class="sch ${s.hcls}"><span class="sct">${s.title}</span><span class="scta">${s.tag}</span></div>
          <div class="scb">
            <div class="sci">${s.ingredients}</div>
            <div class="scm">${s.method}</div>
            ${s.link ? `<div class="scl"><a href="${s.link}" target="_blank" rel="noopener">🔗 ${s.lt}</a></div>` : ''}
          </div>
        </div>`).join('')}
    </div>`).join('');

  document.getElementById('prepGrid').innerHTML = prepSections.map(s =>
    `<div class="prepc">
      <h3>${s.title}</h3>
      ${s.items.map(item => `<div class="pi"><div class="pd"></div>${item}</div>`).join('')}
    </div>`
  ).join('');
}
