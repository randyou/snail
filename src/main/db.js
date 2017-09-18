import Nedb from 'nedb'
import path from 'path'

import config from './config'

const db = {}
db.torrentState = new Nedb({
  filename: path.join(config.userData, 'torrentState.db'),
  autoload: true,
  timestampData: true
})

export default {
  saveTorrentState (torrentState) {
    db.torrentState.update({ infoHash: torrentState.infoHash }, torrentState, { upsert: true }, (err, numAffected, affectedDocuments, upsert) => {
      if (err) {
        throw err
      }
    })
  },
  /**
   * 获取下载中或者停止的state
   *
   * @param {any} cb
   */
  getTorrentingOrStopedState (cb) {
    db.torrentState.find({ $or: [{ status: 'downloading' }, {status: 'stoped'}] })
      .sort({ createdAt: 1 })
      .exec((err, docs) => {
        if (err) {
          throw err
        }
        if (cb) {
          cb(docs)
        }
      })
  },

  /**
   * 获取完成的state
   *
   * @param {any} cb
   */
  getDoneState (cb) {
    db.torrentState.find({ status: 'done' })
      .sort({ updateAt: -1 })
      .exec((err, docs) => {
        if (err) {
          throw err
        }
        if (cb) {
          cb(docs)
        }
      })
  },
  /**
   * 获取状态为deleted的state
   *
   * @param {any} cb
   */
  getDeletedState (cb) {
    db.torrentState.find({ status: 'deleted' })
      .sort({ updateAt: -1 })
      .exec((err, docs) => {
        if (err) {
          throw err
        }
        if (cb) {
          cb(docs)
        }
      })
  },
  /**
   * 删除state
   *
   * @param {any} state
   * @returns
   */
  async removeTorrentState (state) {
    const promise = new Promise((resolve, reject) => {
      db.torrentState.remove({
        _id: state._id
      }, {}, (err, ret) => {
        if (err) {
          reject(err)
        } else {
          resolve(ret)
        }
      })
    })
    return promise
  }
}
