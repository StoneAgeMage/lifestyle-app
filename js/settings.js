// ============================================================
// SETTINGS — centralized app configuration
// No dependencies — must load before dashboard.js
// ============================================================

const SETTINGS_DEFAULTS = {
  goalWeight:       165,
  weightUnit:       'lb',
  mealPrepDay:      0,      // 0 = Sunday … 6 = Saturday
  showPantryStaples: false,  // shopping list hides pantry staples by default
};

// Exposed globally so dashboard.js can use it for day names
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

// ---- Settings Panel -----------------------------------------

function renderSettingsForm() {
  const el = document.getElementById('settings-form');
  if (!el) return;

  const s = loadSettings();

  el.innerHTML = `
    <div class="lf-row" style="margin-bottom:4px">
      <div class="lf-group">
        <label class="lf-label" for="st-goal-weight">Goal Weight</label>
        <div style="display:flex;gap:8px;align-items:center">
          <input type="number" id="st-goal-weight" class="lf-input"
            value="${s.goalWeight}" min="50" max="500" step="0.1" style="max-width:130px">
          <span class="st-unit-preview" id="st-unit-preview">${s.weightUnit}</span>
        </div>
      </div>
    </div>

    <div class="lf-row" style="margin-bottom:4px">
      <div class="lf-group">
        <label class="lf-label">Weight Unit</label>
        <div class="st-radio-group">
          <label class="st-radio">
            <input type="radio" name="st-weight-unit" value="lb"
              ${s.weightUnit === 'lb' ? 'checked' : ''}
              onchange="document.getElementById('st-unit-preview').textContent='lb'">
            <span>Pounds (lb)</span>
          </label>
          <label class="st-radio">
            <input type="radio" name="st-weight-unit" value="kg"
              ${s.weightUnit === 'kg' ? 'checked' : ''}
              onchange="document.getElementById('st-unit-preview').textContent='kg'">
            <span>Kilograms (kg)</span>
          </label>
        </div>
      </div>
    </div>

    <div class="lf-row" style="margin-bottom:0">
      <div class="lf-group" style="max-width:280px">
        <label class="lf-label" for="st-prep-day">Meal Prep Day</label>
        <select id="st-prep-day" class="lf-input">
          ${DOW_NAMES.map((d, i) =>
            `<option value="${i}"${s.mealPrepDay === i ? ' selected' : ''}>${d}</option>`
          ).join('')}
        </select>
      </div>
    </div>

    <div class="lf-row" style="margin-bottom:0">
      <div class="lf-group">
        <label class="lf-label">Shopping List</label>
        <label class="st-toggle">
          <input type="checkbox" id="st-pantry-staples" ${s.showPantryStaples ? 'checked' : ''}>
          <span>Show pantry staples in shopping list</span>
        </label>
      </div>
    </div>

    <div class="st-note">
      Changing weight units does not convert previously logged weights.
      Update goal weight manually if you switch units.
    </div>

    <div class="lf-row" style="margin-top:8px">
      <div class="lf-group">
        <label class="lf-label">Backup &amp; Restore</label>
        <div class="st-backup-row">
          <button class="st-backup-btn" onclick="exportBackup()">Export Backup</button>
          <label class="st-backup-btn st-import-label" for="st-import-file">Import Backup</label>
          <input type="file" id="st-import-file" accept=".json" style="display:none" onchange="importBackupFile(event)">
        </div>
        <div class="st-note">Export downloads all logs and plans as JSON. Import restores from a previous export — existing data is overwritten.</div>
      </div>
    </div>

    <div class="st-save-row">
      <button class="log-btn" onclick="saveSettingsForm()">Save Settings</button>
    </div>`;
}

function saveSettingsForm() {
  const goalWeightEl = document.getElementById('st-goal-weight');
  const unitEl       = document.querySelector('input[name="st-weight-unit"]:checked');
  const prepDayEl    = document.getElementById('st-prep-day');
  if (!goalWeightEl || !unitEl || !prepDayEl) return;

  const goalWeight      = parseFloat(goalWeightEl.value);
  const weightUnit      = unitEl.value;
  const mealPrepDay     = parseInt(prepDayEl.value, 10);
  const pantryEl        = document.getElementById('st-pantry-staples');
  const showPantryStaples = pantryEl ? pantryEl.checked : false;

  if (isNaN(goalWeight) || goalWeight < 50 || goalWeight > 500) {
    showToast('Enter a valid goal weight (50–500)');
    return;
  }

  saveSettings({ goalWeight, weightUnit, mealPrepDay, showPantryStaples });

  // Re-render the dashboard cards that consume these settings.
  // Works whether the dashboard panel is visible or not — the DOM
  // nodes always exist and will reflect the new values on next visit.
  renderWeightSummary();
  renderMealPrepCountdown();

  showToast('Settings saved ✓');
}

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
      if (typeof renderLiftHistory === 'function') renderLiftHistory();
      if (typeof renderErgHistory  === 'function') renderErgHistory();
      if (typeof renderStats       === 'function') renderStats();
      renderSettingsForm();
    } else {
      alert('Import failed: ' + result.error);
    }
  };
  reader.readAsText(file);
}

function initSettings() {
  renderSettingsForm();
}
