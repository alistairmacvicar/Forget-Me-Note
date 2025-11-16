<template>
  <UApp class="min-h-screen flex flex-col">
    <AppHeader />
    <UMain
      :style="{ height: 'calc(100vh - var(--ui-header-height))' }"
      class="overflow-auto"
    >
      <NuxtPage />
    </UMain>
  </UApp>
</template>
