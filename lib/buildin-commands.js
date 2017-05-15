module.exports = {
  commands: {
    'w': {
      'save the current buffer': ({ target }) => {
        atom.commands.dispatch(atom.views.getView(target), 'core:save');
      }
    },
    'w(rite) [<file>]': {
      'save the current buffer': ({ target }) => {
        atom.commands.dispatch(atom.views.getView(target), 'core:save');
      }
    },
    'wq': {
      'save and close the current buffer': ({ target }) => {
        atom.commands.dispatch(atom.views.getView(target), 'core:save');
        atom.commands.dispatch(atom.views.getView(target), 'core:close');
      }
    },
    'q': {
      'close the current buffer': ({ target }) => {
        atom.commands.dispatch(atom.views.getView(target), 'core:close');
      }
    },
    'q(uit)': {
      'close the current buffer': ({ target }) => {
        atom.commands.dispatch(atom.views.getView(target), 'core:close');
      }
    },
    'command [<command>]': {
      'open command palette': ({ target, args }) => {
        const [command] = args;
        if (command) {
          atom.commands.dispatch(atom.views.getView(target), command);
        } else {
          atom.commands.dispatch(atom.views.getView(target), 'command-palette:toggle');
        }
      }
    },
    'project': {
      'open project manager': ({ target }) => {
        atom.commands.dispatch(atom.views.getView(target), 'project-manager:list-projects');
      }
    },
    'settings': {
      'open settng views': ({ target }) => {
        atom.commands.dispatch(atom.views.getView(target), 'settings-view:open');
      }
    },
    'reload': {
      'reload all views': ({ target}) => {
        atom.commands.dispatch(atom.views.getView(target), 'window:reload');
      }
    }
  },

  install(registory) {
    for (const commandName in this.commands) {
      registory.register(commandName, this.commands[commandName]);
    }
  }
};
