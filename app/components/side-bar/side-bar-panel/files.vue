<script setup lang="ts">
  import type { DirectoryStructure } from '#imports';
  import { getAllNotes } from '#imports';
  import FileSystem from '~/components/notes/file-system.vue';

  const directoryStructure = ref<DirectoryStructure>(await getAllNotes());
</script>

<template>
  <FileSystem :directory-structure="directoryStructure" />
</template>

<style scoped></style>
