import bgWin from './backgroundWindow'

export default {
  notify (title, content, state) {
    bgWin.win && bgWin.win.webContents.send('notify', { title, content, state })
  }
}
