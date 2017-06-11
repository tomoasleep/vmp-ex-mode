'use babel';
import { CLOSE, UPDATE_TEXT } from '../actions';

export default function actionReducer(state, action) {
  switch (action.type) {
    case CLOSE:
      return Object.assign({}, state, { closed: true });
    case UPDATE_TEXT:
      return Object.assign({}, state, { text: action.text });
    default:
      return state;
  }
}
