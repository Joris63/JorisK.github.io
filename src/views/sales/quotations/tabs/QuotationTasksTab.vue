<script setup lang="ts">
  import { inject, type Ref } from 'vue';
  import type { QuotationData } from '@/types/quotations';

  const quotation = inject<Ref<QuotationData>>('quotation')!;

  const statusSeverity: Record<string, string> = {
    'Not started': 'warn',
    'In progress': 'info',
    Completed: 'success',
  };
</script>

<template>
  <div class="tab-scroll">
    <div class="view-card">
      <div class="view-card-hdr">
        <span class="view-card-title">Taken</span>
        <span class="kort-count-badge">{{ quotation.tasks.length }}</span>
        <Button
          size="small"
          label="Toevoegen"
          icon="pi pi-plus"
          severity="secondary"
          text
          style="margin-left: auto"
        />
      </div>
      <DataTable :value="quotation.tasks" class="ce-table">
        <Column header="Omschrijving">
          <template #body="{ data }">
            <span class="text-base text-gray-600">{{ data.description }}</span>
          </template>
        </Column>
        <Column header="Deadline" style="width: 9rem">
          <template #body="{ data }">
            <span class="text-base text-gray-600">{{ data.deadline }}</span>
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
            <span class="text-base text-gray-600">{{ data.department }}</span>
          </template>
        </Column>
        <Column header="Gebruiker" style="width: 10rem">
          <template #body="{ data }">
            <span class="text-base text-gray-600">{{ data.user }}</span>
          </template>
        </Column>
        <Column header="Eigenaar" style="width: 10rem">
          <template #body="{ data }">
            <span class="text-base text-gray-600">{{ data.owner }}</span>
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
@reference "@/assets/style.css";
  .task-link {
    @apply text-(--p-primary-600) no-underline font-medium text-base;
  }
  .task-link:hover {
    @apply underline;
  }
  .badge {
    @apply inline-flex rounded-full font-semibold border border-solid py-0.5 px-2.5 text-xs;
  }
  .badge--info {
    @apply bg-(--p-info-50) border-(--p-info-200) text-(--p-info-700);
  }
  .badge--success {
    @apply bg-green-50 border-green-200 text-green-700;
  }
  .badge--warn {
    @apply bg-orange-50 border-orange-200 text-orange-700;
  }
</style>
