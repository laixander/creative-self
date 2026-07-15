<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'

const UIcon = resolveComponent('UIcon')
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

import { useHrStore } from '~/stores/hrStore'
import type { HrMediaPost } from '~/types/hr/mediaPost'

const hrStore = useHrStore()
const media = computed(() => hrStore.media)

const typeIcons: Record<HrMediaPost['type'], string> = {
    video: 'i-lucide-video',
    podcast: 'i-lucide-mic-2',
    article: 'i-lucide-file-text'
}

const typeColors: Record<HrMediaPost['type'], any> = {
    video: 'red',
    podcast: 'purple',
    article: 'sky'
}

const typeLabels: Record<HrMediaPost['type'], string> = {
    video: 'Video',
    podcast: 'Podcast',
    article: 'Article'
}

const isSlideoverOpen = ref(false)
const selectedPost = ref<HrMediaPost | null>(null)

function openSlideover(post: HrMediaPost) {
    selectedPost.value = post
    isSlideoverOpen.value = true
}

const getDropdownItems = (post: HrMediaPost): DropdownMenuItem[] => [
    { label: 'View details', icon: 'i-lucide-eye', onSelect: () => openSlideover(post) }
]

const columns: TableColumn<HrMediaPost>[] = [
    {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => h('div', { class: 'flex items-center gap-3' }, [
            row.original.thumbnail
                ? h('img', { src: row.original.thumbnail, class: 'w-12 h-8 rounded object-cover shrink-0' })
                : h('div', { class: `size-9 rounded-lg flex items-center justify-center shrink-0 bg-${typeColors[row.original.type]}-500/10` },
                    h(UIcon, { name: typeIcons[row.original.type], class: `text-${typeColors[row.original.type]}-500 text-base` })
                ),
            h('div', { class: 'min-w-0' }, [
                h('div', { class: 'font-semibold text-highlighted truncate max-w-72' }, row.original.title),
                h('div', { class: 'text-xs text-primary truncate' }, row.original.providerName)
            ])
        ])
    },
    {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => h(UBadge, {
            label: typeLabels[row.original.type],
            color: typeColors[row.original.type],
            variant: 'subtle',
            size: 'sm'
        })
    },
    {
        accessorKey: 'publishedDate',
        header: 'Date',
        cell: ({ row }) => h('div', { class: 'font-mono text-sm text-muted' }, row.original.publishedDate)
    },
    {
        accessorKey: 'views',
        header: 'Views',
        cell: ({ row }) => h('div', { class: 'font-mono text-sm' }, row.original.views.toLocaleString())
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

const typeOptions = [
    { label: 'Video', value: 'video' },
    { label: 'Podcast', value: 'podcast' },
    { label: 'Article', value: 'article' }
]

const filter = ref({
    type: typeOptions.map(t => t.value)
})

function clearFilters() {
    filter.value.type = typeOptions.map(t => t.value)
    globalFilter.value = ''
}

const filteredMedia = computed(() => {
    let result = media.value ?? []
    result = result.filter(p => p.status === 'published')
    
    result = result.filter(p => filter.value.type.includes(p.type))
    
    if (globalFilter.value) {
        const q = globalFilter.value.toLowerCase()
        result = result.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.providerName.toLowerCase().includes(q) ||
            p.tags.some(t => t.toLowerCase().includes(q))
        )
    }
    return result
})

const page = ref(1)
const pageSize = 12
const pagedMedia = computed(() => {
    const start = (page.value - 1) * pageSize
    return filteredMedia.value.slice(start, start + pageSize)
})
watch(filteredMedia, () => { page.value = 1 })

const activeFilterCount = computed(() => {
    let count = 0
    if (filter.value.type.length < typeOptions.length) count++
    return count
})

definePageMeta({
    isTable: true
})
</script>

<template>
    <Teleport to="#header-actions">
        <AppGlobalFilter v-model="globalFilter" placeholder="Search media feed..." />
        <AppTableColumnToggle :table="table" v-if="viewMode === 'table'" />
        <UPopover>
            <UChip :show="activeFilterCount > 0">
                <UButton icon="i-lucide-sliders-horizontal" color="neutral" variant="subtle" />
            </UChip>
            <template #content>
                <div class="flex flex-col gap-2 p-3 w-56">
                    <UFormField label="Filter by Type:" size="sm">
                        <USelectMenu v-model="filter.type" :items="typeOptions" multiple placeholder="Type"
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
    <UTable v-if="viewMode === 'table'" sticky :data="pagedMedia" :columns="columns" ref="table" class="flex-1">
        <template #empty>
            <UEmpty variant="naked" icon="i-lucide-clapperboard" title="No media posts found"
                description="When providers publish media, it will appear here." />
        </template>
    </UTable>

    <!-- Cards View -->
    <template v-else-if="viewMode === 'cards'">
        <div class="flex-1 flex flex-col overflow-y-auto scrollbar" :class="[filteredMedia.length === 0 ? 'justify-center' : '']">
            <template v-if="filteredMedia.length === 0">
                <UEmpty variant="naked" icon="i-lucide-clapperboard" title="No media posts found"
                    description="When providers publish media, it will appear here." />
            </template>
            <template v-else>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6">
                    <UCard v-for="post in pagedMedia" :key="post.id" variant="subtle"
                        :ui="{ root: 'flex flex-col justify-start', header: 'p-0 sm:p-0', body: 'flex-1 p-4 flex flex-col' }"
                        class="shadow-sm cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md hover:border-primary-500/50 overflow-hidden"
                        @click="openSlideover(post)">
                        <!-- Cover image -->
                        <template #header>
                            <div v-if="post.thumbnail" class="relative h-40 overflow-hidden">
                                <img :src="post.thumbnail" :alt="post.title" class="w-full h-full object-cover" />
                                <div class="absolute top-2 right-2">
                                    <UBadge :color="typeColors[post.type]" variant="solid" size="sm" class="capitalize shadow-sm">
                                        <UIcon :name="typeIcons[post.type]" class="mr-1 size-3" />
                                        {{ typeLabels[post.type] }}
                                    </UBadge>
                                </div>
                            </div>
                            <div v-else class="relative h-40 overflow-hidden bg-elevated flex items-center justify-center">
                                <UIcon :name="typeIcons[post.type]" :class="`text-${typeColors[post.type]}-500 text-5xl`" />
                                <div class="absolute top-2 right-2">
                                    <UBadge :color="typeColors[post.type]" variant="solid" size="sm" class="capitalize shadow-sm">
                                        {{ typeLabels[post.type] }}
                                    </UBadge>
                                </div>
                            </div>
                        </template>
                        
                        <div class="flex flex-col h-full">
                            <div class="text-xs font-medium text-primary mb-1 flex items-center gap-1.5 line-clamp-1">
                                <UIcon name="i-lucide-building-2" class="size-3.5 shrink-0" />
                                {{ post.providerName }}
                            </div>
                            
                            <h3 class="font-bold text-highlighted text-lg leading-tight line-clamp-2 mb-2">{{ post.title }}</h3>
                            
                            <p class="mt-1 text-muted text-sm line-clamp-3 mb-4">{{ post.description }}</p>
                            
                            <div class="mt-auto flex items-center justify-between text-xs text-muted pt-3 border-t border-default">
                                <span class="flex items-center gap-1">
                                    <UIcon name="i-lucide-calendar" class="size-3.5" />
                                    {{ post.publishedDate }}
                                </span>
                                <span class="flex items-center gap-1">
                                    <UIcon name="i-lucide-eye" class="size-3.5" />
                                    {{ post.views.toLocaleString() }}
                                </span>
                            </div>
                        </div>
                    </UCard>
                </div>
            </template>
        </div>

        <div v-if="filteredMedia.length > pageSize" class="mt-auto flex justify-center py-4 border-t border-default">
            <UPagination v-model:page="page" :total="filteredMedia.length" :items-per-page="pageSize"
                variant="subtle" />
        </div>
    </template>

    <!-- Slideover -->
    <USlideover v-model:open="isSlideoverOpen" title="Media Details">
        <template #body>
            <div v-if="selectedPost" class="space-y-6">
                <div v-if="selectedPost.thumbnail"
                    class="aspect-video w-full rounded-lg overflow-hidden bg-elevated border border-default">
                    <img :src="selectedPost.thumbnail" class="w-full h-full object-cover" />
                </div>
                <div v-else class="aspect-video w-full rounded-lg bg-elevated border border-default flex items-center justify-center">
                    <UIcon :name="typeIcons[selectedPost.type]" :class="`text-${typeColors[selectedPost.type]}-500 text-6xl`" />
                </div>

                <div>
                    <h1 class="text-2xl font-bold text-highlighted mb-1">{{ selectedPost.title }}</h1>
                    <p class="text-primary font-medium flex items-center gap-2 mb-4">
                        <UIcon name="i-lucide-building-2" class="size-4" />
                        By {{ selectedPost.providerName }}
                    </p>
                    
                    <div class="flex items-center gap-2 mb-4">
                        <UBadge :color="typeColors[selectedPost.type]" variant="subtle" class="capitalize">
                            <UIcon :name="typeIcons[selectedPost.type]" class="mr-1 size-3.5" />
                            {{ typeLabels[selectedPost.type] }}
                        </UBadge>
                        <span class="text-sm text-muted flex items-center gap-1 ml-2">
                            <UIcon name="i-lucide-calendar" class="size-4" />
                            {{ selectedPost.publishedDate }}
                        </span>
                    </div>
                    <p class="text-muted leading-relaxed">
                        {{ selectedPost.description }}
                    </p>
                </div>

                <div class="grid grid-cols-3 gap-3">
                    <div class="flex flex-col items-center justify-center p-3 rounded-lg bg-elevated border border-default">
                        <UIcon name="i-lucide-eye" class="size-5 text-muted mb-1" />
                        <span class="text-lg font-bold text-highlighted">{{ selectedPost.views.toLocaleString() }}</span>
                        <span class="text-xs text-muted uppercase tracking-wider">Views</span>
                    </div>
                    <div class="flex flex-col items-center justify-center p-3 rounded-lg bg-elevated border border-default">
                        <UIcon name="i-lucide-heart" class="size-5 text-pink-500 mb-1" />
                        <span class="text-lg font-bold text-highlighted">{{ selectedPost.likes.toLocaleString() }}</span>
                        <span class="text-xs text-muted uppercase tracking-wider">Likes</span>
                    </div>
                    <div class="flex flex-col items-center justify-center p-3 rounded-lg bg-elevated border border-default">
                        <UIcon name="i-lucide-message-square" class="size-5 text-muted mb-1" />
                        <span class="text-lg font-bold text-highlighted">{{ selectedPost.comments.toLocaleString() }}</span>
                        <span class="text-xs text-muted uppercase tracking-wider">Comments</span>
                    </div>
                </div>

                <div v-if="selectedPost.url" class="p-4 bg-primary-500/10 rounded-lg border border-primary-500/20 text-center">
                    <p class="text-sm font-medium mb-3">View the full content</p>
                    <UButton color="primary" icon="i-lucide-external-link" label="Open Media" :to="selectedPost.url" target="_blank" />
                </div>

                <div v-if="selectedPost.tags.length > 0" class="space-y-2">
                    <div class="text-sm font-semibold text-highlighted">Tags</div>
                    <div class="flex flex-wrap gap-2">
                        <UBadge v-for="tag in selectedPost.tags" :key="tag" color="neutral" variant="subtle">
                            #{{ tag }}
                        </UBadge>
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
