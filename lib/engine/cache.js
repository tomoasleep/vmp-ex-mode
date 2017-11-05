/* @flow */

export default class Cache {
  constructor() {
    this.map = new Map();
  }

  get(key) {
    return this.map.get(key);
  }

  set(key, value): void {
    this.map.set(key);
  }

  child(name): Cache {
    const cache = this.get(name);
    if (cache) {
      return cache;
    }

    const newCache = new Cache();
    this.set(name, newCache);

    return newCache;
  }
}
