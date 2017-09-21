import utils from './utils'

/**
 * progress信息
 *
 * @export
 * @class Progress
 */
export default class Progress {
  constructor (torrent) {
    this.infoHash = torrent.infoHash
    this.magnetURI = torrent.magnetURI
    this.torrentFile = torrent.torrentFile
    this.timeRemaining = torrent.timeRemaining
    this.received = torrent.received
    this.downloaded = torrent.downloaded
    this.uploaded = torrent.uploaded
    this.downloadSpeed = torrent.downloadSpeed
    this.uploadSpeed = torrent.uploadSpeed
    this.progress = torrent.progress
    this.ratio = torrent.ratio
    this.numPeers = torrent.numPeers
    this.path = torrent.path
    this.files = torrent.files.map(file => {
      return {
        name: file.name,
        path: file.path,
        length: file.length,
        downloaded: file.downloaded,
        progress: file.progress
      }
    })
    this.displayName = torrent.files.length > 0 ? torrent.files[0].path.split(require('path').sep)[0] : undefined
    this.totalLength = utils.calculateTotalLength(torrent.files)
  }
}
