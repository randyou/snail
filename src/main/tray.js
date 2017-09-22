import { app, Tray, Menu } from 'electron'
import path from 'path'

// hold the tray, important !
let tray

function onRightClick () {
  const contextMenu = Menu.buildFromTemplate([
    {role: 'quit'}
  ])
  this.popUpContextMenu(contextMenu)
}

function createTray () {
  const icon = process.platform === 'win32' ? '/imgs/tray.ico' : '/imgs/trayTemplate.png'
  tray = new Tray(path.join(__static, icon))
  tray.setToolTip(app.getName())

  tray.on('right-click', onRightClick)

  return tray
}

export default {
  createTray
}
