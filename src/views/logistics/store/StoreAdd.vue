<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import AddressFields from '@/components/form/AddressFields.vue';
  import PhoneField from '@/components/form/PhoneField.vue';
  import AddPageLayout from '@/components/layout/AddPageLayout.vue';
  import AddPageHeader from '@/components/layout/AddPageHeader.vue';
  import AddPageNav from '@/components/layout/AddPageNav.vue';
  import AddPageSection from '@/components/layout/AddPageSection.vue';
  import { COUNTRY_CODE_OPTIONS, SITE_OPTIONS, PICKUP_LOCATION_OPTIONS, PROMOTION_PAGE_OPTIONS } from '@/mocks/options';

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
            <InputText v-model="form.abbreviation" placeholder="UTR" class="max-w-[7rem]" />
            <InputText v-model="form.slug" class="flex-1" placeholder="showroom_utr" />
          </div>
        </div>
        <div class="fr-row fr-row--top">
          <label class="fr-label pt-2">Opties</label>
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
            :options="PICKUP_LOCATION_OPTIONS"
            class="w-full"
            show-clear
            placeholder="Selecteer een locatie"
          />
        </div>
        <div class="fr-row">
          <label class="fr-label">Sites <span class="fr-req">*</span></label>
          <MultiSelect
            v-model="form.sites"
            :options="SITE_OPTIONS"
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
            :options="COUNTRY_CODE_OPTIONS"
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
            :options="PROMOTION_PAGE_OPTIONS"
            class="w-full"
            show-clear
            placeholder="Selecteer een optie"
          />
        </div>
        <div class="fr-row">
          <label class="fr-label">Google code <span class="fr-req">*</span></label>
          <InputText v-model="form.googleCode" placeholder="Google code" class="max-w-[12rem]" />
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
@reference "@/assets/style.css";
  .options-grid {
    @apply grid grid-cols-2 gap-y-3 gap-x-10 py-1;
  }

  .option-item {
    @apply flex items-center text-base text-(--sw-text) gap-2.5;
  }

  .option-item label {
    @apply cursor-pointer select-none;
  }
</style>
