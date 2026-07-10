---
name: Nuxt 4 CRUD Template — Agent Guidelines
description: Instructions for Nuxt 4 CRUD Template — Agent Guidelines
---

# Nuxt 4 CRUD Template — Agent Guidelines

This document describes the architecture, process, and requirements for generating resource management pages in this project. Any agent or developer adding a new feature should follow these guidelines precisely.

---

## Tech Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Framework    | Nuxt 4                            |
| UI Library   | Nuxt UI v3 (alpha)                |
| ORM          | Prisma v6 (SQLite via `dev.db`)   |
| State        | Pinia                             |
| Validation   | Zod v4                            |
| Package Mgr  | pnpm                              |
| Runtime      | Node.js / Bun compatible          |

---

## Project Structure

```
app/
  assets/css/         # Global CSS (main.css)
  components/         # Reusable Vue components
  layouts/            # default.vue — sidebar layout
  pages/              # Route pages (roles.vue, users.vue, etc.)
  stores/             # Pinia stores (one per resource)
  app.config.ts       # Nuxt UI theme config
  app.vue             # Root app entry
prisma/
  schema.prisma       # Data model definitions
server/
  api/                # Nitro API route handlers
  utils/prisma.ts     # Shared Prisma client singleton
skills/               # Agent guidelines (this file)
```

---

## Process for Adding a New Resource (e.g. "Projects")

Follow these steps **in order** when generating a new resource management feature:

### Step 1 — Define the Prisma Model

Add a new model to `prisma/schema.prisma`:

```prisma
model Project {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

Then sync the schema to the database:
```bash
bunx prisma db push
```

> ⚠️ Never run `prisma generate` manually — `db push` handles it automatically.

---

### Step 2 — Create the API Routes

Create two files under `server/api/<resource>/`:

#### `server/api/projects/index.ts`
Handles `GET` (list all) and `POST` (create one):

```typescript
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    return await prisma.project.findMany({ orderBy: { createdAt: 'desc' } })
  }

  if (method === 'POST') {
    const body = await readBody(event)
    return await prisma.project.create({
      data: { name: body.name, description: body.description }
    })
  }
})
```

#### `server/api/projects/[id].ts`
Handles `GET`, `PUT`, and `DELETE` for a single record:

```typescript
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const id = parseInt(event.context.params?.id as string)

  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  if (method === 'GET') {
    const project = await prisma.project.findUnique({ where: { id } })
    if (!project) throw createError({ statusCode: 404, statusMessage: 'Not found' })
    return project
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    return await prisma.project.update({ where: { id }, data: { name: body.name, description: body.description } })
  }

  if (method === 'DELETE') {
    await prisma.project.delete({ where: { id } })
    return { success: true }
  }
})
```

> ✅ Always validate the `id` param for NaN and throw proper HTTP errors using `createError()`.

---

### Step 3 — Create the Pinia Store

Create `app/stores/projects.ts`:

```typescript
import { defineStore } from 'pinia'

export const useProjectStore = defineStore('projects', {
  state: () => ({
    projects: [] as any[],
    loading: false
  }),
  actions: {
    async fetchProjects() {
      this.loading = true
      try {
        const data = await $fetch<any[]>('/api/projects')
        if (data) this.projects = data
      } finally {
        this.loading = false
      }
    },
    async createProject(project: any) {
      const data = await $fetch('/api/projects', { method: 'POST', body: project })
      if (data) this.projects.unshift(data)
    },
    async updateProject(id: number, project: any) {
      const data = await $fetch(`/api/projects/${id}`, { method: 'PUT', body: project })
      if (data) {
        const index = this.projects.findIndex((p: any) => p.id === id)
        if (index !== -1) this.projects[index] = data
      }
    },
    async deleteProject(id: number) {
      await $fetch(`/api/projects/${id}`, { method: 'DELETE' })
      this.projects = this.projects.filter((p: any) => p.id !== id)
    }
  }
})
```

> ⚠️ **Critical**: Always use `$fetch` (not `useFetch`) inside Pinia store actions. `useFetch` is a composable tied to the component lifecycle and will fail to hydrate on page refresh when called outside of `<script setup>`.

---

### Step 4 — Create the Page

Create `app/pages/projects.vue` following this exact structure:

```vue
<script setup lang="ts">
import { h } from 'vue'
import { UButton } from '#components'
import { useProjectStore } from '../stores/projects'
import type { TableColumn } from '@nuxt/ui'
import { LazyModalConfirmation } from '#components'
import { useOverlay } from '#imports'
import { z } from 'zod'

const store = useProjectStore()
const toast = useToast()
const overlay = useOverlay()
const confirmModal = overlay.create(LazyModalConfirmation)

const isOpen = ref(false)
const isEditing = ref(false)
const form = ref({ id: 0, name: '', description: '' })

// Zod schema — always define validation here
const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional()
})

onMounted(() => {
  store.fetchProjects()
})

type Project = { id: number; name: string; description: string }

// Table column definitions — use accessorKey, not key
const columns: TableColumn<Project>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'description', header: 'Description' },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => h('div', { class: 'flex gap-2' }, [
      h(UButton, { size: 'xs', color: 'neutral', variant: 'soft', onClick: () => confirmEdit(row.original) }, () => 'Edit'),
      h(UButton, { size: 'xs', color: 'error', variant: 'soft', onClick: () => remove(row.original.id) }, () => 'Delete')
    ])
  }
]

function openCreateModal() {
  form.value = { id: 0, name: '', description: '' }
  isEditing.value = false
  isOpen.value = true
}

// Shows a warning confirmation before opening the edit form
function confirmEdit(project: Project) {
  confirmModal.open({
    title: 'Edit Project',
    description: `You are about to edit "${project.name}". Do you want to continue?`,
    confirmLabel: 'Edit',
    color: 'warning',
    onConfirm: () => openEditModal(project)
  })
}

function openEditModal(project: Project) {
  form.value = { ...project }
  isEditing.value = true
  isOpen.value = true
}

async function save() {
  if (isEditing.value) {
    await store.updateProject(form.value.id, form.value)
    toast.add({ title: 'Project updated', description: 'The project has been updated.', color: 'success' })
  } else {
    await store.createProject(form.value)
    toast.add({ title: 'Project created', description: 'A new project has been added.', color: 'success' })
  }
  isOpen.value = false
}

async function remove(id: number) {
  confirmModal.open({
    title: 'Delete Project',
    description: 'Are you sure you want to delete this project?',
    confirmLabel: 'Delete',
    color: 'error',
    onConfirm: async () => {
      await store.deleteProject(id)
      toast.add({ title: 'Project deleted', description: 'The project has been permanently removed.', color: 'error' })
    }
  })
}

definePageMeta({
  title: 'Projects',
  isTable: true,
})
</script>

<template>
  <Teleport to="#header-actions">
    <UButton color="primary" @click="openCreateModal">Add Project</UButton>
  </Teleport>

  <UTable :data="store.projects" :columns="columns" :loading="store.loading" />

  <UModal v-model:open="isOpen" :title="isEditing ? 'Edit Project' : 'Create Project'">
    <template #body>
      <UForm id="project-form" :schema="schema" :state="form" class="space-y-4" @submit="save">
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
        <UButton type="submit" form="project-form" color="primary">Save</UButton>
      </div>
    </template>
  </UModal>
</template>
```

---

### Step 5 — Register in the Sidebar

Add a navigation entry in `app/layouts/default.vue` inside the `items` array:

```typescript
{
  label: 'Projects',
  icon: 'i-lucide-folder',
  to: '/projects'
}
```

---

## Key Rules & Gotchas

### Data Fetching
- ✅ **Always use `$fetch`** in Pinia store actions (not `useFetch`)
- `useFetch` is SSR-aware and only works inside `<script setup>` at the component level
- Using `useFetch` in a store will cause data to disappear on hard refresh

### Table Columns (Nuxt UI v3)
- ✅ Use `accessorKey` (not `key`) for column definitions
- ✅ Use `header` (not `label`) for column headers
- ✅ Use `cell: ({ row }) => ...` with `h()` for custom cell rendering
- ✅ Import `UButton` from `'#components'` to use inside `h()` render functions

### Modal Pattern
- ✅ Use `UModal` with `v-model:open` (not `v-model`)
- ✅ Use `<UForm>` with a Zod `:schema` and `:state` (not a plain `<form>`)
- ✅ Give `<UForm>` an `id` attribute and reference it from the submit `<UButton>` via `form="[id]"`, since the button lives in the `#footer` slot (outside the form)
- ✅ Use `<UFormField>` with a `name` prop matching the Zod schema key to display inline validation errors

### Confirmation Modal
- ✅ Use the programmatic `overlay.create(LazyModalConfirmation)` pattern (not a native `confirm()` dialog)
- ✅ Import `useOverlay` from `'#imports'`
- ✅ Use `LazyModalConfirmation` (not `ModalConfirmation`) for deferred loading
- ✅ **Edit actions**: show a `color: 'warning'` confirmation — "You are about to edit X. Do you want to continue?"
- ✅ **Delete actions**: show a `color: 'error'` confirmation — "Are you sure you want to delete this X?"
- The `onConfirm` callback for edit should call `openEditModal(record)` to open the form
- The `onConfirm` callback for delete should call the store action and then `toast.add(...)`

### Toast Notifications
- ✅ Always provide both `title` and `description` for every toast
- ✅ Use `color: 'success'` for create and update actions
- ✅ Use `color: 'error'` for delete actions
- ❌ Do **not** show a toast after an edit confirmation — the toast fires after the form is saved in `save()`

### Zod v4 Schema Rules
- ❌ `z.number({ required_error: '...' })` — `required_error` no longer exists in Zod v4
- ✅ Use `.min(1, 'message')` for strings
- ✅ Use `.email('message')` for email fields
- ✅ Use `.nullable().optional()` for optional FK/relationship fields

### Page Meta
- ✅ Always add `definePageMeta({ title: 'Resource Name', isTable: true })` on data-table pages
- `isTable: true` enables the full-height table layout mode in the default layout
- The `title` is displayed in the sidebar header via `route.meta.title`

### Header Actions (Add Button)
- ✅ Use `<Teleport to="#header-actions">` to inject page-specific buttons into the layout header
- Do **not** create an in-page header row with a title — the layout handles the page title automatically

---

## Checklist for a New Resource

- [ ] Prisma model added to `schema.prisma`
- [ ] `bunx prisma db push` run to apply schema
- [ ] `server/api/<resource>/index.ts` created (GET + POST)
- [ ] `server/api/<resource>/[id].ts` created (GET + PUT + DELETE)
- [ ] `app/stores/<resource>.ts` created with Pinia store using `$fetch`
- [ ] `app/pages/<resource>.vue` created following the standard template
- [ ] Navigation entry added in `app/layouts/default.vue`
- [ ] Zod schema defined in the page
- [ ] All toast notifications include `title` + `description`
- [ ] Edit button uses `confirmEdit()` with `color: 'warning'` before opening form
- [ ] Delete button uses `remove()` with `color: 'error'` confirmation modal
- [ ] Neither `confirm()` nor direct `openEditModal()` is called from the table actions
