/* @flow */
import Command from './command';

export default class CommandRegistory {
  commands: Map<string, Command>;

  constructor() {
    this.commands = new Map();
  }

  register(name: string, description: ?string, callback: () => void): void {
    this.commands.set(name, new Command(name, description, callback));
  }

  get(name: string): ?Command {
    return this.commands.get(name);
  }

  async search(query: string): Promise<Array<Command>> {
    return Array.from(this.commands.entries()).filter(
      ([key, value]) =>  key.startsWith(query)
    ).sort(
      ([keyA, valueA], [keyB, valueB]) => keyA.localeCompare(keyB)
    ).map(
      ([key, value]) => value
    );
  }
}
