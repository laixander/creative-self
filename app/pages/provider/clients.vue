<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'

const UIcon = resolveComponent('UIcon')
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const toast = useToast()

// ============================================================================
// Types
// ============================================================================
interface Client {
    id: number
    company: string
    industry: string
    contactName: string
    contactEmail: string
    employees: number
    location: string
    status: 'active' | 'inactive' | 'prospect'
    totalBookings: number
    completedBookings: number
    cancelledBookings: number
    totalParticipants: number
    totalSpend: number
    lastBookingDate: string
    memberSince: string
}

// ============================================================================
// Data
// ============================================================================
import { useProviderStore } from '~/stores/providerStore'
const providerStore = useProviderStore()
const clients = computed(() => providerStore.clients)

const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

const statusColors: Record<Client['status'], any> = {
    active: 'success',
    inactive: 'neutral',
    prospect: 'warning'
}

const industryIcons: Record<string, string> = {
    Technology: 'i-lucide-cpu',
    Finance: 'i-lucide-trending-up',
    Marketing: 'i-lucide-megaphone',
    Consulting: 'i-lucide-briefcase',
    Energy: 'i-lucide-zap',
    Media: 'i-lucide-film',
    Engineering: 'i-lucide-settings-2',
    Retail: 'i-lucide-shopping-bag'
}

// ============================================================================
// Actions
// ============================================================================
function handleViewClient(client: Client) {
    toast.add({ title: `Viewing ${client.company}`, description: `Contact: ${client.contactName}`, color: 'primary' })
}

function handleSendEmail(client: Client) {
    toast.add({ title: 'Opening email', description: client.contactEmail, color: 'info' })
}

function handleMarkInactive(client: Client) {
    client.status = 'inactive'
    toast.add({ title: 'Client marked as inactive', description: client.company, color: 'neutral' })
}

function handleMarkActive(client: Client) {
    client.status = 'active'
    toast.add({ title: 'Client marked as active', description: client.company, color: 'success' })
}

const getDropdownItems = (client: Client): DropdownMenuItem[] => [
    { label: 'View details', icon: 'i-lucide-eye', onSelect: () => handleViewClient(client) },
    { label: 'Send email', icon: 'i-lucide-mail', onSelect: () => handleSendEmail(client) },
    ...(client.status !== 'active' ? [{
        label: 'Mark as active',
        icon: 'i-lucide-circle-check',
        color: 'success' as const,
        onSelect: () => handleMarkActive(client)
    }] : []),
    ...(client.status === 'active' ? [{
        label: 'Mark as inactive',
        icon: 'i-lucide-circle-minus',
        color: 'neutral' as const,
        onSelect: () => handleMarkInactive(client)
    }] : [])
]

// ============================================================================
// Table columns
// ============================================================================
const columns: TableColumn<Client>[] = [
    {
        accessorKey: 'company',
        header: 'Company',
        cell: ({ row }) => h('div', { class: 'flex items-center gap-3' }, [
            h('div', {
                class: 'size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0'
            }, h(UIcon, {
                name: `${industryIcons[row.original.industry] ?? 'i-lucide-building-2'} text-primary text-base`
            })),
            h('div', { class: 'min-w-0' }, [
                h('div', { class: 'font-semibold text-highlighted truncate' }, row.original.company),
                h('div', { class: 'text-xs text-muted truncate' }, row.original.industry)
            ])
        ])
    },
    {
        accessorKey: 'contactName',
        header: 'Contact',
        cell: ({ row }) => h('div', { class: 'min-w-0' }, [
            h('div', { class: 'text-sm text-highlighted truncate' }, row.original.contactName),
            h('div', { class: 'text-xs text-muted truncate' }, row.original.contactEmail)
        ])
    },
    {
        accessorKey: 'location',
        header: 'Location',
        cell: ({ row }) => h('div', { class: 'text-sm text-muted' }, row.original.location)
    },
    {
        accessorKey: 'totalBookings',
        header: 'Bookings',
        cell: ({ row }) => h('div', { class: 'flex flex-col gap-0.5' }, [
            h('div', { class: 'flex items-center gap-2 text-sm' }, [
                h('span', { class: 'font-semibold text-highlighted' }, row.original.totalBookings),
                h('span', { class: 'text-xs text-muted' }, 'total')
            ]),
            h('div', { class: 'flex items-center gap-1.5 text-xs text-muted' }, [
                h('span', { class: 'text-success' }, `${row.original.completedBookings} done`),
                row.original.cancelledBookings > 0 ? h('span', { class: 'text-error' }, `· ${row.original.cancelledBookings} cancelled`) : null
            ])
        ])
    },
    {
        accessorKey: 'totalParticipants',
        header: 'Participants',
        cell: ({ row }) => h('div', { class: 'font-mono text-sm' }, row.original.totalParticipants.toLocaleString())
    },
    {
        accessorKey: 'totalSpend',
        header: 'Total Spend',
        cell: ({ row }) => h('div', { class: 'font-semibold text-highlighted font-mono text-sm' }, formatter.format(row.original.totalSpend))
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => h(UBadge, {
            label: row.original.status,
            color: statusColors[row.original.status],
            variant: 'subtle',
            size: 'sm',
            class: 'capitalize'
        })
    },
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => h('div', { class: 'text-right' }, [
            h(UDropdownMenu, { items: getDropdownItems(row.original), content: { align: 'end' }, size: 'sm' }, {
                default: () => h(UButton, {
                    icon: 'i-lucide-ellipsis-vertical',
                    color: 'neutral',
                    variant: 'ghost',
                    size: 'sm'
                })
            })
        ])
    }
]

// ============================================================================
// View / Filter / Search
// ============================================================================
const viewMode = ref<'table' | 'cards'>('cards')
const table = useTemplateRef('table')
const globalFilter = ref('')

const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Prospect', value: 'prospect' }
]

const industryOptions = computed(() =>
    [...new Set(clients.value.map(c => c.industry))].map(i => ({ label: i, value: i }))
)

const filter = ref({
    status: statusOptions.map(s => s.value),
    industry: [] as string[]
})

watch(industryOptions, (opts) => {
    if (filter.value.industry.length === 0) {
        filter.value.industry = opts.map(i => i.value)
    }
}, { immediate: true })

function clearFilters() {
    filter.value.status = statusOptions.map(s => s.value)
    filter.value.industry = industryOptions.value.map(i => i.value)
}

const filteredClients = computed(() => {
    let result = clients.value
    result = result.filter(c =>
        filter.value.status.includes(c.status) &&
        filter.value.industry.includes(c.industry)
    )
    if (globalFilter.value) {
        const q = globalFilter.value.toLowerCase()
        result = result.filter(c =>
            c.company.toLowerCase().includes(q) ||
            c.contactName.toLowerCase().includes(q) ||
            c.contactEmail.toLowerCase().includes(q) ||
            c.industry.toLowerCase().includes(q) ||
            c.location.toLowerCase().includes(q)
        )
    }
    return result
})

const page = ref(1)
const pageSize = 12
const pagedClients = computed(() => {
    const start = (page.value - 1) * pageSize
    return filteredClients.value.slice(start, start + pageSize)
})
watch(filteredClients, () => { page.value = 1 })

const activeFilterCount = computed(() => {
    let count = 0
    if (filter.value.status.length < statusOptions.length) count++
    if (filter.value.industry.length < industryOptions.value.length) count++
    return count
})

// ============================================================================
// Slideover / Detail
// ============================================================================
const isSlideoverOpen = ref(false)
const selectedClient = ref<Client | null>(null)

function openSlideover(client: Client) {
    selectedClient.value = client
    isSlideoverOpen.value = true
}

// ============================================================================
// Page meta
// ============================================================================
definePageMeta({
    isTable: true
})
</script>

<template>
    <Teleport to="#header-actions">
        <AppGlobalFilter v-model="globalFilter" />
        <AppTableColumnToggle :table="table" v-if="viewMode === 'table'" />
        <UPopover>
            <UChip :show="activeFilterCount > 0">
                <UButton label="Filters" icon="i-lucide-sliders-horizontal" color="neutral" variant="subtle" />
            </UChip>
            <template #content>
                <div class="flex flex-col gap-2 p-3 w-60">
                    <UFormField label="Filter by Status:" size="sm">
                        <USelectMenu v-model="filter.status" :items="statusOptions" multiple placeholder="Status"
                            :search-input="false" class="w-full" value-key="value" />
                    </UFormField>
                    <UFormField label="Filter by Industry:" size="sm">
                        <USelectMenu v-model="filter.industry" :items="industryOptions" multiple placeholder="Industry"
                            :search-input="false" class="w-full" value-key="value" />
                    </UFormField>
                    <UButton block icon="i-lucide-refresh-ccw" color="neutral" variant="subtle" size="sm" label="Reset"
                        @click="clearFilters" />
                </div>
            </template>
        </UPopover>
        <AppViewToggle v-model="viewMode" />
    </Teleport>


    <template v-if="viewMode === 'table'">
        <!-- Table View -->
        <UTable sticky :data="pagedClients" :columns="columns" ref="table" class="flex-1">
            <template #empty>
                <UEmpty variant="naked" icon="i-lucide-building-2" title="No clients found"
                    description="When you start serving companies, they will appear here." />
            </template>
        </UTable>

        <div v-if="filteredClients.length > pageSize" class="flex justify-center py-4 border-t border-default">
            <UPagination v-model:page="page" :total="filteredClients.length" :items-per-page="pageSize"
                variant="subtle" />
        </div>
    </template>

    <!-- Cards View -->
    <template v-else-if="viewMode === 'cards'">
        <div class="flex-1 flex flex-col overflow-y-auto scrollbar"
            :class="[clients.length === 0 ? 'justify-center' : '']">
            <template v-if="clients.length === 0">
                <UEmpty variant="naked" icon="i-lucide-building-2" title="No clients found"
                    description="When you start serving companies, they will appear here." />
            </template>
            <template v-else>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6">
                    <UCard v-for="client in pagedClients" :key="client.id" variant="subtle"
                        :ui="{ root: 'flex flex-col', body: 'flex-1 flex flex-col gap-4 sm:gap-6' }"
                        class="shadow-sm cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md hover:border-primary-500/50"
                        @click="openSlideover(client)">

                        <!-- Card Header -->
                        <template #header>
                            <div class="flex items-center justify-between gap-3">
                                <div class="flex items-center gap-3 min-w-0">
                                    <div
                                        class="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <UIcon :name="industryIcons[client.industry] ?? 'i-lucide-building-2'"
                                            class="text-primary text-base" />
                                    </div>
                                    <div class="min-w-0">
                                        <div class="font-semibold text-highlighted truncate">{{ client.company }}</div>
                                        <div class="text-xs text-muted">{{ client.industry }}</div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-1 shrink-0">
                                    <UBadge :color="statusColors[client.status]" variant="subtle" size="sm"
                                        class="capitalize">
                                        {{ client.status }}
                                    </UBadge>
                                </div>
                            </div>
                        </template>

                        <!-- Contact info -->
                        <div class="space-y-2">
                            <div class="flex items-center gap-2 text-sm">
                                <UIcon name="i-lucide-user" class="text-muted shrink-0 size-3.5" />
                                <span class="text-highlighted truncate">{{ client.contactName }}</span>
                            </div>
                            <div class="flex items-center gap-2 text-xs text-muted">
                                <UIcon name="i-lucide-mail" class="shrink-0 size-3.5" />
                                <span class="truncate">{{ client.contactEmail }}</span>
                            </div>
                            <div class="flex items-center gap-2 text-xs text-muted">
                                <UIcon name="i-lucide-map-pin" class="shrink-0 size-3.5" />
                                <span class="truncate">{{ client.location }}</span>
                            </div>
                        </div>

                    </UCard>
                </div>
            </template>
        </div>

        <div v-if="filteredClients.length > pageSize" class="mt-auto flex justify-center py-4 border-t border-default">
            <UPagination v-model:page="page" :total="filteredClients.length" :items-per-page="pageSize"
                variant="subtle" />
        </div>
    </template>

    <!-- Slideover -->
    <USlideover v-model:open="isSlideoverOpen" title="Client Details">
        <template #body>
            <div v-if="selectedClient" class="space-y-6">
                <div class="flex items-center gap-4 border-b border-default pb-4">
                    <div class="size-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <UIcon :name="industryIcons[selectedClient.industry] ?? 'i-lucide-building-2'"
                            class="text-primary text-3xl" />
                    </div>
                    <div>
                        <h2 class="text-xl font-bold text-highlighted">{{ selectedClient.company }}</h2>
                        <div class="flex items-center gap-2 mt-1">
                            <UBadge :color="statusColors[selectedClient.status]" variant="subtle" size="sm"
                                class="capitalize">
                                {{ selectedClient.status }}
                            </UBadge>
                            <span class="text-sm text-muted">{{ selectedClient.industry }}</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div class="p-3 bg-elevated rounded-lg border border-default">
                        <div class="text-xs text-muted uppercase tracking-wider mb-1">Contact Name</div>
                        <div class="font-semibold text-highlighted flex items-center gap-2">
                            <UIcon name="i-lucide-user" class="text-muted size-4" />
                            {{ selectedClient.contactName }}
                        </div>
                    </div>
                    <div class="p-3 bg-elevated rounded-lg border border-default">
                        <div class="text-xs text-muted uppercase tracking-wider mb-1">Contact Email</div>
                        <div class="font-semibold text-highlighted flex items-center gap-2">
                            <UIcon name="i-lucide-mail" class="text-muted size-4" />
                            <a :href="`mailto:${selectedClient.contactEmail}`"
                                class="text-primary hover:underline truncate">{{ selectedClient.contactEmail }}</a>
                        </div>
                    </div>
                    <div class="p-3 bg-elevated rounded-lg border border-default col-span-2">
                        <div class="text-xs text-muted uppercase tracking-wider mb-1">Location</div>
                        <div class="font-semibold text-highlighted flex items-center gap-2">
                            <UIcon name="i-lucide-map-pin" class="text-muted size-4" />
                            {{ selectedClient.location }}
                        </div>
                    </div>
                </div>

                <div class="space-y-3 pt-2">
                    <h3 class="text-sm font-semibold text-highlighted uppercase tracking-wider">Booking Statistics</h3>
                    <div class="grid grid-cols-3 gap-3">
                        <div
                            class="flex flex-col items-center justify-center p-3 rounded-lg bg-elevated border border-default">
                            <span class="text-lg font-bold text-highlighted">{{ selectedClient.totalBookings }}</span>
                            <span class="text-xs text-muted uppercase tracking-wider">Bookings</span>
                        </div>
                        <div
                            class="flex flex-col items-center justify-center p-3 rounded-lg bg-elevated border border-default">
                            <span class="text-lg font-bold text-highlighted">{{ selectedClient.totalParticipants
                            }}</span>
                            <span class="text-xs text-muted uppercase tracking-wider">Attendees</span>
                        </div>
                        <div
                            class="flex flex-col items-center justify-center p-3 rounded-lg bg-elevated border border-default">
                            <span class="text-lg font-bold text-success">{{ formatter.format(selectedClient.totalSpend)
                            }}</span>
                            <span class="text-xs text-muted uppercase tracking-wider">Spend</span>
                        </div>
                    </div>
                </div>

                <div class="space-y-3 pt-2">
                    <h3 class="text-sm font-semibold text-highlighted uppercase tracking-wider">Activity</h3>
                    <div
                        class="text-sm text-muted divide-y divide-default *:flex *:justify-between *:items-center *:py-2 *:first:pt-0 *:last:pb-0">
                        <div>
                            <span class="flex items-center gap-2">
                                <UIcon name="i-lucide-check-circle" class="text-success size-4" /> Completed Bookings
                            </span>
                            <span class="font-medium text-highlighted">{{ selectedClient.completedBookings }}</span>
                        </div>
                        <div>
                            <span class="flex items-center gap-2">
                                <UIcon name="i-lucide-x-circle" class="text-error size-4" /> Cancelled Bookings
                            </span>
                            <span class="font-medium text-highlighted">{{ selectedClient.cancelledBookings }}</span>
                        </div>
                        <div>
                            <span class="flex items-center gap-2">
                                <UIcon name="i-lucide-calendar" class="size-4" /> Last Booking Date
                            </span>
                            <span class="font-medium text-highlighted">{{ selectedClient.lastBookingDate }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2 w-full">
                <UButton color="neutral" variant="outline" label="Close" @click="isSlideoverOpen = false" />
            </div>
        </template>
    </USlideover>
</template>