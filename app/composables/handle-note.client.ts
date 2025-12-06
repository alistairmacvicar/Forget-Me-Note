import type { DeleteStatus, Note, SaveStatus } from '~~/shared/types/note';
import { db } from '~~/plugins/db.client';
import { embedText } from './embed-text.client';

export const onDeleteNote = async (notes: Note[]): Promise<DeleteStatus> => {
  if (!notes[0]) return 'failed';

  if (notes.length > 1) {
    return await db.notes
      .bulkDelete(notes.map((document) => document.id))
      .catch(() => 'failed')
      .then(() => 'deleted');
  }

  return await db.notes
    .delete(notes[0].id)
    .catch(() => 'failed')
    .then(() => 'deleted');
};

export const onBulkSaveNotes = async (notes: Note[]): Promise<SaveStatus> => {
  if (!notes[0]) return 'failed';

  for (const note of notes) {
    let saved;
    const title = note.title;
    const body = note.body;
    const exists = !!note.id;

    if (exists) {
      const directoryId = note.directoryId;
      const embeddings = note.body
        ? await embedText(note.body).catch(async () => {
            console.error(
              'Failed to embed text, retaining previous embeddings',
            );
            return note.embeddings || [];
          })
        : note.embeddings || [];

      await db.notes
        .update(note.id, {
          title,
          body,
          embeddings,
          directory: directoryId,
        })
        .catch(() => (saved = false))
        .then(() => (saved = true));
    } else {
      const directoryId = await onGetRootDirectory();
      const embeddings = await embedText(note.body || '').catch(() => {
        console.error('Failed to embed text');
        return [];
      });

      await db.notes
        .add({ title, body, embeddings, directoryId })
        .catch(() => (saved = false))
        .then(() => (saved = true));
    }

    if (!saved) return 'failed';
  }

  return 'saved';
};

export const onSaveNote = async (
  note: Note,
): Promise<{
  id: string | null;
  directoryId: string | null;
  saveStatus: SaveStatus;
}> => {
  let id: string | null = null;
  let saveStatus: SaveStatus = 'saved';
  let directoryId: string | null = null;

  if (!note) return { id, directoryId, saveStatus };

  const title = note.title;
  const body = note.body;
  const exists = !!note.id;

  if (exists) {
    const embeddings = note.body
      ? await embedText(note.body).catch(() => {
          console.error('Failed to embed text, retaining previous embeddings');
          return note.embeddings || [];
        })
      : note.embeddings || [];

    directoryId = note.directoryId;
    id = note.id;

    await db.notes
      .update(note.id, {
        title,
        body,
        embeddings,
        directoryId,
      })
      .catch(() => (saveStatus = 'failed'));
  } else {
    const embeddings = await embedText(note.body || '').catch(() => {
      console.error('Failed to embed text');
      return [];
    });

    directoryId = await onGetRootDirectory();
    id = await db.notes
      .add({ title, body, embeddings, directoryId })
      .catch(() => (saveStatus = 'failed'));
  }

  return { id, directoryId, saveStatus };
};

export const onDownloadNote = (note: Note) => {
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

export const onGetNote = async (id: string) => {
  const note = await db.notes.get(id);

  return note;
};
