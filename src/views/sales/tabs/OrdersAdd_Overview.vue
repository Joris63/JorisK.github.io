<script setup lang="ts">
  import { useOrderCart } from '@/composables/useOrderCart';
  import OrderCartTotals from './OrderCartTotals.vue';

  const { nonEmptyGroups, firstProductImage, cartItemCount } = useOrderCart();

  const mockCustomer = {
    naam: 'Joris Kamminga',
    adres: { straat: 'Verdiplein 80', postcode: '5049NP', stad: 'Tilburg', land: 'Nederland' },
    email: 'joris.kamminga@sawiday.com',
    telefoon: '0683626242',
    voorkeuren: { nieuwsbrief: false, accountAanmaken: false },
  };

  const mockKanaal = {
    kanaal: 'showroom',
    vestiging: 'Rosmalen',
    gebruiker: 'Joris Kamminga',
  };

  const indicatieDatum = '26-02-2026';
</script>

<template>
  <StepPanel v-slot="{ activateCallback }" :value="3" class="flex flex-col grow ov-step bg-transparent!">
    <!-- ── Scrollable card area ──────────────────────────────── -->
    <div class="ov-body">

      <!-- Card 1: Aanbod -->
      <div class="view-card ov-card">
        <div class="view-card-hdr">
          <div class="flex items-center gap-2">
            <i class="pi pi-shopping-cart" style="color: var(--p-primary-400); font-size: 0.8125rem" />
            <span class="view-card-title">Aanbod</span>
          </div>
          <Button
            icon="pi pi-pencil"
            variant="text"
            severity="secondary"
            size="small"
            rounded
            class="ov-edit-btn"
            @click="activateCallback(1)"
          />
        </div>
        <div class="view-card-body">
          <div class="flex items-center gap-4">
            <div class="w-11 h-11 rounded-lg shrink-0 overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
              <img v-if="firstProductImage" :src="firstProductImage" alt="Product" class="w-full h-full object-cover" />
              <i v-else class="pi pi-image text-gray-300" style="font-size: 1rem" />
            </div>
            <div class="flex flex-col gap-1.5 flex-1">
              <span class="font-semibold text-sm">
                {{ cartItemCount }} product{{ cartItemCount !== 1 ? 'en' : '' }}
              </span>
              <div class="flex items-center gap-1.5 flex-wrap">
                <div
                  v-for="g in nonEmptyGroups"
                  :key="g.id"
                  class="flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium"
                  :class="g.id === '0'
                    ? 'bg-gray-100 border-gray-200 text-gray-600'
                    : 'bg-primary-50 border-primary-200 text-primary-700'"
                >
                  <i class="pi pi-folder" style="font-size: 0.6rem" />
                  <span>{{ g.name }}</span>
                  <span class="opacity-50">({{ g.items.length }})</span>
                </div>
              </div>
            </div>
            <div class="text-right shrink-0">
              <div class="text-xs text-gray-400 font-medium mb-0.5 uppercase tracking-wide">Eerst mogelijke datum</div>
              <div class="text-sm font-bold text-primary-700">{{ indicatieDatum }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Row: Gegevens + Kanaal -->
      <div class="ov-two-col">

        <!-- Card 2: Je gegevens -->
        <div class="view-card ov-card">
          <div class="view-card-hdr">
            <div class="flex items-center gap-2">
              <i class="pi pi-user" style="color: var(--p-primary-400); font-size: 0.8125rem" />
              <span class="view-card-title">Je gegevens</span>
            </div>
            <Button
              icon="pi pi-pencil"
              variant="text"
              severity="secondary"
              size="small"
              rounded
              class="ov-edit-btn"
              @click="activateCallback(2)"
            />
          </div>
          <div class="view-card-body">
            <div class="fr-row">
              <span class="fr-label">Naam</span>
              <div class="flex items-center gap-1">
                <span class="fr-value text-primary">{{ mockCustomer.naam }}</span>
                <Button icon="pi pi-copy" variant="text" size="small" rounded class="copy-btn" />
              </div>
            </div>
            <div class="fr-row fr-row--top">
              <span class="fr-label">Adres</span>
              <div class="fr-value flex flex-col leading-relaxed">
                <span>{{ mockCustomer.adres.straat }}</span>
                <span>{{ mockCustomer.adres.postcode }} {{ mockCustomer.adres.stad }}</span>
                <span>{{ mockCustomer.adres.land }}</span>
              </div>
            </div>
            <div class="fr-row">
              <span class="fr-label">E-mail</span>
              <div class="flex items-center gap-1">
                <span class="fr-value text-primary">{{ mockCustomer.email }}</span>
                <Button icon="pi pi-copy" variant="text" size="small" rounded class="copy-btn" />
              </div>
            </div>
            <div class="fr-row">
              <span class="fr-label">Telefoonnummer</span>
              <div class="flex items-center gap-1">
                <span class="fr-value">{{ mockCustomer.telefoon }}</span>
                <Button icon="pi pi-copy" variant="text" size="small" rounded class="copy-btn" />
              </div>
            </div>
            <div class="fr-row fr-row--top">
              <span class="fr-label">Voorkeuren</span>
              <div class="fr-value flex flex-col gap-0.5">
                <div class="flex gap-6">
                  <span class="text-gray-500 w-32">Nieuwsbrief</span>
                  <span>{{ mockCustomer.voorkeuren.nieuwsbrief ? 'Ja' : 'Nee' }}</span>
                </div>
                <div class="flex gap-6">
                  <span class="text-gray-500 w-32">Account aanmaken</span>
                  <span>{{ mockCustomer.voorkeuren.accountAanmaken ? 'Ja' : 'Nee' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 3: Kanaal -->
        <div class="view-card ov-card">
          <div class="view-card-hdr">
            <div class="flex items-center gap-2">
              <i class="pi pi-send" style="color: var(--p-primary-400); font-size: 0.8125rem" />
              <span class="view-card-title">Kanaal</span>
            </div>
            <Button
              icon="pi pi-pencil"
              variant="text"
              severity="secondary"
              size="small"
              rounded
              class="ov-edit-btn"
              @click="activateCallback(2)"
            />
          </div>
          <div class="view-card-body">
            <div class="fr-row">
              <span class="fr-label">Kanaal</span>
              <span class="fr-value text-primary capitalize">{{ mockKanaal.kanaal }}</span>
            </div>
            <div class="fr-row">
              <span class="fr-label">Vestiging</span>
              <span class="fr-value">{{ mockKanaal.vestiging }}</span>
            </div>
            <div class="fr-row">
              <span class="fr-label">Gebruiker</span>
              <span class="fr-value">{{ mockKanaal.gebruiker }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Card 4: Totals -->
      <OrderCartTotals />

    </div>

  </StepPanel>
</template>

<style scoped>
  /* ── Step wrapper ─────────────────────────────────────────── */
  .ov-step {
    background: var(--p-surface-50) !important;
  }

  /* ── Scrollable card area ─────────────────────────────────── */
  .ov-body {
    flex: 1;
    overflow-y: auto;
    background: transparent;
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    min-height: 0;
  }

  /* override view-card margin since we use gap */
  .ov-card {
    margin-bottom: 0 !important;
  }

  /* ── Two-column row ───────────────────────────────────────── */
  .ov-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.875rem;
  }

  /* ── Footer ───────────────────────────────────────────────── */
  .ov-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.875rem 1.25rem;
    border-top: 1px solid var(--p-gray-200);
    flex-shrink: 0;
  }

  /* ── Edit button in card header ───────────────────────────── */
  .ov-edit-btn {
    width: 1.75rem !important;
    height: 1.75rem !important;
    min-width: 0 !important;
    padding: 0 !important;
    color: var(--p-gray-400) !important;
  }

  .ov-edit-btn:hover {
    color: var(--p-gray-700) !important;
  }

  /* ── Copy button ──────────────────────────────────────────── */
  .copy-btn {
    width: 1.375rem !important;
    height: 1.375rem !important;
    min-width: 0 !important;
    padding: 0 !important;
    color: var(--p-gray-400) !important;
    font-size: 0.7rem !important;
  }

</style>
