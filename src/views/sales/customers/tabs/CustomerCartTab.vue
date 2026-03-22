<script setup lang="ts">
  import { computed, inject } from 'vue';
  import type { Ref } from 'vue';
  import type { CustomerData } from '@/types/customer';

  const customer = inject<Ref<CustomerData>>('customer')!;

  const cartSubtotal = computed(() =>
    customer.value.cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
  );
</script>

<template>
  <div class="tab-scroll">
    <div class="view-card">
      <div class="view-card-hdr">
        <span class="view-card-title">Winkelwagen</span>
      </div>
      <DataTable :value="customer.cart" class="ce-table">
        <Column field="name" header="Naam">
          <template #body="{ data }">
            <a href="#" class="text-primary-600 hover:underline text-base">{{ data.name }}</a>
          </template>
        </Column>
        <Column field="productCode" header="Productcode" style="width: 10rem" />
        <Column
          field="quantity"
          header="Aantal"
          :pt="{ columnheadercontent: { class: 'justify-end!' } }"
          body-class="col-right"
        />
        <Column
          field="price"
          header="Prijs"
          :pt="{ columnheadercontent: { class: 'justify-end!' } }"
          body-class="col-right"
        >
          <template #body="{ data }"
            >€ {{ data.price.toLocaleString('nl-NL', { minimumFractionDigits: 2 }) }}</template
          >
        </Column>
        <Column style="width: 3rem">
          <template #body
            ><i class="pi pi-external-link text-primary-400 cursor-pointer"
          /></template>
        </Column>
        <template #empty><span class="table-empty">De winkelwagen is leeg</span></template>
        <template #footer>
          <div v-if="customer.cart.length" class="table-subtotal">
            <span
              >Subtotaal, {{ customer.cart.reduce((s, i) => s + i.quantity, 0) }} product{{
                customer.cart.reduce((s, i) => s + i.quantity, 0) !== 1 ? 'en' : ''
              }}</span
            >
            <span>€ {{ cartSubtotal.toFixed(2).replace('.', ',') }}</span>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>
