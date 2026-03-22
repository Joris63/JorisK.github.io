<script setup lang="ts">
import { ref } from 'vue';
import { useOrderCart } from '@/composables/useOrderCart';

const props = defineProps<{
  readonly?: boolean;
  activeGroupId: string | null;
}>();

const emit = defineEmits<{
  scrollToGroup: [groupId: string];
}>();

const { groups } = useOrderCart();

const SUGGESTIONS = [
  'Badmeubel',
  'Douche',
  'Verwarming',
  'Tegels',
  'Toilet',
  'Onderhoudsmiddelen',
];

const groupMenu = ref();
const groupMenuItems = [
  { label: 'Hernoemen', icon: 'pi pi-pencil' },
  { label: 'Dupliceren', icon: 'pi pi-clone' },
  { separator: true },
  { label: 'Verwijderen', icon: 'pi pi-trash', class: 'text-red-500' },
];

function toggleGroupMenu(event: Event) {
  groupMenu.value.toggle(event);
}
</script>

<template>
  <div class="cart-sidebar flex flex-col shrink-0">
    <!-- Groups -->
    <div class="sidebar-section">
      <div class="sidebar-section-hdr">
        <span class="sidebar-label">Groepen</span>
        <Button
          v-if="!props.readonly"
          icon="pi pi-plus"
          text
          severity="secondary"
          rounded
          size="small"
          class="sidebar-add-btn"
          v-tooltip.top="'Groep toevoegen'"
        />
      </div>

      <Menu ref="groupMenu" :model="groupMenuItems" popup />
      <div class="flex flex-col gap-0.5">
        <div
          v-for="group in groups"
          :key="group.id"
          class="group sidebar-group-item"
          :class="{ 'sidebar-group-item--active': props.activeGroupId === group.id }"
          @click="emit('scrollToGroup', group.id)"
        >
          <span class="truncate text-base flex-1">{{ group.name }}</span>
          <div class="sidebar-item-end">
            <span v-if="group.items.length > 0" class="sidebar-count group-hover:opacity-0">{{
              group.items.length
            }}</span>
            <button
              v-if="!props.readonly"
              class="sidebar-group-menu opacity-0 group-hover:opacity-100"
              @click.stop="toggleGroupMenu($event)"
            >
              <i class="pi pi-ellipsis-h" style="font-size: 0.7rem" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Suggestions -->
    <div v-if="!props.readonly" class="sidebar-section mt-4">
      <div class="sidebar-section-hdr">
        <span class="sidebar-label">Suggesties</span>
      </div>
      <div class="flex flex-col">
        <Button
          v-for="s in SUGGESTIONS"
          :key="s"
          :label="s"
          text
          severity="secondary"
          icon="pi pi-plus"
          class="justify-start! px-2!"
          size="small"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";
.cart-sidebar {
  @apply w-[17rem] shrink-0 border-r border-(--sw-border-md) bg-(--sw-bg-subtle) overflow-y-auto py-3 px-2.5;
}

.sidebar-section {
  @apply flex flex-col;
}

.sidebar-section-hdr {
  @apply flex items-center justify-between px-2 pb-1.5;
}

.sidebar-label {
  @apply text-xs font-bold uppercase tracking-[0.06em] text-(--sw-text-muted);
}

.sidebar-add-btn {
  width: 1.625rem !important;
  height: 1.625rem !important;
  min-width: 0 !important;
  padding: 0 !important;
  font-size: 0.6875rem !important;
}

.sidebar-group-item {
  transition:
    background var(--sw-duration-fast) var(--sw-ease),
    color var(--sw-duration-fast) var(--sw-ease);
  @apply flex items-center relative rounded-md cursor-pointer text-(--sw-text-sub) gap-1.5 py-1.5 px-2.5 text-base;
}

.sidebar-group-item:hover {
  @apply bg-(--sw-bg-muted) text-(--sw-text);
}

.sidebar-group-item--active {
  @apply bg-primary-50 text-primary-700;
}

.sidebar-group-item--active:hover {
  @apply bg-primary-100;
}

.sidebar-item-end {
  @apply relative shrink-0 flex items-center justify-center w-[1.375rem] h-[1.375rem] ml-auto;
}

.sidebar-count {
  transition: opacity var(--sw-duration-fast) var(--sw-ease);
  @apply text-xs bg-(--sw-border-md) text-(--sw-text-label) rounded-full leading-[1.3] whitespace-nowrap px-1.5;
}

.sidebar-group-item--active .sidebar-count {
  @apply bg-primary-100 text-primary-600;
}

.sidebar-group-menu {
  transition:
    background var(--sw-duration-fast) var(--sw-ease),
    color var(--sw-duration-fast) var(--sw-ease),
    opacity var(--sw-duration-fast) var(--sw-ease);
  @apply absolute inset-0 flex items-center justify-center border-none bg-transparent rounded cursor-pointer text-(--sw-text-muted);
}

.sidebar-group-menu:hover {
  @apply bg-(--sw-border-md) text-(--sw-text-strong);
}
</style>
