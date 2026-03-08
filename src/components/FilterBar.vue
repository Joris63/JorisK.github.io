<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import type { FilterConfig } from '@/types/filters';
  import { useFilterBar } from '@/composables/useFilterBar';

  const props = defineProps<{
    allFilterDefs: FilterConfig[];
    defaultActiveKeys: (string | { key: string; value: any })[];
    searchPlaceholder?: string;
  }>();

  const emit = defineEmits<{
    filter: [values: Record<string, string | boolean | null>];
  }>();

  const {
    filterConfigs,
    pendingValues,
    appliedValues,
    addFilter,
    removeFilter,
    applyFilters,
    clearValues,
    clearPendingFilter,
    clearAppliedFilter,
    hasActiveFilters,
    hasPendingValues,
  } = useFilterBar(props.allFilterDefs, props.defaultActiveKeys);

  const pendingSearch = ref('');
  const appliedSearch = ref('');
  const customizePopoverRef = ref<any>(null);

  // ── Customize ─────────────────────────────────────────────────
  const customizeItems = computed(() =>
    props.allFilterDefs
      .filter((f) => !f.required)
      .map((f) => ({ ...f, active: filterConfigs.value.some((c) => c.key === f.key) }))
  );

  function toggleCustomize(key: string, active: boolean) {
    if (active) removeFilter(key);
    else addFilter(key);
  }

  // ── Emit ───────────────────────────────────────────────────────
  function emitFilter() {
    emit('filter', { q: appliedSearch.value, ...appliedValues.value });
  }

  // ── Apply (Filteren / Zoeken) ──────────────────────────────────
  function handleApply() {
    appliedSearch.value = pendingSearch.value;
    applyFilters();
    emitFilter();
  }

  // ── Wissen (clear pending only, no apply) ──────────────────────
  function handleClearPending() {
    pendingSearch.value = '';
    clearValues();
  }

  // ── Reset (clear everything + apply immediately) ───────────────
  function handleReset() {
    pendingSearch.value = '';
    appliedSearch.value = '';
    clearValues();
    applyFilters();
    emitFilter();
  }

  // ── Clear single applied filter from chip ──────────────────────
  function handleClearAppliedFilter(key: string) {
    if (key === '_search') {
      pendingSearch.value = '';
      appliedSearch.value = '';
    } else {
      clearAppliedFilter(key);
    }
    emitFilter();
  }

  // ── Active filter chips (from applied state) ───────────────────
  const activeChips = computed(() => {
    const chips: { key: string; label: string; value: string }[] = [];
    if (appliedSearch.value) {
      chips.push({ key: '_search', label: 'Zoeken', value: appliedSearch.value });
    }
    for (const filter of props.allFilterDefs) {
      const val = appliedValues.value[filter.key];
      if (val === '' || val === null || val === undefined) continue;
      const display =
        filter.type === 'boolean'
          ? val ? 'Ja' : 'Nee'
          : filter.type === 'select'
            ? (filter.options?.find((o) => o.value === val)?.label ?? String(val))
            : String(val);
      chips.push({ key: filter.key, label: filter.label, value: display });
    }
    return chips;
  });

  const hasAnythingApplied = computed(
    () => hasActiveFilters.value || !!appliedSearch.value
  );

  onMounted(() => {
    appliedSearch.value = pendingSearch.value;
    applyFilters();
    emitFilter();
  });
</script>

<template>
  <div class="filter-bar">
    <!-- ── Search row ─────────────────────────────────────────── -->
    <div class="search-row">
      <IconField class="flex-1">
        <InputIcon class="pi pi-search" />
        <InputText
          v-model="pendingSearch"
          :placeholder="searchPlaceholder ?? 'Zoeken...'"
          fluid
          @keydown.enter="handleApply"
        />
      </IconField>
      <Button label="Zoeken" severity="secondary" outlined @click="handleApply" />
    </div>

    <!-- ── Filter card ────────────────────────────────────────── -->
    <div class="filter-card">
      <!-- Card header -->
      <div class="filter-card__header">
        <span class="filter-card__title">Filters</span>
        <div class="filter-card__actions">
          <Transition name="fade">
            <button v-if="hasPendingValues || pendingSearch" class="clear-btn" @click="handleClearPending">
              <i class="pi pi-times" />
              Waardes wissen
            </button>
          </Transition>
          <Button label="Filteren" size="small" @click="handleApply" />
          <div class="filter-card__sep" />
          <button class="customize-btn" title="Filters aanpassen" @click="customizePopoverRef?.toggle($event)">
            <i class="pi pi-sliders-h" />
          </button>
          <Popover ref="customizePopoverRef">
            <div class="customize-popover">
              <p class="customize-popover__title">Filters aanpassen</p>
              <div class="customize-list">
                <label v-for="item in customizeItems" :key="item.key" class="customize-item">
                  <Checkbox
                    :model-value="item.active"
                    :binary="true"
                    @update:model-value="toggleCustomize(item.key, item.active)"
                  />
                  <span>{{ item.label }}</span>
                </label>
                <div v-if="!customizeItems.length" class="customize-empty">
                  Geen filters beschikbaar
                </div>
              </div>
            </div>
          </Popover>
        </div>
      </div>

      <!-- Filter modules -->
      <div class="filter-modules">
        <div v-for="filter in filterConfigs" :key="filter.key" class="filter-module">
          <!-- Label -->
          <span class="filter-module__label">{{ filter.label }}</span>
          <!-- Input + clear button -->
          <div class="filter-module__input-wrap">
            <InputText
              v-if="filter.type === 'text'"
              v-model="pendingValues[filter.key] as string"
              :placeholder="filter.placeholder"
              size="small"
              @keydown.enter="handleApply"
            />
            <Select
              v-else-if="filter.type === 'select'"
              v-model="pendingValues[filter.key]"
              :options="filter.options!"
              option-label="label"
              option-value="value"
              size="small"
            />
            <SelectButton
              v-else-if="filter.type === 'boolean'"
              v-model="pendingValues[filter.key]"
              :options="[
                { label: 'Ja', value: true },
                { label: 'Nee', value: false },
              ]"
              option-label="label"
              option-value="value"
            />
            <button
              v-if="pendingValues[filter.key] !== '' && pendingValues[filter.key] !== null"
              class="filter-module__clear"
              title="Waarde wissen"
              @click="clearPendingFilter(filter.key)"
            >
              <i class="pi pi-times" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Active filters section ─────────────────────────────── -->
    <Transition name="slide-fade">
      <div v-if="hasAnythingApplied" class="active-filters">
        <div class="active-filters__header">
          <span class="active-filters__label">Actieve filters</span>
          <button class="reset-btn" @click="handleReset">
            <i class="pi pi-times" />
            Alles wissen
          </button>
        </div>
        <div class="active-filters__chips">
          <span
            v-for="chip in activeChips"
            :key="chip.key"
            class="active-chip"
          >
            <span class="active-chip__label">{{ chip.label }}:</span>
            <span class="active-chip__value">{{ chip.value }}</span>
            <button class="active-chip__remove" @click="handleClearAppliedFilter(chip.key)">
              <i class="pi pi-times" />
            </button>
          </span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
  /* ── Filter bar wrapper ───────────────────────────────────── */
  .filter-bar {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  /* ── Search row ───────────────────────────────────────────── */
  .search-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* ── Filter card ──────────────────────────────────────────── */
  .filter-card {
    border: 1px solid var(--p-surface-200);
    border-radius: 0.5rem;
    background: white;
  }

  /* Card header */
  .filter-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--p-surface-100);
  }

  .filter-card__title {
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--p-surface-400);
  }

  .filter-card__actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .filter-card__sep {
    width: 1px;
    height: 1.25rem;
    background: var(--p-surface-200);
  }

  /* ── Filter modules ───────────────────────────────────────── */
  .filter-modules {
    display: flex;
    flex-wrap: wrap;
    gap: 0.625rem;
    padding: 0.625rem 0.75rem;
  }

  .filter-module {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    border: 1px solid var(--p-surface-200);
    border-radius: 0.4rem;
    padding: 0.4rem 0.625rem 0.5rem;
    background: var(--p-surface-50);
  }

  .filter-module__label {
    font-size: 0.625rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--p-surface-400);
    line-height: 1;
    white-space: nowrap;
  }

  .filter-module__input-wrap {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .filter-module__clear {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    border: none;
    background: none;
    color: var(--p-surface-300);
    cursor: pointer;
    border-radius: 0.25rem;
    font-size: 0.6rem;
    padding: 0;
    flex-shrink: 0;
    transition: color 0.1s, background 0.1s;
  }

  .filter-module__clear:hover {
    color: var(--p-red-500);
    background: var(--p-red-50);
  }

  /* Enforce consistent sizing for inputs inside modules */
  .filter-module :deep(.p-inputtext) {
    min-width: 9rem;
  }

  .filter-module :deep(.p-select) {
    min-width: 7rem;
  }

  .filter-module :deep(.p-selectbutton .p-button) {
    padding: 0.3rem 0.75rem;
    font-size: 0.8125rem;
  }

  /* ── Buttons ──────────────────────────────────────────────── */
  .clear-btn {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--p-surface-400);
    background: none;
    border: none;
    padding: 0.25rem 0.375rem;
    cursor: pointer;
    white-space: nowrap;
    transition: color 0.15s;
  }

  .clear-btn:hover {
    color: var(--p-red-500);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .customize-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border: none;
    background: none;
    color: var(--p-surface-400);
    cursor: pointer;
    border-radius: 0.375rem;
    font-size: 0.9rem;
    flex-shrink: 0;
    transition: color 0.15s, background 0.15s;
  }

  .customize-btn:hover {
    color: var(--p-surface-700);
    background: var(--p-surface-100);
  }

  /* ── Customize popover ────────────────────────────────────── */
  .customize-popover {
    min-width: 13rem;
  }

  .customize-popover__title {
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--p-surface-400);
    margin: 0 0 0.5rem;
  }

  .customize-list {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    margin: 0 -0.75rem -0.75rem;
  }

  .customize-item {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--p-surface-700);
    transition: background 0.1s;
  }

  .customize-item:hover {
    background: var(--p-surface-50);
  }

  .customize-empty {
    padding: 0.75rem;
    font-size: 0.8125rem;
    color: var(--p-surface-400);
    text-align: center;
    font-style: italic;
  }

  /* ── Active filters section ───────────────────────────────── */
  .active-filters {
    border: 1px solid var(--p-primary-200);
    border-radius: 0.5rem;
    background: var(--p-primary-50);
    padding: 0.5rem 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .active-filters__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .active-filters__label {
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--p-primary-500);
  }

  .active-filters__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }

  .active-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    background: white;
    border: 1px solid var(--p-primary-200);
    border-radius: 999px;
    padding: 0.2rem 0.375rem 0.2rem 0.625rem;
    font-size: 0.8125rem;
    color: var(--p-primary-800);
  }

  .active-chip__label {
    font-weight: 600;
    color: var(--p-primary-600);
  }

  .active-chip__value {
    color: var(--p-primary-800);
  }

  .active-chip__remove {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1rem;
    border: none;
    background: none;
    color: var(--p-primary-400);
    cursor: pointer;
    border-radius: 999px;
    font-size: 0.55rem;
    padding: 0;
    transition: color 0.1s, background 0.1s;
  }

  .active-chip__remove:hover {
    color: var(--p-red-600);
    background: var(--p-red-50);
  }

  .reset-btn {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--p-primary-500);
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: color 0.15s;
  }

  .reset-btn:hover {
    color: var(--p-red-600);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  /* ── Transitions ──────────────────────────────────────────── */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.15s;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .slide-fade-enter-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .slide-fade-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
  }
</style>
