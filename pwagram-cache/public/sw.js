const CACHE_STATIC_NAME = 'static-v0.0.4'
const CACHE_DYNAMIC_NAME = 'dynamic-v0.0.1'

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker …', event)
  // Use the Cache API to cache the static app shell.
  // N.B. Wait until the cache preparation is complete before continuing!
  event.waitUntil(caches.open(CACHE_STATIC_NAME).then((cache) => {
    console.log('[Service Worker] Precaching App Shell …', cache)
    cache.addAll([
        '/',
        '/index.html',
        '/offline.html',
        '/src/js/app.js',
        '/src/js/feed.js',
        '/src/js/material.min.js',
        '/src/css/app.css',
        '/src/css/feed.css',
        '/src/images/main-image.jpg',
        'https://fonts.googleapis.com/css?family=Roboto:400,700',
        'https://fonts.googleapis.com/icon?family=Material+Icons',
        'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
    ])
    // cache.add('/')
    // cache.add('/index.html')
    // cache.add('/src/js/app.js')
  }))
})

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker …', event)
  // Cache clean-up
  event.waitUntil(
      caches.keys().then((keys) => {
        return Promise.all(keys.map((key) => {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[Service Worker]: Removing old cache', key)
            return caches.delete(key)
          }
        }))
      })
  )
  return self.clients.claim()
})

// Network with cache fallback strategy.
self.addEventListener('fetch', function(event) {
  event.respondWith(
      // Attempt the network request
      fetch(event.request).then((res) => {
        return caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
          cache.put(event.request.url, res.clone())
          return res
        })
      }).catch(() => {
        return caches.match(event.request)
      })
  )
})

// Cache with network fallback.
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//       // Intercept the request and see if it is in the cache
//       caches.match(event.request).then((response) => {
//         if (response) {
//           return response // Return the response from the cache
//         }
//         // Return the request as per normal
//         // return fetch(event.request)
//
//         // Dynamically cache requests that are not statically cached
//         return fetch(event.request).then((res) => {
//           return caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
//             cache.put(event.request.url, res.clone()) // Store a clone of the response so that it is not consumed
//             return res // Returns the original response
//           })
//         }).catch((err) => {
//           // Return an offline page if there is no item found in the cache
//           return caches.open(CACHE_STATIC_NAME).then((cache) => {
//             return cache.match('/offline.html');
//           })
//         })
//       })
//   )
// })

// Cache-only strategy
// self.addEventListener('fetch', function(event) {
//   event.respondWith(caches.match(event.request)) // Only reference the cache
// })

// Network-only strategy
// self.addEventListener('fetch', function(event) {
//   fetch(event.request) // Never reference the cache – default behaviour
// })
