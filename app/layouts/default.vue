<script setup lang="ts">
import type { NavigationMenuItem, SidebarProps } from '@nuxt/ui'

defineProps<Pick<SidebarProps, 'variant' | 'collapsible' | 'side'>>()
const variant = ref<SidebarProps['variant']>('inset')
const collapsible = ref<SidebarProps['collapsible']>('icon')
const side = ref<SidebarProps['side']>('left')

const route = useRoute()

const open = ref(true)

const items: NavigationMenuItem[] = [
  [{
    label: 'Administration',
    type: 'label'
  },
  {
    label: 'Dashboard',
    icon: 'i-lucide-chart-pie',
    to: '/'
  },
  {
    label: 'Users',
    icon: 'i-lucide-user',
    to: '/users'
  },
  {
    label: 'Roles',
    icon: 'i-lucide-shield',
    to: '/roles'
  }],
  [
    {
      label: 'Provider',
      type: 'label'
    },
    {
      label: 'Dashboard',
      icon: 'i-lucide-chart-pie',
      to: '/provider'
    },
    {
      label: 'Offerings',
      icon: 'i-lucide-hand-heart',
      to: '/provider/offerings'
    },
    {
      label: 'Requests',
      icon: 'i-lucide-messages-square',
      to: ''
    },
    {
      label: 'Schedule',
      icon: 'i-lucide-calendar-days',
      to: ''
    },
    {
      label: 'Availed',
      icon: 'i-lucide-circle-check-big',
      to: ''
    },
    {
      label: 'Clients',
      icon: 'i-lucide-briefcase',
      to: ''
    },
    {
      label: 'Media',
      icon: 'i-lucide-image',
      to: ''
    },
    {
      label: 'Profile',
      icon: 'i-lucide-user',
      to: ''
    }
  ]
]

const isCollapsed = computed(() => collapsible.value === 'icon' && !open.value)
const pageTitle = computed(() => route.meta.title as string)
</script>

<template>
  <div class="flex flex-1 h-screen w-full" :class="[
    variant === 'inset' && 'bg-neutral-50 dark:bg-neutral-950',
    side === 'right' && 'flex-row-reverse'
  ]">
    <USidebar v-model:open="open" :variant="variant" :collapsible="collapsible" :side="side" :ui="{
      root: '[--sidebar-width-icon:4.5625rem]', container: 'h-full', header: 'px-5', body: 'scrollbar'
    }" close>
      <template #header="{ close }">
        <UIcon name="i-lucide-monitor" class="size-8 text-primary" />
        <UButton class="lg:hidden ml-auto" icon="i-lucide-x" color="neutral" variant="ghost" aria-label="Close sidebar"
          @click="close()" />
      </template>

      <UNavigationMenu :items="items" orientation="vertical" :collapsed="isCollapsed" :tooltip="{
        delayDuration: 200,
        content: { side: 'right', sideOffset: 12 },
        arrow: true,
      }" popover :ui="{
        root: 'gap-2.5',
        label: 'text-default uppercase tracking-widest py-2.5',
        link: 'p-2.5',
        list: 'space-y-0.5'
      }" />

      <template #footer>
        <UserMenu :collapsed="isCollapsed" />
      </template>
    </USidebar>

    <div
      class="flex-1 flex flex-col overflow-hidden lg:peer-data-[variant=floating]:my-4 peer-data-[variant=inset]:m-4 lg:peer-data-[variant=inset]:not-peer-data-[collapsible=offcanvas]:ms-0 peer-data-[variant=inset]:rounded-xl peer-data-[variant=inset]:shadow-sm peer-data-[variant=inset]:ring peer-data-[variant=inset]:ring-default bg-default">
      <div class="h-(--ui-header-height) shrink-0 flex items-center px-4" :class="[
        variant !== 'floating' && 'border-b border-default',
        side === 'right' && 'justify-end'
      ]">
        <UButton :icon="side === 'left' ? 'i-lucide-panel-left' : 'i-lucide-panel-right'" color="neutral"
          variant="ghost" aria-label="Toggle sidebar" @click="open = !open" />
        <h1 class="font-bold ml-2">{{ pageTitle }}</h1>
        <div class="ml-auto flex items-center gap-2">
          <!-- Dynamic teleport target for pages that need reactive header actions -->
          <div id="header-actions" class="flex items-center gap-2"></div>
        </div>
      </div>

      <div :class="[
        'flex-1',
        route.meta.isTable ? 'flex flex-col overflow-hidden min-h-0' : 'p-4 overflow-y-auto scrollbar'
      ]">
        <slot />
      </div>
    </div>
  </div>
</template>
