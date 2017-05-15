'use babel';
export default class CommandHistory {
  constructor(history = []) {
    this.history = history;
  }

  add(command) {
    this.history.unshift(command);
  }

  get(index) {
    return this.history[index];
  }

  get length() {
    return this.history.length;
  }
}
