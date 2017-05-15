import { connect } from 'preact-redux';
import Component from './text-editor';
import { updateText } from '../actions';

const mapStateToProps = (state) => {
  return {
    text: state.text,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onDidChangeText: (text) => dispatch(updateText(text)),
  };
}

const TextEditorContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
export default TextEditorContainer;
