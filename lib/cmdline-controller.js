'use babel';
import { Emitter } from 'atom';

class Runner {
  constructor(model) {
    this.model = model;
  }

  get exShell() {
    this.model.exShell;
  }

  search(input) {
    return this.exShell.search(input);
  }

  execute(input) {
    return this.exShell.execute(input);
  }
}

class HistoryController {
  constructor(model) {
    this.model = model;
  }

  get history() {
    return this.model.history;
  }

  moveHistory({ index, text }, offset) {
    let nextIndex = (index || -1) + offset;
    if (nextIndex >= this.history.length) {
      nextIndex = this.history.length;
    }
    if (nextIndex < 0) {
      nextIndex = null;
    }

    return {
      index: nextIndex,
      text: nextIndex ? this.history.get(nextIndex) : null,
    };
  }

  saveToHistory(input) {
    this.history.add(input);
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

export default class CmdlineController {
  constructor(model) {
    this.model = model;
    this.completeSelectionController = new CompleteSelectionController(model);
    this.historyController = new CompleteSelectionController(model);
    this.emitter = new Emitter();
  }

  didPerformAction(callback) {

  }
}
