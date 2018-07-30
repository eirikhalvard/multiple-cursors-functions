'use babel';

import { CompositeDisposable, Point, TextEditor } from 'atom';
import InsertNumbersView from './insert-numbers-view';

export default {
  subscriptions: null,

  activate() {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'multiple-cursors-functions:reverse-selections': () =>
          reverseSelections(),
        'multiple-cursors-functions:insert-numbers-simple': () =>
          insertNumbersSimple(),
        'multiple-cursors-functions:insert-letters': () => insertLetters(),
      }),
    );

    new InsertNumbersView(this.subscriptions);
  },

  deactive() {
    this.subscriptions.dispose();
  },
};

function reverseSelections() {
  const editor = atom.workspace.getActiveTextEditor();
  if (!editor) return;

  const selections = editor.getSelections();
  selections.forEach(s => {
    if (s.isEmpty()) s.selectWord();
  });
  const reversedTexts = selections.map(s => s.getText()).reverse();

  editor.transact(() => {
    selections.forEach((selection, index) => {
      selection.insertText(reversedTexts[index]);
    });
  });
}

function insertNumbersSimple() {
  const editor = atom.workspace.getActiveTextEditor();
  if (!editor) return;

  const selections = editor.getSelections();

  editor.transact(() => {
    selections.forEach((selection, index) => {
      selection.insertText(index.toString());
    });
  });
}

function insertLetters() {
  const editor = atom.workspace.getActiveTextEditor();
  if (!editor) return;

  const selections = editor.getSelections();

  const startNumber = 97;
  const numberOfChars = 26;
  editor.transact(() => {
    selections.forEach((selection, index) => {
      const charCode = startNumber + (index % numberOfChars);
      const letter = String.fromCharCode(charCode);
      selection.insertText(letter);
    });
  });
}
