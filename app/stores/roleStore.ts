import { defineStore } from 'pinia'
import type { Role } from '~/types/role'

export const useRoleStore = defineStore('roleStore', {
    state: () => ({
        roles: [
            { id: 'role-admin', name: 'Admin', description: 'Administrator with full access', pages: ['/demo', '/demo/crud', '/demo/roles', '/demo/activity-logs', '/demo/kanban', '/settings', '/demo/notifications', '/demo/wizard', '/demo/cards', '/provider', '/provider/offerings', '/provider/requests', '/provider/schedule', '/provider/availed', '/provider/clients', '/provider/media', '/provider/profile'] },
            { id: 'role-staff', name: 'Staff', description: 'Regular staff member', pages: ['/demo', '/demo/crud', '/demo/kanban', '/demo/notifications'] },
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
