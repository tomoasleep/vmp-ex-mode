// @flow
import { CLOSE, MOVE_HISTORY, SET_COMPLETION, MOVE_COMPLETION, UPDATE_TEXT } from '../actions';
import type { Action } from '../actions';
import type { State, Completion } from '../types';
import typeof Candidate from '../engine/candidate';

function moveCompletion(state: State, offset: number): State {
  if (state.completion != null) {
    if (state.completion.index != null) {
      let nextIndex = state.completion.index + offset;
      if (nextIndex < 0 || nextIndex >= state.completion.candidates.length) {
        nextIndex = null;
      }

      if (nextIndex != null) {
        const selectedCandidate = state.completion.candidates[nextIndex];
        return Object.assign({}, state, {
          completion: Object.assign({}, state.completion, {
            index: nextIndex,
            backupText: state.completion.backupText,
          }),
          text: selectedCandidate.text || selectedCandidate.name,
        });
      } else {
        return Object.assign({}, state, {
          completion: Object.assign({}, state.completion, {
            index: null,
            backupText: null,
          }),
          text: state.completion.backupText,
        });
      }
    } else {
      const backupText = state.text;
      const nextIndex = offset < 0 ? state.completion.candidates.length + offset : offset - 1;
      const selectedCandidate = state.completion.candidates[nextIndex];

      return Object.assign({}, state, {
        completion: Object.assign({}, state.completion, {
          index: nextIndex,
          backupText,
        }),
          text: selectedCandidate.text || selectedCandidate.name,
      });
    }
  } else {
    return state;
  }
}

function setCompletion(state: State, candidates: Array<Candidate>) {
  if (state.completion && state.completion.candidates === candidates) {
    return state;
  } else {
    return Object.assign({}, state, {
      completion: { candidates },
    });
  }
}

export default function completionReducer(state: State, action: Action): State {
  switch (action.type) {
    case MOVE_COMPLETION:
      return moveCompletion(state, action.offset);
    case SET_COMPLETION:
      return setCompletion(state, action.candidates);
    case MOVE_HISTORY:
      return Object.assign({}, state, { completion: null });
    default:
      return state;
  }
}
