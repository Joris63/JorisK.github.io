<script setup lang="ts">
  import { Message } from 'primevue';
  import { ref } from 'vue';
  import { useOrderCart } from '@/composables/useOrderCart';
  import type { CartItem } from '@/composables/useOrderCart';

  const {
    groups,
    orderDiscountExpanded,
    orderDiscountPercent,
    orderDiscountAmount,
    orderPrijscorrectie,
    verzendkostenValue,
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

  function scrollToGroup(groupId: string) {
    if (!activeGroups.value.includes(groupId)) {
      activeGroups.value = [...activeGroups.value, groupId];
    }
    // Wait for accordion to open before scrolling
    setTimeout(() => {
      document
        .getElementById(`group-${groupId}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  // Track which image URLs have failed to load
  const imageErrors = ref<Record<string, boolean>>({});

  // PrimeVue v4 expandedRows object format: { [dataKey]: boolean }
  // Keyed by group.id → inner object keyed by productcode
  const expandedRows = ref<Record<string, Record<string, boolean>>>({
    '0': {},
    '1': {},
    '2': {},
  });

  function isRowExpanded(groupId: string, item: CartItem): boolean {
    return expandedRows.value[groupId]?.[item.productcode] === true;
  }

  function toggleRowExpansion(groupId: string, item: CartItem) {
    const current = expandedRows.value[groupId] ?? {};
    if (current[item.productcode]) {
      const updated = { ...current };
      delete updated[item.productcode];
      expandedRows.value[groupId] = updated;
    } else {
      expandedRows.value[groupId] = { ...current, [item.productcode]: true };
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
  <div class="flex pt-2 gap-3">
    <!-- Sidebar -->
    <div class="w-2/10 flex flex-col">
      <!-- Groepen header -->
      <div class="flex items-center justify-between px-1 mb-1">
        <span class="text-xs font-bold tracking-wider uppercase text-gray-400">Groepen</span>
        <Button rounded icon="pi pi-plus" variant="text" severity="secondary" size="small" />
      </div>

      <!-- Group nav items -->
      <Menu ref="groupMenu" :model="groupMenuItems" popup />
      <div class="flex flex-col gap-0.5">
        <div
          v-for="group in groups"
          :key="group.id"
          class="group flex items-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <button
            class="flex items-center flex-1 min-w-0 px-3 py-1.5 text-left border-0 bg-transparent text-gray-600 cursor-pointer"
            @click="scrollToGroup(group.id)"
          >
            <span class="truncate">{{ group.name }}</span>
            <span
              v-if="group.items.length > 0"
              class="ml-2 shrink-0 text-xs rounded-full px-1.5 py-0.5 tabular-nums bg-gray-200 text-gray-500"
            >
              {{ group.items.length }}
            </span>
          </button>
          <button
            class="opacity-0 group-hover:opacity-100 mr-1.5 shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 border-0 bg-transparent cursor-pointer text-gray-400 transition-opacity p-0"
            @click="toggleGroupMenu($event)"
          >
            <i class="pi pi-ellipsis-h text-xs" />
          </button>
        </div>
      </div>

      <!-- Suggesties header -->
      <div class="px-1 mb-1 mt-4">
        <span class="text-xs font-bold tracking-wider uppercase text-gray-400">Suggesties</span>
      </div>
      <div class="flex flex-col">
        <Button
          label="Badmeubel"
          variant="text"
          severity="secondary"
          icon="pi pi-plus"
          icon-pos="right"
          class="justify-start! px-3!"
          size="small"
        />
        <Button
          label="Badmeubel"
          variant="text"
          severity="secondary"
          icon="pi pi-plus"
          icon-pos="right"
          class="justify-start! px-3!"
          size="small"
        />
        <Button
          label="Douche"
          variant="text"
          severity="secondary"
          icon="pi pi-plus"
          icon-pos="right"
          class="justify-start! px-3!"
          size="small"
        />
        <Button
          label="Verwarming"
          variant="text"
          severity="secondary"
          icon="pi pi-plus"
          icon-pos="right"
          class="justify-start! px-3!"
          size="small"
        />
        <Button
          label="Tegels"
          variant="text"
          severity="secondary"
          icon="pi pi-plus"
          icon-pos="right"
          class="justify-start! px-3!"
          size="small"
        />
        <Button
          label="Toilet"
          variant="text"
          severity="secondary"
          icon="pi pi-plus"
          icon-pos="right"
          class="justify-start! px-3!"
          size="small"
        />
        <Button
          label="Onderhoudsmiddelen"
          variant="text"
          severity="secondary"
          icon="pi pi-plus"
          icon-pos="right"
          class="justify-start! px-3!"
          size="small"
        />
      </div>
    </div>

    <!-- Shared popup menu for secondary row actions -->
    <Menu ref="actionMenu" :model="rowMenuItems" popup />
    <ContextMenu ref="contextMenu" :model="rowMenuItems" />

    <!-- Accordion + DataTable -->
    <div class="cart-groups w-8/10 flex flex-col gap-3">
      <Accordion v-model:value="activeGroups" multiple>
        <AccordionPanel
          v-for="(group, index) in groups"
          :key="group.id"
          :value="group.id"
          :id="`group-${group.id}`"
          :class="{ 'panel-primary': group.id !== '0', 'panel-default': group.id === '0' }"
        >
          <AccordionHeader :pt="{ root: { as: 'div', role: 'button', tabindex: '0' } }">
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <span class="font-semibold truncate">{{ group.name }}</span>
              <i v-if="group.id === '0'" class="pi pi-info-circle text-gray-400 shrink-0" />
              <span
                v-if="group.items.length > 0 && !activeGroups.includes(group.id)"
                class="ml-2 shrink-0 text-xs rounded-full px-1.5 py-0.5 tabular-nums bg-gray-200 text-gray-500"
              >
                {{ group.items.length }}
              </span>
            </div>
            <div class="flex items-center shrink-0 gap-1" @click.stop>
              <template v-if="group.id !== '0'">
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
              <div class="flex flex-col">
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
              data-key="productcode"
              class="w-full"
              :row-class="() => (group.name.includes('Garantie') ? 'row-guarantee' : '')"
              v-model:expanded-rows="expandedRows[group.id]"
              context-menu
              @row-contextmenu="onRowContextMenu"
            >
              <Column selection-mode="multiple" style="width: 3rem" />

              <!-- Naam + image -->
              <Column header="Naam">
                <template #body="{ data }">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-lg shrink-0 overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center"
                    >
                      <img
                        v-if="data.imageUrl && !imageErrors[data.productcode]"
                        :src="data.imageUrl"
                        :alt="data.naam"
                        class="w-full h-full object-cover"
                        @error="imageErrors[data.productcode] = true"
                      />
                      <i v-else class="pi pi-image text-gray-300 text-sm" />
                    </div>
                    <div class="flex flex-col leading-snug">
                      <span class="font-medium">{{ data.naam }}</span>
                      <span class="text-xs text-gray-400">{{ data.productcode }}</span>
                    </div>
                  </div>
                </template>
              </Column>

              <!-- Beschikbaarheid (voorraad + levertijd merged) -->
              <Column header="Beschikbaarheid">
                <template #body="{ data }">
                  <div class="flex items-center gap-1.5">
                    <i
                      :class="
                        data.voorraad > 0
                          ? 'pi pi-check-circle text-green-500'
                          : 'pi pi-times-circle text-red-500'
                      "
                    />
                    <span class="text-sm text-gray-500">{{ data.levertijd }}</span>
                  </div>
                </template>
              </Column>

              <!-- Quantity spinner -->
              <Column header="Aantal" style="width: 8rem">
                <template #body="{ data }">
                  <InputNumber
                    v-model="data.aantal"
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
                      >{{ formatPrice(data.prijs) }}</span
                    >
                    <span
                      class="font-medium"
                      :class="
                        data.discountPercent > 0 || data.discountAmount > 0 ? 'discount-price' : ''
                      "
                    >
                      {{
                        formatPrice(
                          Math.max(
                            0,
                            data.prijs * (1 - data.discountPercent / 100) - data.discountAmount
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
                    class="font-semibold"
                    :class="
                      data.discountPercent > 0 || data.discountAmount > 0 ? 'discount-price' : ''
                    "
                  >
                    {{ formatPrice(rowTotal(data)) }}
                  </span>
                </template>
              </Column>

              <!-- Actions -->
              <Column style="width: 1px; white-space: nowrap">
                <template #body="{ data }">
                  <div class="flex items-center gap-0.5">
                    <Button
                      icon="pi pi-ellipsis-h"
                      variant="text"
                      severity="secondary"
                      rounded
                      class="row-action-btn"
                      @click="toggleActionMenu"
                    />
                    <Button
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
                    <div class="flex flex-col ml-1">
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
                    v-model="data.discountAmount"
                    :min="0"
                    :min-fraction-digits="2"
                    :max-fraction-digits="2"
                    prefix="€ "
                    :input-style="{ width: '5.5rem', textAlign: 'right' }"
                    :pt="{ input: { placeholder: '€ 0,00' } }"
                    class="discount-input"
                  />
                  <div class="flex items-center gap-1.5 pl-2 border-l border-gray-200">
                    <ToggleSwitch v-model="data.prijscorrectie" />
                    <span class="text-xs text-gray-500">Prijscorrectie</span>
                  </div>
                </div>
              </template>

              <template #empty>
                <div class="p-3">
                  <Message class="w-full text-center">Nog geen producten toegevoegd</Message>
                </div>
              </template>
            </DataTable>

            <!-- Group subtotal -->
            <div
              v-if="groupItemCount(group) > 0"
              class="flex items-center justify-between px-4 py-2.5 border-t border-gray-200 bg-gray-50 text-sm"
            >
              <span class="text-gray-500">
                Subtotaal, {{ groupItemCount(group) }}
                {{ groupItemCount(group) === 1 ? 'product' : 'producten' }}
              </span>
              <span class="font-medium">{{ formatPrice(groupTotal(group)) }}</span>
            </div>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>

      <!-- Cart summary footer -->
      <div class="rounded-lg border border-gray-200 bg-white mt-1 overflow-hidden">
        <!-- Expandable order discount row (top) -->
        <Transition name="fade-slide">
          <div
            v-if="orderDiscountExpanded"
            class="flex items-center justify-end gap-3 px-4 py-2.5 border-b border-gray-200 bg-gray-50"
          >
            <span class="text-xs text-gray-400 mr-auto"
              >Deze korting geldt op de gehele bestelling</span
            >
            <InputNumber
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
              v-model="orderDiscountAmount"
              :min="0"
              :min-fraction-digits="2"
              :max-fraction-digits="2"
              prefix="€ "
              :input-style="{ width: '5rem', textAlign: 'right' }"
              class="discount-input"
            />
            <div class="flex items-center gap-1.5 pl-3 border-l border-gray-200">
              <ToggleSwitch v-model="orderPrijscorrectie" />
              <span class="text-xs text-gray-500">Prijscorrectie</span>
            </div>
            <div class="flex items-center gap-2 pl-3 border-l border-gray-200">
              <span class="text-xs text-gray-500">Verzendkosten</span>
              <InputNumber
                v-model="verzendkostenValue"
                :min="0"
                :min-fraction-digits="2"
                :max-fraction-digits="2"
                :input-style="{ width: '5rem', textAlign: 'right' }"
                class="discount-input"
              />
              <span class="text-xs text-gray-400">€</span>
            </div>
            <Button
              icon="pi pi-minus"
              variant="text"
              severity="secondary"
              size="small"
              rounded
              class="shrink-0 ml-1"
              @click="orderDiscountExpanded = false"
            />
          </div>
        </Transition>

        <!-- Main row -->
        <div class="flex items-center justify-between px-4 py-3 gap-6">
          <!-- Left: item count -->
          <span class="text-sm text-gray-500 shrink-0 flex items-center">
            Totaal (incl. BTW), {{ cartItemCount }}
            {{ cartItemCount === 1 ? 'product' : 'producten' }}
            <i class="pi pi-info-circle ml-1" />
          </span>

          <!-- Right: price breakdown -->
          <div class="flex flex-col gap-1 min-w-56">
            <div class="flex justify-end mb-0.5">
              <Button
                v-if="!orderDiscountExpanded"
                icon="pi pi-plus"
                variant="text"
                severity="secondary"
                size="small"
                rounded
                @click="orderDiscountExpanded = true"
              />
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Subtotaal</span>
              <span>{{ formatPrice(cartSubtotal) }}</span>
            </div>
            <div v-if="cartDiscount > 0" class="flex justify-between text-sm">
              <span class="text-gray-500">Extra korting</span>
              <span class="discount-price">{{ formatPrice(-cartDiscount) }}</span>
            </div>
            <div v-if="orderDiscountValue > 0" class="flex justify-between text-sm">
              <span class="text-gray-500">Orderkorting</span>
              <span class="discount-price">{{ formatPrice(-orderDiscountValue) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Verzendkosten</span>
              <span :class="verzendkostenValue === 0 ? 'text-primary font-medium' : ''">
                {{ verzendkostenValue === 0 ? 'Gratis' : formatPrice(verzendkostenValue) }}
              </span>
            </div>
            <Divider class="my-1" />
            <div class="flex justify-between items-baseline">
              <span class="text-sm font-semibold">Totaal (incl. BTW)</span>
              <span class="text-lg font-semibold">{{ formatPrice(orderTotal) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* ── Accordion shell ─────────────────────────────────────── */
  .cart-groups :deep(.p-accordion) {
    border: none;
    gap: 0.75rem;
    display: flex;
    flex-direction: column;
  }

  /* ── Panel card ──────────────────────────────────────────── */
  .cart-groups :deep(.p-accordionpanel) {
    border: 1px solid var(--p-gray-200);
    border-radius: 0.5rem;
    overflow: hidden;
    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease;
  }

  .cart-groups :deep(.p-accordionpanel:hover) {
    border-color: var(--p-gray-300);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  }

  .cart-groups :deep(.p-accordionpanel[data-p-active='true']) {
    border-color: var(--p-gray-300);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }

  /* ── Header base ─────────────────────────────────────────── */
  .cart-groups :deep(.p-accordionheader) {
    gap: 0;
    background: var(--p-gray-0);
    border: none;
    border-bottom: 1px solid var(--p-gray-200);
    border-radius: 0;
    padding: 0.65rem 1rem;
    font-size: 0.875rem;
    transition:
      background 0.15s ease,
      border-color 0.15s ease;
    cursor: pointer;
  }

  .cart-groups :deep(.p-accordionheader:hover) {
    background: var(--p-gray-50);
  }

  .cart-groups :deep(.p-accordionpanel[data-p-active='true'] .p-accordionheader) {
    background: var(--p-gray-50);
    border-bottom-color: var(--p-gray-300);
  }

  /* ── Toggle chevron ──────────────────────────────────────── */
  .cart-groups :deep(.p-accordionheader-toggle-icon) {
    order: -1;
    margin-right: 0.375rem;
    color: var(--p-gray-400);
    width: 0.875rem;
    height: 0.875rem;
    transition: color 0.15s ease;
  }

  .cart-groups :deep(.p-accordionpanel[data-p-active='true'] .p-accordionheader-toggle-icon) {
    color: var(--p-gray-600);
  }

  /* ── Primary panel card ──────────────────────────────────── */
  .cart-groups :deep(.panel-primary) {
    border-color: var(--p-primary-200);
  }

  .cart-groups :deep(.panel-primary:hover) {
    border-color: var(--p-primary-300) !important;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08) !important;
  }

  .cart-groups :deep(.panel-primary[data-p-active='true']) {
    border-color: var(--p-primary-300) !important;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1) !important;
  }

  /* ── Primary header ──────────────────────────────────────── */
  .cart-groups :deep(.panel-primary .p-accordionheader) {
    background: var(--p-primary-50);
    border-bottom-color: var(--p-primary-200);
    color: var(--p-primary-800);
  }

  .cart-groups :deep(.panel-primary .p-accordionheader:hover) {
    background: var(--p-primary-100) !important;
    border-bottom-color: var(--p-primary-200);
  }

  .cart-groups :deep(.panel-primary[data-p-active='true'] .p-accordionheader) {
    background: var(--p-primary-100) !important;
    border-bottom-color: var(--p-primary-300) !important;
    color: var(--p-primary-900);
  }

  .cart-groups :deep(.panel-primary .p-accordionheader-toggle-icon) {
    order: -1;
    color: var(--p-primary-400);
  }

  .cart-groups :deep(.panel-primary[data-p-active='true'] .p-accordionheader-toggle-icon) {
    color: var(--p-primary-600) !important;
  }

  /* ── Default panel card (Ongegroepeerd) ──────────────────── */
  .cart-groups :deep(.panel-default) {
    border-color: var(--p-gray-200);
  }

  .cart-groups :deep(.panel-default:hover) {
    border-color: var(--p-gray-300) !important;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06) !important;
  }

  .cart-groups :deep(.panel-default[data-p-active='true']) {
    border-color: var(--p-gray-300) !important;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06) !important;
  }

  .cart-groups :deep(.panel-default .p-accordionheader) {
    background: var(--p-gray-50);
    border-bottom-color: var(--p-gray-200);
    color: var(--p-gray-700);
  }

  .cart-groups :deep(.panel-default .p-accordionheader:hover) {
    background: var(--p-gray-100) !important;
    border-bottom-color: var(--p-gray-200);
  }

  .cart-groups :deep(.panel-default[data-p-active='true'] .p-accordionheader) {
    background: var(--p-gray-100) !important;
    border-bottom-color: var(--p-gray-300) !important;
    color: var(--p-gray-800);
  }

  .cart-groups :deep(.panel-default .p-accordionheader-toggle-icon) {
    order: -1;
    color: var(--p-gray-400);
  }

  .cart-groups :deep(.panel-default[data-p-active='true'] .p-accordionheader-toggle-icon) {
    color: var(--p-gray-500) !important;
  }

  /* ── Action buttons ──────────────────────────────────────── */
  .cart-groups :deep(.header-action-btn) {
    color: var(--p-gray-400) !important;
    width: 1.75rem !important;
    height: 1.75rem !important;
    min-width: 0 !important;
    padding: 0 !important;
    transition:
      color 0.15s ease,
      background 0.15s ease !important;
  }

  .cart-groups :deep(.header-action-btn:hover) {
    color: var(--p-gray-700) !important;
    background: rgba(0, 0, 0, 0.06) !important;
  }

  .cart-groups :deep(.reorder-btn) {
    width: 1.25rem !important;
    height: 1.25rem !important;
    min-width: 0 !important;
    padding: 0 !important;
    font-size: 0.55rem;
  }

  .cart-groups :deep(.panel-primary .header-action-btn) {
    color: var(--p-primary-400) !important;
  }

  .cart-groups :deep(.panel-primary .header-action-btn:hover) {
    color: var(--p-primary-700) !important;
    background: rgba(0, 0, 0, 0.07) !important;
  }

  /* ── DataTable ───────────────────────────────────────────── */
  .cart-groups :deep(.p-accordioncontent-content) {
    padding: 0;
  }

  .cart-groups :deep(.p-datatable-thead > tr > th) {
    background: transparent;
    border-top: none;
    padding: 0.6rem 1rem;
  }

  .cart-groups :deep(.p-datatable-tbody > tr > td) {
    padding: 0.75rem 1rem;
  }

  /* Expansion row: no hover, no padding (inner div controls layout) */
  .cart-groups :deep(.p-datatable-row-expansion),
  .cart-groups :deep(.p-datatable-row-expansion:hover) {
    background: transparent !important;
    background-color: transparent !important;
  }

  .cart-groups :deep(.p-datatable-row-expansion > td),
  .cart-groups :deep(.p-datatable-row-expansion:hover > td) {
    padding: 0 !important;
    background: transparent !important;
    background-color: transparent !important;
  }

  /* ── Guarantee row highlight ─────────────────────────────── */
  .cart-groups :deep(.row-guarantee > td) {
    background-color: #fffbeb !important;
  }

  /* ── Row action buttons ──────────────────────────────────── */
  .cart-groups :deep(.row-action-btn) {
    width: 1.75rem !important;
    height: 1.75rem !important;
    min-width: 0 !important;
    padding: 0 !important;
  }

  /* ── Quantity spinner ────────────────────────────────────── */
  .cart-groups :deep(.item-quantity.p-inputnumber) {
    display: flex;
    align-items: stretch;
    height: 2.75rem;
  }

  .cart-groups :deep(.item-quantity .p-inputnumber-input) {
    width: 3.5rem;
    height: 100%;
    padding: 0 0.375rem;
    text-align: center;
    box-sizing: border-box;
  }

  .cart-groups :deep(.item-quantity .p-inputnumber-button-group) {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .cart-groups :deep(.item-quantity .p-inputnumber-button) {
    width: 1.75rem;
    flex: 1 1 0;
    min-height: 0;
    padding: 0;
  }

  /* ── Discount section ────────────────────────────────────── */
  .cart-groups :deep(.discount-input .p-inputnumber-input),
  :deep(.discount-input .p-inputnumber-input) {
    padding: 0.25rem 0.5rem;
  }

  .discount-price {
    color: #e94b57;
  }
</style>
