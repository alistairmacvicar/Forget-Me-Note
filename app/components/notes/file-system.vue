<script setup lang="ts">
  import type { TreeItem } from '@nuxt/ui';
  import { useFileSelectionStore } from '~~/stores/file-selection';

  const fileSelectionStore = useFileSelectionStore();
  const treeItems = ref<TreeItem[]>(await getFileSystem());

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
