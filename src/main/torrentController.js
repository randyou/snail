import WebTorrent from 'webtorrent'
import {shell} from 'electron'
import path from 'path'

import config from './config'
import TorrentState from './torrentState'
import Progress from './progress'
import db from './db'

const downloadsDir = config.prevDownloadsDir

const webtorrentClient = new WebTorrent()

export default {
  /**
   * 开始一个新的torrent
   *
   * @param {any} torrentId
   * @param {any} [{ dir = downloadsDir, displayName }={}]
   * @param {any} cb
   */
  startTorrenting (torrentId, { dir = downloadsDir, displayName } = {}, cb) {
    webtorrentClient.add(torrentId, { path: dir }, (torrent) => {
      const state = new TorrentState(torrent)
      if (displayName) {
        state.displayName = displayName
      }
      db.saveTorrentState(state).then(() => {
        cb && cb(state)
      })
      torrent.on('done', () => {
        state.status = 'done'
        state.progress = 1
        db.saveTorrentState(state).then(() => {
          cb && cb(state)
        }).catch(err => {
          console.log(err)
        })
        torrent.destroy()
      })
    })
  },

  /**
   * 停止
   *
   * @param {any} torrentId
   */
  stopTorrenting (torrentId) {
    const torrent = webtorrentClient.get(torrentId)
    if (torrent) {
      torrent.destroy()
    }
  },

  /**
   * 获取保存的下载状态
   *
   * @returns
   */
  getDownloadList () {
    return db.getTorrentingOrStopedState()
  },

  getDoneList () {
    return db.getDoneState()
  },

  /**
   * 获取torrent
   *
   * @param {any} torrentId
   * @returns
   */
  getTorrent (torrentId) {
    return webtorrentClient.get(torrentId)
  },

  /**
   * 获取下载进度
   *
   * @returns
   */
  getProgress () {
    return webtorrentClient.torrents.map((torrent) => {
      return new Progress(torrent)
    })
  },

  /**
   * 保存一条状态
   *
   * @param {any} state
   */
  saveTorrentState (state) {
    return db.saveTorrentState(state)
  },

  /**
   * 删除一条状态
   *
   * @param {any} state
   * @param {boolean} [removeData=true]
   * @returns
   */
  async removeTorrentState (state, removeData = true) {
    if (!state) {
      return
    }
    removeData && shell.moveItemToTrash(path.join(state.path, state.displayName))
    return db.removeTorrentState(state)
  },

  /**
   * 获取deleted状态列表
   *
   * @returns
   */
  async getDeletedList () {
    return db.getDeletedState()
  }
}
