<script setup lang="ts">
  import { ref, computed, inject } from 'vue';
  import type { Ref } from 'vue';
  import type { CustomerData } from '@/types/customer';

  const customer = inject<Ref<CustomerData>>('customer')!;

  const deliveredUnpaidOpen = ref(true);
  const reservedCreditOpen = ref(true);
  const creditScheduledOpen = ref(true);
  const creditIncomingOpen = ref(true);

  const deliveredUnpaidTotal = computed(() =>
    customer.value.deliveredUnpaid.reduce((s, i) => s + i.value, 0)
  );
  const isOverdue = computed(() =>
    customer.value.deliveredUnpaid
      .filter((i) => i.isOverdue)
      .reduce((s, i) => s + i.value, 0)
  );
  const reservedCreditTotal = computed(() =>
    customer.value.reservedCreditItems.reduce((s, i) => s + i.value, 0)
  );
  const creditScheduledTotal = computed(() =>
    customer.value.creditScheduled.reduce((s, i) => s + i.value, 0)
  );
  const creditIncomingTotal = computed(() =>
    customer.value.creditIncoming.reduce((s, i) => s + i.value, 0)
  );
  const creditRemaining = computed(
    () =>
      customer.value.creditLimit -
      deliveredUnpaidTotal.value -
      reservedCreditTotal.value
  );
</script>

<template>
  <div class="tab-scroll">
    <!-- Summary overview -->
    <div class="view-card">
      <div class="view-card-hdr">
        <span class="view-card-title">Overzicht</span>
      </div>
      <div class="kred-summary">
        <div class="kred-summary-col">
          <div class="kred-summary-hdr">Kredietlimiet overzicht</div>
          <div class="kred-sum-row">
            <span>Kredietlimiet</span>
            <span>€ {{ customer.creditLimit.toFixed(2) }}</span>
          </div>
          <div class="kred-sum-row">
            <span>Geleverd maar niet betaald</span>
            <span>€ {{ deliveredUnpaidTotal.toFixed(2) }}</span>
          </div>
          <div class="kred-sum-row">
            <span>Gereserveerd krediet</span>
            <span>€ {{ reservedCreditTotal.toFixed(2) }}</span>
          </div>
          <div class="kred-sum-row kred-sum-row--total">
            <span>Krediet resterend</span>
            <span>€ {{ creditRemaining.toFixed(2) }}</span>
          </div>
        </div>
        <div class="kred-summary-sep" />
        <div class="kred-summary-col">
          <div class="kred-summary-hdr">Aankomende leveringen</div>
          <div class="kred-sum-row">
            <span>Ingeplande leveringen</span>
            <span>€ {{ creditScheduledTotal.toFixed(2) }}</span>
          </div>
          <div class="kred-sum-row">
            <span>Aankomende leveringen</span>
            <span>€ {{ creditIncomingTotal.toFixed(2) }}</span>
          </div>
        </div>
        <div class="kred-summary-sep" />
        <div class="kred-summary-col">
          <div class="kred-summary-hdr">Bestellingen overzicht</div>
          <div class="kred-sum-row">
            <span>Gefactureerd</span>
            <span>€ {{ deliveredUnpaidTotal.toFixed(2) }}</span>
          </div>
          <div class="kred-sum-row kred-sum-row--warn">
            <span>Vervaldatum overschreden</span>
            <span>€ {{ isOverdue.toFixed(2) }}</span>
          </div>
          <div class="kred-sum-row kred-sum-row--total">
            <span>Krediet resterend</span>
            <span>€ {{ creditRemaining.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Geleverd maar niet betaald -->
    <div id="kred-geleverd" class="view-card">
      <div class="view-card-hdr">
        <div class="flex items-center gap-2">
          <span class="view-card-title">Geleverd maar niet betaald</span>
          <span class="kort-count-badge">{{ customer.deliveredUnpaid.length }}</span>
        </div>
        <Button
          :icon="deliveredUnpaidOpen ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
          size="small"
          severity="secondary"
          text
          @click="deliveredUnpaidOpen = !deliveredUnpaidOpen"
        />
      </div>
      <Transition name="card-fade">
        <div v-if="deliveredUnpaidOpen">
          <DataTable :value="customer.deliveredUnpaid" class="ce-table">
            <template #empty><span class="table-empty">Geen resultaten gevonden</span></template>
            <Column field="delivery" header="Levering" />
            <Column field="invoiceNumber" header="Factuurnummer" />
            <Column field="invoiceDate" header="Factuurdatum" />
            <Column field="dueDate" header="Vervaldatum" />
            <Column field="value" header="Waarde" body-class="col-right">
              <template #body="{ data }">€ {{ data.value.toFixed(2) }}</template>
            </Column>
            <template #footer>
              <div class="kred-table-footer">
                <div class="kred-footer-row">
                  <span>Totaal</span>
                  <span>€ {{ deliveredUnpaidTotal.toFixed(2) }}</span>
                </div>
                <div class="kred-footer-row kred-footer-row--warn">
                  <span>Vervaldatum overschreden</span>
                  <span>€ {{ isOverdue.toFixed(2) }}</span>
                </div>
              </div>
            </template>
          </DataTable>
        </div>
      </Transition>
    </div>

    <!-- Gereserveerd krediet -->
    <div id="kred-gereserveerd" class="view-card">
      <div class="view-card-hdr">
        <div class="flex items-center gap-2">
          <span class="view-card-title">Gereserveerd krediet</span>
          <span class="kort-count-badge">{{ customer.reservedCreditItems.length }}</span>
        </div>
        <Button
          :icon="reservedCreditOpen ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
          size="small"
          severity="secondary"
          text
          @click="reservedCreditOpen = !reservedCreditOpen"
        />
      </div>
      <Transition name="card-fade">
        <div v-if="reservedCreditOpen">
          <DataTable :value="customer.reservedCreditItems" class="ce-table">
            <template #empty><span class="table-empty">Geen resultaten gevonden</span></template>
            <Column field="delivery" header="Levering" />
            <Column field="status" header="Status" />
            <Column field="dropshipping" header="Dropshipping">
              <template #body="{ data }">
                <i
                  :class="
                    data.dropshipping
                      ? 'pi pi-check text-green-500'
                      : 'pi pi-minus text-surface-300'
                  "
                />
              </template>
            </Column>
            <Column field="scheduledDate" header="Ingeplande datum" />
            <Column field="value" header="Waarde" body-class="col-right">
              <template #body="{ data }">€ {{ data.value.toFixed(2) }}</template>
            </Column>
            <template #footer>
              <div class="kred-table-footer">
                <div class="kred-footer-row">
                  <span>Totaal</span>
                  <span>€ {{ reservedCreditTotal.toFixed(2) }}</span>
                </div>
              </div>
            </template>
          </DataTable>
        </div>
      </Transition>
    </div>

    <!-- Ingeplande leveringen -->
    <div id="kred-ingepland" class="view-card">
      <div class="view-card-hdr">
        <div class="flex items-center gap-2">
          <span class="view-card-title">Ingeplande leveringen</span>
          <span class="kort-count-badge">{{ customer.creditScheduled.length }}</span>
        </div>
        <Button
          :icon="creditScheduledOpen ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
          size="small"
          severity="secondary"
          text
          @click="creditScheduledOpen = !creditScheduledOpen"
        />
      </div>
      <Transition name="card-fade">
        <div v-if="creditScheduledOpen">
          <DataTable :value="customer.creditScheduled" class="ce-table">
            <template #empty><span class="table-empty">Geen resultaten gevonden</span></template>
            <Column field="delivery" header="Levering" />
            <Column field="status" header="Status" />
            <Column field="completed" header="Voltooid">
              <template #body="{ data }">
                <i
                  :class="
                    data.completed ? 'pi pi-check text-green-500' : 'pi pi-minus text-surface-300'
                  "
                />
              </template>
            </Column>
            <Column field="scheduledDate" header="Ingeplande datum" />
            <Column field="value" header="Waarde" body-class="col-right">
              <template #body="{ data }">€ {{ data.value.toFixed(2) }}</template>
            </Column>
            <template #footer>
              <div class="kred-table-footer">
                <div class="kred-footer-row">
                  <span>Totaal</span>
                  <span>€ {{ creditScheduledTotal.toFixed(2) }}</span>
                </div>
              </div>
            </template>
          </DataTable>
        </div>
      </Transition>
    </div>

    <!-- Aankomende leveringen -->
    <div id="kred-aankomend" class="view-card">
      <div class="view-card-hdr">
        <div class="flex items-center gap-2">
          <span class="view-card-title">Aankomende leveringen</span>
          <span class="kort-count-badge">{{ customer.creditIncoming.length }}</span>
        </div>
        <Button
          :icon="creditIncomingOpen ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
          size="small"
          severity="secondary"
          text
          @click="creditIncomingOpen = !creditIncomingOpen"
        />
      </div>
      <Transition name="card-fade">
        <div v-if="creditIncomingOpen">
          <DataTable :value="customer.creditIncoming" class="ce-table">
            <template #empty><span class="table-empty">Geen resultaten gevonden</span></template>
            <Column field="delivery" header="Levering" />
            <Column field="scheduledDate" header="Ingeplande datum" />
            <Column field="value" header="Waarde" body-class="col-right">
              <template #body="{ data }">€ {{ data.value.toFixed(2) }}</template>
            </Column>
            <template #footer>
              <div class="kred-table-footer">
                <div class="kred-footer-row">
                  <span>Totaal</span>
                  <span>€ {{ creditIncomingTotal.toFixed(2) }}</span>
                </div>
              </div>
            </template>
          </DataTable>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";
  .kred-summary {
    grid-template-columns: 1fr auto 1fr auto 1fr;
    @apply grid gap-0 p-5;
  }
  .kred-summary-sep {
    @apply w-px bg-(--p-gray-100) mx-6;
  }
  .kred-summary-hdr {
    @apply font-semibold uppercase tracking-[0.05em] text-(--p-surface-400) text-xs mb-3;
  }
  .kred-sum-row {
    @apply flex justify-between items-center text-(--p-surface-600) border-b border-(--p-gray-100) text-base py-1;
  }
  .kred-sum-row:last-child {
    @apply border-b-0;
  }
  .kred-sum-row--total {
    @apply font-semibold text-(--p-surface-800);
  }
  .kred-sum-row--warn span:last-child {
    @apply text-(--p-red-500);
  }
  .kred-table-footer {
    @apply py-2.5 px-4;
  }
  .kred-footer-row {
    @apply flex justify-between text-(--p-surface-600) text-base py-0.5;
  }
  .kred-footer-row:first-child {
    @apply font-semibold text-(--p-surface-800);
  }
  .kred-footer-row--warn {
    @apply text-(--p-red-500)! font-medium;
  }
</style>
