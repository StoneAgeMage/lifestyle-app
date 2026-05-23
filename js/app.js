// ============================================================
// APP — tab switching, cycle switching, initialization
// Must be loaded last (after all other JS files)
// ============================================================

function showPanel(id, btn) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`panel-${id}`).classList.add('active');
  btn.classList.add('active');
}

function showCycle(n, btn) {
  document.querySelectorAll('.cpanel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.ctab').forEach(t => t.classList.remove('active'));
  document.getElementById(`cy-${n}`).classList.add('active');
  btn.classList.add('active');
}

// Run all render functions once the page is ready
renderCalendar();
renderWorkouts();
renderMeals();
renderSauces();
renderStrategy();
initLogs();
