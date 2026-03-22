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
                <span class="text-base">{{ data.quantity ?? '—' }}</span>
              </template>
            </Column>
            <Column header="Prijs" style="width: 7rem">
              <template #body="{ data }">
                <span class="text-base">
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
    @apply flex border-b border-(--sw-border) bg-(--sw-bg) shrink-0 px-4;
  }
  .log-tab {
    border-bottom: 2px solid transparent;
    transition: color var(--sw-duration-base) var(--sw-ease), border-color var(--sw-duration-base) var(--sw-ease);
    margin-bottom: -1px;
    @apply bg-transparent border-0 cursor-pointer text-(--sw-text-label) font-medium py-2.5 px-4 text-base;
  }
  .log-tab:hover { @apply text-(--sw-text-strong); }
  .log-tab--active {
    border-bottom-color: var(--p-primary-500);
    @apply text-primary-600;
  }

  .log-scroll {
    @apply flex-1 overflow-y-auto bg-(--sw-bg-page) p-4;
  }
</style>
