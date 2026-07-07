import { defineStore } from 'pinia'

export const useRoleStore = defineStore('roles', {
  state: () => ({
    roles: [] as any[],
    loading: false
  }),
  actions: {
    async fetchRoles() {
      this.loading = true
      try {
        const data = await $fetch<any[]>('/api/roles')
        if (data) {
          this.roles = data
        }
      } finally {
        this.loading = false
      }
    },
    async createRole(role: any) {
      const data = await $fetch('/api/roles', {
        method: 'POST',
        body: role
      })
      if (data) {
        this.roles.unshift(data)
      }
    },
    async updateRole(id: number, role: any) {
      const data = await $fetch(`/api/roles/${id}`, {
        method: 'PUT',
        body: role
      })
      if (data) {
        const index = this.roles.findIndex((r: any) => r.id === id)
        if (index !== -1) {
          this.roles[index] = data
        }
      }
    },
    async deleteRole(id: number) {
      await $fetch(`/api/roles/${id}`, {
        method: 'DELETE'
      })
      this.roles = this.roles.filter((r: any) => r.id !== id)
    }
  }
})
