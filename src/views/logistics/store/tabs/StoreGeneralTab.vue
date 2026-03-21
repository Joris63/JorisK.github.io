<script setup lang="ts">
import { ref } from 'vue';
import EditableCard from '@/components/EditableCard.vue';
import AddressFields from '@/components/form/AddressFields.vue';
import PhoneField from '@/components/form/PhoneField.vue';
import { COUNTRY_CODE_OPTIONS, SITE_OPTIONS, PICKUP_LOCATION_OPTIONS, PROMOTION_PAGE_OPTIONS } from '@/mocks/options';

defineProps<{
  store: Record<string, any>;
}>();

const isEditingGeneral = ref(false);
const isEditingAddress = ref(false);
const isEditingContact = ref(false);
const isEditingMisc = ref(false);
</script>

<template>
  <!-- Basisgegevens -->
  <EditableCard v-model="isEditingGeneral" title="Basisgegevens">
    <template #view>
      <div class="view-card-body">
        <div class="fr-row">
          <span class="fr-label">Naam</span>
          <span class="fr-value">{{ store.name }}</span>
        </div>
        <div class="fr-row">
          <span class="fr-label">Afkorting</span>
          <span class="fr-value">{{ store.abbreviation }}</span>
        </div>
        <div class="fr-row">
          <span class="fr-label">Slug</span>
          <span class="fr-value">{{ store.slug }}</span>
        </div>
        <div class="fr-row">
          <span class="fr-label">Hoofdwinkel</span>
          <span class="fr-value">
            <span :class="store.mainStore ? 'status-badge status-badge--yes' : 'status-badge status-badge--no'">
              {{ store.mainStore ? 'Ja' : 'Nee' }}
            </span>
          </span>
        </div>
        <div class="fr-row">
          <span class="fr-label">Actief</span>
          <span class="fr-value">
            <span :class="store.active ? 'status-badge status-badge--yes' : 'status-badge status-badge--no'">
              {{ store.active ? 'Ja' : 'Nee' }}
            </span>
          </span>
        </div>
        <div class="fr-row">
          <span class="fr-label">Outlet</span>
          <span class="fr-value">
            <span :class="store.outlet ? 'status-badge status-badge--yes' : 'status-badge status-badge--no'">
              {{ store.outlet ? 'Ja' : 'Nee' }}
            </span>
          </span>
        </div>
        <div class="fr-row">
          <span class="fr-label">Binnenkort open</span>
          <span class="fr-value">
            <span :class="store.openingSoon ? 'status-badge status-badge--yes' : 'status-badge status-badge--no'">
              {{ store.openingSoon ? 'Ja' : 'Nee' }}
            </span>
          </span>
        </div>
        <div class="fr-row">
          <span class="fr-label">Pickup locatie</span>
          <span :class="store.pickupLocation ? 'fr-value' : 'fr-empty'">{{ store.pickupLocation || '—' }}</span>
        </div>
        <div class="fr-row">
          <span class="fr-label">Sites</span>
          <div class="flex flex-wrap gap-1">
            <span v-for="s in store.sites" :key="s" class="site-tag">
              {{ SITE_OPTIONS.find((o) => o.value === s)?.label ?? s }}
            </span>
            <span v-if="!store.sites.length" class="fr-empty">—</span>
          </div>
        </div>
      </div>
    </template>
    <template #edit>
      <div class="view-card-body">
        <div class="fr-row">
          <label class="fr-label">Naam <span class="fr-req">*</span></label>
          <InputText v-model="store.name" class="w-full" placeholder="Naam winkel" />
        </div>
        <div class="fr-row">
          <label class="fr-label">Afkorting <span class="fr-req">*</span></label>
          <div class="flex gap-2">
            <InputText v-model="store.abbreviation" placeholder="UTR" class="max-w-[7rem]" />
            <InputText v-model="store.slug" class="flex-1" placeholder="showroom_utr" />
          </div>
        </div>
        <div class="fr-row fr-row--top">
          <label class="fr-label pt-2">Opties</label>
          <div class="options-grid">
            <div class="option-item">
              <ToggleSwitch v-model="store.mainStore" inputId="edit-opt-main" />
              <label for="edit-opt-main">Hoofdwinkel</label>
            </div>
            <div class="option-item">
              <ToggleSwitch v-model="store.active" inputId="edit-opt-active" />
              <label for="edit-opt-active">Actief</label>
            </div>
            <div class="option-item">
              <ToggleSwitch v-model="store.outlet" inputId="edit-opt-outlet" />
              <label for="edit-opt-outlet">Outlet</label>
            </div>
            <div class="option-item">
              <ToggleSwitch v-model="store.openingSoon" inputId="edit-opt-soon" />
              <label for="edit-opt-soon">Binnenkort open</label>
            </div>
          </div>
        </div>
        <div class="fr-row">
          <label class="fr-label">Pickup locatie</label>
          <Select
            v-model="store.pickupLocation"
            :options="PICKUP_LOCATION_OPTIONS"
            class="w-full"
            show-clear
            placeholder="Selecteer locatie"
          />
        </div>
        <div class="fr-row">
          <label class="fr-label">Sites <span class="fr-req">*</span></label>
          <MultiSelect
            v-model="store.sites"
            :options="SITE_OPTIONS"
            option-label="label"
            option-value="value"
            class="w-full"
            placeholder="Selecteer sites"
          />
        </div>
      </div>
    </template>
  </EditableCard>

  <!-- Adres -->
  <EditableCard v-model="isEditingAddress" title="Adres">
    <template #view>
      <div class="view-card-body">
        <div class="fr-row">
          <span class="fr-label">Land</span>
          <span class="fr-value"><span class="site-tag">{{ store.country }}</span></span>
        </div>
        <div class="fr-row">
          <span class="fr-label">Adres</span>
          <span class="fr-value">
            {{ store.street }} {{ store.houseNumber }}{{ store.addition ? ' ' + store.addition : '' }},
            {{ store.postalCode }} {{ store.city }}
          </span>
        </div>
        <div class="fr-row">
          <span class="fr-label">Opmerking</span>
          <span :class="store.addressNote ? 'fr-value' : 'fr-empty'">{{ store.addressNote || '—' }}</span>
        </div>
      </div>
    </template>
    <template #edit>
      <div class="view-card-body">
        <div class="fr-row">
          <label class="fr-label">Land <span class="fr-req">*</span></label>
          <Select
            v-model="store.country"
            :options="COUNTRY_CODE_OPTIONS"
            option-label="label"
            option-value="value"
            class="w-full"
          />
        </div>
        <div class="fr-row fr-row--top">
          <label class="fr-label">Adres <span class="fr-req">*</span></label>
          <AddressFields
            v-model:postalCode="store.postalCode"
            v-model:houseNumber="store.houseNumber"
            v-model:addition="store.addition"
            v-model:street="store.street"
            v-model:city="store.city"
          />
        </div>
        <div class="fr-row">
          <label class="fr-label">Opmerking</label>
          <InputText v-model="store.addressNote" class="w-full" placeholder="Bijv. 2e verdieping" />
        </div>
      </div>
    </template>
  </EditableCard>

  <!-- Contact -->
  <EditableCard v-model="isEditingContact" title="Contact">
    <template #view>
      <div class="view-card-body">
        <div class="fr-row">
          <span class="fr-label">Telefoonnummer</span>
          <span :class="store.phoneNumber ? 'fr-value' : 'fr-empty'">
            {{
              store.phoneNumber
                ? `+${store.phoneCountry === 'NL' ? '31' : store.phoneCountry === 'BE' ? '32' : '33'} ${store.phoneNumber}`
                : '—'
            }}
          </span>
        </div>
        <div class="fr-row">
          <span class="fr-label">E-mail</span>
          <span :class="store.email ? 'fr-value' : 'fr-empty'">{{ store.email || '—' }}</span>
        </div>
      </div>
    </template>
    <template #edit>
      <div class="view-card-body">
        <div class="fr-row">
          <label class="fr-label">Telefoonnummer</label>
          <PhoneField v-model:country="store.phoneCountry" v-model:number="store.phoneNumber" />
        </div>
        <div class="fr-row">
          <label class="fr-label">E-mail</label>
          <InputText v-model="store.email" class="w-full" placeholder="winkel@sanitairwinkel.nl" />
        </div>
      </div>
    </template>
  </EditableCard>

  <!-- Overig -->
  <EditableCard v-model="isEditingMisc" title="Overig">
    <template #view>
      <div class="view-card-body">
        <div class="fr-row">
          <span class="fr-label">Coördinaten</span>
          <span :class="store.latitude ? 'fr-value' : 'fr-empty'">
            {{ store.latitude && store.longitude ? `${store.latitude}, ${store.longitude}` : '—' }}
          </span>
        </div>
        <div class="fr-row">
          <span class="fr-label">Promotiepagina</span>
          <span :class="store.promotionPage ? 'fr-value' : 'fr-empty'">{{ store.promotionPage || '—' }}</span>
        </div>
        <div class="fr-row">
          <span class="fr-label">Google code</span>
          <span :class="store.googleCode ? 'fr-value' : 'fr-empty'">{{ store.googleCode || '—' }}</span>
        </div>
      </div>
    </template>
    <template #edit>
      <div class="view-card-body">
        <div class="fr-row">
          <label class="fr-label">Coördinaten</label>
          <div class="flex gap-2">
            <InputText v-model="store.latitude" placeholder="52.091" class="flex-1" />
            <InputText v-model="store.longitude" placeholder="5.122" class="flex-1" />
          </div>
        </div>
        <div class="fr-row">
          <label class="fr-label">Promotiepagina</label>
          <Select
            v-model="store.promotionPage"
            :options="PROMOTION_PAGE_OPTIONS"
            class="w-full"
            show-clear
            placeholder="Selecteer pagina"
          />
        </div>
        <div class="fr-row">
          <label class="fr-label">Google code</label>
          <InputText v-model="store.googleCode" placeholder="17" class="max-w-[8rem]" />
        </div>
      </div>
    </template>
  </EditableCard>
</template>

<style scoped>
@reference "@/assets/style.css";
.options-grid {
  @apply grid grid-cols-2 gap-y-3 gap-x-10 py-1;
}

.option-item {
  @apply flex items-center text-sm text-(--sw-text) gap-2.5;
}

.option-item label {
  @apply cursor-pointer select-none;
}
</style>
