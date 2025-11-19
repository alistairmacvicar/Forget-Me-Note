<script setup lang="ts"></script>
<!-- TODO: Add a way to change the title (set default title to null, and add a popup when trying to save a null title) -->
<!-- TODO: Move the login button to inside the settings menu (should really look at opt-in cloud sync) -->
<!-- TODO: Get folders working (dexie?) -->
<!-- TODO: maybe get rid of the actions in the note store? I'm not validating anything.... or should I be? -->

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
