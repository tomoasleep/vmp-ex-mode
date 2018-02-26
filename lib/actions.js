// @flow
import type { State } from './types';
import typeof Candidate from './engine/candidate';

export const CLOSE = 'CLOSE';
export type CloseAction = { type: 'CLOSE' };

export const SET_COMPLETION = 'SET_COMPLETION';
export type SetCompletionAction = { type: 'SET_COMPLETION', candidates: Array<Candidate> };

export const MOVE_HISTORY = 'MOVE_HISTORY';
export type MoveHistoryAction = { type: 'MOVE_HISTORY', offset: number };

export const MOVE_COMPLETION = 'MOVE_COMPLETION';
export type MoveCompletionAction = { type: 'MOVE_COMPLETION', offset: number };

export const UPDATE_TEXT = 'UPDATE_TEXT';
export type UpdateTextAction = { type: 'UPDATE_TEXT', text: string };

export type Action = CloseAction | SetCompletionAction | MoveHistoryAction | MoveCompletionAction | UpdateTextAction;
type Dispatch = (action: Action | ThunkAction | PromiseAction) => any;
type GetState = () => State;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type PromiseAction = Promise<Action>;

export function confirm(): ThunkAction {
  return (dispatch, getState) => {
    const { history, shell, text } = getState();

    dispatch(close());
    shell.execute(text).then(() => {
      history.add(text);
    });
  }
};

export function close(): ThunkAction {
  return (dispatch, getState) => {
    const { destroy } = getState();
    dispatch({ type: CLOSE });
    destroy();
  };
};

export function setCompletion(candidates: Array<Candidate>): SetCompletionAction {
  return { type: SET_COMPLETION, candidates };
};

export function invokeCompletion(): ThunkAction {
  return (dispatch, getState) => {
    const { history, shell, text } = getState();

    Promise.resolve(shell.search(text)).then((candidates) => {
      dispatch(setCompletion(candidates));
    });
  };
};

export function moveHistory(offset: number): MoveHistoryAction {
  return { type: MOVE_HISTORY, offset };
};

export function moveCompletion(offset: number): MoveCompletionAction {
  return { type: MOVE_COMPLETION, offset };
};

export function updateText(text: string): UpdateTextAction {
  return { type: UPDATE_TEXT, text };
};
