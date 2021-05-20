const CACHE_STATIC_NAME = 'static-v0.0.6'
const CACHE_DYNAMIC_NAME = 'dynamic-v0.0.1'

const STATIC_ASSETS = [
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
]

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker …', event)
  // Use the Cache API to cache the static app shell.
  // N.B. Wait until the cache preparation is complete before continuing!
  event.waitUntil(caches.open(CACHE_STATIC_NAME).then((cache) => {
    console.log('[Service Worker] Precaching App Shell …', cache)
    cache.addAll(STATIC_ASSETS)
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

function isInArray(string, array) {
  let cachePath
  if (string.indexOf(self.origin) === 0) { // request targets domain where we serve the page from (i.e. NOT a CDN)
    cachePath = string.substring(self.origin.length) // take the part of the URL AFTER the domain (e.g. after localhost:8080)
  } else {
    cachePath = string // store the full request (for CDNs)
  }
  return array.indexOf(cachePath) > -1
}

// Cache then network, with offline support strategy.
self.addEventListener('fetch', (event) => {
  const url = 'https://httpbin.org/get'

  // Cache, then network for the URL that triggers our cache usage
  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(
        caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
          return fetch(event.request).then((res) => {
            cache.put(event.request, res.clone())
            return res
          })
        })
    )
  } else if (isInArray(event.request.url, STATIC_ASSETS)) { // Check if request URL is for any of the static assets
    // Cache only strategy
    event.respondWith(
        caches.match(event.request)
    )
  } else {
    // Cache, with network fallback strategy.
    event.respondWith(
      caches.match(event.request).then((response) => {
          if (response) {
            return response // Return the response from the cache
          }

          // Dynamically cache requests that are not statically cached
          return fetch(event.request).then((res) => {
            return caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
              cache.put(event.request.url, res.clone()) // Store a clone of the response so that it is not consumed
              return res // Returns the original response
            })
          }).catch((err) => {
            // Return an offline page if there is no item found in the cache
            return caches.open(CACHE_STATIC_NAME).then((cache) => {
              // Only show the offline page when attempting to request HTML files
              if (event.request.headers.get('accept').includes('text/html')) {
                return cache.match('/offline.html');
              }
            })
          })
        })
    )
  }
})

// Cache with network and dynamic fallback strategy.
// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//       caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
//         return fetch(event.request).then((res) => {
//           cache.put(event.request, res.clone())
//           return res
//         })
//       })
//   )
// })

// Network with cache fallback strategy.
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//       // Attempt the network request
//       fetch(event.request).then((res) => {
//         return caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
//           cache.put(event.request.url, res.clone())
//           return res
//         })
//       }).catch(() => {
//         return caches.match(event.request)
//       })
//   )
// })

// Cache with network fallback strategy.
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
