var loaderUtils = require('loader-utils')
var utils = require('./utils')

/**
 * 返回处理后的文件源
 * @param {*} source 文件源 
 * @returns {string} 处理后的文件源
 */
function getResource (source) {
  var options = loaderUtils.getOptions(this) || {}
  var resource = source
  var requireFileStatements = source.match(utils.REG.matchRequireStatements)
  if (requireFileStatements && options.mode) {
    for (var i = 0, len = requireFileStatements.length; i < len; i++) {
      var requireFilePath = requireFileStatements[i].match(utils.REG.matchRequireFilePath)[0]
      requireFilePath = requireFilePath.substring(1, requireFilePath.length - 1)
      var { fileName, filePath } = utils.getContextData(this.context, requireFilePath)
      var fileList = utils.genFileList(filePath)
      var modeFileName = utils.getModeFileName(fileName, options.mode)
      if (fileList.some(function (item) {
          return item.indexOf(modeFileName) > -1 
        })
      ) {
        var list = requireFilePath.split('/')
        list.pop()
        list.push(modeFileName)
        resource = resource.replace(requireFilePath, list.join('/'))
      }
    }
  }
  return resource
}

module.exports = function(
  source,
  map,
  meta,
) {
  var resource = getResource.apply(this, [source])
  this.callback(null, resource, map, meta)
}