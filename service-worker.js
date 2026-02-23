const CACHE_NAME = "sa-sales-cache-v3";

// Essentiels (doivent exister)
const CORE = [
  "./",
  "./index.html",        // si ton fichier principal n'est pas index.html, remplace ici
  "./manifest.json",
  "./xlsx.full.min.js"
];

// Optionnels (si manquants, on ignore sans casser l'installation)
const OPTIONAL = [
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);

    // Core must succeed
    await cache.addAll(CORE);

    // Optional must not break install
    await Promise.allSettled(OPTIONAL.map((url) => cache.add(url)));

    self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
