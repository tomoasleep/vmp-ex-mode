/* @flow */

import CommandRegistory from './command-registory';
import Cache from './cache';

export default class Engine {
  constructor(commandRegistory: ?CommandRegistory) {
    this.commandRegistory = commandRegistory;
    this.commandSearchCache = new Cache();
    this.commandArgSearchCache = new Cache();
  }

  async execute(line) {
    const [commandname, ...args] = this.splitline(line);
    const command = await this.commandRegistory.search(line)[0];

    if (!command) {
      throw new Error(`No matching commands: ${line}`);
    }

    return command.execute(line);
  }

  async complete(line) {
    const [commandname, ...args] = this.splitline(line);
    const commands = await this.commandRegistory.search(commandName, this.commandSearchCache);

    if (args.length === 0 || commands.length === 0) {
      return commands;
    }

    const command = commands[0];
    return command.complete(line, this.cacheByName(command.name));
  }

  splitLine(line) {
    return line.split(/\s+/).filter((el, idx) => idx > 1 || el.length);
  }

  cacheByName(name) {
    this.commandArgSearchCache.child(name);
  }
}
