'use babel';
import { Emitter } from 'atom';

class Runner {
  constructor(model, exShell) {
    this.model = model;
    this.exShell = exShell;
  }

  search(input) {
    // console.log(input.characters);
    this.exShell.search(input.characters);
  }

  execute(input) {
    return this.exShell.execute(input.characters);
  }
}

class HistoryController {
  constructor(model, history) {
    this.model = model;
    this.history = history;
    this.historyIndex = -1;
  }

  getFromHistory(index) {
    return this.getCommandHistoryItem(index);
  }

  setNextCommand() {
    if (this.history(this.historyIndex + 1)) {
      this.historyIndex += 1;
      this.restoreHistory(this.historyIndex);
    }
  }

  setPrevCommand() {
    if (this.historyIndex <= 0) {
      // get us back to a clean slate
      this.historyIndex = -1;
      this.getInputEditor().setText('');
    } else {
      this.historyIndex -= 1;
      this.restoreHistory(this.historyIndex);
    }
  }

  setInputFromHistory(index) {
    this.model.setText(this.getFromHistory(index).value);
  }

  saveToHistory(input) {
    this.history.add(input);
  }
}

export default class CmdlineViewModel {
  constructor({ history, exShell }) {
    this.text = '';

    this.historyController = new HistoryController(this, history);
    this.runner = new Runner(this, exShell);
    this.emitter = new Emitter;

    // this.view.editor.on('core:move-up', this.increaseHistoryCommand)
    // this.view.editor.on('core:move-down', this.decreaseHistoryCommand)
    // CmdlineViewModel.emitter.emit 'did-attach', { viewModel: this, this.editor, this.vimState }
  }

    // this.delegatesMethods 'onDidChangeText', 'observeText', toProperty: 'view'
    // this.onDidAttach: (callback) -> this.emitter.on 'did-attach', callback

  invokeCommand() {
    const input = this.getText();
    return this.runner.execute(input).then(() => {
      this.historyController.saveToHistory(input);
    });
  }

  getText() {
    return this.text;
  }

  setText(text) {
    const oldText = oldText;
    this.text = text;
    if (this.text !== oldText) {
      this.emitter.emit('update-text', { text, oldText });
    }
  }

  increaseHistory() {
    this.historyController.setNextCommand();
  }

  decreaseHistory() {
    this.historyController.setPrevCommand();
  }

  getCandidates() {
    return this.runner.search(this.getText());
  }

  destroy() {
    this.emitter.emit('destroy');
  }

  onUpdateText(callback) {
    return this.emitter.on('update-text', callback);
  }

  onDidDestroy(callback) {
    const disposable = this.emitter.on('destroy', (...args) => {
      disposable.dispose();
      return callback(...args);
    });
    return disposable;
  }
}
