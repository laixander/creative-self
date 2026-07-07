<script setup lang="ts">
import { h } from 'vue'
import { UButton } from '#components'
import { useUserStore } from '../stores/users'
import { useRoleStore } from '../stores/roles'
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'
import { LazyModalConfirmation } from '#components'
import { useOverlay } from '#imports'
import { z } from 'zod'

const userStore = useUserStore()
const roleStore = useRoleStore()
const toast = useToast()
const overlay = useOverlay()
const confirmModal = overlay.create(LazyModalConfirmation)

const isOpen = ref(false)
const isEditing = ref(false)
const form = ref({ id: 0, name: '', email: '', roleId: null as number | null })

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  roleId: z.number().nullable().optional()
})

onMounted(() => {
  userStore.fetchUsers()
  roleStore.fetchRoles()
})

type User = {
  id: number
  name: string
  email: string
  roleId: number | null
  role?: { name: string }
}

const columns: TableColumn<User>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => row.original.role?.name || 'No Role'
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => h('div', { class: 'flex gap-2' }, [
      h(UButton, {
        size: 'xs',
        color: 'neutral',
        variant: 'soft',
        onClick: () => confirmEdit(row.original)
      }, () => 'Edit'),
      h(UButton, {
        size: 'xs',
        color: 'error',
        variant: 'soft',
        onClick: () => remove(row.original.id)
      }, () => 'Delete')
    ])
  }
]

function openCreateModal() {
  form.value = { id: 0, name: '', email: '', roleId: null }
  isEditing.value = false
  isOpen.value = true
}

function confirmEdit(user: User) {
  confirmModal.open({
    title: 'Edit User',
    description: `You are about to edit "${user.name}". Do you want to continue?`,
    confirmLabel: 'Edit',
    color: 'warning',
    onConfirm: () => openEditModal(user)
  })
}

function openEditModal(user: User) {
  form.value = { ...user }
  isEditing.value = true
  isOpen.value = true
}

async function save() {
  if (isEditing.value) {
    await userStore.updateUser(form.value.id, form.value)
    toast.add({ title: 'User updated successfully', description: 'The user profile has been updated.', color: 'success' })
  } else {
    await userStore.createUser(form.value)
    toast.add({ title: 'User created successfully', description: 'A new user has been added to the system.', color: 'success' })
  }
  isOpen.value = false
}

async function remove(id: number) {
  confirmModal.open({
    title: 'Delete User',
    description: 'Are you sure you want to delete this user?',
    confirmLabel: 'Delete',
    color: 'error',
    onConfirm: async () => {
      await userStore.deleteUser(id)
      toast.add({ title: 'User deleted successfully', description: 'The user has been permanently removed.', color: 'error' })
    }
  })
}

const roleOptions = computed(() =>
  roleStore.roles.map((r: any) => ({ label: r.name, value: r.id }))
)

definePageMeta({
  title: 'Users',
  isTable: true,
})

const getDropdownItems = (user: User): DropdownMenuItem[] => [
  { label: 'Edit', icon: 'i-lucide-pencil', onSelect: () => confirmEdit(user) },
  { label: 'Delete', icon: 'i-lucide-trash', color: 'error', onSelect: () => remove(user.id) },
]

const viewMode = ref<'table' | 'cards'>('table')

const table = useTemplateRef('table')

const columnVisibility = ref({
  id: false
})
const globalFilter = ref('')

const filteredUsers = computed(() => {
  if (!globalFilter.value) return userStore.users
  const q = globalFilter.value.toLowerCase()
  return userStore.users.filter(user =>
    user.name.toLowerCase().includes(q) ||
    user.email.toLowerCase().includes(q) ||
    (user.role?.name || '').toLowerCase().includes(q)
  )
})
</script>

<template>
  <Teleport to="#header-actions">
    <div class="hidden sm:flex items-center gap-2">
      <AppGlobalFilter v-model="globalFilter" />
      <AppTableColumnToggle :table="table" v-if="viewMode == 'table'" />
      <AppViewToggle v-model="viewMode" />
    </div>
    <UButton @click="openCreateModal">
      <UIcon name="i-lucide-plus" /> Add User
    </UButton>
  </Teleport>

  <UTable v-if="viewMode === 'table'" :data="userStore.users" :columns="columns" :loading="userStore.loading"
    ref="table" v-model:column-visibility="columnVisibility" v-model:global-filter="globalFilter" />

  <div v-else class="grid grid-cols-3 gap-4 p-4 sm:p-6">
    <AppCard v-for="user in filteredUsers" :key="user.id" :title="user.name" :description="user.email">
      <template #action>
        <AppDropdownMenu :items="getDropdownItems(user)" size="sm" trigger-icon="i-lucide-more-vertical"
          trigger-variant="ghost" trigger-color="neutral" trigger-size="sm"
          :content="{ align: 'end', side: 'bottom', sideOffset: 4 }" />
      </template>
    </AppCard>
  </div>

  <UModal v-model:open="isOpen" :title="isEditing ? 'Edit User' : 'Create User'">
    <template #body>
      <UForm id="user-form" :schema="schema" :state="form" class="space-y-4" @submit="save">
        <UFormField label="Name" name="name">
          <UInput v-model="form.name" variant="subtle" class="w-full" />
        </UFormField>
        <UFormField label="Email" name="email">
          <UInput v-model="form.email" type="email" variant="subtle" class="w-full" />
        </UFormField>
        <UFormField label="Role" name="roleId">
          <USelect v-model="form.roleId" :items="roleOptions" placeholder="Select a role" variant="subtle"
            class="w-full" />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton color="neutral" variant="soft" @click="isOpen = false">Cancel</UButton>
        <UButton type="submit" form="user-form" color="primary">Save</UButton>
      </div>
    </template>
  </UModal>
</template>