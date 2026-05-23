// ============================================================
// MEALS — renders the Meals tab rotation grid
// Depends on: data.js (mealWeeks)
// ============================================================

function renderMeals() {
  document.getElementById('rotGrid').innerHTML = mealWeeks.map((m, i) => `
    <div class="rmcard">
      <div class="rmh ${m.color}"><span class="rmw">Week ${i+1}</span><span class="rmt">${m.cuisine}</span></div>
      <div class="rmbody">
        <div class="rm">
          <span class="rms">Lunch</span>
          <div class="rmc">
            <div class="rmn">${m.bowl}<span class="vd"></span></div>
            <div class="rmd">Prepped grain + roasted veg + leftover protein + ${m.sauce}. Assembly only.</div>
            <div class="rmm"><span class="rmp">~30–35g</span><span class="rsv">Assembly</span></div>
          </div>
        </div>
        <div class="rm">
          <span class="rms">Din ×2</span>
          <div class="rmc">
            <div class="rmn">${m.dinner1.name}</div>
            <div class="rmd">${m.dinner1.desc}</div>
            <div class="rmm">
              <span class="rmp">${m.dinner1.prot}</span>
              <span class="rsv">Serves 4</span>
              ${m.dinner1.link ? `<span class="rml"><a href="${m.dinner1.link}" target="_blank" rel="noopener">🔗 Recipe</a></span>` : ''}
            </div>
          </div>
        </div>
        <div class="rm">
          <span class="rms">Din ×2</span>
          <div class="rmc">
            <div class="rmn">${m.dinner2.name}<span class="vd"></span></div>
            <div class="rmd">${m.dinner2.desc}</div>
            <div class="rmm">
              <span class="rmp">${m.dinner2.prot}</span>
              <span class="rsv">Serves 4</span>
              ${m.dinner2.link ? `<span class="rml"><a href="${m.dinner2.link}" target="_blank" rel="noopener">🔗 Recipe</a></span>` : ''}
            </div>
          </div>
        </div>
        <div class="rm">
          <span class="rms">Flex</span>
          <div class="rmc">
            <div class="rmn">${m.flex.name}<span class="vd"></span></div>
            <div class="rmd">${m.flex.desc}</div>
          </div>
        </div>
      </div>
    </div>`).join('');
}
