<script setup lang="ts">
import type { DropdownMenuItem, DropdownMenuProps } from '@nuxt/ui'
import { subtle } from 'crypto';

const props = defineProps<{
    items: DropdownMenuItem[] | DropdownMenuItem[][]
    triggerLabel?: string
    triggerIcon?: string
    triggerVariant?: "link" | "solid" | "outline" | "soft" | "subtle" | "ghost" | undefined
    triggerColor?: "primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral" | undefined
    triggerSize?: "xs" | "sm" | "md" | "lg" | undefined
    size?: DropdownMenuProps['size']
    content?: DropdownMenuProps['content']
}>()

const isOpen = defineModel<boolean>('open', { default: false })
</script>

<template>
    <UDropdownMenu v-model:open="isOpen" :items="items" :size="size" :content="content">
        <UButton :label="triggerLabel" :icon="triggerIcon" :color="triggerColor" :variant="triggerVariant"
            :size="triggerSize" />
    </UDropdownMenu>
</template>