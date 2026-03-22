<script setup lang="ts">
  import { ref, computed } from 'vue';
  import type { FilterConfig } from '@/types/filters';

  const props = defineProps<{
    allFilterDefs: FilterConfig[];
    activeKeys: string[];
  }>();

  const emit = defineEmits<{
    'add-filter': [key: string];
    'remove-filter': [key: string];
  }>();

  const popoverRef = ref<any>(null);

  const items = computed(() =>
    props.allFilterDefs.map((f) => ({
      ...f,
      active: f.required || props.activeKeys.includes(f.key),
    }))
  );

  function toggle(event: Event) {
    popoverRef.value?.toggle(event);
  }

  function onToggleItem(key: string, active: boolean) {
    if (active) emit('remove-filter', key);
    else emit('add-filter', key);
  }

  defineExpose({ toggle });
</script>

<template>
  <button class="customize-btn" title="Filters aanpassen" @click="toggle($event)">
    <i class="pi pi-sliders-h" />
  </button>
  <Popover ref="popoverRef">
    <div class="customize-popover">
      <p class="customize-popover__title">Filters aanpassen</p>
      <div class="customize-list">
        <label
          v-for="item in items"
          :key="item.key"
          class="customize-item"
          :class="{ 'customize-item--required': item.required }"
        >
          <Checkbox
            :model-value="item.active"
            :binary="true"
            :disabled="item.required"
            @update:model-value="!item.required && onToggleItem(item.key, item.active)"
          />
          <span>{{ item.label }}</span>
          <i v-if="item.required" class="pi pi-lock customize-item__lock" />
        </label>
        <div v-if="!items.length" class="customize-empty">
          Geen filters beschikbaar
        </div>
      </div>
    </div>
  </Popover>
</template>

<style scoped>
@reference "@/assets/style.css";
  .customize-btn {
    @apply flex items-center justify-center border-none bg-none text-(--sw-text-muted) cursor-pointer rounded-md shrink-0 w-8 h-8 text-[0.9rem];
    transition: color var(--sw-duration-base), background var(--sw-duration-base);
  }

  .customize-btn:hover {
    @apply text-(--sw-text-sub) bg-(--sw-bg-muted);
  }

  .customize-popover {
    min-width: 13rem;
  }

  .customize-popover__title {
    @apply sw-title m-0 mb-2 text-(--sw-text-muted);
  }

  .customize-list {
    @apply flex flex-col gap-0.5 -mx-3 -mb-3;
  }

  .customize-item {
    @apply flex items-center cursor-pointer text-base text-(--sw-text) gap-2.5 px-3 py-2;
    transition: background var(--sw-duration-fast);
  }

  .customize-item:hover {
    @apply bg-(--sw-bg-subtle);
  }

  .customize-item--required {
    @apply opacity-[0.65] cursor-default;
  }

  .customize-item--required:hover {
    background: transparent;
  }

  .customize-item__lock {
    @apply ml-auto text-(--sw-text-muted) text-xs;
  }

  .customize-empty {
    @apply text-(--sw-text-muted) text-base text-center italic p-3;
  }
</style>
