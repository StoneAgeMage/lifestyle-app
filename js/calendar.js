// ============================================================
// CALENDAR — month view, day modal, workout+meal logic
// Depends on: data.js (PLAN_START_SUN, mealWeeks, peteTueSessions,
//   speedSessions, strengthA/B/C, sundayItems, waterPri, ergBackup,
//   longWaterPri, ergLongBackup)
// ============================================================

let currentYear = 2026, currentMonth = 6; // July = month index 6

function getWeekIndex(date) {
  const d = new Date(date); d.setHours(0,0,0,0);
  const s = new Date(PLAN_START_SUN); s.setHours(0,0,0,0);
  const ms = d - s;
  if (ms < 0) return -1;
  return Math.floor(ms / (7 * 86400000));
}

function getDayInfo(date) {
  const d = new Date(date); d.setHours(12,0,0,0);
  const wi = getWeekIndex(d);
  if (wi < 0) return null;

  const dow = d.getDay();
  const mealWk  = wi % 4;
  const peteWk  = wi % 3;
  const isSpeed = (wi % 4 === 0);
  const meal    = mealWeeks[mealWk];

  let workoutItems = [], workoutBg = '', workoutShort = '';

  if (dow === 0) {
    workoutItems = sundayItems;
    workoutBg = 'bg-rest'; workoutShort = 'Prep + Easy Erg';
  } else if (dow === 1) {
    workoutItems = strengthA;
    workoutBg = 'bg-lift'; workoutShort = 'Strength A';
  } else if (dow === 2) {
    const ps = peteTueSessions[peteWk];
    workoutItems = [...waterPri, {t:"Backup: " + ps.name, d: ps.detail + " (if crew cancelled)"}];
    workoutBg = 'bg-end'; workoutShort = 'Endurance / Water';
  } else if (dow === 3) {
    workoutItems = strengthB;
    workoutBg = 'bg-lift'; workoutShort = 'Strength B';
  } else if (dow === 4) {
    if (isSpeed) {
      const sp = speedSessions[Math.floor(wi / 4) % 3];
      workoutItems = [...waterPri, {t:"Backup: ⚡ Monthly Speed — " + sp.name, d: sp.detail}];
      workoutBg = 'bg-speed'; workoutShort = 'Speed / Water';
    } else {
      workoutItems = [...waterPri, ergBackup];
      workoutBg = 'bg-water'; workoutShort = 'Steady / Water';
    }
  } else if (dow === 5) {
    workoutItems = strengthC;
    workoutBg = 'bg-lift'; workoutShort = 'Strength C';
  } else if (dow === 6) {
    workoutItems = [...longWaterPri, ergLongBackup];
    workoutBg = 'bg-water'; workoutShort = 'Long Water / Steady';
  }

  let meals = [];

  if (dow === 0) {
    meals = [
      {type:"Today", name:"Overnight Oats", desc:"Or simple eggs — easy meal while prepping.", link:null},
      {type:"Prep", name:`${meal.cuisine} Week Prep`, desc:`Make: brown rice, roast veg, ${meal.sauce}, ${meal.dinner1.name} (marinate), ${meal.dinner2.name}, boil 6 eggs, 5 oat jars.`, link:null}
    ];
  } else {
    meals.push({type:"Breakfast", name:"Overnight Oats", desc:"Prep jar + fresh toppings", link:null});
    meals.push({type:"Lunch", name: meal.bowl, desc: `Prepped grain + roasted veg + protein + ${meal.sauce}`, link:null});
    if (dow === 1 || dow === 3) {
      meals.push({type:"Dinner", name: meal.dinner2.name, desc: meal.dinner2.desc + (meal.dinner2.veg ? " 🌱 Ascent shake tonight." : ""), link: meal.dinner2.link});
    } else if (dow === 2 || dow === 4 || dow === 6) {
      meals.push({type:"Dinner", name: meal.dinner1.name, desc: meal.dinner1.desc, link: meal.dinner1.link});
    } else if (dow === 5) {
      meals.push({type:"Dinner", name: meal.flex.name, desc: meal.flex.desc, link:null});
    }
  }

  return {workoutItems, workoutBg, workoutShort, meals, meal, mealWk, peteWk, wi};
}

function renderCalendar() {
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  document.getElementById('cal-title').textContent = monthNames[currentMonth] + ' ' + currentYear;

  const firstDay    = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dowLabels   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  let html = dowLabels.map(d => `<div class="cal-dow">${d}</div>`).join('');
  for (let i = 0; i < firstDay; i++) html += `<div class="cal-day empty"></div>`;

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(currentYear, currentMonth, d, 12);
    const info = getDayInfo(date);

    if (!info) {
      html += `<div class="cal-day empty" style="background:rgba(255,255,255,0.4)"><div class="cal-num" style="color:var(--txl)">${d}</div></div>`;
      continue;
    }

    const cuisineLabel = info.meal ? `<span style="font-size:9px;font-weight:500;color:var(--oard);display:block;margin-top:1px">${info.meal.cuisine}</span>` : '';
    const dinnerItem   = info.meals.find(m => m.type === 'Dinner' || m.type === 'Prep');
    const dinnerLabel  = dinnerItem ? `<div class="cal-meal-name">${dinnerItem.name}</div>` : '';

    html += `<div class="cal-day" onclick="openModal(${currentYear},${currentMonth},${d})">
      <div class="cal-num">${d}</div>
      <span class="cal-workout ${info.workoutBg}">${info.workoutShort}</span>
      ${cuisineLabel}
      ${dinnerLabel}
    </div>`;
  }

  document.getElementById('cal-grid').innerHTML = html;
}

function changeMonth(dir) {
  currentMonth += dir;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  if (currentMonth < 0)  { currentMonth = 11; currentYear--; }
  if (currentYear < 2026 || (currentYear === 2026 && currentMonth < 6))  { currentYear = 2026; currentMonth = 6; }
  if (currentYear > 2026 || (currentYear === 2026 && currentMonth > 11)) { currentYear = 2026; currentMonth = 11; }
  renderCalendar();
}

function openModal(y, m, d) {
  const date = new Date(y, m, d, 12);
  const info = getDayInfo(date);
  if (!info) return;

  const dowNames   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  document.getElementById('m-date').textContent = monthNames[m] + ' ' + d + ', ' + y + ` · ${info.meal.cuisine} Week · Pete Wk ${info.peteWk+1}`;
  document.getElementById('m-dow').textContent  = dowNames[date.getDay()];

  document.getElementById('m-workout').innerHTML = info.workoutItems.map(item =>
    `<div class="modal-workout"><div class="modal-workout-title">${item.t}</div><div class="modal-workout-detail">${item.d}</div></div>`
  ).join('');

  document.getElementById('m-meals').innerHTML = info.meals.map(meal =>
    `<div class="modal-meal">
      <span class="modal-meal-type">${meal.type}</span>
      <div>
        <div class="modal-meal-name">${meal.name}</div>
        <div class="modal-meal-desc">${meal.desc}</div>
        ${meal.link ? `<div class="modal-meal-link"><a href="${meal.link}" target="_blank" rel="noopener">🔗 Recipe</a></div>` : ''}
      </div>
    </div>`
  ).join('');

  document.getElementById('modal').classList.add('open');
}

function closeModal(e) {
  if (e.target === document.getElementById('modal')) closeModalDirect();
}

function closeModalDirect() {
  document.getElementById('modal').classList.remove('open');
}
