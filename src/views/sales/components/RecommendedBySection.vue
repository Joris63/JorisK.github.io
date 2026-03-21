<script setup lang="ts">
  import { ref } from 'vue';

  type RecommendedByMode = 'search' | 'manual' | null;

  const mode = ref<RecommendedByMode>(null);
  const found = ref(false);
  const searchQuery = ref('');
  const mockCustomer = { name: 'Showroomworks BV', email: 'info@showroomworks.nl' };

  const company = ref('');
  const city = ref('');
  const companyType = ref<string | null>(null);
  const companyTypeOptions = ['Aannemer', 'Installateur', 'Architect', 'Anders'];

  function deselect() {
    found.value = false;
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
    <span class="text-sm font-medium text-gray-500">Ben je aanbevolen door iemand?</span>
    <div class="grid grid-cols-2 gap-3">
      <button
        class="mode-card mode-card--neutral"
        :class="{ 'mode-card--active-neutral': mode === 'search' }"
        @click="mode = mode === 'search' ? null : 'search'"
      >
        <div class="mode-card__icon mode-card__icon--neutral"><i class="pi pi-search" /></div>
        <div class="flex flex-col text-left">
          <span class="font-semibold text-sm">Bestaande klant zoeken</span>
          <span class="text-xs text-gray-400 mt-0.5">Zoek op e-mail</span>
        </div>
        <i v-if="mode === 'search'" class="pi pi-check-circle ml-auto text-gray-400 shrink-0" />
      </button>
      <button
        class="mode-card mode-card--neutral"
        :class="{ 'mode-card--active-neutral': mode === 'manual' }"
        @click="mode = mode === 'manual' ? null : 'manual'"
      >
        <div class="mode-card__icon mode-card__icon--neutral"><i class="pi pi-pencil" /></div>
        <div class="flex flex-col text-left">
          <span class="font-semibold text-sm">Handmatig invoeren</span>
          <span class="text-xs text-gray-400 mt-0.5">Vul de gegevens handmatig in</span>
        </div>
        <i v-if="mode === 'manual'" class="pi pi-check-circle ml-auto text-gray-400 shrink-0" />
      </button>
    </div>

    <Transition name="fade-slide" mode="out-in">
      <!-- Search mode -->
      <div v-if="mode === 'search'" key="search" class="flex flex-col gap-3">
        <div class="flex gap-2">
          <IconField class="flex-1">
            <InputText v-model="searchQuery" class="w-full" placeholder="Zoek op naam of e-mailadres" />
            <InputIcon class="pi pi-search" />
          </IconField>
          <Button label="Klant zoeken" icon="pi pi-user" class="btn-outlined" />
        </div>
        <Transition name="fade">
          <div v-if="found" class="customer-indicator">
            <div class="customer-indicator__avatar"><i class="pi pi-building" /></div>
            <div class="flex flex-col leading-snug">
              <span class="text-sm font-semibold">{{ mockCustomer.name }}</span>
              <span class="text-xs text-gray-400">{{ mockCustomer.email }}</span>
            </div>
            <Button
              icon="pi pi-times"
              variant="text"
              severity="secondary"
              size="small"
              rounded
              class="ml-auto shrink-0"
              @click="deselect"
            />
          </div>
        </Transition>
      </div>

      <!-- Manual mode -->
      <div v-else-if="mode === 'manual'" key="manual" class="flex flex-col gap-4">
        <div class="form-row items-center">
          <span class="form-label">Aanbevolen door</span>
          <InputText v-model="company" placeholder="Bouwbedrijf de Vries" class="flex-1" />
        </div>
        <div class="form-row items-center">
          <span class="form-label">Woonplaats</span>
          <InputText v-model="city" placeholder="Amsterdam" class="flex-1" />
        </div>
        <div class="form-row items-center">
          <span class="form-label">Type bedrijf</span>
          <Select
            v-model="companyType"
            :options="companyTypeOptions"
            placeholder="Selecteer bedrijfstype"
            class="flex-1"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>
