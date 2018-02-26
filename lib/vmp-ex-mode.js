// @flow
import type {PackageConfiguration} from 'atom';
import {Emitter, CompositeDisposable} from 'atom';
import CommandHistory from './command-history';
import BuildinCommands from './buildin-commands';
import PanelViewModel from './panel-view-model';

export default class VmpExMode implements PackageConfiguration<Object> {
  extended: boolean;
  subscriptions: CompositeDisposable;
  emitter: Emitter;
  commandHistory: CommandHistory;

  constructor() {
    this.extended = false;
    this.subscriptions = new CompositeDisposable();
    this.emitter = new Emitter();
    this.commandHistory = new CommandHistory();
  }

  activate(state: Object): void {
    this.subscriptions.add(atom.views.addViewProvider(PanelViewModel, PanelViewModel.renderInstance));
  }

  deactivate(): void {
    this.subscriptions.dispose();
  }

  openCommandline(editor) {
    const model = new PanelViewModel({
      history: this.getCommandHistory(),
      shell: this.getCommandRegistory().createExShell({ editor }),
    });
    model.attach();
    return model;
  }

  consumeVimModePlus({getEditorState}) {
    atom.commands.add('atom-text-editor', 'vmp-ex-mode:open', (event) => {
      const editor = event.target.closest('atom-text-editor').getModel();
      const vimState = getEditorState(editor);
      if (vimState) {
        this.openCommandline(editor);
      }
    });
  }

  getCommandHistory() {
    return this.commandHistory;
  }

  provideService() {}
};
