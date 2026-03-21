<script setup lang="ts">
import { ref } from 'vue';
import OrdersAdd_CustomerSearch from '../../sidebars/OrdersAdd_CustomerSearch.vue';
import OrdersAdd_AppointmentSearch from '../../sidebars/OrdersAdd_AppointmentSearch.vue';

type CustomerMode = 'search' | 'new' | null;

const customerMode = defineModel<CustomerMode>('customerMode', { default: 'search' });

const customerSearchVisible = ref(false);
const appointmentSearchVisible = ref(false);

const searchQuery = ref('');
const customerFound = ref(true);
const mockFoundCustomer = { name: 'Joris Kamminga', email: 'joris@showroomworks.nl' };

function deselectCustomer() {
  customerFound.value = false;
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
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="grid grid-cols-2 gap-3">
      <button
        class="mode-card"
        :class="{ 'mode-card--active': customerMode === 'search' }"
        @click="customerMode = 'search'"
      >
        <div class="mode-card__icon"><i class="pi pi-search" /></div>
        <div class="flex flex-col text-left">
          <span class="font-semibold text-sm">Bestaande klant of afspraak</span>
          <span class="text-xs text-gray-400 mt-0.5">Zoek op e-mail</span>
        </div>
        <i
          v-if="customerMode === 'search'"
          class="pi pi-check-circle ml-auto text-primary shrink-0"
        />
      </button>
      <button
        class="mode-card"
        :class="{ 'mode-card--active': customerMode === 'new' }"
        @click="customerMode = 'new'"
      >
        <div class="mode-card__icon"><i class="pi pi-user-plus" /></div>
        <div class="flex flex-col text-left">
          <span class="font-semibold text-sm">Nieuwe klant aanmaken</span>
          <span class="text-xs text-gray-400 mt-0.5">Vul de klantgegevens handmatig in</span>
        </div>
        <i v-if="customerMode === 'new'" class="pi pi-check-circle ml-auto text-primary shrink-0" />
      </button>
    </div>

    <Transition name="fade">
      <div v-if="customerMode === 'search' && customerFound" class="customer-indicator">
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
      <div v-if="customerMode === 'search'" key="search" class="flex gap-2">
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

      <div v-else-if="customerMode === 'new'" key="new" class="flex flex-col gap-4">
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

  <OrdersAdd_CustomerSearch v-model="customerSearchVisible" />
  <OrdersAdd_AppointmentSearch v-model="appointmentSearchVisible" />
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

.mode-card:hover {
  border-color: var(--p-primary-300);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.mode-card--active {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--p-primary-500) 12%, transparent);
  @apply border-[var(--p-primary-500)] bg-[var(--p-primary-50)];
}

.mode-card__icon {
  font-size: 0.95rem;
  transition: background var(--sw-duration-base) var(--sw-ease);
  @apply rounded-full bg-[var(--p-primary-100)] text-[var(--p-primary-600)] flex items-center justify-center shrink-0 w-9 h-9;
}

.mode-card--active .mode-card__icon {
  @apply bg-[var(--p-primary-200)];
}

.customer-indicator {
  @apply flex items-center border-[1.5px] border-[var(--p-primary-300)] rounded-[0.625rem] bg-[var(--p-primary-50)] gap-3 py-3 px-4;
}

.customer-indicator__avatar {
  @apply rounded-full bg-[var(--p-primary-200)] text-[var(--p-primary-700)] flex items-center justify-center shrink-0 w-8 h-8 text-sm;
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
