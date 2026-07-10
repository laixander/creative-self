---
name: Skill: Add a Status Value to StatusBadge
description: Instructions for Skill: Add a Status Value to StatusBadge
---

# Skill: Add a Status Value to StatusBadge

## Purpose
Register a new status string in `app/components/StatusBadge.vue` so it renders with a consistent color (and optional icon) across every page that uses the component — following the centralized `colorMap` pattern.

## When to Use
- A new entity has a typed status field (e.g., `'Pending' | 'Approved' | 'Rejected'`)
- A new status value is added to an existing entity's union type
- A status value is currently rendering with the neutral fallback color (`'default'`) instead of its intended color

## How `StatusBadge` Works

```vue
<!-- Usage in a table column (h() render function): -->
h(StatusBadge, {
    status: row.original.status,         // string — must match a colorMap key
    icon: 'i-lucide-circle-check',       // optional — any Lucide icon name
})

<!-- Usage in a template: -->
<StatusBadge status="Active" icon="i-lucide-circle-check" />
<StatusBadge status="Inactive" />       <!-- icon is optional -->
```

The component resolves the badge color by looking up `status` in `colorMap`. If the key isn't found, it falls back to `'neutral'`. **The icon is always passed by the caller — there is no internal icon map.**

## Prerequisites
- The new status values are defined in a TypeScript union type in `app/types/<entity>.ts`
- `app/components/StatusBadge.vue` exists with a `colorMap` object

## Steps

### Step 1 — Open `app/components/StatusBadge.vue`

Find the `colorMap` constant. It follows this structure:

```ts
const colorMap: Record<string, BadgeColor> = {
    // <Entity> status
    'Active':   'success',
    'Inactive': 'error',
    // Fallback
    'default': 'neutral',
}
```

### Step 2 — Add the new status entries

Add entries under a labeled comment that matches the entity name. Always place new entries **before** the `// Fallback` block:

```ts
const colorMap: Record<string, BadgeColor> = {
    // User entity status
    'Active':   'success',
    'Inactive': 'error',
    // <NewEntity> status          ← add here
    'Pending':  'warning',
    'Approved': 'success',
    'Rejected': 'error',
    // Fallback
    'default': 'neutral',
}
```

**Choose the right color for the semantic meaning:**

The full Tailwind palette is available (registered in `nuxt.config.ts` → `ui.theme.colors`). Prefer semantic aliases first:

| Semantic meaning | Recommended color |
|---|---|
| Success, healthy, enabled, active | `'success'` or `'green'` / `'emerald'` / `'teal'` |
| Warning, pending, in-progress | `'warning'` or `'amber'` / `'orange'` |
| Error, failed, rejected, inactive | `'error'` or `'red'` / `'rose'` |
| Informational, neutral category | `'info'` or `'sky'` / `'cyan'` / `'blue'` |
| Primary highlight, selected, confirmed | `'primary'` |
| Archived, completed, closed, neutral | `'neutral'` |
| Distinct category color (no semantic) | Any Tailwind color: `'violet'`, `'pink'`, `'lime'`, `'indigo'`, … |

Use semantic aliases (`success`, `warning`, `error`, `info`) when the status has a clear good/bad/neutral meaning. Use a specific Tailwind color when you need to visually distinguish categories without implying a severity (e.g., department types, tag groups).

### Step 3 — Use the badge in the page

In a **table column** (using `h()` render function in a CRUD page):

```ts
import { StatusBadge } from '#components'

// In tableColumns:
{
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => h(StatusBadge, {
        status: row.original.status,
        // Optional — pass the icon that matches the status value:
        icon: row.original.status === 'Active' ? 'i-lucide-circle-check' : 'i-lucide-circle-x',
    })
},
```

In a **card view** (in the template):

```html
<div>
    <div class="text-muted">Status</div>
    <StatusBadge :status="item.status"
        :icon="item.status === 'Active' ? 'i-lucide-circle-check' : 'i-lucide-circle-x'" />
</div>
```

In a **template** when there are many possible values (use a config map instead of ternary):

```ts
const statusIconMap: Record<string, string> = {
    'Pending':  'i-lucide-clock',
    'Approved': 'i-lucide-circle-check',
    'Rejected': 'i-lucide-circle-x',
}
```
```html
<StatusBadge :status="item.status" :icon="statusIconMap[item.status]" />
```

## Conventions
- **`colorMap` is the single source of truth** — never apply color logic inline (no `v-if status === 'Active'` for colors)
- **`BadgeColor` type must stay in sync with `nuxt.config.ts` → `ui.theme.colors`** — if you add a new color there, add it to the union in `StatusBadge.vue` too
- **Prefer semantic aliases** (`success`, `warning`, `error`, `info`) over raw Tailwind colors when the status has a clear good/bad/neutral meaning
- **Use specific Tailwind colors for category distinctions** (e.g., `'violet'` for one department, `'sky'` for another) where no good/bad semantics apply
- **Keys are exact string matches** — case-sensitive. `'active'` and `'Active'` are different keys
- **Add a group comment** for each entity's statuses — keeps the map readable as it grows
- **Always place new entries before `// Fallback`** — the fallback `'default': 'neutral'` must remain last
- **Icons are always caller-supplied** — `StatusBadge` has no internal icon map. Pass `icon` as a prop from the page/component
- **Import explicitly** in `<script setup>` for `h()` render functions: `import { StatusBadge } from '#components'`
- **Auto-imported in templates** — no import needed when using `<StatusBadge />` in `<template>`
- **Don't over-add** — only add statuses that are in a real entity type. Don't pre-populate speculative values

## Output / Deliverables
- `app/components/StatusBadge.vue` — new `colorMap` entries added

## Verification
- `pnpm typecheck` passes — no new TS errors expected (colorMap uses `string` keys)
- Navigate to the page using the status — badge renders with the correct color
- If `icon` was passed, the icon appears inside the badge
- Unknown/future status values fall back to the neutral gray badge (not an error)
