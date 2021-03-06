const shareImageButton = document.querySelector('#share-image-button')
const createPostArea = document.querySelector('#create-post')
const closeCreatePostModalButton = document.querySelector(
    '#close-create-post-modal-btn')
const sharedMomentsArea = document.querySelector('#shared-moments')

function openCreatePostModal() {
  createPostArea.style.display = 'block'

  if (deferredPrompt) {
    deferredPrompt.prompt()

    deferredPrompt.userChoice.then(function(choiceResult) {
      console.log(choiceResult.outcome)
      if (choiceResult.outcome === 'dismissed') {
        console.log('[App]: User dismissed app install banner')
      } else {
        console.log('[App]: User added app to home screen')
      }
    })

    deferredPrompt = null
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none'
}

shareImageButton.addEventListener('click', openCreatePostModal)

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal)

// Manually save assets to cache
function onSaveButtonClicked(event) {
  console.log('[App]: Clicked', event)
  caches.open('user').then((cache) => {
    cache.addAll([
        'https://httpbin.org/get',
        '/src/images/sf-boat.jpg'
    ])
  })
}

function clearCards() {
  while(sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild)
  }
}

function createCard() {
  const cardWrapper = document.createElement('div')
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp'
  const cardTitle = document.createElement('div')
  cardTitle.className = 'mdl-card__title'
  cardTitle.style.backgroundImage = 'url("/src/images/sf-boat.jpg")'
  cardTitle.style.backgroundSize = 'cover'
  cardTitle.style.height = '180px'
  cardWrapper.appendChild(cardTitle)
  const cardTitleTextElement = document.createElement('h2')
  cardTitleTextElement.style.color = 'white'
  cardTitleTextElement.className = 'mdl-card__title-text'
  cardTitleTextElement.textContent = 'San Francisco Trip'
  cardTitle.appendChild(cardTitleTextElement)
  const cardSupportingText = document.createElement('div')
  cardSupportingText.className = 'mdl-card__supporting-text'
  cardSupportingText.textContent = 'In San Francisco'
  cardSupportingText.style.textAlign = 'center'
  // const cardSaveButton = document.createElement('button')
  // cardSaveButton.textContent = 'Save'
  // cardSaveButton.addEventListener('click', onSaveButtonClicked)
  // cardSupportingText.appendChild(cardSaveButton)
  cardWrapper.appendChild(cardSupportingText)
  componentHandler.upgradeElement(cardWrapper)
  sharedMomentsArea.appendChild(cardWrapper)
}

const url = 'https://httpbin.org/get'
let networkDataReceived = false

fetch(url)
.then(function(res) {
  return res.json()
})
.then(function(data) {
  networkDataReceived = true
  console.log('From web', data)
  clearCards()
  createCard()
})

caches.open('user').then((cache) => {
  caches.match(url).then((response) => {
    if (response) {
      return response.json()
    }
  }).then((data) => {
    console.log('From cache', data)
    if (!networkDataReceived) {
      createCard()
    }
  })
})
