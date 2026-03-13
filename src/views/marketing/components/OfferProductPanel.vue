<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import type {
    OfferProduct as Product,
    OfferGroup as Group,
    PendingGroupChanges,
    PendingSiteChange,
  } from '@/types/offer';

  const props = defineProps<{
    products: Product[];
    selectedGroupId: number | null;
    selectedPath: Group[];
    pendingChanges: Record<number, PendingGroupChanges>;
    pendingSiteChanges: PendingSiteChange[];
    isVerlopen: boolean;
    groupNaam: string;
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

  // ── Local state ──────────────────────────────────────────────────
  const productSearch = ref('');
  const selectedProducts = ref<Product[]>([]);
  const productRows = ref(15);
  const productFirst = ref(0);
  const productMenuRef = ref<any>(null);
  const csvDeleteInput = ref<HTMLInputElement | null>(null);
  const wijzigingenOpen = ref(false);

  // ── Computed ─────────────────────────────────────────────────────
  const activeProducts = computed(() => {
    if (!productSearch.value.trim()) return props.products;
    const q = productSearch.value.trim().toLowerCase();
    return props.products.filter(
      (p) =>
        p.code.toLowerCase().includes(q) ||
        p.merk.toLowerCase().includes(q) ||
        p.site.toLowerCase().includes(q)
    );
  });

  const paginatedProducts = computed(() =>
    activeProducts.value.slice(productFirst.value, productFirst.value + productRows.value)
  );

  const selectedGroupPending = computed((): PendingGroupChanges | null =>
    props.selectedGroupId !== null ? (props.pendingChanges[props.selectedGroupId] ?? null) : null
  );

  const pendingAddCount = computed(() => {
    const p = selectedGroupPending.value;
    if (!p || p.groupAction) return 0;
    return (
      p.options.filter((c) => c.action === 'add').length +
      p.products.filter((c) => c.action === 'add').length
    );
  });

  const pendingRemoveCount = computed(() => {
    const p = selectedGroupPending.value;
    if (!p || p.groupAction) return 0;
    return (
      p.options.filter((c) => c.action === 'remove').length +
      p.products.filter((c) => c.action === 'remove').length
    );
  });

  const PRODUCT_PREVIEW = 6;
  const LARGE_THRESHOLD = 50;
  const showAllProducts = ref(false);
  const showProductsDialog = ref(false);
  const dialogSearch = ref('');

  const pendingProductAddCount = computed(
    () => selectedGroupPending.value?.products.filter((c) => c.action === 'add').length ?? 0
  );
  const pendingProductRemoveCount = computed(
    () => selectedGroupPending.value?.products.filter((c) => c.action === 'remove').length ?? 0
  );
  const totalPendingProducts = computed(
    () => selectedGroupPending.value?.products.length ?? 0
  );
  const isLargeList = computed(() => totalPendingProducts.value > LARGE_THRESHOLD);
  const visiblePendingProducts = computed(() => {
    const list = selectedGroupPending.value?.products ?? [];
    return showAllProducts.value ? list : list.slice(0, PRODUCT_PREVIEW);
  });
  const hiddenPendingCount = computed(() => Math.max(0, totalPendingProducts.value - PRODUCT_PREVIEW));
  const dialogProducts = computed(() => {
    const list = selectedGroupPending.value?.products ?? [];
    if (!dialogSearch.value.trim()) return list;
    const q = dialogSearch.value.trim().toLowerCase();
    return list.filter((p) => p.code.toLowerCase().includes(q) || p.merk.toLowerCase().includes(q));
  });

  // ── Watchers ─────────────────────────────────────────────────────
  watch(productSearch, () => {
    productFirst.value = 0;
  });

  watch(
    () => props.selectedGroupId,
    () => {
      wijzigingenOpen.value = false;
      showAllProducts.value = false;
      showProductsDialog.value = false;
      dialogSearch.value = '';
      selectedProducts.value = [];
      productSearch.value = '';
      productFirst.value = 0;
    }
  );

  // ── Actions ───────────────────────────────────────────────────────
  function onPage(e: { first: number; rows: number }) {
    productFirst.value = e.first;
    productRows.value = e.rows;
  }

  function deleteSelected() {
    emit(
      'delete-products',
      selectedProducts.value.map((p) => p.id)
    );
    selectedProducts.value = [];
  }

  function deleteAll() {
    emit('delete-all-products');
    selectedProducts.value = [];
    productMenuRef.value?.hide();
  }

  function deleteFiltered() {
    emit(
      'delete-filtered-products',
      activeProducts.value.map((p) => p.id)
    );
    selectedProducts.value = [];
    productSearch.value = '';
    productMenuRef.value?.hide();
  }

  function onCsvDeleteInput(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const codes = new Set(
        text
          .split(/[\n,;]/)
          .map((c) => c.trim().toUpperCase())
          .filter((c) => c.length > 0)
      );
      emit('delete-csv-products', codes);
      selectedProducts.value = [];
    };
    reader.readAsText(file);
    (e.target as HTMLInputElement).value = '';
    productMenuRef.value?.hide();
  }

  function clearSelection() {
    selectedProducts.value = [];
  }
</script>

<template>
  <div class="products-panel">
    <template v-if="selectedGroupId !== null">
      <!-- ── Row 1: breadcrumb + group actions ────────────────────── -->
      <div class="products-panel__header">
        <div class="products-nav">
          <template v-for="(pathNode, i) in selectedPath" :key="pathNode.id">
            <button
              class="nav-crumb"
              :class="{ 'nav-crumb--leaf': i === selectedPath.length - 1 }"
              @click="i < selectedPath.length - 1 ? emit('select-group', pathNode.id) : undefined"
            >
              {{ pathNode.naam }}
            </button>
            <i v-if="i < selectedPath.length - 1" class="pi pi-chevron-right nav-sep" />
          </template>
          <span class="nav-count">{{ activeProducts.length }}</span>
        </div>
        <div class="header-group-actions">
          <Button
            label="Bewerken"
            icon="pi pi-pencil"
            severity="secondary"
            text
            size="small"
            @click="emit('edit-group', selectedGroupId!)"
          />
          <Button
            v-if="!isVerlopen"
            label="Verwijderen"
            icon="pi pi-trash"
            severity="danger"
            text
            size="small"
            @click="emit('delete-group', selectedGroupId!)"
          />
        </div>
      </div>

      <!-- ── Wijzigingen vannacht ─────────────────────────────────── -->
      <Transition name="fade">
        <div v-if="selectedGroupPending" class="wijz-strip">
          <button class="wijz-hdr" @click="wijzigingenOpen = !wijzigingenOpen">
            <div class="wijz-hdr__left">
              <i class="pi pi-clock wijz-clock" />
              <span class="wijz-hdr__label">Vannacht</span>
              <template v-if="selectedGroupPending!.groupAction">
                <span
                  class="wijz-badge"
                  :class="
                    selectedGroupPending!.groupAction === 'remove'
                      ? 'wijz-badge--remove'
                      : 'wijz-badge--add'
                  "
                >
                  Groep
                  {{ selectedGroupPending!.groupAction === 'remove' ? 'verwijderd' : 'toegevoegd' }}
                </span>
              </template>
              <template v-else>
                <span v-if="pendingAddCount" class="wijz-badge wijz-badge--add"
                  >+{{ pendingAddCount }}</span
                >
                <span v-if="pendingRemoveCount" class="wijz-badge wijz-badge--remove"
                  >−{{ pendingRemoveCount }}</span
                >
              </template>
            </div>
            <i
              class="pi wijz-chevron"
              :class="wijzigingenOpen ? 'pi-chevron-up' : 'pi-chevron-down'"
            />
          </button>
          <Transition name="collapse">
            <div v-if="wijzigingenOpen" class="wijz-list">
              <!-- Group-level action notice -->
              <template v-if="selectedGroupPending!.groupAction">
                <div
                  class="wijz-group-action"
                  :class="`wijz-group-action--${selectedGroupPending!.groupAction}`"
                >
                  <i
                    :class="`pi ${selectedGroupPending!.groupAction === 'remove' ? 'pi-trash' : 'pi-plus-circle'}`"
                  />
                  <span
                    >Deze groep wordt vannacht
                    {{
                      selectedGroupPending!.groupAction === 'remove' ? 'verwijderd' : 'toegevoegd'
                    }}</span
                  >
                </div>
              </template>

              <!-- Option changes -->
              <template v-if="selectedGroupPending!.options.length">
                <div v-if="selectedGroupPending!.groupAction" class="wijz-separator" />
                <div class="wijz-section-label">Opties</div>
                <div class="wijz-options">
                  <div
                    v-for="opt in selectedGroupPending!.options"
                    :key="opt.label + opt.action"
                    class="wijz-opt-chip"
                    :class="`wijz-opt-chip--${opt.action}`"
                  >
                    <i :class="`pi ${opt.icon} wijz-opt-icon`" />
                    <span class="wijz-opt-label">{{ opt.label }}</span>
                    <span class="wijz-opt-action">{{
                      opt.action === 'add' ? 'toegevoegd' : 'verwijderd'
                    }}</span>
                  </div>
                </div>
                <div v-if="selectedGroupPending!.products.length" class="wijz-separator" />
              </template>

              <!-- Product changes -->
              <template v-if="selectedGroupPending!.products.length">
                <div class="wijz-section-label">
                  Producten
                  <span class="wijz-prod-counts">
                    <span v-if="pendingProductAddCount" class="wijz-prod-count--add"
                      >+{{ pendingProductAddCount }}</span
                    >
                    <span v-if="pendingProductRemoveCount" class="wijz-prod-count--remove"
                      >−{{ pendingProductRemoveCount }}</span
                    >
                  </span>
                </div>
                <div
                  v-for="change in visiblePendingProducts"
                  :key="change.code + change.action"
                  class="wijz-item"
                  :class="`wijz-item--${change.action}`"
                >
                  <span class="wijz-sign">{{ change.action === 'add' ? '+' : '−' }}</span>
                  <span class="wijz-code">{{ change.code }}</span>
                  <span class="wijz-merk">{{ change.merk }}</span>
                </div>
                <button
                  v-if="!showAllProducts && hiddenPendingCount > 0"
                  class="wijz-show-more"
                  @click="isLargeList ? (showProductsDialog = true) : (showAllProducts = true)"
                >
                  en {{ hiddenPendingCount }} meer&hellip;
                </button>
              </template>
            </div>
          </Transition>
        </div>
      </Transition>

      <!-- ── Products dialog (large lists) ─────────────────────────── -->
      <Dialog
        v-model:visible="showProductsDialog"
        modal
        :header="`Wijzigingen vannacht · ${totalPendingProducts} producten`"
        :style="{ width: '480px' }"
        @hide="dialogSearch = ''"
      >
        <div class="pdlg-body">
          <div class="pdlg-summary">
            <span v-if="pendingProductAddCount" class="pdlg-sum--add"
              >+{{ pendingProductAddCount }} toegevoegd</span
            >
            <span
              v-if="pendingProductAddCount && pendingProductRemoveCount"
              class="pdlg-sum-sep"
            >·</span>
            <span v-if="pendingProductRemoveCount" class="pdlg-sum--remove"
              >−{{ pendingProductRemoveCount }} verwijderd</span
            >
          </div>
          <IconField class="pdlg-search">
            <InputIcon class="pi pi-search" />
            <InputText
              v-model="dialogSearch"
              placeholder="Zoeken op code of merk…"
              size="small"
              class="w-full"
              autofocus
            />
          </IconField>
          <div class="pdlg-list">
            <div
              v-for="change in dialogProducts"
              :key="change.code + change.action"
              class="pdlg-item"
              :class="`pdlg-item--${change.action}`"
            >
              <span class="pdlg-sign">{{ change.action === 'add' ? '+' : '−' }}</span>
              <span class="pdlg-code">{{ change.code }}</span>
              <span class="pdlg-merk">{{ change.merk }}</span>
            </div>
            <div v-if="dialogProducts.length === 0" class="pdlg-empty">
              Geen resultaten gevonden
            </div>
          </div>
        </div>
      </Dialog>

      <!-- ── Row 2: search + add + delete ──────────────────────────── -->
      <div class="products-toolbar">
        <IconField class="flex-1">
          <InputIcon class="pi pi-search" />
          <InputText
            v-model="productSearch"
            placeholder="Zoeken op code, merk of site…"
            size="small"
            class="w-full"
          />
        </IconField>
        <template v-if="!isVerlopen">
          <Button label="Toevoegen" icon="pi pi-plus" size="small" @click="emit('add-products')" />
          <Button
            icon="pi pi-trash"
            label="Verwijderen"
            severity="danger"
            outlined
            size="small"
            @click="productMenuRef?.toggle($event)"
          />
          <Popover ref="productMenuRef">
            <div class="ctx-menu">
              <button
                v-if="productSearch.trim()"
                class="ctx-item ctx-item--danger"
                @click="deleteFiltered"
              >
                <i class="pi pi-filter" />Verwijder zoekresultaten ({{ activeProducts.length }})
              </button>
              <button class="ctx-item ctx-item--danger" @click="csvDeleteInput?.click()">
                <i class="pi pi-file-import" />Verwijder via CSV
              </button>
              <div class="ctx-sep" />
              <button class="ctx-item ctx-item--danger" @click="deleteAll">
                <i class="pi pi-trash" />Verwijder alle producten
              </button>
            </div>
          </Popover>
          <input
            ref="csvDeleteInput"
            type="file"
            accept=".csv"
            class="hidden"
            @change="onCsvDeleteInput"
          />
        </template>
      </div>

      <!-- ── Empty: no products ──────────────────────────────────────── -->
      <div v-if="activeProducts.length === 0 && !productSearch.trim()" class="products-empty">
        <div class="products-empty__icon"><i class="pi pi-box" /></div>
        <p class="products-empty__title">Geen producten</p>
        <p class="products-empty__sub">
          Voeg producten toe aan <strong>{{ groupNaam }}</strong>
        </p>
        <Button
          v-if="!isVerlopen"
          label="Producten toevoegen"
          icon="pi pi-plus"
          outlined
          size="small"
          severity="secondary"
          @click="emit('add-products')"
        />
      </div>

      <!-- ── Empty: no search results ────────────────────────────────── -->
      <div v-else-if="activeProducts.length === 0" class="products-empty">
        <div class="products-empty__icon"><i class="pi pi-search" /></div>
        <p class="products-empty__title">Geen resultaten</p>
        <p class="products-empty__sub">Niets gevonden voor "{{ productSearch }}"</p>
        <button class="products-empty__reset" @click="productSearch = ''">
          Zoekopdracht wissen
        </button>
      </div>

      <!-- ── Table + paginator ────────────────────────────────────────── -->
      <template v-else>
        <Paginator
          :first="productFirst"
          :rows="productRows"
          :total-records="activeProducts.length"
          :rows-per-page-options="[15, 25, 50]"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          class="products-pager"
          @page="onPage"
        />
        <div class="products-table-wrap">
          <DataTable
            v-model:selection="selectedProducts"
            :value="paginatedProducts"
            class="products-table"
            selection-mode="multiple"
            :meta-key-selection="false"
          >
            <Column selection-mode="multiple" style="width: 2.5rem; padding-left: 0.75rem" />
            <Column field="code" header="Productcode">
              <template #body="{ data }">
                <span class="font-medium text-surface-700 tabular-nums">{{ data.code }}</span>
              </template>
            </Column>
            <Column field="site" header="Site" style="width: 6rem">
              <template #body="{ data }">
                <span class="site-tag">{{ data.site }}</span>
              </template>
            </Column>
            <Column field="merk" header="Merk / Serie">
              <template #body="{ data }">
                <span class="text-surface-500 text-sm">{{ data.merk }}</span>
              </template>
            </Column>
          </DataTable>
        </div>
      </template>

      <Transition name="slide-up">
        <div v-if="selectedProducts.length" class="selection-bar">
          <div class="selection-bar__inner">
            <span class="selection-bar__count">{{ selectedProducts.length }} geselecteerd</span>
            <div class="selection-bar__actions">
              <button class="selection-bar__clear" @click="clearSelection">Wissen</button>
              <Button
                label="Verwijderen"
                icon="pi pi-trash"
                severity="danger"
                size="small"
                @click="deleteSelected"
              />
            </div>
          </div>
        </div>
      </Transition>
    </template>
  </div>
</template>

<style scoped>
  .products-panel {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: clip;
    position: relative;
  }

  .products-panel__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem 0.5rem 1.25rem;
    min-height: 2.75rem;
    flex-shrink: 0;
    background: var(--p-gray-50);
    border-bottom: 1px solid var(--p-gray-100);
  }

  .products-toolbar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.75rem;
    border-bottom: 1px solid var(--p-gray-100);
    flex-shrink: 0;
  }

  .products-pager {
    border-bottom: 1px solid var(--p-surface-100);
    background: transparent;
    flex-shrink: 0;
    padding: 0.125rem 0.5rem;
  }
  .products-pager :deep(.p-paginator-page),
  .products-pager :deep(.p-paginator-first),
  .products-pager :deep(.p-paginator-prev),
  .products-pager :deep(.p-paginator-next),
  .products-pager :deep(.p-paginator-last) {
    min-width: 2rem;
    height: 2rem;
    font-size: 0.8125rem;
  }

  /* Breadcrumb nav */
  .products-nav {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    flex: 1;
    min-width: 0;
  }
  .nav-crumb {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--p-gray-400);
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    max-width: 16rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: color 0.1s;
  }
  .nav-crumb:hover {
    color: var(--p-gray-700);
  }
  .nav-crumb--leaf {
    color: var(--p-surface-700);
    cursor: default;
  }
  .nav-sep {
    font-size: 0.625rem;
    color: var(--p-gray-300);
  }
  .nav-count {
    font-size: 0.75rem;
    color: var(--p-gray-400);
    background: var(--p-gray-100);
    border-radius: 999px;
    padding: 0.1rem 0.5rem;
    flex-shrink: 0;
  }

  /* Header group action buttons */
  .header-group-actions {
    display: flex;
    align-items: center;
    gap: 0.125rem;
    flex-shrink: 0;
  }

  /* Empty states */
  .products-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.625rem;
    padding: 3rem 2rem;
    text-align: center;
  }
  .products-empty__icon {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    background: var(--p-gray-100);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.375rem;
    color: var(--p-gray-400);
    margin-bottom: 0.25rem;
  }
  .products-empty__title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--p-surface-600);
  }
  .products-empty__sub {
    font-size: 0.8125rem;
    color: var(--p-gray-400);
  }
  .products-empty__reset {
    font-size: 0.8125rem;
    color: var(--p-primary-600);
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: color 0.1s;
  }
  .products-empty__reset:hover {
    color: var(--p-primary-800);
    text-decoration: underline;
  }

  /* Table */
  .products-table-wrap {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
  .products-table :deep(th) {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--p-surface-400);
    background: transparent;
    border-bottom: 1px solid var(--p-surface-200);
    padding: 0.5rem 0.75rem;
  }
  .products-table :deep(td) {
    padding: 0.625rem 0.75rem;
    border-bottom: 1px solid var(--p-surface-100);
  }
  .products-table :deep(tr:last-child td) {
    border-bottom: none;
  }
  .products-table :deep(tr:hover td) {
    background: var(--p-surface-50);
  }
  .products-table :deep(.p-datatable-tbody > tr) {
    transition: background 0.1s;
  }

  .site-tag {
    display: inline-flex;
    align-items: center;
    padding: 0.125rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    background: var(--p-gray-100);
    color: var(--p-gray-600);
    white-space: nowrap;
  }

  /* Floating selection bar */
  .selection-bar {
    position: fixed;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 50;
    pointer-events: none;
  }
  .selection-bar__inner {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: var(--p-surface-800);
    color: white;
    border-radius: 2rem;
    padding: 0.5rem 0.625rem 0.5rem 1.25rem;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.22);
    pointer-events: all;
    white-space: nowrap;
  }
  .selection-bar__count {
    font-size: 0.875rem;
    font-weight: 500;
  }
  .selection-bar__actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .selection-bar__clear {
    font-size: 0.8125rem;
    color: rgba(255, 255, 255, 0.55);
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: color 0.1s;
  }
  .selection-bar__clear:hover {
    color: white;
  }

  /* Context menus */
  .ctx-menu {
    display: flex;
    flex-direction: column;
    min-width: 10rem;
  }
  .ctx-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    text-align: left;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    color: var(--p-gray-700);
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 0.25rem;
    transition: background 0.1s;
  }
  .ctx-item:hover {
    background: var(--p-gray-50);
  }
  .ctx-item--danger {
    color: var(--p-red-600);
  }
  .ctx-item--danger:hover {
    background: var(--p-red-50);
  }
  .ctx-sep {
    height: 1px;
    background: var(--p-gray-100);
    margin: 0.25rem 0;
  }

  /* Wijzigingen vannacht strip */
  .wijz-strip {
    flex-shrink: 0;
    border-bottom: 1px solid var(--p-gray-100);
  }
  .wijz-hdr {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.375rem 1rem;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background 0.1s;
  }
  .wijz-hdr:hover {
    background: var(--p-gray-50);
  }
  .wijz-hdr__left {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  .wijz-hdr__label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--p-gray-500);
  }
  .wijz-clock {
    font-size: 0.75rem;
    color: var(--p-gray-400);
  }
  .wijz-chevron {
    font-size: 0.6rem;
    color: var(--p-gray-400);
  }
  .wijz-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.05rem 0.4rem;
    border-radius: 999px;
    font-size: 0.73rem;
    font-weight: 700;
    line-height: 1.4;
  }
  .wijz-badge--add {
    background: var(--p-green-100);
    color: var(--p-green-700);
  }
  .wijz-badge--remove {
    background: var(--p-red-100);
    color: var(--p-red-600);
  }

  .wijz-list {
    display: flex;
    flex-direction: column;
    padding: 0 1rem 0.625rem;
    gap: 0.2rem;
    max-height: 16rem;
    overflow-y: auto;
  }
  .wijz-show-more {
    align-self: flex-start;
    margin-top: 0.1rem;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.75rem;
    color: var(--p-primary-500);
    font-weight: 500;
  }
  .wijz-show-more:hover {
    text-decoration: underline;
  }

  .wijz-group-action {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.8125rem;
    font-weight: 500;
  }
  .wijz-group-action--remove {
    background: var(--p-red-50);
    color: var(--p-red-600);
  }
  .wijz-group-action--add {
    background: var(--p-green-50);
    color: var(--p-green-700);
  }
  .wijz-group-action .pi {
    font-size: 0.75rem;
  }

  .wijz-section-label {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--p-gray-400);
    padding: 0.25rem 0 0.125rem;
  }
  .wijz-prod-counts {
    display: flex;
    gap: 0.25rem;
  }
  .wijz-prod-count--add {
    color: var(--p-green-600);
    font-weight: 700;
  }
  .wijz-prod-count--remove {
    color: var(--p-red-500);
    font-weight: 700;
  }
  .wijz-separator {
    height: 1px;
    background: var(--p-gray-100);
    margin: 0.375rem 0;
  }

  .wijz-options {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    padding-bottom: 0.125rem;
  }
  .wijz-opt-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.2rem 0.55rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 500;
    border: 1px solid transparent;
  }
  .wijz-opt-chip--add {
    background: var(--p-green-50);
    color: var(--p-green-700);
    border-color: var(--p-green-200);
  }
  .wijz-opt-chip--remove {
    background: var(--p-red-50);
    color: var(--p-red-600);
    border-color: var(--p-red-200);
  }
  .wijz-opt-icon {
    font-size: 0.65rem;
  }
  .wijz-opt-action {
    font-weight: 400;
    opacity: 0.7;
  }

  .wijz-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
  }
  .wijz-sign {
    font-weight: 700;
    width: 0.75rem;
    text-align: center;
    flex-shrink: 0;
  }
  .wijz-item--add .wijz-sign {
    color: var(--p-green-600);
  }
  .wijz-item--remove .wijz-sign {
    color: var(--p-red-500);
  }
  .wijz-code {
    font-family: monospace;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--p-surface-700);
  }
  .wijz-merk {
    color: var(--p-gray-400);
    font-size: 0.75rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Transitions */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.15s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .slide-up-enter-active {
    transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .slide-up-leave-active {
    transition: all 0.15s ease;
  }
  .slide-up-enter-from {
    opacity: 0;
    transform: translateX(-50%) translateY(0.75rem) scale(0.95);
  }
  .slide-up-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(0.5rem) scale(0.97);
  }

  /* Products dialog */
  .pdlg-body {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .pdlg-summary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
    font-weight: 500;
  }
  .pdlg-sum--add {
    color: var(--p-green-600);
  }
  .pdlg-sum--remove {
    color: var(--p-red-500);
  }
  .pdlg-sum-sep {
    color: var(--p-gray-300);
  }
  .pdlg-search {
    width: 100%;
  }
  .pdlg-list {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    max-height: 22rem;
    overflow-y: auto;
  }
  .pdlg-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
    padding: 0.1rem 0;
  }
  .pdlg-sign {
    font-weight: 700;
    width: 0.75rem;
    text-align: center;
    flex-shrink: 0;
  }
  .pdlg-item--add .pdlg-sign {
    color: var(--p-green-600);
  }
  .pdlg-item--remove .pdlg-sign {
    color: var(--p-red-500);
  }
  .pdlg-code {
    font-family: monospace;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--p-surface-700);
    flex-shrink: 0;
  }
  .pdlg-merk {
    color: var(--p-gray-400);
    font-size: 0.75rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .pdlg-empty {
    font-size: 0.8125rem;
    color: var(--p-gray-400);
    text-align: center;
    padding: 1rem 0;
  }
</style>
