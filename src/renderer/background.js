import { ipcRenderer, shell } from 'electron'
import path from 'path'

ipcRenderer.on('notify', (e, msg) => {
  let notification = new Notification(msg.title, {
    body: msg.content
  })
  const fullPath = path.join(msg.state.path, msg.state.displayName)
  notification.onclick = () => {
    shell.showItemInFolder(fullPath)
  }
})
