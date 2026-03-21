<script setup lang="ts">
  import { inject, ref, computed, type Ref } from 'vue';
  import type { QuotationData } from '@/types/quotations';
  import OrdersAdd_ShoppingCart from '@/views/sales/orders/tabs/OrdersAdd_ShoppingCart.vue';

  const quotation = inject<Ref<QuotationData>>('quotation')!;
  const isEditing = ref(false);

  const productCount = computed(() =>
    quotation.value.groups.reduce((sum, g) => sum + g.lines.reduce((s, l) => s + l.quantity, 0), 0)
  );
</script>

<template>
  <div class="tab-scroll">
    <div class="view-card offer-card">
      <!-- ── Card header ──────────────────────────────────────────── -->
      <div class="view-card-hdr">
        <span class="view-card-title">Aanbod</span>
        <span class="kort-count-badge">{{ productCount }}</span>
        <template v-if="!isEditing">
          <Button
            label="Bewerken"
            icon="pi pi-pencil"
            size="small"
            severity="secondary"
            text
            style="margin-left: auto"
            @click="isEditing = true"
          />
        </template>
        <template v-else>
          <div class="flex gap-2" style="margin-left: auto">
            <Button
              label="Annuleren"
              size="small"
              severity="secondary"
              outlined
              @click="isEditing = false"
            />
            <Button label="Opslaan" size="small" @click="isEditing = false" />
          </div>
        </template>
      </div>

      <!-- ── Search toolbar — edit mode only ────────────────────── -->
      <Transition name="toolbar-slide">
        <div v-if="isEditing" class="offer-toolbar">
          <IconField class="grow">
            <InputIcon class="pi pi-search" />
            <InputText
              class="w-full"
              placeholder="Zoek op productcode, productnaam, fabrikantcode, bestelcode of EAN"
            />
          </IconField>
          <Button label="HM nummer" icon="pi pi-plus" icon-pos="left" class="btn-outlined" />
          <div class="pl-2 border-l border-gray-200">
            <Button icon="pi pi-ellipsis-v" class="btn-outlined" />
          </div>
        </div>
      </Transition>

      <!-- ── Cart (same in both modes) ───────────────────────────── -->
      <div class="offer-cart">
        <OrdersAdd_ShoppingCart class="p-4" :readonly="!isEditing" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";
  .offer-card {
    @apply flex flex-col;
  }

  .offer-toolbar {
    @apply flex items-center bg-(--p-surface-50) border-b border-(--p-gray-100) shrink-0 gap-3 py-2.5 px-4;
  }

  .offer-cart {
    @apply flex-1 overflow-visible;
  }

  .toolbar-slide-enter-active,
  .toolbar-slide-leave-active {
    transition:
      max-height 0.2s ease,
      opacity 0.15s ease;
    @apply overflow-hidden;
  }
  .toolbar-slide-enter-from,
  .toolbar-slide-leave-to {
    max-height: 0;
    @apply opacity-0;
  }
  .toolbar-slide-enter-to,
  .toolbar-slide-leave-from {
    max-height: 4rem;
    @apply opacity-100;
  }
</style>
