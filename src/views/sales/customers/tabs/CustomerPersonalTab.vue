<script setup lang="ts">
  import { ref, inject } from 'vue';
  import type { Ref } from 'vue';
  import type { CustomerData } from '@/types/customer';
  import {
    SALUTATION_OPTIONS,
    VAT_COUNTRY_OPTIONS,
    COMPANY_TYPE_OPTIONS,
    PHONE_COUNTRY_OPTIONS,
    PAYMENT_METHOD_OPTIONS,
    SHOWROOM_NAME_OPTIONS,
    SHOW_PRICES_OPTIONS,
  } from '@/mocks/options';
  import EditableCard from '@/components/EditableCard.vue';

  const customer = inject<Ref<CustomerData>>('customer')!;

  const isEditingCompany = ref(false);
  const isEditingPersonal = ref(false);
  const isEditingPreferences = ref(false);

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }
</script>

<template>
  <div class="tab-scroll">
    <!-- Card: Bedrijfsgegevens -->
    <EditableCard v-model="isEditingCompany" title="Bedrijfsgegevens">
      <template #view>
        <div class="view-card-body">
          <div class="fr-row">
            <span class="fr-label">Type bedrijf</span>
            <span :class="customer.companyType ? 'fr-value' : 'fr-empty'">{{
              customer.companyType || '—'
            }}</span>
          </div>
          <div class="fr-row">
            <span class="fr-label">Bedrijfsnaam</span>
            <span :class="customer.companyName ? 'fr-value' : 'fr-empty'">{{
              customer.companyName || '—'
            }}</span>
          </div>
          <div class="fr-row">
            <span class="fr-label">BTW-nummer</span>
            <span :class="customer.vatNumber ? 'fr-value' : 'fr-empty'">{{
              customer.vatNumber ? `${customer.vatCountry} ${customer.vatNumber}` : '—'
            }}</span>
          </div>
          <div class="fr-row">
            <span class="fr-label">KVK-nummer</span>
            <span :class="customer.chamberOfCommerceNumber ? 'fr-value' : 'fr-empty'">{{
              customer.chamberOfCommerceNumber || '—'
            }}</span>
          </div>
        </div>
      </template>
      <template #edit>
        <div class="view-card-body">
          <div class="fr-row">
            <label class="fr-label">Type bedrijf</label>
            <Select
              v-model="customer.companyType"
              :options="COMPANY_TYPE_OPTIONS"
              class="w-full"
              placeholder="Type bedrijf"
              show-clear
            />
          </div>
          <div class="fr-row">
            <label class="fr-label">Bedrijfsnaam</label>
            <InputText v-model="customer.companyName" class="w-full" placeholder="Bedrijfsnaam" />
          </div>
          <div class="fr-row">
            <label class="fr-label">BTW-nummer</label>
            <div class="flex gap-2">
              <Select v-model="customer.vatCountry" :options="VAT_COUNTRY_OPTIONS" style="width: 7.5rem">
                <template #value="{ value }">
                  <div class="flex items-center gap-2">
                    <span
                      :class="`fi fi-${value.toLowerCase()}`"
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
                      :class="`fi fi-${option.toLowerCase()}`"
                      style="
                        width: 1.5rem;
                        height: 1.125rem;
                        display: inline-block;
                        flex-shrink: 0;
                        background-size: cover;
                        background-position: center;
                      "
                    />
                    <span>{{ option }}</span>
                  </div>
                </template>
              </Select>
              <InputText v-model="customer.vatNumber" class="flex-1" placeholder="BTW-nummer" />
            </div>
          </div>
          <div class="fr-row">
            <label class="fr-label">KVK-nummer</label>
            <InputText v-model="customer.chamberOfCommerceNumber" class="w-full" placeholder="KVK-nummer" />
          </div>
        </div>
      </template>
    </EditableCard>

    <!-- Card: Persoonlijke gegevens -->
    <EditableCard v-model="isEditingPersonal" title="Persoonlijke gegevens">
      <template #view>
        <div class="view-card-body">
          <div class="fr-row">
            <span class="fr-label">Aanhef</span>
            <span :class="customer.salutation ? 'fr-value' : 'fr-empty'">{{
              customer.salutation || '—'
            }}</span>
          </div>
          <div class="fr-row">
            <span class="fr-label">Voornaam</span>
            <span class="fr-value">{{ customer.firstName }}</span>
          </div>
          <div class="fr-row">
            <span class="fr-label">Achternaam</span>
            <span class="fr-value">{{ customer.lastName }}</span>
          </div>
          <div class="fr-row">
            <span class="fr-label">E-mail</span>
            <span class="fr-value">{{ customer.email }}</span>
          </div>
          <div class="fr-row">
            <span class="fr-label">Telefoonnummer</span>
            <span :class="customer.phone ? 'fr-value' : 'fr-empty'">{{
              customer.phone
                ? `${PHONE_COUNTRY_OPTIONS.find((o) => o.value === customer.phoneCountry)?.label} ${customer.phone}`
                : '—'
            }}</span>
          </div>
          <div class="fr-row">
            <span class="fr-label">Geboortedatum</span>
            <span :class="customer.birthDate ? 'fr-value' : 'fr-empty'">{{
              customer.birthDate?.toLocaleDateString('nl-NL') || '—'
            }}</span>
          </div>
          <div class="fr-row">
            <span class="fr-label">Siteview</span>
            <span class="fr-value">{{ customer.siteview }}</span>
          </div>
        </div>
      </template>
      <template #edit>
        <div class="view-card-body">
          <div class="fr-row">
            <label class="fr-label">Aanhef</label>
            <SelectButton v-model="customer.salutation" :options="SALUTATION_OPTIONS" size="small" />
          </div>
          <div class="fr-row">
            <label class="fr-label">Voornaam <span class="fr-req">*</span></label>
            <InputText v-model="customer.firstName" class="w-full" placeholder="Voornaam" />
          </div>
          <div class="fr-row">
            <label class="fr-label">Achternaam <span class="fr-req">*</span></label>
            <InputText v-model="customer.lastName" class="w-full" placeholder="Achternaam" />
          </div>
          <div class="fr-row">
            <span class="fr-label">E-mail</span>
            <span class="fr-value">{{ customer.email }}</span>
          </div>
          <div class="fr-row">
            <label class="fr-label">Telefoonnummer</label>
            <div class="flex gap-2">
              <Select
                :options="PHONE_COUNTRY_OPTIONS"
                v-model="customer.phoneCountry"
                option-label="label"
                option-value="value"
                style="width: 8.5rem"
              >
                <template #value="{ value }">
                  <div class="flex items-center gap-2">
                    <span
                      :class="`fi fi-${value.toLowerCase()}`"
                      style="
                        width: 1.5rem;
                        height: 1.125rem;
                        display: inline-block;
                        flex-shrink: 0;
                        background-size: cover;
                        background-position: center;
                      "
                    />
                    <span>{{ PHONE_COUNTRY_OPTIONS.find((o) => o.value === value)?.label }}</span>
                  </div>
                </template>
              </Select>
              <InputText v-model="customer.phone" class="flex-1" placeholder="Telefoonnummer" />
            </div>
          </div>
          <div class="fr-row">
            <label class="fr-label">Geboortedatum</label>
            <DatePicker
              v-model="customer.birthDate"
              date-format="dd-mm-yy"
              show-icon
              icon-display="input"
              class="w-full"
              placeholder="Geboortedatum"
            />
          </div>
          <div class="fr-row">
            <span class="fr-label">Siteview</span>
            <span class="fr-value">{{ customer.siteview }}</span>
          </div>
        </div>
      </template>
    </EditableCard>

    <!-- Card: Voorkeuren -->
    <EditableCard v-model="isEditingPreferences" title="Voorkeuren">
      <template #view>
        <div class="view-card-body">
          <div class="fr-row">
            <span class="fr-label">Betaalmethode</span>
            <span :class="customer.paymentMethod ? 'fr-value' : 'fr-empty'">{{
              customer.paymentMethod || '—'
            }}</span>
          </div>
          <div class="fr-row">
            <span class="fr-label">Voorkeur showroom</span>
            <span :class="customer.preferredShowroom ? 'fr-value' : 'fr-empty'">{{
              customer.preferredShowroom || '—'
            }}</span>
          </div>
          <div class="fr-row">
            <span class="fr-label">Toon prijzen</span>
            <span class="fr-value">{{ customer.showPrices }}</span>
          </div>
          <div class="fr-row">
            <span class="fr-label">Nieuwsbrief</span>
            <span :class="customer.newsletter ? 'fr-value' : 'fr-empty'">{{
              customer.newsletter ? 'Aangemeld' : '—'
            }}</span>
          </div>
        </div>
      </template>
      <template #edit>
        <div class="view-card-body">
          <div class="fr-row">
            <label class="fr-label">Betaalmethode</label>
            <Select
              v-model="customer.paymentMethod"
              :options="PAYMENT_METHOD_OPTIONS"
              class="w-full"
              placeholder="Betaalmethode"
              show-clear
            />
          </div>
          <div class="fr-row">
            <label class="fr-label">Voorkeur showroom</label>
            <Select
              v-model="customer.preferredShowroom"
              :options="SHOWROOM_NAME_OPTIONS"
              class="w-full"
              placeholder="Voorkeur showroom"
              show-clear
            />
          </div>
          <div class="fr-row">
            <label class="fr-label">Toon prijzen</label>
            <SelectButton
              v-model="customer.showPrices"
              :options="SHOW_PRICES_OPTIONS"
              size="small"
            />
          </div>
          <div class="fr-row">
            <label class="fr-label">Nieuwsbrief</label>
            <div class="flex items-center gap-2">
              <Checkbox v-model="customer.newsletter" binary input-id="nieuwsbrief" />
              <label for="nieuwsbrief" class="text-sm text-surface-600 cursor-pointer"
                >Aangemeld voor nieuwsbrief</label
              >
            </div>
          </div>
        </div>
      </template>
    </EditableCard>

    <!-- Card: Afspraken URLs -->
    <div class="view-card">
      <div class="view-card-hdr">
        <span class="view-card-title">Afspraken URLs</span>
        <div class="flex items-center gap-2">
          <ToggleSwitch v-model="customer.appointmentUrlsActive" />
          <span class="view-card-toggle-lbl">
            {{ customer.appointmentUrlsActive ? 'Actief' : 'Inactief' }}
          </span>
        </div>
      </div>
      <div v-if="customer.appointmentUrlsActive" class="view-card-body">
        <div class="fr-row">
          <span class="fr-label">SWNL</span>
          <div class="url-row">
            <span class="fr-value url-text">{{ customer.appointmentUrls.swnl }}</span>
            <Button
              icon="pi pi-copy"
              size="small"
              severity="secondary"
              text
              @click="copyToClipboard(customer.appointmentUrls.swnl)"
            />
          </div>
        </div>
        <div class="fr-row">
          <span class="fr-label">SWBE (Nederlandstalig)</span>
          <div class="url-row">
            <span class="fr-value url-text">{{ customer.appointmentUrls.swbeNl }}</span>
            <Button
              icon="pi pi-copy"
              size="small"
              severity="secondary"
              text
              @click="copyToClipboard(customer.appointmentUrls.swbeNl)"
            />
          </div>
        </div>
        <div class="fr-row">
          <span class="fr-label">SWBE (Franstalig)</span>
          <div class="url-row">
            <span class="fr-value url-text">{{ customer.appointmentUrls.swbeFr }}</span>
            <Button
              icon="pi pi-copy"
              size="small"
              severity="secondary"
              text
              @click="copyToClipboard(customer.appointmentUrls.swbeFr)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";
  .view-card-toggle-lbl {
    @apply text-(--p-surface-500) text-sm;
  }
  .url-row {
    @apply flex items-center min-w-0 gap-1;
  }
  .url-text {
    @apply overflow-hidden text-ellipsis whitespace-nowrap text-[var(--p-primary-600)] text-sm;
  }
</style>
