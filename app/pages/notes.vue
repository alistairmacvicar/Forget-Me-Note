<script setup lang="ts"></script>

<template>
  <div class="layout">
    <SideBar class="sidebar" />
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
