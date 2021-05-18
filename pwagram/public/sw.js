// Install
self.addEventListener('install', (e) => {
    console.log('[Service Worker]: Installing …', e)
})

// Activate
self.addEventListener('activate', (e) => {
    console.log('[Service Worker]: Activating …', e)
    return self.clients.claim() // Ensure the Service Worker is activated correctly
})

// Fetch
self.addEventListener('fetch', (e) => {
    console.log('[Service Worker]: Fetching …', e)
    e.respondWith(fetch(e.request)) // Default behaviour: return the request with the response
})
