import { defineStore } from 'pinia';
// TODO: Make a type for this
// TODO: Get and save these values into dexie

export const useUserStore = defineStore('user', {
  state: () => ({
    preferences: {
      plugins: {
        vim: true,
        spellcheck: true,
        lineNumbers: {
          enabled: true,
          relative: true,
        },
      },
    },
  }),
  getters: {
    getUser: (state) => state,
    getPreferences: (state) => state.preferences,
  },
});
