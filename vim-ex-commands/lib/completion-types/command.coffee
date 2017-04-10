BaseType = require './base.coffee'
_ = require 'underscore-plus'

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
