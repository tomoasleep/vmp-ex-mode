'use babel';
import { TextBuffer, Emitter } from 'atom';

class Runner {
  constructor(model, exShell) {
    this.model = model;
    this.exShell = exShell;
  }

  search(input) {
    this.exShell.search(input);
  }

  execute(input) {
    return this.exShell.execute(input);
  }
}

class HistoryController {
  constructor(history) {
    this.history = history;
  }

  moveHistory({ index, text }, offset) {
    let nextIndex = (index || -1) + offset;
    if (nextIndex >= this.history.length) {
      nextIndex = this.histroy.length;
    }
    if (nextIndex < 0) {
      nextIndex = null;
    }

    return {
      index: nextIndex,
      text: nextIndex ? this.get(nextIndex) : null,
    };
  }

  saveToHistory(input) {
    this.history.add(input);
  }

  get(index) {
    return this.history.get(index);
  }
}

class CompleteSelectionController {
  moveCompletion({ index, text }, completions, offset) {
    if (offset === 0 || completions.length < 1) {
      return { index, text };
    }

    const nextIndex = this.getNextIndex(index, offset);
    if (nextIndex) {
      return { index: nextIndex, text: completions[nextIndex] };
    } else {
      return { index: nextIndex, text: null };
    }
  }

  getNextIndex(index, completions, offset) {
    let nextIndex;
    if (!index) {
      nextIndex = offset > 0 ? offset - 1 : completions.length + offset;
    } else if (index + offset % completions.length === 0) {
      nextIndex = null;
    }

    if (nextIndex) {
      nextIndex %= completions.length;
    }
    return nextIndex;
  }
}

class BaseState {
  constructor(model) {
    this.model = model;
    this.initialize();
  }
}

export default class CmdlineViewModel {
  constructor({ history, exShell }) {
    this.historyController = new HistoryController(history);
    this.runner = new Runner(this, exShell);
    this.emitter = new Emitter;
    this.textBuffer = new TextBuffer();
    this.mode = 'normal';
    this.completions = [];
    this.updateCompletions();
    /* this.textBuffer.onDidChange(() => { this.didTextEdit() }); */
    this.applyNormalMove();
  }

  getBuffer() {
    return this.textBuffer;
  }

  invokeCommand() {
    const input = this.getText();
    return this.runner.execute(input).then(() => {
      this.historyController.saveToHistory(input);
    });
  }

  setText(text) {
    this.textBuffer.setText(text);
  }

  getText(text) {
    return this.textBuffer.getText(text);
  }

  moveHistory(offset) {
    const nextState = this.historyController.moveHistory({
      text: this.getText(),
      index: this.historyIndex,
    }, offset);

    if (nextState.index) {
      this.applyHistoryMove(nextState);
    } else {
      this.applyNormalMove();
    }
  }

  moveCompletion(offset) {
    const nextState = this.completeSelectionController.moveHistory({
      text: this.getText(),
      index: this.completionIndex,
    }, this.completions, offset);


    if (nextState.index) {
      this.applyCompleteMove(nextState);
    } else {
      this.applyNormalMove();
    }
  }

  applyHistoryMove({ text, index }) {
    if (this.mode !== 'history') {
      this.backupText = this.getText();
    }

    this.mode = 'history';
    this.historyIndex = index;
    this.completionIndex = null;
    this.setText(text);
    this.notifyStatusUpdate();
  }

  applyCompleteMove({ text, index }) {
    if (this.mode !== 'complete') {
      this.backupText = this.getText();
    }

    this.mode = 'complete';
    this.historyIndex = null;
    this.completionIndex = index;
    this.setText(text);
    this.notifyStatusUpdate();
  }

  applyNormalMove() {
    const currentMode = this.mode;

    this.mode = 'normal';
    this.historyIndex = null;
    this.completionIndex = null;
    if (currentMode !== 'normal') {
      this.setText(this.backupText);
    }
    this.backupText = null;
    this.notifyStatusUpdate();
  }

  didTextEdit() {
    const currentMode = this.mode;
    switch (currentMode) {
      case 'history':
        if (this.model.getText() !== this.model.historyController.get(this.historyIndex)) {
          this.applyNormalMove();
        }
        this.updateCompletions();
        break;
      case 'complete':
        if (this.getText() !== this.completions[this.completionIndex]) {
          this.applyNormalMove();
        }
        break;
      case 'normal':
        this.updateCompletions();
        break;
    }
    this.notifyStatusUpdate();
  }

  notifyStatusUpdate() {
    this.emitter.emit('update-state');
  }

  getState() {
    return {
      completeIndex: this.completeIndex || null,
      completions: this.completions,
      historyIndex: this.historyIndex || null,
      mode: this.mode,
    };
  }

  updateCompletions() {
    this.completions = this.runner.search(this.getText());
  }

  destroy() {
    this.emitter.emit('destroy');
  }

  onUpdateState(callback) {
    return this.emitter.on('update-state', callback);
  }

  onDidDestroy(callback) {
    const disposable = this.emitter.on('destroy', (...args) => {
      disposable.dispose();
      return callback(...args);
    });
    return disposable;
  }
}
