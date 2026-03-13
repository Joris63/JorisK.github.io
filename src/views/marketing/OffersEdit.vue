<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import GroupDrawer from './components/GroupDrawer.vue';
  import AddProductsDialog from './components/AddProductsDialog.vue';
  import DuplicateDialog from './components/DuplicateDialog.vue';
  import OfferGroupTree from './components/OfferGroupTree.vue';
  import OfferProductPanel from './components/OfferProductPanel.vue';
  import EditableCard from '@/components/EditableCard.vue';

  import type { OfferStatus, OfferGroup as Group } from '@/types/offer';
  import { parseDMY } from '@/utils/format';
  import { MOCK_GROUPS, PENDING_CHANGES, PENDING_SITE_CHANGES } from '@/mocks/offers';

  const route = useRoute();
  const router = useRouter();

  // ── Tab ───────────────────────────────────────────────────────────
  const activeTab = ref('groepen');

  // ── Actie ─────────────────────────────────────────────────────────
  const actie = ref({
    id: Number(route.params.id),
    naam: '2026 Q1: GROHE COLORS BE',
    omschrijving: '',
    websites: ['sawiday_be'],
    startdatum: parseDMY('11-02-2026') as Date | null,
    einddatum: parseDMY('31-03-2026') as Date | null,
    status: 'Actief' as OfferStatus,
  });

  // ── Details edit state ────────────────────────────────────────────
  const editingDetails = ref(false);
  const detailsDraft = ref({ ...actie.value, websites: [...actie.value.websites] });

  function startEditDetails() {
    detailsDraft.value = { ...actie.value, websites: [...actie.value.websites] };
    editingDetails.value = true;
  }

  function saveDetails() {
    Object.assign(actie.value, detailsDraft.value);
  }

  function cancelDetails() {
    // draft is discarded, EditableCard sets editingDetails = false
  }

  const websiteOptions = [
    { label: 'sanitairwinkel.nl', value: 'sanitairwinkel_nl' },
    { label: 'sawiday.be', value: 'sawiday_be' },
    { label: 'sawiday.fr', value: 'sawiday_fr' },
    { label: 'sawiday.de', value: 'sawiday_de' },
  ];

  const websiteLabels: Record<string, string> = {
    sanitairwinkel_nl: 'sanitairwinkel.nl',
    sawiday_be: 'sawiday.be',
    sawiday_fr: 'sawiday.fr',
    sawiday_de: 'sawiday.de',
  };

  const siteMap: Record<string, { code: string; langs: string[] }> = {
    sanitairwinkel_nl: { code: 'SWNL', langs: ['nl-NL'] },
    sawiday_be: { code: 'SWBE', langs: ['nl-BE', 'fr-BE'] },
    sawiday_fr: { code: 'SWFR', langs: ['fr-FR'] },
    sawiday_de: { code: 'SWDE', langs: ['de-DE'] },
  };

  const siteLabels = computed(() =>
    actie.value.websites.flatMap((w) => {
      const s = siteMap[w];
      return s ? s.langs.map((lang) => `${s.code} (${lang})`) : [];
    })
  );

  function formatDate(d: Date | null) {
    if (!d) return '—';
    return d.toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  // ── Groups state ──────────────────────────────────────────────────
  const groups = ref<Group[]>(MOCK_GROUPS);
  const selectedNodeId = ref<number>(3);

  // ── Dialog / drawer visibility ────────────────────────────────────
  const showAddProducts = ref(false);
  const showDuplicateDialog = ref(false);

  // ── Group drawer state ────────────────────────────────────────────
  const gdVisible = ref(false);
  const gdIsEdit = ref(false);
  const gdEditGroupId = ref<number | null>(null);
  const gdParentGroupId = ref<number | null>(null);
  const gdInitialNaam = ref('');

  // ── Computed ──────────────────────────────────────────────────────
  const isVerlopen = computed(() => actie.value.status === 'Verlopen');

  const websiteSubtitle = computed(
    () => actie.value.websites.map((w) => websiteLabels[w] ?? w).join(' · ') || '—'
  );

  const totalGroups = computed(() => {
    function count(nodes: Group[]): number {
      return nodes.reduce((sum, g) => sum + 1 + count(g.children), 0);
    }
    return count(groups.value);
  });

  const totalProducts = computed(() => {
    function count(nodes: Group[]): number {
      return nodes.reduce((sum, g) => sum + g.products.length + count(g.children), 0);
    }
    return count(groups.value);
  });

  const looptijdLabel = computed(
    () => `${formatDate(actie.value.startdatum)} – ${formatDate(actie.value.einddatum)}`
  );

  const statusBadgeClass = computed(() => {
    const map: Record<OfferStatus, string> = {
      Actief: 'oe-pill--active',
      Verlopen: 'oe-pill--expired',
      'Binnenkort gepland': 'oe-pill--planned',
    };
    return map[actie.value.status];
  });

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

  const selectedNode = computed(() => findGroup(selectedNodeId.value));
  const selectedPath = computed(() => findPath(selectedNodeId.value, groups.value) ?? []);
  const flatGroups = computed(() => flattenGroups(groups.value));
  const parentGroupOptions = computed(() => toTreeNodes(groups.value));
  const gdEditingRootGroup = computed(() => gdIsEdit.value);
  const activeNodeNaam = computed(() => selectedNode.value?.naam ?? '');
  const activeProducts = computed(() => selectedNode.value?.products ?? []);

  // ── Group actions ─────────────────────────────────────────────────
  function selectNode(nodeId: number) {
    selectedNodeId.value = nodeId;
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

  // ── Product actions ───────────────────────────────────────────────
  function handleDeleteProducts(ids: number[]) {
    const idSet = new Set(ids);
    const target = selectedNode.value;
    if (target) target.products = target.products.filter((p) => !idSet.has(p.id));
  }
  function handleDeleteAllProducts() {
    const target = selectedNode.value;
    if (target) target.products = [];
  }
  function handleDeleteFilteredProducts(ids: number[]) {
    const idSet = new Set(ids);
    const target = selectedNode.value;
    if (target) target.products = target.products.filter((p) => !idSet.has(p.id));
  }
  function handleDeleteCsvProducts(codes: Set<string>) {
    const target = selectedNode.value;
    if (target) target.products = target.products.filter((p) => !codes.has(p.code.toUpperCase()));
  }
</script>

<template>
  <div class="oe-page">
    <!-- ── Header ────────────────────────────────────────────────── -->
    <div class="oe-hdr">
      <Button
        icon="pi pi-arrow-left"
        severity="secondary"
        text
        rounded
        @click="router.push({ name: 'OffersOverview' })"
      />
      <div class="oe-avatar">
        <i class="pi pi-tag" />
      </div>
      <div class="oe-header-info">
        <div class="oe-header-top">
          <span class="oe-title">{{ actie.naam }}</span>
          <span class="oe-pill" :class="statusBadgeClass">{{ actie.status }}</span>
        </div>
        <span class="oe-subtitle">{{ websiteSubtitle }}</span>
      </div>
      <div class="oe-hdr-stats">
        <div class="oe-hdr-stat">
          <span class="oe-hdr-stat-val">{{ totalGroups }}</span>
          <span class="oe-hdr-stat-lbl">Groepen</span>
        </div>
        <div class="oe-hdr-stat-sep" />
        <div class="oe-hdr-stat">
          <span class="oe-hdr-stat-val">{{ totalProducts }}</span>
          <span class="oe-hdr-stat-lbl">Producten</span>
        </div>
        <div class="oe-hdr-stat-sep" />
        <div class="oe-hdr-stat">
          <span class="oe-hdr-stat-val">{{ looptijdLabel }}</span>
          <span class="oe-hdr-stat-lbl">Looptijd</span>
        </div>
      </div>

      <Button icon="pi pi-ellipsis-v" severity="secondary" text rounded style="margin-left: auto" />
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

    <!-- ── Tabs ───────────────────────────────────────────────────── -->
    <div class="oe-tabs">
      <button
        class="oe-tab"
        :class="{ 'oe-tab--active': activeTab === 'details' }"
        @click="activeTab = 'details'"
      >
        <i class="pi pi-info-circle" />Details
      </button>
      <button
        class="oe-tab"
        :class="{ 'oe-tab--active': activeTab === 'groepen' }"
        @click="activeTab = 'groepen'"
      >
        <i class="pi pi-sitemap" />Groepen
      </button>
      <button
        class="oe-tab"
        :class="{ 'oe-tab--active': activeTab === 'taken' }"
        @click="activeTab = 'taken'"
      >
        <i class="pi pi-list-check" />Taken
      </button>
    </div>

    <!-- ── Tab 1: Details ─────────────────────────────────────────── -->
    <div v-if="activeTab === 'details'" class="tab-scroll">
      <div class="view-card">
        <EditableCard
          v-model="editingDetails"
          title="Actiedetails"
          :disabled="isVerlopen"
          @save="saveDetails"
          @cancel="cancelDetails"
          @update:model-value="
            (v) => {
              if (v) startEditDetails();
            }
          "
        >
          <!-- View mode -->
          <template #view>
            <div class="view-card-body">
              <div class="fr-row">
                <span class="fr-label">Naam</span>
                <span class="fr-value">{{ actie.naam }}</span>
              </div>
              <div class="fr-row fr-row--top">
                <span class="fr-label">Website(s)</span>
                <div class="flex flex-col gap-2">
                  <div class="flex flex-wrap gap-1">
                    <span v-for="w in actie.websites" :key="w" class="site-tag">{{
                      websiteLabels[w] ?? w
                    }}</span>
                    <span v-if="!actie.websites.length" class="fr-empty">—</span>
                  </div>
                  <div v-if="PENDING_SITE_CHANGES.length" class="pending-sites">
                    <span class="pending-label">Vannacht:</span>
                    <div class="pending-chips">
                      <span
                        v-for="s in PENDING_SITE_CHANGES"
                        :key="s.site + s.action"
                        class="pending-chip"
                        :class="`pending-chip--${s.action}`"
                      >
                        <i :class="`pi ${s.action === 'add' ? 'pi-plus' : 'pi-minus'} text-xs`" />
                        {{ s.site }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="fr-row">
                <span class="fr-label">Looptijd</span>
                <span class="fr-value">
                  {{ formatDate(actie.startdatum) }} → {{ formatDate(actie.einddatum) }}
                </span>
              </div>
              <div class="fr-row fr-row--top">
                <span class="fr-label">Omschrijving</span>
                <span v-if="actie.omschrijving" class="fr-value" style="white-space: pre-wrap">{{
                  actie.omschrijving
                }}</span>
                <span v-else class="fr-empty">—</span>
              </div>
            </div>
          </template>

          <!-- Edit mode -->
          <template #edit>
            <div class="view-card-body">
              <div class="fr-row">
                <span class="fr-label">Naam <span class="fr-req">*</span></span>
                <InputText
                  v-model="detailsDraft.naam"
                  class="w-full"
                  placeholder="Bijv. 2026 Q1: Black Friday BE"
                />
              </div>
              <div class="fr-row fr-row--top">
                <span class="fr-label">Website(s) <span class="fr-req">*</span></span>
                <div class="flex flex-col gap-2">
                  <MultiSelect
                    v-model="detailsDraft.websites"
                    :options="websiteOptions"
                    option-label="label"
                    option-value="value"
                    class="w-full"
                    placeholder="Selecteer website(s)"
                    display="chip"
                  />
                  <div v-if="PENDING_SITE_CHANGES.length" class="pending-sites">
                    <span class="pending-label">Vannacht:</span>
                    <div class="pending-chips">
                      <span
                        v-for="s in PENDING_SITE_CHANGES"
                        :key="s.site + s.action"
                        class="pending-chip"
                        :class="`pending-chip--${s.action}`"
                      >
                        <i :class="`pi ${s.action === 'add' ? 'pi-plus' : 'pi-minus'} text-xs`" />
                        {{ s.site }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="fr-row">
                <span class="fr-label">Looptijd <span class="fr-req">*</span></span>
                <div class="flex items-center gap-2">
                  <DatePicker
                    v-model="detailsDraft.startdatum"
                    date-format="dd-mm-yy"
                    show-icon
                    icon-display="input"
                    class="flex-1"
                    placeholder="Startdatum"
                  />
                  <span class="text-gray-300 text-sm shrink-0">→</span>
                  <DatePicker
                    v-model="detailsDraft.einddatum"
                    date-format="dd-mm-yy"
                    show-icon
                    icon-display="input"
                    class="flex-1"
                    placeholder="Einddatum"
                  />
                </div>
              </div>
              <div class="fr-row fr-row--top">
                <span class="fr-label">Omschrijving</span>
                <Textarea
                  v-model="detailsDraft.omschrijving"
                  class="w-full"
                  :rows="4"
                  placeholder="Optionele omschrijving"
                  auto-resize
                />
              </div>
            </div>
          </template>
        </EditableCard>
      </div>
    </div>

    <!-- ── Tab 2: Groepen ─────────────────────────────────────────── -->
    <div v-else-if="activeTab === 'groepen'" class="oe-groepen-tab">
      <!-- Groups card -->
      <div class="view-card oe-groups-card">
        <div class="view-card-hdr">
          <span class="view-card-title">Groepen</span>
          <Button
            v-if="!isVerlopen"
            label="Toevoegen"
            icon="pi pi-plus"
            size="small"
            severity="secondary"
            text
            @click="openCreateGroup(null)"
          />
        </div>
        <OfferGroupTree
          :groups="groups"
          :selected-group-id="selectedNodeId"
          :pending-changes="PENDING_CHANGES"
          :is-verlopen="isVerlopen"
          :headless="true"
          @select-group="selectNode"
          @toggle-group="toggleGroup"
          @add-group="openCreateGroup"
          @edit-group="openEditGroup"
          @delete-group="deleteGroup"
        />
      </div>

      <!-- Products card -->
      <div class="view-card oe-products-card">
        <OfferProductPanel
          :products="activeProducts"
          :selected-group-id="selectedNodeId"
          :selected-path="selectedPath"
          :pending-changes="PENDING_CHANGES"
          :pending-site-changes="PENDING_SITE_CHANGES"
          :is-verlopen="isVerlopen"
          :group-naam="activeNodeNaam"
          @add-products="showAddProducts = true"
          @delete-products="handleDeleteProducts"
          @delete-all-products="handleDeleteAllProducts"
          @delete-filtered-products="handleDeleteFilteredProducts"
          @delete-csv-products="handleDeleteCsvProducts"
          @select-group="selectNode"
          @edit-group="openEditGroup"
          @delete-group="deleteGroup"
        />
      </div>
    </div>

    <!-- ── Tab 3: Taken (placeholder) ────────────────────────────── -->
    <div v-else-if="activeTab === 'taken'" class="tab-scroll">
      <div class="view-card">
        <div class="view-card-hdr">
          <span class="view-card-title">Achtergrondtaken</span>
        </div>
        <div class="view-card-body">
          <p class="table-empty" style="text-align: center; padding: 1.5rem 0">
            Nog geen taken beschikbaar
          </p>
        </div>
      </div>
    </div>

    <!-- ── Dialogs & Drawers ──────────────────────────────────────── -->
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
  </div>
</template>

<style scoped>
  /* ── Page ────────────────────────────────────────────────────── */
  .oe-page {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: clip;
  }

  /* ── Header ──────────────────────────────────────────────────── */
  .oe-hdr {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.25rem;
    border-bottom: 1px solid var(--p-gray-100);
    background: white;
    flex-shrink: 0;
  }
  .oe-avatar {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--p-primary-400) 0%, var(--p-primary-600) 100%);
    color: white;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .oe-header-info {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .oe-header-top {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-wrap: wrap;
  }
  .oe-title {
    font-size: 1.0625rem;
    font-weight: 600;
    color: var(--p-surface-800);
    line-height: 1.2;
  }
  .oe-subtitle {
    font-size: 0.8125rem;
    color: var(--p-surface-400);
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

  /* ── Header stats ────────────────────────────────────────────── */
  .oe-hdr-stats {
    display: flex;
    align-items: center;
    border-left: 1px solid var(--p-gray-100);
    margin: 0 0.5rem;
    padding: 0 0.25rem;
  }
  .oe-hdr-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 1rem;
  }
  .oe-hdr-stat-val {
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--p-surface-800);
    line-height: 1.3;
    white-space: nowrap;
  }
  .oe-hdr-stat-lbl {
    font-size: 0.6875rem;
    color: var(--p-surface-400);
    white-space: nowrap;
  }
  .oe-hdr-stat-sep {
    width: 1px;
    height: 2rem;
    background: var(--p-gray-100);
  }

  /* ── Verlopen banner ─────────────────────────────────────────── */
  .verlopen-banner {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.75rem 1rem;
    margin: 0.875rem 1.25rem 0;
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
  /* ── Pills ───────────────────────────────────────────────────────────────── */
  .oe-pill {
    font-size: 0.6875rem;
    font-weight: 600;
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    border: 1px solid;
    line-height: 1.5;
    width: fit-content;
  }
  .oe-pill--active {
    background: #dcfce7;
    color: #166534;
    border-color: #bbf7d0;
  }
  .oe-pill--expired {
    background: var(--p-gray-100);
    color: var(--p-gray-500);
    border-color: var(--p-gray-200);
  }
  .oe-pill--planned {
    background: var(--p-warn-100);
    color: var(--p-warn-500);
    border-color: var(--p-warn-200);
  }

  /* ── Tabs ────────────────────────────────────────────────────── */
  .oe-tabs {
    display: flex;
    border-bottom: 1px solid var(--p-gray-200);
    background: white;
    flex-shrink: 0;
    padding-top: 0.5rem;
  }
  .oe-tab {
    display: flex;
    align-items: center;
    gap: 0.575rem;
    padding: 0.4375rem 1rem 0.4375rem 1.125rem;
    text-align: left;
    background: none;
    border: none;
    border-left: 2px solid transparent;
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--p-surface-600);
    transition:
      background 0.1s,
      color 0.1s;
    border-bottom: 2px solid transparent;
  }
  .oe-tab .pi {
    font-size: 0.875rem;
  }
  .oe-tab:not(.se-tab--active):hover {
    background: var(--p-gray-50);
    color: var(--p-surface-800);
  }
  .oe-tab--active {
    color: var(--p-surface-800);
    font-weight: 500;
    border-bottom-color: var(--p-primary-500);
    background: var(--p-primary-50);
  }

  /* ── Tab 2: Groepen layout ───────────────────────────────────── */
  .oe-groepen-tab {
    display: flex;
    gap: 1.25rem;
    flex: 1;
    min-height: 0;
    padding: 1.5rem;
    background: var(--p-surface-50);
    overflow: clip;
  }
  .oe-groups-card {
    flex: 0 0 40%;
    display: flex;
    flex-direction: column;
    overflow: clip;
  }
  .oe-products-card {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: clip;
  }

  /* ── Pending sites (details edit mode) ───────────────────────── */
  .pending-sites {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .pending-label {
    font-size: 0.75rem;
    color: var(--p-gray-400);
    white-space: nowrap;
    padding-top: 0.2rem;
  }
  .pending-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }
  .pending-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.175rem 0.5rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 500;
    border: 1px solid transparent;
  }
  .pending-chip--remove {
    background: var(--p-red-50);
    color: var(--p-red-600);
    border-color: var(--p-red-200);
  }
  .pending-chip--add {
    background: var(--p-green-50);
    color: var(--p-green-700);
    border-color: var(--p-green-200);
  }

  /* ── site-tag (view mode websites) ───────────────────────────── */
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

  /* ── Context menu ────────────────────────────────────────────── */
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

  /* ── Transitions ─────────────────────────────────────────────── */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.15s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
