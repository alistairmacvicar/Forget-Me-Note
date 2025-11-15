<script setup lang="ts">
  import { Crepe } from '@milkdown/crepe';
  import { onBeforeUnmount, onMounted, ref } from 'vue';
  import '@milkdown/crepe/theme/common/style.css';
  import '@milkdown/crepe/theme/frame.css';

  const text = ref('# Hello World\n\nStart writing...');
  const editorRef = ref<HTMLElement | null>(null);
  const crepeInstance = ref<Crepe | null>(null);

  onMounted(() => {
    createEditor();
  });

  function createEditor() {
    if (!editorRef.value) return;

    crepeInstance.value = new Crepe({
      root: editorRef.value as HTMLElement,
      defaultValue: text.value,
    });

    crepeInstance.value.create().then(() => {
      crepeInstance.value?.on((listener) => {
        listener.markdownUpdated((_, markdown) => {
          text.value = markdown;
        });
      });
    });
  }

  onBeforeUnmount(() => {
    crepeInstance.value?.destroy().catch();
    crepeInstance.value = null;
  });
</script>

<template>
  <div ref="editorRef" class="editor-container" />
</template>

<style>
  .editor-container {
    width: 100%;
    height: 100%;
  }

  .editor-container .milkdown {
    width: 100%;
    height: 100%;
    border-radius: 1rem;

    --crepe-color-background: var(--color-card);
    --crepe-color-on-background: var(--color-normal);
    --crepe-color-surface: var(--color-front);
    --crepe-color-surface-low: var(--color-card);
    --crepe-color-on-surface: var(--color-normal);
    --crepe-color-on-surface-variant: var(--color-muted);
    --crepe-color-outline: var(--color-muted);
    --crepe-color-primary: var(--color-action-primary);
    --crepe-color-secondary: var(--color-action-secondary);
    --crepe-color-on-secondary: var(--color-muted);
    --crepe-color-inline-code: var(--color-accent, #ba1a1a);
    --crepe-color-error: var(--color-danger);
    --crepe-color-hover: var(--color-hover);
    --crepe-color-inline-area: var(--color-inline-area, #f9fafb);
    --crepe-color-selected: Highlight;

    --crepe-font-title: 'Roboto', sans-serif;
    --crepe-font-default: 'Roboto', sans-serif;
    --crepe-font-code: 'Roboto', sans-serif;
  }

  .editor-container .milkdown .milkdown-slash-menu .tab-group ul li.selected {
    background: var(--crepe-color-selected);
  }

  .editor-container .milkdown .milkdown-block-handle .operation-item:hover {
    background: var(--crepe-color-surface);
  }

  .editor-container .milkdown .milkdown-code-block {
    border-radius: 1rem;
  }
</style>
