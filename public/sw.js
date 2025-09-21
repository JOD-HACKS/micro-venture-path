// Basic Service Worker for caching - hardcoded for frontend demo
const CACHE_NAME = 'prashiskshan-demo-v1';
const STATIC_CACHE_NAME = 'prashiskshan-static-demo-v1';
const DYNAMIC_CACHE_NAME = 'prashiskshan-dynamic-demo-v1';

// Cache static assets - no external API calls
const STATIC_ASSETS = [
  '/',
  '/projects',
  '/auth',
  '/dashboard',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets', error);
      })
  );
  
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
  
  self.clients.claim();
});

// Fetch event - network first with cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }
  
  // Basic fetch handler - cache first for static assets, network for dynamic content
  if (request.url.includes('.js') || request.url.includes('.css') || request.url.includes('.png') || request.url.includes('.svg')) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          return cachedResponse || fetch(request)
            .then((response) => {
              const responseClone = response.clone();
              caches.open(STATIC_CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
              return response;
            })
            .catch(() => {
              return new Response('Resource not available offline');
            });
        })
    );
    return;
  }
  
  // All other requests - network first with basic cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (request.method === 'GET' && response.ok) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request)
          .then((cachedResponse) => {
            return cachedResponse || new Response('Offline - Content not available');
          });
      })
  );
});

// Basic service worker - no complex sync or push features
console.log('Prashiskshan Service Worker loaded - frontend demo mode');