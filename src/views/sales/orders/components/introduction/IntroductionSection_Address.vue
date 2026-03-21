<script setup lang="ts">
import { ref } from 'vue';
import { COUNTRY_CODE_OPTIONS } from '@/mocks/options';

// mode prop is needed to know if in search or new mode — passed from parent via inject
// However per the spec state is local; we replicate mode awareness locally using a prop
const props = defineProps<{
  customerMode: 'search' | 'new' | null;
}>();

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

const customerFound = ref(true);

const selectedCountry = ref('NL');
const postalCode = ref('');
const houseNumber = ref('');
const addition = ref('');
const street = ref('');
const city = ref('');
</script>

<template>
  <div class="flex flex-col gap-4">
    <Transition name="fade-slide" mode="out-in">
      <div v-if="props.customerMode === 'search'" key="addr-search" class="flex flex-col gap-2">
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
                    :options="COUNTRY_CODE_OPTIONS"
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

      <div v-else-if="props.customerMode === 'new'" key="addr-new" class="flex flex-col gap-4">
        <div class="form-row items-center">
          <span class="form-label">Land</span
          ><Select
            v-model="selectedCountry"
            :options="COUNTRY_CODE_OPTIONS"
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

.address-card {
  transition:
    border-color 0.15s ease,
    background 0.15s ease;
  @apply flex items-center border-[1.5px] border-(--p-surface-200) rounded-lg bg-(--p-surface-0) cursor-pointer w-full gap-3 py-3.5 px-4;
}

.address-card:hover {
  @apply border-[var(--p-primary-300)];
}

.address-card--selected {
  @apply border-[var(--p-primary-500)] bg-[var(--p-primary-50)];
}

.address-card--add {
  @apply border-dashed text-(--p-surface-500);
}

.address-card--add:hover {
  @apply text-(--p-surface-700);
}
</style>
