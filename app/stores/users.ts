import { defineStore } from 'pinia'

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [] as any[],
    loading: false
  }),
  actions: {
    async fetchUsers() {
      this.loading = true
      try {
        const data = await $fetch<any[]>('/api/users')
        if (data) {
          this.users = data
        }
      } finally {
        this.loading = false
      }
    },
    async createUser(user: any) {
      const data = await $fetch('/api/users', {
        method: 'POST',
        body: user
      })
      if (data) {
        this.users.unshift(data)
      }
    },
    async updateUser(id: number, user: any) {
      const data = await $fetch(`/api/users/${id}`, {
        method: 'PUT',
        body: user
      })
      if (data) {
        const index = this.users.findIndex((u: any) => u.id === id)
        if (index !== -1) {
          this.users[index] = data
        }
      }
    },
    async deleteUser(id: number) {
      await $fetch(`/api/users/${id}`, {
        method: 'DELETE'
      })
      this.users = this.users.filter((u: any) => u.id !== id)
    }
  }
})
