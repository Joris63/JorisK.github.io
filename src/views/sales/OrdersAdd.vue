<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import OrdersAdd_Introduction from './tabs/OrdersAdd_Introduction.vue';
  import OrdersAdd_Overview from './tabs/OrdersAdd_Overview.vue';
  import OrdersAdd_Products from './tabs/OrdersAdd_Products.vue';
  import OrdersAdd_Finalize from './tabs/OrdersAdd_Finalize.vue';
  import { OrdersAddStep } from '@/types/orders';
  import OrdersAdd_Step from './tabs/OrdersAdd_Step.vue';
  import AddPageHeader from '@/components/layout/AddPageHeader.vue';
  import { useOrderCart } from '@/composables/useOrderCart';

  const router = useRouter();
  const currentStep = ref<number>(1);
  const { finalizeMode } = useOrderCart();

  const steps = computed<OrdersAddStep[]>(() => [
    { label: 'Product(en) toevoegen' },
    { label: 'Even voorstellen' },
    { label: 'Overzicht' },
    { label: 'Afronden' },
  ]);

  const back = { name: 'home' };

  function goBack() {
    if (currentStep.value === 4) finalizeMode.value = null;
    currentStep.value--;
  }

  function goNext() {
    if (currentStep.value === 3) finalizeMode.value = null;
    currentStep.value++;
  }

  function handleSubmit(mode: 'quotation' | 'order') {
    router.push({ name: 'ordersThankYou', query: { mode, order: 2787187 } });
  }
</script>

<template>
  <div class="add-page">
    <AddPageHeader
      title="Bestelling aanmaken"
      subtitle="Doorloop de stappen om een nieuwe bestelling aan te maken"
      :back="back"
    >
      <template #icon><i class="pi pi-shopping-cart" /></template>
    </AddPageHeader>

    <Stepper v-model:value="currentStep" class="grow flex flex-col mt-4">
      <StepList class="py-4! border-gray-200 border-b px-6!">
        <OrdersAdd_Step
          v-for="(step, index) in steps"
          :key="step.label"
          :step="step"
          :value="index + 1"
          :current-step="currentStep"
          :last-step="index + 1 === steps.length"
        />
      </StepList>
      <StepPanels class="grow flex flex-col p-5! tab-scroll">
        <OrdersAdd_Products />
        <OrdersAdd_Introduction />
        <OrdersAdd_Overview />
        <OrdersAdd_Finalize />
      </StepPanels>
    </Stepper>

    <!-- ── Shared wizard footer ──────────────────────────────── -->
    <div class="wizard-footer">
      <Button
        v-if="currentStep > 1"
        label="Terug"
        class="btn-back"
        icon="pi pi-arrow-left"
        @click="goBack"
      />
      <div v-else />

      <Button
        v-if="currentStep < 4"
        label="Volgende"
        severity="secondary"
        icon="pi pi-arrow-right"
        icon-pos="right"
        @click="goNext"
      />
      <Button
        v-else-if="finalizeMode === 'quotation'"
        label="Opslaan"
        icon="pi pi-save"
        @click="handleSubmit('quotation')"
      />
      <Button
        v-else-if="finalizeMode === 'order'"
        label="Bestelling plaatsen"
        icon="pi pi-check"
        @click="handleSubmit('order')"
      />
    </div>
  </div>
</template>

<style scoped>
  .wizard-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.875rem 1.25rem;
    border-top: 1px solid var(--p-gray-200);
    background: white;
    flex-shrink: 0;
  }
</style>
