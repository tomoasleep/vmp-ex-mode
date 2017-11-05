import { Emitter } from 'event-kit';

export class ResultLeaf {
  constructor(description, result) {
    this.emitter = new Emitter();
    this.description = description;
    this.result = result;
  }

  getDescription() {
    return this.description;
  }

  isSuite() {
    return false;
  }

  onDidUpdate(callback) {
    this.emitter.on('did-update', callback);
  }

  isFailed() {
    return this.result.status === 'failed';
  }

  getFailureMessage() {
    if (!this.result.failureMessages) {
      return null;
    }
    return this.result.failureMessages.join('\n');
  }
}

export class ResultTree {
  constructor(description) {
    this.emitter = new Emitter();
    this.description = description;
    this.children = new Map();
  }

  add(node) {
    this.children.set(node.getDescription(), node);
    this.emitter.emit('did-update');
  }

  get(description) {
    return this.children.get(description);
  }

  getIter() {
    return this.children.values();
  }

  getDescription() {
    return this.description;
  }

  isSuite() {
    return true;
  }

  onDidUpdate(callback) {
    this.emitter.on('did-update', callback);
  }
}

