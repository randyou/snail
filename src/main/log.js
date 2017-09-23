import log4js from 'log4js'
import path from 'path'

import config from './config'

const log = {
  shutdown () {
    return new Promise((resolve, reject) => {
      log4js.shutdown(err => {
        err ? reject(err) : resolve()
      })
    })
  },
  logger: null
}

const filename = path.join(config.userData, 'log', 'log.log')

log4js.configure({
  appenders: {
    file: {
      type: 'dateFile',
      filename: filename,
      daysToKeep: 7
    },
    console: {
      type: 'console'
    }
  },
  categories: {
    default: {
      appenders: ['console'],
      level: log4js.levels.DEBUG
    },
    app: {
      appenders: ['file'],
      level: log4js.levels.WARN
    }
  }
})

log.logger = process.env.NODE_ENV === 'development' ? log4js.getLogger('default') : log4js.getLogger('app')

export default log
