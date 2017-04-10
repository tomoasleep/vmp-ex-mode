BaseType = require './base'

module.exports =
  findType: (name) ->
    @types[name]

  types:
    file: require './file'
    command: require './command'
    buffer: require './buffer'

  otherType:
    class OtherType extends BaseType
