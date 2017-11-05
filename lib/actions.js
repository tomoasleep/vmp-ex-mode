export function confirm() {
  return (dispatch, getState) => {
    const { history, shell, text } = getState();

    dispatch(close());
    shell.execute(text).then(() => {
      history.add(text);
    });
  }
};

export const CLOSE = 'CLOSE';
export function close() {
  return (dispatch, getState) => {
    const { destroy } = getState();
    dispatch({ type: CLOSE });
    destroy();
  };
};

export const SET_COMPLETION = 'SET_COMPLETION';
export function setCompletion(candidates) {
  return { type: SET_COMPLETION, candidates };
};

export function invokeCompletion() {
  return (dispatch, getState) => {
    const { history, shell, text } = getState();

    Promise.resolve(shell.search(text)).then((candidates) => {
      dispatch(setCompletion(candidates));
    });
  };
};

export const MOVE_HISTORY = 'MOVE_HISTORY';
export function moveHistory(offset) {
  return { type: MOVE_HISTORY, offset };
};

export const MOVE_COMPLETION = 'MOVE_COMPLETION';
export function moveCompletion(offset) {
  return { type: MOVE_COMPLETION, offset };
};

export const UPDATE_TEXT = 'UPDATE_TEXT';
export function updateText(text) {
  return { type: UPDATE_TEXT, text };
};
