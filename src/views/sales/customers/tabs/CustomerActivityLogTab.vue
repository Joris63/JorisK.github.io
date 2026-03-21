<script setup lang="ts">
  import type { LogEntry } from '@/types/customer';

  const log: LogEntry[] = [
    {
      id: 1,
      user: 'nejat.karanzai@sawiday.com',
      date: '24 februari 2025 15:22',
      property: 'vatCode',
      oldValue: '0',
      newValue: 'NL',
    },
    {
      id: 2,
      user: 'webshop@sawiday.com',
      date: '03 december 2024 06:30',
      property: 'temporaryCreditExpireDate',
      oldValue: '2024-12-02',
      newValue: '0',
    },
    {
      id: 3,
      user: 'richard.laven@sawiday.com',
      date: '25 november 2024 11:49',
      property: 'temporaryCreditExpireDate',
      oldValue: '0',
      newValue: '2024-12-02',
    },
    {
      id: 4,
      user: 'webshop@sawiday.com',
      date: '17 mei 2024 11:01',
      property: 'phoneNumber',
      oldValue: '0651302704',
      newValue: '+31651302704',
    },
    {
      id: 5,
      user: 'webshop@sawiday.com',
      date: '21 december 2023 11:16',
      property: 'companyType',
      oldValue: '',
      newValue: 'Installateur',
    },
    {
      id: 6,
      user: 'akin.bektas@sawiday.com',
      date: '07 augustus 2023 11:49',
      property: 'isPayAfterAllowed',
      oldValue: '0',
      newValue: '1',
    },
  ];
</script>

<template>
  <div class="tab-scroll">
    <div class="view-card">
      <div class="view-card-hdr">
        <span class="view-card-title">Logboek</span>
      </div>
      <DataTable :value="log" class="ce-table">
        <Column header="Gebruiker" style="width: 17rem">
          <template #body="{ data }">
            <a href="#" class="text-primary-600 hover:underline text-sm">{{ data.user }}</a>
            <div class="text-xs text-gray-400 mt-0.5">{{ data.date }}</div>
          </template>
        </Column>
        <Column header="Eigenschap" style="width: 13rem">
          <template #body="{ data }">
            <span class="log-prop">{{ data.property }}</span>
          </template>
        </Column>
        <Column header="Wijziging">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <span class="log-old">{{ data.oldValue || '—' }}</span>
              <i class="pi pi-arrow-right text-gray-300" style="font-size: 0.7rem" />
              <span class="log-new">{{ data.newValue || '—' }}</span>
            </div>
          </template>
        </Column>
        <template #empty><span class="table-empty">Geen activiteit gevonden</span></template>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";
  .log-prop {
    font-family: ui-monospace, monospace;
    @apply inline-block rounded-[3px] bg-(--p-gray-100) text-(--p-surface-600) py-0.5 px-1.5 text-sm;
  }
  .log-old {
    @apply text-(--p-surface-400) line-through text-sm;
  }
  .log-new {
    @apply text-(--p-green-700) font-medium text-sm;
  }
</style>
