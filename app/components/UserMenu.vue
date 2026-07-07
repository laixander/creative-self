<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

defineProps<{
    collapsed?: boolean
}>()

const router = useRouter()

const colorMode = useColorMode()

const items = computed<DropdownMenuItem[][]>(() => [
    [{
        label: 'Settings',
        icon: 'i-lucide-settings',
        onSelect: () => router.push('/settings')
    }],
    // Theme options
    [ {
        label: 'Appearance',
        icon: 'i-lucide-sun-moon',
        children: [{
            label: 'Light',
            icon: 'i-lucide-sun',
            type: 'checkbox',
            checked: colorMode.value === 'light',
            onSelect(e: Event) {
                e.preventDefault()
                colorMode.preference = 'light'
            }
        }, {
            label: 'Dark',
            icon: 'i-lucide-moon',
            type: 'checkbox',
            checked: colorMode.value === 'dark',
            onUpdateChecked(checked: boolean) {
                if (checked) {
                    colorMode.preference = 'dark'
                }
            },
            onSelect(e: Event) {
                e.preventDefault()
            }
        }]
    }],
    [{
        label: 'Log out',
        icon: 'i-lucide-log-out'
    }]
])
</script>

<template>
    <UDropdownMenu :items="items" :content="{ align: 'center', collisionPadding: 12 }"
        :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }">

        <UButton color="neutral" variant="ghost" class="data-[state=open]:bg-elevated/50 py-2 w-full">
            <div class="flex items-center gap-2 text-left w-full">
                <UAvatar src="https://api.dicebear.com/10.x/thumbs/svg?seed=Felix" alt="Felix" size="xs" />
                <span v-if="!collapsed" class="flex-1 truncate">Felix</span>
                <UBadge v-if="!collapsed" label="Admin" color="primary" variant="soft" size="sm"
                    class="shrink-0" />
            </div>
        </UButton>
    </UDropdownMenu>
</template>
