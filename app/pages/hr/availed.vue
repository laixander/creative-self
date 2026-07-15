<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const toast = useToast()

import { useHrStore } from '~/stores/hrStore'
import type { HrAvailedBooking } from '~/types/hr/availedBooking'

const hrStore = useHrStore()
const bookings = computed(() => hrStore.availedBookings)

const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

const statusColors: Record<HrAvailedBooking['status'], string> = {
    confirmed: 'info',
    completed: 'success',
    cancelled: 'error'
}

const completedBookings = computed(() => bookings.value.filter(b => b.status === 'completed'))
const completedCount = computed(() => completedBookings.value.length)
const totalParticipants = computed(() => completedBookings.value.reduce((sum, b) => sum + b.participants, 0))
const totalSpend = computed(() => completedBookings.value.reduce((sum, b) => sum + b.price, 0))

const stats = computed(() => [
    { label: 'Completed Services', value: completedCount.value, icon: 'i-lucide-check-circle', color: 'green' },
    { label: 'Employees Benefited', value: totalParticipants.value, icon: 'i-lucide-users', color: 'amber' },
    { label: 'Total Invested', value: formatter.format(totalSpend.value), icon: 'i-lucide-banknote', color: 'teal' }
])

const isSlideoverOpen = ref(false)
const selectedBooking = ref<HrAvailedBooking | null>(null)

const openSlideover = (booking: HrAvailedBooking) => {
    selectedBooking.value = booking
    isSlideoverOpen.value = true
}

const getBookingDropdownItems = (booking: HrAvailedBooking): DropdownMenuItem[] => [
    { label: 'View details', icon: 'i-lucide-eye', onSelect: () => openSlideover(booking) }
]

const bookingColumns: TableColumn<HrAvailedBooking>[] = [
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
        accessorKey: 'provider',
        header: 'Provider',
        cell: ({ row }) => h('div', { class: 'text-sm text-muted' }, row.original.provider)
    },
    {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => h('div', { class: 'font-mono text-sm' }, row.original.date)
    },
    {
        accessorKey: 'participants',
        header: 'Employees',
        cell: ({ row }) => h('div', { class: 'text-sm text-center' }, row.original.participants)
    },
    {
        accessorKey: 'price',
        header: 'Cost',
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
            b.provider.toLowerCase().includes(q)
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

definePageMeta({
    isTable: true
})
</script>

<template>
    <Teleport to="#header-actions">
        <AppGlobalFilter v-model="globalFilter" placeholder="Search availed services..." />
        <AppTableColumnToggle :table="table" v-if="viewMode === 'table'" />
        <AppViewToggle v-model="viewMode" />
    </Teleport>

    <!-- Stats row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 shrink-0 px-4 pt-4 sm:px-6 sm:pt-6">
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
                    <p class="text-2xl font-bold text-highlighted">{{ stat.value }}</p>
                </div>
            </div>
        </UCard>
    </div>

    <!-- Table View -->
    <UTable v-if="viewMode === 'table'" sticky :data="pagedBookings" :columns="bookingColumns" ref="table" class="flex-1">
        <template #empty>
            <UEmpty variant="naked" icon="i-lucide-box" title="No services found" description="When you avail services, they will appear here." />
        </template>
    </UTable>

    <!-- Cards View -->
    <template v-else-if="viewMode === 'cards'">
        <div class="flex-1 flex flex-col overflow-y-auto scrollbar" :class="[filteredBookings.length === 0 ? 'justify-center' : '']">
            <template v-if="filteredBookings.length === 0">
                <UEmpty variant="naked" icon="i-lucide-box" title="No services found" description="When you avail services, they will appear here." />
            </template>
            <template v-else>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6">
                    <UCard v-for="booking in pagedBookings" :key="booking.id" variant="subtle"
                        :ui="{ root: 'flex flex-col justify-start', header: 'p-0 sm:p-0', body: 'flex-1 p-4' }"
                        class="shadow-sm cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md hover:border-primary-500/50 overflow-hidden"
                        @click="openSlideover(booking)">
                        
                        <template v-if="booking.image" #header>
                            <div class="relative h-36 overflow-hidden">
                                <NuxtImg :src="booking.image" :alt="booking.offering" class="w-full h-full object-cover" />
                                <div class="absolute top-2 right-2 flex gap-1">
                                    <UBadge :color="statusColors[booking.status]" variant="solid" size="sm" class="capitalize shadow-sm">
                                        {{ booking.status }}
                                    </UBadge>
                                </div>
                            </div>
                        </template>

                        <div class="flex flex-col h-full">
                            <div class="flex items-center gap-2 mb-1">
                                <UIcon name="i-lucide-building-2" class="size-4 text-muted shrink-0" />
                                <span class="text-xs font-medium text-primary line-clamp-1">{{ booking.provider }}</span>
                            </div>
                            
                            <h3 class="font-bold text-highlighted text-lg leading-tight line-clamp-2 mb-4">{{ booking.offering }}</h3>
                            
                            <div class="mt-auto grid grid-cols-2 gap-2 text-sm pt-3 border-t border-default">
                                <div class="flex items-center gap-1.5 text-muted">
                                    <UIcon name="i-lucide-calendar" class="size-4 shrink-0" />
                                    <span class="truncate">{{ booking.date }}</span>
                                </div>
                                <div class="flex justify-end items-center gap-1.5 text-highlighted font-semibold">
                                    ${{ booking.price }}
                                </div>
                            </div>
                        </div>
                    </UCard>
                </div>
            </template>
        </div>
        
        <div v-if="filteredBookings.length > pageSize" class="mt-auto flex justify-center py-4 border-t border-default">
            <UPagination v-model:page="page" :total="filteredBookings.length" :items-per-page="pageSize" variant="subtle" />
        </div>
    </template>

    <!-- Slideover -->
    <USlideover v-model:open="isSlideoverOpen" title="Service Details">
        <template #body>
            <div v-if="selectedBooking" class="space-y-6">
                <!-- Cover Image -->
                <div v-if="selectedBooking.image" class="aspect-video w-full rounded-lg overflow-hidden bg-elevated border border-default relative">
                    <img :src="selectedBooking.image" class="w-full h-full object-cover" />
                    <div class="absolute top-3 right-3">
                        <UBadge :color="statusColors[selectedBooking.status]" variant="solid" class="capitalize shadow-sm">
                            {{ selectedBooking.status }}
                        </UBadge>
                    </div>
                </div>

                <div>
                    <h2 class="text-2xl font-bold text-highlighted mb-1">{{ selectedBooking.offering }}</h2>
                    <p class="text-muted flex items-center gap-2 font-medium">
                        <UIcon name="i-lucide-building-2" class="size-4" />
                        Provided by {{ selectedBooking.provider }}
                    </p>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div class="p-3 bg-elevated rounded-lg border border-default flex flex-col items-center justify-center">
                        <UIcon name="i-lucide-calendar" class="text-muted size-5 mb-1" />
                        <span class="font-semibold text-highlighted">{{ selectedBooking.date }}</span>
                        <span class="text-xs text-muted uppercase tracking-wider mt-1">Date</span>
                    </div>
                    
                    <div class="p-3 bg-elevated rounded-lg border border-default flex flex-col items-center justify-center">
                        <UIcon name="i-lucide-users" class="text-muted size-5 mb-1" />
                        <span class="font-semibold text-highlighted">{{ selectedBooking.participants }}</span>
                        <span class="text-xs text-muted uppercase tracking-wider mt-1">Employees</span>
                    </div>
                    
                    <div class="p-3 bg-elevated rounded-lg border border-default flex flex-col items-center justify-center">
                        <UIcon name="i-lucide-banknote" class="text-teal-500 size-5 mb-1" />
                        <span class="font-bold text-highlighted text-lg">${{ selectedBooking.price }}</span>
                        <span class="text-xs text-muted uppercase tracking-wider mt-1">Cost</span>
                    </div>
                    
                    <div class="p-3 bg-elevated rounded-lg border border-default flex flex-col items-center justify-center">
                        <UIcon name="i-lucide-star" class="text-amber-500 size-5 mb-1" />
                        <span class="font-semibold text-highlighted text-lg">{{ selectedBooking.rating > 0 ? selectedBooking.rating.toFixed(1) : '—' }}</span>
                        <span class="text-xs text-muted uppercase tracking-wider mt-1">Rating</span>
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
