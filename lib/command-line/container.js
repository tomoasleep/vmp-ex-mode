// @flow

import { connect } from 'preact-redux';
import Component from './component';
import type { Props } from './component';
import type { State } from '../types';

import { confirm, close, moveHistory, moveCompletion, updateText } from '../actions';

const mapStateToProps = (state: State, ownProps) => {
  const completion = state.completion || {};
  return {
    text: state.text,
    editorId: state.editorId,
    shell: state.shell,
    completionCandidates: completion.candidates,
    completionIndex: completion.index,
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onConfirm: () => dispatch(confirm()),
    onCancel: () => dispatch(close()),
    onMoveUp: () => dispatch(moveHistory(1)),
    onMoveDown: () => dispatch(moveHistory(-1)),
    onCompleteNext: () => dispatch(moveCompletion(1)),
    onCompletePrev: () => dispatch(moveCompletion(-1)),
    onDidChangeText: (text) => dispatch(updateText(text)),
  };
};

const CmdlineContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
export default CmdlineContainer;
