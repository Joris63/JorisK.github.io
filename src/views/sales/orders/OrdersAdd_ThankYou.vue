<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const mode = computed(() => route.query.mode as 'quotation' | 'order');
  const orderNumber = computed(() => Number(route.query.order));

  // ── Confetti ─────────────────────────────────────────────────
  const confettiPieces = [
    { color: '#f59e0b', left: '6%', delay: '0s', h: '11px', w: '8px' },
    { color: '#3b82f6', left: '14%', delay: '0.15s', h: '14px', w: '6px' },
    { color: '#ef4444', left: '23%', delay: '0.3s', h: '8px', w: '10px' },
    { color: '#10b981', left: '33%', delay: '0.05s', h: '12px', w: '7px' },
    { color: '#8b5cf6', left: '42%', delay: '0.45s', h: '10px', w: '9px' },
    { color: '#f59e0b', left: '51%', delay: '0.2s', h: '9px', w: '8px' },
    { color: '#3b82f6', left: '61%', delay: '0.35s', h: '13px', w: '6px' },
    { color: '#ef4444', left: '70%', delay: '0.1s', h: '11px', w: '9px' },
    { color: '#10b981', left: '79%', delay: '0.4s', h: '8px', w: '7px' },
    { color: '#8b5cf6', left: '88%', delay: '0.55s', h: '12px', w: '8px' },
    { color: '#f59e0b', left: '10%', delay: '0.55s', h: '9px', w: '10px' },
    { color: '#3b82f6', left: '48%', delay: '0.25s', h: '11px', w: '7px' },
    { color: '#ef4444', left: '95%', delay: '0.6s', h: '10px', w: '9px' },
    { color: '#10b981', left: '28%', delay: '0.7s', h: '7px', w: '8px' },
    { color: '#8b5cf6', left: '75%', delay: '0.5s', h: '10px', w: '6px' },
    { color: '#f59e0b', left: '57%', delay: '0.8s', h: '8px', w: '9px' },
    { color: '#3b82f6', left: '19%', delay: '0.65s', h: '12px', w: '7px' },
    { color: '#ef4444', left: '85%', delay: '0.15s', h: '9px', w: '8px' },
  ];

  // ── Print drawer ─────────────────────────────────────────────
  const printOpen = ref(false);
  const printLetterhead = ref(false);
  const printProductCodes = ref(false);
  const printDiscount = ref(false);
  const printExclVat = ref(false);

  // ── Mail drawer ──────────────────────────────────────────────
  const mailOpen = ref(false);
  const mailProductCodes = ref(false);
  const mailDiscount = ref(false);
  const mailExclVat = ref(false);
  const mailContent = ref(
    'Hartelijk dank voor uw bestelling. Bijgaand vindt u de orderbevestiging.\n\nMet vriendelijke groet,\nHet team'
  );
</script>

<template>
  <div class="thank-you-page">
    <!-- Confetti -->
    <div class="confetti-container" aria-hidden="true">
      <div
        v-for="(p, i) in confettiPieces"
        :key="i"
        class="confetti-piece"
        :style="{
          left: p.left,
          backgroundColor: p.color,
          height: p.h,
          width: p.w,
          animationDelay: p.delay,
        }"
      />
    </div>

    <!-- Main content card -->
    <div class="content-card">
      <!-- Animated checkmark -->
      <div class="checkmark-wrap">
        <svg viewBox="0 0 52 52" fill="none" class="checkmark-svg">
          <circle class="circle-stroke" cx="26" cy="26" r="24" stroke-width="2" />
          <path
            class="check-stroke"
            d="M14 27l8 8 16-17"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <!-- Heading -->
      <div class="text-center">
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
          {{ mode === 'order' ? 'Bestelling geplaatst!' : 'Offerte opgeslagen!' }}
        </h1>
        <p class="mt-2 text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
          <template v-if="mode === 'order'">
            Top gedaan — de bestelling is verwerkt en de klant wordt op de hoogte gesteld.
          </template>
          <template v-else> De offerte staat klaar om naar de klant verstuurd te worden. </template>
        </p>
      </div>

      <!-- Order summary pill -->
      <div class="summary-pill">
        <div class="flex items-center gap-1.5">
          <span class="font-mono font-bold text-gray-800">#{{ orderNumber }}</span>
          <i
            class="pi pi-external-link text-xs text-gray-400 cursor-pointer hover:text-primary-500 transition-colors"
          />
        </div>
        <div class="pill-divider" />
        <i class="pi pi-calendar-clock text-xs text-gray-400 shrink-0" />
        <span class="text-xs text-gray-600">24 feb 2026</span>
        <div class="pill-divider" />
        <i class="pi pi-user text-xs text-gray-400 shrink-0" />
        <span class="text-xs text-gray-600">Jan de Vries</span>
        <div class="pill-divider" />
        <span class="text-sm font-semibold text-gray-900">€ 1.249,00</span>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <Button
          label="Bestelling printen"
          icon="pi pi-print"
          severity="secondary"
          variant="outlined"
          @click="printOpen = true"
        />
        <Button
          label="Bestelling mailen"
          icon="pi pi-envelope"
          severity="secondary"
          variant="outlined"
          @click="mailOpen = true"
        />
      </div>
    </div>

    <!-- ── Print drawer ──────────────────────────────────── -->
    <Drawer
      v-model:visible="printOpen"
      header="Bestelling printen"
      position="right"
      style="width: 22rem"
    >
      <div class="flex flex-col gap-5 px-1 pt-1">
        <p class="text-sm text-gray-500">Print PDF met:</p>
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <Checkbox v-model="printLetterhead" binary input-id="print-briefpapier" />
            <label for="print-briefpapier" class="text-sm cursor-pointer select-none"
              >Briefpapier</label
            >
          </div>
          <div class="flex items-center gap-3">
            <Checkbox v-model="printProductCodes" binary input-id="print-productcodes" />
            <label for="print-productcodes" class="text-sm cursor-pointer select-none"
              >Toon productcodes</label
            >
          </div>
          <div class="flex items-center gap-3">
            <Checkbox v-model="printDiscount" binary input-id="print-korting" />
            <label for="print-korting" class="text-sm cursor-pointer select-none"
              >Toon korting per product</label
            >
          </div>
          <div class="flex items-center gap-3">
            <Checkbox v-model="printExclVat" binary input-id="print-btw" />
            <label
              for="print-btw"
              class="text-sm cursor-pointer select-none flex items-center gap-1.5"
            >
              Toon exclusief BTW
              <i class="pi pi-info-circle text-xs text-gray-400" />
            </label>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex gap-2 w-full">
          <Button
            label="Annuleren"
            severity="secondary"
            variant="outlined"
            class="flex-1"
            @click="printOpen = false"
          />
          <Button label="Bestelling printen" icon="pi pi-print" class="flex-1" />
        </div>
      </template>
    </Drawer>

    <!-- ── Mail drawer ───────────────────────────────────── -->
    <Drawer
      v-model:visible="mailOpen"
      header="Bestelling mailen"
      position="right"
      style="width: 22rem"
    >
      <div class="flex flex-col gap-5 px-1 pt-1">
        <p class="text-sm text-gray-500">Print PDF met:</p>
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <Checkbox v-model="mailProductCodes" binary input-id="mail-productcodes" />
            <label for="mail-productcodes" class="text-sm cursor-pointer select-none"
              >Toon productcodes</label
            >
          </div>
          <div class="flex items-center gap-3">
            <Checkbox v-model="mailDiscount" binary input-id="mail-korting" />
            <label for="mail-korting" class="text-sm cursor-pointer select-none"
              >Toon korting per product</label
            >
          </div>
          <div class="flex items-center gap-3">
            <Checkbox v-model="mailExclVat" binary input-id="mail-btw" />
            <label
              for="mail-btw"
              class="text-sm cursor-pointer select-none flex items-center gap-1.5"
            >
              Toon exclusief BTW
              <i class="pi pi-info-circle text-xs text-gray-400" />
            </label>
          </div>
        </div>
        <Divider class="my-0!" />
        <div class="drw-field">
          <label class="drw-label"> Mail inhoud </label>
          <Textarea v-model="mailContent" rows="7" class="w-full text-sm" auto-resize />
        </div>
      </div>
      <template #footer>
        <div class="flex gap-2 w-full">
          <Button
            label="Annuleren"
            severity="secondary"
            variant="outlined"
            class="flex-1"
            @click="mailOpen = false"
          />
          <Button label="Bestelling mailen" icon="pi pi-envelope" class="flex-1" />
        </div>
      </template>
    </Drawer>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";
  .thank-you-page {
    background: linear-gradient(160deg, #f0fdf4 0%, #ffffff 45%, #eff6ff 100%);
    @apply relative flex flex-col grow items-center justify-center overflow-hidden;
  }

  .drw-field {
    @apply flex flex-col gap-1.5;
  }

  .drw-label {
    @apply font-medium text-(--p-surface-700) text-sm;
  }

  /* ── Confetti ──────────────────────────────────────────────── */
  .confetti-container {
    @apply absolute inset-0 pointer-events-none overflow-hidden;
  }

  .confetti-piece {
    animation: confetti-fall 3.2s ease-in forwards;
    @apply absolute top-[-16px] rounded-[3px];
  }

  @keyframes confetti-fall {
    0% {
      transform: translateY(0) rotateZ(0deg);
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      transform: translateY(800px) rotateZ(820deg);
      opacity: 0;
    }
  }

  /* ── Content card ─────────────────────────────────────────── */
  .content-card {
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.04),
      0 10px 40px -4px rgba(0, 0, 0, 0.08);
    @apply relative z-1 flex flex-col items-center bg-white border border-[#e5e7eb] rounded-[1.25rem] min-w-[480px] gap-6 py-10 px-12;
  }

  /* ── Animated checkmark ───────────────────────────────────── */
  .checkmark-wrap {
    filter: drop-shadow(0 4px 20px rgba(16, 185, 129, 0.4));
    @apply w-[88px] h-[88px];
  }

  .checkmark-svg {
    @apply w-full h-full;
  }

  .circle-stroke {
    stroke: #10b981;
    stroke-dasharray: 151;
    stroke-dashoffset: 151;
    transform-origin: center;
    transform: rotate(-90deg);
    animation: draw-circle 0.65s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards;
  }

  .check-stroke {
    stroke: #10b981;
    stroke-dasharray: 36;
    stroke-dashoffset: 36;
    animation: draw-check 0.35s ease-out 0.75s forwards;
  }

  @keyframes draw-circle {
    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes draw-check {
    to {
      stroke-dashoffset: 0;
    }
  }

  /* ── Summary pill ─────────────────────────────────────────── */
  .summary-pill {
    @apply flex items-center bg-[#f9fafb] border border-[#e5e7eb] rounded-full gap-3 py-3 px-5 text-sm;
  }

  .pill-divider {
    @apply w-px h-[14px] bg-[#d1d5db] shrink-0;
  }
</style>
