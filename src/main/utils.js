/**
 * 根据文件torrent文件计算总大小
 *
 * @param {any} files
 * @returns
 */
function calculateTotalLength (files) {
  if (!files) {
    return 0
  }
  return files.reduce((length, file) => {
    if (file) {
      length += file.length
    }
    return length
  }, 0)
}

export default {
  calculateTotalLength
}
