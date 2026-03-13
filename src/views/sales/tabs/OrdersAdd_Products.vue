<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import OrdersAdd_ShoppingCart from './OrdersAdd_ShoppingCart.vue';

  const selectedSite = ref<number>(1);
  const siteOptions = ref([
    { label: 'SWNL', value: 1 },
    { label: 'SWBE', value: 2 },
    { label: 'SWFR', value: 3 },
    { label: 'SWDE', value: 4 },
  ]);

  const selectedCustomerType = ref<number>(1);
  const customerTypes = ref([
    { label: 'B2C', value: 1 },
    { label: 'B2B', value: 2 },
  ]);

  const hasPendingOrders = ref(true);
  const pendingBannerVisible = ref(true);

  // ── Product search ───────────────────────────────────────────
  const searchQuery = ref('');
  const searchOpen = ref(false);
  const searchWrapperRef = ref<HTMLElement | null>(null);

  interface SearchProduct {
    code: string;
    naam: string;
    prijs: number;
  }

  const SW1175_RESULT: { parent: SearchProduct; children: SearchProduct[] } = {
    parent: {
      code: 'SW1175',
      naam: 'Saniclass klikwaste afvoerplug - 5/4" - chroom',
      prijs: 25.99,
    },
    children: [
      {
        code: 'SW696203',
        naam: 'Fortifura Calvi Afvoerplug - klikwaste - chroom',
        prijs: 25.99,
      },
    ],
  };

  const FLAT_RESULTS: SearchProduct[] = [
    {
      code: 'SW17044',
      naam: 'RIHO Aryl ligbad 170x110cm Hoekopstelling Links Wit glans',
      prijs: 700.0,
    },
    {
      code: 'SW17048',
      naam: 'RIHO Aryl ligbad 170x110cm Hoekopstelling Rechts Wit glans',
      prijs: 700.0,
    },
    {
      code: 'SW17529',
      naam: 'BRAUER Molten waskom - 42 - rond - natuursteen - basalt antraciet',
      prijs: 320.0,
    },
    {
      code: 'SW17530',
      naam: 'BRAUER Molten waskom - 42 - rond - hamerslag - natuursteen - basalt antraciet',
      prijs: 426.55,
    },
    {
      code: 'SW17531',
      naam: 'BRAUER Peak waskom - 41 keramiek - hoogglans wit',
      prijs: 129.0,
    },
    {
      code: 'SW17532',
      naam: 'BRAUER Fjord waskom - 42 - rond - keramiek - hoogglans wit',
      prijs: 129.0,
    },
  ];

  const searchMode = computed<'nested' | 'flat' | null>(() => {
    if (!searchQuery.value.trim()) return null;
    return searchQuery.value.trim().toLowerCase() === 'sw1175' ? 'nested' : 'flat';
  });

  const showDropdown = computed(() => searchOpen.value && searchMode.value !== null);

  function formatSearchPrice(price: number) {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(price);
  }

  function onSearchFocus() {
    searchOpen.value = true;
  }

  function onSearchInput() {
    searchOpen.value = true;
  }

  function handleClickOutside(e: MouseEvent) {
    if (searchWrapperRef.value && !searchWrapperRef.value.contains(e.target as Node)) {
      searchOpen.value = false;
    }
  }

  onMounted(() => document.addEventListener('mousedown', handleClickOutside));
  onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));
</script>

<template>
  <StepPanel v-slot="{ activateCallback }" :value="1" class="flex flex-col grow">
    <div class="flex flex-col gap-4">
      <!-- Pending orders notice -->
      <div
        v-if="hasPendingOrders && pendingBannerVisible"
        class="flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900"
      >
        <i class="pi pi-history text-amber-500 shrink-0" />
        <span class="text-sm flex-1">
          Je hebt onafgeronde bestellingen.
          <button
            class="font-semibold underline underline-offset-2 bg-transparent border-0 p-0 cursor-pointer text-amber-900 hover:text-amber-700"
          >
            Klik hier om door te gaan
          </button>
        </span>
        <Button
          icon="pi pi-times"
          variant="text"
          severity="warn"
          size="small"
          rounded
          @click="pendingBannerVisible = false"
        />
      </div>

      <!-- Order configuration card -->
      <div
        class="grid divide-x divide-gray-200 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden grid-cols-2"
      >
        <!-- Site selector -->
        <div class="flex flex-col gap-2 p-4">
          <span class="text-xs font-semibold uppercase tracking-wider text-gray-400">Site</span>
          <SelectButton
            v-model="selectedSite"
            :allow-empty="false"
            :options="siteOptions"
            option-label="label"
            option-value="value"
          />
        </div>

        <!-- Customer type selector -->
        <div class="flex flex-col gap-2 p-4">
          <span class="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Klanttype
          </span>
          <div class="flex gap-3 items-center">
            <SelectButton
              v-model="selectedCustomerType"
              :allow-empty="false"
              :options="customerTypes"
              option-label="label"
              option-value="value"
            />

            <Button
              label="Joris Kamminga"
              severity="secondary"
              size="small"
              icon="pi pi-times"
              variant="outlined"
            />
          </div>
        </div>
      </div>

      <!-- Product search -->
      <div class="flex flex-col gap-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-gray-400"
          >Product toevoegen</span
        >
        <div class="flex gap-2">
          <!-- Search wrapper — relative so dropdown anchors to it -->
          <div ref="searchWrapperRef" class="grow relative">
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText
                v-model="searchQuery"
                class="w-full"
                placeholder="Zoek op productcode, productnaam, fabrikantcode, bestelcode of EAN"
                autofocus
                @focus="onSearchFocus"
                @input="onSearchInput"
              />
            </IconField>

            <!-- Search dropdown -->
            <div
              v-if="showDropdown"
              class="search-dropdown absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
            >
              <!-- ── Variant 1: nested (SW1175) ── -->
              <template v-if="searchMode === 'nested'">
                <!-- Parent row -->
                <div class="search-row flex items-center gap-3 px-4 py-2.5 cursor-pointer">
                  <span class="flex-1 text-sm">{{ SW1175_RESULT.parent.naam }}</span>
                  <span class="font-bold text-sm text-gray-700 shrink-0">{{
                    SW1175_RESULT.parent.code
                  }}</span>
                  <span class="text-sm text-gray-600 w-20 text-right shrink-0">{{
                    formatSearchPrice(SW1175_RESULT.parent.prijs)
                  }}</span>
                </div>
                <!-- Child rows -->
                <div
                  v-for="child in SW1175_RESULT.children"
                  :key="child.code"
                  class="search-row search-row--child flex items-center gap-2 pl-6 pr-4 py-2 cursor-pointer"
                >
                  <span class="text-amber-400 text-sm shrink-0 -translate-y-0.5">↳</span>
                  <div class="flex items-center gap-3 flex-1 min-w-0">
                    <span class="flex-1 text-sm text-gray-700 truncate">{{ child.naam }}</span>
                  </div>
                  <span class="font-bold text-sm text-gray-600 shrink-0">{{ child.code }}</span>
                  <span class="text-sm text-gray-500 w-20 text-right shrink-0">{{
                    formatSearchPrice(child.prijs)
                  }}</span>
                </div>
              </template>

              <!-- ── Variant 2: flat list ── -->
              <template v-else-if="searchMode === 'flat'">
                <div
                  v-for="product in FLAT_RESULTS"
                  :key="product.code"
                  class="search-row flex items-center gap-3 px-4 py-2.5 cursor-pointer"
                >
                  <span class="flex-1 text-sm">{{ product.naam }}</span>
                  <span class="font-bold text-sm text-gray-700 shrink-0">{{ product.code }}</span>
                  <span class="text-sm text-gray-600 w-20 text-right shrink-0">{{
                    formatSearchPrice(product.prijs)
                  }}</span>
                </div>
              </template>
            </div>
          </div>

          <Button label="HM nummer" icon="pi pi-plus" icon-pos="left" class="btn-outlined" />
          <div class="pl-2 border-l border-gray-200">
            <Button icon="pi pi-ellipsis-v" class="btn-outlined" />
          </div>
        </div>
      </div>

      <!-- Shopping cart -->
      <OrdersAdd_ShoppingCart class="pt-2" />
    </div>

    <div class="flex pt-4 justify-end">
      <Button
        label="Volgende"
        severity="secondary"
        icon="pi pi-arrow-right"
        iconPos="right"
        @click="activateCallback(2)"
      />
    </div>
  </StepPanel>
</template>

<style scoped>
  /* ── Search dropdown ─────────────────────────────────────── */
  .search-dropdown {
    max-height: 18rem;
    overflow-y: auto;
  }

  .search-row {
    border-bottom: 1px solid var(--p-gray-100);
    transition: background-color 0.1s ease;
  }

  .search-row:last-child {
    border-bottom: none;
  }

  .search-row:hover {
    background-color: #fffbeb;
  }

  /* Child (sub-product) rows always carry the amber tint */
  .search-row--child {
    background-color: #fffbeb;
  }

  .search-row--child:hover {
    background-color: #fef3c7;
  }

</style>
