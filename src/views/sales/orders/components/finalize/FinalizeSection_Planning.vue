<script setup lang="ts">
import { ref } from 'vue';
import { useOrderCart } from '@/composables/useOrderCart';
import ContractorSection from '@/views/sales/components/ContractorSection.vue';
import { MONTH_SHORT_OPTIONS } from '@/mocks/options';

const { finalizeMode } = useOrderCart();

const selectedYear = ref(new Date().getFullYear());
const years = [2026, 2027, 2028].map((y) => ({ label: String(y), value: y }));
const selectedMonth = ref<string | null>(null);
const months = MONTH_SHORT_OPTIONS;
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Wanneer verbouwen — offerte only -->
    <template v-if="finalizeMode === 'quotation'">
      <div class="form-row">
        <span class="form-label">Wanneer verbouwen</span>
        <div class="flex flex-col gap-2">
          <SelectButton
            v-model="selectedYear"
            :options="years"
            option-label="label"
            option-value="value"
          />
          <SelectButton
            v-model="selectedMonth"
            :options="months"
            option-label="label"
            option-value="value"
            class="flex-wrap!"
          />
        </div>
      </div>
    </template>

    <!-- Aannemer / installateur -->
    <ContractorSection />
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";
.form-row {
  grid-template-columns: 220px 1fr;
  @apply grid gap-2;
}

.form-label {
  @apply text-(--p-gray-500) text-sm pt-1.5;
}

:deep(.flex-wrap\! .p-selectbutton) {
  @apply flex-wrap;
}
</style>
