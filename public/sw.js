// A service worker using a stale-while-revalidate strategy.
const CACHE_NAME = 'ojirku-cache-v9';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/manifest.json',
  '/icon.svg',
  '/icon_maskable.svg',
  'https://cdn.tailwindcss.com',
  'https://esm.sh/react@^19.1.1',
  'https://esm.sh/react-dom@^19.1.1/client',
  'https://esm.sh/recharts@^3.1.0',
  'https://esm.sh/@google/genai@^1.11.0',
  'https://esm.sh/dexie@^4.0.11'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Use a stale-while-revalidate strategy for all requests.
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // If we get a valid response, update the cache.
          // We don't cache non-200 responses or chrome extension requests.
          if (networkResponse && networkResponse.status === 200 && !event.request.url.startsWith('chrome-extension://')) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(err => {
          // Network failed, which is expected when offline.
          // The initial cache.match() will handle this if the resource is cached.
          console.warn('ServiceWorker fetch failed:', event.request.url, err);
        });

        // Return the cached response immediately if it exists,
        // otherwise wait for the network response.
        return response || fetchPromise;
      });
    })
  );
});


self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});