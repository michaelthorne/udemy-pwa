const shareImageButton = document.querySelector('#share-image-button');
const createPostArea = document.querySelector('#create-post');
const closeCreatePostModalButton = document.querySelector(
    '#close-create-post-modal-btn');
const sharedMomentsArea = document.querySelector('#shared-moments');
const form = document.querySelector('form')
const titleInput = document.querySelector('#title')
const locationInput = document.querySelector('#location')

function openCreatePostModal() {
  createPostArea.style.transform = 'translateY(0)'

  if (deferredPrompt) {
    deferredPrompt.prompt()

    deferredPrompt.userChoice.then(function(choiceResult) {
      console.log(choiceResult.outcome)
      if (choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation')
      } else {
        console.log('User added to home screen')
      }
    })

    deferredPrompt = null
  }

  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.getRegistrations()
  //     .then(function(registrations) {
  //       for (var i = 0 i < registrations.length i++) {
  //         registrations[i].unregister()
  //       }
  //     })
  // }
}

function closeCreatePostModal() {
  createPostArea.style.transform = 'translateY(100vh)'
}

shareImageButton.addEventListener('click', openCreatePostModal)

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal)

// Currently not in use, allows to save assets in cache on demand otherwise
function onSaveButtonClicked(event) {
  console.log('clicked')
  if ('caches' in window) {
    caches.open('user-requested')
      .then(function(cache) {
        cache.add('https://httpbin.org/get')
        cache.add('/src/images/sf-boat.jpg')
      })
  }
}

function clearCards() {
  while(sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild)
  }
}

function createCard(data) {
  const cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp'
  const cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title'
  cardTitle.style.backgroundImage = `url('${data.image}')`
  cardTitle.style.backgroundSize = 'cover'
  cardTitle.style.height = '180px'
  cardWrapper.appendChild(cardTitle)
  const cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.style.color = 'white'
  cardTitleTextElement.className = 'mdl-card__title-text'
  cardTitleTextElement.textContent = data.title
  cardTitle.appendChild(cardTitleTextElement)
  const cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text'
  cardSupportingText.textContent = data.location
  cardSupportingText.style.textAlign = 'center'
  // var cardSaveButton = document.createElement('button')
  // cardSaveButton.textContent = 'Save'
  // cardSaveButton.addEventListener('click', onSaveButtonClicked)
  // cardSupportingText.appendChild(cardSaveButton)
  cardWrapper.appendChild(cardSupportingText)
  componentHandler.upgradeElement(cardWrapper)
  sharedMomentsArea.appendChild(cardWrapper)
}

function updateUI(data) {
  clearCards()
  for (let i = 0; i < data.length; i++) {
    createCard(data[i])
  }
}

const url = 'https://pwagram-9fda4-default-rtdb.firebaseio.com/posts.json';
let networkDataReceived = false;

fetch(url)
  .then(function(res) {
    return res.json()
  })
  .then(function(data) {
    networkDataReceived = true
    console.log('[App]: From web', data)
    let dataArray = []
    for (const key in data) {
      dataArray.push(data[key])
    }
    updateUI(dataArray)
  })

if ('indexedDB' in window) {
  readAllData('posts').then((data) => {
    if (!networkDataReceived) {
      console.log('[App]: From cache', data)
      updateUI(data)
    }
  })
}

form.addEventListener('submit', (e) => {
  e.preventDefault()

  if (titleInput.value.trim() === '' || locationInput.value.trim() === '') {
    alert("Please enter the title and location")
    return
  }

  closeCreatePostModal()

  // https://developer.mozilla.org/en-US/docs/Web/API/SyncManager
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then((sw) => {
      const post = {
        id: new Date().toISOString(),
        title: titleInput.value,
        location: locationInput.value
      }

      // Store post inside IndexedDB
      writeData('sync-posts', post).then(() => {
        // Create a new sync registration
        return sw.sync.register('sync-new-post')
      }).then(() => {
        const toast = document.querySelector('#confirmation-toast')
        const data = {
          message: "Your post was saved for syncing"
        }
        toast.MaterialSnackbar.showSnackbar(data)
      }).catch((err) => {
        console.log('[App]: Unable to save post for syncing', err)
      })
    })
  }
})
