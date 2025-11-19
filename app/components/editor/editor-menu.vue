<script lang="ts" setup>
  import type { Note } from '~~/shared/types/note';
  import { useNoteStore } from '~~/stores/note';
  import { onDownload, onSave } from '~/composables/handle-note';

  const { isVimMode, note } = defineProps<{
    isVimMode?: boolean;
    note?: Note;
  }>();
  const _emit = defineEmits(['toggleVim']);
  const noteStore = useNoteStore();

  const save = async () => {
    noteStore.updateSaveStatus('pending');

    const result = await onSave(noteStore.getNote);
    noteStore.updateSaveStatus(result.saveStatus);
    if (result.id) noteStore.updateID(result.id);
  };

  const download = () => {
    onDownload(noteStore.getNote);
  };
</script>

<template>
  <div
    class="menu-container p-0.5 bg-front border-b-2 border-b-border-highlight"
  >
    <UTooltip :text="`Click to swap to ${isVimMode ? 'Normal' : 'Vim'} mode.`">
      <div class="editing-mode text-l pl-1 self-center text-muted">
        <div class="cursor-default">
          {{ 'Editor mode: ' }}
        </div>
        <div class="cursor-pointer" @click="$emit('toggleVim')">
          {{ isVimMode ? 'Vim' : 'Normal' }}
        </div>
      </div>
    </UTooltip>

    <UTooltip text="Save current document">
      <Icon
        class="icon cursor-pointer"
        name="mdi-light:content-save"
        @click="save"
      />
    </UTooltip>

    <UTooltip
      v-if="note?.saveStatus === 'saved'"
      text="Current document saved."
    >
      <Icon name="mdi-light:check-circle" class="icon" />
    </UTooltip>
    <UTooltip
      v-else-if="note?.saveStatus === 'pending'"
      text="Saving current document..."
    >
      <Icon name="line-md:loading-loop" class="icon" stroke-width="1" />
    </UTooltip>
    <UTooltip
      v-else-if="note?.saveStatus === 'failed'"
      text="Failed to save current document."
    >
      <Icon name="mdi-light:alert-circle" class="icon" />
    </UTooltip>

    <UTooltip
      v-if="note?.syncStatus === 'downloading'"
      text="Syncing from cloud..."
    >
      <Icon name="mdi-light:cloud-download" class="icon" />
    </UTooltip>
    <UTooltip
      v-else-if="note?.syncStatus === 'uploading'"
      text="Syncing to cloud..."
    >
      <Icon name="line-md:cloud-upload" class="icon" stroke-width="1" />
    </UTooltip>
    <UTooltip
      v-else-if="note?.syncStatus === 'synced'"
      text="Cloud sync complete."
    >
      <Icon name="mdi-light:cloud" class="icon" />
    </UTooltip>
    <UTooltip
      v-else-if="note?.syncStatus === 'disabled'"
      text="Cloud sync not enabled."
    >
      <Icon name="material-symbols-light:cloud-off-outline" class="icon" />
    </UTooltip>

    <UTooltip text="Download current document">
      <Icon
        name="mdi-light:download"
        class="icon cursor-pointer"
        @click="download"
      />
    </UTooltip>
  </div>
</template>

<style scoped>
  .menu-container {
    width: 100%;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr auto auto auto auto 1fr;
    gap: 0.5rem;
    justify-content: center;
  }

  .icon {
    font-size: 2.25rem;
    line-height: var(--tw-leading, var(--text-4xl--line-height));
    color: var(--color-muted);
  }

  .editing-mode {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.5rem;
  }
</style>
