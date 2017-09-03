import { app, ipcMain } from 'electron'
import WebTorrent from 'webtorrent'

const downloadPath = app.getPath('downloads')
const webtorrentClient = new WebTorrent()

export default function () {
  ipcMain.on('got-torrent-file', (e, files) => {
    if (files.length > 0) {
      for (let file of files) {
        webtorrentClient.add(file, { path: downloadPath }, function (torrent) {
          // Torrents can contain many files. Let's use the .mp4 file
          // var file = torrent.files.find(function (file) {
          //   return file.name.endsWith('.mp4')
          // })
        })
      }
    }
  })

  ipcMain.on('fecth-progerss', (e) => {
    let progressInfos = webtorrentClient.torrents.map(torrent => {
      return {
        infoHash: torrent.infoHash,
        magnetURI: torrent.magnetURI,
        torrentFile: torrent.torrentFile,
        timeRemaining: torrent.timeRemaining,
        received: torrent.received,
        downloaded: torrent.downloaded,
        uploaded: torrent.uploaded,
        downloadSpeed: torrent.downloadSpeed,
        uploadSpeed: torrent.uploadSpeed,
        progress: torrent.progress,
        ratio: torrent.ratio,
        numPeers: torrent.numPeers,
        path: torrent.path,
        files: torrent.files.map(file => {
          return {
            name: file.name,
            path: file.path,
            length: file.length,
            downloaded: file.downloaded,
            progress: file.progress
          }
        })
      }
    })
    e.sender.send('got-progress', progressInfos)
  })
}
