<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import OrdersAdd_ShoppingCart from './tabs/OrdersAdd_ShoppingCart.vue';
  import OrdersAdd_CustomerSearch from './sidebars/OrdersAdd_CustomerSearch.vue';
  import OrdersAdd_ToolbarStrip from './components/OrdersAdd_ToolbarStrip.vue';
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
  function deselectCustomer() {
    customerFound.value = false;
  }

  // ── Customer details ──────────────────────────────────────────
  const customerType = ref('Particulier');
  const customerTypeOptions = ['Particulier', 'Zakelijk'];
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
  const showroomOptions = [
    { label: 'Rosmalen', value: 1 },
    { label: 'Tilburg', value: 2 },
    { label: 'Rotterdam', value: 3 },
    { label: 'Amsterdam', value: 4 },
  ];
  const reference = ref('');

  // ── Payment method ─────────────────────────────────────────────
  const paymentMethod = ref('Pin');
  const paymentMethodOptions = ['Ideal', 'Contant', 'Creditcard', 'Pin', 'Anders'];
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
              <span class="font-medium" style="color: #e94b57">{{
                formatPrice(-cartDiscount)
              }}</span>
            </div>
            <div v-if="orderDiscountValue > 0" class="flex justify-between text-xs">
              <span class="text-gray-500">Orderkorting</span>
              <span class="font-medium" style="color: #e94b57">{{
                formatPrice(-orderDiscountValue)
              }}</span>
            </div>
            <div class="flex justify-between text-xs text-gray-500">
              <span>Verzendkosten</span>
              <span
                :class="shippingCostValue === 0 ? 'text-primary-600 font-medium' : 'text-gray-700'"
              >
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
            @click="
              router.push({ name: 'ordersThankYou', query: { mode: 'bestelling', order: 2787188 } })
            "
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
          <span class="text-xs text-gray-400 ml-auto"
            >{{ cartItemCount }} {{ cartItemCount === 1 ? 'product' : 'producten' }}</span
          >
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
      <section id="gegevens" class="add-section">
        <div class="add-section-hdr">
          <i class="pi pi-user add-section-icon" />
          <div>
            <div class="add-section-title">Je gegevens</div>
            <div class="add-section-desc">Optioneel</div>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <!-- Mode cards -->
          <div class="grid grid-cols-2 gap-3">
            <button
              class="mode-card"
              :class="{ 'mode-card--active': mode === 'search' }"
              @click="mode = 'search'"
            >
              <div class="mode-card__icon"><i class="pi pi-search" /></div>
              <div class="flex flex-col text-left">
                <span class="font-semibold text-sm">Bestaande klant</span>
                <span class="text-xs text-gray-400 mt-0.5">Zoek op naam of e-mail</span>
              </div>
              <i
                v-if="mode === 'search'"
                class="pi pi-check-circle ml-auto text-primary shrink-0"
              />
            </button>
            <button
              class="mode-card"
              :class="{ 'mode-card--active': mode === 'new' }"
              @click="mode = 'new'"
            >
              <div class="mode-card__icon"><i class="pi pi-user-plus" /></div>
              <div class="flex flex-col text-left">
                <span class="font-semibold text-sm">Nieuwe klant</span>
                <span class="text-xs text-gray-400 mt-0.5">Vul gegevens handmatig in</span>
              </div>
              <i v-if="mode === 'new'" class="pi pi-check-circle ml-auto text-primary shrink-0" />
            </button>
          </div>

          <Transition name="fade-slide" mode="out-in">
            <!-- Search mode -->
            <div v-if="mode === 'search'" key="search" class="flex flex-col gap-4">
              <Transition name="fade">
                <div v-if="customerFound" class="customer-indicator">
                  <div class="customer-indicator__avatar"><i class="pi pi-user" /></div>
                  <div class="flex flex-col leading-snug">
                    <span class="text-sm font-semibold">{{ mockFoundCustomer.name }}</span>
                    <span class="text-xs text-gray-400">{{ mockFoundCustomer.email }}</span>
                  </div>
                  <Button
                    icon="pi pi-times"
                    variant="text"
                    severity="secondary"
                    size="small"
                    rounded
                    class="ml-auto shrink-0"
                    @click="deselectCustomer"
                  />
                </div>
              </Transition>
              <div class="flex gap-2">
                <IconField class="flex-1">
                  <InputText v-model="searchQuery" class="w-full" placeholder="naam@voorbeeld.nl" />
                  <InputIcon class="pi pi-search" />
                </IconField>
                <Button
                  label="Klant zoeken"
                  icon="pi pi-user"
                  class="btn-outlined"
                  @click="customerSearchVisible = true"
                />
              </div>
            </div>

            <!-- New customer mode -->
            <div v-else-if="mode === 'new'" key="new" class="flex flex-col gap-4">
              <div class="form-row items-center">
                <span class="form-label">Klanttype</span
                ><SelectButton v-model="customerType" :options="customerTypeOptions" />
              </div>
              <div class="form-row items-center">
                <span class="form-label">Naam</span>
                <div class="flex gap-2 flex-1">
                  <InputText v-model="firstName" placeholder="Voornaam" class="flex-1" /><InputText
                    v-model="lastName"
                    placeholder="Achternaam"
                    class="flex-1"
                  />
                </div>
              </div>
              <div class="form-row items-center">
                <span class="form-label">E-mail</span
                ><InputText
                  v-model="email"
                  placeholder="naam@voorbeeld.nl"
                  type="email"
                  class="flex-1"
                />
              </div>
              <div class="form-row items-center">
                <span class="form-label">Telefoonnummer</span>
                <div class="flex gap-2 flex-1">
                  <div class="flex gap-1 flex-1">
                    <Select
                      :options="[{ label: '+31', value: 'NL' }]"
                      option-label="label"
                      option-value="value"
                      class="w-28"
                      :model-value="'NL'"
                    >
                      <template #value="{ value }">
                        <div class="flex items-center gap-2">
                          <span :class="`fi fi-${value.toLowerCase()}`" /><span>+31</span>
                        </div>
                      </template>
                    </Select>
                    <InputText v-model="phone" placeholder="6 12345678" class="flex-1" />
                  </div>
                  <div class="flex gap-1 flex-1">
                    <Select
                      :options="[{ label: '+31', value: 'NL' }]"
                      option-label="label"
                      option-value="value"
                      class="w-28"
                      :model-value="'NL'"
                      ><template #value="{ value }"
                        ><div class="flex items-center gap-2">
                          <span :class="`fi fi-${value.toLowerCase()}`" /><span>+31</span>
                        </div></template
                      ></Select
                    >
                    <InputText v-model="phoneAlt" placeholder="Alternatief" class="flex-1" />
                  </div>
                </div>
              </div>
              <div class="form-row items-center">
                <span class="form-label">Land</span
                ><Select
                  v-model="country"
                  :options="['Nederland', 'België', 'Duitsland', 'Frankrijk']"
                  class="flex-1"
                />
              </div>
              <div class="form-row items-start">
                <span class="form-label pt-1.5">Adres</span>
                <div class="flex flex-col gap-2 flex-1">
                  <div class="grid grid-cols-3 gap-2">
                    <InputText v-model="postalCode" placeholder="1234 AB" /><InputText
                      v-model="houseNumber"
                      placeholder="12"
                    /><InputText v-model="addition" placeholder="A" />
                  </div>
                  <div class="grid grid-cols-2 gap-2">
                    <InputText v-model="street" placeholder="Straatnaam" /><InputText
                      v-model="city"
                      placeholder="Stad"
                    />
                  </div>
                </div>
              </div>
              <div class="form-row items-center">
                <span class="form-label">Nieuwsbrief</span>
                <div class="flex items-center gap-2">
                  <ToggleSwitch v-model="newsletter" /><span class="text-sm text-gray-500"
                    >Inschrijven op nieuwsbrief</span
                  >
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </section>

      <!-- Levering + Betaalmethode ────────────────────────── -->
      <div class="add-section grid grid-cols-2 gap-x-12">
        <section id="levering" class="flex flex-col gap-4">
          <div class="add-section-hdr">
            <i class="pi pi-truck add-section-icon" />
            <div class="add-section-title">Levering</div>
          </div>
          <div class="form-row items-center">
            <span class="form-label">Showroom</span
            ><Select
              v-model="selectedShowroom"
              :options="showroomOptions"
              option-label="label"
              option-value="value"
              class="flex-1"
            />
          </div>
          <div class="form-row items-center">
            <span class="form-label">Referentie</span
            ><InputText v-model="reference" placeholder="Vul een referentie in" class="flex-1" />
          </div>
        </section>

        <section id="betaalmethode" class="flex flex-col gap-4">
          <div class="add-section-hdr">
            <i class="pi pi-credit-card add-section-icon" />
            <div class="add-section-title">Betaalmethode</div>
          </div>
          <div class="form-row items-center">
            <span class="form-label">Betaalmethode</span
            ><SelectButton v-model="paymentMethod" :options="paymentMethodOptions" />
          </div>
          <Transition name="fade-slide">
            <div v-if="paymentMethod === 'Anders'" class="form-row items-center">
              <span class="form-label" />
              <Select
                v-model="otherOption"
                :options="['Bankoverschrijving', 'Factuur achteraf', 'Rembours']"
                placeholder="Selecteer een optie"
                class="flex-1"
              />
            </div>
          </Transition>
        </section>
      </div>

      <!-- Voorwaarden ─────────────────────────────────────── -->
      <section id="voorwaarden" class="add-section">
        <div class="add-section-hdr">
          <i class="pi pi-file add-section-icon" />
          <div class="add-section-title">Voorwaarden</div>
        </div>
        <div class="form-row items-center">
          <span class="form-label">Extra voorwaarden</span
          ><Button label="Kies voorwaarden" class="btn-outlined" />
        </div>
      </section>
    </div>

    <OrdersAdd_CustomerSearch v-model="customerSearchVisible" />
  </AddPageLayout>
</template>

<style scoped>
  /* ── Form layout ──────────────────────────────────────────── */
  .form-row {
    display: grid;
    grid-template-columns: 160px 1fr;
    gap: 0.5rem;
  }

  .form-label {
    font-size: 0.875rem;
    color: var(--p-gray-500);
    padding-top: 0.375rem;
  }

  /* ── Mode cards ───────────────────────────────────────────── */
  .mode-card {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    padding: 1rem 1.25rem;
    border: 1.5px solid var(--p-surface-200);
    border-radius: 0.625rem;
    background: var(--p-surface-0);
    cursor: pointer;
    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease,
      background 0.15s ease;
    text-align: left;
  }
  .mode-card:hover {
    border-color: var(--p-primary-300);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  }
  .mode-card--active {
    border-color: var(--p-primary-500);
    background: var(--p-primary-50);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--p-primary-500) 12%, transparent);
  }
  .mode-card__icon {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    background: var(--p-primary-100);
    color: var(--p-primary-600);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.95rem;
    flex-shrink: 0;
    transition: background 0.15s ease;
  }
  .mode-card--active .mode-card__icon {
    background: var(--p-primary-200);
  }

  /* ── Customer indicator ───────────────────────────────────── */
  .customer-indicator {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border: 1.5px solid var(--p-primary-300);
    border-radius: 0.625rem;
    background: var(--p-primary-50);
  }
  .customer-indicator__avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: var(--p-primary-200);
    color: var(--p-primary-700);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    flex-shrink: 0;
  }

  /* ── Transitions ─────────────────────────────────────────── */
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition:
      opacity 0.15s ease,
      transform 0.15s ease;
  }
  .fade-slide-enter-from {
    opacity: 0;
    transform: translateY(6px);
  }
  .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-6px);
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
