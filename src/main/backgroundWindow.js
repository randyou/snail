import { BrowserWindow } from 'electron'
// import torrentController from './torrentController'

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/bg.html`
  : `file://${__dirname}/bg.html`

export default {
  createWindow () {
    /**
     * Initial window options
     */
    let backgroundWindow = new BrowserWindow({
      height: 0,
      width: 0,
      defaultEncoding: 'utf-8',
      show: false
    })
    // torrentController.onProgress(backgroundWindow)
    backgroundWindow.loadURL(winURL)

    backgroundWindow.on('closed', () => {
      backgroundWindow = null
    })

    return backgroundWindow
  }
}
