<script setup lang="ts">
  import type { DirectoryStructure } from '#imports';
  import type { TreeItem } from '@nuxt/ui';
  import { getAllNotes } from '#imports';
  import { computed } from 'vue';
  import { useFileSelectionStore } from '~~/stores/file-selection';

  const directoryStructure = ref<DirectoryStructure>(await getAllNotes());
  const fileSelectionStore = useFileSelectionStore();

  const treeItems = computed(() => {
    return [buildDirectoryStructure(directoryStructure.value)];
  });

  function buildDirectoryStructure(
    directoryStructure: DirectoryStructure,
  ): TreeItem {
    const children: TreeItem[] = [];
    const childDirectories = directoryStructure.children;
    const notes = directoryStructure.root.notes;

    for (const child of childDirectories) {
      children.push(buildDirectoryStructure(child));
    }

    for (const note of notes) {
      const noteItem = {
        key: note.id,
        label: note.title ?? undefined,
        children: [],
      };
      children.push(noteItem);
    }

    return {
      label: directoryStructure.root.directory.name,
      children,
    };
  }

  const handleSelectionUpdate = (event: TreeItem | TreeItem[]) => {
    fileSelectionStore.items = Array.isArray(event) ? event : [event];
  };
</script>

<template>
  <div>
    <UTree
      :items="treeItems"
      color="normal"
      @update:model-value="handleSelectionUpdate"
    />
  </div>
</template>

<style>
  :root {
    --ui-bg-elevated: var(--front);
    --ui-text-highlighted: var(--normal);
  }
</style>
