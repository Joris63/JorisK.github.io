<script setup lang="ts">
  import { ref, computed, watch } from 'vue';

  const props = defineProps<{
    groupNaam: string;
  }>();

  const visible = defineModel<boolean>('visible', { required: true });

  // ── Method selection ──────────────────────────────────────────────────
  type AddMethod = 'zoeken' | 'merk' | 'csv';
  const method = ref<AddMethod | null>(null);

  const METHODS: { value: AddMethod; icon: string; title: string; desc: string }[] = [
    {
      value: 'zoeken',
      icon:  'pi pi-search',
      title: 'Product zoeken',
      desc:  'Zoek op code, naam of merk en voeg producten één voor één toe.',
    },
    {
      value: 'merk',
      icon:  'pi pi-sliders-h',
      title: 'Merk / Serie / Categorie',
      desc:  'Selecteer merken, series en categorieën om producten in bulk toe te voegen.',
    },
    {
      value: 'csv',
      icon:  'pi pi-file-import',
      title: 'CSV importeren',
      desc:  'Upload een CSV met productcodes of producentcodes.',
    },
  ];

  // Reset state when drawer opens
  watch(visible, (val) => {
    if (val) {
      method.value              = null;
      createSubgroup.value      = false;
      subgroupNaam.value        = '';
      searchQuery.value         = '';
      searchResults.value       = [];
      exclusionCsvFile.value    = null;
      // Pre-filled for preview
      selectedProds.value       = [
        { id: 1, code: 'SW1440595', naam: 'Grohe Dice doucheset',                merk: 'Grohe / Dice'                    },
        { id: 2, code: 'SW1440594', naam: 'Grohe Precision Smart Control kraan', merk: 'Grohe / Precision Smart Control' },
        { id: 3, code: 'SW1440593', naam: 'Grohe Get douchekop',                 merk: 'Grohe / Get'                     },
      ];
      selectedMerkenSeries.value = ['Grohe', 'Grohe / Dice', 'Hansgrohe'];
      selectedCategories.value  = ['Douchesets', 'Thermostaatkranen'];
      csvFile.value             = new File(['SW1440595\nSW1440594\nSW1440593'], 'producten_export.csv', { type: 'text/csv' });
      csvColumnType.value       = 'productcodes';
    }
  });

  // ── Subgroep ──────────────────────────────────────────────────────────
  const createSubgroup = ref(false);
  const subgroupNaam   = ref('');

  // ── Zoeken ──────────────────────────────────────────────────────────
  interface Product { id: number; code: string; naam: string; merk: string; }

  const MOCK_ALL: Product[] = [
    { id: 1, code: 'SW1440595', naam: 'Grohe Dice doucheset',                merk: 'Grohe / Dice'                    },
    { id: 2, code: 'SW1440594', naam: 'Grohe Precision Smart Control kraan', merk: 'Grohe / Precision Smart Control' },
    { id: 3, code: 'SW1440593', naam: 'Grohe Get douchekop',                 merk: 'Grohe / Get'                     },
    { id: 4, code: 'SW1440592', naam: 'Grohe Get douche set',                merk: 'Grohe / Get'                     },
    { id: 5, code: 'SW1440591', naam: 'Grohe Start Loop doucheset 2020',     merk: 'Grohe / Start Loop 2020'         },
    { id: 6, code: 'SW1440590', naam: 'Grohe Precision Flow doucheset',      merk: 'Grohe / Precision Flow'          },
  ];

  const searchQuery   = ref('');
  const searchResults = ref<Product[]>([]);
  const selectedProds = ref<Product[]>([]);

  watch(searchQuery, (q) => {
    if (!q.trim()) { searchResults.value = []; return; }
    const ids = new Set(selectedProds.value.map(p => p.id));
    searchResults.value = MOCK_ALL.filter(p =>
      !ids.has(p.id) && (
        p.code.toLowerCase().includes(q.toLowerCase()) ||
        p.naam.toLowerCase().includes(q.toLowerCase()) ||
        p.merk.toLowerCase().includes(q.toLowerCase())
      ),
    );
  });

  function addProduct(p: Product) {
    selectedProds.value.push(p);
    searchResults.value = searchResults.value.filter(x => x.id !== p.id);
    searchQuery.value   = '';
  }

  function removeProduct(id: number) {
    selectedProds.value = selectedProds.value.filter(p => p.id !== id);
  }

  // ── Merk / Serie / Categorie ─────────────────────────────────────────
  const selectedMerkenSeries = ref<string[]>([]);
  const selectedCategories   = ref<string[]>([]);

  const EXCLUSION_LABELS = ['OUTLET producten', 'STORE producten', 'Obsolete producten', 'SHOWROOM producten', 'HM producten'];
  const exclusions = ref<Record<string, boolean>>(
    Object.fromEntries(EXCLUSION_LABELS.map(l => [l, true])),
  );

  const MOCK_MERKEN_SERIES = [
    'Grohe', 'Grohe / Dice', 'Grohe / Get', 'Grohe / Euphoria', 'Grohe / Rainshower', 'Grohe / Tempesta',
    'Hansgrohe', 'Villeroy & Boch', 'Duravit', 'Geberit',
  ];
  const MOCK_CATEGORIES = ['Douchesets', 'Thermostaatkranen', 'Inbouwkranen', 'Wastafelmengkranen', 'Douchepanelen'];

  // ── CSV ──────────────────────────────────────────────────────────────
  const fileInput     = ref<HTMLInputElement | null>(null);
  const csvFile       = ref<File | null>(null);
  const csvColumnType = ref<'productcodes' | 'producentcodes'>('productcodes');
  const isDragging    = ref(false);

  function onDrop(e: DragEvent) {
    isDragging.value = false;
    const file = e.dataTransfer?.files?.[0];
    if (file?.name.endsWith('.csv')) csvFile.value = file;
  }

  function onFileInput(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) csvFile.value = file;
  }

  // ── CSV-based exclusions (merk + csv methods) ─────────────────────
  const exclusionFileInput = ref<HTMLInputElement | null>(null);
  const exclusionCsvFile   = ref<File | null>(null);
  const isExclDragging     = ref(false);

  function onExclusionDrop(e: DragEvent) {
    isExclDragging.value = false;
    const file = e.dataTransfer?.files?.[0];
    if (file?.name.endsWith('.csv')) exclusionCsvFile.value = file;
  }

  function onExclusionFileInput(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) exclusionCsvFile.value = file;
  }

  // ── Submit ────────────────────────────────────────────────────────────
  const canSubmit = computed(() => {
    if (!method.value) return false;
    if (method.value === 'zoeken') return selectedProds.value.length > 0;
    if (method.value === 'merk')   return selectedMerkenSeries.value.length > 0 || selectedCategories.value.length > 0;
    if (method.value === 'csv')    return csvFile.value !== null;
    return false;
  });

  const submitLabel = 'Toevoegen';
</script>

<template>
  <Drawer
    v-model:visible="visible"
    position="right"
    :style="{ width: '42rem' }"
    :pt="{ content: { class: 'flex flex-col gap-0 p-0! overflow-hidden' } }"
  >
    <template #header>
      <div>
        <span class="font-semibold text-surface-800">Producten toevoegen</span>
        <p class="drw-subtitle">
          aan <span class="drw-group-chip">{{ createSubgroup && subgroupNaam.trim() ? subgroupNaam.trim() : createSubgroup ? 'nieuwe subgroep' : groupNaam }}</span>
        </p>
      </div>
    </template>

    <div class="flex flex-col overflow-y-auto flex-1">

      <!-- ── Subgroep ─────────────────────────────────────────────── -->
      <div class="drw-section drw-section--compact">
        <div class="drw-field">
          <div class="drw-row">
            <div>
              <label class="drw-label">Nieuwe subgroep aanmaken</label>
              <p class="drw-hint">Producten worden toegevoegd aan een nieuwe subgroep</p>
            </div>
            <ToggleSwitch v-model="createSubgroup" />
          </div>
          <Transition name="collapse">
            <div v-if="createSubgroup" class="drw-inset">
              <InputText v-model="subgroupNaam" class="w-full" placeholder="Naam van de nieuwe subgroep" />
            </div>
          </Transition>
        </div>
      </div>

      <div class="drw-sep" />

      <!-- ── Method selection ──────────────────────────────────────── -->
      <Transition name="collapse" mode="out-in">
        <div v-if="!method" class="drw-section">
          <p class="drw-section-hdr">Hoe wil je producten toevoegen?</p>
          <div class="method-grid">
            <button
              v-for="m in METHODS" :key="m.value"
              class="method-card"
              @click="method = m.value"
            >
              <div class="method-card__icon">
                <i :class="m.icon" />
              </div>
              <strong class="method-card__title">{{ m.title }}</strong>
              <p class="method-card__desc">{{ m.desc }}</p>
            </button>
          </div>
        </div>

        <!-- ── Method form ─────────────────────────────────────────── -->
        <div v-else>
          <div class="drw-sep" />

          <!-- Zoeken -->
          <div v-if="method === 'zoeken'" class="drw-section">
            <div class="drw-method-hdr">
              <p class="drw-section-hdr">Producten zoeken</p>
              <button class="drw-change-btn" @click="method = null">Andere methode</button>
            </div>
            <div class="search-box">
              <IconField>
                <InputIcon class="pi pi-search" />
                <InputText v-model="searchQuery" class="w-full" placeholder="Zoek op productcode, naam, merk of EAN" autofocus />
              </IconField>
              <div v-if="searchQuery.trim() && !searchResults.length" class="ac-dropdown ac-empty">
                Geen resultaten voor "{{ searchQuery }}"
              </div>
              <div v-else-if="searchResults.length" class="ac-dropdown">
                <button
                  v-for="p in searchResults" :key="p.id"
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
                  <button class="si-remove" @click="removeProduct(p.id)"><i class="pi pi-times" /></button>
                </div>
              </div>
            </div>
          </div>

          <!-- Merk / Serie / Categorie -->
          <div v-else-if="method === 'merk'" class="drw-section">
            <div class="drw-method-hdr">
              <p class="drw-section-hdr">Merk / Serie / Categorie</p>
              <button class="drw-change-btn" @click="method = null">Andere methode</button>
            </div>
            <div class="drw-field">
              <label class="drw-label">Merk / Serie</label>
              <MultiSelect v-model="selectedMerkenSeries" :options="MOCK_MERKEN_SERIES" class="w-full" placeholder="Alle merken en series" display="chip" />
            </div>
            <div class="drw-field">
              <label class="drw-label">Categorieën</label>
              <MultiSelect v-model="selectedCategories" :options="MOCK_CATEGORIES" class="w-full" placeholder="Alle categorieën" display="chip" />
            </div>

            <div class="drw-sep drw-sep--sm" />

            <div class="drw-field">
              <p class="drw-label">Uitsluiten</p>
              <div class="excl-grid">
                <label v-for="lbl in EXCLUSION_LABELS" :key="lbl" class="excl-item">
                  <Checkbox v-model="exclusions[lbl]" :input-id="`m-${lbl}`" binary />
                  <span>{{ lbl }}</span>
                </label>
              </div>
              <div v-if="!exclusionCsvFile" class="excl-csv-drop" :class="{ 'excl-csv-drop--over': isExclDragging }" @click="exclusionFileInput?.click()" @dragover.prevent="isExclDragging = true" @dragleave="isExclDragging = false" @drop.prevent="onExclusionDrop">
                <i class="pi pi-file-import" />
                <span>Of sluit uit via CSV — <button class="csv-select-btn" @click.stop="exclusionFileInput?.click()">bestand selecteren</button></span>
              </div>
              <div v-else class="csv-file-row">
                <div class="csv-file-icon"><i class="pi pi-file" /></div>
                <div class="flex flex-col gap-0.5">
                  <span class="text-sm font-medium text-surface-700">{{ exclusionCsvFile.name }}</span>
                  <span class="text-xs text-surface-400">Uitsluitingen via CSV</span>
                </div>
                <button class="si-remove" style="margin-left: auto" @click="exclusionCsvFile = null"><i class="pi pi-times" /></button>
              </div>
            </div>

            <p class="drw-info">
              <i class="pi pi-info-circle shrink-0" />
              Het exacte aantal producten is pas bekend na het toevoegen.
            </p>
          </div>

          <!-- CSV -->
          <div v-else-if="method === 'csv'" class="drw-section">
            <div class="drw-method-hdr">
              <p class="drw-section-hdr">CSV importeren</p>
              <button class="drw-change-btn" @click="method = null">Andere methode</button>
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
                <button class="csv-select-btn" @click.stop="fileInput?.click()">of selecteer een bestand</button>
              </div>
              <input ref="fileInput" type="file" accept=".csv" class="hidden" @change="onFileInput" />
            </div>

            <div v-else class="csv-file-row">
              <div class="csv-file-icon"><i class="pi pi-file" /></div>
              <div class="flex flex-col gap-0.5">
                <span class="text-sm font-medium text-surface-700">{{ csvFile.name }}</span>
                <span class="text-xs text-surface-400">{{ (csvFile.size / 1024).toFixed(1) }} KB</span>
              </div>
              <button class="si-remove" style="margin-left: auto" @click="csvFile = null"><i class="pi pi-times" /></button>
            </div>

            <div class="drw-field">
              <p class="drw-label">Kolomtype</p>
              <SelectButton
                v-model="csvColumnType"
                :options="[{ label: 'Productcodes', value: 'productcodes' }, { label: 'Producentcodes', value: 'producentcodes' }]"
                option-label="label" option-value="value"
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
              <div v-if="!exclusionCsvFile" class="excl-csv-drop" :class="{ 'excl-csv-drop--over': isExclDragging }" @click="exclusionFileInput?.click()" @dragover.prevent="isExclDragging = true" @dragleave="isExclDragging = false" @drop.prevent="onExclusionDrop">
                <i class="pi pi-file-import" />
                <span>Of sluit uit via CSV — <button class="csv-select-btn" @click.stop="exclusionFileInput?.click()">bestand selecteren</button></span>
              </div>
              <div v-else class="csv-file-row">
                <div class="csv-file-icon"><i class="pi pi-file" /></div>
                <div class="flex flex-col gap-0.5">
                  <span class="text-sm font-medium text-surface-700">{{ exclusionCsvFile.name }}</span>
                  <span class="text-xs text-surface-400">Uitsluitingen via CSV</span>
                </div>
                <button class="si-remove" style="margin-left: auto" @click="exclusionCsvFile = null"><i class="pi pi-times" /></button>
              </div>
            </div>
          </div>

        </div>
      </Transition>

    </div>

    <input ref="exclusionFileInput" type="file" accept=".csv" class="hidden" @change="onExclusionFileInput" />

    <div class="drawer-footer">
      <Button label="Annuleren" severity="secondary" outlined @click="visible = false" />
      <Button :label="submitLabel" :disabled="!canSubmit" @click="visible = false" />
    </div>
  </Drawer>
</template>

<style scoped>
  .drw-section          { display: flex; flex-direction: column; gap: 1.125rem; padding: 1.25rem 1.5rem; }
  .drw-section--compact { gap: 0.625rem; padding: 0.75rem 1.5rem; }
  .drw-section-hdr { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--p-gray-400); }
  .drw-sep         { height: 1px; background: var(--p-gray-100); flex-shrink: 0; }
  .drw-sep--sm     { margin: 0; }
  .drw-field       { display: flex; flex-direction: column; gap: 0.375rem; }
  .drw-label       { font-size: 0.875rem; font-weight: 500; color: var(--p-surface-700); }
  .drw-hint        { font-size: 0.75rem; color: var(--p-gray-400); line-height: 1.4; }
  .drw-row         { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
  .drw-inset       { margin-top: 0.625rem; padding: 0.75rem 1rem; background: var(--p-gray-50); border-radius: 0.5rem; border: 1px solid var(--p-gray-100); }
  .drw-hint-row    { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem; color: var(--p-gray-400); }
  .drw-no-results  { font-size: 0.875rem; color: var(--p-gray-400); padding: 0.375rem 0; }
  .drw-info {
    display: flex; align-items: flex-start; gap: 0.5rem;
    font-size: 0.8125rem; color: var(--p-gray-500); line-height: 1.5;
    padding: 0.75rem 1rem; background: var(--p-blue-50); border-radius: 0.5rem; border: 1px solid var(--p-blue-100);
  }
  .drw-subtitle  { font-size: 0.75rem; color: var(--p-gray-400); margin-top: 0.125rem; }
  .drw-group-chip {
    display: inline-block; padding: 0.05rem 0.4rem;
    background: var(--p-primary-50); color: var(--p-primary-700);
    border-radius: 0.25rem; font-weight: 500;
  }

  /* Subgroup card */
  .drw-card { background: var(--p-gray-50); border: 1px solid var(--p-gray-100); border-radius: 0.625rem; padding: 1rem 1.125rem; }

  /* Method cards */
  .method-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.625rem; }
  .method-card {
    display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-start;
    padding: 0.875rem 1rem; border-radius: 0.5rem;
    border: 1.5px solid var(--p-gray-200); background: white;
    cursor: pointer; text-align: left; transition: border-color 0.15s, box-shadow 0.15s;
  }
  .method-card:hover   { border-color: var(--p-primary-300); box-shadow: 0 0 0 3px var(--p-primary-50); }
  .method-card__icon {
    width: 2rem; height: 2rem; border-radius: 0.375rem;
    background: var(--p-gray-100); display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem; color: var(--p-gray-500); transition: background 0.15s, color 0.15s;
  }
  .method-card:hover .method-card__icon { background: var(--p-primary-50); color: var(--p-primary-500); }
  .method-card__title { font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-700); }
  .method-card__desc  { font-size: 0.75rem; color: var(--p-gray-400); line-height: 1.4; }

  /* Method section header + change link */
  .drw-method-hdr  { display: flex; align-items: center; justify-content: space-between; }
  .drw-change-btn {
    padding: 0.2rem 0.375rem; border: none; background: transparent; cursor: pointer;
    font-size: 0.75rem; color: var(--p-primary-500); border-radius: 0.25rem;
    text-decoration: underline; text-underline-offset: 2px; text-decoration-color: var(--p-primary-300);
    transition: color 0.15s ease, background 0.15s ease;
  }
  .drw-change-btn:hover { color: var(--p-primary-700); background: var(--p-primary-50); text-decoration-color: var(--p-primary-500); }

  /* Search — autocomplete */
  .search-box { position: relative; }
  .ac-dropdown {
    position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 10;
    background: white; border: 1px solid var(--p-gray-200); border-radius: 0.5rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.09); overflow: hidden;
  }
  .ac-empty { padding: 0.75rem 1rem; font-size: 0.875rem; color: var(--p-gray-400); }
  .ac-item {
    display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;
    padding: 0.5rem 0.75rem; width: 100%; background: none; border: none;
    border-bottom: 1px solid var(--p-gray-100); cursor: pointer; text-align: left;
    transition: background 0.1s;
  }
  .ac-item:last-child { border-bottom: none; }
  .ac-item:hover      { background: var(--p-primary-50); }
  .sr-naam { font-size: 0.875rem; font-weight: 500; color: var(--p-surface-700); flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sr-code { font-family: monospace; font-size: 0.775rem; color: var(--p-gray-500); flex-shrink: 0; }

  /* Selected list */
  .selected-list     { margin-top: 0.25rem; }
  .selected-list__hdr {
    display: flex; align-items: center; justify-content: space-between;
    padding-bottom: 0.5rem; border-bottom: 1px solid var(--p-gray-100);
    font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--p-gray-400);
  }
  .sel-count {
    font-size: 0.6875rem; font-weight: 600;
    background: var(--p-primary-100); color: var(--p-primary-700);
    border-radius: 999px; padding: 0.1rem 0.5rem;
  }
  .selected-items { margin-top: 0.25rem; }
  .selected-item {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.4rem 0.375rem; border-bottom: 1px solid var(--p-gray-50);
  }
  .selected-item:last-child { border-bottom: none; }
  .si-remove {
    display: flex; align-items: center; justify-content: center;
    width: 1.375rem; height: 1.375rem; border-radius: 0.25rem; flex-shrink: 0;
    background: none; border: none; cursor: pointer; color: var(--p-gray-400); font-size: 0.75rem;
    transition: background 0.1s, color 0.1s;
  }
  .si-remove:hover { background: var(--p-red-50); color: var(--p-red-500); }

  /* Exclusions */
  .excl-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem 1.5rem; margin-top: 0.25rem; }
  .excl-item { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.875rem; color: var(--p-surface-700); }
  .excl-csv-drop {
    display: flex; align-items: center; gap: 0.5rem; margin-top: 0.375rem;
    padding: 0.5rem 0.875rem; border: 1.5px dashed var(--p-gray-200); border-radius: 0.5rem;
    background: var(--p-gray-50); cursor: pointer; color: var(--p-gray-400); font-size: 0.8125rem;
    transition: border-color 0.15s, background 0.15s;
  }
  .excl-csv-drop:hover, .excl-csv-drop--over { border-color: var(--p-primary-300); background: var(--p-primary-50); }

  /* CSV */
  .csv-drop {
    display: flex; flex-direction: column; align-items: center; gap: 0.375rem;
    padding: 1.75rem 1.5rem; border: 2px dashed var(--p-gray-200); border-radius: 0.625rem;
    background: var(--p-gray-50); cursor: pointer; color: var(--p-gray-400); font-size: 0.875rem;
    text-align: center; transition: border-color 0.15s, background 0.15s;
  }
  .csv-drop:hover, .csv-drop--over { border-color: var(--p-primary-300); background: var(--p-primary-50); }
  .csv-select-btn {
    font-size: 0.875rem; font-weight: 600; color: var(--p-primary-600);
    background: none; border: none; padding: 0; cursor: pointer; transition: color 0.1s;
  }
  .csv-select-btn:hover { color: var(--p-primary-800); text-decoration: underline; }
  .csv-file-row {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.875rem 1rem; background: var(--p-gray-50); border: 1px solid var(--p-gray-100); border-radius: 0.5rem;
  }
  .csv-file-icon {
    width: 2rem; height: 2rem; border-radius: 0.375rem; flex-shrink: 0;
    background: var(--p-primary-100); color: var(--p-primary-600);
    display: flex; align-items: center; justify-content: center;
  }

  /* Footer */
  .drawer-footer {
    display: flex; justify-content: flex-end; gap: 0.5rem; padding: 0.875rem 1.25rem;
    border-top: 1px solid var(--p-gray-100); background: white; flex-shrink: 0;
  }

  /* Transitions */
  .collapse-enter-active { transition: opacity 0.18s ease, transform 0.18s ease; }
  .collapse-leave-active { transition: opacity 0.12s ease, transform 0.12s ease; }
  .collapse-enter-from,
  .collapse-leave-to     { opacity: 0; transform: translateY(-0.25rem); }

  .slide-down-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
  .slide-down-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
  .slide-down-enter-from,
  .slide-down-leave-to     { opacity: 0; transform: translateY(-0.375rem); }
</style>
