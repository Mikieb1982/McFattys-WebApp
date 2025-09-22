const CACHE = "mcfattys-v1";
const ASSETS = [
  "/McFattys/",
  "/McFattys/index.html",
  "/McFattys/manifest.json",
  "/McFattys/logo.png"
  // add your CSS and JS files here, using the /McFattys/ prefix
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then(hit =>
        hit ||
        fetch(event.request).then(resp => {
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put(event.request, copy));
          return resp;
        }).catch(() => caches.match("/McFattys/index.html"))
      )
    );
  }
});