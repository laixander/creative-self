<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

interface CourseRow {
    title: string
    category: string
    type: 'online' | 'hybrid' | 'in-person'
    price: number
    status: 'published' | 'draft' | 'archived'
}

const data = ref<CourseRow[]>([
    {
        title: 'Mindful Mondays — 8 Week Program',
        category: 'Meditation',
        type: 'online',
        price: 2400,
        status: 'published'
    },
    {
        title: 'Stress Resilience Workshop',
        category: 'Stress Management',
        type: 'hybrid',
        price: 1800,
        status: 'published'
    }
])

const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

const typeColors: Record<CourseRow['type'], string> = {
    online: 'info',
    hybrid: 'warning',
    'in-person': 'neutral'
}

const statusColors: Record<CourseRow['status'], string> = {
    published: 'success',
    draft: 'neutral',
    archived: 'error'
}

const columns: TableColumn<CourseRow>[] = [
    {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => h('div', { class: 'font-medium text-highlighted' }, row.original.title)
    },
    {
        accessorKey: 'category',
        header: 'Category'
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
        cell: ({ row }) => h(UButton, {
            label: 'Edit',
            color: 'neutral',
            variant: 'ghost',
            size: 'sm',
            icon: 'i-lucide-pencil',
            onClick: () => handleEdit(row.original)
        })
    }
]

function handleEdit(course: CourseRow) {
    console.log('Editing:', course)
}

definePageMeta({
    title: 'Offerings',
    isTable: true
})
</script>
<template>
    <Teleport to="#header-actions">
        <UButton>
            <UIcon name="i-lucide-plus" />
            <span>New Offering</span>
        </UButton>
    </Teleport>
    <UTable :data="data" :columns="columns" class="flex-1" />
</template>