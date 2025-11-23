<script setup lang="ts">
  import type { TreeItem } from '@nuxt/ui';
  import { computed } from 'vue';
  const props = defineProps(['directoryStructure']);

  const treeItems = computed(() => {
    return [buildDirectoryStructure(props.directoryStructure)];
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
      const noteItem = { label: note.title ?? undefined, children: [] };
      children.push(noteItem);
    }

    return {
      label: directoryStructure.root.directory.name,
      children,
    };
  }
</script>

<template>
  <div>
    <UTree :items="treeItems" color="color-normal" />
  </div>
</template>

<style>
  :root {
    --ui-bg-elevated: var(--front);
    --ui-text-highlighted: var(--normal);
  }
</style>
