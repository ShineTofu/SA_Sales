const CACHE_NAME = "sa-sales-cache-v3";

// Mets ici les fichiers ESSENTIELS uniquement (ceux qui existent sûr)
const CORE = [
  "./",                 
  "./index.html",        
  "./manifest.json",
  "./xlsx.full.min.js"
];

// Optionnels: si un fichier n'existe pas, on l'ignore sans casser l'installation
const OPTIONAL = [
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);

    // 1) cache core (doit réussir)
    await cache.addAll(CORE);

    // 2) cache optional (ne doit pas casser si 404)
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
