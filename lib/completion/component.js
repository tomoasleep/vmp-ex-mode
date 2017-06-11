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

const chunkSize = 15

function getChunkCandidatesNearSelection(candidates, index = 0) {
  const chunkStart = Math.floor(index / chunkSize) * chunkSize;
  const chunkEnd = Math.min((Math.floor(index / chunkSize) + 1) * chunkSize, candidates.length);
  return {
    chunkStart,
    chunkEnd,
    chunk: candidates.slice(chunkStart, chunkEnd),
  };
}

function completionComponent({ candidates, index }) {
  const indexInChunk = index != null && index % chunkSize;
  const { chunk, chunkStart, chunkEnd } = getChunkCandidatesNearSelection(candidates, index);
  return (
    h('ul', { ref: (el) => { this.el = el }, className: 'vmp-ex-mode-completion' },
      chunk.map((candidate, arrayIndex) => {
        return h(CandidateComponent, { candidate, isSelected: (arrayIndex === indexInChunk) });
      })
    )
  );
}

export default completionComponent;
