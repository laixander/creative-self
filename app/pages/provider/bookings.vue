<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'
import type { Booking } from '~/types/provider/booking'
import { useProviderStore } from '~/stores/providerStore'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const toast = useToast()

// ============================================================================
// Table data
// ============================================================================
const providerStore = useProviderStore()

const bookings = computed({
    get: () => providerStore.bookings as Booking[],
    set: (val) => { providerStore.bookings = val as any }
})

const kanbanColumns = [
    { id: 'submitted', title: 'Submitted', color: 'neutral', icon: 'i-lucide-file-text' },
    { id: 'pending_confirmation', title: 'Pending Confirmation', color: 'warning', icon: 'i-lucide-clock' },
    { id: 'confirmed', title: 'Confirmed', color: 'info', icon: 'i-lucide-check-circle' },
    { id: 'completed', title: 'Completed', color: 'success', icon: 'i-lucide-check-check' },
    { id: 'cancelled', title: 'Cancelled', color: 'error', icon: 'i-lucide-x-circle' },
    { id: 'rejected', title: 'Rejected', color: 'error', icon: 'i-lucide-ban' }
]

const statusColors: Record<string, string> = {
    submitted: 'neutral',
    pending_confirmation: 'warning',
    confirmed: 'info',
    completed: 'success',
    cancelled: 'error',
    rejected: 'error'
}

// ============================================================================
// Actions
// ============================================================================
function handleMarkCompleted(booking: Booking) {
    booking.status = 'completed'
    toast.add({ title: 'Booking marked as completed', description: `"${booking.offering}" for ${booking.company}.`, color: 'success' })
}

function handleCancelBooking(booking: Booking) {
    booking.status = 'cancelled'
    toast.add({ title: 'Booking cancelled', description: `"${booking.offering}" for ${booking.company}.`, color: 'error' })
}

// ============================================================================
// Slideover
// ============================================================================
const isSlideoverOpen = ref(false)
const selectedBooking = ref<Booking | null>(null)

function openSlideover(booking: Booking) {
    selectedBooking.value = booking
    isSlideoverOpen.value = true
}

function handleViewDetails(booking: Booking) {
    openSlideover(booking)
}

const getBookingDropdownItems = (booking: Booking): DropdownMenuItem[] => [
    { label: 'View details', icon: 'i-lucide-eye', onSelect: () => handleViewDetails(booking) },
    ...(booking.status === 'confirmed' ? [{
        label: 'Mark completed',
        icon: 'i-lucide-check-circle',
        color: 'success' as const,
        onSelect: () => handleMarkCompleted(booking)
    }] : []),
    ...(booking.status !== 'cancelled' && booking.status !== 'rejected' ? [{
        label: 'Cancel booking',
        icon: 'i-lucide-x-circle',
        color: 'error' as const,
        onSelect: () => handleCancelBooking(booking)
    }] : [])
]

// ============================================================================
// Columns
// ============================================================================
const bookingColumns: TableColumn<Booking>[] = [
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
            label: kanbanColumns.find(c => c.id === row.original.status)?.title || row.original.status,
            color: statusColors[row.original.status] || 'neutral',
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
const viewMode = ref<'table' | 'kanban'>('kanban')
const table = useTemplateRef('table')
const columnVisibility = ref({ id: false })
const statusOptions = kanbanColumns.map(c => ({ label: c.title, value: c.id }))
const filter = ref({ status: statusOptions.map(c => c.value) })

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

// ============================================================================
// Kanban Drag & Drop
// ============================================================================
const isDragging = ref(false)
const dragging = ref<{ bookingId: number; fromColumnId: string } | null>(null)
const dragOver = ref<{ columnId: string; bookingId: number | null } | null>(null)

const isDraggingCard = (id: number) => dragging.value?.bookingId === id
const isColumnOver = (columnId: string) => dragOver.value?.columnId === columnId
const isCardOver = (id: number) => dragOver.value?.bookingId === id

const onCardDragStart = (e: DragEvent, bookingId: number, columnId: string) => {
    isDragging.value = true
    dragging.value = { bookingId, fromColumnId: columnId }
    if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move'
    }
}

const onCardDragOver = (bookingId: number, columnId: string) => {
    if (!dragging.value) return
    if (dragOver.value?.bookingId === bookingId && dragOver.value?.columnId === columnId) return
    dragOver.value = { columnId, bookingId }
}

const onColumnDragOver = (columnId: string) => {
    if (!dragging.value) return
    if (dragOver.value?.columnId === columnId && dragOver.value?.bookingId === null) return
    dragOver.value = { columnId, bookingId: null }
}

const moveBooking = (bookingId: number, fromColumnId: string, toColumnId: string) => {
    const booking = bookings.value.find(b => b.id === bookingId)
    if (booking && booking.status !== toColumnId) {
        booking.status = toColumnId as any
        toast.add({ title: 'Status updated', description: `Moved to ${kanbanColumns.find(c => c.id === toColumnId)?.title}`, color: 'success' })
    }
}

const onDrop = (toColumnId: string) => {
    if (!dragging.value) return
    const { bookingId, fromColumnId } = dragging.value
    moveBooking(bookingId, fromColumnId, toColumnId)
    dragging.value = null
    dragOver.value = null
    setTimeout(() => { isDragging.value = false }, 50)
}

const onDragEnd = () => {
    dragging.value = null
    dragOver.value = null
    setTimeout(() => { isDragging.value = false }, 50)
}

const displayColumns = computed(() => {
    return kanbanColumns.map(col => {
        return {
            ...col,
            cards: filteredData.value.filter(b => b.status === col.id)
        }
    })
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
        <AppViewToggle v-model="viewMode" kanban />
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

    <template v-else-if="viewMode === 'kanban'">
        <ClientOnly>
            <div class="flex-1 min-h-0 flex flex-col">
                <div class="flex-1 flex gap-3 overflow-x-auto scrollbar p-4">
                    <div v-for="column in displayColumns" :key="column.id" class="flex flex-col w-72 shrink-0 gap-2">
                        <!-- Column header -->
                        <div class="flex items-center gap-2 p-2 rounded-xl shrink-0">
                            <UChip :color="column.color as any" size="2xl" standalone inset />
                            <UIcon :name="column.icon" class="size-4 text-muted shrink-0" />
                            <span class="text-sm font-semibold truncate">{{ column.title }}</span>
                            <UBadge :label="String(column.cards.length)" variant="soft" color="neutral" class="ml-auto shrink-0 font-mono" />
                        </div>

                        <!-- Drop zone -->
                        <div class="flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto scrollbar rounded-xl p-2 transition-all duration-150"
                            :class="isColumnOver(column.id) ? 'bg-primary/5 ring-2 ring-primary/30 ring-dashed' : 'bg-elevated/40'" 
                            @dragover.prevent="onColumnDragOver(column.id)"
                            @drop.prevent="onDrop(column.id)" 
                            @dragend="onDragEnd">
                            
                            <template v-for="booking in column.cards" :key="booking.id">
                                <div class="relative">
                                    <div v-if="isCardOver(booking.id)" class="absolute -top-[5px] left-1 right-1 h-0.5 rounded-full bg-primary z-10 pointer-events-none" />
                                    
                                    <UCard :ui="{ root: 'ring-0 border border-default', body: 'sm:p-4 relative space-y-2' }"
                                        class="group transition-all select-none shrink-0 cursor-pointer active:cursor-default hover:border-primary/30 hover:shadow-sm" 
                                        :class="[isDraggingCard(booking.id) && 'opacity-40 scale-95']" 
                                        draggable="true"
                                        @click="(e: MouseEvent) => { if (isDragging) { e.stopPropagation(); return; } openSlideover(booking); }"
                                        @dragstart="onCardDragStart($event, booking.id, column.id)"
                                        @dragover.prevent.stop="onCardDragOver(booking.id, column.id)"
                                        @drop.prevent.stop="onDrop(column.id)" 
                                        @dragend="onDragEnd">
                                        
                                        <div class="flex items-start justify-between gap-2">
                                            <p class="text-sm font-medium leading-snug text-highlighted line-clamp-1">
                                                {{ booking.company }}
                                            </p>
                                            <UBadge v-if="booking.location" :label="booking.location" color="neutral" variant="soft" size="xs" class="shrink-0" />
                                        </div>
                                        
                                        <p class="text-xs text-muted leading-relaxed line-clamp-2">
                                            {{ booking.offering }}
                                        </p>
                                        
                                        <div class="flex justify-between items-center pt-2">
                                            <div class="flex items-center gap-1 text-muted text-xs">
                                                <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5 shrink-0" />
                                                {{ booking.date }} <span v-if="booking.time">&bull; {{ booking.time }}</span>
                                            </div>
                                            <div v-if="booking.price" class="flex items-center gap-1 text-highlighted text-xs font-semibold">
                                                ${{ booking.price }}
                                            </div>
                                        </div>
                                    </UCard>
                                </div>
                            </template>
                            
                            <UEmpty v-if="column.cards.length === 0" variant="naked" icon="i-lucide-inbox" 
                                title="No requests" description="Drop a card here" class="flex-1 py-4" />
                        </div>
                    </div>
                </div>
            </div>
        </ClientOnly>
    </template>

    <!-- Slideover -->
    <USlideover v-model:open="isSlideoverOpen" title="Booking Details">
        <template #body>
            <div v-if="selectedBooking" class="space-y-6">
                <div>
                    <h1 class="text-2xl font-bold text-highlighted mb-2">{{ selectedBooking.company }}</h1>
                    <div class="flex items-center gap-2 mb-4">
                        <UBadge :color="statusColors[selectedBooking.status] || 'neutral'" variant="subtle" class="capitalize">
                            {{ kanbanColumns.find(c => c.id === selectedBooking.status)?.title || selectedBooking.status }}
                        </UBadge>
                        <span class="text-sm text-muted ml-2">
                            Requested by <span class="font-medium text-highlighted">{{ selectedBooking.contactName || 'Unknown' }}</span>
                        </span>
                    </div>
                    <p class="text-highlighted leading-relaxed font-medium">
                        {{ selectedBooking.offering }}
                    </p>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div class="flex flex-col items-center justify-center p-3 rounded-lg bg-elevated border border-default">
                        <UIcon name="i-lucide-users" class="size-5 text-muted mb-1" />
                        <span class="text-lg font-bold text-highlighted">{{ selectedBooking.participants }}</span>
                        <span class="text-xs text-muted uppercase tracking-wider mt-1">Participants</span>
                    </div>
                    <div class="flex flex-col items-center justify-center p-3 rounded-lg bg-elevated border border-default">
                        <UIcon name="i-lucide-calendar" class="size-5 text-muted mb-1" />
                        <span class="text-lg font-bold text-highlighted">{{ selectedBooking.date }}</span>
                        <span class="text-xs text-muted uppercase tracking-wider mt-1">Date</span>
                    </div>
                    <div class="flex flex-col items-center justify-center p-3 rounded-lg bg-elevated border border-default">
                        <UIcon name="i-lucide-clock" class="size-5 text-muted mb-1" />
                        <span class="text-lg font-bold text-highlighted">{{ selectedBooking.time || 'TBD' }}</span>
                        <span class="text-xs text-muted uppercase tracking-wider mt-1">Time</span>
                    </div>
                    <div class="flex flex-col items-center justify-center p-3 rounded-lg bg-elevated border border-default">
                        <UIcon name="i-lucide-map-pin" class="size-5 text-muted mb-1" />
                        <span class="text-sm font-bold text-highlighted text-center px-2">{{ selectedBooking.location || 'TBD' }}</span>
                        <span class="text-xs text-muted uppercase tracking-wider mt-1">Location</span>
                    </div>
                    <div class="flex flex-col items-center justify-center p-3 rounded-lg bg-elevated border border-default col-span-2">
                        <UIcon name="i-lucide-circle-dollar-sign" class="size-5 text-success mb-1" />
                        <span class="text-2xl font-bold text-highlighted">${{ selectedBooking.price || 0 }}</span>
                        <span class="text-xs text-muted uppercase tracking-wider mt-1">Estimated Revenue</span>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-between w-full">
                <div class="flex gap-2">
                    <template v-if="selectedBooking">
                        <UButton v-if="selectedBooking.status === 'confirmed'" color="success" icon="i-lucide-check-circle" label="Mark Completed" @click="() => { handleMarkCompleted(selectedBooking!); isSlideoverOpen = false; }" />
                        <UButton v-if="selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'rejected'" color="error" variant="soft" icon="i-lucide-x-circle" label="Cancel Booking" @click="() => { handleCancelBooking(selectedBooking!); isSlideoverOpen = false; }" />
                    </template>
                </div>
                <UButton color="neutral" variant="outline" label="Close" @click="isSlideoverOpen = false" />
            </div>
        </template>
    </USlideover>
</template>