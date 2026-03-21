<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import type { AddressForm } from '@/types/address';
  import AddressFields from '@/components/form/AddressFields.vue';
  import PhoneField from '@/components/form/PhoneField.vue';

  export type { AddressForm };

  const props = defineProps<{ address?: AddressForm | null }>();
  const visible = defineModel<boolean>('visible', { required: true });
  const emit = defineEmits<{ save: [data: AddressForm] }>();

  const isEdit = computed(() => !!props.address?.id);

  const salutationOptions = ['Fam.', 'Dhr.', 'Mevr.'];
  const countryOptions = ['Nederland', 'België', 'Duitsland', 'Frankrijk', 'Luxemburg'];

  const empty: AddressForm = {
    id: null,
    salutation: null,
    firstName: '',
    lastName: '',
    phoneCountry: '+31',
    phone: '',
    attentionOf: '',
    country: 'Nederland',
    postalCode: '',
    houseNumber: '',
    addition: '',
    street: '',
    city: '',
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
    class="w-[34rem]!"
    :pt="{ content: { class: 'flex flex-col gap-0 p-0! overflow-hidden' } }"
  >
    <div class="drw-scroll">
      <!-- Persoonlijke gegevens -->
      <div class="drw-section-hdr">Persoonlijke gegevens</div>

      <div class="drw-field">
        <label class="drw-label">Aanhef</label>
        <SelectButton v-model="form.salutation" :options="salutationOptions" size="small" />
      </div>

      <div class="drw-grid">
        <div class="drw-field">
          <label class="drw-label">Voornaam <span class="drw-req">*</span></label>
          <InputText v-model="form.firstName" class="w-full" placeholder="Voornaam" />
        </div>
        <div class="drw-field">
          <label class="drw-label">Achternaam <span class="drw-req">*</span></label>
          <InputText v-model="form.lastName" class="w-full" placeholder="Achternaam" />
        </div>
      </div>

      <div class="drw-field">
        <label class="drw-label">Telefoonnummer</label>
        <PhoneField v-model:country="form.phoneCountry" v-model:number="form.phone" />
      </div>

      <!-- Adresgegevens -->
      <div class="drw-section-hdr mt-2">Adresgegevens</div>

      <div class="drw-grid">
        <div class="drw-field">
          <label class="drw-label">Land <span class="drw-req">*</span></label>
          <Select v-model="form.country" :options="countryOptions" class="w-full" />
        </div>
        <div class="drw-field">
          <label class="drw-label">Ter attentie van</label>
          <InputText v-model="form.attentionOf" class="w-full" placeholder="Ter attentie van" />
        </div>
      </div>

      <div class="drw-field">
        <label class="drw-label">Adres <span class="drw-req">*</span></label>
        <AddressFields
          v-model:postalCode="form.postalCode"
          v-model:houseNumber="form.houseNumber"
          v-model:addition="form.addition"
          v-model:street="form.street"
          v-model:city="form.city"
        />
      </div>
    </div>

    <div class="drawer-footer">
      <Button label="Annuleren" severity="secondary" outlined @click="visible = false" />
      <Button label="Opslaan" @click="save" />
    </div>
  </Drawer>
</template>
