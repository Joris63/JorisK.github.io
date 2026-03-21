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
    class="w-[30rem]!"
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
          <span class="text-(--sw-border-input) text-sm shrink-0">→</span>
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

