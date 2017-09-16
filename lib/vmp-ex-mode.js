'use babel';
import {Emitter, CompositeDisposable} from 'atom';
import CommandHistory from './command-history';
import BuildinCommands from './buildin-commands';
import PanelViewModel from './panel-view-model';

const VimExCommands = require('vim-ex-commands');

export default {
  extended: false,
  subscriptions: null,
  emitter: new Emitter(),

  activate() {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.views.addViewProvider(PanelViewModel, PanelViewModel.renderInstance));

    VimExCommands.activate();
    BuildinCommands.install(this.getCommandRegistory());
  },

  deactivate() {
    this.subscriptions.dispose();
    VimExCommands.deactivate();
  },

  openCommandline(editor) {
    const model = new PanelViewModel({
      history: this.getCommandHistory(),
      shell: this.getCommandRegistory().createExShell({ editor }),
    });
    model.attach();
    return model;
  },

  consumeVimModePlus({getEditorState}) {
    atom.commands.add('atom-text-editor', 'vmp-ex-mode:open', (event) => {
      const editor = event.target.closest('atom-text-editor').getModel();
      const vimState = getEditorState(editor);
      if (vimState) {
        this.openCommandline(editor);
      }
    });
  },

  getCommandHistory() {
    if (!this.commandHistory) {
      this.commandHistory = new CommandHistory();
    }
    return this.commandHistory;
  },

  getCommandRegistory() {
    return VimExCommands.getRegistory();
  },

  provideService() {},
};
