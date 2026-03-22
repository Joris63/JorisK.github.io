<script setup lang="ts">
  import { SHOWROOM_OPTIONS } from '@/mocks/options';

  const selectedShowroom = defineModel<number>('selectedShowroom');
  const reference = defineModel<string>('reference');
</script>

<template>
  <section id="levering" class="flex flex-col gap-4">
    <div class="add-section-hdr">
      <i class="pi pi-truck add-section-icon" />
      <div class="add-section-title">Levering</div>
    </div>
    <div class="form-row items-center">
      <span class="form-label">Showroom</span>
      <Select
        v-model="selectedShowroom"
        :options="SHOWROOM_OPTIONS"
        option-label="label"
        option-value="value"
        class="flex-1"
      />
    </div>
    <div class="form-row items-center">
      <span class="form-label">Referentie</span>
      <InputText v-model="reference" placeholder="Vul een referentie in" class="flex-1" />
    </div>
  </section>
</template>

<style scoped>
@reference "@/assets/style.css";
  .form-row {
    grid-template-columns: 160px 1fr;
    @apply grid gap-2;
  }

  .form-label {
    @apply text-(--p-gray-500) text-base pt-1.5;
  }
</style>
