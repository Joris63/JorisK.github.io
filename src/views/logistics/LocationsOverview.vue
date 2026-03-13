<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import FilterBar from '@/components/FilterBar.vue';
  import type { FilterConfig } from '@/types/filters';

  const router = useRouter();

  // ── Tab state ────────────────────────────────────────────────────────
  const activeTab = ref('winkels');

  const TAB_CONFIG = {
    winkels:         { title: 'Winkels',          addLabel: 'Winkel toevoegen' },
    magazijnen:      { title: 'Magazijnen',        addLabel: 'Magazijn toevoegen' },
    magazijngroepen: { title: 'Magazijngroepen',   addLabel: 'Magazijngroep toevoegen' },
    afhaallocaties:  { title: 'Afhaallocaties',    addLabel: 'Afhaallocatie toevoegen' },
    klantenservice:  { title: 'Klantenservice',    addLabel: 'Klantenservice toevoegen' },
  } as const;

  const currentTab = computed(() => TAB_CONFIG[activeTab.value as keyof typeof TAB_CONFIG]);

  // ── Types ────────────────────────────────────────────────────────────
  interface Winkel        { id: number; naam: string; land: string; actief: boolean }
  interface Magazijn      { id: number; naam: string; stad: string; land: string; bevatGoederen: boolean }
  interface Magazijngroep { id: number; afkorting: string; naam: string }
  interface Afhaallocatie { id: number; land: string; naam: string; adres: string; telefoonnummer: string }
  interface Klantenservice{ id: number; naam: string; site: string }

  // ── Mock data: Winkels ───────────────────────────────────────────────
  const winkels = ref<Winkel[]>([
    { id:  1, naam: 'Alkmaar',           land: 'NL', actief: true  },
    { id:  2, naam: 'Almere',            land: 'NL', actief: true  },
    { id:  3, naam: 'Amsterdam Amstel',  land: 'NL', actief: true  },
    { id:  4, naam: 'Amsterdam West',    land: 'NL', actief: true  },
    { id:  5, naam: 'Arnhem',            land: 'NL', actief: true  },
    { id:  6, naam: 'Breda',             land: 'NL', actief: true  },
    { id:  7, naam: 'Eindhoven',         land: 'NL', actief: true  },
    { id:  8, naam: 'Groningen',         land: 'NL', actief: true  },
    { id:  9, naam: 'Haarlem',           land: 'NL', actief: false },
    { id: 10, naam: 'Den Haag',          land: 'NL', actief: true  },
    { id: 11, naam: 'Leeuwarden',        land: 'NL', actief: true  },
    { id: 12, naam: 'Leiden',            land: 'NL', actief: true  },
    { id: 13, naam: 'Maastricht',        land: 'NL', actief: false },
    { id: 14, naam: 'Nijmegen',          land: 'NL', actief: true  },
    { id: 15, naam: 'Rotterdam',         land: 'NL', actief: true  },
    { id: 16, naam: 'Tilburg',           land: 'NL', actief: true  },
    { id: 17, naam: 'Utrecht',           land: 'NL', actief: true  },
    { id: 18, naam: 'Zwolle',            land: 'NL', actief: true  },
    { id: 19, naam: 'Antwerpen',         land: 'BE',    actief: true  },
    { id: 20, naam: 'Gent',              land: 'BE',    actief: true  },
    { id: 21, naam: 'Brussel',           land: 'BE',    actief: false },
  ]);

  // ── Mock data: Magazijnen ────────────────────────────────────────────
  const magazijnen = ref<Magazijn[]>([
    { id:  1, naam: 'Centraal magazijn Den Bosch',  stad: 'Den Bosch',     land: 'NL', bevatGoederen: true  },
    { id:  2, naam: 'Inkomend Alkmaar',             stad: 'Alkmaar',       land: 'NL', bevatGoederen: false },
    { id:  3, naam: 'Inkomend Amsterdam Amstel',    stad: 'Amsterdam',     land: 'NL', bevatGoederen: false },
    { id:  4, naam: 'Inkomend Amsterdam West',      stad: 'Amsterdam',     land: 'NL', bevatGoederen: true  },
    { id:  5, naam: 'Inkomend Arnhem',              stad: 'Arnhem',        land: 'NL', bevatGoederen: false },
    { id:  6, naam: 'Inkomend Breda',               stad: 'Breda',         land: 'NL', bevatGoederen: false },
    { id:  7, naam: 'Inkomend Eindhoven',           stad: 'Son en Breugel',land: 'NL', bevatGoederen: true  },
    { id:  8, naam: 'Inkomend Groningen',           stad: 'Groningen',     land: 'NL', bevatGoederen: false },
    { id:  9, naam: 'Inkomend Hasselt',             stad: 'Hasselt',       land: 'BE',    bevatGoederen: false },
    { id: 10, naam: 'Inkomend Utrecht',             stad: 'Utrecht',       land: 'NL', bevatGoederen: true  },
    { id: 11, naam: 'Retour Rotterdam',             stad: 'Rotterdam',     land: 'NL', bevatGoederen: true  },
    { id: 12, naam: 'Showroom Voorraad NL',         stad: 'Rosmalen',      land: 'NL', bevatGoederen: true  },
    { id: 13, naam: 'Showroom Voorraad BE',         stad: 'Kalmthout',     land: 'BE',    bevatGoederen: true  },
    { id: 14, naam: 'Quarantaine Den Bosch',        stad: 'Den Bosch',     land: 'NL', bevatGoederen: true  },
    { id: 15, naam: 'Outbound Rosmalen',            stad: 'Rosmalen',      land: 'NL', bevatGoederen: false },
  ]);

  // ── Mock data: Magazijngroepen ───────────────────────────────────────
  const magazijngroepen = ref<Magazijngroep[]>([
    { id:  1, afkorting: 'ROS',   naam: 'Voorraad Rosmalen' },
    { id:  2, afkorting: 'KAL',   naam: 'Voorraad Kalmthout' },
    { id:  3, afkorting: 'AMS',   naam: 'Voorraad Amsterdam West' },
    { id:  4, afkorting: 'SHOW',  naam: 'Showrooms' },
    { id:  5, afkorting: 'SHOWM', naam: 'Showroom Modellen' },
    { id:  6, afkorting: 'RTM',   naam: 'Voorraad Rotterdam' },
    { id:  7, afkorting: 'GRN',   naam: 'Voorraad Groningen' },
    { id:  8, afkorting: 'IN',    naam: 'Inkomend' },
    { id:  9, afkorting: 'RET',   naam: 'Retouren' },
    { id: 10, afkorting: 'QUA',   naam: 'Quarantaine' },
  ]);

  // ── Mock data: Afhaallocaties ────────────────────────────────────────
  const afhaallocaties = ref<Afhaallocatie[]>([
    { id:  1, land: 'NL', naam: 'Alkmaar',          adres: 'Koelmalaan 330, 1812 PS Alkmaar',                  telefoonnummer: '+31722014000'  },
    { id:  2, land: 'NL', naam: 'Almere',            adres: 'Miamistraat 100, 1334 KX Almere',                  telefoonnummer: '+31362076083'  },
    { id:  3, land: 'NL', naam: 'Amsterdam Amstel',  adres: 'Daniël Goedkoopstraat 23, 1096BD Amsterdam',       telefoonnummer: '+31735220688'  },
    { id:  4, land: 'NL', naam: 'Amsterdam West',    adres: 'Willem de Zwijgerlaan 344, 1055RD Amsterdam',      telefoonnummer: '+31207603030'  },
    { id:  5, land: 'NL', naam: 'Arnhem',            adres: 'Heerlenstraat 65, 6845 AE Arnhem',                 telefoonnummer: '+31263033880'  },
    { id:  6, land: 'NL', naam: 'Breda',             adres: 'Grenssteen 19, 4815PP Breda',                      telefoonnummer: '+31762300000'  },
    { id:  7, land: 'NL', naam: 'Eindhoven',         adres: 'Luchthavenweg 81, 5657 EA Eindhoven',              telefoonnummer: '+31402512340'  },
    { id:  8, land: 'NL', naam: 'Groningen',         adres: 'Driebondsweg 123, 9723 BR Groningen',              telefoonnummer: '+31503690000'  },
    { id:  9, land: 'NL', naam: 'Den Haag',          adres: 'Binckhorstlaan 36, 2516 BE Den Haag',              telefoonnummer: '+31703816010'  },
    { id: 10, land: 'NL', naam: 'Rotterdam',         adres: 'Weena 70, 3012 CM Rotterdam',                      telefoonnummer: '+31102121700'  },
    { id: 11, land: 'NL', naam: 'Utrecht',           adres: 'Europalaan 100, 3526 KS Utrecht',                  telefoonnummer: '+31302825600'  },
    { id: 12, land: 'NL', naam: 'Zwolle',            adres: 'Celsiusstraat 1, 8013 RD Zwolle',                  telefoonnummer: '+31384261980'  },
    { id: 13, land: 'BE', naam: 'Antwerpen',         adres: 'Bisschoppenhoflaan 500, 2100 Deurne',              telefoonnummer: '+3232392150'   },
    { id: 14, land: 'BE', naam: 'Gent',              adres: 'Kortrijksesteenweg 1106, 9051 Sint-Denijs-Westrem',telefoonnummer: '+3292417080'   },
    { id: 15, land: 'BE', naam: 'Hasselt',           adres: 'Kempische Steenweg 301, 3500 Hasselt',             telefoonnummer: '+3211285090'   },
  ]);

  // ── Mock data: Klantenservice ────────────────────────────────────────
  const klantenservice = ref<Klantenservice[]>([
    { id: 1, naam: 'Klantenservice Nederland', site: 'SWNL' },
    { id: 2, naam: 'Klantenservice België',    site: 'SWBE' },
    { id: 3, naam: 'Klantenservice Frankrijk', site: 'SWFR' },
  ]);

  // ── Filters: Magazijnen ──────────────────────────────────────────────
  const magazijnFilterDefs: FilterConfig[] = [
    { key: 'naam',          label: 'Naam',           type: 'text',    placeholder: 'Inkomend...' },
    { key: 'stad',          label: 'Stad',           type: 'text',    placeholder: 'Amsterdam' },
    { key: 'bevatGoederen', label: 'Bevat goederen', type: 'boolean' },
  ];

  const magazijnApplied = ref<Record<string, string | boolean | null>>({});
  function handleMagazijnFilter(v: Record<string, string | boolean | null>) { magazijnApplied.value = v; }

  const filteredMagazijnen = computed(() => {
    const f = magazijnApplied.value;
    return magazijnen.value.filter((m) => {
      if (f.naam && typeof f.naam === 'string' && !m.naam.toLowerCase().includes(f.naam.toLowerCase())) return false;
      if (f.stad && typeof f.stad === 'string' && !m.stad.toLowerCase().includes(f.stad.toLowerCase())) return false;
      if (f.bevatGoederen !== null && f.bevatGoederen !== undefined && f.bevatGoederen !== '' && m.bevatGoederen !== f.bevatGoederen) return false;
      return true;
    });
  });

</script>

<template>
  <div class="flex flex-col gap-5 grow">

    <!-- Tab navigation -->
    <Tabs v-model:value="activeTab">
      <TabList>
        <Tab value="winkels">Winkels</Tab>
        <Tab value="magazijnen">Magazijnen</Tab>
        <Tab value="magazijngroepen">Magazijngroepen</Tab>
        <Tab value="afhaallocaties">Afhaallocaties</Tab>
        <Tab value="klantenservice">Klantenservice</Tab>
      </TabList>
    </Tabs>

    <!-- Dynamic header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold text-surface-800">{{ currentTab.title }}</h1>
    </div>

    <!-- ── Winkels ─────────────────────────────────────────────────── -->
    <template v-if="activeTab === 'winkels'">
      <div class="flex items-center justify-between gap-3">
        <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap">
          {{ winkels.length.toLocaleString('nl-NL') }} winkels
        </span>
        <Paginator
          v-if="winkels.length > 15"
          :rows="15"
          :total-records="winkels.length"
          :rows-per-page-options="[15, 30, 50]"
          class="p-0! border-0! bg-transparent!"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        />
      </div>
      <DataTable
        :value="winkels"
        class="overview-table"
        :pt="{ thead: { class: 'border-b border-gray-200' } }"
      >
        <Column field="naam" header="Naam">
          <template #body="{ data }">
            <span class="font-medium text-surface-700">{{ data.naam }}</span>
          </template>
        </Column>
        <Column field="land" header="Land" style="width: 5rem">
          <template #body="{ data }">
            <span class="site-tag">{{ data.land }}</span>
          </template>
        </Column>
        <Column field="actief" header="Actief">
          <template #body="{ data }">
            <span class="status-badge" :class="data.actief ? 'status-badge--yes' : 'status-badge--no'">
              {{ data.actief ? 'Ja' : 'Nee' }}
            </span>
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
              @click="router.push({ name: 'StoreEdit', params: { id: data.id } })"
            />
          </template>
        </Column>
      </DataTable>
    </template>

    <!-- ── Magazijnen ─────────────────────────────────────────────── -->
    <template v-else-if="activeTab === 'magazijnen'">
      <FilterBar
        :all-filter-defs="magazijnFilterDefs"
        :default-active-keys="['naam', 'stad', 'bevatGoederen']"
        :default-collapsed="true"
        :show-search="false"
        @filter="handleMagazijnFilter"
      />
      <div class="flex items-center justify-between gap-3">
        <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap">
          {{ filteredMagazijnen.length.toLocaleString('nl-NL') }} magazijnen
        </span>
        <Paginator
          v-if="filteredMagazijnen.length > 15"
          :rows="15"
          :total-records="filteredMagazijnen.length"
          :rows-per-page-options="[15, 30, 50]"
          class="p-0! border-0! bg-transparent!"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        />
      </div>
      <DataTable
        :value="filteredMagazijnen"
        class="overview-table"
        :pt="{ thead: { class: 'border-b border-gray-200' } }"
      >
        <Column field="naam" header="Naam">
          <template #body="{ data }">
            <span class="font-medium text-surface-700">{{ data.naam }}</span>
          </template>
        </Column>
        <Column field="stad" header="Stad">
          <template #body="{ data }">
            <span class="text-surface-600">{{ data.stad }}</span>
          </template>
        </Column>
        <Column field="land" header="Land" style="width: 5rem">
          <template #body="{ data }">
            <span class="site-tag">{{ data.land }}</span>
          </template>
        </Column>
        <Column field="bevatGoederen" header="Bevat goederen">
          <template #body="{ data }">
            <span class="status-badge" :class="data.bevatGoederen ? 'status-badge--yes' : 'status-badge--no'">
              {{ data.bevatGoederen ? 'Ja' : 'Nee' }}
            </span>
          </template>
        </Column>
        <Column header="" style="width: 3rem">
          <template #body>
            <Button icon="pi pi-pencil" variant="text" severity="secondary" size="small" rounded />
          </template>
        </Column>
      </DataTable>
    </template>

    <!-- ── Magazijngroepen ────────────────────────────────────────── -->
    <template v-else-if="activeTab === 'magazijngroepen'">
      <div class="flex items-center justify-between gap-3">
        <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap">
          {{ magazijngroepen.length.toLocaleString('nl-NL') }} magazijngroepen
        </span>
        <Paginator
          v-if="magazijngroepen.length > 15"
          :rows="15"
          :total-records="magazijngroepen.length"
          :rows-per-page-options="[15, 30, 50]"
          class="p-0! border-0! bg-transparent!"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        />
      </div>
      <DataTable
        :value="magazijngroepen"
        class="overview-table"
        :pt="{ thead: { class: 'border-b border-gray-200' } }"
      >
        <Column field="afkorting" header="Afkorting" style="width: 8rem">
          <template #body="{ data }">
            <span class="font-mono text-sm font-medium text-surface-600">{{ data.afkorting }}</span>
          </template>
        </Column>
        <Column field="naam" header="Naam">
          <template #body="{ data }">
            <span class="font-medium text-surface-700">{{ data.naam }}</span>
          </template>
        </Column>
        <Column header="" style="width: 3rem">
          <template #body>
            <Button icon="pi pi-pencil" variant="text" severity="secondary" size="small" rounded />
          </template>
        </Column>
      </DataTable>
    </template>

    <!-- ── Afhaallocaties ─────────────────────────────────────────── -->
    <template v-else-if="activeTab === 'afhaallocaties'">
      <div class="flex items-center justify-between gap-3">
        <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap">
          {{ afhaallocaties.length.toLocaleString('nl-NL') }} afhaallocaties
        </span>
        <Paginator
          v-if="afhaallocaties.length > 15"
          :rows="15"
          :total-records="afhaallocaties.length"
          :rows-per-page-options="[15, 30, 50]"
          class="p-0! border-0! bg-transparent!"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        />
      </div>
      <DataTable
        :value="afhaallocaties"
        class="overview-table"
        :pt="{ thead: { class: 'border-b border-gray-200' } }"
      >
        <Column field="land" header="Land" style="width: 5rem">
          <template #body="{ data }">
            <span class="site-tag">{{ data.land }}</span>
          </template>
        </Column>
        <Column field="naam" header="Naam">
          <template #body="{ data }">
            <span class="font-medium text-surface-700">{{ data.naam }}</span>
          </template>
        </Column>
        <Column field="adres" header="Adres">
          <template #body="{ data }">
            <span class="text-surface-600 text-sm">{{ data.adres }}</span>
          </template>
        </Column>
        <Column field="telefoonnummer" header="Telefoonnummer" style="width: 11rem">
          <template #body="{ data }">
            <span class="text-surface-600 text-sm tabular-nums">{{ data.telefoonnummer }}</span>
          </template>
        </Column>
        <Column header="" style="width: 3rem">
          <template #body>
            <Button icon="pi pi-pencil" variant="text" severity="secondary" size="small" rounded />
          </template>
        </Column>
      </DataTable>
    </template>

    <!-- ── Klantenservice ─────────────────────────────────────────── -->
    <template v-else-if="activeTab === 'klantenservice'">
      <div class="flex items-center justify-between gap-3">
        <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap">
          {{ klantenservice.length.toLocaleString('nl-NL') }} klantenservice locaties
        </span>
        <Paginator
          v-if="klantenservice.length > 15"
          :rows="15"
          :total-records="klantenservice.length"
          :rows-per-page-options="[15, 30, 50]"
          class="p-0! border-0! bg-transparent!"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        />
      </div>
      <DataTable
        :value="klantenservice"
        class="overview-table"
        :pt="{ thead: { class: 'border-b border-gray-200' } }"
      >
        <Column field="naam" header="Naam">
          <template #body="{ data }">
            <span class="font-medium text-surface-700">{{ data.naam }}</span>
          </template>
        </Column>
        <Column field="site" header="Site" style="width: 8rem">
          <template #body="{ data }">
            <span class="site-tag">{{ data.site }}</span>
          </template>
        </Column>
        <Column header="" style="width: 3rem">
          <template #body>
            <Button icon="pi pi-pencil" variant="text" severity="secondary" size="small" rounded />
          </template>
        </Column>
      </DataTable>
    </template>

  </div>
</template>
