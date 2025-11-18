import type { Note } from './note';

export interface EditorAction {
  (e: 'download', note?: Note): void;
  (e: 'update', note: Note): void;
  (e: 'save', note: Note): void;
}
