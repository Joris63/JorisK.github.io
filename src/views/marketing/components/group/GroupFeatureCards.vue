<script setup lang="ts">
  import { computed } from 'vue';
  import type { Feature } from './groupFeatures';
  import { ALL_FEATURES } from './groupFeatures';

  const props = defineProps<{
    activeFeatures: Feature[];
    siteLabels: string[];
    labelColorOverride: boolean;
    labelColorHex: string;
    labelTextsOpen: boolean;
    labelTexts: Record<string, string>;
    preTextsOpen: boolean;
    preTexts: Record<string, string>;
    actietimerDagen: number;
    prijsBedrag: string;
    prijsModType: 'percentage' | 'bedrag';
    prijsVergelijking: 'van-voor' | 'advies';
  }>();

  const emit = defineEmits<{
    'remove-feature': [key: Feature];
    'add-feature': [key: Feature];
    'update:labelColorOverride': [val: boolean];
    'update:labelColorHex': [val: string];
    'update:labelTextsOpen': [val: boolean];
    'update:labelTexts': [val: Record<string, string>];
    'update:preTextsOpen': [val: boolean];
    'update:preTexts': [val: Record<string, string>];
    'update:actietimerDagen': [val: number];
    'update:prijsBedrag': [val: string];
    'update:prijsModType': [val: 'percentage' | 'bedrag'];
    'update:prijsVergelijking': [val: 'van-voor' | 'advies'];
  }>();

  const availableFeatures = computed(() =>
    ALL_FEATURES.filter((f) => !props.activeFeatures.includes(f.key))
  );

  function hasFeature(key: Feature) {
    return props.activeFeatures.includes(key);
  }

  // ColorPicker uses hex without '#'
  const labelColor = computed({
    get: () => props.labelColorHex.replace('#', ''),
    set: (v: string) => emit('update:labelColorHex', `#${v}`),
  });

  const PRIJS_MOD_OPTIONS = [
    { label: 'Percentage %', value: 'percentage' },
    { label: 'Bedrag €', value: 'bedrag' },
  ];

  const PRIJS_VERGELIJKING_OPTIONS = [
    { label: 'Van-voor prijs', value: 'van-voor' },
    { label: 'Adviesprijs', value: 'advies' },
  ];
</script>

<template>
  <!-- Active feature cards -->
  <TransitionGroup name="feature" tag="div" class="flex flex-col gap-2">
    <!-- Label -->
    <div v-if="hasFeature('label')" key="label" class="opt-card">
      <div class="opt-card__hdr">
        <div class="opt-card__title"><i class="pi pi-tag" /> Label</div>
        <button class="opt-remove" @click="emit('remove-feature', 'label')">
          <i class="pi pi-times" />
        </button>
      </div>
      <div class="opt-card__body">
        <div class="drw-field">
          <div class="drw-row">
            <div>
              <label class="drw-label">Kleur aanpassen</label>
              <p class="drw-hint">Overschrijf de standaard labelkleur</p>
            </div>
            <ToggleSwitch
              :model-value="labelColorOverride"
              @update:model-value="emit('update:labelColorOverride', $event)"
            />
          </div>
          <Transition name="collapse">
            <div v-if="labelColorOverride" class="drw-inset flex items-center gap-3">
              <ColorPicker v-model="labelColor" format="hex" />
              <InputText
                :model-value="labelColorHex"
                class="flex-1"
                size="small"
                placeholder="#000000"
                @update:model-value="(v: string | undefined) => emit('update:labelColorHex', v ?? '')"
              />
            </div>
          </Transition>
        </div>
        <div class="drw-field">
          <button class="drw-collapsible" @click="emit('update:labelTextsOpen', !labelTextsOpen)">
            <span class="drw-label">Tekst per site</span>
            <i
              :class="`pi ${labelTextsOpen ? 'pi-chevron-up' : 'pi-chevron-down'}`"
              class="drw-chevron"
            />
          </button>
          <Transition name="collapse">
            <div v-if="labelTextsOpen" class="drw-collapsible-body">
              <template v-if="siteLabels.length">
                <div v-for="site in siteLabels" :key="site" class="drw-field">
                  <label class="drw-label"><span class="drw-site">{{ site }}</span></label>
                  <InputText
                    :model-value="labelTexts[site]"
                    class="w-full"
                    placeholder="Bijv. Actie, Sale, …"
                    @update:model-value="(v: string | undefined) => emit('update:labelTexts', { ...labelTexts, [site]: v ?? '' })"
                  />
                </div>
              </template>
              <p v-else class="drw-hint">Selecteer eerst websites in de actie details.</p>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- Actietimer -->
    <div v-if="hasFeature('actietimer')" key="actietimer" class="opt-card">
      <div class="opt-card__hdr">
        <div class="opt-card__title"><i class="pi pi-clock" /> Actietimer</div>
        <button class="opt-remove" @click="emit('remove-feature', 'actietimer')">
          <i class="pi pi-times" />
        </button>
      </div>
      <div class="opt-card__body">
        <div class="flex items-center gap-3">
          <span class="drw-hint flex-1">Afteltimer start X dagen voor de einddatum</span>
          <InputNumber
            :model-value="actietimerDagen"
            :min="1"
            :max="365"
            class="w-[5rem] shrink-0"
            :input-style="{ width: '100%' }"
            @update:model-value="emit('update:actietimerDagen', $event)"
          />
        </div>
      </div>
    </div>

    <!-- Prijsmodificatie -->
    <div v-if="hasFeature('prijsmodificatie')" key="prijsmodificatie" class="opt-card">
      <div class="opt-card__hdr">
        <div class="opt-card__title"><i class="pi pi-percentage" /> Prijsmodificatie</div>
        <button class="opt-remove" @click="emit('remove-feature', 'prijsmodificatie')">
          <i class="pi pi-times" />
        </button>
      </div>
      <div class="opt-card__body">
        <div class="flex items-center gap-2">
          <InputText
            :model-value="prijsBedrag"
            class="flex-1"
            placeholder="0"
            @update:model-value="(v: string | undefined) => emit('update:prijsBedrag', v ?? '')"
          />
          <Select
            :model-value="prijsModType"
            :options="PRIJS_MOD_OPTIONS"
            option-label="label"
            option-value="value"
            class="w-[9.5rem]"
            @update:model-value="emit('update:prijsModType', $event)"
          />
        </div>
        <SelectButton
          :model-value="prijsVergelijking"
          :options="PRIJS_VERGELIJKING_OPTIONS"
          option-label="label"
          option-value="value"
          @update:model-value="emit('update:prijsVergelijking', $event)"
        />
      </div>
    </div>

    <!-- Prijskleurmodificatie -->
    <div v-if="hasFeature('prijskleur')" key="prijskleur" class="opt-card">
      <div class="opt-card__hdr">
        <div class="opt-card__title"><i class="pi pi-palette" /> Prijskleurmodificatie</div>
        <button class="opt-remove" @click="emit('remove-feature', 'prijskleur')">
          <i class="pi pi-times" />
        </button>
      </div>
      <div class="opt-card__body">
        <p class="drw-hint">Prijzen worden getoond in de kleur van de actie.</p>
      </div>
    </div>

    <!-- Pre-tekst -->
    <div v-if="hasFeature('pretekst')" key="pretekst" class="opt-card">
      <div class="opt-card__hdr">
        <div class="opt-card__title"><i class="pi pi-align-left" /> Pre-tekst per site</div>
        <button class="opt-remove" @click="emit('remove-feature', 'pretekst')">
          <i class="pi pi-times" />
        </button>
      </div>
      <div class="opt-card__body">
        <template v-if="siteLabels.length">
          <div v-for="site in siteLabels" :key="site" class="drw-field">
            <label class="drw-label drw-site">{{ site }}</label>
            <Textarea
              :model-value="preTexts[site]"
              class="w-full"
              :rows="3"
              placeholder="Tekst bij de productbeschrijving…"
              @update:model-value="emit('update:preTexts', { ...preTexts, [site]: $event })"
            />
          </div>
        </template>
        <p v-else class="drw-hint">Selecteer eerst websites in de actie details.</p>
      </div>
    </div>
  </TransitionGroup>

  <!-- Add list -->
  <div
    v-if="availableFeatures.length"
    class="opt-add-list"
    :class="{ 'opt-add-list--mt': activeFeatures.length }"
  >
    <button
      v-for="f in availableFeatures"
      :key="f.key"
      class="opt-add-btn"
      @click="emit('add-feature', f.key)"
    >
      <i class="pi pi-plus opt-add-btn__icon" />
      <span>{{ f.label }}</span>
    </button>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";
  .drw-site {
    @apply font-medium text-(--sw-text-label) text-base;
  }

  .drw-collapsible {
    @apply flex items-center justify-between w-full cursor-pointer text-left bg-none border-none p-0;
  }
  .drw-collapsible:hover .drw-label {
    @apply text-primary-600;
  }
  .drw-collapsible:hover .drw-chevron {
    @apply text-primary-400;
  }
  .drw-chevron {
    @apply text-(--sw-text-muted) text-xs;
    transition: color var(--sw-duration-fast);
  }
  .drw-collapsible-body {
    @apply flex flex-col gap-3.5 mt-3;
  }

  /* Feature cards */
  .opt-card {
    @apply border-[1.5px] border-(--sw-border-md) rounded-lg overflow-hidden;
  }
  .opt-card__hdr {
    @apply flex items-center justify-between bg-(--sw-bg-subtle) border-b border-(--sw-border) px-3 py-2;
  }
  .opt-card__title {
    @apply flex items-center font-semibold text-(--sw-text-strong) text-base gap-2;
  }
  .opt-card__title .pi {
    @apply text-[0.8rem] text-(--sw-text-muted);
  }
  .opt-card__body {
    @apply flex flex-col py-3.5 px-4 gap-3.5;
  }
  .opt-remove {
    @apply flex items-center justify-center rounded shrink-0 cursor-pointer text-(--sw-text-muted) w-[1.375rem] h-[1.375rem] bg-none border-none text-xs;
    transition: background var(--sw-duration-fast), color var(--sw-duration-fast);
  }
  .opt-remove:hover {
    @apply bg-red-50 text-red-500;
  }

  /* Add list */
  .opt-add-list {
    @apply flex flex-col;
  }
  .opt-add-list--mt {
    @apply border-t border-(--sw-border) mt-1 pt-3;
  }
  .opt-add-btn {
    @apply flex items-center cursor-pointer text-base text-(--sw-text-label) rounded-md text-left gap-2 py-1.5 px-2 border-none bg-none;
    transition: background var(--sw-duration-fast), color var(--sw-duration-fast);
  }
  .opt-add-btn:hover {
    @apply bg-primary-50 text-primary-600;
  }
  .opt-add-btn:hover .opt-add-btn__icon {
    @apply text-primary-500;
  }
  .opt-add-btn__icon {
    @apply text-xs text-(--sw-text-muted);
    transition: color var(--sw-duration-fast);
  }

  /* collapse transition — defined globally in cards.css */

  .feature-enter-active {
    transition: opacity var(--sw-duration-slow) var(--sw-ease), transform var(--sw-duration-slow) var(--sw-ease);
  }
  .feature-leave-active {
    transition: opacity var(--sw-duration-base) var(--sw-ease), transform var(--sw-duration-base) var(--sw-ease);
  }
  .feature-enter-from,
  .feature-leave-to {
    @apply opacity-0;
    transform: translateY(-0.5rem);
  }
</style>
