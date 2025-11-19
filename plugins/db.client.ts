import type { DexieCloudTable } from 'dexie-cloud-addon';
import type { Note } from '~~/shared/types/note';
import { Dexie } from 'dexie';
import dexieCloud from 'dexie-cloud-addon';

export const db = new Dexie('notes', { addons: [dexieCloud] }) as Dexie & {
  notes: DexieCloudTable<Note, 'id'>;
};

db.cloud.configure({
  databaseUrl: 'https://zj6dbj1qd.dexie.cloud',
});

db.version(1).stores({
  notes: `@id`,
});
