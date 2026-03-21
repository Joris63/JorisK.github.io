<script setup lang="ts">
  import { inject, ref, type Ref } from 'vue';
  import type { QuotationData } from '@/types/quotations';
  import ContractorSection from '@/views/sales/components/ContractorSection.vue';
  import RecommendedBySection from '@/views/sales/components/RecommendedBySection.vue';
  import { CHANNEL_OPTIONS, BRANCH_OPTIONS, MONTH_OPTIONS, getYearOptions } from '@/mocks/options';
  import EditableCard from '@/components/EditableCard.vue';

  const quotation = inject<Ref<QuotationData>>('quotation')!;

  const isEditingDetails = ref(false);
  const isEditingContacts = ref(false);

  const jaarOptions = getYearOptions(6);
</script>

<template>
  <div class="tab-scroll">
    <!-- ── Offerte gegevens ──────────────────────────────────────── -->
    <EditableCard v-model="isEditingDetails" title="Offerte gegevens">
      <template #view>
        <div class="view-card-body">
          <div class="fr-row">
            <span class="fr-label">Besteldatum</span>
            <span class="fr-value">{{ quotation.orderDate }}</span>
          </div>
          <div class="fr-row">
            <span class="fr-label">Geholpen door</span>
            <span class="fr-value">{{ quotation.assistedBy }}</span>
          </div>
          <div class="fr-row">
            <span class="fr-label">Kanaal</span>
            <span class="fr-value">{{ quotation.channel }}</span>
          </div>
          <div class="fr-row">
            <span class="fr-label">Vestiging</span>
            <span class="fr-value">{{ quotation.branch }}</span>
          </div>
          <div class="fr-row">
            <span class="fr-label">Wanneer verbouwen</span>
            <span :class="quotation.renovationMonth ? 'fr-value' : 'fr-empty'">
              {{ quotation.renovationMonth && quotation.renovationYear
                ? `${quotation.renovationMonth} ${quotation.renovationYear}`
                : '—' }}
            </span>
          </div>
        </div>
      </template>
      <template #edit>
        <div class="view-card-body">
          <div class="fr-row">
            <span class="fr-label">Besteldatum</span>
            <span class="fr-value">{{ quotation.orderDate }}</span>
          </div>
          <div class="fr-row">
            <span class="fr-label">Geholpen door</span>
            <span class="fr-value">{{ quotation.assistedBy }}</span>
          </div>
          <div class="fr-row">
            <label class="fr-label">Kanaal</label>
            <Select v-model="quotation.channel" :options="CHANNEL_OPTIONS" class="w-full" />
          </div>
          <div class="fr-row">
            <label class="fr-label">Vestiging</label>
            <Select v-model="quotation.branch" :options="BRANCH_OPTIONS" class="w-full" />
          </div>
          <div class="fr-row fr-row--top">
            <label class="fr-label">Wanneer verbouwen</label>
            <div class="verbouwen-grid">
              <Select v-model="quotation.renovationMonth" :options="MONTH_OPTIONS" placeholder="Maand" class="w-full" />
              <Select v-model="quotation.renovationYear" :options="jaarOptions" placeholder="Jaar" class="w-full" />
            </div>
          </div>
        </div>
      </template>
    </EditableCard>

    <!-- ── Externe contacten ─────────────────────────────────────── -->
    <EditableCard v-model="isEditingContacts" title="Externe contacten">
      <template #view>
        <div class="view-card-body">
          <div class="fr-row">
            <span class="fr-label">Aanbevolen door</span>
            <span :class="quotation.recommended?.company ? 'fr-value' : 'fr-empty'">
              {{ quotation.recommended?.company || '—' }}
            </span>
          </div>
          <div class="fr-row">
            <span class="fr-label">Aannemer</span>
            <span :class="quotation.contractor?.company ? 'fr-value' : 'fr-empty'">
              {{ quotation.contractor?.company || '—' }}
            </span>
          </div>
        </div>
      </template>
      <template #edit>
        <div class="view-card-body ext-edit">
          <div class="ext-section">
            <div class="ext-section-hdr">
              <span class="ext-section-title">Aanbevolen door</span>
            </div>
            <RecommendedBySection />
          </div>

          <div class="ext-sep" />

          <div class="ext-section">
            <div class="ext-section-hdr">
              <span class="ext-section-title">Aannemer / Installateur</span>
            </div>
            <ContractorSection />
          </div>
        </div>
      </template>
    </EditableCard>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";
  .verbouwen-grid {
    @apply grid grid-cols-2 gap-2;
  }

  .ext-edit {
    @apply flex flex-col p-0;
  }

  .ext-section { @apply flex flex-col pt-5 px-5; }
  .ext-section:last-child { @apply pb-5; }
  .ext-section-hdr { @apply mb-3; }
  .ext-section-title {
    @apply font-bold uppercase tracking-[0.05em] text-(--p-surface-400) text-xs;
  }
  .ext-sep {
    @apply h-px bg-(--p-gray-100) mt-5 mx-5;
  }
</style>
