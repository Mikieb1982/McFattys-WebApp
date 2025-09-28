// Basic offline cache for the single page app
const CACHE = 'mcfattys-v2';
const ASSETS = [
  './',
  './index.html',
  './Logo.png',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon-180.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// Network-first for navigations, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Allow Firebase Auth and other reserved endpoints to bypass the service worker
  // so that redirect-based providers (like Google Sign-In) can complete successfully
  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;

  if (!isSameOrigin || url.pathname.startsWith('/__/')) {
    return;
  }

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put('./', copy)).catch(() => {});
        return r;
      }).catch(() => caches.match('./'))
    );
    return;
  }

  // Only handle GET requests for same-origin assets
  if (req.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      return r;
    }))
  );
});