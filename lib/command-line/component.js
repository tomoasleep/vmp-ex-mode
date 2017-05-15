'use babel';
import { h } from 'preact';
import Completion from '../completion/component';
import TextEditor from '../text-editor/component';

function CmdlineComponent({ text, editorId, onDidChangeText, completionCandidates, completionIndex, onConfirm, onCancel, onMoveUp, onMoveDown, onCompleteNext, onCompletePrev }) {
  return (
    h('div', { className: 'vmp-ex-mode-command-line command-mode-input cmdline-input' },
      (completionCandidates ? h(Completion, { candidates: completionCandidates, index: completionIndex }) : null),
      h('div', { className: 'cmd-line-status-bar' },
        h('span', {}, 'Cmdline')
      ),
      h(TextEditor, {
        text, onDidChangeText,
        key: 'editor',
        id: editorId,
        events: {
          'core:move-up': onMoveUp,
          'core:move-down': onMoveDown,
          'core:confirm': onConfirm,
          'core:cancel': onCancel,
          'vmp-ex-mode:complete-next': onCompleteNext,
          'vmp-ex-mode:complete-prev': onCompletePrev,
        },
      })
    )
  );
}

export default CmdlineComponent;
