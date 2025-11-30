<script setup lang="ts">
  import type { EditorView } from '@codemirror/view';
  import type { TreeItem } from '@nuxt/ui';
  import { createEditor } from '#imports';
  import { db } from '~~/plugins/db.client';
  import { useFileSelectionStore } from '~~/stores/file-selection';
  import { useNoteStore } from '~~/stores/note';

  const editorDiv = ref<HTMLElement | undefined>(undefined);
  const editor = ref<EditorView | null>(null);
  const saveTimer = ref<NodeJS.Timeout | null>(null);
  const newNote = ref<TreeItem>();
  const noteStore = useNoteStore();
  const fileSelectionStore = useFileSelectionStore();
  const setTitleModalOpen = ref(false);

  const openSetTitleModal = () => {
    setTitleModalOpen.value = true;
  };

  const save = async () => {
    noteStore.note.saveStatus = 'pending';

    if (!noteStore.note.title) {
      openSetTitleModal();
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

  const destroyEditor = () => {
    editor.value?.destroy();
  };

  const handleChangeNoteRequest = async () => {
    await save();

    const result = await onGetNote(newNote.value?.key);
    if (result) {
      noteStore.note = result;
      destroyEditor();
      editor.value = createEditor(editorDiv.value);
    } else {
      console.warn('Something went wrong while changing notes');
    }
  };

  onMounted(() => {
    editor.value = createEditor(editorDiv.value);
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
      handleChangeNoteRequest();
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
    <EditorMenu @save="save" />
    <div ref="editorDiv" class="z-0 editor-container" />
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
