<script setup lang="ts">
import { ref } from 'vue';
import { useOrderCart } from '@/composables/useOrderCart';
import CartSidebar from '@/views/sales/orders/components/cart/CartSidebar.vue';
import CartAccordion from '@/views/sales/orders/components/cart/CartAccordion.vue';
import CartTotals from '@/views/sales/orders/components/cart/CartTotals.vue';

const props = withDefaults(defineProps<{ readonly?: boolean }>(), { readonly: false });
const emit = defineEmits<{ addToGroup: [groupId: string] }>();

useOrderCart();

const activeGroups = ref<string[]>(['0', '1', '2']);
const activeGroupId = ref<string | null>(null);

function scrollToGroup(groupId: string) {
  activeGroupId.value = groupId;
  if (!activeGroups.value.includes(groupId)) {
    activeGroups.value = [...activeGroups.value, groupId];
  }
  setTimeout(() => {
    document
      .getElementById(`group-${groupId}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 50);
}
</script>

<template>
  <div class="cart-shell">
    <CartSidebar
      :readonly="props.readonly"
      :active-group-id="activeGroupId"
      @scroll-to-group="scrollToGroup"
    />

    <div class="cart-main">
      <CartAccordion
        :readonly="props.readonly"
        :active-groups="activeGroups"
        @update:active-groups="activeGroups = $event"
        @add-to-group="emit('addToGroup', $event)"
      />

      <CartTotals :readonly="props.readonly" />
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";
/* ── Shell layout ────────────────────────────────────────── */
.cart-shell {
  @apply flex flex-1 min-h-0;
}

/* ── Main cart area ──────────────────────────────────────── */
.cart-main {
  @apply flex-1 min-w-0 flex flex-col overflow-y-auto gap-0 p-0;
}
</style>
