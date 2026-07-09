<!-- error.vue -->
<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
    error: NuxtError
}>()

// Optional: log the error somewhere (e.g. to a monitoring service)
console.error(props.error)
</script>

<template>
    <UApp>
        <NuxtLayout>
            <UError icon="i-lucide-file-x" :error="error" redirect="/provider" :clear="{
                label: 'Back to home',
                icon: 'i-lucide-arrow-left',
                color: 'primary',
                size: 'lg'
            }" :ui="{ root: 'min-h-full' }" />
        </NuxtLayout>
    </UApp>
</template>