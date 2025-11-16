import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

export default function useSidebarResize() {
  const panelRef = ref<HTMLElement | null>(null);
  const width = ref<number | null>(null);
  const isDragging = ref(false);
  let startX = 0;
  let startWidth = 0;
  const minWidth = 200;
  let maxWidth = 0;

  function onPointerDown(e: PointerEvent) {
    isDragging.value = true;
    startX = e.clientX;
    startWidth = panelRef.value?.getBoundingClientRect().width ?? 0;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }

  function onPointerMove(e: PointerEvent) {
    if (!isDragging.value) return;
    const dx = e.clientX - startX;
    let newWidth = Math.round(startWidth + dx);
    newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
    width.value = newWidth;
  }

  function onPointerUp(e: PointerEvent) {
    isDragging.value = false;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    try {
      (e.target as Element).releasePointerCapture?.(e.pointerId);
    } catch {}
  }

  onMounted(() => {
    if (typeof window === 'undefined') return;
    maxWidth = Math.max(window.innerWidth - 100, minWidth);
    const stored =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem('sidebar-width')
        : null;
    if (stored) {
      const parsed = Number.parseInt(stored, 10);
      if (!Number.isNaN(parsed))
        width.value = Math.max(minWidth, Math.min(parsed, maxWidth));
    }
    if (!width.value) {
      const initial = Math.round(window.innerWidth * 0.2);
      width.value = Math.max(minWidth, Math.min(initial, maxWidth));
    }
  });

  watch(width, (val) => {
    if (!val) return;
    try {
      localStorage.setItem('sidebar-width', String(val));
    } catch {}
  });

  onBeforeUnmount(() => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  });

  return { panelRef, width, onPointerDown, isDragging };
}
