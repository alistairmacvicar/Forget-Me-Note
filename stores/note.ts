import type { Note } from '~~/shared/types/note';
import { defineStore } from 'pinia';

export const useNoteStore = defineStore('note', {
  state: (): Note => ({
    id: '',
    title: null,
    body: '# ',
    embeddings: [],
    saveStatus: null,
    syncStatus: null,
    deleteStatus: null,
  }),
  getters: {
    getNote: (state) => state,
  },
  actions: {
    updateSaveStatus(status: SaveStatus) {
      this.saveStatus = status;
    },
    updateSyncStatus(status: SyncStatus) {
      this.syncStatus = status;
    },
    updateDeleteStatus(status: DeleteStatus) {
      this.deleteStatus = status;
    },
    updateTitle(title: string) {
      this.title = title;
    },
    updateBody(body: string) {
      this.body = body;
    },
    updateID(id: string) {
      this.id = id;
    },
  },
});
