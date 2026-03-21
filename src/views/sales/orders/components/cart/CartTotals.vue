<script setup lang="ts">
import { useOrderCart } from '@/composables/useOrderCart';

const props = defineProps<{
  readonly?: boolean;
}>();

const {
  orderDiscountExpanded,
  orderDiscountPercent,
  orderDiscountAmount,
  orderPriceCorrection,
  shippingCostValue,
  cartItemCount,
  cartSubtotal,
  cartDiscount,
  orderDiscountValue,
  orderTotal,
  formatPrice,
} = useOrderCart();
</script>

<template>
  <div class="cart-totals-card">
    <!-- Expandable order discount / shipping row -->
    <Transition name="fade-slide">
      <div
        v-if="orderDiscountExpanded"
        class="flex items-center justify-end gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50"
      >
        <span class="text-xs text-gray-400 mr-auto">Korting op gehele bestelling</span>
        <InputNumber
          v-if="!props.readonly"
          v-model="orderDiscountPercent"
          :min="0"
          :max="100"
          :min-fraction-digits="2"
          :max-fraction-digits="2"
          suffix=" %"
          :input-style="{ width: '5rem', textAlign: 'right' }"
          class="discount-input"
        />
        <InputNumber
          v-if="!props.readonly"
          v-model="orderDiscountAmount"
          :min="0"
          :min-fraction-digits="2"
          :max-fraction-digits="2"
          prefix="€ "
          :input-style="{ width: '5rem', textAlign: 'right' }"
          class="discount-input"
        />
        <span v-if="props.readonly">
          {{
            orderDiscountPercent > 0
              ? `${orderDiscountPercent} %`
              : formatPrice(orderDiscountAmount)
          }}
          <span class="text-xs text-gray-400 ml-1">korting</span>
        </span>
        <div
          v-if="!props.readonly"
          class="flex items-center gap-1.5 pl-3 border-l border-gray-200"
        >
          <ToggleSwitch v-model="orderPriceCorrection" />
          <span class="text-xs text-gray-500">Prijscorrectie</span>
        </div>
        <div class="flex items-center gap-2 pl-3 border-l border-gray-200">
          <span class="text-xs text-gray-500">Verzendkosten</span>
          <InputNumber
            v-if="!props.readonly"
            v-model="shippingCostValue"
            :min="0"
            :min-fraction-digits="2"
            :max-fraction-digits="2"
            :input-style="{ width: '5rem', textAlign: 'right' }"
            class="discount-input"
          />
          <span v-if="props.readonly">{{ formatPrice(shippingCostValue) }}</span>
        </div>
        <Button
          icon="pi pi-times"
          variant="text"
          severity="secondary"
          size="small"
          rounded
          class="shrink-0"
          @click="orderDiscountExpanded = false"
        />
      </div>
    </Transition>

    <!-- Summary rows -->
    <div class="px-5 py-4 flex flex-col gap-1.5">
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs text-gray-400"
          >{{ cartItemCount }} {{ cartItemCount === 1 ? 'product' : 'producten' }}</span
        >
        <Button
          v-if="!orderDiscountExpanded && !props.readonly"
          icon="pi pi-plus"
          icon-pos="left"
          variant="text"
          severity="secondary"
          size="small"
          class="totals-add-btn"
          @click="orderDiscountExpanded = true"
        />
      </div>

      <div class="flex justify-between text-sm">
        <span class="text-gray-500">Subtotaal</span>
        <span>{{ formatPrice(cartSubtotal) }}</span>
      </div>
      <div v-if="cartDiscount > 0" class="flex justify-between text-sm">
        <span class="text-gray-500">Kortingen</span>
        <span class="discount-price">−{{ formatPrice(cartDiscount) }}</span>
      </div>
      <div v-if="orderDiscountValue > 0" class="flex justify-between text-sm">
        <span class="text-gray-500">Orderkorting</span>
        <span class="discount-price">−{{ formatPrice(orderDiscountValue) }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-500">Verzendkosten</span>
        <span :class="shippingCostValue === 0 ? 'text-primary font-medium' : ''">
          {{ shippingCostValue === 0 ? 'Gratis' : formatPrice(shippingCostValue) }}
        </span>
      </div>

      <Divider class="my-1" />

      <div class="flex justify-between items-baseline">
        <span class="font-semibold text-gray-800">
          Totaal
          <span class="text-xs font-normal text-gray-400 ml-0.5">(incl. BTW)</span>
        </span>
        <span class="text-xl font-bold tracking-tight">{{ formatPrice(orderTotal) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";
.cart-totals-card {
  @apply border-0 border-t border-(--p-gray-200) bg-(--p-gray-50) overflow-hidden;
}

.totals-add-btn {
  font-size: 0.75rem !important;
  height: auto !important;
  @apply py-0.5! px-2!;
}

/* ── Discount inputs ─────────────────────────────────────── */
:deep(.discount-input .p-inputnumber-input) {
  @apply py-1 px-2;
}

/* ── Discount/price colors ───────────────────────────────── */
.discount-price {
  @apply text-[#e94b57];
}

/* ── Transitions ─────────────────────────────────────────── */
.fade-slide-enter-active {
  @apply overflow-hidden;
  max-height: 8rem;
  transition:
    opacity 0.2s ease-out,
    max-height 0.2s ease-out,
    transform 0.2s ease-out;
}
.fade-slide-leave-active {
  @apply overflow-hidden;
  max-height: 8rem;
  transition:
    opacity 0.18s ease-in,
    max-height 0.18s ease-in;
}
.fade-slide-enter-from {
  @apply opacity-0;
  max-height: 0;
  transform: translateY(-4px);
}
.fade-slide-leave-to {
  @apply opacity-0;
  max-height: 0;
}
</style>
