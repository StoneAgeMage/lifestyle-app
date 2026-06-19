// ============================================================
// SERVICE WORKER — Rowing Planner
// ============================================================
//
// HOW CACHING WORKS (plain English):
//   On first visit, this script runs in the background and
//   downloads every file in PRECACHE_ASSETS into a local cache.
//   On every subsequent visit — including offline — files are
//   served from that cache instantly, without touching the network.
//
// HOW TO UPDATE THE APP:
//   Whenever you change any cached file (fix a bug, update data,
//   tweak CSS), do ONE thing: bump the version number below.
//
//     'rowing-v1'  →  'rowing-v2'
//
//   On the next visit the browser will:
//     1. Install the new SW and cache all fresh files
//     2. Delete the old 'rowing-v1' cache automatically
//     3. Serve fresh files immediately
//
// DURING DEVELOPMENT — avoid stale cache headaches:
//   Open DevTools → Application → Service Workers → tick
//   "Update on reload". This forces a fresh SW on every F5.
//   OR: Hard-refresh with Ctrl+Shift+R (bypasses SW for that tab).
//   OR: Application → Cache Storage → right-click → Delete.
//
// ============================================================

// ---- Version ----
// This is the ONLY string you need to change when deploying updates.
const CACHE_NAME = 'rowing-v24';

// ---- Files to cache ----
// Every file here is fetched and stored during the install step.
// If any path is wrong or the server returns an error, the entire
// install fails — the old version keeps running. This is safe.
//
// Rules for this list:
//   ✓ Include every file the app needs to run
//   ✗ Do NOT include Google Fonts or any external URL
//   ✗ Do NOT include this file (service-worker.js) itself
//
const PRECACHE_ASSETS = [
  '/',               // Root URL — browser sends this when user opens the app
  'index.html',      // Direct URL — same content, different request
  'css/styles.css',
  'js/storage.js',
  'js/data-ingredients.js',
  'js/data-recipes.js',
  'js/data-workouts.js',
  'js/data-blocks.js',
  'js/data-mobility.js',
  'js/data-training-plans.js',
  'js/engine.js',
  'js/calendar.js',
  'js/workouts.js',
  'js/meals.js',
  'js/log.js',
  'js/settings.js',
  'js/dashboard.js',
  'js/vitals.js',
  'js/meal-planner.js',
  'js/progress.js',
  'js/app.js'
  // ✗ NOT caching Google Fonts — they are cross-origin and manage
  //   their own HTTP cache headers. Trying to cache them here
  //   causes opaque response issues and cache bloat.
  //   The app falls back to system sans-serif when offline, which is fine.
];

// ============================================================
// INSTALL EVENT
// Fires the first time this SW is registered, and again
// whenever CACHE_NAME changes (i.e., when you deploy an update).
//
// event.waitUntil() keeps the SW in the "installing" state
// until the Promise resolves. If the Promise rejects (e.g. a
// file is missing), the install fails and the old SW stays active.
// ============================================================
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        // cache.addAll is all-or-nothing:
        // every file must succeed or the whole install is aborted.
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(function () {
        // By default a new SW waits until all tabs running the old
        // version are closed before it takes over. skipWaiting()
        // skips that wait and activates immediately.
        //
        // This is safe for this app because:
        //  - No WebSocket / server-sent event connections to break
        //  - localStorage (training log data) is unaffected by the SW
        return self.skipWaiting();
      })
  );
});

// ============================================================
// ACTIVATE EVENT
// Fires after install, once the SW takes control of the page.
// The right place to clean up old caches from previous versions.
//
// Without this cleanup, old caches would accumulate on the
// user's device every time you bump the version number.
// ============================================================
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (allCacheNames) {
        return Promise.all(
          allCacheNames
            .filter(function (name) {
              // Keep only the current cache; delete everything else.
              // This automatically removes 'rowing-v1' when you move to 'rowing-v2'.
              return name !== CACHE_NAME;
            })
            .map(function (name) {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(function () {
        // clients.claim() makes this SW the active controller for
        // all open tabs immediately, without requiring a page reload.
        return self.clients.claim();
      })
  );
});

// ============================================================
// FETCH EVENT
// Intercepts every network request the page makes.
//
// Strategy: Cache-First with Network Fallback
//
//   Request comes in
//       ↓
//   Is it in the cache?
//       ↓ YES → return cached response immediately (fast, offline-safe)
//       ↓ NO  → fetch from network, return whatever comes back
//
// Why cache-first for this app?
//   - All app logic is local — no API calls for workout/meal data
//   - Training log data lives in localStorage, not affected by this SW
//   - Speed and offline reliability matter more than freshness
//   - When you update the app, bumping the version re-caches everything
// ============================================================
self.addEventListener('fetch', function (event) {
  // Only handle GET requests.
  // POST/PUT/DELETE should always go to the network (forms, APIs, etc.)
  if (event.request.method !== 'GET') return;

  // Ignore cross-origin requests (Google Fonts, anything external).
  // self.location.origin is the origin of this service worker file itself.
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request)
      .then(function (cachedResponse) {
        if (cachedResponse) {
          // Found in cache — return it without touching the network.
          return cachedResponse;
        }
        // Not in cache — try the network.
        // If that also fails (offline), serve index.html as a fallback
        // so the user sees the app instead of the browser's error page.
        return fetch(event.request).catch(function () {
          return caches.match('index.html');
        });
      })
  );
});
