<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import type { Offer, OfferStatus } from '@/types/offer';
  import type { FilterConfig } from '@/types/filters';
  import FilterBar from '@/components/FilterBar.vue';

  const router = useRouter();

  const offers = ref<Offer[]>([
    {
      id: 1,
      naam: '2026 Q1: Hansgrohe Raindance actie',
      startdatum: '03-02-2026',
      einddatum: '15-04-2026',
      status: 'Actief',
      sites: ['swbe (fr-BE)', 'swbe (nl-BE)', 'swnl (nl_NL)'],
      lastTask: null,
    },
    {
      id: 2,
      naam: '2026 Q1: Grohe Colors BE',
      startdatum: '11-02-2026',
      einddatum: '31-03-2026',
      status: 'Actief',
      sites: ['swbe (fr-BE)', 'swbe (nl-BE)'],
      lastTask: 'Prijzen bijwerken',
    },
    {
      id: 3,
      naam: '2026 Q1: SRiho cashback NL',
      startdatum: '25-01-2026',
      einddatum: '30-06-2026',
      status: 'Actief',
      sites: ['swnl (nl_NL)'],
      lastTask: null,
    },
    {
      id: 4,
      naam: '2026 Q1: Meubelactie Benelux',
      startdatum: '04-02-2026',
      einddatum: '02-03-2026',
      status: 'Actief',
      sites: ['swbe (fr-BE)', 'swbe (nl-BE)', 'swnl (nl_NL)'],
      lastTask: 'Producten toevoegen',
    },
    {
      id: 5,
      naam: '2026 Q2: Lente badkamer deal',
      startdatum: '01-04-2026',
      einddatum: '30-04-2026',
      status: 'Binnenkort gepland',
      sites: ['swbe (nl-BE)', 'swnl (nl_NL)'],
      lastTask: null,
    },
    {
      id: 6,
      naam: '2026 Q2: Badkamer week FR',
      startdatum: '06-04-2026',
      einddatum: '13-04-2026',
      status: 'Binnenkort gepland',
      sites: ['swfr (fr_FR)'],
      lastTask: null,
    },
    {
      id: 7,
      naam: '2026 Q2: Villeroy & Boch promo',
      startdatum: '15-03-2026',
      einddatum: '15-05-2026',
      status: 'Binnenkort gepland',
      sites: ['swbe (fr-BE)', 'swbe (nl-BE)', 'swnl (nl_NL)', 'swfr (fr_FR)'],
      lastTask: null,
    },
    {
      id: 8,
      naam: '2026 Q1: SOLDES FR',
      startdatum: '10-01-2026',
      einddatum: '04-02-2026',
      status: 'Verlopen',
      sites: ['swfr (fr_FR)'],
      lastTask: null,
    },
    {
      id: 9,
      naam: '2026 Q1: Solden BE',
      startdatum: '09-01-2026',
      einddatum: '31-01-2026',
      status: 'Verlopen',
      sites: ['swbe (fr-BE)', 'swbe (nl-BE)'],
      lastTask: null,
    },
    {
      id: 10,
      naam: '2026 Q1: Douche deal NL',
      startdatum: '09-01-2026',
      einddatum: '31-01-2026',
      status: 'Verlopen',
      sites: ['swnl (nl_NL)'],
      lastTask: null,
    },
    {
      id: 11,
      naam: '2025 Q4: Black Friday ALL',
      startdatum: '25-11-2025',
      einddatum: '02-12-2025',
      status: 'Verlopen',
      sites: ['swbe (fr-BE)', 'swbe (nl-BE)', 'swnl (nl_NL)', 'swfr (fr_FR)'],
      lastTask: 'Prijzen herstellen',
    },
    {
      id: 12,
      naam: '2025 Q4: Winteractie Benelux',
      startdatum: '01-12-2025',
      einddatum: '31-12-2025',
      status: 'Verlopen',
      sites: ['swbe (fr-BE)', 'swbe (nl-BE)', 'swnl (nl_NL)'],
      lastTask: null,
    },
    {
      id: 13,
      naam: '2025 Q4: Cyber Monday NL',
      startdatum: '02-12-2025',
      einddatum: '02-12-2025',
      status: 'Verlopen',
      sites: ['swnl (nl_NL)'],
      lastTask: null,
    },
    {
      id: 14,
      naam: '2025 Q3: Zomerdeal ALL',
      startdatum: '01-07-2025',
      einddatum: '31-08-2025',
      status: 'Verlopen',
      sites: ['swbe (nl-BE)', 'swnl (nl_NL)', 'swfr (fr_FR)'],
      lastTask: null,
    },
    {
      id: 15,
      naam: '2025 Q2: Geberit Duofix promo',
      startdatum: '01-05-2025',
      einddatum: '30-06-2025',
      status: 'Verlopen',
      sites: ['swbe (nl-BE)', 'swnl (nl_NL)'],
      lastTask: null,
    },
  ]);

  const totalRecords = ref(106);

  // ── Status badge helpers ─────────────────────────────────────────
  const statusConfig: Record<OfferStatus, { label: string; classes: string }> = {
    Actief: { label: 'Actief', classes: 'status-badge--actief' },
    Verlopen: { label: 'Verlopen', classes: 'status-badge--verlopen' },
    'Binnenkort gepland': { label: 'Binnenkort gepland', classes: 'status-badge--gepland' },
  };

  // ── Filter definitions ───────────────────────────────────────────
  const allFilterDefs: FilterConfig[] = [
    { key: 'naam', label: 'Naam', type: 'text', placeholder: 'Zoek op naam' },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Actief', value: 'Actief' },
        { label: 'Verlopen', value: 'Verlopen' },
        { label: 'Binnenkort gepland', value: 'Binnenkort gepland' },
      ],
    },
    { key: 'site', label: 'Site', type: 'text', placeholder: 'bijv. swnl' },
    { key: 'jaar', label: 'Jaar', type: 'text', placeholder: 'bijv. 2026' },
    {
      key: 'kwartaal',
      label: 'Kwartaal',
      type: 'select',
      options: [
        { label: 'Q1', value: 'Q1' },
        { label: 'Q2', value: 'Q2' },
        { label: 'Q3', value: 'Q3' },
        { label: 'Q4', value: 'Q4' },
      ],
    },
  ];

  const defaultActiveKeys = ['naam', 'status', 'site'];

  function handleFilter(values: Record<string, string | boolean | null>) {
    // In production: trigger API call with filter values
    console.log('Filters applied:', values);
  }

  // ── Sites display ────────────────────────────────────────────────
  const MAX_SITES_SHOWN = 2;

  function visibleSites(sites: string[]) {
    return sites.slice(0, MAX_SITES_SHOWN);
  }

  function extraSiteCount(sites: string[]) {
    return sites.length > MAX_SITES_SHOWN ? sites.length - MAX_SITES_SHOWN : 0;
  }
</script>

<template>
  <div class="flex flex-col gap-5 grow">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold text-surface-800">Acties</h1>
      <Button label="Actie toevoegen" icon="pi pi-plus" icon-pos="right" />
    </div>

    <!-- Filter bar -->
    <FilterBar
      :all-filter-defs="allFilterDefs"
      :default-active-keys="defaultActiveKeys"
      @filter="handleFilter"
    />

    <!-- Result count + pagination -->
    <div class="flex items-center justify-between">
      <span class="text-xs font-semibold uppercase tracking-wider text-gray-400">
        {{ totalRecords.toLocaleString('nl-NL') }} acties
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
      :value="offers"
      class="offers-table"
      :pt="{ thead: { class: 'border-b border-gray-200' } }"
    >
      <Column field="naam" header="Naam">
        <template #body="{ data }">
          <span class="font-medium text-surface-700">{{ data.naam }}</span>
        </template>
      </Column>
      <Column field="startdatum" header="Startdatum" style="width: 8rem">
        <template #body="{ data }">
          <span class="text-surface-600 text-sm tabular-nums">{{ data.startdatum }}</span>
        </template>
      </Column>
      <Column field="einddatum" header="Einddatum" style="width: 8rem">
        <template #body="{ data }">
          <span class="text-surface-600 text-sm tabular-nums">{{ data.einddatum }}</span>
        </template>
      </Column>
      <Column field="status" header="Status" style="width: 7rem">
        <template #body="{ data }">
          <span class="status-badge" :class="statusConfig[data.status as OfferStatus].classes">
            {{ statusConfig[data.status as OfferStatus].label }}
          </span>
        </template>
      </Column>
      <Column field="sites" header="Sites">
        <template #body="{ data }">
          <div class="flex items-center gap-1 flex-wrap">
            <span v-for="site in visibleSites(data.sites)" :key="site" class="site-tag">
              {{ site }}
            </span>
            <span v-if="extraSiteCount(data.sites) > 0" class="site-tag site-tag--more">
              +{{ extraSiteCount(data.sites) }}
            </span>
          </div>
        </template>
      </Column>
      <Column field="lastTask" header="Laatste taak" style="width: 9rem">
        <template #body="{ data }">
          <span v-if="data.lastTask" class="text-surface-600 text-sm">{{ data.lastTask }}</span>
          <span v-else class="text-surface-300 text-sm italic">Geen taak</span>
        </template>
      </Column>
      <Column header="" style="width: 3rem">
        <template #body="{ data }">
          <Button
            icon="pi pi-pencil"
            variant="text"
            severity="secondary"
            size="small"
            rounded
            @click="router.push({ name: 'OffersEdit', params: { id: data.id } })"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
  /* ── Status badges ───────────────────────────────────────────── */
  .status-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.2rem 0.625rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .status-badge--actief {
    background: var(--p-green-100);
    color: var(--p-green-700);
  }

  .status-badge--verlopen {
    background: var(--p-gray-100);
    color: var(--p-gray-500);
  }

  .status-badge--gepland {
    background: var(--p-blue-100);
    color: var(--p-blue-700);
  }

  /* ── Site tags ───────────────────────────────────────────────── */
  .site-tag {
    display: inline-flex;
    align-items: center;
    padding: 0.125rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    background: var(--p-gray-100);
    color: var(--p-gray-600);
    white-space: nowrap;
  }

  .site-tag--more {
    background: transparent;
    color: var(--p-gray-400);
    font-weight: 400;
    padding-left: 0.125rem;
  }

  /* ── DataTable ───────────────────────────────────────────────── */
  .offers-table :deep(th) {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--p-surface-400);
    background: transparent;
    border-bottom: 1px solid var(--p-surface-200);
    padding: 0.625rem 0.75rem;
  }

  .offers-table :deep(td) {
    padding: 0.75rem;
    border-bottom: 1px solid var(--p-surface-100);
  }

  .offers-table :deep(tr:last-child td) {
    border-bottom: none;
  }

  .offers-table :deep(tr:hover td) {
    background: var(--p-surface-50);
  }

  .offers-table :deep(.p-datatable-tbody > tr) {
    transition: background 0.1s ease;
  }
</style>
