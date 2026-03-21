<script setup lang="ts">
import { ref } from 'vue';
import OrdersAdd_CustomerSearch from '../../sidebars/OrdersAdd_CustomerSearch.vue';

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

  <OrdersAdd_CustomerSearch v-model="recommendedSearchVisible" />
</template>

<style scoped>
@reference "@/assets/style.css";
.form-row {
  grid-template-columns: 220px 1fr;
  @apply grid gap-2;
}

.form-label {
  @apply text-(--p-gray-500) text-sm pt-1.5;
}

.mode-card {
  transition:
    border-color var(--sw-duration-base) var(--sw-ease),
    box-shadow var(--sw-duration-base) var(--sw-ease),
    background var(--sw-duration-base) var(--sw-ease);
  @apply flex items-center border-[1.5px] border-(--p-surface-200) rounded-[0.625rem] bg-(--p-surface-0) cursor-pointer text-left gap-3.5 p-4 px-5;
}

.mode-card--neutral:hover {
  @apply border-(--p-gray-400);
}

.mode-card--active-neutral {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--p-gray-500) 10%, transparent);
  @apply border-(--p-gray-400) bg-(--p-gray-50);
}

.mode-card__icon {
  font-size: 0.95rem;
  transition: background var(--sw-duration-base) var(--sw-ease);
  @apply rounded-full flex items-center justify-center shrink-0 w-9 h-9;
}

.mode-card__icon--neutral {
  @apply bg-(--p-gray-100) text-(--p-gray-500);
}

.mode-card--active-neutral .mode-card__icon--neutral {
  @apply bg-(--p-gray-200) text-(--p-gray-600);
}

.customer-indicator {
  @apply flex items-center border-[1.5px] border-(--p-gray-300) rounded-[0.625rem] bg-(--p-gray-50) gap-3 py-3 px-4;
}

.customer-indicator__avatar {
  @apply rounded-full bg-(--p-gray-200) text-(--p-gray-600) flex items-center justify-center shrink-0 w-8 h-8 text-sm;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--sw-duration-slow) var(--sw-ease);
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
}
</style>
