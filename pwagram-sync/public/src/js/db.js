let dbPromise = idb.open('posts-store', 1, (db) => { // Create a new DB
  if (!db.objectStoreNames.contains('posts')) {
    db.createObjectStore('posts', { // Like a table
      keyPath: 'id' // Use the `id` property from our data as the value
    })
  }
  if (!db.objectStoreNames.contains('sync-posts')) {
    db.createObjectStore('sync-posts', { // Like a table
      keyPath: 'id' // Use the `id` property from our data as the value
    })
  }
})

function writeData(store, data) {
  return dbPromise.then((db) => {
    let tx = db.transaction(store, 'readwrite') // Create a transaction
    let st = tx.objectStore(store)
    st.put(data)
    return tx.complete // Execute the transaction
  })
}

function readAllData(store) {
  return dbPromise.then((db) => {
    let tx = db.transaction(store, 'readonly')
    let st = tx.objectStore(store)
    return st.getAll()
  })
}

function clearAllData(store) {
  return dbPromise.then((db) => {
    let tx = db.transaction(store, 'readwrite')
    let st = tx.objectStore(store)
    st.clear()
    return tx.complete
  })
}

function deleteItem(store, id) {
  return dbPromise.then((db) => {
    let tx = db.transaction(store, 'readwrite')
    let st = tx.objectStore(store)
    st.delete(id)
    return tx.complete
  }).then(() => {
    console.log('[App]: Item deleted', id)
  })
}
