'use babel';
import { h, Component } from 'preact';
import { Emitter, TextEditor, CompositeDisposable } from 'atom';
// import CompletionComponent from './completion-component';

export default class CmdlineComponent extends Component {
  constructor(...args) {
    super(...args);
    this.emitter = new Emitter();
    this.state = this.props.model.getState();
    this.props.model.onUpdateState(() => {
      this.setState(this.props.model.getState());
    });
  }

  render({ model }, { completions, completionIndex }) {
    return (
      h('div', { className: 'command-mode-input cmdline-input' },
        /* h(CompletionComponent, { candidates: completions, index: completionIndex }), */
        h('div', { className: 'cmd-line-status-bar' },
          h('span', {}, 'Cmdline')
        ),
        h('div', { className: 'editor-container', ref: (el) => { this.ref = el; }, dangerouslySetInnerHTML: { __html: '' } })
      )
    );
  }

  componentDidMount() {
    const { model } = this.props;
    this.editor = new TextEditor({mini: true, buffer: model.getBuffer() });
    this.editorEl = atom.views.getView(this.editor);
    this.ref.appendChild(this.editorEl);

    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(this.editor.onDidStopChanging(() => model.setText(this.editor.getText())));
    this.subscriptions.add(
      atom.commands.add(this.editorEl, 'core:confirm', () => {
        model.setText(this.editor.getText());
        model.invokeCommand().then(() => model.destroy()).catch((error) => {
          atom.notifications.addError(`${error.name}: ${error.message}`);
          model.destroy();
        });
      })
    );
    this.subscriptions.add(atom.commands.add(this.editorEl, 'core:cancel', () => model.destroy()));
    this.subscriptions.add(atom.commands.add(this.editorEl, 'core:move-up', () => this.moveHistory(-1)));
    this.subscriptions.add(atom.commands.add(this.editorEl, 'core:move-down', () => this.moveHistory(1)));

    this.subscriptions.add(atom.commands.add(this.editorEl, 'vmp-ex-mode:complete-next', () => this.moveCompletion(1)));
    this.subscriptions.add(atom.commands.add(this.editorEl, 'vmp-ex-mode:complete-prev', () => this.moveCompletion(-1)));

    setTimeout(() => this.editorEl.focus(), 0);
  }

  componendDidUnmount() {
    this.subscriptions.dispose();
  }
}
