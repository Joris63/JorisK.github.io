<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import AddProductsMethodSelect, {
    type AddMethod,
  } from './add-products/AddProductsMethodSelect.vue';
  import AddProductsSearchTab from './add-products/AddProductsSearchTab.vue';
  import AddProductsBrandTab from './add-products/AddProductsBrandTab.vue';
  import AddProductsCsvTab from './add-products/AddProductsCsvTab.vue';

  interface Product {
    id: number;
    code: string;
    naam: string;
    merk: string;
  }

  const props = defineProps<{
    groupNaam: string;
  }>();

  const visible = defineModel<boolean>('visible', { required: true });

  const method = ref<AddMethod | null>(null);
  const createSubgroup = ref(false);
  const subgroupNaam = ref('');

  // Tab states
  const selectedProds = ref<Product[]>([]);
  const selectedMerkenSeries = ref<string[]>([]);
  const selectedCategories = ref<string[]>([]);
  const csvFile = ref<File | null>(null);
  const csvColumnType = ref<'productcodes' | 'producentcodes'>('productcodes');
  const exclusionCsvFile = ref<File | null>(null);

  watch(visible, (val) => {
    if (val) {
      method.value = null;
      createSubgroup.value = false;
      subgroupNaam.value = '';
      exclusionCsvFile.value = null;
      // Pre-filled for preview
      selectedProds.value = [
        { id: 1, code: 'SW1440595', naam: 'Grohe Dice doucheset', merk: 'Grohe / Dice' },
        {
          id: 2,
          code: 'SW1440594',
          naam: 'Grohe Precision Smart Control kraan',
          merk: 'Grohe / Precision Smart Control',
        },
        { id: 3, code: 'SW1440593', naam: 'Grohe Get douchekop', merk: 'Grohe / Get' },
      ];
      selectedMerkenSeries.value = ['Grohe', 'Grohe / Dice', 'Hansgrohe'];
      selectedCategories.value = ['Douchesets', 'Thermostaatkranen'];
      csvFile.value = new File(['SW1440595\nSW1440594\nSW1440593'], 'producten_export.csv', {
        type: 'text/csv',
      });
      csvColumnType.value = 'productcodes';
    }
  });

  const canSubmit = computed(() => {
    if (!method.value) return false;
    if (method.value === 'zoeken') return selectedProds.value.length > 0;
    if (method.value === 'merk')
      return selectedMerkenSeries.value.length > 0 || selectedCategories.value.length > 0;
    if (method.value === 'csv') return csvFile.value !== null;
    return false;
  });
</script>

<template>
  <Drawer
    v-model:visible="visible"
    position="right"
    class="w-[42rem]!"
    :pt="{ content: { class: 'flex flex-col gap-0 p-0! overflow-hidden' } }"
  >
    <template #header>
      <div>
        <span class="font-semibold text-surface-800">Producten toevoegen</span>
        <p class="drw-subtitle">
          aan
          <span class="drw-group-chip">{{
            createSubgroup && subgroupNaam.trim()
              ? subgroupNaam.trim()
              : createSubgroup
                ? 'nieuwe subgroep'
                : groupNaam
          }}</span>
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
              <InputText
                v-model="subgroupNaam"
                class="w-full"
                placeholder="Naam van de nieuwe subgroep"
              />
            </div>
          </Transition>
        </div>
      </div>

      <div class="drw-sep" />

      <!-- ── Method selection / tab content ──────────────────────── -->
      <Transition name="collapse" mode="out-in">
        <AddProductsMethodSelect
          v-if="!method"
          :model-value="method"
          @update:model-value="method = $event"
        />

        <div v-else>
          <div class="drw-sep" />

          <AddProductsSearchTab
            v-if="method === 'zoeken'"
            :selected-prods="selectedProds"
            @update:selected-prods="selectedProds = $event"
            @change-method="method = null"
          />

          <AddProductsBrandTab
            v-else-if="method === 'merk'"
            :selected-merken-series="selectedMerkenSeries"
            :selected-categories="selectedCategories"
            :exclusion-csv-file="exclusionCsvFile"
            @update:selected-merken-series="selectedMerkenSeries = $event"
            @update:selected-categories="selectedCategories = $event"
            @update:exclusion-csv-file="exclusionCsvFile = $event"
            @change-method="method = null"
          />

          <AddProductsCsvTab
            v-else-if="method === 'csv'"
            :csv-file="csvFile"
            :csv-column-type="csvColumnType"
            :exclusion-csv-file="exclusionCsvFile"
            @update:csv-file="csvFile = $event"
            @update:csv-column-type="csvColumnType = $event"
            @update:exclusion-csv-file="exclusionCsvFile = $event"
            @change-method="method = null"
          />
        </div>
      </Transition>
    </div>

    <div class="drawer-footer">
      <Button label="Annuleren" severity="secondary" outlined @click="visible = false" />
      <Button label="Toevoegen" :disabled="!canSubmit" @click="visible = false" />
    </div>
  </Drawer>
</template>

<style scoped>
@reference "@/assets/style.css";
  .drw-section--compact {
    @apply gap-2.5 px-6 py-3;
  }
  .drw-sep--sm {
    margin: 0;
  }

  /* collapse transition — defined globally in cards.css */
</style>
