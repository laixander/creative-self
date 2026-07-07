<script setup lang="ts">
const stats = [
    { label: 'Total Users', value: '1,234', icon: 'i-lucide-users', color: 'rose' },
    { label: 'Active Projects', value: '456', icon: 'i-lucide-folder', color: 'sky' },
    { label: 'Pending Reviews', value: '78', icon: 'i-lucide-clock', color: 'amber' }
]
definePageMeta({
    title: 'Dashboard'
})
</script>
<template>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
</template>
