let deferredPrompt;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function () {
      console.log('[App]: Service worker registered!')
    })
    .catch(function(err) {
      console.log(err)
    })
}

window.addEventListener('beforeinstallprompt', function(event) {
  console.log('[App]: beforeinstallprompt fired')
  event.preventDefault()
  deferredPrompt = event
  return false
})
