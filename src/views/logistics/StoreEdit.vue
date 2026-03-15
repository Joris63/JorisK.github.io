<script setup lang="ts">
  import { ref, computed } from 'vue';
  import AddressFields from '@/components/form/AddressFields.vue';
  import PhoneField from '@/components/form/PhoneField.vue';
  import EditPageLayout from '@/components/layout/EditPageLayout.vue';
  import EditPageHeader from '@/components/layout/EditPageHeader.vue';
  import EditPageTabs from '@/components/layout/EditPageTabs.vue';
  import type { TabDef } from '@/components/layout/EditPageTabs.vue';

  // ── Mock data ──────────────────────────────────────────────────────────────
  interface OpeningHours {
    day: string;
    from: string;
    to: string;
    closed: boolean;
  }

  interface Exception {
    id: number;
    date: Date | null;
    from: string;
    to: string;
    closed: boolean;
    reason: Record<string, string>;
  }

  const store = ref({
    name: 'Utrecht',
    abbreviation: 'UTR',
    slug: 'showroom_utr',
    active: true,
    mainStore: false,
    outlet: false,
    openingSoon: false,
    pickupLocation: 'Utrecht',
    sites: ['sanitairwinkel_nl'],
    // Address
    country: 'NL',
    street: 'Koningin Julianaplein',
    houseNumber: '10',
    addition: '',
    postalCode: '3527 KB',
    city: 'Utrecht',
    addressNote: '',
    // Contact
    phoneCountry: 'NL',
    phoneNumber: '30 123 4567',
    email: 'utrecht@sanitairwinkel.nl',
    // Other
    latitude: '52.091',
    longitude: '5.122',
    promotionPage: 'Showroom Utrecht',
    googleCode: '17',
    seoTitle: 'Sanitairwinkel Utrecht – Dé badkamershowroom in Utrecht',
    seoDescription:
      'Bezoek onze ruime showroom in Utrecht en laat je inspireren door honderden badkameropstellingen. Onze specialisten helpen je graag verder.',
    introText:
      'Welkom bij Sanitairwinkel Utrecht. Onze showroom aan het Koningin Julianaplein biedt een inspirerende omgeving met de nieuwste badkamercollecties van toonaangevende merken.',
    heroImage: 'https://placehold.co/1200x500/e5e7eb/9ca3af?text=Hero+afbeelding',
    overviewImage: 'https://placehold.co/800x500/e5e7eb/9ca3af?text=Overzicht+afbeelding',
    google360Tour: '',
    youtubeVideo: 'https://youtu.be/6LyszVQsTbk',
    atmosphereImages: [
      'https://placehold.co/800x500/e5e7eb/9ca3af?text=Sfeerimpressie+1',
      'https://placehold.co/800x500/e5e7eb/9ca3af?text=Sfeerimpressie+2',
      '',
      '',
    ],
  });

  const openingHours = ref<OpeningHours[]>([
    { day: 'Maandag', from: '09:00', to: '17:30', closed: false },
    { day: 'Dinsdag', from: '09:00', to: '17:30', closed: false },
    { day: 'Woensdag', from: '09:00', to: '17:30', closed: false },
    { day: 'Donderdag', from: '09:00', to: '20:00', closed: false },
    { day: 'Vrijdag', from: '09:00', to: '17:30', closed: false },
    { day: 'Zaterdag', from: '10:00', to: '17:00', closed: false },
    { day: 'Zondag', from: '', to: '', closed: true },
  ]);

  const exceptions = ref<Exception[]>([
    {
      id: 1,
      date: new Date(2026, 3, 5),
      from: '',
      to: '',
      closed: true,
      reason: { sanitairwinkel_nl: '1e Paasdag' },
    },
    {
      id: 2,
      date: new Date(2026, 3, 6),
      from: '12:00',
      to: '17:00',
      closed: false,
      reason: { sanitairwinkel_nl: 'Koopzondag (Pasen)' },
    },
    {
      id: 3,
      date: new Date(2026, 3, 27),
      from: '',
      to: '',
      closed: true,
      reason: { sanitairwinkel_nl: 'Koningsdag' },
    },
    {
      id: 4,
      date: new Date(2026, 4, 5),
      from: '10:00',
      to: '17:00',
      closed: false,
      reason: { sanitairwinkel_nl: 'Bevrijdingsdag' },
    },
    {
      id: 5,
      date: new Date(2026, 4, 14),
      from: '',
      to: '',
      closed: true,
      reason: { sanitairwinkel_nl: 'Hemelvaartsdag' },
    },
    {
      id: 6,
      date: new Date(2026, 10, 27),
      from: '09:00',
      to: '21:00',
      closed: false,
      reason: { sanitairwinkel_nl: 'Black Friday' },
    },
    {
      id: 7,
      date: new Date(2026, 11, 5),
      from: '10:00',
      to: '17:00',
      closed: false,
      reason: { sanitairwinkel_nl: 'Pakjesavond' },
    },
    {
      id: 8,
      date: new Date(2026, 11, 24),
      from: '09:00',
      to: '15:00',
      closed: false,
      reason: { sanitairwinkel_nl: 'Kerstavond' },
    },
    {
      id: 9,
      date: new Date(2026, 11, 25),
      from: '',
      to: '',
      closed: true,
      reason: { sanitairwinkel_nl: '1e Kerstdag' },
    },
    {
      id: 10,
      date: new Date(2026, 11, 26),
      from: '',
      to: '',
      closed: true,
      reason: { sanitairwinkel_nl: '2e Kerstdag' },
    },
    {
      id: 11,
      date: new Date(2026, 11, 31),
      from: '09:00',
      to: '15:00',
      closed: false,
      reason: { sanitairwinkel_nl: 'Oudjaarsdag' },
    },
  ]);

  let nextExceptionId = 12;

  function addException() {
    const reason: Record<string, string> = {};
    for (const sv of siteviews.value) reason[sv.key] = '';
    exceptions.value.push({
      id: nextExceptionId++,
      date: null,
      from: '09:00',
      to: '17:30',
      closed: false,
      reason,
    });
  }

  function removeException(id: number) {
    exceptions.value = exceptions.value.filter((u) => u.id !== id);
  }

  function formatDate(date: Date | null) {
    return date?.toLocaleDateString('nl-NL') ?? '—';
  }

  const activeTab = ref('algemeen');

  const tabs: TabDef[] = [
    { id: 'algemeen', label: 'Algemene informatie', icon: 'pi-shop' },
    { id: 'openingstijden', label: 'Openingstijden', icon: 'pi-clock' },
    { id: 'content', label: 'Content website', icon: 'pi-globe' },
  ];

  const isEditingGeneral = ref(false);
  const isEditingAddress = ref(false);
  const isEditingContact = ref(false);
  const isEditingMisc = ref(false);
  const isEditingHours = ref(false);
  const isEditingExceptions = ref(false);
  const isEditingContent = ref(false);

  const countryOptions = [
    { label: 'Nederland', value: 'NL' },
    { label: 'België', value: 'BE' },
    { label: 'Frankrijk', value: 'FR' },
    { label: 'Duitsland', value: 'DE' },
  ];

  const siteOptions = [
    { label: 'sanitairwinkel.nl', value: 'sanitairwinkel_nl' },
    { label: 'sawiday.be', value: 'sawiday_be' },
    { label: 'sawiday.fr', value: 'sawiday_fr' },
    { label: 'sawiday.de', value: 'sawiday_de' },
  ];

  const pickupOptions = [
    'Alkmaar',
    'Almere',
    'Amsterdam Amstel',
    'Amsterdam West',
    'Arnhem',
    'Breda',
    'Eindhoven',
    'Groningen',
    'Den Haag',
    'Leeuwarden',
    'Leiden',
    'Nijmegen',
    'Rotterdam',
    'Tilburg',
    'Utrecht',
    'Zwolle',
  ];

  const promotionPageOptions = [
    'Showroom Utrecht',
    'Showroom Amsterdam',
    'Showroom Rotterdam',
    'Showroom Den Haag',
  ];

  // Expands selected sites into individual siteviews (sawiday_be → NL + FR split)
  const siteviews = computed(() => {
    const result: { key: string; label: string }[] = [];
    for (const site of store.value.sites) {
      if (site === 'sawiday_be') {
        result.push({ key: 'sawiday_be_nl', label: 'sawiday.be (NL)' });
        result.push({ key: 'sawiday_be_fr', label: 'sawiday.be (FR)' });
      } else {
        const opt = siteOptions.find((o) => o.value === site);
        result.push({ key: site, label: opt?.label ?? site });
      }
    }
    return result;
  });

  // ── Image upload ───────────────────────────────────────────────────────────
  const heroInput = ref<HTMLInputElement | null>(null);
  const overviewInput = ref<HTMLInputElement | null>(null);
  const sfeerInputs: (HTMLInputElement | null)[] = [null, null, null, null];
  const draggingField = ref<string | null>(null);

  function applyImageFile(file: File | undefined, setter: (url: string) => void) {
    if (file?.type.startsWith('image/')) setter(URL.createObjectURL(file));
  }
</script>

<template>
  <EditPageLayout>
    <!-- ── Header ──────────────────────────────────────────────────────────── -->
    <EditPageHeader
      :title="store.name"
      :subtitle="`${store.street} ${store.houseNumber}, ${store.postalCode} ${store.city}`"
      :back="{ name: 'LocationsOverview', query: { tab: 'stores' } }"
    >
      <template #avatar><i class="pi pi-shop" /></template>
      <template #pills>
        <span class="status-pill status-pill--type">{{ store.abbreviation }}</span>
        <span
          class="status-pill"
          :class="store.active ? 'status-pill--active' : 'status-pill--inactive'"
        >
          {{ store.active ? 'Actief' : 'Inactief' }}
        </span>
      </template>
      <template #actions>
        <Button icon="pi pi-ellipsis-v" severity="secondary" text rounded />
      </template>
    </EditPageHeader>

    <!-- ── Tabs ─────────────────────────────────────────────────────────────── -->
    <EditPageTabs v-model="activeTab" :tabs="tabs" />

    <!-- ── Tab content ──────────────────────────────────────────────────────── -->
    <div class="tab-scroll">
      <!-- ── Algemene informatie ─────────────────────────────────────────── -->
      <template v-if="activeTab === 'algemeen'">
        <!-- Basisgegevens -->
        <div class="view-card">
          <div class="view-card-hdr">
            <span class="view-card-title">Basisgegevens</span>
            <template v-if="!isEditingGeneral">
              <Button
                label="Bewerken"
                icon="pi pi-pencil"
                size="small"
                severity="secondary"
                text
                @click="isEditingGeneral = true"
              />
            </template>
            <template v-else>
              <div class="flex gap-2">
                <Button
                  label="Annuleren"
                  size="small"
                  severity="secondary"
                  outlined
                  @click="isEditingGeneral = false"
                />
                <Button label="Opslaan" size="small" @click="isEditingGeneral = false" />
              </div>
            </template>
          </div>
          <Transition name="card-fade" mode="out-in">
            <div v-if="!isEditingGeneral" key="view" class="view-card-body">
              <div class="fr-row">
                <span class="fr-label">Naam</span>
                <span class="fr-value">{{ store.name }}</span>
              </div>
              <div class="fr-row">
                <span class="fr-label">Afkorting</span>
                <span class="fr-value">{{ store.abbreviation }}</span>
              </div>
              <div class="fr-row">
                <span class="fr-label">Slug</span>
                <span class="fr-value">{{ store.slug }}</span>
              </div>
              <div class="fr-row">
                <span class="fr-label">Hoofdwinkel</span>
                <span class="fr-value"
                  ><span
                    :class="
                      store.mainStore
                        ? 'status-badge status-badge--yes'
                        : 'status-badge status-badge--no'
                    "
                    >{{ store.mainStore ? 'Ja' : 'Nee' }}</span
                  ></span
                >
              </div>
              <div class="fr-row">
                <span class="fr-label">Actief</span>
                <span class="fr-value"
                  ><span
                    :class="
                      store.active
                        ? 'status-badge status-badge--yes'
                        : 'status-badge status-badge--no'
                    "
                    >{{ store.active ? 'Ja' : 'Nee' }}</span
                  ></span
                >
              </div>
              <div class="fr-row">
                <span class="fr-label">Outlet</span>
                <span class="fr-value"
                  ><span
                    :class="
                      store.outlet
                        ? 'status-badge status-badge--yes'
                        : 'status-badge status-badge--no'
                    "
                    >{{ store.outlet ? 'Ja' : 'Nee' }}</span
                  ></span
                >
              </div>
              <div class="fr-row">
                <span class="fr-label">Binnenkort open</span>
                <span class="fr-value"
                  ><span
                    :class="
                      store.openingSoon
                        ? 'status-badge status-badge--yes'
                        : 'status-badge status-badge--no'
                    "
                    >{{ store.openingSoon ? 'Ja' : 'Nee' }}</span
                  ></span
                >
              </div>
              <div class="fr-row">
                <span class="fr-label">Pickup locatie</span>
                <span :class="store.pickupLocation ? 'fr-value' : 'fr-empty'">{{
                  store.pickupLocation || '—'
                }}</span>
              </div>
              <div class="fr-row">
                <span class="fr-label">Sites</span>
                <div class="flex flex-wrap gap-1">
                  <span v-for="s in store.sites" :key="s" class="site-tag">
                    {{ siteOptions.find((o) => o.value === s)?.label ?? s }}
                  </span>
                  <span v-if="!store.sites.length" class="fr-empty">—</span>
                </div>
              </div>
            </div>
            <div v-else key="edit" class="view-card-body">
              <div class="fr-row">
                <label class="fr-label">Naam <span class="fr-req">*</span></label>
                <InputText v-model="store.name" class="w-full" placeholder="Naam winkel" />
              </div>
              <div class="fr-row">
                <label class="fr-label">Afkorting <span class="fr-req">*</span></label>
                <div class="flex gap-2">
                  <InputText
                    v-model="store.abbreviation"
                    placeholder="UTR"
                    style="max-width: 7rem"
                  />
                  <InputText v-model="store.slug" class="flex-1" placeholder="showroom_utr" />
                </div>
              </div>
              <div class="fr-row fr-row--top">
                <label class="fr-label" style="padding-top: 0.5rem">Opties</label>
                <div class="options-grid">
                  <div class="option-item">
                    <ToggleSwitch v-model="store.mainStore" inputId="edit-opt-main" />
                    <label for="edit-opt-main">Hoofdwinkel</label>
                  </div>
                  <div class="option-item">
                    <ToggleSwitch v-model="store.active" inputId="edit-opt-active" />
                    <label for="edit-opt-active">Actief</label>
                  </div>
                  <div class="option-item">
                    <ToggleSwitch v-model="store.outlet" inputId="edit-opt-outlet" />
                    <label for="edit-opt-outlet">Outlet</label>
                  </div>
                  <div class="option-item">
                    <ToggleSwitch v-model="store.openingSoon" inputId="edit-opt-soon" />
                    <label for="edit-opt-soon">Binnenkort open</label>
                  </div>
                </div>
              </div>
              <div class="fr-row">
                <label class="fr-label">Pickup locatie</label>
                <Select
                  v-model="store.pickupLocation"
                  :options="pickupOptions"
                  class="w-full"
                  show-clear
                  placeholder="Selecteer locatie"
                />
              </div>
              <div class="fr-row">
                <label class="fr-label">Sites <span class="fr-req">*</span></label>
                <MultiSelect
                  v-model="store.sites"
                  :options="siteOptions"
                  option-label="label"
                  option-value="value"
                  class="w-full"
                  placeholder="Selecteer sites"
                />
              </div>
            </div>
          </Transition>
        </div>

        <!-- Adres -->
        <div class="view-card">
          <div class="view-card-hdr">
            <span class="view-card-title">Adres</span>
            <template v-if="!isEditingAddress">
              <Button
                label="Bewerken"
                icon="pi pi-pencil"
                size="small"
                severity="secondary"
                text
                @click="isEditingAddress = true"
              />
            </template>
            <template v-else>
              <div class="flex gap-2">
                <Button
                  label="Annuleren"
                  size="small"
                  severity="secondary"
                  outlined
                  @click="isEditingAddress = false"
                />
                <Button label="Opslaan" size="small" @click="isEditingAddress = false" />
              </div>
            </template>
          </div>
          <Transition name="card-fade" mode="out-in">
            <div v-if="!isEditingAddress" key="view" class="view-card-body">
              <div class="fr-row">
                <span class="fr-label">Land</span>
                <span class="fr-value"
                  ><span class="site-tag">{{ store.country }}</span></span
                >
              </div>
              <div class="fr-row">
                <span class="fr-label">Adres</span>
                <span class="fr-value">
                  {{ store.street }} {{ store.houseNumber
                  }}{{ store.addition ? ' ' + store.addition : '' }}, {{ store.postalCode }}
                  {{ store.city }}
                </span>
              </div>
              <div class="fr-row">
                <span class="fr-label">Opmerking</span>
                <span :class="store.addressNote ? 'fr-value' : 'fr-empty'">{{
                  store.addressNote || '—'
                }}</span>
              </div>
            </div>
            <div v-else key="edit" class="view-card-body">
              <div class="fr-row">
                <label class="fr-label">Land <span class="fr-req">*</span></label>
                <Select
                  v-model="store.country"
                  :options="countryOptions"
                  option-label="label"
                  option-value="value"
                  class="w-full"
                />
              </div>
              <div class="fr-row fr-row--top">
                <label class="fr-label">Adres <span class="fr-req">*</span></label>
                <AddressFields
                  v-model:postalCode="store.postalCode"
                  v-model:houseNumber="store.houseNumber"
                  v-model:addition="store.addition"
                  v-model:street="store.street"
                  v-model:city="store.city"
                />
              </div>
              <div class="fr-row">
                <label class="fr-label">Opmerking</label>
                <InputText
                  v-model="store.addressNote"
                  class="w-full"
                  placeholder="Bijv. 2e verdieping"
                />
              </div>
            </div>
          </Transition>
        </div>

        <!-- Contact -->
        <div class="view-card">
          <div class="view-card-hdr">
            <span class="view-card-title">Contact</span>
            <template v-if="!isEditingContact">
              <Button
                label="Bewerken"
                icon="pi pi-pencil"
                size="small"
                severity="secondary"
                text
                @click="isEditingContact = true"
              />
            </template>
            <template v-else>
              <div class="flex gap-2">
                <Button
                  label="Annuleren"
                  size="small"
                  severity="secondary"
                  outlined
                  @click="isEditingContact = false"
                />
                <Button label="Opslaan" size="small" @click="isEditingContact = false" />
              </div>
            </template>
          </div>
          <Transition name="card-fade" mode="out-in">
            <div v-if="!isEditingContact" key="view" class="view-card-body">
              <div class="fr-row">
                <span class="fr-label">Telefoonnummer</span>
                <span :class="store.phoneNumber ? 'fr-value' : 'fr-empty'">
                  {{
                    store.phoneNumber
                      ? `+${store.phoneCountry === 'NL' ? '31' : store.phoneCountry === 'BE' ? '32' : '33'} ${store.phoneNumber}`
                      : '—'
                  }}
                </span>
              </div>
              <div class="fr-row">
                <span class="fr-label">E-mail</span>
                <span :class="store.email ? 'fr-value' : 'fr-empty'">{{ store.email || '—' }}</span>
              </div>
            </div>
            <div v-else key="edit" class="view-card-body">
              <div class="fr-row">
                <label class="fr-label">Telefoonnummer</label>
                <PhoneField
                  v-model:country="store.phoneCountry"
                  v-model:number="store.phoneNumber"
                />
              </div>
              <div class="fr-row">
                <label class="fr-label">E-mail</label>
                <InputText
                  v-model="store.email"
                  class="w-full"
                  placeholder="winkel@sanitairwinkel.nl"
                />
              </div>
            </div>
          </Transition>
        </div>

        <!-- Overig -->
        <div class="view-card">
          <div class="view-card-hdr">
            <span class="view-card-title">Overig</span>
            <template v-if="!isEditingMisc">
              <Button
                label="Bewerken"
                icon="pi pi-pencil"
                size="small"
                severity="secondary"
                text
                @click="isEditingMisc = true"
              />
            </template>
            <template v-else>
              <div class="flex gap-2">
                <Button
                  label="Annuleren"
                  size="small"
                  severity="secondary"
                  outlined
                  @click="isEditingMisc = false"
                />
                <Button label="Opslaan" size="small" @click="isEditingMisc = false" />
              </div>
            </template>
          </div>
          <Transition name="card-fade" mode="out-in">
            <div v-if="!isEditingMisc" key="view" class="view-card-body">
              <div class="fr-row">
                <span class="fr-label">Coördinaten</span>
                <span :class="store.latitude ? 'fr-value' : 'fr-empty'">
                  {{
                    store.latitude && store.longitude
                      ? `${store.latitude}, ${store.longitude}`
                      : '—'
                  }}
                </span>
              </div>
              <div class="fr-row">
                <span class="fr-label">Promotiepagina</span>
                <span :class="store.promotionPage ? 'fr-value' : 'fr-empty'">{{
                  store.promotionPage || '—'
                }}</span>
              </div>
              <div class="fr-row">
                <span class="fr-label">Google code</span>
                <span :class="store.googleCode ? 'fr-value' : 'fr-empty'">{{
                  store.googleCode || '—'
                }}</span>
              </div>
            </div>
            <div v-else key="edit" class="view-card-body">
              <div class="fr-row">
                <label class="fr-label">Coördinaten</label>
                <div class="flex gap-2">
                  <InputText v-model="store.latitude" placeholder="52.091" style="flex: 1" />
                  <InputText v-model="store.longitude" placeholder="5.122" style="flex: 1" />
                </div>
              </div>
              <div class="fr-row">
                <label class="fr-label">Promotiepagina</label>
                <Select
                  v-model="store.promotionPage"
                  :options="promotionPageOptions"
                  class="w-full"
                  show-clear
                  placeholder="Selecteer pagina"
                />
              </div>
              <div class="fr-row">
                <label class="fr-label">Google code</label>
                <InputText v-model="store.googleCode" placeholder="17" style="max-width: 8rem" />
              </div>
            </div>
          </Transition>
        </div>
      </template>

      <!-- ── Openingstijden ──────────────────────────────────────────────── -->
      <template v-else-if="activeTab === 'openingstijden'">
        <div class="view-card">
          <div class="view-card-hdr">
            <span class="view-card-title">Openingstijden</span>
            <template v-if="!isEditingHours">
              <Button
                label="Bewerken"
                icon="pi pi-pencil"
                size="small"
                severity="secondary"
                text
                @click="isEditingHours = true"
              />
            </template>
            <template v-else>
              <div class="flex gap-2">
                <Button
                  label="Annuleren"
                  size="small"
                  severity="secondary"
                  outlined
                  @click="isEditingHours = false"
                />
                <Button label="Opslaan" size="small" @click="isEditingHours = false" />
              </div>
            </template>
          </div>
          <Transition name="card-fade" mode="out-in">
            <div v-if="!isEditingHours" key="view" class="view-card-body">
              <div v-for="row in openingHours" :key="row.day" class="fr-row">
                <span class="fr-label">{{ row.day }}</span>
                <span v-if="row.closed" class="fr-empty">Gesloten</span>
                <span v-else class="fr-value">{{ row.from }} – {{ row.to }}</span>
              </div>
            </div>
            <div v-else key="edit" class="view-card-body">
              <div v-for="row in openingHours" :key="row.day" class="fr-row">
                <span class="fr-label">{{ row.day }}</span>
                <div class="flex items-center gap-3">
                  <div class="flex items-center gap-2">
                    <Checkbox v-model="row.closed" binary :input-id="`closed-${row.day}`" />
                    <label
                      :for="`closed-${row.day}`"
                      class="text-sm text-surface-500 cursor-pointer"
                      >Gesloten</label
                    >
                  </div>
                  <template v-if="!row.closed">
                    <InputText v-model="row.from" style="width: 5.5rem" placeholder="09:00" />
                    <span class="text-surface-400 text-sm">–</span>
                    <InputText v-model="row.to" style="width: 5.5rem" placeholder="17:30" />
                  </template>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Uitzonderingen -->
        <div class="view-card">
          <div class="view-card-hdr">
            <span class="view-card-title">Uitzonderingen</span>
            <template v-if="!isEditingExceptions">
              <Button
                label="Bewerken"
                icon="pi pi-pencil"
                size="small"
                severity="secondary"
                text
                @click="isEditingExceptions = true"
              />
            </template>
            <template v-else>
              <div class="flex gap-2">
                <Button
                  label="Annuleren"
                  size="small"
                  severity="secondary"
                  outlined
                  @click="isEditingExceptions = false"
                />
                <Button label="Opslaan" size="small" @click="isEditingExceptions = false" />
              </div>
            </template>
          </div>
          <Transition name="card-fade" mode="out-in">
            <div v-if="!isEditingExceptions" key="view" class="view-card-body">
              <div v-if="!exceptions.length" class="fr-empty" style="padding: 0.25rem 0">
                Geen uitzonderingen ingesteld
              </div>
              <div v-for="ex in exceptions" :key="ex.id" class="exception-card">
                <div class="exception-header">
                  <span class="exception-date">{{ formatDate(ex.date) }}</span>
                  <span v-if="ex.closed" class="status-badge status-badge--no">Gesloten</span>
                  <span v-else class="fr-value text-sm">{{ ex.from }} – {{ ex.to }}</span>
                </div>
                <div class="exception-reasons">
                  <div class="exception-reasons-header">Reden per siteview</div>
                  <div v-for="sv in siteviews" :key="sv.key" class="exception-reason-row">
                    <span class="exception-reason-site">{{ sv.label }}</span>
                    <span :class="ex.reason[sv.key] ? 'fr-value text-sm' : 'fr-empty text-sm'">{{
                      ex.reason[sv.key] || '—'
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else key="edit" class="view-card-body">
              <div v-if="!exceptions.length" class="fr-empty" style="padding: 0.25rem 0">
                Geen uitzonderingen
              </div>
              <div v-for="ex in exceptions" :key="ex.id" class="exception-card">
                <div class="exception-header">
                  <DatePicker
                    v-model="ex.date"
                    date-format="dd-mm-yy"
                    placeholder="dd-mm-jj"
                    style="width: 9rem"
                  />
                  <div class="flex items-center gap-2">
                    <Checkbox v-model="ex.closed" binary :input-id="`ex-closed-${ex.id}`" />
                    <label
                      :for="`ex-closed-${ex.id}`"
                      class="text-sm text-surface-600 cursor-pointer"
                      >Gesloten</label
                    >
                  </div>
                  <template v-if="!ex.closed">
                    <InputText v-model="ex.from" class="exception-time" placeholder="09:00" />
                    <span class="text-surface-400 text-sm">–</span>
                    <InputText v-model="ex.to" class="exception-time" placeholder="17:30" />
                  </template>
                  <Button
                    icon="pi pi-trash"
                    severity="danger"
                    text
                    size="small"
                    rounded
                    style="margin-left: auto"
                    @click="removeException(ex.id)"
                  />
                </div>
                <div class="exception-reasons">
                  <div class="exception-reasons-header">Reden per siteview</div>
                  <div v-for="sv in siteviews" :key="sv.key" class="exception-reason-row">
                    <span class="exception-reason-site">{{ sv.label }}</span>
                    <InputText
                      v-model="ex.reason[sv.key]"
                      class="flex-1"
                      placeholder="Bijv. 1e Paasdag"
                    />
                  </div>
                </div>
              </div>
              <div style="padding-top: 0.5rem">
                <Button
                  label="Nieuwe uitzondering toevoegen"
                  icon="pi pi-plus"
                  size="small"
                  severity="secondary"
                  outlined
                  @click="addException"
                />
              </div>
            </div>
          </Transition>
        </div>
      </template>

      <!-- ── Content website ─────────────────────────────────────────────── -->
      <template v-else-if="activeTab === 'content'">
        <!-- Media -->
        <div class="view-card">
          <div class="view-card-hdr">
            <span class="view-card-title">Afbeeldingen & media</span>
            <template v-if="!isEditingContent">
              <Button
                label="Bewerken"
                icon="pi pi-pencil"
                size="small"
                severity="secondary"
                text
                @click="isEditingContent = true"
              />
            </template>
            <template v-else>
              <div class="flex gap-2">
                <Button
                  label="Annuleren"
                  size="small"
                  severity="secondary"
                  outlined
                  @click="isEditingContent = false"
                />
                <Button label="Opslaan" size="small" @click="isEditingContent = false" />
              </div>
            </template>
          </div>
          <Transition name="card-fade" mode="out-in">
            <div v-if="!isEditingContent" key="view" class="view-card-body">
              <div class="fr-row fr-row--top">
                <span class="fr-label">Hero afbeelding</span>
                <img :src="store.heroImage" class="content-img" alt="Hero" />
              </div>
              <div class="fr-row fr-row--top">
                <span class="fr-label">Overzicht afbeelding</span>
                <img :src="store.overviewImage" class="content-img" alt="Overzicht" />
              </div>
              <div v-for="(img, i) in store.atmosphereImages" :key="i" class="fr-row fr-row--top">
                <span class="fr-label">Sfeerimpressie {{ i + 1 }}</span>
                <img v-if="img" :src="img" class="content-img" :alt="`Sfeerimpressie ${i + 1}`" />
                <span v-else class="fr-empty">Geen afbeelding</span>
              </div>
              <div class="fr-row">
                <span class="fr-label">Google 360 Tour</span>
                <span :class="store.google360Tour ? 'fr-value' : 'fr-empty'">{{
                  store.google360Tour || '—'
                }}</span>
              </div>
              <div class="fr-row">
                <span class="fr-label">YouTube video</span>
                <span :class="store.youtubeVideo ? 'fr-value' : 'fr-empty'">{{
                  store.youtubeVideo || '—'
                }}</span>
              </div>
            </div>
            <div v-else key="edit" class="view-card-body">
              <!-- Hero afbeelding -->
              <div class="fr-row fr-row--top">
                <label class="fr-label">Hero afbeelding</label>
                <div class="img-upload-field">
                  <div
                    v-if="!store.heroImage"
                    class="img-drop-zone"
                    :class="{ 'img-drop-zone--over': draggingField === 'hero' }"
                    @click="heroInput?.click()"
                    @dragover.prevent="draggingField = 'hero'"
                    @dragleave="draggingField = null"
                    @drop.prevent="
                      (e: DragEvent) => {
                        draggingField = null;
                        applyImageFile(
                          e.dataTransfer?.files?.[0],
                          (url) => (store.heroImage = url)
                        );
                      }
                    "
                  >
                    <i class="pi pi-image" style="font-size: 1.75rem" />
                    <span>Sleep een afbeelding hierheen</span>
                    <button class="img-select-btn" @click.stop="heroInput?.click()">
                      of selecteer een bestand
                    </button>
                  </div>
                  <div v-else class="img-file-row">
                    <img :src="store.heroImage" class="img-file-thumb" alt="Hero" />
                    <div class="flex flex-col gap-1">
                      <span class="text-sm font-medium text-surface-700">Hero afbeelding</span>
                      <button class="img-select-btn" @click="heroInput?.click()">Vervangen</button>
                    </div>
                    <button
                      class="img-remove-btn"
                      style="margin-left: auto"
                      @click="store.heroImage = ''"
                    >
                      <i class="pi pi-times" />
                    </button>
                  </div>
                  <input
                    ref="heroInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="
                      (e: Event) =>
                        applyImageFile(
                          (e.target as HTMLInputElement).files?.[0],
                          (url) => (store.heroImage = url)
                        )
                    "
                  />
                </div>
              </div>
              <!-- Overzicht afbeelding -->
              <div class="fr-row fr-row--top">
                <label class="fr-label">Overzicht afbeelding</label>
                <div class="img-upload-field">
                  <div
                    v-if="!store.overviewImage"
                    class="img-drop-zone"
                    :class="{ 'img-drop-zone--over': draggingField === 'overview' }"
                    @click="overviewInput?.click()"
                    @dragover.prevent="draggingField = 'overview'"
                    @dragleave="draggingField = null"
                    @drop.prevent="
                      (e: DragEvent) => {
                        draggingField = null;
                        applyImageFile(
                          e.dataTransfer?.files?.[0],
                          (url) => (store.overviewImage = url)
                        );
                      }
                    "
                  >
                    <i class="pi pi-image" style="font-size: 1.75rem" />
                    <span>Sleep een afbeelding hierheen</span>
                    <button class="img-select-btn" @click.stop="overviewInput?.click()">
                      of selecteer een bestand
                    </button>
                  </div>
                  <div v-else class="img-file-row">
                    <img :src="store.overviewImage" class="img-file-thumb" alt="Overzicht" />
                    <div class="flex flex-col gap-1">
                      <span class="text-sm font-medium text-surface-700">Overzicht afbeelding</span>
                      <button class="img-select-btn" @click="overviewInput?.click()">
                        Vervangen
                      </button>
                    </div>
                    <button
                      class="img-remove-btn"
                      style="margin-left: auto"
                      @click="store.overviewImage = ''"
                    >
                      <i class="pi pi-times" />
                    </button>
                  </div>
                  <input
                    ref="overviewInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="
                      (e: Event) =>
                        applyImageFile(
                          (e.target as HTMLInputElement).files?.[0],
                          (url) => (store.overviewImage = url)
                        )
                    "
                  />
                </div>
              </div>
              <!-- Atmosphere images -->
              <div v-for="(img, i) in store.atmosphereImages" :key="i" class="fr-row fr-row--top">
                <label class="fr-label">Sfeerimpressie {{ i + 1 }}</label>
                <div class="img-upload-field">
                  <div
                    v-if="!img"
                    class="img-drop-zone"
                    :class="{ 'img-drop-zone--over': draggingField === `atmosphere-${i}` }"
                    @click="sfeerInputs[i]?.click()"
                    @dragover.prevent="draggingField = `atmosphere-${i}`"
                    @dragleave="draggingField = null"
                    @drop.prevent="
                      (e: DragEvent) => {
                        draggingField = null;
                        applyImageFile(
                          e.dataTransfer?.files?.[0],
                          (url) => (store.atmosphereImages[i] = url)
                        );
                      }
                    "
                  >
                    <i class="pi pi-image" style="font-size: 1.75rem" />
                    <span>Sleep een afbeelding hierheen</span>
                    <button class="img-select-btn" @click.stop="sfeerInputs[i]?.click()">
                      of selecteer een bestand
                    </button>
                  </div>
                  <div v-else class="img-file-row">
                    <img :src="img" class="img-file-thumb" :alt="`Sfeerimpressie ${i + 1}`" />
                    <div class="flex flex-col gap-1">
                      <span class="text-sm font-medium text-surface-700"
                        >Sfeerimpressie {{ i + 1 }}</span
                      >
                      <button class="img-select-btn" @click="sfeerInputs[i]?.click()">
                        Vervangen
                      </button>
                    </div>
                    <button
                      class="img-remove-btn"
                      style="margin-left: auto"
                      @click="store.atmosphereImages[i] = ''"
                    >
                      <i class="pi pi-times" />
                    </button>
                  </div>
                  <input
                    :ref="
                      (el) => {
                        if (el) sfeerInputs[i] = el as HTMLInputElement;
                      }
                    "
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="
                      (e: Event) =>
                        applyImageFile(
                          (e.target as HTMLInputElement).files?.[0],
                          (url) => (store.atmosphereImages[i] = url)
                        )
                    "
                  />
                </div>
              </div>
              <!-- Google 360 Tour -->
              <div class="fr-row">
                <label class="fr-label">Google 360 Tour</label>
                <InputText
                  v-model="store.google360Tour"
                  class="w-full"
                  placeholder="Voer een code in"
                />
              </div>
              <!-- YouTube video -->
              <div class="fr-row">
                <label class="fr-label">YouTube video</label>
                <InputText
                  v-model="store.youtubeVideo"
                  class="w-full"
                  placeholder="https://youtu.be/..."
                />
              </div>
            </div>
          </Transition>
        </div>
      </template>
    </div>
  </EditPageLayout>
</template>

<style scoped>
  /* ── Options grid (shared with StoreAdd) ─────────────────────────────────── */
  .options-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem 2.5rem;
    padding: 0.25rem 0;
  }

  .option-item {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    font-size: 0.875rem;
    color: var(--p-surface-700);
  }

  .option-item label {
    cursor: pointer;
    user-select: none;
  }

  /* ── Exceptions ──────────────────────────────────────────────────────────── */
  .exception-card {
    border: 1px solid var(--p-surface-200);
    border-radius: 0.5rem;
    overflow: hidden;
    margin-bottom: 0.625rem;
  }
  .exception-card:last-of-type {
    margin-bottom: 0;
  }
  .exception-header {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    background: var(--p-surface-50);
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--p-surface-200);
  }
  .exception-date {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--p-surface-700);
    min-width: 6rem;
  }
  .exception-time {
    width: 5.5rem;
  }
  .exception-reasons {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 0;
  }
  .exception-reasons-header {
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--p-surface-400);
    padding: 0.4rem 0.75rem 0.25rem;
    border-bottom: 1px solid var(--p-surface-100);
  }
  .exception-reason-row {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--p-surface-100);
  }
  .exception-reason-row:last-child {
    border-bottom: none;
  }
  .exception-reason-site {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--p-surface-500);
    width: 8.5rem;
    flex-shrink: 0;
  }

  /* ── Content images ──────────────────────────────────────────────────────── */
  .content-img {
    width: 100%;
    max-width: 28rem;
    height: auto;
    border-radius: 0.5rem;
    border: 1px solid var(--p-gray-200);
    display: block;
  }

  /* ── Image upload (mirrors CSV upload from AddProductsDialog) ────────────── */
  .img-upload-field {
    flex: 1;
    max-width: 28rem;
  }
  .img-drop-zone {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.375rem;
    padding: 1.75rem 1.5rem;
    border: 2px dashed var(--p-gray-200);
    border-radius: 0.5rem;
    cursor: pointer;
    color: var(--p-gray-400);
    font-size: 0.875rem;
    text-align: center;
    transition:
      border-color 0.15s,
      background 0.15s;
  }
  .img-drop-zone:hover,
  .img-drop-zone--over {
    border-color: var(--p-primary-300);
    background: var(--p-primary-50);
  }
  .img-select-btn {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--p-primary-600);
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: color 0.1s;
  }
  .img-select-btn:hover {
    color: var(--p-primary-800);
    text-decoration: underline;
  }
  .img-file-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: var(--p-gray-50);
    border: 1px solid var(--p-gray-100);
    border-radius: 0.5rem;
  }
  .img-file-thumb {
    width: 4.5rem;
    height: 3rem;
    object-fit: cover;
    border-radius: 0.375rem;
    flex-shrink: 0;
    border: 1px solid var(--p-gray-200);
  }
  .img-remove-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.375rem;
    height: 1.375rem;
    border-radius: 0.25rem;
    background: none;
    border: none;
    color: var(--p-surface-400);
    cursor: pointer;
    font-size: 0.75rem;
    flex-shrink: 0;
    transition:
      background 0.1s,
      color 0.1s;
  }
  .img-remove-btn:hover {
    background: var(--p-red-50);
    color: var(--p-red-500);
  }
</style>
