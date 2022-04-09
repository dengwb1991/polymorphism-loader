var fs = require('fs')

var REG = {
  replaceFileName: /([^\\/]+)\.([^\\/]+)/i,
  matchRequireStatements: /import.*from.*(\'|\")/g,
  matchRequireFilePath: /(\"|\').*(\"|\')/g
}

/**
 * 返回引入文件的绝对路径 和 文件名
 * @param {string} context 当前加载的文件所在的文件夹路径 /009_polymorphism-loader/src
 * @param {string} requireFilePath 文件中引入的路径 ./event/event
 * @return {object}
 * filePath: /009_polymorphism-loader/src/event
 * fileName: event
 */
 function getContextData (context, requireFilePath) {
  function running (contextList, requireFilePathList) {
    if (requireFilePathList.length) {
      var name = requireFilePathList.shift()
      switch (name) {
        case '.':
          return running(contextList, requireFilePathList)
        case '..':
          return running([contextList, contextList.pop()][0], requireFilePathList)
        default:
          return running([contextList, contextList.push(name)][0], requireFilePathList)
      }
    }
    return contextList.join('/')
  }
  var requireFilePathList = requireFilePath.split('/')
  var contextList = context.split('/')
  var fileName = requireFilePathList.pop()
  var filePath = running(contextList, requireFilePathList)
  return {
    fileName: fileName,
    filePath: filePath
  }
}

/**
 * 获取文件夹下所有文件名
 * @param {*} filePath 文件夹路径 
 * @returns {array}
 */
function genFileList (filePath) {
  var filesList = []
  var files = fs.readdirSync(filePath) // 需要用到同步读取
  files.forEach((file) => {
    var states = fs.statSync(filePath + '/' + file)
    // 判断是否是目录，是就继续递归
    if (states.isDirectory()) {
      genFileList(filePath + '/' + file, filesList)
    } else {
      // 不是就将文件push进数组，此处可以正则匹配是否是 .js 先忽略
      filesList.push(file)
    }
  })
  return filesList
}

/**
 * 返回组合多态文件名
 * name.js ===> name.[mode].js
 * @param {*} fileName 
 * @param {*} mode 
 * @returns {string}
 */
function getModeFileName (fileName, mode) {
  var modeFileName = null
  if (fileName.match(REG.replaceFileName)) {
    fileName.replace(REG.replaceFileName, ($1, $2, $3) => {
      modeFileName = $2 + '.' + mode + '.' + $3
    })
  } else {
    modeFileName = fileName + '.' + mode
  }
  return modeFileName
}

module.exports = {
  REG,
  getContextData,
  genFileList,
  getModeFileName
}
