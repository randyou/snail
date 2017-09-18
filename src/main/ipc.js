import { ipcMain } from 'electron'

import torrentController from './torrentController'

let downloadList = []
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
  const cb = (list) => {
    downloadList = list
    e.sender.send('download-list', downloadList)
  }
  torrentController.getDownloadList(cb)
}

/**
 * 获取已完成
 *
 * @param {any} e
 */
function sendDoneList (e) {
  torrentController.getDoneList((list) => {
    e.sender.send('done-list', list)
  })
}

/**
 * 恢复下载状态
 *
 * @param {any} e
 */
function resumeDownload (e) {
  const cb = (list) => {
    downloadList = list
    sendDownloadList(e)
    downloadList.forEach((element) => {
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
  }
  torrentController.getDownloadList(cb)
}

export default function () {
  // 开始新的torrent
  ipcMain.on('new-torrenting', (e, torrentIds) => {
    if (torrentIds.length > 0) {
      for (let torrentId of torrentIds) {
        torrentController.startTorrenting(torrentId, {}, (state) => {
          if (state.status === 'downloading' && !downloadList.find(element => { return element.infoHash === state.infoHash })) {
            downloadList.push(state)
          }
          if (state.status === 'done') {
            sendDoneList(e)
          }
          sendDownloadList(e)
        })
      }
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
    downloadList.forEach(state => {
      if (state.infoHash === torrentId) {
        if (progress) {
          state.displayName = progress.displayName || state.displayName
          state.files = progress.files
          state.progress = progress.progress
          state.downloaded = progress.downloaded
          state.totalLength = progress.totalLength
        }
        state.status = 'stoped'
        torrentController.saveTorrentState(state)
      }
    })
    torrentController.stopTorrenting(torrentId)
    e.sender.send('download-list', downloadList)
  })

  // 恢复下载
  ipcMain.on('resume-torrenting', (e, torrentId) => {
    downloadList.forEach(state => {
      if (state.infoHash === torrentId) {
        state.status = 'downloading'
        torrentController.saveTorrentState(state)
      }
    })
    resumeDownload(e)
  })

  ipcMain.on('done-list', (e) => {
    sendDoneList(e)
  })

  ipcMain.on('delete-torrent', (e, torrentId) => {
    const progress = torrentController.getProgress().find((progress) => {
      return progress.infoHash === torrentId
    })
    downloadList.forEach(state => {
      if (state.infoHash === torrentId) {
        if (progress) {
          state.displayName = progress.displayName || state.displayName
          state.files = progress.files
          state.progress = progress.progress
          state.downloaded = progress.downloaded
          state.totalLength = progress.totalLength
        }
        state.status = 'deleted'
        torrentController.saveTorrentState(state)
      }
    })
    torrentController.stopTorrenting(torrentId)
    sendDownloadList(e)
  })

  ipcMain.on('remove-torrent', (e, torrentId) => {
    const state = downloadList.find(state => {
      return state.infoHash === torrentId
    })
    torrentController.stopTorrenting(torrentId)
    torrentController.removeTorrentState(state).then(() => {
      sendDownloadList(e)
    }).catch((err) => {
      console.log(err)
    })
  })
}
