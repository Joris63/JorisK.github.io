<script setup lang="ts">
  import logoRaw from '@/assets/logo.svg?raw';
  import type { NavigationSection as NavigationSectionType } from '@/types/navigation';
  import { ref } from 'vue';
  import NavigationSection from './NavigationSection.vue';

  const visible = ref(true);
  const navigationSections = ref<NavigationSectionType[]>([
    {
      navItems: [
        {
          label: 'Home',
          route: '/',
          icon: 'pi-home',
        },
        {
          label: 'Showroom',
          children: [
            {
              label: 'Directe verkoop',
              route: '/sales/direct',
            },
            {
              label: 'Product invoeren',
              route: '/sales/orders/add',
            },
            {
              label: 'Offertes',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Bestellingen',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Verlanglijsten',
              route: '/',
            },
          ],
          icon: 'pi-shop',
        },
      ],
    },
    {
      label: 'ADMINISTRATIE',
      navItems: [
        {
          label: 'Taken',
          children: [
            {
              label: 'Takenoverzicht',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Afdelingsoverzicht',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Adfeling beheren',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Nieuwe taak',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Notificaties',
              route: '/',
              isOldAdmin: true,
            },
          ],
          icon: 'pi-list-check',
        },
        {
          label: 'Verkoop',
          children: [
            {
              label: 'Bestellingen',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Bestelling toevoegen',
              route: '/sales/orders/add',
            },
            {
              label: 'Directe verkoop',
              route: '/sales/direct',
            },
            {
              label: 'Bedrijfsbestellingen',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Offertes',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Klanten',
              route: '/sales/customers',
            },
            {
              label: 'Omzet',
              route: '/',
            },
            {
              label: 'Dagafsluiting',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Verlanglijsten',
              route: '/',
            },
          ],
          icon: 'pi-chart-line',
        },
        {
          label: 'Inkoop',
          children: [
            {
              label: 'Interne bestellingen',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Interne bestelling toevoegen',
              route: '/',
            },
            {
              label: 'Inkooporders',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Inkooporders bulk import',
              route: '/',
            },
            {
              label: 'Inkoopfacturen',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Leveranciers',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Leveranicer bonussen',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: "Leveranciers leverschema's",
              route: '/',
            },
            {
              label: 'Achterstallige orders',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Autobestel instellingen',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Inkoopalternatieven vergelijken',
              route: '/',
            },
            {
              label: 'Inkoopalternatieven exporteren',
              route: '/',
            },
            {
              label: 'Inkooporders dashboard',
              route: '/',
            },
            {
              label: 'Inkoopalternatief switch instellingen',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Showroomkortingen',
              route: '/',
            },
          ],
          icon: 'pi-shopping-cart',
        },
        {
          label: 'Boekhouding',
          children: [
            {
              label: 'Factuur en order CSV',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Productprijzen CSV',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Groet prijsveranderingen',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Inkoopprijzen corrigeren',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Product import merken marges',
              route: '/',
            },
          ],
          icon: 'pi-book',
        },
        {
          label: 'Logistiek',
          children: [
            {
              label: 'Verzendingen',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Verzendsticker printen',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Uitzonderingen',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Planning',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Lege picklocaties',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Werkvoorraad dashboard',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Dashboard opmerkingen',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Pakbon verifier',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Werkstation',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Palletgoederen label scan',
              route: '/',
            },
            {
              label: 'Uitgaand dashboard',
              route: '/',
            },
            {
              label: 'Locaties',
              route: '/',
            },
          ],
          icon: 'pi-truck',
        },
      ],
    },
    {
      label: 'WEBSITE',
      navItems: [
        {
          label: 'Content',
          children: [
            {
              label: "Pagina's",
              route: '/',
            },
            {
              label: 'Auteurs',
              route: '/',
            },
            {
              label: 'Banners',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Content blokken',
              route: '/',
            },
            {
              label: 'Uitgelichte producten',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Menu manager',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Promotiecodes',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Promotiecodes bulk',
              route: '/',
            },
            {
              label: 'Cadeaubonnen',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Filters',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'URL Management (redirects)',
              route: '/',
            },
            {
              label: 'Productbeoordelingen',
              route: '/',
            },
          ],
          icon: 'pi-pencil',
        },
        {
          label: 'Product management',
          children: [
            {
              label: 'Producten',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Producten grid',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Product imports',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Import bestand genereren',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Top 5000 uit feed',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Categorieen',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Merken',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Attributen',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Attribute groepen',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Productprofielen',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Acties',
              route: '/marketing/acties',
            },
            {
              label: 'Gewijzigde productattributen',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Afbeeldingen ontdubbelen',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Product zoek gewichten',
              route: '/',
              isOldAdmin: true,
            },
          ],
          icon: 'pi-warehouse',
        },
        {
          label: 'Cache management',
          children: [
            {
              label: 'Cache invalidatie',
              route: '/',
            },
          ],
          icon: 'pi-sync',
        },
        {
          label: 'Optimalisatie',
          children: [
            {
              label: 'Begrippen',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Productnamen vertalen',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Attributen vertalen',
              route: '/',
              isOldAdmin: true,
            },
          ],
          icon: 'pi-sliders-h',
        },
      ],
    },
    {
      label: 'IT',
      navItems: [
        {
          label: 'Management',
          children: [
            {
              label: 'Voorkeuren',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Werknemers',
              route: '/',
              isOldAdmin: true,
            },
            {
              label: 'Profielen',
              route: '/',
            },
            {
              label: 'Overzichten',
              route: '/',
              isOldAdmin: true,
            },
          ],
          icon: 'pi-wrench',
        },
      ],
    },
    {
      label: 'TOOLS',
      navItems: [
        {
          label: 'Producten',
          children: [
            {
              label: 'Variant validator',
              route: '/',
            },
          ],
          icon: 'pi-cog',
        },
        {
          label: 'Levertijd berekening',
          children: [
            {
              label: 'Lervertijd berekening tool',
              route: '/',
            },
          ],
          icon: 'pi-calendar',
        },
      ],
    },
  ]);
</script>

<template>
  <aside
    class="flex flex-col h-screen border-r border-gray-200 bg-white shrink-0 overflow-hidden"
    :style="{ width: visible ? '20rem' : '4rem', transition: 'width 0.3s ease' }"
  >
    <!-- Header: always rendered, logo fades out when collapsed -->
    <div
      class="bg-primary-500 flex items-center h-16.5 shrink-0"
      :class="visible ? 'justify-between pl-4 pr-2' : 'justify-center'"
    >
      <span
        class="inline-flex items-center gap-2 transition-opacity duration-200"
        :class="visible ? 'opacity-100' : 'opacity-0 pointer-events-none w-0 overflow-hidden'"
      >
        <span v-html="logoRaw" class="h-8 flex items-center text-neutral-50"></span>
      </span>
      <Button
        type="button"
        @click="visible = !visible"
        :icon="visible ? 'pi pi-arrow-left' : 'pi pi-bars'"
        rounded
        variant="text"
        class="text-neutral-50! hover:text-primary-500!"
      />
    </div>

    <!-- Nav content -->
    <div class="pt-2 overflow-y-auto flex-1">
      <NavigationSection
        v-for="(section, index) in navigationSections"
        :key="section.label ?? `emptySectionLabel-${index}`"
        :section="section"
        :index="index"
        :collapsed="!visible"
      />
    </div>
  </aside>
</template>
