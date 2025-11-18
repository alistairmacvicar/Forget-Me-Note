<script setup lang="ts">
  import type { Note } from '~~/shared/types/note';

  const note = ref<Note>({ title: '# ', body: '# ' });
</script>

<template>
  <div class="layout">
    <SideBar class="sidebar" />
    <Editor v-model:note="note" class="overflow-auto" />
  </div>
</template>

<style>
  .layout {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 1fr;
    height: 100%;
  }
</style>
