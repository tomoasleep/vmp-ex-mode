'use babel';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { randomBytes } from 'crypto';
import { mainReducer } from './reducers';
import { UPDATE_TEXT, MOVE_HISTORY, invokeCompletion } from './actions';

class Schedular {
  constructor() {
    this.waitMap = {};
  }

  schedule(event, time, callback) {
    if (this.waitMap[event]) {
      clearTimeout(this.waitMap[event]);
    }

    this.waitMap[event] = setTimeout(() => {
      this.waitMap[event] = null;
      callback();
    }, time);
  }
}

function shouldUpdateCompletions(state, action) {
  switch (action.type) {
    case UPDATE_TEXT:
      return action.text !== state.text;
    case MOVE_HISTORY:
      return true;
    default:
      return false;
  }
}

const autoCompleteMiddleware = store => next => action => {
  const prevState = store.getState();
  const nextState = next(action);

  if (shouldUpdateCompletions(prevState, action)) {
    prevState.schedular.schedule('autoComplete', 100, () => {
      store.dispatch(invokeCompletion());
    });
  }

  return nextState;
}

export default function buildStore(shell, history, destroy) {
  const initState = { shell, destroy, history, schedular: new Schedular(), text: '', editorId: randomBytes(16).toString('hex') };
  const store = createStore(mainReducer, initState, applyMiddleware(thunkMiddleware, autoCompleteMiddleware));
  store.dispatch(invokeCompletion());
  return store;
}
