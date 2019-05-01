"use babel";

import { CompositeDisposable, Point, TextEditor } from "atom";
import InsertTextView from "./insert-text-view";

export default {
  subscriptions: null,

  activate() {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(
      atom.commands.add("atom-workspace", {
        "multiple-cursors-functions:reverse-selections": () =>
          reverseSelections(),
        "multiple-cursors-functions:insert-numbers": () =>
          insertNumbers(),
        "multiple-cursors-functions:insert-letters": () =>
          insertLetters(),
        "multiple-cursors-functions:split-selections": () =>
          splitSelections(),
        "multiple-cursors-functions:selections-to-cursors": () =>
          selectionsToCursors()
      })
    );

    new InsertTextView(this.subscriptions);
  },

  deactive() {
    this.subscriptions.dispose();
  }
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

function insertNumbers() {
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

function splitSelections() {
  const editor = atom.workspace.getActiveTextEditor();
  if (!editor) return;
  const selections = editor.getSelections();
  selections.forEach(selection => {
    range = selection.getBufferRange();
    selection.clear();
    editor.addCursorAtBufferPosition(range.start);
    editor.addCursorAtBufferPosition(range.end);
  });
}

function selectionsToCursors() {
  const editor = atom.workspace.getActiveTextEditor();
  if (!editor) return;
  const selections = editor.getSelections();
  selections.forEach(selection => {
    range = selection.getBufferRange();
    selection.clear();
    if (range.start.row == range.end.row) {
      const increment = range.end.column > range.start.column ? 1 : -1;
      for (let i = range.start.column; i <= range.end.column; i += increment) {
        editor.addCursorAtBufferPosition({ row: range.start.row, column: i });
      }
    }
  });
}
