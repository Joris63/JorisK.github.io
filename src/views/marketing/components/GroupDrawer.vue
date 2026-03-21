<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import type { TreeNode } from 'primevue/treenode';
  import GroupFeatureCards from './group/GroupFeatureCards.vue';
  import type { Feature } from './group/groupFeatures';

  const props = defineProps<{
    isEdit: boolean;
    editGroupId: number | null;
    parentGroupId: number | null;
    initialName: string;
    siteLabels: string[];
    parentGroupOptions: TreeNode[];
    editingRootGroup: boolean;
  }>();

  type SavePayload = {
    isEdit: boolean;
    editGroupId: number | null;
    parentGroupId: number | null;
    name: string;
  };

  const emit = defineEmits<{ save: [data: SavePayload] }>();

  const visible = defineModel<boolean>('visible', { required: true });

  // ── Active features ────────────────────────────────────────────────────
  const activeFeatures = ref<Feature[]>([]);

  function addFeature(key: Feature) {
    activeFeatures.value.push(key);
  }

  function removeFeature(key: Feature) {
    activeFeatures.value = activeFeatures.value.filter((f) => f !== key);
    if (key === 'label') {
      form.value.labelColorOverride = false;
      form.value.labelColorHex = '#000000';
      form.value.labelTexts = {};
      form.value.labelTextsOpen = false;
    }
    if (key === 'actietimer') {
      form.value.actietimerDagen = 3;
    }
    if (key === 'prijsmodificatie') {
      form.value.prijsBedrag = '';
      form.value.prijsModType = 'percentage';
      form.value.prijsVergelijking = 'van-voor';
    }
    if (key === 'pretekst') {
      form.value.preTexts = {};
      form.value.preTextsOpen = false;
    }
  }

  // ── Form data ─────────────────────────────────────────────────────────
  const form = ref({
    name: '',
    parentGroupId: null as number | null,
    labelColorOverride: false,
    labelColorHex: '#000000',
    labelTextsOpen: false,
    labelTexts: {} as Record<string, string>,
    preTextsOpen: false,
    preTexts: {} as Record<string, string>,
    actietimerDagen: 3,
    prijsBedrag: '',
    prijsModType: 'percentage' as 'percentage' | 'bedrag',
    prijsVergelijking: 'van-voor' as 'van-voor' | 'advies',
  });

  watch(visible, (val) => {
    if (val) {
      activeFeatures.value = [];
      form.value = {
        name: props.initialName,
        parentGroupId: props.parentGroupId,
        labelColorOverride: false,
        labelColorHex: '#000000',
        labelTextsOpen: false,
        labelTexts: {},
        preTextsOpen: false,
        preTexts: {},
        actietimerDagen: 3,
        prijsBedrag: '',
        prijsModType: 'percentage',
        prijsVergelijking: 'van-voor',
      };
    }
  });

  function save() {
    if (!form.value.name.trim()) return;
    emit('save', {
      isEdit: props.isEdit,
      editGroupId: props.editGroupId,
      parentGroupId: form.value.parentGroupId,
      name: form.value.name.trim(),
    });
    visible.value = false;
  }

  // TreeSelect bridge
  const parentGroupKey = computed({
    get: () =>
      form.value.parentGroupId !== null ? { [String(form.value.parentGroupId)]: true } : null,
    set: (keys: Record<string, boolean> | null) => {
      const key = keys ? Object.keys(keys)[0] : null;
      form.value.parentGroupId = key != null ? Number(key) : null;
    },
  });

  // Header subtitle
  function findNodeLabel(nodes: TreeNode[], id: number): string | null {
    for (const node of nodes) {
      if (Number(node.key) === id) return (node.label as string) ?? null;
      if (node.children) {
        const f = findNodeLabel(node.children, id);
        if (f) return f;
      }
    }
    return null;
  }

  const headerSubtitle = computed<string | null>(() => {
    if (props.isEdit) return props.initialName || null;
    if (form.value.parentGroupId !== null)
      return findNodeLabel(props.parentGroupOptions, form.value.parentGroupId);
    return null;
  });
</script>

<template>
  <Drawer
    v-model:visible="visible"
    position="right"
    class="w-[34rem]!"
    :pt="{ content: { class: 'flex flex-col gap-0 p-0! overflow-hidden' } }"
  >
    <template #header>
      <div>
        <span class="font-semibold text-surface-800 text-2xl">
          {{ isEdit ? 'Groep bewerken' : 'Nieuwe groep aanmaken' }}
        </span>
        <Transition name="fade">
          <p v-if="headerSubtitle" class="drw-subtitle">
            {{ isEdit ? '' : 'in ' }}<span class="drw-group-chip">{{ headerSubtitle }}</span>
          </p>
        </Transition>
      </div>
    </template>

    <div class="flex flex-col overflow-y-auto flex-1">
      <!-- ── Naam & Structuur ──────────────────────────────────── -->
      <div class="drw-section">
        <p class="drw-section-hdr">Naam &amp; Structuur</p>

        <div v-if="!editingRootGroup" class="drw-field">
          <label class="drw-label">Valt onder</label>
          <TreeSelect
            v-model="parentGroupKey"
            :options="parentGroupOptions"
            selection-mode="single"
            class="w-full"
            placeholder="Selecteer een groep"
          />
        </div>

        <div class="drw-field">
          <label class="drw-label">Naam <span class="drw-req">*</span></label>
          <InputText v-model="form.name" class="w-full" placeholder="Voer een naam in" autofocus />
        </div>
      </div>

      <div class="drw-sep" />

      <!-- ── Opties ─────────────────────────────────────────────── -->
      <div class="drw-section">
        <p class="drw-section-hdr drw-section-hdr--tight">Opties</p>

        <GroupFeatureCards
          :active-features="activeFeatures"
          :site-labels="siteLabels"
          :label-color-override="form.labelColorOverride"
          :label-color-hex="form.labelColorHex"
          :label-texts-open="form.labelTextsOpen"
          :label-texts="form.labelTexts"
          :pre-texts-open="form.preTextsOpen"
          :pre-texts="form.preTexts"
          :actietimer-dagen="form.actietimerDagen"
          :prijs-bedrag="form.prijsBedrag"
          :prijs-mod-type="form.prijsModType"
          :prijs-vergelijking="form.prijsVergelijking"
          @remove-feature="removeFeature"
          @add-feature="addFeature"
          @update:label-color-override="form.labelColorOverride = $event"
          @update:label-color-hex="form.labelColorHex = $event"
          @update:label-texts-open="form.labelTextsOpen = $event"
          @update:label-texts="form.labelTexts = $event"
          @update:pre-texts-open="form.preTextsOpen = $event"
          @update:pre-texts="form.preTexts = $event"
          @update:actietimer-dagen="form.actietimerDagen = $event"
          @update:prijs-bedrag="form.prijsBedrag = $event"
          @update:prijs-mod-type="form.prijsModType = $event"
          @update:prijs-vergelijking="form.prijsVergelijking = $event"
        />
      </div>
    </div>

    <div class="drawer-footer">
      <Button label="Annuleren" severity="secondary" outlined @click="visible = false" />
      <Button
        :label="isEdit ? 'Opslaan' : 'Toevoegen'"
        :disabled="!form.name.trim()"
        @click="save"
      />
    </div>
  </Drawer>
</template>

<style scoped>
@reference "@/assets/style.css";
  .drw-section-hdr--tight {
    @apply -mb-3;
  }

  .fade-enter-active {
    transition: opacity var(--sw-duration-base) var(--sw-ease);
  }
  .fade-leave-active {
    transition: opacity var(--sw-duration-fast) var(--sw-ease);
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
