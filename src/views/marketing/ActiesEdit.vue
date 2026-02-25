<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  const route  = useRoute();
  const router = useRouter();

  type ActieStatus = 'Actief' | 'Verlopen' | 'Binnenkort gepland';

  interface Product {
    id: number;
    code: string;
    site: string;
    merk: string;
  }

  interface Subgroup {
    id: number;
    naam: string;
    products: Product[];
  }

  interface Group {
    id: number;
    naam: string;
    expanded: boolean;
    subgroups: Subgroup[];
    products: Product[];
  }

  // ── Mock actie data ──────────────────────────────────────────────
  const actie = ref({
    id:           Number(route.params.id),
    naam:         '2026 Q1: GROHE COLORS BE',
    omschrijving: '',
    websites:     ['sawiday_be'],
    startdatum:   '11-02-2026',
    einddatum:    '31-03-2026',
    status:       'Actief' as ActieStatus,
  });

  const websiteOptions = [
    { label: 'sawiday_be', value: 'sawiday_be' },
    { label: 'sawiday_nl', value: 'sawiday_nl' },
    { label: 'sawiday_fr', value: 'sawiday_fr' },
    { label: 'sawiday_de', value: 'sawiday_de' },
  ];

  // ── Site label helpers ───────────────────────────────────────────
  const siteMap: Record<string, { code: string; langs: string[] }> = {
    sawiday_be: { code: 'SWBE', langs: ['nl-BE', 'fr-BE'] },
    sawiday_nl: { code: 'SWNL', langs: ['nl-NL']          },
    sawiday_fr: { code: 'SWFR', langs: ['fr-FR']          },
    sawiday_de: { code: 'SWDE', langs: ['de-DE']          },
  };

  const siteLabels = computed(() =>
    actie.value.websites.flatMap((w) => {
      const s = siteMap[w];
      return s ? s.langs.map((lang) => `${s.code} (${lang})`) : [];
    }),
  );

  // ── Mock groups + products ───────────────────────────────────────
  const MOCK_PRODUCTS: Product[] = [
    { id: 1,  code: 'SW1440595', site: 'SWBE', merk: 'Grohe / dice'                    },
    { id: 2,  code: 'SW1440594', site: 'SWBE', merk: 'Grohe / precision smart control' },
    { id: 3,  code: 'SW1440593', site: 'SWBE', merk: 'Grohe / Get'                     },
    { id: 4,  code: 'SW1440592', site: 'SWBE', merk: 'Grohe / Get'                     },
    { id: 5,  code: 'SW1440591', site: 'SWBE', merk: 'Grohe / start loop 2020'         },
    { id: 6,  code: 'SW1440590', site: 'SWBE', merk: 'Grohe / precision flow'          },
    { id: 7,  code: 'SW1440588', site: 'SWBE', merk: 'Grohe / dice'                    },
    { id: 8,  code: 'SW1440587', site: 'SWBE', merk: 'Grohe / dice'                    },
    { id: 9,  code: 'SW1440586', site: 'SWBE', merk: 'Grohe / Euphoria'                },
    { id: 10, code: 'SW1440585', site: 'SWBE', merk: 'Grohe / Euphoria'                },
    { id: 11, code: 'SW1440584', site: 'SWBE', merk: 'Grohe / Rainshower'              },
    { id: 12, code: 'SW1440583', site: 'SWBE', merk: 'Grohe / Rainshower'              },
    { id: 13, code: 'SW1440582', site: 'SWBE', merk: 'Grohe / Tempesta'                },
    { id: 14, code: 'SW1440581', site: 'SWBE', merk: 'Grohe / Tempesta'                },
    { id: 15, code: 'SW1440580', site: 'SWBE', merk: 'Grohe / precision flow'          },
  ];

  const groups = ref<Group[]>([
    { id: 1, naam: '2026 Q1: GROHE COLORS BE', expanded: true, subgroups: [], products: MOCK_PRODUCTS },
  ]);

  // ── UI state ─────────────────────────────────────────────────────
  const activeTab          = ref<'details' | 'groepen'>('details');
  const selectedGroupId    = ref<number>(1);
  const selectedSubgroupId = ref<number | null>(null);
  const selectedProducts   = ref<Product[]>([]);
  const showAddProducts    = ref(false);
  const addMode            = ref<'zoeken' | 'merk' | 'csv'>('zoeken');
  const productSearch      = ref('');
  const moreMenuRef        = ref<any>(null);

  // ── Group drawer state ───────────────────────────────────────────
  const gd = ref({
    visible:              false,
    isEdit:               false,
    editGroupId:          null as number | null,
    editSubgroupId:       null as number | null,
    // form
    parentGroupId:        null as number | null,
    naam:                 '',
    labelType:            'geen' as 'geen' | 'ander',
    labelsExpanded:       false,
    labelCustomColor:     false,
    labelColorHex:        '#000000',
    labelTexts:           {} as Record<string, string>,
    preTextsExpanded:     false,
    preTexts:             {} as Record<string, string>,
    actietimer:           false,
    actietimerDagen:      3,
    prijsmodificatie:     false,
    prijsBedrag:          '',
    prijsModType:         'percentage' as 'percentage' | 'bedrag',
    prijsVergelijking:    'van-voor' as 'van-voor' | 'advies',
    prijskleurmodificatie: false,
  });

  function resetDrawer(overrides: Partial<typeof gd.value> = {}) {
    Object.assign(gd.value, {
      visible: true, isEdit: false, editGroupId: null, editSubgroupId: null,
      parentGroupId: null, naam: '', labelType: 'geen',
      labelsExpanded: false, labelCustomColor: false, labelColorHex: '#000000',
      labelTexts: {}, preTextsExpanded: false, preTexts: {},
      actietimer: false, actietimerDagen: 3,
      prijsmodificatie: false, prijsBedrag: '', prijsModType: 'percentage',
      prijsVergelijking: 'van-voor', prijskleurmodificatie: false,
      ...overrides,
    });
  }

  const gdTitle = computed(() => {
    if (!gd.value.isEdit) return 'Nieuwe groep aanmaken';
    return gd.value.editSubgroupId !== null ? 'Subgroep bewerken' : 'Groep bewerken';
  });

  const parentGroupOptions = computed(() => [
    { label: 'Geen (top-niveau groep)', value: null },
    ...groups.value.map((g) => ({ label: g.naam, value: g.id })),
  ]);

  // ── Computed ─────────────────────────────────────────────────────
  const isVerlopen = computed(() => actie.value.status === 'Verlopen');

  const selectedGroup = computed(() =>
    groups.value.find((g) => g.id === selectedGroupId.value) ?? null,
  );

  const selectedSubgroup = computed(() => {
    if (selectedSubgroupId.value === null) return null;
    return selectedGroup.value?.subgroups.find((s) => s.id === selectedSubgroupId.value) ?? null;
  });

  const activeProducts = computed(() => {
    const base = selectedSubgroup.value
      ? selectedSubgroup.value.products
      : selectedGroup.value?.products ?? [];
    if (!productSearch.value.trim()) return base;
    const q = productSearch.value.trim().toLowerCase();
    return base.filter(
      (p) => p.code.toLowerCase().includes(q) || p.merk.toLowerCase().includes(q) || p.site.toLowerCase().includes(q),
    );
  });

  const activeNodeNaam = computed(() =>
    selectedSubgroup.value?.naam ?? selectedGroup.value?.naam ?? '',
  );

  const statusConfig: Record<ActieStatus, { classes: string }> = {
    Actief:               { classes: 'status--actief'   },
    Verlopen:             { classes: 'status--verlopen' },
    'Binnenkort gepland': { classes: 'status--gepland'  },
  };

  // ── Group actions ─────────────────────────────────────────────────
  function selectNode(groupId: number, subgroupId: number | null = null) {
    selectedGroupId.value    = groupId;
    selectedSubgroupId.value = subgroupId;
    selectedProducts.value   = [];
    productSearch.value      = '';
  }

  function toggleGroup(groupId: number) {
    const g = groups.value.find((g) => g.id === groupId);
    if (g) g.expanded = !g.expanded;
  }

  function openCreateGroup(parentGroupId: number | null = null) {
    resetDrawer({ parentGroupId });
  }

  function openEditGroup(groupId: number, subgroupId?: number) {
    const group = groups.value.find((g) => g.id === groupId)!;
    const naam  = subgroupId
      ? group.subgroups.find((s) => s.id === subgroupId)!.naam
      : group.naam;
    resetDrawer({
      isEdit:         true,
      editGroupId:    groupId,
      editSubgroupId: subgroupId ?? null,
      parentGroupId:  subgroupId != null ? groupId : null,
      naam,
    });
  }

  function saveGroup() {
    if (!gd.value.naam.trim()) return;

    if (gd.value.isEdit) {
      const group = groups.value.find((g) => g.id === gd.value.editGroupId)!;
      if (gd.value.editSubgroupId !== null) {
        const sub = group.subgroups.find((s) => s.id === gd.value.editSubgroupId)!;
        sub.naam  = gd.value.naam.trim();
      } else {
        group.naam = gd.value.naam.trim();
      }
    } else {
      if (gd.value.parentGroupId !== null) {
        const parent = groups.value.find((g) => g.id === gd.value.parentGroupId)!;
        const newId  = Math.max(0, ...parent.subgroups.map((s) => s.id)) + 1;
        parent.subgroups.push({ id: newId, naam: gd.value.naam.trim(), products: [] });
        parent.expanded = true;
        selectNode(parent.id, newId);
      } else {
        const newId = Math.max(0, ...groups.value.map((g) => g.id)) + 1;
        groups.value.push({ id: newId, naam: gd.value.naam.trim(), expanded: false, subgroups: [], products: [] });
        selectNode(newId);
      }
    }
    gd.value.visible = false;
  }

  // ── Product actions ───────────────────────────────────────────────
  function deleteSelectedProducts() {
    const ids    = new Set(selectedProducts.value.map((p) => p.id));
    const target = selectedSubgroup.value
      ? selectedGroup.value!.subgroups.find((s) => s.id === selectedSubgroupId.value)!
      : selectedGroup.value!;
    target.products        = target.products.filter((p) => !ids.has(p.id));
    selectedProducts.value = [];
  }

  function deleteAllProducts() {
    const target = selectedSubgroup.value
      ? selectedGroup.value!.subgroups.find((s) => s.id === selectedSubgroupId.value)!
      : selectedGroup.value!;
    target.products        = [];
    selectedProducts.value = [];
  }

  function goBack() {
    router.push({ name: 'ActiesOverview' });
  }
</script>

<template>
  <div class="flex flex-col grow">

    <!-- ── Page header ────────────────────────────────────────────── -->
    <div class="flex items-center justify-between pb-4 border-b border-gray-100 gap-4">
      <div class="flex items-center gap-3 min-w-0">
        <h1 class="text-xl font-semibold text-surface-800 truncate">{{ actie.naam }}</h1>
        <span class="status-badge shrink-0" :class="statusConfig[actie.status].classes">
          {{ actie.status }}
        </span>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <Button label="Annuleren" severity="secondary" outlined size="small" @click="goBack" />
        <Button label="Opslaan" size="small" :disabled="isVerlopen" />
        <Button
          icon="pi pi-ellipsis-v"
          severity="secondary"
          variant="text"
          size="small"
          rounded
          @click="(moreMenuRef as any)?.toggle($event)"
        />
        <Popover ref="moreMenuRef">
          <div class="flex flex-col" style="min-width: 10rem">
            <button class="ctx-item"><i class="pi pi-copy text-sm" />Kopieer actie</button>
            <div class="ctx-divider" />
            <button class="ctx-item ctx-item--danger"><i class="pi pi-trash text-sm" />Verwijder actie</button>
          </div>
        </Popover>
      </div>
    </div>

    <!-- ── Verlopen banner ────────────────────────────────────────── -->
    <Transition name="fade">
      <div v-if="isVerlopen" class="verlopen-banner mt-3">
        <i class="pi pi-info-circle shrink-0" />
        <span>Deze actie is verlopen en kan niet meer bewerkt worden.</span>
        <button class="verlopen-copy-btn">Maak een kopie</button>
      </div>
    </Transition>

    <!-- ── Tabs ───────────────────────────────────────────────────── -->
    <div class="flex border-b border-gray-100 mt-4">
      <button class="tab-btn" :class="{ 'tab-btn--active': activeTab === 'details' }" @click="activeTab = 'details'">Details</button>
      <button class="tab-btn" :class="{ 'tab-btn--active': activeTab === 'groepen' }" @click="activeTab = 'groepen'">Groepen</button>
    </div>

    <!-- ════════════════════════════════════════════════════════════ -->
    <!-- DETAILS TAB                                                  -->
    <!-- ════════════════════════════════════════════════════════════ -->
    <div v-if="activeTab === 'details'" class="mt-5">
      <div class="details-form">

        <div class="form-field">
          <label class="form-label">Naam <span class="form-required">*</span></label>
          <InputText v-model="actie.naam" class="w-full" :disabled="isVerlopen" placeholder="Bijv. 2026 Q1: Black Friday BE" />
        </div>

        <div class="form-field">
          <label class="form-label">Website(s) <span class="form-required">*</span></label>
          <MultiSelect
            v-model="actie.websites"
            :options="websiteOptions"
            option-label="label"
            option-value="value"
            class="w-full"
            placeholder="Selecteer website(s)"
            :disabled="isVerlopen"
            display="chip"
          />
        </div>

        <div class="form-field">
          <label class="form-label">Looptijd <span class="form-required">*</span></label>
          <div class="flex items-center gap-3">
            <div class="flex flex-col gap-1 flex-1">
              <span class="form-sublabel">Startdatum</span>
              <InputText v-model="actie.startdatum" class="w-full" placeholder="DD-MM-JJJJ" :disabled="isVerlopen" />
            </div>
            <span class="text-gray-300 mt-5 text-sm">→</span>
            <div class="flex flex-col gap-1 flex-1">
              <span class="form-sublabel">Einddatum</span>
              <InputText v-model="actie.einddatum" class="w-full" placeholder="DD-MM-JJJJ" :disabled="isVerlopen" />
            </div>
          </div>
          <span class="form-hint">De actie is geldig van de startdatum tot en met de einddatum.</span>
        </div>

        <div class="form-field">
          <label class="form-label">Omschrijving</label>
          <Textarea
            v-model="actie.omschrijving"
            class="w-full"
            rows="4"
            placeholder="Voer een omschrijving in"
            :disabled="isVerlopen"
            auto-resize
          />
        </div>

      </div>
    </div>

    <!-- ════════════════════════════════════════════════════════════ -->
    <!-- GROEPEN TAB                                                  -->
    <!-- ════════════════════════════════════════════════════════════ -->
    <div v-if="activeTab === 'groepen'" class="flex gap-4 grow mt-4 min-h-0" style="min-height: 24rem">

      <!-- Left: groups tree -->
      <div class="groups-panel">
        <div class="groups-panel__body">
          <div v-for="group in groups" :key="group.id">

            <!-- Group row -->
            <div
              class="group-row"
              :class="{ 'group-row--active': selectedGroupId === group.id && selectedSubgroupId === null }"
              @click="selectNode(group.id)"
            >
              <button
                v-if="group.subgroups.length"
                class="expand-btn"
                @click.stop="toggleGroup(group.id)"
              >
                <i :class="`pi ${group.expanded ? 'pi-chevron-down' : 'pi-chevron-right'} text-xs`" />
              </button>
              <div v-else class="w-5 shrink-0" />

              <span class="group-naam flex-1 truncate">{{ group.naam }}</span>

              <div class="row-actions flex items-center gap-0.5 shrink-0">
                <button
                  v-if="!isVerlopen"
                  class="row-action-btn"
                  title="Subgroep toevoegen"
                  @click.stop="openCreateGroup(group.id)"
                >
                  <i class="pi pi-plus text-xs" />
                </button>
                <button
                  class="row-action-btn"
                  title="Groep bewerken"
                  @click.stop="openEditGroup(group.id)"
                >
                  <i class="pi pi-pencil text-xs" />
                </button>
              </div>
            </div>

            <!-- Subgroup rows -->
            <template v-if="group.expanded && group.subgroups.length">
              <div
                v-for="sub in group.subgroups"
                :key="sub.id"
                class="subgroup-row"
                :class="{ 'subgroup-row--active': selectedGroupId === group.id && selectedSubgroupId === sub.id }"
                @click="selectNode(group.id, sub.id)"
              >
                <span class="subgroup-naam flex-1 truncate">{{ sub.naam }}</span>
                <div class="row-actions">
                  <button
                    class="row-action-btn"
                    title="Subgroep bewerken"
                    @click.stop="openEditGroup(group.id, sub.id)"
                  >
                    <i class="pi pi-pencil text-xs" />
                  </button>
                </div>
              </div>
            </template>

          </div>
        </div>

        <div v-if="!isVerlopen" class="groups-panel__footer">
          <button class="add-group-btn" @click="openCreateGroup()">
            <i class="pi pi-plus text-xs" />
            Groep toevoegen
          </button>
        </div>
      </div>

      <!-- Right: products panel -->
      <div class="products-panel">
        <template v-if="selectedGroup">
          <div class="products-panel__header">
            <div class="flex flex-col gap-0.5">
              <span class="products-panel__title">{{ activeNodeNaam }}</span>
              <span class="products-panel__meta">{{ activeProducts.length }} producten</span>
            </div>
            <div class="flex items-center gap-2">
              <Button
                v-if="!isVerlopen"
                label="Producten toevoegen"
                icon="pi pi-plus"
                size="small"
                outlined
                severity="secondary"
                @click="showAddProducts = true"
              />
              <Popover ref="productMenuRef">
                <div class="flex flex-col" style="min-width: 11rem">
                  <button class="ctx-item ctx-item--danger" @click="deleteAllProducts">
                    <i class="pi pi-trash text-sm" />Verwijder alle producten
                  </button>
                </div>
              </Popover>
              <Button
                icon="pi pi-ellipsis-v"
                severity="secondary"
                variant="text"
                size="small"
                rounded
                @click="($refs.productMenuRef as any)?.toggle($event)"
              />
            </div>
          </div>

          <div class="products-panel__toolbar">
            <IconField class="flex-1" style="max-width: 22rem">
              <InputIcon class="pi pi-search" />
              <InputText v-model="productSearch" placeholder="Zoek op productcode of merk" class="w-full" size="small" />
            </IconField>
            <Transition name="fade">
              <button v-if="selectedProducts.length" class="delete-selected-btn" @click="deleteSelectedProducts">
                <i class="pi pi-trash text-xs" />
                {{ selectedProducts.length }} verwijderen
              </button>
            </Transition>
          </div>

          <div class="products-panel__table">
            <DataTable
              v-model:selection="selectedProducts"
              :value="activeProducts"
              class="products-table"
              :pt="{ thead: { class: 'border-b border-gray-200' } }"
              selection-mode="multiple"
              :meta-key-selection="false"
            >
              <Column selection-mode="multiple" style="width: 2.5rem; padding-left: 0.75rem" />
              <Column field="code" header="Productcode">
                <template #body="{ data }">
                  <span class="font-medium text-surface-700 tabular-nums">{{ data.code }}</span>
                </template>
              </Column>
              <Column field="site" header="Site" style="width: 6rem">
                <template #body="{ data }">
                  <span class="site-tag">{{ data.site }}</span>
                </template>
              </Column>
              <Column field="merk" header="Merk / Serie">
                <template #body="{ data }">
                  <span class="text-surface-500 text-sm">{{ data.merk }}</span>
                </template>
              </Column>
              <template #empty>
                <div class="py-10 text-center text-surface-300 text-sm italic">Geen producten gevonden</div>
              </template>
            </DataTable>
          </div>
        </template>
      </div>
    </div>

    <!-- ════════════════════════════════════════════════════════════ -->
    <!-- PRODUCTEN TOEVOEGEN DIALOG                                   -->
    <!-- ════════════════════════════════════════════════════════════ -->
    <Dialog v-model:visible="showAddProducts" header="Producten toevoegen" :style="{ width: '36rem' }" modal :draggable="false">
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <Checkbox input-id="new-subgroup" binary />
          <label for="new-subgroup" class="text-sm text-surface-600 cursor-pointer">Nieuwe subgroep voor producten aanmaken</label>
        </div>
        <div class="h-px bg-gray-100" />
        <div class="flex flex-col gap-1.5">
          <span class="form-sublabel">Voeg producten toe via</span>
          <div class="seg-tabs">
            <button class="seg-tab" :class="{ 'seg-tab--active': addMode === 'zoeken' }" @click="addMode = 'zoeken'">Product zoeken</button>
            <button class="seg-tab" :class="{ 'seg-tab--active': addMode === 'merk'   }" @click="addMode = 'merk'"  >Merk / Serie / Categorie</button>
            <button class="seg-tab" :class="{ 'seg-tab--active': addMode === 'csv'    }" @click="addMode = 'csv'"   >CSV importeren</button>
          </div>
        </div>

        <template v-if="addMode === 'zoeken'">
          <IconField>
            <InputIcon class="pi pi-search" />
            <InputText class="w-full" placeholder="Zoek op productcode, productnaam, fabrikantcode, bestelcode of EAN" autofocus />
          </IconField>
          <div class="empty-hint">
            <i class="pi pi-search text-3xl text-gray-200" />
            <span>Voer een zoekterm in om producten te zoeken</span>
          </div>
        </template>

        <template v-else-if="addMode === 'merk'">
          <MultiSelect class="w-full" placeholder="Selecteer een of meer merken, series of categorieën" :options="[]" />
          <p class="text-xs text-surface-400">Producten worden toegevoegd op basis van de combinatie van ingevoerde merken en categorieën.</p>
          <div class="excl-grid">
            <div v-for="lbl in ['OUTLET producten','STORE producten','Obsolete producten','SHOWROOM producten','HM producten']" :key="lbl" class="flex items-center gap-2">
              <Checkbox :input-id="lbl" binary :model-value="true" />
              <label :for="lbl" class="text-sm text-surface-600 cursor-pointer">{{ lbl }}</label>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="csv-drop">
            <i class="pi pi-upload text-2xl text-gray-300" />
            <span class="text-sm text-surface-400">Sleep een CSV bestand hierheen of</span>
            <button class="text-sm text-primary-600 hover:text-primary-800 font-medium">selecteer een bestand</button>
          </div>
          <div class="flex flex-col gap-1.5">
            <span class="form-sublabel">Inhoud van CSV</span>
            <SelectButton
              :options="[{ label: 'Productcodes', value: 'productcodes' }, { label: 'Producentcodes', value: 'producentcodes' }]"
              option-label="label" option-value="value" model-value="productcodes"
            />
          </div>
          <div class="excl-grid">
            <div v-for="lbl in ['OUTLET producten','STORE producten','Obsolete producten','SHOWROOM producten','HM producten']" :key="lbl" class="flex items-center gap-2">
              <Checkbox :input-id="`csv-${lbl}`" binary :model-value="true" />
              <label :for="`csv-${lbl}`" class="text-sm text-surface-600 cursor-pointer">{{ lbl }}</label>
            </div>
          </div>
        </template>
      </div>
      <template #footer>
        <Button label="Annuleren" severity="secondary" outlined @click="showAddProducts = false" />
        <Button label="Toevoegen" />
      </template>
    </Dialog>

    <!-- ════════════════════════════════════════════════════════════ -->
    <!-- GROUP CREATE / EDIT DRAWER                                   -->
    <!-- ════════════════════════════════════════════════════════════ -->
    <Drawer
      v-model:visible="gd.visible"
      position="right"
      :style="{ width: '34rem' }"
      :pt="{ content: { class: 'flex flex-col gap-0 p-0! overflow-hidden' } }"
    >
      <template #header>
        <span class="font-semibold text-surface-800">{{ gdTitle }}</span>
      </template>

      <!-- Scrollable body -->
      <div class="flex flex-col gap-5 overflow-y-auto px-5 py-4 flex-1">

        <!-- Parent group -->
        <div class="form-field">
          <label class="form-label">Actiegroep valt direct onder</label>
          <Select
            v-model="gd.parentGroupId"
            :options="parentGroupOptions"
            option-label="label"
            option-value="value"
            class="w-full"
            placeholder="Geen (top-niveau groep)"
          />
        </div>

        <!-- Naam -->
        <div class="form-field">
          <label class="form-label">Naam <span class="form-required">*</span></label>
          <InputText v-model="gd.naam" class="w-full" placeholder="Voer een naam in" autofocus />
        </div>

        <!-- Label type -->
        <div class="form-field">
          <label class="form-label">Label</label>
          <div class="seg-tabs">
            <button class="seg-tab" :class="{ 'seg-tab--active': gd.labelType === 'geen'  }" @click="gd.labelType = 'geen'"  >Geen label</button>
            <button class="seg-tab" :class="{ 'seg-tab--active': gd.labelType === 'ander' }" @click="gd.labelType = 'ander'" >Ander label</button>
          </div>
        </div>

        <!-- Labels accordion (only when Ander label) -->
        <template v-if="gd.labelType === 'ander'">
          <button class="accordion-header" @click="gd.labelsExpanded = !gd.labelsExpanded">
            <span>Labels</span>
            <i :class="`pi ${gd.labelsExpanded ? 'pi-chevron-up' : 'pi-chevron-down'} text-xs`" />
          </button>
          <div v-if="gd.labelsExpanded" class="accordion-body">
            <!-- Custom color -->
            <div class="form-field">
              <div class="flex items-center justify-between">
                <label class="form-label">Custom kleur</label>
                <ToggleSwitch v-model="gd.labelCustomColor" />
              </div>
              <div v-if="gd.labelCustomColor" class="flex items-center gap-2 mt-1">
                <input
                  v-model="gd.labelColorHex"
                  type="color"
                  class="color-swatch"
                />
                <span class="text-xs text-gray-400">hex</span>
                <InputText v-model="gd.labelColorHex" class="flex-1" size="small" />
              </div>
            </div>
            <!-- Label text per site -->
            <div v-for="site in siteLabels" :key="site" class="form-field">
              <label class="form-label">Label text {{ site }}</label>
              <InputText v-model="gd.labelTexts[site]" class="w-full" placeholder="Voer hier je gewenste label in" />
            </div>
          </div>
        </template>

        <!-- Pre text velden accordion -->
        <button class="accordion-header" @click="gd.preTextsExpanded = !gd.preTextsExpanded">
          <span>Pre text velden</span>
          <i :class="`pi ${gd.preTextsExpanded ? 'pi-chevron-up' : 'pi-chevron-down'} text-xs`" />
        </button>
        <div v-if="gd.preTextsExpanded" class="accordion-body">
          <div v-for="site in siteLabels" :key="site" class="form-field">
            <label class="form-label">Pre text {{ site }}</label>
            <Textarea
              v-model="gd.preTexts[site]"
              class="w-full"
              rows="4"
              placeholder="Voer hier je gewenste pre text in"
            />
          </div>
          <div v-if="!siteLabels.length" class="text-sm text-surface-400 italic">
            Selecteer eerst een website in de actie details.
          </div>
        </div>

        <!-- Actietimer -->
        <div class="form-field">
          <div class="flex items-center justify-between">
            <label class="form-label">Actietimer</label>
            <ToggleSwitch v-model="gd.actietimer" />
          </div>
          <div v-if="gd.actietimer" class="flex items-center gap-2 mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <span class="text-sm text-surface-600 flex-1">Timer starten (dagen voor einde actie)</span>
            <InputNumber v-model="gd.actietimerDagen" :min="1" :max="365" style="width: 5rem" />
          </div>
        </div>

        <!-- Prijsmodificatie -->
        <div class="form-field">
          <div class="flex items-center justify-between">
            <label class="form-label">Prijsmodificatie</label>
            <ToggleSwitch v-model="gd.prijsmodificatie" />
          </div>
          <div v-if="gd.prijsmodificatie" class="flex flex-col gap-2 mt-2">
            <div class="flex items-center gap-2">
              <InputText v-model="gd.prijsBedrag" class="flex-1" placeholder="Voer hier je gewenste prijsmod" />
              <Select
                v-model="gd.prijsModType"
                :options="[{ label: 'Percentage %', value: 'percentage' }, { label: 'Bedrag €', value: 'bedrag' }]"
                option-label="label"
                option-value="value"
                style="width: 10rem"
              />
            </div>
            <p class="form-hint">Geef aan of het een bedrag of percentage is.</p>
            <SelectButton
              v-model="gd.prijsVergelijking"
              :options="[{ label: 'Van-voor prijs', value: 'van-voor' }, { label: 'Adviesprijs', value: 'advies' }]"
              option-label="label"
              option-value="value"
            />
          </div>
        </div>

        <!-- Prijskleurmodificatie -->
        <div class="form-field">
          <div class="flex items-center justify-between">
            <label class="form-label">Prijskleurmodificatie</label>
            <ToggleSwitch v-model="gd.prijskleurmodificatie" />
          </div>
        </div>

      </div>

      <!-- Sticky footer -->
      <div class="drawer-footer">
        <Button label="Annuleren" severity="secondary" outlined @click="gd.visible = false" />
        <Button :label="gd.isEdit ? 'Opslaan' : 'Toevoegen'" :disabled="!gd.naam.trim()" @click="saveGroup" />
      </div>
    </Drawer>

  </div>
</template>

<style scoped>
  /* ── Status badge ────────────────────────────────────────────── */
  .status-badge {
    display: inline-flex; align-items: center;
    padding: 0.2rem 0.75rem; border-radius: 999px;
    font-size: 0.75rem; font-weight: 600; white-space: nowrap;
  }
  .status--actief   { background: var(--p-green-100); color: var(--p-green-700); }
  .status--verlopen { background: var(--p-gray-100);  color: var(--p-gray-500);  }
  .status--gepland  { background: var(--p-blue-100);  color: var(--p-blue-700);  }

  /* ── Verlopen banner ─────────────────────────────────────────── */
  .verlopen-banner {
    display: flex; align-items: center; gap: 0.625rem;
    padding: 0.75rem 1rem; background: var(--p-blue-50);
    border: 1px solid var(--p-blue-200); border-radius: 0.5rem;
    font-size: 0.875rem; color: var(--p-blue-700);
  }
  .verlopen-copy-btn {
    margin-left: auto; font-size: 0.8125rem; font-weight: 600;
    color: var(--p-blue-700); background: none;
    border: 1.5px solid var(--p-blue-300); border-radius: 0.375rem;
    padding: 0.25rem 0.75rem; cursor: pointer; white-space: nowrap;
    transition: background 0.15s ease;
  }
  .verlopen-copy-btn:hover { background: var(--p-blue-100); }

  /* ── Tabs ────────────────────────────────────────────────────── */
  .tab-btn {
    padding: 0.625rem 0.25rem; margin-right: 1.5rem;
    font-size: 0.875rem; font-weight: 500; color: var(--p-gray-500);
    background: none; border: none; border-bottom: 2px solid transparent;
    cursor: pointer; transition: color 0.15s ease, border-color 0.15s ease;
  }
  .tab-btn:hover              { color: var(--p-gray-800); }
  .tab-btn--active            { color: var(--p-primary-600); border-bottom-color: var(--p-primary-500); }

  /* ── Context menu ────────────────────────────────────────────── */
  .ctx-item {
    display: flex; align-items: center; gap: 0.5rem;
    width: 100%; text-align: left; padding: 0.5rem 0.75rem;
    font-size: 0.875rem; color: var(--p-gray-700);
    background: none; border: none; cursor: pointer;
    border-radius: 0.25rem; transition: background 0.1s ease;
  }
  .ctx-item:hover             { background: var(--p-gray-50); }
  .ctx-item--danger           { color: var(--p-red-600); }
  .ctx-item--danger:hover     { background: var(--p-red-50); }
  .ctx-divider                { height: 1px; background: var(--p-gray-100); margin: 0.25rem 0; }

  /* ── Details form ────────────────────────────────────────────── */
  .details-form { display: flex; flex-direction: column; gap: 1.25rem; max-width: 38rem; }
  .form-field   { display: flex; flex-direction: column; gap: 0.375rem; }
  .form-label   { font-size: 0.875rem; font-weight: 500; color: var(--p-surface-700); }
  .form-sublabel{ font-size: 0.75rem; font-weight: 500; color: var(--p-gray-500); }
  .form-required{ color: var(--p-red-500); }
  .form-hint    { font-size: 0.75rem; color: var(--p-gray-400); }

  /* ── Groups panel ────────────────────────────────────────────── */
  .groups-panel {
    display: flex; flex-direction: column;
    width: 17rem; flex-shrink: 0;
    border: 1px solid var(--p-gray-200); border-radius: 0.5rem; overflow: hidden;
  }
  .groups-panel__body   { flex: 1; overflow-y: auto; padding: 0.25rem; }
  .groups-panel__footer { border-top: 1px solid var(--p-gray-100); padding: 0.5rem; }

  .add-group-btn {
    display: flex; align-items: center; gap: 0.375rem;
    width: 100%; padding: 0.5rem 0.625rem;
    font-size: 0.8125rem; font-weight: 500; color: var(--p-gray-500);
    background: none; border: none; cursor: pointer;
    border-radius: 0.375rem; transition: background 0.1s ease, color 0.1s ease;
  }
  .add-group-btn:hover { background: var(--p-gray-50); color: var(--p-gray-700); }

  /* ── Group / Subgroup rows ───────────────────────────────────── */
  .group-row {
    display: flex; align-items: center; gap: 0.25rem;
    padding: 0.5rem; border-radius: 0.375rem; cursor: pointer;
    transition: background 0.1s ease; margin-bottom: 0.125rem;
  }
  .group-row:hover                     { background: var(--p-gray-50); }
  .group-row:hover .row-actions        { opacity: 1 !important; }
  .group-row--active                   { background: var(--p-primary-50); }
  .group-naam {
    font-size: 0.8125rem; font-weight: 500; color: var(--p-gray-700);
  }
  .group-row--active .group-naam       { color: var(--p-primary-700); }

  .subgroup-row {
    display: flex; align-items: center; gap: 0.25rem;
    padding: 0.375rem 0.5rem 0.375rem 2rem;
    border-radius: 0.375rem; cursor: pointer;
    transition: background 0.1s ease; margin-bottom: 0.0625rem;
  }
  .subgroup-row:hover                  { background: var(--p-gray-50); }
  .subgroup-row:hover .row-actions     { opacity: 1 !important; }
  .subgroup-row--active                { background: var(--p-primary-50); }
  .subgroup-naam { font-size: 0.8125rem; color: var(--p-gray-600); }
  .subgroup-row--active .subgroup-naam { color: var(--p-primary-700); font-weight: 500; }

  .row-actions  { opacity: 0; display: flex; align-items: center; gap: 0.25rem; transition: opacity 0.1s ease; }
  .expand-btn, .row-action-btn {
    display: flex; align-items: center; justify-content: center;
    width: 1.375rem; height: 1.375rem;
    background: none; border: none; cursor: pointer;
    color: var(--p-gray-400); border-radius: 0.25rem;
    transition: background 0.1s ease, color 0.1s ease;
    flex-shrink: 0;
  }
  .expand-btn:hover, .row-action-btn:hover { background: var(--p-gray-200); color: var(--p-gray-700); }

  /* ── Products panel ──────────────────────────────────────────── */
  .products-panel {
    flex: 1; display: flex; flex-direction: column;
    min-width: 0; border: 1px solid var(--p-gray-200);
    border-radius: 0.5rem; overflow: hidden;
  }
  .products-panel__header {
    display: flex; align-items: center; justify-content: space-between;
    gap: 1rem; padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--p-gray-100);
    background: var(--p-gray-50); flex-shrink: 0;
  }
  .products-panel__title { font-size: 0.875rem; font-weight: 600; color: var(--p-surface-700); }
  .products-panel__meta  { font-size: 0.75rem; color: var(--p-gray-400); }
  .products-panel__toolbar {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.625rem 0.75rem; border-bottom: 1px solid var(--p-gray-100); flex-shrink: 0;
  }
  .products-panel__table { flex: 1; overflow-y: auto; }

  .delete-selected-btn {
    display: flex; align-items: center; gap: 0.375rem;
    font-size: 0.8125rem; font-weight: 500; color: var(--p-red-600);
    background: none; border: 1.5px solid var(--p-red-200); border-radius: 0.375rem;
    padding: 0.3rem 0.75rem; cursor: pointer; white-space: nowrap;
    transition: background 0.15s ease, border-color 0.15s ease;
  }
  .delete-selected-btn:hover { background: var(--p-red-50); border-color: var(--p-red-300); }

  .site-tag {
    display: inline-flex; align-items: center;
    padding: 0.125rem 0.5rem; border-radius: 0.375rem;
    font-size: 0.75rem; font-weight: 500;
    background: var(--p-gray-100); color: var(--p-gray-600); white-space: nowrap;
  }

  .products-table :deep(th) {
    font-size: 0.75rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.05em; color: var(--p-surface-400);
    background: transparent; border-bottom: 1px solid var(--p-surface-200);
    padding: 0.5rem 0.75rem;
  }
  .products-table :deep(td)               { padding: 0.625rem 0.75rem; border-bottom: 1px solid var(--p-surface-100); }
  .products-table :deep(tr:last-child td) { border-bottom: none; }
  .products-table :deep(tr:hover td)      { background: var(--p-surface-50); }
  .products-table :deep(.p-datatable-tbody > tr) { transition: background 0.1s ease; }

  /* ── Segmented tabs (shared) ─────────────────────────────────── */
  .seg-tabs {
    display: inline-flex; border: 1.5px solid var(--p-gray-200);
    border-radius: 0.5rem; overflow: hidden;
  }
  .seg-tab {
    padding: 0.4rem 0.875rem; font-size: 0.8125rem; font-weight: 500;
    color: var(--p-gray-500); background: white; border: none;
    border-right: 1.5px solid var(--p-gray-200); cursor: pointer;
    transition: background 0.1s ease, color 0.1s ease; white-space: nowrap;
  }
  .seg-tab:last-child           { border-right: none; }
  .seg-tab:hover:not(.seg-tab--active) { background: var(--p-gray-50); color: var(--p-gray-700); }
  .seg-tab--active              { background: var(--p-primary-500); color: white; }

  /* ── Accordion ───────────────────────────────────────────────── */
  .accordion-header {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; padding: 0.625rem 0.75rem;
    background: var(--p-gray-50); border: 1px solid var(--p-gray-200);
    border-radius: 0.5rem; font-size: 0.875rem; font-weight: 500;
    color: var(--p-gray-700); cursor: pointer;
    transition: background 0.1s ease;
  }
  .accordion-header:hover { background: var(--p-gray-100); }
  .accordion-body {
    display: flex; flex-direction: column; gap: 1rem;
    padding: 1rem; border: 1px solid var(--p-gray-200);
    border-top: none; border-radius: 0 0 0.5rem 0.5rem;
    background: white;
  }

  /* ── Color swatch input ──────────────────────────────────────── */
  .color-swatch {
    width: 2.25rem; height: 2.25rem; padding: 0;
    border: 1px solid var(--p-gray-200); border-radius: 0.375rem;
    cursor: pointer; flex-shrink: 0;
  }

  /* ── Drawer footer ───────────────────────────────────────────── */
  .drawer-footer {
    display: flex; justify-content: flex-end; gap: 0.5rem;
    padding: 0.875rem 1.25rem;
    border-top: 1px solid var(--p-gray-100);
    background: white; flex-shrink: 0;
  }

  /* ── Misc ────────────────────────────────────────────────────── */
  .empty-hint {
    display: flex; flex-direction: column; align-items: center;
    gap: 0.5rem; padding: 2rem 0; color: var(--p-gray-400); font-size: 0.875rem;
  }
  .excl-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 0.5rem 1.5rem;
  }
  .csv-drop {
    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
    padding: 1.5rem; border: 2px dashed var(--p-gray-200);
    border-radius: 0.5rem; background: var(--p-gray-50); text-align: center;
  }

  /* ── Transitions ─────────────────────────────────────────────── */
  .fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
  .fade-enter-from,   .fade-leave-to     { opacity: 0; }
</style>
