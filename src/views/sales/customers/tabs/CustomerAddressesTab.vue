<script setup lang="ts">
  import { ref, inject } from 'vue';
  import type { Ref } from 'vue';
  import type { CustomerData, CustomerAddress } from '@/types/customer';
  import type { AddressForm } from '@/types/address';
  import AddressDrawer from '../../components/AddressDrawer.vue';

  const customer = inject<Ref<CustomerData>>('customer')!;

  const addrDrawerVisible = ref(false);
  const addrDrawerAddress = ref<AddressForm | null>(null);

  function openAddAddress() {
    addrDrawerAddress.value = null;
    addrDrawerVisible.value = true;
  }

  function openEditAddress(addr: CustomerAddress) {
    addrDrawerAddress.value = {
      id: addr.id,
      salutation: null,
      firstName: addr.name,
      lastName: '',
      phoneCountry: '+31',
      phone: addr.phone,
      attentionOf: '',
      country: addr.country,
      postalCode: addr.postalCode,
      houseNumber: addr.houseNumber,
      addition: '',
      street: addr.street,
      city: addr.city,
    };
    addrDrawerVisible.value = true;
  }

  function saveAddress(data: AddressForm) {
    if (data.id) {
      const idx = customer.value.addresses.findIndex((a) => a.id === data.id);
      if (idx !== -1) {
        customer.value.addresses[idx] = {
          ...customer.value.addresses[idx],
          name: [data.salutation, data.firstName, data.lastName].filter(Boolean).join(' '),
          street: data.street,
          houseNumber: data.houseNumber,
          postalCode: data.postalCode,
          city: data.city,
          country: data.country,
          phone: `${data.phoneCountry} ${data.phone}`.trim(),
        };
      }
    } else {
      const newId = Math.max(0, ...customer.value.addresses.map((a) => a.id)) + 1;
      customer.value.addresses.push({
        id: newId,
        name: [data.salutation, data.firstName, data.lastName].filter(Boolean).join(' '),
        street: data.street,
        houseNumber: data.houseNumber,
        postalCode: data.postalCode,
        city: data.city,
        country: data.country,
        phone: `${data.phoneCountry} ${data.phone}`.trim(),
        isDefaultDelivery: false,
        isDefaultInvoice: false,
      });
    }
  }

  function deleteAddress(id: number) {
    customer.value.addresses = customer.value.addresses.filter((a) => a.id !== id);
  }

  function makeDefaultDelivery(id: number) {
    customer.value.addresses.forEach((a) => {
      a.isDefaultDelivery = a.id === id;
    });
  }

  function makeDefaultInvoice(id: number) {
    customer.value.addresses.forEach((a) => {
      a.isDefaultInvoice = a.id === id;
    });
  }
</script>

<template>
  <div class="tab-scroll">
    <div class="addr-topbar">
      <Button
        label="Nieuw adres toevoegen"
        icon="pi pi-plus"
        size="small"
        @click="openAddAddress"
      />
    </div>
    <div class="addr-grid">
      <div v-for="addr in customer.addresses" :key="addr.id" class="addr-card">
        <div class="addr-card-head">
          <div class="addr-name">{{ addr.name }}</div>
          <div class="addr-card-actions">
            <Button
              icon="pi pi-pencil"
              severity="secondary"
              text
              rounded
              size="small"
              @click="openEditAddress(addr)"
            />
            <Button
              v-if="!addr.isDefaultDelivery && !addr.isDefaultInvoice"
              icon="pi pi-trash"
              severity="danger"
              text
              rounded
              size="small"
              @click="deleteAddress(addr.id)"
            />
          </div>
        </div>
        <div class="addr-line">
          {{ addr.street }} {{ addr.houseNumber }}, {{ addr.postalCode }} {{ addr.city }}
        </div>
        <div class="addr-line">{{ addr.country }}</div>
        <div v-if="addr.phone" class="addr-line">{{ addr.phone }}</div>
        <div class="addr-chips">
          <button
            class="addr-chip"
            :class="addr.isDefaultDelivery ? 'addr-chip--active' : 'addr-chip--inactive'"
            :disabled="addr.isDefaultDelivery"
            @click="makeDefaultDelivery(addr.id)"
          >
            <i class="pi" :class="addr.isDefaultDelivery ? 'pi-check' : 'pi-home'" />
            Bezorgadres
          </button>
          <button
            class="addr-chip"
            :class="addr.isDefaultInvoice ? 'addr-chip--active' : 'addr-chip--inactive'"
            :disabled="addr.isDefaultInvoice"
            @click="makeDefaultInvoice(addr.id)"
          >
            <i class="pi" :class="addr.isDefaultInvoice ? 'pi-check' : 'pi-file'" />
            Factuuradres
          </button>
        </div>
      </div>
    </div>
  </div>

  <AddressDrawer
    v-model:visible="addrDrawerVisible"
    :address="addrDrawerAddress"
    @save="saveAddress"
  />
</template>

<style scoped>
@reference "@/assets/style.css";
  .addr-topbar {
    @apply flex justify-end mb-4;
  }

  .addr-grid {
    @apply grid grid-cols-2 gap-4;
  }

  .addr-card {
    @apply flex flex-col border border-(--p-gray-200) rounded-lg bg-white gap-1 p-4 px-5;
  }

  .addr-card-head {
    @apply flex items-start justify-between;
  }
  .addr-card-actions {
    @apply flex gap-0.5 -mt-1.5 -mr-1.5;
  }

  .addr-name {
    @apply font-semibold text-(--p-surface-800) text-base;
  }
  .addr-line {
    @apply text-(--p-surface-600) text-base;
  }

  .addr-chips {
    @apply flex flex-wrap gap-1.5 mt-3;
  }

  .addr-chip {
    transition: opacity var(--sw-duration-fast);
    @apply inline-flex items-center rounded-full font-medium border border-solid cursor-pointer gap-1 py-0.5 px-2.5 text-xs;
  }
  .addr-chip:disabled {
    @apply cursor-default;
  }
  .addr-chip--active {
    @apply bg-(--p-primary-50) border-(--p-primary-200) text-(--p-primary-700);
  }
  .addr-chip--inactive {
    @apply bg-white border-(--p-gray-300) text-(--p-surface-500);
  }
  .addr-chip--inactive:hover {
    @apply bg-(--p-gray-50) border-(--p-gray-400);
  }
</style>
