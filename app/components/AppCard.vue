<script setup lang="ts">
const props = defineProps<{
    title: string
    description?: string
}>()
</script>
<template>
    <UCard variant="subtle" class="shadow-sm">
        <div class="flex justify-between items-center">
            <div>
                <div class="text-highlighted font-semibold">
                    <slot v-if="$slots.title" name="title">
                        {{ title }}
                    </slot>
                </div>
                <div class="mt-1 text-muted text-sm">
                    {{ description }}
                </div>
            </div>
            <slot name="action" />
        </div>
        <slot />
    </UCard>
</template>