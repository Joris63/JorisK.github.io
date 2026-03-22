<script setup lang="ts">
  defineProps<{
    naam: string;
    email: string;
  }>();

  const emit = defineEmits<{ close: [] }>();
</script>

<template>
  <div class="customer-indicator">
    <div class="customer-indicator__avatar"><i class="pi pi-user" /></div>
    <div class="flex flex-col leading-snug">
      <span class="text-base font-semibold">{{ naam }}</span>
      <span class="text-xs text-gray-400">{{ email }}</span>
    </div>
    <Button
      icon="pi pi-times"
      text
      severity="secondary"
      size="small"
      rounded
      class="ml-auto shrink-0"
      @click="emit('close')"
    />
  </div>
</template>
