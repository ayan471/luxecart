// Service Worker for offline functionality

const CACHE_NAME = "luxemarket-v1";
const urlsToCache = ["/", "/offline", "/products", "/cart", "/wishlist"];

// Install event - cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );

  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // Take control of clients immediately
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  // Skip browser-sync and chrome-extension requests
  if (
    event.request.url.includes("browser-sync") ||
    event.request.url.includes("chrome-extension")
  )
    return;

  // Handle API requests differently
  if (event.request.url.includes("/api/")) {
    // For API requests, try network first, then fall back to offline handling
    event.respondWith(
      fetch(event.request).catch(() => {
        // If network request fails, return a custom response for API
        return new Response(
          JSON.stringify({
            error: "You are offline",
            offline: true,
            timestamp: new Date().toISOString(),
          }),
          {
            status: 503,
            headers: { "Content-Type": "application/json" },
          }
        );
      })
    );
    return;
  }

  // For page navigations, try network first, then cache
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          // If not in cache, return the offline page
          return caches.match("/offline");
        });
      })
    );
    return;
  }

  // For all other requests (assets, etc.), use cache-first strategy
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return from cache if found
      if (response) {
        return response;
      }

      // Otherwise fetch from network
      return fetch(event.request)
        .then((response) => {
          // Don't cache if not a valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response as it can only be consumed once
          const responseToCache = response.clone();

          // Add to cache for future use
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // If both cache and network fail, return a generic fallback
          if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
            return new Response(
              '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#eaeaea"/><text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle" fill="#888">Image Unavailable</text></svg>',
              { headers: { "Content-Type": "image/svg+xml" } }
            );
          }
          return new Response("Content not available offline");
        });
    })
  );
});

// Listen for messages from the client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
