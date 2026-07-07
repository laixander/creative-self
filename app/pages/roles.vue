<script setup lang="ts">
import { h } from 'vue'
import { UButton } from '#components'
import { useRoleStore } from '../stores/roles'
import type { TableColumn } from '@nuxt/ui'
import { LazyModalConfirmation } from '#components'
import { useOverlay } from '#imports'
import { z } from 'zod'

const store = useRoleStore()
const toast = useToast()
const overlay = useOverlay()
const confirmModal = overlay.create(LazyModalConfirmation)
const isOpen = ref(false)
const isEditing = ref(false)
const form = ref({ id: 0, name: '', description: '' })

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional()
})

onMounted(() => {
  store.fetchRoles()
})

type Role = { id: number; name: string; description: string }

const columns: TableColumn<Role>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'description', header: 'Description' },
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
  form.value = { id: 0, name: '', description: '' }
  isEditing.value = false
  isOpen.value = true
}

function confirmEdit(role: Role) {
  confirmModal.open({
    title: 'Edit Role',
    description: `You are about to edit "${role.name}". Do you want to continue?`,
    confirmLabel: 'Edit',
    color: 'warning',
    onConfirm: () => openEditModal(role)
  })
}

function openEditModal(role: Role) {
  form.value = { ...role }
  isEditing.value = true
  isOpen.value = true
}

async function save() {
  if (isEditing.value) {
    await store.updateRole(form.value.id, form.value)
    toast.add({ title: 'Role updated successfully', description: 'The role details have been updated.', color: 'success' })
  } else {
    await store.createRole(form.value)
    toast.add({ title: 'Role created successfully', description: 'A new role has been added to the system.', color: 'success' })
  }
  isOpen.value = false
}

async function remove(id: number) {
  confirmModal.open({
    title: 'Delete Role',
    description: 'Are you sure you want to delete this role?',
    confirmLabel: 'Delete',
    color: 'error',
    onConfirm: async () => {
      await store.deleteRole(id)
      toast.add({ title: 'Role deleted successfully', description: 'The role has been permanently removed.', color: 'error' })
    }
  })
}

definePageMeta({
  title: 'Roles',
  isTable: true,
})

import type { DropdownMenuItem } from '@nuxt/ui'

const getDropdownItems = (role: Role): DropdownMenuItem[] => [
  { label: 'Edit', icon: 'i-lucide-pencil', onSelect: () => confirmEdit(role) },
  { label: 'Delete', icon: 'i-lucide-trash', color: 'error', onSelect: () => remove(role.id) },
]

const viewMode = ref<'table' | 'cards'>('table')

const table = useTemplateRef('table')

const columnVisibility = ref({
  id: false
})

const globalFilter = ref('')

const filteredRoles = computed(() => {
  if (!globalFilter.value) return store.roles
  const q = globalFilter.value.toLowerCase()
  return store.roles.filter(role =>
    role.name.toLowerCase().includes(q) ||
    role.description?.toLowerCase().includes(q)
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
      <UIcon name="i-lucide-plus" /> Add Role
    </UButton>
  </Teleport>

  <UTable v-if="viewMode === 'table'" :data="store.roles" :columns="columns" :loading="store.loading" ref="table"
    v-model:column-visibility="columnVisibility" v-model:global-filter="globalFilter" />

  <div v-else class="grid grid-cols-3 gap-4 p-4 sm:p-6">
    <AppCard v-for="role in filteredRoles" :key="role.id" :title="role.name" :description="role.description">
      <template #action>
        <AppDropdownMenu :items="getDropdownItems(role)" size="sm" trigger-icon="i-lucide-more-vertical"
          trigger-variant="ghost" trigger-color="neutral" trigger-size="sm"
          :content="{ align: 'end', side: 'bottom', sideOffset: 4 }" />
      </template>
    </AppCard>
  </div>

  <UModal v-model:open="isOpen" :title="isEditing ? 'Edit Role' : 'Create Role'">
    <template #body>
      <UForm id="role-form" :schema="schema" :state="form" class="space-y-4" @submit="save">
        <UFormField label="Name" name="name">
          <UInput v-model="form.name" variant="subtle" class="w-full" />
        </UFormField>
        <UFormField label="Description" name="description">
          <UInput v-model="form.description" variant="subtle" class="w-full" />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton color="neutral" variant="soft" @click="isOpen = false">Cancel</UButton>
        <UButton type="submit" form="role-form" color="primary">Save</UButton>
      </div>
    </template>
  </UModal>
</template>