<script setup lang="ts">
  import { inject, type Ref } from 'vue';
  import type { QuotationData } from '@/types/quotations';

  const quotation = inject<Ref<QuotationData>>('quotation')!;

  const statusSeverity: Record<string, string> = {
    'Niet begonnen': 'warn',
    'In behandeling': 'info',
    Afgerond: 'success',
  };
</script>

<template>
  <div class="tab-scroll">
    <div class="view-card">
      <div class="view-card-hdr">
        <span class="view-card-title">Taken</span>
        <span class="kort-count-badge">{{ quotation.taken.length }}</span>
        <Button
          size="small"
          label="Toevoegen"
          icon="pi pi-plus"
          severity="secondary"
          text
          style="margin-left: auto"
        />
      </div>
      <DataTable :value="quotation.taken" class="ce-table">
        <Column header="Omschrijving">
          <template #body="{ data }">
            <a href="#" class="task-link">{{ data.omschrijving }}</a>
          </template>
        </Column>
        <Column header="Deadline" style="width: 9rem">
          <template #body="{ data }">
            <span class="text-sm text-gray-600">{{ data.deadline }}</span>
          </template>
        </Column>
        <Column header="Status" style="width: 9rem">
          <template #body="{ data }">
            <span class="badge" :class="`badge--${statusSeverity[data.status]}`">
              {{ data.status }}
            </span>
          </template>
        </Column>
        <Column header="Afdeling" style="width: 8rem">
          <template #body="{ data }">
            <span class="text-sm text-gray-600">{{ data.afdeling }}</span>
          </template>
        </Column>
        <Column header="Gebruiker" style="width: 10rem">
          <template #body="{ data }">
            <span class="text-sm text-gray-600">{{ data.gebruiker }}</span>
          </template>
        </Column>
        <Column header="Eigenaar" style="width: 10rem">
          <template #body="{ data }">
            <span class="text-sm text-gray-600">{{ data.gebruiker }}</span>
          </template>
        </Column>
        <Column style="width: 2.5rem">
          <template #body>
            <Button icon="pi pi-external-link" size="small" text severity="secondary" rounded />
          </template>
        </Column>
        <template #empty>
          <span class="table-empty">Geen taken gevonden.</span>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
  .task-link {
    font-size: 0.875rem;
    color: var(--p-primary-600);
    text-decoration: none;
    font-weight: 500;
  }
  .task-link:hover {
    text-decoration: underline;
  }
  .badge {
    display: inline-flex;
    padding: 0.2rem 0.625rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    border: 1px solid;
  }
  .badge--info {
    background: var(--p-info-50);
    border-color: var(--p-info-200);
    color: var(--p-info-700);
  }
  .badge--success {
    background: var(--p-green-50);
    border-color: var(--p-green-200);
    color: var(--p-green-700);
  }
  .badge--warn {
    background: var(--p-orange-50);
    border-color: var(--p-orange-200);
    color: var(--p-orange-700);
  }
</style>
