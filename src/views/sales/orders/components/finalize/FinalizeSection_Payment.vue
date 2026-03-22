<script setup lang="ts">
import { ref } from 'vue';
import { POS_PAYMENT_METHOD_OPTIONS } from '@/mocks/options';

const paymentMethod = ref('Ideal');
const paymentMethodOptions = POS_PAYMENT_METHOD_OPTIONS;
</script>

<template>
  <div>
    <div class="form-row items-center">
      <span class="form-label">Betaalmethode</span>
      <SelectButton v-model="paymentMethod" :options="paymentMethodOptions" />
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";
.form-row {
  grid-template-columns: 220px 1fr;
  @apply grid gap-2;
}

.form-label {
  @apply text-(--p-gray-500) text-base pt-1.5;
}
</style>
