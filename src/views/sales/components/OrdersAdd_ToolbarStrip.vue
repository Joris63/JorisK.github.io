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
  .toolbar-strip {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.625rem 1.5rem;
    border-bottom: 1px solid var(--p-gray-100);
    background: var(--p-gray-50);
    flex-shrink: 0;
    flex-wrap: wrap;
  }

  .toolbar-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--p-surface-400);
    white-space: nowrap;
  }

  .toolbar-divider {
    width: 1px;
    height: 1.5rem;
    background: var(--p-gray-200);
  }
</style>
