<script setup lang="ts">
  import { ref, computed, watch } from 'vue';

  export interface AddressForm {
    id: number | null;
    aanhef: string | null;
    voornaam: string;
    achternaam: string;
    telefoonLand: string;
    telefoon: string;
    terAttentieVan: string;
    land: string;
    postcode: string;
    huisnummer: string;
    toevoeging: string;
    straat: string;
    woonplaats: string;
  }

  const props = defineProps<{ address?: AddressForm | null }>();
  const visible = defineModel<boolean>('visible', { required: true });
  const emit = defineEmits<{ save: [data: AddressForm] }>();

  const isEdit = computed(() => !!props.address?.id);

  const aanhefOptions = ['Fam.', 'Dhr.', 'Mevr.'];

  const telefoonLandOptions = [
    { label: '+31', value: '+31', code: 'nl' },
    { label: '+32', value: '+32', code: 'be' },
    { label: '+33', value: '+33', code: 'fr' },
    { label: '+49', value: '+49', code: 'de' },
  ];

  const landOptions = ['Nederland', 'België', 'Duitsland', 'Frankrijk', 'Luxemburg'];

  const empty: AddressForm = {
    id: null,
    aanhef: null,
    voornaam: '',
    achternaam: '',
    telefoonLand: '+31',
    telefoon: '',
    terAttentieVan: '',
    land: 'Nederland',
    postcode: '',
    huisnummer: '',
    toevoeging: '',
    straat: '',
    woonplaats: '',
  };

  const form = ref<AddressForm>({ ...empty });

  watch(visible, (val) => {
    if (val) form.value = props.address ? { ...props.address } : { ...empty };
  });

  function save() {
    emit('save', { ...form.value });
    visible.value = false;
  }
</script>

<template>
  <Drawer
    v-model:visible="visible"
    :header="isEdit ? 'Adres bewerken' : 'Nieuw adres toevoegen'"
    position="right"
    :style="{ width: '34rem' }"
    :pt="{ content: { class: 'flex flex-col gap-0 p-0! overflow-hidden' } }"
  >
    <div class="drw-scroll">
      <!-- Persoonlijke gegevens -->
      <div class="drw-section-hdr">Persoonlijke gegevens</div>

      <div class="drw-field">
        <label class="drw-label">Aanhef</label>
        <SelectButton v-model="form.aanhef" :options="aanhefOptions" size="small" />
      </div>

      <div class="drw-grid">
        <div class="drw-field">
          <label class="drw-label">Voornaam <span class="drw-req">*</span></label>
          <InputText v-model="form.voornaam" class="w-full" placeholder="Voornaam" />
        </div>
        <div class="drw-field">
          <label class="drw-label">Achternaam <span class="drw-req">*</span></label>
          <InputText v-model="form.achternaam" class="w-full" placeholder="Achternaam" />
        </div>
      </div>

      <div class="drw-field">
        <label class="drw-label">Telefoonnummer</label>
        <div class="flex gap-2">
          <Select
            v-model="form.telefoonLand"
            :options="telefoonLandOptions"
            option-label="label"
            option-value="value"
            style="width: 8.5rem"
          >
            <template #value="{ value }">
              <div class="flex items-center gap-2">
                <span
                  :class="`fi fi-${telefoonLandOptions.find((o) => o.value === value)?.code}`"
                  style="
                    width: 1.5rem;
                    height: 1.125rem;
                    display: inline-block;
                    flex-shrink: 0;
                    background-size: cover;
                    background-position: center;
                  "
                />
                <span>{{ value }}</span>
              </div>
            </template>
            <template #option="{ option }">
              <div class="flex items-center gap-2">
                <span
                  :class="`fi fi-${option.code}`"
                  style="
                    width: 1.5rem;
                    height: 1.125rem;
                    display: inline-block;
                    flex-shrink: 0;
                    background-size: cover;
                    background-position: center;
                  "
                />
                <span>{{ option.label }}</span>
              </div>
            </template>
          </Select>
          <InputText v-model="form.telefoon" class="flex-1" placeholder="Telefoonnummer" />
        </div>
      </div>

      <!-- Adresgegevens -->
      <div class="drw-section-hdr" style="margin-top: 0.5rem">Adresgegevens</div>

      <div class="drw-grid">
        <div class="drw-field">
          <label class="drw-label">Land <span class="drw-req">*</span></label>
          <Select v-model="form.land" :options="landOptions" class="w-full" />
        </div>
        <div class="drw-field">
          <label class="drw-label">Ter attentie van</label>
          <InputText v-model="form.terAttentieVan" class="w-full" placeholder="Ter attentie van" />
        </div>
      </div>

      <div class="drw-field">
        <label class="drw-label">Adres <span class="drw-req">*</span></label>
        <div class="addr-grid-3">
          <InputText v-model="form.postcode" placeholder="Postcode" />
          <InputText v-model="form.huisnummer" placeholder="Huisnummer" />
          <InputText v-model="form.toevoeging" placeholder="Toevoeging" />
        </div>
        <div class="addr-grid-2 mt-2">
          <InputText v-model="form.straat" placeholder="Straat" />
          <InputText v-model="form.woonplaats" placeholder="Stad" />
        </div>
      </div>
    </div>

    <div class="drawer-footer">
      <Button label="Annuleren" severity="secondary" outlined @click="visible = false" />
      <Button label="Opslaan" @click="save" />
    </div>
  </Drawer>
</template>

<style scoped>
  .drw-scroll {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .drw-section-hdr {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--p-gray-800);
    margin-bottom: 0.125rem;
  }

  .drw-field {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .drw-label {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--p-surface-500);
  }
  .drw-req {
    color: var(--p-red-500);
  }
  .drw-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
  }

  .addr-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.5rem;
  }
  .addr-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5rem;
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
</style>
