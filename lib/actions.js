'use babel';

const actions = {
  confirm() {
    return (dispatch, getState) => {
      const { history, shell, text } = getState();

      dispatch(this.close());
      shell.execute(text).then(() => {
        history.add(text);
      });
    }
  },

  CLOSE: 'CLOSE',
  close() {
    return (dispatch, getState) => {
      const { destroy } = getState();
      dispatch({ type: this.CLOSE });
      destroy();
    };
  },

  SET_COMPLETION: 'SET_COMPLETION',
  setCompletion(candidates) {
    return { type: this.SET_COMPLETION, candidates };
  },

  invokeCompletion() {
    return (dispatch, getState) => {
      const { history, shell, text } = getState();

      Promise.resolve(shell.search(text)).then((candidates) => {
        dispatch(this.setCompletion(candidates));
      });
    };
  },

  MOVE_HISTORY: 'MOVE_HISTORY',
  moveHistory(offset) {
    return { type: this.MOVE_HISTORY, offset };
  },

  MOVE_COMPLETION: 'MOVE_COMPLETION',
  moveCompletion(offset) {
    return { type: this.MOVE_COMPLETION, offset };
  },

  UPDATE_TEXT: 'UPDATE_TEXT',
  updateText(text) {
    return { type: this.UPDATE_TEXT, text };
  }
}

for (const name in actions) {
  if (actions[name] instanceof Function) {
    actions[name] = actions[name].bind(actions);
  }
}

export default actions;
