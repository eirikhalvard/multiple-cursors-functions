'use babel';

import { TextEditor } from 'atom';

export default class InsertNumbersView {
  constructor(subscriptions) {
    this.miniEditor = new TextEditor({ mini: true });
    this.miniEditor.element.addEventListener('blur', this.close.bind(this));

    this.message = document.createElement('div');
    this.message.classList.add('message');

    this.element = document.createElement('div');
    this.element.classList.add('go-to-line');
    this.element.appendChild(this.miniEditor.element);
    this.element.appendChild(this.message);

    this.panel = atom.workspace.addModalPanel({
      item: this,
      visible: false,
    });
    subscriptions.add(
      atom.commands.add(
        'atom-text-editor',
        'multiple-cursors-functions:insert-text',
        () => {
          this.toggle();
          return false;
        },
      ),
    );
    subscriptions.add(
      atom.commands.add(this.miniEditor.element, 'core:confirm', () => {
        this.insert();
      }),
    );
    subscriptions.add(
      atom.commands.add(this.miniEditor.element, 'core:cancel', () => {
        this.close();
      }),
    );
    this.miniEditor.onWillInsertText(arg => {
      if (arg.text.match(/[^0-9a-zA-Z:\-]/)) {
        arg.cancel();
      }
    });
  }

  toggle() {
    this.panel.isVisible() ? this.close() : this.open();
  }

  close() {
    if (!this.panel.isVisible()) return;
    this.miniEditor.setText('');
    this.panel.hide();
    if (this.miniEditor.element.hasFocus()) {
      this.restoreFocus();
    }
  }

  insert() {
    let insertedText = this.miniEditor.getText();
    const editor = atom.workspace.getActiveTextEditor();
    this.close();
    if (!editor) return;
    if (!insertedText.length) {
      insertedText = '0:1';
    }

    const startValue = insertedText.split(/:+/)[0] || '0';
    const incrementValue = insertedText.split(/:+/)[1] || '1';

    if (isNaN(incrementValue)) return;
    const incrementNumber = Number(incrementValue);

    if (!isNaN(startValue)) {
      const startNumber = Number(startValue);
      const selections = editor.getSelections();
      editor.transact(() => {
        selections.forEach((selection, index) => {
          const number = startNumber + index * incrementNumber;
          selection.insertText(number.toString());
        });
      });

    } else if (startValue.match(/^[a-zA-Z]$/)) {
      // letters are wrapped around from z to a, from Z to A, etc
      const mod = (x, n) => (x % n + n) % n // in js, -1 % 5 === -1 and not 4 like we want
      const numberOfChars = 26;
      const shiftIndex = (startValue === startValue.toLowerCase() ? 'a' : 'A').charCodeAt(0);
      const relativeStartCode = startValue.charCodeAt(0) - shiftIndex;
      const selections = editor.getSelections();
      editor.transact(() => {
        selections.forEach((selection, index) => {
          const relativeCode = relativeStartCode + index * incrementNumber;
          const letter = String.fromCharCode(shiftIndex + mod(relativeCode, numberOfChars));
          selection.insertText(letter);
        });
      });
    }
  }

  storeFocusedElement() {
    this.previouslyFocusedElement = document.activeElement;
    return this.previouslyFocusedElement;
  }

  restoreFocus() {
    if (
      this.previouslyFocusedElement &&
      this.previouslyFocusedElement.parentElement
    ) {
      return this.previouslyFocusedElement.focus();
    }
    atom.views.getView(atom.workspace).focus();
  }

  open() {
    if (this.panel.isVisible() || !atom.workspace.getActiveTextEditor()) return;
    this.storeFocusedElement();
    this.panel.show();
    this.message.textContent =
      'Enter a <start> or <start>:<inc> to insert numbers or letters. Examples: "b" -> b, c, d.,. or "1:3" -> 1, 4, 7...';
    this.miniEditor.element.focus();
  }
}
