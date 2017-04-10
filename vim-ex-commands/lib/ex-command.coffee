{ CommandDefParser } = require './command-def-parsers'

module.exports =
class ExCommand
  constructor: (@cmddef, @callback, { @description, @argTypes: [] } = {}) ->
    @parser = new CommandDefParser(@cmddef)

  execute: (callee, args...) ->
    @callback.apply(callee, args)

  dispatch: (callee, line) ->
    [_name, args...] = @parseLine(line)
    @callback.apply(callee, args)

  parseLine: (line) ->
    line.split(' ')

  getName: ->
    @parser.getName()

  getDescription: ->
    @description

  getArgTypes: ->
    @parser.getArgTypes()

  getArgTypeNames: ->
    @parser.getArgTypeNames()
