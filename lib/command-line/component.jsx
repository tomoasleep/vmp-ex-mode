// @flow
// @jsx h

import { h } from 'preact';
import type { Component } from 'preact';
import type { Candidate } from '../engine/candidate';
import Completion from '../completion/component';
import TextEditor from '../text-editor/component';

export type Props = {
  text: string,
  editorId: string,
  completionCandidates: Array<Candidate>,
  completionIndex: number,
  onDidChangeText: () => void,
  onConfirm: () => void,
  onCancel: () => void,
  onMoveUp: () => void,
  onMoveDown: () => void,
  onCompleteNext: () => void,
  onCompletePrev: () => void,
}

function CmdlineComponent(props: Props): Component {
  const { text, editorId, onDidChangeText, completionCandidates, completionIndex, onConfirm, onCancel, onMoveUp, onMoveDown, onCompleteNext, onCompletePrev } = props;
  return (
    <div className='vmp-ex-mode-command-line command-mode-input cmdline-input'>
      {
        completionCandidates && <Completion candidates={completionCandidates} index={completionIndex}/>
      }
      <div className='cmd-line-status-bar'>
        <span className='hoge'>Cmdline</span>
      </div>
      <TextEditor
        id={editorId} key='editor' text={text}
        events={{
          'core:move-up': onMoveUp,
          'core:move-down': onMoveDown,
          'core:confirm': onConfirm,
          'core:cancel': onCancel,
          'vmp-ex-mode:complete-next': onCompleteNext,
          'vmp-ex-mode:complete-prev': onCompletePrev,
        }}
      />
    </div>
  );
}

export default CmdlineComponent;
