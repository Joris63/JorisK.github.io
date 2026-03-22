<script setup lang="ts">
  import { inject, ref, type Ref } from 'vue';
  import type { QuotationData } from '@/types/quotations';

  const quotation = inject<Ref<QuotationData>>('quotation')!;

  const activeTab = ref<'emails' | 'notes' | 'documents'>('emails');

  const tabs = [
    { id: 'emails', label: 'E-mails en afdrukken' },
    { id: 'notes', label: 'Opmerkingen' },
    { id: 'documents', label: 'Documenten' },
  ] as const;
</script>

<template>
  <div class="comm-layout">
    <!-- Sub-tab bar -->
    <div class="comm-tabbar">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="comm-tab"
        :class="{ 'comm-tab--active': activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- ── Content ──────────────────────────────────────────────── -->
    <div class="comm-scroll">
      <!-- ── E-mails en afdrukken ─────────────────────────────── -->
      <template v-if="activeTab === 'emails'">
        <div class="view-card">
          <div class="view-card-hdr">
            <span class="view-card-title">Verzonden e-mails</span>
            <span class="kort-count-badge">{{ quotation.emails.length }}</span>
            <div class="flex gap-2 ml-auto">
              <Button
                label="Afdrukken"
                icon="pi pi-print"
                size="small"
                severity="secondary"
                text
              />
              <Button label="E-mail versturen" icon="pi pi-send" size="small" outlined />
            </div>
          </div>
          <DataTable :value="quotation.emails" class="ce-table">
            <Column header="Datum" field="date" style="width: 12rem" />
            <Column header="Type" style="width: 9rem">
              <template #body="{ data }">
                <Tag :value="data.type" severity="secondary" />
              </template>
            </Column>
            <Column style="width: 3.5rem">
              <template #body>
                <Button icon="pi pi-download" size="small" text severity="secondary" rounded />
              </template>
            </Column>
            <template #empty>
              <span class="table-empty">Geen e-mails verstuurd.</span>
            </template>
          </DataTable>
        </div>
      </template>

      <!-- ── Opmerkingen ──────────────────────────────────────── -->
      <template v-else-if="activeTab === 'notes'">
        <div class="view-card">
          <div class="view-card-hdr">
            <span class="view-card-title">Opmerkingen</span>
            <span class="kort-count-badge">{{ quotation.notes.length }}</span>
            <Button
              size="small"
              label="Toevoegen"
              icon="pi pi-plus"
              severity="secondary"
              text
              class="ml-auto"
            />
          </div>
          <DataTable :value="quotation.notes" class="ce-table">
            <Column header="Datum" field="date" style="width: 11rem" />
            <Column header="Opmerking" field="text" />
            <Column header="Voor" style="width: 9rem">
              <template #body="{ data }">
                <span class="text-base text-gray-600">{{ data.for || '—' }}</span>
              </template>
            </Column>
            <Column header="Gebruiker" field="user" style="width: 10rem" />
            <template #empty>
              <span class="table-empty">Nog geen opmerkingen.</span>
            </template>
          </DataTable>
        </div>
      </template>

      <!-- ── Documenten ───────────────────────────────────────── -->
      <template v-else-if="activeTab === 'documents'">
        <div class="view-card">
          <div class="view-card-hdr">
            <span class="view-card-title">Documenten</span>
            <span class="kort-count-badge">{{ quotation.documents.length }}</span>
            <Button
              size="small"
              label="Toevoegen"
              icon="pi pi-plus"
              severity="secondary"
              text
              class="ml-auto"
            />
          </div>
          <DataTable :value="quotation.documents" class="ce-table">
            <Column header="Naam" field="name" />
            <Column header="Datum" field="date" style="width: 10rem" />
            <Column header="Type" field="type" style="width: 8rem" />
            <Column style="width: 3.5rem">
              <template #body>
                <Button icon="pi pi-download" size="small" text severity="secondary" rounded />
              </template>
            </Column>
            <template #empty>
              <span class="table-empty">Geen documenten toegevoegd.</span>
            </template>
          </DataTable>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";
  .comm-layout {
    @apply flex flex-col flex-1 overflow-hidden;
  }

  .comm-tabbar {
    @apply flex border-b border-(--sw-border) bg-(--sw-bg) shrink-0 px-4;
  }
  .comm-tab {
    border-bottom: 2px solid transparent;
    transition:
      color var(--sw-duration-base) var(--sw-ease),
      border-color var(--sw-duration-base) var(--sw-ease);
    @apply bg-transparent border-0 border-b-2 cursor-pointer text-(--sw-text-label) font-medium whitespace-nowrap py-2.5 px-4 text-base -mb-px;
  }
  .comm-tab:hover {
    @apply text-(--sw-text-strong);
  }
  .comm-tab--active {
    border-bottom-color: var(--p-primary-500);
    @apply text-primary-600;
  }

  .comm-scroll {
    @apply flex-1 overflow-y-auto bg-(--sw-bg-page) p-4;
  }
</style>
