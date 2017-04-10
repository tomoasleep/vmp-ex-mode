_ = require 'underscore-plus'
ExCommand = require './ex-command'
ExShell = require './ex-shell'

module.exports =
class Registory
  constructor: ->
    @commands = {}

  register: (name, description, callback) ->
    if not description?
      # When a hash argument received
      commands = name
      @register(name, callback) for name, callback of commands
    else if callback?
      @registerAnCommand(name, description, callback)
    else
      if _.isFunction(description)
        @registerAnCommand(name, null, callback)
      else
        obj = description
        if obj.callback?
          @registerAnCommand(name, obj.description, obj.callback)
        else
          [description, callback] = _.pairs(obj)[0]
          @registerAnCommand(name, description, callback)

  registerAnCommand: (name, description, callback) ->
    command = new ExCommand(name, callback, { description })
    @commands[command.getName()] = command

  getAllCommands: -> @commands
  findCommand: (name) -> @commands[name]
  searchCommands: (input) ->
    _.chain(@commands)
      .values()
      .filter((command) -> command.getName?().startsWith?(input))
      .value()

  executeCmdLine: (line, sessionOptions) ->
    @prepareDispatchSession(sessionOptions).execute(line)

  createExShell: (options = {}) ->
    new ExShell(this, options)
