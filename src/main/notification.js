import backgroundWindow from './backgroundWindow'

let bg

export default {
  init () {
    bg = backgroundWindow.createWindow()
  },
  notify (title, content, state) {
    bg && bg.webContents.send('notify', { title, content, state })
  }
}
