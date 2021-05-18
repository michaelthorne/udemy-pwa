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

// setTimeout(() => {
//     // This is a callback
//     console.log('This is executed once the timer is done')
// }, 3000) // Non-blocking
//
// console.log('This is executed right after setTimeout()')

let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('This is executed once the timer is done')
    }, 3000)
})

promise.then((text) => {
    console.log(text)
    return text
}).then((newText) => {
    console.log(newText)
})
    .catch(() => {

})
