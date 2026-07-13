<script setup lang="ts">
const viewMode = defineModel<'table' | 'cards' | 'kanban'>({ default: 'cards' })
defineProps<{ kanban?: boolean }>()
</script>

<template>
  <UFieldGroup size="xl">
    <UButton square color="neutral" :variant="viewMode === 'cards' || viewMode === 'kanban' ? 'subtle' : 'outline'"
      @click="() => { viewMode = kanban ? 'kanban' : 'cards' }">
      <UIcon :name="kanban ? 'i-lucide-kanban' : 'i-lucide-grid-2x2'" />
    </UButton>
    <UButton square color="neutral" :variant="viewMode === 'table' ? 'subtle' : 'outline'"
      @click="() => { viewMode = 'table' }">
      <UIcon name="i-lucide-list" />
    </UButton>
  </UFieldGroup>
</template>
