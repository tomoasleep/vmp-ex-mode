// @flow
import type { State } from '../types';
import type { Action } from '../actions';
import actionReducer from './action-reducer';
import completionReducer from './completion-reducer';
import historyReducer from './history-reducer';

export function mainReducer(state: State, action: Action): State {
  if (state.closed) {
    return state;
  } else {
    return [historyReducer, completionReducer, actionReducer].reduce((state, reducer) => {
      return reducer(state, action);
    }, state);
  }
}
