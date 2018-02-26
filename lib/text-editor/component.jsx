// @flow
// @jsx h
import { CompositeDisposable, TextEditor } from 'atom';
import { h, Component } from 'preact';

export default class TextEditorComponent extends Component {
  constructor(props, context) {
    super(props, context);
    this._editor = {};
  }

  render() {
    return (
      <div className="editor-container" ref={(el) => { this.ref = el; }} dangerouslySetInnerHTML={{__html: ''}}/>
    );
  }

  componentDidMount() {
    this.mountTextEditor();
  }

  componentDidUpdate() {
    this.unmountTextEditor();
    this.mountTextEditor();
  }

  componentWillUnmount() {
    this.unmountTextEditor();
  }

  componentWillReceiveProps({ text }) {
    if (this._editor.model) {
      const editorText = this._editor.model.getText();
      if (editorText != text) {
        this._editor.model.setText(text);
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.id !== nextProps.id;
  }

  mountTextEditor() {
    this._editor.model = new TextEditor({ mini: true });
    this._editor.el = atom.views.getView(this._editor.model);
    this.ref.appendChild(this._editor.el);

    this._editor.subscriptions = new CompositeDisposable();
    this._editor.subscriptions.add(this._editor.model.onDidChange(() => this.props.onDidChangeText(this._editor.model.getText())));

    for (const name in (this.props.events || {})) {
      this._editor.subscriptions.add(atom.commands.add(this._editor.el, name, (...args) => this.props.events[name](...args)));
    }
  }

  unmountTextEditor() {
    if (this._editor.subscriptions) {
      this._editor.subscriptions.dispose();
    }
    if (this._editor.model) {
      this._editor.model.destroy();
    }
    this._editor = {};
  }
}
