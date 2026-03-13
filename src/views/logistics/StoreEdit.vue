<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import AddressFields from '@/components/form/AddressFields.vue';
  import PhoneField from '@/components/form/PhoneField.vue';

  const router = useRouter();

  // ── Mock data ──────────────────────────────────────────────────────────────
  interface Openingstijd {
    dag: string;
    van: string;
    tot: string;
    gesloten: boolean;
  }

  interface Uitzondering {
    id: number;
    datum: Date | null;
    van: string;
    tot: string;
    gesloten: boolean;
    reden: Record<string, string>;
  }

  const winkel = ref({
    naam: 'Utrecht',
    afkorting: 'UTR',
    slug: 'showroom_utr',
    actief: true,
    hoofdwinkel: false,
    outlet: false,
    binnenkortOpen: false,
    pickupLocatie: 'Utrecht',
    sites: ['sanitairwinkel_nl'],
    // Adres
    land: 'NL',
    straat: 'Koningin Julianaplein',
    huisnummer: '10',
    toevoeging: '',
    postcode: '3527 KB',
    stad: 'Utrecht',
    opmerkingAdres: '',
    // Contact
    telefoonLand: 'NL',
    telefoonNummer: '30 123 4567',
    email: 'utrecht@sanitairwinkel.nl',
    // Overig
    breedtegraad: '52.091',
    lengtegraad: '5.122',
    promotiepagina: 'Showroom Utrecht',
    googleCode: '17',
    seoTitel: 'Sanitairwinkel Utrecht – Dé badkamershowroom in Utrecht',
    seoOmschrijving:
      'Bezoek onze ruime showroom in Utrecht en laat je inspireren door honderden badkameropstellingen. Onze specialisten helpen je graag verder.',
    introTekst:
      'Welkom bij Sanitairwinkel Utrecht. Onze showroom aan het Koningin Julianaplein biedt een inspirerende omgeving met de nieuwste badkamercollecties van toonaangevende merken.',
    heroAfbeelding: 'https://placehold.co/1200x500/e5e7eb/9ca3af?text=Hero+afbeelding',
    overzichtAfbeelding: 'https://placehold.co/800x500/e5e7eb/9ca3af?text=Overzicht+afbeelding',
    google360Tour: '',
    youtubeVideo: 'https://youtu.be/6LyszVQsTbk',
    sfeerimpressies: [
      'https://placehold.co/800x500/e5e7eb/9ca3af?text=Sfeerimpressie+1',
      'https://placehold.co/800x500/e5e7eb/9ca3af?text=Sfeerimpressie+2',
      '',
      '',
    ],
  });

  const openingstijden = ref<Openingstijd[]>([
    { dag: 'Maandag',   van: '09:00', tot: '17:30', gesloten: false },
    { dag: 'Dinsdag',   van: '09:00', tot: '17:30', gesloten: false },
    { dag: 'Woensdag',  van: '09:00', tot: '17:30', gesloten: false },
    { dag: 'Donderdag', van: '09:00', tot: '20:00', gesloten: false },
    { dag: 'Vrijdag',   van: '09:00', tot: '17:30', gesloten: false },
    { dag: 'Zaterdag',  van: '10:00', tot: '17:00', gesloten: false },
    { dag: 'Zondag',    van: '',      tot: '',       gesloten: true  },
  ]);

  const uitzonderingen = ref<Uitzondering[]>([
    { id: 1,  datum: new Date(2026, 3,  5), van: '',      tot: '',       gesloten: true,  reden: { sanitairwinkel_nl: '1e Paasdag' } },
    { id: 2,  datum: new Date(2026, 3,  6), van: '12:00', tot: '17:00', gesloten: false, reden: { sanitairwinkel_nl: 'Koopzondag (Pasen)' } },
    { id: 3,  datum: new Date(2026, 3, 27), van: '',      tot: '',       gesloten: true,  reden: { sanitairwinkel_nl: 'Koningsdag' } },
    { id: 4,  datum: new Date(2026, 4,  5), van: '10:00', tot: '17:00', gesloten: false, reden: { sanitairwinkel_nl: 'Bevrijdingsdag' } },
    { id: 5,  datum: new Date(2026, 4, 14), van: '',      tot: '',       gesloten: true,  reden: { sanitairwinkel_nl: 'Hemelvaartsdag' } },
    { id: 6,  datum: new Date(2026, 10,27), van: '09:00', tot: '21:00', gesloten: false, reden: { sanitairwinkel_nl: 'Black Friday' } },
    { id: 7,  datum: new Date(2026, 11, 5), van: '10:00', tot: '17:00', gesloten: false, reden: { sanitairwinkel_nl: 'Pakjesavond' } },
    { id: 8,  datum: new Date(2026, 11,24), van: '09:00', tot: '15:00', gesloten: false, reden: { sanitairwinkel_nl: 'Kerstavond' } },
    { id: 9,  datum: new Date(2026, 11,25), van: '',      tot: '',       gesloten: true,  reden: { sanitairwinkel_nl: '1e Kerstdag' } },
    { id: 10, datum: new Date(2026, 11,26), van: '',      tot: '',       gesloten: true,  reden: { sanitairwinkel_nl: '2e Kerstdag' } },
    { id: 11, datum: new Date(2026, 11,31), van: '09:00', tot: '15:00', gesloten: false, reden: { sanitairwinkel_nl: 'Oudjaarsdag' } },
  ]);

  let nextUitzonderingId = 12;

  function addUitzondering() {
    const reden: Record<string, string> = {};
    for (const sv of siteviews.value) reden[sv.key] = '';
    uitzonderingen.value.push({
      id: nextUitzonderingId++,
      datum: null,
      van: '09:00',
      tot: '17:30',
      gesloten: false,
      reden,
    });
  }

  function removeUitzondering(id: number) {
    uitzonderingen.value = uitzonderingen.value.filter(u => u.id !== id);
  }

  function formatDatum(datum: Date | null) {
    return datum?.toLocaleDateString('nl-NL') ?? '—';
  }

  const activeTab = ref('algemeen');

  const isEditingBasis   = ref(false);
  const isEditingAdres   = ref(false);
  const isEditingContact = ref(false);
  const isEditingOverig  = ref(false);
  const isEditingTijden  = ref(false);
  const isEditingUitzonderingen = ref(false);
  const isEditingContent = ref(false);

  const landOptions = [
    { label: 'Nederland', value: 'NL' },
    { label: 'België',    value: 'BE' },
    { label: 'Frankrijk', value: 'FR' },
    { label: 'Duitsland', value: 'DE' },
  ];

  const siteOptions = [
    { label: 'sanitairwinkel.nl', value: 'sanitairwinkel_nl' },
    { label: 'sawiday.be',        value: 'sawiday_be' },
    { label: 'sawiday.fr',        value: 'sawiday_fr' },
    { label: 'sawiday.de',        value: 'sawiday_de' },
  ];

  const pickupOptions = ['Alkmaar', 'Almere', 'Amsterdam Amstel', 'Amsterdam West', 'Arnhem', 'Breda', 'Eindhoven', 'Groningen', 'Den Haag', 'Leeuwarden', 'Leiden', 'Nijmegen', 'Rotterdam', 'Tilburg', 'Utrecht', 'Zwolle'];

  const promotiepaginaOptions = ['Showroom Utrecht', 'Showroom Amsterdam', 'Showroom Rotterdam', 'Showroom Den Haag'];

  // Expands selected sites into individual siteviews (sawiday_be → NL + FR split)
  const siteviews = computed(() => {
    const result: { key: string; label: string }[] = [];
    for (const site of winkel.value.sites) {
      if (site === 'sawiday_be') {
        result.push({ key: 'sawiday_be_nl', label: 'sawiday.be (NL)' });
        result.push({ key: 'sawiday_be_fr', label: 'sawiday.be (FR)' });
      } else {
        const opt = siteOptions.find(o => o.value === site);
        result.push({ key: site, label: opt?.label ?? site });
      }
    }
    return result;
  });

  // ── Image upload ───────────────────────────────────────────────────────────
  const heroInput = ref<HTMLInputElement | null>(null);
  const overzichtInput = ref<HTMLInputElement | null>(null);
  const sfeerInputs: (HTMLInputElement | null)[] = [null, null, null, null];
  const draggingField = ref<string | null>(null);

  function applyImageFile(file: File | undefined, setter: (url: string) => void) {
    if (file?.type.startsWith('image/')) setter(URL.createObjectURL(file));
  }
</script>

<template>
  <div class="se-page">

    <!-- ── Header ──────────────────────────────────────────────────────────── -->
    <div class="se-header">
      <Button
        icon="pi pi-arrow-left"
        severity="secondary"
        text
        rounded
        @click="router.push({ name: 'LocationsOverview' })"
      />
      <div class="se-avatar">
        <i class="pi pi-building" />
      </div>
      <div class="se-header-info">
        <div class="se-header-top">
          <span class="se-title">{{ winkel.naam }}</span>
          <span class="se-pill se-pill--type">{{ winkel.afkorting }}</span>
          <span class="se-pill" :class="winkel.actief ? 'se-pill--active' : 'se-pill--inactive'">
            {{ winkel.actief ? 'Actief' : 'Inactief' }}
          </span>
        </div>
        <span class="se-subtitle">{{ winkel.straat }} {{ winkel.huisnummer }}, {{ winkel.stad }}</span>
      </div>
      <Button icon="pi pi-ellipsis-v" severity="secondary" text rounded style="margin-left: auto" />
    </div>

    <!-- ── Tabs ─────────────────────────────────────────────────────────────── -->
    <div class="se-tabs">
      <button
        class="se-tab"
        :class="{ 'se-tab--active': activeTab === 'algemeen' }"
        @click="activeTab = 'algemeen'"
      >
        <i class="pi pi-building" />Algemene informatie
      </button>
      <button
        class="se-tab"
        :class="{ 'se-tab--active': activeTab === 'openingstijden' }"
        @click="activeTab = 'openingstijden'"
      >
        <i class="pi pi-clock" />Openingstijden
      </button>
      <button
        class="se-tab"
        :class="{ 'se-tab--active': activeTab === 'content' }"
        @click="activeTab = 'content'"
      >
        <i class="pi pi-globe" />Content website
      </button>
    </div>

    <!-- ── Tab content ──────────────────────────────────────────────────────── -->
    <div class="tab-scroll">

      <!-- ── Algemene informatie ─────────────────────────────────────────── -->
      <template v-if="activeTab === 'algemeen'">

        <!-- Basisgegevens -->
        <div class="view-card">
          <div class="view-card-hdr">
            <span class="view-card-title">Basisgegevens</span>
            <template v-if="!isEditingBasis">
              <Button label="Bewerken" icon="pi pi-pencil" size="small" severity="secondary" text @click="isEditingBasis = true" />
            </template>
            <template v-else>
              <div class="flex gap-2">
                <Button label="Annuleren" size="small" severity="secondary" outlined @click="isEditingBasis = false" />
                <Button label="Opslaan" size="small" @click="isEditingBasis = false" />
              </div>
            </template>
          </div>
          <Transition name="card-fade" mode="out-in">
            <div v-if="!isEditingBasis" key="view" class="view-card-body">
              <div class="fr-row">
                <span class="fr-label">Naam</span>
                <span class="fr-value">{{ winkel.naam }}</span>
              </div>
              <div class="fr-row">
                <span class="fr-label">Afkorting</span>
                <span class="fr-value">{{ winkel.afkorting }}</span>
              </div>
              <div class="fr-row">
                <span class="fr-label">Slug</span>
                <span class="fr-value">{{ winkel.slug }}</span>
              </div>
              <div class="fr-row">
                <span class="fr-label">Hoofdwinkel</span>
                <span class="fr-value"><span :class="winkel.hoofdwinkel ? 'status-badge status-badge--yes' : 'status-badge status-badge--no'">{{ winkel.hoofdwinkel ? 'Ja' : 'Nee' }}</span></span>
              </div>
              <div class="fr-row">
                <span class="fr-label">Actief</span>
                <span class="fr-value"><span :class="winkel.actief ? 'status-badge status-badge--yes' : 'status-badge status-badge--no'">{{ winkel.actief ? 'Ja' : 'Nee' }}</span></span>
              </div>
              <div class="fr-row">
                <span class="fr-label">Outlet</span>
                <span class="fr-value"><span :class="winkel.outlet ? 'status-badge status-badge--yes' : 'status-badge status-badge--no'">{{ winkel.outlet ? 'Ja' : 'Nee' }}</span></span>
              </div>
              <div class="fr-row">
                <span class="fr-label">Binnenkort open</span>
                <span class="fr-value"><span :class="winkel.binnenkortOpen ? 'status-badge status-badge--yes' : 'status-badge status-badge--no'">{{ winkel.binnenkortOpen ? 'Ja' : 'Nee' }}</span></span>
              </div>
              <div class="fr-row">
                <span class="fr-label">Pickup locatie</span>
                <span :class="winkel.pickupLocatie ? 'fr-value' : 'fr-empty'">{{ winkel.pickupLocatie || '—' }}</span>
              </div>
              <div class="fr-row">
                <span class="fr-label">Sites</span>
                <div class="flex flex-wrap gap-1">
                  <span v-for="s in winkel.sites" :key="s" class="site-tag">
                    {{ siteOptions.find(o => o.value === s)?.label ?? s }}
                  </span>
                  <span v-if="!winkel.sites.length" class="fr-empty">—</span>
                </div>
              </div>
            </div>
            <div v-else key="edit" class="view-card-body">
              <div class="fr-row">
                <label class="fr-label">Naam <span class="fr-req">*</span></label>
                <InputText v-model="winkel.naam" class="w-full" placeholder="Naam winkel" />
              </div>
              <div class="fr-row">
                <label class="fr-label">Afkorting <span class="fr-req">*</span></label>
                <div class="flex gap-2">
                  <InputText v-model="winkel.afkorting" placeholder="UTR" style="max-width: 7rem" />
                  <InputText v-model="winkel.slug" class="flex-1" placeholder="showroom_utr" />
                </div>
              </div>
              <div class="fr-row">
                <label class="fr-label">Hoofdwinkel</label>
                <ToggleSwitch v-model="winkel.hoofdwinkel" />
              </div>
              <div class="fr-row">
                <label class="fr-label">Actief</label>
                <ToggleSwitch v-model="winkel.actief" />
              </div>
              <div class="fr-row">
                <label class="fr-label">Outlet</label>
                <ToggleSwitch v-model="winkel.outlet" />
              </div>
              <div class="fr-row">
                <label class="fr-label">Binnenkort open</label>
                <ToggleSwitch v-model="winkel.binnenkortOpen" />
              </div>
              <div class="fr-row">
                <label class="fr-label">Pickup locatie</label>
                <Select v-model="winkel.pickupLocatie" :options="pickupOptions" class="w-full" show-clear placeholder="Selecteer locatie" />
              </div>
              <div class="fr-row">
                <label class="fr-label">Sites <span class="fr-req">*</span></label>
                <MultiSelect v-model="winkel.sites" :options="siteOptions" option-label="label" option-value="value" class="w-full" placeholder="Selecteer sites" />
              </div>
            </div>
          </Transition>
        </div>

        <!-- Adres -->
        <div class="view-card">
          <div class="view-card-hdr">
            <span class="view-card-title">Adres</span>
            <template v-if="!isEditingAdres">
              <Button label="Bewerken" icon="pi pi-pencil" size="small" severity="secondary" text @click="isEditingAdres = true" />
            </template>
            <template v-else>
              <div class="flex gap-2">
                <Button label="Annuleren" size="small" severity="secondary" outlined @click="isEditingAdres = false" />
                <Button label="Opslaan" size="small" @click="isEditingAdres = false" />
              </div>
            </template>
          </div>
          <Transition name="card-fade" mode="out-in">
            <div v-if="!isEditingAdres" key="view" class="view-card-body">
              <div class="fr-row">
                <span class="fr-label">Land</span>
                <span class="fr-value"><span class="site-tag">{{ winkel.land }}</span></span>
              </div>
              <div class="fr-row">
                <span class="fr-label">Adres</span>
                <span class="fr-value">
                  {{ winkel.straat }} {{ winkel.huisnummer }}{{ winkel.toevoeging ? ' ' + winkel.toevoeging : '' }},
                  {{ winkel.postcode }} {{ winkel.stad }}
                </span>
              </div>
              <div class="fr-row">
                <span class="fr-label">Opmerking</span>
                <span :class="winkel.opmerkingAdres ? 'fr-value' : 'fr-empty'">{{ winkel.opmerkingAdres || '—' }}</span>
              </div>
            </div>
            <div v-else key="edit" class="view-card-body">
              <div class="fr-row">
                <label class="fr-label">Land <span class="fr-req">*</span></label>
                <Select v-model="winkel.land" :options="landOptions" option-label="label" option-value="value" class="w-full" />
              </div>
              <div class="fr-row fr-row--top">
                <label class="fr-label">Adres <span class="fr-req">*</span></label>
                <AddressFields
                  v-model:postcode="winkel.postcode"
                  v-model:huisnummer="winkel.huisnummer"
                  v-model:toevoeging="winkel.toevoeging"
                  v-model:straat="winkel.straat"
                  v-model:woonplaats="winkel.stad"
                />
              </div>
              <div class="fr-row">
                <label class="fr-label">Opmerking</label>
                <InputText v-model="winkel.opmerkingAdres" class="w-full" placeholder="Bijv. 2e verdieping" />
              </div>
            </div>
          </Transition>
        </div>

        <!-- Contact -->
        <div class="view-card">
          <div class="view-card-hdr">
            <span class="view-card-title">Contact</span>
            <template v-if="!isEditingContact">
              <Button label="Bewerken" icon="pi pi-pencil" size="small" severity="secondary" text @click="isEditingContact = true" />
            </template>
            <template v-else>
              <div class="flex gap-2">
                <Button label="Annuleren" size="small" severity="secondary" outlined @click="isEditingContact = false" />
                <Button label="Opslaan" size="small" @click="isEditingContact = false" />
              </div>
            </template>
          </div>
          <Transition name="card-fade" mode="out-in">
            <div v-if="!isEditingContact" key="view" class="view-card-body">
              <div class="fr-row">
                <span class="fr-label">Telefoonnummer</span>
                <span :class="winkel.telefoonNummer ? 'fr-value' : 'fr-empty'">
                  {{ winkel.telefoonNummer ? `+${winkel.telefoonLand === 'NL' ? '31' : winkel.telefoonLand === 'BE' ? '32' : '33'} ${winkel.telefoonNummer}` : '—' }}
                </span>
              </div>
              <div class="fr-row">
                <span class="fr-label">E-mail</span>
                <span :class="winkel.email ? 'fr-value' : 'fr-empty'">{{ winkel.email || '—' }}</span>
              </div>
            </div>
            <div v-else key="edit" class="view-card-body">
              <div class="fr-row">
                <label class="fr-label">Telefoonnummer</label>
                <PhoneField v-model:land="winkel.telefoonLand" v-model:nummer="winkel.telefoonNummer" />
              </div>
              <div class="fr-row">
                <label class="fr-label">E-mail</label>
                <InputText v-model="winkel.email" class="w-full" placeholder="winkel@sanitairwinkel.nl" />
              </div>
            </div>
          </Transition>
        </div>

        <!-- Overig -->
        <div class="view-card">
          <div class="view-card-hdr">
            <span class="view-card-title">Overig</span>
            <template v-if="!isEditingOverig">
              <Button label="Bewerken" icon="pi pi-pencil" size="small" severity="secondary" text @click="isEditingOverig = true" />
            </template>
            <template v-else>
              <div class="flex gap-2">
                <Button label="Annuleren" size="small" severity="secondary" outlined @click="isEditingOverig = false" />
                <Button label="Opslaan" size="small" @click="isEditingOverig = false" />
              </div>
            </template>
          </div>
          <Transition name="card-fade" mode="out-in">
            <div v-if="!isEditingOverig" key="view" class="view-card-body">
              <div class="fr-row">
                <span class="fr-label">Coördinaten</span>
                <span :class="winkel.breedtegraad ? 'fr-value' : 'fr-empty'">
                  {{ winkel.breedtegraad && winkel.lengtegraad ? `${winkel.breedtegraad}, ${winkel.lengtegraad}` : '—' }}
                </span>
              </div>
              <div class="fr-row">
                <span class="fr-label">Promotiepagina</span>
                <span :class="winkel.promotiepagina ? 'fr-value' : 'fr-empty'">{{ winkel.promotiepagina || '—' }}</span>
              </div>
              <div class="fr-row">
                <span class="fr-label">Google code</span>
                <span :class="winkel.googleCode ? 'fr-value' : 'fr-empty'">{{ winkel.googleCode || '—' }}</span>
              </div>
            </div>
            <div v-else key="edit" class="view-card-body">
              <div class="fr-row">
                <label class="fr-label">Coördinaten</label>
                <div class="flex gap-2">
                  <InputText v-model="winkel.breedtegraad" placeholder="52.091" style="flex: 1" />
                  <InputText v-model="winkel.lengtegraad" placeholder="5.122" style="flex: 1" />
                </div>
              </div>
              <div class="fr-row">
                <label class="fr-label">Promotiepagina</label>
                <Select v-model="winkel.promotiepagina" :options="promotiepaginaOptions" class="w-full" show-clear placeholder="Selecteer pagina" />
              </div>
              <div class="fr-row">
                <label class="fr-label">Google code</label>
                <InputText v-model="winkel.googleCode" placeholder="17" style="max-width: 8rem" />
              </div>
            </div>
          </Transition>
        </div>

      </template>

      <!-- ── Openingstijden ──────────────────────────────────────────────── -->
      <template v-else-if="activeTab === 'openingstijden'">
        <div class="view-card">
          <div class="view-card-hdr">
            <span class="view-card-title">Openingstijden</span>
            <template v-if="!isEditingTijden">
              <Button label="Bewerken" icon="pi pi-pencil" size="small" severity="secondary" text @click="isEditingTijden = true" />
            </template>
            <template v-else>
              <div class="flex gap-2">
                <Button label="Annuleren" size="small" severity="secondary" outlined @click="isEditingTijden = false" />
                <Button label="Opslaan" size="small" @click="isEditingTijden = false" />
              </div>
            </template>
          </div>
          <Transition name="card-fade" mode="out-in">
            <div v-if="!isEditingTijden" key="view" class="view-card-body">
              <div v-for="dag in openingstijden" :key="dag.dag" class="fr-row">
                <span class="fr-label">{{ dag.dag }}</span>
                <span v-if="dag.gesloten" class="fr-empty">Gesloten</span>
                <span v-else class="fr-value">{{ dag.van }} – {{ dag.tot }}</span>
              </div>
            </div>
            <div v-else key="edit" class="view-card-body">
              <div v-for="dag in openingstijden" :key="dag.dag" class="fr-row">
                <span class="fr-label">{{ dag.dag }}</span>
                <div class="flex items-center gap-3">
                  <div class="flex items-center gap-2">
                    <Checkbox v-model="dag.gesloten" binary :input-id="`gesloten-${dag.dag}`" />
                    <label :for="`gesloten-${dag.dag}`" class="text-sm text-surface-500 cursor-pointer">Gesloten</label>
                  </div>
                  <template v-if="!dag.gesloten">
                    <InputText v-model="dag.van" style="width: 5.5rem" placeholder="09:00" />
                    <span class="text-surface-400 text-sm">–</span>
                    <InputText v-model="dag.tot" style="width: 5.5rem" placeholder="17:30" />
                  </template>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Uitzonderingen -->
        <div class="view-card">
          <div class="view-card-hdr">
            <span class="view-card-title">Uitzonderingen</span>
            <template v-if="!isEditingUitzonderingen">
              <Button label="Bewerken" icon="pi pi-pencil" size="small" severity="secondary" text @click="isEditingUitzonderingen = true" />
            </template>
            <template v-else>
              <div class="flex gap-2">
                <Button label="Annuleren" size="small" severity="secondary" outlined @click="isEditingUitzonderingen = false" />
                <Button label="Opslaan" size="small" @click="isEditingUitzonderingen = false" />
              </div>
            </template>
          </div>
          <Transition name="card-fade" mode="out-in">
            <div v-if="!isEditingUitzonderingen" key="view" class="view-card-body">
              <div v-if="!uitzonderingen.length" class="fr-empty" style="padding: 0.25rem 0">Geen uitzonderingen ingesteld</div>
              <div v-for="u in uitzonderingen" :key="u.id" class="uitzon-card">
                <div class="uitzon-header">
                  <span class="uitzon-view-datum">{{ formatDatum(u.datum) }}</span>
                  <span v-if="u.gesloten" class="status-badge status-badge--no">Gesloten</span>
                  <span v-else class="fr-value text-sm">{{ u.van }} – {{ u.tot }}</span>
                </div>
                <div class="uitzon-redens-edit">
                  <div class="uitzon-redens-hdr">Reden per siteview</div>
                  <div v-for="sv in siteviews" :key="sv.key" class="uitzon-reden-row">
                    <span class="uitzon-reden-site-lbl">{{ sv.label }}</span>
                    <span :class="u.reden[sv.key] ? 'fr-value text-sm' : 'fr-empty text-sm'">{{ u.reden[sv.key] || '—' }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else key="edit" class="view-card-body">
              <div v-if="!uitzonderingen.length" class="fr-empty" style="padding: 0.25rem 0">Geen uitzonderingen</div>
              <div v-for="u in uitzonderingen" :key="u.id" class="uitzon-card">
                <div class="uitzon-header">
                  <DatePicker v-model="u.datum" date-format="dd-mm-yy" placeholder="dd-mm-jj" style="width: 9rem" />
                  <div class="flex items-center gap-2">
                    <Checkbox v-model="u.gesloten" binary :input-id="`uz-gesloten-${u.id}`" />
                    <label :for="`uz-gesloten-${u.id}`" class="text-sm text-surface-600 cursor-pointer">Gesloten</label>
                  </div>
                  <template v-if="!u.gesloten">
                    <InputText v-model="u.van" class="uitzon-time" placeholder="09:00" />
                    <span class="text-surface-400 text-sm">–</span>
                    <InputText v-model="u.tot" class="uitzon-time" placeholder="17:30" />
                  </template>
                  <Button icon="pi pi-trash" severity="danger" text size="small" rounded style="margin-left: auto" @click="removeUitzondering(u.id)" />
                </div>
                <div class="uitzon-redens-edit">
                  <div class="uitzon-redens-hdr">Reden per siteview</div>
                  <div v-for="sv in siteviews" :key="sv.key" class="uitzon-reden-row">
                    <span class="uitzon-reden-site-lbl">{{ sv.label }}</span>
                    <InputText v-model="u.reden[sv.key]" class="flex-1" placeholder="Bijv. 1e Paasdag" />
                  </div>
                </div>
              </div>
              <div style="padding-top: 0.5rem">
                <Button label="Nieuwe uitzondering toevoegen" icon="pi pi-plus" size="small" severity="secondary" outlined @click="addUitzondering" />
              </div>
            </div>
          </Transition>
        </div>
      </template>

      <!-- ── Content website ─────────────────────────────────────────────── -->
      <template v-else-if="activeTab === 'content'">

        <!-- Media -->
        <div class="view-card">
          <div class="view-card-hdr">
            <span class="view-card-title">Afbeeldingen & media</span>
            <template v-if="!isEditingContent">
              <Button label="Bewerken" icon="pi pi-pencil" size="small" severity="secondary" text @click="isEditingContent = true" />
            </template>
            <template v-else>
              <div class="flex gap-2">
                <Button label="Annuleren" size="small" severity="secondary" outlined @click="isEditingContent = false" />
                <Button label="Opslaan" size="small" @click="isEditingContent = false" />
              </div>
            </template>
          </div>
          <Transition name="card-fade" mode="out-in">
            <div v-if="!isEditingContent" key="view" class="view-card-body">
              <div class="fr-row fr-row--top">
                <span class="fr-label">Hero afbeelding</span>
                <img :src="winkel.heroAfbeelding" class="content-img" alt="Hero" />
              </div>
              <div class="fr-row fr-row--top">
                <span class="fr-label">Overzicht afbeelding</span>
                <img :src="winkel.overzichtAfbeelding" class="content-img" alt="Overzicht" />
              </div>
              <div v-for="(img, i) in winkel.sfeerimpressies" :key="i" class="fr-row fr-row--top">
                <span class="fr-label">Sfeerimpressie {{ i + 1 }}</span>
                <img v-if="img" :src="img" class="content-img" :alt="`Sfeerimpressie ${i + 1}`" />
                <span v-else class="fr-empty">Geen afbeelding</span>
              </div>
              <div class="fr-row">
                <span class="fr-label">Google 360 Tour</span>
                <span :class="winkel.google360Tour ? 'fr-value' : 'fr-empty'">{{ winkel.google360Tour || '—' }}</span>
              </div>
              <div class="fr-row">
                <span class="fr-label">YouTube video</span>
                <span :class="winkel.youtubeVideo ? 'fr-value' : 'fr-empty'">{{ winkel.youtubeVideo || '—' }}</span>
              </div>
            </div>
            <div v-else key="edit" class="view-card-body">
              <!-- Hero afbeelding -->
              <div class="fr-row fr-row--top">
                <label class="fr-label">Hero afbeelding</label>
                <div class="img-upload-field">
                  <div
                    v-if="!winkel.heroAfbeelding"
                    class="img-drop-zone"
                    :class="{ 'img-drop-zone--over': draggingField === 'hero' }"
                    @click="heroInput?.click()"
                    @dragover.prevent="draggingField = 'hero'"
                    @dragleave="draggingField = null"
                    @drop.prevent="(e: DragEvent) => { draggingField = null; applyImageFile(e.dataTransfer?.files?.[0], url => winkel.heroAfbeelding = url) }"
                  >
                    <i class="pi pi-image" style="font-size: 1.75rem" />
                    <span>Sleep een afbeelding hierheen</span>
                    <button class="img-select-btn" @click.stop="heroInput?.click()">of selecteer een bestand</button>
                  </div>
                  <div v-else class="img-file-row">
                    <img :src="winkel.heroAfbeelding" class="img-file-thumb" alt="Hero" />
                    <div class="flex flex-col gap-1">
                      <span class="text-sm font-medium text-surface-700">Hero afbeelding</span>
                      <button class="img-select-btn" @click="heroInput?.click()">Vervangen</button>
                    </div>
                    <button class="img-remove-btn" style="margin-left: auto" @click="winkel.heroAfbeelding = ''">
                      <i class="pi pi-times" />
                    </button>
                  </div>
                  <input ref="heroInput" type="file" accept="image/*" class="hidden" @change="(e: Event) => applyImageFile((e.target as HTMLInputElement).files?.[0], url => winkel.heroAfbeelding = url)" />
                </div>
              </div>
              <!-- Overzicht afbeelding -->
              <div class="fr-row fr-row--top">
                <label class="fr-label">Overzicht afbeelding</label>
                <div class="img-upload-field">
                  <div
                    v-if="!winkel.overzichtAfbeelding"
                    class="img-drop-zone"
                    :class="{ 'img-drop-zone--over': draggingField === 'overzicht' }"
                    @click="overzichtInput?.click()"
                    @dragover.prevent="draggingField = 'overzicht'"
                    @dragleave="draggingField = null"
                    @drop.prevent="(e: DragEvent) => { draggingField = null; applyImageFile(e.dataTransfer?.files?.[0], url => winkel.overzichtAfbeelding = url) }"
                  >
                    <i class="pi pi-image" style="font-size: 1.75rem" />
                    <span>Sleep een afbeelding hierheen</span>
                    <button class="img-select-btn" @click.stop="overzichtInput?.click()">of selecteer een bestand</button>
                  </div>
                  <div v-else class="img-file-row">
                    <img :src="winkel.overzichtAfbeelding" class="img-file-thumb" alt="Overzicht" />
                    <div class="flex flex-col gap-1">
                      <span class="text-sm font-medium text-surface-700">Overzicht afbeelding</span>
                      <button class="img-select-btn" @click="overzichtInput?.click()">Vervangen</button>
                    </div>
                    <button class="img-remove-btn" style="margin-left: auto" @click="winkel.overzichtAfbeelding = ''">
                      <i class="pi pi-times" />
                    </button>
                  </div>
                  <input ref="overzichtInput" type="file" accept="image/*" class="hidden" @change="(e: Event) => applyImageFile((e.target as HTMLInputElement).files?.[0], url => winkel.overzichtAfbeelding = url)" />
                </div>
              </div>
              <!-- Sfeerimpressies -->
              <div v-for="(img, i) in winkel.sfeerimpressies" :key="i" class="fr-row fr-row--top">
                <label class="fr-label">Sfeerimpressie {{ i + 1 }}</label>
                <div class="img-upload-field">
                  <div
                    v-if="!img"
                    class="img-drop-zone"
                    :class="{ 'img-drop-zone--over': draggingField === `sfeer-${i}` }"
                    @click="sfeerInputs[i]?.click()"
                    @dragover.prevent="draggingField = `sfeer-${i}`"
                    @dragleave="draggingField = null"
                    @drop.prevent="(e: DragEvent) => { draggingField = null; applyImageFile(e.dataTransfer?.files?.[0], url => winkel.sfeerimpressies[i] = url) }"
                  >
                    <i class="pi pi-image" style="font-size: 1.75rem" />
                    <span>Sleep een afbeelding hierheen</span>
                    <button class="img-select-btn" @click.stop="sfeerInputs[i]?.click()">of selecteer een bestand</button>
                  </div>
                  <div v-else class="img-file-row">
                    <img :src="img" class="img-file-thumb" :alt="`Sfeerimpressie ${i + 1}`" />
                    <div class="flex flex-col gap-1">
                      <span class="text-sm font-medium text-surface-700">Sfeerimpressie {{ i + 1 }}</span>
                      <button class="img-select-btn" @click="sfeerInputs[i]?.click()">Vervangen</button>
                    </div>
                    <button class="img-remove-btn" style="margin-left: auto" @click="winkel.sfeerimpressies[i] = ''">
                      <i class="pi pi-times" />
                    </button>
                  </div>
                  <input :ref="(el) => { if (el) sfeerInputs[i] = el as HTMLInputElement }" type="file" accept="image/*" class="hidden" @change="(e: Event) => applyImageFile((e.target as HTMLInputElement).files?.[0], url => winkel.sfeerimpressies[i] = url)" />
                </div>
              </div>
              <!-- Google 360 Tour -->
              <div class="fr-row">
                <label class="fr-label">Google 360 Tour</label>
                <InputText v-model="winkel.google360Tour" class="w-full" placeholder="Voer een code in" />
              </div>
              <!-- YouTube video -->
              <div class="fr-row">
                <label class="fr-label">YouTube video</label>
                <InputText v-model="winkel.youtubeVideo" class="w-full" placeholder="https://youtu.be/..." />
              </div>
            </div>
          </Transition>
        </div>
      </template>

    </div>
  </div>
</template>

<style scoped>
  .se-page {
    display: flex;
    flex-direction: column;
  }

  /* ── Header ──────────────────────────────────────────────────────────────── */
  .se-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.25rem;
    border-bottom: 1px solid var(--p-gray-100);
    background: white;
    flex-shrink: 0;
  }
  .se-avatar {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--p-primary-400) 0%, var(--p-primary-600) 100%);
    color: white;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .se-header-info {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .se-header-top {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-wrap: wrap;
  }
  .se-title {
    font-size: 1.0625rem;
    font-weight: 600;
    color: var(--p-surface-800);
    line-height: 1.2;
  }
  .se-subtitle {
    font-size: 0.8125rem;
    color: var(--p-surface-400);
  }

  /* ── Pills ───────────────────────────────────────────────────────────────── */
  .se-pill {
    font-size: 0.6875rem;
    font-weight: 600;
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    border: 1px solid;
    line-height: 1.5;
    width: fit-content;
  }
  .se-pill--type {
    background: var(--p-primary-50);
    color: var(--p-primary-700);
    border-color: var(--p-primary-100);
  }
  .se-pill--active {
    background: #dcfce7;
    color: #166534;
    border-color: #bbf7d0;
  }
  .se-pill--inactive {
    background: var(--p-gray-100);
    color: var(--p-gray-500);
    border-color: var(--p-gray-200);
  }

  /* ── Tabs ────────────────────────────────────────────────────────────────── */
  .se-tabs {
    display: flex;
    border-bottom: 1px solid var(--p-gray-200);
    background: white;
    flex-shrink: 0;
    padding-top: 0.5rem;
  }
  .se-tab {
    display: flex;
    align-items: center;
    gap: 0.575rem;
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
    border-bottom: 2px solid transparent;
  }
  .se-tab .pi {
    font-size: 0.875rem;
  }
  .se-tab:not(.se-tab--active):hover {
    background: var(--p-gray-50);
    color: var(--p-surface-800);
  }
  .se-tab--active {
    color: var(--p-surface-800);
    font-weight: 500;
    border-bottom-color: var(--p-primary-500);
    background: var(--p-primary-50);
  }

  /* ── Uitzonderingen ─────────────────────────────────────────────────────── */

  /* Edit mode */
  .uitzon-card {
    border: 1px solid var(--p-surface-200);
    border-radius: 0.5rem;
    overflow: hidden;
    margin-bottom: 0.625rem;
  }
  .uitzon-card:last-of-type { margin-bottom: 0; }
  .uitzon-header {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    background: var(--p-surface-50);
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--p-surface-200);
  }
  .uitzon-view-datum {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--p-surface-700);
    min-width: 6rem;
  }
  .uitzon-time { width: 5.5rem; }
  .uitzon-redens-edit {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 0;
  }
  .uitzon-redens-hdr {
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--p-surface-400);
    padding: 0.4rem 0.75rem 0.25rem;
    border-bottom: 1px solid var(--p-surface-100);
  }
  .uitzon-reden-row {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--p-surface-100);
  }
  .uitzon-reden-row:last-child { border-bottom: none; }
  .uitzon-reden-site-lbl {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--p-surface-500);
    width: 8.5rem;
    flex-shrink: 0;
  }

  /* ── Content images ──────────────────────────────────────────────────────── */
  .content-img {
    width: 100%;
    max-width: 28rem;
    height: auto;
    border-radius: 0.5rem;
    border: 1px solid var(--p-gray-200);
    display: block;
  }

  /* ── Image upload (mirrors CSV upload from AddProductsDialog) ────────────── */
  .img-upload-field {
    flex: 1;
    max-width: 28rem;
  }
  .img-drop-zone {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.375rem;
    padding: 1.75rem 1.5rem;
    border: 2px dashed var(--p-gray-200);
    border-radius: 0.5rem;
    cursor: pointer;
    color: var(--p-gray-400);
    font-size: 0.875rem;
    text-align: center;
    transition: border-color 0.15s, background 0.15s;
  }
  .img-drop-zone:hover,
  .img-drop-zone--over {
    border-color: var(--p-primary-300);
    background: var(--p-primary-50);
  }
  .img-select-btn {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--p-primary-600);
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: color 0.1s;
  }
  .img-select-btn:hover {
    color: var(--p-primary-800);
    text-decoration: underline;
  }
  .img-file-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: var(--p-gray-50);
    border: 1px solid var(--p-gray-100);
    border-radius: 0.5rem;
  }
  .img-file-thumb {
    width: 4.5rem;
    height: 3rem;
    object-fit: cover;
    border-radius: 0.375rem;
    flex-shrink: 0;
    border: 1px solid var(--p-gray-200);
  }
  .img-remove-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.375rem;
    height: 1.375rem;
    border-radius: 0.25rem;
    background: none;
    border: none;
    color: var(--p-surface-400);
    cursor: pointer;
    font-size: 0.75rem;
    flex-shrink: 0;
    transition: background 0.1s, color 0.1s;
  }
  .img-remove-btn:hover {
    background: var(--p-red-50);
    color: var(--p-red-500);
  }
</style>
