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
  if (id === 'fuel')     renderMeals();
  if (id === 'progress') renderStats();
  if (id === 'settings') initSettings();
}

function showSettings() {
  var btn = document.getElementById('tab-settings');
  if (btn) showPanel('settings', btn);
}

function showCycle(n, btn) {
  document.querySelectorAll('.cpanel').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.ctab').forEach(function(t) { t.classList.remove('active'); });
  document.getElementById('cy-' + n).classList.add('active');
  btn.classList.add('active');
}

// Run all render functions once the page is ready
storage.migrate();
renderCalendar();
renderWorkouts();
renderMeals();
renderSauces();
initLogs();
initSettings();
initToday();
