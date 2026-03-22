<script setup lang="ts">
  import { computed, watch, ref } from 'vue';
  import type {
    OfferProduct as Product,
    OfferGroup as Group,
    PendingGroupChanges,
    PendingSiteChange,
  } from '@/types/offer';
  import OfferProductTable from './offer/OfferProductTable.vue';
  import OfferPendingChanges from './offer/OfferPendingChanges.vue';

  const props = defineProps<{
    products: Product[];
    selectedGroupId: number | null;
    selectedPath: Group[];
    pendingChanges: Record<number, PendingGroupChanges>;
    pendingSiteChanges: PendingSiteChange[];
    isVerlopen: boolean;
    groupName: string;
  }>();

  const emit = defineEmits<{
    (e: 'add-products'): void;
    (e: 'delete-products', ids: number[]): void;
    (e: 'delete-all-products'): void;
    (e: 'delete-filtered-products', ids: number[]): void;
    (e: 'delete-csv-products', codes: Set<string>): void;
    (e: 'select-group', id: number): void;
    (e: 'edit-group', id: number): void;
    (e: 'delete-group', id: number): void;
  }>();

  const pendingChangesRef = ref<InstanceType<typeof OfferPendingChanges> | null>(null);

  const selectedGroupPending = computed((): PendingGroupChanges | null =>
    props.selectedGroupId !== null ? (props.pendingChanges[props.selectedGroupId] ?? null) : null
  );

  watch(
    () => props.selectedGroupId,
    () => { pendingChangesRef.value?.reset(); }
  );
</script>

<template>
  <div class="products-panel">
    <template v-if="selectedGroupId !== null">
      <!-- breadcrumb header + group actions -->
      <div class="products-panel__header">
        <div class="products-nav">
          <template v-for="(pathNode, i) in selectedPath" :key="pathNode.id">
            <button class="nav-crumb" :class="{ 'nav-crumb--leaf': i === selectedPath.length - 1 }"
              @click="i < selectedPath.length - 1 ? emit('select-group', pathNode.id) : undefined">
              {{ pathNode.name }}
            </button>
            <i v-if="i < selectedPath.length - 1" class="pi pi-chevron-right nav-sep" />
          </template>
        </div>
        <div class="header-group-actions">
          <Button label="Bewerken" icon="pi pi-pencil" severity="secondary" text size="small" @click="emit('edit-group', selectedGroupId!)" />
          <Button v-if="!isVerlopen" label="Verwijderen" icon="pi pi-trash" severity="danger" text size="small" @click="emit('delete-group', selectedGroupId!)" />
        </div>
      </div>

      <!-- wijzigingen vannacht strip -->
      <Transition name="fade">
        <OfferPendingChanges
          v-if="selectedGroupPending"
          ref="pendingChangesRef"
          :pending="selectedGroupPending"
        />
      </Transition>

      <!-- toolbar + table + selection bar -->
      <OfferProductTable
        :products="products"
        :selected-group-id="selectedGroupId"
        :is-verlopen="isVerlopen"
        :group-name="groupName"
        @add-products="emit('add-products')"
        @delete-products="emit('delete-products', $event)"
        @delete-all-products="emit('delete-all-products')"
        @delete-filtered-products="emit('delete-filtered-products', $event)"
        @delete-csv-products="emit('delete-csv-products', $event)"
      />
    </template>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";
  .products-panel { @apply flex-1 min-w-0 flex flex-col overflow-clip relative; }
  .products-panel__header { @apply flex items-center justify-between shrink-0 bg-(--sw-bg-subtle) border-b border-(--sw-border-md) gap-3 py-2 pr-3 pl-5; min-height: 2.75rem; }
  .products-nav { @apply flex items-center flex-1 min-w-0 gap-1.5; }
  .nav-crumb { @apply text-base font-medium text-(--sw-text-muted) cursor-pointer overflow-hidden whitespace-nowrap; background: none; border: none; padding: 0; max-width: 16rem; text-overflow: ellipsis; transition: color var(--sw-duration-fast) var(--sw-ease); }
  .nav-crumb:hover { @apply text-(--sw-text-sub); }
  .nav-crumb--leaf { @apply text-(--sw-text-strong) cursor-default; }
  .nav-sep { @apply text-(--sw-text-faint) sw-title; }
  .header-group-actions { @apply flex items-center shrink-0 gap-0.5; }
  .fade-enter-active, .fade-leave-active { transition: opacity var(--sw-duration-base) var(--sw-ease); }
  .fade-enter-from, .fade-leave-to { @apply opacity-0; }
</style>
