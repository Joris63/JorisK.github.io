<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import AddressFields from '@/components/form/AddressFields.vue';
  import PhoneField from '@/components/form/PhoneField.vue';
  import AddPageLayout from '@/components/layout/AddPageLayout.vue';
  import AddPageHeader from '@/components/layout/AddPageHeader.vue';
  import AddPageNav from '@/components/layout/AddPageNav.vue';
  import AddPageSection from '@/components/layout/AddPageSection.vue';

  const router = useRouter();

  const form = ref({
    name: '',
    abbreviation: '',
    slug: '',
    active: true,
    mainStore: false,
    outlet: false,
    openingSoon: false,
    pickupLocation: null as string | null,
    sites: [] as string[],
    country: 'NL',
    postalCode: '',
    houseNumber: '',
    addition: '',
    street: '',
    city: '',
    addressNote: '',
    phoneCountry: 'NL',
    phoneNumber: '',
    email: '',
    latitude: '',
    longitude: '',
    promotionPage: null as string | null,
    googleCode: '',
  });

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

  const navSections = [
    { id: 'basics', label: 'Basisgegevens', description: 'Naam, afkorting en opties' },
    { id: 'address', label: 'Adres', description: 'Vestigingsadres' },
    { id: 'contact', label: 'Contact', description: 'Telefoon en e-mail' },
    { id: 'other', label: 'Overig', description: 'Coördinaten en instellingen' },
  ];

  const back = { name: 'LocationsOverview', query: { tab: 'stores' } };

  function handleSave() {
    // TODO: API call
    router.push(back);
  }
</script>

<template>
  <AddPageLayout>
    <template #header>
      <AddPageHeader
        title="Nieuwe winkel"
        subtitle="Vul de gegevens in om een nieuwe winkel aan te maken"
        :back="back"
      >
        <template #icon><i class="pi pi-shop" /></template>
      </AddPageHeader>
    </template>

    <template #nav>
      <AddPageNav :sections="navSections" />
    </template>

    <div class="flex flex-col pt-2 pl-5 border-l border-gray-100">
      <!-- Basisgegevens -->
      <AddPageSection
        id="basics"
        title="Basisgegevens"
        description="Algemene informatie over de winkel"
        icon="pi-shop"
      >
        <div class="fr-row">
          <label class="fr-label">Naam <span class="fr-req">*</span></label>
          <InputText v-model="form.name" class="w-full" placeholder="Bijv. Utrecht" />
        </div>
        <div class="fr-row">
          <label class="fr-label">Afkorting <span class="fr-req">*</span></label>
          <div class="flex gap-2">
            <InputText v-model="form.abbreviation" placeholder="UTR" style="max-width: 7rem" />
            <InputText v-model="form.slug" class="flex-1" placeholder="showroom_utr" />
          </div>
        </div>
        <div class="fr-row fr-row--top">
          <label class="fr-label" style="padding-top: 0.5rem">Opties</label>
          <div class="options-grid">
            <div class="option-item">
              <ToggleSwitch v-model="form.mainStore" inputId="opt-main" />
              <label for="opt-main">Hoofdwinkel</label>
            </div>
            <div class="option-item">
              <ToggleSwitch v-model="form.active" inputId="opt-active" />
              <label for="opt-active">Actief</label>
            </div>
            <div class="option-item">
              <ToggleSwitch v-model="form.outlet" inputId="opt-outlet" />
              <label for="opt-outlet">Outlet</label>
            </div>
            <div class="option-item">
              <ToggleSwitch v-model="form.openingSoon" inputId="opt-soon" />
              <label for="opt-soon">Binnenkort open</label>
            </div>
          </div>
        </div>
        <div class="fr-row">
          <label class="fr-label">Pickup locatie</label>
          <Select
            v-model="form.pickupLocation"
            :options="pickupOptions"
            class="w-full"
            show-clear
            placeholder="Selecteer een locatie"
          />
        </div>
        <div class="fr-row">
          <label class="fr-label">Sites <span class="fr-req">*</span></label>
          <MultiSelect
            v-model="form.sites"
            :options="siteOptions"
            option-label="label"
            option-value="value"
            class="w-full"
            placeholder="Kies 1 of meerdere sites"
          />
        </div>
      </AddPageSection>

      <!-- Adres -->
      <AddPageSection
        id="address"
        title="Adres"
        description="Vestigingsadres van de winkel"
        icon="pi-map-marker"
      >
        <div class="fr-row">
          <label class="fr-label">Land <span class="fr-req">*</span></label>
          <Select
            v-model="form.country"
            :options="countryOptions"
            option-label="label"
            option-value="value"
            class="w-full"
          />
        </div>
        <div class="fr-row fr-row--top">
          <label class="fr-label">Adres <span class="fr-req">*</span></label>
          <AddressFields
            v-model:postalCode="form.postalCode"
            v-model:houseNumber="form.houseNumber"
            v-model:addition="form.addition"
            v-model:street="form.street"
            v-model:city="form.city"
          />
        </div>
        <div class="fr-row">
          <label class="fr-label">Opmerking</label>
          <InputText v-model="form.addressNote" class="w-full" placeholder="Bijv. 2e verdieping" />
        </div>
      </AddPageSection>

      <!-- Contact -->
      <AddPageSection
        id="contact"
        title="Contact"
        description="Contactgegevens van de winkel"
        icon="pi-phone"
      >
        <div class="fr-row">
          <label class="fr-label">Telefoonnummer <span class="fr-req">*</span></label>
          <PhoneField v-model:country="form.phoneCountry" v-model:number="form.phoneNumber" />
        </div>
        <div class="fr-row">
          <label class="fr-label">E-mail <span class="fr-req">*</span></label>
          <InputText
            v-model="form.email"
            class="w-full"
            placeholder="winkel@voorbeeld.nl"
            type="email"
          />
        </div>
      </AddPageSection>

      <!-- Overig -->
      <AddPageSection
        id="other"
        title="Overig"
        description="Locatie en websiteinstellingen"
        icon="pi-cog"
      >
        <div class="fr-row">
          <label class="fr-label">Coördinaten <span class="fr-req">*</span></label>
          <div class="flex gap-2">
            <InputText v-model="form.latitude" class="flex-1" placeholder="Breedtegraad" />
            <InputText v-model="form.longitude" class="flex-1" placeholder="Lengtegraad" />
          </div>
        </div>
        <div class="fr-row">
          <label class="fr-label">Promotiepagina</label>
          <Select
            v-model="form.promotionPage"
            :options="promotionPageOptions"
            class="w-full"
            show-clear
            placeholder="Selecteer een optie"
          />
        </div>
        <div class="fr-row">
          <label class="fr-label">Google code <span class="fr-req">*</span></label>
          <InputText v-model="form.googleCode" placeholder="Google code" style="max-width: 12rem" />
        </div>
      </AddPageSection>
    </div>

    <template #footer>
      <Button label="Annuleren" severity="secondary" outlined @click="router.push(back)" />
      <Button label="Opslaan" icon="pi pi-check" @click="handleSave" />
    </template>
  </AddPageLayout>
</template>

<style scoped>
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
</style>
