_ = require 'lodash'
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
      @decorateCandidatesWithText(@argsSearch(command, currentPos - 1, args[currentPos - 1]), command, args)

  decorateCandidatesWithText: (candidates, command, args) ->
    prefix = [command].concat(args.slice(0, args.length - 1)).join(' ')
    candidates.map (candidate) =>
      name: candidate.name
      description: candidate.description
      text: "#{prefix} #{candidate.name}"


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
