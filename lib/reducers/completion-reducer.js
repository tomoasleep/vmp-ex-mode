'use babel';
import { CLOSE, MOVE_HISTORY, SET_COMPLETION, MOVE_COMPLETION, UPDATE_TEXT } from '../actions';

function moveCompletion(state, offset) {
  if (state.completion) {
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

function setCompletion(state, candidates) {
  if (state.completion && state.completion.candidates === candidates) {
    return state;
  } else {
    return Object.assign({}, state, {
      completion: { candidates },
    });
  }
}

export default function completionReducer(state, action) {
  switch (action.type) {
    case MOVE_COMPLETION:
      return moveCompletion(state, action.offset);
    case SET_COMPLETION:
      return setCompletion(state, action.candidates);
    case MOVE_HISTORY:
      return Object.assign({}, state, { completion: null });
    case UPDATE_TEXT:
      if (state.text !== action.text) {
        return Object.assign({}, state, { completion: null });
      } else {
        return state;
      }
    default:
      return state;
  }
}
