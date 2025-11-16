<script setup lang="ts"></script>

<template>
  <div class="header bg-card border-b-2 border-b-border-highlight">
    <div class="title cursor-pointer font-mono text-2xl">Forget-Me-Note</div>

    <ULink
      to="https://github.com/alistairmacvicar/forget-me-note"
      class="github flex justify-center"
    >
      <Icon
        name="i-simple-icons-github"
        class="text-2xl text-normal hover:text-muted"
      />
    </ULink>
  </div>
</template>

<style>
  .header {
    height: var(--ui-header-height);
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: 1fr;
    align-items: center;
    padding: 1rem;
  }

  .title {
    grid-column: 1 / 2;
  }

  .github {
    grid-column: 3 / 4;
  }
</style>
