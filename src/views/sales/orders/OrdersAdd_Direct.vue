<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import OrdersAdd_ShoppingCart from './tabs/OrdersAdd_ShoppingCart.vue';
  import OrdersAdd_CustomerSearch from './sidebars/OrdersAdd_CustomerSearch.vue';
  import OrdersAdd_ToolbarStrip from './components/OrdersAdd_ToolbarStrip.vue';
  import DirectSection_Customer from './components/direct/DirectSection_Customer.vue';
  import DirectSection_Delivery from './components/direct/DirectSection_Delivery.vue';
  import DirectSection_Payment from './components/direct/DirectSection_Payment.vue';
  import { useOrderCart } from '@/composables/useOrderCart';
  import AddPageHeader from '@/components/layout/AddPageHeader.vue';
  import AddPageLayout from '@/components/layout/AddPageLayout.vue';
  import AddPageNav from '@/components/layout/AddPageNav.vue';

  const router = useRouter();
  const {
    cartSubtotal,
    cartDiscount,
    orderDiscountValue,
    shippingCostValue,
    orderTotal,
    formatPrice,
    cartItemCount,
  } = useOrderCart();

  const navItems = [
    { id: 'winkelwagen', label: 'Winkelwagen', description: 'Producten en prijzen' },
    { id: 'gegevens', label: 'Je gegevens', description: 'Naam en contactgegevens' },
    { id: 'levering', label: 'Levering', description: 'Bezorgmethode' },
    { id: 'betaalmethode', label: 'Betaalmethode', description: 'Betaalwijze' },
    { id: 'voorwaarden', label: 'Voorwaarden', description: 'Extra voorwaarden' },
  ];

  // ── Customer mode ─────────────────────────────────────────────
  type Mode = 'search' | 'new' | null;
  const mode = ref<Mode>('search');
  const customerSearchVisible = ref(false);
  const searchQuery = ref('');
  const customerFound = ref(true);
  const mockFoundCustomer = { name: 'Joris Kamminga', email: 'joris@showroomworks.nl' };

  // ── Customer details ──────────────────────────────────────────
  const customerType = ref('Particulier');
  const firstName = ref('');
  const lastName = ref('');
  const email = ref('');
  const phone = ref('');
  const phoneAlt = ref('');
  const country = ref('Nederland');
  const postalCode = ref('');
  const houseNumber = ref('');
  const addition = ref('');
  const street = ref('');
  const city = ref('');
  const newsletter = ref(false);

  // ── Delivery ──────────────────────────────────────────────────
  const selectedShowroom = ref<number>(1);
  const reference = ref('');

  // ── Payment method ─────────────────────────────────────────────
  const paymentMethod = ref('Pin');
  const otherOption = ref<string | null>(null);
</script>

<template>
  <AddPageLayout>
    <template #header>
      <AddPageHeader
        title="Directe verkoop"
        subtitle="Verkoop direct aan de kassa zonder doorlooptijd"
        :back="{ name: 'home' }"
      >
        <template #icon><i class="pi pi-shopping-bag" /></template>
      </AddPageHeader>
    </template>

    <template #nav>
      <AddPageNav :sections="navItems">
        <Divider class="my-3!" />
        <div class="flex flex-col gap-2 px-3">
          <!-- Live totals -->
          <div class="flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
            <div class="flex justify-between text-xs text-gray-500">
              <span>Subtotaal</span>
              <span class="text-gray-700">{{ formatPrice(cartSubtotal) }}</span>
            </div>
            <div v-if="cartDiscount > 0" class="flex justify-between text-xs">
              <span class="text-gray-500">Korting</span>
              <span class="font-medium" style="color: #e94b57">{{ formatPrice(-cartDiscount) }}</span>
            </div>
            <div v-if="orderDiscountValue > 0" class="flex justify-between text-xs">
              <span class="text-gray-500">Orderkorting</span>
              <span class="font-medium" style="color: #e94b57">{{ formatPrice(-orderDiscountValue) }}</span>
            </div>
            <div class="flex justify-between text-xs text-gray-500">
              <span>Verzendkosten</span>
              <span :class="shippingCostValue === 0 ? 'text-primary-600 font-medium' : 'text-gray-700'">
                {{ shippingCostValue === 0 ? 'Gratis' : formatPrice(shippingCostValue) }}
              </span>
            </div>
            <div class="border-t border-gray-200 pt-2 flex justify-between items-baseline">
              <span class="text-xs font-semibold text-gray-600">Totaal</span>
              <span class="text-sm font-bold text-gray-900">{{ formatPrice(orderTotal) }}</span>
            </div>
          </div>
          <Button
            label="Verkoop"
            icon="pi pi-check"
            class="w-full mt-1"
            @click="router.push({ name: 'ordersThankYou', query: { mode: 'bestelling', order: 2787188 } })"
          />
        </div>
      </AddPageNav>
    </template>

    <div class="flex flex-col border-l border-gray-100 pt-2 pl-5">
      <!-- Winkelwagen ─────────────────────────────────────── -->
      <section id="winkelwagen" class="add-section">
        <div class="add-section-hdr">
          <i class="pi pi-shopping-cart add-section-icon" />
          <div class="add-section-title">Winkelwagen</div>
          <span class="text-xs text-gray-400 ml-auto">
            {{ cartItemCount }} {{ cartItemCount === 1 ? 'product' : 'producten' }}
          </span>
        </div>
        <OrdersAdd_ToolbarStrip />
        <div class="flex flex-col gap-4 mt-4">
          <div class="flex gap-2">
            <IconField class="grow">
              <InputIcon class="pi pi-search" />
              <InputText
                class="w-full"
                placeholder="Zoek op productcode, productnaam, fabrikantcode, bestelcode of EAN"
                autofocus
              />
            </IconField>
            <Button label="HM nummer" icon="pi pi-plus" icon-pos="left" class="btn-outlined" />
            <div class="pl-2 border-l border-gray-200">
              <Button icon="pi pi-ellipsis-v" class="btn-outlined" />
            </div>
          </div>
          <OrdersAdd_ShoppingCart />
        </div>
      </section>

      <!-- Je gegevens ─────────────────────────────────────── -->
      <DirectSection_Customer
        v-model:mode="mode"
        v-model:customer-found="customerFound"
        v-model:search-query="searchQuery"
        v-model:customer-search-visible="customerSearchVisible"
        v-model:customer-type="customerType"
        v-model:first-name="firstName"
        v-model:last-name="lastName"
        v-model:email="email"
        v-model:phone="phone"
        v-model:phone-alt="phoneAlt"
        v-model:country="country"
        v-model:postal-code="postalCode"
        v-model:house-number="houseNumber"
        v-model:addition="addition"
        v-model:street="street"
        v-model:city="city"
        v-model:newsletter="newsletter"
        :mock-found-customer="mockFoundCustomer"
      />

      <!-- Levering + Betaalmethode ────────────────────────── -->
      <div class="add-section grid grid-cols-2 gap-x-12">
        <DirectSection_Delivery
          v-model:selected-showroom="selectedShowroom"
          v-model:reference="reference"
        />
        <DirectSection_Payment
          v-model:payment-method="paymentMethod"
          v-model:other-option="otherOption"
        />
      </div>

      <!-- Voorwaarden ─────────────────────────────────────── -->
      <section id="voorwaarden" class="add-section">
        <div class="add-section-hdr">
          <i class="pi pi-file add-section-icon" />
          <div class="add-section-title">Voorwaarden</div>
        </div>
        <div class="form-row items-center">
          <span class="form-label">Extra voorwaarden</span>
          <Button label="Kies voorwaarden" class="btn-outlined" />
        </div>
      </section>
    </div>

    <OrdersAdd_CustomerSearch v-model="customerSearchVisible" />
  </AddPageLayout>
</template>

<style scoped>
@reference "@/assets/style.css";
  .form-row {
    grid-template-columns: 160px 1fr;
    @apply grid gap-2;
  }

  .form-label {
    @apply text-(--p-gray-500) text-sm pt-1.5;
  }
</style>
