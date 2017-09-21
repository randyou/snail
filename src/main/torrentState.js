import utils from './utils'
import config from './config'
/**
 * 下载状态
 *
 * @export
 * @class TorrentState
 */
export default class TorrentState {
  constructor (torrent) {
    this.status = 'downloading'
    this.infoHash = torrent.infoHash || 0
    this.magnetURI = torrent.magnetURI || ''
    this.torrentName = ''
    this.progress = torrent.progress || 0
    this.downloaded = torrent.downloaded || 0
    this.path = torrent.path || config.prevDownloadsDir
    this.files = torrent.files ? torrent.files.map(file => {
      return {
        name: file.name,
        path: file.path,
        length: file.length,
        downloaded: file.downloaded,
        progress: file.progress
      }
    }) : null
    this.displayName = torrent.name
    this.totalLength = torrent.totalLength || utils.calculateTotalLength(torrent.files)
  }
}
