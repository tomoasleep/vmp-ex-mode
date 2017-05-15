'use babel';
import { expect } from 'chai';
import { mainReducer } from '../lib/reducers';
import { updateText, setCompletion, moveCompletion, moveHistory } from '../lib/actions';
import History from '../lib/command-history';

const buildState = (options = {}) => {
  return Object.assign({}, {
    history: new History(),
    text: 'text',
    editorId: 'editor-id',
  }, options);
}

const buildCandidate = (id = 0) => {
  return {
    name: `name-${id}`,
    description: `description-${id}`,
  };
}

const buildCandidates = (length = 1) => {
  let list = []
  for (let i = 0; i < length; i++) {
    list[i] = buildCandidate(i);
  }
  return list;
}

describe('Reducers', () => {
  describe('UPDATE_TEXT', () => {
    it('updates its text', () => {
      const newText = 'new-text';
      const state = buildState();
      const action = updateText(newText);

      const nextState = mainReducer(state, action);
      expect(nextState.text).to.be.eql(newText);
    })
  });

  describe('SET_COMPLETION', () => {
    it('sets completion candidates', () => {
      const state = buildState();
      const candidates = buildCandidates(3);
      const action = setCompletion(candidates);

      const nextState = mainReducer(state, action);
      expect(nextState.completion.candidates).to.be.eql(candidates);
    });
  });

  describe('MOVE_COMPLETION', () => {
    context('when no candidates are selected', () => {
      const initialText = 'initialText';
      let state, candidates;

      beforeEach(() => {
        candidates = buildCandidates(3);
        state = buildState({
          text: initialText,
          completion: { candidates },
        });
      });

      it('can select the first candidate', () => {
        const action = moveCompletion(1);
        const nextState = mainReducer(state, action);

        expect(nextState.completion.backupText).to.be.eql(initialText);
        expect(nextState.completion.index).to.be.eql(0);
        expect(nextState.text).to.be.eql(candidates[0].name);
      });

      it('can select the last candidate', () => {
        const action = moveCompletion(-1);
        const nextState = mainReducer(state, action);

        expect(nextState.completion.backupText).to.be.eql(initialText);
        expect(nextState.completion.index).to.be.eql(candidates.length - 1);
        expect(nextState.text).to.be.eql(candidates[candidates.length - 1].name);
      });
    });

    context('when an candidate is already selected', () => {
      const currentIndex = 1;
      const backupText = 'backupText';
      let state, candidates;

      beforeEach(() => {
        candidates = buildCandidates(3);
        state = buildState({
          text: candidates[currentIndex].name,
          completion: {
            candidates,
            backupText,
            index: currentIndex,
          },
        });
      });

      it('can select the next candidate', () => {
        const action = moveCompletion(1);
        const nextState = mainReducer(state, action);

        expect(nextState.completion.backupText).to.be.eql(backupText);
        expect(nextState.completion.index).to.be.eql(currentIndex + 1);
        expect(nextState.text).to.be.eql(candidates[currentIndex + 1].name);
      });

      it('can select the previous candidate', () => {
        const action = moveCompletion(-1);
        const nextState = mainReducer(state, action);

        expect(nextState.completion.backupText).to.be.eql(backupText);
        expect(nextState.completion.index).to.be.eql(currentIndex - 1);
        expect(nextState.text).to.be.eql(candidates[currentIndex - 1].name);
      });
    });
  });

  describe('MOVE_HISTORY', () => {
    context('when no history is selected', () => {
      const initialText = 'initialText';
      let state, history;

      beforeEach(() => {
        history = new History(Array.from({ length: 3 }, (v, idx) => `history-${idx}`));
        state = buildState({
          text: initialText,
          history,
        });
      });

      it('can recover the first history', () => {
        const action = moveHistory(1);
        const nextState = mainReducer(state, action);

        expect(nextState.historyTraverse.backupText).to.be.eql(initialText);
        expect(nextState.historyTraverse.index).to.be.eql(0);
        expect(nextState.text).to.be.eql(history.get(0));
      });
    });

    context('when tracing histories', () => {
      const currentIndex = 1;
      const backupText = 'backupText';
      let state, history;

      beforeEach(() => {
        history = new History(Array.from({ length: 3 }, (v, idx) => `history-${idx}`));
        state = buildState({
          text: history.get(currentIndex),
          historyTraverse: {
            index: currentIndex,
            backupText,
          },
          history,
        });
      });

      it('can recover the next history', () => {
        const action = moveHistory(1);
        const nextState = mainReducer(state, action);

        expect(nextState.historyTraverse.backupText).to.be.eql(backupText);
        expect(nextState.historyTraverse.index).to.be.eql(currentIndex + 1);
        expect(nextState.text).to.be.eql(history.get(currentIndex + 1));
      });

      it('can recover the previous history', () => {
        const action = moveHistory(-1);
        const nextState = mainReducer(state, action);

        expect(nextState.historyTraverse.backupText).to.be.eql(backupText);
        expect(nextState.historyTraverse.index).to.be.eql(currentIndex - 1);
        expect(nextState.text).to.be.eql(history.get(currentIndex - 1));
      });
    });
  });
});
