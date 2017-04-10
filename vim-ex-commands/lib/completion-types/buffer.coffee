Promise = require 'bluebird'
Base = require './base'

module.exports =
class Buffer extends Base
  constructor: ->
    @buffers = atom.workspace.getTextEditors().filter (editor) -> editor.getPath()?
    @bufferNames = @buffers.map (buf) -> buf.getPath()

  narrowDown: (args...) ->
    @fuzzyFinder(args...)

  listup: ->
    @bufferNames
