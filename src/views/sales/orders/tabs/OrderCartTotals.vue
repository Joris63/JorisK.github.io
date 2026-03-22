<script setup lang="ts">
  import { useOrderCart } from '@/composables/useOrderCart';

  const {
    cartItemCount,
    cartSubtotal,
    cartDiscount,
    orderDiscountValue,
    shippingCostValue,
    orderTotal,
    formatPrice,
  } = useOrderCart();
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white overflow-hidden">
    <div class="flex items-center justify-between px-4 py-3 gap-6">
      <!-- Left: item count -->
      <span class="text-base text-gray-500 shrink-0 flex items-center">
        Totaal (incl. BTW), {{ cartItemCount }}
        {{ cartItemCount === 1 ? 'product' : 'producten' }}
        <i class="pi pi-info-circle ml-1" />
      </span>

      <!-- Right: price breakdown -->
      <div class="flex flex-col gap-1 w-72">
        <div class="flex justify-between text-base">
          <span class="text-gray-500">Subtotaal</span>
          <span>{{ formatPrice(cartSubtotal) }}</span>
        </div>
        <div v-if="cartDiscount > 0" class="flex justify-between text-base">
          <span class="text-gray-500">Extra korting</span>
          <span class="discount-value">{{ formatPrice(-cartDiscount) }}</span>
        </div>
        <div v-if="orderDiscountValue > 0" class="flex justify-between text-base">
          <span class="text-gray-500">Orderkorting</span>
          <span class="discount-value">{{ formatPrice(-orderDiscountValue) }}</span>
        </div>
        <div class="flex justify-between text-base">
          <span class="text-gray-500">Verzendkosten</span>
          <span :class="shippingCostValue === 0 ? 'text-primary font-medium' : ''">
            {{ shippingCostValue === 0 ? 'Gratis' : formatPrice(shippingCostValue) }}
          </span>
        </div>
        <Divider class="my-1!" />
        <div class="flex justify-between items-baseline">
          <span class="text-base font-semibold">Totaal</span>
          <span class="text-lg font-semibold">{{ formatPrice(orderTotal) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";
  .discount-value {
    @apply text-[#e94b57] font-medium;
  }
</style>
