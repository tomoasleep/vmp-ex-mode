/* @flow */
import Command from 'command';

export default class CommandRegistory {
  commands: Map<string, Command>;

  constructor() {
    this.commands = new Map();
  }

  register(name: string, description: ?string, callback: () => void): void {
    this.commands.set(name, new Command(name, description, callback));
  }

  get(name: string): Command {
    return this.commands.get(name);
  }

  async search(query: string): Array<Command> {
    return Array.from(this.command.entries()).filter(([key, value]) => {
      return key.startsWith(query);
    }).sort(
      ([keyA, valueA], [keyB, valueB]) => keyA.localCompare(keyB)
    ).map(
      ([key, value]) => value
    );
  }
}
