<script setup lang="ts">
  import { ref, computed, inject } from 'vue';
  import type { Ref } from 'vue';
  import type { CustomerData } from '@/types/customer';

  const customer = inject<Ref<CustomerData>>('customer')!;

  const selectedWishlistId = ref<number>(customer.value.wishlists[0]?.id ?? 0);

  const selectedWishlist = computed(
    () => customer.value.wishlists.find((w) => w.id === selectedWishlistId.value) ?? null
  );
</script>

<template>
  <div class="tab-scroll">
    <div class="view-card">
      <div class="view-card-hdr">
        <div class="flex gap-1.5">
          <button
            v-for="wl in customer.wishlists"
            :key="wl.id"
            class="wl-tab"
            :class="{ 'wl-tab--active': wl.id === selectedWishlistId }"
            @click="selectedWishlistId = wl.id"
          >
            {{ wl.name }}
            <span class="wl-tab-count">{{ wl.items.length }}</span>
          </button>
        </div>
      </div>
      <DataTable v-if="selectedWishlist" :value="selectedWishlist.items" class="ce-table">
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
        <template #footer>
          <div v-if="selectedWishlist.items.length" class="table-subtotal">
            <span
              >Subtotaal, {{ selectedWishlist.items.reduce((s, i) => s + i.quantity, 0) }} product{{
                selectedWishlist.items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 'en' : ''
              }}</span
            >
            <span
              >€
              {{
                selectedWishlist.items
                  .reduce((s, i) => s + i.price * i.quantity, 0)
                  .toLocaleString('nl-NL', { minimumFractionDigits: 2 })
              }}</span
            >
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";
  .wl-tab {
    transition: all var(--sw-duration-fast);
    @apply inline-flex items-center rounded-full border border-(--p-gray-200) bg-white text-(--p-surface-600) cursor-pointer gap-1.5 py-0.5 px-3 text-base;
  }
  .wl-tab:hover {
    @apply bg-(--p-gray-50) border-(--p-gray-300);
  }
  .wl-tab--active {
    @apply bg-(--p-primary-50) border-(--p-primary-200) text-(--p-primary-700);
  }
  .wl-tab-count {
    @apply font-semibold bg-(--p-gray-100) text-(--p-surface-500) rounded-full text-xs px-1.5;
  }
  .wl-tab--active .wl-tab-count {
    @apply bg-(--p-primary-100) text-(--p-primary-600);
  }
</style>
