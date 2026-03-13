<script setup lang="ts">
  const editing = defineModel<boolean>({ required: true });

  defineProps<{
    title: string;
    disabled?: boolean;
  }>();

  const emit = defineEmits<{ save: []; cancel: [] }>();

  function save() {
    emit('save');
    editing.value = false;
  }

  function cancel() {
    emit('cancel');
    editing.value = false;
  }
</script>

<template>
  <div>
    <div class="view-card-hdr">
      <span class="view-card-title">{{ title }}</span>
      <template v-if="!editing && !disabled">
        <Button
          label="Bewerken"
          icon="pi pi-pencil"
          size="small"
          severity="secondary"
          text
          @click="editing = true"
        />
      </template>
      <template v-else>
        <div class="flex gap-2">
          <Button label="Annuleren" size="small" severity="secondary" outlined @click="cancel" />
          <Button label="Opslaan" size="small" @click="save" />
        </div>
      </template>
    </div>
    <Transition name="card-fade" mode="out-in">
      <div v-if="!editing" key="view">
        <slot name="view" />
      </div>
      <div v-else key="edit">
        <slot name="edit" />
      </div>
    </Transition>
  </div>
</template>
