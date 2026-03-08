<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import type { FilterConfig } from '@/types/filters';
  import FilterBar from '@/components/FilterBar.vue';

  const router = useRouter();

  interface Quotation {
    id: number;
    offertenummer: string;
    datum: string;
    door: string;
    prijs: number;
  }

  const quotations = ref<Quotation[]>([
    { id: 15, offertenummer: '299452', datum: '04 maart 2025 15:21', door: 'Max Brouwer', prijs: 1995.5 },
    { id: 14, offertenummer: '299451', datum: '03 maart 2025 10:48', door: 'Sara van Dongen', prijs: 11250.8 },
    { id: 13, offertenummer: '299450', datum: '26 februari 2025 16:12', door: 'Ruben Dekker', prijs: 320.45 },
    { id: 12, offertenummer: '299449', datum: '24 februari 2025 09:26', door: 'Nina Bos', prijs: 2499.95 },
    { id: 11, offertenummer: '299448', datum: '20 februari 2025 14:03', door: 'Bram Willems', prijs: 6789.12 },
    { id: 10, offertenummer: '299447', datum: '18 februari 2025 11:34', door: 'Lotte Smit', prijs: 150.0 },
    { id: 9, offertenummer: '299446', datum: '17 februari 2025 10:17', door: 'Timo van Leeuwen', prijs: 9800.34 },
    { id: 8, offertenummer: '299445', datum: '13 februari 2025 15:55', door: 'Julia Hendriks', prijs: 560.6 },
    { id: 7, offertenummer: '299444', datum: '12 februari 2025 13:09', door: 'Finn Kuipers', prijs: 2390.77 },
    { id: 6, offertenummer: '299443', datum: '10 februari 2025 09:41', door: 'Mila Jansen', prijs: 76.25 },
    { id: 5, offertenummer: '299442', datum: '07 februari 2025 16:18', door: 'Daan Visser', prijs: 4520.0 },
    { id: 4, offertenummer: '299441', datum: '05 februari 2025 14:22', door: 'Sophie Bakker', prijs: 884.45 },
    { id: 3, offertenummer: '299440', datum: '04 februari 2025 10:05', door: 'Lars Meijer', prijs: 12999.99 },
    { id: 2, offertenummer: '299439', datum: '03 februari 2025 11:47', door: 'Noah Peters', prijs: 315.9 },
    { id: 1, offertenummer: '299438', datum: '03 februari 2025 09:12', door: 'Emma de Vries', prijs: 7421.58 },
  ]);

  const totalRecords = ref(1609688);

  // ── Filter definitions ──────────────────────────────────────────
  const allFilterDefs: FilterConfig[] = [
    {
      key: 'site',
      label: 'Site',
      type: 'select',
      placeholder: 'SWNL',
      options: [
        { label: 'SWNL', value: 'SWNL' },
        { label: 'SWBE', value: 'SWBE' },
        { label: 'SWFR', value: 'SWFR' },
        { label: 'SWDE', value: 'SWDE' },
      ],
      required: true,
    },
    { key: 'offertenummer', label: 'Offertenummer', type: 'text', placeholder: '12345678' },
    { key: 'email', label: 'Email', type: 'text', placeholder: 'jan@bedrijf.nl' },
    { key: 'achternaam', label: 'Achternaam', type: 'text', placeholder: 'de Vries' },
    { key: 'voornaam', label: 'Voornaam', type: 'text', placeholder: 'Jan' },
    { key: 'bedrijfsnaam', label: 'Bedrijfsnaam', type: 'text', placeholder: 'Bouwbedrijf de Vries' },
    { key: 'postcode', label: 'Postcode', type: 'text', placeholder: '1234 AB' },
    { key: 'huisnummer', label: 'Huisnummer', type: 'text', placeholder: '12' },
    { key: 'huisnummerToevoeging', label: 'Huisnummer toevoeging', type: 'text', placeholder: 'A' },
    { key: 'woonplaats', label: 'Woonplaats', type: 'text', placeholder: 'Amsterdam' },
    { key: 'telefoonnummer', label: 'Telefoonnummer', type: 'text', placeholder: '06 12345678' },
    { key: 'isB2BKlant', label: 'Is B2B Klant', type: 'boolean' },
  ];

  const defaultActiveKeys = [
    { key: 'site', value: 'SWNL' },
    'offertenummer',
    'achternaam',
    'email',
  ];

  function handleFilter(values: Record<string, string | boolean | null>) {
    // In production: trigger API call with filter values
    console.log('Filters applied:', values);
  }
</script>

<template>
  <div class="flex flex-col gap-5 grow">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold text-surface-800">Offertes</h1>
      <Button label="Nieuwe offerte toevoegen" icon="pi pi-plus" icon-pos="right" />
    </div>

    <!-- Filter bar -->
    <FilterBar
      :all-filter-defs="allFilterDefs"
      :default-active-keys="defaultActiveKeys"
      @filter="handleFilter"
    />

    <!-- Result count + pagination -->
    <div class="flex items-center justify-between gap-3">
      <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap">
        {{ totalRecords.toLocaleString('nl-NL') }} offertes
      </span>
      <Paginator
        :rows="15"
        :total-records="totalRecords"
        :rows-per-page-options="[15, 30, 50]"
        class="p-0! border-0! bg-transparent!"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
      />
    </div>

    <!-- Table -->
    <DataTable
      :value="quotations"
      class="quotations-table"
      :pt="{ thead: { class: 'border-b border-gray-200' } }"
    >
      <Column field="offertenummer" header="Offertenummer">
        <template #body="{ data }">
          <span class="font-medium text-surface-700">{{ data.offertenummer }}</span>
        </template>
      </Column>
      <Column field="door" header="Naam">
        <template #body="{ data }">
          <a class="text-primary-600 hover:text-primary-800 hover:underline cursor-pointer">
            {{ data.door }}
          </a>
        </template>
      </Column>
      <Column field="datum" header="Datum">
        <template #body="{ data }">
          <span class="text-surface-400 text-sm">{{ data.datum }}</span>
        </template>
      </Column>
      <Column field="prijs" header="Prijs">
        <template #body="{ data }">
          € {{ data.prijs.toLocaleString('nl-NL', { minimumFractionDigits: 2 }) }}
        </template>
      </Column>
      <Column header="" style="width: 3rem">
        <template #body="{ data }">
          <div class="flex items-center gap-1">
            <Button
              icon="pi pi-pencil"
              variant="text"
              severity="secondary"
              size="small"
              rounded
              @click="router.push({ name: 'QuotationEdit', params: { id: data.id } })"
            />
            <Button icon="pi pi-cart-plus" variant="text" severity="secondary" size="small" rounded />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
  .quotations-table :deep(th) {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--p-surface-400);
    background: transparent;
    border-bottom: 1px solid var(--p-surface-200);
    padding: 0.625rem 0.75rem;
  }

  .quotations-table :deep(td) {
    padding: 0.75rem;
    border-bottom: 1px solid var(--p-surface-100);
  }

  .quotations-table :deep(tr:last-child td) {
    border-bottom: none;
  }

  .quotations-table :deep(tr:hover td) {
    background: var(--p-surface-50);
  }

  .quotations-table :deep(.p-datatable-tbody > tr) {
    transition: background 0.1s ease;
  }
</style>
