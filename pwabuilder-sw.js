// pwabuilder-sw.js - simple caching service worker
const cacheName = 'lyonblack-v1';
const offlineAssets = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(offlineAssets))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch - Cache-first for offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Optionally cache new requests
        return response;
      }).catch(() => {
        // fallback when offline (could return a local offline page)
        return caches.match('/');
      });
    })
  );
});
