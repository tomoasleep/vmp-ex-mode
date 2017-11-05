import { assert } from 'chai';
import td from 'testdouble';

import Engine from '../index';
import CommandRegistory from '../command-registory';

describe('Engine', () => {
  function mockCommandRegistory() {
    const FakeRegistory = td.constructor(CommandRegistory);
    return (new FakeRegistory());
  }

  context('#execute', () => {
    const engine = new Engine(td.);

  });
});
