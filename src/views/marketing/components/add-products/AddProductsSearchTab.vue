<script setup lang="ts">
  import { ref, watch } from 'vue';

  interface Product {
    id: number;
    code: string;
    naam: string;
    merk: string;
  }

  const emit = defineEmits<{
    (e: 'change-method'): void;
    (e: 'update:selectedProds', value: Product[]): void;
  }>();

  const props = defineProps<{
    selectedProds: Product[];
  }>();

  const MOCK_ALL: Product[] = [
    { id: 1, code: 'SW1440595', naam: 'Grohe Dice doucheset', merk: 'Grohe / Dice' },
    {
      id: 2,
      code: 'SW1440594',
      naam: 'Grohe Precision Smart Control kraan',
      merk: 'Grohe / Precision Smart Control',
    },
    { id: 3, code: 'SW1440593', naam: 'Grohe Get douchekop', merk: 'Grohe / Get' },
    { id: 4, code: 'SW1440592', naam: 'Grohe Get douche set', merk: 'Grohe / Get' },
    {
      id: 5,
      code: 'SW1440591',
      naam: 'Grohe Start Loop doucheset 2020',
      merk: 'Grohe / Start Loop 2020',
    },
    {
      id: 6,
      code: 'SW1440590',
      naam: 'Grohe Precision Flow doucheset',
      merk: 'Grohe / Precision Flow',
    },
  ];

  const searchQuery = ref('');
  const searchResults = ref<Product[]>([]);

  watch(searchQuery, (q) => {
    if (!q.trim()) {
      searchResults.value = [];
      return;
    }
    const ids = new Set(props.selectedProds.map((p) => p.id));
    searchResults.value = MOCK_ALL.filter(
      (p) =>
        !ids.has(p.id) &&
        (p.code.toLowerCase().includes(q.toLowerCase()) ||
          p.naam.toLowerCase().includes(q.toLowerCase()) ||
          p.merk.toLowerCase().includes(q.toLowerCase()))
    );
  });

  function addProduct(p: Product) {
    emit('update:selectedProds', [...props.selectedProds, p]);
    searchResults.value = searchResults.value.filter((x) => x.id !== p.id);
    searchQuery.value = '';
  }

  function removeProduct(id: number) {
    emit(
      'update:selectedProds',
      props.selectedProds.filter((p) => p.id !== id)
    );
  }
</script>

<template>
  <div class="drw-section">
    <div class="drw-method-hdr">
      <p class="drw-section-hdr">Producten zoeken</p>
      <button class="drw-change-btn" @click="emit('change-method')">Andere methode</button>
    </div>
    <div class="search-box">
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText
          v-model="searchQuery"
          class="w-full"
          placeholder="Zoek op productcode, naam, merk of EAN"
          autofocus
        />
      </IconField>
      <div v-if="searchQuery.trim() && !searchResults.length" class="ac-dropdown ac-empty">
        Geen resultaten voor "{{ searchQuery }}"
      </div>
      <div v-else-if="searchResults.length" class="ac-dropdown">
        <button
          v-for="p in searchResults"
          :key="p.id"
          class="ac-item"
          @click="addProduct(p)"
        >
          <span class="sr-naam">{{ p.naam }}</span>
          <span class="sr-code">{{ p.code }}</span>
        </button>
      </div>
    </div>

    <div v-if="selectedProds.length" class="selected-list">
      <div class="selected-list__hdr">
        <span>Geselecteerde producten</span>
        <span class="sel-count">{{ selectedProds.length }}</span>
      </div>
      <div class="selected-items">
        <div v-for="p in selectedProds" :key="p.id" class="selected-item">
          <span class="sr-naam">{{ p.naam }}</span>
          <span class="sr-code">{{ p.code }}</span>
          <button class="si-remove" @click="removeProduct(p.id)">
            <i class="pi pi-times" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";
  .drw-method-hdr {
    @apply flex items-center justify-between;
  }
  .drw-change-btn {
    @apply cursor-pointer text-xs text-[var(--p-primary-500)] rounded py-1 px-1.5;
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

  .search-box {
    @apply relative;
  }
  .ac-dropdown {
    @apply absolute z-10 bg-white border border-[var(--p-gray-200)] rounded-lg overflow-hidden;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.09);
  }
  .ac-empty {
    @apply text-sm text-[var(--p-gray-400)] px-4 py-3;
  }
  .ac-item {
    @apply flex items-center justify-between w-full cursor-pointer text-left border-b border-[var(--p-gray-100)] gap-3 px-3 py-2;
    background: none;
    border: none;
    border-bottom: 1px solid var(--p-gray-100);
    transition: background var(--sw-duration-fast);
  }
  .ac-item:last-child {
    border-bottom: none;
  }
  .ac-item:hover {
    background: var(--p-primary-50);
  }
  .sr-naam {
    @apply text-sm font-medium text-[var(--p-surface-700)] flex-1 whitespace-nowrap overflow-hidden;
    text-overflow: ellipsis;
  }
  .sr-code {
    @apply text-[var(--p-gray-500)] shrink-0;
    font-family: monospace;
    font-size: 0.775rem;
  }

  .selected-list {
    @apply mt-1;
  }
  .selected-list__hdr {
    @apply flex items-center justify-between border-b border-[var(--p-gray-100)] text-xs font-bold uppercase text-[var(--p-gray-400)] pb-2;
    letter-spacing: 0.06em;
  }
  .sel-count {
    @apply font-semibold bg-[var(--p-primary-100)] text-[var(--p-primary-700)] rounded-full;
    font-size: 0.6875rem;
    padding: 0.1rem 0.5rem;
  }
  .selected-items {
    @apply mt-1;
  }
  .selected-item {
    @apply flex items-center border-b border-[var(--p-gray-50)] gap-3 py-1.5 px-1.5;
  }
  .selected-item:last-child {
    border-bottom: none;
  }
  .si-remove {
    @apply flex items-center justify-center rounded shrink-0 cursor-pointer text-[var(--p-gray-400)] text-xs;
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
</style>
