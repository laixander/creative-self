<script setup lang="ts">
const stats = [
    { label: 'Offerings', value: '1,234', icon: 'i-lucide-hand-heart', color: 'rose' },
    { label: 'Pending Requests', value: '456', icon: 'i-lucide-messages-square', color: 'sky' },
    { label: 'Confirmed', value: '78', icon: 'i-lucide-calendar-days', color: 'lime' },
    { label: 'Companies Served', value: '78', icon: 'i-lucide-circle-check-big', color: 'purple' }
]
const upcomingBooking = [
    {
        id: 1,
        title: 'Mindful Mondays — 8 Week Program',
        organization: 'Stillwater Mindfulness',
        date: '2026-11-12',
        image: '/img/stockphoto_11.jpg',
        status: 'Confirmed',
        statusColor: 'primary'
    },
    {
        id: 2,
        title: 'Breathwork Fundamentals',
        organization: 'Aura Wellness',
        date: '2026-11-15',
        image: '/img/stockphoto_12.jpg',
        status: 'Waitlisted',
        statusColor: 'neutral'
    },
    {
        id: 3,
        title: 'Lunchtime Yoga Flow',
        organization: 'Urban Zen Center',
        date: '2026-11-18',
        image: '/img/stockphoto_13.jpg',
        status: 'Confirmed',
        statusColor: 'primary'
    },
    {
        id: 4,
        title: 'Weekend Silent Retreat',
        organization: 'Mountain View Sanctuary',
        date: '2026-11-21',
        image: '/img/stockphoto_14.jpg',
        status: 'Pending',
        statusColor: 'warning'
    },
    {
        id: 5,
        title: 'Nutrition for Busy Professionals',
        organization: 'Urban Zen Center',
        date: '2026-11-21',
        image: '/img/stockphoto_15.jpg',
        status: 'Confirmed',
        statusColor: 'primary'
    }
]
const completedEngagement = [
    {
        id: 1,
        title: 'Nature Photography Walk',
        organization: 'Lens & Leaf',
        date: '2026-04-10',
        image: '/img/stockphoto_10.jpg'
    },
    {
        id: 2,
        title: 'Expressive Dance Therapy',
        organization: 'Motion Heals',
        date: '2026-05-02',
        image: '/img/stockphoto_9.jpg'
    },
    {
        id: 3,
        title: 'Digital Art for Beginners',
        organization: 'Creative Pixels',
        date: '2026-05-18',
        image: '/img/stockphoto_8.jpg'
    }
]
definePageMeta({
    title: 'Dashboard'
})
</script>
<template>
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
                <div class="text-highlighted font-semibold">Upcoming bookings</div>
                <UBadge :label="upcomingBooking.length + ' Upcoming'" color="cyan" />
            </div>
            <UEmpty v-if="upcomingBooking.length === 0" variant="naked" icon="i-lucide-calendar-days"
                title="No upcoming bookings"
                description="When a company confirms a booking request, it will appear here." />
            <div v-else class="mt-4 space-y-4">
                <UCard v-for="booking in upcomingBooking" :key="booking.id" variant="subtle"
                    :ui="{ body: 'sm:p-2 sm:pr-4' }" class="shadow-sm">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <NuxtImg :src="booking.image" :alt="booking.title" class="h-18 rounded" />
                            <div>
                                <p class="text-sm font-bold">{{ booking.title }}</p>
                                <p class="text-muted text-xs mt-1">{{ booking.organization }} &bull; {{ booking.date }}
                                </p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <UBadge :label="booking.status" :color="(booking as any).statusColor" variant="subtle"
                                size="sm" />
                        </div>
                    </div>
                </UCard>
            </div>
        </UCard>
        <UCard variant="subtle" class="shadow-sm">
            <div class="flex justify-between items-center gap-4">
                <div class="text-highlighted font-semibold">Completed engagements</div>
                <UBadge :label="completedEngagement.length + ' Completed'" />
            </div>
            <UEmpty v-if="completedEngagement.length === 0" variant="naked" icon="i-lucide-circle-check-big"
                title="No completed engagements" description="When an engagement is completed, it will appear here." />
            <div v-else class="mt-4 space-y-4">
                <UCard v-for="engagement in completedEngagement" :key="engagement.id" variant="subtle"
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
        </UCard>
    </div>
</template>