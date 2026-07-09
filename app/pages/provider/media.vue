<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import * as z from 'zod'
import type { TableColumn, DropdownMenuItem, FormSubmitEvent } from '@nuxt/ui'

const UIcon = resolveComponent('UIcon')
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const toast = useToast()

// ============================================================================
// Types
// ============================================================================
interface MediaPost {
    id: number
    title: string
    type: 'video' | 'podcast' | 'article'
    description: string
    thumbnail?: string
    url?: string
    publishedDate: string
    views: number
    likes: number
    comments: number
    duration?: string   // for video/podcast
    readTime?: string   // for article
    status: 'published' | 'draft' | 'archived'
    tags: string[]
}

// ============================================================================
// Data
// ============================================================================
let nextId = 20
const media = ref<MediaPost[]>([
    {
        id: 1,
        title: 'How to Build a Consistent Morning Wellness Routine',
        type: 'video',
        description: 'A step-by-step guide to creating a powerful morning routine that includes movement, mindfulness, and nutrition habits.',
        publishedDate: '2026-07-01',
        views: 4820,
        likes: 312,
        comments: 47,
        duration: '14:32',
        status: 'published',
        tags: ['wellness', 'morning', 'habits']
    },
    {
        id: 2,
        title: 'The Science of Stress: Understanding Your Body\'s Response',
        type: 'podcast',
        description: 'In this episode, we deep-dive into how chronic stress affects your hormones, immune system, and long-term health — and what you can do about it.',
        publishedDate: '2026-06-24',
        views: 2910,
        likes: 189,
        comments: 31,
        duration: '42:17',
        status: 'published',
        tags: ['stress', 'science', 'health']
    },
    {
        id: 3,
        title: '5 Nutrition Myths Debunked by a Registered Dietitian',
        type: 'article',
        description: 'We bust the most common nutrition myths that are holding people back from their health goals, backed by the latest research.',
        publishedDate: '2026-06-18',
        views: 7340,
        likes: 504,
        comments: 93,
        readTime: '6 min',
        status: 'published',
        tags: ['nutrition', 'myths', 'diet']
    },
    {
        id: 4,
        title: 'Corporate Wellness 101: How to Get Leadership Buy-In',
        type: 'article',
        description: 'A practical guide for HR managers and wellness champions on building the business case for a workplace wellness program.',
        publishedDate: '2026-06-10',
        views: 3210,
        likes: 228,
        comments: 42,
        readTime: '8 min',
        status: 'published',
        tags: ['corporate', 'leadership', 'wellness']
    },
    {
        id: 5,
        title: 'Breathwork for Anxiety Relief — Live Demo',
        type: 'video',
        description: 'Join me for a live 10-minute guided breathwork session designed to calm the nervous system and reduce acute anxiety.',
        publishedDate: '2026-07-05',
        views: 9100,
        likes: 840,
        comments: 118,
        duration: '10:05',
        status: 'published',
        tags: ['breathwork', 'anxiety', 'live']
    },
    {
        id: 6,
        title: 'EP. 12 — Gut Health with Dr. Maya Torres',
        type: 'podcast',
        description: 'Functional medicine expert Dr. Torres shares how gut microbiome health connects to mental clarity, mood, and energy.',
        publishedDate: '2026-07-08',
        views: 1540,
        likes: 102,
        comments: 18,
        duration: '58:43',
        status: 'published',
        tags: ['gut-health', 'microbiome', 'interview']
    },
    {
        id: 7,
        title: 'Sleep Optimization: The 4 Pillars of Deep Rest',
        type: 'article',
        description: 'Discover the four key factors that determine sleep quality and evidence-based strategies to optimize each one.',
        publishedDate: '2026-05-30',
        views: 5870,
        likes: 413,
        comments: 67,
        readTime: '10 min',
        status: 'published',
        tags: ['sleep', 'recovery', 'optimization']
    },
    {
        id: 8,
        title: 'Mindfulness at Work: A Corporate Training Preview',
        type: 'video',
        description: 'An exclusive sneak peek into our corporate mindfulness workshop — techniques your team can use immediately in the office.',
        publishedDate: '2026-07-10',
        views: 620,
        likes: 57,
        comments: 9,
        duration: '8:15',
        status: 'draft',
        tags: ['mindfulness', 'corporate', 'preview']
    },
    {
        id: 9,
        title: 'EP. 13 — Building Resilience Through Physical Training',
        type: 'podcast',
        description: 'Sports psychologist and strength coach discusses how physical challenges build mental toughness and emotional regulation.',
        publishedDate: '2026-07-15',
        views: 0,
        likes: 0,
        comments: 0,
        duration: '51:20',
        status: 'draft',
        tags: ['resilience', 'fitness', 'mental-health']
    },
    {
        id: 10,
        title: 'Plant-Based Meal Prep for Busy Professionals',
        type: 'article',
        description: 'Quick, delicious, and nutrient-dense plant-based meal prep ideas that take less than 30 minutes on a Sunday.',
        publishedDate: '2026-05-12',
        views: 11200,
        likes: 920,
        comments: 145,
        readTime: '7 min',
        status: 'archived',
        tags: ['plant-based', 'meal-prep', 'nutrition']
    }
])

// ============================================================================
// Lookups
// ============================================================================
const typeIcons: Record<MediaPost['type'], string> = {
    video: 'i-lucide-video',
    podcast: 'i-lucide-mic-2',
    article: 'i-lucide-file-text'
}

const typeColors: Record<MediaPost['type'], string> = {
    video: 'red',
    podcast: 'purple',
    article: 'sky'
}

const statusColors: Record<MediaPost['status'], string> = {
    published: 'success',
    draft: 'neutral',
    archived: 'warning'
}

const typeLabels: Record<MediaPost['type'], string> = {
    video: 'Video',
    podcast: 'Podcast',
    article: 'Article'
}

// ============================================================================
// Actions
// ============================================================================
function handlePublish(post: MediaPost) {
    post.status = 'published'
    toast.add({ title: 'Post published', description: `"${post.title}" is now live.`, color: 'success' })
}

function handleArchive(post: MediaPost) {
    post.status = 'archived'
    toast.add({ title: 'Post archived', color: 'warning' })
}

function handleDelete(post: MediaPost) {
    media.value = media.value.filter(p => p.id !== post.id)
    toast.add({ title: 'Post deleted', color: 'error' })
}

function handleEdit(post: MediaPost) {
    editingId.value = post.id
    Object.assign(state, {
        title: post.title,
        type: post.type,
        description: post.description,
        url: post.url ?? '',
        duration: post.duration ?? '',
        readTime: post.readTime ?? '',
        status: post.status,
        tags: post.tags.join(', ')
    })
    open.value = true
}

const getDropdownItems = (post: MediaPost): DropdownMenuItem[] => [
    { label: 'Edit', icon: 'i-lucide-pencil', onSelect: () => handleEdit(post) },
    ...(post.status === 'draft' ? [{
        label: 'Publish',
        icon: 'i-lucide-upload',
        color: 'success' as const,
        onSelect: () => handlePublish(post)
    }] : []),
    ...(post.status === 'published' ? [{
        label: 'Archive',
        icon: 'i-lucide-archive',
        color: 'warning' as const,
        onSelect: () => handleArchive(post)
    }] : []),
    { label: 'Delete', icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => handleDelete(post) }
]

// ============================================================================
// Table columns
// ============================================================================
const columns: TableColumn<MediaPost>[] = [
    {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => h('div', { class: 'flex items-center gap-3' }, [
            h('div', { class: `size-9 rounded-lg flex items-center justify-center shrink-0 bg-${typeColors[row.original.type]}-500/10` },
                h(UIcon, { name: typeIcons[row.original.type], class: `text-${typeColors[row.original.type]}-500 text-base` })
            ),
            h('div', { class: 'min-w-0' }, [
                h('div', { class: 'font-semibold text-highlighted truncate max-w-72' }, row.original.title),
                h('div', { class: 'text-xs text-muted truncate' }, row.original.tags.map(t => `#${t}`).join(' '))
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
        accessorKey: 'likes',
        header: 'Likes',
        cell: ({ row }) => h('div', { class: 'text-sm' }, row.original.likes.toLocaleString())
    },
    {
        accessorKey: 'comments',
        header: 'Comments',
        cell: ({ row }) => h('div', { class: 'text-sm' }, row.original.comments.toLocaleString())
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

const typeOptions = [
    { label: 'Video', value: 'video' },
    { label: 'Podcast', value: 'podcast' },
    { label: 'Article', value: 'article' }
]

const statusOptions = [
    { label: 'Published', value: 'published' },
    { label: 'Draft', value: 'draft' },
    { label: 'Archived', value: 'archived' }
]

const filter = ref({
    type: typeOptions.map(t => t.value),
    status: statusOptions.map(s => s.value)
})

function clearFilters() {
    filter.value.type = typeOptions.map(t => t.value)
    filter.value.status = statusOptions.map(s => s.value)
}

const filteredMedia = computed(() => {
    let result = media.value
    result = result.filter(p =>
        filter.value.type.includes(p.type) &&
        filter.value.status.includes(p.status)
    )
    if (globalFilter.value) {
        const q = globalFilter.value.toLowerCase()
        result = result.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
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
    if (filter.value.status.length < statusOptions.length) count++
    return count
})

// ============================================================================
// Modal / Form
// ============================================================================
const open = ref(false)
const editingId = ref<number | null>(null)

const schema = z.object({
    title: z.string().min(1, 'Title is required'),
    type: z.enum(['video', 'podcast', 'article']),
    description: z.string().min(1, 'Description is required'),
    url: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
    duration: z.string().optional(),
    readTime: z.string().optional(),
    status: z.enum(['draft', 'published', 'archived']),
    tags: z.string().optional()
})

type Schema = z.output<typeof schema>

const defaultState = (): Schema => ({
    title: '',
    type: 'article',
    description: '',
    url: '',
    duration: '',
    readTime: '',
    status: 'draft',
    tags: ''
})

const state = reactive<Schema>(defaultState())
const formRef = useTemplateRef('formRef')
const isSaving = ref(false)

function resetForm() {
    Object.assign(state, defaultState())
    isSaving.value = false
}

function openCreateModal() {
    editingId.value = null
    resetForm()
    open.value = true
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
    if (isSaving.value) return
    isSaving.value = true

    try {
        const tags = (event.data.tags ?? '').split(',').map(t => t.trim()).filter(Boolean)
        const now = new Date().toISOString().slice(0, 10)

        if (editingId.value !== null) {
            const index = media.value.findIndex(p => p.id === editingId.value)
            if (index !== -1) {
                const existing = media.value[index]!
                media.value[index] = {
                    ...existing,
                    title: event.data.title,
                    type: event.data.type,
                    description: event.data.description,
                    url: event.data.url || undefined,
                    duration: event.data.duration || undefined,
                    readTime: event.data.readTime || undefined,
                    status: event.data.status,
                    tags
                }
            }
            toast.add({ title: 'Post updated', description: `"${event.data.title}" was saved.`, color: 'success' })
        } else {
            media.value.unshift({
                id: nextId++,
                title: event.data.title,
                type: event.data.type,
                description: event.data.description,
                url: event.data.url || undefined,
                duration: event.data.duration || undefined,
                readTime: event.data.readTime || undefined,
                status: event.data.status,
                publishedDate: now,
                views: 0,
                likes: 0,
                comments: 0,
                tags
            })
            toast.add({ title: 'Media post created', description: `"${event.data.title}" was added.`, color: 'success' })
        }

        open.value = false
        resetForm()
    } finally {
        isSaving.value = false
    }
}

// ============================================================================
// Page meta
// ============================================================================
definePageMeta({
    title: 'Media',
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
                <div class="flex flex-col gap-2 p-3 w-56">
                    <UFormField label="Filter by Type:" size="sm">
                        <USelectMenu v-model="filter.type" :items="typeOptions" multiple placeholder="Type"
                            :search-input="false" class="w-full" value-key="value" />
                    </UFormField>
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
        <UButton icon="i-lucide-plus" label="New Media Post" @click="openCreateModal" />
    </Teleport>

    <!-- Table View -->
    <UTable v-if="viewMode === 'table'" sticky :data="pagedMedia" :columns="columns" ref="table" class="flex-1">
        <template #empty-state-content>
            <div class="flex flex-col items-center justify-center py-10 text-center">
                <div
                    class="flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary ring-4 ring-primary/20 mb-3">
                    <UIcon name="i-lucide-clapperboard" class="size-8" />
                </div>
                <h3 class="text-lg font-semibold text-default">No media posts yet</h3>
                <p class="text-sm text-muted mt-1">Create your first video, podcast, or article to get started.</p>
            </div>
        </template>
    </UTable>

    <div v-if="viewMode === 'table' && filteredMedia.length > pageSize"
        class="flex justify-center py-4 border-t border-default">
        <UPagination v-model:page="page" :total="filteredMedia.length" :items-per-page="pageSize" variant="subtle" />
    </div>

    <!-- Cards View -->
    <template v-else-if="viewMode === 'cards'">
        <div class="flex-1 flex flex-col overflow-y-auto scrollbar">
            <div v-if="pagedMedia.length === 0" class="flex flex-col items-center justify-center flex-1 py-20">
                <div
                    class="flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary ring-4 ring-primary/20 mb-3">
                    <UIcon name="i-lucide-clapperboard" class="size-8" />
                </div>
                <h3 class="text-lg font-semibold text-default">No media posts found</h3>
                <p class="text-sm text-muted mt-1">Try adjusting your search or filters.</p>
                <UButton icon="i-lucide-plus" label="New Media Post" class="mt-4" @click="openCreateModal" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6">
                <UCard v-for="post in pagedMedia" :key="post.id" variant="subtle"
                    :ui="{ root: 'flex flex-col', body: 'flex-1 flex flex-col gap-3' }" class="shadow-sm">

                    <!-- Header: type icon + title + actions -->
                    <template #header>
                        <div class="flex items-center justify-between gap-3">
                            <div class="flex items-center gap-3 min-w-0">
                                <div
                                    :class="`size-10 rounded-lg bg-${typeColors[post.type]}-500/10 flex items-center justify-center shrink-0`">
                                    <UIcon :name="typeIcons[post.type]"
                                        :class="`text-${typeColors[post.type]}-500 text-lg`" />
                                </div>
                                <div class="min-w-0">
                                    <div class="font-semibold text-highlighted text-sm leading-snug line-clamp-2">
                                        {{ post.title }}
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center gap-1 shrink-0">
                                <UBadge :color="statusColors[post.status]" variant="subtle" size="sm"
                                    class="capitalize">
                                    {{ post.status }}
                                </UBadge>
                                <AppDropdownMenu :items="getDropdownItems(post)" size="sm"
                                    trigger-icon="i-lucide-more-vertical" trigger-variant="ghost"
                                    trigger-color="neutral" trigger-size="sm"
                                    :content="{ align: 'end', side: 'bottom', sideOffset: 4 }" />
                            </div>
                        </div>
                    </template>

                    <!-- Description -->
                    <p class="text-xs text-muted line-clamp-3 leading-relaxed flex-1">
                        {{ post.description }}
                    </p>

                    <!-- Meta info: duration / read time + date -->
                    <div class="flex items-center justify-between text-xs text-muted">
                        <div class="flex items-center gap-1.5">
                            <template v-if="post.type !== 'article' && post.duration">
                                <UIcon name="i-lucide-clock" class="size-3.5" />
                                <span>{{ post.duration }}</span>
                            </template>
                            <template v-else-if="post.readTime">
                                <UIcon name="i-lucide-book-open" class="size-3.5" />
                                <span>{{ post.readTime }} read</span>
                            </template>
                        </div>
                        <div class="flex items-center gap-1">
                            <UIcon name="i-lucide-calendar" class="size-3.5" />
                            <span>{{ post.publishedDate }}</span>
                        </div>
                    </div>

                    <!-- Engagement stats -->
                    <div class="grid grid-cols-3 gap-2">
                        <div class="flex flex-col items-center gap-0.5 rounded-lg bg-elevated px-2 py-2">
                            <span class="text-base font-bold text-highlighted">{{ post.views.toLocaleString() }}</span>
                            <span class="text-[10px] text-muted uppercase tracking-wider font-medium">Views</span>
                        </div>
                        <div class="flex flex-col items-center gap-0.5 rounded-lg bg-elevated px-2 py-2">
                            <span class="text-base font-bold text-highlighted">{{ post.likes.toLocaleString() }}</span>
                            <span class="text-[10px] text-muted uppercase tracking-wider font-medium">Likes</span>
                        </div>
                        <div class="flex flex-col items-center gap-0.5 rounded-lg bg-elevated px-2 py-2">
                            <span class="text-base font-bold text-highlighted">{{ post.comments.toLocaleString()
                            }}</span>
                            <span class="text-[10px] text-muted uppercase tracking-wider font-medium">Comments</span>
                        </div>
                    </div>

                    <!-- Tags footer -->
                    <template #footer>
                        <div class="flex items-center gap-1.5 flex-wrap">
                            <UBadge v-for="tag in post.tags.slice(0, 3)" :key="tag" color="neutral" variant="subtle"
                                size="sm">
                                #{{ tag }}
                            </UBadge>
                        </div>
                    </template>
                </UCard>
            </div>
        </div>

        <div v-if="filteredMedia.length > pageSize" class="mt-auto flex justify-center py-4 border-t border-default">
            <UPagination v-model:page="page" :total="filteredMedia.length" :items-per-page="pageSize"
                variant="subtle" />
        </div>
    </template>

    <!-- New / Edit Modal -->
    <UModal v-model:open="open" :title="editingId !== null ? 'Edit media post' : 'New media post'">
        <template #body>
            <UForm ref="formRef" :schema="schema" :state="state" class="space-y-3" @submit="onSubmit">
                <div class="grid grid-cols-2 gap-3">
                    <UFormField label="Type" name="type" required>
                        <USelect v-model="state.type" :items="typeOptions" variant="subtle" class="w-full" />
                    </UFormField>
                    <UFormField label="Status" name="status" required>
                        <USelect v-model="state.status" :items="statusOptions" variant="subtle" class="w-full" />
                    </UFormField>
                </div>

                <UFormField label="Title" name="title" required>
                    <UInput v-model="state.title" variant="subtle" class="w-full"
                        placeholder="Enter a clear, descriptive title" />
                </UFormField>

                <UFormField label="Description" name="description" required>
                    <UTextarea v-model="state.description" variant="subtle" class="w-full" :rows="3"
                        placeholder="Briefly describe what this post is about" />
                </UFormField>

                <UFormField label="URL" name="url" hint="Optional">
                    <UInput v-model="state.url" variant="subtle" class="w-full" placeholder="https://youtube.com/..." />
                </UFormField>

                <div class="grid grid-cols-2 gap-3">
                    <UFormField v-if="state.type !== 'article'" label="Duration" name="duration" hint="e.g. 42:17">
                        <UInput v-model="state.duration" variant="subtle" class="w-full" placeholder="mm:ss" />
                    </UFormField>
                    <UFormField v-if="state.type === 'article'" label="Read Time" name="readTime" hint="e.g. 5 min">
                        <UInput v-model="state.readTime" variant="subtle" class="w-full" placeholder="5 min" />
                    </UFormField>
                    <UFormField label="Tags" name="tags" hint="Comma-separated">
                        <UInput v-model="state.tags" variant="subtle" class="w-full"
                            placeholder="wellness, mindfulness" />
                    </UFormField>
                </div>
            </UForm>
        </template>

        <template #footer>
            <div class="flex justify-end gap-2 w-full">
                <UButton variant="outline" color="neutral" :disabled="isSaving" @click="open = false">
                    Cancel
                </UButton>
                <UButton color="primary" :loading="isSaving" @click="formRef?.submit()">
                    {{ editingId !== null ? 'Save changes' : 'Create post' }}
                </UButton>
            </div>
        </template>
    </UModal>
</template>