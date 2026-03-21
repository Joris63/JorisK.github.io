<script setup lang="ts">
import { ref } from 'vue';
import { DESTINATION_OPTIONS, SHOWROOM_OPTIONS } from '@/mocks/options';

const destination = ref('Klantadres');

const selectedShowroom = ref<number | null>(1);

const pickupPostalCode = ref('');
const pickupHouseNumber = ref('');
const pickupAddition = ref('');
const pickupStreet = ref('');
const pickupCity = ref('');
const selectedPickupPoint = ref<number | null>(null);
const pickupPoints = [
  {
    id: 1,
    name: 'PostNL Afhaalpunt JBT Retail Tilburg B.V. <Bekker>',
    distance: '0.8km',
    address: 'Wagnerplein 59, Tilburg',
  },
  {
    id: 2,
    name: 'PostNL Afhaalpunt Postnl XL Point',
    distance: '1.4km',
    address: 'Goirkekanaaldijk 20, Tilburg',
  },
  {
    id: 3,
    name: 'PostNL Afhaalpunt GAMMA Tilburg-Noord',
    distance: '1.5km',
    address: 'Bundersestraat 3, Tilburg',
  },
  {
    id: 4,
    name: 'PostNL Afhaalpunt Melie Shipping',
    distance: '1.9km',
    address: 'Ledeboerstraat 3506, Tilburg',
  },
  {
    id: 5,
    name: 'PostNL Afhaalpunt Primera Westermarkt',
    distance: '3.0km',
    address: 'Westermarkt 135, Tilburg',
  },
  {
    id: 6,
    name: 'PostNL Afhaalpunt Businesspoint Postcentrum Tilburg',
    distance: '3.6km',
    address: 'Aphroditestraat 71, Tilburg',
  },
  {
    id: 7,
    name: 'PostNL Afhaalpunt Mentastore',
    distance: '3.9km',
    address: 'Heuvelstraat 92, Tilburg',
  },
  {
    id: 8,
    name: 'PostNL Afhaalpunt Kolvari Luxury Dresses',
    distance: '4.3km',
    address: 'Korvelseweg 102, Tilburg',
  },
  {
    id: 9,
    name: 'PostNL Afhaalpunt Service Point Mortelplein',
    distance: '4.6km',
    address: 'Burgemeester van de Mortelplein 59, Tilburg',
  },
  {
    id: 10,
    name: 'PostNL Afhaalpunt DA drogist',
    distance: '4.9km',
    address: 'Tongerloplein 17, Udenhout',
  },
];

const alternativeDeliveryAddress = ref(false);
const deliverySalutation = ref('Dhr.');
const deliverySalutationOptions = ['Fam.', 'Dhr.', 'Mevr.'];
const deliveryAttentionOf = ref('');
const deliveryFirstName = ref('');
const deliveryLastName = ref('');
const deliveryPhone = ref('');
const deliveryPhoneAlt = ref('');
const deliveryCountry = ref('Nederland');
const deliveryPostalCode = ref('');
const deliveryHouseNumber = ref('');
const deliveryAddition = ref('');
const deliveryStreet = ref('');
const deliveryCity = ref('');
const deliveryStrategy = ref('Op afspraak');
const deliveryStrategyOptions = ['Op afspraak', 'Leverdatum'];
const desiredDeliveryDate = ref<Date | null>(null);
const deferredProcessing = ref(false);
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="form-row items-center">
      <span class="form-label">Eindbestemming</span>
      <SelectButton v-model="destination" :options="DESTINATION_OPTIONS" />
    </div>

    <!-- Conditional content based on eindbestemming -->
    <Transition name="fade-slide" mode="out-in">
      <!-- Klantadres: optional different address -->
      <div v-if="destination === 'Klantadres'" key="klantadres" class="flex flex-col gap-4">
        <div class="form-row items-center">
          <span class="form-label" />
          <div class="flex items-center gap-2">
            <ToggleSwitch v-model="alternativeDeliveryAddress" />
            <span class="text-sm text-gray-500">Afwijkend bezorgadres</span>
          </div>
        </div>
        <Transition name="fade-slide">
          <div v-if="alternativeDeliveryAddress" class="subform">
            <div class="form-row items-center">
              <span class="form-label">Aanhef</span>
              <SelectButton
                v-model="deliverySalutation"
                :options="deliverySalutationOptions"
              />
            </div>
            <div class="form-row items-center">
              <span class="form-label">Ter attentie van</span>
              <InputText
                v-model="deliveryAttentionOf"
                placeholder="T.a.v. Jan de Vries"
                class="flex-1"
              />
            </div>
            <div class="form-row items-center">
              <span class="form-label">Naam <span class="text-red-400">*</span></span>
              <div class="flex gap-2 flex-1">
                <InputText v-model="deliveryFirstName" placeholder="Jan" class="flex-1" />
                <InputText
                  v-model="deliveryLastName"
                  placeholder="de Vries"
                  class="flex-1"
                />
              </div>
            </div>
            <div class="form-row items-center">
              <span class="form-label"
                >Telefoonnummer <span class="text-red-400">*</span></span
              >
              <div class="flex gap-2 flex-1">
                <div class="flex gap-1 flex-1">
                  <Select
                    :options="[{ label: '+31', value: 'NL' }]"
                    option-label="label"
                    option-value="value"
                    class="w-32"
                    :model-value="'NL'"
                  >
                    <template #value="{ value }">
                      <div class="flex items-center gap-2">
                        <span :class="`fi fi-${value.toLowerCase()}`" />
                        <span>+31</span>
                      </div>
                    </template>
                  </Select>
                  <InputText
                    v-model="deliveryPhone"
                    placeholder="6 12345678"
                    class="flex-1"
                  />
                </div>
                <div class="flex gap-1 flex-1">
                  <Select
                    :options="[{ label: '+31', value: 'NL' }]"
                    option-label="label"
                    option-value="value"
                    class="w-32"
                    :model-value="'NL'"
                  >
                    <template #value="{ value }">
                      <div class="flex items-center gap-2">
                        <span :class="`fi fi-${value.toLowerCase()}`" />
                        <span>+31</span>
                      </div>
                    </template>
                  </Select>
                  <InputText
                    v-model="deliveryPhoneAlt"
                    placeholder="6 87654321"
                    class="flex-1"
                  />
                </div>
              </div>
            </div>
            <div class="form-row items-center">
              <span class="form-label">Land</span>
              <Select
                v-model="deliveryCountry"
                :options="['Nederland', 'België', 'Duitsland']"
                placeholder="Selecteer een land"
                class="flex-1"
              />
            </div>
            <div class="form-row items-center">
              <span class="form-label">Adres <span class="text-red-400">*</span></span>
              <div class="flex flex-col gap-2 flex-1">
                <div class="grid grid-cols-3 gap-2">
                  <InputText v-model="deliveryPostalCode" placeholder="1234 AB" />
                  <InputText v-model="deliveryHouseNumber" placeholder="12" />
                  <InputText v-model="deliveryAddition" placeholder="A" />
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <InputText v-model="deliveryStreet" placeholder="Kerkstraat" />
                  <InputText v-model="deliveryCity" placeholder="Amsterdam" />
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Showroom: pick a location -->
      <div
        v-else-if="destination === 'Showroom'"
        key="showroom"
        class="form-row items-center"
      >
        <span class="form-label">Showroom</span>
        <Select
          v-model="selectedShowroom"
          :options="SHOWROOM_OPTIONS"
          option-label="label"
          option-value="value"
          class="flex-1"
        />
      </div>

      <!-- Pickup Point: address search + nearby list -->
      <div
        v-else-if="destination === 'Pickup Point'"
        key="pickup"
        class="flex flex-col gap-4"
      >
        <div class="form-row items-center">
          <span class="form-label">Adres</span>
          <div class="flex flex-col gap-2 flex-1">
            <div class="grid grid-cols-3 gap-2">
              <InputText v-model="pickupPostalCode" placeholder="1234 AB" />
              <InputText v-model="pickupHouseNumber" placeholder="12" />
              <InputText v-model="pickupAddition" placeholder="A" />
            </div>
            <div class="grid grid-cols-2 gap-2">
              <InputText v-model="pickupStreet" placeholder="Kerkstraat" />
              <InputText v-model="pickupCity" placeholder="Amsterdam" />
            </div>
          </div>
        </div>
        <div
          class="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5"
        >
          Kies een pickup point waar de bestelling naartoe verzonden wordt.
        </div>
        <div
          class="rounded-lg border border-gray-200 overflow-hidden divide-y divide-gray-100"
        >
          <button
            v-for="point in pickupPoints"
            :key="point.id"
            class="flex items-center w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors bg-white gap-3"
            :class="{ 'bg-primary-50!': selectedPickupPoint === point.id }"
            @click="selectedPickupPoint = point.id"
          >
            <i
              class="pi shrink-0 text-xs"
              :class="
                selectedPickupPoint === point.id
                  ? 'pi-check-circle text-primary-500'
                  : 'pi-circle text-gray-300'
              "
            />
            <span class="flex-1 text-gray-700">{{ point.name }}</span>
            <span class="text-xs text-gray-400 shrink-0">{{ point.distance }}</span>
            <span class="text-xs text-primary-500 shrink-0">{{ point.address }}</span>
          </button>
        </div>
      </div>
    </Transition>

    <div class="form-row">
      <span class="form-label">Strategie</span>
      <SelectButton v-model="deliveryStrategy" :options="deliveryStrategyOptions" />
    </div>
    <div class="form-row items-center">
      <span class="form-label">
        Gewenste leverdatum
        <span class="text-red-400 ml-0.5">*</span>
      </span>
      <DatePicker
        v-model="desiredDeliveryDate"
        date-format="dd-mm-yy"
        placeholder="DD-MM-JJJJ"
        class="w-72"
        show-icon
        icon-display="input"
      />
    </div>
    <div class="form-row items-center">
      <span class="form-label">Uitgestelde verwerking</span>
      <div class="flex items-center gap-2">
        <ToggleSwitch v-model="deferredProcessing" />
        <i class="pi pi-info-circle text-gray-400 text-sm" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";
.subform {
  @apply flex flex-col bg-(--p-gray-50) border border-(--p-gray-200) rounded-[0.625rem] gap-4 py-5 px-6;
}

.form-row {
  grid-template-columns: 220px 1fr;
  @apply grid gap-2;
}

.form-label {
  @apply text-(--p-gray-500) text-sm pt-1.5;
}
</style>
