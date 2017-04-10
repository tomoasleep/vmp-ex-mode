_ = require 'underscore-plus'
{ filter } = require 'fuzzaldrin'

module.exports =
  class BaseType
    @initCompletion: (options) ->
      new this(options)

    search: (input) ->
      @narrowDown(@listup(input), input)

    fuzzyFinder: (candidates, input) ->
      candObjs = _.map(candidates, (cand) -> if _.isString(cand) then { name: cand } else cand)
      filter(candObjs, input, key: 'name')

    startsWith: (candidates, input) ->
      _.filter candidates, (cand) ->
        name = cand.displayName ? cand
        name.startsWith(input)

    narrowDown: (args...) ->
      @startsWith(args...)

    listup: (input) -> []

    supplement: (input) -> input
