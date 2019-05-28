const nsfw = require('nsfw')
const _ = require('lodash')
const ee = require('../eventEmitter').default
const watchers = []

const NSFW_ACTION_MAP = [
  'CREATED',  // 0
  'DELETED',  // 1
  'MODIFIED', // 2
  'RENAMED'   // 3
]

function watchDirectories (storages) {
  storages.forEach(storage => {
    nsfw(storage.path, events => {
      // events is an array of [{action: 0..3, directory: '', file: ''}, ...]
      const mappedEvents = events.map(event =>
        Object.assign({}, event, {
          action: NSFW_ACTION_MAP[event.action]
        })
        )
      // Note:
      // Filtering duplicates with uniqWith isEqual because there can be multiple events for same change.
      // Would be good to know why there are multiple events - for now stripping is OK.
      console.log('change detected', _.uniqWith(mappedEvents, _.isEqual))
      ee.emit('watcher:filechange', _.uniqWith(mappedEvents, _.isEqual))
    }).then(watcher => {
      watchers.push({
        path: storage.path,
        watcher: watcher
      })
      return watcher.start()
    }).then(() => {
      console.log('watcher started for path = ' + storage.path)
      ee.emit('watcher:start', storage.path)
    })
  })

  // Listen for stop event so we can remove a storage watcher
  // e.g. Remove if storage location is deleted on disk or removed from Boostnote storage
  ee.on('watcher:stop', (storagePath) => {
    let watcherToRemoveIndex
    watchers.forEach((watchObj, index) => {
      if (watchObj.path === storagePath) {
        console.log('watcher stopped for path = ' + storagePath)
        watchObj.stop()
        watcherToRemoveIndex = index
      }
    })
    if (watcherToRemoveIndex) {
      watchers.splice(watcherToRemoveIndex, 1)
    }
  })
}

module.exports = watchDirectories
