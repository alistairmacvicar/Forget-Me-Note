<template>
  <div class="layout">
    <Sidebar class="menu" />
    <NoteEditor class="editor" />
    <Sidebar class="chat" />
  </div>
</template>

<style>
  .layout {
    display: grid;
    padding: 1rem;
    gap: 0.5rem;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: 1fr;
    height: 100%;
  }

  .editor {
    grid-column: 2 / 3;
  }

  .chat,
  .menu {
    max-width: 25vw;
  }

  .chat {
    grid-column: 3 / 4;
  }

  .menu {
    grid-column: 1 / 2;
  }
</style>
