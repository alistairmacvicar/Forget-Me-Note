<script setup lang="ts">
  import type { Panel } from '~~/shared/types/panel';

  const activePanel = ref<Panel>(null);
  const menuShown = computed(() => !!activePanel.value);
</script>

<template>
  <div class="menu-container">
    <SideBarIcons v-model:active-panel="activePanel" />
    <SideBarPanel :menu-shown="menuShown" :active-panel="activePanel" />
  </div>
</template>

<style scoped>
  .menu-container {
    display: grid;
    grid-template-columns: auto auto;
    align-items: stretch;
  }
</style>
