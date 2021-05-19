let deferredPrompt

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function () {
      console.log('[App]: Service Worker registered')
    })
    .catch(function(err) {
      console.log(err)
    })
}

window.addEventListener('beforeinstallprompt', function(event) {
  console.log('[App]: Before Install Prompt')
  event.preventDefault()
  deferredPrompt = event
  return false
})
