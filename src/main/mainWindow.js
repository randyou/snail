import { BrowserWindow } from 'electron'

const mainWin = {
  createWindow,
  win: null
}

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
     * Initial window options
     */
  const win = mainWin.win = new BrowserWindow({
    height: 580,
    useContentSize: true,
    width: 1000,
    minWidth: 1000,
    minHeight: 580,
    defaultEncoding: 'utf-8',
    title: 'Snail',
    show: false,
    backgroundColor: '#ffdd57'
  })

  win.once('ready-to-show', () => {
    win.show()
  })

  win.loadURL(winURL)

  win.on('closed', () => {
    mainWin.win = null
  })
}

export default mainWin
