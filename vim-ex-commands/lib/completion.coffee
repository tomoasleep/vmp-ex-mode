_ = require 'underscore-plus'
CompletionTypes = require './completion-types'

module.exports =
class Complete
  constructor: (@registory, @options = {}) ->
    @options.registory = @registory
    @typeCache = {}

  search: (cmdline) ->
    [command, args...] = cmdline.split(' ')
    currentPos = args.length

    if currentPos is 0
      @commandSearch(command)
    else
      @argsSearch(command, currentPos - 1, args[currentPos - 1])

  commandSearch: (commandInput) ->
    _.map(@registory.searchCommands(commandInput), (cmd) ->
      name: cmd.getName()
      description: cmd.getDescription()
    )

  argsSearch: (commandName, pos, argInput) ->
    return [] unless command = @registory.findCommand(commandName)
    typeName = command.getArgTypeNames()[pos]
    console.log(commandName, typeName, pos, argInput)
    argCompletion = @confirmArgCompletion(typeName)
    @typeCache[typeName]?.search(argInput)

  supplement: (cmdline) ->
    [cmdname, args...] = cmdline.split(' ')

    return cmdline unless command = @registory.findCommand(command)
    parsedArgs =
      _.map args, (arg, idx) ->
        typeName = command.getArgTypeNames()[idx]
        argCompletion = @confirmArgCompletion(typeName)
        argCompletion.supplement(arg)
    [cmdname, parsedArgs...].join(' ')

  confirmArgCompletion: (typeName) ->
    @typeCache[typeName] ?=
      (CompletionTypes.findType(typeName) ? CompletionTypes.otherType).initCompletion(@options)

  generateCompletedCmdline: (input, candidate) ->
    eachWords = input.split(' ')
    eachWords[eachWords.length - 1] = candidate
    eachWords.join(' ')
