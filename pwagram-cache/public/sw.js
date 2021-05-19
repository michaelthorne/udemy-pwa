const CACHE_STATIC_NAME = 'static-v5'
const CACHE_DYNAMIC_NAME = 'dynamic-v2'

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker …', event)
  // Use the Cache API to cache the static app shell.
  // N.B. Wait until the cache preparation is complete before continuing!
  event.waitUntil(caches.open(CACHE_STATIC_NAME).then((cache) => {
    console.log('[Service Worker] Precaching App Shell …', cache)
    cache.addAll([
        '/',
        '/index.html',
        '/help/',
        '/help/index.html',
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

self.addEventListener('fetch', function(event) {
  // event.respondWith(fetch(event.request))
  event.respondWith(
      // Intercept the request and see if it is in the cache
      caches.match(event.request).then((response) => {
        if (response) {
          return response // Return the response from the cache
        }

        // Dynamically cache requests that are not statically cached
        return fetch(event.request).then((res) => {
          return caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
            cache.put(event.request.url, res.clone()) // Store a clone of the response so that it is not consumed
            return res // Returns the original response
          }).catch((err) => {

          })
        })
      })
  )
})
