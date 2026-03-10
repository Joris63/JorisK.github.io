<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import type { FilterConfig } from '@/types/filters';
  import { useFilterBar } from '@/composables/useFilterBar';

  const props = defineProps<{
    allFilterDefs: FilterConfig[];
    defaultActiveKeys: (string | { key: string; value: any })[];
    searchPlaceholder?: string;
    defaultCollapsed?: boolean;
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
  const collapsed = ref(props.defaultCollapsed ?? false);

  function onCollapseEnter(el: Element, done: () => void) {
    const h = el as HTMLElement;
    h.style.height = '0';
    h.style.opacity = '0';
    h.style.overflow = 'hidden';
    h.offsetHeight; // force reflow
    h.style.transition = 'height 0.2s ease, opacity 0.2s ease';
    h.style.height = h.scrollHeight + 'px';
    h.style.opacity = '1';
    setTimeout(done, 200);
  }
  function onCollapseAfterEnter(el: Element) {
    const h = el as HTMLElement;
    h.style.height = '';
    h.style.opacity = '';
    h.style.overflow = '';
    h.style.transition = '';
  }
  function onCollapseLeave(el: Element, done: () => void) {
    const h = el as HTMLElement;
    h.style.overflow = 'hidden';
    h.style.height = h.scrollHeight + 'px';
    h.offsetHeight; // force reflow
    requestAnimationFrame(() => requestAnimationFrame(() => {
      h.style.transition = 'height 0.22s ease-in, opacity 0.15s ease-in';
      h.style.height = '0';
      h.style.opacity = '0';
      setTimeout(done, 230);
    }));
  }

  // ── Customize ─────────────────────────────────────────────────
  const customizeItems = computed(() =>
    props.allFilterDefs.map((f) => ({
      ...f,
      active: f.required || filterConfigs.value.some((c) => c.key === f.key),
    }))
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
    const chips: { key: string; label: string; value: string; required: boolean }[] = [];
    if (appliedSearch.value) {
      chips.push({ key: '_search', label: 'Zoeken', value: appliedSearch.value, required: false });
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
      chips.push({ key: filter.key, label: filter.label, value: display, required: !!filter.required });
    }
    return chips;
  });

  const hasAnythingApplied = computed(
    () => hasActiveFilters.value || !!appliedSearch.value
  );

  const hasResettableFilters = computed(
    () =>
      !!appliedSearch.value ||
      props.allFilterDefs.some((f) => {
        if (f.required) return false;
        const val = appliedValues.value[f.key];
        return val !== '' && val !== null && val !== undefined;
      })
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
      <div class="filter-card__header" @click.self="collapsed = !collapsed">
        <button class="collapse-btn" :class="{ 'collapse-btn--collapsed': collapsed }" @click="collapsed = !collapsed">
          <i class="pi pi-chevron-down" />
        </button>
        <span class="filter-card__title" style="cursor:pointer" @click="collapsed = !collapsed">Filters</span>
        <div class="filter-card__actions">
          <template v-if="!collapsed">
            <Transition name="fade">
              <button v-if="hasPendingValues || pendingSearch" class="clear-btn" @click="handleClearPending">
                <i class="pi pi-times" />
                Waardes wissen
              </button>
            </Transition>
            <Button label="Filteren" size="small" @click="handleApply" />
            <div class="filter-card__sep" />
          </template>
          <button class="customize-btn" title="Filters aanpassen" @click="collapsed = false; customizePopoverRef?.toggle($event)">
            <i class="pi pi-sliders-h" />
          </button>
          <Popover ref="customizePopoverRef">
            <div class="customize-popover">
              <p class="customize-popover__title">Filters aanpassen</p>
              <div class="customize-list">
                <label
                  v-for="item in customizeItems"
                  :key="item.key"
                  class="customize-item"
                  :class="{ 'customize-item--required': item.required }"
                >
                  <Checkbox
                    :model-value="item.active"
                    :binary="true"
                    :disabled="item.required"
                    @update:model-value="!item.required && toggleCustomize(item.key, item.active)"
                  />
                  <span>{{ item.label }}</span>
                  <i v-if="item.required" class="pi pi-lock customize-item__lock" />
                </label>
                <div v-if="!customizeItems.length" class="customize-empty">
                  Geen filters beschikbaar
                </div>
              </div>
            </div>
          </Popover>
        </div>
      </div>

      <!-- Filter modules (collapsible) -->
      <Transition
        :css="false"
        @enter="onCollapseEnter"
        @after-enter="onCollapseAfterEnter"
        @leave="onCollapseLeave"
      >
        <div v-if="!collapsed" class="filter-modules">
        <div
          v-for="filter in filterConfigs"
          :key="filter.key"
          class="filter-module"
          :class="{ 'filter-module--required': filter.required }"
        >
          <!-- Label -->
          <span class="filter-module__label">
            {{ filter.label }}
            <i v-if="filter.required" class="pi pi-lock filter-module__lock" />
          </span>
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
              v-if="!filter.required && pendingValues[filter.key] !== '' && pendingValues[filter.key] !== null"
              class="filter-module__clear"
              title="Waarde wissen"
              @click="clearPendingFilter(filter.key)"
            >
              <i class="pi pi-times" />
            </button>
          </div>
        </div>
      </div>
      </Transition>

      <!-- Active chips (always visible, even when collapsed) -->
      <div v-if="hasAnythingApplied" class="filter-chips">
        <span class="filter-chips__heading">Actief:</span>
        <span
          v-for="chip in activeChips"
          :key="chip.key"
          class="active-chip"
          :class="{ 'active-chip--required': chip.required }"
        >
          <span class="active-chip__label">{{ chip.label }}:</span>
          <span class="active-chip__value">{{ chip.value }}</span>
          <i v-if="chip.required" class="pi pi-lock active-chip__lock" />
          <button v-else class="active-chip__remove" @click="handleClearAppliedFilter(chip.key)">
            <i class="pi pi-times" />
          </button>
        </span>
        <button v-if="hasResettableFilters" class="reset-btn reset-btn--inline" @click="handleReset">
          <i class="pi pi-times" />
          Filters wissen
        </button>
      </div>
    </div>
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
    user-select: none;
  }

  .collapse-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    border: none;
    background: none;
    color: var(--p-surface-400);
    cursor: pointer;
    padding: 0;
    flex-shrink: 0;
    font-size: 0.65rem;
    transition: transform 0.2s ease, color 0.1s;
  }

  .collapse-btn:hover {
    color: var(--p-surface-600);
  }

  .collapse-btn--collapsed {
    transform: rotate(-90deg);
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

  .filter-module--required {
    border-color: var(--p-primary-200);
    background: var(--p-primary-50);
  }

  .filter-module__label {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.625rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--p-surface-400);
    line-height: 1;
    white-space: nowrap;
  }

  .filter-module__lock {
    font-size: 0.5rem;
    color: var(--p-primary-300);
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
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .clear-btn:hover {
    color: var(--p-red-500);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .reset-btn--inline {
    margin-left: auto;
    font-size: 0.75rem;
    color: var(--p-surface-400);
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .reset-btn--inline:hover {
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

  .customize-item--required {
    opacity: 0.65;
    cursor: default;
  }

  .customize-item--required:hover {
    background: transparent;
  }

  .customize-item__lock {
    margin-left: auto;
    font-size: 0.65rem;
    color: var(--p-surface-400);
  }

  .customize-empty {
    padding: 0.75rem;
    font-size: 0.8125rem;
    color: var(--p-surface-400);
    text-align: center;
    font-style: italic;
  }

  /* ── Active chips (inside filter card) ───────────────────── */
  .filter-chips {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 0.75rem;
    border-top: 1px solid var(--p-primary-200);
    background: var(--p-primary-50);
    border-radius: 0 0 0.5rem 0.5rem;
  }

  .filter-chips__heading {
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--p-primary-400);
    margin-right: 0.125rem;
  }

  .active-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    background: white;
    border: 1.5px solid var(--p-primary-300);
    border-radius: 999px;
    padding: 0.2rem 0.375rem 0.2rem 0.625rem;
    font-size: 0.8125rem;
    color: var(--p-primary-800);
    box-shadow: 0 1px 2px rgba(0,0,0,0.06);
  }

  .active-chip--required {
    background: var(--p-primary-50);
    border-color: var(--p-primary-200);
    border-style: dashed;
    color: var(--p-primary-600);
    box-shadow: none;
  }

  .active-chip__label {
    font-weight: 700;
    color: var(--p-primary-500);
  }

  .active-chip--required .active-chip__label {
    color: var(--p-primary-400);
  }

  .active-chip__value {
    font-weight: 500;
    color: var(--p-primary-800);
  }

  .active-chip--required .active-chip__value {
    color: var(--p-primary-600);
  }

  .active-chip__lock {
    font-size: 0.5rem;
    color: var(--p-primary-400);
    margin-left: 0.125rem;
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
