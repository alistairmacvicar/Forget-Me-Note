import type { Note } from '~~/shared/types/note';
import { defineStore } from 'pinia';

export const useNoteStore = defineStore('note', {
  state: () => ({
    note: {
      id: '',
      title: null,
      body: '# ',
      embeddings: [],
      saveStatus: null,
      syncStatus: null,
      deleteStatus: null,
      directoryId: null,
    } as Note,
  }),
  getters: {
    getNote: (state) => state.note,
  },
});
