<script lang="ts" setup>
  import { useNoteStore } from '~~/stores/note';

  const noteStore = useNoteStore();
  const title = ref('');
  const maxLength = 64;
</script>

<template>
  <UModal title="Set a title" color="front" aria-describedby="Set a title">
    <template #body>
      <UForm @submit="noteStore.updateTitle(title)">
        <div class="input-container">
          <UFormField>
            <UInput
              v-model="title"
              placeholder="My brain dump..."
              color="border-highlight"
              class="w-full"
              :maxlength="maxLength"
            >
              <template #trailing>
                <div class="text-xs text-muted tabular-nums">
                  {{ title.length }}/{{ maxLength }}
                </div>
              </template>
            </UInput>
          </UFormField>
          <button type="submit" class="flex align-middle">
            <Icon name="mdi-light:arrow-right" class="cursor-pointer" />
          </button>
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<style scoped>
  .input-container {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 0.5rem;
  }
</style>
