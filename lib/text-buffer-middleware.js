import { UPDATE_TEXT, updateText } from './actions';

function shouldDispatchAction(editorText, { text }, action) {
  if (action.type === UPDATE_TEXT) {
    return action.text !== editorText;
  } else {
    return action.text !== editorText;
  }
}

const textBufferMiddleware = store => next => action => {
  const state = store.getState();
  const { textBuffer } = state;
  if (textBuffer && shouldDispatchAction(textBuffer.getText(), state, action)) {
    store.dispatch(updateText(textBuffer.getText()));
  }
  const nextState = next(action);
  if (textBuffer && textBuffer.getText() !== nextState.text) {
    textBuffer.setText(nextState.text);
  }
  return nextState;
};

export default textBufferMiddleware;
