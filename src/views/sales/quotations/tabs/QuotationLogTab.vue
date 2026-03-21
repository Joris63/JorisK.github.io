<script setup lang="ts">
  import { inject, ref, type Ref } from 'vue';
  import type { QuotationData } from '@/types/quotations';

  const quotation = inject<Ref<QuotationData>>('quotation')!;

  const activeTab = ref<'products' | 'general'>('products');

  const tabs = [
    { id: 'products', label: 'Product informatie' },
    { id: 'general', label: 'Algemene informatie' },
  ] as const;

  const actieSeverity: Record<string, string> = {
    Toegevoegd: 'success',
    Verwijderd: 'danger',
    Gewijzigd: 'info',
    Aangemaakt: 'success',
    'E-mail verstuurd': 'info',
  };
</script>

<template>
  <div class="log-layout">
    <div class="log-tabbar">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="log-tab"
        :class="{ 'log-tab--active': activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="log-scroll">
      <template v-if="activeTab === 'products'">
        <div class="view-card">
          <div class="view-card-hdr">
            <span class="view-card-title">Product informatie</span>
          </div>
          <DataTable :value="quotation.productLog" class="ce-table" >
            <Column header="Datum" field="date" style="width: 11rem" />
            <Column header="Productcode" style="width: 9rem">
              <template #body="{ data }">
                <span class="text-xs text-gray-600">{{ data.productCode ?? '—' }}</span>
              </template>
            </Column>
            <Column header="Omschrijving" field="description" />
            <Column header="Aantal" style="width: 5rem">
              <template #body="{ data }">
                <span class="text-sm">{{ data.quantity ?? '—' }}</span>
              </template>
            </Column>
            <Column header="Prijs" style="width: 7rem">
              <template #body="{ data }">
                <span class="text-sm">
                  {{ data.price != null ? `€\u00a0${data.price.toFixed(2).replace('.', ',')}` : '—' }}
                </span>
              </template>
            </Column>
            <Column header="Actie" style="width: 8rem">
              <template #body="{ data }">
                <Tag :value="data.action" :severity="actieSeverity[data.action] || 'secondary'" />
              </template>
            </Column>
            <Column header="Gebruiker" field="user" style="width: 9rem" />
            <template #empty>
              <span class="table-empty">Geen product log entries.</span>
            </template>
          </DataTable>
        </div>
      </template>

      <template v-else-if="activeTab === 'general'">
        <div class="view-card">
          <div class="view-card-hdr">
            <span class="view-card-title">Algemene informatie</span>
          </div>
          <DataTable :value="quotation.generalLog" class="ce-table" >
            <Column header="Datum" field="date" style="width: 11rem" />
            <Column header="Omschrijving" field="description" />
            <Column header="Gebruiker" field="user" style="width: 9rem" />
            <template #empty>
              <span class="table-empty">Geen log entries.</span>
            </template>
          </DataTable>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";
  .log-layout {
    @apply flex flex-col flex-1 overflow-hidden;
  }

  .log-tabbar {
    @apply flex border-b border-(--p-gray-100) bg-white shrink-0 px-4;
  }
  .log-tab {
    border-bottom: 2px solid transparent;
    transition: color var(--sw-duration-base), border-color var(--sw-duration-base);
    margin-bottom: -1px;
    @apply bg-transparent border-0 cursor-pointer text-(--p-surface-500) font-medium py-2.5 px-4 text-sm;
  }
  .log-tab:hover { @apply text-(--p-surface-700); }
  .log-tab--active {
    border-bottom-color: var(--p-primary-500);
    @apply text-[var(--p-primary-600)];
  }

  .log-scroll {
    @apply flex-1 overflow-y-auto bg-(--p-surface-50) p-4;
  }
</style>
