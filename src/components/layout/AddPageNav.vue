<script setup lang="ts">
  import { ref, onMounted, onUnmounted, nextTick } from 'vue';

  interface Section {
    id: string;
    label: string;
    description?: string;
  }

  interface Props {
    sections: Section[];
  }

  const props = defineProps<Props>();

  // activeSection is managed locally — no inject needed
  const activeId = ref(props.sections[0]?.id ?? '');

  const navEl = ref<HTMLElement | null>(null);
  let scrollContainer: Element | null = null;
  let ignoreScroll = false;
  let ignoreScrollTimer: ReturnType<typeof setTimeout> | null = null;

  function findScrollParent(el: HTMLElement): Element {
    let parent = el.parentElement;
    while (parent && parent !== document.documentElement) {
      const style = window.getComputedStyle(parent);
      if (/auto|scroll/.test(style.overflowY)) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return document.documentElement;
  }

  const TOPBAR_HEIGHT = 80;

  function updateActive() {
    if (ignoreScroll) return;

    // Priority: first section heading that is currently visible below the topbar
    for (const section of props.sections) {
      const el = document.getElementById(section.id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top;
      if (top >= TOPBAR_HEIGHT && top <= window.innerHeight) {
        activeId.value = section.id;
        return;
      }
    }

    // Fallback: no heading visible — use the last one that scrolled past the topbar
    let current = props.sections[0]?.id ?? '';
    for (const section of props.sections) {
      const el = document.getElementById(section.id);
      if (el && el.getBoundingClientRect().top <= TOPBAR_HEIGHT) {
        current = section.id;
      }
    }
    activeId.value = current;
  }

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) {
      activeId.value = id;
      ignoreScroll = true;
      if (ignoreScrollTimer) clearTimeout(ignoreScrollTimer);
      ignoreScrollTimer = setTimeout(() => { ignoreScroll = false; }, 800);
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onMounted(async () => {
    await nextTick();
    if (navEl.value) {
      scrollContainer = findScrollParent(navEl.value);
      scrollContainer.addEventListener('scroll', updateActive, { passive: true });
    }
  });

  onUnmounted(() => {
    scrollContainer?.removeEventListener('scroll', updateActive);
  });
</script>

<template>
  <nav ref="navEl" class="add-nav">
    <div class="add-nav-group-label">Secties</div>
    <button
      v-for="(section, i) in sections"
      :key="section.id"
      class="add-nav-item"
      :class="{ 'add-nav-item--active': activeId === section.id }"
      @click="scrollTo(section.id)"
    >
      <span class="add-nav-num">{{ i + 1 }}</span>
      <span>
        <span class="add-nav-item-label">{{ section.label }}</span>
        <span v-if="section.description" class="add-nav-item-desc">{{ section.description }}</span>
      </span>
    </button>
    <slot />
  </nav>
</template>
