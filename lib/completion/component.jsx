// @flow
// @jsx h

import { h, Component } from 'preact';
import { Emitter, TextEditor } from 'atom';
import typeof Candidate from '../engine/candidate';

function CandidateComponent({ candidate, isSelected }) {
  return (
    <li className={`vmp-ex-mode-candidate ${isSelected ? 'selected' : ''}`}>
      <span className='vmp-ex-mode-candidate-command-name'>
        {candidate.name}
      </span>
      <span className='vmp-ex-mode-candidate-command-description'>
        {candidate.description}
      </span>
    </li>
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

type Props = {
  candidates: Array<Candidate>,
  index: number,
};

function completionComponent(props: Props): Element {
  const { candidates, index } = props;
  const indexInChunk = index != null && index % chunkSize;
  const { chunk, chunkStart, chunkEnd } = getChunkCandidatesNearSelection(candidates, index);
  return (
    <ul className='vmp-ex-mode-completion' ref={(el) => { this.el = el }}>
      {
        chunk.map((candidate, arrayIndex) => {
          return (<CandidateComponent candidate={candidate} isSelected={arrayIndex === indexInChunk} />);
        })
      }
    </ul>
  );
}

export default completionComponent;
