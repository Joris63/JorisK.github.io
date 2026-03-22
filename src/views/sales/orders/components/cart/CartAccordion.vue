<script setup lang="ts">
import { ref } from 'vue';
import { useOrderCart } from '@/composables/useOrderCart';
import type { CartItem } from '@/types/orders';

const props = defineProps<{
  readonly?: boolean;
  activeGroups: string[];
}>();

const emit = defineEmits<{
  'update:activeGroups': [value: string[]];
  addToGroup: [groupId: string];
}>();

const { groups, formatPrice, rowTotal, groupTotal, groupItemCount } = useOrderCart();

const imageErrors = ref<Record<string, boolean>>({});

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
  <div class="cart-accordion-wrapper">
    <Menu ref="actionMenu" :model="rowMenuItems" popup />
    <ContextMenu ref="contextMenu" :model="rowMenuItems" />
    <Accordion
      :value="props.activeGroups"
      multiple
      @update:value="emit('update:activeGroups', $event as string[])"
    >
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
              v-if="group.items.length > 0 && !props.activeGroups.includes(group.id)"
              class="panel-count"
              >{{ group.items.length }}</span
            >
          </div>
          <div class="flex items-center shrink-0 gap-1" @click.stop>
            <template v-if="!props.readonly && !props.activeGroups.includes(group.id)">
              <Button
                icon="pi pi-plus"
                text
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
                text
                severity="secondary"
                rounded
                class="header-action-btn"
              />
              <Button
                icon="pi pi-trash"
                text
                severity="secondary"
                rounded
                class="header-action-btn"
              />
            </template>
            <div v-if="!props.readonly" class="flex flex-col">
              <Button
                icon="pi pi-chevron-up"
                text
                severity="secondary"
                rounded
                class="header-action-btn reorder-btn"
                :disabled="index === 0"
                @click="moveUp(index)"
              />
              <Button
                icon="pi pi-chevron-down"
                text
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
                    <span class="font-medium text-base truncate">{{ data.name }}</span>
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
                    class="text-base font-medium"
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
                  class="text-base font-semibold"
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
                    text
                    severity="secondary"
                    rounded
                    class="row-action-btn"
                    @click="toggleActionMenu"
                  />
                  <Button
                    v-if="!props.readonly"
                    icon="pi pi-trash"
                    text
                    severity="danger"
                    rounded
                    class="row-action-btn"
                  />
                  <Button
                    :icon="isRowExpanded(group.id, data) ? 'pi pi-minus' : 'pi pi-plus'"
                    text
                    severity="secondary"
                    rounded
                    class="row-action-btn"
                    @click="toggleRowExpansion(group.id, data)"
                  />
                  <div v-if="!props.readonly" class="flex flex-col ml-1">
                    <Button
                      icon="pi pi-chevron-up"
                      text
                      severity="secondary"
                      rounded
                      class="row-action-btn reorder-btn"
                    />
                    <Button
                      icon="pi pi-chevron-down"
                      text
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
              <div class="px-4 py-3 text-base text-gray-400 italic">
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
  </div>
</template>

<style>
@import '@/assets/cart-accordion.css';
</style>
