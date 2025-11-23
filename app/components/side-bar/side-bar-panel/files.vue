<script setup lang="ts">
  import type { DirectoryStructure } from '#imports';
  import { getAllNotes } from '#imports';
  import FileSystem from '~/components/notes/file-system.vue';

  const directories: DirectoryStructure = await getAllNotes();
</script>

<template>
  <FileSystem :directories="directories" />
</template>

<style scoped></style>
