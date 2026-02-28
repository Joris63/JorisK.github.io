<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps<{
  actieNaam:       string;
  actieWebsites:   string[];
  actieStartdatum: Date | null;
  actieEinddatum:  Date | null;
}>();

type DuplicatePayload = {
  naam:            string;
  omschrijving:    string;
  websites:        string[];
  startdatum:      Date;
  einddatum:       Date;
  includeProducts: boolean;
};

const emit = defineEmits<{ duplicate: [data: DuplicatePayload] }>();

const visible = defineModel<boolean>('visible', { required: true });

// ── Form ──────────────────────────────────────────────────────────────
const form = ref({
  naam:            '',
  omschrijving:    '',
  websites:        [] as string[],
  startdatum:      null as Date | null,
  einddatum:       null as Date | null,
  includeProducts: false,
});

// Only show the websites that are already on this actie
const websiteOptions = computed(() =>
  props.actieWebsites.map(w => ({ label: w, value: w })),
);

watch(visible, (val) => {
  if (val) {
    form.value = {
      naam:            `${props.actieNaam} [KOPIE]`,
      omschrijving:    '',
      websites:        [...props.actieWebsites],
      startdatum:      null,
      einddatum:       null,
      includeProducts: false,
    };
  }
});

// ── Validation & submit ────────────────────────────────────────────────
const isValid = computed(() =>
  form.value.naam.trim().length > 0 &&
  form.value.websites.length > 0 &&
  form.value.startdatum !== null &&
  form.value.einddatum !== null,
);

function submit() {
  if (!isValid.value) return;
  emit('duplicate', {
    naam:            form.value.naam.trim(),
    omschrijving:    form.value.omschrijving.trim(),
    websites:        form.value.websites,
    startdatum:      form.value.startdatum!,
    einddatum:       form.value.einddatum!,
    includeProducts: form.value.includeProducts,
  });
  visible.value = false;
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="true"
    :draggable="false"
    :style="{ width: '34rem' }"
    :pt="{
      root:   { class: 'overflow-hidden' },
      header: { class: 'dlg-hdr-wrap' },
      content: { class: 'p-0' },
      footer:  { class: 'dlg-footer' },
    }"
  >
    <!-- ── Header ─────────────────────────────────────────────────── -->
    <template #header>
      <div class="dlg-hdr">
        <span class="dlg-hdr__title">Actie dupliceren</span>
        <div class="dlg-hdr__src">
          <i class="pi pi-copy dlg-hdr__icon" />
          <span class="dlg-src-chip">{{ actieNaam }}</span>
        </div>
      </div>
    </template>

    <!-- ── Body ───────────────────────────────────────────────────── -->
    <div class="dlg-body">

      <!-- Website(s) -->
      <div class="drw-field">
        <label class="drw-label">Website(s) <span class="drw-req">*</span></label>
        <MultiSelect
          v-model="form.websites"
          :options="websiteOptions"
          option-label="label"
          option-value="value"
          class="w-full"
          placeholder="Selecteer website(s)"
          display="chip"
        />
        <p class="drw-hint">Alleen websites die bij deze actie zijn geassocieerd.</p>
      </div>

      <!-- Naam -->
      <div class="drw-field">
        <label class="drw-label">Naam <span class="drw-req">*</span></label>
        <InputText v-model="form.naam" class="w-full" placeholder="Voer een naam in" />
      </div>

      <!-- Looptijd -->
      <div class="drw-field">
        <label class="drw-label">Looptijd <span class="drw-req">*</span></label>
        <div class="flex items-center gap-2">
          <DatePicker v-model="form.startdatum" date-format="dd-mm-yy" show-icon icon-display="input" class="flex-1" placeholder="Startdatum" />
          <span class="date-sep">→</span>
          <DatePicker v-model="form.einddatum" date-format="dd-mm-yy" show-icon icon-display="input" class="flex-1" placeholder="Einddatum" />
        </div>
      </div>

      <!-- Omschrijving -->
      <div class="drw-field">
        <label class="drw-label">Omschrijving</label>
        <Textarea v-model="form.omschrijving" class="w-full" :rows="3" placeholder="Optionele omschrijving" auto-resize />
      </div>

      <!-- Producten meenemen -->
      <div class="drw-field">
        <div class="drw-row">
          <div>
            <label class="drw-label">Producten meenemen</label>
            <p class="drw-hint">Kopieert alle producten en groepen van de bron-actie. Dit kan even duren.</p>
          </div>
          <ToggleSwitch v-model="form.includeProducts" />
        </div>
      </div>

    </div>

    <!-- ── Footer ─────────────────────────────────────────────────── -->
    <template #footer>
      <Button label="Annuleren" severity="secondary" outlined @click="visible = false" />
      <Button label="Dupliceren" icon="pi pi-copy" :disabled="!isValid" @click="submit" />
    </template>
  </Dialog>
</template>

<style scoped>
/* ── Header ────────────────────────────────────────────────────────── */
:deep(.dlg-hdr-wrap) { padding-bottom: 0.875rem; }

.dlg-hdr        { display: flex; flex-direction: column; gap: 0.2rem; }
.dlg-hdr__title { font-size: 1rem; font-weight: 600; color: var(--p-surface-800); }
.dlg-hdr__src   { display: flex; align-items: center; gap: 0.35rem; }
.dlg-hdr__icon  { font-size: 0.7rem; color: var(--p-gray-400); }
.dlg-src-chip {
  display: inline-block; padding: 0.05rem 0.4rem;
  background: var(--p-primary-50); color: var(--p-primary-700);
  border-radius: 0.25rem; font-size: 0.75rem; font-weight: 500;
}

/* ── Body ──────────────────────────────────────────────────────────── */
.dlg-body { display: flex; flex-direction: column; gap: 1.25rem; padding: 0 1.5rem 1.25rem; }

.drw-field { display: flex; flex-direction: column; gap: 0.375rem; }
.drw-label { font-size: 0.875rem; font-weight: 500; color: var(--p-surface-700); }
.drw-req   { color: var(--p-red-500); }
.drw-hint  { font-size: 0.75rem; color: var(--p-gray-400); line-height: 1.4; }
.drw-row   { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }

.date-sep  { font-size: 0.875rem; color: var(--p-gray-300); flex-shrink: 0; }

/* ── Footer ────────────────────────────────────────────────────────── */
:deep(.dlg-footer) {
  display: flex; justify-content: flex-end; gap: 0.5rem;
  padding: 0.875rem 1.5rem; border-top: 1px solid var(--p-gray-100);
}
</style>
