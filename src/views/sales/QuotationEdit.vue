<script setup lang="ts">
  import { ref, computed, provide } from 'vue';
  import { useRouter } from 'vue-router';
  import QuotationCustomerTab from './tabs/quotation/QuotationCustomerTab.vue';
  import QuotationOfferTab from './tabs/quotation/QuotationOfferTab.vue';
  import QuotationDetailsTab from './tabs/quotation/QuotationDetailsTab.vue';
  import QuotationCommunicationTab from './tabs/quotation/QuotationCommunicationTab.vue';
  import QuotationTasksTab from './tabs/quotation/QuotationTasksTab.vue';
  import QuotationLogTab from './tabs/quotation/QuotationLogTab.vue';
  import type { QuotationData } from '@/types/quotations';

  const router = useRouter();

  // ── Mock data ──────────────────────────────────────────────────────────────

  const quotation = ref<QuotationData>({
    offertenummer: '3028059',
    status: 'Open',
    site: 'sanitairwinkel.nl',

    voornaam: 'Mariëlle',
    achternaam: 'Vos-Hartman',
    land: 'Nederland',
    straat: 'Oude Kerkstraat',
    huisnummer: '38',
    toevoeging: 'B',
    postcode: '2514CR',
    woonplaats: 'Den Haag',
    telefoonLand: 'NL',
    telefoon: '0703456789',
    alternatief: '0612345678',

    klantEmail: 'm.vos-hartman@example.nl',
    klantHeeftAccount: true,
    klantType: 'Particulier',

    besteldatum: '14 februari 2026 11:03',
    geholpenDoor: 'Sophie Meijer',
    kanaal: 'Showroom',
    vestiging: 'Den Haag',
    wanneerVerbouwenJaar: '2026',
    wanneerVerbouwenMaand: 'juni',
    referentie: 'Verbouwing badkamer + toilet',

    aanbevolen: {
      bedrijf: 'Klant Jan de Groot',
      woonplaats: 'Den Haag',
      typeBedrijf: 'Particulier',
    },
    aannemer: {
      bedrijf: 'Installatiebedrijf Smit & Zonen',
      woonplaats: 'Rijswijk',
      typeBedrijf: 'Installateur',
    },

    groups: [
      {
        id: '0',
        naam: 'Badkamer',
        lines: [
          {
            id: 1,
            productcode: 'SW721043 2',
            naam: 'Wiesbaden inloopdouche 120x200cm - 8mm veiligheidsglas - chroom',
            levertijd: '2-4 werkdagen',
            voorraad: 'op-voorraad',
            aantal: 1,
            prijsOud: 1299.0,
            prijs: 1089.0,
          },
          {
            id: 2,
            productcode: 'SW514882 7',
            naam: 'QeramiQ Ducks toiletpot rimless - diepspoel - glans wit',
            levertijd: '1-2 werkdagen',
            voorraad: 'op-voorraad',
            aantal: 1,
            prijs: 349.0,
          },
          {
            id: 3,
            productcode: 'SW309417 1',
            naam: 'Hotbath Cobber thermostaatkraan - 2-weg - chroom',
            levertijd: '3-5 werkdagen',
            voorraad: 'beperkt',
            aantal: 1,
            prijsOud: 589.0,
            prijs: 499.0,
          },
          {
            id: 4,
            productcode: 'SW102931 8',
            naam: 'Villeroy & Boch Subway 2.0 opzetwastafel 50cm - glans wit',
            levertijd: '1-2 werkdagen',
            voorraad: 'op-voorraad',
            aantal: 1,
            prijs: 219.0,
          },
        ],
      },
      {
        id: '1',
        naam: 'Toilet',
        lines: [
          {
            id: 5,
            productcode: 'SW884102 5',
            naam: 'Geberit UP320 inbouwreservoir - 12cm - wit',
            levertijd: '2-3 werkdagen',
            voorraad: 'op-voorraad',
            aantal: 1,
            prijs: 189.0,
          },
          {
            id: 6,
            productcode: 'SW774231 9',
            naam: 'Geberit Sigma20 bedieningsplaat - glans chroom / mat chroom',
            levertijd: '1-2 werkdagen',
            voorraad: 'op-voorraad',
            aantal: 1,
            prijs: 129.0,
          },
        ],
      },
      {
        id: '2',
        naam: 'Tegels & Afwerking',
        lines: [
          {
            id: 7,
            productcode: 'SW302100 4',
            naam: 'De Beer Isolatiemat EPS 100 - 10m² - R=2.0',
            levertijd: '2-4 werkdagen',
            voorraad: 'op-voorraad',
            aantal: 3,
            prijs: 119.0,
          },
          {
            id: 8,
            productcode: 'SW189021 3',
            naam: 'Sanicare HVS radiator 60x120cm - 690W - mat zwart',
            levertijd: '4-6 werkdagen',
            voorraad: 'niet-op-voorraad',
            aantal: 1,
            prijsOud: 499.0,
            prijs: 429.0,
          },
        ],
      },
    ],

    emails: [
      {
        id: 1,
        datum: '14 feb 2026 11:18',
        onderwerp: 'Uw offerte 3028059',
        naar: 'm.vos-hartman@example.nl',
        type: 'Offerte',
      },
      {
        id: 2,
        datum: '21 feb 2026 14:32',
        onderwerp: 'Herinnering offerte 3028059',
        naar: 'm.vos-hartman@example.nl',
        type: 'Herinnering',
      },
      {
        id: 3,
        datum: '27 feb 2026 09:05',
        onderwerp: 'Aanpassing offerte 3028059',
        naar: 'm.vos-hartman@example.nl',
        type: 'Offerte',
      },
    ],

    opmerkingen: [
      {
        id: 1,
        datum: '14 feb 2026 11:45',
        tekst: 'Klant wil graag dezelfde leverancier als vorige badkamer.',
        voor: 'Inkoop',
        gebruiker: 'Sophie Meijer',
      },
      {
        id: 2,
        datum: '21 feb 2026 10:12',
        tekst: 'Levering graag na 1 april i.v.m. aannemer planning.',
        voor: 'Logistiek',
        gebruiker: 'Sophie Meijer',
      },
      {
        id: 3,
        datum: '27 feb 2026 09:30',
        tekst: 'Prijs inloopdouche aangepast na overleg met klant.',
        voor: 'Verkoop',
        gebruiker: 'Sophie Meijer',
      },
    ],

    documenten: [
      {
        id: 1,
        naam: 'Offerte_3028059_v1.pdf',
        datum: '14 feb 2026',
        type: 'Offerte',
      },
      {
        id: 2,
        naam: 'Offerte_3028059_v2.pdf',
        datum: '27 feb 2026',
        type: 'Offerte',
      },
      {
        id: 3,
        naam: 'Tekening_badkamer.pdf',
        datum: '10 feb 2026',
        type: 'Bijlage',
      },
    ],

    taken: [
      {
        id: 2816302,
        omschrijving: 'Offerte opvolgen na herinnering',
        deadline: '7 mrt 2026',
        status: 'Niet begonnen',
        afdeling: 'Verkoop',
        gebruiker: 'Sophie Meijer',
        eigenaar: 'Sophie Meijer',
      },
      {
        id: 2816415,
        omschrijving: 'Leveringstijd inloopdouche bevestigen bij leverancier',
        deadline: '5 mrt 2026',
        status: 'In behandeling',
        afdeling: 'Inkoop',
        gebruiker: 'Bas Kuijpers',
        eigenaar: 'Sophie Meijer',
      },
      {
        id: 2816891,
        omschrijving: 'Prijsaanpassing verwerken in offerte',
        deadline: '28 feb 2026',
        status: 'Afgerond',
        afdeling: 'Verkoop',
        gebruiker: 'Sophie Meijer',
        eigenaar: 'Sophie Meijer',
      },
    ],

    productLog: [
      {
        id: 1,
        datum: '14 feb 2026 11:03',
        productId: '721043',
        productcode: 'SW721043 2',
        omschrijving: 'Wiesbaden inloopdouche 120x200cm',
        aantal: 1,
        prijs: 1299.0,
        actie: 'Toegevoegd',
        gebruiker: 'Sophie Meijer',
      },
      {
        id: 2,
        datum: '14 feb 2026 11:05',
        productId: '514882',
        productcode: 'SW514882 7',
        omschrijving: 'QeramiQ Ducks toiletpot rimless',
        aantal: 1,
        prijs: 349.0,
        actie: 'Toegevoegd',
        gebruiker: 'Sophie Meijer',
      },
      {
        id: 3,
        datum: '14 feb 2026 11:07',
        productId: '309417',
        productcode: 'SW309417 1',
        omschrijving: 'Hotbath Cobber thermostaatkraan',
        aantal: 1,
        prijs: 589.0,
        actie: 'Toegevoegd',
        gebruiker: 'Sophie Meijer',
      },
      {
        id: 4,
        datum: '27 feb 2026 09:02',
        productId: '721043',
        productcode: 'SW721043 2',
        omschrijving: 'Wiesbaden inloopdouche 120x200cm',
        aantal: 1,
        prijs: 1089.0,
        actie: 'Gewijzigd',
        gebruiker: 'Sophie Meijer',
      },
      {
        id: 5,
        datum: '27 feb 2026 09:04',
        productId: '309417',
        productcode: 'SW309417 1',
        omschrijving: 'Hotbath Cobber thermostaatkraan',
        aantal: 1,
        prijs: 499.0,
        actie: 'Gewijzigd',
        gebruiker: 'Sophie Meijer',
      },
    ],

    algemeenLog: [
      {
        id: 1,
        datum: '14 feb 2026 11:03',
        omschrijving: 'Offerte aangemaakt',
        actie: 'Aangemaakt',
        gebruiker: 'Sophie Meijer',
      },
      {
        id: 2,
        datum: '14 feb 2026 11:18',
        omschrijving: 'Offerte e-mail verstuurd naar klant',
        actie: 'E-mail verstuurd',
        gebruiker: 'Systeem',
      },
      {
        id: 3,
        datum: '21 feb 2026 14:32',
        omschrijving: 'Herinnering e-mail verstuurd',
        actie: 'E-mail verstuurd',
        gebruiker: 'Systeem',
      },
      {
        id: 4,
        datum: '27 feb 2026 09:05',
        omschrijving: 'Offerte bijgewerkt na klantoverleg',
        actie: 'Gewijzigd',
        gebruiker: 'Sophie Meijer',
      },
      {
        id: 5,
        datum: '27 feb 2026 09:05',
        omschrijving: 'Aangepaste offerte e-mail verstuurd',
        actie: 'E-mail verstuurd',
        gebruiker: 'Systeem',
      },
    ],
  });

  provide('quotation', quotation);

  // ── Header computed ─────────────────────────────────────────────────────────

  const fullName = computed(() =>
    [quotation.value.voornaam, quotation.value.achternaam].filter(Boolean).join(' ')
  );

  const initials = computed(() =>
    [quotation.value.voornaam, quotation.value.achternaam]
      .filter(Boolean)
      .map((s) => s[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  );

  const productCount = computed(() =>
    quotation.value.groups.reduce((sum, g) => sum + g.lines.reduce((s, l) => s + l.aantal, 0), 0)
  );

  const totalPrice = computed(() =>
    quotation.value.groups.reduce(
      (sum, g) => sum + g.lines.reduce((s, l) => s + l.prijs * l.aantal, 0),
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

  const navGroups = [
    {
      label: 'Offerte',
      items: [
        { id: 'customer', label: 'Klant', icon: 'pi-user' },
        { id: 'offer', label: 'Aanbod', icon: 'pi-shopping-cart' },
        { id: 'details', label: 'Offerte gegevens', icon: 'pi-cog' },
        { id: 'communications', label: 'Communicatie', icon: 'pi-comment' },
        { id: 'tasks', label: 'Taken', icon: 'pi-list-check' },
        { id: 'logs', label: 'Log', icon: 'pi-history' },
      ],
    },
  ];

  const statusStyle = computed(() => {
    const s = quotation.value.status;
    if (s === 'Omgezet') return 'qe-pill--accepted';
    if (s === 'Verlopen') return 'qe-pill--expired';
    if (s === 'Geannuleerd') return 'qe-pill--cancelled';
    return 'qe-pill--open';
  });
</script>

<template>
  <div class="qe-page">
    <!-- ── Page header ─────────────────────────────────────────────────────── -->
    <div class="qe-header">
      <Button
        icon="pi pi-arrow-left"
        severity="secondary"
        text
        rounded
        @click="router.push({ name: 'QuotationsOverview' })"
      />
      <div class="qe-avatar">{{ initials }}</div>
      <div class="qe-header-info">
        <div class="qe-header-top">
          <span class="qe-title">Offerte {{ quotation.offertenummer }}</span>
          <span class="qe-pill" :class="statusStyle">{{ quotation.status }}</span>
          <span class="qe-pill qe-pill--site">{{ quotation.site }}</span>
        </div>
        <span class="qe-subtitle">{{ fullName }}</span>
      </div>
      <div class="qe-hdr-stats">
        <div class="qe-hdr-stat">
          <span class="qe-hdr-stat-val">{{ formatTotal(totalPrice) }}</span>
          <span class="qe-hdr-stat-lbl">Totaal</span>
        </div>
        <div class="qe-hdr-stat-sep" />
        <div class="qe-hdr-stat">
          <span class="qe-hdr-stat-val">{{ productCount }}</span>
          <span class="qe-hdr-stat-lbl">Producten</span>
        </div>
        <div class="qe-hdr-stat-sep" />
        <div class="qe-hdr-stat">
          <span class="qe-hdr-stat-val">{{
            quotation.besteldatum.split(' ').slice(0, 3).join(' ')
          }}</span>
          <span class="qe-hdr-stat-lbl">Datum</span>
        </div>
      </div>
      <div style="margin-left: auto; display: flex; gap: 0.5rem; align-items: center">
        <Button
          label="Omzetten"
          icon="pi pi-arrow-right-arrow-left"
          severity="secondary"
          text
        />
        <Button icon="pi pi-ellipsis-v" severity="secondary" text rounded />
      </div>
    </div>

    <!-- ── Body ────────────────────────────────────────────────────────────── -->
    <div class="qe-body">
      <!-- ── Sidebar nav ─────────────────────────────────────────────────── -->
      <nav class="qe-nav">
        <template v-for="group in navGroups" :key="group.label">
          <div class="qe-nav-group">{{ group.label }}</div>
          <button
            v-for="item in group.items"
            :key="item.id"
            class="qe-nav-item"
            :class="{ 'qe-nav-item--active': activeSection === item.id }"
            @click="activeSection = item.id"
          >
            <i class="pi nav-icon" :class="item.icon" />
            <span>{{ item.label }}</span>
            <span v-if="item.id === 'tasks' && quotation.taken.length" class="nav-badge">
              {{ quotation.taken.length }}
            </span>
          </button>
        </template>
      </nav>

      <!-- ── Content ────────────────────────────────────────────────────── -->
      <div class="qe-content">
        <QuotationCustomerTab v-if="activeSection === 'customer'" />
        <QuotationOfferTab v-else-if="activeSection === 'offer'" />
        <QuotationDetailsTab v-else-if="activeSection === 'details'" />
        <QuotationCommunicationTab v-else-if="activeSection === 'communications'" />
        <QuotationTasksTab v-else-if="activeSection === 'tasks'" />
        <QuotationLogTab v-else-if="activeSection === 'logs'" />
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* ── Page ────────────────────────────────────────────────────────────── */
  .qe-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: clip;
  }

  /* ── Header ──────────────────────────────────────────────────────────── */
  .qe-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.25rem;
    border-bottom: 1px solid var(--p-gray-100);
    background: white;
    flex-shrink: 0;
  }
  .qe-avatar {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--p-primary-400) 0%, var(--p-primary-600) 100%);
    color: white;
    font-size: 0.875rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    letter-spacing: 0.03em;
  }
  .qe-header-info {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .qe-header-top {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-wrap: wrap;
  }
  .qe-title {
    font-size: 1.0625rem;
    font-weight: 600;
    color: var(--p-surface-800);
    line-height: 1.2;
  }
  .qe-subtitle {
    font-size: 0.8125rem;
    color: var(--p-surface-400);
  }

  /* ── Header pills ────────────────────────────────────────────────────── */
  .qe-pill {
    font-size: 0.6875rem;
    font-weight: 600;
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    border: 1px solid;
    line-height: 1.5;
    width: fit-content;
  }
  .qe-pill--open {
    background: #eff6ff;
    color: #1e40af;
    border-color: #bfdbfe;
  }
  .qe-pill--accepted {
    background: #dcfce7;
    color: #166534;
    border-color: #bbf7d0;
  }
  .qe-pill--expired {
    background: #fef9c3;
    color: #854d0e;
    border-color: #fef08a;
  }
  .qe-pill--cancelled {
    background: #fee2e2;
    color: #991b1b;
    border-color: #fecaca;
  }
  .qe-pill--site {
    background: var(--p-primary-50);
    color: var(--p-primary-700);
    border-color: var(--p-primary-100);
  }

  /* ── Header stats ────────────────────────────────────────────────────── */
  .qe-hdr-stats {
    display: flex;
    align-items: center;
    border-left: 1px solid var(--p-gray-100);
    border-right: 1px solid var(--p-gray-100);
    margin: 0 0.5rem;
    padding: 0 0.25rem;
  }
  .qe-hdr-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 1rem;
  }
  .qe-hdr-stat-val {
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--p-surface-800);
    line-height: 1.3;
  }
  .qe-hdr-stat-lbl {
    font-size: 0.6875rem;
    color: var(--p-surface-400);
    white-space: nowrap;
  }
  .qe-hdr-stat-sep {
    width: 1px;
    height: 2rem;
    background: var(--p-gray-100);
    flex-shrink: 0;
  }

  /* ── Body & sidebar nav ──────────────────────────────────────────────── */
  .qe-body {
    display: flex;
    flex: 1;
    overflow: clip;
  }
  .qe-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: clip;
  }
  .qe-nav {
    width: 13rem;
    flex-shrink: 0;
    border-right: 1px solid var(--p-gray-100);
    overflow-y: auto;
    padding: 0.5rem 0 1rem;
    background: white;
  }
  .qe-nav-group {
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--p-surface-400);
    padding: 1rem 1.25rem 0.25rem;
  }
  .qe-nav-item {
    display: flex;
    align-items: center;
    gap: 0.575rem;
    width: 100%;
    padding: 0.4375rem 1rem 0.4375rem 1.125rem;
    text-align: left;
    background: none;
    border: none;
    border-left: 2px solid transparent;
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--p-surface-600);
    transition:
      background 0.1s,
      color 0.1s;
  }
  .qe-nav-item:hover {
    background: var(--p-gray-50);
    color: var(--p-surface-800);
  }
  .qe-nav-item--active {
    color: var(--p-primary-600);
    font-weight: 500;
    background: var(--p-primary-50);
    border-left-color: var(--p-primary-500);
  }
  .nav-icon {
    font-size: 0.8125rem;
    width: 1rem;
    text-align: center;
    flex-shrink: 0;
    opacity: 0.7;
  }
  .qe-nav-item--active .nav-icon {
    opacity: 1;
  }
  .nav-badge {
    margin-left: auto;
    background: var(--p-gray-100);
    color: var(--p-surface-500);
    font-size: 0.6875rem;
    font-weight: 600;
    min-width: 1.25rem;
    padding: 0.1rem 0.375rem;
    border-radius: 999px;
    text-align: center;
    line-height: 1.4;
  }
  .qe-nav-item--active .nav-badge {
    background: var(--p-primary-100);
    color: var(--p-primary-700);
  }
</style>
