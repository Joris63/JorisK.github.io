<script setup lang="ts">
  import type { CustomerQuotation } from '@/types/customer';

  const quotations: CustomerQuotation[] = [
    {
      id: 1,
      quotationNumber: '1761598',
      date: '19 mei 2022 14:53',
      by: 'Job Vermue',
      price: 3666.83,
      status: 'Geaccepteerd',
      notes: 0,
    },
    {
      id: 2,
      quotationNumber: '1895180',
      date: '20 oktober 2022 15:07',
      by: 'Bart Onstenk',
      price: 1595.1,
      status: 'Geaccepteerd',
      notes: 0,
    },
    {
      id: 3,
      quotationNumber: '1917050',
      date: '11 november 2022 12:22',
      by: 'Bart Onstenk',
      price: 2405.34,
      status: 'Geaccepteerd',
      notes: 0,
    },
    {
      id: 4,
      quotationNumber: '2005823',
      date: '03 februari 2023 16:01',
      by: 'Mark Roeters',
      price: 10380.6,
      status: 'Geaccepteerd',
      notes: 0,
    },
    {
      id: 5,
      quotationNumber: '2697404',
      date: '18 maart 2025 10:42',
      by: 'Luke Derkzen',
      price: 14.95,
      status: 'Niet geaccepteerd',
      notes: 0,
    },
  ];
</script>

<template>
  <div class="tab-scroll">
    <div class="view-card">
      <div class="view-card-hdr">
        <span class="view-card-title">Offertes</span>
      </div>
      <DataTable :value="quotations" class="ce-table">
        <Column field="quotationNumber" header="Offertenummer" style="width: 9rem" />
        <Column field="date" header="Datum aangemaakt" style="width: 13rem" />
        <Column field="by" header="Door" />
        <Column
          field="price"
          header="Prijs"
          style="width: 9rem"
          :pt="{ columnheadercontent: { class: 'justify-end!' } }"
          body-class="text-right!"
        >
          <template #body="{ data }">
            €
            {{ data.price.toLocaleString('nl-NL', { minimumFractionDigits: 2 }) }}
          </template>
        </Column>
        <Column
          field="status"
          header="Status"
          style="width: 14rem"
          :pt="{ columnheadercontent: { class: 'justify-center!' } }"
          body-class="text-center!"
        >
          <template #body="{ data }">
            <span
              class="offerte-badge"
              :class="
                data.status === 'Geaccepteerd' ? 'offerte-badge--success' : 'offerte-badge--warn'
              "
            >
              {{ data.status }}
            </span>
          </template>
        </Column>
        <Column field="notes" header="Opmerkingen" style="width: 9rem">
          <template #body="{ data }">{{ data.notes || 'Geen' }}</template>
        </Column>
        <Column style="width: 3rem">
          <template #body><i class="pi pi-pencil text-primary-400 cursor-pointer" /></template>
        </Column>
        <template #empty
          ><span class="table-empty">Er zijn geen resultaten gevonden</span></template
        >
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";
  .offerte-badge {
    @apply inline-flex rounded-full font-semibold border border-solid py-0.5 px-2.5 text-xs;
  }
  .offerte-badge--success {
    @apply bg-(--p-green-50) border-(--p-green-200) text-(--p-green-700);
  }
  .offerte-badge--warn {
    @apply bg-(--p-orange-50) border-(--p-orange-200) text-(--p-orange-700);
  }
</style>
