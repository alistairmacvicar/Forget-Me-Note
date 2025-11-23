<script setup lang="ts">
  const _props = defineProps(['directories']);
</script>

<template>
  <div>
    <span> dirname: {{ directories.root.directory.name }}</span>
    <ul>
      <li v-for="(child, index) in directories.children" :key="index">
        <FileSystem :directory-structure="child" />
      </li>
    </ul>
    <ul>
      <li v-for="(note, index) in directories.root.notes" :key="index">
        {{ note.title }}
      </li>
    </ul>
  </div>
</template>
