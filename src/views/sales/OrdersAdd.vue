<script setup lang="ts">
  import { ref, computed } from 'vue';
  import OrdersAdd_Introduction from './tabs/OrdersAdd_Introduction.vue';
  import OrdersAdd_Overview from './tabs/OrdersAdd_Overview.vue';
  import OrdersAdd_Products from './tabs/OrdersAdd_Products.vue';
  import OrdersAdd_Finalize from './tabs/OrdersAdd_Finalize.vue';
  import OrdersAdd_ThankYou from './OrdersAdd_ThankYou.vue';
  import { OrdersAddStep } from '@/types/orders';
  import OrdersAdd_Step from './tabs/OrdersAdd_Step.vue';

  const currentStep = ref<number>(1);
  const submitted = ref(false);
  const submittedMode = ref<'offerte' | 'bestelling'>('bestelling');

  const steps = computed<OrdersAddStep[]>(() => [
    { label: 'Product toevoegen' },
    { label: 'Even voorstellen' },
    { label: 'Overzicht' },
    { label: 'Afronden' },
  ]);

  function handleSubmit(mode: 'offerte' | 'bestelling') {
    submittedMode.value = mode;
    submitted.value = true;
  }
</script>

<template>
  <div class="grow flex flex-col">
    <OrdersAdd_ThankYou v-if="submitted" :mode="submittedMode" :order-number="2787187" />
    <Stepper v-else v-model:value="currentStep" class="grow flex flex-col">
      <StepList class="pb-3! border-b border-gray-200 pt-2!">
        <OrdersAdd_Step
          v-for="(step, index) in steps"
          :key="step.label"
          :step="step"
          :value="index + 1"
          :current-step="currentStep"
          :last-step="index + 1 === steps.length"
        />
      </StepList>
      <StepPanels class="grow flex flex-col pb-0! pt-5!">
        <OrdersAdd_Products />
        <OrdersAdd_Introduction />
        <OrdersAdd_Overview />
        <OrdersAdd_Finalize @submit="handleSubmit" />
      </StepPanels>
    </Stepper>
  </div>
</template>
