<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import type { TreeNode } from 'primevue/treenode';

  const props = defineProps<{
    isEdit:             boolean;
    editGroupId:        number | null;
    parentGroupId:      number | null;
    initialNaam:        string;
    siteLabels:         string[];
    parentGroupOptions: TreeNode[];
    editingRootGroup:   boolean;
  }>();

  type SavePayload = {
    isEdit:        boolean;
    editGroupId:   number | null;
    parentGroupId: number | null;
    naam:          string;
  };

  const emit = defineEmits<{ save: [data: SavePayload] }>();

  const visible = defineModel<boolean>('visible', { required: true });

  // ── Addable features ──────────────────────────────────────────────────
  type Feature = 'label' | 'actietimer' | 'prijsmodificatie' | 'prijskleur' | 'pretekst';

  const ALL_FEATURES: { key: Feature; label: string; icon: string }[] = [
    { key: 'label',            label: 'Label',                icon: 'pi pi-tag'        },
    { key: 'actietimer',       label: 'Actietimer',           icon: 'pi pi-clock'      },
    { key: 'prijsmodificatie', label: 'Prijsmodificatie',     icon: 'pi pi-percentage' },
    { key: 'prijskleur',       label: 'Prijskleurmodificatie', icon: 'pi pi-palette'   },
    { key: 'pretekst',         label: 'Pre-tekst per site',   icon: 'pi pi-align-left' },
  ];

  const activeFeatures = ref<Feature[]>([]);

  function addFeature(key: Feature)    { activeFeatures.value.push(key); }
  function hasFeature(key: Feature)    { return activeFeatures.value.includes(key); }
  function removeFeature(key: Feature) {
    activeFeatures.value = activeFeatures.value.filter(f => f !== key);
    // Reset associated data
    if (key === 'label')            { form.value.labelColorOverride = false; form.value.labelColorHex = '#000000'; form.value.labelTexts = {}; form.value.labelTextsOpen = false; }
    if (key === 'actietimer')       { form.value.actietimerDagen = 3; }
    if (key === 'prijsmodificatie') { form.value.prijsBedrag = ''; form.value.prijsModType = 'percentage'; form.value.prijsVergelijking = 'van-voor'; }
    if (key === 'pretekst')         { form.value.preTexts = {}; form.value.preTextsOpen = false; }
  }

  const availableFeatures = computed(() =>
    ALL_FEATURES.filter(f => !activeFeatures.value.includes(f.key)),
  );

  // ── Form data ─────────────────────────────────────────────────────────
  const form = ref({
    naam:              '',
    parentGroupId:     null as number | null,
    labelColorOverride: false,
    labelColorHex:     '#000000',
    labelTextsOpen:    false,
    labelTexts:        {} as Record<string, string>,
    preTextsOpen:      false,
    preTexts:          {} as Record<string, string>,
    actietimerDagen:   3,
    prijsBedrag:       '',
    prijsModType:      'percentage' as 'percentage' | 'bedrag',
    prijsVergelijking: 'van-voor' as 'van-voor' | 'advies',
  });

  watch(visible, (val) => {
    if (val) {
      activeFeatures.value = [];
      form.value = {
        naam:              props.initialNaam,
        parentGroupId:     props.parentGroupId,
        labelColorOverride: false,
        labelColorHex:     '#000000',
        labelTextsOpen:    false,
        labelTexts:        {},
        preTextsOpen:      false,
        preTexts:          {},
        actietimerDagen:   3,
        prijsBedrag:       '',
        prijsModType:      'percentage',
        prijsVergelijking: 'van-voor',
      };
    }
  });

  function save() {
    if (!form.value.naam.trim()) return;
    emit('save', {
      isEdit:        props.isEdit,
      editGroupId:   props.editGroupId,
      parentGroupId: form.value.parentGroupId,
      naam:          form.value.naam.trim(),
    });
    visible.value = false;
  }

  // ColorPicker uses hex without '#'
  const labelColor = computed({
    get: () => form.value.labelColorHex.replace('#', ''),
    set: (v: string) => { form.value.labelColorHex = `#${v}`; },
  });

  // TreeSelect bridge
  const parentGroupKey = computed({
    get: () => form.value.parentGroupId !== null ? { [String(form.value.parentGroupId)]: true } : null,
    set: (keys: Record<string, boolean> | null) => {
      const key = keys ? Object.keys(keys)[0] : null;
      form.value.parentGroupId = key != null ? Number(key) : null;
    },
  });

  // Header subtitle
  function findNodeLabel(nodes: TreeNode[], id: number): string | null {
    for (const node of nodes) {
      if (Number(node.key) === id) return (node.label as string) ?? null;
      if (node.children) { const f = findNodeLabel(node.children, id); if (f) return f; }
    }
    return null;
  }

  const headerSubtitle = computed<string | null>(() => {
    if (props.isEdit) return props.initialNaam || null;
    if (form.value.parentGroupId !== null) return findNodeLabel(props.parentGroupOptions, form.value.parentGroupId);
    return null;
  });
</script>

<template>
  <Drawer
    v-model:visible="visible"
    position="right"
    :style="{ width: '34rem' }"
    :pt="{ content: { class: 'flex flex-col gap-0 p-0! overflow-hidden' } }"
  >
    <template #header>
      <div>
        <span class="font-semibold text-surface-800">
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
          <TreeSelect v-model="parentGroupKey" :options="parentGroupOptions" selection-mode="single" class="w-full" placeholder="Selecteer een groep" />
        </div>

        <div class="drw-field">
          <label class="drw-label">Naam <span class="drw-req">*</span></label>
          <InputText v-model="form.naam" class="w-full" placeholder="Voer een naam in" autofocus />
        </div>
      </div>

      <div class="drw-sep" />

      <!-- ── Opties ─────────────────────────────────────────────── -->
      <div class="drw-section">
        <p class="drw-section-hdr drw-section-hdr--tight">Opties</p>

        <!-- Active feature cards -->
        <TransitionGroup name="feature" tag="div" class="flex flex-col gap-2">

          <!-- Label -->
          <div v-if="hasFeature('label')" key="label" class="opt-card">
            <div class="opt-card__hdr">
              <div class="opt-card__title"><i class="pi pi-tag" /> Label</div>
              <button class="opt-remove" @click="removeFeature('label')"><i class="pi pi-times" /></button>
            </div>
            <div class="opt-card__body">
              <div class="drw-field">
                <div class="drw-row">
                  <div>
                    <label class="drw-label">Kleur aanpassen</label>
                    <p class="drw-hint">Overschrijf de standaard labelkleur</p>
                  </div>
                  <ToggleSwitch v-model="form.labelColorOverride" />
                </div>
                <Transition name="collapse">
                  <div v-if="form.labelColorOverride" class="drw-inset flex items-center gap-3">
                    <ColorPicker v-model="labelColor" format="hex" />
                    <InputText v-model="form.labelColorHex" class="flex-1" size="small" placeholder="#000000" />
                  </div>
                </Transition>
              </div>
              <div class="drw-field">
                <button class="drw-collapsible" @click="form.labelTextsOpen = !form.labelTextsOpen">
                  <span class="drw-label">Tekst per site</span>
                  <i :class="`pi ${form.labelTextsOpen ? 'pi-chevron-up' : 'pi-chevron-down'}`" class="drw-chevron" />
                </button>
                <Transition name="collapse">
                  <div v-if="form.labelTextsOpen" class="drw-collapsible-body">
                    <template v-if="siteLabels.length">
                      <div v-for="site in siteLabels" :key="site" class="drw-field">
                        <label class="drw-label"><span class="drw-site">{{ site }}</span></label>
                        <InputText v-model="form.labelTexts[site]" class="w-full" placeholder="Bijv. Actie, Sale, …" />
                      </div>
                    </template>
                    <p v-else class="drw-hint">Selecteer eerst websites in de actie details.</p>
                  </div>
                </Transition>
              </div>
            </div>
          </div>

          <!-- Actietimer -->
          <div v-if="hasFeature('actietimer')" key="actietimer" class="opt-card">
            <div class="opt-card__hdr">
              <div class="opt-card__title"><i class="pi pi-clock" /> Actietimer</div>
              <button class="opt-remove" @click="removeFeature('actietimer')"><i class="pi pi-times" /></button>
            </div>
            <div class="opt-card__body">
              <div class="flex items-center gap-3">
                <span class="drw-hint flex-1">Afteltimer start X dagen voor de einddatum</span>
                <InputNumber v-model="form.actietimerDagen" :min="1" :max="365" style="width: 5rem; flex-shrink: 0" :input-style="{ width: '100%' }" />
              </div>
            </div>
          </div>

          <!-- Prijsmodificatie -->
          <div v-if="hasFeature('prijsmodificatie')" key="prijsmodificatie" class="opt-card">
            <div class="opt-card__hdr">
              <div class="opt-card__title"><i class="pi pi-percentage" /> Prijsmodificatie</div>
              <button class="opt-remove" @click="removeFeature('prijsmodificatie')"><i class="pi pi-times" /></button>
            </div>
            <div class="opt-card__body">
              <div class="flex items-center gap-2">
                <InputText v-model="form.prijsBedrag" class="flex-1" placeholder="0" />
                <Select
                  v-model="form.prijsModType"
                  :options="[{ label: 'Percentage %', value: 'percentage' }, { label: 'Bedrag €', value: 'bedrag' }]"
                  option-label="label" option-value="value" style="width: 9.5rem"
                />
              </div>
              <SelectButton
                v-model="form.prijsVergelijking"
                :options="[{ label: 'Van-voor prijs', value: 'van-voor' }, { label: 'Adviesprijs', value: 'advies' }]"
                option-label="label" option-value="value"
              />
            </div>
          </div>

          <!-- Prijskleurmodificatie -->
          <div v-if="hasFeature('prijskleur')" key="prijskleur" class="opt-card">
            <div class="opt-card__hdr">
              <div class="opt-card__title"><i class="pi pi-palette" /> Prijskleurmodificatie</div>
              <button class="opt-remove" @click="removeFeature('prijskleur')"><i class="pi pi-times" /></button>
            </div>
            <div class="opt-card__body">
              <p class="drw-hint">Prijzen worden getoond in de kleur van de actie.</p>
            </div>
          </div>

          <!-- Pre-tekst -->
          <div v-if="hasFeature('pretekst')" key="pretekst" class="opt-card">
            <div class="opt-card__hdr">
              <div class="opt-card__title"><i class="pi pi-align-left" /> Pre-tekst per site</div>
              <button class="opt-remove" @click="removeFeature('pretekst')"><i class="pi pi-times" /></button>
            </div>
            <div class="opt-card__body">
              <template v-if="siteLabels.length">
                <div v-for="site in siteLabels" :key="site" class="drw-field">
                  <label class="drw-label drw-site">{{ site }}</label>
                  <Textarea v-model="form.preTexts[site]" class="w-full" :rows="3" placeholder="Tekst bij de productbeschrijving…" />
                </div>
              </template>
              <p v-else class="drw-hint">Selecteer eerst websites in de actie details.</p>
            </div>
          </div>

        </TransitionGroup>

        <!-- Add list -->
        <div v-if="availableFeatures.length" class="opt-add-list" :class="{ 'opt-add-list--mt': activeFeatures.length }">
          <button
            v-for="f in availableFeatures" :key="f.key"
            class="opt-add-btn"
            @click="addFeature(f.key)"
          >
            <i class="pi pi-plus opt-add-btn__icon" />
            <span>{{ f.label }}</span>
          </button>
        </div>

      </div>

    </div>

    <div class="drawer-footer">
      <Button label="Annuleren" severity="secondary" outlined @click="visible = false" />
      <Button :label="isEdit ? 'Opslaan' : 'Toevoegen'" :disabled="!form.naam.trim()" @click="save" />
    </div>
  </Drawer>
</template>

<style scoped>
  .drw-section     { display: flex; flex-direction: column; gap: 1rem; padding: 1.25rem 1.5rem; }
  .drw-section-hdr          { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--p-gray-400); }
  .drw-section-hdr--tight   { margin-bottom: -0.75rem; }
  .drw-sep         { height: 1px; background: var(--p-gray-100); flex-shrink: 0; }
  .drw-field       { display: flex; flex-direction: column; gap: 0.375rem; }
  .drw-label       { font-size: 0.875rem; font-weight: 500; color: var(--p-surface-700); }
  .drw-req         { color: var(--p-red-500); }
  .drw-hint        { font-size: 0.75rem; color: var(--p-gray-400); line-height: 1.4; }
  .drw-row         { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
  .drw-site        { font-size: 0.8125rem; font-weight: 500; color: var(--p-gray-500); }
  .drw-inset       { margin-top: 0.5rem; padding: 0.75rem 1rem; background: var(--p-gray-50); border-radius: 0.5rem; border: 1px solid var(--p-gray-100); }
  .drw-subtitle    { font-size: 0.75rem; color: var(--p-gray-400); margin-top: 0.125rem; }
  .drw-group-chip  {
    display: inline-block; padding: 0.05rem 0.4rem;
    background: var(--p-primary-50); color: var(--p-primary-700);
    border-radius: 0.25rem; font-weight: 500;
  }

  .drw-collapsible {
    display: flex; align-items: center; justify-content: space-between; width: 100%;
    background: none; border: none; cursor: pointer; padding: 0; text-align: left;
  }
  .drw-collapsible:hover .drw-label   { color: var(--p-primary-600); }
  .drw-collapsible:hover .drw-chevron { color: var(--p-primary-400); }
  .drw-chevron         { font-size: 0.6875rem; color: var(--p-gray-400); transition: color 0.1s; }
  .drw-collapsible-body { display: flex; flex-direction: column; gap: 0.875rem; margin-top: 0.75rem; }

  /* Feature cards */
  .opt-card {
    border: 1.5px solid var(--p-gray-200); border-radius: 0.625rem; overflow: hidden;
  }
  .opt-card__hdr {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.5rem 0.75rem;
    background: var(--p-gray-50); border-bottom: 1px solid var(--p-gray-100);
  }
  .opt-card__title {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-700);
  }
  .opt-card__title .pi { font-size: 0.8rem; color: var(--p-gray-400); }
  .opt-card__body { padding: 0.875rem 1rem; display: flex; flex-direction: column; gap: 0.875rem; }
  .opt-remove {
    display: flex; align-items: center; justify-content: center;
    width: 1.375rem; height: 1.375rem; border-radius: 0.25rem; flex-shrink: 0;
    background: none; border: none; cursor: pointer; color: var(--p-gray-400); font-size: 0.7rem;
    transition: background 0.1s, color 0.1s;
  }
  .opt-remove:hover { background: var(--p-red-50); color: var(--p-red-500); }

  /* Add list */
  .opt-add-list        { display: flex; flex-direction: column; }
  .opt-add-list--mt    { margin-top: 0.25rem; padding-top: 0.75rem; border-top: 1px solid var(--p-gray-100); }
  .opt-add-btn {
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0.4rem 0.5rem; border: none; background: none; cursor: pointer;
    font-size: 0.875rem; color: var(--p-gray-500); border-radius: 0.375rem;
    text-align: left; transition: background 0.1s, color 0.1s;
  }
  .opt-add-btn:hover { background: var(--p-primary-50); color: var(--p-primary-600); }
  .opt-add-btn:hover .opt-add-btn__icon { color: var(--p-primary-500); }
  .opt-add-btn__icon { font-size: 0.7rem; color: var(--p-gray-400); transition: color 0.1s; }

  .drawer-footer {
    display: flex; justify-content: flex-end; gap: 0.5rem; padding: 0.875rem 1.25rem;
    border-top: 1px solid var(--p-gray-100); background: white; flex-shrink: 0;
  }

  .collapse-enter-active { transition: opacity 0.18s ease, transform 0.18s ease; }
  .collapse-leave-active { transition: opacity 0.12s ease, transform 0.12s ease; }
  .collapse-enter-from,
  .collapse-leave-to     { opacity: 0; transform: translateY(-0.25rem); }

  .feature-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
  .feature-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
  .feature-enter-from,
  .feature-leave-to     { opacity: 0; transform: translateY(-0.5rem); }

  .fade-enter-active { transition: opacity 0.15s ease; }
  .fade-leave-active { transition: opacity 0.1s ease; }
  .fade-enter-from,
  .fade-leave-to     { opacity: 0; }
</style>
