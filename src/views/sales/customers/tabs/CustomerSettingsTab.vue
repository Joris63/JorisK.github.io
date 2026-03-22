<script setup lang="ts">
  import { ref, inject } from 'vue';
  import type { Ref } from 'vue';
  import type { CustomerData } from '@/types/customer';
  import { REVIEW_INACTIVE_REASON_OPTIONS } from '@/mocks/options';
  import EditableCard from '@/components/EditableCard.vue';

  const customer = inject<Ref<CustomerData>>('customer')!;

  const isEditingSettings = ref(false);
  const isEditingCredit = ref(false);
</script>

<template>
  <div class="tab-scroll">
    <!-- Card: Instellingen -->
    <EditableCard v-model="isEditingSettings" title="Instellingen">
      <template #view>
        <div class="view-card-body">
          <div class="fr-row">
            <span class="fr-label">Financieel e-mailadres</span>
            <span class="fr-value">{{ customer.financialEmail || '—' }}</span>
          </div>
          <div class="fr-row">
            <span class="fr-label">Reviews</span>
            <span class="fr-value">{{ customer.reviewsActive ? 'Actief' : 'Inactief' }}</span>
          </div>
          <div v-if="!customer.reviewsActive" class="fr-row">
            <span class="fr-label">Inactief reden</span>
            <span class="fr-value">{{ customer.reviewInactiveReason || '—' }}</span>
          </div>
          <div class="fr-row fr-row--top">
            <span class="fr-label">Opmerkingen</span>
            <span
              :class="customer.notes ? 'fr-value' : 'fr-empty'"
              style="white-space: pre-wrap"
              >{{ customer.notes || '—' }}</span
            >
          </div>
        </div>
      </template>
      <template #edit>
        <div class="view-card-body">
          <div class="fr-row">
            <label class="fr-label">Financieel e-mailadres</label>
            <InputText
              v-model="customer.financialEmail"
              class="w-full"
              placeholder="Financieel e-mailadres"
            />
          </div>
          <div class="fr-row">
            <label class="fr-label">Reviews</label>
            <div class="flex items-center gap-3">
              <ToggleSwitch v-model="customer.reviewsActive" input-id="reviews" />
              <label for="reviews" class="text-base text-surface-600 cursor-pointer"
                >Reviews actief</label
              >
            </div>
          </div>
          <div v-if="!customer.reviewsActive" class="fr-row">
            <label class="fr-label">Inactief reden</label>
            <Select
              v-model="customer.reviewInactiveReason"
              :options="REVIEW_INACTIVE_REASON_OPTIONS"
              class="w-full"
              placeholder="Selecteer reden"
              show-clear
            />
          </div>
          <div class="fr-row fr-row--top">
            <label class="fr-label">Opmerkingen</label>
            <Textarea
              v-model="customer.notes"
              class="w-full"
              :rows="4"
              placeholder="Opmerkingen"
              auto-resize
            />
          </div>
        </div>
      </template>
    </EditableCard>

    <!-- Card: Krediet -->
    <EditableCard v-model="isEditingCredit" title="Krediet">
      <template #view>
        <div class="view-card-body">
          <div class="fr-row">
            <span class="fr-label">Betalen op rekening</span>
            <span class="fr-value">{{ customer.canPayOnAccount ? 'Ja' : 'Nee' }}</span>
          </div>
          <Transition name="fade-slide">
            <div v-if="customer.canPayOnAccount">
              <div class="fr-row">
                <span class="fr-label">Debiteur nummer</span>
                <span class="fr-value">{{ customer.debtorNumber || '—' }}</span>
              </div>
              <div class="fr-row">
                <span class="fr-label">Kredietlimiet</span>
                <span class="fr-value">{{
                  customer.creditLimit ? `€ ${customer.creditLimit}` : '—'
                }}</span>
              </div>
              <div class="fr-row">
                <span class="fr-label">Vervaldagen factuur</span>
                <span class="fr-value">{{ customer.invoiceDueDays }} dagen</span>
              </div>
              <div class="fr-row">
                <span class="fr-label">Tijdelijk krediet</span>
                <span class="fr-value">{{
                  customer.allowTemporaryCredit ? 'Toegestaan' : 'Niet toegestaan'
                }}</span>
              </div>
              <Transition name="fade-slide">
                <div v-if="customer.allowTemporaryCredit">
                  <div class="fr-row">
                    <span class="fr-label">Tijdelijk limiet</span>
                    <span class="fr-value">{{
                      customer.temporaryCreditLimit ? `€ ${customer.temporaryCreditLimit}` : '—'
                    }}</span>
                  </div>
                  <div class="fr-row">
                    <span class="fr-label">Vervaldatum</span>
                    <span class="fr-value">{{
                      customer.temporaryCreditExpiryDate?.toLocaleDateString('nl-NL') || '—'
                    }}</span>
                  </div>
                </div>
              </Transition>
            </div>
          </Transition>
        </div>
      </template>
      <template #edit>
        <div class="view-card-body">
          <div class="fr-row">
            <label class="fr-label">Betalen op rekening</label>
            <div class="flex items-center gap-3">
              <ToggleSwitch v-model="customer.canPayOnAccount" input-id="betalen-rekening" />
              <label for="betalen-rekening" class="text-base text-surface-600 cursor-pointer"
                >Kan betalen op rekening</label
              >
            </div>
          </div>
          <Transition name="fade-slide">
            <div v-if="customer.canPayOnAccount">
              <div class="fr-row">
                <label class="fr-label">Debiteur nummer</label>
                <InputText
                  v-model="customer.debtorNumber"
                  class="w-full"
                  placeholder="Debiteur nummer"
                />
              </div>
              <div class="fr-row">
                <label class="fr-label">Kredietlimiet</label>
                <InputNumber v-model="customer.creditLimit" class="w-full" placeholder="0" />
              </div>
              <div class="fr-row">
                <label class="fr-label">Vervaldagen factuur</label>
                <div class="flex items-center gap-2">
                  <InputNumber
                    v-model="customer.invoiceDueDays"
                    style="width: 8rem"
                    placeholder="14"
                  />
                  <span class="text-base text-surface-500">Dagen</span>
                </div>
              </div>
              <div class="fr-row">
                <label class="fr-label">Tijdelijk krediet</label>
                <div class="flex items-center gap-3">
                  <ToggleSwitch
                    v-model="customer.allowTemporaryCredit"
                    input-id="tijdelijk-krediet"
                  />
                  <label for="tijdelijk-krediet" class="text-base text-surface-600 cursor-pointer"
                    >Tijdelijk krediet toestaan</label
                  >
                </div>
              </div>
              <Transition name="fade-slide">
                <div v-if="customer.allowTemporaryCredit">
                  <div class="fr-row">
                    <label class="fr-label">Tijdelijk limiet</label>
                    <InputNumber
                      v-model="customer.temporaryCreditLimit"
                      class="w-full"
                      placeholder="0"
                    />
                  </div>
                  <div class="fr-row">
                    <label class="fr-label">Vervaldatum</label>
                    <DatePicker
                      v-model="customer.temporaryCreditExpiryDate"
                      date-format="dd-mm-yy"
                      show-icon
                      icon-display="input"
                      class="w-full"
                      placeholder="Selecteer een datum"
                    />
                  </div>
                </div>
              </Transition>
            </div>
          </Transition>
        </div>
      </template>
    </EditableCard>
  </div>
</template>
