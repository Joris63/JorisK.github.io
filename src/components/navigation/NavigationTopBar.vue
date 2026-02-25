<script setup lang="ts">
  import { Breadcrumb } from 'primevue';
  import { ref, watch } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const home = ref({
    icon: 'pi pi-home',
    route: '/',
  });

  type BreadcrumbEntry = string | { label: string; route: string };

  function mapCrumbs(crumbs: BreadcrumbEntry[] | undefined) {
    return (crumbs ?? []).map((entry) =>
      typeof entry === 'string' ? { label: entry } : entry,
    );
  }

  const items = ref(mapCrumbs(route.meta.breadcrumbs as BreadcrumbEntry[] | undefined));

  watch(route, (newRoute) => {
    items.value = mapCrumbs(newRoute.meta.breadcrumbs as BreadcrumbEntry[] | undefined);
  });
</script>

<template>
  <div class="w-full px-1 bg-primary-500">
    <div class="py-2 flex justify-between items-center">
      <Breadcrumb :home="home" :model="items" class="py-0! bg-transparent!">
        <template #item="{ item, props }">
          <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
            <a
              :href="href"
              v-bind="props.action"
              class="text-neutral-50! flex items-center gap-1.5 font-medium text-primary hover:text-primary-700 transition-colors duration-150"
              @click="navigate"
            >
              <span v-if="item.icon" :class="[item.icon, 'text-xs']" />
              <span>{{ item.label }}</span>
            </a>
          </router-link>
          <a
            v-else
            :href="item.url"
            :target="item.target"
            v-bind="props.action"
            class="text-neutral-50! flex items-center cursor-default select-none"
          >
            <span>{{ item.label }}</span>
          </a>
        </template>
        <template #separator>
          <span class="text-primary-300 text-xs select-none">/</span>
        </template>
      </Breadcrumb>
      <div
        class="flex items-center gap-1 border border-white/20 rounded-lg px-2 py-1 bg-white/10 backdrop-blur-sm"
      >
        <!-- User info + logout -->
        <span
          class="rounded-full w-8 h-8 flex items-center justify-center bg-primary-300/30 text-white"
        >
          <i class="pi pi-user"></i>
        </span>
        <span class="font-medium text-white px-1">Joris Kamminga</span>
        <Button
          type="button"
          icon="pi pi-sign-out"
          rounded
          variant="text"
          severity="warn"
          class="text-orange-300! hover:bg-orange-300/20!"
        />
        <!-- Divider -->
        <div class="w-px h-5 bg-white/20 mx-1" />
        <Select
          :options="[{ label: 'NL', value: 'NL' }]"
          option-label="label"
          option-value="value"
          :model-value="'NL'"
          :pt="{
            root: 'bg-transparent! border-white/20! hover:border-white/40! shadow-none! transition-colors duration-150',
            label: 'text-white! py-1.5! pl-2! pr-1! text-sm!',
            dropdown: 'text-white/60! w-6! px-0!',
          }"
        >
          <template #value="{ value }">
            <div class="flex items-center gap-2">
              <span :class="`fi fi-${value.toLowerCase()}`" />
              <span class="text-white text-sm font-medium">{{ value }}</span>
            </div>
          </template>
        </Select>
        <div class="w-px h-5 bg-white/20 mx-1" />
        <!-- Utility buttons -->
        <Button
          type="button"
          icon="pi pi-cog"
          rounded
          variant="text"
          class="text-white/70! hover:text-white! hover:bg-white/15!"
        />
        <Button
          type="button"
          icon="pi pi-expand"
          rounded
          variant="text"
          class="text-white/70! hover:text-white! hover:bg-white/15!"
        />
      </div>
    </div>
  </div>
</template>
