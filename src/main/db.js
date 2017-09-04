import Nedb from 'nedb'
import path from 'path'

import config from './config'

const db = {}
db.torrentState = new Nedb({
  filename: path.join(config.userData, 'torrentState.db'),
  autoload: true
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
   * 获取progress小于1，并且状态不是deleted的数据
   *
   * @param {any} cb
   */
  getAllTorrentState (cb) {
    db.torrentState.find({ $and: [{ progress: { $lt: 1 } }, {status: {$ne: 'deleted'}}] }, (err, docs) => {
      if (err) {
        throw err
      }
      cb(docs)
    })
  }
}
