<script setup lang="ts">
  import { ref, computed } from 'vue';

  const visible = defineModel<boolean>();

  const showroomOptions = ref([
    { label: 'Rosmalen', value: 1 },
    { label: 'Tilburg', value: 2 },
    { label: 'Rotterdam', value: 3 },
    { label: 'Amsterdam', value: 4 },
  ]);

  const selectedShowroom = ref(1);

  const today = new Date();

  function addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  function formatDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  function formatDateLabel(date: Date): string {
    const key = formatDateKey(date);
    if (key === formatDateKey(today)) return 'Vandaag';
    if (key === formatDateKey(addDays(today, 1))) return 'Morgen';
    return date.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  // Mock appointments per date key → showroom id
  const mockAppointments: Record<string, Record<number, { time: string; name: string }[]>> = {
    [formatDateKey(today)]: {
      1: [
        { time: '12:00', name: 'van Sambeek' },
        { time: '12:00', name: 'Klep' },
        { time: '14:30', name: 'Van iersel' },
        { time: '14:30', name: 'Reijs' },
      ],
      2: [
        { time: '10:00', name: 'Janssen' },
        { time: '13:00', name: 'de Vries' },
      ],
    },
    [formatDateKey(addDays(today, 1))]: {
      1: [
        { time: '09:30', name: 'Pieters' },
        { time: '11:00', name: 'Bakker' },
        { time: '15:00', name: 'de Groot' },
      ],
      3: [{ time: '10:30', name: 'Vermeulen' }],
    },
    [formatDateKey(addDays(today, 2))]: {
      1: [
        { time: '10:00', name: 'Hendriksen' },
        { time: '13:30', name: 'van den Berg' },
      ],
      2: [{ time: '14:00', name: 'Smit' }],
    },
    [formatDateKey(addDays(today, 3))]: {
      1: [{ time: '11:30', name: 'Willems' }],
      4: [
        { time: '09:00', name: 'Timmermans' },
        { time: '16:00', name: 'van Dijk' },
      ],
    },
    [formatDateKey(addDays(today, 4))]: {
      2: [{ time: '10:30', name: 'Meijer' }],
      3: [
        { time: '11:00', name: 'de Jong' },
        { time: '14:30', name: 'Visser' },
      ],
    },
  };

  // Build a list of the next N days with their appointments for the selected showroom
  const days = computed(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const date = addDays(today, i);
      const key = formatDateKey(date);
      return {
        label: formatDateLabel(date),
        appointments: mockAppointments[key]?.[selectedShowroom.value] ?? [],
      };
    });
  });
</script>

<template>
  <Drawer v-model:visible="visible" header="Afspraak zoeken" position="right" class="w-120!">
    <div class="flex flex-col gap-5">
      <Select
        v-model="selectedShowroom"
        :options="showroomOptions"
        option-label="label"
        option-value="value"
      />

      <div v-for="day in days" :key="day.label" class="flex flex-col gap-2">
        <span class="text-xs font-bold tracking-wider uppercase text-gray-400">{{
          day.label
        }}</span>

        <template v-if="day.appointments.length > 0">
          <button
            v-for="(appt, i) in day.appointments"
            :key="i"
            class="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 text-left hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer bg-white w-full"
          >
            <span class="text-sm font-medium tabular-nums text-gray-500 shrink-0 w-10">{{
              appt.time
            }}</span>
            <span class="w-px h-4 bg-gray-200 shrink-0" />
            <span class="text-sm">{{ appt.name }}</span>
          </button>
        </template>

        <p v-else class="text-sm text-gray-400 italic">Geen afspraken.</p>
      </div>
    </div>
  </Drawer>
</template>
