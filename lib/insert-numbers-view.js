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
        'multiple-cursors-functions:insert-numbers',
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
      if (arg.text.match(/[^0-9:\-]/)) {
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
    if (isNaN(startValue) || isNaN(incrementValue)) return;
    const startNumber = Number(startValue);
    const incrementNumber = Number(incrementValue);

    const selections = editor.getSelections();

    editor.transact(() => {
      selections.forEach((selection, index) => {
        const number = startNumber + index * incrementNumber;
        selection.insertText(number.toString());
      });
    });
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
      'Enter a <start> or <start>:<increment> to insert numbers. Examples: "3" -> 3, 4, 5.,. or "1:3" -> 1, 4, 7...';
    this.miniEditor.element.focus();
  }
}
