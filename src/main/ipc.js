import { ipcMain } from 'electron'

import torrentController from './torrentController'

let progress = false

/**
 * 发送progress
 *
 * @param {any} e
 */
function sendProgress (e) {
  let data = torrentController.getProgress()
  if (data.length > 0) {
    try {
      if (e && e.sender) {
        e.sender.send('progress', data)
      }
    } catch (error) {
      console.log('[ipc Send progress error]', error)
    }
  }
  if (progress) {
    setTimeout(() => {
      sendProgress(e)
    }, 1000)
  }
}

/**
 * 发送下载状态
 *
 * @param {any} e
 */
function sendDownloadList (e) {
  torrentController.getDownloadList().then((list) => {
    e.sender.send('download-list', list)
  }).catch(err => {
    console.log(err)
  })
}

/**
 * 获取已完成
 *
 * @param {any} e
 */
function sendDoneList (e) {
  torrentController.getDoneList().then(list => {
    e.sender.send('done-list', list)
  }).catch(err => {
    console.log(err)
  })
}

/**
 * 发送删除列表
 *
 * @param {any} e
 */
function sendDeletedList (e) {
  torrentController.getDeletedList().then((list) => {
    e.sender.send('deleted-list', list)
  }).catch((err) => {
    console.log(err)
  })
}

/**
 * 恢复下载状态
 *
 * @param {any} e
 */
function resumeDownload (e) {
  torrentController.getDownloadList().then((list) => {
    list.forEach((element) => {
      if (element.status === 'downloading' && !torrentController.getTorrent(element.infoHash)) {
        torrentController.startTorrenting(element.magnetURI || element.infoHash,
          {
            dir: element.path,
            displayName: element.displayName,
            status: element.status
          }, state => {
            if (state.status === 'done') {
              sendDoneList(e)
            }
            sendDownloadList(e)
          }
        )
      }
    }, this)
  }).catch(err => {
    console.log(err)
  })
}

export default function () {
  // 开始新的torrent
  ipcMain.on('new-torrenting', (e, torrentIds) => {
    if (torrentIds.length > 0) {
      torrentController.getDownloadList().then(list => {
        for (let torrentId of torrentIds) {
          torrentController.startTorrenting(torrentId, {}, (state) => {
            if (state.status === 'done') {
              sendDoneList(e)
            }
            sendDownloadList(e)
          })
        }
      })
    }
  })
  // 获取下载状态
  ipcMain.on('download-list', (e) => {
    sendDownloadList(e)
  })
  // 开始发送progress
  ipcMain.on('start-progress', (e) => {
    progress = true
    if (progress) {
      resumeDownload(e)
      sendProgress(e)
    }
  })
  // 停止发送progress
  ipcMain.on('stop-progress', (e) => {
    progress = false
    clearTimeout()
  })
  // 停止下载
  ipcMain.on('stop-torrenting', (e, torrentId) => {
    const progress = torrentController.getProgress().find((progress) => {
      return progress.infoHash === torrentId
    })
    torrentController.getDownloadList().then(list => {
      const state = list.find(state => state.infoHash === torrentId)
      state.status = 'stoped'
      if (progress) {
        state.displayName = progress.displayName || state.displayName
        state.files = progress.files
        state.progress = progress.progress
        state.downloaded = progress.downloaded
        state.totalLength = progress.totalLength
      }
      torrentController.saveTorrentState(state).then(() => {
        sendDownloadList(e)
      })
      torrentController.stopTorrenting(torrentId)
    })
  })

  // 恢复下载
  ipcMain.on('resume-torrenting', (e, torrentId) => {
    torrentController.getDownloadList().then(list => {
      const state = list.find(state => state.infoHash === torrentId)
      state.status = 'downloading'
      torrentController.saveTorrentState(state).then(() => {
        resumeDownload(e)
        sendDownloadList(e)
      })
    })
  })

  ipcMain.on('done-list', (e) => {
    sendDoneList(e)
  })

  ipcMain.on('delete-torrent', (e, torrentId) => {
    const progress = torrentController.getProgress().find((progress) => {
      return progress.infoHash === torrentId
    })
    torrentController.getDownloadList().then(list => {
      const state = list.find(state => state.infoHash === torrentId)
      state.status = 'deleted'
      if (progress) {
        state.displayName = progress.displayName || state.displayName
        state.files = progress.files
        state.progress = progress.progress
        state.downloaded = progress.downloaded
        state.totalLength = progress.totalLength
      }
      torrentController.saveTorrentState(state)
      torrentController.stopTorrenting(torrentId)
      sendDownloadList(e)
    })
  })

  ipcMain.on('remove-torrent', (e, torrentId) => {
    torrentController.getDownloadList().then(list => {
      const state = list.find(state => {
        return state.infoHash === torrentId
      })
      torrentController.stopTorrenting(torrentId)
      torrentController.removeTorrentState(state).then(() => {
        sendDownloadList(e)
      }).catch((err) => {
        console.log(err)
      })
    })
  })

  ipcMain.on('delete-done', (e, torrentId) => {
    torrentController.getDoneList((list) => {
      const state = list.find(state => state.infoHash === torrentId)
      state.status = 'deleted'
      torrentController.saveTorrentState(state)
      sendDoneList(e)
    })
  })

  ipcMain.on('remove-done', (e, torrentId) => {
    torrentController.getDoneList((list) => {
      const state = list.find(state => state.infoHash === torrentId)
      torrentController.removeTorrentState(state).then(() => {
        sendDoneList(e)
      }).catch((err) => {
        console.log(err)
      })
    })
  })

  ipcMain.on('deleted-list', (e) => {
    sendDeletedList(e)
  })

  ipcMain.on('resume-deleted', (e, torrentId) => {
    torrentController.startTorrenting(torrentId, {}, (state) => {
      if (state.status === 'done') {
        sendDoneList(e)
      }
      sendDownloadList(e)
      sendDeletedList(e)
    })
  })

  ipcMain.on('remove-deleted', (e, torrentId) => {
    torrentController.getDeletedList().then((list) => {
      const state = list.find(state => state.infoHash === torrentId)
      torrentController.removeTorrentState(state).then(() => {
        sendDeletedList(e)
      }).catch((err) => {
        console.log(err)
      })
    }).catch((err) => {
      console.log(err)
    })
  })
}
