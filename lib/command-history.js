'use babel';
export default class CommandHistory {
  constructor() {
    this.history = [];
  }

  add(command) {
    this.history.unshift(command);
  }

  get(index) {
    return this.history[index];
  }
}
