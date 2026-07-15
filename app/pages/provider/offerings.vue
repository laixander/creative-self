<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import * as z from 'zod'
import type { TableColumn, FormSubmitEvent } from '@nuxt/ui'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const toast = useToast()

// ============================================================================
// Types
// ============================================================================
interface CourseRow {
    id: number
    title: string
    description?: string
    image?: string
    category: 'fitness' | 'meditation' | 'nutrition' | 'stress-management'
    type: 'online' | 'hybrid' | 'in-person'
    duration: string
    price: number
    maxParticipants: number
    status: 'published' | 'draft' | 'archived'
}

// ============================================================================
// Table data
// ============================================================================
import { useProviderStore } from '~/stores/providerStore'
const providerStore = useProviderStore()
let nextId = 20

const data = computed({
    get: () => providerStore.offerings as CourseRow[],
    set: (val) => { providerStore.offerings = val as any }
})

const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

const typeColors: Record<CourseRow['type'], any> = {
    online: 'teal',
    hybrid: 'purple',
    'in-person': 'pink'
}

const categoryLabels: Record<CourseRow['category'], string> = {
    fitness: 'Fitness',
    meditation: 'Meditation',
    nutrition: 'Nutrition',
    'stress-management': 'Stress Management'
}

const statusColors: Record<CourseRow['status'], any> = {
    published: 'success',
    draft: 'neutral',
    archived: 'warning'
}

import type { DropdownMenuItem } from '@nuxt/ui'
const getDropdownItems = (course: CourseRow): DropdownMenuItem[] => [
    { label: 'Edit', icon: 'i-lucide-pencil', onSelect: () => handleEdit(course) },
    ...(course.status === 'draft' ? [{
        label: 'Publish',
        icon: 'i-lucide-upload',
        color: 'success' as const,
        onSelect: () => handlePublish(course)
    }] : []),
    ...(course.status === 'published' ? [{
        label: 'Archive',
        icon: 'i-lucide-archive',
        color: 'warning' as const,
        onSelect: () => handleArchive(course)
    }] : []),
    { label: 'Delete', icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => handleDelete(course) }
]

const columns: TableColumn<CourseRow>[] = [
    {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => h('div', { class: 'flex items-center gap-3' }, [
            row.original.image
                ? h('img', {
                    src: row.original.image,
                    alt: row.original.title,
                    class: 'h-10 w-14 rounded object-cover shrink-0'
                })
                : h('div', { class: 'h-10 w-14 rounded bg-elevated flex items-center justify-center shrink-0' },
                    h('span', { class: 'i-lucide-image text-muted text-base' })
                ),
            h('div', { class: 'font-medium text-highlighted truncate' }, row.original.title)
        ])
    },
    {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => h('div', categoryLabels[row.original.category])
    },
    {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => h(UBadge, {
            label: row.original.type,
            color: typeColors[row.original.type],
            variant: 'subtle',
            size: 'sm',
            class: 'capitalize'
        })
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => h('div', { class: 'font-mono' }, formatter.format(row.original.price))
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

function handlePublish(course: CourseRow) {
    course.status = 'published'
    toast.add({ title: 'Offering published', description: `"${course.title}" is now live.`, color: 'success' })
}

function handleArchive(course: CourseRow) {
    course.status = 'archived'
    toast.add({ title: 'Offering archived', color: 'warning' })
}

function handleDelete(course: CourseRow) {
    data.value = data.value?.filter(c => c.id !== course.id) ?? []
    toast.add({ title: 'Offering deleted', color: 'error' })
}

// ============================================================================
// Slideover / Detail
// ============================================================================
const isSlideoverOpen = ref(false)
const selectedCourse = ref<CourseRow | null>(null)

function openSlideover(course: CourseRow) {
    selectedCourse.value = course
    isSlideoverOpen.value = true
}

// ============================================================================
// Modal / Form config
// ============================================================================
const open = ref(false)
const editingId = ref<number | null>(null)

const schema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    image: z.string().optional(),
    category: z.enum(['fitness', 'meditation', 'nutrition', 'stress-management']),
    type: z.enum(['online', 'hybrid', 'in-person']),
    duration: z.string().min(1, 'Duration is required'),
    price: z.number().min(0, 'Price must be positive'),
    maxParticipants: z.number().min(1, 'Must allow at least 1 participant'),
    status: z.enum(['draft', 'published', 'archived'])
})

type Schema = z.output<typeof schema>

const categoryOptions = [
    { label: 'Fitness', value: 'fitness' },
    { label: 'Meditation', value: 'meditation' },
    { label: 'Nutrition', value: 'nutrition' },
    { label: 'Stress Management', value: 'stress-management' }
]
const typeOptions = [
    { label: 'Online', value: 'online' },
    { label: 'Hybrid', value: 'hybrid' },
    { label: 'In-person', value: 'in-person' }
]
const statusOptions = [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived' }
]

const formRef = useTemplateRef('formRef')
const isSaving = ref(false)

const defaultState = (): Schema => ({
    title: '',
    description: '',
    image: '',
    category: 'fitness',
    type: 'online',
    duration: '60 min',
    price: 500,
    maxParticipants: 30,
    status: 'draft'
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
        state.image = result
        imagePreview.value = result
    }
    reader.readAsDataURL(file)
}

function removeImage() {
    state.image = ''
    imagePreview.value = null
    uploadedFile.value = null
}

const state = reactive<Schema>(defaultState())

function resetForm() {
    Object.assign(state, defaultState())
    imagePreview.value = null
    isSaving.value = false
}

function openCreateModal() {
    editingId.value = null
    resetForm()
    open.value = true
}

function handleEdit(course: CourseRow) {
    editingId.value = course.id
    Object.assign(state, {
        title: course.title,
        description: course.description ?? '',
        image: course.image ?? '',
        category: course.category,
        type: course.type,
        duration: course.duration,
        price: course.price,
        maxParticipants: course.maxParticipants,
        status: course.status
    })
    imagePreview.value = course.image ?? null
    open.value = true
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
    if (isSaving.value) return
    isSaving.value = true

    try {
        if (editingId.value !== null) {
            // Update existing course
            const index = data.value?.findIndex(c => c.id === editingId.value) ?? -1
            if (index !== -1 && data.value) {
                const item = data.value[index]
                if (item) {
                    data.value[index] = { ...item, ...event.data, id: item.id }
                }
            }
            toast.add({ title: 'Offering updated', description: `"${event.data.title}" was saved.`, color: 'success' })
        } else {
            // Create new course
            data.value?.unshift({ id: nextId++, ...event.data })
            toast.add({ title: 'Offering created', description: `"${event.data.title}" was added.`, color: 'success' })
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



const viewMode = ref<'table' | 'cards'>('cards')

const table = useTemplateRef('table')

const columnVisibility = ref({
    id: false
})

const globalFilter = ref('')

const filter = ref({
    category: categoryOptions.map(c => c.value),
    type: typeOptions.map(c => c.value),
    status: statusOptions.map(c => c.value)
})

function clearFilters() {
    filter.value.category = categoryOptions.map(c => c.value)
    filter.value.type = typeOptions.map(c => c.value)
    filter.value.status = statusOptions.map(c => c.value)
}

const filteredData = computed(() => {
    let result = data.value ?? []

    // Apply category/type/status filters
    result = result.filter(course =>
        filter.value.category.includes(course.category) &&
        filter.value.type.includes(course.type) &&
        filter.value.status.includes(course.status)
    )

    // Apply search filter
    if (globalFilter.value) {
        const q = globalFilter.value.toLowerCase()
        result = result.filter(course =>
            course.title.toLowerCase().includes(q) ||
            course.description?.toLowerCase().includes(q)
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

const activeFilterCount = computed(() => {
    let count = 0
    if (filter.value.category.length < categoryOptions.length) count++
    if (filter.value.type.length < typeOptions.length) count++
    if (filter.value.status.length < statusOptions.length) count++
    return count
})
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
                    <UFormField label="Filter by Category:" size="sm">
                        <USelectMenu v-model="filter.category" :items="categoryOptions" multiple placeholder="Category"
                            :search-input="false" class="w-full" value-key="value" />
                    </UFormField>
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
        <UButton icon="i-lucide-plus" label="New Offering" @click="openCreateModal" />
    </Teleport>

    <UTable v-if="viewMode === 'table'" sticky :data="pagedData" :columns="columns" ref="table"
        v-model:column-visibility="columnVisibility" class="flex-1">
        <template #empty>
            <UEmpty variant="naked" icon="i-lucide-box" title="No offerings found" description="Get started by creating your first offering." />
        </template>
    </UTable>

    <div v-if="viewMode === 'table' && filteredData.length > pageSize"
        class="flex justify-center py-4 border-t border-default">
        <UPagination v-model:page="page" :total="filteredData.length" :items-per-page="pageSize" variant="subtle" />
    </div>
    <template v-else-if="viewMode === 'cards'">
        <div class="flex-1 flex flex-col overflow-y-auto scrollbar" :class="[data.length === 0 ? 'justify-center' : '']">
            <template v-if="data.length === 0">
                <UEmpty variant="naked" icon="i-lucide-box" title="No offerings found" description="Get started by creating your first offering." />
            </template>
            <template v-else>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6">
                    <UCard v-for="course in pagedData" :key="course.id" variant="subtle"
                        :ui="{ root: 'flex flex-col justify-start', header: 'p-0 sm:p-0', body: 'flex-1' }"
                        class="shadow-sm cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md hover:border-primary-500/50 overflow-hidden"
                        @click="openSlideover(course)">
                        <!-- Cover image -->
                        <template v-if="course.image" #header>
                            <div class="relative h-36 overflow-hidden">
                                <NuxtImg :src="course.image" :alt="course.title" class="w-full h-full object-cover" />
                            </div>
                        </template>
                        <div>
                            <div class="flex items-center gap-2">
                                <UBadge variant="subtle" :color="statusColors[course.status]" size="sm" class="capitalize">
                                    {{ course.status }}
                                </UBadge>
                                <div class="font-semibold text-highlighted text-sm w-full truncate">
                                    {{ course.title }}
                                </div>
                            </div>
                            <div class="mt-2 text-muted text-xs line-clamp-3">
                                {{ course.description }}
                            </div>
                        </div>
                    </UCard>
                </div>
            </template>
        </div>
        <div v-if="filteredData.length > pageSize" class="mt-auto flex justify-center py-4 border-t border-default">
            <UPagination v-model:page="page" :total="filteredData.length" :items-per-page="pageSize" variant="subtle" />
        </div>
    </template>

    <UModal v-model:open="open" :title="editingId !== null ? 'Edit offering' : 'New offering'">
        <template #body>
            <UForm ref="formRef" :schema="schema" :state="state" class="space-y-3" @submit="onSubmit">
                <!-- Photo upload -->
                <UFormField label="Photo" name="image">
                    <UFileUpload accept="image/*" class="w-full" :model-value="uploadedFile"
                        :ui="{ base: imagePreview ? 'hidden' : 'min-h-28' }" @update:model-value="handleImageUpload">
                        <template #default="{ open }">
                            <!-- Preview -->
                            <div v-if="imagePreview"
                                class="relative rounded-lg overflow-hidden border border-default h-40 w-full">
                                <img :src="imagePreview" alt="Offering photo" class="w-full h-full object-cover" />
                                <UButton square icon="i-lucide-x" variant="soft" size="sm" color="neutral"
                                    class="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                                    @click.stop="removeImage" />
                            </div>

                            <!-- Drop zone / upload trigger -->
                            <div v-else
                                class="flex flex-col items-center justify-center gap-2 w-full h-28 rounded-lg border border-dashed border-default cursor-pointer hover:bg-elevated/50 transition-colors"
                                @click="open()">
                                <UIcon name="i-lucide-image-plus" class="w-7 h-7 text-muted" />
                                <span class="text-xs text-muted">Click to upload a cover photo</span>
                                <span class="text-xs text-dimmed">PNG, JPG, WEBP up to 5 MB</span>
                            </div>
                        </template>
                    </UFileUpload>
                </UFormField>

                <UFormField label="Title" name="title" required>
                    <UInput v-model="state.title" variant="subtle" class="w-full" />
                </UFormField>

                <UFormField label="Description" name="description">
                    <UTextarea v-model="state.description" variant="subtle" class="w-full" :rows="3" />
                </UFormField>

                <div class="grid grid-cols-2 gap-3">
                    <UFormField label="Category" name="category" required>
                        <USelect v-model="state.category" :items="categoryOptions" variant="subtle" class="w-full" />
                    </UFormField>

                    <UFormField label="Service type" name="type" required>
                        <USelect v-model="state.type" :items="typeOptions" variant="subtle" class="w-full" />
                    </UFormField>
                </div>

                <div class="grid grid-cols-3 gap-3">
                    <UFormField label="Duration" name="duration" required>
                        <UInput v-model="state.duration" variant="subtle" class="w-full" />
                    </UFormField>

                    <UFormField label="Price ($)" name="price" required>
                        <UInputNumber v-model="state.price" variant="subtle" class="w-full" />
                    </UFormField>

                    <UFormField label="Max participants" name="maxParticipants" required>
                        <UInputNumber v-model="state.maxParticipants" variant="subtle" class="w-full" />
                    </UFormField>
                </div>

                <UFormField label="Status" name="status" required>
                    <USelect v-model="state.status" :items="statusOptions" variant="subtle" class="w-full" />
                </UFormField>
            </UForm>
        </template>

        <template #footer>
            <div class="flex justify-end gap-2 w-full">
                <UButton variant="outline" color="neutral" :disabled="isSaving" @click="open = false">
                    Cancel
                </UButton>
                <UButton color="primary" :loading="isSaving" @click="formRef?.submit()">
                    Save
                </UButton>
            </div>
        </template>
    </UModal>

    <!-- Slideover -->
    <USlideover v-model:open="isSlideoverOpen" title="Offering Details">
        <template #body>
            <div v-if="selectedCourse" class="space-y-6">
                <div v-if="selectedCourse.image" class="aspect-video w-full rounded-lg overflow-hidden bg-elevated border border-default">
                    <img :src="selectedCourse.image" class="w-full h-full object-cover" />
                </div>
                <div v-else class="aspect-video w-full rounded-lg bg-elevated border border-default flex items-center justify-center">
                    <UIcon name="i-lucide-image" class="text-muted text-4xl" />
                </div>

                <div>
                    <h1 class="text-2xl font-bold text-highlighted mb-2">{{ selectedCourse.title }}</h1>
                    <div class="flex items-center gap-2 mb-4">
                        <UBadge :color="typeColors[selectedCourse.type]" variant="subtle" class="capitalize">
                            {{ selectedCourse.type }}
                        </UBadge>
                        <UBadge :color="statusColors[selectedCourse.status]" variant="subtle" class="capitalize">
                            {{ selectedCourse.status }}
                        </UBadge>
                        <span class="text-sm text-muted ml-2">
                            {{ categoryLabels[selectedCourse.category] }}
                        </span>
                    </div>
                    <p class="text-muted leading-relaxed">
                        {{ selectedCourse.description }}
                    </p>
                </div>

                <div class="grid grid-cols-3 gap-3">
                    <div class="flex flex-col items-center justify-center p-3 rounded-lg bg-elevated border border-default">
                        <UIcon name="i-lucide-circle-dollar-sign" class="size-5 text-success mb-1" />
                        <span class="text-lg font-bold text-highlighted">${{ selectedCourse.price }}</span>
                        <span class="text-xs text-muted uppercase tracking-wider">Price</span>
                    </div>
                    <div class="flex flex-col items-center justify-center p-3 rounded-lg bg-elevated border border-default">
                        <UIcon name="i-lucide-clock" class="size-5 text-muted mb-1" />
                        <span class="text-lg font-bold text-highlighted">{{ selectedCourse.duration }}</span>
                        <span class="text-xs text-muted uppercase tracking-wider">Duration</span>
                    </div>
                    <div class="flex flex-col items-center justify-center p-3 rounded-lg bg-elevated border border-default">
                        <UIcon name="i-lucide-users" class="size-5 text-muted mb-1" />
                        <span class="text-lg font-bold text-highlighted">{{ selectedCourse.maxParticipants }}</span>
                        <span class="text-xs text-muted uppercase tracking-wider">Capacity</span>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2 w-full">
                <UButton color="neutral" variant="outline" label="Close" @click="isSlideoverOpen = false" />
                <UButton color="primary" icon="i-lucide-pencil" label="Edit Offering" @click="() => { isSlideoverOpen = false; handleEdit(selectedCourse!) }" />
            </div>
        </template>
    </USlideover>
</template>