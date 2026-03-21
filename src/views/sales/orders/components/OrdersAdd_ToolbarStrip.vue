<script setup lang="ts">
  import { ref } from 'vue';

  const selectedSite = ref<number>(1);
  const siteOptions = [
    { label: 'SWNL', value: 1 },
    { label: 'SWBE', value: 2 },
    { label: 'SWFR', value: 3 },
    { label: 'SWDE', value: 4 },
  ];

  const selectedCustomerType = ref<number>(1);
  const customerTypes = [
    { label: 'B2C', value: 1 },
    { label: 'B2B', value: 2 },
  ];
</script>

<template>
  <div class="toolbar-strip">
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2">
        <span class="toolbar-label">Site</span>
        <SelectButton v-model="selectedSite" :allow-empty="false" :options="siteOptions" option-label="label" option-value="value" />
      </div>
      <div class="toolbar-divider" />
      <div class="flex items-center gap-2">
        <span class="toolbar-label">Klanttype</span>
        <SelectButton v-model="selectedCustomerType" :allow-empty="false" :options="customerTypes" option-label="label" option-value="value" />
        <Button
          v-if="selectedCustomerType === 2"
          label="B2B klant zoeken"
          severity="secondary"
          size="small"
          icon="pi pi-search"
          variant="outlined"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";
  .toolbar-strip {
    @apply flex items-center border-b border-(--p-gray-100) bg-(--p-gray-50) shrink-0 flex-wrap gap-4 py-2.5 px-6;
  }

  .toolbar-label {
    @apply font-semibold uppercase tracking-[0.05em] text-(--p-surface-400) whitespace-nowrap text-xs;
  }

  .toolbar-divider {
    @apply w-px bg-(--p-gray-200) h-6;
  }
</style>
