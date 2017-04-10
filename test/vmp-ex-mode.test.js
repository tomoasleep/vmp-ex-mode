'use babel';
import { TextEditor } from 'atom';
import { expect } from 'chai';
import VmpExMode from '../lib/vmp-ex-mode';
import CmdlineViewModel from '../lib/cmdline-view-model';

describe('vmp-ex-mode', () => {
  it('can be activated', () => {
    VmpExMode.activate();
  });

  context('when vmp-ex-mode is opened', () => {
    beforeEach(() => {
      return atom.packages.activatePackage('vmp-ex-mode');
    });

    it('can open a command line view', () => {
      const editor = new TextEditor();
      VmpExMode.openCommandline(editor);
      const panels = atom.workspace.getBottomPanels();

      expect(panels).to.satisfy((panels) => {
        return panels.some((element) => {
          return element.getItem() instanceof CmdlineViewModel;
        });
      });
    });

    context('when a command line view is opened', () => {
      let editor, commandlineEditor, commandlineEditorEl;

      beforeEach(() => {
        atom.workspace.open();
        editor = atom.workspace.getActiveTextEditor();
        const panel = VmpExMode.openCommandline(editor);
        const panelEl = atom.views.getView(panel);
        commandlineEditorEl = panelEl.querySelector('.command-mode-input .editor-container atom-text-editor');
        if (commandlineEditorEl) {
          commandlineEditor = commandlineEditorEl.getModel();
        }
      });

      it('the command line is editable', () => {
        expect(commandlineEditorEl).to.exist;
      });

      it('can invoke "q" command', () => {
        commandlineEditor.setText('q');
        atom.commands.dispatch(commandlineEditor, 'core:confirm')
        expect(atom.workspace.paneForItem(editor)).to.not.exist;
      });
    });
  });
});
