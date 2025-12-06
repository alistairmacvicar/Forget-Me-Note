import { markdown } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { Compartment } from '@codemirror/state';
import { drawSelection, EditorView } from '@codemirror/view';
import { GFM } from '@lezer/markdown';
import {
  prosemarkBaseThemeSetup,
  prosemarkBasicSetup,
  prosemarkMarkdownSyntaxExtensions,
} from '@prosemark/core';
import { vim } from '@replit/codemirror-vim';
import { useNoteStore } from '~~/stores/note';
import { useUserStore } from '~~/stores/user';

export const onCreateEditor = (editorDiv: HTMLElement | undefined) => {
  const noteStore = useNoteStore();
  const userStore = useUserStore();
  const preferences = userStore.preferences.plugins;
  const vimCompartment = new Compartment();
  const lineNumberCompartment = new Compartment();
  const spellCheckCompartment = new Compartment();

  const editor = new EditorView({
    doc: noteStore.note.body,
    parent: editorDiv,
    extensions: [
      EditorView.contentAttributes.of({ spellcheck: 'true' }),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          noteStore.note.body = update.state.doc.toString();
        }
      }),
      spellCheckCompartment.of(
        EditorView.contentAttributes.of({
          spellcheck: preferences.spellcheck.toString(),
        }),
      ),
      vimCompartment.of(preferences.vim ? vim() : []),
      lineNumberCompartment.of(
        preferences.lineNumbers.enabled
          ? lineNumbersRelative(preferences.lineNumbers.relative)
          : [],
      ),
      drawSelection(),
      markdown({
        codeLanguages: languages,
        extensions: [GFM, prosemarkMarkdownSyntaxExtensions],
      }),
      prosemarkBasicSetup(),
      prosemarkBaseThemeSetup(),
    ],
  });

  watch(userStore.preferences, () => {
    const preferences = userStore.preferences.plugins;
    editor.dispatch({
      effects: [
        vimCompartment.reconfigure(preferences.vim ? vim() : []),
        lineNumberCompartment.reconfigure(
          preferences.lineNumbers.enabled
            ? lineNumbersRelative(preferences.lineNumbers.relative)
            : [],
        ),
        spellCheckCompartment.reconfigure(
          EditorView.contentAttributes.of({
            spellcheck: preferences.spellcheck.toString(),
          }),
        ),
      ],
    });
  });

  return editor;
};
