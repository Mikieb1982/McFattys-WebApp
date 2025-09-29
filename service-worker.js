// service-worker.js

const CACHE = 'mcfattys-v2';
const ASSETS = [
  './',
  './index.html',
  './Logo.png',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon-180.png',
  './css/themes.css',
  './css/base.css',
  './css/layout.css',
  './css/tiles.css',
  './js/main.js',
  './js/tiles.js',
  './js/features/context.js',
  './js/features/intention.js',
  './js/tiles/logo.js',
  './js/tiles/manifesto.js',
  './js/tiles/welcome.js',
  './js/tiles/intention.js',
  './js/tiles/support.js',
  './js/tiles/stats.js',
  './js/tiles/quick-add.js',
  './js/tiles/recent-log.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => {
        if (key !== CACHE) {
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Don't handle Firebase auth requests.
  if (url.pathname.startsWith('/__/')) {
    return;
  }

  // For navigation requests, use a network-first strategy.
  // This ensures the authentication redirect works correctly.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('./index.html');
      })
    );
    return;
  }

  // For all other requests, use a cache-first strategy.
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      return cachedResponse || fetch(request).then((networkResponse) => {
        const responseToCache = networkResponse.clone();
        caches.open(CACHE).then((cache) => {
          cache.put(request, responseToCache);
        });
        return networkResponse;
      });
    })
  );
});
