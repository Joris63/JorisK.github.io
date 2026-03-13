<script setup lang="ts">
  import { inject, ref, type Ref } from 'vue';
  import type { QuotationData } from '@/types/quotations';

  const quotation = inject<Ref<QuotationData>>('quotation')!;

  const activeTab = ref<'emails' | 'opmerkingen' | 'documenten'>('emails');

  const tabs = [
    { id: 'emails', label: 'E-mails en afdrukken' },
    { id: 'opmerkingen', label: 'Opmerkingen' },
    { id: 'documenten', label: 'Documenten' },
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
            <div class="flex gap-2" style="margin-left: auto">
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
            <Column header="Datum" field="datum" style="width: 12rem" />
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
      <template v-else-if="activeTab === 'opmerkingen'">
        <div class="view-card">
          <div class="view-card-hdr">
            <span class="view-card-title">Opmerkingen</span>
            <span class="kort-count-badge">{{ quotation.opmerkingen.length }}</span>
            <Button
              size="small"
              label="Toevoegen"
              icon="pi pi-plus"
              severity="secondary"
              text
              style="margin-left: auto"
            />
          </div>
          <DataTable :value="quotation.opmerkingen" class="ce-table">
            <Column header="Datum" field="datum" style="width: 11rem" />
            <Column header="Opmerking" field="tekst" />
            <Column header="Voor" style="width: 9rem">
              <template #body="{ data }">
                <span class="text-sm text-gray-600">{{ data.voor || '—' }}</span>
              </template>
            </Column>
            <Column header="Gebruiker" field="gebruiker" style="width: 10rem" />
            <template #empty>
              <span class="table-empty">Nog geen opmerkingen.</span>
            </template>
          </DataTable>
        </div>
      </template>

      <!-- ── Documenten ───────────────────────────────────────── -->
      <template v-else-if="activeTab === 'documenten'">
        <div class="view-card">
          <div class="view-card-hdr">
            <span class="view-card-title">Documenten</span>
            <span class="kort-count-badge">{{ quotation.documenten.length }}</span>
            <Button
              size="small"
              label="Toevoegen"
              icon="pi pi-plus"
              severity="secondary"
              text
              style="margin-left: auto"
            />
          </div>
          <DataTable :value="quotation.documenten" class="ce-table">
            <Column header="Naam" field="naam" />
            <Column header="Datum" field="datum" style="width: 10rem" />
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
  .comm-layout {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }

  .comm-tabbar {
    display: flex;
    border-bottom: 1px solid var(--p-gray-100);
    background: white;
    flex-shrink: 0;
    padding: 0 1rem;
  }
  .comm-tab {
    padding: 0.625rem 1rem;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--p-surface-500);
    font-weight: 500;
    transition:
      color 0.15s,
      border-color 0.15s;
    margin-bottom: -1px;
    white-space: nowrap;
  }
  .comm-tab:hover {
    color: var(--p-surface-700);
  }
  .comm-tab--active {
    color: var(--p-primary-600);
    border-bottom-color: var(--p-primary-500);
  }

  .comm-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    background: var(--p-surface-50);
  }
</style>
