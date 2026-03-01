<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  interface Customer {
    id: number;
    lastName: string;
    email: string;
    lastModified: string;
  }

  const customers = ref<Customer[]>([
    {
      id: 1,
      lastName: 'Bakker',
      email: 'thomas.bakker@gmail.com',
      lastModified: '3 februari 2026 09:14',
    },
    {
      id: 2,
      lastName: 'de Vries',
      email: 'nora.devries@outlook.com',
      lastModified: '21 januari 2026 16:42',
    },
    {
      id: 3,
      lastName: 'van Dijk',
      email: 'r.vandijk@kpnmail.nl',
      lastModified: '14 januari 2026 11:05',
    },
    {
      id: 4,
      lastName: 'Janssen',
      email: 'lienekejanssen@hotmail.com',
      lastModified: '9 december 2025 08:30',
    },
    { id: 5, lastName: 'Smit', email: 'p.smit82@ziggo.nl', lastModified: '2 december 2025 14:17' },
    {
      id: 6,
      lastName: 'Meijer',
      email: 'erik.meijer@gmail.com',
      lastModified: '18 november 2025 10:55',
    },
    {
      id: 7,
      lastName: 'van den Berg',
      email: 'anneke.vdberg@live.nl',
      lastModified: '5 november 2025 13:22',
    },
    {
      id: 8,
      lastName: 'Visser',
      email: 'm.visser@upcmail.nl',
      lastModified: '29 oktober 2025 09:48',
    },
    {
      id: 9,
      lastName: 'Mulder',
      email: 'hansmulder@gmail.com',
      lastModified: '14 oktober 2025 17:03',
    },
    {
      id: 10,
      lastName: 'de Boer',
      email: 'deboer.sandra@hetnet.nl',
      lastModified: '1 oktober 2025 12:30',
    },
    { id: 11, lastName: 'Bos', email: 'w.bos@planet.nl', lastModified: '22 september 2025 08:11' },
    {
      id: 12,
      lastName: 'van Leeuwen',
      email: 'cvanleeuwen@gmail.com',
      lastModified: '10 september 2025 15:44',
    },
    {
      id: 13,
      lastName: 'Dekker',
      email: 'jos.dekker@xs4all.nl',
      lastModified: '28 augustus 2025 11:29',
    },
    {
      id: 14,
      lastName: 'Hendriks',
      email: 'f.hendriks@outlook.com',
      lastModified: '15 augustus 2025 09:00',
    },
    {
      id: 15,
      lastName: 'Peters',
      email: 'margriet.peters@gmail.com',
      lastModified: '3 augustus 2025 16:58',
    },
  ]);

  const totalRecords = ref(1609688);

  // ── Filter definitions ──────────────────────────────────────────
  type FilterType = 'text' | 'boolean';

  interface FilterConfig {
    key: string;
    label: string;
    type: FilterType;
    placeholder?: string;
  }

  const allFilterDefs: FilterConfig[] = [
    { key: 'email', label: 'Email', type: 'text', placeholder: 'jan@bedrijf.nl' },
    { key: 'achternaam', label: 'Achternaam', type: 'text', placeholder: 'de Vries' },
    { key: 'voornaam', label: 'Voornaam', type: 'text', placeholder: 'Jan' },
    {
      key: 'bedrijfsnaam',
      label: 'Bedrijfsnaam',
      type: 'text',
      placeholder: 'Bouwbedrijf de Vries',
    },
    { key: 'postcode', label: 'Postcode', type: 'text', placeholder: '1234 AB' },
    { key: 'huisnummer', label: 'Huisnummer', type: 'text', placeholder: '12' },
    { key: 'huisnummerToevoeging', label: 'Huisnummer toevoeging', type: 'text', placeholder: 'A' },
    { key: 'woonplaats', label: 'Woonplaats', type: 'text', placeholder: 'Amsterdam' },
    { key: 'telefoonnummer', label: 'Telefoonnummer', type: 'text', placeholder: '06 12345678' },
    { key: 'isB2BKlant', label: 'Is B2B Klant', type: 'boolean' },
    { key: 'heeftBedrijf', label: 'Heeft bedrijf', type: 'boolean' },
    { key: 'heeftBestellingen', label: 'Heeft bestellingen', type: 'boolean' },
  ];

  // Which filter keys are currently shown as chips (ordered)
  const activeFilterKeys = ref<string[]>([
    'email',
    'achternaam',
    'postcode',
    'huisnummer',
    'huisnummerToevoeging',
    'isB2BKlant',
  ]);

  // Derived: only the configs for active keys, in order
  const filterConfigs = computed(() =>
    activeFilterKeys.value
      .map((k) => allFilterDefs.find((f) => f.key === k))
      .filter((f): f is FilterConfig => f !== undefined)
  );

  // One value slot per possible filter (never shrinks)
  const filterValues = ref<Record<string, string | boolean | null>>(
    Object.fromEntries(allFilterDefs.map((f) => [f.key, f.type === 'boolean' ? null : '']))
  );

  // ── Popover management ──────────────────────────────────────────
  const filterPopovers = ref(new Map<string, any>());

  function setFilterPopover(key: string, el: any) {
    if (el) filterPopovers.value.set(key, el);
    else filterPopovers.value.delete(key);
  }

  function toggleFilter(key: string, event: MouseEvent) {
    filterConfigs.value.forEach((f) => {
      if (f.key !== key) filterPopovers.value.get(f.key)?.hide();
    });
    filterPopovers.value.get(key)?.toggle(event);
  }

  // ── Filter chip helpers ─────────────────────────────────────────
  function getDisplayValue(key: string): string | null {
    const config = allFilterDefs.find((f) => f.key === key)!;
    const val = filterValues.value[key];
    if (val === '' || val === null || val === undefined) return null;
    if (config.type === 'boolean') return val ? 'Ja' : 'Nee';
    return String(val);
  }

  function clearFilter(key: string, event?: MouseEvent) {
    event?.stopPropagation();
    const config = allFilterDefs.find((f) => f.key === key);
    filterValues.value[key] = config?.type === 'boolean' ? null : '';
    filterPopovers.value.get(key)?.hide();
  }

  function clearAllFilters() {
    allFilterDefs.forEach((f) => {
      filterValues.value[f.key] = f.type === 'boolean' ? null : '';
    });
  }

  const hasActiveFilters = computed(() =>
    filterConfigs.value.some((f) => getDisplayValue(f.key) !== null)
  );

  // ── Filters beheren dialog ──────────────────────────────────────
  const dialogVisible = ref(false);
  const dialogActiveKeys = ref<string[]>([]);
  const dialogLeftSel = ref<string[]>([]);
  const dialogRightSel = ref<string[]>([]);
  const filterSearch = ref('');

  const dialogAvailable = computed(() => {
    const activeSet = new Set(dialogActiveKeys.value);
    return allFilterDefs.filter((f) => !activeSet.has(f.key));
  });

  const filteredAvailable = computed(() => {
    const q = filterSearch.value.trim().toLowerCase();
    return q
      ? dialogAvailable.value.filter((f) => f.label.toLowerCase().includes(q))
      : dialogAvailable.value;
  });

  const hiddenCount = computed(() => dialogAvailable.value.length - filteredAvailable.value.length);

  const canMoveUp = computed(
    () =>
      dialogLeftSel.value.length === 1 && dialogActiveKeys.value.indexOf(dialogLeftSel.value[0]) > 0
  );

  const canMoveDown = computed(
    () =>
      dialogLeftSel.value.length === 1 &&
      dialogActiveKeys.value.indexOf(dialogLeftSel.value[0]) < dialogActiveKeys.value.length - 1
  );

  function openDialog() {
    dialogActiveKeys.value = [...activeFilterKeys.value];
    dialogLeftSel.value = [];
    dialogRightSel.value = [];
    filterSearch.value = '';
    dialogVisible.value = true;
  }

  function saveDialog() {
    activeFilterKeys.value = [...dialogActiveKeys.value];
    // Clear values for filters no longer in the active set
    allFilterDefs.forEach((f) => {
      if (!activeFilterKeys.value.includes(f.key)) {
        filterValues.value[f.key] = f.type === 'boolean' ? null : '';
      }
    });
    dialogVisible.value = false;
  }

  function toggleLeftSel(key: string) {
    dialogRightSel.value = [];
    const idx = dialogLeftSel.value.indexOf(key);
    if (idx >= 0) dialogLeftSel.value.splice(idx, 1);
    else dialogLeftSel.value.push(key);
  }

  function toggleRightSel(key: string) {
    dialogLeftSel.value = [];
    const idx = dialogRightSel.value.indexOf(key);
    if (idx >= 0) dialogRightSel.value.splice(idx, 1);
    else dialogRightSel.value.push(key);
  }

  function addFilters() {
    if (!dialogRightSel.value.length) return;
    dialogActiveKeys.value = [...dialogActiveKeys.value, ...dialogRightSel.value];
    dialogRightSel.value = [];
  }

  function addFilterDirectly(key: string) {
    dialogRightSel.value = [key];
    addFilters();
  }

  function removeFilters() {
    if (!dialogLeftSel.value.length) return;
    const removeSet = new Set(dialogLeftSel.value);
    dialogActiveKeys.value = dialogActiveKeys.value.filter((k) => !removeSet.has(k));
    dialogLeftSel.value = [];
  }

  function moveUp() {
    if (!canMoveUp.value) return;
    const key = dialogLeftSel.value[0];
    const idx = dialogActiveKeys.value.indexOf(key);
    const arr = [...dialogActiveKeys.value];
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    dialogActiveKeys.value = arr;
  }

  function moveDown() {
    if (!canMoveDown.value) return;
    const key = dialogLeftSel.value[0];
    const idx = dialogActiveKeys.value.indexOf(key);
    const arr = [...dialogActiveKeys.value];
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
    dialogActiveKeys.value = arr;
  }

  function moveToTop() {
    if (dialogLeftSel.value.length !== 1) return;
    const key = dialogLeftSel.value[0];
    dialogActiveKeys.value = [key, ...dialogActiveKeys.value.filter((k) => k !== key)];
  }

  function moveToBottom() {
    if (dialogLeftSel.value.length !== 1) return;
    const key = dialogLeftSel.value[0];
    dialogActiveKeys.value = [...dialogActiveKeys.value.filter((k) => k !== key), key];
  }

  function getLabelForKey(key: string) {
    return allFilterDefs.find((f) => f.key === key)?.label ?? key;
  }
</script>

<template>
  <div class="flex flex-col gap-5 grow">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold text-surface-800">Klanten</h1>
      <Button label="Nieuwe klant toevoegen" icon="pi pi-plus" icon-pos="right" />
    </div>

    <!-- Filter bar -->
    <div class="flex items-center gap-2 flex-wrap">
      <!-- Filter chips -->
      <template v-for="filter in filterConfigs" :key="filter.key">
        <button
          class="filter-chip"
          :class="{ 'filter-chip--active': getDisplayValue(filter.key) !== null }"
          @click="toggleFilter(filter.key, $event)"
        >
          <span class="chip-label">{{ filter.label }}</span>
          <template v-if="getDisplayValue(filter.key) !== null">
            <span class="chip-sep">·</span>
            <span class="chip-value">{{ getDisplayValue(filter.key) }}</span>
          </template>
          <i
            class="pi shrink-0 text-xs ml-0.5"
            :class="getDisplayValue(filter.key) !== null ? 'pi-times' : 'pi-chevron-down'"
            @click.stop="
              getDisplayValue(filter.key) !== null ? clearFilter(filter.key, $event) : undefined
            "
          />
        </button>

        <!-- Filter popover -->
        <Popover :ref="(el: any) => setFilterPopover(filter.key, el)">
          <div class="flex flex-col gap-2" style="min-width: 13rem">
            <span class="popover-filter-label">{{ filter.label }}</span>
            <InputText
              v-if="filter.type === 'text'"
              v-model="filterValues[filter.key] as string"
              :placeholder="filter.placeholder"
              class="w-full"
              autofocus
              @keydown.enter="filterPopovers.get(filter.key)?.hide()"
            />
            <SelectButton
              v-else-if="filter.type === 'boolean'"
              v-model="filterValues[filter.key]"
              :options="[
                { label: 'Ja', value: true },
                { label: 'Nee', value: false },
              ]"
              option-label="label"
              option-value="value"
            />
            <button
              v-if="getDisplayValue(filter.key) !== null"
              class="clear-value-btn"
              @click="clearFilter(filter.key)"
            >
              Waarde wissen ×
            </button>
          </div>
        </Popover>
      </template>

      <!-- Separator -->
      <span class="filter-divider" />

      <!-- Clear all filters -->
      <Transition name="fade">
        <button v-if="hasActiveFilters" class="clear-all-btn" @click="clearAllFilters">
          <i class="pi pi-times" />
          Alle waardes wissen
        </button>
      </Transition>

      <!-- Filters beheren -->
      <button class="filters-beheren-btn" @click="openDialog">Filters beheren</button>
    </div>

    <!-- Result count + pagination -->
    <div class="flex items-center justify-between">
      <span class="text-xs font-semibold uppercase tracking-wider text-gray-400">
        {{ totalRecords.toLocaleString('nl-NL') }} klanten
      </span>
      <Paginator
        :rows="15"
        :total-records="totalRecords"
        :rows-per-page-options="[15, 30, 50]"
        class="p-0! border-0! bg-transparent!"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
      />
    </div>

    <!-- Table -->
    <DataTable
      :value="customers"
      class="customers-table"
      :pt="{ thead: { class: 'border-b border-gray-200' } }"
    >
      <Column field="lastName" header="Achternaam">
        <template #body="{ data }">
          <span class="font-medium text-surface-700">{{ data.lastName }}</span>
        </template>
      </Column>
      <Column field="email" header="E-mail">
        <template #body="{ data }">
          <a
            :href="`mailto:${data.email}`"
            class="text-primary-600 hover:text-primary-800 hover:underline"
          >
            {{ data.email }}
          </a>
        </template>
      </Column>
      <Column field="lastModified" header="Laatst aangepast">
        <template #body="{ data }">
          <span class="text-surface-400 text-sm">{{ data.lastModified }}</span>
        </template>
      </Column>
      <Column header="" style="width: 3rem">
        <template #body="{ data }">
          <Button
            icon="pi pi-pencil"
            variant="text"
            severity="secondary"
            size="small"
            rounded
            @click="router.push({ name: 'CustomerEdit', params: { id: data.id } })"
          />
        </template>
      </Column>
    </DataTable>

    <!-- ── Filters beheren dialog ─────────────────────────────── -->
    <Dialog
      v-model:visible="dialogVisible"
      header="Filters beheren"
      :style="{ width: '50rem' }"
      modal
      :draggable="false"
    >
      <div class="flex gap-3" style="height: 22rem">
        <!-- Reorder buttons -->
        <div class="reorder-btns flex flex-col justify-center gap-1">
          <Button
            icon="pi pi-angle-double-up"
            size="small"
            severity="secondary"
            outlined
            :disabled="!canMoveUp"
            @click="moveToTop"
          />
          <Button
            icon="pi pi-angle-up"
            size="small"
            severity="secondary"
            outlined
            :disabled="!canMoveUp"
            @click="moveUp"
          />
          <Button
            icon="pi pi-angle-down"
            size="small"
            severity="secondary"
            outlined
            :disabled="!canMoveDown"
            @click="moveDown"
          />
          <Button
            icon="pi pi-angle-double-down"
            size="small"
            severity="secondary"
            outlined
            :disabled="!canMoveDown"
            @click="moveToBottom"
          />
        </div>

        <!-- Left panel: current filters -->
        <div class="dialog-panel flex-1">
          <div class="dialog-panel__header">Huidige filterset</div>
          <div class="dialog-panel__body">
            <button
              v-for="key in dialogActiveKeys"
              :key="key"
              class="dialog-item"
              :class="{ 'dialog-item--sel': dialogLeftSel.includes(key) }"
              @click="toggleLeftSel(key)"
            >
              {{ getLabelForKey(key) }}
            </button>
            <div v-if="!dialogActiveKeys.length" class="dialog-empty">
              Geen filters geselecteerd
            </div>
          </div>
        </div>

        <!-- Transfer buttons -->
        <div class="transfer-btns flex flex-col justify-center gap-2">
          <Button
            icon="pi pi-chevron-right"
            severity="secondary"
            outlined
            :disabled="!dialogLeftSel.length"
            @click="removeFilters"
          />
          <Button
            icon="pi pi-chevron-left"
            severity="secondary"
            outlined
            :disabled="!dialogRightSel.length"
            @click="addFilters"
          />
        </div>

        <!-- Right panel: available filters -->
        <div class="dialog-panel flex-1">
          <div class="dialog-panel__header">Beschikbare filters</div>
          <div class="dialog-panel__search">
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText
                v-model="filterSearch"
                placeholder="Zoek een filter"
                class="w-full"
                size="small"
              />
            </IconField>
          </div>
          <div class="dialog-panel__body">
            <button
              v-for="filter in filteredAvailable"
              :key="filter.key"
              class="dialog-item"
              :class="{ 'dialog-item--sel': dialogRightSel.includes(filter.key) }"
              @click="toggleRightSel(filter.key)"
              @dblclick="addFilterDirectly(filter.key)"
            >
              {{ filter.label }}
            </button>
            <div v-if="filterSearch && hiddenCount > 0" class="dialog-search-hint">
              {{ filteredAvailable.length }} gevonden · {{ hiddenCount }} verborgen
              <button class="dialog-show-all" @click="filterSearch = ''">Alles tonen</button>
            </div>
            <div v-if="!dialogAvailable.length" class="dialog-empty">Alle filters zijn actief</div>
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Annuleren" severity="secondary" outlined @click="dialogVisible = false" />
        <Button label="Opslaan" @click="saveDialog" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
  /* ── Filter chips ─────────────────────────────────────────── */
  .filter-chip {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    border: 1.5px solid var(--p-gray-200);
    border-radius: 0.5rem;
    background: white;
    cursor: pointer;
    color: var(--p-gray-600);
    transition:
      border-color 0.15s ease,
      background 0.15s ease,
      color 0.15s ease;
    white-space: nowrap;
  }

  .filter-chip:hover:not(.filter-chip--active) {
    border-color: var(--p-gray-400);
    color: var(--p-gray-800);
  }

  .filter-chip--active {
    background: var(--p-primary-500);
    border-color: var(--p-primary-500);
    color: white;
  }

  .filter-chip--active:hover {
    background: var(--p-primary-600);
    border-color: var(--p-primary-600);
  }

  .chip-label {
    font-size: 0.8125rem;
    font-weight: 500;
  }

  .chip-sep {
    font-size: 0.75rem;
    opacity: 0.6;
  }

  .chip-value {
    font-size: 0.8125rem;
    font-weight: 600;
    max-width: 8rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ── Popover content ─────────────────────────────────────── */
  .popover-filter-label {
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--p-gray-400);
  }

  .clear-value-btn {
    font-size: 0.8125rem;
    color: var(--p-primary-600);
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    text-align: left;
    transition: color 0.1s ease;
  }

  .clear-value-btn:hover {
    color: var(--p-primary-800);
    text-decoration: underline;
  }

  /* ── Filter bar right actions ────────────────────────────── */
  .filter-divider {
    align-self: center;
    height: 1.25rem;
    border-left: 1.5px solid var(--p-gray-200);
    margin: 0 0.125rem;
  }

  .clear-all-btn {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--p-gray-500);
    background: none;
    border: 1.5px solid var(--p-gray-200);
    border-radius: 0.5rem;
    padding: 0.375rem 0.75rem;
    cursor: pointer;
    white-space: nowrap;
    transition:
      color 0.15s ease,
      border-color 0.15s ease;
  }

  .clear-all-btn:hover {
    color: var(--p-red-600);
    border-color: var(--p-red-300);
  }

  .filters-beheren-btn {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--p-gray-500);
    background: none;
    border: none;
    padding: 0.375rem 0.5rem;
    cursor: pointer;
    white-space: nowrap;
    transition: color 0.15s ease;
  }

  .filters-beheren-btn:hover {
    color: var(--p-gray-800);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  /* ── Filters beheren dialog panels ──────────────────────── */
  .dialog-panel {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--p-gray-200);
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .dialog-panel__header {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--p-gray-500);
    background: var(--p-gray-50);
    border-bottom: 1px solid var(--p-gray-200);
    flex-shrink: 0;
  }

  .dialog-panel__search {
    padding: 0.5rem;
    border-bottom: 1px solid var(--p-gray-100);
    flex-shrink: 0;
  }

  .dialog-panel__body {
    overflow-y: auto;
    flex: 1;
  }

  .dialog-item {
    display: block;
    width: 100%;
    text-align: left;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    color: var(--p-gray-700);
    background: none;
    border: none;
    cursor: pointer;
    transition: background 0.1s ease;
  }

  .dialog-item:hover:not(.dialog-item--sel) {
    background: var(--p-gray-50);
  }

  .dialog-item--sel {
    background: var(--p-primary-50);
    color: var(--p-primary-700);
    font-weight: 500;
  }

  .dialog-empty {
    padding: 1.5rem 1rem;
    text-align: center;
    font-size: 0.8125rem;
    color: var(--p-gray-400);
    font-style: italic;
  }

  .dialog-search-hint {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    color: var(--p-gray-400);
  }

  .dialog-show-all {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-size: 0.75rem;
    color: var(--p-primary-600);
    margin-left: 0.25rem;
  }

  .dialog-show-all:hover {
    text-decoration: underline;
  }

  /* ── Dialog button disabled state ───────────────────────── */
  .reorder-btns :deep(.p-button:disabled),
  .transfer-btns :deep(.p-button:disabled) {
    opacity: 0.2;
    cursor: not-allowed;
  }

  /* ── DataTable ───────────────────────────────────────────── */
  .customers-table :deep(th) {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--p-surface-400);
    background: transparent;
    border-bottom: 1px solid var(--p-surface-200);
    padding: 0.625rem 0.75rem;
  }

  .customers-table :deep(td) {
    padding: 0.75rem;
    border-bottom: 1px solid var(--p-surface-100);
  }

  .customers-table :deep(tr:last-child td) {
    border-bottom: none;
  }

  .customers-table :deep(tr:hover td) {
    background: var(--p-surface-50);
  }

  .customers-table :deep(.p-datatable-tbody > tr) {
    transition: background 0.1s ease;
  }

  /* ── Transitions ─────────────────────────────────────────── */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.15s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
