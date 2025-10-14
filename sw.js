const CACHE_NAME = "school-bell-cache-v1";
const ASSETS = [
  "/", "/index.html", "/manifest.json",
  "/audio/classic.mp3", "/audio/digital.wav", "/audio/long.mp3",
  "/audio/repeated.wav", "/audio/announcement2.mp3"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(resp => resp || fetch(e.request)));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
});