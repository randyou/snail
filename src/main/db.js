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
  /**
   * 保存状态
   *
   * @param {any} torrentState
   * @returns
   */
  saveTorrentState (torrentState) {
    return new Promise((resolve, reject) => {
      db.torrentState.update({ infoHash: torrentState.infoHash }, torrentState, { upsert: true }, (err, numAffected, affectedDocuments, upsert) => {
        err ? reject(err) : resolve({
          numAffected,
          affectedDocuments,
          upsert})
      })
    })
  },
  /**
   * 获取下载中或者停止的state
   *
   * @param {any} cb
   */
  getTorrentingOrStopedState () {
    return new Promise((resolve, reject) => {
      db.torrentState.find({ $or: [{ status: 'downloading' }, {status: 'stoped'}] })
        .sort({ createdAt: 1 })
        .exec((err, docs) => {
          if (err) {
            reject(err)
          } else {
            resolve(docs)
          }
        })
    })
  },

  /**
   * 获取完成的state
   *
   * @returns
   */
  getDoneState () {
    return this.getState({ status: 'done' }, { updateAt: -1 })
  },

  /**
   * 获取状态为deleted的state
   *
   * @returns
   */
  getDeletedState () {
    return this.getState({ status: 'deleted' }, { updateAt: -1 })
  },
  /**
   * 获取state
   *
   * @param {any} [opts={}]
   * @param {any} [sort={}]
   * @returns
   */
  getState (opts = {}, sort = {}) {
    return new Promise((resolve, reject) => {
      db.torrentState.find(opts)
        .sort(sort)
        .exec((err, docs) => {
          if (err) {
            reject(err)
          } else {
            resolve(docs)
          }
        })
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
