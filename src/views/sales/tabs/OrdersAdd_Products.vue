<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
  import OrdersAdd_ShoppingCart from './OrdersAdd_ShoppingCart.vue';
  import OrdersAdd_ToolbarStrip from '../components/OrdersAdd_ToolbarStrip.vue';
  import { useOrderCart } from '@/composables/useOrderCart';

  const { groups, addProductToGroup } = useOrderCart();

  const searchInputRef = ref<{ $el: HTMLInputElement } | null>(null);
  const targetGroupId = ref<string>('0');
  const targetGroup = computed(() => groups.value.find((g) => g.id === targetGroupId.value));
  const searchFlash = ref(false);

  function handleAddToGroup(groupId: string) {
    targetGroupId.value = groupId;
    searchFlash.value = false;
    nextTick(() => {
      searchInputRef.value?.$el.focus();
      // Let the browser paint first, then flash
      requestAnimationFrame(() => {
        searchFlash.value = true;
        setTimeout(() => { searchFlash.value = false; }, 700);
      });
    });
  }

  function selectProduct(product: SearchProduct) {
    addProductToGroup(product, targetGroupId.value);
    searchQuery.value = '';
    searchOpen.value = false;
  }

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
  <StepPanel :value="1" class="flex flex-col grow view-card p-5">
    <!-- ── Pending orders banner ────────────────────────────────── -->
    <Transition name="fade">
      <div
        v-if="hasPendingOrders && pendingBannerVisible"
        class="flex items-center gap-3 px-6 py-2.5 bg-amber-50 border-b border-amber-200 text-amber-900 shrink-0"
      >
        <i class="pi pi-history text-amber-500 text-sm shrink-0" />
        <span class="text-sm flex-1">
          Je hebt onafgeronde bestellingen —
          <button class="font-semibold underline underline-offset-2 bg-transparent border-0 p-0 cursor-pointer text-amber-800 hover:text-amber-600">
            verder gaan
          </button>
        </span>
        <Button icon="pi pi-times" variant="text" severity="warn" size="small" rounded @click="pendingBannerVisible = false" />
      </div>
    </Transition>

    <OrdersAdd_ToolbarStrip />

    <!-- ── Main content ─────────────────────────────────────────── -->
    <div class="flex flex-col gap-2 flex-1 min-h-0 pt-3 pb-0">
      <!-- Product search -->
      <div class="flex gap-2">
        <div ref="searchWrapperRef" class="grow relative">
          <IconField :class="{ 'search-targeted': targetGroup && targetGroup.id !== '0', 'search-flash': searchFlash }">
            <InputIcon class="pi pi-search" />
            <InputText
              ref="searchInputRef"
              v-model="searchQuery"
              class="w-full"
              placeholder="Zoek op productcode, productnaam, fabrikantcode, bestelcode of EAN"
              autofocus
              @focus="onSearchFocus"
              @input="onSearchInput"
            />
          </IconField>

          <!-- Target group pill — wrapper handles position, inner div animates -->
          <div class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <Transition name="pill-pop">
              <div
                v-if="targetGroup && targetGroup.id !== '0'"
                :key="targetGroupId"
                class="flex items-center gap-1.5 bg-primary-50 border border-primary-200 text-primary-700 text-xs font-medium px-2 py-0.5 rounded-full pointer-events-auto"
              >
                <i class="pi pi-folder" style="font-size:0.65rem" />
                <span>{{ targetGroup.name }}</span>
                <button
                  class="ml-0.5 border-0 bg-transparent p-0 cursor-pointer text-primary-400 hover:text-primary-700 leading-none"
                  @click.stop="targetGroupId = '0'"
                >×</button>
              </div>
            </Transition>
          </div>

          <!-- Search dropdown -->
          <div
            v-if="showDropdown"
            class="search-dropdown absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          >
            <template v-if="searchMode === 'nested'">
              <div class="search-row flex items-center gap-3 px-4 py-2.5 cursor-pointer" @click="selectProduct(SW1175_RESULT.parent)">
                <span class="flex-1 text-sm">{{ SW1175_RESULT.parent.naam }}</span>
                <span class="font-bold text-sm text-gray-700 shrink-0">{{ SW1175_RESULT.parent.code }}</span>
                <span class="text-sm text-gray-600 w-20 text-right shrink-0">{{ formatSearchPrice(SW1175_RESULT.parent.prijs) }}</span>
              </div>
              <div
                v-for="child in SW1175_RESULT.children"
                :key="child.code"
                class="search-row search-row--child flex items-center gap-2 pl-6 pr-4 py-2 cursor-pointer"
                @click="selectProduct(child)"
              >
                <span class="text-amber-400 text-sm shrink-0 -translate-y-0.5">↳</span>
                <span class="flex-1 text-sm text-gray-700 truncate">{{ child.naam }}</span>
                <span class="font-bold text-sm text-gray-600 shrink-0">{{ child.code }}</span>
                <span class="text-sm text-gray-500 w-20 text-right shrink-0">{{ formatSearchPrice(child.prijs) }}</span>
              </div>
            </template>
            <template v-else-if="searchMode === 'flat'">
              <div
                v-for="product in FLAT_RESULTS"
                :key="product.code"
                class="search-row flex items-center gap-3 px-4 py-2.5 cursor-pointer"
                @click="selectProduct(product)"
              >
                <span class="flex-1 text-sm">{{ product.naam }}</span>
                <span class="font-bold text-sm text-gray-700 shrink-0">{{ product.code }}</span>
                <span class="text-sm text-gray-600 w-20 text-right shrink-0">{{ formatSearchPrice(product.prijs) }}</span>
              </div>
            </template>
          </div>
        </div>

        <Button label="HM nummer" icon="pi pi-plus" icon-pos="left" class="btn-outlined" />
        <div class="pl-2 border-l border-gray-200">
          <Button icon="pi pi-ellipsis-v" class="btn-outlined" />
        </div>
      </div>

      <!-- Shopping cart -->
      <div class="flex-1 min-h-0 flex flex-col overflow-hidden rounded-xl border border-gray-200">
        <OrdersAdd_ShoppingCart @add-to-group="handleAddToGroup" />
      </div>
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

  /* ── Search targeted state (persistent ring while group is set) ── */
  .search-targeted :deep(.p-inputtext) {
    border-color: var(--p-primary-400) !important;
    padding-right: 10rem;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  /* ── Search flash (prominent one-shot attention pulse) ───── */
  .search-flash :deep(.p-inputtext) {
    animation: search-flash 0.65s ease forwards;
  }

  @keyframes search-flash {
    0%   { box-shadow: 0 0 0 0px color-mix(in srgb, var(--p-primary-400) 60%, transparent); border-color: var(--p-primary-500); background: color-mix(in srgb, var(--p-primary-100) 40%, white); }
    40%  { box-shadow: 0 0 0 6px color-mix(in srgb, var(--p-primary-400) 25%, transparent); border-color: var(--p-primary-500); background: color-mix(in srgb, var(--p-primary-50) 60%, white); }
    100% { box-shadow: 0 0 0 3px color-mix(in srgb, var(--p-primary-400) 15%, transparent); border-color: var(--p-primary-400); background: transparent; }
  }

  /* ── Transitions ─────────────────────────────────────────── */
  .fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
  .fade-enter-from, .fade-leave-to { opacity: 0; }

  /* Pill pop — bouncy scale from natural position (no translate conflict) */
  .pill-pop-enter-active {
    animation: pill-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .pill-pop-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
  }
  .pill-pop-leave-to {
    opacity: 0;
    transform: scale(0.75);
  }

  @keyframes pill-pop {
    from { opacity: 0; transform: scale(0.5); }
    to   { opacity: 1; transform: scale(1); }
  }
</style>
