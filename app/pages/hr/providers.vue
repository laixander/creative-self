<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'
import { useHrStore } from '~/stores/hrStore'
import type { HrProvider } from '~/types/hr/provider'

const UIcon = resolveComponent('UIcon')
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const toast = useToast()

const hrStore = useHrStore()
const providers = computed(() => hrStore.providers)

const statusColors: Record<HrProvider['status'], any> = {
    active: 'success',
    inactive: 'neutral'
}

const getDropdownItems = (provider: HrProvider): DropdownMenuItem[] => [
    { label: 'View details', icon: 'i-lucide-eye', onSelect: () => openSlideover(provider) },
    { label: 'Send message', icon: 'i-lucide-mail', onSelect: () => handleSendMessage(provider) }
]

function handleSendMessage(provider: HrProvider) {
    toast.add({ title: 'Opening message composer', description: provider.contactEmail, color: 'info' })
}

const columns: TableColumn<HrProvider>[] = [
    {
        accessorKey: 'name',
        header: 'Provider',
        cell: ({ row }) => h('div', { class: 'flex items-center gap-3' }, [
            h('div', {
                class: 'size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0'
            }, h(UIcon, {
                name: 'i-lucide-building-2 text-primary text-base'
            })),
            h('div', { class: 'min-w-0' }, [
                h('div', { class: 'font-semibold text-highlighted truncate' }, row.original.name),
                h('div', { class: 'text-xs text-muted truncate' }, row.original.location)
            ])
        ])
    },
    {
        accessorKey: 'offeringsCount',
        header: 'Offerings',
        cell: ({ row }) => h('div', { class: 'font-mono text-sm' }, row.original.offeringsCount)
    },
    {
        accessorKey: 'rating',
        header: 'Rating',
        cell: ({ row }) => h('div', { class: 'flex items-center gap-1 text-sm font-semibold' }, [
            h(UIcon, { name: 'i-lucide-star', class: 'text-amber-500 size-4' }),
            row.original.rating.toFixed(1)
        ])
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

const viewMode = ref<'table' | 'cards'>('cards')
const table = useTemplateRef('table')
const globalFilter = ref('')

const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
]

const filter = ref({
    status: statusOptions.map(s => s.value)
})

function clearFilters() {
    filter.value.status = statusOptions.map(s => s.value)
    globalFilter.value = ''
}

const filteredProviders = computed(() => {
    let result = providers.value
    result = result.filter(p => filter.value.status.includes(p.status))
    if (globalFilter.value) {
        const q = globalFilter.value.toLowerCase()
        result = result.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.location.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        )
    }
    return result
})

const page = ref(1)
const pageSize = 12
const pagedProviders = computed(() => {
    const start = (page.value - 1) * pageSize
    return filteredProviders.value.slice(start, start + pageSize)
})
watch(filteredProviders, () => { page.value = 1 })

const activeFilterCount = computed(() => {
    let count = 0
    if (filter.value.status.length < statusOptions.length) count++
    return count
})

// ============================================================================
// Slideover / Detail
// ============================================================================
const isSlideoverOpen = ref(false)
const selectedProvider = ref<HrProvider | null>(null)

function openSlideover(provider: HrProvider) {
    selectedProvider.value = provider
    isSlideoverOpen.value = true
}

definePageMeta({
    isTable: true
})
</script>

<template>
    <Teleport to="#header-actions">
        <AppGlobalFilter v-model="globalFilter" placeholder="Search providers..." />
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
                    <UButton block icon="i-lucide-refresh-ccw" color="neutral" variant="subtle" size="sm" label="Reset"
                        @click="clearFilters" />
                </div>
            </template>
        </UPopover>
        <AppViewToggle v-model="viewMode" />
    </Teleport>

    <template v-if="viewMode === 'table'">
        <!-- Table View -->
        <UTable sticky :data="pagedProviders" :columns="columns" ref="table" class="flex-1">
            <template #empty>
                <UEmpty variant="naked" icon="i-lucide-building-2" title="No providers found"
                    description="Adjust filters to see providers." />
            </template>
        </UTable>

        <div v-if="filteredProviders.length > pageSize" class="flex justify-center py-4 border-t border-default">
            <UPagination v-model:page="page" :total="filteredProviders.length" :items-per-page="pageSize"
                variant="subtle" />
        </div>
    </template>

    <!-- Cards View -->
    <template v-else-if="viewMode === 'cards'">
        <div class="flex-1 flex flex-col overflow-y-auto scrollbar"
            :class="[filteredProviders.length === 0 ? 'justify-center' : '']">
            <template v-if="filteredProviders.length === 0">
                <UEmpty variant="naked" icon="i-lucide-building-2" title="No providers found"
                    description="Adjust filters to see providers." />
            </template>
            <template v-else>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6">
                    <UCard v-for="provider in pagedProviders" :key="provider.id" variant="subtle"
                        :ui="{ root: 'flex flex-col', body: 'flex-1 flex flex-col gap-4 sm:gap-6' }"
                        class="shadow-sm cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md hover:border-primary-500/50"
                        @click="openSlideover(provider)">

                        <template #header>
                            <div class="flex items-center justify-between gap-3">
                                <div class="flex items-center gap-3 min-w-0">
                                    <div
                                        class="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <UIcon name="i-lucide-building-2" class="text-primary text-base" />
                                    </div>
                                    <div class="min-w-0">
                                        <div class="font-semibold text-highlighted truncate">{{ provider.name }}</div>
                                        <div class="text-xs text-muted truncate">{{ provider.location }}</div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-1 shrink-0">
                                    <UBadge :color="statusColors[provider.status]" variant="subtle" size="sm" class="capitalize">
                                        {{ provider.status }}
                                    </UBadge>
                                </div>
                            </div>
                        </template>

                        <div class="space-y-3">
                            <p class="text-sm text-muted line-clamp-2">{{ provider.description }}</p>
                            
                            <div class="flex gap-2">
                                <UBadge v-for="cat in provider.categories" :key="cat" variant="soft" color="neutral" size="sm" class="capitalize">{{ cat.replace('-', ' ') }}</UBadge>
                            </div>
                            
                            <div class="pt-4 border-t border-default grid grid-cols-3 gap-2 text-center text-sm">
                                <div>
                                    <div class="font-semibold text-highlighted">{{ provider.offeringsCount }}</div>
                                    <div class="text-xs text-muted">Offerings</div>
                                </div>
                                <div>
                                    <div class="font-semibold text-highlighted">{{ provider.totalBookings }}</div>
                                    <div class="text-xs text-muted">Bookings</div>
                                </div>
                                <div>
                                    <div class="font-semibold text-highlighted flex items-center justify-center gap-1">
                                        <UIcon name="i-lucide-star" class="text-amber-500 size-3" />
                                        {{ provider.rating.toFixed(1) }}
                                    </div>
                                    <div class="text-xs text-muted">Rating</div>
                                </div>
                            </div>
                        </div>

                    </UCard>
                </div>
            </template>
        </div>

        <div v-if="filteredProviders.length > pageSize" class="mt-auto flex justify-center py-4 border-t border-default">
            <UPagination v-model:page="page" :total="filteredProviders.length" :items-per-page="pageSize"
                variant="subtle" />
        </div>
    </template>

    <!-- Slideover -->
    <USlideover v-model:open="isSlideoverOpen" title="Provider Profile">
        <template #body>
            <div v-if="selectedProvider" class="space-y-6">
                <div class="flex items-center gap-4 border-b border-default pb-4">
                    <div class="size-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <UIcon name="i-lucide-building-2" class="text-primary text-3xl" />
                    </div>
                    <div>
                        <h2 class="text-xl font-bold text-highlighted">{{ selectedProvider.name }}</h2>
                        <div class="flex items-center gap-2 mt-1">
                            <UBadge :color="statusColors[selectedProvider.status]" variant="subtle" size="sm" class="capitalize">
                                {{ selectedProvider.status }}
                            </UBadge>
                            <span class="text-sm font-semibold flex items-center gap-1 text-highlighted">
                                <UIcon name="i-lucide-star" class="text-amber-500 size-4" /> {{ selectedProvider.rating.toFixed(1) }}
                            </span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 class="text-sm font-semibold text-highlighted uppercase tracking-wider mb-2">About</h3>
                    <p class="text-muted leading-relaxed text-sm">{{ selectedProvider.description }}</p>
                </div>
                
                <div>
                    <h3 class="text-sm font-semibold text-highlighted uppercase tracking-wider mb-2">Specialties</h3>
                    <div class="flex flex-wrap gap-2">
                        <UBadge v-for="cat in selectedProvider.categories" :key="cat" variant="soft" color="neutral" class="capitalize">{{ cat.replace('-', ' ') }}</UBadge>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div class="p-3 bg-elevated rounded-lg border border-default">
                        <div class="text-xs text-muted uppercase tracking-wider mb-1">Email</div>
                        <div class="font-semibold text-highlighted flex items-center gap-2 text-sm">
                            <UIcon name="i-lucide-mail" class="text-muted size-4 shrink-0" />
                            <a :href="`mailto:${selectedProvider.contactEmail}`"
                                class="text-primary hover:underline truncate">{{ selectedProvider.contactEmail }}</a>
                        </div>
                    </div>
                    <div class="p-3 bg-elevated rounded-lg border border-default">
                        <div class="text-xs text-muted uppercase tracking-wider mb-1">Location</div>
                        <div class="font-semibold text-highlighted flex items-center gap-2 text-sm truncate">
                            <UIcon name="i-lucide-map-pin" class="text-muted size-4 shrink-0" />
                            {{ selectedProvider.location }}
                        </div>
                    </div>
                </div>

                <div class="space-y-3 pt-2">
                    <h3 class="text-sm font-semibold text-highlighted uppercase tracking-wider">Metrics</h3>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="flex flex-col items-center justify-center p-3 rounded-lg bg-elevated border border-default">
                            <span class="text-lg font-bold text-highlighted">{{ selectedProvider.offeringsCount }}</span>
                            <span class="text-xs text-muted uppercase tracking-wider">Offerings</span>
                        </div>
                        <div class="flex flex-col items-center justify-center p-3 rounded-lg bg-elevated border border-default">
                            <span class="text-lg font-bold text-highlighted">{{ selectedProvider.totalBookings }}</span>
                            <span class="text-xs text-muted uppercase tracking-wider">Bookings With Us</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2 w-full">
                <UButton color="neutral" variant="outline" label="Close" @click="isSlideoverOpen = false" />
                <UButton color="primary" icon="i-lucide-mail" label="Message" @click="handleSendMessage(selectedProvider!)" />
            </div>
        </template>
    </USlideover>
</template>
