<script setup lang="ts">
  import { ref } from 'vue';

  type ContractorMode = 'search' | 'manual' | null;

  const contractorMode = ref<ContractorMode>(null);
  const contractorFound = ref(false);
  const contractorSearchQuery = ref('');
  const mockContractorCustomer = { name: 'Bouwbedrijf De Vries', email: 'devries@bouw.nl' };

  const contractorCompany = ref('');
  const contractorCity = ref('');
  const contractorCompanyType = ref<string | null>(null);
  const companyTypeOptions = ['Aannemer', 'Installateur', 'Architect', 'Anders'];

  function deselectContractor() {
    contractorFound.value = false;
  }
</script>

<style scoped>
@reference "@/assets/style.css";
  .form-row {
    grid-template-columns: 160px 1fr;
    @apply grid gap-2;
  }
  .form-label {
    @apply text-(--p-gray-500) text-sm pt-1.5;
  }

  .mode-card {
    transition: border-color var(--sw-duration-base) var(--sw-ease), box-shadow var(--sw-duration-base) var(--sw-ease), background var(--sw-duration-base) var(--sw-ease);
    @apply flex items-center border-[1.5px] border-(--p-surface-200) rounded-[0.625rem] bg-(--p-surface-0) cursor-pointer text-left gap-3.5 p-4 px-5;
  }
  .mode-card--neutral:hover { @apply border-(--p-gray-400); }
  .mode-card--active-neutral {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--p-gray-500) 10%, transparent);
    @apply border-(--p-gray-400) bg-(--p-gray-50);
  }
  .mode-card__icon {
    @apply text-[0.95rem];
    transition: background var(--sw-duration-base) var(--sw-ease);
    @apply rounded-full flex items-center justify-center shrink-0 w-9 h-9;
  }
  .mode-card__icon--neutral { @apply bg-(--p-gray-100) text-(--p-gray-500); }
  .mode-card--active-neutral .mode-card__icon--neutral { @apply bg-(--p-gray-200) text-(--p-gray-600); }

  .customer-indicator {
    @apply flex items-center border-[1.5px] border-(--p-gray-300) rounded-[0.625rem] bg-(--p-gray-50) gap-3 py-3 px-4;
  }
  .customer-indicator__avatar {
    @apply rounded-full bg-(--p-gray-200) text-(--p-gray-600) flex items-center justify-center shrink-0 w-8 h-8 text-sm;
  }

  .fade-enter-active, .fade-leave-active { transition: opacity var(--sw-duration-slow) var(--sw-ease); }
  .fade-enter-from, .fade-leave-to { @apply opacity-0; }
</style>

<template>
  <div class="flex flex-col gap-3">
    <span class="text-sm font-medium text-gray-500">Heb je al een aannemer / installateur?</span>
    <div class="grid grid-cols-2 gap-3">
      <button
        class="mode-card mode-card--neutral"
        :class="{ 'mode-card--active-neutral': contractorMode === 'search' }"
        @click="contractorMode = contractorMode === 'search' ? null : 'search'"
      >
        <div class="mode-card__icon mode-card__icon--neutral"><i class="pi pi-search" /></div>
        <div class="flex flex-col text-left">
          <span class="font-semibold text-sm">Klant zoeken</span>
          <span class="text-xs text-gray-400 mt-0.5">Zoek op naam of e-mail</span>
        </div>
        <i
          v-if="contractorMode === 'search'"
          class="pi pi-check-circle ml-auto text-gray-400 shrink-0"
        />
      </button>
      <button
        class="mode-card mode-card--neutral"
        :class="{ 'mode-card--active-neutral': contractorMode === 'manual' }"
        @click="contractorMode = contractorMode === 'manual' ? null : 'manual'"
      >
        <div class="mode-card__icon mode-card__icon--neutral"><i class="pi pi-pencil" /></div>
        <div class="flex flex-col text-left">
          <span class="font-semibold text-sm">Handmatig invoeren</span>
          <span class="text-xs text-gray-400 mt-0.5">Vul de gegevens handmatig in</span>
        </div>
        <i
          v-if="contractorMode === 'manual'"
          class="pi pi-check-circle ml-auto text-gray-400 shrink-0"
        />
      </button>
    </div>
    <Transition name="fade-slide" mode="out-in">
      <div v-if="contractorMode === 'search'" key="contractor-search" class="flex flex-col gap-3">
        <div class="flex gap-2">
          <IconField class="flex-1">
            <InputText
              v-model="contractorSearchQuery"
              class="w-full"
              placeholder="Zoek op naam of e-mailadres"
            />
            <InputIcon class="pi pi-search" />
          </IconField>
          <Button label="Klant zoeken" icon="pi pi-search" class="btn-outlined" />
        </div>
        <Transition name="fade">
          <div v-if="contractorFound" class="customer-indicator">
            <div class="customer-indicator__avatar"><i class="pi pi-building" /></div>
            <div class="flex flex-col leading-snug">
              <span class="text-sm font-semibold">{{ mockContractorCustomer.name }}</span>
              <span class="text-xs text-gray-400">{{ mockContractorCustomer.email }}</span>
            </div>
            <Button
              icon="pi pi-times"
              variant="text"
              severity="secondary"
              size="small"
              rounded
              class="ml-auto shrink-0"
              @click="deselectContractor"
            />
          </div>
        </Transition>
      </div>
      <div v-else-if="contractorMode === 'manual'" key="contractor-manual" class="flex flex-col gap-4">
        <div class="form-row items-center">
          <span class="form-label">Naam bedrijf</span>
          <InputText
            v-model="contractorCompany"
            placeholder="Bouwbedrijf de Vries"
            class="flex-1"
          />
        </div>
        <div class="form-row items-center">
          <span class="form-label">Woonplaats</span>
          <InputText v-model="contractorCity" placeholder="Amsterdam" class="flex-1" />
        </div>
        <div class="form-row items-center">
          <span class="form-label">Type bedrijf</span>
          <Select
            v-model="contractorCompanyType"
            :options="companyTypeOptions"
            placeholder="Selecteer bedrijfstype"
            class="flex-1"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>
