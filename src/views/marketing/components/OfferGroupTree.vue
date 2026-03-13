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
        <span class="group-naam flex-1 truncate">{{ node.naam }}</span>
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
  .groups-panel {
    width: 420px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    background: white;
    border-right: 1px solid var(--p-gray-100);
  }
  .groups-panel--headless {
    width: 100%;
    border-right: none;
    flex: 1;
    min-height: 0;
  }

  .groups-panel__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 0.75rem;
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--p-gray-400);
    border-bottom: 1px solid var(--p-gray-100);
    flex-shrink: 0;
  }

  .icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.375rem;
    height: 1.375rem;
    border-radius: 0.25rem;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--p-gray-400);
    transition:
      background 0.1s,
      color 0.1s;
  }
  .icon-btn:hover {
    background: var(--p-gray-200);
    color: var(--p-gray-700);
  }

  .groups-tree {
    flex: 1;
    overflow-y: auto;
    padding: 0.25rem;
  }

  .group-row {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.4rem 0.5rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background 0.1s;
    margin-bottom: 0.125rem;
    position: relative;
  }
  .group-row:hover {
    background: var(--p-gray-100);
  }
  .group-row:hover .row-actions {
    opacity: 1 !important;
  }
  .group-row:hover .item-count,
  .group-row:hover .pending-clock {
    opacity: 0;
  }
  .group-row--active {
    background: var(--p-primary-50);
  }

  .group-naam {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--p-gray-700);
  }
  .group-row--active .group-naam {
    color: var(--p-primary-700);
  }

  .item-count {
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--p-gray-400);
    background: var(--p-gray-100);
    border-radius: 999px;
    padding: 0.05rem 0.375rem;
    min-width: 1.25rem;
    text-align: center;
    transition: opacity 0.1s;
    flex-shrink: 0;
  }
  .group-row--active .item-count {
    background: var(--p-primary-100);
    color: var(--p-primary-600);
  }

  .row-actions {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    transition: opacity 0.1s;
  }

  .expand-btn,
  .row-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.375rem;
    height: 1.375rem;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--p-gray-400);
    border-radius: 0.25rem;
    transition:
      background 0.1s,
      color 0.1s;
    flex-shrink: 0;
  }
  .expand-btn:hover,
  .row-action-btn:hover {
    background: var(--p-gray-200);
    color: var(--p-gray-700);
  }

  .row-action-btn--danger:hover {
    background: var(--p-red-50) !important;
    color: var(--p-red-500) !important;
  }

  /* Pending clock dot */
  .pending-clock {
    font-size: 0.6rem;
    flex-shrink: 0;
    margin-right: -0.125rem;
    transition: opacity 0.1s;
  }
  .pending-clock--add {
    color: var(--p-amber-400);
  }
  .pending-clock--mixed {
    color: var(--p-red-400);
  }

  /* Scheduled group states */
  .group-row--removing .group-naam {
    text-decoration: line-through;
    color: var(--p-red-400);
  }
  .group-row--adding .group-naam {
    color: var(--p-green-600);
    font-style: italic;
  }
</style>
