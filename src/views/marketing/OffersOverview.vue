<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  type OfferStatus = 'Actief' | 'Verlopen' | 'Binnenkort gepland';

  interface Offer {
    id: number;
    naam: string;
    startdatum: string;
    einddatum: string;
    status: OfferStatus;
    sites: string[];
    lastTask: string | null;
  }

  const offers = ref<Offer[]>([
    {
      id: 1,
      naam: '2026 Q1: Hansgrohe Raindance actie',
      startdatum: '03-02-2026',
      einddatum: '15-04-2026',
      status: 'Actief',
      sites: ['swbe (fr-BE)', 'swbe (nl-BE)', 'swnl (nl_NL)'],
      lastTask: null,
    },
    {
      id: 2,
      naam: '2026 Q1: Grohe Colors BE',
      startdatum: '11-02-2026',
      einddatum: '31-03-2026',
      status: 'Actief',
      sites: ['swbe (fr-BE)', 'swbe (nl-BE)'],
      lastTask: 'Prijzen bijwerken',
    },
    {
      id: 3,
      naam: '2026 Q1: SRiho cashback NL',
      startdatum: '25-01-2026',
      einddatum: '30-06-2026',
      status: 'Actief',
      sites: ['swnl (nl_NL)'],
      lastTask: null,
    },
    {
      id: 4,
      naam: '2026 Q1: Meubelactie Benelux',
      startdatum: '04-02-2026',
      einddatum: '02-03-2026',
      status: 'Actief',
      sites: ['swbe (fr-BE)', 'swbe (nl-BE)', 'swnl (nl_NL)'],
      lastTask: 'Producten toevoegen',
    },
    {
      id: 5,
      naam: '2026 Q2: Lente badkamer deal',
      startdatum: '01-04-2026',
      einddatum: '30-04-2026',
      status: 'Binnenkort gepland',
      sites: ['swbe (nl-BE)', 'swnl (nl_NL)'],
      lastTask: null,
    },
    {
      id: 6,
      naam: '2026 Q2: Badkamer week FR',
      startdatum: '06-04-2026',
      einddatum: '13-04-2026',
      status: 'Binnenkort gepland',
      sites: ['swfr (fr_FR)'],
      lastTask: null,
    },
    {
      id: 7,
      naam: '2026 Q2: Villeroy & Boch promo',
      startdatum: '15-03-2026',
      einddatum: '15-05-2026',
      status: 'Binnenkort gepland',
      sites: ['swbe (fr-BE)', 'swbe (nl-BE)', 'swnl (nl_NL)', 'swfr (fr_FR)'],
      lastTask: null,
    },
    {
      id: 8,
      naam: '2026 Q1: SOLDES FR',
      startdatum: '10-01-2026',
      einddatum: '04-02-2026',
      status: 'Verlopen',
      sites: ['swfr (fr_FR)'],
      lastTask: null,
    },
    {
      id: 9,
      naam: '2026 Q1: Solden BE',
      startdatum: '09-01-2026',
      einddatum: '31-01-2026',
      status: 'Verlopen',
      sites: ['swbe (fr-BE)', 'swbe (nl-BE)'],
      lastTask: null,
    },
    {
      id: 10,
      naam: '2026 Q1: Douche deal NL',
      startdatum: '09-01-2026',
      einddatum: '31-01-2026',
      status: 'Verlopen',
      sites: ['swnl (nl_NL)'],
      lastTask: null,
    },
    {
      id: 11,
      naam: '2025 Q4: Black Friday ALL',
      startdatum: '25-11-2025',
      einddatum: '02-12-2025',
      status: 'Verlopen',
      sites: ['swbe (fr-BE)', 'swbe (nl-BE)', 'swnl (nl_NL)', 'swfr (fr_FR)'],
      lastTask: 'Prijzen herstellen',
    },
    {
      id: 12,
      naam: '2025 Q4: Winteractie Benelux',
      startdatum: '01-12-2025',
      einddatum: '31-12-2025',
      status: 'Verlopen',
      sites: ['swbe (fr-BE)', 'swbe (nl-BE)', 'swnl (nl_NL)'],
      lastTask: null,
    },
    {
      id: 13,
      naam: '2025 Q4: Cyber Monday NL',
      startdatum: '02-12-2025',
      einddatum: '02-12-2025',
      status: 'Verlopen',
      sites: ['swnl (nl_NL)'],
      lastTask: null,
    },
    {
      id: 14,
      naam: '2025 Q3: Zomerdeal ALL',
      startdatum: '01-07-2025',
      einddatum: '31-08-2025',
      status: 'Verlopen',
      sites: ['swbe (nl-BE)', 'swnl (nl_NL)', 'swfr (fr_FR)'],
      lastTask: null,
    },
    {
      id: 15,
      naam: '2025 Q2: Geberit Duofix promo',
      startdatum: '01-05-2025',
      einddatum: '30-06-2025',
      status: 'Verlopen',
      sites: ['swbe (nl-BE)', 'swnl (nl_NL)'],
      lastTask: null,
    },
  ]);

  const totalRecords = ref(106);

  // ── Status badge helpers ─────────────────────────────────────────
  const statusConfig: Record<OfferStatus, { label: string; classes: string }> = {
    Actief: { label: 'Actief', classes: 'status-badge--actief' },
    Verlopen: { label: 'Verlopen', classes: 'status-badge--verlopen' },
    'Binnenkort gepland': { label: 'Binnenkort gepland', classes: 'status-badge--gepland' },
  };

  // ── Filter definitions ───────────────────────────────────────────
  type FilterType = 'text' | 'boolean' | 'select';

  interface FilterConfig {
    key: string;
    label: string;
    type: FilterType;
    placeholder?: string;
    options?: { label: string; value: string }[];
  }

  const allFilterDefs: FilterConfig[] = [
    { key: 'naam', label: 'Naam', type: 'text', placeholder: 'Zoek op naam' },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Actief', value: 'Actief' },
        { label: 'Verlopen', value: 'Verlopen' },
        { label: 'Binnenkort gepland', value: 'Binnenkort gepland' },
      ],
    },
    { key: 'site', label: 'Site', type: 'text', placeholder: 'bijv. swnl' },
    { key: 'jaar', label: 'Jaar', type: 'text', placeholder: 'bijv. 2026' },
    {
      key: 'kwartaal',
      label: 'Kwartaal',
      type: 'select',
      options: [
        { label: 'Q1', value: 'Q1' },
        { label: 'Q2', value: 'Q2' },
        { label: 'Q3', value: 'Q3' },
        { label: 'Q4', value: 'Q4' },
      ],
    },
  ];

  // Which filter keys are currently shown as chips
  const activeFilterKeys = ref<string[]>(['naam', 'status', 'site']);

  const filterConfigs = computed(() =>
    activeFilterKeys.value
      .map((k) => allFilterDefs.find((f) => f.key === k))
      .filter((f): f is FilterConfig => f !== undefined)
  );

  const filterValues = ref<Record<string, string | null>>(
    Object.fromEntries(allFilterDefs.map((f) => [f.key, null]))
  );

  // ── Popover management ───────────────────────────────────────────
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

  // ── Filter chip helpers ──────────────────────────────────────────
  function getDisplayValue(key: string): string | null {
    const val = filterValues.value[key];
    if (!val) return null;
    return val;
  }

  function clearFilter(key: string, event?: MouseEvent) {
    event?.stopPropagation();
    filterValues.value[key] = null;
    filterPopovers.value.get(key)?.hide();
  }

  function clearAllFilters() {
    allFilterDefs.forEach((f) => {
      filterValues.value[f.key] = null;
    });
  }

  const hasActiveFilters = computed(() =>
    filterConfigs.value.some((f) => getDisplayValue(f.key) !== null)
  );

  // ── Filters beheren dialog ───────────────────────────────────────
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
    allFilterDefs.forEach((f) => {
      if (!activeFilterKeys.value.includes(f.key)) filterValues.value[f.key] = null;
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

  // ── Sites display ────────────────────────────────────────────────
  const MAX_SITES_SHOWN = 2;

  function visibleSites(sites: string[]) {
    return sites.slice(0, MAX_SITES_SHOWN);
  }

  function extraSiteCount(sites: string[]) {
    return sites.length > MAX_SITES_SHOWN ? sites.length - MAX_SITES_SHOWN : 0;
  }
</script>

<template>
  <div class="flex flex-col gap-5 grow">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold text-surface-800">Acties</h1>
      <Button label="Actie toevoegen" icon="pi pi-plus" icon-pos="right" />
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
              v-else-if="filter.type === 'select'"
              v-model="filterValues[filter.key]"
              :options="filter.options"
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

      <!-- Clear all -->
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
        {{ totalRecords.toLocaleString('nl-NL') }} acties
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
      :value="offers"
      class="offers-table"
      :pt="{ thead: { class: 'border-b border-gray-200' } }"
    >
      <Column field="naam" header="Naam">
        <template #body="{ data }">
          <span class="font-medium text-surface-700">{{ data.naam }}</span>
        </template>
      </Column>
      <Column field="startdatum" header="Startdatum" style="width: 8rem">
        <template #body="{ data }">
          <span class="text-surface-600 text-sm tabular-nums">{{ data.startdatum }}</span>
        </template>
      </Column>
      <Column field="einddatum" header="Einddatum" style="width: 8rem">
        <template #body="{ data }">
          <span class="text-surface-600 text-sm tabular-nums">{{ data.einddatum }}</span>
        </template>
      </Column>
      <Column field="status" header="Status" style="width: 7rem">
        <template #body="{ data }">
          <span class="status-badge" :class="statusConfig[data.status as OfferStatus].classes">
            {{ statusConfig[data.status as OfferStatus].label }}
          </span>
        </template>
      </Column>
      <Column field="sites" header="Sites">
        <template #body="{ data }">
          <div class="flex items-center gap-1 flex-wrap">
            <span v-for="site in visibleSites(data.sites)" :key="site" class="site-tag">
              {{ site }}
            </span>
            <span v-if="extraSiteCount(data.sites) > 0" class="site-tag site-tag--more">
              +{{ extraSiteCount(data.sites) }}
            </span>
          </div>
        </template>
      </Column>
      <Column field="lastTask" header="Laatste taak" style="width: 9rem">
        <template #body="{ data }">
          <span v-if="data.lastTask" class="text-surface-600 text-sm">{{ data.lastTask }}</span>
          <span v-else class="text-surface-300 text-sm italic">Geen taak</span>
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
            @click="router.push({ name: 'OffersEdit', params: { id: data.id } })"
          />
        </template>
      </Column>
    </DataTable>

    <!-- ── Filters beheren dialog ──────────────────────────────── -->
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
    max-width: 10rem;
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

  /* ── Status badges ───────────────────────────────────────── */
  .status-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.2rem 0.625rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .status-badge--actief {
    background: var(--p-green-100);
    color: var(--p-green-700);
  }

  .status-badge--verlopen {
    background: var(--p-gray-100);
    color: var(--p-gray-500);
  }

  .status-badge--gepland {
    background: var(--p-blue-100);
    color: var(--p-blue-700);
  }

  /* ── Site tags ───────────────────────────────────────────── */
  .site-tag {
    display: inline-flex;
    align-items: center;
    padding: 0.125rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    background: var(--p-gray-100);
    color: var(--p-gray-600);
    white-space: nowrap;
  }

  .site-tag--more {
    background: transparent;
    color: var(--p-gray-400);
    font-weight: 400;
    padding-left: 0.125rem;
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
  .offers-table :deep(th) {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--p-surface-400);
    background: transparent;
    border-bottom: 1px solid var(--p-surface-200);
    padding: 0.625rem 0.75rem;
  }

  .offers-table :deep(td) {
    padding: 0.75rem;
    border-bottom: 1px solid var(--p-surface-100);
  }

  .offers-table :deep(tr:last-child td) {
    border-bottom: none;
  }

  .offers-table :deep(tr:hover td) {
    background: var(--p-surface-50);
  }

  .offers-table :deep(.p-datatable-tbody > tr) {
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
