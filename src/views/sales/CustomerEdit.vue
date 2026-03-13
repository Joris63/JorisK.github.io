<script setup lang="ts">
  import { ref, computed, provide } from 'vue';
  import { useRouter } from 'vue-router';
  import type { CustomerData, OmzetPerJaar, CustomerOfferte } from '@/types/customer';

  import CustomerPersonalTab from './tabs/customer/CustomerPersonalTab.vue';
  import CustomerAddressesTab from './tabs/customer/CustomerAddressesTab.vue';
  import CustomerSettingsTab from './tabs/customer/CustomerSettingsTab.vue';
  import CustomerAccountTab from './tabs/customer/CustomerAccountTab.vue';
  import CustomerLogboekTab from './tabs/customer/CustomerLogboekTab.vue';
  import CustomerOffertesTab from './tabs/customer/CustomerOffertesTab.vue';
  import CustomerOmzetTab from './tabs/customer/CustomerOmzetTab.vue';
  import CustomerCartTab from './tabs/customer/CustomerCartTab.vue';
  import CustomerWishlistTab from './tabs/customer/CustomerWishlistTab.vue';
  import CustomerKortingenTab from './tabs/customer/CustomerKortingenTab.vue';
  import CustomerKredietTab from './tabs/customer/CustomerKredietTab.vue';

  const router = useRouter();

  // ── Mock data ──────────────────────────────────────────────────────────────

  const customer = ref<CustomerData>({
    id: 3,
    bedrijfsnaam: 'Kamminga Installatietechniek B.V.',
    btwLand: 'NL',
    btwNummer: '851234567B01',
    kvkNummer: '68123456',
    typeBedrijf: 'MKB',
    aanhef: 'Dhr.',
    siteview: 'swnl-nl',
    voornaam: 'Joris',
    achternaam: 'Kamminga',
    email: 'joris.kamminga@sawiday.com',
    telefoonLand: 'BE',
    telefoon: '32318950',
    geboortedatum: new Date(1989, 2, 15),
    betaalmethode: 'Bankoverschrijving',
    voorkeurShowroom: 'Utrecht',
    toonPrijzen: 'Excl. BTW',
    nieuwsbrief: true,
    afspraakURLsActief: true,
    afspraakURLs: {
      swnl: 'https://www.sanitairwinkel.nl/showroom-consult/b2b/MTIxNQ==/',
      swbeNl: 'https://www.sawiday.be/nl-be/showroom-consult/b2b/MTIxNQ==/',
      swbeFr: 'https://www.sawiday.be/fr-be/showroom-consult/b2b/MTIxNQ==/',
    },
    financieelEmail: 'administratie@kamminga-install.nl',
    reviewsActief: true,
    reviewInactiefReden: null,
    kanBetalenOpRekening: true,
    debiteurNummer: 'DEB-00234',
    kredietlimiet: 15000,
    vervaldagenFactuur: 30,
    tijdelijkKredietToestaan: true,
    tijdelijkKredietLimiet: 2500,
    tijdelijkKredietVervalDatum: new Date(2026, 2, 31),
    opmerkingen:
      'Vaste klant sinds 2019. Heeft voorkeur voor telefonisch contact. Let op: altijd factuur per post sturen naast de digitale verzending.',
    basisKorting: 2.5,
    merkKortingen: [
      { id: 1, merk: 'Grohe', korting: 12, standaardKorting: 8 },
      { id: 2, merk: 'Villeroy & Boch', korting: 10, standaardKorting: 7 },
      { id: 3, merk: 'Geberit', korting: 8, standaardKorting: 5 },
      { id: 4, merk: 'Hansgrohe', korting: 15, standaardKorting: 10 },
    ],
    productKortingen: [
      {
        id: 1,
        productcode: 'SW1175 20',
        product: 'Saniclass klikwaste afvoerplug - 5/4" - chroom',
        prijs: 25.99,
        kortingPrijs: 22.09,
      },
      {
        id: 2,
        productcode: 'SW285741 3',
        product: 'Plieger Nexus rechthoekige spiegel met LED verlichting 60x80cm',
        prijs: 189.0,
        kortingPrijs: 160.65,
      },
      {
        id: 3,
        productcode: 'SW103948 22',
        product: 'Grohe Eurosmart wastafelkraan - opbouw - uitloop 12.5cm - chroom',
        prijs: 124.5,
        kortingPrijs: 105.83,
      },
    ],
    accountStatus: 'Actief',
    accountLaatsteLogin: '22 februari 2026 18:10',
    addresses: [
      {
        id: 1,
        naam: 'Dhr. Joris Kamminga',
        straat: 'Verdiplein',
        huisnummer: '80',
        postcode: '5049NP',
        woonplaats: 'Tilburg',
        land: 'Nederland',
        telefoon: '0683626242',
        isStandaardBezorg: true,
        isStandaardFactuur: true,
      },
      {
        id: 2,
        naam: 'Fam. Joris Kamminga',
        straat: 'Generaal Smutslaan',
        huisnummer: '544',
        postcode: '5025AJ',
        woonplaats: 'Tilburg',
        land: 'Nederland',
        telefoon: '+31683626242',
        isStandaardBezorg: false,
        isStandaardFactuur: false,
      },
    ],
    cart: [
      {
        id: 1,
        naam: 'Saniclass klikwaste afvoerplug - 5/4" - chroom',
        productcode: 'SW1175 20',
        aantal: 1,
        prijs: 25.99,
      },
    ],
    wishlists: [
      {
        id: 1,
        naam: 'Mijn verlanglijst',
        items: [
          {
            id: 1,
            naam: 'Baldocer Ceramica Arkety vloertegel - 60x60cm - 10mm - Vierkant - gerectificeerd - Betonlook - bit bone mat',
            productcode: 'SW359616 14',
            aantal: 1,
            prijs: 57.19,
          },
          {
            id: 2,
            naam: 'Villeroy & Boch Pro architectura 3.0 vloertegel 5x5cm - 6mm mat R9 lagoon blue',
            productcode: 'SW494512 17',
            aantal: 1,
            prijs: 89.1,
          },
          {
            id: 3,
            naam: 'The Mosaic Factory Barcelona mozaïektegel - 28.2x32.1cm - wandtegel - Zeshoek/Hexagon - Porselein - Bronze Metallic (brons) - per stuk',
            productcode: 'SW397934 11',
            aantal: 1,
            prijs: 29.95,
          },
          {
            id: 4,
            naam: 'Fortifura Galeria Douchedeur - 80x200cm - scharnieren - deurgreep - vlak - helder veiligheidsglas - Geborsteld RVS',
            productcode: 'SW1122594 19',
            aantal: 1,
            prijs: 354.99,
          },
          {
            id: 5,
            naam: 'Fortifura Galeria Douchecabine - 90x120x200cm - scharnieren - deurgreep - vlak - gesatineerd veiligheidsglas - Geborsteld RVS PVD (Rvs)',
            productcode: 'SW1222270 19',
            aantal: 1,
            prijs: 761.99,
          },
          {
            id: 6,
            naam: 'Wiesbaden Caral inbouw doucheset rond met 20cm hoofddouche wandarm staafhanddouche mat zwart',
            productcode: 'SW242774 9',
            aantal: 1,
            prijs: 692.99,
          },
          {
            id: 7,
            naam: 'Fortifura Galeria Douchecabine - 100x90x200cm - scharnieren - deurgreep - vlak - rookglas - Geborsteld RVS PVD (Rvs)',
            productcode: 'SW1222126 19',
            aantal: 1,
            prijs: 741.99,
          },
        ],
      },
      {
        id: 2,
        naam: 'Badkamer verbouwing',
        items: [
          {
            id: 8,
            naam: 'Plieger Nexus rechthoekige spiegel met indirecte LED verlichting 60x80cm',
            productcode: 'SW285741 3',
            aantal: 1,
            prijs: 189.0,
          },
          {
            id: 9,
            naam: 'Wiesbaden Vigo vrijstaand bad 170x75cm acryl glanzend wit',
            productcode: 'SW641820 5',
            aantal: 1,
            prijs: 649.0,
          },
          {
            id: 10,
            naam: 'Grohe Eurosmart wastafelkraan - opbouw - uitloop 12.5cm - chroom',
            productcode: 'SW103948 22',
            aantal: 2,
            prijs: 124.5,
          },
          {
            id: 11,
            naam: 'Duravit D-Neo inbouwwastafel 60x40cm - 1 kraangat - wit',
            productcode: 'SW882310 8',
            aantal: 1,
            prijs: 312.0,
          },
          {
            id: 12,
            naam: 'Geberit UP320 inbouwreservoir - diepspoel - voor wand-wc - inclusief bedieningsplaat',
            productcode: 'SW114406 14',
            aantal: 1,
            prijs: 278.95,
          },
        ],
      },
    ],
    geleverdNietBetaald: [
      {
        id: 1,
        levering: 'LVR-2024-8821',
        factuurnummer: 'INV-20241105',
        factuurdatum: '5 nov 2024',
        vervaldatum: '19 nov 2024',
        waarde: 1842.3,
        vervaldatumOverschreden: true,
      },
      {
        id: 2,
        levering: 'LVR-2025-1034',
        factuurnummer: 'INV-20250318',
        factuurdatum: '18 mrt 2025',
        vervaldatum: '1 apr 2025',
        waarde: 14.95,
        vervaldatumOverschreden: true,
      },
      {
        id: 3,
        levering: 'LVR-2026-0218',
        factuurnummer: 'INV-20260218',
        factuurdatum: '18 feb 2026',
        vervaldatum: '19 mrt 2026',
        waarde: 654.8,
        vervaldatumOverschreden: false,
      },
    ],
    gereserveerdKredietItems: [
      {
        id: 1,
        levering: 'LVR-2026-0309',
        status: 'Bevestigd',
        dropshipping: false,
        ingeplandeDatum: '15 mrt 2026',
        waarde: 3210.55,
      },
      {
        id: 2,
        levering: 'LVR-2026-0312',
        status: 'In behandeling',
        dropshipping: true,
        ingeplandeDatum: '20 mrt 2026',
        waarde: 892.0,
      },
    ],
    kredietIngepland: [
      {
        id: 1,
        levering: 'LVR-2026-0288',
        status: 'Voltooid',
        voltooid: true,
        ingeplandeDatum: '5 mrt 2026',
        waarde: 380.2,
      },
      {
        id: 2,
        levering: 'LVR-2026-0301',
        status: 'Ingepland',
        voltooid: false,
        ingeplandeDatum: '12 mrt 2026',
        waarde: 1540.0,
      },
    ],
    kredietAankomend: [
      { id: 1, levering: 'LVR-2026-0315', ingeplandeDatum: '18 mrt 2026', waarde: 2100.0 },
      { id: 2, levering: 'LVR-2026-0318', ingeplandeDatum: '22 mrt 2026', waarde: 750.5 },
    ],
  });

  provide('customer', customer);

  // ── Header computed ─────────────────────────────────────────────────────────

  const fullName = computed(() =>
    [customer.value.aanhef, customer.value.voornaam, customer.value.achternaam]
      .filter(Boolean)
      .join(' ')
  );

  const initials = computed(() =>
    [customer.value.voornaam, customer.value.achternaam]
      .filter(Boolean)
      .map((s) => s[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  );

  // ── Header stats data (local copies for header display) ────────────────────

  const omzetPerJaar: OmzetPerJaar[] = [
    { jaar: 2025, omzet: 14.95 },
    { jaar: 2024, omzet: 1842.3 },
    { jaar: 2023, omzet: 3210.55 },
  ];

  const offertes: CustomerOfferte[] = [
    {
      id: 1,
      offertenummer: '1761598',
      datum: '19 mei 2022 14:53',
      door: 'Job Vermue',
      prijs: 3666.83,
      status: 'Geaccepteerd',
      opmerkingen: 0,
    },
    {
      id: 2,
      offertenummer: '1895180',
      datum: '20 oktober 2022 15:07',
      door: 'Bart Onstenk',
      prijs: 1595.1,
      status: 'Geaccepteerd',
      opmerkingen: 0,
    },
    {
      id: 3,
      offertenummer: '1917050',
      datum: '11 november 2022 12:22',
      door: 'Bart Onstenk',
      prijs: 2405.34,
      status: 'Geaccepteerd',
      opmerkingen: 0,
    },
    {
      id: 4,
      offertenummer: '2005823',
      datum: '03 februari 2023 16:01',
      door: 'Mark Roeters',
      prijs: 10380.6,
      status: 'Geaccepteerd',
      opmerkingen: 0,
    },
    {
      id: 5,
      offertenummer: '2697404',
      datum: '18 maart 2025 10:42',
      door: 'Luke Derkzen',
      prijs: 14.95,
      status: 'Niet geaccepteerd',
      opmerkingen: 0,
    },
  ];

  // ── Navigation ─────────────────────────────────────────────────────────────

  const activeSection = ref('gegevens');

  const navGroups = [
    {
      label: 'Klantgegevens',
      items: [
        { id: 'gegevens', label: 'Persoonlijke gegevens', icon: 'pi-user' },
        { id: 'adressen', label: 'Adressen', icon: 'pi-map-marker' },
        { id: 'instellingen', label: 'Instellingen', icon: 'pi-cog' },
        { id: 'account', label: 'Account', icon: 'pi-shield' },
        { id: 'logboek', label: 'Logboek', icon: 'pi-history' },
      ],
    },
    {
      label: 'Verkoop',
      items: [
        { id: 'offertes', label: 'Offertes', icon: 'pi-file' },
        { id: 'omzet', label: 'Omzet', icon: 'pi-chart-bar' },
        { id: 'krediet', label: 'Krediet', icon: 'pi-credit-card' },
      ],
    },
    {
      label: 'Winkel',
      items: [
        { id: 'winkelwagen', label: 'Winkelwagen', icon: 'pi-shopping-cart' },
        { id: 'verlanglijst', label: 'Verlanglijsten', icon: 'pi-heart' },
        { id: 'kortingen', label: 'Kortingen', icon: 'pi-tag' },
      ],
    },
  ];
</script>

<template>
  <div class="ce-page">
    <!-- ── Page header ─────────────────────────────────────────────────────── -->
    <div class="ce-header">
      <Button
        icon="pi pi-arrow-left"
        severity="secondary"
        text
        rounded
        @click="router.push({ name: 'CustomersOverview' })"
      />
      <div class="ce-avatar">{{ initials }}</div>
      <div class="ce-header-info">
        <div class="ce-header-top">
          <span class="ce-title">{{ fullName }}</span>
          <span class="ce-pill ce-pill--credit">B2B</span>
          <span class="ce-pill ce-pill--active"
            >Account {{ customer.accountStatus.toLowerCase() }}</span
          >
        </div>
        <span class="ce-subtitle">{{ customer.email }}</span>
      </div>
      <div class="ce-hdr-stats">
        <div class="ce-hdr-stat">
          <span class="ce-hdr-stat-val"
            >€
            {{
              omzetPerJaar
                .reduce((s, o) => s + o.omzet, 0)
                .toFixed(0)
                .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
            }}</span
          >
          <span class="ce-hdr-stat-lbl">Omzet</span>
        </div>
        <div class="ce-hdr-stat-sep" />
        <div class="ce-hdr-stat">
          <span class="ce-hdr-stat-val">{{ offertes.length }}</span>
          <span class="ce-hdr-stat-lbl">Offertes</span>
        </div>
        <div class="ce-hdr-stat-sep" />
        <div class="ce-hdr-stat">
          <span class="ce-hdr-stat-val">{{ customer.addresses.length }}</span>
          <span class="ce-hdr-stat-lbl">Adressen</span>
        </div>
        <div class="ce-hdr-stat-sep" />
        <div class="ce-hdr-stat">
          <span class="ce-hdr-stat-val">{{ customer.wishlists.length }}</span>
          <span class="ce-hdr-stat-lbl">Verlanglijsten</span>
        </div>
      </div>
      <Button icon="pi pi-ellipsis-v" severity="secondary" text rounded style="margin-left: auto" />
    </div>

    <!-- ── Body ────────────────────────────────────────────────────────────── -->
    <div class="ce-body">
      <!-- ── Sidebar nav ─────────────────────────────────────────────────── -->
      <nav class="ce-nav">
        <template v-for="group in navGroups" :key="group.label">
          <div class="ce-nav-group">{{ group.label }}</div>
          <button
            v-for="item in group.items"
            :key="item.id"
            class="ce-nav-item"
            :class="{ 'ce-nav-item--active': activeSection === item.id }"
            @click="activeSection = item.id"
          >
            <i class="pi nav-icon" :class="item.icon" />
            <span>{{ item.label }}</span>
            <span v-if="item.id === 'adressen'" class="nav-badge">{{
              customer.addresses.length
            }}</span>
            <span v-if="item.id === 'winkelwagen' && customer.cart.length" class="nav-badge">{{
              customer.cart.length
            }}</span>
            <span
              v-if="item.id === 'verlanglijst' && customer.wishlists.length"
              class="nav-badge"
              >{{ customer.wishlists.length }}</span
            >
          </button>
        </template>
      </nav>

      <!-- ── Content ────────────────────────────────────────────────────── -->
      <div class="ce-content">
        <CustomerPersonalTab v-if="activeSection === 'gegevens'" />
        <CustomerAddressesTab v-else-if="activeSection === 'adressen'" />
        <CustomerSettingsTab v-else-if="activeSection === 'instellingen'" />
        <CustomerAccountTab v-else-if="activeSection === 'account'" />
        <CustomerLogboekTab v-else-if="activeSection === 'logboek'" />
        <CustomerOffertesTab v-else-if="activeSection === 'offertes'" />
        <CustomerOmzetTab v-else-if="activeSection === 'omzet'" />
        <CustomerCartTab v-else-if="activeSection === 'winkelwagen'" />
        <CustomerWishlistTab v-else-if="activeSection === 'verlanglijst'" />
        <CustomerKortingenTab v-else-if="activeSection === 'kortingen'" />
        <CustomerKredietTab v-else-if="activeSection === 'krediet'" />
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* ── Page ────────────────────────────────────────────────────────────── */
  .ce-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: clip;
  }

  /* ── Header ──────────────────────────────────────────────────────────── */
  .ce-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.25rem;
    border-bottom: 1px solid var(--p-gray-100);
    background: white;
    flex-shrink: 0;
  }
  .ce-avatar {
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
  .ce-header-info {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .ce-header-top {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-wrap: wrap;
  }
  .ce-title {
    font-size: 1.0625rem;
    font-weight: 600;
    color: var(--p-surface-800);
    line-height: 1.2;
  }
  .ce-subtitle {
    font-size: 0.8125rem;
    color: var(--p-surface-400);
  }

  /* ── Header pills ────────────────────────────────────────────────────── */
  .ce-pill {
    font-size: 0.6875rem;
    font-weight: 600;
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    border: 1px solid;
    line-height: 1.5;
    width: fit-content;
  }
  .ce-pill--type {
    background: var(--p-primary-50);
    color: var(--p-primary-700);
    border-color: var(--p-primary-100);
  }
  .ce-pill--active {
    background: #dcfce7;
    color: #166534;
    border-color: #bbf7d0;
  }
  .ce-pill--credit {
    background: #eff6ff;
    color: #1e40af;
    border-color: #bfdbfe;
  }

  /* ── Header stats ────────────────────────────────────────────────────── */
  .ce-hdr-stats {
    display: flex;
    align-items: center;
    border-left: 1px solid var(--p-gray-100);
    border-right: 1px solid var(--p-gray-100);
    margin: 0 0.5rem;
    padding: 0 0.25rem;
  }
  .ce-hdr-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 1rem;
  }
  .ce-hdr-stat-val {
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--p-surface-800);
    line-height: 1.3;
  }
  .ce-hdr-stat-lbl {
    font-size: 0.6875rem;
    color: var(--p-surface-400);
    white-space: nowrap;
  }
  .ce-hdr-stat-sep {
    width: 1px;
    height: 2rem;
    background: var(--p-gray-100);
    flex-shrink: 0;
  }

  /* ── Body & sidebar nav ──────────────────────────────────────────────── */
  .ce-body {
    display: flex;
    flex: 1;
    overflow: clip;
  }
  .ce-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: clip;
  }
  .ce-nav {
    width: 13rem;
    flex-shrink: 0;
    border-right: 1px solid var(--p-gray-100);
    overflow-y: auto;
    padding: 0.5rem 0 1rem;
    background: white;
  }
  .ce-nav-group {
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--p-surface-400);
    padding: 1rem 1.25rem 0.25rem;
  }
  .ce-nav-item {
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
  .ce-nav-item:not(.ce-nav-item--active):hover {
    background: var(--p-gray-50);
    color: var(--p-surface-800);
  }
  .ce-nav-item--active {
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
  .ce-nav-item--active .nav-icon {
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
  .ce-nav-item--active .nav-badge {
    background: var(--p-primary-100);
    color: var(--p-primary-700);
  }
</style>
