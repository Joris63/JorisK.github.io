<script setup lang="ts">
  import { ref } from 'vue';
  import EditableCard from '@/components/EditableCard.vue';
  import type { OfferStatus } from '@/types/offer';
  import { SITE_OPTIONS } from '@/mocks/options';
  import { PENDING_SITE_CHANGES } from '@/mocks/offers';

  type OfferData = {
    id: number;
    name: string;
    description: string;
    websites: string[];
    startDate: Date | null;
    endDate: Date | null;
    status: OfferStatus;
  };

  const props = defineProps<{
    offer: OfferData;
    isExpired: boolean;
  }>();

  const emit = defineEmits<{
    save: [updatedOffer: OfferData];
  }>();

  // ── Local edit state ────────────────────────────────────────────
  const editingDetails = ref(false);
  const detailsDraft = ref<OfferData>({ ...props.offer, websites: [...props.offer.websites] });

  function startEditDetails() {
    detailsDraft.value = { ...props.offer, websites: [...props.offer.websites] };
    editingDetails.value = true;
  }

  function saveDetails() {
    emit('save', { ...detailsDraft.value, websites: [...detailsDraft.value.websites] });
  }

  function cancelDetails() {
    // draft is discarded; EditableCard sets editingDetails = false
  }

  // ── Website labels / site map ───────────────────────────────────
  const websiteLabels: Record<string, string> = Object.fromEntries(
    SITE_OPTIONS.map((o) => [o.value, o.label])
  );


  function formatDate(d: Date | null) {
    if (!d) return '—';
    return d.toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
</script>

<template>
  <div class="tab-scroll">
    <div class="view-card">
      <EditableCard
        v-model="editingDetails"
        title="Actiedetails"
        :disabled="isExpired"
        @save="saveDetails"
        @cancel="cancelDetails"
        @update:model-value="(v) => { if (v) startEditDetails(); }"
      >
        <!-- View mode -->
        <template #view>
          <div class="view-card-body">
            <div class="fr-row">
              <span class="fr-label">Naam</span>
              <span class="fr-value">{{ offer.name }}</span>
            </div>
            <div class="fr-row fr-row--top">
              <span class="fr-label">Website(s)</span>
              <div class="flex flex-col gap-2">
                <div class="flex flex-wrap gap-1">
                  <span v-for="w in offer.websites" :key="w" class="site-tag">
                    {{ websiteLabels[w] ?? w }}
                  </span>
                  <span v-if="!offer.websites.length" class="fr-empty">—</span>
                </div>
                <div v-if="PENDING_SITE_CHANGES.length" class="pending-sites">
                  <span class="pending-label">Vannacht:</span>
                  <div class="pending-chips">
                    <span
                      v-for="s in PENDING_SITE_CHANGES"
                      :key="s.site + s.action"
                      class="pending-chip"
                      :class="`pending-chip--${s.action}`"
                    >
                      <i :class="`pi ${s.action === 'add' ? 'pi-plus' : 'pi-minus'} text-xs`" />
                      {{ s.site }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="fr-row">
              <span class="fr-label">Looptijd</span>
              <span class="fr-value">
                {{ formatDate(offer.startDate) }} → {{ formatDate(offer.endDate) }}
              </span>
            </div>
            <div class="fr-row fr-row--top">
              <span class="fr-label">Omschrijving</span>
              <span v-if="offer.description" class="fr-value" style="white-space: pre-wrap">{{
                offer.description
              }}</span>
              <span v-else class="fr-empty">—</span>
            </div>
          </div>
        </template>

        <!-- Edit mode -->
        <template #edit>
          <div class="view-card-body">
            <div class="fr-row">
              <span class="fr-label">Naam <span class="fr-req">*</span></span>
              <InputText
                v-model="detailsDraft.name"
                class="w-full"
                placeholder="Bijv. 2026 Q1: Black Friday BE"
              />
            </div>
            <div class="fr-row fr-row--top">
              <span class="fr-label">Website(s) <span class="fr-req">*</span></span>
              <div class="flex flex-col gap-2">
                <MultiSelect
                  v-model="detailsDraft.websites"
                  :options="SITE_OPTIONS"
                  option-label="label"
                  option-value="value"
                  class="w-full"
                  placeholder="Selecteer website(s)"
                  display="chip"
                />
                <div v-if="PENDING_SITE_CHANGES.length" class="pending-sites">
                  <span class="pending-label">Vannacht:</span>
                  <div class="pending-chips">
                    <span
                      v-for="s in PENDING_SITE_CHANGES"
                      :key="s.site + s.action"
                      class="pending-chip"
                      :class="`pending-chip--${s.action}`"
                    >
                      <i :class="`pi ${s.action === 'add' ? 'pi-plus' : 'pi-minus'} text-xs`" />
                      {{ s.site }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="fr-row">
              <span class="fr-label">Looptijd <span class="fr-req">*</span></span>
              <div class="flex items-center gap-2">
                <DatePicker
                  v-model="detailsDraft.startDate"
                  date-format="dd-mm-yy"
                  show-icon
                  icon-display="input"
                  class="flex-1"
                  placeholder="Startdatum"
                />
                <span class="text-gray-300 text-base shrink-0">→</span>
                <DatePicker
                  v-model="detailsDraft.endDate"
                  date-format="dd-mm-yy"
                  show-icon
                  icon-display="input"
                  class="flex-1"
                  placeholder="Einddatum"
                />
              </div>
            </div>
            <div class="fr-row fr-row--top">
              <span class="fr-label">Omschrijving</span>
              <Textarea
                v-model="detailsDraft.description"
                class="w-full"
                :rows="4"
                placeholder="Optionele omschrijving"
                auto-resize
              />
            </div>
          </div>
        </template>
      </EditableCard>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";
  /* ── Pending sites ────────────────────────────────────────────── */
  .pending-sites {
    @apply flex items-start flex-wrap gap-2;
  }
  .pending-label {
    @apply text-xs text-(--sw-text-muted) whitespace-nowrap pt-1;
  }
  .pending-chips {
    @apply flex flex-wrap gap-1.5;
  }
  .pending-chip {
    @apply inline-flex items-center rounded-full text-xs font-medium border border-transparent gap-1;
    padding: 0.175rem 0.5rem;
  }
  .pending-chip--remove {
    @apply bg-red-50 text-red-600 border-red-200;
  }
  .pending-chip--add {
    @apply bg-green-50 text-green-700 border-green-200;
  }

  /* ── site-tag (view mode websites) ───────────────────────────── */
  .site-tag {
    @apply inline-flex items-center rounded-md text-xs font-medium bg-(--sw-bg-muted) text-(--sw-text-sub) whitespace-nowrap py-0.5 px-2;
  }
</style>
