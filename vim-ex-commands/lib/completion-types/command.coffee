BaseType = require './base.coffee'
_ = require 'lodash'

module.exports =
  class Command extends BaseType
    constructor: ({ @editor }) ->
      @eventElement =
        if @editor
          atom.views.getView(@editor)
        else
          atom.views.getView(atom.workspace)

    narrowDown: (args...) ->
      @fuzzyFinder(args...)

    listup: (input) ->
      @commands ?=
        _.pluck(atom.commands.findCommands(target: @eventElement), 'name')
