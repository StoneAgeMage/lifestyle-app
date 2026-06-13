// ============================================================
// APP — tab switching, cycle switching, initialization
// Must be loaded last (after all other JS files)
// ============================================================

function showPanel(id, btn) {
  document.querySelectorAll('.panel').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
  document.getElementById('panel-' + id).classList.add('active');
  btn.classList.add('active');
  if (id === 'today')    initToday();
  if (id === 'plan')     renderPlanWeeks();
  if (id === 'fuel')     initMealPlanner();
  if (id === 'progress') renderProgress();
  if (id === 'settings') initVitals();
}

// Called from the meal plan nudge banner on the Execute tab.
// Switches to the Fuel tab and pre-selects the given week offset.
function switchToFuelTab(weekOffset) {
  var btn = document.getElementById('tab-fuel');
  if (!btn) return;
  showPanel('fuel', btn);
  if (typeof mpSwitchWeek === 'function') mpSwitchWeek(weekOffset || 0);
}

function showSettings() {
  showDataManagement();
}

function showCycle(n, btn) {
  document.querySelectorAll('.cpanel').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.ctab').forEach(function(t) { t.classList.remove('active'); });
  document.getElementById('cy-' + n).classList.add('active');
  btn.classList.add('active');
}

// Run all render functions once the page is ready
storage.migrate();
renderPlanWeeks();
initMealPlanner();
initLogs();
initVitals();
initToday();
