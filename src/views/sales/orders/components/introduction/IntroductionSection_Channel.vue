<script setup lang="ts">
import { ref } from 'vue';
import { CHANNEL_CODE_OPTIONS, DEPARTMENT_OPTIONS, SHOWROOM_OPTIONS } from '@/mocks/options';

const selectedChannel = ref('showroom');
const selectedDepartment = ref('overig');
const selectedBranch = ref(1);
const reference = ref('');
const sellerOptions = [
  { label: 'Joris Kamminga', value: 1 },
  { label: 'Jan de Vries', value: 2 },
];
const selectedSeller = ref(1);
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="form-row items-center">
      <span class="form-label">Kanaal</span
      ><SelectButton
        v-model="selectedChannel"
        :options="CHANNEL_CODE_OPTIONS"
        option-label="label"
        option-value="value"
        :allow-empty="false"
      />
    </div>
    <div class="form-row items-center">
      <span class="form-label">Afdeling</span
      ><SelectButton
        v-model="selectedDepartment"
        :options="DEPARTMENT_OPTIONS"
        option-label="label"
        option-value="value"
        :allow-empty="false"
      />
    </div>
    <div class="form-row items-center">
      <span class="form-label">Vestiging</span
      ><Select
        v-model="selectedBranch"
        :options="SHOWROOM_OPTIONS"
        option-label="label"
        option-value="value"
        class="flex-1"
      />
    </div>
    <div class="form-row items-center">
      <span class="form-label">Referentie</span
      ><InputText
        v-model="reference"
        class="flex-1"
        placeholder="Bijv. Bestelbon 2024-001"
      />
    </div>
    <div class="form-row items-center">
      <span class="form-label">Verkoper</span
      ><Select
        v-model="selectedSeller"
        :options="sellerOptions"
        option-label="label"
        option-value="value"
        class="flex-1"
      />
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
  @apply text-(--p-gray-500) text-sm pt-1.5;
}
</style>
