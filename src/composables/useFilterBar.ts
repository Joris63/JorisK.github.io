import { ref, computed } from 'vue';
import type { FilterConfig } from '@/types/filters';

export function useFilterBar(
  allFilterDefs: FilterConfig[],
  defaultActiveKeys: (string | { key: string; value: any })[]
) {
  const activeKeys = ref<string[]>(
    defaultActiveKeys.map((item) => (typeof item === 'string' ? item : item.key))
  );

  const filterConfigs = computed(() =>
    activeKeys.value
      .map((k) => allFilterDefs.find((f) => f.key === k))
      .filter((f): f is FilterConfig => f !== undefined)
  );

  const availableFilters = computed(() => {
    const activeSet = new Set(activeKeys.value);
    return allFilterDefs.filter((f) => !activeSet.has(f.key));
  });

  function initValues() {
    return Object.fromEntries(
      allFilterDefs.map((f) => {
        const found = defaultActiveKeys.find(
          (k) => typeof k !== 'string' && k.key === f.key
        ) as { key: string; value: any } | undefined;
        return [f.key, f.type === 'boolean' ? (found?.value ?? null) : (found?.value ?? '')];
      })
    );
  }

  const pendingValues = ref<Record<string, string | boolean | null>>(initValues());
  const appliedValues = ref<Record<string, string | boolean | null>>(initValues());

  function addFilter(key: string) {
    if (!activeKeys.value.includes(key)) {
      activeKeys.value = [...activeKeys.value, key];
    }
  }

  function removeFilter(key: string) {
    const config = allFilterDefs.find((f) => f.key === key);
    if (config?.required) return;
    activeKeys.value = activeKeys.value.filter((k) => k !== key);
    const empty = config?.type === 'boolean' ? null : '';
    pendingValues.value[key] = empty;
    appliedValues.value[key] = empty;
  }

  function applyFilters() {
    appliedValues.value = { ...pendingValues.value };
  }

  // Clears all pending values — does NOT auto-apply
  function clearValues() {
    filterConfigs.value.forEach((f) => {
      if (!f.required) {
        pendingValues.value[f.key] = f.type === 'boolean' ? null : '';
      }
    });
  }

  // Clears a single pending value — does NOT auto-apply
  function clearPendingFilter(key: string) {
    const config = allFilterDefs.find((f) => f.key === key);
    pendingValues.value[key] = config?.type === 'boolean' ? null : '';
  }

  // Clears a single filter from both pending and applied (for chip removal)
  function clearAppliedFilter(key: string) {
    const config = allFilterDefs.find((f) => f.key === key);
    const empty = config?.type === 'boolean' ? null : '';
    pendingValues.value[key] = empty;
    appliedValues.value[key] = empty;
  }

  const hasActiveFilters = computed(() =>
    filterConfigs.value.some((f) => {
      if (f.required) return false;
      const val = appliedValues.value[f.key];
      return val !== '' && val !== null && val !== undefined;
    })
  );

  const hasPendingValues = computed(() =>
    filterConfigs.value.some((f) => {
      if (f.required) return false;
      const val = pendingValues.value[f.key];
      return val !== '' && val !== null && val !== undefined;
    })
  );

  return {
    filterConfigs,
    availableFilters,
    pendingValues,
    appliedValues,
    activeKeys,
    addFilter,
    removeFilter,
    applyFilters,
    clearValues,
    clearPendingFilter,
    clearAppliedFilter,
    hasActiveFilters,
    hasPendingValues,
  };
}
