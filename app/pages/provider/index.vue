<script setup lang="ts">
import { useProviderStore } from '~/stores/providerStore'

const providerStore = useProviderStore()

const stats = computed(() => [
    { label: 'Offerings', value: providerStore.offerings.length.toString(), icon: 'i-lucide-hand-heart', color: 'rose' },
    { label: 'Pending Requests', value: providerStore.bookings.filter(b => b.status === 'pending').length.toString(), icon: 'i-lucide-messages-square', color: 'sky' },
    { label: 'Confirmed', value: providerStore.scheduleEvents.filter(e => e.status === 'Confirmed').length.toString(), icon: 'i-lucide-calendar-days', color: 'lime' },
    { label: 'Companies Served', value: providerStore.clients.length.toString(), icon: 'i-lucide-circle-check-big', color: 'purple' }
])

const upcomingBooking = computed(() => providerStore.scheduleEvents.map(event => ({
    id: event.id,
    title: event.title,
    organization: event.organization || 'No organization',
    date: event.date,
    image: `/img/stockphoto_${(event.id % 15) + 1}.jpg`,
    status: event.status,
    statusColor: event.status === 'Confirmed' ? 'primary' : 'warning'
})))

const completedEngagement = computed(() => providerStore.availedBookings.filter(b => b.status === 'completed').map(b => ({
    id: b.id,
    title: b.offering,
    organization: b.company,
    date: b.date,
    image: b.image || `/img/stockphoto_${(b.id % 15) + 1}.jpg`
})))

const { page, paginatedItems: paginatedBookings, pageSize } = usePagination(upcomingBooking, 5)
const { page: completedPage, paginatedItems: paginatedEngagements, pageSize: completedPageSize } = usePagination(completedEngagement, 5)
</script>
<template>
    <div class="flex-1">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <UCard variant="subtle" class="shadow-sm">
                <div class="flex justify-between items-center gap-4">
                    <div class="flex items-center gap-2">
                        <UIcon name="i-lucide-calendar-days" class="w-6 h-6 text-cyan" />
                        <span class="text-highlighted font-semibold">
                            Upcoming bookings
                        </span>
                    </div>
                    <UBadge :label="upcomingBooking.length + ' Upcoming'" color="cyan" />
                </div>

                <UEmpty v-if="upcomingBooking.length === 0" variant="naked" icon="i-lucide-calendar-days"
                    title="No upcoming bookings"
                    description="When a company confirms a booking request, it will appear here." />

                <template v-else>
                    <div class="mt-4 space-y-4">
                        <UCard v-for="booking in paginatedBookings" :key="booking.id" variant="subtle"
                            :ui="{ body: 'sm:p-2 sm:pr-4' }" class="shadow-sm">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-4">
                                    <NuxtImg :src="booking.image" :alt="booking.title" class="h-18 rounded" />
                                    <div>
                                        <p class="text-sm font-bold">{{ booking.title }}</p>
                                        <p class="text-muted text-xs mt-1">{{ booking.organization }} &bull; {{ booking.date
                                        }}</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <UBadge :label="booking.status" :color="(booking as any).statusColor" variant="subtle"
                                        size="sm" />
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
            <UCard variant="subtle" class="shadow-sm">
                <div class="flex justify-between items-center gap-4">
                    <div class="flex items-center gap-2">
                        <UIcon name="i-lucide-circle-check" class="w-6 h-6 text-primary" />
                        <span class="text-highlighted font-semibold">
                            Completed engagements
                        </span>
                    </div>
                    <UBadge :label="completedEngagement.length + ' Completed'" />
                </div>
                <UEmpty v-if="completedEngagement.length === 0" variant="naked" icon="i-lucide-circle-check-big"
                    title="No completed engagements" description="When an engagement is completed, it will appear here." />
                <template v-else>
                    <div class="mt-4 space-y-4">
                        <UCard v-for="engagement in paginatedEngagements" :key="engagement.id" variant="subtle"
                            :ui="{ body: 'sm:p-2 sm:pr-4' }" class="shadow-sm">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-4">
                                    <NuxtImg :src="engagement.image" :alt="engagement.title" class="h-18 rounded" />
                                    <div>
                                        <p class="text-sm font-bold">{{ engagement.title }}</p>
                                        <p class="text-muted text-xs mt-1">{{ engagement.organization }} &bull; {{
                                            engagement.date }}
                                        </p>
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
    </div>
</template>