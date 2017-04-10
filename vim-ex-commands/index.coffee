Registory = require './lib/registory.coffee'

module.exports = VimExCommand = 
  activate: ->
    atom.vimcommands = VimExCommand.getRegistory()

  deactivate: ->
    atom.vimcommands = null

  getRegistory: ->
    @registory ?= new Registory()
