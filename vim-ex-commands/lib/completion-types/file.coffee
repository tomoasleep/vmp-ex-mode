Promise = require 'bluebird'
fs = require 'fs'
path = require 'path'
Base = require './base'
Place = require '../models/place'
_ = require 'lodash'
Promise.promisifyAll(fs)

homedir = process.env[if process.platform is 'win32' then 'USERPROFILE' else 'HOME']

module.exports =
class File extends Base
  constructor: ({ @editor }) ->
    @root = Place.root(@editor.getPath()) ? new Place(homedir)
    @cache = {}

  search: (input) ->
    info = @analysisPath(input)
    console.log('search:', input, info)

    Promise.resolve(@listup(input)).then((cands) ->
      console.log('listup:', cands)
      _.filter(cands, (cand) -> cand.displayName.startsWith(info.basename))
    )

  listup: (input) ->
    info = @analysisPath(input)
    @root.lookupDir(@parsePath(info.dirname))

  supplement: (args...) ->
    @root.toAbsolute(args...)

  endsWithSep: (fullpath) ->
    _.contains(['', '.', '..'], fullpath) or fullpath.endsWith(path.sep)

  analysisPath: (apath) ->
    apath = if apath then path.normalize(apath) else ''
    endsWithSep = @endsWithSep(apath)
    npath = path.join(path.dirname(apath), path.basename(apath))

    path: apath
    dirname:
      if endsWithSep then npath else path.dirname(apath)
    basename:
      if endsWithSep then '' else path.basename(apath)

  parsePath: (fpath) ->
    fpath = '.' if fpath is ''
    console.log('before parse:', fpath)
    dirs = _.map(fpath.split(path.sep), (dir) =>
      for key, callback of @specialWords
        return dir = callback.call(this) if dir is key
      dir
    )
    console.log('parsed:', dirs...)
    path.join(dirs...)

  specialWords:
    '$DIR': -> path.dirname(@editor.getPath())
    '$dir': -> path.dirname(@editor.getPath())
    '': -> '/'
    '~': -> homedir
