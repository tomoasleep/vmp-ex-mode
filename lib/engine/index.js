/* @flow */

import CommandRegistory from './command-registory';
import Cache from './cache';

export default class Engine {
  commandRegistory: CommandRegistory;
  commandSearchCache: Cache;
  commandArgSearchCache: Cache;

  constructor(commandRegistory: ?CommandRegistory) {
    this.commandRegistory = commandRegistory || new CommandRegistory();
    this.commandSearchCache = new Cache();
    this.commandArgSearchCache = new Cache();
  }

  async execute(line: string) {
    const [commandname, ...args] = this.splitLine(line);
    const command = await this.commandRegistory.search(line)[0];

    if (!command) {
      throw new Error(`No matching commands: ${line}`);
    }

    return command.execute(line);
  }

  async complete(line: string) {
    const [commandname, ...args] = this.splitLine(line);
    const commands = await this.commandRegistory.search(commandName, this.commandSearchCache);

    if (args.length === 0 || commands.length === 0) {
      return commands;
    }

    const command = commands[0];
    return command.complete(line, this.cacheByName(command.name));
  }

  splitLine(line: string): Array<string> {
    return line.split(/\s+/).filter((el, idx) => idx > 1 || el.length);
  }

  cacheByName(name: string) {
    this.commandArgSearchCache.child(name);
  }
}
