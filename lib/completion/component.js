'use babel';
import { h, Component } from 'preact';
import { Emitter, TextEditor } from 'atom';

function CandidateComponent({ candidate, isSelected }) {
  return (
    h('li', { className: `vmp-ex-mode-candidate ${isSelected ? 'selected' : ''}` },
      h('span', { className: 'vmp-ex-mode-candidate-command-name' }, candidate.name),
      h('span', { className: 'vmp-ex-mode-candidate-command-description' }, candidate.description),
    )
  );
}

function completionComponent({ candidates, index }) {
  return (
    h('ul', { ref: (el) => { this.el = el }, className: 'vmp-ex-mode-completion' },
      candidates.map((candidate, arrayIndex) => {
        return h(CandidateComponent, { candidate, isSelected: (index === arrayIndex) });
      })
    )
  );
}

export default completionComponent;
