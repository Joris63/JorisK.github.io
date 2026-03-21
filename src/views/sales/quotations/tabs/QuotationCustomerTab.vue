<script setup lang="ts">
  import { inject, ref, computed, type Ref } from 'vue';
  import type { QuotationData } from '@/types/quotations';
  import { COUNTRY_NAME_OPTIONS, PHONE_COUNTRY_OPTIONS } from '@/mocks/options';
  import EditableCard from '@/components/EditableCard.vue';

  const quotation = inject<Ref<QuotationData>>('quotation')!;

  const isEditingAddress = ref(false);
  const isEditingDetails = ref(false);

  const emailCopied = ref(false);
  function copyEmail() {
    navigator.clipboard.writeText(quotation.value.customerEmail);
    emailCopied.value = true;
    setTimeout(() => (emailCopied.value = false), 1500);
  }

  function phonePrefix(code: string) {
    return PHONE_COUNTRY_OPTIONS.find((o) => o.value === code)?.label ?? code;
  }

  const customerInitials = computed(() =>
    quotation.value.firstName && quotation.value.lastName
      ? (quotation.value.firstName[0] + quotation.value.lastName[0]).toUpperCase()
      : '??'
  );
</script>

<template>
  <div class="tab-scroll">
    <!-- ── Gekoppelde klant ──────────────────────────────────────────── -->
    <div class="view-card">
      <div class="view-card-hdr">
        <span class="view-card-title">Gekoppelde klant</span>
        <Button
          label="Klant wijzigen"
          icon="pi pi-arrows-h"
          size="small"
          severity="secondary"
          text
        />
      </div>
      <div class="view-card-body">
        <div class="klant-profile">
          <div class="klant-avatar">{{ customerInitials }}</div>
          <div class="klant-info">
            <span class="klant-name">{{ quotation.firstName }} {{ quotation.lastName }}</span>
            <div class="klant-email-row">
              <span class="klant-email">{{ quotation.customerEmail }}</span>
              <Button
                :icon="emailCopied ? 'pi pi-check' : 'pi pi-copy'"
                size="small"
                text
                severity="secondary"
                rounded
                @click="copyEmail"
              />
            </div>
          </div>
        </div>
        <div class="klant-meta">
          <div class="klant-meta-item">
            <span class="klant-meta-label">Account</span>
            <Tag
              :value="quotation.customerHasAccount ? 'Actief' : 'Geen account'"
              :severity="quotation.customerHasAccount ? 'success' : 'secondary'"
            />
          </div>
          <div class="klant-meta-sep" />
          <div class="klant-meta-item">
            <span class="klant-meta-label">Type</span>
            <span class="klant-meta-val">{{ quotation.customerType }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Factuuradres ──────────────────────────────────────────────── -->
    <EditableCard v-model="isEditingAddress" title="Factuuradres">
      <template #view>
        <div class="view-card-body">
          <div class="fr-row">
            <span class="fr-label">Naam</span>
            <span class="fr-value">{{ quotation.firstName }} {{ quotation.lastName }}</span>
          </div>
          <div class="fr-row">
            <span class="fr-label">Land</span>
            <span class="fr-value">{{ quotation.country }}</span>
          </div>
          <div class="fr-row">
            <span class="fr-label">Adres</span>
            <span class="fr-value">
              {{ quotation.street }} {{ quotation.houseNumber }}{{ quotation.addition ? ' ' + quotation.addition : '' }},
              {{ quotation.postalCode }} {{ quotation.city }}
            </span>
          </div>
          <div class="fr-row">
            <span class="fr-label">Telefoon</span>
            <span :class="quotation.phone ? 'fr-value' : 'fr-empty'">
              {{ quotation.phone ? `${phonePrefix(quotation.phoneCountry)} ${quotation.phone}` : '—' }}
            </span>
          </div>
          <div class="fr-row">
            <span class="fr-label">Alt. telefoon</span>
            <span :class="quotation.alternative ? 'fr-value' : 'fr-empty'">{{ quotation.alternative || '—' }}</span>
          </div>
        </div>
      </template>
      <template #edit>
        <div class="view-card-body">
          <div class="fr-row">
            <label class="fr-label">Voornaam</label>
            <InputText v-model="quotation.firstName" class="w-full" />
          </div>
          <div class="fr-row">
            <label class="fr-label">Achternaam</label>
            <InputText v-model="quotation.lastName" class="w-full" />
          </div>
          <div class="fr-row">
            <label class="fr-label">Land</label>
            <Select v-model="quotation.country" :options="COUNTRY_NAME_OPTIONS" class="w-full" />
          </div>
          <div class="fr-row fr-row--top">
            <label class="fr-label">Adres</label>
            <div class="addr-grid">
              <InputText v-model="quotation.postalCode" placeholder="Postcode" />
              <InputText v-model="quotation.houseNumber" placeholder="Nr." />
              <InputText v-model="quotation.addition" placeholder="Toev." />
              <InputText v-model="quotation.street" placeholder="Straat" class="addr-full" />
              <InputText v-model="quotation.city" placeholder="Woonplaats" class="addr-full" />
            </div>
          </div>
          <div class="fr-row">
            <label class="fr-label">Telefoon</label>
            <div class="phone-row">
              <Select
                v-model="quotation.phoneCountry"
                :options="PHONE_COUNTRY_OPTIONS"
                option-label="label"
                option-value="value"
                class="phone-flag"
              />
              <InputText v-model="quotation.phone" class="flex-1" placeholder="Telefoonnummer" />
            </div>
          </div>
          <div class="fr-row">
            <label class="fr-label">Alt. telefoon</label>
            <InputText v-model="quotation.alternative" class="w-full" placeholder="Alternatief telefoonnummer" />
          </div>
        </div>
      </template>
    </EditableCard>

    <!-- ── Details ───────────────────────────────────────────────────── -->
    <EditableCard v-model="isEditingDetails" title="Details">
      <template #view>
        <div class="view-card-body">
          <div class="fr-row">
            <span class="fr-label">Referentie</span>
            <span :class="quotation.reference ? 'fr-value' : 'fr-empty'">{{ quotation.reference || '—' }}</span>
          </div>
        </div>
      </template>
      <template #edit>
        <div class="view-card-body">
          <div class="fr-row">
            <label class="fr-label">Referentie</label>
            <InputText v-model="quotation.reference" class="w-full" placeholder="Klantreferentie (optioneel)" />
          </div>
        </div>
      </template>
    </EditableCard>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";
  /* Linked customer profile */
  .klant-profile {
    @apply flex items-center border-b border-gray-100 gap-3.5 pb-3.5 mb-3;
  }
  .klant-avatar {
    background: linear-gradient(135deg, var(--p-primary-400) 0%, var(--p-primary-600) 100%);
    @apply rounded-full text-white font-bold flex items-center justify-center shrink-0 tracking-[0.03em] w-11 h-11 text-sm;
  }
  .klant-info {
    @apply flex flex-col min-w-0 gap-0.5;
  }
  .klant-name {
    @apply font-semibold text-[var(--p-surface-800)] text-base;
  }
  .klant-email-row {
    @apply flex items-center gap-0.5;
  }
  .klant-email {
    @apply text-[var(--p-surface-500)] text-sm;
  }
  .klant-meta {
    @apply flex items-center gap-0;
  }
  .klant-meta-item {
    @apply flex items-center gap-2 pr-4;
  }
  .klant-meta-item:not(:first-child) {
    @apply pl-4;
  }
  .klant-meta-label {
    @apply text-[var(--p-surface-400)] text-sm;
  }
  .klant-meta-val {
    @apply text-[var(--p-surface-700)] font-medium text-sm;
  }
  .klant-meta-sep {
    @apply w-px bg-gray-200 shrink-0 h-5;
  }

  /* Address & phone */
  .addr-grid {
    @apply grid grid-cols-3 gap-2;
  }
  .addr-full { @apply col-span-full; }
  .phone-row { @apply flex items-center gap-2; }
  .phone-flag { @apply w-28 shrink-0; }
</style>
