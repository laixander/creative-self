<script setup lang="ts">
import type { NavigationMenuItem, SidebarProps } from '@nuxt/ui'

defineProps<Pick<SidebarProps, 'variant' | 'collapsible' | 'side'>>()
const variant = ref<SidebarProps['variant']>('inset')
const collapsible = ref<SidebarProps['collapsible']>('icon')
const settings = useSettingsStore()
const open = computed({
    get: () => !settings.sidebarCollapsed,
    set: (val: boolean) => settings.setSidebarCollapsed(!val),
})

const route = useRoute()
const notificationStore = useNotificationStore()

const allNavItems = computed<NavigationMenuItem[]>(() => [
    { type: 'label', label: 'Demo' },
    { label: 'Dashboard', icon: 'i-lucide-chart-pie', to: '/demo' },
    { label: 'CRUD', icon: 'i-lucide-folder-open', to: '/demo/crud' },
    { label: 'Roles', icon: 'i-lucide-shield', to: '/demo/roles' },
    { label: 'Activity Logs', icon: 'i-lucide-activity', to: '/demo/activity-logs' },
    {
        label: 'Notifications',
        icon: 'i-lucide-bell',
        to: '/demo/notifications',
        badge: {
            label: notificationStore.unreadCount > 0 ? String(notificationStore.unreadCount) : undefined,
            variant: notificationStore.unreadCount > 0 ? 'solid' : 'soft',
            color: notificationStore.unreadCount > 0 ? 'primary' : 'neutral',
            class: 'rounded-full'
        }
    },
    { label: 'Kanban', icon: 'i-lucide-kanban', to: '/demo/kanban' },
    { label: 'Wizard', icon: 'i-lucide-wand-sparkles', to: '/demo/wizard' },
    {
        label: 'UI Kits',
        icon: 'i-lucide-square-mouse-pointer',
        children: [
            { label: 'Cards', to: '/demo/cards' }
        ]
    },
    { type: 'label', label: 'Admin' },
    { label: 'Dashboard', icon: 'i-lucide-shield', to: '/admin' },
    { type: 'label', label: 'HR' },
    { label: 'Dashboard', icon: 'i-lucide-users', to: '/hr' },
    { type: 'label', label: 'Provider' },
    { label: 'Dashboard', icon: 'i-lucide-chart-pie', to: '/provider' },
    { label: 'Offerings', icon: 'i-lucide-hand-heart', to: '/provider/offerings' },
    { label: 'Booking Requests', icon: 'i-lucide-messages-square', to: '/provider/bookings' },
    { label: 'Schedule Monitoring', icon: 'i-lucide-calendar-days', to: '/provider/schedule' },
    { label: 'Availed Services', icon: 'i-lucide-circle-check-big', to: '/provider/availed' },
    { label: 'Company Clients', icon: 'i-lucide-briefcase', to: '/provider/clients' },
    { label: 'Media Content', icon: 'i-lucide-image', to: '/provider/media' },
    { label: 'Provider Profile', icon: 'i-lucide-user', to: '/provider/profile' }
])

const { role } = useDemoAuth()
const selectedTeam = useState<{ label: string, icon: string }>('selectedTeam', () => ({
    label: 'Provider',
    icon: 'i-lucide-briefcase'
}))

// Automatically set selectedTeam for non-developer roles
watchEffect(() => {
    if (role.value?.name === 'Admin') selectedTeam.value = { label: 'Admin', icon: 'i-lucide-shield' }
    else if (role.value?.name === 'HR') selectedTeam.value = { label: 'HR', icon: 'i-lucide-users' }
    else if (role.value?.name === 'Provider') selectedTeam.value = { label: 'Provider', icon: 'i-lucide-briefcase' }
    // Developer can freely switch via TeamsMenu, defaults to whatever it was.
})

const isAuthorized = computed(() => {
    // If it's a public route or docs, always authorized
    if (route.path.startsWith('/docs')) return true

    const pages = role.value?.pages || []
    return pages.some(p => route.path === p || route.path.startsWith(p + '/'))
})

const items = computed<NavigationMenuItem[][]>(() => {
    const pages = role.value?.pages || []

    const filterGroup = (group: NavigationMenuItem[]) => {
        return group.reduce<NavigationMenuItem[]>((acc, item) => {
            if (item.children && item.children.length > 0) {
                const allowedChildren = item.children.filter(
                    (child) => child.to && pages.includes(child.to as string)
                )
                if (allowedChildren.length > 0) {
                    const hasActiveChild = allowedChildren.some(
                        (child) => child.to && (route.path === child.to || route.path.startsWith(child.to as string + '/'))
                    )
                    acc.push({ ...item, children: allowedChildren, defaultOpen: hasActiveChild })
                }
                return acc
            }

            if (item.to && pages.includes(item.to as string)) {
                acc.push(item)
            }

            return acc
        }, [])
    }

    // Split allNavItems into groups by their `type: 'label'` markers
    const groups: NavigationMenuItem[][] = []
    let currentGroup: NavigationMenuItem[] = []

    allNavItems.value.forEach((item) => {
        if (item.type === 'label') {
            if (currentGroup.length > 0) {
                groups.push(currentGroup)
            }
            currentGroup = []
                // Attach the label string to the array object itself so we can filter later
                ; (currentGroup as any).teamLabel = item.label
        } else {
            currentGroup.push(item)
        }
    })
    if (currentGroup.length > 0) groups.push(currentGroup)

    // Filter each group based on the selected team, then map permissions and remove empty ones
    return groups
        .filter((group) => {
            return (group as any).teamLabel === selectedTeam.value.label
        })
        .map(filterGroup)
        .filter((group) => group.length > 0)
})
const isCollapsed = computed(() => collapsible.value === 'icon' && !open.value)
const pageTitle = computed(() => {
    const activeItem = items.value.flat().find((item: any) => item.to === route.path)
    return (activeItem?.label as string) || (route.meta.title as string)
})
</script>

<template>
    <ClientOnly>
        <div class="flex flex-1 h-screen w-full" :class="[
            variant === 'inset' && 'bg-neutral-50 dark:bg-neutral-950',
            side === 'right' && 'flex-row-reverse'
        ]">
            <USidebar v-model:open="open" :variant="variant" :collapsible="collapsible" :side="side"
                :ui="{ root: '[--sidebar-width-icon:4.5625rem]', container: 'h-full', header: 'px-5', body: 'scrollbar' }"
                close>
                <template #header="{ close }">
                    <div class="flex items-center gap-2.5">
                        <UIcon name="i-ph-palette-duotone" class="size-8 shrink-0 text-primary" />
                        <span v-if="!isCollapsed"
                            class="font-black text-neutral-900 dark:text-white tracking-tight">Creative<span
                                class="text-primary">Self</span></span>
                    </div>
                    <UButton class="lg:hidden ml-auto" icon="i-lucide-x" color="neutral" variant="ghost"
                        aria-label="Close sidebar" @click="close()" />
                </template>

                <TeamsMenu :collapsed="isCollapsed" />

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
                <div class="h-(--ui-header-height) shrink-0 flex items-center px-4 sm:pe-6" :class="[
                    variant !== 'floating' && 'border-b border-default',
                    side === 'right' && 'justify-end'
                ]">
                    <UButton :icon="side === 'left' ? 'i-lucide-panel-left' : 'i-lucide-panel-right'" color="neutral"
                        variant="ghost" aria-label="Toggle sidebar" class="mr-2" @click="open = !open" />
                    <!-- setup title in page, not here -->
                    <h1 class="font-bold">{{ pageTitle }}</h1>
                    <div class="ml-auto flex items-center gap-2">
                        <!-- Dynamic teleport target for pages that need reactive header actions -->
                        <div id="header-actions" class="flex items-center gap-2"></div>
                    </div>
                </div>

                <div :class="[
                    'flex-1',
                    route.meta.isTable ? 'flex flex-col overflow-hidden min-h-0' : 'p-4 overflow-y-auto scrollbar'
                ]">
                    <AuthGate v-if="!isAuthorized" title="Access Denied"
                        description="You do not have permission to view this page." />
                    <slot v-else />
                </div>
            </div>
        </div>
    </ClientOnly>
</template>