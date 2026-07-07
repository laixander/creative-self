<script setup lang="ts">
import { upperFirst } from 'scule'

const props = defineProps<{
  table: any
}>()
</script>

<template>
  <UDropdownMenu :items="table?.tableApi
    ?.getAllColumns()
    .filter((column: any) => column.getCanHide())
    .map((column: any) => ({
      label: upperFirst(column.id),
      type: 'checkbox' as const,
      checked: column.getIsVisible(),
      onUpdateChecked(checked: boolean) {
        table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
      },
      onSelect(e: Event) {
        e.preventDefault()
      }
    })) || []
    " :content="{ align: 'end' }">
    <UButton label="Columns" color="neutral" variant="outline" trailing-icon="i-lucide-chevron-down" />
  </UDropdownMenu>
</template>
