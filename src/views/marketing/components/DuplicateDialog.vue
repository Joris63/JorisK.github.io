<script setup lang="ts">
  import { ref, computed, watch } from 'vue';

  const props = defineProps<{
    actieNaam: string;
    actieWebsites: string[];
    actieStartdatum: Date | null;
    actieEinddatum: Date | null;
  }>();

  type DuplicatePayload = {
    naam: string;
    omschrijving: string;
    websites: string[];
    startdatum: Date;
    einddatum: Date;
    includeProducts: boolean;
  };

  const emit = defineEmits<{ duplicate: [data: DuplicatePayload] }>();

  const visible = defineModel<boolean>('visible', { required: true });

  // ── Form ──────────────────────────────────────────────────────────────
  const form = ref({
    naam: '',
    omschrijving: '',
    websites: [] as string[],
    startdatum: null as Date | null,
    einddatum: null as Date | null,
    includeProducts: false,
  });

  // Only show the websites that are already on this actie
  const websiteOptions = computed(() => props.actieWebsites.map((w) => ({ label: w, value: w })));

  watch(visible, (val) => {
    if (val) {
      form.value = {
        naam: `${props.actieNaam} [KOPIE]`,
        omschrijving: '',
        websites: [...props.actieWebsites],
        startdatum: null,
        einddatum: null,
        includeProducts: false,
      };
    }
  });

  // ── Validation & submit ────────────────────────────────────────────────
  const isValid = computed(
    () =>
      form.value.naam.trim().length > 0 &&
      form.value.websites.length > 0 &&
      form.value.startdatum !== null &&
      form.value.einddatum !== null
  );

  function submit() {
    if (!isValid.value) return;
    emit('duplicate', {
      naam: form.value.naam.trim(),
      omschrijving: form.value.omschrijving.trim(),
      websites: form.value.websites,
      startdatum: form.value.startdatum!,
      einddatum: form.value.einddatum!,
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
      root: { class: 'overflow-hidden' },
      header: { class: 'dlg-hdr-wrap' },
      content: { class: 'p-0' },
      footer: { class: 'dlg-footer' },
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
          <DatePicker
            v-model="form.startdatum"
            date-format="dd-mm-yy"
            show-icon
            icon-display="input"
            class="flex-1"
            placeholder="Startdatum"
          />
          <span class="date-sep">→</span>
          <DatePicker
            v-model="form.einddatum"
            date-format="dd-mm-yy"
            show-icon
            icon-display="input"
            class="flex-1"
            placeholder="Einddatum"
          />
        </div>
      </div>

      <!-- Omschrijving -->
      <div class="drw-field">
        <label class="drw-label">Omschrijving</label>
        <Textarea
          v-model="form.omschrijving"
          class="w-full"
          :rows="3"
          placeholder="Optionele omschrijving"
          auto-resize
        />
      </div>

      <!-- Producten meenemen -->
      <div class="drw-field">
        <div class="drw-row">
          <div>
            <label class="drw-label">Producten meenemen</label>
            <p class="drw-hint">
              Kopieert alle producten en groepen van de bron-actie. Dit kan even duren.
            </p>
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
@reference "@/assets/style.css";
  /* ── Header ────────────────────────────────────────────────────────── */
  :deep(.dlg-hdr-wrap) {
    @apply pb-3.5;
  }

  .dlg-hdr {
    @apply flex flex-col gap-1;
  }
  .dlg-hdr__title {
    @apply text-base font-semibold text-(--sw-text);
  }
  .dlg-hdr__src {
    @apply flex items-center gap-1.5;
  }
  .dlg-hdr__icon {
    @apply text-(--sw-text-muted) text-xs;
  }
  .dlg-src-chip {
    @apply inline-block bg-primary-50 text-primary-700 rounded text-xs font-medium;
    padding: 0.05rem 0.4rem;
  }

  /* ── Body ──────────────────────────────────────────────────────────── */
  .dlg-body {
    @apply flex flex-col gap-5 px-6 pb-5;
  }

  .drw-field {
    @apply flex flex-col gap-1.5;
  }
  .drw-label {
    @apply text-base font-medium text-(--sw-text-strong);
  }
  .drw-req {
    @apply text-red-500;
  }
  .drw-hint {
    @apply text-xs text-(--sw-text-muted) leading-[1.4];
  }
  .drw-row {
    @apply flex items-center justify-between gap-4;
  }

  .date-sep {
    @apply text-base text-(--sw-text-faint) shrink-0;
  }

  /* ── Footer ────────────────────────────────────────────────────────── */
  :deep(.dlg-footer) {
    @apply flex justify-end border-t border-(--sw-border) gap-2 px-6 py-3.5;
  }
</style>
