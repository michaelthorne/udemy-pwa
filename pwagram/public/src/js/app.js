let deferredPrompt

// Make sure that the browser supports service workers
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {
        // scope: '/help'
    }).then(() => {
        console.log('[App]: Service Worker was registered')
    })
}

window.addEventListener('beforeinstallprompt', (e) => {
    console.log('[App]: Before install prompt')
    // Prevent the displaying of the app install banner
    e.preventDefault()
    deferredPrompt = e
    return false
})
