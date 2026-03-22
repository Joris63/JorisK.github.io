<script setup lang="ts">
  import { computed } from 'vue';
  import type { OfferGroup as Group, PendingGroupChanges } from '@/types/offer';

  const props = defineProps<{
    groups: Group[];
    selectedGroupId: number | null;
    pendingChanges: Record<number, PendingGroupChanges>;
    isVerlopen: boolean;
    headless?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'select-group', id: number): void;
    (e: 'add-group', parentId: number | null): void;
    (e: 'edit-group', id: number): void;
    (e: 'delete-group', id: number): void;
    (e: 'toggle-group', id: number): void;
  }>();

  function flattenGroups(nodes: Group[], depth = 0): { node: Group; depth: number }[] {
    const items: { node: Group; depth: number }[] = [];
    for (const g of nodes) {
      items.push({ node: g, depth });
      if (g.expanded && g.children.length) items.push(...flattenGroups(g.children, depth + 1));
    }
    return items;
  }

  const flatGroups = computed(() => flattenGroups(props.groups));

  function groupHasPending(id: number) {
    return id in props.pendingChanges;
  }

  function groupHasPendingRemove(id: number) {
    const p = props.pendingChanges[id];
    return p
      ? p.groupAction === 'remove' ||
          p.options.some((c) => c.action === 'remove') ||
          p.products.some((c) => c.action === 'remove')
      : false;
  }

  function groupScheduledAction(id: number) {
    return props.pendingChanges[id]?.groupAction ?? null;
  }
</script>

<template>
  <div class="groups-panel" :class="{ 'groups-panel--headless': headless }">
    <div v-if="!headless" class="groups-panel__header">
      <span>Groepen</span>
      <button
        v-if="!isVerlopen"
        class="icon-btn"
        title="Groep toevoegen"
        @click="emit('add-group', null)"
      >
        <i class="pi pi-plus text-xs" />
      </button>
    </div>

    <div class="groups-tree">
      <div
        v-for="{ node, depth } in flatGroups"
        :key="node.id"
        class="group-row"
        :class="{
          'group-row--active': selectedGroupId === node.id,
          'group-row--removing': groupScheduledAction(node.id) === 'remove',
          'group-row--adding': groupScheduledAction(node.id) === 'add',
        }"
        :style="{ paddingLeft: `${0.5 + depth * 1.25}rem` }"
        @click="emit('select-group', node.id)"
      >
        <button
          v-if="node.children.length"
          class="expand-btn"
          @click.stop="emit('toggle-group', node.id)"
        >
          <i :class="`pi ${node.expanded ? 'pi-chevron-down' : 'pi-chevron-right'} text-xs`" />
        </button>
        <div v-else class="w-5 shrink-0" />
        <span class="group-naam flex-1 truncate">{{ node.name }}</span>
        <i
          v-if="groupHasPending(node.id)"
          class="pi pi-clock pending-clock"
          :class="groupHasPendingRemove(node.id) ? 'pending-clock--mixed' : 'pending-clock--add'"
        />
        <span class="item-count">{{ node.products.length || '' }}</span>
        <div class="row-actions">
          <button
            v-if="!isVerlopen"
            class="row-action-btn"
            title="Subgroep toevoegen"
            @click.stop="emit('add-group', node.id)"
          >
            <i class="pi pi-plus text-xs" />
          </button>
          <button class="row-action-btn" title="Bewerken" @click.stop="emit('edit-group', node.id)">
            <i class="pi pi-pencil text-xs" />
          </button>
          <button
            v-if="!isVerlopen"
            class="row-action-btn row-action-btn--danger"
            title="Groep verwijderen"
            @click.stop="emit('delete-group', node.id)"
          >
            <i class="pi pi-trash text-xs" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";
  .groups-panel {
    @apply w-[420px] shrink-0 flex flex-col bg-(--sw-bg) border-r border-(--sw-border);
  }
  .groups-panel--headless {
    @apply w-full border-r-0 flex-1 min-h-0;
  }

  .groups-panel__header {
    @apply sw-title flex items-center justify-between font-bold text-(--sw-text-muted) border-b border-(--sw-border) shrink-0 px-3 py-2.5;
  }

  .icon-btn {
    @apply flex items-center justify-center rounded cursor-pointer text-(--sw-text-muted) w-[1.375rem] h-[1.375rem] bg-none border-none;
    transition: background var(--sw-duration-fast), color var(--sw-duration-fast);
  }
  .icon-btn:hover {
    @apply bg-(--sw-bg-muted) text-(--sw-text-sub);
  }

  .groups-tree {
    @apply flex-1 overflow-y-auto p-1;
  }

  .group-row {
    @apply flex items-center rounded-md cursor-pointer relative gap-1 py-1.5 px-2 mb-0.5;
    transition: background var(--sw-duration-fast);
  }
  .group-row:hover {
    @apply bg-(--sw-border);
  }
  .group-row:hover .row-actions {
    opacity: 1 !important;
  }
  .group-row:hover .item-count,
  .group-row:hover .pending-clock {
    opacity: 0;
  }
  .group-row--active {
    @apply bg-primary-50;
  }

  .group-naam {
    @apply font-medium text-(--sw-text-sub) text-base;
  }
  .group-row--active .group-naam {
    @apply text-primary-700;
  }

  .item-count {
    @apply font-semibold text-(--sw-text-muted) bg-(--sw-bg-muted) rounded-full text-center shrink-0 min-w-5 text-xs;
    padding: 0.05rem 0.375rem;
    transition: opacity var(--sw-duration-fast);
  }
  .group-row--active .item-count {
    @apply bg-primary-100 text-primary-600;
  }

  .row-actions {
    @apply absolute flex items-center opacity-0 right-2 gap-1;
    top: 50%;
    transform: translateY(-50%);
    transition: opacity var(--sw-duration-fast);
  }

  .expand-btn,
  .row-action-btn {
    @apply flex items-center justify-center cursor-pointer text-(--sw-text-muted) rounded shrink-0 w-[1.375rem] h-[1.375rem] bg-none border-none;
    transition: background var(--sw-duration-fast), color var(--sw-duration-fast);
  }
  .expand-btn:hover,
  .row-action-btn:hover {
    @apply bg-(--sw-border-md) text-(--sw-text-sub);
  }

  .row-action-btn--danger:hover {
    @apply bg-red-50! text-red-500!;
  }

  /* Pending clock dot */
  .pending-clock {
    @apply shrink-0 text-[0.6rem];
    margin-right: -0.125rem;
    transition: opacity var(--sw-duration-fast);
  }
  .pending-clock--add {
    @apply text-amber-400;
  }
  .pending-clock--mixed {
    @apply text-red-400;
  }

  /* Scheduled group states */
  .group-row--removing .group-naam {
    @apply line-through text-red-400;
  }
  .group-row--adding .group-naam {
    @apply text-green-600 italic;
  }
</style>
