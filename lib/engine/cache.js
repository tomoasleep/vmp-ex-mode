// @flow
export default class Cache {
  map: Map<string, any>;

  constructor() {
    this.map = new Map();
  }

  get(key: string) {
    return this.map.get(key);
  }

  set(key: string, value: any): void {
    this.map.set(key);
  }

  child(name: string): Cache {
    const cache = this.get(name);
    if (cache) {
      return cache;
    }

    const newCache = new Cache();
    this.set(name, newCache);

    return newCache;
  }
}
