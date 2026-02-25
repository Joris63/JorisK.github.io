<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import OrdersAdd_ShoppingCart from './tabs/OrdersAdd_ShoppingCart.vue';
  import { useOrderCart } from '@/composables/useOrderCart';

  const router = useRouter();
  const {
    cartSubtotal,
    cartDiscount,
    orderDiscountValue,
    verzendkostenValue,
    orderTotal,
    formatPrice,
    cartItemCount,
  } = useOrderCart();

  // ── Section refs ──────────────────────────────────────────────
  const sectionWinkelwagen = ref<HTMLElement | null>(null);
  const sectionGegevens = ref<HTMLElement | null>(null);
  const sectionLevering = ref<HTMLElement | null>(null);
  const sectionBetaalmethode = ref<HTMLElement | null>(null);
  const sectionVoorwaarden = ref<HTMLElement | null>(null);

  function scrollTo(el: HTMLElement | null) {
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const navItems = [
    { label: 'Winkelwagen', ref: sectionWinkelwagen },
    { label: 'Je gegevens', ref: sectionGegevens },
    { label: 'Levering', ref: sectionLevering },
    { label: 'Betaalmethode', ref: sectionBetaalmethode },
    { label: 'Voorwaarden', ref: sectionVoorwaarden },
  ];

  // ── Cart config ───────────────────────────────────────────────
  const selectedSite = ref<number>(1);
  const siteOptions = [
    { label: 'SWNL', value: 1 },
    { label: 'SWBE', value: 2 },
    { label: 'SWFR', value: 3 },
    { label: 'SWDE', value: 4 },
  ];
  const selectedCustomerType = ref<number>(1);
  const customerTypes = [
    { label: 'B2C', value: 1 },
    { label: 'B2B', value: 2 },
  ];

  // ── Customer details ──────────────────────────────────────────
  const klanttype = ref('Particulier');
  const klanttypeOptions = ['Particulier', 'Zakelijk'];
  const voornaam = ref('');
  const achternaam = ref('');
  const email = ref('');
  const telefoon = ref('');
  const telefoonAlt = ref('');
  const land = ref('Nederland');
  const postcode = ref('');
  const huisnummer = ref('');
  const toevoeging = ref('');
  const straat = ref('');
  const stad = ref('');
  const nieuwsbrief = ref(false);

  // ── Levering ──────────────────────────────────────────────────
  const selectedShowroom = ref<number>(1);
  const showroomOptions = [
    { label: 'Rosmalen', value: 1 },
    { label: 'Tilburg', value: 2 },
    { label: 'Rotterdam', value: 3 },
    { label: 'Amsterdam', value: 4 },
  ];
  const referentie = ref('');

  // ── Betaalmethode ─────────────────────────────────────────────
  const betaalmethode = ref('Pin');
  const betaalmethodeOptions = ['Ideal', 'Contant', 'Creditcard', 'Pin', 'Anders'];
  const andersOptie = ref<string | null>(null);
</script>

<template>
  <div class="grow flex flex-col">
    <div class="flex grow gap-10 pt-2">
      <!-- ── Sidebar ─────────────────────────────────────────── -->
      <aside class="sticky top-6 self-start flex flex-col gap-1 w-44 shrink-0 pt-1">
        <button
          v-for="item in navItems"
          :key="item.label"
          class="section-nav-item"
          @click="scrollTo(item.ref.value)"
        >
          {{ item.label }}
        </button>

        <Divider class="m-1!" />

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
            <span class="font-medium" style="color: #e94b57">{{
              formatPrice(-orderDiscountValue)
            }}</span>
          </div>
          <div class="flex justify-between text-xs text-gray-500">
            <span>Verzendkosten</span>
            <span
              :class="verzendkostenValue === 0 ? 'text-primary-600 font-medium' : 'text-gray-700'"
            >
              {{ verzendkostenValue === 0 ? 'Gratis' : formatPrice(verzendkostenValue) }}
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
          icon-pos="right"
          class="w-full mt-1"
          @click="
            router.push({ name: 'ordersThankYou', query: { mode: 'bestelling', order: 2787188 } })
          "
        />
      </aside>

      <!-- ── Main content ─────────────────────────────────────── -->
      <div class="flex flex-col flex-1 min-w-0">
        <!-- Winkelwagen ─────────────────────────────────────── -->
        <section ref="sectionWinkelwagen" class="flex flex-col gap-4 py-1 pb-6">
          <div class="flex items-center justify-between">
            <h2 class="section-heading">Winkelwagen</h2>
            <span class="text-xs text-gray-400"
              >{{ cartItemCount }} {{ cartItemCount === 1 ? 'product' : 'producten' }}</span
            >
          </div>
          <!-- Site + klanttype -->
          <div
            class="grid divide-x divide-gray-200 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden grid-cols-2"
          >
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
            <div class="flex flex-col gap-2 p-4">
              <span class="text-xs font-semibold uppercase tracking-wider text-gray-400"
                >Klanttype</span
              >
              <div class="flex gap-3 items-center">
                <SelectButton
                  v-model="selectedCustomerType"
                  :allow-empty="false"
                  :options="customerTypes"
                  option-label="label"
                  option-value="value"
                />
                <Button
                  v-if="selectedCustomerType === 2"
                  label="B2B klant zoeken"
                  severity="secondary"
                  size="small"
                  icon="pi pi-search"
                  variant="outlined"
                />
              </div>
            </div>
          </div>
          <!-- Product search -->
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
          <!-- Cart -->
          <OrdersAdd_ShoppingCart />
        </section>

        <Divider class="my-0!" />

        <!-- Je gegevens ─────────────────────────────────────── -->
        <section ref="sectionGegevens" class="flex flex-col gap-4 py-6">
          <div class="flex items-center justify-between">
            <h2 class="section-heading">
              Je gegevens <span class="text-xs font-normal text-gray-400 ml-1">(optioneel)</span>
            </h2>
            <Button
              label="Klant zoeken"
              icon="pi pi-search"
              size="small"
              variant="outlined"
              severity="secondary"
            />
          </div>
          <div class="form-row items-center">
            <span class="form-label">Klanttype</span
            ><SelectButton v-model="klanttype" :options="klanttypeOptions" />
          </div>
          <div class="form-row items-center">
            <span class="form-label">Naam</span>
            <div class="flex gap-2 flex-1">
              <InputText v-model="voornaam" placeholder="Voornaam" class="flex-1" /><InputText
                v-model="achternaam"
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
                  ><template #value="{ value }"
                    ><div class="flex items-center gap-2">
                      <span :class="`fi fi-${value.toLowerCase()}`" /><span>+31</span>
                    </div></template
                  ></Select
                >
                <InputText v-model="telefoon" placeholder="6 12345678" class="flex-1" />
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
                <InputText v-model="telefoonAlt" placeholder="Alternatief" class="flex-1" />
              </div>
            </div>
          </div>
          <div class="form-row items-center">
            <span class="form-label">Land</span
            ><Select
              v-model="land"
              :options="['Nederland', 'België', 'Duitsland', 'Frankrijk']"
              class="flex-1"
            />
          </div>
          <div class="form-row items-start">
            <span class="form-label pt-1.5">Adres</span>
            <div class="flex flex-col gap-2 flex-1">
              <div class="grid grid-cols-3 gap-2">
                <InputText v-model="postcode" placeholder="1234 AB" /><InputText
                  v-model="huisnummer"
                  placeholder="12"
                /><InputText v-model="toevoeging" placeholder="A" />
              </div>
              <div class="grid grid-cols-2 gap-2">
                <InputText v-model="straat" placeholder="Straatnaam" /><InputText
                  v-model="stad"
                  placeholder="Stad"
                />
              </div>
            </div>
          </div>
          <div class="form-row items-center">
            <span class="form-label">Nieuwsbrief</span>
            <div class="flex items-center gap-2">
              <ToggleSwitch v-model="nieuwsbrief" /><span class="text-sm text-gray-500"
                >Inschrijven op nieuwsbrief</span
              >
            </div>
          </div>
        </section>

        <Divider class="my-0!" />

        <!-- Levering + Betaalmethode ────────────────────────── -->
        <div class="grid grid-cols-2 gap-x-12 py-6">
          <section ref="sectionLevering" class="flex flex-col gap-4">
            <h2 class="section-heading">Levering</h2>
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
              ><InputText v-model="referentie" placeholder="Vul een referentie in" class="flex-1" />
            </div>
          </section>

          <section ref="sectionBetaalmethode" class="flex flex-col gap-4">
            <h2 class="section-heading">Betaalmethode</h2>
            <div class="form-row items-center">
              <span class="form-label">Betaalmethode</span
              ><SelectButton v-model="betaalmethode" :options="betaalmethodeOptions" />
            </div>
            <Transition name="fade-slide">
              <div v-if="betaalmethode === 'Anders'" class="form-row items-center">
                <span class="form-label" />
                <Select
                  v-model="andersOptie"
                  :options="['Bankoverschrijving', 'Factuur achteraf', 'Rembours']"
                  placeholder="Selecteer een optie"
                  class="flex-1"
                />
              </div>
            </Transition>
          </section>
        </div>

        <Divider class="my-0!" />

        <!-- Voorwaarden ─────────────────────────────────────── -->
        <section ref="sectionVoorwaarden" class="flex flex-col gap-4 py-6">
          <h2 class="section-heading">Voorwaarden</h2>
          <div class="form-row items-center">
            <span class="form-label">Extra voorwaarden</span
            ><Button label="Kies voorwaarden" class="btn-outlined" />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* ── Section headings ─────────────────────────────────────── */
  .section-heading {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--p-gray-800);
    margin: 0;
  }

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

  /* ── Section nav ─────────────────────────────────────────── */
  .section-nav-item {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.3rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.8125rem;
    color: var(--p-surface-500);
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
    transition:
      color 0.15s ease,
      background 0.15s ease;
  }

  .section-nav-item::before {
    content: '›';
    font-size: 1.1rem;
    line-height: 1;
    color: var(--p-surface-400);
  }

  .section-nav-item:hover {
    color: var(--p-surface-700);
    background: var(--p-surface-100);
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
</style>
