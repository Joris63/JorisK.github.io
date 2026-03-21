<script setup lang="ts">
  import { ref, inject } from 'vue';
  import type { Ref } from 'vue';
  import type { CustomerData } from '@/types/customer';

  const customer = inject<Ref<CustomerData>>('customer')!;

  const newAccountEmail = ref('');
  const emailChangeVisible = ref(false);

  function openEmailChange() {
    newAccountEmail.value = '';
    emailChangeVisible.value = true;
  }
  function submitEmailChange() {
    // TODO: call API
    emailChangeVisible.value = false;
  }
</script>

<template>
  <div class="tab-scroll">
    <!-- Card: Account informatie -->
    <div class="view-card">
      <div class="view-card-hdr">
        <span class="view-card-title">Account informatie</span>
      </div>
      <div class="view-card-body">
        <div class="fr-row">
          <span class="fr-label">Status</span>
          <span class="acct-status-badge">{{ customer.accountStatus }}</span>
        </div>
        <div class="fr-row">
          <span class="fr-label">Laatste login</span>
          <span class="fr-value">{{ customer.accountLastLogin }}</span>
        </div>
      </div>
    </div>

    <!-- Card: Wachtwoord resetten -->
    <div class="view-card">
      <div class="view-card-hdr">
        <span class="view-card-title">Wachtwoord resetten</span>
      </div>
      <div class="view-card-body">
        <p class="acct-desc">
          Als de klant niet kan inloggen op zijn account, kun je een e-mail voor het opnieuw
          instellen van het wachtwoord naar zijn gekoppelde e-mailadres sturen.
        </p>
      </div>
      <div class="view-card-action">
        <Button label="Stuur wachtwoord reset e-mail" size="small" severity="secondary" outlined />
      </div>
    </div>

    <!-- Card: E-mail adres wijzigen -->
    <div class="view-card">
      <div class="view-card-hdr">
        <span class="view-card-title">E-mail adres wijzigen</span>
      </div>
      <div class="view-card-body">
        <p class="acct-desc">
          Wijzig het e-mailadres van de klant. Er wordt een bevestigingsmail gestuurd naar het
          nieuwe adres.
        </p>
      </div>
      <div class="view-card-action">
        <Button
          label="Stuur wijzig e-mail adres e-mail"
          size="small"
          severity="secondary"
          outlined
          @click="openEmailChange"
        />
      </div>
    </div>
  </div>

  <Dialog
    v-model:visible="emailChangeVisible"
    header="E-mail adres wijzigen"
    :style="{ width: '28rem' }"
    modal
    :draggable="false"
  >
    <p class="acct-desc mb-5">
      Voer het nieuwe e-mailadres in. De klant ontvangt een bevestigingsmail op het nieuwe adres.
    </p>
    <div class="flex flex-col gap-1.5">
      <label class="fr-label">Nieuw e-mailadres</label>
      <InputText
        v-model="newAccountEmail"
        class="w-full"
        placeholder="naam@voorbeeld.nl"
        autofocus
      />
    </div>
    <template #footer>
      <Button
        label="Annuleren"
        severity="secondary"
        outlined
        @click="emailChangeVisible = false"
      />
      <Button label="Verstuur e-mail" :disabled="!newAccountEmail" @click="submitEmailChange" />
    </template>
  </Dialog>
</template>

<style scoped>
@reference "@/assets/style.css";
  .acct-status-badge {
    @apply w-fit inline-flex rounded bg-(--p-green-100) text-(--p-green-700) font-semibold py-0.5 px-2 text-sm;
  }
  .acct-desc {
    @apply text-(--p-surface-500) leading-[1.5] m-0 text-sm;
  }
</style>
