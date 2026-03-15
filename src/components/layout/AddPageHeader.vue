<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import type { RouteLocationRaw } from 'vue-router';

  interface Props {
    title: string;
    subtitle?: string;
    back?: RouteLocationRaw;
  }

  const props = defineProps<Props>();
  const router = useRouter();
</script>

<template>
  <div class="add-hdr">
    <Button
      v-if="props.back"
      icon="pi pi-arrow-left"
      text
      severity="secondary"
      rounded
      @click="router.push(props.back)"
    />
    <div v-if="$slots.icon" class="add-hdr-icon">
      <slot name="icon" />
    </div>
    <div class="add-hdr-info">
      <div class="add-hdr-title">{{ props.title }}</div>
      <div v-if="props.subtitle" class="add-hdr-subtitle">{{ props.subtitle }}</div>
    </div>
    <div v-if="$slots.actions" class="ml-auto flex items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
