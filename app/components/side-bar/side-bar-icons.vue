<script lang="ts" setup>
  import type { Panel } from '~~/shared/types/panel';

  const props = defineProps<{ activePanel: Panel }>();
  const emit = defineEmits<(e: 'update:activePanel', value: Panel) => void>();

  const colorMode = useColorMode();

  const toggle = (panel: Exclude<Panel, null>) => {
    emit('update:activePanel', props.activePanel === panel ? null : panel);
  };
</script>

<template>
  <div class="icon-container h-full border-r-border-highlight border-r-2 p-4">
    <Icon
      name="mdi-light:file-multiple"
      class="icon"
      :class="{ 'text-normal!': props.activePanel === 'files' }"
      @click="toggle('files')"
    />
    <Icon
      name="mdi-light:comment-text"
      class="icon"
      :class="{ 'text-normal!': props.activePanel === 'chat' }"
      @click="toggle('chat')"
    />
    <Icon
      v-if="colorMode.preference === 'dark'"
      name="ri:moon-line"
      class="icon"
      @click="colorMode.preference = 'light'"
    />
    <Icon
      v-else
      name="ri:sun-line"
      class="icon"
      @click="colorMode.preference = 'dark'"
    />
    <Icon
      name="mdi-light:settings"
      class="icon"
      :class="{ 'text-normal!': props.activePanel === 'settings' }"
      @click="toggle('settings')"
    />
    <Icon
      name="mdi-light:account"
      class="icon"
      :class="{ 'text-normal!': props.activePanel === 'account' }"
      @click="toggle('account')"
    />
  </div>
</template>

<style scoped>
  .icon-container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    gap: 0.5rem;
  }

  .icon {
    font-size: 2.25rem;
    line-height: var(--tw-leading, var(--text-4xl--line-height));
    color: var(--color-muted);
    cursor: pointer;
  }
</style>
