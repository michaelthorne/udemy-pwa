const shareImageButton = document.querySelector('#share-image-button')
const createPostArea = document.querySelector('#create-post')
const closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn')

function openCreatePostModal() {
  createPostArea.style.display = 'block'

  if (deferredPrompt) {
    // Show the app install banner
    deferredPrompt.prompt()
    deferredPrompt.userChoice.then((result) => {
      if (result.outcome === 'dismissed') {
        console.log('[App]: user dismissed app install prompt')
      } else {
        console.log('[App]: user accepted app install prompt')
      }
    })
    deferredPrompt = null
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none'
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);
