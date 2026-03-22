<script setup lang="ts">
import { ref } from 'vue';
import { useOrderCart } from '@/composables/useOrderCart';

const { finalizeMode } = useOrderCart();

const appointmentNote = ref('');
const appointmentMadeWith = ref<string | null>('Joris Kamminga');
const userOptions = [
  { label: 'Joris Kamminga', value: 'Joris Kamminga' },
  { label: 'Sarah de Vries', value: 'Sarah de Vries' },
];
const appointmentDate = ref<Date | null>(null);
const createTask = ref(false);
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="form-row">
      <span class="form-label">Wat zullen we afspreken?</span>
      <Textarea
        v-model="appointmentNote"
        placeholder="Bijv. levering na 10:00, bel vooraf aan, parkeren bij zijdeur..."
        rows="5"
        class="w-full"
      />
    </div>
    <div class="form-row items-center">
      <span class="form-label">Deze afspraak is gemaakt met</span>
      <Select
        v-model="appointmentMadeWith"
        :options="userOptions"
        option-label="label"
        option-value="value"
        class="w-72"
      />
    </div>
    <div class="form-row items-center">
      <span class="form-label">
        Datum voor de afspraak
        <span v-if="finalizeMode === 'quotation'" class="text-red-400 ml-0.5">*</span>
      </span>
      <DatePicker
        v-model="appointmentDate"
        date-format="dd-mm-yy"
        placeholder="DD-MM-JJJJ"
        class="w-72"
        show-icon
        icon-display="input"
      />
    </div>
    <div class="form-row items-center">
      <span class="form-label">Wil je ook een taak aanmaken?</span>
      <ToggleSwitch v-model="createTask" />
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
