<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProviderStore } from '~/stores/providerStore'
import type { DropdownMenuItem } from '@nuxt/ui'

definePageMeta({
    title: 'Schedule',
    isTable: true
})

// ============================================================================
// State
// ============================================================================
const viewMode = ref<'calendar' | 'list'>('calendar')
const expandedEventId = ref<number | null>(null)
const toggleEvent = (id: number) => {
    expandedEventId.value = expandedEventId.value === id ? null : id
}
const currentDate = ref(new Date(2026, 6, 1)) // Default to July 2026 based on context

// ============================================================================
// Types & Data
// ============================================================================
interface Event {
    id: number
    title: string
    date: string // YYYY-MM-DD
    time: string
    duration: string
    participants: number
    type: 'online' | 'in-person' | 'hybrid'
    color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
    organization?: string
    locationStr?: string
    status?: 'Confirmed' | 'Pending'
}

const providerStore = useProviderStore()
const events = computed(() => providerStore.scheduleEvents)

// ============================================================================
// Calendar Logic
// ============================================================================
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]

const currentMonthName = computed(() => monthNames[currentDate.value.getMonth()])
const currentYear = computed(() => currentDate.value.getFullYear())

const prevMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const goToday = () => {
    currentDate.value = new Date()
}

// Generate the 42 cells for the calendar (6 weeks)
const calendarDays = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)

    const startingDayOfWeek = firstDayOfMonth.getDay()
    const totalDaysInMonth = lastDayOfMonth.getDate()

    const days = []

    // Previous month's trailing days
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const dateNum = prevMonthLastDay - i
        let actualMonth = month
        let actualYear = year
        if (actualMonth === 0) {
            actualMonth = 12
            actualYear--
        }
        const formattedDateStr = `${actualYear}-${String(actualMonth).padStart(2, '0')}-${String(dateNum).padStart(2, '0')}`

        days.push({
            date: dateNum,
            isCurrentMonth: false,
            fullDate: formattedDateStr,
            events: events.value.filter(e => e.date === formattedDateStr)
        })
    }

    // Current month's days
    for (let i = 1; i <= totalDaysInMonth; i++) {
        const formattedDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
        days.push({
            date: i,
            isCurrentMonth: true,
            isToday: new Date().toDateString() === new Date(year, month, i).toDateString(),
            fullDate: formattedDateStr,
            events: events.value.filter(e => e.date === formattedDateStr).sort((a, b) => a.time.localeCompare(b.time))
        })
    }

    // Next month's leading days
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
        let actualMonth = month + 2
        let actualYear = year
        if (actualMonth === 13) {
            actualMonth = 1
            actualYear++
        }
        const formattedDateStr = `${actualYear}-${String(actualMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`

        days.push({
            date: i,
            isCurrentMonth: false,
            fullDate: formattedDateStr,
            events: events.value.filter(e => e.date === formattedDateStr)
        })
    }

    return days
})

// ============================================================================
// List Logic
// ============================================================================
const groupedEvents = computed(() => {
    const groups = new Map<string, Event[]>()
    const sorted = [...events.value].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    sorted.forEach(event => {
        const [y, m, d] = event.date.split('-').map(Number) as [number, number, number]
        const dateObj = new Date(y, m - 1, d)
        const monthYear = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()

        if (!groups.has(monthYear)) {
            groups.set(monthYear, [])
        }
        groups.get(monthYear)!.push(event)
    })

    return Array.from(groups.entries())
})

const getDayInfo = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number) as [number, number, number]
    const dateObj = new Date(y, m - 1, d)
    return {
        number: String(d),
        day: dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
    }
}

// Map color strings to tailwind utilities for the pills
const pillColors: Record<string, string> = {
    primary: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20',
    success: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
    error: 'bg-error/10 text-error border-error/20 hover:bg-error/20',
    info: 'bg-info/10 text-info border-info/20 hover:bg-info/20'
}

const getEventDropdownItems = (event: Event): DropdownMenuItem[] => [
    { label: 'Edit Event', icon: 'i-lucide-pencil', onSelect: () => console.log('Edit event', event.id) },
    { label: 'Cancel Event', icon: 'i-lucide-x-circle', color: 'error' as const, onSelect: () => console.log('Cancel event', event.id) }
]
</script>

<template>
    <Teleport to="#header-actions">
        <UFieldGroup size="xl">
            <UButton square color="neutral" :variant="viewMode === 'calendar' ? 'subtle' : 'outline'"
                @click="() => { viewMode = 'calendar' }">
                <UIcon name="i-lucide-calendar" />
            </UButton>
            <UButton square color="neutral" :variant="viewMode === 'list' ? 'subtle' : 'outline'"
                @click="() => { viewMode = 'list' }">
                <UIcon name="i-lucide-list" />
            </UButton>
        </UFieldGroup>
        <!-- <UButton icon="i-lucide-plus" label="New Event" /> -->
    </Teleport>

    <!-- Calendar View -->
    <div v-if="viewMode === 'calendar'" class="flex-1 flex flex-col min-h-0 overflow-y-auto scrollbar">
        <!-- Calendar Header Controls -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-default bg-surface">
            <div class="flex items-center gap-4">
                <h2 class="text-xl font-semibold text-highlighted">{{ currentMonthName }} {{ currentYear }}</h2>
                <UButton label="Today" color="neutral" variant="subtle" size="sm" @click="goToday" />
            </div>
            <div class="flex items-center gap-1">
                <UButton icon="i-lucide-chevron-left" color="neutral" variant="ghost" @click="prevMonth" />
                <UButton icon="i-lucide-chevron-right" color="neutral" variant="ghost" @click="nextMonth" />
            </div>
        </div>

        <!-- Calendar Grid -->
        <div class="flex-1 flex flex-col min-h-0">
            <!-- Weekdays -->
            <div class="grid grid-cols-7 border-b border-default bg-muted/20">
                <div v-for="day in weekdays" :key="day" class="py-2 text-center text-sm font-medium text-muted">
                    {{ day }}
                </div>
            </div>

            <!-- Days -->
            <div class="flex-1 grid grid-cols-7 grid-rows-6">
                <div v-for="(cell, index) in calendarDays" :key="index"
                    class="relative min-h-[100px] border-b border-r border-default p-1 transition-colors hover:bg-muted/10"
                    :class="[
                        !cell.isCurrentMonth ? 'bg-muted/5' : 'bg-surface',
                        index % 7 === 6 ? 'border-r-0' : '', // Remove right border on Saturday
                        index >= 35 ? 'border-b-0' : '' // Remove bottom border on last row
                    ]">
                    <!-- Date Number -->
                    <div class="flex justify-end p-1">
                        <div class="w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium"
                            :class="cell.isToday ? 'bg-primary' : (cell.isCurrentMonth ? 'text-highlighted' : 'text-muted/50')">
                            {{ cell.date }}
                        </div>
                    </div>

                    <!-- Events Container -->
                    <div class="flex flex-col gap-1 px-1 overflow-y-auto max-h-[calc(100%-32px)] scrollbar-hide">
                        <div v-for="event in cell.events" :key="event.id" @click.stop="toggleEvent(event.id)"
                            class="text-xs px-2 py-1 rounded border cursor-pointer transition-all duration-200" :class="[
                                pillColors[event.color] || pillColors.primary,
                                expandedEventId === event.id ? 'whitespace-normal break-words relative z-10' : 'truncate'
                            ]">
                            <span class="font-medium mr-1">{{ event.time }}</span>
                            <span>{{ event.title }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- List View -->
    <div v-else-if="viewMode === 'list'" class="flex-1 flex flex-col overflow-y-auto scrollbar p-4 sm:p-6 bg-surface">
        <div v-if="events.length === 0" class="flex-1 flex flex-col items-center justify-center p-8">
            <UEmpty icon="i-lucide-calendar" title="No schedule events found"
                description="Get started by deploying demo data." />
        </div>
        <div v-else class="flex flex-col gap-8 max-w-4xl mx-auto w-full pb-8">
            <div v-for="[month, monthEvents] in groupedEvents" :key="month" class="flex flex-col gap-3">
                <h3 class="text-xs font-semibold text-muted tracking-wider">{{ month }}</h3>

                <div class="flex flex-col gap-3">
                    <UCard v-for="event in monthEvents" :key="event.id" variant="subtle"
                        :ui="{ body: 'p-4 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-4' }">
                        <!-- Date Badge -->
                        <div
                            class="w-14 h-14 rounded-xl bg-primary/10 flex flex-col items-center justify-center shrink-0">
                            <span class="text-lg font-bold text-primary leading-tight">{{
                                getDayInfo(event.date).number
                                }}</span>
                            <span class="text-[10px] font-semibold text-primary uppercase leading-tight mt-0.5">{{
                                getDayInfo(event.date).day }}</span>
                        </div>

                        <!-- Details -->
                        <div class="flex-1 min-w-0 flex flex-col justify-center">
                            <h4 class="font-semibold text-highlighted truncate">{{ event.title }}</h4>
                            <p class="text-sm text-muted truncate mt-0.5">
                                <span v-if="event.organization">{{ event.organization }} · </span>
                                <span>{{ event.participants }} people</span>
                                <span v-if="event.locationStr"> · {{ event.locationStr }}</span>
                            </p>
                        </div>

                        <!-- Right Side Actions/Status -->
                        <div class="flex items-center justify-between sm:justify-end gap-3 shrink-0 mt-2 sm:mt-0">
                            <UBadge v-if="event.status === 'Confirmed'" color="success" variant="subtle"
                                class="rounded-full px-3 py-1 font-medium">
                                Confirmed
                            </UBadge>
                            <UBadge v-else-if="event.status === 'Pending'" color="warning" variant="subtle"
                                class="rounded-full px-3 py-1 font-medium">
                                Pending
                            </UBadge>
                            <AppDropdownMenu :items="getEventDropdownItems(event)" size="sm"
                                trigger-icon="i-lucide-more-vertical" trigger-variant="ghost" trigger-color="neutral"
                                trigger-size="sm" :content="{ align: 'end', side: 'bottom', sideOffset: 4 }" />
                        </div>
                    </UCard>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Hide scrollbar for the events container but allow scrolling */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>