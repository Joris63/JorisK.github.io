<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import AddressDrawer, { type AddressForm } from './components/AddressDrawer.vue';

  const router = useRouter();

  // ── Types ──────────────────────────────────────────────────────────────────

  interface CustomerAddress {
    id: number;
    naam: string;
    straat: string;
    huisnummer: string;
    postcode: string;
    woonplaats: string;
    land: string;
    telefoon: string;
    isStandaardBezorg: boolean;
    isStandaardFactuur: boolean;
  }

  interface CartItem {
    id: number;
    naam: string;
    productcode: string;
    aantal: number;
    prijs: number;
  }

  interface WishlistItem {
    id: number;
    naam: string;
    productcode: string;
    aantal: number;
    prijs: number;
  }

  interface Wishlist {
    id: number;
    naam: string;
    items: WishlistItem[];
  }

  interface MerkKorting {
    id: number;
    merk: string;
    korting: number;
    standaardKorting: number;
  }

  interface ProductKorting {
    id: number;
    productcode: string;
    product: string;
    prijs: number;
    kortingPrijs: number;
  }

  interface GeleverdItem {
    id: number;
    levering: string;
    factuurnummer: string;
    factuurdatum: string;
    vervaldatum: string;
    waarde: number;
    vervaldatumOverschreden: boolean;
  }

  interface GereserveerdItem {
    id: number;
    levering: string;
    status: string;
    dropshipping: boolean;
    ingeplandeDatum: string;
    waarde: number;
  }

  interface KredietIngeplandItem {
    id: number;
    levering: string;
    status: string;
    voltooid: boolean;
    ingeplandeDatum: string;
    waarde: number;
  }

  interface KredietAankomendeItem {
    id: number;
    levering: string;
    ingeplandeDatum: string;
    waarde: number;
  }

  interface CustomerData {
    id: number;
    bedrijfsnaam: string;
    btwLand: string;
    btwNummer: string;
    kvkNummer: string;
    typeBedrijf: string | null;
    aanhef: string | null;
    siteview: string;
    voornaam: string;
    achternaam: string;
    email: string;
    telefoonLand: string;
    telefoon: string;
    geboortedatum: Date | null;
    betaalmethode: string | null;
    voorkeurShowroom: string | null;
    toonPrijzen: string;
    nieuwsbrief: boolean;
    afspraakURLsActief: boolean;
    afspraakURLs: { swnl: string; swbeNl: string; swbeFr: string };
    financieelEmail: string;
    reviewsActief: boolean;
    reviewInactiefReden: string | null;
    kanBetalenOpRekening: boolean;
    debiteurNummer: string;
    kredietlimiet: number;
    vervaldagenFactuur: number;
    tijdelijkKredietToestaan: boolean;
    tijdelijkKredietLimiet: number;
    tijdelijkKredietVervalDatum: Date | null;
    opmerkingen: string;
    basisKorting: number;
    merkKortingen: MerkKorting[];
    productKortingen: ProductKorting[];
    accountStatus: string;
    accountLaatsteLogin: string;
    addresses: CustomerAddress[];
    cart: CartItem[];
    wishlists: Wishlist[];
    geleverdNietBetaald: GeleverdItem[];
    gereserveerdKredietItems: GereserveerdItem[];
    kredietIngepland: KredietIngeplandItem[];
    kredietAankomend: KredietAankomendeItem[];
  }

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

  const cartSubtotal = computed(() =>
    customer.value.cart.reduce((sum, i) => sum + i.prijs * i.aantal, 0)
  );

  // ── Options ────────────────────────────────────────────────────────────────

  const aanhefOptions = ['Fam.', 'Dhr.', 'Mevr.'];
  const btwLandOptions = ['NL', 'BE', 'DE', 'FR'];
  const typeBedrijfOptions = ['Particulier', 'ZZP', 'MKB', 'Grootzakelijk'];
  const telefoonLandOptions = [
    { label: '+31', value: 'NL' },
    { label: '+32', value: 'BE' },
    { label: '+33', value: 'FR' },
    { label: '+49', value: 'DE' },
  ];
  const betaalmethodeOptions = ['iDEAL', 'Bankoverschrijving', 'Creditcard', 'Klarna'];
  const showroomOptions = ['Amsterdam', 'Rotterdam', 'Utrecht', 'Den Haag'];
  const toonPrijzenOptions = ['Incl. BTW', 'Excl. BTW'];
  const reviewInactiefRedenOptions = ['Email vertraagd', 'Weigering', 'Overig'];

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  // ── Omzet ──────────────────────────────────────────────────────────────────

  interface OmzetPerJaar {
    jaar: number;
    omzet: number;
  }

  const omzetPerJaar: OmzetPerJaar[] = [
    { jaar: 2025, omzet: 14.95 },
    { jaar: 2024, omzet: 1842.3 },
    { jaar: 2023, omzet: 3210.55 },
  ];

  // ── Logboek ────────────────────────────────────────────────────────────────

  interface LogboekEntry {
    id: number;
    gebruiker: string;
    datum: string;
    eigenschap: string;
    oudeWaarde: string;
    nieuweWaarde: string;
  }

  const logboek: LogboekEntry[] = [
    {
      id: 1,
      gebruiker: 'nejat.karanzai@sawiday.com',
      datum: '24 februari 2025 15:22',
      eigenschap: 'vatCode',
      oudeWaarde: '0',
      nieuweWaarde: 'NL',
    },
    {
      id: 2,
      gebruiker: 'webshop@sawiday.com',
      datum: '03 december 2024 06:30',
      eigenschap: 'temporaryCreditExpireDate',
      oudeWaarde: '2024-12-02',
      nieuweWaarde: '0',
    },
    {
      id: 3,
      gebruiker: 'richard.laven@sawiday.com',
      datum: '25 november 2024 11:49',
      eigenschap: 'temporaryCreditExpireDate',
      oudeWaarde: '0',
      nieuweWaarde: '2024-12-02',
    },
    {
      id: 4,
      gebruiker: 'webshop@sawiday.com',
      datum: '17 mei 2024 11:01',
      eigenschap: 'phoneNumber',
      oudeWaarde: '0651302704',
      nieuweWaarde: '+31651302704',
    },
    {
      id: 5,
      gebruiker: 'webshop@sawiday.com',
      datum: '21 december 2023 11:16',
      eigenschap: 'companyType',
      oudeWaarde: '',
      nieuweWaarde: 'Installateur',
    },
    {
      id: 6,
      gebruiker: 'akin.bektas@sawiday.com',
      datum: '07 augustus 2023 11:49',
      eigenschap: 'isPayAfterAllowed',
      oudeWaarde: '0',
      nieuweWaarde: '1',
    },
  ];

  // ── Offertes ───────────────────────────────────────────────────────────────

  interface Offerte {
    id: number;
    offertenummer: string;
    datum: string;
    door: string;
    prijs: number;
    status: string;
    opmerkingen: number;
  }

  const offertes: Offerte[] = [
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

  // ── Address drawer ─────────────────────────────────────────────────────────

  const addrDrawerVisible = ref(false);
  const addrDrawerAddress = ref<AddressForm | null>(null);

  function openAddAddress() {
    addrDrawerAddress.value = null;
    addrDrawerVisible.value = true;
  }

  function openEditAddress(addr: CustomerAddress) {
    addrDrawerAddress.value = {
      id: addr.id,
      aanhef: null,
      voornaam: addr.naam,
      achternaam: '',
      telefoonLand: '+31',
      telefoon: addr.telefoon,
      terAttentieVan: '',
      land: addr.land,
      postcode: addr.postcode,
      huisnummer: addr.huisnummer,
      toevoeging: '',
      straat: addr.straat,
      woonplaats: addr.woonplaats,
    };
    addrDrawerVisible.value = true;
  }

  function saveAddress(data: AddressForm) {
    if (data.id) {
      const idx = customer.value.addresses.findIndex((a) => a.id === data.id);
      if (idx !== -1) {
        customer.value.addresses[idx] = {
          ...customer.value.addresses[idx],
          naam: [data.aanhef, data.voornaam, data.achternaam].filter(Boolean).join(' '),
          straat: data.straat,
          huisnummer: data.huisnummer,
          postcode: data.postcode,
          woonplaats: data.woonplaats,
          land: data.land,
          telefoon: `${data.telefoonLand} ${data.telefoon}`.trim(),
        };
      }
    } else {
      const newId = Math.max(0, ...customer.value.addresses.map((a) => a.id)) + 1;
      customer.value.addresses.push({
        id: newId,
        naam: [data.aanhef, data.voornaam, data.achternaam].filter(Boolean).join(' '),
        straat: data.straat,
        huisnummer: data.huisnummer,
        postcode: data.postcode,
        woonplaats: data.woonplaats,
        land: data.land,
        telefoon: `${data.telefoonLand} ${data.telefoon}`.trim(),
        isStandaardBezorg: false,
        isStandaardFactuur: false,
      });
    }
  }

  function deleteAddress(id: number) {
    customer.value.addresses = customer.value.addresses.filter((a) => a.id !== id);
  }

  function makeStandaardBezorg(id: number) {
    customer.value.addresses.forEach((a) => {
      a.isStandaardBezorg = a.id === id;
    });
  }

  function makeStandaardFactuur(id: number) {
    customer.value.addresses.forEach((a) => {
      a.isStandaardFactuur = a.id === id;
    });
  }

  // ── Wishlist ───────────────────────────────────────────────────────────────

  const selectedWishlistId = ref<number>(customer.value.wishlists[0]?.id ?? 0);

  const selectedWishlist = computed(
    () => customer.value.wishlists.find((w) => w.id === selectedWishlistId.value) ?? null
  );

  // ── Account ────────────────────────────────────────────────────────────────

  const newAccountEmail = ref('');
  const emailWijzigenVisible = ref(false);

  function openEmailWijzigen() {
    newAccountEmail.value = '';
    emailWijzigenVisible.value = true;
  }
  function submitEmailWijzigen() {
    // TODO: call API
    emailWijzigenVisible.value = false;
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  const activeSection = ref('gegevens');

  // ── Edit mode ──────────────────────────────────────────────────────────────

  const isEditingBedrijf = ref(false);
  const isEditingPersoonlijk = ref(false);
  const isEditingVoorkeuren = ref(false);
  const isEditingInstellingen = ref(false);
  const isEditingKrediet = ref(false);
  const isEditingBasisKorting = ref(false);

  const merkKortingenOpen = ref(true);
  const productKortingenOpen = ref(true);
  const merkFilter = ref('');
  const productFilter = ref('');

  const filteredMerkKortingen = computed(() => {
    const q = merkFilter.value.toLowerCase();
    return customer.value.merkKortingen.filter((m) => m.merk.toLowerCase().includes(q));
  });

  const filteredProductKortingen = computed(() => {
    const q = productFilter.value.toLowerCase();
    return customer.value.productKortingen.filter(
      (p) => p.product.toLowerCase().includes(q) || p.productcode.toLowerCase().includes(q)
    );
  });

  // ── Krediet computed ───────────────────────────────────────────────────────

  const geleverdNietBetaaldOpen = ref(true);
  const gereserveerdKredietOpen = ref(true);
  const kredietIngeplandOpen = ref(true);
  const kredietAankomendeOpen = ref(true);

  const geleverdNietBetaaldTotaal = computed(() =>
    customer.value.geleverdNietBetaald.reduce((s, i) => s + i.waarde, 0)
  );
  const vervaldatumOverschreden = computed(() =>
    customer.value.geleverdNietBetaald
      .filter((i) => i.vervaldatumOverschreden)
      .reduce((s, i) => s + i.waarde, 0)
  );
  const gereserveerdKredietTotaal = computed(() =>
    customer.value.gereserveerdKredietItems.reduce((s, i) => s + i.waarde, 0)
  );
  const kredietIngeplandTotaal = computed(() =>
    customer.value.kredietIngepland.reduce((s, i) => s + i.waarde, 0)
  );
  const kredietAankomendeTotal = computed(() =>
    customer.value.kredietAankomend.reduce((s, i) => s + i.waarde, 0)
  );
  const kredietResterend = computed(
    () =>
      customer.value.kredietlimiet -
      geleverdNietBetaaldTotaal.value -
      gereserveerdKredietTotaal.value
  );

  watch(activeSection, () => {
    isEditingBedrijf.value = false;
    isEditingPersoonlijk.value = false;
    isEditingVoorkeuren.value = false;
    isEditingInstellingen.value = false;
    isEditingKrediet.value = false;
    isEditingBasisKorting.value = false;
  });

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
          <span class="ce-pill ce-pill--active">{{ customer.accountStatus }}</span>
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
        <!-- Persoonlijke gegevens -->
        <template v-if="activeSection === 'gegevens'">
          <div class="tab-scroll">
            <!-- Card: Bedrijfsgegevens -->
            <div class="view-card">
              <div class="view-card-hdr">
                <span class="view-card-title">Bedrijfsgegevens</span>
                <template v-if="!isEditingBedrijf">
                  <Button
                    label="Bewerken"
                    icon="pi pi-pencil"
                    size="small"
                    severity="secondary"
                    text
                    @click="isEditingBedrijf = true"
                  />
                </template>
                <template v-else>
                  <div class="flex gap-2">
                    <Button
                      label="Annuleren"
                      size="small"
                      severity="secondary"
                      outlined
                      @click="isEditingBedrijf = false"
                    />
                    <Button label="Opslaan" size="small" @click="isEditingBedrijf = false" />
                  </div>
                </template>
              </div>
              <Transition name="card-fade" mode="out-in">
                <div v-if="!isEditingBedrijf" key="view" class="view-card-body">
                  <div class="fr-row">
                    <span class="fr-label">Type bedrijf</span>
                    <span :class="customer.typeBedrijf ? 'fr-value' : 'fr-empty'">{{
                      customer.typeBedrijf || '—'
                    }}</span>
                  </div>
                  <div class="fr-row">
                    <span class="fr-label">Bedrijfsnaam</span>
                    <span :class="customer.bedrijfsnaam ? 'fr-value' : 'fr-empty'">{{
                      customer.bedrijfsnaam || '—'
                    }}</span>
                  </div>
                  <div class="fr-row">
                    <span class="fr-label">BTW-nummer</span>
                    <span :class="customer.btwNummer ? 'fr-value' : 'fr-empty'">{{
                      customer.btwNummer ? `${customer.btwLand} ${customer.btwNummer}` : '—'
                    }}</span>
                  </div>
                  <div class="fr-row">
                    <span class="fr-label">KVK-nummer</span>
                    <span :class="customer.kvkNummer ? 'fr-value' : 'fr-empty'">{{
                      customer.kvkNummer || '—'
                    }}</span>
                  </div>
                </div>
                <div v-else key="edit" class="view-card-body">
                  <div class="fr-row">
                    <label class="fr-label">Type bedrijf</label>
                    <Select
                      v-model="customer.typeBedrijf"
                      :options="typeBedrijfOptions"
                      class="w-full"
                      placeholder="Type bedrijf"
                      show-clear
                    />
                  </div>
                  <div class="fr-row">
                    <label class="fr-label">Bedrijfsnaam</label>
                    <InputText
                      v-model="customer.bedrijfsnaam"
                      class="w-full"
                      placeholder="Bedrijfsnaam"
                    />
                  </div>
                  <div class="fr-row">
                    <label class="fr-label">BTW-nummer</label>
                    <div class="flex gap-2">
                      <Select
                        v-model="customer.btwLand"
                        :options="btwLandOptions"
                        style="width: 7.5rem"
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
                      <InputText
                        v-model="customer.btwNummer"
                        class="flex-1"
                        placeholder="BTW-nummer"
                      />
                    </div>
                  </div>
                  <div class="fr-row">
                    <label class="fr-label">KVK-nummer</label>
                    <InputText
                      v-model="customer.kvkNummer"
                      class="w-full"
                      placeholder="KVK-nummer"
                    />
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Card: Persoonlijke gegevens -->
            <div class="view-card">
              <div class="view-card-hdr">
                <span class="view-card-title">Persoonlijke gegevens</span>
                <template v-if="!isEditingPersoonlijk">
                  <Button
                    label="Bewerken"
                    icon="pi pi-pencil"
                    size="small"
                    severity="secondary"
                    text
                    @click="isEditingPersoonlijk = true"
                  />
                </template>
                <template v-else>
                  <div class="flex gap-2">
                    <Button
                      label="Annuleren"
                      size="small"
                      severity="secondary"
                      outlined
                      @click="isEditingPersoonlijk = false"
                    />
                    <Button label="Opslaan" size="small" @click="isEditingPersoonlijk = false" />
                  </div>
                </template>
              </div>
              <Transition name="card-fade" mode="out-in">
                <div v-if="!isEditingPersoonlijk" key="view" class="view-card-body">
                  <div class="fr-row">
                    <span class="fr-label">Aanhef</span>
                    <span :class="customer.aanhef ? 'fr-value' : 'fr-empty'">{{
                      customer.aanhef || '—'
                    }}</span>
                  </div>
                  <div class="fr-row">
                    <span class="fr-label">Voornaam</span>
                    <span class="fr-value">{{ customer.voornaam }}</span>
                  </div>
                  <div class="fr-row">
                    <span class="fr-label">Achternaam</span>
                    <span class="fr-value">{{ customer.achternaam }}</span>
                  </div>
                  <div class="fr-row">
                    <span class="fr-label">E-mail</span>
                    <span class="fr-value">{{ customer.email }}</span>
                  </div>
                  <div class="fr-row">
                    <span class="fr-label">Telefoonnummer</span>
                    <span :class="customer.telefoon ? 'fr-value' : 'fr-empty'">{{
                      customer.telefoon
                        ? `${telefoonLandOptions.find((o) => o.value === customer.telefoonLand)?.label} ${customer.telefoon}`
                        : '—'
                    }}</span>
                  </div>
                  <div class="fr-row">
                    <span class="fr-label">Geboortedatum</span>
                    <span :class="customer.geboortedatum ? 'fr-value' : 'fr-empty'">{{
                      customer.geboortedatum?.toLocaleDateString('nl-NL') || '—'
                    }}</span>
                  </div>
                  <div class="fr-row">
                    <span class="fr-label">Siteview</span>
                    <span class="fr-value">{{ customer.siteview }}</span>
                  </div>
                </div>
                <div v-else key="edit" class="view-card-body">
                  <div class="fr-row">
                    <label class="fr-label">Aanhef</label>
                    <SelectButton v-model="customer.aanhef" :options="aanhefOptions" size="small" />
                  </div>
                  <div class="fr-row">
                    <label class="fr-label">Voornaam <span class="fr-req">*</span></label>
                    <InputText v-model="customer.voornaam" class="w-full" placeholder="Voornaam" />
                  </div>
                  <div class="fr-row">
                    <label class="fr-label">Achternaam <span class="fr-req">*</span></label>
                    <InputText
                      v-model="customer.achternaam"
                      class="w-full"
                      placeholder="Achternaam"
                    />
                  </div>
                  <div class="fr-row">
                    <span class="fr-label">E-mail</span>
                    <span class="fr-value">{{ customer.email }}</span>
                  </div>
                  <div class="fr-row">
                    <label class="fr-label">Telefoonnummer</label>
                    <div class="flex gap-2">
                      <Select
                        :options="telefoonLandOptions"
                        v-model="customer.telefoonLand"
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
                            <span>{{
                              telefoonLandOptions.find((o) => o.value === value)?.label
                            }}</span>
                          </div>
                        </template>
                      </Select>
                      <InputText
                        v-model="customer.telefoon"
                        class="flex-1"
                        placeholder="Telefoonnummer"
                      />
                    </div>
                  </div>
                  <div class="fr-row">
                    <label class="fr-label">Geboortedatum</label>
                    <DatePicker
                      v-model="customer.geboortedatum"
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
              </Transition>
            </div>

            <!-- Card: Voorkeuren -->
            <div class="view-card">
              <div class="view-card-hdr">
                <span class="view-card-title">Voorkeuren</span>
                <template v-if="!isEditingVoorkeuren">
                  <Button
                    label="Bewerken"
                    icon="pi pi-pencil"
                    size="small"
                    severity="secondary"
                    text
                    @click="isEditingVoorkeuren = true"
                  />
                </template>
                <template v-else>
                  <div class="flex gap-2">
                    <Button
                      label="Annuleren"
                      size="small"
                      severity="secondary"
                      outlined
                      @click="isEditingVoorkeuren = false"
                    />
                    <Button label="Opslaan" size="small" @click="isEditingVoorkeuren = false" />
                  </div>
                </template>
              </div>
              <Transition name="card-fade" mode="out-in">
                <div v-if="!isEditingVoorkeuren" key="view" class="view-card-body">
                  <div class="fr-row">
                    <span class="fr-label">Betaalmethode</span>
                    <span :class="customer.betaalmethode ? 'fr-value' : 'fr-empty'">{{
                      customer.betaalmethode || '—'
                    }}</span>
                  </div>
                  <div class="fr-row">
                    <span class="fr-label">Voorkeur showroom</span>
                    <span :class="customer.voorkeurShowroom ? 'fr-value' : 'fr-empty'">{{
                      customer.voorkeurShowroom || '—'
                    }}</span>
                  </div>
                  <div class="fr-row">
                    <span class="fr-label">Toon prijzen</span>
                    <span class="fr-value">{{ customer.toonPrijzen }}</span>
                  </div>
                  <div class="fr-row">
                    <span class="fr-label">Nieuwsbrief</span>
                    <span :class="customer.nieuwsbrief ? 'fr-value' : 'fr-empty'">{{
                      customer.nieuwsbrief ? 'Aangemeld' : '—'
                    }}</span>
                  </div>
                </div>
                <div v-else key="edit" class="view-card-body">
                  <div class="fr-row">
                    <label class="fr-label">Betaalmethode</label>
                    <Select
                      v-model="customer.betaalmethode"
                      :options="betaalmethodeOptions"
                      class="w-full"
                      placeholder="Betaalmethode"
                      show-clear
                    />
                  </div>
                  <div class="fr-row">
                    <label class="fr-label">Voorkeur showroom</label>
                    <Select
                      v-model="customer.voorkeurShowroom"
                      :options="showroomOptions"
                      class="w-full"
                      placeholder="Voorkeur showroom"
                      show-clear
                    />
                  </div>
                  <div class="fr-row">
                    <label class="fr-label">Toon prijzen</label>
                    <SelectButton
                      v-model="customer.toonPrijzen"
                      :options="toonPrijzenOptions"
                      size="small"
                    />
                  </div>
                  <div class="fr-row">
                    <label class="fr-label">Nieuwsbrief</label>
                    <div class="flex items-center gap-2">
                      <Checkbox v-model="customer.nieuwsbrief" binary input-id="nieuwsbrief" />
                      <label for="nieuwsbrief" class="text-sm text-surface-600 cursor-pointer"
                        >Aangemeld voor nieuwsbrief</label
                      >
                    </div>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Card: Afspraken URLs -->
            <div class="view-card">
              <div class="view-card-hdr">
                <span class="view-card-title">Afspraken URLs</span>
                <div class="flex items-center gap-2">
                  <ToggleSwitch v-model="customer.afspraakURLsActief" />
                  <span class="view-card-toggle-lbl">{{
                    customer.afspraakURLsActief ? 'Actief' : 'Inactief'
                  }}</span>
                </div>
              </div>
              <div v-if="customer.afspraakURLsActief" class="view-card-body">
                <div class="fr-row">
                  <span class="fr-label">SWNL</span>
                  <div class="url-row">
                    <span class="fr-value url-text">{{ customer.afspraakURLs.swnl }}</span>
                    <Button
                      icon="pi pi-copy"
                      size="small"
                      severity="secondary"
                      text
                      @click="copyToClipboard(customer.afspraakURLs.swnl)"
                    />
                  </div>
                </div>
                <div class="fr-row">
                  <span class="fr-label">SWBE (Nederlandstalig)</span>
                  <div class="url-row">
                    <span class="fr-value url-text">{{ customer.afspraakURLs.swbeNl }}</span>
                    <Button
                      icon="pi pi-copy"
                      size="small"
                      severity="secondary"
                      text
                      @click="copyToClipboard(customer.afspraakURLs.swbeNl)"
                    />
                  </div>
                </div>
                <div class="fr-row">
                  <span class="fr-label">SWBE (Franstalig)</span>
                  <div class="url-row">
                    <span class="fr-value url-text">{{ customer.afspraakURLs.swbeFr }}</span>
                    <Button
                      icon="pi pi-copy"
                      size="small"
                      severity="secondary"
                      text
                      @click="copyToClipboard(customer.afspraakURLs.swbeFr)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Adressen -->
        <template v-else-if="activeSection === 'adressen'">
          <div class="tab-scroll">
            <div class="addr-topbar">
              <Button
                label="Nieuw adres toevoegen"
                icon="pi pi-plus"
                size="small"
                @click="openAddAddress"
              />
            </div>
            <div class="addr-grid">
              <div v-for="addr in customer.addresses" :key="addr.id" class="addr-card">
                <div class="addr-card-head">
                  <div class="addr-name">{{ addr.naam }}</div>
                  <div class="addr-card-actions">
                    <Button
                      icon="pi pi-pencil"
                      severity="secondary"
                      text
                      rounded
                      size="small"
                      @click="openEditAddress(addr)"
                    />
                    <Button
                      v-if="!addr.isStandaardBezorg && !addr.isStandaardFactuur"
                      icon="pi pi-trash"
                      severity="danger"
                      text
                      rounded
                      size="small"
                      @click="deleteAddress(addr.id)"
                    />
                  </div>
                </div>
                <div class="addr-line">
                  {{ addr.straat }} {{ addr.huisnummer }}, {{ addr.postcode }} {{ addr.woonplaats }}
                </div>
                <div class="addr-line">{{ addr.land }}</div>
                <div v-if="addr.telefoon" class="addr-line">{{ addr.telefoon }}</div>
                <div class="addr-chips">
                  <button
                    class="addr-chip"
                    :class="addr.isStandaardBezorg ? 'addr-chip--active' : 'addr-chip--inactive'"
                    :disabled="addr.isStandaardBezorg"
                    @click="makeStandaardBezorg(addr.id)"
                  >
                    <i class="pi" :class="addr.isStandaardBezorg ? 'pi-check' : 'pi-home'" />
                    Bezorgadres
                  </button>
                  <button
                    class="addr-chip"
                    :class="addr.isStandaardFactuur ? 'addr-chip--active' : 'addr-chip--inactive'"
                    :disabled="addr.isStandaardFactuur"
                    @click="makeStandaardFactuur(addr.id)"
                  >
                    <i class="pi" :class="addr.isStandaardFactuur ? 'pi-check' : 'pi-file'" />
                    Factuuradres
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Instellingen -->
        <template v-else-if="activeSection === 'instellingen'">
          <div class="tab-scroll">
            <!-- Card: Instellingen -->
            <div class="view-card">
              <div class="view-card-hdr">
                <span class="view-card-title">Instellingen</span>
                <template v-if="!isEditingInstellingen">
                  <Button
                    label="Bewerken"
                    icon="pi pi-pencil"
                    size="small"
                    severity="secondary"
                    text
                    @click="isEditingInstellingen = true"
                  />
                </template>
                <template v-else>
                  <div class="flex gap-2">
                    <Button
                      label="Annuleren"
                      size="small"
                      severity="secondary"
                      outlined
                      @click="isEditingInstellingen = false"
                    />
                    <Button label="Opslaan" size="small" @click="isEditingInstellingen = false" />
                  </div>
                </template>
              </div>
              <Transition name="card-fade" mode="out-in">
                <div v-if="!isEditingInstellingen" key="view" class="view-card-body">
                  <div class="fr-row">
                    <span class="fr-label">Financieel e-mailadres</span>
                    <span class="fr-value">{{ customer.financieelEmail || '—' }}</span>
                  </div>
                  <div class="fr-row">
                    <span class="fr-label">Reviews</span>
                    <span class="fr-value">{{
                      customer.reviewsActief ? 'Actief' : 'Inactief'
                    }}</span>
                  </div>
                  <div v-if="!customer.reviewsActief" class="fr-row">
                    <span class="fr-label">Inactief reden</span>
                    <span class="fr-value">{{ customer.reviewInactiefReden || '—' }}</span>
                  </div>
                  <div class="fr-row fr-row--top">
                    <span class="fr-label">Opmerkingen</span>
                    <span
                      :class="customer.opmerkingen ? 'fr-value' : 'fr-empty'"
                      style="white-space: pre-wrap"
                      >{{ customer.opmerkingen || '—' }}</span
                    >
                  </div>
                </div>
                <div v-else key="edit" class="view-card-body">
                  <div class="fr-row">
                    <label class="fr-label">Financieel e-mailadres</label>
                    <InputText
                      v-model="customer.financieelEmail"
                      class="w-full"
                      placeholder="Financieel e-mailadres"
                    />
                  </div>
                  <div class="fr-row">
                    <label class="fr-label">Reviews</label>
                    <div class="flex items-center gap-3">
                      <ToggleSwitch v-model="customer.reviewsActief" input-id="reviews" />
                      <label for="reviews" class="text-sm text-surface-600 cursor-pointer"
                        >Reviews actief</label
                      >
                    </div>
                  </div>
                  <div v-if="!customer.reviewsActief" class="fr-row">
                    <label class="fr-label">Inactief reden</label>
                    <Select
                      v-model="customer.reviewInactiefReden"
                      :options="reviewInactiefRedenOptions"
                      class="w-full"
                      placeholder="Selecteer reden"
                      show-clear
                    />
                  </div>
                  <div class="fr-row fr-row--top">
                    <label class="fr-label">Opmerkingen</label>
                    <Textarea
                      v-model="customer.opmerkingen"
                      class="w-full"
                      :rows="4"
                      placeholder="Opmerkingen"
                      auto-resize
                    />
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Card: Krediet -->
            <div class="view-card">
              <div class="view-card-hdr">
                <span class="view-card-title">Krediet</span>
                <template v-if="!isEditingKrediet">
                  <Button
                    label="Bewerken"
                    icon="pi pi-pencil"
                    size="small"
                    severity="secondary"
                    text
                    @click="isEditingKrediet = true"
                  />
                </template>
                <template v-else>
                  <div class="flex gap-2">
                    <Button
                      label="Annuleren"
                      size="small"
                      severity="secondary"
                      outlined
                      @click="isEditingKrediet = false"
                    />
                    <Button label="Opslaan" size="small" @click="isEditingKrediet = false" />
                  </div>
                </template>
              </div>
              <Transition name="card-fade" mode="out-in">
                <div v-if="!isEditingKrediet" key="view" class="view-card-body">
                  <div class="fr-row">
                    <span class="fr-label">Betalen op rekening</span>
                    <span class="fr-value">{{ customer.kanBetalenOpRekening ? 'Ja' : 'Nee' }}</span>
                  </div>
                  <Transition name="fade-slide">
                    <div v-if="customer.kanBetalenOpRekening">
                      <div class="fr-row">
                        <span class="fr-label">Debiteur nummer</span>
                        <span class="fr-value">{{ customer.debiteurNummer || '—' }}</span>
                      </div>
                      <div class="fr-row">
                        <span class="fr-label">Kredietlimiet</span>
                        <span class="fr-value">{{
                          customer.kredietlimiet ? `€ ${customer.kredietlimiet}` : '—'
                        }}</span>
                      </div>
                      <div class="fr-row">
                        <span class="fr-label">Vervaldagen factuur</span>
                        <span class="fr-value">{{ customer.vervaldagenFactuur }} dagen</span>
                      </div>
                      <div class="fr-row">
                        <span class="fr-label">Tijdelijk krediet</span>
                        <span class="fr-value">{{
                          customer.tijdelijkKredietToestaan ? 'Toegestaan' : 'Niet toegestaan'
                        }}</span>
                      </div>
                      <Transition name="fade-slide">
                        <div v-if="customer.tijdelijkKredietToestaan">
                          <div class="fr-row">
                            <span class="fr-label">Tijdelijk limiet</span>
                            <span class="fr-value">{{
                              customer.tijdelijkKredietLimiet
                                ? `€ ${customer.tijdelijkKredietLimiet}`
                                : '—'
                            }}</span>
                          </div>
                          <div class="fr-row">
                            <span class="fr-label">Vervaldatum</span>
                            <span class="fr-value">{{
                              customer.tijdelijkKredietVervalDatum?.toLocaleDateString('nl-NL') ||
                              '—'
                            }}</span>
                          </div>
                        </div>
                      </Transition>
                    </div>
                  </Transition>
                </div>
                <div v-else key="edit" class="view-card-body">
                  <div class="fr-row">
                    <label class="fr-label">Betalen op rekening</label>
                    <div class="flex items-center gap-3">
                      <ToggleSwitch
                        v-model="customer.kanBetalenOpRekening"
                        input-id="betalen-rekening"
                      />
                      <label for="betalen-rekening" class="text-sm text-surface-600 cursor-pointer"
                        >Kan betalen op rekening</label
                      >
                    </div>
                  </div>
                  <Transition name="fade-slide">
                    <div v-if="customer.kanBetalenOpRekening">
                      <div class="fr-row">
                        <label class="fr-label">Debiteur nummer</label>
                        <InputText
                          v-model="customer.debiteurNummer"
                          class="w-full"
                          placeholder="Debiteur nummer"
                        />
                      </div>
                      <div class="fr-row">
                        <label class="fr-label">Kredietlimiet</label>
                        <InputNumber
                          v-model="customer.kredietlimiet"
                          class="w-full"
                          placeholder="0"
                        />
                      </div>
                      <div class="fr-row">
                        <label class="fr-label">Vervaldagen factuur</label>
                        <div class="flex items-center gap-2">
                          <InputNumber
                            v-model="customer.vervaldagenFactuur"
                            style="width: 8rem"
                            placeholder="14"
                          />
                          <span class="text-sm text-surface-500">Dagen</span>
                        </div>
                      </div>
                      <div class="fr-row">
                        <label class="fr-label">Tijdelijk krediet</label>
                        <div class="flex items-center gap-3">
                          <ToggleSwitch
                            v-model="customer.tijdelijkKredietToestaan"
                            input-id="tijdelijk-krediet"
                          />
                          <label
                            for="tijdelijk-krediet"
                            class="text-sm text-surface-600 cursor-pointer"
                            >Tijdelijk krediet toestaan</label
                          >
                        </div>
                      </div>
                      <Transition name="fade-slide">
                        <div v-if="customer.tijdelijkKredietToestaan">
                          <div class="fr-row">
                            <label class="fr-label">Tijdelijk limiet</label>
                            <InputNumber
                              v-model="customer.tijdelijkKredietLimiet"
                              class="w-full"
                              placeholder="0"
                            />
                          </div>
                          <div class="fr-row">
                            <label class="fr-label">Vervaldatum</label>
                            <DatePicker
                              v-model="customer.tijdelijkKredietVervalDatum"
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
              </Transition>
            </div>
          </div>
        </template>

        <!-- Account -->
        <template v-else-if="activeSection === 'account'">
          <div class="tab-scroll">
            <!-- Card: Account informatie -->
            <div class="view-card">
              <div class="view-card-hdr">
                <span class="view-card-title">Account informatie</span>
              </div>
              <div class="view-card-body">
                <div class="fr-row">
                  <span class="fr-label">Status</span>
                  <span class="acct-status-badge">{{ customer.accountStatus }}</span>
                </div>
                <div class="fr-row">
                  <span class="fr-label">Laatste login</span>
                  <span class="fr-value">{{ customer.accountLaatsteLogin }}</span>
                </div>
              </div>
            </div>

            <!-- Card: Wachtwoord resetten -->
            <div class="view-card">
              <div class="view-card-hdr">
                <span class="view-card-title">Wachtwoord resetten</span>
              </div>
              <div class="view-card-body">
                <p class="acct-desc">
                  Als de klant niet kan inloggen op zijn account, kun je een e-mail voor het opnieuw
                  instellen van het wachtwoord naar zijn gekoppelde e-mailadres sturen.
                </p>
              </div>
              <div class="view-card-action">
                <Button
                  label="Stuur wachtwoord reset e-mail"
                  size="small"
                  severity="secondary"
                  outlined
                />
              </div>
            </div>

            <!-- Card: E-mail adres wijzigen -->
            <div class="view-card">
              <div class="view-card-hdr">
                <span class="view-card-title">E-mail adres wijzigen</span>
              </div>
              <div class="view-card-body">
                <p class="acct-desc">
                  Wijzig het e-mailadres van de klant. Er wordt een bevestigingsmail gestuurd naar
                  het nieuwe adres.
                </p>
              </div>
              <div class="view-card-action">
                <Button
                  label="Stuur wijzig e-mail adres e-mail"
                  size="small"
                  severity="secondary"
                  outlined
                  @click="openEmailWijzigen"
                />
              </div>
            </div>
          </div>
        </template>

        <!-- Omzet -->
        <template v-else-if="activeSection === 'omzet'">
          <div class="tab-scroll">
            <div class="view-card">
              <div class="view-card-hdr">
                <span class="view-card-title">Omzet per jaar</span>
                <Button
                  label="Bekijk bestellingen"
                  icon="pi pi-shopping-cart"
                  size="small"
                  severity="secondary"
                  outlined
                />
              </div>
              <DataTable :value="omzetPerJaar" class="ce-table">
                <Column field="jaar" header="Jaar" style="width: 8rem" />
                <Column field="omzet" header="Omzet">
                  <template #body="{ data }"
                    >€
                    {{ data.omzet.toLocaleString('nl-NL', { minimumFractionDigits: 2 }) }}</template
                  >
                </Column>
                <template #empty><span class="table-empty">Geen omzet gevonden</span></template>
              </DataTable>
            </div>
          </div>
        </template>

        <!-- Logboek -->
        <template v-else-if="activeSection === 'logboek'">
          <div class="tab-scroll">
            <div class="view-card">
              <div class="view-card-hdr">
                <span class="view-card-title">Logboek</span>
              </div>
              <DataTable :value="logboek" class="ce-table">
                <Column header="Gebruiker" style="width: 17rem">
                  <template #body="{ data }">
                    <a href="#" class="text-primary-600 hover:underline text-sm">{{
                      data.gebruiker
                    }}</a>
                    <div class="text-xs text-gray-400 mt-0.5">{{ data.datum }}</div>
                  </template>
                </Column>
                <Column header="Eigenschap" style="width: 13rem">
                  <template #body="{ data }">
                    <span class="log-prop">{{ data.eigenschap }}</span>
                  </template>
                </Column>
                <Column header="Wijziging">
                  <template #body="{ data }">
                    <div class="flex items-center gap-2">
                      <span class="log-old">{{ data.oudeWaarde || '—' }}</span>
                      <i class="pi pi-arrow-right text-gray-300" style="font-size: 0.7rem" />
                      <span class="log-new">{{ data.nieuweWaarde || '—' }}</span>
                    </div>
                  </template>
                </Column>
                <template #empty
                  ><span class="table-empty">Geen activiteit gevonden</span></template
                >
              </DataTable>
            </div>
          </div>
        </template>

        <!-- Offertes -->
        <template v-else-if="activeSection === 'offertes'">
          <div class="tab-scroll">
            <div class="view-card">
              <div class="view-card-hdr">
                <span class="view-card-title">Offertes</span>
              </div>
              <DataTable :value="offertes" class="ce-table">
                <Column field="offertenummer" header="Offertenummer" style="width: 9rem" />
                <Column field="datum" header="Datum aangemaakt" style="width: 13rem" />
                <Column field="door" header="Door" />
                <Column
                  field="prijs"
                  header="Prijs"
                  style="width: 9rem"
                  :pt="{ columnheadercontent: { class: 'justify-end!' } }"
                  body-class="text-right!"
                >
                  <template #body="{ data }">
                    €
                    {{ data.prijs.toLocaleString('nl-NL', { minimumFractionDigits: 2 }) }}
                  </template>
                </Column>
                <Column
                  field="status"
                  header="Status"
                  style="width: 14rem"
                  :pt="{ columnheadercontent: { class: 'justify-center!' } }"
                  body-class="text-center!"
                >
                  <template #body="{ data }">
                    <span
                      class="offerte-badge"
                      :class="
                        data.status === 'Geaccepteerd'
                          ? 'offerte-badge--success'
                          : 'offerte-badge--warn'
                      "
                    >
                      {{ data.status }}
                    </span>
                  </template>
                </Column>
                <Column field="opmerkingen" header="Opmerkingen" style="width: 9rem">
                  <template #body="{ data }">{{ data.opmerkingen || 'Geen' }}</template>
                </Column>
                <Column style="width: 3rem">
                  <template #body
                    ><i class="pi pi-pencil text-primary-400 cursor-pointer"
                  /></template>
                </Column>
                <template #empty
                  ><span class="table-empty">Er zijn geen resultaten gevonden</span></template
                >
              </DataTable>
            </div>
          </div>
        </template>

        <!-- Winkelwagen -->
        <template v-else-if="activeSection === 'winkelwagen'">
          <div class="tab-scroll">
            <div class="view-card">
              <div class="view-card-hdr">
                <span class="view-card-title">Winkelwagen</span>
              </div>
              <DataTable :value="customer.cart" class="ce-table">
                <Column field="naam" header="Naam">
                  <template #body="{ data }">
                    <a href="#" class="text-primary-600 hover:underline text-sm">{{ data.naam }}</a>
                  </template>
                </Column>
                <Column field="productcode" header="Productcode" style="width: 10rem" />
                <Column
                  field="aantal"
                  header="Aantal"
                  :pt="{ columnheadercontent: { class: 'justify-end!' } }"
                  body-class="col-right"
                />
                <Column
                  field="prijs"
                  header="Prijs"
                  :pt="{ columnheadercontent: { class: 'justify-end!' } }"
                  body-class="col-right"
                >
                  <template #body="{ data }"
                    >€
                    {{ data.prijs.toLocaleString('nl-NL', { minimumFractionDigits: 2 }) }}</template
                  >
                </Column>
                <Column style="width: 3rem">
                  <template #body
                    ><i class="pi pi-external-link text-primary-400 cursor-pointer"
                  /></template>
                </Column>
                <template #empty><span class="table-empty">De winkelwagen is leeg</span></template>
                <template #footer>
                  <div v-if="customer.cart.length" class="table-subtotal">
                    <span
                      >Subtotaal, {{ customer.cart.reduce((s, i) => s + i.aantal, 0) }} product{{
                        customer.cart.reduce((s, i) => s + i.aantal, 0) !== 1 ? 'en' : ''
                      }}</span
                    >
                    <span>€ {{ cartSubtotal.toFixed(2).replace('.', ',') }}</span>
                  </div>
                </template>
              </DataTable>
            </div>
          </div>
        </template>

        <!-- Verlanglijst -->
        <template v-else-if="activeSection === 'verlanglijst'">
          <div class="tab-scroll">
            <div class="view-card">
              <div class="view-card-hdr">
                <div class="flex gap-1.5">
                  <button
                    v-for="wl in customer.wishlists"
                    :key="wl.id"
                    class="wl-tab"
                    :class="{ 'wl-tab--active': wl.id === selectedWishlistId }"
                    @click="selectedWishlistId = wl.id"
                  >
                    {{ wl.naam }}
                    <span class="wl-tab-count">{{ wl.items.length }}</span>
                  </button>
                </div>
              </div>
              <DataTable v-if="selectedWishlist" :value="selectedWishlist.items" class="ce-table">
                <Column field="naam" header="Naam">
                  <template #body="{ data }">
                    <a href="#" class="text-primary-600 hover:underline text-sm">{{ data.naam }}</a>
                  </template>
                </Column>
                <Column field="productcode" header="Productcode" style="width: 10rem" />
                <Column
                  field="aantal"
                  header="Aantal"
                  :pt="{ columnheadercontent: { class: 'justify-end!' } }"
                  body-class="col-right"
                />
                <Column
                  field="prijs"
                  header="Prijs"
                  :pt="{ columnheadercontent: { class: 'justify-end!' } }"
                  body-class="col-right"
                >
                  <template #body="{ data }"
                    >€
                    {{ data.prijs.toLocaleString('nl-NL', { minimumFractionDigits: 2 }) }}</template
                  >
                </Column>
                <Column style="width: 3rem">
                  <template #body
                    ><i class="pi pi-external-link text-primary-400 cursor-pointer"
                  /></template>
                </Column>
                <template #footer>
                  <div v-if="selectedWishlist.items.length" class="table-subtotal">
                    <span
                      >Subtotaal,
                      {{ selectedWishlist.items.reduce((s, i) => s + i.aantal, 0) }} product{{
                        selectedWishlist.items.reduce((s, i) => s + i.aantal, 0) !== 1 ? 'en' : ''
                      }}</span
                    >
                    <span
                      >€
                      {{
                        selectedWishlist.items
                          .reduce((s, i) => s + i.prijs * i.aantal, 0)
                          .toLocaleString('nl-NL', { minimumFractionDigits: 2 })
                      }}</span
                    >
                  </div>
                </template>
              </DataTable>
            </div>
          </div>
        </template>

        <!-- Kortingen -->
        <template v-else-if="activeSection === 'kortingen'">
          <div class="tab-scroll">
            <!-- Basis korting -->
            <div class="view-card">
              <div class="view-card-hdr">
                <span class="view-card-title">Basis korting</span>
                <template v-if="!isEditingBasisKorting">
                  <Button
                    label="Bewerken"
                    icon="pi pi-pencil"
                    size="small"
                    severity="secondary"
                    text
                    @click="isEditingBasisKorting = true"
                  />
                </template>
                <template v-else>
                  <div class="flex gap-2">
                    <Button
                      label="Annuleren"
                      size="small"
                      severity="secondary"
                      outlined
                      @click="isEditingBasisKorting = false"
                    />
                    <Button label="Opslaan" size="small" @click="isEditingBasisKorting = false" />
                  </div>
                </template>
              </div>
              <Transition name="card-fade" mode="out-in">
                <div v-if="!isEditingBasisKorting" key="view" class="view-card-body">
                  <div class="fr-row">
                    <span class="fr-label">Basis korting</span>
                    <span class="fr-value">{{ customer.basisKorting }}%</span>
                  </div>
                </div>
                <div v-else key="edit" class="view-card-body">
                  <div class="fr-row">
                    <label class="fr-label">Basis korting</label>
                    <InputNumber
                      v-model="customer.basisKorting"
                      suffix="%"
                      :min="0"
                      :max="100"
                      :min-fraction-digits="1"
                      :max-fraction-digits="2"
                      class="w-full"
                    />
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Merk kortingen -->
            <div class="view-card">
              <div class="view-card-hdr">
                <div class="flex items-center gap-2">
                  <span class="view-card-title">Merk kortingen</span>
                  <span class="kort-count-badge">{{ customer.merkKortingen.length }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <Button icon="pi pi-plus" size="small" severity="secondary" text />
                  <Button
                    :icon="merkKortingenOpen ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
                    size="small"
                    severity="secondary"
                    text
                    @click="merkKortingenOpen = !merkKortingenOpen"
                  />
                </div>
              </div>
              <Transition name="card-fade">
                <div v-if="merkKortingenOpen">
                  <div class="kort-filter-bar">
                    <InputText
                      v-model="merkFilter"
                      size="small"
                      placeholder="Zoek merk..."
                      class="w-full"
                    />
                  </div>
                  <DataTable :value="filteredMerkKortingen" class="ce-table" :empty-message="' '">
                    <template #empty>
                      <span class="table-empty">{{
                        merkFilter ? 'Geen merken gevonden' : 'Geen merk kortingen'
                      }}</span>
                    </template>
                    <Column selection-mode="multiple" style="width: 3rem" />
                    <Column field="merk" header="Merk" />
                    <Column field="korting" header="Korting">
                      <template #body="{ data }">{{ data.korting }}%</template>
                    </Column>
                    <Column field="standaardKorting" header="Standaard kortingen">
                      <template #body="{ data }">{{ data.standaardKorting }}%</template>
                    </Column>
                  </DataTable>
                </div>
              </Transition>
            </div>

            <!-- Product kortingen -->
            <div class="view-card">
              <div class="view-card-hdr">
                <div class="flex items-center gap-2">
                  <span class="view-card-title">Product kortingen</span>
                  <span class="kort-count-badge">{{ customer.productKortingen.length }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <Button icon="pi pi-plus" size="small" severity="secondary" text />
                  <Button
                    :icon="productKortingenOpen ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
                    size="small"
                    severity="secondary"
                    text
                    @click="productKortingenOpen = !productKortingenOpen"
                  />
                </div>
              </div>
              <Transition name="card-fade">
                <div v-if="productKortingenOpen">
                  <div class="kort-filter-bar">
                    <InputText
                      v-model="productFilter"
                      size="small"
                      placeholder="Zoek product..."
                      class="w-full"
                    />
                  </div>
                  <DataTable
                    :value="filteredProductKortingen"
                    class="ce-table"
                    :empty-message="' '"
                  >
                    <template #empty>
                      <span class="table-empty">{{
                        productFilter ? 'Geen producten gevonden' : 'Geen product kortingen'
                      }}</span>
                    </template>
                    <Column selection-mode="multiple" style="width: 3rem" />
                    <Column field="productcode" header="Productcode" />
                    <Column field="product" header="Product" />
                    <Column
                      field="prijs"
                      header="Prijs"
                      :pt="{ columnheadercontent: { class: 'justify-end!' } }"
                      body-class="col-right"
                    >
                      <template #body="{ data }">€ {{ data.prijs.toFixed(2) }}</template>
                    </Column>
                    <Column
                      field="kortingPrijs"
                      header="Korting prijs"
                      :pt="{ columnheadercontent: { class: 'justify-end!' } }"
                      body-class="col-right"
                    >
                      <template #body="{ data }">€ {{ data.kortingPrijs.toFixed(2) }}</template>
                    </Column>
                  </DataTable>
                </div>
              </Transition>
            </div>
          </div>
        </template>

        <!-- Krediet -->
        <template v-else-if="activeSection === 'krediet'">
          <div class="tab-scroll">
            <!-- Summary overview -->
            <div class="view-card">
              <div class="view-card-hdr">
                <span class="view-card-title">Overzicht</span>
              </div>
              <div class="kred-summary">
                <div class="kred-summary-col">
                  <div class="kred-summary-hdr">Kredietlimiet overzicht</div>
                  <div class="kred-sum-row">
                    <span>Kredietlimiet</span>
                    <span>€ {{ customer.kredietlimiet.toFixed(2) }}</span>
                  </div>
                  <div class="kred-sum-row">
                    <span>Geleverd maar niet betaald</span>
                    <span>€ {{ geleverdNietBetaaldTotaal.toFixed(2) }}</span>
                  </div>
                  <div class="kred-sum-row">
                    <span>Gereserveerd krediet</span>
                    <span>€ {{ gereserveerdKredietTotaal.toFixed(2) }}</span>
                  </div>
                  <div class="kred-sum-row kred-sum-row--total">
                    <span>Krediet resterend</span>
                    <span>€ {{ kredietResterend.toFixed(2) }}</span>
                  </div>
                </div>
                <div class="kred-summary-sep" />
                <div class="kred-summary-col">
                  <div class="kred-summary-hdr">Aankomende leveringen</div>
                  <div class="kred-sum-row">
                    <span>Ingeplande leveringen</span>
                    <span>€ {{ kredietIngeplandTotaal.toFixed(2) }}</span>
                  </div>
                  <div class="kred-sum-row">
                    <span>Aankomende leveringen</span>
                    <span>€ {{ kredietAankomendeTotal.toFixed(2) }}</span>
                  </div>
                </div>
                <div class="kred-summary-sep" />
                <div class="kred-summary-col">
                  <div class="kred-summary-hdr">Bestellingen overzicht</div>
                  <div class="kred-sum-row">
                    <span>Gefactureerd</span>
                    <span>€ {{ geleverdNietBetaaldTotaal.toFixed(2) }}</span>
                  </div>
                  <div class="kred-sum-row kred-sum-row--warn">
                    <span>Vervaldatum overschreden</span>
                    <span>€ {{ vervaldatumOverschreden.toFixed(2) }}</span>
                  </div>
                  <div class="kred-sum-row kred-sum-row--total">
                    <span>Krediet resterend</span>
                    <span>€ {{ kredietResterend.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Geleverd maar niet betaald -->
            <div id="kred-geleverd" class="view-card">
              <div class="view-card-hdr">
                <div class="flex items-center gap-2">
                  <span class="view-card-title">Geleverd maar niet betaald</span>
                  <span class="kort-count-badge">{{ customer.geleverdNietBetaald.length }}</span>
                </div>
                <Button
                  :icon="geleverdNietBetaaldOpen ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
                  size="small"
                  severity="secondary"
                  text
                  @click="geleverdNietBetaaldOpen = !geleverdNietBetaaldOpen"
                />
              </div>
              <Transition name="card-fade">
                <div v-if="geleverdNietBetaaldOpen">
                  <DataTable :value="customer.geleverdNietBetaald" class="ce-table">
                    <template #empty
                      ><span class="table-empty">Geen resultaten gevonden</span></template
                    >
                    <Column field="levering" header="Levering" />
                    <Column field="factuurnummer" header="Factuurnummer" />
                    <Column field="factuurdatum" header="Factuurdatum" />
                    <Column field="vervaldatum" header="Vervaldatum" />
                    <Column field="waarde" header="Waarde" body-class="col-right">
                      <template #body="{ data }">€ {{ data.waarde.toFixed(2) }}</template>
                    </Column>
                    <template #footer>
                      <div class="kred-table-footer">
                        <div class="kred-footer-row">
                          <span>Totaal</span>
                          <span>€ {{ geleverdNietBetaaldTotaal.toFixed(2) }}</span>
                        </div>
                        <div class="kred-footer-row kred-footer-row--warn">
                          <span>Vervaldatum overschreden</span>
                          <span>€ {{ vervaldatumOverschreden.toFixed(2) }}</span>
                        </div>
                      </div>
                    </template>
                  </DataTable>
                </div>
              </Transition>
            </div>

            <!-- Gereserveerd krediet -->
            <div id="kred-gereserveerd" class="view-card">
              <div class="view-card-hdr">
                <div class="flex items-center gap-2">
                  <span class="view-card-title">Gereserveerd krediet</span>
                  <span class="kort-count-badge">{{
                    customer.gereserveerdKredietItems.length
                  }}</span>
                </div>
                <Button
                  :icon="gereserveerdKredietOpen ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
                  size="small"
                  severity="secondary"
                  text
                  @click="gereserveerdKredietOpen = !gereserveerdKredietOpen"
                />
              </div>
              <Transition name="card-fade">
                <div v-if="gereserveerdKredietOpen">
                  <DataTable :value="customer.gereserveerdKredietItems" class="ce-table">
                    <template #empty
                      ><span class="table-empty">Geen resultaten gevonden</span></template
                    >
                    <Column field="levering" header="Levering" />
                    <Column field="status" header="Status" />
                    <Column field="dropshipping" header="Dropshipping">
                      <template #body="{ data }">
                        <i
                          :class="
                            data.dropshipping
                              ? 'pi pi-check text-green-500'
                              : 'pi pi-minus text-surface-300'
                          "
                        />
                      </template>
                    </Column>
                    <Column field="ingeplandeDatum" header="Ingeplande datum" />
                    <Column field="waarde" header="Waarde" body-class="col-right">
                      <template #body="{ data }">€ {{ data.waarde.toFixed(2) }}</template>
                    </Column>
                    <template #footer>
                      <div class="kred-table-footer">
                        <div class="kred-footer-row">
                          <span>Totaal</span>
                          <span>€ {{ gereserveerdKredietTotaal.toFixed(2) }}</span>
                        </div>
                      </div>
                    </template>
                  </DataTable>
                </div>
              </Transition>
            </div>

            <!-- Ingeplande leveringen -->
            <div id="kred-ingepland" class="view-card">
              <div class="view-card-hdr">
                <div class="flex items-center gap-2">
                  <span class="view-card-title">Ingeplande leveringen</span>
                  <span class="kort-count-badge">{{ customer.kredietIngepland.length }}</span>
                </div>
                <Button
                  :icon="kredietIngeplandOpen ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
                  size="small"
                  severity="secondary"
                  text
                  @click="kredietIngeplandOpen = !kredietIngeplandOpen"
                />
              </div>
              <Transition name="card-fade">
                <div v-if="kredietIngeplandOpen">
                  <DataTable :value="customer.kredietIngepland" class="ce-table">
                    <template #empty
                      ><span class="table-empty">Geen resultaten gevonden</span></template
                    >
                    <Column field="levering" header="Levering" />
                    <Column field="status" header="Status" />
                    <Column field="voltooid" header="Voltooid">
                      <template #body="{ data }">
                        <i
                          :class="
                            data.voltooid
                              ? 'pi pi-check text-green-500'
                              : 'pi pi-minus text-surface-300'
                          "
                        />
                      </template>
                    </Column>
                    <Column field="ingeplandeDatum" header="Ingeplande datum" />
                    <Column field="waarde" header="Waarde" body-class="col-right">
                      <template #body="{ data }">€ {{ data.waarde.toFixed(2) }}</template>
                    </Column>
                    <template #footer>
                      <div class="kred-table-footer">
                        <div class="kred-footer-row">
                          <span>Totaal</span>
                          <span>€ {{ kredietIngeplandTotaal.toFixed(2) }}</span>
                        </div>
                      </div>
                    </template>
                  </DataTable>
                </div>
              </Transition>
            </div>

            <!-- Aankomende leveringen -->
            <div id="kred-aankomend" class="view-card">
              <div class="view-card-hdr">
                <div class="flex items-center gap-2">
                  <span class="view-card-title">Aankomende leveringen</span>
                  <span class="kort-count-badge">{{ customer.kredietAankomend.length }}</span>
                </div>
                <Button
                  :icon="kredietAankomendeOpen ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
                  size="small"
                  severity="secondary"
                  text
                  @click="kredietAankomendeOpen = !kredietAankomendeOpen"
                />
              </div>
              <Transition name="card-fade">
                <div v-if="kredietAankomendeOpen">
                  <DataTable :value="customer.kredietAankomend" class="ce-table">
                    <template #empty
                      ><span class="table-empty">Geen resultaten gevonden</span></template
                    >
                    <Column field="levering" header="Levering" />
                    <Column field="ingeplandeDatum" header="Ingeplande datum" />
                    <Column field="waarde" header="Waarde" body-class="col-right">
                      <template #body="{ data }">€ {{ data.waarde.toFixed(2) }}</template>
                    </Column>
                    <template #footer>
                      <div class="kred-table-footer">
                        <div class="kred-footer-row">
                          <span>Totaal</span>
                          <span>€ {{ kredietAankomendeTotal.toFixed(2) }}</span>
                        </div>
                      </div>
                    </template>
                  </DataTable>
                </div>
              </Transition>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>

  <AddressDrawer
    v-model:visible="addrDrawerVisible"
    :address="addrDrawerAddress"
    @save="saveAddress"
  />

  <Dialog
    v-model:visible="emailWijzigenVisible"
    header="E-mail adres wijzigen"
    :style="{ width: '28rem' }"
    modal
    :draggable="false"
  >
    <p class="acct-desc" style="margin-bottom: 1.25rem">
      Voer het nieuwe e-mailadres in. De klant ontvangt een bevestigingsmail op het nieuwe adres.
    </p>
    <div class="flex flex-col gap-1.5">
      <label class="fr-label">Nieuw e-mailadres</label>
      <InputText
        v-model="newAccountEmail"
        class="w-full"
        placeholder="naam@voorbeeld.nl"
        autofocus
      />
    </div>
    <template #footer>
      <Button
        label="Annuleren"
        severity="secondary"
        outlined
        @click="emailWijzigenVisible = false"
      />
      <Button label="Verstuur e-mail" :disabled="!newAccountEmail" @click="submitEmailWijzigen" />
    </template>
  </Dialog>
</template>

<style scoped>
  /* ── Page ───────────────────────────────────────────────────────────────── */
  .ce-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  /* ── Header ─────────────────────────────────────────────────────────────── */
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

  /* ── Header pills ────────────────────────────────────────────────────────── */
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

  /* ── Header stats ────────────────────────────────────────────────────────── */
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

  /* ── Body & sidebar nav ──────────────────────────────────────────────────── */
  .ce-body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }
  .ce-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
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
  .ce-nav-item:hover {
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

  .tab-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    background: var(--p-surface-50);
  }
  .tab-scroll--flush {
    background: white;
  }
  .tab-scroll--form {
    background: white;
  }

  /* ── View cards (overview mode for editable tabs) ────────────────────────── */
  .view-card {
    background: white;
    border: 1px solid var(--p-gray-200);
    border-radius: 0.625rem;
    overflow: hidden;
    margin-bottom: 1.25rem;
  }
  .view-card-hdr {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem 0.5rem 1.25rem;
    border-bottom: 1px solid var(--p-gray-100);
    background: var(--p-gray-50);
    min-height: 2.75rem;
  }
  .view-card-title {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--p-surface-500);
  }
  .view-card-body {
    padding: 0.875rem 1.25rem;
  }
  .view-card-action {
    padding: 0.75rem 1.25rem;
    border-top: 1px solid var(--p-gray-100);
    display: flex;
    justify-content: flex-end;
  }
  .acct-desc {
    font-size: 0.875rem;
    color: var(--p-surface-500);
    line-height: 1.5;
    margin: 0;
  }
  .view-card-toggle-lbl {
    font-size: 0.8125rem;
    color: var(--p-surface-500);
  }
  .url-row {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    min-width: 0;
  }
  .url-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--p-primary-600);
    font-size: 0.8125rem;
  }

  /* ── Card content transition ─────────────────────────────────────────────── */
  .card-fade-enter-active,
  .card-fade-leave-active {
    transition: opacity 0.15s ease;
  }
  .card-fade-enter-from,
  .card-fade-leave-to {
    opacity: 0;
  }

  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition:
      opacity 0.15s ease,
      transform 0.15s ease;
  }
  .fade-slide-enter-from {
    opacity: 0;
    transform: translateY(6px);
  }
  .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-6px);
  }

  /* ── Compact form rows ───────────────────────────────────────────────────── */
  .form-rows {
    max-width: 42rem;
  }

  .fr-section {
    margin-bottom: 2rem;
  }
  .fr-section:last-child {
    margin-bottom: 0;
  }

  .fr-section-hdr {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--p-gray-800);
    margin-bottom: 0.75rem;
  }

  .fr-row {
    display: grid;
    grid-template-columns: 160px 1fr;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0;
  }
  .fr-row--top {
    align-items: flex-start;
  }

  .fr-block {
    padding: 0.5rem 0;
  }

  .fr-label {
    font-size: 0.875rem;
    color: var(--p-gray-500);
    padding-top: 0.375rem;
  }
  .fr-req {
    color: var(--p-red-500);
  }
  .fr-value {
    font-size: 0.875rem;
    color: var(--p-gray-800);
  }
  .fr-empty {
    font-size: 0.875rem;
    color: var(--p-gray-300);
  }

  /* ── Status indicators ───────────────────────────────────────────────────── */
  .acct-status-badge {
    width: fit-content;
    display: inline-flex;
    padding: 0.175rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8125rem;
    font-weight: 600;
    background: var(--p-green-100);
    color: var(--p-green-700);
  }

  .status-dot {
    width: 0.4375rem;
    height: 0.4375rem;
    border-radius: 999px;
    flex-shrink: 0;
  }
  .status-dot--success {
    background: var(--p-green-400);
  }
  .status-dot--warn {
    background: var(--p-orange-400);
  }

  /* ── Sticky save footer ──────────────────────────────────────────────────── */
  .form-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 0.875rem 1.5rem;
    border-top: 1px solid var(--p-gray-100);
    background: white;
    flex-shrink: 0;
  }

  /* ── Account info rows ───────────────────────────────────────────────────── */
  .acct-info-list {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-bottom: 0;
  }
  .acct-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--p-gray-100);
    font-size: 0.875rem;
  }
  .acct-row:last-child {
    border-bottom: none;
  }
  .acct-label {
    color: var(--p-surface-500);
    font-size: 0.8125rem;
  }
  .acct-value {
    color: var(--p-surface-800);
    font-size: 0.875rem;
  }
  .info-text {
    font-size: 0.875rem;
    color: var(--p-surface-600);
    margin: 0;
    line-height: 1.6;
  }

  /* ── Address cards ───────────────────────────────────────────────────────── */
  .addr-topbar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
  }

  .addr-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }

  .addr-card {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    border: 1px solid var(--p-gray-200);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    background: white;
  }

  .addr-card-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 0.1rem;
  }
  .addr-card-actions {
    display: flex;
    gap: 0.1rem;
    margin: -0.375rem -0.375rem 0 0;
  }

  .addr-name {
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--p-surface-800);
  }
  .addr-line {
    font-size: 0.8375rem;
    color: var(--p-surface-600);
  }

  .addr-chips {
    display: flex;
    gap: 0.4rem;
    margin-top: 0.75rem;
    flex-wrap: wrap;
  }

  .addr-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.2rem 0.625rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 500;
    border: 1px solid;
    cursor: pointer;
    transition: opacity 0.1s;
  }
  .addr-chip:disabled {
    cursor: default;
  }
  .addr-chip--active {
    background: var(--p-primary-50);
    border-color: var(--p-primary-200);
    color: var(--p-primary-700);
  }
  .addr-chip--inactive {
    background: white;
    border-color: var(--p-gray-300);
    color: var(--p-surface-500);
  }
  .addr-chip--inactive:hover {
    background: var(--p-gray-50);
    border-color: var(--p-gray-400);
  }

  /* ── DataTables ──────────────────────────────────────────────────────────── */
  .ce-table :deep(th) {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--p-surface-400);
    background: transparent;
    border-bottom: 1px solid var(--p-gray-200);
    padding: 0.625rem 1rem;
  }
  .ce-table :deep(td) {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--p-gray-100);
    font-size: 0.875rem;
    color: #374151;
  }
  .ce-table :deep(td.col-right) {
    text-align: right;
  }
  .ce-table :deep(tr:last-child td) {
    border-bottom: none;
  }
  .ce-table :deep(.p-datatable-footer) {
    padding: 0;
    background: var(--p-gray-50);
    border-top: 1px solid var(--p-gray-200);
  }

  .table-empty {
    font-size: 0.875rem;
    color: var(--p-surface-400);
    font-style: italic;
  }
  .table-subtotal {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
  }

  .ce-tab-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 1rem;
    border-bottom: 1px solid var(--p-gray-100);
  }

  /* ── Offerte badge ───────────────────────────────────────────────────────── */
  .offerte-badge {
    display: inline-flex;
    padding: 0.2rem 0.625rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    border: 1px solid;
  }
  .offerte-badge--success {
    background: var(--p-green-50);
    border-color: var(--p-green-200);
    color: var(--p-green-700);
  }
  .offerte-badge--warn {
    background: var(--p-orange-50);
    border-color: var(--p-orange-200);
    color: var(--p-orange-700);
  }

  /* ── Logboek diff ────────────────────────────────────────────────────────── */
  .log-prop {
    display: inline-block;
    padding: 0.1rem 0.375rem;
    border-radius: 3px;
    background: var(--p-gray-100);
    color: var(--p-surface-600);
    font-family: ui-monospace, monospace;
    font-size: 0.8125rem;
  }
  .log-old {
    font-size: 0.8125rem;
    color: var(--p-surface-400);
    text-decoration: line-through;
  }
  .log-new {
    font-size: 0.8125rem;
    color: var(--p-green-700);
    font-weight: 500;
  }

  /* ── Krediet ─────────────────────────────────────────────────────────────── */
  .kred-summary {
    display: grid;
    grid-template-columns: 1fr auto 1fr auto 1fr;
    padding: 1.25rem;
    gap: 0;
  }
  .kred-summary-sep {
    width: 1px;
    background: var(--p-gray-100);
    margin: 0 1.5rem;
  }
  .kred-summary-hdr {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--p-surface-400);
    margin-bottom: 0.75rem;
  }
  .kred-sum-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8125rem;
    color: var(--p-surface-600);
    padding: 0.25rem 0;
    border-bottom: 1px solid var(--p-gray-100);
  }
  .kred-sum-row:last-child {
    border-bottom: none;
  }
  .kred-sum-row--total {
    font-weight: 600;
    color: var(--p-surface-800);
    margin-top: 0.125rem;
  }
  .kred-sum-row--warn span:last-child {
    color: var(--p-red-500);
  }
  .kred-table-footer {
    padding: 0.625rem 1rem;
  }
  .kred-footer-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.8125rem;
    color: var(--p-surface-600);
    padding: 0.1rem 0;
  }
  .kred-footer-row:first-child {
    font-weight: 600;
    color: var(--p-surface-800);
  }
  .kred-footer-row--warn {
    color: var(--p-red-500) !important;
    font-weight: 500;
  }

  /* ── Kortingen ───────────────────────────────────────────────────────────── */
  .kort-count-badge {
    font-size: 0.6875rem;
    font-weight: 600;
    background: var(--p-gray-100);
    color: var(--p-surface-500);
    padding: 0.1rem 0.5rem;
    border-radius: 999px;
  }
  .kort-filter-bar {
    display: flex;
    align-items: center;
    padding: 0.625rem 1rem;
    border-bottom: 1px solid var(--p-gray-100);
  }

  /* ── Verlanglijst tabs ───────────────────────────────────────────────────── */
  .wl-tab {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.275rem 0.75rem;
    border-radius: 999px;
    font-size: 0.8125rem;
    border: 1px solid var(--p-gray-200);
    background: white;
    color: var(--p-surface-600);
    cursor: pointer;
    transition: all 0.1s;
  }
  .wl-tab:hover {
    background: var(--p-gray-50);
    border-color: var(--p-gray-300);
  }
  .wl-tab--active {
    background: var(--p-primary-50);
    border-color: var(--p-primary-200);
    color: var(--p-primary-700);
  }
  .wl-tab-count {
    font-size: 0.6875rem;
    font-weight: 600;
    background: var(--p-gray-100);
    color: var(--p-surface-500);
    padding: 0.05rem 0.35rem;
    border-radius: 999px;
  }
  .wl-tab--active .wl-tab-count {
    background: var(--p-primary-100);
    color: var(--p-primary-600);
  }
</style>
