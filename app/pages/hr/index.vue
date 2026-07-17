<script setup lang="ts">
import { useHrStore } from '~/stores/hrStore'

const hrStore = useHrStore()

const stats = computed(() => {
    const activeBookings = hrStore.bookings.filter(b => b.status === 'confirmed' || b.status === 'pending_confirmation')
    const totalSpend = hrStore.availedBookings.reduce((sum, b) => sum + b.price, 0)
    
    return [
        { label: 'Available Providers', value: hrStore.providers.length.toString(), icon: 'i-lucide-building', color: 'rose' },
        { label: 'Active Bookings', value: activeBookings.length.toString(), icon: 'i-lucide-calendar', color: 'sky' },
        { label: 'Completed Engagements', value: hrStore.availedBookings.length.toString(), icon: 'i-lucide-circle-check-big', color: 'lime' },
        { label: 'Total Wellness Spend', value: `$${totalSpend.toLocaleString()}`, icon: 'i-lucide-banknote', color: 'purple' }
    ]
})

const upcomingBooking = computed(() => hrStore.bookings
    .filter(b => b.status === 'confirmed' || b.status === 'pending_confirmation')
    .map(b => ({
        id: b.id,
        title: b.offering,
        organization: b.provider,
        date: b.date,
        image: `/img/stockphoto_${(b.id % 15) + 1}.jpg`,
        status: b.status,
        statusColor: b.status === 'confirmed' ? 'primary' : 'warning'
    })))

const completedEngagement = computed(() => hrStore.availedBookings.map(b => ({
    id: b.id,
    title: b.offering,
    organization: b.provider,
    date: b.date,
    image: b.image || `/img/stockphoto_${(b.id % 15) + 1}.jpg`
})))

const { page, paginatedItems: paginatedBookings, pageSize } = usePagination(upcomingBooking, 5)
const { page: completedPage, paginatedItems: paginatedEngagements, pageSize: completedPageSize } = usePagination(completedEngagement, 5)

definePageMeta({
    title: 'HR Dashboard'
})
</script>

<template>
    <!-- Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
                    <p class="text-2xl font-bold">{{ stat.value }}</p>
                </div>
            </div>
        </UCard>
    </div>

    <!-- Details Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
        <!-- Upcoming Bookings -->
        <UCard variant="subtle" class="shadow-sm">
            <div class="flex justify-between items-center gap-4">
                <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-calendar-days" class="w-6 h-6 text-cyan" />
                    <span class="text-highlighted font-semibold">
                        Upcoming Bookings
                    </span>
                </div>
                <UBadge :label="upcomingBooking.length + ' Upcoming'" color="cyan" />
            </div>

            <UEmpty v-if="upcomingBooking.length === 0" variant="naked" icon="i-lucide-calendar-days"
                title="No upcoming bookings"
                description="When you request a booking from a provider, it will appear here." />

            <template v-else>
                <div class="mt-4 space-y-4">
                    <UCard v-for="booking in paginatedBookings" :key="booking.id" variant="subtle"
                        :ui="{ body: 'sm:p-2 sm:pr-4' }" class="shadow-sm">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <NuxtImg :src="booking.image" :alt="booking.title" class="h-18 w-24 object-cover rounded" />
                                <div>
                                    <p class="text-sm font-bold">{{ booking.title }}</p>
                                    <p class="text-muted text-xs mt-1">Provider: {{ booking.organization }}</p>
                                    <p class="text-muted text-xs mt-0.5">{{ booking.date }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <UBadge :label="booking.status" :color="(booking as any).statusColor" variant="subtle"
                                    size="sm" class="capitalize" />
                            </div>
                        </div>
                    </UCard>
                </div>

                <!-- Pagination controls -->
                <div v-if="upcomingBooking.length > pageSize" class="flex justify-center mt-6">
                    <UPagination v-model:page="page" :total="upcomingBooking.length" :items-per-page="pageSize"
                        variant="subtle" />
                </div>
            </template>
        </UCard>

        <!-- Completed Engagements -->
        <UCard variant="subtle" class="shadow-sm">
            <div class="flex justify-between items-center gap-4">
                <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-circle-check" class="w-6 h-6 text-primary" />
                    <span class="text-highlighted font-semibold">
                        Availed Services
                    </span>
                </div>
                <UBadge :label="completedEngagement.length + ' Availed'" />
            </div>
            
            <UEmpty v-if="completedEngagement.length === 0" variant="naked" icon="i-lucide-circle-check-big"
                title="No availed services" description="When an engagement is completed, it will appear here." />
            
            <template v-else>
                <div class="mt-4 space-y-4">
                    <UCard v-for="engagement in paginatedEngagements" :key="engagement.id" variant="subtle"
                        :ui="{ body: 'sm:p-2 sm:pr-4' }" class="shadow-sm">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <NuxtImg :src="engagement.image" :alt="engagement.title" class="h-18 w-24 object-cover rounded" />
                                <div>
                                    <p class="text-sm font-bold">{{ engagement.title }}</p>
                                    <p class="text-muted text-xs mt-1">Provider: {{ engagement.organization }}</p>
                                    <p class="text-muted text-xs mt-0.5">{{ engagement.date }}</p>
                                </div>
                            </div>
                        </div>
                    </UCard>
                </div>

                <!-- Pagination controls -->
                <div v-if="completedEngagement.length > completedPageSize" class="flex justify-center mt-6">
                    <UPagination v-model:page="completedPage" :total="completedEngagement.length"
                        :items-per-page="completedPageSize" variant="subtle" />
                </div>
            </template>
        </UCard>
    </div>
</template>