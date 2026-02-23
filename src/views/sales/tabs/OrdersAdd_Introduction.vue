<script setup lang="ts">
  import { ref } from 'vue';
  import OrdersAdd_CustomerSearch from '../sidebars/OrdersAdd_CustomerSearch.vue';
  import OrdersAdd_AppointmentSearch from '../sidebars/OrdersAdd_AppointmentSearch.vue';

  type Mode = 'search' | 'new' | null;

  const mode = ref<Mode>('search');
  const customerSearchVisible = ref(false);
  const appointmentSearchVisible = ref(false);

  // ── Search mode ──────────────────────────────────────────────
  const searchQuery = ref('');
  const customerFound = ref(true);

  const mockFoundCustomer = {
    name: 'Joris Kamminga',
    email: 'joris@showroomworks.nl',
  };

  function deselectCustomer() {
    customerFound.value = false;
  }

  // Existing addresses for the found customer
  const existingAddresses = [
    { id: 1, street: 'Hoofdstraat 12', postcode: '5241 EG', city: 'Rosmalen' },
    { id: 2, street: 'Kerkstraat 45A', postcode: '5211 BA', city: 'Den Bosch' },
  ];
  const selectedAddressId = ref<number | null>(1);
  const addingNewAddress = ref(false);

  function selectAddress(id: number) {
    selectedAddressId.value = id;
    addingNewAddress.value = false;
  }

  function toggleNewAddress() {
    addingNewAddress.value = !addingNewAddress.value;
    if (addingNewAddress.value) {
      selectedAddressId.value = null;
    }
  }

  // ── New customer form ────────────────────────────────────────
  const selectedCustomerType = ref(1);
  const customerTypes = [
    { label: 'Particulier', value: 1 },
    { label: 'Zakelijk', value: 2 },
  ];

  const selectedTitle = ref<number | undefined>(undefined);
  const titles = [
    { label: 'Fam.', value: 1 },
    { label: 'Dhr.', value: 2 },
    { label: 'Mevr.', value: 3 },
  ];

  const newsletter = ref(false);
  const createAccount = ref(false);

  // ── Address (new customer) ───────────────────────────────────
  const countryOptions = [
    { label: 'Nederland', value: 'NL' },
    { label: 'België', value: 'BE' },
    { label: 'Frankrijk', value: 'FR' },
    { label: 'Duitsland', value: 'DE' },
  ];
  const selectedCountry = ref('NL');
  const postcode = ref('');
  const huisnummer = ref('');
  const toevoeging = ref('');
  const straat = ref('');
  const stad = ref('');

  // ── Kanaal ───────────────────────────────────────────────────
  const kanaalOptions = [
    { label: 'Chat', value: 'chat' },
    { label: 'E-mail', value: 'email' },
    { label: 'Onbekend', value: 'onbekend' },
    { label: 'Online', value: 'online' },
    { label: 'Showroom', value: 'showroom' },
    { label: 'Telefoon', value: 'telefoon' },
    { label: 'Videogesprek', value: 'videogesprek' },
  ];
  const selectedKanaal = ref('showroom');

  const afdelingOptions = [
    { label: 'Verkoop', value: 'verkoop' },
    { label: 'Comm. Binnendienst', value: 'binnendienst' },
    { label: 'Verkoop zakelijk', value: 'verkoop-zakelijk' },
    { label: 'Klantenservice', value: 'klantenservice' },
    { label: 'Overig', value: 'overig' },
  ];
  const selectedAfdeling = ref('overig');

  const vestigingOptions = [
    { label: 'Rosmalen', value: 1 },
    { label: 'Tilburg', value: 2 },
    { label: 'Rotterdam', value: 3 },
    { label: 'Amsterdam', value: 4 },
  ];
  const selectedVestiging = ref(1);
  const referentie = ref('');

  const verkoperOptions = [
    { label: 'Joris Kamminga', value: 1 },
    { label: 'Jan de Vries', value: 2 },
  ];
  const selectedVerkoper = ref(1);

  // ── Extra ────────────────────────────────────────────────────
  const aanbevolenDoor = ref('');
  const woonplaats = ref('');
  const typeBedrijfOptions = [
    { label: 'Aannemer', value: 1 },
    { label: 'Architect', value: 2 },
    { label: 'Installateur', value: 3 },
    { label: 'Projectontwikkelaar', value: 4 },
  ];
  const selectedTypeBedrijf = ref(null);
</script>

<template>
  <StepPanel v-slot="{ activateCallback }" :value="2" class="flex flex-col grow">
    <div class="flex flex-col grow gap-6">
      <h1 class="text-2xl font-semibold">Even voorstellen</h1>

      <!-- Mode picker -->
      <div class="grid grid-cols-2 gap-4">
        <button
          class="mode-card"
          :class="{ 'mode-card--active': mode === 'search' }"
          @click="mode = 'search'"
        >
          <div class="mode-card__icon"><i class="pi pi-search" /></div>
          <div class="flex flex-col text-left">
            <span class="font-semibold text-sm">Bestaande klant of afspraak</span>
            <span class="text-xs text-gray-400 mt-0.5">Zoek op e-mail</span>
          </div>
          <i v-if="mode === 'search'" class="pi pi-check-circle ml-auto text-primary shrink-0" />
        </button>

        <button
          class="mode-card"
          :class="{ 'mode-card--active': mode === 'new' }"
          @click="mode = 'new'"
        >
          <div class="mode-card__icon"><i class="pi pi-user-plus" /></div>
          <div class="flex flex-col text-left">
            <span class="font-semibold text-sm">Nieuwe klant aanmaken</span>
            <span class="text-xs text-gray-400 mt-0.5">Vul de klantgegevens handmatig in</span>
          </div>
          <i v-if="mode === 'new'" class="pi pi-check-circle ml-auto text-primary shrink-0" />
        </button>
      </div>

      <!-- Selected customer indicator -->
      <Transition name="fade">
        <div v-if="mode === 'search' && customerFound" class="customer-indicator">
          <div class="customer-indicator__avatar">
            <i class="pi pi-user" />
          </div>
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

      <!-- ── Mode content ──────────────────────────────────────── -->
      <Transition name="fade-slide" mode="out-in">
        <!-- Search mode -->
        <div v-if="mode === 'search'" key="search" class="flex flex-col gap-4">
          <div class="flex gap-2">
            <IconField class="flex-1">
              <InputText
                v-model="searchQuery"
                class="w-full"
                placeholder="Zoek op e-mailadres"
                autofocus
              />
              <InputIcon class="pi pi-search" />
            </IconField>
            <Button
              label="Klant zoeken"
              icon="pi pi-user"
              severity="secondary"
              @click="customerSearchVisible = true"
            />
            <Button
              label="Afspraak zoeken"
              icon="pi pi-calendar"
              severity="secondary"
              @click="appointmentSearchVisible = true"
            />
          </div>

          <!-- Address section — only when customer is found -->
          <Transition name="fade-slide">
            <div v-if="customerFound" class="flex flex-col gap-4">
              <div class="flex flex-col gap-2">
                <span class="text-xs font-semibold uppercase tracking-wider text-gray-400"
                  >Adres</span
                >
                <div class="flex flex-col gap-2">
                  <button
                    v-for="addr in existingAddresses"
                    :key="addr.id"
                    class="address-card"
                    :class="{ 'address-card--selected': selectedAddressId === addr.id }"
                    @click="selectAddress(addr.id)"
                  >
                    <i
                      class="pi shrink-0"
                      :class="
                        selectedAddressId === addr.id
                          ? 'pi-check-circle text-primary'
                          : 'pi-circle text-gray-300'
                      "
                    />
                    <div class="flex flex-col text-left leading-snug">
                      <span class="text-sm font-medium">{{ addr.street }}</span>
                      <span class="text-xs text-gray-400">{{ addr.postcode }} {{ addr.city }}</span>
                    </div>
                  </button>
                </div>
                <button
                  class="address-card address-card--add"
                  :class="{ 'address-card--selected': addingNewAddress }"
                  @click="toggleNewAddress"
                >
                  <i
                    class="pi shrink-0"
                    :class="
                      addingNewAddress
                        ? 'pi-check-circle text-primary'
                        : 'pi-plus-circle text-gray-400'
                    "
                  />
                  <div class="flex flex-col text-left leading-snug">
                    <span
                      class="text-sm font-medium"
                      :class="{ 'text-gray-500': !addingNewAddress }"
                    >
                      Nieuw adres toevoegen
                    </span>
                    <span v-if="addingNewAddress" class="text-xs text-gray-400">
                      Vul het adres hieronder in
                    </span>
                  </div>
                  <Button
                    v-if="addingNewAddress"
                    icon="pi pi-times"
                    variant="text"
                    severity="secondary"
                    size="small"
                    rounded
                    class="ml-auto shrink-0"
                    @click.stop="toggleNewAddress"
                  />
                </button>
                <Transition name="fade-slide">
                  <div v-if="addingNewAddress" class="flex flex-col gap-5">
                    <div class="form-row">
                      <label class="form-label">Land</label>
                      <Select
                        v-model="selectedCountry"
                        :options="countryOptions"
                        option-label="label"
                        option-value="value"
                        class="flex-1"
                      />
                    </div>
                    <div class="form-row">
                      <label class="form-label">Adres</label>
                      <div class="flex flex-col gap-2 flex-1">
                        <div class="grid grid-cols-3 gap-2">
                          <InputText v-model="postcode" placeholder="Postcode" />
                          <InputText v-model="huisnummer" placeholder="Huisnummer" />
                          <InputText v-model="toevoeging" placeholder="Toevoeging" />
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                          <InputText v-model="straat" placeholder="Straat" />
                          <InputText v-model="stad" placeholder="Stad" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </Transition>
        </div>

        <!-- New customer mode -->
        <div v-else-if="mode === 'new'" key="new" class="flex flex-col gap-5">
          <div class="form-row">
            <label class="form-label">Klanttype</label>
            <SelectButton
              v-model="selectedCustomerType"
              :options="customerTypes"
              option-label="label"
              option-value="value"
              :allow-empty="false"
            />
          </div>
          <div class="form-row">
            <label class="form-label">Aanhef</label>
            <SelectButton
              v-model="selectedTitle"
              :options="titles"
              option-label="label"
              option-value="value"
            />
          </div>
          <div class="form-row">
            <label class="form-label">Naam <span class="text-red-400">*</span></label>
            <div class="flex gap-2 flex-1">
              <InputText class="flex-1" placeholder="Voer een voornaam in" />
              <InputText class="flex-1" placeholder="Voer een achternaam in" />
            </div>
          </div>
          <div class="form-row">
            <label class="form-label">E-mail <span class="text-red-400">*</span></label>
            <InputText class="flex-1" placeholder="Voer een emailadres in" type="email" />
          </div>
          <div class="form-row">
            <label class="form-label">Telefoonnummer</label>
            <div class="flex gap-2 flex-1">
              <Select
                :options="[{ label: '🇳🇱 +31', value: 'NL' }]"
                option-label="label"
                option-value="value"
                class="w-32"
                :model-value="'NL'"
              />
              <InputText class="flex-1" placeholder="Voer een telefoonnummer in" type="tel" />
            </div>
          </div>
          <div class="form-row">
            <label class="form-label">Alternatief telefoonnummer</label>
            <div class="flex gap-2 flex-1">
              <Select
                :options="[{ label: '🇳🇱 +31', value: 'NL' }]"
                option-label="label"
                option-value="value"
                class="w-32"
                :model-value="'NL'"
              />
              <InputText
                class="flex-1"
                placeholder="Voer een alternatief telefoonnummer in"
                type="tel"
              />
            </div>
          </div>
          <Divider class="my-0" />
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-3">
              <ToggleSwitch v-model="newsletter" />
              <span class="text-sm text-gray-600">Inschrijven voor nieuwsbrief</span>
            </div>
            <div class="flex items-center gap-3">
              <ToggleSwitch v-model="createAccount" />
              <span class="text-sm text-gray-600"
                >Account aanmaken na ontvangen uitnodiging via e-mail</span
              >
            </div>
          </div>

          <!-- Address form for new customer -->
          <Divider class="my-0" />
          <h2 class="section-heading">Je adres</h2>
          <div class="form-row">
            <label class="form-label">Land</label>
            <Select
              v-model="selectedCountry"
              :options="countryOptions"
              option-label="label"
              option-value="value"
              class="flex-1"
            />
          </div>
          <div class="form-row">
            <label class="form-label">Adres</label>
            <div class="flex flex-col gap-2 flex-1">
              <div class="grid grid-cols-3 gap-2">
                <InputText v-model="postcode" placeholder="Postcode" />
                <InputText v-model="huisnummer" placeholder="Huisnummer" />
                <InputText v-model="toevoeging" placeholder="Toevoeging" />
              </div>
              <div class="grid grid-cols-2 gap-2">
                <InputText v-model="straat" placeholder="Straat" />
                <InputText v-model="stad" placeholder="Stad" />
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ── Kanaal (always visible) ───────────────────────────── -->
      <Divider class="my-0" />
      <div class="flex flex-col gap-5">
        <h2 class="section-heading">Kanaal</h2>
        <div class="form-row">
          <label class="form-label">Kanaal</label>
          <SelectButton
            v-model="selectedKanaal"
            :options="kanaalOptions"
            option-label="label"
            option-value="value"
            :allow-empty="false"
          />
        </div>
        <div class="form-row">
          <label class="form-label">Afdeling</label>
          <SelectButton
            v-model="selectedAfdeling"
            :options="afdelingOptions"
            option-label="label"
            option-value="value"
            :allow-empty="false"
          />
        </div>
        <div class="form-row">
          <label class="form-label">Vestiging</label>
          <Select
            v-model="selectedVestiging"
            :options="vestigingOptions"
            option-label="label"
            option-value="value"
            class="flex-1"
          />
        </div>
        <div class="form-row">
          <label class="form-label">Referentie</label>
          <InputText v-model="referentie" class="flex-1" placeholder="Vul hier een referentie in" />
        </div>
        <div class="form-row">
          <label class="form-label">Verkoper</label>
          <Select
            v-model="selectedVerkoper"
            :options="verkoperOptions"
            option-label="label"
            option-value="value"
            class="flex-1"
          />
        </div>
      </div>

      <!-- ── Extra (always visible) ────────────────────────────── -->
      <Divider class="my-0" />
      <div class="flex flex-col gap-5">
        <div class="form-row">
          <label class="form-label">Aanbevolen door</label>
          <InputText v-model="aanbevolenDoor" class="flex-1" placeholder="Naam bedrijf" />
        </div>
        <div class="form-row">
          <label class="form-label">Woonplaats</label>
          <InputText v-model="woonplaats" class="flex-1" placeholder="Woonplaats" />
        </div>
        <div class="form-row">
          <label class="form-label">Type bedrijf</label>
          <Select
            v-model="selectedTypeBedrijf"
            :options="typeBedrijfOptions"
            option-label="label"
            option-value="value"
            placeholder="Selecteer een optie"
            class="flex-1"
          />
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex pt-6 justify-between">
      <Button
        label="Back"
        severity="secondary"
        icon="pi pi-arrow-left"
        @click="activateCallback(1)"
      />
      <Button label="Next" icon="pi pi-arrow-right" icon-pos="right" @click="activateCallback(3)" />
    </div>

    <OrdersAdd_CustomerSearch v-model="customerSearchVisible" />
    <OrdersAdd_AppointmentSearch v-model="appointmentSearchVisible" />
  </StepPanel>
</template>

<style scoped>
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

  /* ── Selected customer indicator ─────────────────────────── */
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

  /* ── Form layout ─────────────────────────────────────────── */
  .form-row {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .form-label {
    width: 12rem;
    flex-shrink: 0;
    font-size: 0.875rem;
    color: var(--p-surface-600);
  }

  .section-heading {
    font-size: 1rem;
    font-weight: 600;
    color: var(--p-surface-800);
  }

  /* ── Address cards ───────────────────────────────────────── */
  .address-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    border: 1.5px solid var(--p-surface-200);
    border-radius: 0.5rem;
    background: var(--p-surface-0);
    cursor: pointer;
    width: 100%;
    transition:
      border-color 0.15s ease,
      background 0.15s ease;
  }

  .address-card:hover {
    border-color: var(--p-primary-300);
  }

  .address-card--selected {
    border-color: var(--p-primary-500);
    background: var(--p-primary-50);
  }

  .address-card--add {
    border-style: dashed;
    color: var(--p-surface-500);
  }

  .address-card--add:hover {
    color: var(--p-surface-700);
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
