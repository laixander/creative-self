<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { useAuthStore } from '~/stores/authStore'

defineProps<{
    collapsed?: boolean
}>()

const authStore = useAuthStore()
const isDeveloper = computed(() => authStore.role?.name === 'Developer')

const teams = ref([{
    label: 'Provider',
    icon: 'i-lucide-briefcase'
}, {
    label: 'Admin',
    icon: 'i-lucide-shield'
}, {
    label: 'HR',
    icon: 'i-lucide-users'
}])

const demoTeam = ref({
    label: 'Demo',
    icon: 'i-lucide-palette'
})

const selectedTeam = useState('selectedTeam', () => teams.value[0])

const router = useRouter()

function toMenuItem(team: { label: string, icon: string }) {
    return {
        ...team,
        onSelect() {
            selectedTeam.value = team
            router.push(`/${team.label.toLowerCase()}`)
        }
    }
}

const items = computed<DropdownMenuItem[][]>(() => {
    return [
        teams.value.map(toMenuItem),
        [toMenuItem(demoTeam.value)]
        // other menu sets
    ]
})
</script>

<template>
    <UDropdownMenu v-if="isDeveloper" :items="items" :content="{ align: 'center', collisionPadding: 12 }"
        :ui="{ content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)' }">
        <UButton v-bind="{
            ...selectedTeam,
            label: collapsed ? undefined : selectedTeam?.label,
            trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
        }" color="neutral" variant="ghost" block :square="collapsed" class="data-[state=open]:bg-elevated"
            :class="[!collapsed && 'py-2']" :ui="{
                trailingIcon: 'text-dimmed'
            }" />
    </UDropdownMenu>
</template>