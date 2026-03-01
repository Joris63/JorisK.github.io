<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import OrdersAdd_Introduction from './tabs/OrdersAdd_Introduction.vue';
  import OrdersAdd_Overview from './tabs/OrdersAdd_Overview.vue';
  import OrdersAdd_Products from './tabs/OrdersAdd_Products.vue';
  import OrdersAdd_Finalize from './tabs/OrdersAdd_Finalize.vue';
  import { OrdersAddStep } from '@/types/orders';
  import OrdersAdd_Step from './tabs/OrdersAdd_Step.vue';

  const router = useRouter();
  const currentStep = ref<number>(1);

  const steps = computed<OrdersAddStep[]>(() => [
    { label: 'Product toevoegen' },
    { label: 'Even voorstellen' },
    { label: 'Overzicht' },
    { label: 'Afronden' },
  ]);

  function handleSubmit(mode: 'offerte' | 'bestelling') {
    router.push({ name: 'ordersThankYou', query: { mode, order: 2787187 } });
  }
</script>

<template>
  <div class="grow flex flex-col">
    <Stepper v-model:value="currentStep" class="grow flex flex-col">
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
