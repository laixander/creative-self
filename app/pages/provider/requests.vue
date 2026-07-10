<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const toast = useToast()

// ============================================================================
// Types
// ============================================================================
interface BookingRow {
    id: number
    company: string
    offering: string
    date: string
    participants: number
    status: 'confirmed' | 'completed' | 'cancelled'
}

// ============================================================================
// Table data
// ============================================================================
import { useProviderStore } from '~/stores/providerStore'
const providerStore = useProviderStore()

const bookings = computed({
    get: () => providerStore.bookings as BookingRow[],
    set: (val) => { providerStore.bookings = val as any }
})

const statusColors: Record<BookingRow['status'], string> = {
    confirmed: 'info',
    completed: 'success',
    cancelled: 'error'
}

// ============================================================================
// Actions
// ============================================================================
function handleMarkCompleted(booking: BookingRow) {
    booking.status = 'completed'
    toast.add({ title: 'Booking marked as completed', description: `"${booking.offering}" for ${booking.company}.`, color: 'success' })
}

function handleCancelBooking(booking: BookingRow) {
    booking.status = 'cancelled'
    toast.add({ title: 'Booking cancelled', description: `"${booking.offering}" for ${booking.company}.`, color: 'error' })
}

function handleViewDetails(booking: BookingRow) {
    console.log('Viewing details for:', booking)
}

const getBookingDropdownItems = (booking: BookingRow): DropdownMenuItem[] => [
    { label: 'View details', icon: 'i-lucide-eye', onSelect: () => handleViewDetails(booking) },
    ...(booking.status === 'confirmed' ? [{
        label: 'Mark completed',
        icon: 'i-lucide-check-circle',
        color: 'success' as const,
        onSelect: () => handleMarkCompleted(booking)
    }] : []),
    ...(booking.status !== 'cancelled' ? [{
        label: 'Cancel booking',
        icon: 'i-lucide-x-circle',
        color: 'error' as const,
        onSelect: () => handleCancelBooking(booking)
    }] : [])
]

// ============================================================================
// Columns
// ============================================================================
const bookingColumns: TableColumn<BookingRow>[] = [
    {
        accessorKey: 'company',
        header: 'Company',
        cell: ({ row }) => h('div', { class: 'font-medium text-highlighted' }, row.original.company)
    },
    {
        accessorKey: 'offering',
        header: 'Offering'
    },
    {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => h('div', { class: 'font-mono text-sm' }, row.original.date)
    },
    {
        accessorKey: 'participants',
        header: 'Participants',
        cell: ({ row }) => h('div', { class: 'text-center' }, row.original.participants)
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
            h(UDropdownMenu, { items: getBookingDropdownItems(row.original), content: { align: 'end' }, size: 'sm' }, {
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
// Page meta
// ============================================================================
definePageMeta({
    isTable: true
})

// Other Logic
const viewMode = ref<'table' | 'cards'>('cards')

const table = useTemplateRef('table')

const columnVisibility = ref({
    id: false
})

const statusOptions = [
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' }
]

const filter = ref({
    status: statusOptions.map(c => c.value)
})

function clearFilters() {
    filter.value.status = statusOptions.map(c => c.value)
}

const activeFilterCount = computed(() => {
    let count = 0
    if (filter.value.status.length < statusOptions.length) count++
    return count
})

const globalFilter = ref('')

const filteredData = computed(() => {
    let result = bookings.value

    // Apply status filter
    result = result.filter(booking =>
        filter.value.status.includes(booking.status)
    )

    if (globalFilter.value) {
        const q = globalFilter.value.toLowerCase()
        result = result.filter(booking =>
            booking.company.toLowerCase().includes(q) ||
            booking.offering.toLowerCase().includes(q)
        )
    }
    return result
})

const page = ref(1)
const pageSize = 12

const pagedData = computed(() => {
    const start = (page.value - 1) * pageSize
    return filteredData.value.slice(start, start + pageSize)
})

watch([filteredData], () => { page.value = 1 })
</script>

<template>
    <Teleport to="#header-actions">
        <AppGlobalFilter v-model="globalFilter" />
        <AppTableColumnToggle :table="table" v-if="viewMode == 'table'" />
        <UPopover>
            <UChip :show="activeFilterCount > 0">
                <UButton icon="i-lucide-sliders-horizontal" color="neutral" variant="subtle" />
            </UChip>
            <template #content>
                <div class="flex flex-col gap-2 p-3 w-64">
                    <UFormField label="Filter by Status:" size="sm">
                        <USelectMenu v-model="filter.status" :items="statusOptions" multiple placeholder="Status"
                            :search-input="false" class="w-full" value-key="value" />
                    </UFormField>
                    <UButton block icon="i-lucide-refresh-ccw" color="neutral" variant="subtle" size="sm" label="Reset"
                        @click="clearFilters" />
                </div>
            </template>
        </UPopover>
        <AppViewToggle v-model="viewMode" />
    </Teleport>

    <UTable v-if="viewMode === 'table'" sticky :data="pagedData" :columns="bookingColumns" ref="table"
        v-model:column-visibility="columnVisibility" class="flex-1">
        <template #empty>
            <UEmpty variant="naked" icon="i-lucide-clipboard-list" title="No requests found" description="When a company submits a request, it will appear here." />
        </template>
    </UTable>

        <div v-if="viewMode === 'table' && filteredData.length > pageSize"
            class="flex justify-center py-4 border-t border-default">
            <UPagination v-model:page="page" :total="filteredData.length" :items-per-page="pageSize" variant="subtle" />
        </div>

    <template v-else-if="viewMode === 'cards'">
        <div class="flex-1 flex flex-col overflow-y-auto scrollbar" :class="[bookings.length === 0 ? 'justify-center' : '']">
            <template v-if="bookings.length === 0">
                <UEmpty variant="naked" icon="i-lucide-clipboard-list" title="No requests found" description="When a company submits a request, it will appear here." />
            </template>
            <template v-else>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6">
                    <UCard v-for="booking in pagedData" :key="booking.id" variant="subtle"
                :ui="{ root: 'flex flex-col justify-start', body: 'flex-1' }" class="shadow-sm">
                <div>
                    <div class="flex items-center gap-2">
                        <UBadge variant="subtle" :color="statusColors[booking.status]" size="sm" class="capitalize">
                            {{ booking.status }}
                        </UBadge>
                        <div class="font-semibold text-highlighted text-sm w-full truncate">
                            {{ booking.company }}
                        </div>
                        <AppDropdownMenu :items="getBookingDropdownItems(booking)" size="sm"
                            trigger-icon="i-lucide-more-vertical" trigger-variant="ghost" trigger-color="neutral"
                            trigger-size="sm" :content="{ align: 'end', side: 'bottom', sideOffset: 4 }" />
                    </div>
                    <div class="mt-2 text-muted text-xs truncate">
                        {{ booking.offering }}
                    </div>
                </div>
                <template #footer>
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-1 text-muted text-xs">
                            <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5 shrink-0" />
                            {{ booking.date }}
                        </div>
                        <div class="flex items-center gap-1 text-muted text-xs">
                            <UIcon name="i-lucide-user" class="w-3.5 h-3.5 shrink-0" />
                            {{ booking.participants }}
                        </div>
                    </div>
                </template>
            </UCard>
                </div>
            </template>
        </div>
        <div v-if="filteredData.length > pageSize" class="mt-auto flex justify-center py-4 border-t border-default">
            <UPagination v-model:page="page" :total="filteredData.length" :items-per-page="pageSize" variant="subtle" />
        </div>
    </template>
</template>