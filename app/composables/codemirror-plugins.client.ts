import type { EditorState } from '@codemirror/state';
import { Compartment } from '@codemirror/state';
import { EditorView, lineNumbers } from '@codemirror/view';

const gutter = new Compartment();

const relativeLineNumbers = (lineNo: number, state: EditorState) => {
  if (lineNo > state.doc.lines) {
    return '0';
  }

  const cursorLine = state.doc.lineAt(
    state.selection.asSingle().ranges[0]!.to,
  ).number;

  if (lineNo === cursorLine) {
    return lineNo.toString();
  } else {
    return Math.abs(cursorLine - lineNo).toString();
  }
};

export const lineNumbersRelative = (relative: boolean) => {
  const showLineNumbers = gutter.of(
    relative
      ? lineNumbers({ formatNumber: relativeLineNumbers })
      : lineNumbers(),
  );

  const lineNumberUpdateListener = EditorView.updateListener.of(
    (viewUpdate) => {
      if (viewUpdate.selectionSet) {
        viewUpdate.view.dispatch({
          effects: gutter.reconfigure(
            relative
              ? lineNumbers({ formatNumber: relativeLineNumbers })
              : lineNumbers(),
          ),
        });
      }
    },
  );
  return [showLineNumbers, lineNumberUpdateListener];
};
