// ============================================================
// SETTINGS — centralized app configuration + Data Management modal
// No dependencies — must load before dashboard.js
// ============================================================

const SETTINGS_DEFAULTS = {
  goalWeight:             165,
  startWeight:            185,
  weightUnit:             'lb',
  dailyCalorieTarget:     2100,
  dailyBaselineCalories:  800,
  macroPctProtein:        22,
  macroPctFat:            28,
  mealPrepDay:            0,
  age:                    null,
  knownMaxHR:             null,
};

// Exposed globally so other modules can use it for day names
const DOW_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function loadSettings() {
  try {
    const saved = storage.readSettings() || {};
    return Object.assign({}, SETTINGS_DEFAULTS, saved);
  } catch(e) {
    return Object.assign({}, SETTINGS_DEFAULTS);
  }
}

function saveSettings(d) {
  storage.writeSettings(d);
}

// ---- Data Management Modal ----------------------------------

function showDataManagement() {
  var s = loadSettings();

  var overlay = document.getElementById('dm-modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'dm-modal-overlay';
    overlay.className = 'rm-overlay';
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeDataManagement();
    });
    document.body.appendChild(overlay);
  }

  overlay.innerHTML =
    '<div class="rm-modal dm-modal">' +
    '<button class="rm-close" onclick="closeDataManagement()">✕</button>' +
    '<div class="rm-header"><div class="rm-name">Data Management</div></div>' +
    '<div class="rm-body">' +

    '<div class="rm-section-title">Backup &amp; Restore</div>' +
    '<div class="st-backup-row">' +
    '<button class="st-backup-btn" onclick="exportBackup()">Export Backup (JSON)</button>' +
    '<label class="st-backup-btn st-import-label" for="dm-import-file">Import Backup</label>' +
    '<input type="file" id="dm-import-file" accept=".json" style="display:none" onchange="importBackupFile(event)">' +
    '</div>' +
    '<p class="st-note">Export downloads all logs and plans as JSON. Import restores from a previous export — existing data is overwritten.</p>' +

    '<div class="rm-section-title" style="margin-top:16px">App Preferences</div>' +
    '<div class="lf-row" style="margin-bottom:8px">' +
    '<div class="lf-group" style="max-width:280px">' +
    '<label class="lf-label">Meal Prep Day</label>' +
    '<select id="dm-prep-day" class="lf-input">' +
    DOW_NAMES.map(function(d, i) {
      return '<option value="' + i + '"' + (s.mealPrepDay === i ? ' selected' : '') + '>' + d + '</option>';
    }).join('') +
    '</select>' +
    '</div>' +
    '</div>' +
    '<button class="log-btn" onclick="saveDMPrefs()">Save Preferences</button>' +

    '</div>' +
    '</div>';

  overlay.classList.add('visible');
}

function closeDataManagement() {
  var overlay = document.getElementById('dm-modal-overlay');
  if (overlay) overlay.classList.remove('visible');
}

function saveDMPrefs() {
  var prepDayEl = document.getElementById('dm-prep-day');
  if (!prepDayEl) return;
  var s = loadSettings();
  saveSettings(Object.assign({}, s, { mealPrepDay: parseInt(prepDayEl.value, 10) }));
  showToast('Preferences saved ✓');
}

// ---- Backup & Restore ---------------------------------------

function exportBackup() {
  storage.exportAll();
  showToast('Backup downloaded ✓');
}

function importBackupFile(event) {
  var file = event.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    var result = storage.importAll(e.target.result);
    if (result.ok) {
      showToast('Restored ' + result.count + ' log entries ✓');
      if (typeof renderProgress === 'function') renderProgress();
      if (typeof initVitals === 'function') initVitals();
    } else {
      alert('Import failed: ' + result.error);
    }
  };
  reader.readAsText(file);
}
