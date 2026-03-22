<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import FilterBar from '@/components/FilterBar.vue';
  import type { FilterConfig } from '@/types/filters';
  import OverviewLayout from '@/components/layout/OverviewLayout.vue';
  import OverviewHeader from '@/components/layout/OverviewHeader.vue';
  import OverviewToolbar from '@/components/layout/OverviewToolbar.vue';
  import OverviewTable from '@/components/layout/OverviewTable.vue';
  import {
    MOCK_STORES,
    MOCK_WAREHOUSES,
    MOCK_WAREHOUSE_GROUPS,
    MOCK_PICKUP_LOCATIONS,
    MOCK_CUSTOMER_SERVICE,
  } from '@/mocks/locations';

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

  // ── Data ─────────────────────────────────────────────────────────────
  const stores = ref(MOCK_STORES);
  const warehouses = ref(MOCK_WAREHOUSES);
  const warehouseGroups = ref(MOCK_WAREHOUSE_GROUPS);
  const pickupLocations = ref(MOCK_PICKUP_LOCATIONS);
  const customerService = ref(MOCK_CUSTOMER_SERVICE);

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
      if (f.name && typeof f.name === 'string' && !m.name.toLowerCase().includes(f.name.toLowerCase()))
        return false;
      if (f.city && typeof f.city === 'string' && !m.city.toLowerCase().includes(f.city.toLowerCase()))
        return false;
      if (f.containsGoods !== null && f.containsGoods !== undefined && f.containsGoods !== '' && m.containsGoods !== f.containsGoods)
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
            <span class="status-badge" :class="data.active ? 'status-badge--yes' : 'status-badge--no'">
              {{ data.active ? 'Ja' : 'Nee' }}
            </span>
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
            <span class="status-badge" :class="data.containsGoods ? 'status-badge--yes' : 'status-badge--no'">
              {{ data.containsGoods ? 'Ja' : 'Nee' }}
            </span>
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
            <span class="font-mono text-base font-medium text-surface-600">{{ data.abbreviation }}</span>
          </template>
        </Column>
        <Column field="name" header="Naam">
          <template #body="{ data }">
            <span class="font-medium text-surface-700">{{ data.name }}</span>
          </template>
        </Column>
        <Column header="" style="width: 3rem">
          <template #body>
            <Button icon="pi pi-pencil" text severity="secondary" size="small" rounded />
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
            <span class="text-surface-600 text-base">{{ data.address }}</span>
          </template>
        </Column>
        <Column field="phoneNumber" header="Telefoonnummer" style="width: 11rem">
          <template #body="{ data }">
            <span class="text-surface-600 text-base tabular-nums">{{ data.phoneNumber }}</span>
          </template>
        </Column>
        <Column header="" style="width: 3rem">
          <template #body>
            <Button icon="pi pi-pencil" text severity="secondary" size="small" rounded />
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
            <Button icon="pi pi-pencil" text severity="secondary" size="small" rounded />
          </template>
        </Column>
      </OverviewTable>
    </template>
  </OverviewLayout>
</template>
