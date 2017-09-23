import torrentController from './torrentController'

function setProgress () {
  torrentController.onProgress()
}

export default {
  setProgress
}
