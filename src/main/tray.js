import { app, Tray, Menu } from 'electron'
import path from 'path'

import mainWin from './mainWindow'

const trayIcon = {
  createTray,
  tray: null
}

function onClick () {
  if (mainWin.win) {
    if (mainWin.win.isMinimized()) {
      mainWin.win.restore()
    }
    mainWin.win.focus()
  } else {
    mainWin.createWindow()
  }
}

function onRightClick () {
  const contextMenu = Menu.buildFromTemplate([
    {role: 'quit'}
  ])
  this.popUpContextMenu(contextMenu)
}

function createTray () {
  const icon = process.platform === 'win32' ? '/imgs/tray.ico' : '/imgs/trayTemplate.png'
  const tray = trayIcon.tray = new Tray(path.join(__static, icon))
  tray.setToolTip(app.getName())

  tray.on('click', onClick)
  tray.on('right-click', onRightClick)

  return tray
}

export default trayIcon
