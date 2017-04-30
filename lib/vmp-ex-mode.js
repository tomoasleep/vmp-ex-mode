'use babel';
import {Emitter, CompositeDisposable} from 'atom';
import { h, render } from 'preact';
import CmdlineComponent from './cmdline-component';
import CmdlineViewModel from './cmdline-view-model';
import CommandHistory from './command-history';
import BuildinCommands from './buildin-commands';
const VimExCommands = require('vim-ex-commands');

export default {
  extended: false,
  subscriptions: null,
  emitter: new Emitter(),

  activate() {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.views.addViewProvider(CmdlineViewModel, (cmdlineViewModel) => {
      const rootElement = document.createElement('div');
      render(h(CmdlineComponent, { model: cmdlineViewModel }), rootElement);
      return rootElement;
    }));

    VimExCommands.activate();
    BuildinCommands.install(this.getCommandRegistory());
  },

  deactivate() {
    this.subscriptions.dispose();
    VimExCommands.deactivate();
  },

  openCommandline(editor) {
    const model = new CmdlineViewModel({
      history: this.getCommandHistory(),
      exShell: this.getCommandRegistory().createExShell({ editor }),
    });
    const panel = atom.workspace.addBottomPanel({
      item: model
    });
    model.onDidDestroy(() => {
      panel.destroy();
      const activeEditor = atom.workspace.getActiveTextEditor();
      if (activeEditor) {
        atom.views.getView(activeEditor).focus();
      }
    });
    return model;
  },

  consumeVimModePlus({getEditorState}) {
    atom.commands.add('atom-text-editor', {
      'vmp-ex-mode:open': (event) => {
        const editor = event.target.getModel();
        const vimState = getEditorState(editor);
        if (vimState) {
          this.openCommandline(editor);
        }
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
