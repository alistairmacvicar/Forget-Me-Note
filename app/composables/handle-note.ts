import type { DeleteStatus, SaveStatus } from '~~/shared/types/document-status';
import type { Embedding, Note } from '~~/shared/types/note';
import { db } from '~~/plugins/db.client';
import { embedText } from './embed-text.client';

export const onDelete = async (notes: Note[]): Promise<DeleteStatus> => {
  if (!notes[0]) return 'failed';

  if (notes.length > 1) {
    return await db.notes
      .bulkDelete(notes.map((document) => document.id))
      .catch(() => 'failed')
      .then(() => 'success');
  }

  return await db.notes
    .delete(notes[0].id)
    .catch(() => 'failed')
    .then(() => 'success');
};

export const onCreation = async (notes: Note[]): Promise<SaveStatus> => {
  if (!notes[0]) return 'failed';

  for (const document of notes) {
    const title = document.title;
    const body = document.body;
    let success = true;

    const embeddings: Embedding = await embedText(body).catch(() => {
      console.error('Failed to embed text');
      return [];
    });

    await db.notes
      .add({ title, body, embeddings })
      .catch(() => (success = false))
      .then(() => (success = true));

    if (!success) return 'failed';
  }

  return 'success';
};

export const onSave = async (notes: Note[]): Promise<SaveStatus> => {
  if (!notes[0]) return 'failed';

  for (const note of notes) {
    let success = true;
    const title = note.title;
    const body = note.body;
    const exists = !!note.id;
    const embeddings = await embedText(note.body).catch(() => {
      console.error('Failed to embed text, retaining previous embeddings');
      return note.embeddings || [];
    });

    if (exists) {
      await db.notes
        .update(note.id, {
          title: note.title,
          body: note.body,
          embeddings,
        })
        .catch(() => 'failed')
        .then(() => 'success');
    } else {
      await db.notes
        .add({ title, body, embeddings })
        .catch(() => (success = false))
        .then(() => (success = true));
    }

    if (!success) return 'failed';
  }

  return 'success';
};

export const onDownload = (note: Note) => {
  const fileContent = note.body || '';
  const blob = new Blob([fileContent], { type: 'file' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${note.title || 'note'}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
