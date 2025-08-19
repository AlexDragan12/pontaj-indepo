// sw.js (cache static)
const CACHE = "pontaj-static-v2"; // crește numărul la fiecare update
const ASSETS = [
  "./",
  "./index.html",
  "./scan.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./sigla.png"
  // adaugă aici fișierele tale css/js locale, dacă ai
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // cache-first pentru asset-urile enumerate
  if (ASSETS.some(path => url.pathname.endsWith(path.replace("./","/")))) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
    return;
  }
  // altfel: network-first cu fallback din cache
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
