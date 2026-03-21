<script setup lang="ts">
  import { ref, computed } from 'vue';
  import type { PendingGroupChanges } from '@/types/offer';

  const props = defineProps<{
    pending: PendingGroupChanges;
  }>();

  const wijzigingenOpen = ref(false);
  const showAllProducts = ref(false);
  const showProductsDialog = ref(false);
  const dialogSearch = ref('');

  const PRODUCT_PREVIEW = 6;
  const LARGE_THRESHOLD = 50;

  const pendingAddCount = computed(() => {
    if (props.pending.groupAction) return 0;
    return props.pending.options.filter((c) => c.action === 'add').length + props.pending.products.filter((c) => c.action === 'add').length;
  });
  const pendingRemoveCount = computed(() => {
    if (props.pending.groupAction) return 0;
    return props.pending.options.filter((c) => c.action === 'remove').length + props.pending.products.filter((c) => c.action === 'remove').length;
  });
  const pendingProductAddCount = computed(() => props.pending.products.filter((c) => c.action === 'add').length);
  const pendingProductRemoveCount = computed(() => props.pending.products.filter((c) => c.action === 'remove').length);
  const totalPendingProducts = computed(() => props.pending.products.length);
  const isLargeList = computed(() => totalPendingProducts.value > LARGE_THRESHOLD);
  const visiblePendingProducts = computed(() => {
    const list = props.pending.products;
    return showAllProducts.value ? list : list.slice(0, PRODUCT_PREVIEW);
  });
  const hiddenPendingCount = computed(() => Math.max(0, totalPendingProducts.value - PRODUCT_PREVIEW));
  const dialogProducts = computed(() => {
    const list = props.pending.products;
    if (!dialogSearch.value.trim()) return list;
    const q = dialogSearch.value.trim().toLowerCase();
    return list.filter((p) => p.code.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
  });

  function reset() {
    wijzigingenOpen.value = false;
    showAllProducts.value = false;
    showProductsDialog.value = false;
    dialogSearch.value = '';
  }

  defineExpose({ reset });
</script>

<template>
  <div class="wijz-strip">
    <button class="wijz-hdr" @click="wijzigingenOpen = !wijzigingenOpen">
      <div class="wijz-hdr__left">
        <i class="pi pi-clock wijz-clock" />
        <span class="wijz-hdr__label">Vannacht</span>
        <template v-if="pending.groupAction">
          <span class="wijz-badge" :class="pending.groupAction === 'remove' ? 'wijz-badge--remove' : 'wijz-badge--add'">
            Groep {{ pending.groupAction === 'remove' ? 'verwijderd' : 'toegevoegd' }}
          </span>
        </template>
        <template v-else>
          <span v-if="pendingAddCount" class="wijz-badge wijz-badge--add">+{{ pendingAddCount }}</span>
          <span v-if="pendingRemoveCount" class="wijz-badge wijz-badge--remove">−{{ pendingRemoveCount }}</span>
        </template>
      </div>
      <i class="pi wijz-chevron" :class="wijzigingenOpen ? 'pi-chevron-up' : 'pi-chevron-down'" />
    </button>

    <Transition name="collapse">
      <div v-if="wijzigingenOpen" class="wijz-list">
        <template v-if="pending.groupAction">
          <div class="wijz-group-action" :class="`wijz-group-action--${pending.groupAction}`">
            <i :class="`pi ${pending.groupAction === 'remove' ? 'pi-trash' : 'pi-plus-circle'}`" />
            <span>Deze groep wordt vannacht {{ pending.groupAction === 'remove' ? 'verwijderd' : 'toegevoegd' }}</span>
          </div>
        </template>

        <template v-if="pending.options.length">
          <div v-if="pending.groupAction" class="wijz-separator" />
          <div class="wijz-section-label">Opties</div>
          <div class="wijz-options">
            <div v-for="opt in pending.options" :key="opt.label + opt.action" class="wijz-opt-chip" :class="`wijz-opt-chip--${opt.action}`">
              <i :class="`pi ${opt.icon} wijz-opt-icon`" />
              <span class="wijz-opt-label">{{ opt.label }}</span>
              <span class="wijz-opt-action">{{ opt.action === 'add' ? 'toegevoegd' : 'verwijderd' }}</span>
            </div>
          </div>
          <div v-if="pending.products.length" class="wijz-separator" />
        </template>

        <template v-if="pending.products.length">
          <div class="wijz-section-label">
            Producten
            <span class="wijz-prod-counts">
              <span v-if="pendingProductAddCount" class="wijz-prod-count--add">+{{ pendingProductAddCount }}</span>
              <span v-if="pendingProductRemoveCount" class="wijz-prod-count--remove">−{{ pendingProductRemoveCount }}</span>
            </span>
          </div>
          <div v-for="change in visiblePendingProducts" :key="change.code + change.action" class="wijz-item" :class="`wijz-item--${change.action}`">
            <span class="wijz-sign">{{ change.action === 'add' ? '+' : '−' }}</span>
            <span class="wijz-code">{{ change.code }}</span>
            <span class="wijz-merk">{{ change.brand }}</span>
          </div>
          <button v-if="!showAllProducts && hiddenPendingCount > 0" class="wijz-show-more"
            @click="isLargeList ? (showProductsDialog = true) : (showAllProducts = true)">
            en {{ hiddenPendingCount }} meer&hellip;
          </button>
        </template>
      </div>
    </Transition>
  </div>

  <Dialog v-model:visible="showProductsDialog" modal :header="`Wijzigingen vannacht · ${totalPendingProducts} producten`" :style="{ width: '30rem' }" @hide="dialogSearch = ''">
    <div class="pdlg-body">
      <div class="pdlg-summary">
        <span v-if="pendingProductAddCount" class="pdlg-sum--add">+{{ pendingProductAddCount }} toegevoegd</span>
        <span v-if="pendingProductAddCount && pendingProductRemoveCount" class="pdlg-sum-sep">·</span>
        <span v-if="pendingProductRemoveCount" class="pdlg-sum--remove">−{{ pendingProductRemoveCount }} verwijderd</span>
      </div>
      <IconField class="pdlg-search">
        <InputIcon class="pi pi-search" />
        <InputText v-model="dialogSearch" placeholder="Zoeken op code of merk…" size="small" class="w-full" autofocus />
      </IconField>
      <div class="pdlg-list">
        <div v-for="change in dialogProducts" :key="change.code + change.action" class="pdlg-item" :class="`pdlg-item--${change.action}`">
          <span class="pdlg-sign">{{ change.action === 'add' ? '+' : '−' }}</span>
          <span class="pdlg-code">{{ change.code }}</span>
          <span class="pdlg-merk">{{ change.brand }}</span>
        </div>
        <div v-if="dialogProducts.length === 0" class="pdlg-empty">Geen resultaten gevonden</div>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
@reference "@/assets/style.css";
  .wijz-strip { @apply shrink-0 border-b border-[var(--p-gray-100)]; }
  .wijz-hdr { @apply flex items-center justify-between w-full cursor-pointer text-left py-1.5 px-4; background: none; border: none; transition: background var(--sw-duration-fast); }
  .wijz-hdr:hover { background: var(--p-gray-50); }
  .wijz-hdr__left { @apply flex items-center; gap: 0.4rem; }
  .wijz-hdr__label { @apply text-xs font-medium text-[var(--p-gray-500)]; }
  .wijz-clock { @apply text-xs text-[var(--p-gray-400)]; }
  .wijz-chevron { @apply text-[var(--p-gray-400)]; font-size: 0.6rem; }
  .wijz-badge { @apply inline-flex items-center rounded-full font-bold leading-[1.4]; padding: 0.05rem 0.4rem; font-size: 0.73rem; }
  .wijz-badge--add { @apply bg-[var(--p-green-100)] text-[var(--p-green-700)]; }
  .wijz-badge--remove { @apply bg-[var(--p-red-100)] text-[var(--p-red-600)]; }
  .wijz-list { @apply flex flex-col overflow-y-auto px-4 pb-2.5; gap: 0.2rem; max-height: 16rem; }
  .wijz-show-more { @apply self-start cursor-pointer text-xs text-[var(--p-primary-500)] font-medium; margin-top: 0.1rem; padding: 0; background: none; border: none; }
  .wijz-show-more:hover { text-decoration: underline; }
  .wijz-group-action { @apply flex items-center rounded-md font-medium gap-2 py-1.5 px-2; font-size: 0.8125rem; }
  .wijz-group-action--remove { @apply bg-[var(--p-red-50)] text-[var(--p-red-600)]; }
  .wijz-group-action--add { @apply bg-[var(--p-green-50)] text-[var(--p-green-700)]; }
  .wijz-group-action .pi { font-size: 0.75rem; }
  .wijz-section-label { @apply flex items-center font-bold uppercase text-[var(--p-gray-400)] gap-1.5 pt-1 pb-0.5; font-size: 0.6875rem; letter-spacing: 0.05em; }
  .wijz-prod-counts { @apply flex gap-1; }
  .wijz-prod-count--add { @apply text-[var(--p-green-600)] font-bold; }
  .wijz-prod-count--remove { @apply text-[var(--p-red-500)] font-bold; }
  .wijz-separator { @apply h-px bg-[var(--p-gray-100)] my-1.5; }
  .wijz-options { @apply flex flex-wrap gap-1.5 pb-0.5; }
  .wijz-opt-chip { @apply inline-flex items-center rounded-full text-xs font-medium border border-transparent; gap: 0.3rem; padding: 0.2rem 0.55rem; }
  .wijz-opt-chip--add { @apply bg-[var(--p-green-50)] text-[var(--p-green-700)] border-[var(--p-green-200)]; }
  .wijz-opt-chip--remove { @apply bg-[var(--p-red-50)] text-[var(--p-red-600)] border-[var(--p-red-200)]; }
  .wijz-opt-icon { font-size: 0.65rem; }
  .wijz-opt-action { @apply font-normal opacity-70; }
  .wijz-item { @apply flex items-center gap-2; font-size: 0.8125rem; }
  .wijz-sign { @apply font-bold text-center shrink-0; width: 0.75rem; }
  .wijz-item--add .wijz-sign { @apply text-[var(--p-green-600)]; }
  .wijz-item--remove .wijz-sign { @apply text-[var(--p-red-500)]; }
  .wijz-code { @apply font-medium text-[var(--p-surface-700)]; font-family: monospace; font-size: 0.8rem; }
  .wijz-merk { @apply text-[var(--p-gray-400)] text-xs whitespace-nowrap overflow-hidden; text-overflow: ellipsis; }
  /* collapse transition — defined globally in cards.css */
  .pdlg-body { @apply flex flex-col gap-3; }
  .pdlg-summary { @apply flex items-center font-medium gap-2; font-size: 0.8125rem; }
  .pdlg-sum--add { @apply text-[var(--p-green-600)]; }
  .pdlg-sum--remove { @apply text-[var(--p-red-500)]; }
  .pdlg-sum-sep { @apply text-[var(--p-gray-300)]; }
  .pdlg-search { @apply w-full; }
  .pdlg-list { @apply flex flex-col overflow-y-auto; gap: 0.15rem; max-height: 22rem; }
  .pdlg-item { @apply flex items-center gap-2; font-size: 0.8125rem; padding: 0.1rem 0; }
  .pdlg-sign { @apply font-bold text-center shrink-0; width: 0.75rem; }
  .pdlg-item--add .pdlg-sign { @apply text-[var(--p-green-600)]; }
  .pdlg-item--remove .pdlg-sign { @apply text-[var(--p-red-500)]; }
  .pdlg-code { @apply font-medium text-[var(--p-surface-700)] shrink-0; font-family: monospace; font-size: 0.8rem; }
  .pdlg-merk { @apply text-[var(--p-gray-400)] text-xs whitespace-nowrap overflow-hidden; text-overflow: ellipsis; }
  .pdlg-empty { @apply text-[var(--p-gray-400)] text-center py-4; font-size: 0.8125rem; }
</style>
