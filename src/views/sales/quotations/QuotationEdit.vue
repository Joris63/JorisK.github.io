<script setup lang="ts">
  import { ref, computed, provide } from 'vue';
  import EditPageLayout from '@/components/layout/EditPageLayout.vue';
  import EditPageHeader from '@/components/layout/EditPageHeader.vue';
  import EditPageNav from '@/components/layout/EditPageNav.vue';
  import type { NavGroup } from '@/components/layout/EditPageNav.vue';
  import QuotationCustomerTab from './tabs/QuotationCustomerTab.vue';
  import QuotationOfferTab from './tabs/QuotationOfferTab.vue';
  import QuotationDetailsTab from './tabs/QuotationDetailsTab.vue';
  import QuotationCommunicationTab from './tabs/QuotationCommunicationTab.vue';
  import QuotationTasksTab from './tabs/QuotationTasksTab.vue';
  import QuotationLogTab from './tabs/QuotationLogTab.vue';
  import { MOCK_QUOTATION } from '@/mocks/quotations';

  // ── Mock data ──────────────────────────────────────────────────────────────
  const quotation = ref(MOCK_QUOTATION);

  provide('quotation', quotation);

  // ── Header computed ─────────────────────────────────────────────────────────

  const fullName = computed(() =>
    [quotation.value.firstName, quotation.value.lastName].filter(Boolean).join(' ')
  );

  const initials = computed(() =>
    [quotation.value.firstName, quotation.value.lastName]
      .filter(Boolean)
      .map((s) => s[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  );

  const productCount = computed(() =>
    quotation.value.groups.reduce((sum, g) => sum + g.lines.reduce((s, l) => s + l.quantity, 0), 0)
  );

  const totalPrice = computed(() =>
    quotation.value.groups.reduce(
      (sum, g) => sum + g.lines.reduce((s, l) => s + l.price * l.quantity, 0),
      0
    )
  );

  function formatTotal(n: number) {
    return (
      '€ ' +
      n
        .toFixed(2)
        .replace('.', ',')
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    );
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  const activeSection = ref('offer');

  const navGroups = computed<NavGroup[]>(() => [
    {
      label: 'Offerte',
      items: [
        { id: 'customer', label: 'Klant',   icon: 'pi-user'          },
        { id: 'offer',    label: 'Aanbod',  icon: 'pi-shopping-cart' },
        { id: 'details',  label: 'Details', icon: 'pi-cog'           },
      ],
    },
    {
      label: 'Beheer',
      items: [
        { id: 'communications', label: 'Communicatie', icon: 'pi-comment'    },
        { id: 'tasks',          label: 'Taken',        icon: 'pi-list-check', badge: quotation.value.tasks.length || undefined },
        { id: 'logs',           label: 'Log',          icon: 'pi-history'   },
      ],
    },
  ]);

  const statusStyle = computed(() => {
    const s = quotation.value.status;
    if (s === 'Converted') return 'status-pill--accepted';
    if (s === 'Expired') return 'status-pill--expired';
    if (s === 'Cancelled') return 'status-pill--cancelled';
    return 'status-pill--open';
  });
</script>

<template>
  <EditPageLayout>
    <!-- ── Page header ─────────────────────────────────────────────────────── -->
    <EditPageHeader
      :title="`Offerte ${quotation.quotationNumber}`"
      :subtitle="fullName"
      :back="{ name: 'QuotationsOverview' }"
      avatar-class="qe-avatar"
    >
      <template #avatar>{{ initials }}</template>
      <template #pills>
        <span class="status-pill" :class="statusStyle">{{ quotation.status }}</span>
        <span class="status-pill status-pill--site">{{ quotation.site }}</span>
      </template>
      <template #stats>
        <div class="edit-hdr-stats">
          <div class="edit-hdr-stat">
            <span class="edit-hdr-stat-val">{{ formatTotal(totalPrice) }}</span>
            <span class="edit-hdr-stat-lbl">Totaal</span>
          </div>
          <div class="edit-hdr-stat-sep" />
          <div class="edit-hdr-stat">
            <span class="edit-hdr-stat-val">{{ productCount }}</span>
            <span class="edit-hdr-stat-lbl">Producten</span>
          </div>
          <div class="edit-hdr-stat-sep" />
          <div class="edit-hdr-stat">
            <span class="edit-hdr-stat-val">{{ quotation.orderDate.split(' ').slice(0, 3).join(' ') }}</span>
            <span class="edit-hdr-stat-lbl">Datum</span>
          </div>
        </div>
      </template>
      <template #actions>
        <Button label="Omzetten" icon="pi pi-arrow-right-arrow-left" severity="secondary" text />
        <Button icon="pi pi-ellipsis-v" severity="secondary" text rounded />
      </template>
    </EditPageHeader>

    <!-- ── Body ─────────────────────────────────────────────────────────────── -->
    <div class="edit-body">
      <EditPageNav v-model="activeSection" :groups="navGroups" />

      <div class="edit-content">
        <QuotationCustomerTab v-if="activeSection === 'customer'" />
        <QuotationOfferTab v-else-if="activeSection === 'offer'" />
        <QuotationDetailsTab v-else-if="activeSection === 'details'" />
        <QuotationCommunicationTab v-else-if="activeSection === 'communications'" />
        <QuotationTasksTab v-else-if="activeSection === 'tasks'" />
        <QuotationLogTab v-else-if="activeSection === 'logs'" />
      </div>
    </div>
  </EditPageLayout>
</template>

<style scoped>
@reference "@/assets/style.css";
  /* ── Avatar color (layout handled by shared .edit-hdr-avatar) ────────── */
  :deep(.qe-avatar) {
    background: linear-gradient(135deg, var(--p-primary-400) 0%, var(--p-primary-600) 100%);
    @apply text-white font-bold tracking-[0.03em] text-base;
  }
</style>
