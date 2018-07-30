'use babel';

import MultipleCursorsFunctionsView from './multiple-cursors-functions-view';
import { CompositeDisposable } from 'atom';

export default {

  multipleCursorsFunctionsView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.multipleCursorsFunctionsView = new MultipleCursorsFunctionsView(state.multipleCursorsFunctionsViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.multipleCursorsFunctionsView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'multiple-cursors-functions:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.multipleCursorsFunctionsView.destroy();
  },

  serialize() {
    return {
      multipleCursorsFunctionsViewState: this.multipleCursorsFunctionsView.serialize()
    };
  },

  toggle() {
    console.log('MultipleCursorsFunctions was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
