<script setup lang="ts">
  import { ref } from 'vue';
  import { useOrderCart } from '@/composables/useOrderCart';
  import OrderCartTotals from './OrderCartTotals.vue';

  // ── Section nav ──────────────────────────────────────────────
  const sectionAanbod = ref<HTMLElement | null>(null);
  const sectionGegevens = ref<HTMLElement | null>(null);
  const sectionKanaal = ref<HTMLElement | null>(null);

  function scrollTo(el: HTMLElement | null) {
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ── Cart state from shared composable ───────────────────────
  const { nonEmptyGroups, firstProductImage, cartItemCount, finalizeMode } = useOrderCart();

  // ── Mock: customer + channel (still static) ──────────────────
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
  <StepPanel v-slot="{ activateCallback }" :value="3" class="flex flex-col grow">
    <!-- Content -->
    <div class="flex grow gap-10 pt-2">
      <!-- Section nav -->
      <aside class="sticky top-6 self-start flex flex-col gap-1 w-36 shrink-0 pt-1">
        <button class="section-nav-item" @click="scrollTo(sectionAanbod)">Aanbod</button>
        <button class="section-nav-item" @click="scrollTo(sectionGegevens)">Je gegevens</button>
        <button class="section-nav-item" @click="scrollTo(sectionKanaal)">Kanaal</button>
      </aside>

      <!-- Main content -->
      <div class="flex flex-col gap-4 flex-1 min-w-0 pb-4">
        <!-- ── Aanbod card ──────────────────────────────────── -->
        <section ref="sectionAanbod">
          <div class="aanbod-card rounded-lg overflow-hidden">
            <div class="flex items-center justify-end px-4 py-2 aanbod-card__header">
              <Button
                icon="pi pi-pencil"
                variant="text"
                size="small"
                rounded
                class="aanbod-card__edit-btn"
                @click="activateCallback(1)"
              />
            </div>
            <div class="flex items-center gap-5 px-6 py-4">
              <div
                class="w-14 h-14 rounded-lg shrink-0 overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center"
              >
                <img
                  v-if="firstProductImage"
                  :src="firstProductImage"
                  alt="Product"
                  class="w-full h-full object-cover"
                />
                <i v-else class="pi pi-image text-gray-300 text-lg" />
              </div>
              <div class="flex flex-col gap-1.5 flex-1">
                <span class="font-semibold">
                  {{ cartItemCount }} Product{{ cartItemCount !== 1 ? 'en' : '' }}
                </span>
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span
                    v-for="g in nonEmptyGroups"
                    :key="g.id"
                    :class="
                      g.id === '0'
                        ? 'aanbod-card__group-badge--default'
                        : 'aanbod-card__group-badge'
                    "
                  >
                    {{ g.name }}
                    <span class="opacity-60 ml-0.5">({{ g.items.length }})</span>
                  </span>
                </div>
              </div>
              <div
                class="text-right shrink-0 bg-white border border-primary-200 rounded-lg px-4 py-2.5"
              >
                <div class="text-xs text-primary-400 font-medium mb-0.5 uppercase tracking-wide">
                  Eerst mogelijke datum
                </div>
                <div class="text-lg font-bold text-primary-700">{{ indicatieDatum }}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- ── Je gegevens card ─────────────────────────────── -->
        <section ref="sectionGegevens">
          <div class="section-card rounded-lg overflow-hidden">
            <div class="section-card__header">
              <span class="font-semibold text-sm">Je gegevens</span>
              <Button
                icon="pi pi-pencil"
                variant="text"
                severity="secondary"
                size="small"
                rounded
                class="section-card__edit-btn"
                @click="activateCallback(2)"
              />
            </div>
            <div class="px-5 py-4 flex flex-col gap-3.5">
              <div class="grid grid-cols-[180px_1fr] gap-2 text-sm">
                <span class="text-gray-500">Naam</span>
                <div class="flex items-center gap-1">
                  <span class="text-primary">{{ mockCustomer.naam }}</span>
                  <Button
                    icon="pi pi-copy"
                    variant="text"
                    size="small"
                    rounded
                    class="w-6! h-6! p-0! min-w-0! text-gray-400"
                  />
                </div>
              </div>
              <div class="grid grid-cols-[180px_1fr] gap-2 text-sm">
                <span class="text-gray-500">Adres</span>
                <div class="flex flex-col leading-relaxed">
                  <span>{{ mockCustomer.adres.straat }}</span>
                  <span>{{ mockCustomer.adres.postcode }} {{ mockCustomer.adres.stad }}</span>
                  <span>{{ mockCustomer.adres.land }}</span>
                </div>
              </div>
              <div class="grid grid-cols-[180px_1fr] gap-2 text-sm">
                <span class="text-gray-500">E-mail</span>
                <div class="flex items-center gap-1">
                  <span class="text-primary">{{ mockCustomer.email }}</span>
                  <Button
                    icon="pi pi-copy"
                    variant="text"
                    size="small"
                    rounded
                    class="w-6! h-6! p-0! min-w-0! text-gray-400"
                  />
                </div>
              </div>
              <div class="grid grid-cols-[180px_1fr] gap-2 text-sm">
                <span class="text-gray-500">Telefoonnummer</span>
                <div class="flex items-center gap-1">
                  <span>{{ mockCustomer.telefoon }}</span>
                  <Button
                    icon="pi pi-copy"
                    variant="text"
                    size="small"
                    rounded
                    class="w-6! h-6! p-0! min-w-0! text-gray-400"
                  />
                </div>
              </div>
              <div class="grid grid-cols-[180px_1fr] gap-2 text-sm">
                <span class="text-gray-500">Voorkeuren</span>
                <div class="flex flex-col gap-1">
                  <div class="flex gap-8">
                    <span class="text-gray-500 w-32">Nieuwsbrief</span>
                    <span>{{ mockCustomer.voorkeuren.nieuwsbrief ? 'Ja' : 'Nee' }}</span>
                  </div>
                  <div class="flex gap-8">
                    <span class="text-gray-500 w-32">Account aanmaken</span>
                    <span>{{ mockCustomer.voorkeuren.accountAanmaken ? 'Ja' : 'Nee' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ── Kanaal card ──────────────────────────────────── -->
        <section ref="sectionKanaal">
          <div class="section-card rounded-lg overflow-hidden">
            <div class="section-card__header">
              <span class="font-semibold text-sm">Kanaal</span>
              <Button
                icon="pi pi-pencil"
                variant="text"
                severity="secondary"
                size="small"
                rounded
                class="section-card__edit-btn"
                @click="activateCallback(2)"
              />
            </div>
            <div class="px-5 py-4 flex flex-col gap-3.5">
              <div class="grid grid-cols-[180px_1fr] gap-2 text-sm">
                <span class="text-gray-500">Kanaal</span>
                <span class="text-primary capitalize">{{ mockKanaal.kanaal }}</span>
              </div>
              <div class="grid grid-cols-[180px_1fr] gap-2 text-sm">
                <span class="text-gray-500">Vestiging</span>
                <span>{{ mockKanaal.vestiging }}</span>
              </div>
              <div class="grid grid-cols-[180px_1fr] gap-2 text-sm">
                <span class="text-gray-500">Gebruiker</span>
                <span>{{ mockKanaal.gebruiker }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Price summary -->
        <OrderCartTotals />
      </div>
    </div>

    <!-- ── Footer ───────────────────────────────────────────── -->
    <div class="mt-4 flex flex-col gap-3">
      <!-- Navigation buttons -->
      <div class="flex justify-between items-center">
        <Button
          label="Terug"
          class="btn-back"
          icon="pi pi-arrow-left"
          @click="activateCallback(2)"
        />
        <Button
          label="Volgende"
          severity="secondary"
          icon="pi pi-arrow-right"
          icon-pos="right"
          @click="
            () => {
              finalizeMode = null;
              activateCallback(4);
            }
          "
        />
      </div>
    </div>
  </StepPanel>
</template>

<style scoped>
  /* ── Aanbod card — mirrors panel-primary accordion style ──── */
  .aanbod-card {
    border: 1px solid var(--p-primary-300);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }

  .aanbod-card__header {
    background: var(--p-primary-100);
    border-bottom: 1px solid var(--p-primary-300);
  }

  .aanbod-card__edit-btn {
    color: var(--p-primary-600) !important;
    transition: color 0.15s ease;
  }

  .aanbod-card__edit-btn:hover {
    color: var(--p-primary-800) !important;
  }

  .aanbod-card__group-badge,
  .aanbod-card__group-badge--default {
    display: inline-flex;
    align-items: center;
    padding: 0.125rem 0.625rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .aanbod-card__group-badge {
    background: var(--p-primary-200);
    color: var(--p-primary-900);
  }

  .aanbod-card__group-badge--default {
    background: var(--p-gray-200);
    color: var(--p-gray-700);
  }

  /* ── Section cards (Je gegevens / Kanaal) ─────────────────── */
  .section-card {
    border: 1px solid var(--p-gray-200);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .section-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem 1rem;
    background: var(--p-gray-50);
    border-bottom: 1px solid var(--p-gray-200);
  }

  .section-card__edit-btn {
    width: 1.75rem !important;
    height: 1.75rem !important;
    min-width: 0 !important;
    padding: 0 !important;
    color: var(--p-gray-400) !important;
    transition: color 0.15s ease !important;
  }

  .section-card__edit-btn:hover {
    color: var(--p-gray-700) !important;
  }

  /* ── Section nav ─────────────────────────────────────────── */
  .section-nav-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.625rem;
    border-radius: 0.375rem;
    font-size: 0.8125rem;
    color: var(--p-surface-400);
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
    width: 100%;
    transition:
      color 0.15s ease,
      background 0.15s ease;
  }

  .section-nav-item::before {
    content: '›';
    font-size: 1.1rem;
    line-height: 1;
    flex-shrink: 0;
  }

  .section-nav-item:hover {
    color: var(--p-surface-700);
    background: var(--p-surface-100);
  }

  .section-nav-item--active {
    color: var(--p-primary-700);
    background: var(--p-primary-50);
    font-weight: 600;
  }

  .section-nav-item--active::before {
    color: var(--p-primary-400);
  }
</style>
