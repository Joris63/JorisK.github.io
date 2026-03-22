<script setup lang="ts">
  export type AddMethod = 'zoeken' | 'merk' | 'csv';

  defineProps<{
    modelValue: AddMethod | null;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: AddMethod): void;
  }>();

  const METHODS: { value: AddMethod; icon: string; title: string; desc: string }[] = [
    {
      value: 'zoeken',
      icon: 'pi pi-search',
      title: 'Product zoeken',
      desc: 'Zoek op code, naam of merk en voeg producten één voor één toe.',
    },
    {
      value: 'merk',
      icon: 'pi pi-sliders-h',
      title: 'Merk / Serie / Categorie',
      desc: 'Selecteer merken, series en categorieën om producten in bulk toe te voegen.',
    },
    {
      value: 'csv',
      icon: 'pi pi-file-import',
      title: 'CSV importeren',
      desc: 'Upload een CSV met productcodes of producentcodes.',
    },
  ];
</script>

<template>
  <div class="drw-section">
    <p class="drw-section-hdr">Hoe wil je producten toevoegen?</p>
    <div class="method-grid">
      <button
        v-for="m in METHODS"
        :key="m.value"
        class="method-card"
        @click="emit('update:modelValue', m.value)"
      >
        <div class="method-card__icon">
          <i :class="m.icon" />
        </div>
        <strong class="method-card__title">{{ m.title }}</strong>
        <p class="method-card__desc">{{ m.desc }}</p>
      </button>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";
  .method-grid {
    @apply grid gap-2.5;
    grid-template-columns: repeat(3, 1fr);
  }
  .method-card {
    @apply flex flex-col items-start rounded-lg bg-white cursor-pointer text-left gap-2 py-3.5 px-4;
    border: 1.5px solid var(--p-gray-200);
    transition:
      border-color 0.15s,
      box-shadow 0.15s;
  }
  .method-card:hover {
    border-color: var(--p-primary-300);
    box-shadow: 0 0 0 3px var(--p-primary-50);
  }
  .method-card__icon {
    @apply flex items-center justify-center bg-[var(--p-gray-100)] text-[var(--p-gray-500)] rounded-md;
    width: 2rem;
    height: 2rem;
    font-size: 0.9rem;
    transition:
      background 0.15s,
      color 0.15s;
  }
  .method-card:hover .method-card__icon {
    background: var(--p-primary-50);
    color: var(--p-primary-500);
  }
  .method-card__title {
    @apply font-semibold text-[var(--p-surface-700)];
    @apply text-base;
  }
  .method-card__desc {
    @apply text-xs text-[var(--p-gray-400)] leading-[1.4];
  }
</style>
