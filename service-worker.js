// public/service-worker.js
// Simple offline cache for static assets and the shell (index.html)
const CACHE_NAME = "school-bell-v1";
const ASSETS = [
  "/",
  "/index.html"
];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : Promise.resolve())))
    )
  );
});
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  event.respondWith(
    caches.match(request).then(cached => {
      const fetchPromise = fetch(request).then(response => {
        // Cache JS/CSS assets; avoid caching audio responses to respect CORS and size
        const ct = response.headers.get("content-type") || "";
        if (response.ok && (ct.includes("text/html") || ct.includes("text/css") || ct.includes("javascript"))) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy)).catch(() => {});
        }
        return response;
      }).catch(() => cached || Promise.reject("offline"));
      return cached || fetchPromise;
    })
  );
});
