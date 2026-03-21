<script setup lang="ts">
  import { ref, computed, watch } from 'vue';

  interface Customer {
    id: number;
    naam: string;
    bedrijf: string;
    email: string;
    stad: string;
  }

  const emit = defineEmits<{ select: [customer: Customer] }>();
  const visible = defineModel<boolean>();

  const email = ref('');
  const companyName = ref('');
  const lastName = ref('');
  const postalCode = ref('');
  const houseNumber = ref('');

  const phase = ref<'search' | 'results'>('search');
  const results = ref<Customer[]>([]);

  const canSearch = computed(
    () =>
      email.value.trim() ||
      companyName.value.trim() ||
      lastName.value.trim() ||
      postalCode.value.trim() ||
      houseNumber.value.trim()
  );

  const MOCK_CUSTOMERS: Customer[] = [
    { id: 1, naam: 'Jan de Vries', bedrijf: 'Showroomworks BV', email: 'jan@showroomworks.nl', stad: 'Amsterdam' },
    { id: 2, naam: 'Marie Janssen', bedrijf: 'Janssen Interieur', email: 'm.janssen@interieur.nl', stad: 'Rotterdam' },
    { id: 3, naam: 'Peter de Groot', bedrijf: '', email: 'p.degroot@gmail.com', stad: 'Utrecht' },
    { id: 4, naam: 'Sandra van den Berg', bedrijf: 'Van den Berg Design', email: 'sandra@vdberg.nl', stad: 'Eindhoven' },
    { id: 5, naam: 'Tom Bakker', bedrijf: 'Bakker & Zn.', email: 'tom@bakker.com', stad: 'Den Haag' },
  ];

  function search() {
    const q = lastName.value.trim().toLowerCase() || companyName.value.trim().toLowerCase();
    results.value = q
      ? MOCK_CUSTOMERS.filter(
          (c) => c.naam.toLowerCase().includes(q) || c.bedrijf.toLowerCase().includes(q)
        )
      : MOCK_CUSTOMERS;
    phase.value = 'results';
  }

  function reset() {
    phase.value = 'search';
    results.value = [];
  }

  function select(customer: Customer) {
    emit('select', customer);
    visible.value = false;
  }

  watch(visible, (val) => {
    if (!val) {
      email.value = '';
      companyName.value = '';
      lastName.value = '';
      postalCode.value = '';
      houseNumber.value = '';
      phase.value = 'search';
      results.value = [];
    }
  });
</script>

<template>
  <Drawer
    v-model:visible="visible"
    header="Klant zoeken"
    position="right"
    class="w-120!"
    :pt="{ content: { class: 'flex flex-col gap-0 p-0! overflow-hidden' } }"
  >
    <div class="flex flex-col overflow-y-auto flex-1">
      <Transition name="collapse" mode="out-in">
        <!-- ── Search form ────────────────────────────────────── -->
        <div v-if="phase === 'search'" key="search" class="drw-section">
          <div class="drw-field">
            <label class="drw-label">E-mail</label>
            <InputText v-model="email" placeholder="jan@bedrijf.nl" />
          </div>
          <div class="drw-field">
            <label class="drw-label">Bedrijfsnaam</label>
            <InputText v-model="companyName" placeholder="Showroomworks BV" />
          </div>
          <div class="drw-field">
            <label class="drw-label">Achternaam</label>
            <InputText v-model="lastName" placeholder="de Vries" @keydown.enter="canSearch && search()" />
          </div>
          <div class="drw-grid">
            <div class="drw-field">
              <label class="drw-label">Postcode</label>
              <InputText v-model="postalCode" placeholder="1234 AB" />
            </div>
            <div class="drw-field">
              <label class="drw-label">Huisnummer</label>
              <InputText v-model="houseNumber" placeholder="12" />
            </div>
          </div>
        </div>

        <!-- ── Results ───────────────────────────────────────── -->
        <div v-else key="results" class="drw-section">
          <p class="drw-section-hdr">{{ results.length }} resultaten gevonden</p>
          <div v-if="results.length" class="drw-list">
            <button
              v-for="c in results"
              :key="c.id"
              class="drw-list-item"
              @click="select(c)"
            >
              <div class="cust-info">
                <span class="cust-naam">{{ c.naam }}</span>
                <span class="cust-sub">
                  {{ [c.bedrijf, c.email].filter(Boolean).join(' · ') }}
                  <template v-if="c.stad"> · {{ c.stad }}</template>
                </span>
              </div>
              <i class="pi pi-chevron-right cust-chevron" />
            </button>
          </div>
          <p v-else class="drw-empty">Geen klanten gevonden.</p>
        </div>
      </Transition>
    </div>

    <div class="drawer-footer">
      <Button
        v-if="phase === 'results'"
        label="Terug"
        severity="secondary"
        outlined
        icon="pi pi-arrow-left"
        @click="reset"
      />
      <Button
        v-if="phase === 'search'"
        label="Zoeken"
        icon="pi pi-search"
        :disabled="!canSearch"
        @click="search"
      />
    </div>
  </Drawer>
</template>

<style scoped>
@reference "@/assets/style.css";
  .cust-info {
    @apply flex flex-col flex-1 min-w-0 text-left;
  }
  .cust-naam {
    @apply text-sm font-medium text-(--sw-text-sub) truncate;
  }
  .cust-sub {
    @apply text-xs text-(--sw-text-muted) truncate mt-0.5;
  }
  .cust-chevron {
    @apply shrink-0 text-(--sw-text-muted);
    font-size: 0.65rem;
  }
</style>
