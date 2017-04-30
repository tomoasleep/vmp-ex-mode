'use babel';
import { expect } from 'chai';
import { TextEditor } from 'atom';
import VmpExMode from '..';
import CmdlineViewModel from '../lib/cmdline-view-model';

describe('CmdlineViewModel', () => {
  let model, editor, exShell, commandHistory;
  beforeEach('setupModel', () => {
    editor = new TextEditor();
    exShell = VmpExMode.getCommandRegistory().createExShell({ editor });
    commandHistory = VmpExMode.getCommandHistory();
    model = new CmdlineViewModel({
      history: commandHistory, exShell
    });
  });

  describe('#getText', () => {
    context('when the model is initialized', () => {
      it('is empty', () => {
        expect(model.getText()).to.eql('');
      });
    });

    context('when the text is updated', () => {
      const text = 'hoge';
      beforeEach(() => {
        model.setText(text);
      });

      it('is the same text', () => {
        expect(model.getText()).to.eql(text);
      });
    });
  });

  describe('#invokeCommand', () => {
    context('when an command is defined for the editor', () => {
      let editorEl, called;
      const commandName = 'hogehogehoge';

      beforeEach(() => {
        editorEl = atom.views.getView(editor);
        atom.commands.add(editorEl, commandName, () => { called = true; });
      });

      it('can invoke the command', () => {
        model.setText(`command ${commandName}`);
        return model.invokeCommand().then(() => {
          expect(called).to.be.true;
        });
      });
    });
  });
});
