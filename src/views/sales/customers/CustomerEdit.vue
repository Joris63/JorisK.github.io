<script setup lang="ts">
  import { ref, computed, provide } from 'vue';
  import EditPageLayout from '@/components/layout/EditPageLayout.vue';
  import EditPageHeader from '@/components/layout/EditPageHeader.vue';
  import EditPageNav from '@/components/layout/EditPageNav.vue';
  import type { NavGroup } from '@/components/layout/EditPageNav.vue';
  import type { CustomerData } from '@/types/customer';
  import { MOCK_CUSTOMER, MOCK_CUSTOMER_REVENUE, MOCK_CUSTOMER_QUOTATIONS } from '@/mocks/customers';

  import CustomerPersonalTab from './tabs/CustomerPersonalTab.vue';
  import CustomerAddressesTab from './tabs/CustomerAddressesTab.vue';
  import CustomerSettingsTab from './tabs/CustomerSettingsTab.vue';
  import CustomerAccountTab from './tabs/CustomerAccountTab.vue';
  import CustomerActivityLogTab from './tabs/CustomerActivityLogTab.vue';
  import CustomerQuotationsTab from './tabs/CustomerQuotationsTab.vue';
  import CustomerRevenueTab from './tabs/CustomerRevenueTab.vue';
  import CustomerCartTab from './tabs/CustomerCartTab.vue';
  import CustomerWishlistTab from './tabs/CustomerWishlistTab.vue';
  import CustomerDiscountsTab from './tabs/CustomerDiscountsTab.vue';
  import CustomerCreditTab from './tabs/CustomerCreditTab.vue';

  // ── Mock data ──────────────────────────────────────────────────────────────

  const customer = ref<CustomerData>({ ...MOCK_CUSTOMER });

  provide('customer', customer);

  // ── Header computed ─────────────────────────────────────────────────────────

  const fullName = computed(() =>
    [customer.value.salutation, customer.value.firstName, customer.value.lastName]
      .filter(Boolean)
      .join(' ')
  );

  const initials = computed(() =>
    [customer.value.firstName, customer.value.lastName]
      .filter(Boolean)
      .map((s) => s[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  );

  // ── Header stats data (local copies for header display) ────────────────────

  const revenuePerYear = MOCK_CUSTOMER_REVENUE;
  const quotations = MOCK_CUSTOMER_QUOTATIONS;

  // ── Navigation ─────────────────────────────────────────────────────────────

  const activeSection = ref('details');

  const navGroups = computed<NavGroup[]>(() => [
    {
      label: 'Klantgegevens',
      items: [
        { id: 'details',      label: 'Persoonlijke gegevens', icon: 'pi-user'       },
        { id: 'addresses',    label: 'Adressen',              icon: 'pi-map-marker', badge: customer.value.addresses.length },
        { id: 'settings',     label: 'Instellingen',          icon: 'pi-cog'        },
        { id: 'account',      label: 'Account',               icon: 'pi-shield'     },
        { id: 'log',          label: 'Logboek',               icon: 'pi-history'    },
      ],
    },
    {
      label: 'Verkoop',
      items: [
        { id: 'quotations', label: 'Offertes', icon: 'pi-file'        },
        { id: 'revenue',    label: 'Omzet',    icon: 'pi-chart-bar'   },
        { id: 'credit',     label: 'Krediet',  icon: 'pi-credit-card' },
      ],
    },
    {
      label: 'Winkel',
      items: [
        { id: 'cart',      label: 'Winkelwagen',    icon: 'pi-shopping-cart', badge: customer.value.cart.length || undefined        },
        { id: 'wishlists', label: 'Verlanglijsten', icon: 'pi-heart',         badge: customer.value.wishlists.length || undefined   },
        { id: 'discounts', label: 'Kortingen',      icon: 'pi-tag'                                                                  },
      ],
    },
  ]);
</script>

<template>
  <EditPageLayout>
    <!-- ── Page header ─────────────────────────────────────────────────────── -->
    <EditPageHeader
      :title="fullName"
      :subtitle="customer.email"
      :back="{ name: 'CustomersOverview' }"
      avatar-class="ce-avatar"
    >
      <template #avatar>{{ initials }}</template>
      <template #pills>
        <span class="status-pill status-pill--open">B2B</span>
        <span class="status-pill status-pill--active">Account {{ customer.accountStatus.toLowerCase() }}</span>
      </template>
      <template #stats>
        <div class="edit-hdr-stats">
          <div class="edit-hdr-stat">
            <span class="edit-hdr-stat-val">€ {{ revenuePerYear.reduce((s, o) => s + o.revenue, 0).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.') }}</span>
            <span class="edit-hdr-stat-lbl">Omzet</span>
          </div>
          <div class="edit-hdr-stat-sep" />
          <div class="edit-hdr-stat">
            <span class="edit-hdr-stat-val">{{ quotations.length }}</span>
            <span class="edit-hdr-stat-lbl">Offertes</span>
          </div>
          <div class="edit-hdr-stat-sep" />
          <div class="edit-hdr-stat">
            <span class="edit-hdr-stat-val">{{ customer.addresses.length }}</span>
            <span class="edit-hdr-stat-lbl">Adressen</span>
          </div>
          <div class="edit-hdr-stat-sep" />
          <div class="edit-hdr-stat">
            <span class="edit-hdr-stat-val">{{ customer.wishlists.length }}</span>
            <span class="edit-hdr-stat-lbl">Verlanglijsten</span>
          </div>
        </div>
      </template>
      <template #actions>
        <Button icon="pi pi-ellipsis-v" severity="secondary" text rounded />
      </template>
    </EditPageHeader>

    <!-- ── Body ────────────────────────────────────────────────────────────── -->
    <div class="edit-body">
      <EditPageNav v-model="activeSection" :groups="navGroups" />
      <div class="edit-content">
        <CustomerPersonalTab v-if="activeSection === 'details'" />
        <CustomerAddressesTab v-else-if="activeSection === 'addresses'" />
        <CustomerSettingsTab v-else-if="activeSection === 'settings'" />
        <CustomerAccountTab v-else-if="activeSection === 'account'" />
        <CustomerActivityLogTab v-else-if="activeSection === 'log'" />
        <CustomerQuotationsTab v-else-if="activeSection === 'quotations'" />
        <CustomerRevenueTab v-else-if="activeSection === 'revenue'" />
        <CustomerCartTab v-else-if="activeSection === 'cart'" />
        <CustomerWishlistTab v-else-if="activeSection === 'wishlists'" />
        <CustomerDiscountsTab v-else-if="activeSection === 'discounts'" />
        <CustomerCreditTab v-else-if="activeSection === 'credit'" />
      </div>
    </div>
  </EditPageLayout>
</template>

<style scoped>
@reference "@/assets/style.css";
  /* ── Avatar color (layout handled by shared .edit-hdr-avatar) ────────── */
  :deep(.ce-avatar) {
    background: linear-gradient(135deg, var(--p-primary-400) 0%, var(--p-primary-600) 100%);
    @apply text-white font-bold tracking-[0.03em] text-base;
  }
</style>
