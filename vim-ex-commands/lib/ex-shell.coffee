Completion = require './completion'

module.exports =
class ExShell
  constructor: (@registory, @options = {}) ->
    @options.editor ?= atom.workspace.getActiveTextEditor()

  execute: (cmdline) ->
    new Promise((resolve, reject) =>
      cmdline = @confirmCompleteWorker().supplement(cmdline)
      [name, args...] = cmdline.split(' ')
      if command = @registory.findCommand(name)
        resolve(command.dispatch(@options.editor, cmdline))
      else
        reject(new Error("Not an editor command: #{name}"))
    )

  search: (cmdline) ->
    @confirmCompleteWorker().search(cmdline)

  confirmCompleteWorker: ->
    @completeWorker ?= new Completion(@registory, @options)
