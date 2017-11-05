/* @flow */

export default class File {
  baseDir: string;
  async complete(line, state, cache: Cache) {
    const files = await this.lookupFiles(line, state, cache);

    return files.filter();
  }
}

