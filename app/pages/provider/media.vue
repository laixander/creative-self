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
import { useProviderStore } from '~/stores/providerStore'
const providerStore = useProviderStore()
let nextId = 20

const media = computed({
    get: () => providerStore.media as MediaPost[],
    set: (val) => { providerStore.media = val as any }
})

// ============================================================================
// Lookups
// ============================================================================
const typeIcons: Record<MediaPost['type'], string> = {
    video: 'i-lucide-video',
    podcast: 'i-lucide-mic-2',
    article: 'i-lucide-file-text'
}

const typeColors: Record<MediaPost['type'], any> = {
    video: 'red',
    podcast: 'purple',
    article: 'sky'
}

const statusColors: Record<MediaPost['status'], any> = {
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
    media.value = media.value?.filter(p => p.id !== post.id) ?? []
    toast.add({ title: 'Post deleted', color: 'error' })
}

function handleEdit(post: MediaPost) {
    editingId.value = post.id
    Object.assign(state, {
        title: post.title,
        type: post.type,
        description: post.description,
        url: post.url ?? '',
        thumbnail: post.thumbnail ?? '',
        duration: post.duration ?? '',
        readTime: post.readTime ?? '',
        status: post.status,
        tags: post.tags.join(', ')
    })
    imagePreview.value = post.thumbnail ?? null
    uploadedFile.value = null
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
            row.original.thumbnail
                ? h('img', { src: row.original.thumbnail, class: 'w-12 h-8 rounded object-cover shrink-0' })
                : h('div', { class: `size-9 rounded-lg flex items-center justify-center shrink-0 bg-${typeColors[row.original.type]}-500/10` },
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
    let result = media.value ?? []
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
// Slideover / Detail
// ============================================================================
const isSlideoverOpen = ref(false)
const selectedPost = ref<MediaPost | null>(null)

function openSlideover(post: MediaPost) {
    selectedPost.value = post
    isSlideoverOpen.value = true
}

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
    thumbnail: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
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
    thumbnail: '',
    duration: '',
    readTime: '',
    status: 'draft',
    tags: ''
})

const imagePreview = ref<string | null>(null)
const uploadedFile = ref<File | null>(null)

function handleImageUpload(file: File | null | undefined) {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
        toast.add({ title: 'File too large', description: 'Please upload an image under 5 MB.', color: 'error' })
        return
    }
    uploadedFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
        const result = e.target?.result as string
        state.thumbnail = result
        imagePreview.value = result
    }
    reader.readAsDataURL(file)
}

function removeImage() {
    state.thumbnail = ''
    imagePreview.value = null
    uploadedFile.value = null
}

const state = reactive<Schema>(defaultState())
const formRef = useTemplateRef('formRef')
const isSaving = ref(false)

function resetForm() {
    Object.assign(state, defaultState())
    imagePreview.value = null
    uploadedFile.value = null
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
            const index = media.value?.findIndex(p => p.id === editingId.value) ?? -1
            if (index !== -1 && media.value) {
                const existing = media.value[index]!
                media.value[index] = {
                    ...existing,
                    title: event.data.title,
                    type: event.data.type,
                    description: event.data.description,
                    url: event.data.url || undefined,
                    thumbnail: event.data.thumbnail || undefined,
                    duration: event.data.duration || undefined,
                    readTime: event.data.readTime || undefined,
                    status: event.data.status,
                    tags
                }
            }
            toast.add({ title: 'Post updated', description: `"${event.data.title}" was saved.`, color: 'success' })
        } else {
            media.value?.unshift({
                id: nextId++,
                title: event.data.title,
                type: event.data.type,
                description: event.data.description,
                url: event.data.url || undefined,
                thumbnail: event.data.thumbnail || undefined,
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
        <USeparator orientation="vertical" class="h-7 mx-2" />
        <UButton icon="i-lucide-plus" label="New Media Post" @click="openCreateModal" />
    </Teleport>


    <!-- Table View -->
    <UTable v-if="viewMode === 'table'" sticky :data="pagedMedia" :columns="columns" ref="table" class="flex-1">
        <template #empty>
            <UEmpty variant="naked" icon="i-lucide-clapperboard" title="No media posts found"
                description="Create your first video, podcast, or article to get started." />
        </template>
    </UTable>

    <div v-if="viewMode === 'table' && filteredMedia.length > pageSize"
        class="flex justify-center py-4 border-t border-default">
        <UPagination v-model:page="page" :total="filteredMedia.length" :items-per-page="pageSize" variant="subtle" />
    </div>

    <!-- Cards View -->
    <template v-else-if="viewMode === 'cards'">
        <div class="flex-1 flex flex-col overflow-y-auto scrollbar"
            :class="[media.length === 0 ? 'justify-center' : '']">
            <template v-if="media.length === 0">
                <UEmpty variant="naked" icon="i-lucide-clapperboard" title="No media posts found"
                    description="Create your first video, podcast, or article to get started." />
            </template>
            <template v-else>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6">
                    <UCard v-for="post in pagedMedia" :key="post.id" variant="subtle"
                        :ui="{ root: 'flex flex-col justify-start', header: 'p-0 sm:p-0', body: 'flex-1' }"
                        class="shadow-sm cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md hover:border-primary-500/50 overflow-hidden"
                        @click="openSlideover(post)">
                        <!-- Cover image -->
                        <template #header>
                            <div v-if="post.thumbnail" class="relative h-36 overflow-hidden">
                                <img :src="post.thumbnail" :alt="post.title" class="w-full h-full object-cover" />
                            </div>
                            <div v-else
                                class="relative h-36 overflow-hidden bg-elevated flex items-center justify-center">
                                <UIcon :name="typeIcons[post.type]"
                                    :class="`text-${typeColors[post.type]}-500 text-4xl`" />
                            </div>
                        </template>
                        <div>
                            <div class="flex items-center gap-2">
                                <UBadge variant="subtle" :color="statusColors[post.status]" size="sm"
                                    class="capitalize shrink-0">
                                    {{ post.status }}
                                </UBadge>
                                <div class="font-semibold text-highlighted text-sm w-full truncate">
                                    {{ post.title }}
                                </div>
                            </div>
                            <div class="mt-2 text-muted text-xs line-clamp-3">
                                {{ post.description }}
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

                <div>
                    <h1 class="text-2xl font-bold text-highlighted mb-2">{{ selectedPost.title }}</h1>
                    <div class="flex items-center gap-2 mb-4">
                        <UBadge :color="typeColors[selectedPost.type]" variant="subtle" class="capitalize">
                            {{ typeLabels[selectedPost.type] }}
                        </UBadge>
                        <UBadge :color="statusColors[selectedPost.status]" variant="subtle" class="capitalize">
                            {{ selectedPost.status }}
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
                    <div
                        class="flex flex-col items-center justify-center p-3 rounded-lg bg-elevated border border-default">
                        <UIcon name="i-lucide-eye" class="size-5 text-muted mb-1" />
                        <span class="text-lg font-bold text-highlighted">{{ selectedPost.views.toLocaleString()
                            }}</span>
                        <span class="text-xs text-muted uppercase tracking-wider">Views</span>
                    </div>
                    <div
                        class="flex flex-col items-center justify-center p-3 rounded-lg bg-elevated border border-default">
                        <UIcon name="i-lucide-heart" class="size-5 text-muted mb-1" />
                        <span class="text-lg font-bold text-highlighted">{{ selectedPost.likes.toLocaleString()
                            }}</span>
                        <span class="text-xs text-muted uppercase tracking-wider">Likes</span>
                    </div>
                    <div
                        class="flex flex-col items-center justify-center p-3 rounded-lg bg-elevated border border-default">
                        <UIcon name="i-lucide-message-square" class="size-5 text-muted mb-1" />
                        <span class="text-lg font-bold text-highlighted">{{ selectedPost.comments.toLocaleString()
                            }}</span>
                        <span class="text-xs text-muted uppercase tracking-wider">Comments</span>
                    </div>
                </div>

                <div v-if="selectedPost.url" class="space-y-2">
                    <div class="text-sm font-semibold text-highlighted">URL</div>
                    <a :href="selectedPost.url" target="_blank"
                        class="text-primary-500 hover:underline text-sm break-all flex items-center gap-1">
                        <UIcon name="i-lucide-external-link" class="size-4 shrink-0" />
                        {{ selectedPost.url }}
                    </a>
                </div>

                <div class="space-y-2">
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
                <UButton color="primary" icon="i-lucide-pencil" label="Edit Media"
                    @click="() => { isSlideoverOpen = false; handleEdit(selectedPost!) }" />
            </div>
        </template>
    </USlideover>

    <!-- New / Edit Modal -->
    <UModal v-model:open="open" :title="editingId !== null ? 'Edit media' : 'New media'">
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
                    <UInput v-model="state.url" variant="subtle" class="w-full"
                        placeholder="https://youtube.com/..." />
                </UFormField>

                <UFormField label="Thumbnail" name="thumbnail">
                    <UFileUpload accept="image/*" class="w-full" :model-value="uploadedFile"
                        :ui="{ base: imagePreview ? 'hidden' : 'min-h-28' }" @update:model-value="handleImageUpload">
                        <template #default="{ open }">
                            <div v-if="imagePreview" class="relative rounded-lg overflow-hidden border border-default h-40 w-full">
                                <img :src="imagePreview" alt="Thumbnail" class="w-full h-full object-cover" />
                                <UButton square icon="i-lucide-x" variant="soft" size="sm" color="neutral"
                                    class="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                                    @click.stop="removeImage" />
                            </div>
                            <div v-else class="flex flex-col items-center justify-center gap-2 w-full h-28 rounded-lg border border-dashed border-default cursor-pointer hover:bg-elevated/50 transition-colors"
                                @click="open()">
                                <UIcon name="i-lucide-image-plus" class="w-7 h-7 text-muted" />
                                <span class="text-xs text-muted">Click to upload a thumbnail</span>
                                <span class="text-xs text-dimmed">PNG, JPG, WEBP up to 5 MB</span>
                            </div>
                        </template>
                    </UFileUpload>
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