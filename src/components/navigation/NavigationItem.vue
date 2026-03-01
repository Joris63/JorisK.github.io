<script setup lang="ts">
  import type { NavItem } from '@/types/navigation';
  import { ref, computed, watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';

  interface Props {
    item: NavItem;
    isChild?: boolean;
    collapsed?: boolean;
  }

  const router = useRouter();
  const route = useRoute();
  const props = defineProps<Props>();

  const isOpen = ref(false);
  const hasChildren = computed(() => 'children' in props.item);
  const isOldAdminRoute = computed<boolean>(() => 'isOldAdmin' in props.item);

  const isActive = computed(
    () =>
      'route' in props.item &&
      !isOldAdminRoute.value &&
      route.path === props.item.route &&
      (props.item.route !== '/' || !props.isChild)
  );

  const hasActiveChild = computed(() => {
    if (!('children' in props.item)) return false;
    return (props.item as any).children.some(
      (child: any) =>
        'route' in child &&
        !('isOldAdmin' in child) &&
        child.route !== '/' &&
        route.path === child.route
    );
  });

  // Auto-open the group when a child is the active route
  watch(
    hasActiveChild,
    (val) => {
      if (val) isOpen.value = true;
    },
    { immediate: true }
  );

  const goToRoute = () => {
    if ('route' in props.item) router.push(props.item.route);
  };
</script>

<template>
  <!-- ── Group (has children) ───────────────────────────── -->
  <template v-if="hasChildren">
    <button
      :class="[
        'nav-btn w-full flex items-center gap-2 px-2 rounded-md',
        collapsed ? 'justify-center py-2' : 'justify-start py-1.5',
        hasActiveChild
          ? 'text-primary-700 bg-primary-50'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700',
      ]"
      :title="collapsed ? props.item.label : undefined"
      @click="isOpen = !isOpen"
    >
      <i
        :class="`pi ${props.item.icon} text-sm shrink-0 ${hasActiveChild ? 'text-primary-500' : 'text-gray-400'}`"
      />
      <template v-if="!collapsed">
        <span class="flex-1 text-left text-sm font-normal">{{ props.item.label }}</span>
        <i :class="`pi ${isOpen ? 'pi-chevron-up' : 'pi-chevron-down'} text-gray-400 text-xs`" />
      </template>
    </button>

    <!-- Children (hidden when collapsed) -->
    <div
      v-if="!collapsed"
      class="grid transition-[grid-template-rows] duration-200 ease-in-out"
      :style="{ gridTemplateRows: isOpen ? '1fr' : '0fr' }"
    >
      <div class="overflow-hidden">
        <div class="flex flex-col ml-3 pl-2 border-l-2 border-gray-200 mb-1">
          <NavigationItem
            v-for="child in (item as any).children"
            :key="child.label"
            :item="child"
            :is-child="true"
          />
        </div>
      </div>
    </div>
  </template>

  <!-- ── Leaf item ──────────────────────────────────────── -->
  <button
    v-else
    :class="[
      'nav-btn w-full flex items-center gap-2 rounded-md',
      collapsed ? 'justify-center py-2 px-2' : 'justify-start py-1.5 px-2',
      isActive
        ? 'text-primary-700 bg-primary-50 font-semibold'
        : isChild
          ? 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
          : 'text-gray-700 hover:bg-gray-100',
    ]"
    :title="collapsed ? props.item.label : undefined"
    @click="goToRoute"
  >
    <i
      v-if="props.item.icon"
      :class="`pi ${props.item.icon} text-sm shrink-0 ${isActive ? 'text-primary-500' : 'text-gray-400'}`"
    />
    <template v-if="!collapsed">
      <span class="flex-1 text-left text-sm">{{ props.item.label }}</span>
      <i v-if="isOldAdminRoute" class="pi pi-external-link text-gray-400 text-xs shrink-0" />
    </template>
  </button>
</template>

<style scoped>
  .nav-btn {
    border: none;
    background: transparent;
    cursor: pointer;
    transition:
      background 0.15s ease,
      color 0.15s ease;
    text-align: left;
  }
</style>
