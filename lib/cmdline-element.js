'use babel';
import { h, render } from 'preact';
import CmdlineComponent from './cmdline-component';

export default class CmdlineElement extends HTMLElement {
  initialize(model) {
    if (this.model) {
      throw new Error('Model is already initialized');
    }
    if (model.isDestroyed()) {
      return;
    }

    this.model = model;
    this.initializeContent();
  }

  disconnectedCallback(...args) {
    super.disconnectedCallback(...args);
    if (this.model) {
      this.model.destroy();
    }
  }

  initializeContent() {
    this.rootElement = document.createElement('div');
    render(h(CmdlineComponent, { model: this.model }), this.rootElement);

    this.appendChild(this.rootElement);
  }
}
