<script setup lang="ts">
  import type { Panel } from '@codemirror/view';
  import useSidebarResize from '../../composables/useSidebarResize.client';

  const props = defineProps<{ activePanel?: Panel; menuShown?: boolean }>();

  const { panelRef, width, onPointerDown } = useSidebarResize();
</script>

<template>
  <div
    ref="panelRef"
    class="menu p-4 resize-x relative"
    :class="{
      'w-0 hidden': !props.menuShown,
      'block border-r-2 border-r-border-highlight': props.menuShown,
    }"
    :style="width ? { width: `${width}px` } : undefined"
  >
    <h2>
      {{ props.activePanel }}
    </h2>

    <div
      class="resizer absolute right-0 top-0 h-full w-2"
      :style="{
        touchAction: 'none',
        cursor: 'col-resize',
        background: 'transparent',
      }"
      aria-hidden="true"
      @pointerdown.prevent="(e) => props.menuShown && onPointerDown(e)"
    />
  </div>
</template>

<style scoped>
  .resizer:hover {
    background: rgba(0, 0, 0, 0.04);
  }
</style>
