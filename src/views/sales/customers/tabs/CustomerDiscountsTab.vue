<script setup lang="ts">
  import { ref, computed, inject } from 'vue';
  import type { Ref } from 'vue';
  import type { CustomerData } from '@/types/customer';
  import EditableCard from '@/components/EditableCard.vue';

  const customer = inject<Ref<CustomerData>>('customer')!;

  const isEditingBaseDiscount = ref(false);
  const brandDiscountsOpen = ref(true);
  const productDiscountsOpen = ref(true);
  const brandFilter = ref('');
  const productFilter = ref('');

  const filteredBrandDiscounts = computed(() => {
    const q = brandFilter.value.toLowerCase();
    return customer.value.brandDiscounts.filter((m) => m.brand.toLowerCase().includes(q));
  });

  const filteredProductDiscounts = computed(() => {
    const q = productFilter.value.toLowerCase();
    return customer.value.productDiscounts.filter(
      (p) => p.product.toLowerCase().includes(q) || p.productCode.toLowerCase().includes(q)
    );
  });
</script>

<template>
  <div class="tab-scroll">
    <!-- Basis korting -->
    <EditableCard v-model="isEditingBaseDiscount" title="Basis korting">
      <template #view>
        <div class="view-card-body">
          <div class="fr-row">
            <span class="fr-label">Basis korting</span>
            <span class="fr-value">{{ customer.baseDiscount }}%</span>
          </div>
        </div>
      </template>
      <template #edit>
        <div class="view-card-body">
          <div class="fr-row">
            <label class="fr-label">Basis korting</label>
            <InputNumber
              v-model="customer.baseDiscount"
              suffix="%"
              :min="0"
              :max="100"
              :min-fraction-digits="1"
              :max-fraction-digits="2"
              class="w-full"
            />
          </div>
        </div>
      </template>
    </EditableCard>

    <!-- Merk kortingen -->
    <div class="view-card">
      <div class="view-card-hdr">
        <div class="flex items-center gap-2">
          <span class="view-card-title">Merk kortingen</span>
          <span class="kort-count-badge">{{ customer.brandDiscounts.length }}</span>
        </div>
        <div class="flex items-center gap-1">
          <Button icon="pi pi-plus" size="small" severity="secondary" text />
          <Button
            :icon="brandDiscountsOpen ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
            size="small"
            severity="secondary"
            text
            @click="brandDiscountsOpen = !brandDiscountsOpen"
          />
        </div>
      </div>
      <Transition name="card-fade">
        <div v-if="brandDiscountsOpen">
          <div class="kort-filter-bar">
            <InputText
              v-model="brandFilter"
              size="small"
              placeholder="Zoek merk..."
              class="w-full"
            />
          </div>
          <DataTable :value="filteredBrandDiscounts" class="ce-table" :empty-message="' '">
            <template #empty>
              <span class="table-empty">{{
                brandFilter ? 'Geen merken gevonden' : 'Geen merk kortingen'
              }}</span>
            </template>
            <Column selection-mode="multiple" style="width: 3rem" />
            <Column field="brand" header="Merk" />
            <Column field="discount" header="Korting">
              <template #body="{ data }">{{ data.discount }}%</template>
            </Column>
            <Column field="defaultDiscount" header="Standaard kortingen">
              <template #body="{ data }">{{ data.defaultDiscount }}%</template>
            </Column>
          </DataTable>
        </div>
      </Transition>
    </div>

    <!-- Product kortingen -->
    <div class="view-card">
      <div class="view-card-hdr">
        <div class="flex items-center gap-2">
          <span class="view-card-title">Product kortingen</span>
          <span class="kort-count-badge">{{ customer.productDiscounts.length }}</span>
        </div>
        <div class="flex items-center gap-1">
          <Button icon="pi pi-plus" size="small" severity="secondary" text />
          <Button
            :icon="productDiscountsOpen ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
            size="small"
            severity="secondary"
            text
            @click="productDiscountsOpen = !productDiscountsOpen"
          />
        </div>
      </div>
      <Transition name="card-fade">
        <div v-if="productDiscountsOpen">
          <div class="kort-filter-bar">
            <InputText
              v-model="productFilter"
              size="small"
              placeholder="Zoek product..."
              class="w-full"
            />
          </div>
          <DataTable :value="filteredProductDiscounts" class="ce-table" :empty-message="' '">
            <template #empty>
              <span class="table-empty">{{
                productFilter ? 'Geen producten gevonden' : 'Geen product kortingen'
              }}</span>
            </template>
            <Column selection-mode="multiple" style="width: 3rem" />
            <Column field="productCode" header="Productcode" />
            <Column field="product" header="Product" />
            <Column
              field="price"
              header="Prijs"
              :pt="{ columnheadercontent: { class: 'justify-end!' } }"
              body-class="col-right"
            >
              <template #body="{ data }">€ {{ data.price.toFixed(2) }}</template>
            </Column>
            <Column
              field="discountPrice"
              header="Korting prijs"
              :pt="{ columnheadercontent: { class: 'justify-end!' } }"
              body-class="col-right"
            >
              <template #body="{ data }">€ {{ data.discountPrice.toFixed(2) }}</template>
            </Column>
          </DataTable>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";
  .kort-filter-bar {
    @apply flex items-center border-b border-(--p-gray-100) py-2.5 px-4;
  }
</style>
