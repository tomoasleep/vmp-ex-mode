'use babel';
import { h, render } from 'preact';
import { Provider } from 'preact-redux';
import CommandLine from './command-line/container';
import buildStore from './store';

export default class PanelViewModel {
  static renderInstance(instance) {
    const element = instance.render();
    setTimeout(() => { element.querySelector('atom-text-editor').focus(); }, 0);
    return element;
  }

  constructor({ history, shell }) {
    this.history = history;
    this.shell = shell;
  }

  attach() {
    if (this.panel) { return; }

    this.panel = atom.workspace.addBottomPanel({ item: this });
  }

  destroy = () => {
    if (!this.panel) { return; }

    this.panel.destroy();
    const activeEditor = atom.workspace.getActiveTextEditor();
    if (activeEditor) {
      atom.views.getView(activeEditor).focus();
    }
  }

  createStore() {
    return buildStore(this.shell, this.history, this.destroy);
  }

  render() {
    const rootElement = document.createElement('div');

    render(
      h(Provider, { store: this.createStore() },
        h(CommandLine)
      ),
      rootElement
    );
    return rootElement;
  }
}
