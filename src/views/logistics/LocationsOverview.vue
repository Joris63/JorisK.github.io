<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import FilterBar from '@/components/FilterBar.vue';
  import type { FilterConfig } from '@/types/filters';
  import OverviewLayout from '@/components/layout/OverviewLayout.vue';
  import OverviewHeader from '@/components/layout/OverviewHeader.vue';
  import OverviewToolbar from '@/components/layout/OverviewToolbar.vue';
  import OverviewTable from '@/components/layout/OverviewTable.vue';

  const route = useRoute();
  const router = useRouter();

  // ── Tab state ────────────────────────────────────────────────────────
  const activeTab = ref(route.query.tab as string || 'stores');

  const TAB_CONFIG = {
    stores: { title: 'Winkels', addLabel: 'Winkel toevoegen' },
    warehouses: { title: 'Magazijnen', addLabel: 'Magazijn toevoegen' },
    warehouseGroups: { title: 'Magazijngroepen', addLabel: 'Magazijngroep toevoegen' },
    pickupLocations: { title: 'Afhaallocaties', addLabel: 'Afhaallocatie toevoegen' },
    customerService: { title: 'Klantenservice', addLabel: 'Klantenservice toevoegen' },
  } as const;

  const currentTab = computed(() => TAB_CONFIG[activeTab.value as keyof typeof TAB_CONFIG]);

  // ── Types ────────────────────────────────────────────────────────────
  interface Store {
    id: number;
    name: string;
    country: string;
    active: boolean;
  }
  interface Warehouse {
    id: number;
    name: string;
    city: string;
    country: string;
    containsGoods: boolean;
  }
  interface WarehouseGroup {
    id: number;
    abbreviation: string;
    name: string;
  }
  interface PickupLocation {
    id: number;
    country: string;
    name: string;
    address: string;
    phoneNumber: string;
  }
  interface CustomerService {
    id: number;
    name: string;
    site: string;
  }

  // ── Mock data: Stores ────────────────────────────────────────────────
  const stores = ref<Store[]>([
    { id: 1, name: 'Alkmaar', country: 'NL', active: true },
    { id: 2, name: 'Almere', country: 'NL', active: true },
    { id: 3, name: 'Amsterdam Amstel', country: 'NL', active: true },
    { id: 4, name: 'Amsterdam West', country: 'NL', active: true },
    { id: 5, name: 'Arnhem', country: 'NL', active: true },
    { id: 6, name: 'Breda', country: 'NL', active: true },
    { id: 7, name: 'Eindhoven', country: 'NL', active: true },
    { id: 8, name: 'Groningen', country: 'NL', active: true },
    { id: 9, name: 'Haarlem', country: 'NL', active: false },
    { id: 10, name: 'Den Haag', country: 'NL', active: true },
    { id: 11, name: 'Leeuwarden', country: 'NL', active: true },
    { id: 12, name: 'Leiden', country: 'NL', active: true },
    { id: 13, name: 'Maastricht', country: 'NL', active: false },
    { id: 14, name: 'Nijmegen', country: 'NL', active: true },
    { id: 15, name: 'Rotterdam', country: 'NL', active: true },
    { id: 16, name: 'Tilburg', country: 'NL', active: true },
    { id: 17, name: 'Utrecht', country: 'NL', active: true },
    { id: 18, name: 'Zwolle', country: 'NL', active: true },
    { id: 19, name: 'Antwerpen', country: 'BE', active: true },
    { id: 20, name: 'Gent', country: 'BE', active: true },
    { id: 21, name: 'Brussel', country: 'BE', active: false },
  ]);

  // ── Mock data: Warehouses ────────────────────────────────────────────
  const warehouses = ref<Warehouse[]>([
    {
      id: 1,
      name: 'Centraal magazijn Den Bosch',
      city: 'Den Bosch',
      country: 'NL',
      containsGoods: true,
    },
    { id: 2, name: 'Inkomend Alkmaar', city: 'Alkmaar', country: 'NL', containsGoods: false },
    {
      id: 3,
      name: 'Inkomend Amsterdam Amstel',
      city: 'Amsterdam',
      country: 'NL',
      containsGoods: false,
    },
    {
      id: 4,
      name: 'Inkomend Amsterdam West',
      city: 'Amsterdam',
      country: 'NL',
      containsGoods: true,
    },
    { id: 5, name: 'Inkomend Arnhem', city: 'Arnhem', country: 'NL', containsGoods: false },
    { id: 6, name: 'Inkomend Breda', city: 'Breda', country: 'NL', containsGoods: false },
    {
      id: 7,
      name: 'Inkomend Eindhoven',
      city: 'Son en Breugel',
      country: 'NL',
      containsGoods: true,
    },
    { id: 8, name: 'Inkomend Groningen', city: 'Groningen', country: 'NL', containsGoods: false },
    { id: 9, name: 'Inkomend Hasselt', city: 'Hasselt', country: 'BE', containsGoods: false },
    { id: 10, name: 'Inkomend Utrecht', city: 'Utrecht', country: 'NL', containsGoods: true },
    { id: 11, name: 'Retour Rotterdam', city: 'Rotterdam', country: 'NL', containsGoods: true },
    { id: 12, name: 'Showroom Voorraad NL', city: 'Rosmalen', country: 'NL', containsGoods: true },
    { id: 13, name: 'Showroom Voorraad BE', city: 'Kalmthout', country: 'BE', containsGoods: true },
    {
      id: 14,
      name: 'Quarantaine Den Bosch',
      city: 'Den Bosch',
      country: 'NL',
      containsGoods: true,
    },
    { id: 15, name: 'Outbound Rosmalen', city: 'Rosmalen', country: 'NL', containsGoods: false },
  ]);

  // ── Mock data: Warehouse groups ──────────────────────────────────────
  const warehouseGroups = ref<WarehouseGroup[]>([
    { id: 1, abbreviation: 'ROS', name: 'Voorraad Rosmalen' },
    { id: 2, abbreviation: 'KAL', name: 'Voorraad Kalmthout' },
    { id: 3, abbreviation: 'AMS', name: 'Voorraad Amsterdam West' },
    { id: 4, abbreviation: 'SHOW', name: 'Showrooms' },
    { id: 5, abbreviation: 'SHOWM', name: 'Showroom Modellen' },
    { id: 6, abbreviation: 'RTM', name: 'Voorraad Rotterdam' },
    { id: 7, abbreviation: 'GRN', name: 'Voorraad Groningen' },
    { id: 8, abbreviation: 'IN', name: 'Inkomend' },
    { id: 9, abbreviation: 'RET', name: 'Retouren' },
    { id: 10, abbreviation: 'QUA', name: 'Quarantaine' },
  ]);

  // ── Mock data: Pickup locations ──────────────────────────────────────
  const pickupLocations = ref<PickupLocation[]>([
    {
      id: 1,
      country: 'NL',
      name: 'Alkmaar',
      address: 'Koelmalaan 330, 1812 PS Alkmaar',
      phoneNumber: '+31722014000',
    },
    {
      id: 2,
      country: 'NL',
      name: 'Almere',
      address: 'Miamistraat 100, 1334 KX Almere',
      phoneNumber: '+31362076083',
    },
    {
      id: 3,
      country: 'NL',
      name: 'Amsterdam Amstel',
      address: 'Daniël Goedkoopstraat 23, 1096BD Amsterdam',
      phoneNumber: '+31735220688',
    },
    {
      id: 4,
      country: 'NL',
      name: 'Amsterdam West',
      address: 'Willem de Zwijgerlaan 344, 1055RD Amsterdam',
      phoneNumber: '+31207603030',
    },
    {
      id: 5,
      country: 'NL',
      name: 'Arnhem',
      address: 'Heerlenstraat 65, 6845 AE Arnhem',
      phoneNumber: '+31263033880',
    },
    {
      id: 6,
      country: 'NL',
      name: 'Breda',
      address: 'Grenssteen 19, 4815PP Breda',
      phoneNumber: '+31762300000',
    },
    {
      id: 7,
      country: 'NL',
      name: 'Eindhoven',
      address: 'Luchthavenweg 81, 5657 EA Eindhoven',
      phoneNumber: '+31402512340',
    },
    {
      id: 8,
      country: 'NL',
      name: 'Groningen',
      address: 'Driebondsweg 123, 9723 BR Groningen',
      phoneNumber: '+31503690000',
    },
    {
      id: 9,
      country: 'NL',
      name: 'Den Haag',
      address: 'Binckhorstlaan 36, 2516 BE Den Haag',
      phoneNumber: '+31703816010',
    },
    {
      id: 10,
      country: 'NL',
      name: 'Rotterdam',
      address: 'Weena 70, 3012 CM Rotterdam',
      phoneNumber: '+31102121700',
    },
    {
      id: 11,
      country: 'NL',
      name: 'Utrecht',
      address: 'Europalaan 100, 3526 KS Utrecht',
      phoneNumber: '+31302825600',
    },
    {
      id: 12,
      country: 'NL',
      name: 'Zwolle',
      address: 'Celsiusstraat 1, 8013 RD Zwolle',
      phoneNumber: '+31384261980',
    },
    {
      id: 13,
      country: 'BE',
      name: 'Antwerpen',
      address: 'Bisschoppenhoflaan 500, 2100 Deurne',
      phoneNumber: '+3232392150',
    },
    {
      id: 14,
      country: 'BE',
      name: 'Gent',
      address: 'Kortrijksesteenweg 1106, 9051 Sint-Denijs-Westrem',
      phoneNumber: '+3292417080',
    },
    {
      id: 15,
      country: 'BE',
      name: 'Hasselt',
      address: 'Kempische Steenweg 301, 3500 Hasselt',
      phoneNumber: '+3211285090',
    },
  ]);

  // ── Mock data: Customer service ──────────────────────────────────────
  const customerService = ref<CustomerService[]>([
    { id: 1, name: 'Klantenservice Nederland', site: 'SWNL' },
    { id: 2, name: 'Klantenservice België', site: 'SWBE' },
    { id: 3, name: 'Klantenservice Frankrijk', site: 'SWFR' },
  ]);

  // ── Filters: Warehouses ──────────────────────────────────────────────
  const warehouseFilterDefs: FilterConfig[] = [
    { key: 'name', label: 'Naam', type: 'text', placeholder: 'Inkomend...' },
    { key: 'city', label: 'Stad', type: 'text', placeholder: 'Amsterdam' },
    { key: 'containsGoods', label: 'Bevat goederen', type: 'boolean' },
  ];

  const warehouseApplied = ref<Record<string, string | boolean | null>>({});
  function handleWarehouseFilter(v: Record<string, string | boolean | null>) {
    warehouseApplied.value = v;
  }

  const filteredWarehouses = computed(() => {
    const f = warehouseApplied.value;
    return warehouses.value.filter((m) => {
      if (
        f.name &&
        typeof f.name === 'string' &&
        !m.name.toLowerCase().includes(f.name.toLowerCase())
      )
        return false;
      if (
        f.city &&
        typeof f.city === 'string' &&
        !m.city.toLowerCase().includes(f.city.toLowerCase())
      )
        return false;
      if (
        f.containsGoods !== null &&
        f.containsGoods !== undefined &&
        f.containsGoods !== '' &&
        m.containsGoods !== f.containsGoods
      )
        return false;
      return true;
    });
  });
</script>

<template>
  <OverviewLayout>
    <!-- Tab navigation -->
    <Tabs v-model:value="activeTab">
      <TabList>
        <Tab value="stores">Winkels</Tab>
        <Tab value="warehouses">Magazijnen</Tab>
        <Tab value="warehouseGroups">Magazijngroepen</Tab>
        <Tab value="pickupLocations">Afhaallocaties</Tab>
        <Tab value="customerService">Klantenservice</Tab>
      </TabList>
    </Tabs>

    <OverviewHeader :title="currentTab.title">
      <template #actions>
        <Button
          :label="currentTab.addLabel"
          icon="pi pi-plus"
          icon-pos="right"
          @click="activeTab === 'stores' ? router.push({ name: 'StoreAdd' }) : undefined"
        />
      </template>
    </OverviewHeader>

    <!-- ── Stores ───────────────────────────────────────────────── -->
    <template v-if="activeTab === 'stores'">
      <OverviewToolbar :count="stores.length" label="winkels" />
      <OverviewTable :value="stores">
        <Column field="name" header="Naam">
          <template #body="{ data }">
            <span class="font-medium text-surface-700">{{ data.name }}</span>
          </template>
        </Column>
        <Column field="country" header="Land" style="width: 5rem">
          <template #body="{ data }">
            <span class="site-tag">{{ data.country }}</span>
          </template>
        </Column>
        <Column field="active" header="Actief">
          <template #body="{ data }">
            <span
              class="status-badge"
              :class="data.active ? 'status-badge--yes' : 'status-badge--no'"
            >
              {{ data.active ? 'Ja' : 'Nee' }}
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
      </OverviewTable>
    </template>

    <!-- ── Warehouses ─────────────────────────────────────────── -->
    <template v-else-if="activeTab === 'warehouses'">
      <FilterBar
        :all-filter-defs="warehouseFilterDefs"
        :default-active-keys="['name', 'city', 'containsGoods']"
        :default-collapsed="true"
        :show-search="false"
        @filter="handleWarehouseFilter"
      />
      <OverviewToolbar :count="filteredWarehouses.length" label="magazijnen" />
      <OverviewTable :value="filteredWarehouses">
        <Column field="name" header="Naam">
          <template #body="{ data }">
            <span class="font-medium text-surface-700">{{ data.name }}</span>
          </template>
        </Column>
        <Column field="city" header="Stad">
          <template #body="{ data }">
            <span class="text-surface-600">{{ data.city }}</span>
          </template>
        </Column>
        <Column field="country" header="Land" style="width: 5rem">
          <template #body="{ data }">
            <span class="site-tag">{{ data.country }}</span>
          </template>
        </Column>
        <Column field="containsGoods" header="Bevat goederen">
          <template #body="{ data }">
            <span
              class="status-badge"
              :class="data.containsGoods ? 'status-badge--yes' : 'status-badge--no'"
            >
              {{ data.containsGoods ? 'Ja' : 'Nee' }}
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
              @click="router.push({ name: 'WarehouseEdit', params: { id: data.id } })"
            />
          </template>
        </Column>
      </OverviewTable>
    </template>

    <!-- ── Warehouse groups ────────────────────────────────────── -->
    <template v-else-if="activeTab === 'warehouseGroups'">
      <OverviewToolbar :count="warehouseGroups.length" label="magazijngroepen" />
      <OverviewTable :value="warehouseGroups">
        <Column field="abbreviation" header="Afkorting" style="width: 8rem">
          <template #body="{ data }">
            <span class="font-mono text-sm font-medium text-surface-600">{{
              data.abbreviation
            }}</span>
          </template>
        </Column>
        <Column field="name" header="Naam">
          <template #body="{ data }">
            <span class="font-medium text-surface-700">{{ data.name }}</span>
          </template>
        </Column>
        <Column header="" style="width: 3rem">
          <template #body>
            <Button icon="pi pi-pencil" variant="text" severity="secondary" size="small" rounded />
          </template>
        </Column>
      </OverviewTable>
    </template>

    <!-- ── Pickup locations ────────────────────────────────────── -->
    <template v-else-if="activeTab === 'pickupLocations'">
      <OverviewToolbar :count="pickupLocations.length" label="afhaallocaties" />
      <OverviewTable :value="pickupLocations">
        <Column field="country" header="Land" style="width: 5rem">
          <template #body="{ data }">
            <span class="site-tag">{{ data.country }}</span>
          </template>
        </Column>
        <Column field="name" header="Naam">
          <template #body="{ data }">
            <span class="font-medium text-surface-700">{{ data.name }}</span>
          </template>
        </Column>
        <Column field="address" header="Adres">
          <template #body="{ data }">
            <span class="text-surface-600 text-sm">{{ data.address }}</span>
          </template>
        </Column>
        <Column field="phoneNumber" header="Telefoonnummer" style="width: 11rem">
          <template #body="{ data }">
            <span class="text-surface-600 text-sm tabular-nums">{{ data.phoneNumber }}</span>
          </template>
        </Column>
        <Column header="" style="width: 3rem">
          <template #body>
            <Button icon="pi pi-pencil" variant="text" severity="secondary" size="small" rounded />
          </template>
        </Column>
      </OverviewTable>
    </template>

    <!-- ── Customer service ────────────────────────────────────── -->
    <template v-else-if="activeTab === 'customerService'">
      <OverviewToolbar :count="customerService.length" label="klantenservice locaties" />
      <OverviewTable :value="customerService">
        <Column field="name" header="Naam">
          <template #body="{ data }">
            <span class="font-medium text-surface-700">{{ data.name }}</span>
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
      </OverviewTable>
    </template>
  </OverviewLayout>
</template>
