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
const clients = ref<Client[]>([
    {
        id: 1,
        company: 'Northwind Labs',
        industry: 'Technology',
        contactName: 'Sarah Chen',
        contactEmail: 'schen@northwindlabs.com',
        employees: 320,
        location: 'San Francisco, CA',
        status: 'active',
        totalBookings: 8,
        completedBookings: 6,
        cancelledBookings: 0,
        totalParticipants: 340,
        totalSpend: 18200,
        lastBookingDate: '2026-07-13',
        memberSince: '2025-02-10'
    },
    {
        id: 2,
        company: 'Helio Finance',
        industry: 'Finance',
        contactName: 'Marcus Reid',
        contactEmail: 'mreid@heliofinance.com',
        employees: 150,
        location: 'New York, NY',
        status: 'active',
        totalBookings: 5,
        completedBookings: 4,
        cancelledBookings: 1,
        totalParticipants: 210,
        totalSpend: 11400,
        lastBookingDate: '2026-07-22',
        memberSince: '2025-04-18'
    },
    {
        id: 3,
        company: 'Apex Digital',
        industry: 'Marketing',
        contactName: 'Jenna Park',
        contactEmail: 'jpark@apexdigital.io',
        employees: 80,
        location: 'Austin, TX',
        status: 'active',
        totalBookings: 3,
        completedBookings: 2,
        cancelledBookings: 0,
        totalParticipants: 95,
        totalSpend: 4800,
        lastBookingDate: '2026-07-28',
        memberSince: '2025-06-01'
    },
    {
        id: 4,
        company: 'Blueridge Partners',
        industry: 'Consulting',
        contactName: 'Daniel Osei',
        contactEmail: 'dosei@blueridge.com',
        employees: 500,
        location: 'Chicago, IL',
        status: 'active',
        totalBookings: 12,
        completedBookings: 10,
        cancelledBookings: 1,
        totalParticipants: 820,
        totalSpend: 52000,
        lastBookingDate: '2026-08-05',
        memberSince: '2024-11-15'
    },
    {
        id: 5,
        company: 'Solaris Group',
        industry: 'Energy',
        contactName: 'Priya Menon',
        contactEmail: 'pmenon@solarisgroup.com',
        employees: 220,
        location: 'Houston, TX',
        status: 'inactive',
        totalBookings: 4,
        completedBookings: 4,
        cancelledBookings: 0,
        totalParticipants: 180,
        totalSpend: 7600,
        lastBookingDate: '2026-06-18',
        memberSince: '2025-01-20'
    },
    {
        id: 6,
        company: 'Crestline Media',
        industry: 'Media',
        contactName: 'Tom Hargreaves',
        contactEmail: 'tom@crestlinemedia.com',
        employees: 60,
        location: 'Los Angeles, CA',
        status: 'inactive',
        totalBookings: 2,
        completedBookings: 2,
        cancelledBookings: 0,
        totalParticipants: 48,
        totalSpend: 2400,
        lastBookingDate: '2026-06-25',
        memberSince: '2025-05-12'
    },
    {
        id: 7,
        company: 'Veritas Capital',
        industry: 'Finance',
        contactName: 'Olivia Brooks',
        contactEmail: 'obrooks@veritascap.com',
        employees: 90,
        location: 'Boston, MA',
        status: 'active',
        totalBookings: 6,
        completedBookings: 4,
        cancelledBookings: 0,
        totalParticipants: 310,
        totalSpend: 19800,
        lastBookingDate: '2026-07-30',
        memberSince: '2025-03-05'
    },
    {
        id: 8,
        company: 'Ironclad Systems',
        industry: 'Engineering',
        contactName: 'Ben Nakamura',
        contactEmail: 'bnakamura@ironclad.io',
        employees: 175,
        location: 'Seattle, WA',
        status: 'inactive',
        totalBookings: 3,
        completedBookings: 3,
        cancelledBookings: 0,
        totalParticipants: 145,
        totalSpend: 6900,
        lastBookingDate: '2026-06-10',
        memberSince: '2025-02-28'
    },
    {
        id: 9,
        company: 'Luminary Co.',
        industry: 'Retail',
        contactName: 'Aisha Williams',
        contactEmail: 'awilliams@luminaryco.com',
        employees: 45,
        location: 'Portland, OR',
        status: 'prospect',
        totalBookings: 1,
        completedBookings: 0,
        cancelledBookings: 1,
        totalParticipants: 12,
        totalSpend: 0,
        lastBookingDate: '2026-07-03',
        memberSince: '2026-06-15'
    },
    {
        id: 10,
        company: 'Zenith Consulting',
        industry: 'Consulting',
        contactName: 'Ryan Walsh',
        contactEmail: 'rwalsh@zenithco.com',
        employees: 400,
        location: 'Denver, CO',
        status: 'active',
        totalBookings: 9,
        completedBookings: 6,
        cancelledBookings: 0,
        totalParticipants: 540,
        totalSpend: 37200,
        lastBookingDate: '2026-08-12',
        memberSince: '2024-12-01'
    }
])

const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

const statusColors: Record<Client['status'], string> = {
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

const industryOptions = [...new Set(clients.value.map(c => c.industry))].map(i => ({ label: i, value: i }))

const filter = ref({
    status: statusOptions.map(s => s.value),
    industry: industryOptions.map(i => i.value)
})

function clearFilters() {
    filter.value.status = statusOptions.map(s => s.value)
    filter.value.industry = industryOptions.map(i => i.value)
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
    if (filter.value.industry.length < industryOptions.length) count++
    return count
})

// ============================================================================
// Page meta
// ============================================================================
definePageMeta({
    title: 'Clients',
    isTable: true
})
</script>

<template>
    <Teleport to="#header-actions">
        <AppGlobalFilter v-model="globalFilter" />
        <AppTableColumnToggle :table="table" v-if="viewMode === 'table'" />
        <UPopover>
            <UChip :show="activeFilterCount > 0">
                <UButton icon="i-lucide-sliders-horizontal" color="neutral" variant="subtle" />
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

    <!-- Table View -->
    <UTable v-if="viewMode === 'table'" sticky :data="pagedClients" :columns="columns" ref="table" class="flex-1">
        <template #empty-state-content>
            <div class="flex flex-col items-center justify-center py-10 text-center">
                <div
                    class="flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary ring-4 ring-primary/20 mb-3">
                    <UIcon name="i-lucide-building-2" class="size-8" />
                </div>
                <h3 class="text-lg font-semibold text-default">No clients found</h3>
                <p class="text-sm text-muted mt-1">Try adjusting your search or filters.</p>
            </div>
        </template>
    </UTable>

    <div v-if="viewMode === 'table' && filteredClients.length > pageSize"
        class="flex justify-center py-4 border-t border-default">
        <UPagination v-model:page="page" :total="filteredClients.length" :items-per-page="pageSize" variant="subtle" />
    </div>

    <!-- Cards View -->
    <template v-else-if="viewMode === 'cards'">
        <div class="flex-1 flex flex-col overflow-y-auto scrollbar">
            <div v-if="pagedClients.length === 0" class="flex flex-col items-center justify-center flex-1 py-20">
                <div
                    class="flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary ring-4 ring-primary/20 mb-3">
                    <UIcon name="i-lucide-building-2" class="size-8" />
                </div>
                <h3 class="text-lg font-semibold text-default">No clients found</h3>
                <p class="text-sm text-muted mt-1">Try adjusting your search or filters.</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6">
                <UCard v-for="client in pagedClients" :key="client.id" variant="subtle"
                    :ui="{ root: 'flex flex-col', body: 'flex-1 flex flex-col gap-4 sm:gap-6' }" class="shadow-sm">

                    <!-- Card Header -->
                    <template #header>
                        <div class="flex items-center justify-between gap-3">
                            <div class="flex items-center gap-3 min-w-0">
                                <div class="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
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
                                <AppDropdownMenu :items="getDropdownItems(client)" size="sm"
                                    trigger-icon="i-lucide-more-vertical" trigger-variant="ghost"
                                    trigger-color="neutral" trigger-size="sm"
                                    :content="{ align: 'end', side: 'bottom', sideOffset: 4 }" />
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

                    <!-- Booking stats -->
                    <div class="grid grid-cols-3 gap-2">
                        <div class="flex flex-col items-center gap-0.5 rounded-lg bg-elevated px-2 py-2">
                            <span class="text-base font-bold text-highlighted">{{ client.totalBookings }}</span>
                            <span class="text-[10px] text-muted uppercase tracking-wider font-medium">Bookings</span>
                        </div>
                        <div class="flex flex-col items-center gap-0.5 rounded-lg bg-elevated px-2 py-2">
                            <span class="text-base font-bold text-highlighted">{{ client.totalParticipants }}</span>
                            <span class="text-[10px] text-muted uppercase tracking-wider font-medium">Attendees</span>
                        </div>
                        <div class="flex flex-col items-center gap-0.5 rounded-lg bg-elevated px-2 py-2">
                            <span class="text-base font-bold text-success">{{ formatter.format(client.totalSpend)
                            }}</span>
                            <span class="text-[10px] text-muted uppercase tracking-wider font-medium">Spend</span>
                        </div>
                    </div>

                    <!-- Footer -->
                    <template #footer>
                        <div class="flex items-center justify-between text-xs text-muted">
                            <div class="flex items-center gap-1.5">
                                <UIcon name="i-lucide-check-circle" class="text-success size-3.5" />
                                <span>{{ client.completedBookings }} completed</span>
                                <template v-if="client.cancelledBookings > 0">
                                    <span class="text-default/30">·</span>
                                    <UIcon name="i-lucide-x-circle" class="text-error size-3.5" />
                                    <span class="text-error">{{ client.cancelledBookings }} cancelled</span>
                                </template>
                            </div>
                            <div class="flex items-center gap-1">
                                <UIcon name="i-lucide-calendar" class="size-3.5" />
                                <span>{{ client.lastBookingDate }}</span>
                            </div>
                        </div>
                    </template>
                </UCard>
            </div>
        </div>

        <div v-if="filteredClients.length > pageSize" class="mt-auto flex justify-center py-4 border-t border-default">
            <UPagination v-model:page="page" :total="filteredClients.length" :items-per-page="pageSize"
                variant="subtle" />
        </div>
    </template>
</template>