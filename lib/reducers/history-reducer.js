'use babel';
import { CLOSE, MOVE_HISTORY, SET_COMPLETION, MOVE_COMPLETION, UPDATE_TEXT } from '../actions';

function moveHistory(state, offset) {
  const backupText = state.historyTraverse ? state.historyTraverse.backupText : state.text;
  let nextIndex = (state.historyTraverse ? state.historyTraverse.index : -1) + offset;
  if (nextIndex >= state.history.length) {
    nextIndex = state.history.length - 1;
  }

  if (nextIndex >= 0) {
    return Object.assign({}, state, {
      historyTraverse: {
        index: nextIndex,
        backupText,
      },
      text: state.history.get(nextIndex),
    });
  } else {
    return Object.assign({}, state, {
      historyTraverse: null,
      text: backupText,
    });
  }
}

export default function historyReducer(state, action) {
  switch (action.type) {
    case MOVE_HISTORY:
      return moveHistory(state, action.offset);
    case MOVE_COMPLETION:
      return Object.assign({}, state, { historyTraverse: null });
    case UPDATE_TEXT:
      if (state.text !== action.text) {
        return Object.assign({}, state, { historyTraverse: null });
      } else {
        return state;
      }
    default:
      return state;
  }
}
