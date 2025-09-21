// Prashiskshan Service Worker - PWA & Offline Support
const CACHE_NAME = 'prashiskshan-v1';
const STATIC_CACHE_NAME = 'prashiskshan-static-v1';
const DYNAMIC_CACHE_NAME = 'prashiskshan-dynamic-v1';

// Cache static assets
const STATIC_ASSETS = [
  '/',
  '/projects',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Playfair+Display:wght@400;600;700&family=Fira+Code:wght@300;400;500&display=swap'
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
  
  // API requests - network first, cache as fallback
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone response for caching
          const responseClone = response.clone();
          
          // Cache successful responses
          if (response.ok) {
            caches.open(DYNAMIC_CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          
          return response;
        })
        .catch(() => {
          // Return cached version if network fails
          return caches.match(request);
        })
    );
    return;
  }
  
  // Static assets - cache first, network as fallback
  if (STATIC_ASSETS.some(asset => request.url.includes(asset))) {
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
            });
        })
    );
    return;
  }
  
  // All other requests - network first
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful GET requests
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
        // Return cached version if network fails
        return caches.match(request)
          .then((cachedResponse) => {
            return cachedResponse || new Response('Offline - Content not available');
          });
      })
  );
});

// Background sync for offline applications
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'sync-applications') {
    event.waitUntil(syncQueuedApplications());
  }
});

// Push notifications for application status updates
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Prashiskshan Update';
  const options = {
    body: data.body || 'You have a new update',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: data.data || {},
    actions: [
      {
        action: 'view',
        title: 'View Details',
        icon: '/icon-192x192.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    requireInteraction: true,
    tag: data.tag || 'default'
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event);
  
  event.notification.close();
  
  if (event.action === 'view') {
    const url = event.notification.data.url || '/dashboard';
    event.waitUntil(
      clients.openWindow(url)
    );
  }
});

// Helper function to sync queued applications
async function syncQueuedApplications() {
  try {
    // Get queued applications from IndexedDB
    const queuedApplications = await getQueuedApplications();
    
    for (const application of queuedApplications) {
      try {
        // Attempt to submit application
        const response = await fetch('/api/applications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(application.data)
        });
        
        if (response.ok) {
          // Remove from queue if successful
          await removeFromQueue(application.id);
          console.log('Service Worker: Synced application', application.id);
        }
      } catch (error) {
        console.error('Service Worker: Failed to sync application', application.id, error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Failed to sync applications', error);
  }
}

// IndexedDB helpers for offline queue
async function getQueuedApplications() {
  // TODO: Implement IndexedDB operations
  return [];
}

async function removeFromQueue(id) {
  // TODO: Implement IndexedDB removal
  console.log('Removing from queue:', id);
}