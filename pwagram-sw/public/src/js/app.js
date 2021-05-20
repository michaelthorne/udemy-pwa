let deferredPrompt

// Make sure that the browser supports service workers
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {
        // scope: '/help'
    }).then(() => {
        console.log('[App]: Service Worker was registered')
    }).catch((error) => {
        console.log('[App]: Service Worker registration failed', error)
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
// console.log('This is executed immediately')

// let promise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         // resolve('This is executed once the timer is done')
//         reject({
//             code: 123,
//             message: 'An error occurred'
//         })
//     }, 3000)
// })

// Example Promise
// promise.then((text) => {
//     console.log(text)
//     return text
// }).then((newText) => {
//     console.log(newText)
// }).catch((error) => {
//     console.log(error.code, error.message)
// })

// Example GET request
fetch('https://httpbin.org/ip').then((response) => {
    console.log(response)
    return response.json()
}).then((data) => {
    console.log(data)
}).catch((error) => {
    console.log(error)
})

// Example POST request
fetch('https://httpbin.org/post', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json', // Optional – based on the API you call
    },
    mode: 'cors', // Default: allows cross-origin requests
    // mode: 'no-cors', // Prevents the method from being anything other than HEAD, GET or POST, and the headers from being anything other than simple headers.
    body: JSON.stringify({
        message: 'Can anyone see this?'
    })
}).then((response) => {
    console.log(response)
    return response.json()
}).then((data) => {
    console.log(data)
}).catch((error) => {
    console.log(error)
})
