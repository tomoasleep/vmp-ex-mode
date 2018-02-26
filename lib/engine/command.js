/* @flow */

export default class Command {
  name: string;
  description: ?string;
  callback: () => void;

  constructor(name: string, description: ?string, args: Object[], callback: () => void) {
    this.name = name;
    this.description = description;
    this.args = args;
    this.callback = callback;
  }

  async complete(line: string, state, cache: Map): Promise<Array<Candidate>> {
    const [commandName, ...args] = line.split(/\s+/).filter((el, idx) => idx > 1 || el.length);
    const completeIdx = args.length - 1;

    if (completeIdx < 0) {
      return [];
    } else {
      return this.args[completeIdx].complete(args[completeIdx], state, cache.child(`arg-${completeIdx}`)).map((candidate));
    }
  }

  swapLastWord(line: string, word: string): string {

  }

  commandLineCandidateFromArgCandidate(line: string, candidate: Candidate): Candidate {
    return new Candidate
  }
}
