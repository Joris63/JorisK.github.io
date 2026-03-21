<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import type { FilterConfig } from '@/types/filters';
  import { useFilterBar } from '@/composables/useFilterBar';
  import FilterCustomizeMenu from '@/components/filter/FilterCustomizeMenu.vue';

  const props = defineProps<{
    allFilterDefs: FilterConfig[];
    defaultActiveKeys: (string | { key: string; value: any })[];
    searchPlaceholder?: string;
    defaultCollapsed?: boolean;
    showSearch?: boolean;
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

  // ── Active keys for customize menu ────────────────────────────
  const activeKeys = computed(() => filterConfigs.value.map((c) => c.key));

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
    <div v-if="showSearch !== false" class="search-row">
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
          <FilterCustomizeMenu
            :all-filter-defs="allFilterDefs"
            :active-keys="activeKeys"
            @add-filter="addFilter"
            @remove-filter="removeFilter"
            @click="collapsed = false"
          />
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
@reference "@/assets/style.css";
  /* Enforce consistent sizing for inputs inside modules (requires :deep) */
  .filter-module :deep(.p-inputtext) {
    @apply min-w-[9rem];
  }

  .filter-module :deep(.p-select) {
    @apply min-w-[7rem];
  }

  .filter-module :deep(.p-selectbutton .p-button) {
    @apply text-[0.8125rem] py-1.5 px-3;
  }
</style>
