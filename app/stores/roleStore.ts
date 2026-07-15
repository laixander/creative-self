import { defineStore } from 'pinia'
import type { Role } from '~/types/role'

export const useRoleStore = defineStore('roleStore', {
    state: () => ({
        roles: [
            { id: 'role-developer', name: 'Developer', description: 'Developer with all menus', pages: ['/provider', '/demo', '/demo/crud', '/demo/roles', '/demo/activity-logs', '/demo/kanban', '/settings', '/demo/notifications', '/demo/wizard', '/demo/cards', '/provider/offerings', '/provider/bookings', '/provider/schedule', '/provider/availed', '/provider/clients', '/provider/media', '/provider/profile', '/admin', '/hr', '/hr/offerings', '/hr/providers', '/hr/bookings', '/hr/availed', '/hr/media', '/hr/profile'] },
            { id: 'role-admin', name: 'Admin', description: 'Admin menu only', pages: ['/admin'] },
            { id: 'role-hr', name: 'HR', description: 'HR menu only', pages: ['/hr', '/hr/offerings', '/hr/providers', '/hr/bookings', '/hr/availed', '/hr/media', '/hr/profile'] },
            { id: 'role-provider', name: 'Provider', description: 'Provider menu only', pages: ['/provider', '/provider/offerings', '/provider/bookings', '/provider/schedule', '/provider/availed', '/provider/clients', '/provider/media', '/provider/profile'] },
        ] as Role[],
        isLoading: false,
    }),
    actions: {
        createRole(role: Role) {
            this.roles.push(role)
        },
        updateRole(id: string, updatedData: Partial<Role>) {
            const index = this.roles.findIndex((r: Role) => r.id === id)
            if (index !== -1) {
                this.roles[index] = { ...this.roles[index], ...updatedData } as Role
            }
        },
        deleteRole(id: string) {
            this.roles = this.roles.filter((r: Role) => r.id !== id)
        }
    },
    persist: {
        storage: persistedState.localStorage
    }
})
