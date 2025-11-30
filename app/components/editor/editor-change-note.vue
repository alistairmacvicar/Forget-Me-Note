<script lang="ts" setup>
  const _props = defineProps(['changeNoteModalOpen', 'newNote']);
  const _emit = defineEmits(['save']);
</script>

<template>
  <UModal
    title="Would you like to save your current note first?"
    color="front"
    aria-describedby="Switch open note"
  >
    <template #body>
      <button class="flex align-middle" @click="$emit('save', true)">
        Yes
      </button>
      <button class="flex align-middle" @click="$emit('save', false)">
        No
      </button>
    </template>
  </UModal>
</template>

<style scoped></style>
