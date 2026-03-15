<script setup lang="ts">
  import { ref } from 'vue';
  import { useOrderCart } from '@/composables/useOrderCart';
  import type { CartItem } from '@/types/orders';

  const props = withDefaults(defineProps<{ readonly?: boolean }>(), { readonly: false });
  const emit = defineEmits<{ addToGroup: [groupId: string] }>();

  const {
    groups,
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
    rowTotal,
    groupTotal,
    groupItemCount,
  } = useOrderCart();

  const activeGroups = ref<string[]>(['0', '1', '2']);
  const activeGroupId = ref<string | null>(null);

  const SUGGESTIONS = [
    'Badmeubel',
    'Douche',
    'Verwarming',
    'Tegels',
    'Toilet',
    'Onderhoudsmiddelen',
  ];

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

  // Track which image URLs have failed to load
  const imageErrors = ref<Record<string, boolean>>({});

  // PrimeVue v4 expandedRows object format: { [dataKey]: boolean }
  const expandedRows = ref<Record<string, Record<string, boolean>>>({
    '0': {},
    '1': {},
    '2': {},
  });

  function isRowExpanded(groupId: string, item: CartItem): boolean {
    return expandedRows.value[groupId]?.[item.productCode] === true;
  }

  function toggleRowExpansion(groupId: string, item: CartItem) {
    const current = expandedRows.value[groupId] ?? {};
    if (current[item.productCode]) {
      const updated = { ...current };
      delete updated[item.productCode];
      expandedRows.value[groupId] = updated;
    } else {
      expandedRows.value[groupId] = { ...current, [item.productCode]: true };
    }
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const arr = groups.value;
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
  }

  function moveDown(index: number) {
    if (index === groups.value.length - 1) return;
    const arr = groups.value;
    [arr[index + 1], arr[index]] = [arr[index], arr[index + 1]];
  }

  // Group sidebar menu
  const groupMenu = ref();
  const groupMenuItems = [
    { label: 'Hernoemen', icon: 'pi pi-pencil' },
    { label: 'Dupliceren', icon: 'pi pi-clone' },
    { separator: true },
    { label: 'Verwijderen', icon: 'pi pi-trash', class: 'text-red-500' },
  ];
  function toggleGroupMenu(event: Event) {
    groupMenu.value.toggle(event);
  }

  // Secondary row actions — popup menu
  const actionMenu = ref();
  const contextMenu = ref();
  const rowMenuItems = [
    { label: 'Kopiëren', icon: 'pi pi-copy' },
    { label: 'Dupliceren', icon: 'pi pi-clone' },
    { label: 'Verplaatsen naar groep', icon: 'pi pi-arrows-alt' },
    { separator: true },
    { label: 'Openen in nieuw tabblad', icon: 'pi pi-external-link' },
    { label: 'Link kopiëren', icon: 'pi pi-link' },
    { separator: true },
    { label: 'Verwijderen', icon: 'pi pi-trash', class: 'text-red-500' },
  ];
  function toggleActionMenu(event: Event) {
    actionMenu.value.toggle(event);
  }
  function onRowContextMenu(event: any) {
    contextMenu.value.show(event.originalEvent);
  }
</script>

<template>
  <div class="cart-shell">
    <!-- ── Sidebar ────────────────────────────────────────────── -->
    <div class="cart-sidebar flex flex-col shrink-0">
      <!-- Groups -->
      <div class="sidebar-section">
        <div class="sidebar-section-hdr">
          <span class="sidebar-label">Groepen</span>
          <Button
            v-if="!props.readonly"
            icon="pi pi-plus"
            variant="text"
            severity="secondary"
            rounded
            size="small"
            class="sidebar-add-btn"
            v-tooltip.top="'Groep toevoegen'"
          />
        </div>

        <Menu ref="groupMenu" :model="groupMenuItems" popup />
        <div class="flex flex-col gap-0.5">
          <div
            v-for="group in groups"
            :key="group.id"
            class="group sidebar-group-item"
            :class="{ 'sidebar-group-item--active': activeGroupId === group.id }"
            @click="scrollToGroup(group.id)"
          >
            <span class="truncate text-sm flex-1">{{ group.name }}</span>
            <div class="sidebar-item-end">
              <span v-if="group.items.length > 0" class="sidebar-count group-hover:opacity-0">{{
                group.items.length
              }}</span>
              <button
                v-if="!props.readonly"
                class="sidebar-group-menu opacity-0 group-hover:opacity-100"
                @click.stop="toggleGroupMenu($event)"
              >
                <i class="pi pi-ellipsis-h" style="font-size: 0.7rem" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Suggestions -->
      <div v-if="!props.readonly" class="sidebar-section mt-4">
        <div class="sidebar-section-hdr">
          <span class="sidebar-label">Suggesties</span>
        </div>
        <div class="flex flex-col">
          <Button
            v-for="s in SUGGESTIONS"
            :key="s"
            :label="s"
            variant="text"
            severity="secondary"
            icon="pi pi-plus"
            class="justify-start! px-2!"
            size="small"
          />
        </div>
      </div>
    </div>

    <!-- ── Shared popup menus ─────────────────────────────────── -->
    <Menu ref="actionMenu" :model="rowMenuItems" popup />
    <ContextMenu ref="contextMenu" :model="rowMenuItems" />

    <!-- ── Accordion + totals ─────────────────────────────────── -->
    <div class="cart-main">
      <Accordion v-model:value="activeGroups" multiple>
        <AccordionPanel
          v-for="(group, index) in groups"
          :key="group.id"
          :value="group.id"
          :id="`group-${group.id}`"
          :class="{
            'panel-primary': group.id !== '0',
            'panel-default': group.id === '0',
          }"
        >
          <AccordionHeader
            :pt="{
              root: {
                as: 'div',
                role: 'button',
                tabindex: '0',
                class: 'rounded-none!',
              },
            }"
          >
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <span class="font-semibold truncate">{{ group.name }}</span>
              <i
                v-if="group.id === '0'"
                class="pi pi-info-circle text-gray-400 shrink-0"
                style="font-size: 0.8rem"
              />
              <span
                v-if="group.items.length > 0 && !activeGroups.includes(group.id)"
                class="panel-count"
                >{{ group.items.length }}</span
              >
            </div>
            <div class="flex items-center shrink-0 gap-1" @click.stop>
              <template v-if="!props.readonly && !activeGroups.includes(group.id)">
                <Button
                  icon="pi pi-plus"
                  variant="text"
                  severity="secondary"
                  rounded
                  class="header-action-btn"
                  v-tooltip.top="'Product toevoegen'"
                  @click="emit('addToGroup', group.id)"
                />
                <span class="header-divider" />
              </template>
              <template v-if="group.id !== '0' && !props.readonly">
                <Button
                  icon="pi pi-pencil"
                  variant="text"
                  severity="secondary"
                  rounded
                  class="header-action-btn"
                />
                <Button
                  icon="pi pi-trash"
                  variant="text"
                  severity="secondary"
                  rounded
                  class="header-action-btn"
                />
              </template>
              <div v-if="!props.readonly" class="flex flex-col">
                <Button
                  icon="pi pi-chevron-up"
                  variant="text"
                  severity="secondary"
                  rounded
                  class="header-action-btn reorder-btn"
                  :disabled="index === 0"
                  @click="moveUp(index)"
                />
                <Button
                  icon="pi pi-chevron-down"
                  variant="text"
                  severity="secondary"
                  rounded
                  class="header-action-btn reorder-btn"
                  :disabled="index === groups.length - 1"
                  @click="moveDown(index)"
                />
              </div>
            </div>
          </AccordionHeader>

          <AccordionContent class="[--p-accordion-content-padding:0]">
            <DataTable
              :value="group.items"
              selection-mode="multiple"
              data-key="productCode"
              class="w-full"
              :row-class="(data: CartItem) => ((data as any).inactive ? 'row-inactive' : '')"
              v-model:expanded-rows="expandedRows[group.id]"
              context-menu
              @row-contextmenu="onRowContextMenu"
            >
              <Column v-if="!props.readonly" selection-mode="multiple" style="width: 3rem" />

              <!-- Naam + image -->
              <Column header="Naam">
                <template #body="{ data }">
                  <div class="flex items-center gap-3">
                    <div class="prod-thumb">
                      <img
                        v-if="data.imageUrl && !imageErrors[data.productCode]"
                        :src="data.imageUrl"
                        :alt="data.name"
                        class="w-full h-full object-cover"
                        @error="imageErrors[data.productCode] = true"
                      />
                      <i v-else class="pi pi-image text-gray-300" style="font-size: 0.9rem" />
                    </div>
                    <div class="flex flex-col leading-snug min-w-0">
                      <span class="font-medium text-sm truncate">{{ data.name }}</span>
                      <span class="text-xs text-gray-400">{{ data.productCode }}</span>
                    </div>
                  </div>
                </template>
              </Column>

              <!-- Beschikbaarheid -->
              <Column header="Beschikbaarheid">
                <template #body="{ data }">
                  <div class="flex items-center gap-1.5">
                    <i
                      :class="
                        data.stock > 0
                          ? 'pi pi-check-circle text-green-500'
                          : 'pi pi-times-circle text-red-400'
                      "
                      style="font-size: 0.85rem"
                    />
                    <span class="text-xs text-gray-500">{{ data.deliveryTime }}</span>
                  </div>
                </template>
              </Column>

              <!-- Quantity -->
              <Column header="Aantal" style="width: 8rem">
                <template #body="{ data }">
                  <InputNumber
                    v-model="data.quantity"
                    :min="1"
                    show-buttons
                    button-layout="stacked"
                    class="item-quantity"
                  />
                </template>
              </Column>

              <!-- Unit price -->
              <Column header="Prijs">
                <template #body="{ data }">
                  <div class="flex flex-col leading-snug">
                    <span
                      v-if="data.discountPercent > 0 || data.discountAmount > 0"
                      class="text-xs text-gray-400 line-through"
                      >{{ formatPrice(data.price) }}</span
                    >
                    <span
                      class="text-sm font-medium"
                      :class="
                        data.discountPercent > 0 || data.discountAmount > 0 ? 'discount-price' : ''
                      "
                    >
                      {{
                        formatPrice(
                          Math.max(
                            0,
                            data.price * (1 - data.discountPercent / 100) - data.discountAmount
                          )
                        )
                      }}
                    </span>
                  </div>
                </template>
              </Column>

              <!-- Row total -->
              <Column header="Totaal">
                <template #body="{ data }">
                  <span
                    class="text-sm font-semibold"
                    :class="
                      data.discountPercent > 0 || data.discountAmount > 0 ? 'discount-price' : ''
                    "
                    >{{ formatPrice(rowTotal(data)) }}</span
                  >
                </template>
              </Column>

              <!-- Actions -->
              <Column style="width: 1px; white-space: nowrap">
                <template #body="{ data }">
                  <div class="flex items-center gap-1">
                    <Button
                      icon="pi pi-ellipsis-h"
                      variant="text"
                      severity="secondary"
                      rounded
                      class="row-action-btn"
                      @click="toggleActionMenu"
                    />
                    <Button
                      v-if="!props.readonly"
                      icon="pi pi-trash"
                      variant="text"
                      severity="danger"
                      rounded
                      class="row-action-btn"
                    />
                    <Button
                      :icon="isRowExpanded(group.id, data) ? 'pi pi-minus' : 'pi pi-plus'"
                      variant="text"
                      severity="secondary"
                      rounded
                      class="row-action-btn"
                      @click="toggleRowExpansion(group.id, data)"
                    />
                    <div v-if="!props.readonly" class="flex flex-col ml-1">
                      <Button
                        icon="pi pi-chevron-up"
                        variant="text"
                        severity="secondary"
                        rounded
                        class="row-action-btn reorder-btn"
                      />
                      <Button
                        icon="pi pi-chevron-down"
                        variant="text"
                        severity="secondary"
                        rounded
                        class="row-action-btn reorder-btn"
                      />
                    </div>
                  </div>
                </template>
              </Column>

              <!-- Expandable discount section -->
              <template #expansion="{ data }">
                <div
                  class="flex items-center justify-end gap-3 px-4 py-2.5 border-t border-gray-100 bg-white"
                >
                  <span class="text-xs text-gray-400 mr-auto">Korting per eenheid</span>
                  <InputNumber
                    v-if="!props.readonly"
                    v-model="data.discountPercent"
                    :min="0"
                    :max="100"
                    :min-fraction-digits="2"
                    :max-fraction-digits="2"
                    suffix=" %"
                    :input-style="{ width: '5.5rem', textAlign: 'right' }"
                    :pt="{ input: { placeholder: '0,00 %' } }"
                    class="discount-input"
                  />
                  <InputNumber
                    v-if="!props.readonly"
                    v-model="data.discountAmount"
                    :min="0"
                    :min-fraction-digits="2"
                    :max-fraction-digits="2"
                    prefix="€ "
                    :input-style="{ width: '5.5rem', textAlign: 'right' }"
                    :pt="{ input: { placeholder: '€ 0,00' } }"
                    class="discount-input"
                  />
                  <span v-if="props.readonly">
                    {{
                      data.discountPercent > 0
                        ? `${data.discountPercent} %`
                        : formatPrice(data.discountAmount)
                    }}
                    <span class="text-xs text-gray-400 ml-1">korting</span>
                  </span>
                  <div
                    v-if="!props.readonly"
                    class="flex items-center gap-1.5 pl-2 border-l border-gray-200"
                  >
                    <ToggleSwitch v-model="data.priceCorrection" />
                    <span class="text-xs text-gray-500">Prijscorrectie</span>
                  </div>
                </div>
              </template>

              <template #empty>
                <div class="px-4 py-3 text-sm text-gray-400 italic">
                  Nog geen producten toegevoegd
                </div>
              </template>
            </DataTable>

            <!-- Add product to group -->
            <button
              v-if="!props.readonly"
              class="add-product-row"
              @click="emit('addToGroup', group.id)"
            >
              <i class="pi pi-plus" style="font-size: 0.7rem" />
              <span>Product toevoegen aan groep</span>
            </button>

            <!-- Group subtotal -->
            <div v-if="groupItemCount(group) > 0" class="group-subtotal">
              <span class="text-gray-500">
                Subtotaal — {{ groupItemCount(group) }}
                {{ groupItemCount(group) === 1 ? 'product' : 'producten' }}
              </span>
              <span class="font-semibold">{{ formatPrice(groupTotal(group)) }}</span>
            </div>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>

      <!-- ── Cart totals card ──────────────────────────────────── -->
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
    </div>
  </div>
</template>

<style scoped>
  /* ── Shell layout ────────────────────────────────────────── */
  .cart-shell {
    display: flex;
    flex: 1;
    min-height: 0;
  }

  /* ── Sidebar ─────────────────────────────────────────────── */
  .cart-sidebar {
    width: 17rem;
    flex-shrink: 0;
    border-right: 1px solid var(--p-gray-200);
    background: var(--p-gray-50);
    padding: 0.75rem 0.625rem 0.75rem;
    overflow-y: auto;
  }

  .sidebar-section {
    display: flex;
    flex-direction: column;
  }

  .sidebar-section-hdr {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.5rem 0.375rem;
  }

  .sidebar-label {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--p-surface-400);
  }

  .sidebar-add-btn {
    width: 1.625rem !important;
    height: 1.625rem !important;
    min-width: 0 !important;
    padding: 0 !important;
    font-size: 0.7rem !important;
  }

  .sidebar-group-item {
    display: flex;
    align-items: center;
    position: relative;
    gap: 0.375rem;
    padding: 0.375rem 0.625rem;
    border-radius: 0.375rem;
    cursor: pointer;
    color: var(--p-gray-600);
    transition:
      background 0.1s ease,
      color 0.1s ease;
    font-size: 0.8125rem;
  }

  .sidebar-group-item:hover {
    background: var(--p-gray-100);
    color: var(--p-gray-800);
  }

  .sidebar-group-item--active {
    background: var(--p-primary-50);
    color: var(--p-primary-700);
  }

  .sidebar-group-item--active:hover {
    background: var(--p-primary-100);
  }

  .sidebar-item-end {
    position: relative;
    width: 1.375rem;
    height: 1.375rem;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
  }

  .sidebar-count {
    font-size: 0.7rem;
    background: var(--p-gray-200);
    color: var(--p-gray-500);
    border-radius: 999px;
    padding: 0.1rem 0.4rem;
    line-height: 1.3;
    white-space: nowrap;
    transition: opacity 0.1s ease;
  }

  .sidebar-group-item--active .sidebar-count {
    background: var(--p-primary-100);
    color: var(--p-primary-600);
  }

  .sidebar-group-menu {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    border-radius: 0.25rem;
    cursor: pointer;
    color: var(--p-gray-400);
    transition:
      background 0.1s ease,
      color 0.1s ease,
      opacity 0.1s ease;
  }

  .sidebar-group-menu:hover {
    background: var(--p-gray-200);
    color: var(--p-gray-700);
  }

  /* ── Main cart area ──────────────────────────────────────── */
  .cart-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 0;
    overflow-y: auto;
  }

  /* ── Accordion shell ─────────────────────────────────────── */
  .cart-main :deep(.p-accordion) {
    border: none;
    gap: 0;
    display: flex;
    flex-direction: column;
  }

  /* ── Panel — flat section ────────────────────────────────── */
  .cart-main :deep(.p-accordionpanel) {
    border: none;
    border-radius: 0;
    border-bottom: 1px solid var(--p-gray-100);
    overflow: hidden;
    transition: none;
  }

  .cart-main :deep(.p-accordionpanel:hover) {
    border-color: var(--p-gray-100);
    box-shadow: none;
  }

  .cart-main :deep(.p-accordionpanel[data-p-active='true']) {
    border-color: var(--p-gray-100);
    box-shadow: none;
  }

  /* ── Header base ─────────────────────────────────────────── */
  .cart-main :deep(.p-accordionheader) {
    gap: 0;
    background: var(--p-gray-0);
    border: none;
    border-bottom: 1px solid var(--p-gray-100);
    border-left: 3px solid transparent;
    border-radius: 0;
    padding: 0.6rem 0.875rem;
    font-size: 0.875rem;
    transition: background 0.15s ease;
    cursor: pointer;
  }

  .cart-main :deep(.p-accordionheader:hover) {
    background: var(--p-gray-50);
  }

  .cart-main :deep(.p-accordionpanel[data-p-active='true'] .p-accordionheader) {
    background: var(--p-gray-50);
    border-bottom-color: var(--p-gray-200);
  }

  /* ── Toggle chevron ──────────────────────────────────────── */
  .cart-main :deep(.p-accordionheader-toggle-icon) {
    order: -1;
    margin-right: 0.375rem;
    color: var(--p-gray-400);
    width: 0.8rem;
    height: 0.8rem;
  }

  /* ── Primary panel (named groups) ────────────────────────── */
  .cart-main :deep(.panel-primary:hover) {
    border-color: var(--p-gray-100) !important;
    box-shadow: none !important;
  }

  .cart-main :deep(.panel-primary[data-p-active='true']) {
    border-color: var(--p-gray-100) !important;
    box-shadow: none !important;
  }

  .cart-main :deep(.panel-primary .p-accordionheader) {
    background: var(--p-primary-50);
    border-bottom-color: var(--p-primary-100);
    border-left-color: var(--p-primary-400);
    color: var(--p-primary-800);
  }

  .cart-main :deep(.panel-primary .p-accordionheader:hover) {
    background: var(--p-primary-100) !important;
  }

  .cart-main :deep(.panel-primary[data-p-active='true'] .p-accordionheader) {
    background: var(--p-primary-100) !important;
    border-bottom-color: var(--p-primary-200) !important;
  }

  .cart-main :deep(.panel-primary .p-accordionheader-toggle-icon) {
    order: -1;
    color: var(--p-primary-400);
  }

  .cart-main :deep(.panel-primary[data-p-active='true'] .p-accordionheader-toggle-icon) {
    color: var(--p-primary-600) !important;
  }

  /* ── Default panel (Ongegroepeerd) ───────────────────────── */
  .cart-main :deep(.panel-default .p-accordionheader) {
    background: var(--p-gray-50);
    color: var(--p-gray-700);
    border-left-color: var(--p-gray-300);
  }

  .cart-main :deep(.panel-default .p-accordionheader:hover) {
    background: var(--p-gray-100) !important;
  }

  .cart-main :deep(.panel-default[data-p-active='true'] .p-accordionheader) {
    background: var(--p-gray-100) !important;
    border-bottom-color: var(--p-gray-200) !important;
  }

  .cart-main :deep(.panel-default .p-accordionheader-toggle-icon) {
    order: -1;
    color: var(--p-gray-400);
  }

  /* ── Header divider ──────────────────────────────────────── */
  .header-divider {
    display: inline-block;
    width: 1px;
    height: 1rem;
    background: currentColor;
    opacity: 0.15;
    margin: 0 0.125rem;
    flex-shrink: 0;
  }

  /* ── Header action + reorder buttons ─────────────────────── */
  .cart-main :deep(.header-action-btn) {
    color: var(--p-gray-400) !important;
    width: 1.875rem !important;
    height: 1.875rem !important;
    min-width: 0 !important;
    padding: 0 !important;
  }

  .cart-main :deep(.header-action-btn:hover) {
    color: var(--p-gray-700) !important;
    background: rgba(0, 0, 0, 0.06) !important;
  }

  .cart-main :deep(.reorder-btn) {
    width: 1.375rem !important;
    height: 1.375rem !important;
    font-size: 0.6rem;
  }

  .cart-main :deep(.panel-primary .header-action-btn) {
    color: var(--p-primary-400) !important;
  }

  .cart-main :deep(.panel-primary .header-action-btn:hover) {
    color: var(--p-primary-700) !important;
    background: rgba(0, 0, 0, 0.07) !important;
  }

  /* ── Panel count badge ───────────────────────────────────── */
  .panel-count {
    font-size: 0.7rem;
    background: rgba(0, 0, 0, 0.08);
    border-radius: 999px;
    padding: 0.1rem 0.45rem;
    line-height: 1.3;
  }

  /* ── DataTable ───────────────────────────────────────────── */
  .cart-main :deep(.p-accordioncontent-content) {
    padding: 0;
  }

  .cart-main :deep(.p-datatable-thead > tr > th) {
    background: transparent;
    border-top: none;
    padding: 0.5rem 0.875rem;
    font-size: 0.75rem;
    color: var(--p-gray-400);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .cart-main :deep(.p-datatable-tbody > tr > td) {
    padding: 0.625rem 0.875rem;
    border-bottom-color: var(--p-gray-50);
  }

  /* Expansion row */
  .cart-main :deep(.p-datatable-row-expansion),
  .cart-main :deep(.p-datatable-row-expansion:hover) {
    background: transparent !important;
    background-color: transparent !important;
  }

  .cart-main :deep(.p-datatable-row-expansion > td),
  .cart-main :deep(.p-datatable-row-expansion:hover > td) {
    padding: 0 !important;
    background: transparent !important;
    background-color: transparent !important;
  }

  /* ── Inactive product row (yellow) ───────────────────────── */
  .cart-main :deep(.row-inactive > td) {
    background-color: #fffbeb !important;
  }

  /* ── Product thumbnail ───────────────────────────────────── */
  .prod-thumb {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.375rem;
    border: 1px solid var(--p-gray-200);
    background: var(--p-gray-50);
    flex-shrink: 0;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ── Row action buttons ──────────────────────────────────── */
  .cart-main :deep(.row-action-btn) {
    width: 1.875rem !important;
    height: 1.875rem !important;
    min-width: 0 !important;
    padding: 0 !important;
  }

  /* ── Quantity spinner ────────────────────────────────────── */
  .cart-main :deep(.item-quantity.p-inputnumber) {
    display: flex;
    align-items: stretch;
    height: 2.5rem;
  }

  .cart-main :deep(.item-quantity .p-inputnumber-input) {
    width: 3rem;
    height: 100%;
    padding: 0 0.25rem;
    text-align: center;
    box-sizing: border-box;
  }

  .cart-main :deep(.item-quantity .p-inputnumber-button-group) {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .cart-main :deep(.item-quantity .p-inputnumber-button) {
    width: 1.625rem;
    flex: 1 1 0;
    min-height: 0;
    padding: 0;
  }

  /* ── Add product row ─────────────────────────────────────── */
  .add-product-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.5rem 0.875rem;
    border: none;
    background: transparent;
    color: var(--p-gray-500);
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    border-top: 1px dashed var(--p-gray-200);
    transition:
      color 0.1s ease,
      background 0.1s ease;
    text-align: left;
  }

  .add-product-row:hover {
    color: var(--p-primary-600);
    background: var(--p-primary-50);
  }

  /* ── Group subtotal ──────────────────────────────────────── */
  .group-subtotal {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 0.875rem;
    border-top: 1px solid var(--p-gray-200);
    background: var(--p-gray-50);
    font-size: 0.8125rem;
  }

  /* ── Discount inputs ─────────────────────────────────────── */
  .cart-main :deep(.discount-input .p-inputnumber-input),
  :deep(.discount-input .p-inputnumber-input) {
    padding: 0.25rem 0.5rem;
  }

  /* ── Cart totals card ────────────────────────────────────── */
  .cart-totals-card {
    border: none;
    border-top: 1px solid var(--p-gray-200);
    background: var(--p-gray-50);
    overflow: hidden;
  }

  .totals-add-btn {
    font-size: 0.75rem !important;
    padding: 0.2rem 0.5rem !important;
    height: auto !important;
  }

  /* ── Discount/price colors ───────────────────────────────── */
  .discount-price {
    color: #e94b57;
  }

  /* ── Transitions ─────────────────────────────────────────── */
  .fade-slide-enter-active {
    overflow: hidden;
    max-height: 8rem;
    transition:
      opacity 0.2s ease-out,
      max-height 0.2s ease-out,
      transform 0.2s ease-out;
  }
  .fade-slide-leave-active {
    overflow: hidden;
    max-height: 8rem;
    transition:
      opacity 0.18s ease-in,
      max-height 0.18s ease-in;
  }
  .fade-slide-enter-from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-4px);
  }
  .fade-slide-leave-to {
    opacity: 0;
    max-height: 0;
  }
</style>
