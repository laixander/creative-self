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
let nextId = 20
const data = ref<CourseRow[]>([
    {
        id: 1,
        image: '/img/stockphoto_1.jpg',
        title: 'Nutrition for Busy Professionals',
        description: 'Learn quick, healthy meal prep strategies tailored for a hectic work schedule.',
        category: 'nutrition',
        type: 'online',
        duration: '45 min',
        price: 500,
        maxParticipants: 20,
        status: 'draft'
    },
    {
        id: 2,
        image: '/img/stockphoto_2.jpg',
        title: 'Mindful Mondays — 8 Week Program',
        description: 'Start your week with purpose through guided meditation and intention-setting practices.',
        category: 'meditation',
        type: 'online',
        duration: '60 min',
        price: 2400,
        maxParticipants: 30,
        status: 'published'
    },
    {
        id: 3,
        image: '/img/stockphoto_3.jpg',
        title: 'Stress Resilience Workshop',
        description: 'Develop actionable tools to manage workplace stress and build emotional resilience.',
        category: 'stress-management',
        type: 'hybrid',
        duration: '90 min',
        price: 1800,
        maxParticipants: 25,
        status: 'published'
    },
    {
        id: 4,
        image: '/img/stockphoto_4.jpg',
        title: 'HIIT Bootcamp',
        description: 'High-intensity interval training designed to maximize calorie burn and improve cardiovascular health.',
        category: 'fitness',
        type: 'in-person',
        duration: '60 min',
        price: 1500,
        maxParticipants: 15,
        status: 'published'
    },
    {
        id: 5,
        image: '/img/stockphoto_5.jpg',
        title: 'Morning Yoga Flow',
        description: 'An energizing vinyasa flow to awaken the body and center the mind before your day begins.',
        category: 'fitness',
        type: 'online',
        duration: '30 min',
        price: 300,
        maxParticipants: 50,
        status: 'published'
    },
    {
        id: 6,
        image: '/img/stockphoto_6.jpg',
        title: 'Plant-Based Cooking Basics',
        description: 'Master the fundamentals of delicious, nutrient-dense plant-based cooking in your own kitchen.',
        category: 'nutrition',
        type: 'hybrid',
        duration: '120 min',
        price: 2000,
        maxParticipants: 10,
        status: 'draft'
    },
    {
        id: 7,
        image: '/img/stockphoto_7.jpg',
        title: 'Sleep Hygiene Masterclass',
        description: 'Discover science-backed techniques to improve your sleep quality and wake up feeling refreshed.',
        category: 'stress-management',
        type: 'online',
        duration: '60 min',
        price: 800,
        maxParticipants: 100,
        status: 'published'
    },
    {
        id: 8,
        image: '/img/stockphoto_8.jpg',
        title: 'Guided Sound Bath',
        description: 'Immerse yourself in deeply relaxing frequencies and vibrations using crystal singing bowls.',
        category: 'meditation',
        type: 'in-person',
        duration: '75 min',
        price: 3500,
        maxParticipants: 12,
        status: 'archived'
    },
    {
        id: 9,
        image: '/img/stockphoto_9.jpg',
        title: 'Strength Training 101',
        description: 'Learn proper form and foundational movements for building lean muscle safely.',
        category: 'fitness',
        type: 'in-person',
        duration: '60 min',
        price: 1200,
        maxParticipants: 8,
        status: 'published'
    },
    {
        id: 10,
        image: '/img/stockphoto_10.jpg',
        title: 'Emotional Eating Support Group',
        description: 'A safe, guided space to explore the relationship between emotions and eating habits.',
        category: 'nutrition',
        type: 'online',
        duration: '90 min',
        price: 1000,
        maxParticipants: 15,
        status: 'published'
    },
    {
        id: 11,
        image: '/img/stockphoto_11.jpg',
        title: 'Corporate Mindfulness Seminar',
        description: 'Tailored mindfulness strategies to boost team focus, communication, and overall well-being.',
        category: 'meditation',
        type: 'hybrid',
        duration: '4 hours',
        price: 15000,
        maxParticipants: 200,
        status: 'published'
    },
    {
        id: 12,
        image: '/img/stockphoto_12.jpg',
        title: 'Anxiety Reduction Techniques',
        description: 'Practical grounding exercises and cognitive reframing tools to lower daily anxiety.',
        category: 'stress-management',
        type: 'online',
        duration: '60 min',
        price: 600,
        maxParticipants: 50,
        status: 'draft'
    },
    {
        id: 13,
        image: '/img/stockphoto_13.jpg',
        title: 'Advanced Pilates',
        description: 'A challenging core-focused workout utilizing advanced pilates techniques and equipment.',
        category: 'fitness',
        type: 'in-person',
        duration: '55 min',
        price: 2500,
        maxParticipants: 10,
        status: 'published'
    },
    {
        id: 14,
        image: '/img/stockphoto_14.jpg',
        title: 'Macro Tracking Deep Dive',
        description: 'Understand how to calculate, track, and adjust macronutrients for your specific goals.',
        category: 'nutrition',
        type: 'online',
        duration: '45 min',
        price: 400,
        maxParticipants: 40,
        status: 'archived'
    },
    {
        id: 15,
        image: '/img/stockphoto_15.jpg',
        title: 'Breathwork for Beginners',
        description: 'An introduction to conscious breathing techniques for immediate stress relief and clarity.',
        category: 'meditation',
        type: 'online',
        duration: '30 min',
        price: 200,
        maxParticipants: 100,
        status: 'published'
    },
    {
        id: 16,
        image: '/img/stockphoto_16.jpg',
        title: 'Time Management for Stress Relief',
        description: 'Learn how effective scheduling and prioritization can drastically reduce chronic stress.',
        category: 'stress-management',
        type: 'hybrid',
        duration: '90 min',
        price: 1200,
        maxParticipants: 30,
        status: 'draft'
    },
    {
        id: 17,
        image: '/img/stockphoto_17.jpg',
        title: 'Kettlebell Core Crush',
        description: 'A dynamic, full-body kettlebell circuit focused on building explosive core strength.',
        category: 'fitness',
        type: 'in-person',
        duration: '45 min',
        price: 1800,
        maxParticipants: 12,
        status: 'published'
    },
    {
        id: 18,
        image: '/img/stockphoto_18.jpg',
        title: 'Gut Health Fundamentals',
        description: 'Explore the microbiome and learn dietary changes to support optimal digestion and immunity.',
        category: 'nutrition',
        type: 'online',
        duration: '60 min',
        price: 800,
        maxParticipants: 60,
        status: 'published'
    },
    {
        id: 19,
        image: '/img/stockphoto_19.jpg',
        title: 'Silent Retreat Weekend',
        description: 'A fully immersive offline experience focused on deep meditation, silence, and self-reflection.',
        category: 'meditation',
        type: 'in-person',
        duration: '48 hours',
        price: 25000,
        maxParticipants: 20,
        status: 'draft'
    }
])

const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

const typeColors: Record<CourseRow['type'], string> = {
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

const statusColors: Record<CourseRow['status'], string> = {
    published: 'success',
    draft: 'neutral',
    archived: 'warning'
}

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
        cell: ({ row }) => {
            const items = [
                {
                    label: 'Edit',
                    icon: 'i-lucide-pencil',
                    onSelect: () => handleEdit(row.original)
                },
                row.original.status === 'draft' && {
                    label: 'Publish',
                    icon: 'i-lucide-upload',
                    color: 'success',
                    onSelect: () => handlePublish(row.original)
                },
                row.original.status === 'published' && {
                    label: 'Archive',
                    icon: 'i-lucide-archive',
                    color: 'warning',
                    onSelect: () => handleArchive(row.original)
                },
                {
                    label: 'Delete',
                    icon: 'i-lucide-trash-2',
                    color: 'error',
                    onSelect: () => handleDelete(row.original)
                }
            ].filter(Boolean)

            return h('div', { class: 'text-right' }, [
                h(UDropdownMenu, { items, content: { align: 'end' }, size: 'sm' }, {
                    default: () => h(UButton, {
                        icon: 'i-lucide-ellipsis-vertical',
                        color: 'neutral',
                        variant: 'ghost',
                        size: 'sm'
                    })
                })
            ])
        }
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
    data.value = data.value.filter(c => c.id !== course.id)
    toast.add({ title: 'Offering deleted', color: 'error' })
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
            const index = data.value.findIndex(c => c.id === editingId.value)
            if (index !== -1) {
                const item = data.value[index]
                if (item) {
                    data.value[index] = { ...item, ...event.data, id: item.id }
                }
            }
            toast.add({ title: 'Offering updated', description: `"${event.data.title}" was saved.`, color: 'success' })
        } else {
            // Create new course
            data.value.unshift({ id: nextId++, ...event.data })
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
    title: 'Offerings',
    isTable: true
})

// Common Logic
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
    let result = data.value

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
        v-model:column-visibility="columnVisibility" class="flex-1" />

    <div v-if="viewMode === 'table' && filteredData.length > pageSize"
        class="flex justify-center py-4 border-t border-default">
        <UPagination v-model:page="page" :total="filteredData.length" :items-per-page="pageSize" variant="subtle" />
    </div>
    <template v-else-if="viewMode === 'cards'">
        <div class="flex-1 flex flex-col overflow-y-auto scrollbar">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6">
                <UCard v-for="course in pagedData" :key="course.id" variant="subtle"
                    :ui="{ root: 'flex flex-col justify-start', header: 'p-0 sm:p-0', body: 'flex-1' }"
                    class="shadow-sm overflow-hidden">
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
                            <AppDropdownMenu :items="getDropdownItems(course)" size="sm"
                                trigger-icon="i-lucide-more-vertical" trigger-variant="ghost" trigger-color="neutral"
                                trigger-size="sm" :content="{ align: 'end', side: 'bottom', sideOffset: 4 }" />
                        </div>
                        <div class="mt-2 text-muted text-xs">
                            {{ course.description }}
                        </div>
                    </div>
                    <template #footer>
                        <div class="flex justify-between items-center">
                            <div class="flex items-center gap-2 truncate">
                                <UBadge variant="subtle" :color="typeColors[course.type]" size="sm"
                                    class="capitalize shrink-0">
                                    {{ course.type }}
                                </UBadge>
                                <div class="text-muted text-xs truncate">
                                    {{ categoryLabels[course.category] }}
                                </div>
                            </div>
                            <div class="text-sm text-highlighted font-semibold">
                                ${{ course.price }}
                            </div>
                        </div>
                    </template>
                </UCard>
            </div>
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
</template>