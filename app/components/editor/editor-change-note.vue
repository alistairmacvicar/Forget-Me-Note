<script lang="ts" setup>
  const _props = defineProps(['changeNoteModalOpen', 'newNote']);
  const _emit = defineEmits(['change']);
</script>

<template>
  <UModal
    :title="`Switch to ${newNote?.label}`"
    color="front"
    aria-describedby="Set a title"
  >
    <template #body>
      <button class="flex align-middle" @click="$emit('change', true)">
        <Icon name="mdi-light:arrow-right" class="cursor-pointer" />
      </button>
      <button class="flex align-middle" @click="$emit('change', false)">
        <Icon name="mdi-light:arrow-right" class="cursor-pointer" />
      </button>
    </template>
  </UModal>
</template>

<style scoped></style>
