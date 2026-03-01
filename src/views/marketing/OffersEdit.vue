<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import GroupDrawer from './components/GroupDrawer.vue';
  import DetailsDrawer from './components/DetailsDrawer.vue';
  import AddProductsDialog from './components/AddProductsDialog.vue';
  import DuplicateDialog from './components/DuplicateDialog.vue';

  const route = useRoute();
  const router = useRouter();

  type OfferStatus = 'Actief' | 'Verlopen' | 'Binnenkort gepland';

  interface Product {
    id: number;
    code: string;
    site: string;
    merk: string;
  }
  interface Group {
    id: number;
    naam: string;
    expanded: boolean;
    children: Group[];
    products: Product[];
  }

  function parseDMY(s: string): Date | null {
    const [d, m, y] = s.split('-').map(Number);
    return isNaN(d) ? null : new Date(y, m - 1, d);
  }

  // ── Mock data ─────────────────────────────────────────────────────
  const actie = ref({
    id: Number(route.params.id),
    naam: '2026 Q1: GROHE COLORS BE',
    omschrijving: '',
    websites: ['sawiday_be'],
    startdatum: parseDMY('11-02-2026') as Date | null,
    einddatum: parseDMY('31-03-2026') as Date | null,
    status: 'Actief' as OfferStatus,
  });

  const websiteOptions = [
    { label: 'sawiday_be', value: 'sawiday_be' },
    { label: 'sawiday_nl', value: 'sawiday_nl' },
    { label: 'sawiday_fr', value: 'sawiday_fr' },
    { label: 'sawiday_de', value: 'sawiday_de' },
  ];

  const siteMap: Record<string, { code: string; langs: string[] }> = {
    sawiday_be: { code: 'SWBE', langs: ['nl-BE', 'fr-BE'] },
    sawiday_nl: { code: 'SWNL', langs: ['nl-NL'] },
    sawiday_fr: { code: 'SWFR', langs: ['fr-FR'] },
    sawiday_de: { code: 'SWDE', langs: ['de-DE'] },
  };

  const siteLabels = computed(() =>
    actie.value.websites.flatMap((w) => {
      const s = siteMap[w];
      return s ? s.langs.map((lang) => `${s.code} (${lang})`) : [];
    })
  );

  const P_DOUCHESTELLEN: Product[] = [
    { id: 1, code: 'SW1440595', site: 'SWBE', merk: 'Grohe / Tempesta' },
    { id: 2, code: 'SW1440594', site: 'SWBE', merk: 'Grohe / Tempesta' },
    { id: 3, code: 'SW1440593', site: 'SWBE', merk: 'Grohe / Tempesta Cosmopolitan' },
    { id: 4, code: 'SW1440592', site: 'SWBE', merk: 'Grohe / Rainshower SmartControl' },
    { id: 5, code: 'SW1440591', site: 'SWBE', merk: 'Grohe / Rainshower SmartControl' },
    { id: 6, code: 'SW1440590', site: 'SWBE', merk: 'Grohe / Rainshower Allure' },
    { id: 7, code: 'SW1440589', site: 'SWBE', merk: 'Grohe / Rainshower Allure' },
    { id: 8, code: 'SW1440588', site: 'SWBE', merk: 'Grohe / Euphoria' },
    { id: 9, code: 'SW1440587', site: 'SWBE', merk: 'Grohe / Euphoria' },
    { id: 10, code: 'SW1440586', site: 'SWBE', merk: 'Grohe / Euphoria Cube' },
    { id: 11, code: 'SW1440585', site: 'SWBE', merk: 'Grohe / Euphoria Cube' },
    { id: 12, code: 'SW1440584', site: 'SWBE', merk: 'Grohe / Vitalio' },
    { id: 13, code: 'SW1440583', site: 'SWBE', merk: 'Grohe / Vitalio' },
    { id: 14, code: 'SW1440582', site: 'SWBE', merk: 'Grohe / Precision Flow' },
    { id: 15, code: 'SW1440581', site: 'SWBE', merk: 'Grohe / Precision Flow' },
    { id: 16, code: 'SW1440580', site: 'SWBE', merk: 'Grohe / Precision Flow XL' },
    { id: 17, code: 'SW1440579', site: 'SWBE', merk: 'Grohe / New Tempesta Rustic' },
    { id: 18, code: 'SW1440578', site: 'SWBE', merk: 'Grohe / New Tempesta Rustic' },
    { id: 19, code: 'SW1440577', site: 'SWBE', merk: 'Grohe / Vitalio Joy' },
    { id: 20, code: 'SW1440576', site: 'SWBE', merk: 'Grohe / Vitalio Joy' },
    { id: 21, code: 'SW1440575', site: 'SWBE', merk: 'Grohe / Vitalio Start' },
  ];

  const P_THERMOSTAATKRANEN: Product[] = [
    { id: 22, code: 'SW1440570', site: 'SWBE', merk: 'Grohe / Grohtherm 800' },
    { id: 23, code: 'SW1440569', site: 'SWBE', merk: 'Grohe / Grohtherm 800' },
    { id: 24, code: 'SW1440568', site: 'SWBE', merk: 'Grohe / Grohtherm 800 E' },
    { id: 25, code: 'SW1440567', site: 'SWBE', merk: 'Grohe / Grohtherm SmartControl' },
    { id: 26, code: 'SW1440566', site: 'SWBE', merk: 'Grohe / Grohtherm SmartControl' },
    { id: 27, code: 'SW1440565', site: 'SWBE', merk: 'Grohe / Grohtherm Cube' },
    { id: 28, code: 'SW1440564', site: 'SWBE', merk: 'Grohe / Grohtherm Cube' },
    { id: 29, code: 'SW1440563', site: 'SWBE', merk: 'Grohe / Grohtherm 3000' },
    { id: 30, code: 'SW1440562', site: 'SWBE', merk: 'Grohe / Grohtherm 3000 Cosmopolitan' },
  ];

  const P_KEUKENMENGERS: Product[] = [
    { id: 31, code: 'SW1440555', site: 'SWBE', merk: 'Grohe / Minta' },
    { id: 32, code: 'SW1440554', site: 'SWBE', merk: 'Grohe / Minta' },
    { id: 33, code: 'SW1440553', site: 'SWBE', merk: 'Grohe / Minta Touch' },
    { id: 34, code: 'SW1440552', site: 'SWBE', merk: 'Grohe / Minta Touch' },
    { id: 35, code: 'SW1440551', site: 'SWBE', merk: 'Grohe / Eurosmart' },
    { id: 36, code: 'SW1440550', site: 'SWBE', merk: 'Grohe / Eurosmart' },
    { id: 37, code: 'SW1440549', site: 'SWBE', merk: 'Grohe / Eurosmart Cosmopolitan' },
    { id: 38, code: 'SW1440548', site: 'SWBE', merk: 'Grohe / Eurosmart Cosmopolitan' },
    { id: 39, code: 'SW1440547', site: 'SWBE', merk: 'Grohe / Concetto' },
    { id: 40, code: 'SW1440546', site: 'SWBE', merk: 'Grohe / Concetto' },
    { id: 41, code: 'SW1440545', site: 'SWBE', merk: 'Grohe / Essence' },
    { id: 42, code: 'SW1440544', site: 'SWBE', merk: 'Grohe / Essence' },
    { id: 43, code: 'SW1440543', site: 'SWBE', merk: 'Grohe / Ladylux' },
    { id: 44, code: 'SW1440542', site: 'SWBE', merk: 'Grohe / Ladylux' },
    { id: 45, code: 'SW1440541', site: 'SWBE', merk: 'Grohe / K7' },
    { id: 46, code: 'SW1440540', site: 'SWBE', merk: 'Grohe / K7' },
    { id: 47, code: 'SW1440539', site: 'SWBE', merk: 'Grohe / K4' },
  ];

  const P_BADKRANEN: Product[] = [
    { id: 48, code: 'SW1440530', site: 'SWBE', merk: 'Grohe / Grandera' },
    { id: 49, code: 'SW1440529', site: 'SWBE', merk: 'Grohe / Grandera' },
    { id: 50, code: 'SW1440528', site: 'SWBE', merk: 'Grohe / Allure Brilliant' },
    { id: 51, code: 'SW1440527', site: 'SWBE', merk: 'Grohe / Allure Brilliant' },
    { id: 52, code: 'SW1440526', site: 'SWBE', merk: 'Grohe / Atrio' },
    { id: 53, code: 'SW1440525', site: 'SWBE', merk: 'Grohe / Atrio' },
    { id: 54, code: 'SW1440524', site: 'SWBE', merk: 'Grohe / Lineare' },
  ];

  const P_SPECIALS: Product[] = [
    { id: 55, code: 'SW1440520', site: 'SWBE', merk: 'Grohe / Sense' },
    { id: 56, code: 'SW1440519', site: 'SWBE', merk: 'Grohe / Sense Guard' },
    { id: 57, code: 'SW1440518', site: 'SWBE', merk: 'Grohe / Blue Home' },
    { id: 58, code: 'SW1440517', site: 'SWBE', merk: 'Grohe / Blue Professional' },
    { id: 59, code: 'SW1440516', site: 'SWBE', merk: 'Grohe / Red Mono' },
  ];

  const groups = ref<Group[]>([
    {
      id: 1,
      naam: '2026 Q1: GROHE COLORS BE',
      expanded: true,
      products: [],
      children: [
        {
          id: 2,
          naam: 'Douche & Bad',
          expanded: true,
          products: [],
          children: [
            {
              id: 3,
              naam: 'Douchestellen',
              expanded: false,
              children: [],
              products: P_DOUCHESTELLEN,
            },
            {
              id: 4,
              naam: 'Thermostaatkranen',
              expanded: false,
              children: [],
              products: P_THERMOSTAATKRANEN,
            },
            { id: 5, naam: 'Badkranen', expanded: false, children: [], products: P_BADKRANEN },
          ],
        },
        { id: 6, naam: 'Keukenmengers', expanded: false, children: [], products: P_KEUKENMENGERS },
        { id: 7, naam: 'Specials BE', expanded: false, children: [], products: P_SPECIALS },
      ],
    },
  ]);

  // ── UI state ──────────────────────────────────────────────────────
  const selectedNodeId = ref<number>(3);
  const selectedProducts = ref<Product[]>([]);
  const showAddProducts = ref(false);
  const productSearch = ref('');
  const productRows = ref(15);
  const productFirst = ref(0);
  const moreMenuRef = ref<any>(null);
  const productMenuRef = ref<any>(null);
  const csvDeleteInput = ref<HTMLInputElement | null>(null);
  const showDetailsDrawer = ref(false);
  const showDuplicateDialog = ref(false);

  // ── Group drawer state ────────────────────────────────────────────
  const gdVisible = ref(false);
  const gdIsEdit = ref(false);
  const gdEditGroupId = ref<number | null>(null);
  const gdParentGroupId = ref<number | null>(null);
  const gdInitialNaam = ref('');

  // ── Tree helpers ──────────────────────────────────────────────────
  function findGroup(id: number, nodes: Group[] = groups.value): Group | null {
    for (const g of nodes) {
      if (g.id === id) return g;
      const found = findGroup(id, g.children);
      if (found) return found;
    }
    return null;
  }

  function nextId(): number {
    let max = 0;
    function traverse(ns: Group[]) {
      for (const g of ns) {
        if (g.id > max) max = g.id;
        traverse(g.children);
      }
    }
    traverse(groups.value);
    return max + 1;
  }

  function findPath(targetId: number, nodes: Group[], path: Group[] = []): Group[] | null {
    for (const g of nodes) {
      const newPath = [...path, g];
      if (g.id === targetId) return newPath;
      const found = findPath(targetId, g.children, newPath);
      if (found) return found;
    }
    return null;
  }

  function toTreeNodes(nodes: Group[]): any[] {
    return nodes.map((g) => ({
      key: String(g.id),
      label: g.naam,
      selectable: true,
      children: g.children.length ? toTreeNodes(g.children) : undefined,
    }));
  }

  function flattenGroups(nodes: Group[], depth = 0): { node: Group; depth: number }[] {
    const items: { node: Group; depth: number }[] = [];
    for (const g of nodes) {
      items.push({ node: g, depth });
      if (g.expanded && g.children.length) items.push(...flattenGroups(g.children, depth + 1));
    }
    return items;
  }

  // ── Computed ──────────────────────────────────────────────────────
  const isVerlopen = computed(() => actie.value.status === 'Verlopen');

  const parentGroupOptions = computed(() => toTreeNodes(groups.value));

  // Hide the "Valt onder" field when editing (reparenting not yet supported)
  const gdEditingRootGroup = computed(() => gdIsEdit.value);

  const selectedNode = computed(() => findGroup(selectedNodeId.value));

  const selectedPath = computed(() => findPath(selectedNodeId.value, groups.value) ?? []);

  const flatGroups = computed(() => flattenGroups(groups.value));

  const activeProducts = computed(() => {
    const base = selectedNode.value?.products ?? [];
    if (!productSearch.value.trim()) return base;
    const q = productSearch.value.trim().toLowerCase();
    return base.filter(
      (p) =>
        p.code.toLowerCase().includes(q) ||
        p.merk.toLowerCase().includes(q) ||
        p.site.toLowerCase().includes(q)
    );
  });

  const paginatedProducts = computed(() =>
    activeProducts.value.slice(productFirst.value, productFirst.value + productRows.value)
  );

  watch(productSearch, () => {
    productFirst.value = 0;
  });

  const activeNodeNaam = computed(() => selectedNode.value?.naam ?? '');

  const statusConfig: Record<OfferStatus, { classes: string }> = {
    Actief: { classes: 'status--actief' },
    Verlopen: { classes: 'status--verlopen' },
    'Binnenkort gepland': { classes: 'status--gepland' },
  };

  // ── Group actions ─────────────────────────────────────────────────
  function selectNode(nodeId: number) {
    selectedNodeId.value = nodeId;
    selectedProducts.value = [];
    productSearch.value = '';
  }

  function toggleGroup(nodeId: number) {
    const g = findGroup(nodeId);
    if (g) g.expanded = !g.expanded;
  }

  function openCreateGroup(parentGroupId: number | null = null) {
    gdVisible.value = true;
    gdIsEdit.value = false;
    gdEditGroupId.value = null;
    gdParentGroupId.value = parentGroupId;
    gdInitialNaam.value = '';
  }

  function openEditGroup(nodeId: number) {
    const node = findGroup(nodeId);
    if (!node) return;
    gdVisible.value = true;
    gdIsEdit.value = true;
    gdEditGroupId.value = nodeId;
    gdParentGroupId.value = null;
    gdInitialNaam.value = node.naam;
  }

  function handleGroupSave(data: {
    isEdit: boolean;
    editGroupId: number | null;
    parentGroupId: number | null;
    naam: string;
  }) {
    if (data.isEdit) {
      const node = findGroup(data.editGroupId!);
      if (node) node.naam = data.naam;
    } else if (data.parentGroupId !== null) {
      const parent = findGroup(data.parentGroupId);
      if (!parent) return;
      const newId = nextId();
      parent.children.push({
        id: newId,
        naam: data.naam,
        expanded: false,
        children: [],
        products: [],
      });
      parent.expanded = true;
      selectNode(newId);
    } else {
      const newId = nextId();
      groups.value.push({
        id: newId,
        naam: data.naam,
        expanded: false,
        children: [],
        products: [],
      });
      selectNode(newId);
    }
  }

  function clearSelection() {
    selectedProducts.value = [];
  }

  function onPage(e: { first: number; rows: number }) {
    productFirst.value = e.first;
    productRows.value = e.rows;
  }

  // ── Product actions ───────────────────────────────────────────────
  function deleteSelectedProducts() {
    const ids = new Set(selectedProducts.value.map((p) => p.id));
    const target = selectedNode.value;
    if (target) target.products = target.products.filter((p) => !ids.has(p.id));
    selectedProducts.value = [];
  }

  function deleteAllProducts() {
    const target = selectedNode.value;
    if (target) target.products = [];
    selectedProducts.value = [];
    productMenuRef.value?.hide();
  }

  function deleteFilteredProducts() {
    const ids = new Set(activeProducts.value.map((p) => p.id));
    const target = selectedNode.value;
    if (target) target.products = target.products.filter((p) => !ids.has(p.id));
    selectedProducts.value = [];
    productSearch.value = '';
    productMenuRef.value?.hide();
  }

  function onCsvDeleteInput(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const codes = new Set(
        text
          .split(/[\n,;]/)
          .map((c) => c.trim().toUpperCase())
          .filter((c) => c.length > 0)
      );
      const target = selectedNode.value;
      if (target) target.products = target.products.filter((p) => !codes.has(p.code.toUpperCase()));
      selectedProducts.value = [];
    };
    reader.readAsText(file);
    (e.target as HTMLInputElement).value = '';
    productMenuRef.value?.hide();
  }

  function goBack() {
    router.push({ name: 'OffersOverview' });
  }

  // ── Pending midnight changes ───────────────────────────────────────
  interface PendingProductChange {
    code: string;
    merk: string;
    action: 'add' | 'remove';
  }
  interface PendingOptionChange {
    label: string;
    icon: string;
    action: 'add' | 'remove';
  }
  interface PendingGroupChanges {
    groupAction?: 'add' | 'remove';
    options: PendingOptionChange[];
    products: PendingProductChange[];
  }
  interface PendingSiteChange {
    site: string;
    action: 'add' | 'remove';
  }

  const PENDING_CHANGES: Record<number, PendingGroupChanges> = {
    3: {
      options: [{ label: 'Label', icon: 'pi-tag', action: 'add' }],
      products: [
        { code: 'SW1440400', merk: 'Grohe / Tempesta Cosmopolitan', action: 'add' },
        { code: 'SW1440399', merk: 'Grohe / Tempesta Cosmopolitan', action: 'add' },
        { code: 'SW1440398', merk: 'Grohe / Euphoria XXL', action: 'add' },
      ],
    },
    4: { groupAction: 'remove', options: [], products: [] },
    6: {
      options: [
        { label: 'Actietimer', icon: 'pi-clock', action: 'remove' },
        { label: 'Prijsmodificatie', icon: 'pi-percentage', action: 'remove' },
      ],
      products: [
        { code: 'SW1440540', merk: 'Grohe / K7', action: 'add' },
        { code: 'SW1440554', merk: 'Grohe / Minta', action: 'remove' },
        { code: 'SW1440553', merk: 'Grohe / Minta Touch', action: 'remove' },
      ],
    },
  };

  const PENDING_SITE_CHANGES: PendingSiteChange[] = [
    { site: 'sawiday_nl', action: 'remove' },
    { site: 'sawiday_fr', action: 'add' },
  ];

  const wijzigingenOpen = ref(false);
  const selectedGroupPending = computed(
    (): PendingGroupChanges | null => PENDING_CHANGES[selectedNodeId.value] ?? null
  );
  const pendingAddCount = computed(() => {
    const p = selectedGroupPending.value;
    if (!p || p.groupAction) return 0;
    return (
      p.options.filter((c) => c.action === 'add').length +
      p.products.filter((c) => c.action === 'add').length
    );
  });
  const pendingRemoveCount = computed(() => {
    const p = selectedGroupPending.value;
    if (!p || p.groupAction) return 0;
    return (
      p.options.filter((c) => c.action === 'remove').length +
      p.products.filter((c) => c.action === 'remove').length
    );
  });

  function groupHasPending(id: number) {
    return id in PENDING_CHANGES;
  }
  function groupHasPendingRemove(id: number) {
    const p = PENDING_CHANGES[id];
    return p
      ? p.groupAction === 'remove' ||
          p.options.some((c) => c.action === 'remove') ||
          p.products.some((c) => c.action === 'remove')
      : false;
  }
  function groupScheduledAction(id: number) {
    return PENDING_CHANGES[id]?.groupAction ?? null;
  }

  function deleteGroup(id: number) {
    function removeFrom(nodes: Group[]): boolean {
      const idx = nodes.findIndex((g) => g.id === id);
      if (idx !== -1) {
        nodes.splice(idx, 1);
        return true;
      }
      for (const g of nodes) {
        if (removeFrom(g.children)) return true;
      }
      return false;
    }
    removeFrom(groups.value);
    if (selectedNodeId.value === id) {
      const next = flatGroups.value[0]?.node.id;
      if (next) selectNode(next);
    }
  }

  watch(selectedNodeId, () => {
    wijzigingenOpen.value = false;
  });
</script>

<template>
  <div class="page">
    <!-- ── Header ────────────────────────────────────────────────── -->
    <div class="page-header">
      <div class="flex items-center gap-3 min-w-0">
        <button class="back-btn" @click="goBack"><i class="pi pi-arrow-left" /></button>
        <h1 class="page-title">{{ actie.naam }}</h1>
        <span class="status-badge" :class="statusConfig[actie.status].classes">{{
          actie.status
        }}</span>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <Button
          label="Details"
          icon="pi pi-pencil"
          severity="secondary"
          outlined
          size="small"
          @click="showDetailsDrawer = true"
        />
        <Button
          icon="pi pi-ellipsis-v"
          severity="secondary"
          variant="text"
          size="small"
          rounded
          @click="(moreMenuRef as any)?.toggle($event)"
        />
        <Popover ref="moreMenuRef">
          <div class="ctx-menu">
            <button
              class="ctx-item"
              @click="
                showDuplicateDialog = true;
                moreMenuRef?.hide();
              "
            >
              <i class="pi pi-copy" />Kopieer actie
            </button>
            <div class="ctx-sep" />
            <button class="ctx-item ctx-item--danger">
              <i class="pi pi-trash" />Verwijder actie
            </button>
          </div>
        </Popover>
      </div>
    </div>

    <!-- ── Verlopen banner ────────────────────────────────────────── -->
    <Transition name="fade">
      <div v-if="isVerlopen" class="verlopen-banner">
        <i class="pi pi-info-circle shrink-0" />
        <span>Deze actie is verlopen en kan niet meer bewerkt worden.</span>
        <button class="verlopen-copy-btn" @click="showDuplicateDialog = true">
          Maak een kopie
        </button>
      </div>
    </Transition>

    <!-- ══════════════════════════════════════════════════════════ -->
    <!-- GROEPEN                                                    -->
    <!-- ══════════════════════════════════════════════════════════ -->
    <div class="groepen-body">
      <!-- Groups tree -->
      <div class="groups-panel">
        <div class="groups-panel__header">
          <span>Groepen</span>
          <button
            v-if="!isVerlopen"
            class="icon-btn"
            title="Groep toevoegen"
            @click="openCreateGroup()"
          >
            <i class="pi pi-plus text-xs" />
          </button>
        </div>

        <div class="groups-tree">
          <div
            v-for="{ node, depth } in flatGroups"
            :key="node.id"
            class="group-row"
            :class="{
              'group-row--active': selectedNodeId === node.id,
              'group-row--removing': groupScheduledAction(node.id) === 'remove',
              'group-row--adding': groupScheduledAction(node.id) === 'add',
            }"
            :style="{ paddingLeft: `${0.5 + depth * 1.25}rem` }"
            @click="selectNode(node.id)"
          >
            <button
              v-if="node.children.length"
              class="expand-btn"
              @click.stop="toggleGroup(node.id)"
            >
              <i :class="`pi ${node.expanded ? 'pi-chevron-down' : 'pi-chevron-right'} text-xs`" />
            </button>
            <div v-else class="w-5 shrink-0" />
            <span class="group-naam flex-1 truncate">{{ node.naam }}</span>
            <i
              v-if="groupHasPending(node.id)"
              class="pi pi-clock pending-clock"
              :class="
                groupHasPendingRemove(node.id) ? 'pending-clock--mixed' : 'pending-clock--add'
              "
            />
            <span class="item-count">{{ node.products.length || '' }}</span>
            <div class="row-actions">
              <button
                v-if="!isVerlopen"
                class="row-action-btn"
                title="Subgroep toevoegen"
                @click.stop="openCreateGroup(node.id)"
              >
                <i class="pi pi-plus text-xs" />
              </button>
              <button class="row-action-btn" title="Bewerken" @click.stop="openEditGroup(node.id)">
                <i class="pi pi-pencil text-xs" />
              </button>
              <button
                v-if="!isVerlopen"
                class="row-action-btn row-action-btn--danger"
                title="Groep verwijderen"
                @click.stop="deleteGroup(node.id)"
              >
                <i class="pi pi-trash text-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Products panel -->
      <div class="products-panel">
        <template v-if="selectedNode">
          <!-- ── Row 1: breadcrumb + group actions ──────────────── -->
          <div class="products-panel__header">
            <div class="products-nav">
              <template v-for="(pathNode, i) in selectedPath" :key="pathNode.id">
                <button
                  class="nav-crumb"
                  :class="{ 'nav-crumb--leaf': i === selectedPath.length - 1 }"
                  @click="i < selectedPath.length - 1 ? selectNode(pathNode.id) : undefined"
                >
                  {{ pathNode.naam }}
                </button>
                <i v-if="i < selectedPath.length - 1" class="pi pi-chevron-right nav-sep" />
              </template>
              <span class="nav-count">{{ activeProducts.length }}</span>
            </div>
            <div class="header-group-actions">
              <Button
                icon="pi pi-pencil"
                severity="secondary"
                variant="text"
                size="small"
                rounded
                title="Groep bewerken"
                @click="openEditGroup(selectedNodeId)"
              />
              <Button
                v-if="!isVerlopen"
                icon="pi pi-trash"
                severity="danger"
                variant="text"
                size="small"
                rounded
                title="Groep verwijderen"
                @click="deleteGroup(selectedNodeId)"
              />
            </div>
          </div>

          <!-- ── Wijzigingen vannacht ──────────────────────────────── -->
          <Transition name="fade">
            <div v-if="selectedGroupPending" class="wijz-strip">
              <button class="wijz-hdr" @click="wijzigingenOpen = !wijzigingenOpen">
                <div class="wijz-hdr__left">
                  <i class="pi pi-clock wijz-clock" />
                  <span class="wijz-hdr__label">Vannacht</span>
                  <template v-if="selectedGroupPending!.groupAction">
                    <span
                      class="wijz-badge"
                      :class="
                        selectedGroupPending!.groupAction === 'remove'
                          ? 'wijz-badge--remove'
                          : 'wijz-badge--add'
                      "
                    >
                      Groep
                      {{
                        selectedGroupPending!.groupAction === 'remove' ? 'verwijderd' : 'toegevoegd'
                      }}
                    </span>
                  </template>
                  <template v-else>
                    <span v-if="pendingAddCount" class="wijz-badge wijz-badge--add"
                      >+{{ pendingAddCount }}</span
                    >
                    <span v-if="pendingRemoveCount" class="wijz-badge wijz-badge--remove"
                      >−{{ pendingRemoveCount }}</span
                    >
                  </template>
                </div>
                <i
                  class="pi wijz-chevron"
                  :class="wijzigingenOpen ? 'pi-chevron-up' : 'pi-chevron-down'"
                />
              </button>
              <Transition name="collapse">
                <div v-if="wijzigingenOpen" class="wijz-list">
                  <!-- Group-level action notice -->
                  <template v-if="selectedGroupPending!.groupAction">
                    <div
                      class="wijz-group-action"
                      :class="`wijz-group-action--${selectedGroupPending!.groupAction}`"
                    >
                      <i
                        :class="`pi ${selectedGroupPending!.groupAction === 'remove' ? 'pi-trash' : 'pi-plus-circle'}`"
                      />
                      <span
                        >Deze groep wordt vannacht
                        {{
                          selectedGroupPending!.groupAction === 'remove'
                            ? 'verwijderd'
                            : 'toegevoegd'
                        }}</span
                      >
                    </div>
                  </template>

                  <!-- Option changes -->
                  <template v-if="selectedGroupPending!.options.length">
                    <div v-if="selectedGroupPending!.groupAction" class="wijz-separator" />
                    <div class="wijz-section-label">Opties</div>
                    <div class="wijz-options">
                      <div
                        v-for="opt in selectedGroupPending!.options"
                        :key="opt.label + opt.action"
                        class="wijz-opt-chip"
                        :class="`wijz-opt-chip--${opt.action}`"
                      >
                        <i :class="`pi ${opt.icon} wijz-opt-icon`" />
                        <span class="wijz-opt-label">{{ opt.label }}</span>
                        <span class="wijz-opt-action">{{
                          opt.action === 'add' ? 'toegevoegd' : 'verwijderd'
                        }}</span>
                      </div>
                    </div>
                    <div v-if="selectedGroupPending!.products.length" class="wijz-separator" />
                  </template>

                  <!-- Product changes -->
                  <template v-if="selectedGroupPending!.products.length">
                    <div v-if="selectedGroupPending!.options.length" class="wijz-section-label">
                      Producten
                    </div>
                    <div
                      v-for="change in selectedGroupPending!.products"
                      :key="change.code + change.action"
                      class="wijz-item"
                      :class="`wijz-item--${change.action}`"
                    >
                      <span class="wijz-sign">{{ change.action === 'add' ? '+' : '−' }}</span>
                      <span class="wijz-code">{{ change.code }}</span>
                      <span class="wijz-merk">{{ change.merk }}</span>
                    </div>
                  </template>
                </div>
              </Transition>
            </div>
          </Transition>

          <!-- ── Row 2: search + add + delete ─────────────────────── -->
          <div class="products-toolbar">
            <IconField class="flex-1">
              <InputIcon class="pi pi-search" />
              <InputText
                v-model="productSearch"
                placeholder="Zoeken op code, merk of site…"
                size="small"
                class="w-full"
              />
            </IconField>
            <template v-if="!isVerlopen">
              <Button
                label="Toevoegen"
                icon="pi pi-plus"
                size="small"
                @click="showAddProducts = true"
              />
              <Button
                icon="pi pi-trash"
                label="Verwijderen"
                severity="danger"
                outlined
                size="small"
                @click="productMenuRef?.toggle($event)"
              />
              <Popover ref="productMenuRef">
                <div class="ctx-menu">
                  <button
                    v-if="productSearch.trim()"
                    class="ctx-item ctx-item--danger"
                    @click="deleteFilteredProducts"
                  >
                    <i class="pi pi-filter" />Verwijder zoekresultaten ({{ activeProducts.length }})
                  </button>
                  <button class="ctx-item ctx-item--danger" @click="csvDeleteInput?.click()">
                    <i class="pi pi-file-import" />Verwijder via CSV
                  </button>
                  <div class="ctx-sep" />
                  <button class="ctx-item ctx-item--danger" @click="deleteAllProducts">
                    <i class="pi pi-trash" />Verwijder alle producten
                  </button>
                </div>
              </Popover>
              <input
                ref="csvDeleteInput"
                type="file"
                accept=".csv"
                class="hidden"
                @change="onCsvDeleteInput"
              />
            </template>
          </div>

          <!-- ── Empty: no products ────────────────────────────────── -->
          <div v-if="activeProducts.length === 0 && !productSearch.trim()" class="products-empty">
            <div class="products-empty__icon"><i class="pi pi-box" /></div>
            <p class="products-empty__title">Geen producten</p>
            <p class="products-empty__sub">
              Voeg producten toe aan <strong>{{ activeNodeNaam }}</strong>
            </p>
            <Button
              v-if="!isVerlopen"
              label="Producten toevoegen"
              icon="pi pi-plus"
              outlined
              size="small"
              severity="secondary"
              @click="showAddProducts = true"
            />
          </div>

          <!-- ── Empty: no search results ──────────────────────────── -->
          <div v-else-if="activeProducts.length === 0" class="products-empty">
            <div class="products-empty__icon"><i class="pi pi-search" /></div>
            <p class="products-empty__title">Geen resultaten</p>
            <p class="products-empty__sub">Niets gevonden voor "{{ productSearch }}"</p>
            <button class="products-empty__reset" @click="productSearch = ''">
              Zoekopdracht wissen
            </button>
          </div>

          <!-- ── Table + paginator ──────────────────────────────────── -->
          <template v-else>
            <div class="products-table-wrap">
              <DataTable
                v-model:selection="selectedProducts"
                :value="paginatedProducts"
                class="products-table"
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
              </DataTable>
            </div>
            <Paginator
              :first="productFirst"
              :rows="productRows"
              :total-records="activeProducts.length"
              :rows-per-page-options="[15, 25, 50]"
              template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
              class="products-pager"
              @page="onPage"
            />
          </template>

          <Transition name="slide-up">
            <div v-if="selectedProducts.length" class="selection-bar">
              <div class="selection-bar__inner">
                <span class="selection-bar__count">{{ selectedProducts.length }} geselecteerd</span>
                <div class="selection-bar__actions">
                  <button class="selection-bar__clear" @click="clearSelection">Wissen</button>
                  <Button
                    label="Verwijderen"
                    icon="pi pi-trash"
                    severity="danger"
                    size="small"
                    @click="deleteSelectedProducts"
                  />
                </div>
              </div>
            </div>
          </Transition>
        </template>
      </div>
    </div>
    <!-- /groepen-body -->

    <!-- ════════════════════════════════════════════════════════════ -->
    <!-- COMPONENTS                                                   -->
    <!-- ════════════════════════════════════════════════════════════ -->
    <AddProductsDialog v-model:visible="showAddProducts" :group-naam="activeNodeNaam" />

    <DuplicateDialog
      v-model:visible="showDuplicateDialog"
      :actie-naam="actie.naam"
      :actie-websites="actie.websites"
      :actie-startdatum="actie.startdatum"
      :actie-einddatum="actie.einddatum"
    />

    <GroupDrawer
      v-model:visible="gdVisible"
      :is-edit="gdIsEdit"
      :edit-group-id="gdEditGroupId"
      :parent-group-id="gdParentGroupId"
      :initial-naam="gdInitialNaam"
      :site-labels="siteLabels"
      :parent-group-options="parentGroupOptions"
      :editing-root-group="gdEditingRootGroup"
      @save="handleGroupSave"
    />

    <DetailsDrawer
      v-model:visible="showDetailsDrawer"
      :naam="actie.naam"
      :websites="actie.websites"
      :startdatum="actie.startdatum"
      :einddatum="actie.einddatum"
      :omschrijving="actie.omschrijving"
      :website-options="websiteOptions"
      :is-verlopen="isVerlopen"
      :pending-sites="PENDING_SITE_CHANGES"
      @save="(d) => Object.assign(actie, d)"
    />
  </div>
</template>

<style scoped>
  /* ── Page ────────────────────────────────────────────────────── */
  .page {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--p-gray-100);
    gap: 1rem;
    flex-shrink: 0;
  }
  .page-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--p-surface-800);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .back-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 0.375rem;
    flex-shrink: 0;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--p-gray-400);
    transition:
      background 0.1s,
      color 0.1s;
  }
  .back-btn:hover {
    background: var(--p-gray-100);
    color: var(--p-gray-700);
  }

  /* ── Status badges ───────────────────────────────────────────── */
  .status-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.2rem 0.75rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
  }
  .status--actief {
    background: var(--p-green-100);
    color: var(--p-green-700);
  }
  .status--verlopen {
    background: var(--p-gray-100);
    color: var(--p-gray-500);
  }
  .status--gepland {
    background: var(--p-blue-100);
    color: var(--p-blue-700);
  }

  /* ── Verlopen banner ─────────────────────────────────────────── */
  .verlopen-banner {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.75rem 1rem;
    margin-top: 0.875rem;
    background: var(--p-blue-50);
    border: 1px solid var(--p-blue-200);
    border-radius: 0.5rem;
    font-size: 0.875rem;
    color: var(--p-blue-700);
    flex-shrink: 0;
  }
  .verlopen-copy-btn {
    margin-left: auto;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--p-blue-700);
    background: none;
    border: 1.5px solid var(--p-blue-300);
    border-radius: 0.375rem;
    padding: 0.25rem 0.75rem;
    cursor: pointer;
    transition: background 0.15s;
  }
  .verlopen-copy-btn:hover {
    background: var(--p-blue-100);
  }

  /* ── Groepen body ────────────────────────────────────────────── */
  .groepen-body {
    display: flex;
    gap: 0;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  /* Groups panel */
  .groups-panel {
    width: 420px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    background: var(--p-surface-50);
    border-right: 1px solid var(--p-gray-150, var(--p-gray-200));
  }
  .groups-panel__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 0.75rem;
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--p-gray-400);
    border-bottom: 1px solid var(--p-gray-100);
    flex-shrink: 0;
  }

  .icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.375rem;
    height: 1.375rem;
    border-radius: 0.25rem;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--p-gray-400);
    transition:
      background 0.1s,
      color 0.1s;
  }
  .icon-btn:hover {
    background: var(--p-gray-200);
    color: var(--p-gray-700);
  }

  .groups-tree {
    flex: 1;
    overflow-y: auto;
    padding: 0.25rem;
  }

  /* Group rows */
  .group-row {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.4rem 0.5rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background 0.1s;
    margin-bottom: 0.125rem;
  }
  .group-row:hover {
    background: var(--p-gray-100);
  }
  .group-row:hover .row-actions {
    opacity: 1 !important;
  }
  .group-row:hover .item-count {
    opacity: 0;
  }
  .group-row--active {
    background: var(--p-primary-50);
  }
  .group-naam {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--p-gray-700);
  }
  .group-row--active .group-naam {
    color: var(--p-primary-700);
  }

  .item-count {
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--p-gray-400);
    background: var(--p-gray-100);
    border-radius: 999px;
    padding: 0.05rem 0.375rem;
    min-width: 1.25rem;
    text-align: center;
    transition: opacity 0.1s;
    flex-shrink: 0;
  }
  .group-row--active .item-count {
    background: var(--p-primary-100);
    color: var(--p-primary-600);
  }

  .row-actions {
    opacity: 0;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    transition: opacity 0.1s;
    flex-shrink: 0;
  }
  .expand-btn,
  .row-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.375rem;
    height: 1.375rem;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--p-gray-400);
    border-radius: 0.25rem;
    transition:
      background 0.1s,
      color 0.1s;
    flex-shrink: 0;
  }
  .expand-btn:hover,
  .row-action-btn:hover {
    background: var(--p-gray-200);
    color: var(--p-gray-700);
  }

  /* Products panel */
  .products-panel {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }
  .products-panel__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem 0.5rem 1rem;
    flex-shrink: 0;
  }
  .products-toolbar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.75rem;
    border-bottom: 1px solid var(--p-gray-100);
    flex-shrink: 0;
  }
  .products-pager {
    border-top: 1px solid var(--p-surface-100);
    background: transparent;
    flex-shrink: 0;
    padding: 0.125rem 0.5rem;
  }
  .products-pager :deep(.p-paginator-page),
  .products-pager :deep(.p-paginator-first),
  .products-pager :deep(.p-paginator-prev),
  .products-pager :deep(.p-paginator-next),
  .products-pager :deep(.p-paginator-last) {
    min-width: 2rem;
    height: 2rem;
    font-size: 0.8125rem;
  }

  /* Breadcrumb nav */
  .products-nav {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    flex: 1;
    min-width: 0;
  }
  .nav-crumb {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--p-gray-400);
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    max-width: 16rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: color 0.1s;
  }
  .nav-crumb:hover {
    color: var(--p-gray-700);
  }
  .nav-crumb--leaf {
    color: var(--p-surface-700);
    cursor: default;
  }
  .nav-sep {
    font-size: 0.625rem;
    color: var(--p-gray-300);
  }
  .nav-count {
    font-size: 0.75rem;
    color: var(--p-gray-400);
    background: var(--p-gray-100);
    border-radius: 999px;
    padding: 0.1rem 0.5rem;
    flex-shrink: 0;
  }

  /* Empty states */
  .products-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.625rem;
    padding: 3rem 2rem;
    text-align: center;
  }
  .products-empty__icon {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    background: var(--p-gray-100);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.375rem;
    color: var(--p-gray-400);
    margin-bottom: 0.25rem;
  }
  .products-empty__title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--p-surface-600);
  }
  .products-empty__sub {
    font-size: 0.8125rem;
    color: var(--p-gray-400);
  }
  .products-empty__reset {
    font-size: 0.8125rem;
    color: var(--p-primary-600);
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: color 0.1s;
  }
  .products-empty__reset:hover {
    color: var(--p-primary-800);
    text-decoration: underline;
  }

  /* Table */
  .products-table-wrap {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
  .products-table :deep(th) {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--p-surface-400);
    background: transparent;
    border-bottom: 1px solid var(--p-surface-200);
    padding: 0.5rem 0.75rem;
  }
  .products-table :deep(td) {
    padding: 0.625rem 0.75rem;
    border-bottom: 1px solid var(--p-surface-100);
  }
  .products-table :deep(tr:last-child td) {
    border-bottom: none;
  }
  .products-table :deep(tr:hover td) {
    background: var(--p-surface-50);
  }
  .products-table :deep(.p-datatable-tbody > tr) {
    transition: background 0.1s;
  }

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

  /* Floating selection bar */
  .selection-bar {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    pointer-events: none;
  }
  .selection-bar__inner {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: var(--p-surface-800);
    color: white;
    border-radius: 2rem;
    padding: 0.5rem 0.625rem 0.5rem 1.25rem;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.22);
    pointer-events: all;
    white-space: nowrap;
  }
  .selection-bar__count {
    font-size: 0.875rem;
    font-weight: 500;
  }
  .selection-bar__actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .selection-bar__clear {
    font-size: 0.8125rem;
    color: rgba(255, 255, 255, 0.55);
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: color 0.1s;
  }
  .selection-bar__clear:hover {
    color: white;
  }

  /* ── Context menus ───────────────────────────────────────────── */
  .ctx-menu {
    display: flex;
    flex-direction: column;
    min-width: 10rem;
  }
  .ctx-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    text-align: left;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    color: var(--p-gray-700);
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 0.25rem;
    transition: background 0.1s;
  }
  .ctx-item:hover {
    background: var(--p-gray-50);
  }
  .ctx-item--danger {
    color: var(--p-red-600);
  }
  .ctx-item--danger:hover {
    background: var(--p-red-50);
  }
  .ctx-sep {
    height: 1px;
    background: var(--p-gray-100);
    margin: 0.25rem 0;
  }

  /* ── Pending clock dot (group sidebar) ───────────────────────── */
  .pending-clock {
    font-size: 0.6rem;
    flex-shrink: 0;
    margin-right: -0.125rem;
  }
  .pending-clock--add {
    color: var(--p-amber-400);
  }
  .pending-clock--mixed {
    color: var(--p-red-400);
  }

  /* ── Group scheduled states ──────────────────────────────────── */
  .group-row--removing .group-naam {
    text-decoration: line-through;
    color: var(--p-red-400);
  }
  .group-row--adding .group-naam {
    color: var(--p-green-600);
    font-style: italic;
  }

  /* ── Header group action buttons ─────────────────────────────── */
  .header-group-actions {
    display: flex;
    align-items: center;
    gap: 0.125rem;
    flex-shrink: 0;
  }

  /* ── Row action danger variant ───────────────────────────────── */
  .row-action-btn--danger:hover {
    background: var(--p-red-50) !important;
    color: var(--p-red-500) !important;
  }

  /* ── Wijzigingen vannacht strip ───────────────────────────────── */
  .wijz-strip {
    flex-shrink: 0;
    border-bottom: 1px solid var(--p-gray-100);
  }
  .wijz-hdr {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.375rem 1rem;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background 0.1s;
  }
  .wijz-hdr:hover {
    background: var(--p-gray-50);
  }
  .wijz-hdr__left {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  .wijz-hdr__label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--p-gray-500);
  }
  .wijz-clock {
    font-size: 0.75rem;
    color: var(--p-gray-400);
  }
  .wijz-chevron {
    font-size: 0.6rem;
    color: var(--p-gray-400);
  }
  .wijz-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.05rem 0.4rem;
    border-radius: 999px;
    font-size: 0.73rem;
    font-weight: 700;
    line-height: 1.4;
  }
  .wijz-badge--add {
    background: var(--p-green-100);
    color: var(--p-green-700);
  }
  .wijz-badge--remove {
    background: var(--p-red-100);
    color: var(--p-red-600);
  }

  .wijz-list {
    display: flex;
    flex-direction: column;
    padding: 0 1rem 0.625rem;
    gap: 0.2rem;
  }

  .wijz-group-action {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.8125rem;
    font-weight: 500;
  }
  .wijz-group-action--remove {
    background: var(--p-red-50);
    color: var(--p-red-600);
  }
  .wijz-group-action--add {
    background: var(--p-green-50);
    color: var(--p-green-700);
  }
  .wijz-group-action .pi {
    font-size: 0.75rem;
  }

  .wijz-section-label {
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--p-gray-400);
    padding: 0.25rem 0 0.125rem;
  }
  .wijz-separator {
    height: 1px;
    background: var(--p-gray-100);
    margin: 0.375rem 0;
  }

  .wijz-options {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    padding-bottom: 0.125rem;
  }
  .wijz-opt-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.2rem 0.55rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 500;
    border: 1px solid transparent;
  }
  .wijz-opt-chip--add {
    background: var(--p-green-50);
    color: var(--p-green-700);
    border-color: var(--p-green-200);
  }
  .wijz-opt-chip--remove {
    background: var(--p-red-50);
    color: var(--p-red-600);
    border-color: var(--p-red-200);
  }
  .wijz-opt-icon {
    font-size: 0.65rem;
  }
  .wijz-opt-action {
    font-weight: 400;
    opacity: 0.7;
  }

  .wijz-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
  }
  .wijz-sign {
    font-weight: 700;
    width: 0.75rem;
    text-align: center;
    flex-shrink: 0;
  }
  .wijz-item--add .wijz-sign {
    color: var(--p-green-600);
  }
  .wijz-item--remove .wijz-sign {
    color: var(--p-red-500);
  }
  .wijz-code {
    font-family: monospace;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--p-surface-700);
  }
  .wijz-merk {
    color: var(--p-gray-400);
    font-size: 0.75rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ── Transitions ─────────────────────────────────────────────── */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.15s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .slide-up-enter-active {
    transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .slide-up-leave-active {
    transition: all 0.15s ease;
  }
  .slide-up-enter-from {
    opacity: 0;
    transform: translateX(-50%) translateY(0.75rem) scale(0.95);
  }
  .slide-up-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(0.5rem) scale(0.97);
  }
</style>
