<script setup lang="ts">
  import { ref } from 'vue';
  import OrdersAdd_CustomerSearch from '../sidebars/OrdersAdd_CustomerSearch.vue';
  import OrdersAdd_AppointmentSearch from '../sidebars/OrdersAdd_AppointmentSearch.vue';
  import AddPageNav from '@/components/layout/AddPageNav.vue';

  const sections = [
    { id: 'details', label: 'Je gegevens', description: 'Naam, e-mail en contact' },
    { id: 'address', label: 'Je adres', description: 'Bezorgadres' },
    { id: 'channel', label: 'Kanaal', description: 'Verkoop en vestiging' },
    { id: 'recommended', label: 'Aanbevolen', description: 'Optioneel' },
  ];

  type Mode = 'search' | 'new' | null;
  const mode = ref<Mode>('search');
  const customerSearchVisible = ref(false);
  const appointmentSearchVisible = ref(false);

  const searchQuery = ref('');
  const customerFound = ref(true);
  const mockFoundCustomer = { name: 'Joris Kamminga', email: 'joris@showroomworks.nl' };
  function deselectCustomer() {
    customerFound.value = false;
  }

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
    if (addingNewAddress.value) selectedAddressId.value = null;
  }

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

  const countryOptions = [
    { label: 'Nederland', value: 'NL' },
    { label: 'België', value: 'BE' },
    { label: 'Frankrijk', value: 'FR' },
    { label: 'Duitsland', value: 'DE' },
  ];
  const selectedCountry = ref('NL');
  const postalCode = ref('');
  const houseNumber = ref('');
  const addition = ref('');
  const street = ref('');
  const city = ref('');

  const channelOptions = [
    { label: 'Chat', value: 'chat' },
    { label: 'E-mail', value: 'email' },
    { label: 'Onbekend', value: 'onbekend' },
    { label: 'Online', value: 'online' },
    { label: 'Showroom', value: 'showroom' },
    { label: 'Telefoon', value: 'telefoon' },
    { label: 'Videogesprek', value: 'videogesprek' },
  ];
  const selectedChannel = ref('showroom');
  const departmentOptions = [
    { label: 'Verkoop', value: 'verkoop' },
    { label: 'Comm. Binnendienst', value: 'binnendienst' },
    { label: 'Verkoop zakelijk', value: 'verkoop-zakelijk' },
    { label: 'Klantenservice', value: 'klantenservice' },
    { label: 'Overig', value: 'overig' },
  ];
  const selectedDepartment = ref('overig');
  const branchOptions = [
    { label: 'Rosmalen', value: 1 },
    { label: 'Tilburg', value: 2 },
    { label: 'Rotterdam', value: 3 },
    { label: 'Amsterdam', value: 4 },
  ];
  const selectedBranch = ref(1);
  const reference = ref('');
  const sellerOptions = [
    { label: 'Joris Kamminga', value: 1 },
    { label: 'Jan de Vries', value: 2 },
  ];
  const selectedSeller = ref(1);

  type RecommendedMode = 'search' | 'manual' | null;
  const recommendedMode = ref<RecommendedMode>('search');
  const recommendedSearchVisible = ref(false);
  const recommendedFound = ref(true);
  const recommendedSearchQuery = ref('');
  const mockRecommendedCustomer = { name: 'Showroomworks BV', email: 'info@showroomworks.nl' };
  function deselectRecommended() {
    recommendedFound.value = false;
  }
  const recommendedBy = ref('');
  const recommendedCity = ref('');
  const companyTypeOptions = [
    { label: 'Aannemer', value: 1 },
    { label: 'Architect', value: 2 },
    { label: 'Installateur', value: 3 },
    { label: 'Projectontwikkelaar', value: 4 },
  ];
  const selectedCompanyType = ref(null);
</script>

<template>
  <StepPanel :value="2" class="flex flex-col grow view-card p-5">
    <div class="flex grow items-start">
      <!-- ── Section nav ─────────────────────────────────────── -->
      <AddPageNav :sections="sections" />

      <!-- ── Main content ────────────────────────────────────── -->
      <div class="flex flex-col flex-1 min-w-0 py-2 pl-5 border-l border-gray-100">
        <!-- Je gegevens ──────────────────────────────────────── -->
        <section id="details" class="add-section">
          <div class="add-section-hdr">
            <i class="pi pi-user add-section-icon" />
            <div class="add-section-title">Je gegevens</div>
          </div>
          <div class="flex flex-col gap-4">

          <div class="grid grid-cols-2 gap-3">
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
                <span class="font-semibold text-sm">Nieuwe klant aanmaken</span>
                <span class="text-xs text-gray-400 mt-0.5">Vul de klantgegevens handmatig in</span>
              </div>
              <i v-if="mode === 'new'" class="pi pi-check-circle ml-auto text-primary shrink-0" />
            </button>
          </div>

          <Transition name="fade">
            <div v-if="mode === 'search' && customerFound" class="customer-indicator">
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

          <Transition name="fade-slide" mode="out-in">
            <div v-if="mode === 'search'" key="search" class="flex gap-2">
              <IconField class="flex-1">
                <InputText
                  v-model="searchQuery"
                  class="w-full"
                  placeholder="naam@bedrijf.nl"
                  autofocus
                />
                <InputIcon class="pi pi-search" />
              </IconField>
              <Button
                label="Klant zoeken"
                icon="pi pi-user"
                class="btn-outlined"
                @click="customerSearchVisible = true"
              />
              <Button
                label="Afspraak zoeken"
                icon="pi pi-calendar"
                class="btn-outlined"
                @click="appointmentSearchVisible = true"
              />
            </div>

            <div v-else-if="mode === 'new'" key="new" class="flex flex-col gap-4">
              <div class="form-row items-center">
                <span class="form-label">Klanttype</span>
                <SelectButton
                  v-model="selectedCustomerType"
                  :options="customerTypes"
                  option-label="label"
                  option-value="value"
                  :allow-empty="false"
                />
              </div>
              <div class="form-row items-center">
                <span class="form-label">Aanhef</span>
                <SelectButton
                  v-model="selectedTitle"
                  :options="titles"
                  option-label="label"
                  option-value="value"
                />
              </div>
              <div class="form-row items-center">
                <span class="form-label">Naam <span class="text-red-400">*</span></span>
                <div class="flex gap-2 flex-1">
                  <InputText class="flex-1" placeholder="Jan" />
                  <InputText class="flex-1" placeholder="de Vries" />
                </div>
              </div>
              <div class="form-row items-center">
                <span class="form-label">E-mail <span class="text-red-400">*</span></span>
                <InputText class="flex-1" placeholder="jan@bedrijf.nl" type="email" />
              </div>
              <div class="form-row items-center">
                <span class="form-label">Telefoonnummer</span>
                <div class="flex gap-2 flex-1">
                  <Select
                    :options="[{ label: '+31', value: 'NL' }]"
                    option-label="label"
                    option-value="value"
                    class="w-32"
                    :model-value="'NL'"
                  >
                    <template #value="{ value }"
                      ><div class="flex items-center gap-2">
                        <span :class="`fi fi-${value.toLowerCase()}`" /><span>+31</span>
                      </div></template
                    >
                  </Select>
                  <InputText class="flex-1" placeholder="6 12345678" type="tel" />
                </div>
              </div>
              <div class="form-row items-center">
                <span class="form-label">Alternatief nummer</span>
                <div class="flex gap-2 flex-1">
                  <Select
                    :options="[{ label: '+31', value: 'NL' }]"
                    option-label="label"
                    option-value="value"
                    class="w-32"
                    :model-value="'NL'"
                  >
                    <template #value="{ value }"
                      ><div class="flex items-center gap-2">
                        <span :class="`fi fi-${value.toLowerCase()}`" /><span>+31</span>
                      </div></template
                    >
                  </Select>
                  <InputText class="flex-1" placeholder="6 87654321" type="tel" />
                </div>
              </div>
              <div class="form-row items-center">
                <span class="form-label">Voorkeuren</span>
                <div class="flex flex-col gap-2">
                  <div class="flex items-center gap-2">
                    <ToggleSwitch v-model="newsletter" /><span class="text-sm text-gray-600"
                      >Inschrijven voor nieuwsbrief</span
                    >
                  </div>
                  <div class="flex items-center gap-2">
                    <ToggleSwitch v-model="createAccount" /><span class="text-sm text-gray-600"
                      >Account aanmaken via e-mail uitnodiging</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </Transition>
          </div>
        </section>

        <!-- Je adres ──────────────────────────────────────────── -->
        <section id="address" class="add-section">
          <div class="add-section-hdr">
            <i class="pi pi-map-marker add-section-icon" />
            <div class="add-section-title">Je adres</div>
          </div>
          <div class="flex flex-col gap-4">

          <Transition name="fade-slide" mode="out-in">
            <div v-if="mode === 'search'" key="addr-search" class="flex flex-col gap-2">
              <Transition name="fade-slide">
                <div v-if="customerFound" class="flex flex-col gap-2">
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
                        >Nieuw adres toevoegen</span
                      >
                      <span v-if="addingNewAddress" class="text-xs text-gray-400"
                        >Vul het adres hieronder in</span
                      >
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
                    <div v-if="addingNewAddress" class="flex flex-col gap-4 pt-1">
                      <div class="form-row items-center">
                        <span class="form-label">Land</span
                        ><Select
                          v-model="selectedCountry"
                          :options="countryOptions"
                          option-label="label"
                          option-value="value"
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
                            <InputText v-model="street" placeholder="Kerkstraat" /><InputText
                              v-model="city"
                              placeholder="Amsterdam"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Transition>
                </div>
                <p v-else class="text-sm text-gray-400 italic">
                  Selecteer eerst een klant hierboven.
                </p>
              </Transition>
            </div>

            <div v-else-if="mode === 'new'" key="addr-new" class="flex flex-col gap-4">
              <div class="form-row items-center">
                <span class="form-label">Land</span
                ><Select
                  v-model="selectedCountry"
                  :options="countryOptions"
                  option-label="label"
                  option-value="value"
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
                    <InputText v-model="street" placeholder="Kerkstraat" /><InputText
                      v-model="city"
                      placeholder="Amsterdam"
                    />
                  </div>
                </div>
              </div>
            </div>

            <p v-else key="addr-empty" class="text-sm text-gray-400 italic">
              Selecteer eerst een klant hierboven.
            </p>
          </Transition>
          </div>
        </section>

        <!-- Kanaal ───────────────────────────────────────────── -->
        <section id="channel" class="add-section">
          <div class="add-section-hdr">
            <i class="pi pi-send add-section-icon" />
            <div class="add-section-title">Kanaal</div>
          </div>
          <div class="flex flex-col gap-4">
          <div class="form-row items-center">
            <span class="form-label">Kanaal</span
            ><SelectButton
              v-model="selectedChannel"
              :options="channelOptions"
              option-label="label"
              option-value="value"
              :allow-empty="false"
            />
          </div>
          <div class="form-row items-center">
            <span class="form-label">Afdeling</span
            ><SelectButton
              v-model="selectedDepartment"
              :options="departmentOptions"
              option-label="label"
              option-value="value"
              :allow-empty="false"
            />
          </div>
          <div class="form-row items-center">
            <span class="form-label">Vestiging</span
            ><Select
              v-model="selectedBranch"
              :options="branchOptions"
              option-label="label"
              option-value="value"
              class="flex-1"
            />
          </div>
          <div class="form-row items-center">
            <span class="form-label">Referentie</span
            ><InputText
              v-model="reference"
              class="flex-1"
              placeholder="Bijv. Bestelbon 2024-001"
            />
          </div>
          <div class="form-row items-center">
            <span class="form-label">Verkoper</span
            ><Select
              v-model="selectedSeller"
              :options="sellerOptions"
              option-label="label"
              option-value="value"
              class="flex-1"
            />
          </div>
          </div>
        </section>

        <!-- Aanbevolen door ───────────────────────────────────── -->
        <section id="recommended" class="add-section">
          <div class="add-section-hdr">
            <i class="pi pi-thumbs-up add-section-icon" />
            <div class="add-section-title">Ben je aanbevolen door iemand?</div>
          </div>
          <div class="flex flex-col gap-4">
          <div class="grid grid-cols-2 gap-3">
            <button
              class="mode-card mode-card--neutral"
              :class="{ 'mode-card--active-neutral': recommendedMode === 'search' }"
              @click="recommendedMode = recommendedMode === 'search' ? null : 'search'"
            >
              <div class="mode-card__icon mode-card__icon--neutral"><i class="pi pi-search" /></div>
              <div class="flex flex-col text-left">
                <span class="font-semibold text-sm">Bestaande klant zoeken</span
                ><span class="text-xs text-gray-400 mt-0.5">Zoek op e-mail</span>
              </div>
              <i
                v-if="recommendedMode === 'search'"
                class="pi pi-check-circle ml-auto text-gray-400 shrink-0"
              />
            </button>
            <button
              class="mode-card mode-card--neutral"
              :class="{ 'mode-card--active-neutral': recommendedMode === 'manual' }"
              @click="recommendedMode = recommendedMode === 'manual' ? null : 'manual'"
            >
              <div class="mode-card__icon mode-card__icon--neutral"><i class="pi pi-pencil" /></div>
              <div class="flex flex-col text-left">
                <span class="font-semibold text-sm">Handmatig invoeren</span
                ><span class="text-xs text-gray-400 mt-0.5">Vul de gegevens handmatig in</span>
              </div>
              <i
                v-if="recommendedMode === 'manual'"
                class="pi pi-check-circle ml-auto text-gray-400 shrink-0"
              />
            </button>
          </div>

          <Transition name="fade-slide" mode="out-in">
            <div
              v-if="recommendedMode === 'search'"
              key="aanbevolen-search"
              class="flex flex-col gap-3"
            >
              <div class="flex gap-2">
                <IconField class="flex-1"
                  ><InputText
                    v-model="recommendedSearchQuery"
                    class="w-full"
                    placeholder="Zoek op naam of e-mailadres" /><InputIcon class="pi pi-search"
                /></IconField>
                <Button
                  label="Klant zoeken"
                  icon="pi pi-user"
                  class="btn-outlined"
                  @click="recommendedSearchVisible = true"
                />
              </div>
              <Transition name="fade">
                <div v-if="recommendedFound" class="customer-indicator">
                  <div class="customer-indicator__avatar"><i class="pi pi-user" /></div>
                  <div class="flex flex-col leading-snug">
                    <span class="text-sm font-semibold">{{ mockRecommendedCustomer.name }}</span
                    ><span class="text-xs text-gray-400">{{ mockRecommendedCustomer.email }}</span>
                  </div>
                  <Button
                    icon="pi pi-times"
                    variant="text"
                    severity="secondary"
                    size="small"
                    rounded
                    class="ml-auto shrink-0"
                    @click="deselectRecommended"
                  />
                </div>
              </Transition>
            </div>

            <div
              v-else-if="recommendedMode === 'manual'"
              key="aanbevolen-manual"
              class="flex flex-col gap-4"
            >
              <div class="form-row items-center">
                <span class="form-label">Aanbevolen door</span
                ><InputText
                  v-model="recommendedBy"
                  class="flex-1"
                  placeholder="Bouwbedrijf de Vries"
                />
              </div>
              <div class="form-row items-center">
                <span class="form-label">Woonplaats</span
                ><InputText v-model="recommendedCity" class="flex-1" placeholder="Amsterdam" />
              </div>
              <div class="form-row items-center">
                <span class="form-label">Type bedrijf</span
                ><Select
                  v-model="selectedCompanyType"
                  :options="companyTypeOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Selecteer bedrijfstype"
                  class="flex-1"
                />
              </div>
            </div>
          </Transition>
          </div>
        </section>
      </div>
    </div>

    <OrdersAdd_CustomerSearch v-model="customerSearchVisible" />
    <OrdersAdd_CustomerSearch v-model="recommendedSearchVisible" />
    <OrdersAdd_AppointmentSearch v-model="appointmentSearchVisible" />
  </StepPanel>
</template>

<style scoped>
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
