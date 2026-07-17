<script setup lang="ts">
import { useHrStore } from '~/stores/hrStore'
import type { HrOffering } from '~/types/hr/offering'
import type { HrBooking } from '~/types/hr/booking'

const hrStore = useHrStore()
const toast = useToast()

const data = computed(() => hrStore.offerings)

const typeColors: Record<HrOffering['type'], any> = {
    online: 'teal',
    hybrid: 'purple',
    'in-person': 'pink'
}

const categoryLabels: Record<HrOffering['category'], string> = {
    fitness: 'Fitness',
    meditation: 'Meditation',
    nutrition: 'Nutrition',
    'stress-management': 'Stress Management'
}

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

const globalFilter = ref('')
const filter = ref({
    category: categoryOptions.map(c => c.value),
    type: typeOptions.map(c => c.value)
})

function clearFilters() {
    filter.value.category = categoryOptions.map(c => c.value)
    filter.value.type = typeOptions.map(c => c.value)
    globalFilter.value = ''
}

const filteredData = computed(() => {
    let result = data.value.filter(o => o.status === 'published') // Only show published offerings

    result = result.filter(course =>
        filter.value.category.includes(course.category) &&
        filter.value.type.includes(course.type)
    )

    if (globalFilter.value) {
        const q = globalFilter.value.toLowerCase()
        result = result.filter(course =>
            course.title.toLowerCase().includes(q) ||
            (course.description?.toLowerCase().includes(q) ?? false) ||
            course.providerName.toLowerCase().includes(q)
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
    return count
})

// ============================================================================
// Page meta
// ============================================================================
definePageMeta({
    isTable: true
})

// ============================================================================
// Slideover / Detail
// ============================================================================
const isSlideoverOpen = ref(false)
const selectedOffering = ref<HrOffering | null>(null)

function openSlideover(offering: HrOffering) {
    selectedOffering.value = offering
    isSlideoverOpen.value = true
}

// ============================================================================
// Booking Modal
// ============================================================================
const isBookingModalOpen = ref(false)
const isSubmitting = ref(false)
const bookingForm = reactive({
    date: '',
    time: '09:00',
    participants: 10,
    location: ''
})

function openBookingModal() {
    isBookingModalOpen.value = true
    bookingForm.date = new Date().toISOString().split('T')[0] || ''
    bookingForm.time = '09:00'
    bookingForm.participants = selectedOffering.value?.maxParticipants ?? 10
    bookingForm.location = selectedOffering.value?.type === 'in-person' ? 'HQ Office' : 'Online'
}

function submitBooking() {
    if (!selectedOffering.value) return
    isSubmitting.value = true
    
    // Simulate API delay
    setTimeout(() => {
        const newBooking: HrBooking = {
            id: Date.now(),
            provider: selectedOffering.value!.providerName,
            offering: selectedOffering.value!.title,
            date: bookingForm.date,
            time: bookingForm.time,
            location: bookingForm.location,
            price: selectedOffering.value!.price,
            participants: bookingForm.participants,
            status: 'pending_confirmation'
        }
        
        hrStore.createBooking(newBooking)
        
        isSubmitting.value = false
        isBookingModalOpen.value = false
        isSlideoverOpen.value = false
        
        toast.add({
            title: 'Booking Requested',
            description: `Your request for ${selectedOffering.value!.title} has been sent to ${selectedOffering.value!.providerName}.`,
            color: 'success'
        })
    }, 500)
}
</script>

<template>
    <Teleport to="#header-actions">
        <AppGlobalFilter v-model="globalFilter" placeholder="Search offerings or providers..." />
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
                    <UButton block icon="i-lucide-refresh-ccw" color="neutral" variant="subtle" size="sm" label="Reset"
                        @click="clearFilters" />
                </div>
            </template>
        </UPopover>
    </Teleport>

    <div class="flex-1 flex flex-col overflow-y-auto scrollbar" :class="[filteredData.length === 0 ? 'justify-center' : '']">
        <template v-if="filteredData.length === 0">
            <UEmpty variant="naked" icon="i-lucide-box" title="No offerings found" description="Adjust your filters to see more offerings." />
        </template>
        <template v-else>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6">
                <UCard v-for="course in pagedData" :key="course.id" variant="subtle"
                    :ui="{ root: 'flex flex-col justify-start', header: 'p-0 sm:p-0', body: 'flex-1' }"
                    class="shadow-sm cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md hover:border-primary-500/50 overflow-hidden"
                    @click="openSlideover(course)">
                    <!-- Cover image -->
                    <template v-if="course.image" #header>
                        <div class="relative h-40 overflow-hidden">
                            <NuxtImg :src="course.image" :alt="course.title" class="w-full h-full object-cover" />
                        </div>
                    </template>
                    <div>
                        <div class="flex items-center gap-2 mb-2">
                            <UBadge variant="subtle" :color="typeColors[course.type]" size="sm" class="capitalize">
                                {{ course.type }}
                            </UBadge>
                            <UBadge variant="soft" color="neutral" size="sm" class="capitalize">
                                {{ course.providerName }}
                            </UBadge>
                        </div>
                        <div class="font-semibold text-highlighted text-sm w-full leading-tight mb-2">
                            {{ course.title }}
                        </div>
                        <div class="mt-2 text-muted text-xs line-clamp-3">
                            {{ course.description }}
                        </div>
                        <div class="mt-4 flex items-center justify-between text-sm">
                            <span class="font-bold text-highlighted">${{ course.price }}</span>
                            <span class="text-xs text-muted flex items-center gap-1">
                                <UIcon name="i-lucide-clock" class="size-4" /> {{ course.duration }}
                            </span>
                        </div>
                    </div>
                </UCard>
            </div>
        </template>
    </div>
    
    <div v-if="filteredData.length > pageSize" class="mt-auto flex justify-center py-4 border-t border-default">
        <UPagination v-model:page="page" :total="filteredData.length" :items-per-page="pageSize" variant="subtle" />
    </div>

    <!-- Slideover Detail -->
    <USlideover v-model:open="isSlideoverOpen" title="Offering Details">
        <template #body>
            <div v-if="selectedOffering" class="space-y-6">
                <div v-if="selectedOffering.image" class="aspect-video w-full rounded-lg overflow-hidden bg-elevated border border-default">
                    <img :src="selectedOffering.image" class="w-full h-full object-cover" />
                </div>
                <div v-else class="aspect-video w-full rounded-lg bg-elevated border border-default flex items-center justify-center">
                    <UIcon name="i-lucide-image" class="text-muted text-4xl" />
                </div>

                <div>
                    <div class="flex items-center gap-2 mb-4">
                        <UBadge :color="typeColors[selectedOffering.type]" variant="subtle" class="capitalize">
                            {{ selectedOffering.type }}
                        </UBadge>
                        <UBadge color="neutral" variant="soft" class="capitalize flex items-center gap-1.5">
                            <UIcon name="i-lucide-tag" />
                            {{ categoryLabels[selectedOffering.category] }}
                        </UBadge>
                    </div>
                    <h1 class="text-xl font-bold text-highlighted mb-1">{{ selectedOffering.title }}</h1>
                    <p class="text-sm text-primary font-medium mb-4">By {{ selectedOffering.providerName }}</p>
                    <p class="text-sm text-muted leading-relaxed">
                        {{ selectedOffering.description }}
                    </p>
                </div>

                <div class="grid grid-cols-3 gap-3">
                    <div class="flex flex-col items-center justify-center p-3 rounded-lg bg-elevated border border-default">
                        <UIcon name="i-lucide-circle-dollar-sign" class="size-5 text-success mb-1" />
                        <span class="text-lg font-bold text-highlighted">${{ selectedOffering.price }}</span>
                        <span class="text-[10px] text-muted uppercase tracking-wider">Price</span>
                    </div>
                    <div class="flex flex-col items-center justify-center p-3 rounded-lg bg-elevated border border-default">
                        <UIcon name="i-lucide-clock" class="size-5 text-muted mb-1" />
                        <span class="text-lg font-bold text-highlighted">{{ selectedOffering.duration }}</span>
                        <span class="text-[10px] text-muted uppercase tracking-wider">Duration</span>
                    </div>
                    <div class="flex flex-col items-center justify-center p-3 rounded-lg bg-elevated border border-default">
                        <UIcon name="i-lucide-users" class="size-5 text-muted mb-1" />
                        <span class="text-lg font-bold text-highlighted">{{ selectedOffering.maxParticipants }}</span>
                        <span class="text-[10px] text-muted uppercase tracking-wider">Capacity</span>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2 w-full">
                <UButton color="neutral" variant="outline" label="Close" @click="isSlideoverOpen = false" />
                <UButton color="primary" icon="i-lucide-calendar-plus" label="Request Booking" @click="openBookingModal" />
            </div>
        </template>
    </USlideover>
    
    <!-- Booking Modal -->
    <UModal v-model:open="isBookingModalOpen" title="Request Booking">
        <template #body>
            <div v-if="selectedOffering" class="space-y-4">
                <div class="p-3 bg-primary-500/10 rounded border border-primary-500/20 text-sm">
                    You are requesting to book <strong>{{ selectedOffering.title }}</strong> from <strong>{{ selectedOffering.providerName }}</strong>.
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <UFormField label="Date" required>
                        <UInput type="date" v-model="bookingForm.date" variant="subtle" class="w-full" />
                    </UFormField>
                    <UFormField label="Time" required>
                        <UInput type="time" v-model="bookingForm.time" variant="subtle" class="w-full" />
                    </UFormField>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <UFormField label="Participants" required>
                        <UInputNumber v-model="bookingForm.participants" :max="selectedOffering.maxParticipants" :min="1" variant="subtle" class="w-full" />
                        <template #hint>
                            <span class="text-xs text-muted">Max {{ selectedOffering.maxParticipants }}</span>
                        </template>
                    </UFormField>
                    
                    <UFormField label="Location" :required="selectedOffering.type !== 'online'">
                        <UInput v-model="bookingForm.location" variant="subtle" class="w-full" :disabled="selectedOffering.type === 'online'" />
                    </UFormField>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2 w-full">
                <UButton variant="outline" color="neutral" :disabled="isSubmitting" @click="isBookingModalOpen = false">Cancel</UButton>
                <UButton color="primary" :loading="isSubmitting" @click="submitBooking">Confirm Request</UButton>
            </div>
        </template>
    </UModal>
</template>
