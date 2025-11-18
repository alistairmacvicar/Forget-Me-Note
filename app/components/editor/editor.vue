<script setup lang="ts">
  import type { EditorAction } from '~~/shared/types/editor-action';
  import type { Note } from '~~/shared/types/note';
  import { lineNumbersRelative } from '#imports';
  import { markdown } from '@codemirror/lang-markdown';
  import { languages } from '@codemirror/language-data';
  import { Compartment } from '@codemirror/state';
  import { drawSelection, EditorView } from '@codemirror/view';
  import { GFM } from '@lezer/markdown';
  import {
    prosemarkBaseThemeSetup,
    prosemarkBasicSetup,
    prosemarkMarkdownSyntaxExtensions,
  } from '@prosemark/core';
  import { vim } from '@replit/codemirror-vim';

  const props = defineProps<{ note: Note }>();
  const emit = defineEmits<EditorAction>();
  const editorRef = ref<HTMLElement | undefined>(undefined);
  const editor = ref<EditorView | null>(null);
  const isVimMode = ref(true);
  const vimCompartment = new Compartment();
  const lineNumberCompartment = new Compartment();

  onMounted(() => {
    editor.value = new EditorView({
      doc: props.note.body,
      parent: editorRef.value,
      extensions: [
        EditorView.contentAttributes.of({ spellcheck: 'true' }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newBody = update.state.doc.toString();
            const updatedNote: Note = { ...props.note, body: newBody };
            emit('update', updatedNote);
          }
        }),
        vimCompartment.of(vim()),
        lineNumberCompartment.of(lineNumbersRelative()),
        drawSelection(),
        markdown({
          codeLanguages: languages,
          extensions: [GFM, prosemarkMarkdownSyntaxExtensions],
        }),
        prosemarkBasicSetup(),
        prosemarkBaseThemeSetup(),
      ],
    });

    editor.value.focus();
  });

  onBeforeUnmount(() => {
    editor.value?.destroy();
  });

  const toggleVim = () => {
    if (!editor.value) return;

    isVimMode.value = !isVimMode.value;

    editor.value.dispatch({
      effects: [
        vimCompartment.reconfigure(isVimMode.value ? vim() : []),
        lineNumberCompartment.reconfigure(
          isVimMode.value ? lineNumbersRelative() : [],
        ),
      ],
    });
  };
</script>

<template>
  <div>
    <EditorMenu
      :note="props.note"
      class="sticky top-0 z-1"
      :is-vim-mode="isVimMode"
      @toggle-vim="toggleVim"
      @download="emit('download', note)"
    />
    <div ref="editorRef" class="z-0 editor-container" />
  </div>
</template>

<style>
  .editor-container {
    width: 100%;
    height: 100%;
    padding: 2rem 2rem 0 2rem;

    --font: var(--font-mono);

    --font-size: var(--text-base);
    --font-size-h1: var(--text-4xl);
    --font-size-h2: var(--text-3xl);
    --font-size-h3: var(--text-2xl);
    --font-size-h4: var(--text-xl);
    --font-size-h5: var(--text-lg);
    --font-size-h6: var(--text-base);
    --font-size-code: var(--text-sm);

    --pm-cursor-color: var(--normal);
    --pm-header-mark-color: var(--syntax-iris);
    --pm-link-color: var(--syntax-foam);
    --pm-muted-color: var(--muted);
    --pm-code-background-color: var(--front);
    --pm-code-btn-background-color: var(--hover);
    --pm-code-btn-hover-background-color: var(--border-normal);
    --pm-blockquote-vertical-line-background-color: var(--border-normal);

    --pm-syntax-link: var(--syntax-foam);
    --pm-syntax-keyword: var(--syntax-pine);
    --pm-syntax-atom: var(--syntax-rose);
    --pm-syntax-literal: var(--syntax-foam);
    --pm-syntax-string: var(--syntax-gold);
    --pm-syntax-regexp: var(--syntax-gold);
    --pm-syntax-definition-variable: var(--syntax-foam);
    --pm-syntax-local-variable: var(--normal);
    --pm-syntax-type-namespace: var(--syntax-foam);
    --pm-syntax-class-name: var(--syntax-foam);
    --pm-syntax-special-variable-macro: var(--syntax-iris);
    --pm-syntax-definition-property: var(--syntax-rose);
    --pm-syntax-comment: var(--muted);
    --pm-syntax-invalid: var(--syntax-love);
  }

  .editor-container .cm-cursor {
    border-left-color: var(--pm-cursor-color);
  }
</style>
