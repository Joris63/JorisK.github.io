<script setup lang="ts">
  import { POS_PAYMENT_METHOD_OPTIONS } from '@/mocks/options';

  const paymentMethod = defineModel<string>('paymentMethod');
  const otherOption = defineModel<string | null>('otherOption');
</script>

<template>
  <section id="betaalmethode" class="flex flex-col gap-4">
    <div class="add-section-hdr">
      <i class="pi pi-credit-card add-section-icon" />
      <div class="add-section-title">Betaalmethode</div>
    </div>
    <div class="form-row items-center">
      <span class="form-label">Betaalmethode</span>
      <SelectButton v-model="paymentMethod" :options="POS_PAYMENT_METHOD_OPTIONS" />
    </div>
    <Transition name="fade-slide">
      <div v-if="paymentMethod === 'Anders'" class="form-row items-center">
        <span class="form-label" />
        <Select
          v-model="otherOption"
          :options="['Bankoverschrijving', 'Factuur achteraf', 'Rembours']"
          placeholder="Selecteer een optie"
          class="flex-1"
        />
      </div>
    </Transition>
  </section>
</template>

<style scoped>
@reference "@/assets/style.css";
  .form-row {
    grid-template-columns: 160px 1fr;
    @apply grid gap-2;
  }

  .form-label {
    @apply text-(--p-gray-500) text-sm pt-1.5;
  }

  .fade-slide-enter-active {
    transition: opacity var(--sw-duration-slow) var(--sw-ease), transform var(--sw-duration-slow) var(--sw-ease);
  }
  .fade-slide-leave-active {
    transition: opacity var(--sw-duration-base) var(--sw-ease), transform var(--sw-duration-base) var(--sw-ease);
  }
  .fade-slide-enter-from,
  .fade-slide-leave-to {
    @apply opacity-0;
    transform: translateY(-4px);
  }
</style>
