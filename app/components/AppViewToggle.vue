<script setup lang="ts">
const viewMode = defineModel<'table' | 'cards'>({ default: 'cards' })
</script>

<template>
  <UFieldGroup size="xl">
    <UButton square color="neutral" :variant="viewMode === 'cards' ? 'subtle' : 'outline'"
      @click="() => { viewMode = 'cards' }">
      <UIcon name="i-lucide-grid-2x2" />
    </UButton>
    <UButton square color="neutral" :variant="viewMode === 'table' ? 'subtle' : 'outline'"
      @click="() => { viewMode = 'table' }">
      <UIcon name="i-lucide-list" />
    </UButton>
  </UFieldGroup>
</template>
