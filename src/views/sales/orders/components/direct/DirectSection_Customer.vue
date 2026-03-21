<script setup lang="ts">
  const mode = defineModel<'search' | 'new' | null>('mode');
  const customerFound = defineModel<boolean>('customerFound');
  const searchQuery = defineModel<string>('searchQuery');
  const customerSearchVisible = defineModel<boolean>('customerSearchVisible');

  const props = defineProps<{
    mockFoundCustomer: { name: string; email: string };
  }>();

  const firstName = defineModel<string>('firstName');
  const lastName = defineModel<string>('lastName');
  const email = defineModel<string>('email');
  const phone = defineModel<string>('phone');
  const phoneAlt = defineModel<string>('phoneAlt');
  const country = defineModel<string>('country');
  const postalCode = defineModel<string>('postalCode');
  const houseNumber = defineModel<string>('houseNumber');
  const addition = defineModel<string>('addition');
  const street = defineModel<string>('street');
  const city = defineModel<string>('city');
  const newsletter = defineModel<boolean>('newsletter');

  const customerTypeOptions = ['Particulier', 'Zakelijk'];
  const customerType = defineModel<string>('customerType');
</script>

<template>
  <section id="gegevens" class="add-section">
    <div class="add-section-hdr">
      <i class="pi pi-user add-section-icon" />
      <div>
        <div class="add-section-title">Je gegevens</div>
        <div class="add-section-desc">Optioneel</div>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <!-- Mode cards -->
      <div class="grid grid-cols-2 gap-3">
        <button
          class="mode-card"
          :class="{ 'mode-card--active': mode === 'search' }"
          @click="mode = 'search'"
        >
          <div class="mode-card__icon"><i class="pi pi-search" /></div>
          <div class="flex flex-col text-left">
            <span class="font-semibold text-sm">Bestaande klant</span>
            <span class="text-xs text-gray-400 mt-0.5">Zoek op naam of e-mail</span>
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
            <span class="font-semibold text-sm">Nieuwe klant</span>
            <span class="text-xs text-gray-400 mt-0.5">Vul gegevens handmatig in</span>
          </div>
          <i v-if="mode === 'new'" class="pi pi-check-circle ml-auto text-primary shrink-0" />
        </button>
      </div>

      <Transition name="fade-slide" mode="out-in">
        <!-- Search mode -->
        <div v-if="mode === 'search'" key="search" class="flex flex-col gap-4">
          <Transition name="fade">
            <div v-if="customerFound" class="customer-indicator">
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
                @click="customerFound = false"
              />
            </div>
          </Transition>
          <div class="flex gap-2">
            <IconField class="flex-1">
              <InputText v-model="searchQuery" class="w-full" placeholder="naam@voorbeeld.nl" />
              <InputIcon class="pi pi-search" />
            </IconField>
            <Button
              label="Klant zoeken"
              icon="pi pi-user"
              class="btn-outlined"
              @click="customerSearchVisible = true"
            />
          </div>
        </div>

        <!-- New customer mode -->
        <div v-else-if="mode === 'new'" key="new" class="flex flex-col gap-4">
          <div class="form-row items-center">
            <span class="form-label">Klanttype</span>
            <SelectButton v-model="customerType" :options="customerTypeOptions" />
          </div>
          <div class="form-row items-center">
            <span class="form-label">Naam</span>
            <div class="flex gap-2 flex-1">
              <InputText v-model="firstName" placeholder="Voornaam" class="flex-1" />
              <InputText v-model="lastName" placeholder="Achternaam" class="flex-1" />
            </div>
          </div>
          <div class="form-row items-center">
            <span class="form-label">E-mail</span>
            <InputText v-model="email" placeholder="naam@voorbeeld.nl" type="email" class="flex-1" />
          </div>
          <div class="form-row items-center">
            <span class="form-label">Telefoonnummer</span>
            <div class="flex gap-2 flex-1">
              <div class="flex gap-1 flex-1">
                <Select
                  :options="[{ label: '+31', value: 'NL' }]"
                  option-label="label"
                  option-value="value"
                  class="w-28"
                  :model-value="'NL'"
                >
                  <template #value="{ value }">
                    <div class="flex items-center gap-2">
                      <span :class="`fi fi-${value.toLowerCase()}`" /><span>+31</span>
                    </div>
                  </template>
                </Select>
                <InputText v-model="phone" placeholder="6 12345678" class="flex-1" />
              </div>
              <div class="flex gap-1 flex-1">
                <Select
                  :options="[{ label: '+31', value: 'NL' }]"
                  option-label="label"
                  option-value="value"
                  class="w-28"
                  :model-value="'NL'"
                >
                  <template #value="{ value }">
                    <div class="flex items-center gap-2">
                      <span :class="`fi fi-${value.toLowerCase()}`" /><span>+31</span>
                    </div>
                  </template>
                </Select>
                <InputText v-model="phoneAlt" placeholder="Alternatief" class="flex-1" />
              </div>
            </div>
          </div>
          <div class="form-row items-center">
            <span class="form-label">Land</span>
            <Select
              v-model="country"
              :options="['Nederland', 'België', 'Duitsland', 'Frankrijk']"
              class="flex-1"
            />
          </div>
          <div class="form-row items-start">
            <span class="form-label pt-1.5">Adres</span>
            <div class="flex flex-col gap-2 flex-1">
              <div class="grid grid-cols-3 gap-2">
                <InputText v-model="postalCode" placeholder="1234 AB" />
                <InputText v-model="houseNumber" placeholder="12" />
                <InputText v-model="addition" placeholder="A" />
              </div>
              <div class="grid grid-cols-2 gap-2">
                <InputText v-model="street" placeholder="Straatnaam" />
                <InputText v-model="city" placeholder="Stad" />
              </div>
            </div>
          </div>
          <div class="form-row items-center">
            <span class="form-label">Nieuwsbrief</span>
            <div class="flex items-center gap-2">
              <ToggleSwitch v-model="newsletter" />
              <span class="text-sm text-gray-500">Inschrijven op nieuwsbrief</span>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </section>
</template>

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

  .fade-slide-enter-active {
    transition: opacity var(--sw-duration-slow) var(--sw-ease), transform var(--sw-duration-slow) var(--sw-ease);
  }
  .fade-slide-leave-active {
    transition: opacity var(--sw-duration-base) var(--sw-ease), transform var(--sw-duration-base) var(--sw-ease);
  }
  .fade-slide-enter-from,
  .fade-slide-leave-to {
    @apply opacity-0;
    transform: translateY(-4px);
  }
</style>
