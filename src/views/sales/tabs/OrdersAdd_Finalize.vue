<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useOrderCart } from '@/composables/useOrderCart';
  import OrderCartTotals from './OrderCartTotals.vue';
  import ContractorSection from '../components/ContractorSection.vue';
  import AddPageNav from '@/components/layout/AddPageNav.vue';

  const { finalizeMode } = useOrderCart();

  const navItems = computed(() =>
    finalizeMode.value === 'quotation'
      ? [
          { id: 'planning', label: 'Planning', description: 'Datum en aannemer' },
          { id: 'afspraken', label: 'Afspraken', description: 'Notities en taken' },
          { id: 'afronding', label: 'Afronding', description: 'Offerte mail' },
        ]
      : finalizeMode.value === 'order'
        ? [
            { id: 'planning', label: 'Planning', description: 'Datum en aannemer' },
            { id: 'levering', label: 'Levering', description: 'Bezorgmethode' },
            { id: 'betaalmethode', label: 'Betaalmethode', description: 'Betaalwijze' },
            { id: 'afspraken', label: 'Afspraken', description: 'Notities en taken' },
            { id: 'voorwaarden', label: 'Voorwaarden', description: 'Extra voorwaarden' },
          ]
        : [
            { id: 'planning', label: 'Planning', description: 'Datum en aannemer' },
            { id: 'afspraken', label: 'Afspraken', description: 'Notities en taken' },
          ]
  );

  // ── Offerte: Planning ────────────────────────────────────────
  const selectedYear = ref(new Date().getFullYear());
  const years = [2026, 2027, 2028].map((y) => ({ label: String(y), value: y }));
  const selectedMonth = ref<string | null>(null);
  const months = [
    { label: 'jan', value: 'jan' },
    { label: 'feb', value: 'feb' },
    { label: 'mrt', value: 'mrt' },
    { label: 'apr', value: 'apr' },
    { label: 'mei', value: 'mei' },
    { label: 'jun', value: 'jun' },
    { label: 'jul', value: 'jul' },
    { label: 'aug', value: 'aug' },
    { label: 'sep', value: 'sep' },
    { label: 'okt', value: 'okt' },
    { label: 'nov', value: 'nov' },
    { label: 'dec', value: 'dec' },
  ];

  // ── Shared: Afspraken ────────────────────────────────────────
  const appointmentNote = ref('');
  const appointmentMadeWith = ref<string | null>('Joris Kamminga');
  const userOptions = [
    { label: 'Joris Kamminga', value: 'Joris Kamminga' },
    { label: 'Sarah de Vries', value: 'Sarah de Vries' },
  ];
  const appointmentDate = ref<Date | null>(null);
  const createTask = ref(false);

  // ── Offerte: Afronding ───────────────────────────────────────
  const automaticQuotationEmail = ref(true);

  // ── Bestelling: Levering ─────────────────────────────────────
  const destination = ref('Klantadres');
  const destinationOptions = ['Klantadres', 'Showroom', 'Pickup Point'];

  // ── Bestelling: Showroom ──────────────────────────────────────
  const selectedShowroom = ref<number | null>(1);
  const showroomOptions = [
    { label: 'Rosmalen', value: 1 },
    { label: 'Tilburg', value: 2 },
    { label: 'Rotterdam', value: 3 },
    { label: 'Amsterdam', value: 4 },
  ];

  // ── Bestelling: Pickup Point ──────────────────────────────────
  const pickupPostalCode = ref('');
  const pickupHouseNumber = ref('');
  const pickupAddition = ref('');
  const pickupStreet = ref('');
  const pickupCity = ref('');
  const selectedPickupPoint = ref<number | null>(null);
  const pickupPoints = [
    {
      id: 1,
      name: 'PostNL Afhaalpunt JBT Retail Tilburg B.V. <Bekker>',
      distance: '0.8km',
      address: 'Wagnerplein 59, Tilburg',
    },
    {
      id: 2,
      name: 'PostNL Afhaalpunt Postnl XL Point',
      distance: '1.4km',
      address: 'Goirkekanaaldijk 20, Tilburg',
    },
    {
      id: 3,
      name: 'PostNL Afhaalpunt GAMMA Tilburg-Noord',
      distance: '1.5km',
      address: 'Bundersestraat 3, Tilburg',
    },
    {
      id: 4,
      name: 'PostNL Afhaalpunt Melie Shipping',
      distance: '1.9km',
      address: 'Ledeboerstraat 3506, Tilburg',
    },
    {
      id: 5,
      name: 'PostNL Afhaalpunt Primera Westermarkt',
      distance: '3.0km',
      address: 'Westermarkt 135, Tilburg',
    },
    {
      id: 6,
      name: 'PostNL Afhaalpunt Businesspoint Postcentrum Tilburg',
      distance: '3.6km',
      address: 'Aphroditestraat 71, Tilburg',
    },
    {
      id: 7,
      name: 'PostNL Afhaalpunt Mentastore',
      distance: '3.9km',
      address: 'Heuvelstraat 92, Tilburg',
    },
    {
      id: 8,
      name: 'PostNL Afhaalpunt Kolvari Luxury Dresses',
      distance: '4.3km',
      address: 'Korvelseweg 102, Tilburg',
    },
    {
      id: 9,
      name: 'PostNL Afhaalpunt Service Point Mortelplein',
      distance: '4.6km',
      address: 'Burgemeester van de Mortelplein 59, Tilburg',
    },
    {
      id: 10,
      name: 'PostNL Afhaalpunt DA drogist',
      distance: '4.9km',
      address: 'Tongerloplein 17, Udenhout',
    },
  ];

  // ── Bestelling: Klantadres ────────────────────────────────────
  const alternativeDeliveryAddress = ref(false);
  const deliverySalutation = ref('Dhr.');
  const deliverySalutationOptions = ['Fam.', 'Dhr.', 'Mevr.'];
  const deliveryAttentionOf = ref('');
  const deliveryFirstName = ref('');
  const deliveryLastName = ref('');
  const deliveryPhone = ref('');
  const deliveryPhoneAlt = ref('');
  const deliveryCountry = ref('Nederland');
  const deliveryPostalCode = ref('');
  const deliveryHouseNumber = ref('');
  const deliveryAddition = ref('');
  const deliveryStreet = ref('');
  const deliveryCity = ref('');
  const deliveryStrategy = ref('Op afspraak');
  const deliveryStrategyOptions = ['Op afspraak', 'Leverdatum'];
  const desiredDeliveryDate = ref<Date | null>(null);
  const deferredProcessing = ref(false);

  // ── Bestelling: Betaalmethode ────────────────────────────────
  const paymentMethod = ref('Ideal');
  const paymentMethodOptions = ['Ideal', 'Contant', 'Creditcard', 'Pin', 'Anders'];
</script>

<template>
  <StepPanel :value="4" class="flex flex-col grow view-card p-5">
    <!-- ── Choice screen (no mode selected yet) ──────────────── -->
    <div
      v-if="finalizeMode === null"
      class="flex flex-col items-center justify-center grow gap-6 py-8"
    >
      <p class="text-sm text-gray-500">Hoe wil je doorgaan met dit overzicht?</p>
      <div class="flex gap-4">
        <button class="choice-card" @click="finalizeMode = 'quotation'">
          <i class="pi pi-file-edit choice-card__icon" style="font-size: 2.5rem" />
          <span class="choice-card__title">Opslaan</span>
          <span class="choice-card__desc">Sla op als aanbieding voor de klant</span>
        </button>
        <button class="choice-card" @click="finalizeMode = 'order'">
          <i class="pi pi-shopping-cart choice-card__icon" style="font-size: 2.5rem" />
          <span class="choice-card__title">Bestelling plaatsen</span>
          <span class="choice-card__desc">Verwerk en bevestig de bestelling direct</span>
        </button>
      </div>
    </div>

    <!-- ── Form (mode chosen) ─────────────────────────────────── -->
    <div v-else class="flex grow items-start">
      <!-- Section nav -->
      <AddPageNav :sections="navItems">
        <Divider class="my-3!" />
        <div class="px-3">
          <button class="change-mind-btn" @click="finalizeMode = null">
            Toch van mening veranderd?
          </button>
        </div>
      </AddPageNav>

      <!-- Main content -->
      <div class="flex flex-col flex-1 min-w-0 py-2 pl-5 border-l border-gray-100">
        <!-- ── Planning ────────────────────────────────────────── -->
        <section id="planning" class="add-section">
          <div class="add-section-hdr">
            <i class="pi pi-calendar add-section-icon" />
            <div class="add-section-title">Planning</div>
          </div>
          <div class="flex flex-col gap-4">
            <!-- Wanneer verbouwen — offerte only -->
            <template v-if="finalizeMode === 'quotation'">
              <div class="form-row">
                <span class="form-label">Wanneer verbouwen</span>
                <div class="flex flex-col gap-2">
                  <SelectButton
                    v-model="selectedYear"
                    :options="years"
                    option-label="label"
                    option-value="value"
                  />
                  <SelectButton
                    v-model="selectedMonth"
                    :options="months"
                    option-label="label"
                    option-value="value"
                    class="flex-wrap!"
                  />
                </div>
              </div>
            </template>

            <!-- Aannemer / installateur -->
            <ContractorSection />
          </div>
        </section>

        <!-- ── Levering (bestelling only) ─────────────────────── -->
        <section v-if="finalizeMode === 'order'" id="levering" class="add-section">
          <div class="add-section-hdr">
            <i class="pi pi-truck add-section-icon" />
            <div class="add-section-title">Levering</div>
          </div>
          <div class="flex flex-col gap-4">
            <div class="form-row items-center">
              <span class="form-label">Eindbestemming</span>
              <SelectButton v-model="destination" :options="destinationOptions" />
            </div>

            <!-- Conditional content based on eindbestemming -->
            <Transition name="fade-slide" mode="out-in">
              <!-- Klantadres: optional different address -->
              <div v-if="destination === 'Klantadres'" key="klantadres" class="flex flex-col gap-4">
                <div class="form-row items-center">
                  <span class="form-label" />
                  <div class="flex items-center gap-2">
                    <ToggleSwitch v-model="alternativeDeliveryAddress" />
                    <span class="text-sm text-gray-500">Afwijkend bezorgadres</span>
                  </div>
                </div>
                <Transition name="fade-slide">
                  <div v-if="alternativeDeliveryAddress" class="subform">
                    <div class="form-row items-center">
                      <span class="form-label">Aanhef</span>
                      <SelectButton
                        v-model="deliverySalutation"
                        :options="deliverySalutationOptions"
                      />
                    </div>
                    <div class="form-row items-center">
                      <span class="form-label">Ter attentie van</span>
                      <InputText
                        v-model="deliveryAttentionOf"
                        placeholder="T.a.v. Jan de Vries"
                        class="flex-1"
                      />
                    </div>
                    <div class="form-row items-center">
                      <span class="form-label">Naam <span class="text-red-400">*</span></span>
                      <div class="flex gap-2 flex-1">
                        <InputText v-model="deliveryFirstName" placeholder="Jan" class="flex-1" />
                        <InputText
                          v-model="deliveryLastName"
                          placeholder="de Vries"
                          class="flex-1"
                        />
                      </div>
                    </div>
                    <div class="form-row items-center">
                      <span class="form-label"
                        >Telefoonnummer <span class="text-red-400">*</span></span
                      >
                      <div class="flex gap-2 flex-1">
                        <div class="flex gap-1 flex-1">
                          <Select
                            :options="[{ label: '+31', value: 'NL' }]"
                            option-label="label"
                            option-value="value"
                            class="w-32"
                            :model-value="'NL'"
                          >
                            <template #value="{ value }">
                              <div class="flex items-center gap-2">
                                <span :class="`fi fi-${value.toLowerCase()}`" />
                                <span>+31</span>
                              </div>
                            </template>
                          </Select>
                          <InputText
                            v-model="deliveryPhone"
                            placeholder="6 12345678"
                            class="flex-1"
                          />
                        </div>
                        <div class="flex gap-1 flex-1">
                          <Select
                            :options="[{ label: '+31', value: 'NL' }]"
                            option-label="label"
                            option-value="value"
                            class="w-32"
                            :model-value="'NL'"
                          >
                            <template #value="{ value }">
                              <div class="flex items-center gap-2">
                                <span :class="`fi fi-${value.toLowerCase()}`" />
                                <span>+31</span>
                              </div>
                            </template>
                          </Select>
                          <InputText
                            v-model="deliveryPhoneAlt"
                            placeholder="6 87654321"
                            class="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="form-row items-center">
                      <span class="form-label">Land</span>
                      <Select
                        v-model="deliveryCountry"
                        :options="['Nederland', 'België', 'Duitsland']"
                        placeholder="Selecteer een land"
                        class="flex-1"
                      />
                    </div>
                    <div class="form-row items-center">
                      <span class="form-label">Adres <span class="text-red-400">*</span></span>
                      <div class="flex flex-col gap-2 flex-1">
                        <div class="grid grid-cols-3 gap-2">
                          <InputText v-model="deliveryPostalCode" placeholder="1234 AB" />
                          <InputText v-model="deliveryHouseNumber" placeholder="12" />
                          <InputText v-model="deliveryAddition" placeholder="A" />
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                          <InputText v-model="deliveryStreet" placeholder="Kerkstraat" />
                          <InputText v-model="deliveryCity" placeholder="Amsterdam" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>

              <!-- Showroom: pick a location -->
              <div
                v-else-if="destination === 'Showroom'"
                key="showroom"
                class="form-row items-center"
              >
                <span class="form-label">Showroom</span>
                <Select
                  v-model="selectedShowroom"
                  :options="showroomOptions"
                  option-label="label"
                  option-value="value"
                  class="flex-1"
                />
              </div>

              <!-- Pickup Point: address search + nearby list -->
              <div
                v-else-if="destination === 'Pickup Point'"
                key="pickup"
                class="flex flex-col gap-4"
              >
                <div class="form-row items-center">
                  <span class="form-label">Adres</span>
                  <div class="flex flex-col gap-2 flex-1">
                    <div class="grid grid-cols-3 gap-2">
                      <InputText v-model="pickupPostalCode" placeholder="1234 AB" />
                      <InputText v-model="pickupHouseNumber" placeholder="12" />
                      <InputText v-model="pickupAddition" placeholder="A" />
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                      <InputText v-model="pickupStreet" placeholder="Kerkstraat" />
                      <InputText v-model="pickupCity" placeholder="Amsterdam" />
                    </div>
                  </div>
                </div>
                <div
                  class="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5"
                >
                  Kies een pickup point waar de bestelling naartoe verzonden wordt.
                </div>
                <div
                  class="rounded-lg border border-gray-200 overflow-hidden divide-y divide-gray-100"
                >
                  <button
                    v-for="point in pickupPoints"
                    :key="point.id"
                    class="flex items-center w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors bg-white gap-3"
                    :class="{ 'bg-primary-50!': selectedPickupPoint === point.id }"
                    @click="selectedPickupPoint = point.id"
                  >
                    <i
                      class="pi shrink-0 text-xs"
                      :class="
                        selectedPickupPoint === point.id
                          ? 'pi-check-circle text-primary-500'
                          : 'pi-circle text-gray-300'
                      "
                    />
                    <span class="flex-1 text-gray-700">{{ point.name }}</span>
                    <span class="text-xs text-gray-400 shrink-0">{{ point.distance }}</span>
                    <span class="text-xs text-primary-500 shrink-0">{{ point.address }}</span>
                  </button>
                </div>
              </div>
            </Transition>

            <div class="form-row">
              <span class="form-label">Strategie</span>
              <SelectButton v-model="deliveryStrategy" :options="deliveryStrategyOptions" />
            </div>
            <div class="form-row items-center">
              <span class="form-label">
                Gewenste leverdatum
                <span class="text-red-400 ml-0.5">*</span>
              </span>
              <DatePicker
                v-model="desiredDeliveryDate"
                date-format="dd-mm-yy"
                placeholder="DD-MM-JJJJ"
                class="w-72"
                show-icon
                icon-display="input"
              />
            </div>
            <div class="form-row items-center">
              <span class="form-label">Uitgestelde verwerking</span>
              <div class="flex items-center gap-2">
                <ToggleSwitch v-model="deferredProcessing" />
                <i class="pi pi-info-circle text-gray-400 text-sm" />
              </div>
            </div>
          </div>
        </section>

        <!-- ── Betaalmethode (bestelling only) ────────────────── -->
        <section v-if="finalizeMode === 'order'" id="betaalmethode" class="add-section">
          <div class="add-section-hdr">
            <i class="pi pi-credit-card add-section-icon" />
            <div class="add-section-title">Betaalmethode</div>
          </div>
          <div>
            <div class="form-row items-center">
              <span class="form-label">Betaalmethode</span>
              <SelectButton v-model="paymentMethod" :options="paymentMethodOptions" />
            </div>
          </div>
        </section>

        <!-- ── Afspraken ───────────────────────────────────────── -->
        <section id="afspraken" class="add-section">
          <div class="add-section-hdr">
            <i class="pi pi-comment add-section-icon" />
            <div class="add-section-title">Afspraken</div>
          </div>
          <div class="flex flex-col gap-4">
            <div class="form-row">
              <span class="form-label">Wat zullen we afspreken?</span>
              <Textarea
                v-model="appointmentNote"
                placeholder="Bijv. levering na 10:00, bel vooraf aan, parkeren bij zijdeur..."
                rows="5"
                class="w-full"
              />
            </div>
            <div class="form-row items-center">
              <span class="form-label">Deze afspraak is gemaakt met</span>
              <Select
                v-model="appointmentMadeWith"
                :options="userOptions"
                option-label="label"
                option-value="value"
                class="w-72"
              />
            </div>
            <div class="form-row items-center">
              <span class="form-label">
                Datum voor de afspraak
                <span v-if="finalizeMode === 'quotation'" class="text-red-400 ml-0.5">*</span>
              </span>
              <DatePicker
                v-model="appointmentDate"
                date-format="dd-mm-yy"
                placeholder="DD-MM-JJJJ"
                class="w-72"
                show-icon
                icon-display="input"
              />
            </div>
            <div class="form-row items-center">
              <span class="form-label">Wil je ook een taak aanmaken?</span>
              <ToggleSwitch v-model="createTask" />
            </div>
          </div>
        </section>

        <!-- ── Afronding (offerte only) ────────────────────────── -->
        <section v-if="finalizeMode === 'quotation'" id="afronding" class="add-section">
          <div class="add-section-hdr">
            <i class="pi pi-check-circle add-section-icon" />
            <div class="add-section-title">Afronding</div>
          </div>
          <div>
            <div class="form-row items-center">
              <span class="form-label">Automatische offerte mail</span>
              <div class="flex items-center gap-2.5">
                <ToggleSwitch v-model="automaticQuotationEmail" />
                <span class="text-sm text-gray-500">
                  Moet er een automatische offerte mail verstuurd worden?
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- ── Voorwaarden (bestelling only) ──────────────────── -->
        <section v-if="finalizeMode === 'order'" id="voorwaarden" class="add-section">
          <div class="add-section-hdr">
            <i class="pi pi-file add-section-icon" />
            <div class="add-section-title">Voorwaarden</div>
          </div>
          <div>
            <div class="form-row items-center">
              <span class="form-label">Extra voorwaarden</span>
              <Button label="Kies voorwaarden" class="btn-outlined" />
            </div>
          </div>
        </section>

        <!-- Price summary -->
        <Divider class="my-0!" />
        <div class="py-6">
          <OrderCartTotals v-if="finalizeMode !== null" />
        </div>
      </div>
    </div>
    <!-- end v-else form -->
  </StepPanel>
</template>

<style scoped>
  /* ── Sub-form ─────────────────────────────────────────────── */
  .subform {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: var(--p-gray-50);
    border: 1px solid var(--p-gray-200);
    border-radius: 0.625rem;
    padding: 1.25rem 1.5rem;
  }

  /* ── Form layout ──────────────────────────────────────────── */
  .form-row {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 0.5rem;
  }

  .form-label {
    font-size: 0.875rem;
    color: var(--p-gray-500);
    padding-top: 0.375rem;
  }

  /* ── Choice cards ────────────────────────────────────────── */
  .choice-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    width: 300px;
    height: 300px;
    padding: 2rem 1.5rem;
    border-radius: 0.75rem;
    border: 2px solid var(--p-gray-200);
    background: white;
    cursor: pointer;
    text-align: center;
    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease,
      background 0.15s ease;
  }

  .choice-card:hover {
    border-color: var(--p-primary-400);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    background: var(--p-primary-50);
  }

  .choice-card__icon {
    font-size: 1.75rem;
    color: var(--p-primary-500);
  }

  .choice-card__title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--p-gray-800);
  }

  .choice-card__desc {
    font-size: 0.8125rem;
    color: var(--p-gray-500);
    line-height: 1.4;
  }

  /* ── Change-mind link ─────────────────────────────────────── */
  .change-mind-btn {
    padding: 0.4rem 0.5rem;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 0.8rem;
    color: var(--p-primary-500);
    text-align: left;
    line-height: 1.4;
    transition:
      color 0.15s ease,
      background 0.15s ease;
    border-radius: 0.25rem;
    text-decoration: underline;
    text-underline-offset: 2px;
    text-decoration-color: var(--p-primary-300);
  }

  .change-mind-btn:hover {
    color: var(--p-primary-700);
    background: var(--p-primary-50);
    text-decoration-color: var(--p-primary-500);
  }

  /* ── SelectButton wrapping (months) ──────────────────────── */
  :deep(.flex-wrap\! .p-selectbutton) {
    flex-wrap: wrap;
  }

  /* ── Mode cards ──────────────────────────────────────────── */
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

  .mode-card__icon {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.95rem;
    flex-shrink: 0;
    transition: background 0.15s ease;
  }

  .mode-card--neutral:hover {
    border-color: var(--p-gray-400);
  }

  .mode-card--active-neutral {
    border-color: var(--p-gray-400);
    background: var(--p-gray-50);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--p-gray-500) 10%, transparent);
  }

  .mode-card__icon--neutral {
    background: var(--p-gray-100);
    color: var(--p-gray-500);
  }

  .mode-card--active-neutral .mode-card__icon--neutral {
    background: var(--p-gray-200);
    color: var(--p-gray-600);
  }

  /* ── Customer indicator ──────────────────────────────────── */
  .customer-indicator {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border: 1.5px solid var(--p-gray-300);
    border-radius: 0.625rem;
    background: var(--p-gray-50);
  }

  .customer-indicator__avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: var(--p-gray-200);
    color: var(--p-gray-600);
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
