/* Service Worker – macht die App offline-fähig (installierbar als PWA).
 * Strategie: "Network first" mit Cache-Fallback – online immer aktuell,
 * offline aus dem Cache. */
var CACHE = "katzengesundheit-v2";
var SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/css/styles.css",
  "./assets/js/data-nutrients.js",
  "./assets/js/data-breeds.js",
  "./assets/js/data-diseases.js",
  "./assets/js/data-foods-db.js",
  "./assets/js/storage.js",
  "./assets/js/calc.js",
  "./assets/js/recommend.js",
  "./assets/js/careplan.js",
  "./assets/js/app.js",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/apple-touch-icon.png",
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req).then(function (resp) {
      var copy = resp.clone();
      caches.open(CACHE).then(function (c) { c.put(req, copy); });
      return resp;
    }).catch(function () {
      return caches.match(req).then(function (r) { return r || caches.match("./index.html"); });
    })
  );
});
