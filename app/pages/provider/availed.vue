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
    image?: string
    date: string
    participants: number
    price: number
    rating: number
    status: 'confirmed' | 'completed' | 'cancelled'
}

// ============================================================================
// Data
// ============================================================================
import { useProviderStore } from '~/stores/providerStore'
const providerStore = useProviderStore()
const bookings = computed({
    get: () => providerStore.availedBookings as BookingRow[],
    set: (val) => { providerStore.availedBookings = val as any }
})

const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

const statusColors: Record<BookingRow['status'], string> = {
    confirmed: 'info',
    completed: 'success',
    cancelled: 'error'
}

// ============================================================================
// Summary stats (derived)
// ============================================================================
const completedBookings = computed(() => bookings.value.filter(b => b.status === 'completed'))
const completedCount = computed(() => completedBookings.value.length)
const participantsReached = computed(() => completedBookings.value.reduce((sum, b) => sum + b.participants, 0))
const totalRevenue = computed(() => completedBookings.value.reduce((sum, b) => sum + b.price, 0))

const stats = computed(() => [
    { label: 'Completed', value: completedCount.value, icon: 'i-lucide-check-circle', color: 'green' },
    { label: 'Participants Reached', value: participantsReached.value, icon: 'i-lucide-users', color: 'amber' },
    { label: 'Revenue', value: formatter.format(totalRevenue.value), icon: 'i-lucide-banknote', color: 'teal' }
])

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
    toast.add({ title: booking.offering, description: `${booking.company} · ${booking.date}`, color: 'neutral' })
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
// Table columns
// ============================================================================
const bookingColumns: TableColumn<BookingRow>[] = [
    {
        accessorKey: 'offering',
        header: 'Offering',
        cell: ({ row }) => h('div', { class: 'flex items-center gap-3' }, [
            row.original.image
                ? h('img', { src: row.original.image, alt: row.original.offering, class: 'h-10 w-14 rounded object-cover shrink-0' })
                : h('div', { class: 'h-10 w-14 rounded bg-elevated flex items-center justify-center shrink-0' },
                    h('span', { class: 'i-lucide-image text-muted text-base' })
                ),
            h('div', { class: 'font-medium text-highlighted truncate max-w-56' }, row.original.offering)
        ])
    },
    {
        accessorKey: 'company',
        header: 'Company',
        cell: ({ row }) => h('div', { class: 'text-sm text-muted' }, row.original.company)
    },
    {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => h('div', { class: 'font-mono text-sm' }, row.original.date)
    },
    {
        accessorKey: 'participants',
        header: 'Participants',
        cell: ({ row }) => h('div', { class: 'text-sm' }, row.original.participants)
    },
    {
        accessorKey: 'price',
        header: 'Revenue',
        cell: ({ row }) => h('div', { class: 'font-mono text-sm font-semibold' }, formatter.format(row.original.price))
    },
    {
        accessorKey: 'rating',
        header: 'Rating',
        cell: ({ row }) => row.original.rating > 0
            ? h('div', { class: 'flex items-center gap-1' }, [
                h('span', { class: 'i-lucide-star text-amber-400 fill-amber-400 size-3.5' }),
                h('span', { class: 'text-sm font-semibold' }, row.original.rating.toFixed(1))
              ])
            : h('div', { class: 'text-muted text-xs' }, '—')
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
                default: () => h(UButton, { icon: 'i-lucide-ellipsis-vertical', color: 'neutral', variant: 'ghost', size: 'sm' })
            })
        ])
    }
]

// ============================================================================
// View / filter / search
// ============================================================================
const viewMode = ref<'table' | 'cards'>('cards')
const table = useTemplateRef('table')
const globalFilter = ref('')

const statusOptions = [
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' }
]

const filter = ref({ status: statusOptions.map(s => s.value) })

const filteredBookings = computed(() => {
    let result = bookings.value.filter(b => filter.value.status.includes(b.status))
    if (globalFilter.value) {
        const q = globalFilter.value.toLowerCase()
        result = result.filter(b =>
            b.offering.toLowerCase().includes(q) ||
            b.company.toLowerCase().includes(q)
        )
    }
    return result
})

const page = ref(1)
const pageSize = 12
const pagedBookings = computed(() => {
    const start = (page.value - 1) * pageSize
    return filteredBookings.value.slice(start, start + pageSize)
})
watch(filteredBookings, () => { page.value = 1 })

const activeFilterCount = computed(() =>
    filter.value.status.length < statusOptions.length ? 1 : 0
)

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
                <UButton icon="i-lucide-sliders-horizontal" color="neutral" variant="subtle" />
            </UChip>
            <template #content>
                <div class="flex flex-col gap-2 p-3 w-52">
                    <UFormField label="Filter by Status:" size="sm">
                        <USelectMenu v-model="filter.status" :items="statusOptions" multiple placeholder="Status"
                            :search-input="false" class="w-full" value-key="value" />
                    </UFormField>
                    <UButton block icon="i-lucide-refresh-ccw" color="neutral" variant="subtle" size="sm" label="Reset"
                        @click="filter.status = statusOptions.map(s => s.value)" />
                </div>
            </template>
        </UPopover>
        <AppViewToggle v-model="viewMode" />
    </Teleport>


        <!-- ============================================================
             Summary stat cards (always visible above the list/table)
             ============================================================ -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 sm:p-6 border-b border-default shrink-0">
            <UCard v-for="stat in stats" :key="stat.label" variant="subtle" class="shadow-sm">
                <div class="flex items-center gap-4">
                    <div :class="[
                        'p-3 rounded-xl squircle',
                        `bg-${stat.color}-500/10`,
                        `text-${stat.color}-500`
                    ]">
                        <UIcon :name="stat.icon" class="text-2xl flex" />
                    </div>
                    <div>
                        <p class="text-sm font-medium text-dimmed">{{ stat.label }}</p>
                        <p class="text-2xl font-bold">{{ stat.value }}</p>
                    </div>
                </div>
            </UCard>
        </div>

        <!-- ============================================================
             Table view
             ============================================================ -->
        <UTable v-if="viewMode === 'table'" sticky :data="pagedBookings" :columns="bookingColumns" ref="table"
            class="flex-1">
        <template #empty>
            <UEmpty variant="naked" icon="i-lucide-calendar-check" title="No availed bookings found" description="When an engagement is completed, it will appear here." />
        </template>
    </UTable>

    <div v-if="viewMode === 'table' && filteredBookings.length > pageSize"
        class="flex justify-center py-4 border-t border-default">
        <UPagination v-model:page="page" :total="filteredBookings.length" :items-per-page="pageSize" variant="subtle" />
    </div>

    <!-- ============================================================
         Cards view
         ============================================================ -->
    <template v-else-if="viewMode === 'cards'">
        <div class="flex-1 flex flex-col overflow-y-auto scrollbar" :class="[bookings.length === 0 ? 'justify-center' : '']">
            <template v-if="bookings.length === 0">
                <UEmpty variant="naked" icon="i-lucide-calendar-check" title="No availed bookings found" description="When an engagement is completed, it will appear here." />
            </template>
            <template v-else>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
                    <UCard v-for="booking in pagedBookings" :key="booking.id" variant="subtle"
                        :ui="{ body: 'flex items-center gap-4' }" class="shadow-sm">

                    <!-- Thumbnail -->
                    <div class="size-16 rounded-lg overflow-hidden shrink-0 bg-elevated">
                        <NuxtImg v-if="booking.image" :src="booking.image" :alt="booking.offering"
                            class="w-full h-full object-cover" />
                        <div v-else class="w-full h-full flex items-center justify-center">
                            <UIcon name="i-lucide-image" class="text-muted size-6" />
                        </div>
                    </div>

                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between gap-2">
                            <div class="min-w-0">
                                <p class="font-semibold text-highlighted text-sm leading-snug truncate">
                                    {{ booking.offering }}
                                </p>
                                <p class="text-xs text-muted mt-0.5">
                                    {{ booking.company }} · {{ booking.date }}
                                </p>
                                <p class="text-xs text-muted mt-1">
                                    {{ booking.participants }} participants · {{ formatter.format(booking.price) }}
                                </p>
                            </div>

                            <!-- Rating + actions -->
                            <div class="flex flex-col items-end gap-1 shrink-0">
                                <div class="text-[10px] font-semibold text-muted uppercase tracking-wider">Rating</div>
                                <div v-if="booking.rating > 0" class="flex items-center gap-1">
                                    <UIcon name="i-lucide-star" class="text-amber-400 fill-amber-400 size-3.5" />
                                    <span class="text-sm font-bold text-highlighted">{{ booking.rating.toFixed(1) }}</span>
                                </div>
                                <span v-else class="text-xs text-muted">—</span>
                            </div>
                        </div>
                    </div>

                    <!-- Overflow menu -->
                    <AppDropdownMenu :items="getBookingDropdownItems(booking)" size="sm"
                        trigger-icon="i-lucide-more-vertical" trigger-variant="ghost" trigger-color="neutral"
                        trigger-size="sm" :content="{ align: 'end', side: 'bottom', sideOffset: 4 }" />
                </UCard>
                </div>
            </template>
        </div>

        <div v-if="filteredBookings.length > pageSize"
            class="mt-auto flex justify-center py-4 border-t border-default">
            <UPagination v-model:page="page" :total="filteredBookings.length" :items-per-page="pageSize"
                variant="subtle" />
        </div>
    </template>
</template>