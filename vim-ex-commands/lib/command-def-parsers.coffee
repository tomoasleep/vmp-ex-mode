ArgTypes = require './completion-types'

module.exports.CommandDefParser =
  class CommandDefParser
    constructor: (@cmdline) ->
      @parse()

    parse: ->
      [@command, @args...] = @cmdline.split(/\s+/)
      @argParsers = (new ArgTypeParser(arg) for arg in @args)
      @cmdNameParser = new CommandNameParser(@command)

    getName: ->
      @cmdNameParser.getName()

    getArgTypes: ->
      parser.getType() for parser in @argParsers

    getArgTypeNames: ->
      parser.getName() for parser in @argParsers

module.exports.CommandNameParser =
  class CommandNameParser
    constructor: (@command) ->
      @parse()

    parse: ->
      @name = @command.split(/[()]/).join('')

    getName: ->
      @name

module.exports.ArgTypeParser =
  class ArgTypeParser
    constructor: (@argline) ->
      @parse()

    parse: ->
      matcher = /<(.+)>/
      @typeName = (matcher.exec(@argline) ? [])[1]
      @type = ArgTypes.findType(@typeName) ? ArgTypes.otherType

    getType: ->
      @type

    getName: ->
      @typeName
