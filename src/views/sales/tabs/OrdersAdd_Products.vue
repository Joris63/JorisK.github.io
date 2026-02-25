<script setup lang="ts">
  import { ref } from 'vue';
  import OrdersAdd_ShoppingCart from './OrdersAdd_ShoppingCart.vue';

  const selectedSite = ref<number>(1);
  const siteOptions = ref([
    { label: 'SWNL', value: 1 },
    { label: 'SWBE', value: 2 },
    { label: 'SWFR', value: 3 },
    { label: 'SWDE', value: 4 },
  ]);

  const selectedCustomerType = ref<number>(1);
  const customerTypes = ref([
    { label: 'B2C', value: 1 },
    { label: 'B2B', value: 2 },
  ]);

  const hasPendingOrders = ref(true);
  const pendingBannerVisible = ref(true);
</script>

<template>
  <StepPanel v-slot="{ activateCallback }" :value="1" class="flex flex-col grow">
    <div class="flex flex-col gap-4">
      <!-- Pending orders notice -->
      <div
        v-if="hasPendingOrders && pendingBannerVisible"
        class="flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900"
      >
        <i class="pi pi-history text-amber-500 shrink-0" />
        <span class="text-sm flex-1">
          Je hebt onafgeronde bestellingen.
          <button
            class="font-semibold underline underline-offset-2 bg-transparent border-0 p-0 cursor-pointer text-amber-900 hover:text-amber-700"
          >
            Klik hier om door te gaan
          </button>
        </span>
        <Button
          icon="pi pi-times"
          variant="text"
          severity="warn"
          size="small"
          rounded
          @click="pendingBannerVisible = false"
        />
      </div>

      <!-- Order configuration card -->
      <div
        class="grid divide-x divide-gray-200 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden grid-cols-2"
      >
        <!-- Site selector -->
        <div class="flex flex-col gap-2 p-4">
          <span class="text-xs font-semibold uppercase tracking-wider text-gray-400">Site</span>
          <SelectButton
            v-model="selectedSite"
            :allow-empty="false"
            :options="siteOptions"
            option-label="label"
            option-value="value"
          />
        </div>

        <!-- Customer type selector -->
        <div class="flex flex-col gap-2 p-4">
          <span class="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Klanttype
          </span>
          <div class="flex gap-3 items-center">
            <SelectButton
              v-model="selectedCustomerType"
              :allow-empty="false"
              :options="customerTypes"
              option-label="label"
              option-value="value"
            />

            <Button
              label="Joris Kamminga"
              severity="secondary"
              size="small"
              icon="pi pi-times"
              icon-pos="right"
              variant="outlined"
            />
          </div>
        </div>
      </div>

      <!-- Product search -->
      <div class="flex flex-col gap-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-gray-400"
          >Product toevoegen</span
        >
        <div class="flex gap-2">
          <IconField class="grow">
            <InputIcon class="pi pi-search" />
            <InputText
              class="w-full"
              placeholder="Zoek op productcode, productnaam, fabrikantcode, bestelcode of EAN"
              autofocus
            />
          </IconField>
          <Button label="HM nummer" icon="pi pi-plus" icon-pos="left" class="btn-outlined" />
          <div class="pl-2 border-l border-gray-200">
            <Button icon="pi pi-ellipsis-v" class="btn-outlined" />
          </div>
        </div>
      </div>

      <!-- Shopping cart -->
      <OrdersAdd_ShoppingCart />
    </div>

    <div class="flex pt-4 justify-end">
      <Button
        label="Volgende"
        severity="secondary"
        icon="pi pi-arrow-right"
        iconPos="right"
        @click="activateCallback(2)"
      />
    </div>
  </StepPanel>
</template>
