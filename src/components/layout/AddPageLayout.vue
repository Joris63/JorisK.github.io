<script setup lang="ts">
  import { useSlots } from 'vue';
  const slots = useSlots();
</script>

<template>
  <div class="add-page">
    <slot name="header" />
    <div class="add-body pt-5" :class="{ 'add-body--no-nav': !slots.nav }">
      <slot name="nav" />
      <div class="add-content">
        <slot />
      </div>
    </div>
    <div v-if="$slots.footer" class="add-footer">
      <slot name="footer" />
    </div>
  </div>
</template>
