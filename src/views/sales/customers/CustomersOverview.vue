<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import type { FilterConfig } from '@/types/filters';
  import FilterBar from '@/components/FilterBar.vue';
  import OverviewLayout from '@/components/layout/OverviewLayout.vue';
  import OverviewHeader from '@/components/layout/OverviewHeader.vue';
  import OverviewToolbar from '@/components/layout/OverviewToolbar.vue';
  import OverviewTable from '@/components/layout/OverviewTable.vue';

  const router = useRouter();

  interface Customer {
    id: number;
    lastName: string;
    email: string;
    lastModified: string;
  }

  const customers = ref<Customer[]>([
    {
      id: 1,
      lastName: 'Bakker',
      email: 'thomas.bakker@gmail.com',
      lastModified: '3 februari 2026 09:14',
    },
    {
      id: 2,
      lastName: 'de Vries',
      email: 'nora.devries@outlook.com',
      lastModified: '21 januari 2026 16:42',
    },
    {
      id: 3,
      lastName: 'van Dijk',
      email: 'r.vandijk@kpnmail.nl',
      lastModified: '14 januari 2026 11:05',
    },
    {
      id: 4,
      lastName: 'Janssen',
      email: 'lienekejanssen@hotmail.com',
      lastModified: '9 december 2025 08:30',
    },
    { id: 5, lastName: 'Smit', email: 'p.smit82@ziggo.nl', lastModified: '2 december 2025 14:17' },
    {
      id: 6,
      lastName: 'Meijer',
      email: 'erik.meijer@gmail.com',
      lastModified: '18 november 2025 10:55',
    },
    {
      id: 7,
      lastName: 'van den Berg',
      email: 'anneke.vdberg@live.nl',
      lastModified: '5 november 2025 13:22',
    },
    {
      id: 8,
      lastName: 'Visser',
      email: 'm.visser@upcmail.nl',
      lastModified: '29 oktober 2025 09:48',
    },
    {
      id: 9,
      lastName: 'Mulder',
      email: 'hansmulder@gmail.com',
      lastModified: '14 oktober 2025 17:03',
    },
    {
      id: 10,
      lastName: 'de Boer',
      email: 'deboer.sandra@hetnet.nl',
      lastModified: '1 oktober 2025 12:30',
    },
    { id: 11, lastName: 'Bos', email: 'w.bos@planet.nl', lastModified: '22 september 2025 08:11' },
    {
      id: 12,
      lastName: 'van Leeuwen',
      email: 'cvanleeuwen@gmail.com',
      lastModified: '10 september 2025 15:44',
    },
    {
      id: 13,
      lastName: 'Dekker',
      email: 'jos.dekker@xs4all.nl',
      lastModified: '28 augustus 2025 11:29',
    },
    {
      id: 14,
      lastName: 'Hendriks',
      email: 'f.hendriks@outlook.com',
      lastModified: '15 augustus 2025 09:00',
    },
    {
      id: 15,
      lastName: 'Peters',
      email: 'margriet.peters@gmail.com',
      lastModified: '3 augustus 2025 16:58',
    },
  ]);

  // ── Filter definitions ──────────────────────────────────────────
  const allFilterDefs: FilterConfig[] = [
    { key: 'email', label: 'Email', type: 'text', placeholder: 'jan@bedrijf.nl' },
    { key: 'achternaam', label: 'Achternaam', type: 'text', placeholder: 'de Vries' },
    { key: 'voornaam', label: 'Voornaam', type: 'text', placeholder: 'Jan' },
    {
      key: 'bedrijfsnaam',
      label: 'Bedrijfsnaam',
      type: 'text',
      placeholder: 'Bouwbedrijf de Vries',
    },
    { key: 'postcode', label: 'Postcode', type: 'text', placeholder: '1234 AB' },
    { key: 'huisnummer', label: 'Huisnummer', type: 'text', placeholder: '12' },
    { key: 'huisnummerToevoeging', label: 'Huisnummer toevoeging', type: 'text', placeholder: 'A' },
    { key: 'woonplaats', label: 'Woonplaats', type: 'text', placeholder: 'Amsterdam' },
    { key: 'telefoonnummer', label: 'Telefoonnummer', type: 'text', placeholder: '06 12345678' },
    { key: 'isB2BKlant', label: 'Is B2B Klant', type: 'boolean' },
    { key: 'heeftBedrijf', label: 'Heeft bedrijf', type: 'boolean' },
    { key: 'heeftBestellingen', label: 'Heeft bestellingen', type: 'boolean' },
  ];

  const defaultActiveKeys = [
    'email',
    'achternaam',
    'postcode',
    'huisnummer',
    'huisnummerToevoeging',
    'isB2BKlant',
  ];

  const appliedFilters = ref<Record<string, string | boolean | null>>({});

  function handleFilter(values: Record<string, string | boolean | null>) {
    appliedFilters.value = values;
  }

  const filteredCustomers = computed(() => {
    const f = appliedFilters.value;
    return customers.value.filter((customer) => {
      if (f.q && typeof f.q === 'string') {
        const q = f.q.toLowerCase();
        if (!customer.email.toLowerCase().includes(q) && !customer.lastName.toLowerCase().includes(q)) return false;
      }
      if (f.email && typeof f.email === 'string') {
        if (!customer.email.toLowerCase().includes(f.email.toLowerCase())) return false;
      }
      if (f.achternaam && typeof f.achternaam === 'string') {
        if (!customer.lastName.toLowerCase().includes(f.achternaam.toLowerCase())) return false;
      }
      return true;
    });
  });
</script>

<template>
  <OverviewLayout>
    <OverviewHeader title="Klanten" />

    <FilterBar
      :all-filter-defs="allFilterDefs"
      :default-active-keys="defaultActiveKeys"
      :default-collapsed="true"
      @filter="handleFilter"
    />

    <OverviewToolbar :count="filteredCustomers.length" label="klanten" />

    <OverviewTable :value="filteredCustomers">
      <Column field="lastName" header="Achternaam">
        <template #body="{ data }">
          <span class="font-medium text-surface-700">{{ data.lastName }}</span>
        </template>
      </Column>
      <Column field="email" header="E-mail">
        <template #body="{ data }">
          <a
            :href="`mailto:${data.email}`"
            class="text-primary-600 hover:text-primary-800 hover:underline"
          >
            {{ data.email }}
          </a>
        </template>
      </Column>
      <Column field="lastModified" header="Laatst aangepast">
        <template #body="{ data }">
          <span class="text-surface-400 text-base">{{ data.lastModified }}</span>
        </template>
      </Column>
      <Column header="" style="width: 3rem">
        <template #body="{ data }">
          <Button
            icon="pi pi-pencil"
            text
            severity="secondary"
            size="small"
            rounded
            @click="router.push({ name: 'CustomerEdit', params: { id: data.id } })"
          />
        </template>
      </Column>
    </OverviewTable>
  </OverviewLayout>
</template>
