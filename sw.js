const CACHE = 'mcfattys-v4';
const ASSETS = [
  './','./index.html','./app.js','./logo.png',
  './manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))) .then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e=>{
  const req=e.request; if(req.method!=='GET') return;
  const wantsHTML = (req.headers.get('accept')||'').includes('text/html');
  if (wantsHTML){
    e.respondWith(
      fetch(req).then(res=>{ caches.open(CACHE).then(c=>c.put(req,res.clone())); return res; })
      .catch(()=>caches.match(req).then(r=>r||caches.match('./index.html')))
    );
  } else {
    e.respondWith(
      caches.match(req).then(hit=>hit || fetch(req).then(res=>{ caches.open(CACHE).then(c=>c.put(req,res.clone())); return res; })
      .catch(()=>caches.match('./index.html')))
    );
  }
});
