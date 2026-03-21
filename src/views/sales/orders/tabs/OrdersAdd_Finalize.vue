<script setup lang="ts">
import { computed } from 'vue';
import { useOrderCart } from '@/composables/useOrderCart';
import OrderCartTotals from './OrderCartTotals.vue';
import AddPageNav from '@/components/layout/AddPageNav.vue';
import FinalizeSection_Planning from '../components/finalize/FinalizeSection_Planning.vue';
import FinalizeSection_Delivery from '../components/finalize/FinalizeSection_Delivery.vue';
import FinalizeSection_Appointments from '../components/finalize/FinalizeSection_Appointments.vue';
import FinalizeSection_Payment from '../components/finalize/FinalizeSection_Payment.vue';

const { finalizeMode } = useOrderCart();

const navItems = computed(() =>
  finalizeMode.value === 'quotation'
    ? [
        { id: 'planning', label: 'Planning', description: 'Datum en aannemer' },
        { id: 'afspraken', label: 'Afspraken', description: 'Notities en taken' },
        { id: 'afronding', label: 'Afronding', description: 'Offerte mail' },
      ]
    : finalizeMode.value === 'order'
      ? [
          { id: 'planning', label: 'Planning', description: 'Datum en aannemer' },
          { id: 'levering', label: 'Levering', description: 'Bezorgmethode' },
          { id: 'betaalmethode', label: 'Betaalmethode', description: 'Betaalwijze' },
          { id: 'afspraken', label: 'Afspraken', description: 'Notities en taken' },
          { id: 'voorwaarden', label: 'Voorwaarden', description: 'Extra voorwaarden' },
        ]
      : [
          { id: 'planning', label: 'Planning', description: 'Datum en aannemer' },
          { id: 'afspraken', label: 'Afspraken', description: 'Notities en taken' },
        ]
);
</script>

<template>
  <StepPanel :value="4" class="flex flex-col grow view-card p-5">
    <!-- ── Choice screen (no mode selected yet) ──────────────── -->
    <div
      v-if="finalizeMode === null"
      class="flex flex-col items-center justify-center grow gap-6 py-8"
    >
      <p class="text-sm text-gray-500">Hoe wil je doorgaan met dit overzicht?</p>
      <div class="flex gap-4">
        <button class="choice-card" @click="finalizeMode = 'quotation'">
          <i class="pi pi-file-edit choice-card__icon" style="font-size: 2.5rem" />
          <span class="choice-card__title">Opslaan</span>
          <span class="choice-card__desc">Sla op als aanbieding voor de klant</span>
        </button>
        <button class="choice-card" @click="finalizeMode = 'order'">
          <i class="pi pi-shopping-cart choice-card__icon" style="font-size: 2.5rem" />
          <span class="choice-card__title">Bestelling plaatsen</span>
          <span class="choice-card__desc">Verwerk en bevestig de bestelling direct</span>
        </button>
      </div>
    </div>

    <!-- ── Form (mode chosen) ─────────────────────────────────── -->
    <div v-else class="flex grow items-start">
      <!-- Section nav -->
      <AddPageNav :sections="navItems">
        <Divider class="my-3!" />
        <div class="px-3">
          <button class="change-mind-btn" @click="finalizeMode = null">
            Toch van mening veranderd?
          </button>
        </div>
      </AddPageNav>

      <!-- Main content -->
      <div class="flex flex-col flex-1 min-w-0 py-2 pl-5 border-l border-gray-100">
        <!-- ── Planning ────────────────────────────────────────── -->
        <section id="planning" class="add-section">
          <div class="add-section-hdr">
            <i class="pi pi-calendar add-section-icon" />
            <div class="add-section-title">Planning</div>
          </div>
          <FinalizeSection_Planning />
        </section>

        <!-- ── Levering (bestelling only) ─────────────────────── -->
        <section v-if="finalizeMode === 'order'" id="levering" class="add-section">
          <div class="add-section-hdr">
            <i class="pi pi-truck add-section-icon" />
            <div class="add-section-title">Levering</div>
          </div>
          <FinalizeSection_Delivery />
        </section>

        <!-- ── Betaalmethode (bestelling only) ────────────────── -->
        <section v-if="finalizeMode === 'order'" id="betaalmethode" class="add-section">
          <div class="add-section-hdr">
            <i class="pi pi-credit-card add-section-icon" />
            <div class="add-section-title">Betaalmethode</div>
          </div>
          <FinalizeSection_Payment />
        </section>

        <!-- ── Afspraken ───────────────────────────────────────── -->
        <section id="afspraken" class="add-section">
          <div class="add-section-hdr">
            <i class="pi pi-comment add-section-icon" />
            <div class="add-section-title">Afspraken</div>
          </div>
          <FinalizeSection_Appointments />
        </section>

        <!-- ── Afronding (offerte only) ────────────────────────── -->
        <section v-if="finalizeMode === 'quotation'" id="afronding" class="add-section">
          <div class="add-section-hdr">
            <i class="pi pi-check-circle add-section-icon" />
            <div class="add-section-title">Afronding</div>
          </div>
          <div>
            <div class="form-row items-center">
              <span class="form-label">Automatische offerte mail</span>
              <div class="flex items-center gap-2.5">
                <ToggleSwitch :model-value="true" />
                <span class="text-sm text-gray-500">
                  Moet er een automatische offerte mail verstuurd worden?
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- ── Voorwaarden (bestelling only) ──────────────────── -->
        <section v-if="finalizeMode === 'order'" id="voorwaarden" class="add-section">
          <div class="add-section-hdr">
            <i class="pi pi-file add-section-icon" />
            <div class="add-section-title">Voorwaarden</div>
          </div>
          <div>
            <div class="form-row items-center">
              <span class="form-label">Extra voorwaarden</span>
              <Button label="Kies voorwaarden" class="btn-outlined" />
            </div>
          </div>
        </section>

        <!-- Price summary -->
        <Divider class="my-0!" />
        <div class="py-6">
          <OrderCartTotals v-if="finalizeMode !== null" />
        </div>
      </div>
    </div>
    <!-- end v-else form -->
  </StepPanel>
</template>

<style scoped>
@reference "@/assets/style.css";
/* ── Form layout ──────────────────────────────────────────── */
.form-row {
  grid-template-columns: 220px 1fr;
  @apply grid gap-2;
}

.form-label {
  @apply text-(--p-gray-500) text-sm pt-1.5;
}

/* ── Choice cards ────────────────────────────────────────── */
.choice-card {
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    background 0.15s ease;
  @apply flex flex-col items-center justify-center w-[300px] h-[300px] rounded-xl border-2 border-(--p-gray-200) bg-white cursor-pointer text-center gap-3 py-8 px-6;
}

.choice-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  @apply border-[var(--p-primary-400)] bg-[var(--p-primary-50)];
}

.choice-card__icon {
  @apply text-[var(--p-primary-500)];
}

.choice-card__title {
  @apply font-semibold text-(--p-gray-800) text-base;
}

.choice-card__desc {
  @apply text-(--p-gray-500) leading-[1.4] text-sm;
}

/* ── Change-mind link ─────────────────────────────────────── */
.change-mind-btn {
  transition:
    color 0.15s ease,
    background 0.15s ease;
  @apply border-0 bg-transparent cursor-pointer text-[var(--p-primary-500)] text-left leading-[1.4] rounded underline underline-offset-2 decoration-[var(--p-primary-300)] py-1.5 px-2 text-sm;
}

.change-mind-btn:hover {
  @apply text-[var(--p-primary-700)] bg-[var(--p-primary-50)] decoration-[var(--p-primary-500)];
}
</style>
