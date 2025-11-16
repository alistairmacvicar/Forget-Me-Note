import type { EditorState } from '@codemirror/state';
import { Compartment } from '@codemirror/state';
import { EditorView, lineNumbers } from '@codemirror/view';

const gutter = new Compartment();

function relativeLineNumbers(lineNo: number, state: EditorState) {
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
}

export function lineNumbersRelative() {
  const showLineNumbers = gutter.of(
    lineNumbers({ formatNumber: relativeLineNumbers }),
  );

  const lineNumberUpdateListener = EditorView.updateListener.of(
    (viewUpdate) => {
      if (viewUpdate.selectionSet) {
        viewUpdate.view.dispatch({
          effects: gutter.reconfigure(
            lineNumbers({ formatNumber: relativeLineNumbers }),
          ),
        });
      }
    },
  );
  return [showLineNumbers, lineNumberUpdateListener];
}
