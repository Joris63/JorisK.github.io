import { ref, computed } from 'vue';
import type { CartItem, CartGroup, FinalizeMode } from '@/types/orders';
import { formatPrice } from '@/utils/format';

export type { CartItem, CartGroup };

// ── Singleton state (shared across all component instances) ───
const groups = ref<CartGroup[]>([
  {
    id: '0',
    name: 'Ongegroepeerd',
    items: [
      {
        name: 'Saniclass klikwaste afvoerplug - 5/4" - chroom',
        productCode: 'SW1175 20',
        deliveryTime: '1 Dag',
        stock: 5,
        imageUrl: 'https://static.rorix.nl/image/product/overig/320x320/547889564e421.jpg',
        quantity: 1,
        price: 19.99,
        discountPercent: 0,
        discountAmount: 0,
        priceCorrection: false,
      },
    ],
  },
  {
    id: '1',
    name: 'Bad',
    items: [],
  },
  {
    id: '2',
    name: 'Garantiepakketten (optioneel)',
    items: [
      {
        name: 'Extra garantiepakket totaal (+3 jaar)',
        productCode: 'SW353906 20',
        deliveryTime: '1 Dag',
        imageUrl:
          'https://static.rorix.nl/image/product/overig/320x320/531e3526127d15e89326245ac1de3730.jpg',
        stock: 5,
        quantity: 1,
        price: 199.99,
        discountPercent: 0,
        discountAmount: 0,
        priceCorrection: false,
      },
    ],
  },
  {
    id: '3',
    name: 'Accessoires',
    items: [
      {
        name: 'Hansgrohe Flowstar huls voor hoekstopkraan chroom',
        productCode: '0606227 8',
        deliveryTime: '61 Dagen',
        imageUrl: 'https://static.rorix.nl/image/product/plieger/320x320/606227.jpg',
        stock: 0,
        quantity: 1,
        price: 37.99,
        discountPercent: 0,
        discountAmount: 0,
        priceCorrection: false,
      },
      {
        name: 'Laufen Toebehoren flexibele sifon kunststof',
        productCode: '0080673 8',
        deliveryTime: '38 Dagen',
        imageUrl: 'https://static.rorix.nl/image/product/overig/320x320/528b769c9afdb.jpg',
        stock: 0,
        quantity: 1,
        price: 42.99,
        discountPercent: 0,
        discountAmount: 0,
        priceCorrection: false,
      },
    ],
  },
]);

// ── Order-level discount ──────────────────────────────────────
const orderDiscountExpanded = ref(false);
const orderDiscountPercent = ref(0);
const orderDiscountAmount = ref(0);
const orderPriceCorrection = ref(false);
const shippingCostValue = ref(0);

// ── Helper functions ──────────────────────────────────────────
function rowTotal(item: CartItem): number {
  const unitPrice = item.price * (1 - item.discountPercent / 100) - item.discountAmount;
  return Math.max(0, item.quantity * unitPrice);
}

function groupTotal(group: CartGroup): number {
  return group.items.reduce((sum, item) => sum + rowTotal(item), 0);
}

function groupItemCount(group: CartGroup): number {
  return group.items.reduce((sum, item) => sum + item.quantity, 0);
}

// ── Computed totals ───────────────────────────────────────────
const cartItemCount = computed(() =>
  groups.value.reduce((sum, g) => sum + g.items.reduce((s, i) => s + i.quantity, 0), 0)
);

const cartSubtotal = computed(() =>
  groups.value.reduce((sum, g) => sum + g.items.reduce((s, i) => s + i.price * i.quantity, 0), 0)
);

const cartTotal = computed(() =>
  groups.value.reduce((sum, g) => sum + g.items.reduce((s, i) => s + rowTotal(i), 0), 0)
);

const cartDiscount = computed(() => cartSubtotal.value - cartTotal.value);

const orderDiscountValue = computed(
  () =>
    Math.max(0, cartTotal.value * (orderDiscountPercent.value / 100)) + orderDiscountAmount.value
);

const orderTotal = computed(() =>
  Math.max(0, cartTotal.value - orderDiscountValue.value + shippingCostValue.value)
);

// ── Add product to a group ────────────────────────────────────
function addProductToGroup(
  product: { code: string; naam: string; prijs: number },
  groupId: string
) {
  const group = groups.value.find((g) => g.id === groupId) ?? groups.value[0];
  const existing = group.items.find((i) => i.productCode === product.code);
  if (existing) {
    existing.quantity += 1;
  } else {
    group.items.push({
      name: product.naam,
      productCode: product.code,
      deliveryTime: '—',
      stock: 0,
      imageUrl: undefined,
      quantity: 1,
      price: product.prijs,
      discountPercent: 0,
      discountAmount: 0,
      priceCorrection: false,
    });
  }
}

// ── Finalize mode ─────────────────────────────────────────────
const finalizeMode = ref<FinalizeMode>(null);

// ── Non-empty groups (for overview) ──────────────────────────
const nonEmptyGroups = computed(() => groups.value.filter((g) => g.items.length > 0));

const firstProductImage = computed(() => {
  for (const g of groups.value) {
    for (const item of g.items) {
      if (item.imageUrl) return item.imageUrl;
    }
  }
  return undefined;
});

export function useOrderCart() {
  return {
    groups,
    nonEmptyGroups,
    firstProductImage,
    orderDiscountExpanded,
    orderDiscountPercent,
    orderDiscountAmount,
    orderPriceCorrection,
    shippingCostValue,
    cartItemCount,
    cartSubtotal,
    cartTotal,
    cartDiscount,
    orderDiscountValue,
    orderTotal,
    formatPrice,
    rowTotal,
    groupTotal,
    groupItemCount,
    addProductToGroup,
    finalizeMode,
  };
}
