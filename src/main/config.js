import { app } from 'electron'
import path from 'path'

export default {
  userData: app.getPath('userData'),
  prevDownloadsDir: app.getPath('downloads'),
  torrentsDir: path.join(app.getPath('userData'), 'torrents')
}
