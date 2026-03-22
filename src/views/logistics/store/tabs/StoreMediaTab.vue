<!-- eslint-disable vue/no-mutating-props -->
<!-- Props are intentionally mutable here: store is a shared Record<string, any> mock object -->
<script setup lang="ts">
import { ref } from 'vue';
import EditableCard from '@/components/EditableCard.vue';

interface StoreMedia {
  heroImage: string;
  overviewImage: string;
  atmosphereImages: string[];
  google360Tour: string;
  youtubeVideo: string;
  [key: string]: any;
}

defineProps<{
  store: StoreMedia;
}>();

const isEditingContent = ref(false);

const heroInput = ref<HTMLInputElement | null>(null);
const overviewInput = ref<HTMLInputElement | null>(null);
const sfeerInputs: (HTMLInputElement | null)[] = [null, null, null, null];
const draggingField = ref<string | null>(null);

function applyImageFile(file: File | undefined, setter: (url: string) => void) {
  if (file?.type.startsWith('image/')) setter(URL.createObjectURL(file));
}
</script>

<template>
  <!-- Afbeeldingen & media -->
  <EditableCard v-model="isEditingContent" title="Afbeeldingen & media">
    <template #view>
      <div class="view-card-body">
        <div class="fr-row fr-row--top">
          <span class="fr-label">Hero afbeelding</span>
          <img :src="store.heroImage" class="content-img" alt="Hero" />
        </div>
        <div class="fr-row fr-row--top">
          <span class="fr-label">Overzicht afbeelding</span>
          <img :src="store.overviewImage" class="content-img" alt="Overzicht" />
        </div>
        <div v-for="(img, i) in store.atmosphereImages" :key="i" class="fr-row fr-row--top">
          <span class="fr-label">Sfeerimpressie {{ i + 1 }}</span>
          <img v-if="img" :src="img" class="content-img" :alt="`Sfeerimpressie ${i + 1}`" />
          <span v-else class="fr-empty">Geen afbeelding</span>
        </div>
        <div class="fr-row">
          <span class="fr-label">Google 360 Tour</span>
          <span :class="store.google360Tour ? 'fr-value' : 'fr-empty'">{{ store.google360Tour || '—' }}</span>
        </div>
        <div class="fr-row">
          <span class="fr-label">YouTube video</span>
          <span :class="store.youtubeVideo ? 'fr-value' : 'fr-empty'">{{ store.youtubeVideo || '—' }}</span>
        </div>
      </div>
    </template>
    <template #edit>
      <div class="view-card-body">
        <!-- Hero afbeelding -->
        <div class="fr-row fr-row--top">
          <label class="fr-label">Hero afbeelding</label>
          <div class="img-upload-field">
            <div
              v-if="!store.heroImage"
              class="img-drop-zone"
              :class="{ 'img-drop-zone--over': draggingField === 'hero' }"
              @click="heroInput?.click()"
              @dragover.prevent="draggingField = 'hero'"
              @dragleave="draggingField = null"
              @drop.prevent="
                (e: DragEvent) => {
                  draggingField = null;
                  applyImageFile(e.dataTransfer?.files?.[0], (url) => (store.heroImage = url));
                }
              "
            >
              <i class="pi pi-image text-[1.75rem]" />
              <span>Sleep een afbeelding hierheen</span>
              <button class="img-select-btn" @click.stop="heroInput?.click()">of selecteer een bestand</button>
            </div>
            <div v-else class="img-file-row">
              <img :src="store.heroImage" class="img-file-thumb" alt="Hero" />
              <div class="flex flex-col gap-1">
                <span class="text-base font-medium text-surface-700">Hero afbeelding</span>
                <button class="img-select-btn" @click="heroInput?.click()">Vervangen</button>
              </div>
              <button class="img-remove-btn ml-auto" @click="store.heroImage = ''">
                <i class="pi pi-times" />
              </button>
            </div>
            <input
              ref="heroInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="
                (e: Event) =>
                  applyImageFile(
                    (e.target as HTMLInputElement).files?.[0],
                    (url) => (store.heroImage = url)
                  )
              "
            />
          </div>
        </div>
        <!-- Overzicht afbeelding -->
        <div class="fr-row fr-row--top">
          <label class="fr-label">Overzicht afbeelding</label>
          <div class="img-upload-field">
            <div
              v-if="!store.overviewImage"
              class="img-drop-zone"
              :class="{ 'img-drop-zone--over': draggingField === 'overview' }"
              @click="overviewInput?.click()"
              @dragover.prevent="draggingField = 'overview'"
              @dragleave="draggingField = null"
              @drop.prevent="
                (e: DragEvent) => {
                  draggingField = null;
                  applyImageFile(e.dataTransfer?.files?.[0], (url) => (store.overviewImage = url));
                }
              "
            >
              <i class="pi pi-image text-[1.75rem]" />
              <span>Sleep een afbeelding hierheen</span>
              <button class="img-select-btn" @click.stop="overviewInput?.click()">of selecteer een bestand</button>
            </div>
            <div v-else class="img-file-row">
              <img :src="store.overviewImage" class="img-file-thumb" alt="Overzicht" />
              <div class="flex flex-col gap-1">
                <span class="text-base font-medium text-surface-700">Overzicht afbeelding</span>
                <button class="img-select-btn" @click="overviewInput?.click()">Vervangen</button>
              </div>
              <button class="img-remove-btn ml-auto" @click="store.overviewImage = ''">
                <i class="pi pi-times" />
              </button>
            </div>
            <input
              ref="overviewInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="
                (e: Event) =>
                  applyImageFile(
                    (e.target as HTMLInputElement).files?.[0],
                    (url) => (store.overviewImage = url)
                  )
              "
            />
          </div>
        </div>
        <!-- Atmosphere images -->
        <div v-for="(img, i) in store.atmosphereImages" :key="i" class="fr-row fr-row--top">
          <label class="fr-label">Sfeerimpressie {{ i + 1 }}</label>
          <div class="img-upload-field">
            <div
              v-if="!img"
              class="img-drop-zone"
              :class="{ 'img-drop-zone--over': draggingField === `atmosphere-${i}` }"
              @click="sfeerInputs[i]?.click()"
              @dragover.prevent="draggingField = `atmosphere-${i}`"
              @dragleave="draggingField = null"
              @drop.prevent="
                (e: DragEvent) => {
                  draggingField = null;
                  applyImageFile(e.dataTransfer?.files?.[0], (url) => (store.atmosphereImages[i] = url));
                }
              "
            >
              <i class="pi pi-image text-[1.75rem]" />
              <span>Sleep een afbeelding hierheen</span>
              <button class="img-select-btn" @click.stop="sfeerInputs[i]?.click()">of selecteer een bestand</button>
            </div>
            <div v-else class="img-file-row">
              <img :src="img" class="img-file-thumb" :alt="`Sfeerimpressie ${i + 1}`" />
              <div class="flex flex-col gap-1">
                <span class="text-base font-medium text-surface-700">Sfeerimpressie {{ i + 1 }}</span>
                <button class="img-select-btn" @click="sfeerInputs[i]?.click()">Vervangen</button>
              </div>
              <button class="img-remove-btn ml-auto" @click="store.atmosphereImages[i] = ''">
                <i class="pi pi-times" />
              </button>
            </div>
            <input
              :ref="
                (el) => {
                  if (el) sfeerInputs[i] = el as HTMLInputElement;
                }
              "
              type="file"
              accept="image/*"
              class="hidden"
              @change="
                (e: Event) =>
                  applyImageFile(
                    (e.target as HTMLInputElement).files?.[0],
                    (url) => (store.atmosphereImages[i] = url)
                  )
              "
            />
          </div>
        </div>
        <!-- Google 360 Tour -->
        <div class="fr-row">
          <label class="fr-label">Google 360 Tour</label>
          <InputText v-model="store.google360Tour" class="w-full" placeholder="Voer een code in" />
        </div>
        <!-- YouTube video -->
        <div class="fr-row">
          <label class="fr-label">YouTube video</label>
          <InputText v-model="store.youtubeVideo" class="w-full" placeholder="https://youtu.be/..." />
        </div>
      </div>
    </template>
  </EditableCard>
</template>

<style scoped>
@reference "@/assets/style.css";
.content-img {
  @apply w-full max-w-[28rem] h-auto rounded-lg border border-gray-200 block;
}

.img-upload-field {
  @apply flex-1 max-w-[28rem];
}
.img-drop-zone {
  transition:
    border-color var(--sw-duration-base),
    background var(--sw-duration-base);
  @apply flex flex-col items-center border-2 border-dashed border-gray-200 rounded-lg cursor-pointer text-gray-400 text-base text-center gap-1.5 py-7 px-6;
}
.img-drop-zone:hover,
.img-drop-zone--over {
  @apply border-[var(--p-primary-300)] bg-[var(--p-primary-50)];
}
.img-select-btn {
  transition: color var(--sw-duration-fast);
  @apply text-base font-semibold text-[var(--p-primary-600)] bg-transparent border-0 p-0 cursor-pointer;
}
.img-select-btn:hover {
  @apply text-[var(--p-primary-800)] underline;
}
.img-file-row {
  @apply flex items-center bg-gray-50 border border-gray-100 rounded-lg gap-3 px-4 py-3;
}
.img-file-thumb {
  @apply w-[4.5rem] h-12 object-cover rounded-md shrink-0 border border-gray-200;
}
.img-remove-btn {
  transition:
    background var(--sw-duration-fast),
    color var(--sw-duration-fast);
  @apply flex items-center justify-center rounded bg-transparent border-0 text-(--sw-text-muted) cursor-pointer text-xs shrink-0 w-[1.375rem] h-[1.375rem];
}
.img-remove-btn:hover {
  @apply bg-red-50 text-red-500;
}
</style>
