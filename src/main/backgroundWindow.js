import { BrowserWindow } from 'electron'
import dock from './dock'

const bgWin = {
  createWindow,
  win: null
}

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/bg.html`
  : `file://${__dirname}/bg.html`

function createWindow () {
  /**
     * Initial window options
     */
  const win = bgWin.win = new BrowserWindow({
    height: 0,
    width: 0,
    defaultEncoding: 'utf-8',
    show: false
  })

  win.loadURL(winURL)

  win.once('ready-to-show', () => {
    dock.setProgress()
  })

  win.on('closed', () => {
    bgWin.win = null
  })

  return win
}

export default bgWin
