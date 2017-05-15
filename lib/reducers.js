'use babel';
import { CLOSE, MOVE_HISTORY, SET_COMPLETION, MOVE_COMPLETION, UPDATE_TEXT } from './actions';

export function moveCompletion(state, offset) {
  if (state.completion) {
    if (state.completion.index != null) {
      let nextIndex = state.completion.index + offset;
      if (nextIndex < 0 || nextIndex >= state.completion.candidates.length) {
        nextIndex = null;
      }

      if (nextIndex != null) {
        return Object.assign({}, state, {
          completion: Object.assign({}, state.completion, {
            index: nextIndex,
            backupText: state.completion.backupText,
          }),
          text: state.completion.candidates[nextIndex].name,
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

      return Object.assign({}, state, {
        completion: Object.assign({}, state.completion, {
          index: nextIndex,
          backupText,
        }),
        text: state.completion.candidates[nextIndex].name || text,
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

export function completionReducer(state, action) {
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

export function moveHistory(state, offset) {
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

export function historyReducer(state, action) {
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

export function actionReducer(state, action) {
  switch (action.type) {
    case CLOSE:
      return Object.assign({}, state, { closed: true });
    case UPDATE_TEXT:
      return Object.assign({}, state, { text: action.text });
    default:
      return state;
  }
}

export function mainReducer(state, action) {
  if (state.closed) {
    return state;
  } else {
    return [historyReducer, completionReducer, actionReducer].reduce((state, reducer) => {
      return reducer(state, action);
    }, state);
  }
}
