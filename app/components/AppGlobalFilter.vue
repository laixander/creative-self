<script setup lang="ts">
const globalFilter = defineModel<string>({ default: '' })
</script>

<template>
  <UInput v-model="globalFilter" class="max-w-sm" placeholder="Filter..." icon="i-lucide-search" />
</template>
