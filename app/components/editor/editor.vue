<script setup lang="ts">
  import type { TreeItem } from '@nuxt/ui';
  import { lineNumbersRelative } from '#imports';
  import { markdown } from '@codemirror/lang-markdown';
  import { languages } from '@codemirror/language-data';
  import { Compartment } from '@codemirror/state';
  import { drawSelection, EditorView } from '@codemirror/view';
  import { GFM } from '@lezer/markdown';
  import {
    prosemarkBaseThemeSetup,
    prosemarkBasicSetup,
    prosemarkMarkdownSyntaxExtensions,
  } from '@prosemark/core';
  import { vim } from '@replit/codemirror-vim';
  import { db } from '~~/plugins/db.client';
  import { useFileSelectionStore } from '~~/stores/file-selection';
  import { useNoteStore } from '~~/stores/note';
  import EditorChangeNote from './editor-change-note.vue';

  const editorRef = ref<HTMLElement | undefined>(undefined);
  const editor = ref<EditorView | null>(null);
  const isVimMode = ref(true);
  const vimCompartment = new Compartment();
  const lineNumberCompartment = new Compartment();
  const noteStore = useNoteStore();
  const fileSelectionStore = useFileSelectionStore();
  const saveTimer = ref<NodeJS.Timeout | null>(null);
  const setTitleModalOpen = ref(false);
  const changeNoteModalOpen = ref(false);
  const newNote = ref<TreeItem>();

  const toggleVim = () => {
    if (!editor.value) return;

    isVimMode.value = !isVimMode.value;

    editor.value.dispatch({
      effects: [
        vimCompartment.reconfigure(isVimMode.value ? vim() : []),
        lineNumberCompartment.reconfigure(
          isVimMode.value ? lineNumbersRelative() : [],
        ),
      ],
    });
  };

  const setTitle = () => {
    setTitleModalOpen.value = true;
  };

  const save = async () => {
    noteStore.note.saveStatus = 'pending';

    if (!noteStore.note.title) {
      setTitle();
      return;
    }

    const result = await onSave(noteStore.note);
    noteStore.note.saveStatus = result.saveStatus;
    if (result.id) noteStore.note.id = result.id;
  };

  const closeSetTitleModal = () => {
    setTitleModalOpen.value = false;
    save();
  };

  const changeNote = () => {
    changeNoteModalOpen.value = true;
  };

  const createEditor = () => {
    return new EditorView({
      doc: noteStore.note.body,
      parent: editorRef.value,
      extensions: [
        EditorView.contentAttributes.of({ spellcheck: 'true' }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            noteStore.note.body = update.state.doc.toString();
          }
        }),
        vimCompartment.of(vim()),
        lineNumberCompartment.of(lineNumbersRelative()),
        drawSelection(),
        markdown({
          codeLanguages: languages,
          extensions: [GFM, prosemarkMarkdownSyntaxExtensions],
        }),
        prosemarkBasicSetup(),
        prosemarkBaseThemeSetup(),
      ],
    });
  };

  const destroyEditor = () => {
    editor.value?.destroy();
  };

  const handleChangeNoteRequest = async (change: boolean) => {
    changeNoteModalOpen.value = false;

    if (change) {
      await save();
      const result = await onGetNote(newNote.value?.key);
      if (result) {
        noteStore.note = result;
        destroyEditor();
        editor.value = createEditor();
      } else {
        console.warn('Something went wrong while changing notes');
      }
    }
  };
  onMounted(() => {
    editor.value = createEditor();
    saveTimer.value = setInterval(() => {
      if (noteStore.note.title) {
        save();
      }
    }, 60000);
  });

  onBeforeUnmount(() => {
    destroyEditor();
  });

  watch(fileSelectionStore, () => {
    const items = fileSelectionStore.items;
    const item = items[0];

    if (items.length === 1 && item && item.key) {
      newNote.value = item as TreeItem;
      changeNote();
    }
  });

  watch(setTitleModalOpen, () => {
    if (!setTitleModalOpen.value && !noteStore.note.title) {
      noteStore.note.saveStatus = 'failed';
    }
  });
</script>

<template>
  <div>
    <UButton @click="db.cloud.login()" />
    <EditorTitle
      v-model:open="setTitleModalOpen"
      @submitted="closeSetTitleModal"
    />
    <EditorChangeNote
      v-model:open="changeNoteModalOpen"
      :new-note="newNote"
      @change="handleChangeNoteRequest"
    />
    <EditorMenu :is-vim-mode="isVimMode" @toggle-vim="toggleVim" @save="save" />
    <div ref="editorRef" class="z-0 editor-container" />
  </div>
</template>

<style>
  .editor-container {
    width: 100%;
    height: 100%;
    padding: 2rem 2rem 0 2rem;

    --font: var(--font-mono);

    --font-size: var(--text-base);
    --font-size-h1: var(--text-4xl);
    --font-size-h2: var(--text-3xl);
    --font-size-h3: var(--text-2xl);
    --font-size-h4: var(--text-xl);
    --font-size-h5: var(--text-lg);
    --font-size-h6: var(--text-base);
    --font-size-code: var(--text-sm);

    --pm-cursor-color: var(--normal);
    --pm-header-mark-color: var(--syntax-iris);
    --pm-link-color: var(--syntax-foam);
    --pm-muted-color: var(--muted);
    --pm-code-background-color: var(--front);
    --pm-code-btn-background-color: var(--hover);
    --pm-code-btn-hover-background-color: var(--border-normal);
    --pm-blockquote-vertical-line-background-color: var(--border-normal);

    --pm-syntax-link: var(--syntax-foam);
    --pm-syntax-keyword: var(--syntax-pine);
    --pm-syntax-atom: var(--syntax-rose);
    --pm-syntax-literal: var(--syntax-foam);
    --pm-syntax-string: var(--syntax-gold);
    --pm-syntax-regexp: var(--syntax-gold);
    --pm-syntax-definition-variable: var(--syntax-foam);
    --pm-syntax-local-variable: var(--normal);
    --pm-syntax-type-namespace: var(--syntax-foam);
    --pm-syntax-class-name: var(--syntax-foam);
    --pm-syntax-special-variable-macro: var(--syntax-iris);
    --pm-syntax-definition-property: var(--syntax-rose);
    --pm-syntax-comment: var(--muted);
    --pm-syntax-invalid: var(--syntax-love);
  }

  .editor-container .cm-cursor {
    border-left-color: var(--pm-cursor-color);
  }
</style>
