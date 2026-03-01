<script setup lang="ts">
  import { ref } from 'vue';

  const sectionGegevens = ref<HTMLElement | null>(null);
  const sectionAdres = ref<HTMLElement | null>(null);
  const sectionKanaal = ref<HTMLElement | null>(null);
  const sectionAanbevolen = ref<HTMLElement | null>(null);

  function scrollTo(el: HTMLElement | null) {
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  import OrdersAdd_CustomerSearch from '../sidebars/OrdersAdd_CustomerSearch.vue';
  import OrdersAdd_AppointmentSearch from '../sidebars/OrdersAdd_AppointmentSearch.vue';

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
  const postcode = ref('');
  const huisnummer = ref('');
  const toevoeging = ref('');
  const straat = ref('');
  const stad = ref('');

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

  type AanbevolenMode = 'search' | 'manual' | null;
  const aanbevolenMode = ref<AanbevolenMode>('search');
  const aanbevolenSearchVisible = ref(false);
  const aanbevolenFound = ref(true);
  const aanbevolenSearchQuery = ref('');
  const mockAanbevolenCustomer = { name: 'Showroomworks BV', email: 'info@showroomworks.nl' };
  function deselectAanbevolen() {
    aanbevolenFound.value = false;
  }
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
    <div class="flex grow gap-10 pt-2">
      <!-- ── Section nav ─────────────────────────────────────── -->
      <aside class="sticky top-6 self-start flex flex-col gap-1 w-36 shrink-0 pt-1">
        <button class="section-nav-item" @click="scrollTo(sectionGegevens)">Je gegevens</button>
        <button class="section-nav-item" @click="scrollTo(sectionAdres)">Je adres</button>
        <button class="section-nav-item" @click="scrollTo(sectionKanaal)">Kanaal</button>
        <button class="section-nav-item" @click="scrollTo(sectionAanbevolen)">Aanbevolen</button>
      </aside>

      <!-- ── Main content ────────────────────────────────────── -->
      <div class="flex flex-col flex-1 min-w-0 pb-4">
        <!-- Je gegevens ──────────────────────────────────────── -->
        <section ref="sectionGegevens" class="flex flex-col gap-4 py-1 pb-6">
          <h2 class="section-heading">Je gegevens</h2>

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
        </section>

        <Divider class="my-0!" />

        <!-- Je adres ──────────────────────────────────────────── -->
        <section ref="sectionAdres" class="flex flex-col gap-4 py-6">
          <h2 class="section-heading">Je adres</h2>

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
                            <InputText v-model="postcode" placeholder="1234 AB" /><InputText
                              v-model="huisnummer"
                              placeholder="12"
                            /><InputText v-model="toevoeging" placeholder="A" />
                          </div>
                          <div class="grid grid-cols-2 gap-2">
                            <InputText v-model="straat" placeholder="Kerkstraat" /><InputText
                              v-model="stad"
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
                    <InputText v-model="postcode" placeholder="1234 AB" /><InputText
                      v-model="huisnummer"
                      placeholder="12"
                    /><InputText v-model="toevoeging" placeholder="A" />
                  </div>
                  <div class="grid grid-cols-2 gap-2">
                    <InputText v-model="straat" placeholder="Kerkstraat" /><InputText
                      v-model="stad"
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
        </section>

        <Divider class="my-0!" />

        <!-- Kanaal ───────────────────────────────────────────── -->
        <section ref="sectionKanaal" class="flex flex-col gap-4 py-6">
          <h2 class="section-heading">Kanaal</h2>
          <div class="form-row items-center">
            <span class="form-label">Kanaal</span
            ><SelectButton
              v-model="selectedKanaal"
              :options="kanaalOptions"
              option-label="label"
              option-value="value"
              :allow-empty="false"
            />
          </div>
          <div class="form-row items-center">
            <span class="form-label">Afdeling</span
            ><SelectButton
              v-model="selectedAfdeling"
              :options="afdelingOptions"
              option-label="label"
              option-value="value"
              :allow-empty="false"
            />
          </div>
          <div class="form-row items-center">
            <span class="form-label">Vestiging</span
            ><Select
              v-model="selectedVestiging"
              :options="vestigingOptions"
              option-label="label"
              option-value="value"
              class="flex-1"
            />
          </div>
          <div class="form-row items-center">
            <span class="form-label">Referentie</span
            ><InputText
              v-model="referentie"
              class="flex-1"
              placeholder="Bijv. Bestelbon 2024-001"
            />
          </div>
          <div class="form-row items-center">
            <span class="form-label">Verkoper</span
            ><Select
              v-model="selectedVerkoper"
              :options="verkoperOptions"
              option-label="label"
              option-value="value"
              class="flex-1"
            />
          </div>
        </section>

        <Divider class="my-0!" />

        <!-- Aanbevolen door ───────────────────────────────────── -->
        <section ref="sectionAanbevolen" class="flex flex-col gap-4 py-6">
          <h2 class="section-heading">Ben je aanbevolen door iemand?</h2>

          <div class="grid grid-cols-2 gap-3">
            <button
              class="mode-card mode-card--neutral"
              :class="{ 'mode-card--active-neutral': aanbevolenMode === 'search' }"
              @click="aanbevolenMode = aanbevolenMode === 'search' ? null : 'search'"
            >
              <div class="mode-card__icon mode-card__icon--neutral"><i class="pi pi-search" /></div>
              <div class="flex flex-col text-left">
                <span class="font-semibold text-sm">Bestaande klant zoeken</span
                ><span class="text-xs text-gray-400 mt-0.5">Zoek op e-mail</span>
              </div>
              <i
                v-if="aanbevolenMode === 'search'"
                class="pi pi-check-circle ml-auto text-gray-400 shrink-0"
              />
            </button>
            <button
              class="mode-card mode-card--neutral"
              :class="{ 'mode-card--active-neutral': aanbevolenMode === 'manual' }"
              @click="aanbevolenMode = aanbevolenMode === 'manual' ? null : 'manual'"
            >
              <div class="mode-card__icon mode-card__icon--neutral"><i class="pi pi-pencil" /></div>
              <div class="flex flex-col text-left">
                <span class="font-semibold text-sm">Handmatig invoeren</span
                ><span class="text-xs text-gray-400 mt-0.5">Vul de gegevens handmatig in</span>
              </div>
              <i
                v-if="aanbevolenMode === 'manual'"
                class="pi pi-check-circle ml-auto text-gray-400 shrink-0"
              />
            </button>
          </div>

          <Transition name="fade-slide" mode="out-in">
            <div
              v-if="aanbevolenMode === 'search'"
              key="aanbevolen-search"
              class="flex flex-col gap-3"
            >
              <div class="flex gap-2">
                <IconField class="flex-1"
                  ><InputText
                    v-model="aanbevolenSearchQuery"
                    class="w-full"
                    placeholder="Zoek op naam of e-mailadres" /><InputIcon class="pi pi-search"
                /></IconField>
                <Button
                  label="Klant zoeken"
                  icon="pi pi-user"
                  class="btn-outlined"
                  @click="aanbevolenSearchVisible = true"
                />
              </div>
              <Transition name="fade">
                <div v-if="aanbevolenFound" class="customer-indicator">
                  <div class="customer-indicator__avatar"><i class="pi pi-user" /></div>
                  <div class="flex flex-col leading-snug">
                    <span class="text-sm font-semibold">{{ mockAanbevolenCustomer.name }}</span
                    ><span class="text-xs text-gray-400">{{ mockAanbevolenCustomer.email }}</span>
                  </div>
                  <Button
                    icon="pi pi-times"
                    variant="text"
                    severity="secondary"
                    size="small"
                    rounded
                    class="ml-auto shrink-0"
                    @click="deselectAanbevolen"
                  />
                </div>
              </Transition>
            </div>

            <div
              v-else-if="aanbevolenMode === 'manual'"
              key="aanbevolen-manual"
              class="flex flex-col gap-4"
            >
              <div class="form-row items-center">
                <span class="form-label">Aanbevolen door</span
                ><InputText
                  v-model="aanbevolenDoor"
                  class="flex-1"
                  placeholder="Bouwbedrijf de Vries"
                />
              </div>
              <div class="form-row items-center">
                <span class="form-label">Woonplaats</span
                ><InputText v-model="woonplaats" class="flex-1" placeholder="Amsterdam" />
              </div>
              <div class="form-row items-center">
                <span class="form-label">Type bedrijf</span
                ><Select
                  v-model="selectedTypeBedrijf"
                  :options="typeBedrijfOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Selecteer bedrijfstype"
                  class="flex-1"
                />
              </div>
            </div>
          </Transition>
        </section>
      </div>
    </div>

    <div class="flex pt-4 justify-between">
      <Button label="Terug" class="btn-back" icon="pi pi-arrow-left" @click="activateCallback(1)" />
      <Button
        label="Volgende"
        severity="secondary"
        icon="pi pi-arrow-right"
        icon-pos="right"
        @click="activateCallback(3)"
      />
    </div>

    <OrdersAdd_CustomerSearch v-model="customerSearchVisible" />
    <OrdersAdd_CustomerSearch v-model="aanbevolenSearchVisible" />
    <OrdersAdd_AppointmentSearch v-model="appointmentSearchVisible" />
  </StepPanel>
</template>

<style scoped>
  .section-heading {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--p-gray-800);
    margin: 0;
  }

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
