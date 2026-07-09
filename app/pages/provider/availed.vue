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
const bookings = ref<BookingRow[]>([
    {
        id: 1,
        company: 'Northwind Labs',
        offering: 'Mindful Mondays — 8 Week Program',
        image: '/img/stockphoto_2.jpg',
        date: '2026-07-13',
        participants: 45,
        price: 2400,
        rating: 4.2,
        status: 'confirmed'
    },
    {
        id: 2,
        company: 'Helio Finance',
        offering: 'Stress Resilience Workshop',
        image: '/img/stockphoto_3.jpg',
        date: '2026-07-22',
        participants: 30,
        price: 1800,
        rating: 4.1,
        status: 'confirmed'
    },
    {
        id: 3,
        company: 'Apex Digital',
        offering: 'HIIT Bootcamp',
        image: '/img/stockphoto_4.jpg',
        date: '2026-07-28',
        participants: 15,
        price: 1500,
        rating: 4.5,
        status: 'confirmed'
    },
    {
        id: 4,
        company: 'Blueridge Partners',
        offering: 'Corporate Mindfulness Seminar',
        image: '/img/stockphoto_11.jpg',
        date: '2026-08-05',
        participants: 120,
        price: 15000,
        rating: 4.8,
        status: 'confirmed'
    },
    {
        id: 5,
        company: 'Solaris Group',
        offering: 'Morning Yoga Flow',
        image: '/img/stockphoto_5.jpg',
        date: '2026-06-18',
        participants: 50,
        price: 3000,
        rating: 4.6,
        status: 'completed'
    },
    {
        id: 6,
        company: 'Crestline Media',
        offering: 'Strength Training 101',
        image: '/img/stockphoto_9.jpg',
        date: '2026-06-25',
        participants: 8,
        price: 1200,
        rating: 4.0,
        status: 'completed'
    },
    {
        id: 7,
        company: 'Veritas Capital',
        offering: 'Gut Health Fundamentals',
        image: '/img/stockphoto_18.jpg',
        date: '2026-07-30',
        participants: 60,
        price: 4800,
        rating: 4.3,
        status: 'confirmed'
    },
    {
        id: 8,
        company: 'Ironclad Systems',
        offering: 'Breathwork for Beginners',
        image: '/img/stockphoto_15.jpg',
        date: '2026-06-10',
        participants: 35,
        price: 2000,
        rating: 4.7,
        status: 'completed'
    },
    {
        id: 9,
        company: 'Luminary Co.',
        offering: 'Kettlebell Core Crush',
        image: '/img/stockphoto_17.jpg',
        date: '2026-07-03',
        participants: 12,
        price: 0,
        rating: 0,
        status: 'cancelled'
    },
    {
        id: 10,
        company: 'Zenith Consulting',
        offering: 'Sleep Hygiene Masterclass',
        image: '/img/stockphoto_7.jpg',
        date: '2026-08-12',
        participants: 80,
        price: 6400,
        rating: 4.9,
        status: 'confirmed'
    }
])

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
    title: 'Availed',
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
        <UCard variant="subtle" :ui="{ body: 'flex flex-col gap-1 p-4 sm:p-5' }">
            <p class="text-[11px] font-semibold text-muted uppercase tracking-widest">Completed</p>
            <p class="text-3xl font-bold text-highlighted">{{ completedCount }}</p>
        </UCard>
        <UCard variant="subtle" :ui="{ body: 'flex flex-col gap-1 p-4 sm:p-5' }">
            <p class="text-[11px] font-semibold text-muted uppercase tracking-widest">Participants Reached</p>
            <p class="text-3xl font-bold text-highlighted">{{ participantsReached }}</p>
        </UCard>
        <UCard variant="subtle" :ui="{ body: 'flex flex-col gap-1 p-4 sm:p-5' }">
            <p class="text-[11px] font-semibold text-muted uppercase tracking-widest">Revenue</p>
            <p class="text-3xl font-bold text-highlighted">{{ formatter.format(totalRevenue) }}</p>
        </UCard>
    </div>

    <!-- ============================================================
         Table view
         ============================================================ -->
    <UTable v-if="viewMode === 'table'" sticky :data="pagedBookings" :columns="bookingColumns" ref="table"
        class="flex-1">
        <template #empty-state-content>
            <div class="flex flex-col items-center justify-center py-10 text-center">
                <div class="flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary ring-4 ring-primary/20 mb-3">
                    <UIcon name="i-lucide-calendar-check" class="size-8" />
                </div>
                <h3 class="text-lg font-semibold text-default">No bookings found</h3>
                <p class="text-sm text-muted mt-1">Try adjusting your search or filters.</p>
            </div>
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
        <div class="flex-1 flex flex-col overflow-y-auto scrollbar">
            <div v-if="pagedBookings.length === 0"
                class="flex flex-col items-center justify-center flex-1 py-20 text-center">
                <div class="flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary ring-4 ring-primary/20 mb-3">
                    <UIcon name="i-lucide-calendar-check" class="size-8" />
                </div>
                <h3 class="text-lg font-semibold text-default">No bookings found</h3>
                <p class="text-sm text-muted mt-1">Try adjusting your search or filters.</p>
            </div>

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
        </div>

        <div v-if="filteredBookings.length > pageSize" class="mt-auto flex justify-center py-4 border-t border-default">
            <UPagination v-model:page="page" :total="filteredBookings.length" :items-per-page="pageSize"
                variant="subtle" />
        </div>
    </template>
</template>