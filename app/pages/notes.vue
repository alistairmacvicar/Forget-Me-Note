<script setup lang="ts"></script>
<!-- TODO: Move the login button to inside the settings menu (should really look at opt-in cloud sync) -->
<!-- TODO: Get folders working (dexie?) -->

<template>
  <div class="layout">
    <SideBar />
    <Editor class="overflow-auto" />
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
