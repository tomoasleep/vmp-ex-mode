'use babel';
import actionReducer from './action-reducer';
import completionReducer from './completion-reducer';
import historyReducer from './history-reducer';

export function mainReducer(state, action) {
  if (state.closed) {
    return state;
  } else {
    return [historyReducer, completionReducer, actionReducer].reduce((state, reducer) => {
      return reducer(state, action);
    }, state);
  }
}
