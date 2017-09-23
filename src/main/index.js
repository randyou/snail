'use strict'

import { app, Menu } from 'electron'
import bgWin from './backgroundWindow'
import ipc from './ipc'
import mainWin from './mainWindow'
import template from './menuTemplate'
import tray from './tray'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

function onReady () {
  tray.createTray()
  mainWin.createWindow()
  bgWin.createWindow()
  createMenu()
  ipc.init()
}

function createMenu () {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
  if (mainWin.win) {
    if (mainWin.win.isMinimized()) {
      mainWin.win.restore()
    }
    mainWin.win.focus()
  }
})

if (shouldQuit) {
  app.quit()
}

app.on('ready', onReady)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (!mainWin.win) {
    mainWin.createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
