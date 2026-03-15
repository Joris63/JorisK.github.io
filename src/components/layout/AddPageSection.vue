<script setup lang="ts">
  interface Props {
    id: string;
    title: string;
    description?: string;
    icon?: string;
  }

  defineProps<Props>();
</script>

<template>
  <div :id="id" class="add-section">
    <div class="add-section-hdr">
      <i v-if="icon" :class="`pi ${icon} add-section-icon`" />
      <div>
        <div class="add-section-title">{{ title }}</div>
        <div v-if="description" class="add-section-desc">{{ description }}</div>
      </div>
    </div>
    <slot />
  </div>
</template>
