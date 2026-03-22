<script setup lang="ts">
  import { ref } from 'vue';

  const emit = defineEmits<{
    (e: 'change-method'): void;
    (e: 'update:csvFile', value: File | null): void;
    (e: 'update:csvColumnType', value: 'productcodes' | 'producentcodes'): void;
    (e: 'update:exclusionCsvFile', value: File | null): void;
  }>();

  defineProps<{
    csvFile: File | null;
    csvColumnType: 'productcodes' | 'producentcodes';
    exclusionCsvFile: File | null;
  }>();

  const EXCLUSION_LABELS = [
    'OUTLET producten',
    'STORE producten',
    'Obsolete producten',
    'SHOWROOM producten',
    'HM producten',
  ];
  const exclusions = ref<Record<string, boolean>>(
    Object.fromEntries(EXCLUSION_LABELS.map((l) => [l, true]))
  );

  const fileInput = ref<HTMLInputElement | null>(null);
  const isDragging = ref(false);
  const exclusionFileInput = ref<HTMLInputElement | null>(null);
  const isExclDragging = ref(false);

  function onDrop(e: DragEvent) {
    isDragging.value = false;
    const file = e.dataTransfer?.files?.[0];
    if (file?.name.endsWith('.csv')) emit('update:csvFile', file);
  }

  function onFileInput(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) emit('update:csvFile', file);
  }

  function onExclusionDrop(e: DragEvent) {
    isExclDragging.value = false;
    const file = e.dataTransfer?.files?.[0];
    if (file?.name.endsWith('.csv')) emit('update:exclusionCsvFile', file);
  }

  function onExclusionFileInput(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) emit('update:exclusionCsvFile', file);
  }
</script>

<template>
  <div class="drw-section">
    <div class="drw-method-hdr">
      <p class="drw-section-hdr">CSV importeren</p>
      <button class="drw-change-btn" @click="emit('change-method')">Andere methode</button>
    </div>

    <div v-if="!csvFile">
      <div
        class="csv-drop"
        :class="{ 'csv-drop--over': isDragging }"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @drop.prevent="onDrop"
        @click="fileInput?.click()"
      >
        <i class="pi pi-file-import text-3xl" />
        <span>Sleep een CSV bestand hierheen</span>
        <button class="csv-select-btn" @click.stop="fileInput?.click()">
          of selecteer een bestand
        </button>
      </div>
      <input
        ref="fileInput"
        type="file"
        accept=".csv"
        class="hidden"
        @change="onFileInput"
      />
    </div>

    <div v-else class="csv-file-row">
      <div class="csv-file-icon"><i class="pi pi-file" /></div>
      <div class="flex flex-col gap-0.5">
        <span class="text-base font-medium text-surface-700">{{ csvFile.name }}</span>
        <AppCaption as="span">{{ (csvFile.size / 1024).toFixed(1) }} KB</AppCaption>
      </div>
      <button
        class="si-remove"
        style="margin-left: auto"
        @click="emit('update:csvFile', null)"
      >
        <i class="pi pi-times" />
      </button>
    </div>

    <div class="drw-field">
      <p class="drw-label">Kolomtype</p>
      <SelectButton
        :model-value="csvColumnType"
        :options="[
          { label: 'Productcodes', value: 'productcodes' },
          { label: 'Producentcodes', value: 'producentcodes' },
        ]"
        option-label="label"
        option-value="value"
        @update:model-value="emit('update:csvColumnType', $event)"
      />
    </div>

    <div class="drw-sep drw-sep--sm" />

    <div class="drw-field">
      <p class="drw-label">Uitsluiten</p>
      <div class="excl-grid">
        <label v-for="lbl in EXCLUSION_LABELS" :key="lbl" class="excl-item">
          <Checkbox v-model="exclusions[lbl]" :input-id="`c-${lbl}`" binary />
          <span>{{ lbl }}</span>
        </label>
      </div>
      <div
        v-if="!exclusionCsvFile"
        class="excl-csv-drop"
        :class="{ 'excl-csv-drop--over': isExclDragging }"
        @click="exclusionFileInput?.click()"
        @dragover.prevent="isExclDragging = true"
        @dragleave="isExclDragging = false"
        @drop.prevent="onExclusionDrop"
      >
        <i class="pi pi-file-import" />
        <span>
          Of sluit uit via CSV —
          <button class="csv-select-btn" @click.stop="exclusionFileInput?.click()">
            bestand selecteren
          </button>
        </span>
      </div>
      <div v-else class="csv-file-row">
        <div class="csv-file-icon"><i class="pi pi-file" /></div>
        <div class="flex flex-col gap-0.5">
          <span class="text-base font-medium text-surface-700">{{ exclusionCsvFile.name }}</span>
          <AppCaption as="span">Uitsluitingen via CSV</AppCaption>
        </div>
        <button
          class="si-remove"
          style="margin-left: auto"
          @click="emit('update:exclusionCsvFile', null)"
        >
          <i class="pi pi-times" />
        </button>
      </div>
    </div>

    <input
      ref="exclusionFileInput"
      type="file"
      accept=".csv"
      class="hidden"
      @change="onExclusionFileInput"
    />
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";
  .drw-method-hdr {
    @apply flex items-center justify-between;
  }
  .drw-change-btn {
    @apply cursor-pointer text-xs text-(--p-primary-500) rounded py-1 px-1.5;
    border: none;
    background: transparent;
    text-decoration: underline;
    text-underline-offset: 2px;
    text-decoration-color: var(--p-primary-300);
    transition:
      color var(--sw-duration-base) var(--sw-ease),
      background var(--sw-duration-base) var(--sw-ease);
  }
  .drw-change-btn:hover {
    color: var(--p-primary-700);
    background: var(--p-primary-50);
    text-decoration-color: var(--p-primary-500);
  }

  .csv-drop {
    @apply flex flex-col items-center bg-(--p-gray-50) cursor-pointer text-(--p-gray-400) text-base text-center gap-1.5 py-7 px-6;
    border: 2px dashed var(--p-gray-200);
    border-radius: 0.625rem;
    transition:
      border-color var(--sw-duration-base),
      background var(--sw-duration-base);
  }
  .csv-drop:hover,
  .csv-drop--over {
    border-color: var(--p-primary-300);
    background: var(--p-primary-50);
  }
  .csv-select-btn {
    @apply text-base font-semibold text-(--p-primary-600) cursor-pointer;
    background: none;
    border: none;
    padding: 0;
    transition: color var(--sw-duration-fast);
  }
  .csv-select-btn:hover {
    color: var(--p-primary-800);
    text-decoration: underline;
  }
  .csv-file-row {
    @apply flex items-center bg-(--p-gray-50) border border-(--p-gray-100) rounded-lg gap-3 py-3.5 px-4;
  }
  .csv-file-icon {
    @apply shrink-0 bg-(--p-primary-100) text-(--p-primary-600) flex items-center justify-center rounded-md;
    width: 2rem;
    height: 2rem;
  }
  .si-remove {
    @apply flex items-center justify-center rounded shrink-0 cursor-pointer text-(--p-gray-400) text-xs;
    width: 1.375rem;
    height: 1.375rem;
    background: none;
    border: none;
    transition:
      background var(--sw-duration-fast),
      color var(--sw-duration-fast);
  }
  .si-remove:hover {
    background: var(--p-red-50);
    color: var(--p-red-500);
  }

  .excl-grid {
    @apply grid mt-1;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem 1.5rem;
  }
  .excl-item {
    @apply flex items-center cursor-pointer text-base text-(--p-surface-700) gap-2;
  }
  .excl-csv-drop {
    @apply flex items-center bg-(--p-gray-50) cursor-pointer text-(--p-gray-400) gap-2 mt-1.5 py-2 px-3.5 rounded-lg;
    @apply text-base;
    border: 1.5px dashed var(--p-gray-200);
    transition:
      border-color var(--sw-duration-base),
      background var(--sw-duration-base);
  }
  .excl-csv-drop:hover,
  .excl-csv-drop--over {
    border-color: var(--p-primary-300);
    background: var(--p-primary-50);
  }
</style>
