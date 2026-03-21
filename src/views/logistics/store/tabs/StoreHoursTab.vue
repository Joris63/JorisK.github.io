<script setup lang="ts">
import { ref, computed } from 'vue';
import EditableCard from '@/components/EditableCard.vue';
import { SITE_OPTIONS } from '@/mocks/options';
import type { OpeningHours, StoreException } from '@/mocks/stores';

const props = defineProps<{
  store: Record<string, any>;
  openingHours: OpeningHours[];
  exceptions: StoreException[];
  addException: () => void;
  removeException: (id: number) => void;
}>();

const isEditingHours = ref(false);
const isEditingExceptions = ref(false);

const siteviews = computed(() => {
  const result: { key: string; label: string }[] = [];
  for (const site of props.store.sites) {
    if (site === 'sawiday_be') {
      result.push({ key: 'sawiday_be_nl', label: 'sawiday.be (NL)' });
      result.push({ key: 'sawiday_be_fr', label: 'sawiday.be (FR)' });
    } else {
      const opt = SITE_OPTIONS.find((o) => o.value === site);
      result.push({ key: site, label: opt?.label ?? site });
    }
  }
  return result;
});

function formatDate(date: Date | null) {
  return date?.toLocaleDateString('nl-NL') ?? '—';
}
</script>

<template>
  <!-- Openingstijden -->
  <EditableCard v-model="isEditingHours" title="Openingstijden">
    <template #view>
      <div class="view-card-body">
        <div v-for="row in openingHours" :key="row.day" class="fr-row">
          <span class="fr-label">{{ row.day }}</span>
          <span v-if="row.closed" class="fr-empty">Gesloten</span>
          <span v-else class="fr-value">{{ row.from }} – {{ row.to }}</span>
        </div>
      </div>
    </template>
    <template #edit>
      <div class="view-card-body">
        <div v-for="row in openingHours" :key="row.day" class="fr-row">
          <span class="fr-label">{{ row.day }}</span>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <Checkbox v-model="row.closed" binary :input-id="`closed-${row.day}`" />
              <label :for="`closed-${row.day}`" class="text-sm text-surface-500 cursor-pointer">Gesloten</label>
            </div>
            <template v-if="!row.closed">
              <InputText v-model="row.from" class="exception-time" placeholder="09:00" />
              <span class="text-surface-400 text-sm">–</span>
              <InputText v-model="row.to" class="exception-time" placeholder="17:30" />
            </template>
          </div>
        </div>
      </div>
    </template>
  </EditableCard>

  <!-- Uitzonderingen -->
  <EditableCard v-model="isEditingExceptions" title="Uitzonderingen">
    <template #view>
      <div class="view-card-body">
        <div v-if="!exceptions.length" class="fr-empty py-1">
          Geen uitzonderingen ingesteld
        </div>
        <div v-for="ex in exceptions" :key="ex.id" class="exception-card">
          <div class="exception-header">
            <span class="exception-date">{{ formatDate(ex.date) }}</span>
            <span v-if="ex.closed" class="status-badge status-badge--no">Gesloten</span>
            <span v-else class="fr-value text-sm">{{ ex.from }} – {{ ex.to }}</span>
          </div>
          <div class="exception-reasons">
            <div class="exception-reasons-header">Reden per siteview</div>
            <div v-for="sv in siteviews" :key="sv.key" class="exception-reason-row">
              <span class="exception-reason-site">{{ sv.label }}</span>
              <span :class="ex.reason[sv.key] ? 'fr-value text-sm' : 'fr-empty text-sm'">{{
                ex.reason[sv.key] || '—'
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #edit>
      <div class="view-card-body">
        <div v-if="!exceptions.length" class="fr-empty py-1">
          Geen uitzonderingen
        </div>
        <div v-for="ex in exceptions" :key="ex.id" class="exception-card">
          <div class="exception-header">
            <DatePicker v-model="ex.date" date-format="dd-mm-yy" placeholder="dd-mm-jj" class="w-[9rem]" />
            <div class="flex items-center gap-2">
              <Checkbox v-model="ex.closed" binary :input-id="`ex-closed-${ex.id}`" />
              <label :for="`ex-closed-${ex.id}`" class="text-sm text-surface-600 cursor-pointer">Gesloten</label>
            </div>
            <template v-if="!ex.closed">
              <InputText v-model="ex.from" class="exception-time" placeholder="09:00" />
              <span class="text-surface-400 text-sm">–</span>
              <InputText v-model="ex.to" class="exception-time" placeholder="17:30" />
            </template>
            <Button
              icon="pi pi-trash"
              severity="danger"
              text
              size="small"
              rounded
              class="ml-auto"
              @click="removeException(ex.id)"
            />
          </div>
          <div class="exception-reasons">
            <div class="exception-reasons-header">Reden per siteview</div>
            <div v-for="sv in siteviews" :key="sv.key" class="exception-reason-row">
              <span class="exception-reason-site">{{ sv.label }}</span>
              <InputText v-model="ex.reason[sv.key]" class="flex-1" placeholder="Bijv. 1e Paasdag" />
            </div>
          </div>
        </div>
        <div class="pt-2">
          <Button
            label="Nieuwe uitzondering toevoegen"
            icon="pi pi-plus"
            size="small"
            severity="secondary"
            outlined
            @click="addException"
          />
        </div>
      </div>
    </template>
  </EditableCard>
</template>

<style scoped>
@reference "@/assets/style.css";
.exception-card {
  @apply border border-(--sw-border-md) rounded-lg overflow-hidden mb-2.5;
}
.exception-card:last-of-type {
  @apply mb-0;
}
.exception-header {
  @apply flex items-center bg-(--sw-bg-subtle) border-b border-(--sw-border-md) gap-2.5 px-3 py-2;
}
.exception-date {
  @apply text-sm font-semibold text-(--sw-text-strong) min-w-[6rem];
}
.exception-time {
  @apply w-[5.5rem];
}
.exception-reasons {
  @apply flex flex-col gap-0 p-0;
}
.exception-reasons-header {
  @apply sw-nano text-(--sw-text-muted) border-b border-(--sw-border) px-3 pt-1.5 pb-1;
}
.exception-reason-row {
  @apply flex items-center border-b border-(--sw-border) gap-2.5 px-3 py-2;
}
.exception-reason-row:last-child {
  @apply border-b-0;
}
.exception-reason-site {
  @apply text-[0.8125rem] font-medium text-(--sw-text-label) w-[8.5rem] shrink-0;
}
</style>
