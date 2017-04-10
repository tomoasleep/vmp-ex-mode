_ = require 'underscore-plus'

module.exports =
class Place
  @root: (fpath) ->
    if rootdir = @findRootDirectory(fpath)
      new this(rootdir.getPath())

  @findRootDirectory: (fpath) ->
    _.find atom.project.getDirectories(), (dir) ->
      dir.contains(fpath)

  constructor: (@rootPath) ->
    console.log('rootPath:', @rootPath)
    @cache = {}

  lookupDir: (dirPath) ->
    absPath = @toAbsolute(dirPath)
    if @cache[absPath]
      @cache[absPath]
    else
      @fetchDirFiles(absPath)

  fetchDirFiles: (absPath) ->
    saveCache = (files) =>
      @cache[absPath] ?= files

    new Promise (resolve) =>
      fs.statAsync(absPath).then((stats) =>
        if stats.isDirectory()
          fs.readdirAsync(absPath)
        else
          resolve(saveCache([]))
      ).then((fnames) =>
        console.log(fnames)
        Promise.all(_.map fnames, (fname) => @fetchFileInfo(path.join(absPath, fname)))
      ).then((res) =>
        console.log('hoge:', res)
        resolve(saveCache(_.compact(res)))
      ).catch(-> resolve([]))

  fetchFileInfo: (filePath) ->
    basePath = path.basename(filePath)
    fs.statAsync(filePath).then((stats) ->
      isDirectory = stats.isDirectory()
      displayName = if isDirectory then "#{basePath}/" else basePath
      { name: filePath, displayName, isDirectory }
    ).catch((reason)->
      console.log('Stat Failed:', filePath, reason)
      null
    )

  toRelative: (fpath) ->
    path.relative(@rootPath, fpath)

  toAbsolute: (fpath) ->
    path.resolve(@rootPath, fpath)
