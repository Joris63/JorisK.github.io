<script setup lang="ts">
  import { ref, watch } from 'vue';

  interface WebsiteOption {
    label: string;
    value: string;
  }
  interface PendingSiteChange {
    site: string;
    action: 'add' | 'remove';
  }

  const props = defineProps<{
    naam: string;
    websites: string[];
    startdatum: Date | null;
    einddatum: Date | null;
    omschrijving: string;
    websiteOptions: WebsiteOption[];
    isVerlopen: boolean;
    pendingSites: PendingSiteChange[];
  }>();

  type SavePayload = {
    naam: string;
    websites: string[];
    startdatum: Date | null;
    einddatum: Date | null;
    omschrijving: string;
  };

  const emit = defineEmits<{ save: [data: SavePayload] }>();

  const visible = defineModel<boolean>('visible', { required: true });

  const form = ref<SavePayload>({
    naam: '',
    websites: [],
    startdatum: null,
    einddatum: null,
    omschrijving: '',
  });

  watch(visible, (val) => {
    if (val) {
      form.value = {
        naam: props.naam,
        websites: [...props.websites],
        startdatum: props.startdatum,
        einddatum: props.einddatum,
        omschrijving: props.omschrijving,
      };
    }
  });

  function save() {
    emit('save', { ...form.value });
    visible.value = false;
  }
</script>

<template>
  <Drawer
    v-model:visible="visible"
    position="right"
    :style="{ width: '30rem' }"
    :pt="{ content: { class: 'flex flex-col gap-0 p-0! overflow-hidden' } }"
  >
    <template #header>
      <span class="font-semibold text-surface-800">Actie details</span>
    </template>

    <div class="flex flex-col gap-5 overflow-y-auto px-5 py-4 flex-1">
      <div class="drw-field">
        <label class="drw-label">Naam <span class="drw-req">*</span></label>
        <InputText
          v-model="form.naam"
          class="w-full"
          :disabled="isVerlopen"
          placeholder="Bijv. 2026 Q1: Black Friday BE"
        />
      </div>

      <div class="drw-field">
        <label class="drw-label">Website(s) <span class="drw-req">*</span></label>
        <MultiSelect
          v-model="form.websites"
          :options="websiteOptions"
          option-label="label"
          option-value="value"
          class="w-full"
          placeholder="Selecteer website(s)"
          :disabled="isVerlopen"
          display="chip"
        />
        <div v-if="pendingSites.length" class="drw-pending-sites">
          <span class="drw-pending-label">Vannacht:</span>
          <div class="drw-pending-chips">
            <span
              v-for="s in pendingSites"
              :key="s.site + s.action"
              class="drw-pending-chip"
              :class="`drw-pending-chip--${s.action}`"
            >
              <i :class="`pi ${s.action === 'add' ? 'pi-plus' : 'pi-minus'} text-xs`" />
              {{ s.site }}
            </span>
          </div>
        </div>
      </div>

      <div class="drw-field">
        <label class="drw-label">Looptijd <span class="drw-req">*</span></label>
        <div class="flex items-center gap-2">
          <DatePicker
            v-model="form.startdatum"
            date-format="dd-mm-yy"
            show-icon
            icon-display="input"
            class="flex-1"
            :disabled="isVerlopen"
            placeholder="Startdatum"
          />
          <span class="text-gray-300 text-sm shrink-0">→</span>
          <DatePicker
            v-model="form.einddatum"
            date-format="dd-mm-yy"
            show-icon
            icon-display="input"
            class="flex-1"
            :disabled="isVerlopen"
            placeholder="Einddatum"
          />
        </div>
      </div>

      <div class="drw-field">
        <label class="drw-label">Omschrijving</label>
        <Textarea
          v-model="form.omschrijving"
          class="w-full"
          :rows="4"
          placeholder="Optionele omschrijving"
          :disabled="isVerlopen"
          auto-resize
        />
      </div>
    </div>

    <div class="drawer-footer">
      <Button label="Annuleren" severity="secondary" outlined @click="visible = false" />
      <Button label="Opslaan" :disabled="isVerlopen" @click="save" />
    </div>
  </Drawer>
</template>

<style scoped>
  .drw-field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }
  .drw-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--p-surface-700);
  }
  .drw-req {
    color: var(--p-red-500);
  }

  .drawer-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 0.875rem 1.25rem;
    border-top: 1px solid var(--p-gray-100);
    background: white;
    flex-shrink: 0;
  }

  .drw-pending-sites {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .drw-pending-label {
    font-size: 0.75rem;
    color: var(--p-gray-400);
    white-space: nowrap;
    padding-top: 0.2rem;
  }
  .drw-pending-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }
  .drw-pending-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.175rem 0.5rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 500;
    border: 1px solid transparent;
  }
  .drw-pending-chip--remove {
    background: var(--p-red-50);
    color: var(--p-red-600);
    border-color: var(--p-red-200);
  }
  .drw-pending-chip--add {
    background: var(--p-green-50);
    color: var(--p-green-700);
    border-color: var(--p-green-200);
  }
</style>
