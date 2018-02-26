// @flow
import { CLOSE, UPDATE_TEXT } from '../actions';
import type { Action } from '../actions';
import type { State } from '../types';

export default function actionReducer(state: State, action: Action) {
  switch (action.type) {
    case CLOSE:
      return Object.assign({}, state, { closed: true });
    case UPDATE_TEXT:
      return Object.assign({}, state, { text: action.text });
    default:
      return state;
  }
}
