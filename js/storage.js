// ============================================================
// STORAGE — single point of access for all localStorage I/O
// No DOM dependencies. Must load before all other JS files.
//
// Active in Phase 1: readLogs/writeLogs, readSettings/writeSettings
// All other read/write pairs are stubbed for Phase 2–5; do not
// call them from existing code until the relevant phase lands.
// ============================================================

const storage = (function () {

  const LOGS_KEY     = 'rowing_logs_v2';
  const PLANS_KEY    = 'rowing_week_plans_v2';
  const SHOPPING_KEY = 'rowing_shopping_v2';
  const SETTINGS_KEY = 'rowing_settings_v2';
  const CW_KEY        = 'rowing_custom_workouts_v2';
  const CR_KEY        = 'rowing_custom_recipes_v2';
  const COOLDOWNS_KEY = 'rowing_cooldowns_v2';

  // V1 keys targeted by one-time migration
  const V1_LIFT     = 'rowing_lift_log_v1';
  const V1_ERG      = 'rowing_erg_log_v1';
  const V1_WEIGHT   = 'rowing_weight_log_v1';
  const V1_SETTINGS = 'rowing_settings_v1';

  // _logType is the domain discriminator ('lift'|'erg'|'weight').
  // We use _logType rather than 'type' because erg entries already carry
  // type:'endurance'|'speed'|... for their session classification, and
  // renaming that field would touch all of log.js's render logic.
  // Plan: in Phase 3 (engine refactor), normalize: _logType → 'type',
  // erg session type → 'ergType'. Until then _logType is canonical.
  const LOG_TYPES = Object.freeze({ LIFT: 'lift', ERG: 'erg', WEIGHT: 'weight', COMPLETION: 'workoutCompletion' });

  function _get(key)      { try { return JSON.parse(localStorage.getItem(key)); } catch(e) { return null; } }
  function _set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

  // ---- Validation ------------------------------------------------

  function _isValidLogEntry(entry) {
    if (!entry || typeof entry !== 'object') return false;
    if (!entry._logType)                     return false;
    if (!entry.id)                           return false;
    if (!entry.date || isNaN(Date.parse(entry.date))) return false;
    return true;
  }

  // ---- Public read / write ----------------------------------------

  function readLogs()            { return _get(LOGS_KEY)     || []; }
  function writeLogs(d)          { _set(LOGS_KEY, d); }

  function readWeekPlans()       { return _get(PLANS_KEY)    || []; }
  function writeWeekPlans(d)     { _set(PLANS_KEY, d); }

  function readShoppingLists()   { return _get(SHOPPING_KEY) || []; }
  function writeShoppingLists(d) { _set(SHOPPING_KEY, d); }

  function readSettings()        { return _get(SETTINGS_KEY) || {}; }
  function writeSettings(d)      { _set(SETTINGS_KEY, d); }

  function readCustomWorkouts()    { return _get(CW_KEY) || []; }
  function writeCustomWorkouts(d)  { _set(CW_KEY, d); }

  function readCustomRecipes()     { return _get(CR_KEY)        || []; }
  function writeCustomRecipes(d)   { _set(CR_KEY, d); }

  function readCooldowns()         { return _get(COOLDOWNS_KEY) || {}; }
  function writeCooldowns(d)       { _set(COOLDOWNS_KEY, d); }

  // ---- Migration helpers -----------------------------------------

  function _verifyMigrationIntegrity(merged, expected) {
    if (merged.length !== expected) {
      console.warn('[storage] Integrity: count mismatch', { expected, got: merged.length });
      return false;
    }
    const invalid = merged.filter(e => !_isValidLogEntry(e));
    if (invalid.length > 0) {
      console.warn('[storage] Integrity: invalid entries found', invalid);
      return false;
    }
    return true;
  }

  function _migrateLogsV1toV2() {
    if (localStorage.getItem(LOGS_KEY) !== null) return;

    const lifts   = _get(V1_LIFT)   || [];
    const ergs    = _get(V1_ERG)    || [];
    const weights = _get(V1_WEIGHT) || [];
    const expected = lifts.length + ergs.length + weights.length;

    const merged = [
      ...lifts.map(e   => Object.assign({}, e, {_logType: LOG_TYPES.LIFT})),
      ...ergs.map(e    => Object.assign({}, e, {_logType: LOG_TYPES.ERG})),
      ...weights.map(e => Object.assign({}, e, {_logType: LOG_TYPES.WEIGHT}))
    ].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    _set(LOGS_KEY, merged);

    if (!_verifyMigrationIntegrity(merged, expected)) {
      console.warn('[storage] _migrateLogsV1toV2: integrity check failed — V1 keys preserved');
      return;
    }

    localStorage.removeItem(V1_LIFT);
    localStorage.removeItem(V1_ERG);
    localStorage.removeItem(V1_WEIGHT);
  }

  function _migrateSettingsV1toV2() {
    if (localStorage.getItem(SETTINGS_KEY) !== null) return;
    const v1 = _get(V1_SETTINGS);
    if (v1 !== null) {
      _set(SETTINGS_KEY, Object.assign({}, v1, { settingsVersion: 2 }));
      localStorage.removeItem(V1_SETTINGS);
    }
  }

  function migrate() {
    _migrateLogsV1toV2();
    _migrateSettingsV1toV2();
  }

  // ---- Backup / restore ------------------------------------------

  function exportAll() {
    var payload = {
      version:        2,
      exportedAt:     new Date().toISOString(),
      logs:           _get(LOGS_KEY)        || [],
      weekPlans:      _get(PLANS_KEY)       || [],
      settings:       _get(SETTINGS_KEY)    || {},
      customWorkouts: _get(CW_KEY)          || [],
      customRecipes:  _get(CR_KEY)          || [],
      cooldowns:      _get(COOLDOWNS_KEY)   || {}
    };
    var json = JSON.stringify(payload, null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    var date = new Date().toISOString().slice(0, 10);
    a.href = url; a.download = 'rowing_backup_' + date + '.json'; a.click();
    URL.revokeObjectURL(url);
  }

  function importAll(json) {
    var data;
    try { data = JSON.parse(json); } catch(e) { return { ok: false, error: 'Invalid JSON' }; }
    if (!data || data.version !== 2) return { ok: false, error: 'Unknown backup format (expected version 2)' };

    if (Array.isArray(data.logs))                              _set(LOGS_KEY,        data.logs);
    if (Array.isArray(data.weekPlans))                         _set(PLANS_KEY,       data.weekPlans);
    if (data.settings  && typeof data.settings  === 'object') _set(SETTINGS_KEY,    data.settings);
    if (Array.isArray(data.customWorkouts))                    _set(CW_KEY,          data.customWorkouts);
    if (Array.isArray(data.customRecipes))                     _set(CR_KEY,          data.customRecipes);
    if (data.cooldowns && typeof data.cooldowns === 'object')  _set(COOLDOWNS_KEY,   data.cooldowns);

    return { ok: true, count: (data.logs || []).length };
  }

  // ---- Public API -------------------------------------------------

  return {
    readLogs, writeLogs,
    readSettings, writeSettings,
    migrate,
    isValidLogEntry: _isValidLogEntry,
    LOG_TYPES,
    readWeekPlans, writeWeekPlans,
    readShoppingLists, writeShoppingLists,
    readCustomWorkouts, writeCustomWorkouts,
    readCustomRecipes, writeCustomRecipes,
    readCooldowns, writeCooldowns,
    exportAll, importAll
  };

})();
