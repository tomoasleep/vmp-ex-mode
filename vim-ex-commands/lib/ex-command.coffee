{ CommandDefParser } = require './command-def-parsers'

module.exports =
class ExCommand
  constructor: (@cmddef, @callback, { @description, @argTypes: [] } = {}) ->
    @parser = new CommandDefParser(@cmddef)

  execute: (target, args) ->
    @callback({ target, args })

  dispatch: (target, line) ->
    [_name, args...] = @parseLine(line)
    @execute(target, args)

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
