'use babel';
import { h, Component } from 'preact';
import { Emitter, TextEditor } from 'atom';

export default class CmdlineComponent extends Component {
  constructor(...args) {
    super(...args);
    this.emitter = new Emitter();
  }

  render() {
    return (
      h('div', { className: 'command-mode-input cmdline-input' },
        h('div', { className: 'cmd-line-status-bar' },
          h('span', {}, 'Cmdline')
        ),
        h('div', { className: 'editor-container', ref: (el) => { this.ref = el; }, dangerouslySetInnerHTML: { __html: '' } })
      )
    );
  }

  componentDidMount() {
    const { model } = this.props;
    this.editor = new TextEditor({mini: true});
    this.editorEl = atom.views.getView(this.editor);
    this.ref.appendChild(this.editorEl);

    this.editor.onDidStopChanging(() => model.setText(this.editor.getText()));
    atom.commands.add(this.editorEl, 'core:confirm', () => {
      model.setText(this.editor.getText());
      model.invokeCommand().then(() => model.destroy()).catch((error) => {
        atom.notifications.addError(`${error.name}: ${error.message}`);
        model.destroy();
      });
    });
    atom.commands.add(this.editorEl, 'core:cancel', () => model.destroy());
    atom.commands.add(this.editorEl, 'core:move-up', () => model.decreaseHistory());
    atom.commands.add(this.editorEl, 'core:move-down', () => model.increaseHistory());

    model.onUpdateText(({ text }) => {
      const editorText = this.editor.getText();
      if (text !== editorText) {
        this.editor.setText(text);
      }
    });

    setTimeout(() => this.editorEl.focus(), 0);
  }
}
