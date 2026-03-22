<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import type { Offer, OfferStatus } from '@/types/offer';
  import type { FilterConfig } from '@/types/filters';
  import FilterBar from '@/components/FilterBar.vue';
  import OverviewLayout from '@/components/layout/OverviewLayout.vue';
  import OverviewHeader from '@/components/layout/OverviewHeader.vue';
  import OverviewToolbar from '@/components/layout/OverviewToolbar.vue';
  import OverviewTable from '@/components/layout/OverviewTable.vue';

  const router = useRouter();

  const offers = ref<Offer[]>([
    {
      id: 1,
      name: '2026 Q1: Hansgrohe Raindance actie',
      startdatum: '03-02-2026',
      einddatum: '15-04-2026',
      status: 'Active',
      sites: ['swbe (fr-BE)', 'swbe (nl-BE)', 'swnl (nl_NL)'],
      lastTask: null,
    },
    {
      id: 2,
      name: '2026 Q1: Grohe Colors BE',
      startdatum: '11-02-2026',
      einddatum: '31-03-2026',
      status: 'Active',
      sites: ['swbe (fr-BE)', 'swbe (nl-BE)'],
      lastTask: 'Prijzen bijwerken',
    },
    {
      id: 3,
      name: '2026 Q1: SRiho cashback NL',
      startdatum: '25-01-2026',
      einddatum: '30-06-2026',
      status: 'Active',
      sites: ['swnl (nl_NL)'],
      lastTask: null,
    },
    {
      id: 4,
      name: '2026 Q1: Meubelactie Benelux',
      startdatum: '04-02-2026',
      einddatum: '02-03-2026',
      status: 'Active',
      sites: ['swbe (fr-BE)', 'swbe (nl-BE)', 'swnl (nl_NL)'],
      lastTask: 'Producten toevoegen',
    },
    {
      id: 5,
      name: '2026 Q2: Lente badkamer deal',
      startdatum: '01-04-2026',
      einddatum: '30-04-2026',
      status: 'Planned',
      sites: ['swbe (nl-BE)', 'swnl (nl_NL)'],
      lastTask: null,
    },
    {
      id: 6,
      name: '2026 Q2: Badkamer week FR',
      startdatum: '06-04-2026',
      einddatum: '13-04-2026',
      status: 'Planned',
      sites: ['swfr (fr_FR)'],
      lastTask: null,
    },
    {
      id: 7,
      name: '2026 Q2: Villeroy & Boch promo',
      startdatum: '15-03-2026',
      einddatum: '15-05-2026',
      status: 'Planned',
      sites: ['swbe (fr-BE)', 'swbe (nl-BE)', 'swnl (nl_NL)', 'swfr (fr_FR)'],
      lastTask: null,
    },
    {
      id: 8,
      name: '2026 Q1: SOLDES FR',
      startdatum: '10-01-2026',
      einddatum: '04-02-2026',
      status: 'Expired',
      sites: ['swfr (fr_FR)'],
      lastTask: null,
    },
    {
      id: 9,
      name: '2026 Q1: Solden BE',
      startdatum: '09-01-2026',
      einddatum: '31-01-2026',
      status: 'Expired',
      sites: ['swbe (fr-BE)', 'swbe (nl-BE)'],
      lastTask: null,
    },
    {
      id: 10,
      name: '2026 Q1: Douche deal NL',
      startdatum: '09-01-2026',
      einddatum: '31-01-2026',
      status: 'Expired',
      sites: ['swnl (nl_NL)'],
      lastTask: null,
    },
    {
      id: 11,
      name: '2025 Q4: Black Friday ALL',
      startdatum: '25-11-2025',
      einddatum: '02-12-2025',
      status: 'Expired',
      sites: ['swbe (fr-BE)', 'swbe (nl-BE)', 'swnl (nl_NL)', 'swfr (fr_FR)'],
      lastTask: 'Prijzen herstellen',
    },
    {
      id: 12,
      name: '2025 Q4: Winteractie Benelux',
      startdatum: '01-12-2025',
      einddatum: '31-12-2025',
      status: 'Expired',
      sites: ['swbe (fr-BE)', 'swbe (nl-BE)', 'swnl (nl_NL)'],
      lastTask: null,
    },
    {
      id: 13,
      name: '2025 Q4: Cyber Monday NL',
      startdatum: '02-12-2025',
      einddatum: '02-12-2025',
      status: 'Expired',
      sites: ['swnl (nl_NL)'],
      lastTask: null,
    },
    {
      id: 14,
      name: '2025 Q3: Zomerdeal ALL',
      startdatum: '01-07-2025',
      einddatum: '31-08-2025',
      status: 'Expired',
      sites: ['swbe (nl-BE)', 'swnl (nl_NL)', 'swfr (fr_FR)'],
      lastTask: null,
    },
    {
      id: 15,
      name: '2025 Q2: Geberit Duofix promo',
      startdatum: '01-05-2025',
      einddatum: '30-06-2025',
      status: 'Expired',
      sites: ['swbe (nl-BE)', 'swnl (nl_NL)'],
      lastTask: null,
    },
  ]);

  // ── Status badge helpers ─────────────────────────────────────────
  const statusConfig: Record<OfferStatus, { label: string; classes: string }> = {
    Active: { label: 'Actief', classes: 'status-badge--active' },
    Expired: { label: 'Verlopen', classes: 'status-badge--expired' },
    Planned: { label: 'Binnenkort gepland', classes: 'status-badge--planned' },
  };

  // ── Filter definitions ───────────────────────────────────────────
  const allFilterDefs: FilterConfig[] = [
    { key: 'naam', label: 'Naam', type: 'text', placeholder: 'Zoek op naam' },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Actief', value: 'Active' },
        { label: 'Verlopen', value: 'Expired' },
        { label: 'Binnenkort gepland', value: 'Planned' },
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

  const appliedFilters = ref<Record<string, string | boolean | null>>({});

  function handleFilter(values: Record<string, string | boolean | null>) {
    appliedFilters.value = values;
  }

  const filteredOffers = computed(() => {
    const f = appliedFilters.value;
    return offers.value.filter((offer) => {
      const name = offer.name.toLowerCase();
      if (f.q && typeof f.q === 'string') {
        if (!name.includes(f.q.toLowerCase())) return false;
      }
      if (f.naam && typeof f.naam === 'string') {
        if (!name.includes(f.naam.toLowerCase())) return false;
      }
      if (f.status && typeof f.status === 'string') {
        if (offer.status !== (f.status as string)) return false;
      }
      if (f.site && typeof f.site === 'string') {
        if (!offer.sites.some((s) => s.toLowerCase().includes((f.site as string).toLowerCase()))) return false;
      }
      if (f.jaar && typeof f.jaar === 'string') {
        if (!offer.name.includes(f.jaar)) return false;
      }
      if (f.kwartaal && typeof f.kwartaal === 'string') {
        if (!offer.name.includes(f.kwartaal)) return false;
      }
      return true;
    });
  });

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
  <OverviewLayout>
    <OverviewHeader title="Acties" />

    <FilterBar
      :all-filter-defs="allFilterDefs"
      :default-active-keys="defaultActiveKeys"
      :default-collapsed="true"
      @filter="handleFilter"
    />

    <OverviewToolbar :count="filteredOffers.length" label="acties" />

    <OverviewTable :value="filteredOffers">
      <Column field="naam" header="Naam">
        <template #body="{ data }">
          <span class="font-medium text-surface-700">{{ data.name }}</span>
        </template>
      </Column>
      <Column field="startdatum" header="Startdatum" style="width: 8rem">
        <template #body="{ data }">
          <span class="text-surface-600 text-base tabular-nums">{{ data.startdatum }}</span>
        </template>
      </Column>
      <Column field="einddatum" header="Einddatum" style="width: 8rem">
        <template #body="{ data }">
          <span class="text-surface-600 text-base tabular-nums">{{ data.einddatum }}</span>
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
          <span v-if="data.lastTask" class="text-surface-600 text-base">{{ data.lastTask }}</span>
          <span v-else class="text-surface-300 text-base italic">Geen taak</span>
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
            @click="router.push({ name: 'OffersEdit', params: { id: data.id } })"
          />
        </template>
      </Column>
    </OverviewTable>
  </OverviewLayout>
</template>
