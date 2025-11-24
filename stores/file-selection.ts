import type { TreeItem } from '@nuxt/ui';
import { defineStore } from 'pinia';

export const useFileSelectionStore = defineStore('fileSelection', {
  state: () => ({
    items: [] as TreeItem[],
  }),
  getters: {
    getSelection: (state) => state.items,
  },
});
