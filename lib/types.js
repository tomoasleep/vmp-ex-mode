// @flow

import typeof Candidate from './engine/candidate';

export type Completion = {
  +index: ?number,
  +backupText: ?string,
  +candidates: Array<Candidate>,
}

export type HistoryTraverse = {
  +index: ?number,
  +backupText: ?string,
};

export type State = {
  +text: ?string,
  +historyTraverse: ?HistoryTraverse,
  +completion: ?Completion,
  +history: any,
  +shell: any,
  +destroy: Function,
};
